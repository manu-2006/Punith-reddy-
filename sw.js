var C='pr-admin-v1';
self.addEventListener('install',function(e){e.waitUntil(caches.open(C).then(function(c){return c.addAll(['/admin','/lib.js','/site.css'])}).then(function(){return self.skipWaiting()}))});
self.addEventListener('activate',function(e){e.waitUntil(self.clients.claim())});
self.addEventListener('fetch',function(e){var r=e.request,u=new URL(r.url);if(r.method!=='GET')return;
  if(u.origin===location.origin||u.host==='cdn.jsdelivr.net'||/fonts\.(googleapis|gstatic)\.com$/.test(u.host)){
    e.respondWith(fetch(r).then(function(x){var cl=x.clone();caches.open(C).then(function(c){c.put(r,cl)});return x}).catch(function(){return caches.match(r).then(function(m){return m||caches.match('/admin')})}))}});
