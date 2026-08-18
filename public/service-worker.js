const CACHE_NAME = 'todom-cache-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './todom-logo-small.png',
  './todom-logo-large.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Task data is dynamic and must always be fresh - never serve it from
  // cache, or newly added/edited/completed tasks won't show up until a
  // manual page refresh.
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(fetch(event.request));
    return;
  }

  // The page itself (navigations / index.html) is network-first: always
  // fetch the newest HTML when online so UI updates appear immediately on
  // every device, and fall back to the cached copy only when offline.
  // Otherwise the previous cache-first strategy could keep showing a stale
  // layout across reloads and devices.
  const isHTML = event.request.mode === 'navigate' ||
                 url.pathname === '/' ||
                 url.pathname.endsWith('/index.html');
  if (isHTML) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return networkResponse;
        })
        .catch(() => caches.match(event.request).then((cached) => cached || caches.match('./index.html')))
    );
    return;
  }

  // Other static assets (icons, manifest) rarely change: serve from cache
  // for speed, and refresh the cached copy in the background.
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return networkResponse;
        })
        .catch(() => cached);
      return cached || fetchPromise;
    })
  );
});
