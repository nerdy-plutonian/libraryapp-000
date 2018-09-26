const cacheName = 'v2';
var filesToCache = [
  'index.html',
  'css/bootstrap.css',
  'js/jquery.js',
  'js/bootstrap.js',
  'client.js',
  'books.json'
];

self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function(e) {
    console.log('[ServiceWorker] Activate');
    e.waitUntil(
      caches.keys().then(function(keyList) {
        return Promise.all(keyList.map(function(key) {
          if (key !== cacheName) {
            console.log('[ServiceWorker] Removing old cache', key);
            return caches.delete(key);
          }
        }));
      })
    );
    return self.clients.claim();
  });


  self.addEventListener('fetch', function(event) {
    // Do something interesting with the fetch here
    const request = event.request;
    event.respondWith(networkFirst(request));
  });

  async function networkFirst(request) {
    const cache = await caches.open(cacheName);
    try { // (1) online
      const fresh = await fetch(request);
      cache.put(request, fresh.clone());
      console.log('fresh data loaded');
      return fresh;
    } catch (e) { // (2) offline
      const cachedResponse = await cache.match(request);
      return cachedResponse;
    }
  }

  self.addEventListener('push',e=>{
    console.log('push received');
    const options = {
    body: 'Yay it works.',
    icon: 'images/icons/icon-72x72.png',
    badge: 'images/icons/icon-144x144.png',
    actions:[
      {action:'check',title:'check out'},
      {action:'close',title:'close'}
      ]
  };
    self.registration.showNotification('New book added.',options);//,{
        //body:'New book added. Check it out!'
    //});
});

self.addEventListener('notificationclick', function(event) {
  console.log('[Service Worker] Notification click Received.');
  switch(event.action){
    case 'check':
        event.notification.close();
        clients.openWindow('index.html')
        break;
    case 'close':
        event.notification.close();
        break;
}
});