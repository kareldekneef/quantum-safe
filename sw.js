const CACHE_NAME = 'quantum-safe-v2';

const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/pages/assessment.html',
  '/pages/education.html',
  '/pages/services.html',
  '/pages/about.html',
  '/css/main.css',
  '/css/components.css',
  '/js/main.js',
  '/js/analytics.js',
  '/js/assessment.js',
  '/js/games.js',
  '/js/pdf-generator.js',
  '/assets/karel-dekneef.jpg',
  '/assets/icons/icon-192.svg',
  '/assets/icons/icon-512.svg',
  '/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET and cross-origin requests
  if (request.method !== 'GET' || url.origin !== location.origin) return;

  // Network-only for API calls (graceful failure)
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request).catch(() => new Response(JSON.stringify({ success: false, offline: true }), {
        headers: { 'Content-Type': 'application/json' }
      }))
    );
    return;
  }

  // Stale-while-revalidate for HTML pages
  if (request.destination === 'document') {
    event.respondWith(
      caches.open(CACHE_NAME).then(async cache => {
        const cached = await cache.match(request);
        const networkFetch = fetch(request).then(res => {
          cache.put(request, res.clone());
          return res;
        }).catch(() => null);
        return cached || networkFetch;
      })
    );
    return;
  }

  // Cache-first for static assets
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(res => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
        }
        return res;
      });
    })
  );
});
