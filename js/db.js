// ========================================
// db.js — LocalStorage abstraction layer
// ========================================

const DB = {
    KEYS: {
        HABITS: 'deos_habits',
        COMPLETIONS: 'deos_completions',
        SETTINGS: 'deos_settings',
        BADGES: 'deos_badges',
        STATS: 'deos_stats'
    },

    // Generic get/set
    get(key, fallback = null) {
        try {
            const val = localStorage.getItem(key);
            return val !== null ? JSON.parse(val) : fallback;
        } catch (e) {
            console.error('[DB] Get error:', e);
            return fallback;
        }
    },

    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('[DB] Set error:', e);
            return false;
        }
    },

    // Habits
    getHabits() {
        return this.get(this.KEYS.HABITS, []);
    },

    saveHabits(habits) {
        return this.set(this.KEYS.HABITS, habits);
    },

    getHabitById(id) {
        return this.getHabits().find(h => h.id === id) || null;
    },

    addHabit(habit) {
        const habits = this.getHabits();
        habits.push(habit);
        return this.saveHabits(habits);
    },

    updateHabit(id, updates) {
        const habits = this.getHabits();
        const idx = habits.findIndex(h => h.id === id);
        if (idx === -1) return false;
        habits[idx] = { ...habits[idx], ...updates, updatedAt: Date.now() };
        return this.saveHabits(habits);
    },

    deleteHabit(id) {
        const habits = this.getHabits().filter(h => h.id !== id);
        this.saveHabits(habits);
        // Also clean completions
        const completions = this.getCompletions();
        delete completions[id];
        this.set(this.KEYS.COMPLETIONS, completions);
        return true;
    },

    // Completions structure: { habitId: { 'YYYY-MM-DD': 'done'|'skipped'|'postponed' } }
    getCompletions() {
        return this.get(this.KEYS.COMPLETIONS, {});
    },

    getCompletionForDate(habitId, dateStr) {
        const completions = this.getCompletions();
        return completions[habitId]?.[dateStr] || null;
    },

    setCompletion(habitId, dateStr, status) {
        const completions = this.getCompletions();
        if (!completions[habitId]) completions[habitId] = {};
        completions[habitId][dateStr] = status;
        return this.set(this.KEYS.COMPLETIONS, completions);
    },

    getCompletionsForHabit(habitId) {
        const completions = this.getCompletions();
        return completions[habitId] || {};
    },

    // Settings
    getSettings() {
        return this.get(this.KEYS.SETTINGS, {
            notificationsEnabled: false,
            theme: 'dark',
            motivationalQuotes: true,
            soundEnabled: false,
            quoteIndex: 0
        });
    },

    saveSettings(settings) {
        return this.set(this.KEYS.SETTINGS, settings);
    },

    updateSetting(key, value) {
        const settings = this.getSettings();
        settings[key] = value;
        return this.saveSettings(settings);
    },

    // Badges
    getUnlockedBadges() {
        return this.get(this.KEYS.BADGES, []);
    },

    unlockBadge(badgeId) {
        const badges = this.getUnlockedBadges();
        if (!badges.includes(badgeId)) {
            badges.push(badgeId);
            this.set(this.KEYS.BADGES, badges);
            return true; // newly unlocked
        }
        return false;
    },

    // Utility
    clearAll() {
        Object.values(this.KEYS).forEach(key => localStorage.removeItem(key));
    },

    exportData() {
        const data = {};
        Object.entries(this.KEYS).forEach(([name, key]) => {
            data[name] = this.get(key);
        });
        return JSON.stringify(data, null, 2);
    },

    importData(jsonStr) {
        try {
            const data = JSON.parse(jsonStr);
            Object.entries(this.KEYS).forEach(([name, key]) => {
                if (data[name] !== undefined) this.set(key, data[name]);
            });
            return true;
        } catch (e) {
            return false;
        }
    }
};

window.DB = DB;
