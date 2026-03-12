// ========================================
// stats.js — Statistics and analytics
// ========================================

const StatsManager = {
    // Get completion data for the past N days
    getLastNDays(n = 7) {
        const days = [];
        for (let i = n - 1; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            d.setHours(0, 0, 0, 0);
            const dateStr = HabitManager.getDateStr(d);
            const dayOfWeek = d.getDay();

            // Get habits scheduled for that day
            const scheduledHabits = DB.getHabits().filter(h => h.active && h.days.includes(dayOfWeek));
            const total = scheduledHabits.length;
            const done = scheduledHabits.filter(h => {
                const comp = DB.getCompletionForDate(h.id, dateStr);
                return comp === 'done';
            }).length;
            const skipped = scheduledHabits.filter(h => {
                const comp = DB.getCompletionForDate(h.id, dateStr);
                return comp === 'skipped';
            }).length;

            days.push({
                date: d,
                dateStr,
                label: d.toLocaleDateString('en-US', { weekday: 'short' }),
                dayLabel: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                total,
                done,
                skipped,
                rate: total > 0 ? Math.round((done / total) * 100) : 0,
                isPerfect: total > 0 && done === total
            });
        }
        return days;
    },

    getWeeklyStats() {
        return this.getLastNDays(7);
    },

    getMonthlyStats() {
        return this.getLastNDays(30);
    },

    // Overall completion rate
    getOverallCompletionRate() {
        const completions = DB.getCompletions();
        let total = 0, done = 0;
        Object.values(completions).forEach(habitCompletions => {
            Object.values(habitCompletions).forEach(status => {
                total++;
                if (status === 'done') done++;
            });
        });
        return total > 0 ? Math.round((done / total) * 100) : 0;
    },

    // Discipline Score (0-100) — weighted metric
    getDisciplineScore() {
        const habits = DB.getHabits().filter(h => h.active);
        if (habits.length === 0) return 0;

        let totalWeighted = 0, maxWeighted = 0;

        habits.forEach(habit => {
            const priorityWeight = PRIORITY_LEVELS[habit.priority]?.value || 1;
            const streak = StreakManager.getStreak(habit.id);
            const weekDays = this.getLastNDays(7);

            weekDays.forEach(day => {
                const scheduled = habit.days.includes(day.date.getDay());
                if (!scheduled) return;

                const comp = DB.getCompletionForDate(habit.id, day.dateStr);
                const weight = priorityWeight;
                maxWeighted += weight;
                if (comp === 'done') totalWeighted += weight;
                else if (comp === 'skipped') totalWeighted += weight * 0.2; // partial credit
            });

            // Streak bonus (max +10% per habit)
            const streakBonus = Math.min(streak.current * 0.5, 10);
            totalWeighted += streakBonus;
            maxWeighted += 10;
        });

        return maxWeighted > 0 ? Math.min(100, Math.round((totalWeighted / maxWeighted) * 100)) : 0;
    },

    // Habit-specific stats
    getHabitStats(habitId) {
        const habit = DB.getHabitById(habitId);
        if (!habit) return null;

        const completions = DB.getCompletionsForHabit(habitId);
        const allDates = Object.keys(completions);

        const done = allDates.filter(d => completions[d] === 'done').length;
        const skipped = allDates.filter(d => completions[d] === 'skipped').length;
        const postponed = allDates.filter(d => completions[d] === 'postponed').length;
        const total = allDates.length;

        const streak = StreakManager.getStreak(habitId);
        const completionRate = total > 0 ? Math.round((done / total) * 100) : 0;

        // Days since created
        const daysSinceCreated = Math.floor((Date.now() - habit.createdAt) / 86400000) + 1;

        return {
            habit,
            done,
            skipped,
            postponed,
            total,
            completionRate,
            streak: streak.current,
            bestStreak: streak.best,
            daysSinceCreated,
            last7Days: this.getLastNDays(7).map(day => ({
                ...day,
                status: DB.getCompletionForDate(habitId, day.dateStr)
            }))
        };
    },

    // Summary stats for dashboard
    getDashboardStats() {
        const habits = HabitManager.getTodayHabits();
        const total = habits.length;
        const done = habits.filter(h => HabitManager.getTodayStatus(h.id) === 'done').length;
        const progress = total > 0 ? Math.round((done / total) * 100) : 0;

        const globalBestStreak = StreakManager.getGlobalBestStreak();
        const activeStreaks = StreakManager.getActiveStreaksCount();
        const disciplineScore = this.getDisciplineScore();
        const completionRate = this.getOverallCompletionRate();
        const badgeStats = BadgeManager.getStats();
        const totalCompletions = BadgeManager.getTotalCompletions();

        return {
            today: { total, done, progress },
            globalBestStreak,
            activeStreaks,
            disciplineScore,
            completionRate,
            badges: badgeStats,
            totalCompletions
        };
    }
};

window.StatsManager = StatsManager;
