// Simple Service Worker to make the app installable (PWA)
const CACHE_NAME = 'posent-free-cache-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Pass-through fetch handler (required for PWA installability)
  event.respondWith(fetch(event.request));
});
