const CACHE_NAME = 'rpg-v1';
const ASSETS = [
  './',
  './index.html',
  './css/style.css',
  './src/main.js',
  './src/core/InputHandler.js',
  './src/core/Camera.js',
  './src/engine/Vector2.js',
  './src/entities/Entity.js',
  './src/entities/Player.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request))
  );
});