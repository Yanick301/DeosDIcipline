// ========================================
// habits.js — Habit model and CRUD logic
// ========================================

const HABIT_ICONS = [
    '🏃', '💪', '🧘', '📚', '💧', '🥗', '😴', '🧠', '✍️', '🎯',
    '🎨', '🎵', '🌿', '☀️', '🔥', '⚡', '🚴', '🏊', '🧗', '🤸',
    '📖', '💼', '🌅', '🙏', '💊', '🥤', '🍎', '🌙', '🏋️', '🎓'
];

const PRIORITY_LEVELS = {
    HIGH: { label: 'High', color: '#FFD700', value: 3 },
    MEDIUM: { label: 'Medium', color: '#4A9EFF', value: 2 },
    LOW: { label: 'Low', color: '#6B7280', value: 1 }
};

const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const HabitManager = {
    generateId() {
        return 'habit_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    },

    createHabit({ name, description = '', icon = '🎯', reminderTime = '', days = [0, 1, 2, 3, 4, 5, 6], priority = 'MEDIUM', color = '#4A9EFF' }) {
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
        // Schedule notification if reminder set
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

    deleteHabit(id) {
        return DB.deleteHabit(id);
    },

    getAllHabits() {
        return DB.getHabits().filter(h => h.active);
    },

    getTodayHabits() {
        const today = new Date().getDay(); // 0=Sun, 6=Sat
        return this.getAllHabits().filter(h => h.days.includes(today));
    },

    // Completion
    getTodayStatus(habitId) {
        const today = this.getTodayDateStr();
        return DB.getCompletionForDate(habitId, today);
    },

    setCompletion(habitId, status) {
        const today = this.getTodayDateStr();
        DB.setCompletion(habitId, today, status);
        // Recalculate streak
        StreakManager.updateStreak(habitId);
        // Check badges
        BadgeManager.checkAndUnlockBadges(habitId);
        return true;
    },

    // Filters
    getTodayCompleted() {
        return this.getTodayHabits().filter(h => this.getTodayStatus(h.id) === 'done');
    },

    getTodayPending() {
        return this.getTodayHabits().filter(h => !this.getTodayStatus(h.id));
    },

    // Date helpers
    getTodayDateStr() {
        const d = new Date();
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    },

    getDateStr(date) {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    },

    // Progress for today
    getTodayProgress() {
        const today = this.getTodayHabits();
        if (today.length === 0) return 0;
        const done = today.filter(h => this.getTodayStatus(h.id) === 'done').length;
        return Math.round((done / today.length) * 100);
    },

    // Seed example habits for first-time users
    seedExampleHabits() {
        const examples = [
            { name: 'Morning Workout', description: 'Exercise for 30 minutes each morning', icon: '🏋️', reminderTime: '07:00', days: [1, 2, 3, 4, 5], priority: 'HIGH', color: '#FFD700' },
            { name: 'Read for 20 mins', description: 'Read a book or article to grow your mind', icon: '📚', reminderTime: '21:00', days: [0, 1, 2, 3, 4, 5, 6], priority: 'MEDIUM', color: '#4A9EFF' },
            { name: 'Drink 2L Water', description: 'Stay hydrated throughout the day', icon: '💧', reminderTime: '09:00', days: [0, 1, 2, 3, 4, 5, 6], priority: 'HIGH', color: '#22D3EE' },
            { name: 'Meditate 10 mins', description: 'Clear your mind and focus inward', icon: '🧘', reminderTime: '06:30', days: [0, 1, 2, 3, 4, 5, 6], priority: 'MEDIUM', color: '#A78BFA' },
            { name: 'No Social Media', description: 'Avoid social media before noon', icon: '📵', reminderTime: '', days: [1, 2, 3, 4, 5], priority: 'HIGH', color: '#F87171' }
        ];
        examples.forEach(e => this.createHabit(e));
    },

    getIcons() {
        return HABIT_ICONS;
    },

    getPriorityLevels() {
        return PRIORITY_LEVELS;
    },

    getWeekDays() {
        return WEEK_DAYS;
    }
};

window.HabitManager = HabitManager;
window.HABIT_ICONS = HABIT_ICONS;
window.PRIORITY_LEVELS = PRIORITY_LEVELS;
window.WEEK_DAYS = WEEK_DAYS;
