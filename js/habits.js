// ========================================
// habits.js — Habit model and CRUD logic
// ========================================

const HABIT_ICONS = [
    { id: 'fitness', path: 'M6.5 14.5v-3.5a2 2 0 012-2h7a2 2 0 012 2v3.5m-11 0h11m-11 0v3.5m11-3.5v3.5m-7-9a2.5 2.5 0 115 0 2.5 2.5 0 01-5 0z' },
    { id: 'meditation', path: 'M12 3c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm0 18c-4.4 0-8-3.6-8-8 0-1.8.6-3.5 1.7-4.8L12 15l6.3-6.8c1.1 1.3 1.7 3 1.7 4.8 0 4.4-3.6 8-8 8z' },
    { id: 'reading', path: 'M4 19.5A2.5 2.5 0 016.5 17H20M4 19.5A2.5 2.5 0 006.5 22H20M4 19.5a2.5 2.5 0 012.5-2.5h11a2 2 0 00-2-2H6.5A2.5 2.5 0 004 17.5v2z' },
    { id: 'water', path: 'M12 2.69l5.66 5.66a8 8 0 11-11.31 0z' },
    { id: 'brain', path: 'M9.5 2A2.5 2.5 0 0112 4.5v15a2.5 2.5 0 01-5 0v-15A2.5 2.5 0 019.5 2zM14.5 2A2.5 2.5 0 0117 4.5v15a2.5 2.5 0 01-5 0v-15a2.5 2.5 0 012.5-2.5z' },
    { id: 'art', path: 'M12 21a9 9 0 110-18 9 9 0 010 18zM12 7v10M7 12h10' },
    { id: 'finance', path: 'M12 1v22m5-18H8a3 3 0 000 6h8a3 3 0 010 6H7' },
    { id: 'focus', path: 'M12 8a4 4 0 100 8 4 4 0 000-8zm0 12a8 8 0 110-16 8 8 0 010 16z' }
];

const PRIORITY_LEVELS = {
    HIGH: { value: 3 },
    MEDIUM: { value: 2 },
    LOW: { value: 1 }
};

const HabitManager = {
    generateId() {
        return 'habit_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    },

    createHabit({ name, description = '', icon = 'fitness', reminderTime = '', days = [0, 1, 2, 3, 4, 5, 6], priority = 'MEDIUM', color = '#FF385C' }) {
        const habit = {
            id: this.generateId(),
            name: name.trim(),
            description: description.trim(),
            icon,
            reminderTime,
            days,
            priority,
            color,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            active: true
        };
        DB.addHabit(habit);
        if (reminderTime && DB.getSettings().notificationsEnabled) {
            NotificationManager.scheduleHabitReminder(habit);
        }
        return habit;
    },

    updateHabit(id, updates) {
        DB.updateHabit(id, updates);
        const habit = DB.getHabitById(id);
        if (habit && habit.reminderTime && DB.getSettings().notificationsEnabled) {
            NotificationManager.scheduleHabitReminder(habit);
        }
        return habit;
    },

    deleteHabit(id) { return DB.deleteHabit(id); },

    getAllHabits() { return DB.getHabits().filter(h => h.active); },

    getTodayHabits() {
        const today = new Date().getDay();
        return this.getAllHabits().filter(h => h.days.includes(today));
    },

    getTodayStatus(habitId) {
        const today = this.getTodayDateStr();
        return DB.getCompletionForDate(habitId, today);
    },

    setCompletion(habitId, status) {
        const today = this.getTodayDateStr();
        DB.setCompletion(habitId, today, status);
        StreakManager.updateStreak(habitId);
        BadgeManager.checkAndUnlockBadges(habitId);
        return true;
    },

    getTodayCompleted() { return this.getTodayHabits().filter(h => this.getTodayStatus(h.id) === 'done'); },
    getTodayPending() { return this.getTodayHabits().filter(h => !this.getTodayStatus(h.id)); },

    getTodayDateStr() {
        const d = new Date();
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    },

    getDateStr(date) {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    },

    getTodayProgress() {
        const today = this.getTodayHabits();
        if (today.length === 0) return 0;
        const done = today.filter(h => this.getTodayStatus(h.id) === 'done').length;
        return Math.round((done / today.length) * 100);
    },

    seedExampleHabits() {
        const isFr = i18n.lang === 'fr';
        const examples = [
            { name: isFr ? 'Entraînement' : 'Workout', description: '30 min', icon: 'fitness', reminderTime: '07:30', days: [1, 2, 3, 4, 5], priority: 'HIGH', color: '#FF385C' },
            { name: isFr ? 'Lecture' : 'Reading', description: '20 pages', icon: 'reading', reminderTime: '21:00', days: [0, 1, 2, 3, 4, 5, 6], priority: 'MEDIUM', color: '#0A84FF' },
            { name: isFr ? 'Hydratation' : 'Hydration', description: '2L water', icon: 'water', reminderTime: '09:00', days: [0, 1, 2, 3, 4, 5, 6], priority: 'HIGH', color: '#32ADE6' }
        ];
        examples.forEach(e => this.createHabit(e));
    },

    getIcons() { return HABIT_ICONS; },
    getPriorityLevels() { return PRIORITY_LEVELS; }
};

window.HabitManager = HabitManager;
window.HABIT_ICONS = HABIT_ICONS;
window.PRIORITY_LEVELS = PRIORITY_LEVELS;
