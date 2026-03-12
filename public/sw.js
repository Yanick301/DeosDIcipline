// DeOs Discipline - Service Worker for Background Notifications
// Handles alarm scheduling via Periodic Background Sync & push events

const SW_VERSION = 'deos-sw-v1';
const ALARM_INTERVAL = 60000; // Check every 60 seconds

// ── Installation ──────────────────────────────────────────────────────────────
self.addEventListener('install', event => {
    self.skipWaiting();
    console.log('[DeOs SW] Installed');
});

self.addEventListener('activate', event => {
    event.waitUntil(clients.claim());
    console.log('[DeOs SW] Activated');
});

// ── Message from the Main App (schedule alarms) ───────────────────────────────
self.addEventListener('message', event => {
    if (event.data?.type === 'SCHEDULE_ALARMS') {
        scheduleAlarmCheck(event.data.habits || []);
    }
});

let alarmTimer = null;

function scheduleAlarmCheck(habits) {
    if (alarmTimer) {
        clearInterval(alarmTimer);
    }

    const checkAlarms = () => {
        const now = new Date();
        const currentTime = now.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
        const dayOfWeek = now.getDay();
        const todayStr = now.toISOString().split('T')[0];

        habits.forEach(habit => {
            if (
                habit.reminderTime === currentTime &&
                Array.isArray(habit.days) &&
                habit.days.includes(dayOfWeek)
            ) {
                const alarmKey = `${habit.id}-${todayStr}-${currentTime}`;

                // Use IndexedDB-like check via caches or self.registration
                self.registration.showNotification(`🔱 ${habit.name}`, {
                    body: `Time to complete your habit: ${habit.name}`,
                    icon: '/vite.svg',
                    badge: '/vite.svg',
                    tag: alarmKey,
                    requireInteraction: true,
                    vibrate: [200, 100, 200, 100, 200],
                    actions: [
                        { action: 'done', title: '✅ Mark Done' },
                        { action: 'dismiss', title: '⏰ Snooze 5min' }
                    ],
                    data: { habitId: habit.id, habitName: habit.name }
                });
            }
        });
    };

    // Immediate check
    checkAlarms();

    // Repeat every minute
    alarmTimer = setInterval(checkAlarms, ALARM_INTERVAL);
}

// ── Notification Click Handling ───────────────────────────────────────────────
self.addEventListener('notificationclick', event => {
    const { action, notification } = event;
    notification.close();

    if (action === 'done') {
        // Focus/open the app
        event.waitUntil(
            clients.matchAll({ type: 'window' }).then(windowClients => {
                if (windowClients.length > 0) {
                    windowClients[0].focus();
                    windowClients[0].postMessage({
                        type: 'MARK_HABIT_DONE',
                        habitId: notification.data?.habitId
                    });
                } else {
                    clients.openWindow('/');
                }
            })
        );
    } else if (action === 'dismiss') {
        // Snooze: re-notify in 5 minutes
        const snoozeMs = 5 * 60 * 1000;
        setTimeout(() => {
            self.registration.showNotification(`⏰ Snooze: ${notification.data?.habitName}`, {
                body: "Your snoozed reminder is up!",
                icon: '/vite.svg',
                tag: `snooze-${Date.now()}`,
                requireInteraction: true,
                vibrate: [100, 50, 100],
            });
        }, snoozeMs);
    } else {
        // Default click: open the app
        event.waitUntil(
            clients.matchAll({ type: 'window' }).then(windowClients => {
                if (windowClients.length > 0) {
                    windowClients[0].focus();
                } else {
                    clients.openWindow('/');
                }
            })
        );
    }
});

// ── Push Notifications (future use) ──────────────────────────────────────────
self.addEventListener('push', event => {
    if (event.data) {
        const data = event.data.json();
        self.registration.showNotification(data.title, {
            body: data.body,
            icon: '/vite.svg',
            tag: 'deos-push'
        });
    }
});
