// ========================================
// notifications.js — Notification system
// ========================================

const NotificationManager = {
    scheduledTimers: {}, // { habitId: timerId }

    async requestPermission() {
        if (!('Notification' in window)) {
            console.warn('[Notifications] Not supported');
            return false;
        }
        if (Notification.permission === 'granted') return true;
        if (Notification.permission === 'denied') return false;

        const result = await Notification.requestPermission();
        return result === 'granted';
    },

    getPermissionStatus() {
        if (!('Notification' in window)) return 'unsupported';
        return Notification.permission;
    },

    async scheduleHabitReminder(habit) {
        if (!habit.reminderTime) return;

        const granted = await this.requestPermission();
        if (!granted) return;

        // Cancel existing timer for this habit
        this.cancelReminder(habit.id);

        const [hours, minutes] = habit.reminderTime.split(':').map(Number);
        const now = new Date();
        const today = now.getDay();

        // Find the next scheduled day
        let nextMs = null;
        for (let offset = 0; offset <= 7; offset++) {
            const targetDay = (today + offset) % 7;
            if (habit.days.includes(targetDay)) {
                const target = new Date(now);
                target.setDate(target.getDate() + offset);
                target.setHours(hours, minutes, 0, 0);
                if (target > now) {
                    nextMs = target - now;
                    break;
                }
            }
        }

        if (nextMs === null || nextMs <= 0) return;

        const timerId = setTimeout(() => {
            this.showNotification({
                title: 'DeOs Discipline 🔥',
                body: `Time to complete "${habit.name}"! Stay disciplined!`,
                tag: habit.id,
                icon: '/icons/icon-192.png'
            });
            // Re-schedule for tomorrow
            this.scheduleHabitReminder(habit);
        }, nextMs);

        this.scheduledTimers[habit.id] = timerId;
        console.log(`[Notifications] Scheduled "${habit.name}" reminder in ${Math.round(nextMs / 60000)} minutes`);
    },

    cancelReminder(habitId) {
        if (this.scheduledTimers[habitId]) {
            clearTimeout(this.scheduledTimers[habitId]);
            delete this.scheduledTimers[habitId];
        }
    },

    cancelAllReminders() {
        Object.keys(this.scheduledTimers).forEach(id => this.cancelReminder(id));
    },

    showNotification(options) {
        if (Notification.permission !== 'granted') return;

        const { title = 'DeOs Discipline', body, tag, icon = '/icons/icon-192.png' } = options;

        // Try using service worker notification first
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
            navigator.serviceWorker.ready.then(registration => {
                registration.showNotification(title, {
                    body,
                    icon,
                    badge: '/icons/icon-96.png',
                    tag,
                    vibrate: [200, 100, 200],
                    actions: [
                        { action: 'done', title: '✅ Done' },
                        { action: 'snooze', title: '⏰ Snooze' }
                    ]
                });
            });
        } else {
            new Notification(title, { body, icon, tag });
        }
    },

    // Schedule a motivational quote notification at a set time
    scheduleDailyMotivation(timeStr = '08:00') {
        const [hours, minutes] = timeStr.split(':').map(Number);
        const now = new Date();
        const target = new Date(now);
        target.setHours(hours, minutes, 0, 0);
        if (target <= now) target.setDate(target.getDate() + 1);

        const ms = target - now;
        setTimeout(() => {
            const quote = QuoteManager.getTodayQuote();
            this.showNotification({
                title: 'DeOs Discipline - Daily Quote',
                body: `"${quote.text}" — ${quote.author}`,
                tag: 'daily-quote'
            });
            this.scheduleDailyMotivation(timeStr); // Re-schedule
        }, ms);
    },

    // Reschedule all habits on app startup
    rescheduleAll() {
        const habits = DB.getHabits();
        const settings = DB.getSettings();
        if (!settings.notificationsEnabled) return;
        habits.filter(h => h.active && h.reminderTime).forEach(h => {
            this.scheduleHabitReminder(h);
        });
    },

    // Send daily summary notification
    sendDailySummary() {
        const progress = HabitManager.getTodayProgress();
        const completed = HabitManager.getTodayCompleted().length;
        const total = HabitManager.getTodayHabits().length;

        this.showNotification({
            title: 'DeOs Discipline - Daily Summary',
            body: `Today: ${completed}/${total} habits complete (${progress}%) — Keep it up! 💪`,
            tag: 'daily-summary'
        });
    }
};

window.NotificationManager = NotificationManager;
