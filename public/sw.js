const CACHE_NAME = 'paramkirpa-v1';
const urlsToCache = [
  '/',
  '/pooja',
  '/reels', 
  '/community',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  // Cache festival images
  '/chhath-pooja.jpg',
  '/diwali.jpg',
  '/durga-pooja.jpg',
  '/krishna-janmashtami.jpg',
  '/ganesh-chaturthi.jpg',
  '/maha-shivratri.jpg',
  '/kali-pooja.jpg',
  '/navratri.jpg',
  '/holi.jpg',
  '/karva-chauth.jpg',
  '/dussehra.jpg',
  '/ram-navami.jpg',
  '/pongal.jpg',
  '/baisakhi.jpg',
  '/guru-purnima.jpg',
  '/raksha-bandhan.jpg'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Background sync for prayers when online
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('Background sync triggered');
  }
});

// Push notifications for daily spiritual content
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New spiritual content available!',
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Content',
        icon: '/icon-192x192.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icon-192x192.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Paramkirpa', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    // Open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});