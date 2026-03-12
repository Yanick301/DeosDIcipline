// ========================================
// badges.js — Achievement badge system
// ========================================

const BADGE_DEFINITIONS = [
    { id: 'streak_3', nameKey: 'streak_3_name', emoji: '🔥', descKey: 'streak_3_desc', category: 'streak', rarity: 'common' },
    { id: 'streak_7', nameKey: 'streak_7_name', emoji: '⚔️', descKey: 'streak_7_desc', category: 'streak', rarity: 'uncommon' },
    { id: 'streak_30', nameKey: 'streak_30_name', emoji: '👑', descKey: 'streak_30_desc', category: 'streak', rarity: 'epic' },
    { id: 'perfect_day', nameKey: 'perfect_day_name', emoji: '✨', descKey: 'perfect_day_desc', category: 'perfect', rarity: 'uncommon' },
    { id: 'centurion', nameKey: 'centurion_name', emoji: '💯', descKey: 'centurion_desc', category: 'streak', rarity: 'legendary' }
];

const RARITY_COLORS = {
    common: '#6B7280',
    uncommon: '#22C55E',
    rare: '#4A9EFF',
    epic: '#A855F7',
    legendary: '#FFD700'
};

const BadgeManager = {
    getAllBadges() {
        return BADGE_DEFINITIONS;
    },

    getUnlockedBadges() {
        const unlockedIds = DB.getUnlockedBadges();
        return BADGE_DEFINITIONS.filter(b => unlockedIds.includes(b.id));
    },

    getLockedBadges() {
        const unlockedIds = DB.getUnlockedBadges();
        return BADGE_DEFINITIONS.filter(b => !unlockedIds.includes(b.id));
    },

    isBadgeUnlocked(badgeId) {
        return DB.getUnlockedBadges().includes(badgeId);
    },

    unlock(badgeId) {
        const isNew = DB.unlockBadge(badgeId);
        if (isNew) {
            const badge = BADGE_DEFINITIONS.find(b => b.id === badgeId);
            if (badge) this.celebrateBadge(badge);
        }
        return isNew;
    },

    celebrateBadge(badge) {
        // Show a celebration toast/modal
        if (window.App && window.App.showBadgeToast) {
            window.App.showBadgeToast(badge);
        }
    },

    // Check and unlock relevant badges based on current state
    checkAndUnlockBadges(habitId = null) {
        const habits = DB.getHabits();
        const completions = DB.getCompletions();
        const today = HabitManager.getTodayDateStr();
        const now = new Date();

        // First completion
        const totalCompletions = this.getTotalCompletions();
        if (totalCompletions >= 1) this.unlock('first_habit');
        if (totalCompletions >= 10) this.unlock('complete_10');
        if (totalCompletions >= 50) this.unlock('complete_50');
        if (totalCompletions >= 100) this.unlock('complete_100');
        if (totalCompletions >= 500) this.unlock('complete_500');

        // Habit count
        if (habits.length >= 3) this.unlock('habits_3');
        if (habits.length >= 5) this.unlock('habits_5');
        if (habits.length >= 10) this.unlock('habits_10');

        // Streak badges
        if (habitId) {
            const streak = StreakManager.getStreak(habitId);
            if (streak.current >= 3) this.unlock('streak_3');
            if (streak.current >= 7) this.unlock('streak_7');
            if (streak.current >= 14) this.unlock('streak_14');
            if (streak.current >= 21) this.unlock('streak_21');
            if (streak.current >= 30) this.unlock('streak_30');
            if (streak.current >= 60) this.unlock('streak_60');
            if (streak.current >= 90) this.unlock('streak_90');
            if (streak.current >= 365) this.unlock('streak_365');
        }

        // Perfect day
        const todayHabits = HabitManager.getTodayHabits();
        if (todayHabits.length > 0) {
            const allDone = todayHabits.every(h => HabitManager.getTodayStatus(h.id) === 'done');
            if (allDone) this.unlock('perfect_day');
        }

        // Time-based
        const hour = now.getHours();
        if (hour < 7) this.unlock('early_bird');
        if (hour >= 22) this.unlock('night_owl');

        // Weekend warrior
        const dayOfWeek = now.getDay();
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            const todayStr = today;
            const todayDone = habits.some(h => {
                const comp = completions[h.id];
                return comp && comp[todayStr] === 'done';
            });
            if (todayDone) this.unlock('weekend_warrior');
        }
    },

    getTotalCompletions() {
        const completions = DB.getCompletions();
        let total = 0;
        Object.values(completions).forEach(habitCompletions => {
            Object.values(habitCompletions).forEach(status => {
                if (status === 'done') total++;
            });
        });
        return total;
    },

    getRarityColor(rarity) {
        return RARITY_COLORS[rarity] || RARITY_COLORS.common;
    },

    getStats() {
        const totalBadges = BADGE_DEFINITIONS.length;
        const unlockedCount = DB.getUnlockedBadges().length;
        return {
            total: totalBadges,
            unlocked: unlockedCount,
            percentage: Math.round((unlockedCount / totalBadges) * 100)
        };
    }
};

window.BadgeManager = BadgeManager;
window.BADGE_DEFINITIONS = BADGE_DEFINITIONS;
window.RARITY_COLORS = RARITY_COLORS;
