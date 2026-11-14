// Guarda só o app. Os dados dos pacientes ficam no localStorage e nunca passam por aqui.
// Sempre confere com o servidor se há versão nova (no-cache); a cópia guardada só serve sem internet.
const CACHE = 'fisioagenda-1.2.0';
self.addEventListener('install', (e) => e.waitUntil(caches.open(CACHE).then((c) => c.addAll(['./', 'config.js', 'manifest.webmanifest', 'icons/icon-192.png'])).then(() => self.skipWaiting())));
self.addEventListener('activate', (e) => e.waitUntil(caches.keys().then((k) => Promise.all(k.filter((x) => x !== CACHE).map((x) => caches.delete(x)))).then(() => self.clients.claim())));
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(fetch(e.request, { cache: 'no-cache' }).then((r) => { if (r.ok) { const c = r.clone(); caches.open(CACHE).then((x) => x.put(e.request, c)); } return r; }).catch(() => caches.match(e.request).then((m) => m || caches.match('./'))));
});
