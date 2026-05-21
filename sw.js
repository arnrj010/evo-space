const CACHE = "evo-space-v3";
const ASSETS = [
  "/evo-space/",
  "/evo-space/index.html",
  "/evo-space/manifest.json"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).catch(() => caches.match("/evo-space/")))
  );
});

// Handle notification display from service worker
self.addEventListener("message", e => {
  if (e.data && e.data.type === "SCHEDULE_NOTIFICATION") {
    const { title, body, delay } = e.data;
    setTimeout(() => {
      self.registration.showNotification(title, {
        body,
        icon: "/evo-space/icon-192.png",
        badge: "/evo-space/icon-192.png",
        vibrate: [200, 100, 200],
        tag: title,
        renotify: true
      });
    }, delay);
  }
});

self.addEventListener("notificationclick", e => {
  e.notification.close();
  e.waitUntil(clients.openWindow("/evo-space/"));
});
