// ========================================
// streaks.js — Streak calculation logic
// ========================================

const StreakManager = {
    // Get streak info for a habit
    getStreak(habitId) {
        const habit = DB.getHabitById(habitId);
        if (!habit) return { current: 0, best: 0, lastDate: null };

        const completions = DB.getCompletionsForHabit(habitId);
        const dates = Object.keys(completions)
            .filter(date => completions[date] === 'done')
            .sort();

        if (dates.length === 0) return { current: 0, best: 0, lastDate: null };

        let current = 0;
        let best = 0;
        let streak = 0;
        let prevDate = null;

        for (let i = 0; i < dates.length; i++) {
            const d = new Date(dates[i] + 'T00:00:00');
            if (!prevDate) {
                streak = 1;
            } else {
                const diff = (d - prevDate) / 86400000;
                if (diff === 1) {
                    streak++;
                } else {
                    streak = 1;
                }
            }
            if (streak > best) best = streak;
            prevDate = d;
        }

        // Check if streak is still active (last done was today or yesterday)
        const lastDateStr = dates[dates.length - 1];
        const lastDate = new Date(lastDateStr + 'T00:00:00');
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const diffFromToday = (today - lastDate) / 86400000;

        current = diffFromToday <= 1 ? streak : 0;

        return { current, best, lastDate: lastDateStr };
    },

    updateStreak(habitId) {
        return this.getStreak(habitId);
    },

    // Get overall best streak across all habits
    getGlobalBestStreak() {
        const habits = DB.getHabits();
        let global = 0;
        habits.forEach(h => {
            const { best } = this.getStreak(h.id);
            if (best > global) global = best;
        });
        return global;
    },

    // Get total active streaks count
    getActiveStreaksCount() {
        const habits = DB.getHabits();
        return habits.filter(h => this.getStreak(h.id).current > 0).length;
    },

    // Get all habits with streak info
    getHabitsWithStreaks() {
        return DB.getHabits().map(h => ({
            ...h,
            streak: this.getStreak(h.id)
        }));
    },

    // Format streak for display
    formatStreak(count) {
        if (count === 0) return 'No streak yet';
        if (count === 1) return '1 day streak 🔥';
        if (count < 7) return `${count} day streak 🔥`;
        if (count < 30) return `${count} day streak 🔥🔥`;
        return `${count} day streak 🔥🔥🔥`;
    },

    // Streak milestone celebrations
    isMilestone(count) {
        return [3, 7, 14, 21, 30, 60, 90, 100, 365].includes(count);
    },

    getMilestoneMessage(count) {
        const messages = {
            3: "3-Day Streak! You're building momentum! 💪",
            7: "One whole week! You're a warrior! ⚔️",
            14: "Two weeks strong! Discipline is forming! 🎯",
            21: "21 days! New habit formed! 🧠",
            30: "30 DAYS! Discipline Master! 👑",
            60: "60 Days! You're unstoppable! 🚀",
            90: "90 Days! Elite level achieved! 🏆",
            100: "100 DAYS! Legendary status! 🌟",
            365: "ONE FULL YEAR! You're a legend! 🔱"
        };
        return messages[count] || null;
    }
};

window.StreakManager = StreakManager;
