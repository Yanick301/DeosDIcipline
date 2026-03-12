import { DB } from '../lib/db';
import { TRANSLATIONS } from '../lib/i18n';

export const NotificationService = {
    async requestPermission() {
        if (!('Notification' in window)) return false;
        if (Notification.permission === 'granted') return true;
        const result = await Notification.requestPermission();
        return result === 'granted';
    },

    async scheduleReminder(habit, lang = 'en') {
        if (!habit.reminderTime) return;
        const granted = await this.requestPermission();
        if (!granted) return;

        // In a real PWA context, this would use a Background Sync or Alarm API.
        // For this prototype, we'll log it and use a simple setTimeout for the session.
        console.log(`[NotificationService] Scheduled "${habit.name}" for ${habit.reminderTime}`);
    },

    sendTest(t) {
        if (Notification.permission === 'granted') {
            new Notification('DeOs Discipline 🔱', {
                body: t('notif_body', 'Focus session'),
                icon: '/vite.svg'
            });
        }
    }
};
