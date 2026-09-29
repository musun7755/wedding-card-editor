// Bump this version when any bundled font file changes.
const FONT_CACHE = 'wedding-card-fonts-v1';
const FONT_URLS = [
  './assets/fonts/ChenYuluoyan-2.0-Thin.woff2',
  './assets/fonts/jf-openhuninn-2.1.woff2',
  './assets/fonts/GlowSansSC-Condensed-Regular.woff2',
  './assets/fonts/StarPandaKidsBeta2.1.woff2',
  './assets/fonts/ProperScript-Regular.woff2'
].map(path => new URL(path, self.location.href).href);

async function cacheFonts() {
  const cache = await caches.open(FONT_CACHE);
  await Promise.all(FONT_URLS.map(async url => {
    if (await cache.match(url)) return;
    try {
      const response = await fetch(url);
      if (response.ok) await cache.put(url, response);
    } catch (error) {
      console.warn('Font cache download failed:', url, error);
    }
  }));
}

self.addEventListener('install', event => {
  event.waitUntil(cacheFonts().catch(error => console.warn('Font cache unavailable:', error)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    try {
      const names = await caches.keys();
      await Promise.all(names.filter(name => name.startsWith('wedding-card-fonts-') && name !== FONT_CACHE).map(name => caches.delete(name)));
    } catch (error) {
      console.warn('Font cache cleanup failed:', error);
    }
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  if (!FONT_URLS.includes(event.request.url)) return;
  event.respondWith((async () => {
    let cache;
    try {
      cache = await caches.open(FONT_CACHE);
    } catch (error) {
      return fetch(event.request);
    }
    const cached = await cache.match(event.request);
    if (cached) return cached;
    const response = await fetch(event.request);
    if (response.ok) event.waitUntil(cache.put(event.request, response.clone()).catch(error => console.warn('Font cache write failed:', error)));
    return response;
  })());
});
