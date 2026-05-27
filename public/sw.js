/* Quiniela Mundial 2026 — Service Worker base.
 *
 * Estrategia mínima: cachear el shell de páginas públicas para ofrecer
 * fallback offline. No cachea respuestas de /api/v1 (siempre se piden
 * frescas; en mock mode el store local se encarga). Las assets estáticas
 * caen en cache-first.
 *
 * Bumpear CACHE_NAME cuando cambie el shell, así se invalida limpio.
 */

const CACHE_NAME = "qm26-shell-v1";
const PRECACHE_URLS = ["/", "/login", "/register"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS)),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)),
      ),
    ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  // Nunca cachear el contrato API (ni el mock que va por localStorage)
  if (url.pathname.startsWith("/api/")) return;

  // Navegaciones: network-first con fallback a cache (offline)
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return res;
        })
        .catch(() =>
          caches.match(event.request).then((cached) => cached ?? caches.match("/")),
        ),
    );
    return;
  }

  // Assets estáticas: cache-first
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((res) => {
        if (!res || res.status !== 200 || res.type !== "basic") return res;
        const copy = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return res;
      });
    }),
  );
});
