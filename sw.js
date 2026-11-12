// Offline support. The whole app is cached as one versioned snapshot at install time
// (all files or none) and served only from that snapshot, so the page can never mix
// files from two releases. BUMP VERSION whenever any file listed below changes.
const VERSION = 'v5';
const CACHE = `english-app-${VERSION}`;
const ASSETS = [
  './',
  './index.html',
  './src/styles.css',
  './src/main.js',
  './src/art.js',
  './src/dates.js',
  './src/dom.js',
  './src/dialogue.js',
  './src/match.js',
  './src/parent.js',
  './src/phonics.js',
  './src/repeat-card.js',
  './src/review.js',
  './src/rewards.js',
  './src/speech.js',
  './src/store.js',
  './src/warmup.js',
  './data/curriculum.js',
  './data/rewards.js',
  './data/sounds.js',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      // 'reload' bypasses the HTTP cache so the snapshot is really the current release.
      .then((cache) => cache.addAll(ASSETS.map((url) => new Request(url, { cache: 'reload' }))))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.open(CACHE).then((cache) => cache.match(event.request)).then((cached) => cached || fetch(event.request)),
  );
});
