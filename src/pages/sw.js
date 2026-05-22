const CACHE_NAME = 'smash-gg-v1';

// Recursos básicos para que la app cargue sin internet
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
});

self.addEventListener('fetch', (event) => {
  // Estrategia: Cache First para imágenes de personajes, Network First para lo demás
  const isImage = event.request.destination === 'image' || event.request.url.includes('images.gameinfo.io');

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse && isImage) {
        return cachedResponse;
      }

      return fetch(event.request).then((networkResponse) => {
        if (isImage && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Si falla la red y no hay caché, devolver el recurso cacheado si existe
        return cachedResponse;
      });
    })
  );
});