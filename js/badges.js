// ========================================
// badges.js — Achievement badge system
// ========================================

const BADGE_DEFINITIONS = [
    // Streak Badges
    { id: 'streak_3', name: 'On Fire!', emoji: '🔥', description: '3-day streak on any habit', category: 'streak', rarity: 'common' },
    { id: 'streak_7', name: '7-Day Warrior', emoji: '⚔️', description: 'Complete a habit 7 days in a row', category: 'streak', rarity: 'uncommon' },
    { id: 'streak_14', name: 'Two-Week Champion', emoji: '🏅', description: '14-day streak achieved', category: 'streak', rarity: 'uncommon' },
    { id: 'streak_21', name: 'Habit Formed', emoji: '🧠', description: '21 consecutive days — science says it\'s a habit!', category: 'streak', rarity: 'rare' },
    { id: 'streak_30', name: 'Discipline Master', emoji: '👑', description: '30-day discipline streak!', category: 'streak', rarity: 'epic' },
    { id: 'streak_60', name: 'Iron Will', emoji: '🛡️', description: '60 days of pure discipline', category: 'streak', rarity: 'epic' },
    { id: 'streak_90', name: 'Elite Performer', emoji: '🏆', description: '90-day streak — you are elite!', category: 'streak', rarity: 'legendary' },
    { id: 'streak_365', name: 'Legend', emoji: '🔱', description: '365 days — a full year of discipline!', category: 'streak', rarity: 'legendary' },

    // Completion Badges
    { id: 'first_habit', name: 'First Step', emoji: '👣', description: 'Complete your first habit', category: 'completion', rarity: 'common' },
    { id: 'complete_10', name: 'Getting Going', emoji: '🚀', description: 'Complete 10 habit check-ins total', category: 'completion', rarity: 'common' },
    { id: 'complete_50', name: 'Momentum', emoji: '💨', description: 'Complete 50 habit check-ins total', category: 'completion', rarity: 'uncommon' },
    { id: 'complete_100', name: 'Centurion', emoji: '💯', description: 'Complete 100 habit check-ins!', category: 'completion', rarity: 'rare' },
    { id: 'complete_500', name: 'Unstoppable', emoji: '⚡', description: '500 habit completions!', category: 'completion', rarity: 'epic' },

    // Perfect Day Badges
    { id: 'perfect_day', name: 'Perfect Day', emoji: '✨', description: 'Complete ALL habits in a single day', category: 'perfect', rarity: 'uncommon' },
    { id: 'perfect_week', name: 'Perfect Week', emoji: '🌟', description: '7 consecutive perfect days', category: 'perfect', rarity: 'legendary' },

    // Habit Collection Badges
    { id: 'habits_3', name: 'Committed', emoji: '📋', description: 'Create 3 habits', category: 'collection', rarity: 'common' },
    { id: 'habits_5', name: 'Dedicated', emoji: '📊', description: 'Create 5 habits', category: 'collection', rarity: 'uncommon' },
    { id: 'habits_10', name: 'Master Builder', emoji: '🏗️', description: 'Create 10 habits', category: 'collection', rarity: 'rare' },

    // Special Badges
    { id: 'early_bird', name: 'Early Bird', emoji: '🌅', description: 'Complete a habit before 7am', category: 'special', rarity: 'uncommon' },
    { id: 'night_owl', name: 'Night Owl', emoji: '🦉', description: 'Complete a habit after 10pm', category: 'special', rarity: 'uncommon' },
    { id: 'weekend_warrior', name: 'Weekend Warrior', emoji: '🏖️', description: 'Complete habits on Sat & Sun', category: 'special', rarity: 'uncommon' }
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
