// Service Worker for Track It PWA
const ASSET_CACHE = 'trackit-assets-v2'

// Install event - activate immediately
self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting())
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== ASSET_CACHE)
          .map((cacheName) => caches.delete(cacheName))
      )
    })
  )
  return self.clients.claim()
})

// Fetch event - avoid caching HTML, cache hashed assets
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return
  }

  const requestUrl = new URL(event.request.url)

  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request))
    return
  }

  if (requestUrl.pathname.startsWith('/assets/')) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached
        return fetch(event.request).then((response) => {
          if (!response || response.status !== 200) return response
          const responseToCache = response.clone()
          caches.open(ASSET_CACHE).then((cache) => {
            cache.put(event.request, responseToCache)
          })
          return response
        })
      })
    )
    return
  }

  event.respondWith(fetch(event.request))
})

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // If app is already open, focus it
      for (const client of clientList) {
        if (client.url === '/' && 'focus' in client) {
          return client.focus()
        }
      }
      // Otherwise, open the app
      if (clients.openWindow) {
        return clients.openWindow('/')
      }
    })
  )
})
