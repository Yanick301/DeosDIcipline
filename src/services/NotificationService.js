export const NotificationService = {
    async requestPermission() {
        if (!('Notification' in window)) return false;
        if (Notification.permission === 'granted') return true;
        const result = await Notification.requestPermission();
        return result === 'granted';
    },

    async checkReminders(habits, completions, t) {
        const now = new Date();
        const currentTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
        const todayStr = now.toISOString().split('T')[0];
        const dayOfWeek = now.getDay();

        habits.forEach(habit => {
            if (habit.reminderTime === currentTime && Array.isArray(habit.days) && habit.days.includes(dayOfWeek)) {
                const isDone = completions[habit.id]?.[todayStr] === 'done';
                if (!isDone) {
                    this.sendNotification(
                        t('notif_title') || 'DeOs Discipline 🔱',
                        t('notif_body', habit.name)
                    );
                }
            }
        });
    },

    sendNotification(title, body) {
        if (Notification.permission === 'granted') {
            new Notification(title, {
                body: body,
                icon: '/vite.svg',
                badge: '/vite.svg',
                tag: 'deos-reminder'
            });
        }
    },

    sendTest(t) {
        this.sendNotification('DeOs Discipline 🔱', t('notif_body', 'Focus session'));
    }
};
