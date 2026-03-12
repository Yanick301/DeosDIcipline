// DeOs Discipline - Service Worker v3.0 — iOS × Airbnb Edition
const CACHE_NAME = 'deos-discipline-v3';
const OFFLINE_URL = '/';

const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/app.js',
  '/js/db.js',
  '/js/habits.js',
  '/js/streaks.js',
  '/js/notifications.js',
  '/js/stats.js',
  '/js/badges.js',
  '/js/quotes.js',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700;800&display=swap'
];

// ---- Install Event: Cache all static assets ----
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching app shell');
      return cache.addAll(ASSETS_TO_CACHE).catch(err => {
        console.warn('[SW] Some assets failed to cache:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// ---- Activate Event: Clean old caches ----
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    }).then(() => self.clients.claim())
  );
});

// ---- Fetch Event: Cache-first strategy ----
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Skip Chrome extensions and analytics
  if (url.protocol === 'chrome-extension:') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then((response) => {
        // Don't cache bad responses
        if (!response || response.status !== 200 || response.type === 'opaque') {
          return response;
        }

        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      }).catch(() => {
        // Offline fallback
        if (event.request.destination === 'document') {
          return caches.match(OFFLINE_URL);
        }
      });
    })
  );
});

// ---- Push Notification Event ----
self.addEventListener('push', (event) => {
  let data = {
    title: 'DeOs Discipline',
    body: 'Time to complete your habit! 💪',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-96.png',
    tag: 'habit-reminder',
    renotify: true
  };

  if (event.data) {
    try {
      const payload = event.data.json();
      data = { ...data, ...payload };
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: data.icon,
    badge: data.badge,
    tag: data.tag,
    renotify: data.renotify,
    vibrate: [200, 100, 200],
    actions: [
      { action: 'done', title: '✅ Done' },
      { action: 'snooze', title: '⏰ Snooze 10min' }
    ],
    data: { url: '/' }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// ---- Notification Click ----
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'snooze') {
    // Re-schedule notification in 10 minutes
    const snoozeTime = Date.now() + 10 * 60 * 1000;
    event.waitUntil(
      new Promise(resolve => {
        setTimeout(() => {
          self.registration.showNotification('DeOs Discipline', {
            body: 'Snoozed reminder: Time to complete your habit! 💪',
            icon: '/icons/icon-192.png',
            badge: '/icons/icon-96.png'
          });
          resolve();
        }, 10 * 60 * 1000);
      })
    );
    return;
  }

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      const url = event.notification.data?.url || '/';
      for (const client of clientList) {
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

// ---- Background Sync ----
self.addEventListener('sync', (event) => {
  if (event.tag === 'habit-sync') {
    console.log('[SW] Background sync: habit-sync');
  }
});

// ---- Periodic Background Sync ----
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'daily-reminder') {
    event.waitUntil(
      self.registration.showNotification('DeOs Discipline', {
        body: "Don't forget your daily habits! Stay disciplined 🔥",
        icon: '/icons/icon-192.png'
      })
    );
  }
});
