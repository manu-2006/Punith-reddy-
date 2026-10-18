var C='pr-admin-v2';
var STATIC=['/admin','/admin.js','/lib.js','/site.css'];
self.addEventListener('install',function(e){e.waitUntil(caches.open(C).then(function(c){return c.addAll(STATIC)}).then(function(){return self.skipWaiting()}))});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(keys){return Promise.all(keys.filter(function(k){return k.indexOf('pr-admin-')===0&&k!==C}).map(function(k){return caches.delete(k)}))}).then(function(){return self.clients.claim()}))});
self.addEventListener('fetch',function(e){
  var r=e.request;if(r.method!=='GET')return;
  var u=new URL(r.url);if(u.origin!==location.origin||u.search)return;
  /* Never cache HTML routes, ticket/card pages, or user-specific responses. */
  if(STATIC.indexOf(u.pathname)<0)return;
  e.respondWith(caches.open(C).then(function(c){return c.match(r).then(function(hit){return fetch(r).then(function(x){if(x&&x.ok)c.put(r,x.clone());return x}).catch(function(){return hit||Response.error()})})}));
});
