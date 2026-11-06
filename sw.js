/* ==========================================================================
   Meyer - Service Worker (suporte 100% offline)
   Estratégia: pré-cache do "app shell" na instalação; depois, cache-first
   com atualização em segundo plano (stale-while-revalidate) para arquivos
   do mesmo domínio. Todos os caminhos são relativos, o que funciona em
   https://magpe-stack.github.io/Meyer/ (subpasta do GitHub Pages).
   Para publicar uma nova versão, incremente CACHE_VERSION.
   ========================================================================== */
const CACHE_VERSION = 'meyer-v1';

const APP_SHELL = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// Instalação: grava o app shell no cache.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

// Ativação: remove caches de versões antigas.
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// Interceptação de requisições.
self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Só trata GET do mesmo domínio (links do GitHub etc. seguem direto pela rede).
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;

  event.respondWith(
    caches.match(req, { ignoreSearch: true }).then((cached) => {
      // Atualiza o cache em segundo plano quando houver rede.
      const network = fetch(req)
        .then((res) => {
          if (res && res.ok) {
            const copy = res.clone();
            caches.open(CACHE_VERSION).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => null);

      if (cached) return cached;

      // Sem cache: tenta a rede; se falhar em navegação, devolve o index.html.
      return network.then((res) => {
        if (res) return res;
        if (req.mode === 'navigate') return caches.match('./index.html');
        return new Response('Offline', { status: 503, statusText: 'Offline' });
      });
    })
  );
});
