import { SoundService } from './SoundService';

export const NotificationService = {
    sentToday: new Set(),

    async requestPermission() {
        if (!('Notification' in window)) return false;
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
                const notifKey = `${habit.id}-${todayStr}-${currentTime}`;
                if (this.sentToday.has(notifKey)) return;

                const isDone = completions[habit.id]?.[todayStr] === 'done';
                if (!isDone) {
                    this.sentToday.add(notifKey);
                    this.triggerAlarm(habit, t);
                }
            }
        });
    },

    triggerAlarm(habit, t) {
        SoundService.play('alarm');
        this.sendNotification(
            `🔱 ${habit.name}`,
            t('notif_body', habit.name) || `Time for your discipline: ${habit.name}`
        );
    },

    sendNotification(title, body) {
        if (Notification.permission === 'granted') {
            const notif = new Notification(title, {
                body: body,
                icon: '/vite.svg',
                tag: 'deos-reminder',
                requireInteraction: true
            });

            notif.onclick = () => {
                window.focus();
                SoundService.stopAlarm();
                notif.close();
            };
        }
    },

    stopAlarm() {
        SoundService.stopAlarm();
    }
};
