const KEYS = {
    HABITS: 'deos_habits',
    COMPLETIONS: 'deos_completions',
    SETTINGS: 'deos_settings',
    BADGES: 'deos_badges',
    ONBOARD_DONE: 'deos_onboard_done',
    USER_ID: 'deos_user_id',
    XP: 'deos_xp',
    LEVEL: 'deos_level',
    JOURNAL: 'deos_journal'
};

export const DB = {
    get(key, fallback = null) {
        try {
            const val = localStorage.getItem(key);
            return val !== null ? JSON.parse(val) : fallback;
        } catch (e) {
            return fallback;
        }
    },

    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            return false;
        }
    },

    ensureUserId() {
        let id = this.get(KEYS.USER_ID);
        if (!id) {
            id = `Warrior-${Math.floor(Math.random() * 9000) + 1000}`;
            this.set(KEYS.USER_ID, id);
        }
        return id;
    },

    getHabits: () => DB.get(KEYS.HABITS, []),
    saveHabits: (habits) => DB.set(KEYS.HABITS, habits),

    getCompletions: () => DB.get(KEYS.COMPLETIONS, {}),
    saveCompletions: (comps) => DB.set(KEYS.COMPLETIONS, comps),

    getSettings: () => DB.get(KEYS.SETTINGS, {
        notificationsEnabled: false,
        theme: 'dark',
        lang: 'en'
    }),
    saveSettings: (settings) => DB.set(KEYS.SETTINGS, settings),

    getUnlockedBadges: () => DB.get(KEYS.BADGES, []),
    saveUnlockedBadges: (badges) => DB.set(KEYS.BADGES, badges),

    getOnboardDone: () => localStorage.getItem(KEYS.ONBOARD_DONE) === 'true',
    setOnboardDone: (val) => localStorage.setItem(KEYS.ONBOARD_DONE, val),

    clearAll() {
        Object.values(KEYS).forEach(k => localStorage.removeItem(k));
    }
};
