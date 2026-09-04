 self.addEventListener('push', (event) => {
  let data = {};
  try {
    data = event.data?.json() || {};
  } catch {
    data = { body: event.data?.text() || 'New notification' };
  }

  event.waitUntil(self.registration.showNotification(data.title || 'Pact', {
    body: data.body || 'New notification',
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    tag: data.tag || 'pact-notification',
    renotify: true,
    requireInteraction: true,
    vibrate: [100, 50, 100],
    data: { dateOfArrival: Date.now(), primaryKey: 1, url: data.url || '/' }
  }));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow(event.notification.data?.url || '/')
  );
});
