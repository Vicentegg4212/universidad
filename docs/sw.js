// ================================================
// 🔧 AI STUDY GENIUS - SERVICE WORKER (PWA)
// 👨‍💻 Desarrollado por: Vicentegg4212  
// 📱 Optimizado para experiencia offline
// ================================================

const CACHE_NAME = 'ai-study-genius-v2.0';
const urlsToCache = [
    '/',
    '/mobile.html',
    '/index.html',
    '/assets/style.css',
    '/assets/mobile-style.css',
    '/js/script.js',
    '/js/mobile-script.js',
    // Agregar archivos de iconos cuando los tengas
    // '/icon-192.png',
    // '/icon-512.png'
];

// Install event
self.addEventListener('install', (event) => {
    console.log('🔧 Service Worker: Installing...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('🔧 Service Worker: Caching files');
                return cache.addAll(urlsToCache);
            })
            .catch((error) => {
                console.error('🔧 Service Worker: Cache failed', error);
            })
    );
});

// Fetch event
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

// Activate event
self.addEventListener('activate', (event) => {
    console.log('🔧 Service Worker: Activating...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('🔧 Service Worker: Deleting old cache', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});