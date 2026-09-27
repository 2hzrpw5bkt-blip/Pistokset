// Pistospäiväkirja – service worker: sovellus toimii myös ilman verkkoa.
// Kun päivität sovellusta, nosta CACHE-versionumeroa.
var CACHE = 'pistokset-v1';
var ASSETS = ['./', './index.html', './manifest.json', './icon-180.png', './icon-192.png', './icon-512.png', './icon-512-maskable.png'];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(ASSETS); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);

  // Fontit yms. muilta palvelimilta: hae verkosta, tallenna välimuistiin, muuten välimuistista.
  if (url.origin !== self.location.origin) {
    e.respondWith(caches.open(CACHE).then(function (c) {
      return fetch(req).then(function (r) {
        if (r.ok || r.type === 'opaque') c.put(req, r.clone());
        return r;
      }).catch(function () { return c.match(req).then(function (m) { return m || Response.error(); }); });
    }));
    return;
  }

  // Itse sivu: verkko ensin (jotta päivitykset tulevat), muuten välimuisti.
  if (req.mode === 'navigate' || url.pathname.endsWith('/index.html')) {
    e.respondWith(fetch(req).then(function (r) {
      var copy = r.clone();
      caches.open(CACHE).then(function (c) { c.put('./index.html', copy); });
      return r;
    }).catch(function () { return caches.match('./index.html'); }));
    return;
  }

  // Muut omat tiedostot: välimuisti ensin.
  e.respondWith(caches.match(req).then(function (m) {
    return m || fetch(req).then(function (r) {
      var copy = r.clone();
      caches.open(CACHE).then(function (c) { c.put(req, copy); });
      return r;
    });
  }));
});
