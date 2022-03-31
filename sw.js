self.addEventListener("install", (e) => console.log(e));
self.addEventListener("activate", (e) =>
  caches
    .open("stream-pwa")
    .then((cache) =>
      cache.addAll([
        "/",
        "/pwa",
        "/pwa/",
        "index.html",
        "manifest.json",
        "Space.png",
        "sw.js",
      ])
    )
    .then(() => self.skipWaiting())
);
self.addEventListener("fetch", (e) => {
  // dynamischer content
  if (e.request.url.indexOf("swapi.dev/api") !== -1) {
    e.respondWith(
      fetch(e.request)
        .then((response) => {
          return caches.open("stream-pwa-dynamic").then((cache) => {
            cache.put(e.request.url, response.clone());
            return response.clone();
          });
        })
        .catch((error) => {
          // In case of Offline we return the cached Data
          return caches.match(e.request).then((response) => {
            return response;
          });
        })
    );
  } else {
    // statischer content
    e.respondWith(
      caches.match(e.request).then((response) => response || fetch(e.request))
    );
  }
});
self.addEventListener("push", (e) => console.log(e));
