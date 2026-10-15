if('serviceWorker' in navigator)navigator.serviceWorker.register('/sw.js').catch(function(){});
var BUCKET='site-media',root=$('#root'),tab='dash',sub='grievances',me=null,ROLE='',OBQ=[],TRQ=[],DIRTY=new WeakMap();
/* device-level encryption (AES-GCM, non-extractable key) for anything cached offline */
var SEC=(function(){var kp=null;
  function b64(u){var s='',i;for(i=0;i<u.length;i+=8192)s+=String.fromCharCode.apply(null,u.subarray(i,i+8192));return btoa(s)}
  function unb64(t){var s=atob(t),u=new Uint8Array(s.length),i;for(i=0;i<s.length;i++)u[i]=s.charCodeAt(i);return u}
  function db(){return new Promise(function(res,rej){var q=indexedDB.open('pr-sec',1);q.onupgradeneeded=function(){q.result.createObjectStore('k')};q.onsuccess=function(){res(q.result)};q.onerror=function(){rej(q.error)}})}
  function key(){if(kp)return kp;kp=db().then(function(d){return new Promise(function(res){var g=d.transaction('k').objectStore('k').get('main');g.onsuccess=function(){if(g.result)return res(g.result);
    crypto.subtle.generateKey({name:'AES-GCM',length:256},false,['encrypt','decrypt']).then(function(k){d.transaction('k','readwrite').objectStore('k').put(k,'main');res(k)})}})});return kp}
  return{put:async function(n,o){try{var k=await key(),iv=crypto.getRandomValues(new Uint8Array(12)),c=await crypto.subtle.encrypt({name:'AES-GCM',iv:iv},k,new TextEncoder().encode(JSON.stringify(o)));localStorage.setItem('enc:'+n,b64(iv)+'.'+b64(new Uint8Array(c)))}catch(e){}},
    get:async function(n){try{var v=localStorage.getItem('enc:'+n);if(!v)return null;var p=v.split('.'),k=await key(),d=await crypto.subtle.decrypt({name:'AES-GCM',iv:unb64(p[0])},k,unb64(p[1]));return JSON.parse(new TextDecoder().decode(d))}catch(e){return null}},
    wipe:function(){Object.keys(localStorage).filter(function(k){return k.indexOf('enc:')===0}).forEach(function(k){localStorage.removeItem(k)})}}})();
var M={
 notifications:{t:'Notifications',tb:'site_notifications',o:'created_at',f:[['title','bp'],['body','bpm'],['type','sel',['info','event','service','important']],['status','st']]},
 news:{t:'News',tb:'news',o:'created_at',f:[['title','bp'],['excerpt','bpm'],['body','bpm'],['image_url','img','news'],['published_at','dt'],['status','st']]},
 events:{t:'Events',tb:'events',o:'starts_at',f:[['title','bp'],['description','bpm'],['location','text'],['starts_at','dt'],['ends_at','dt'],['image_url','img','events'],['status','st']]},
 gallery:{t:'Gallery',tb:'gallery',o:'sort_order',asc:1,f:[['title','bp'],['alt','bp'],['image_url','img','gallery'],['sort_order','num'],['status','st']]},
 videos:{t:'Videos',tb:'videos',o:'sort_order',asc:1,special:1},
 achievements:{t:'Achievements',tb:'achievements',o:'sort_order',asc:1,f:[['title','bp'],['description','bpm'],['achievement_year','num'],['image_url','img','achievements'],['sort_order','num'],['status','st']]},
 youth:{t:'Youth initiatives',tb:'youth_initiatives',o:'sort_order',asc:1,f:[['title','bp'],['description','bpm'],['icon','text'],['image_url','img','youth'],['sort_order','num'],['status','st']]},
 service:{t:'Service activities',tb:'service_activities',o:'sort_order',asc:1,f:[['title','bp'],['description','bpm'],['activity_date','dt'],['location','text'],['image_url','img','service'],['sort_order','num'],['status','st']]}
};
var IN={
 grievances:{t:'Issues',tb:'grievances',c:['name','phone','category','subject','message'],s:['new','in_progress','resolved','closed'],rep:1},
 appointments:{t:'Appointments',tb:'appointment_requests',c:['name','phone','purpose','preferred_date','preferred_time','message'],s:['new','confirmed','completed','cancelled'],rep:1},
 messages:{t:'Messages',tb:'contact_messages',c:['name','phone','email','subject','message'],s:['new','read','replied','archived']},
 supporters:{t:'Supporters',tb:'supporters',c:['name','phone','area'],ro:1},
 rsvps:{t:'RSVPs',tb:'event_rsvps',c:['name','phone','guests'],ro:1,j:'events(title_en)'}
};
var ALLT=[['dash','Dashboard','admin,editor,moderator'],['inbox','Inbox','admin,moderator'],['checkin','Event check-in','admin,moderator'],['alerts','SMS & WhatsApp','admin,moderator']].concat(Object.keys(M).map(function(k){return[k,M[k].t,'admin,editor']}),[['settings','Settings','admin,editor'],['team','Team & roles','admin']]);
var TABS=[];
function pretty(k){return k.replace(/_(en|kn)$/,'').replace(/_/g,' ')}
function title(r){return r.title_en||r.title_kn||r.name||r.subject||'(untitled)'}
/* offline outbox */
function ob(){return OBQ}
function obs(a){OBQ=a;SEC.put('outbox',a);statusBar()}
async function run(o){var q=sb.from(o.t),r;if(o.m==='insert')r=await q.insert(o.d);else if(o.m==='update')r=await q.update(o.d).eq('id',o.id);else r=await q.delete().eq('id',o.id);if(r.error)throw r.error}
function isNet(e){return !navigator.onLine||/fetch|network|failed/i.test((e&&e.message)||'')}
async function mutate(o){
  if(!navigator.onLine){obs(ob().concat([o]));toast('You are offline. Saved on this device and will sync automatically.');return false}
  try{await run(o);return true}catch(e){if(isNet(e)){obs(ob().concat([o]));toast('Connection lost. Saved on this device and will sync automatically.');return false}throw e}}
async function flush(){var q=ob();if(!q.length||!navigator.onLine)return;var left=[];for(var i=0;i<q.length;i++){try{await run(q[i])}catch(e){if(isNet(e))left.push(q[i]);else toast('One queued change was rejected: '+fe(e),1)}}obs(left);if(!left.length){toast('All offline changes synced');render()}}
window.addEventListener('online',function(){statusBar();flush();TRQ.splice(0).forEach(function(f){f()})});window.addEventListener('offline',statusBar);
function statusBar(){var s=$('#st');if(!s)return;var n=ob().length;s.innerHTML='<span class="dot'+(navigator.onLine?'':' off')+'"></span>'+(navigator.onLine?'Online':'Offline')+(n?' · '+n+' change'+(n>1?'s':'')+' waiting to sync':'')}
async function rows(tb,o,asc,sel,filter){var key='c:'+tb;try{var q=sb.from(tb).select(sel||'*');if(filter)q=filter(q);var r=await q.order(o,{ascending:!!asc,nullsFirst:false});if(r.error)throw r.error;SEC.put(key,r.data);return{d:r.data||[]}}catch(e){var c=await SEC.get(key);if(c)return{d:c,cached:1};return{d:[],err:e}}}
/* storage */
async function upload(file,folder){var ext=(file.name.split('.').pop()||'bin').toLowerCase().replace(/[^a-z0-9]/g,''),p=folder+'/'+Date.now()+'-'+Math.random().toString(36).slice(2,8)+'.'+ext;
  var r=await sb.storage.from(BUCKET).upload(p,file,{contentType:file.type,cacheControl:'31536000'});if(r.error)throw r.error;return sb.storage.from(BUCKET).getPublicUrl(p).data.publicUrl}
function pathOf(u){var m=(u||'').split('/object/public/'+BUCKET+'/');return m[1]?decodeURIComponent(m[1]):null}
async function cleanup(r){var p=['image_url','video_url','thumbnail_url'].map(function(k){return pathOf(r[k])}).filter(Boolean);if(p.length&&navigator.onLine)try{await sb.storage.from(BUCKET).remove(p)}catch(e){}}
function frame(file){return new Promise(function(res){var u=URL.createObjectURL(file),v=document.createElement('video'),done=0;function fin(x){if(done)return;done=1;URL.revokeObjectURL(u);res(x)}
  v.muted=true;v.playsInline=true;v.preload='metadata';v.src=u;v.onloadedmetadata=function(){v.currentTime=Math.min(1,(v.duration||2)/4)};
  v.onseeked=function(){var c=document.createElement('canvas');c.width=640;c.height=Math.round(640*v.videoHeight/v.videoWidth)||360;c.getContext('2d').drawImage(v,0,0,c.width,c.height);c.toBlob(function(b){fin({blob:b,dur:v.duration})},'image/jpeg',.82)};
  v.onerror=function(){fin(null)};setTimeout(function(){fin(null)},10000)})}
/* bilingual pair with auto-translate */
function bp(v,base,multi){
  var w=el('div','bp'),st=el('small','bst'),inp={},tok=0,dr=DIRTY.get(v);if(!dr){dr={};DIRTY.set(v,dr)}
  async function go(l){var o=l==='en'?'kn':'en',kl=base+'_'+l,ko=base+'_'+o,txt=(v[kl]||'').trim();if(!txt)return;if(dr[ko]&&(v[ko]||'').trim())return;
    if(!navigator.onLine){st.textContent='Offline: this will be translated automatically when you are back online.';TRQ.push(function(){go(l)});return}
    var n=++tok;st.textContent='Translating to '+(o==='kn'?'Kannada':'English')+'…';
    try{var out=await translate(txt,l,o);if(n!==tok)return;v[ko]=out;inp[o].value=out;dr[ko]=0;st.textContent=(o==='kn'?'Kannada':'English')+' translated automatically. Please review and edit if needed.'}
    catch(e){st.textContent='Auto-translate is unavailable right now. Please fill the other language yourself.'}}
  [['en','English'],['kn','ಕನ್ನಡ']].forEach(function(p){var l=p[0],lab=el('label'),t=el(multi?'textarea':'input');if(multi)t.rows=4;t.lang=l;t.value=v[base+'_'+l]||'';inp[l]=t;
    t.oninput=function(){v[base+'_'+l]=t.value;dr[base+'_'+l]=1};t.onchange=function(){go(l)};lab.append(el('span','',p[1]),t);w.append(lab)});
  w.append(st);return w}
function imgField(v,key,folder){var box=el('div','up'),lab=el('label','b2'),inp=el('input');inp.type='file';inp.accept='image/*';inp.hidden=true;
  if(v[key]){var im=el('img');im.src=v[key];box.append(im)}lab.append(v[key]?'Replace image':'Upload image',inp);box.append(lab);
  inp.onchange=async function(){var f=inp.files[0];if(!f)return;if(!navigator.onLine){toast('Uploads need an internet connection.',1);return}lab.firstChild.textContent='Uploading…';
    try{v[key]=await upload(f,folder);toast('Image uploaded');var ex=$('img',box);if(ex)ex.src=v[key];else{var n=el('img');n.src=v[key];box.prepend(n)}lab.firstChild.textContent='Replace image'}catch(e){toast('Upload failed: '+fe(e),1);lab.firstChild.textContent='Upload image'}};
  if(v[key]){var x=el('button','b2','Remove');x.type='button';x.onclick=function(){v[key]=null;var i=$('img',box);if(i)i.remove();x.remove()};box.append(x)}return box}
function tl(iso){if(!iso)return'';var d=new Date(iso),p=function(n){return String(n).padStart(2,'0')};return d.getFullYear()+'-'+p(d.getMonth()+1)+'-'+p(d.getDate())+'T'+p(d.getHours())+':'+p(d.getMinutes())}
function field(v,f){var k=f[0],t=f[1],w=el('div');w.append(el('div','fl',pretty(k)));
  if(t==='bp'||t==='bpm')w.append(bp(v,k,t==='bpm'));else if(t==='img')w.append(imgField(v,k,f[2]));
  else if(t==='sel'||t==='st'){var s=el('select');(t==='st'?['draft','published']:f[2]).forEach(function(o){var op=el('option','',o);op.value=o;s.append(op)});s.value=v[k]||(t==='st'?'draft':f[2][0]);v[k]=s.value;s.onchange=function(){v[k]=s.value};w.append(s)}
  else{var i=el('input');i.type=t==='dt'?'datetime-local':t==='num'?'number':'text';i.value=t==='dt'?tl(v[k]):(v[k]==null?'':v[k]);i.oninput=function(){v[k]=t==='dt'?(i.value?new Date(i.value).toISOString():null):i.value};w.append(i)}return w}
async function ensureTr(v,fs){for(var i=0;i<fs.length;i++){var f=fs[i];if(f[1]!=='bp'&&f[1]!=='bpm')continue;var b=f[0],en=(v[b+'_en']||'').trim(),kn=(v[b+'_kn']||'').trim();
  if(en&&!kn&&navigator.onLine){try{v[b+'_kn']=await translate(en,'en','kn')}catch(e){}}else if(kn&&!en&&navigator.onLine){try{v[b+'_en']=await translate(kn,'kn','en')}catch(e){}}
  if(!(v[b+'_kn']||'').trim()&&(v[b+'_en']||'').trim())v[b+'_kn']=v[b+'_en']}}
function clean(v,fs){var d={};fs.forEach(function(f){var k=f[0],t=f[1];if(t==='bp'||t==='bpm'){d[k+'_en']=(v[k+'_en']||'').trim()||null;d[k+'_kn']=(v[k+'_kn']||'').trim()||null}else if(t==='num'){var n=v[k]===''||v[k]==null?null:Number(v[k]);d[k]=n==null||isNaN(n)?(k==='sort_order'?0:null):n}else if(t==='dt'){d[k]=v[k]||null}else d[k]=(v[k]===''||v[k]===undefined)?null:v[k]});return d}
/* generic editor */
function editor(key,row,after){
  var m=M[key],v=Object.assign({},row||{}),isNew=!row,wrap=el('div'),close,fs=m.special?null:m.f;
  wrap.append(el('h3','','' ));wrap.firstChild.textContent=(isNew?'New ':'Edit ')+m.t.toLowerCase();wrap.firstChild.style.marginBottom='14px';
  var save=el('button','b2 main','Save'),can=el('button','b2','Cancel');
  if(m.special){videoForm(wrap,v,isNew,function(p){save.onclick=p})}else{fs.forEach(function(f){wrap.append(field(v,f))});
    save.onclick=async function(){save.disabled=true;save.textContent='Saving…';try{await ensureTr(v,fs);var d=clean(v,fs);if(!d.title_kn&&!d.body_kn&&!d.title_en){toast('Please add a title.',1);return}
      if(d.status==='published'&&'published_at' in d&&!d.published_at)d.published_at=new Date().toISOString();
      var ok=await mutate(isNew?{t:m.tb,m:'insert',d:d}:{t:m.tb,m:'update',id:row.id,d:d});toast(ok?'Saved':'Saved offline');close();after()}catch(e){toast(fe(e),1)}finally{save.disabled=false;save.textContent='Save'}}}
  can.onclick=function(){close()};var rw=el('div','row2');rw.append(save,can);wrap.append(rw);close=openModal(wrap)}
function detect(u){return /youtu/.test(u)?'youtube':/instagram/.test(u)?'instagram':/facebook|fb\.watch/.test(u)?'facebook':'other'}
function videoForm(wrap,v,isNew,bind){
  var fs=[['title','bp'],['description','bpm']],src=v.source_type==='upload'?'upload':'link',file=null,link=el('input'),fi=el('input'),sr=el('div','sub'),area=el('div');
  fs.forEach(function(f){wrap.append(field(v,f))});
  wrap.append(el('div','fl','Source'));
  [['link','Paste a link (YouTube, Instagram, Facebook)'],['upload','Upload a video from this device']].forEach(function(o){var b=el('button',src===o[0]?'on':'',o[1]);b.type='button';b.onclick=function(){src=o[0];$$('button',sr).forEach(function(x){x.classList.toggle('on',x===b)});draw()};sr.append(b)});
  wrap.append(sr,area);link.placeholder='https://…';link.value=v.external_url||(src==='link'?v.youtube_url||'':'');fi.type='file';fi.accept='video/mp4,video/webm,video/quicktime';
  fi.onchange=function(){var f=fi.files[0];if(!f)return;if(f.size>52428800){toast('Video is larger than 50 MB. Please compress it or paste a YouTube link.',1);fi.value='';return}file=f;note.textContent=f.name+' · '+(f.size/1048576).toFixed(1)+' MB. A thumbnail will be made automatically.'};
  var note=el('small','st','');if(v.video_url&&!file)note.textContent='A video is already uploaded. Choose a file only if you want to replace it.';
  function draw(){area.replaceChildren();if(src==='link')area.append(link);else area.append(fi,note)}draw();
  wrap.append(el('div','fl','Thumbnail (optional, made automatically for uploads)'),imgField(v,'thumbnail_url','thumbs'));
  [['sort_order','num'],['status','st']].forEach(function(f){wrap.append(field(v,f))});
  bind(async function(){var btn=this;btn.disabled=true;btn.textContent='Saving…';
    try{await ensureTr(v,fs);var d=clean(v,fs.concat([['sort_order','num'],['status','st'],['thumbnail_url','text']]));if(!d.title_kn){toast('Please add a title.',1);return}
      if(src==='link'){var u=link.value.trim();if(!/^https?:\/\//i.test(u)){toast('Please paste a valid link.',1);return}d.external_url=u;d.youtube_url=u;d.video_url=null;d.source_type='link';d.platform=detect(u);d.mime_type=null;d.file_size=null}
      else{if(!file&&!v.video_url){toast('Please choose a video file.',1);return}if(file){if(!navigator.onLine){toast('Uploading a video needs an internet connection.',1);return}
          toast('Uploading video… please wait');var fr=await frame(file),url=await upload(file,'videos');d.video_url=url;d.youtube_url=url;d.external_url=null;d.source_type='upload';d.platform='upload';d.mime_type=file.type;d.file_size=file.size;if(fr&&fr.dur&&isFinite(fr.dur))d.duration_seconds=Math.round(fr.dur);
          if(!d.thumbnail_url&&fr&&fr.blob){try{d.thumbnail_url=await upload(new File([fr.blob],'thumb.jpg',{type:'image/jpeg'}),'thumbs')}catch(e){}}}
        else{d.video_url=v.video_url;d.youtube_url=v.video_url;d.source_type='upload'}}
      if(d.status==='published'&&!v.published_at)d.published_at=new Date().toISOString();
      var ok=await mutate(isNew?{t:'videos',m:'insert',d:d}:{t:'videos',m:'update',id:v.id,d:d});toast(ok?'Video saved':'Saved offline');$$('.modal').forEach(function(x){x.remove()});document.body.style.overflow='';render()}
    catch(e){toast(fe(e),1)}finally{btn.disabled=false;btn.textContent='Save'}})}
/* views */
async function listView(key,main){var m=M[key],R=await rows(m.tb,m.o,m.asc),box=el('div'),add=el('button','b2 main','+ Add new');add.onclick=function(){editor(key,null,render)};box.append(add);box.lastChild.style.marginBottom='16px';
  if(R.cached)box.append(el('p','st','Showing the last saved copy (offline).'));if(R.err)box.append(el('p','err','Could not load: '+R.err.message));
  var card=el('div','box');if(!R.d.length)card.append(el('p','st','Nothing here yet. Click "Add new".'));
  R.d.forEach(function(r){var li=el('div','li'),l=el('div'),t=el('div','tt',title(r)),s=el('div','sm',[r.status,r.starts_at&&new Date(r.starts_at).toLocaleDateString(),r.published_at&&new Date(r.published_at).toLocaleDateString(),r.source_type,r.platform].filter(Boolean).join(' · ')),a=el('div','row2'),e=el('button','b2','Edit'),x=el('button','b2 red','Delete');a.style.margin='0';
    var th=r.thumbnail_url||r.image_url;var left=el('div');left.style.cssText='display:flex;gap:12px;align-items:center;min-width:0';if(th){var im=el('img','th');im.src=th;left.append(im)}l.append(t,s);left.append(l);
    e.onclick=function(){editor(key,r,render)};x.onclick=async function(){if(!await sure('"'+title(r)+'" will be permanently deleted.','Delete this item?'))return;try{var ok=await mutate({t:m.tb,m:'delete',id:r.id});if(ok)await cleanup(r);toast('Deleted');render()}catch(er){toast(fe(er),1)}};
    a.append(e,x);li.append(left,a);card.append(li)});box.append(card);main.append(box)}
async function dashView(main){if(ROLE==='editor')return editorDash(main);var T=[['supporters','Supporters','supporters'],['grievances','New issues','grievances',1],['appointment_requests','New appointments','appointments',1],['contact_messages','New messages','messages',1],['event_rsvps','RSVPs','rsvps']],g=el('div','tiles');main.append(g);
  var wk=new Date(Date.now()-7*864e5).toISOString();var all=T.map(function(t){var q=sb.from(t[0]).select('*',{count:'exact',head:true});if(t[3])q=q.eq('status','new');return q.then(function(r){return r.count||0},function(){return'–'})}).concat([sb.from('site_visits').select('*',{count:'exact',head:true}).gte('created_at',wk).then(function(r){return r.count||0},function(){return'–'})]);
  var C=await Promise.all(all),L=T.map(function(t){return t[1]}).concat(['Visits (7 days)']);C.forEach(function(c,i){var d=el('div'),b=el('b','',c);d.append(b,el('span','',L[i]));g.append(d);if(i<5&&T[i][2]){d.style.cursor='pointer';d.onclick=function(){tab='inbox';sub=T[i][2];render()}}});
  var tip=el('div','box');tip.innerHTML='<b>Tips</b><p class="st" style="margin:6px 0 0">Type in English or Kannada and the other language is filled in automatically. Items stay hidden from the public until their status is <b>published</b>. If you lose your connection, edits are saved on this device and sync when you are back online. Uploading photos and videos needs a connection.</p>';main.append(tip)}
async function inboxView(main){var bar=el('div','sub');Object.keys(IN).forEach(function(k){var b=el('button',sub===k?'on':'',IN[k].t);b.onclick=function(){sub=k;render()};bar.append(b)});main.append(bar);
  var c=IN[sub],R=await rows(c.tb,'created_at',0,c.j?'*,'+c.j:'*'),box=el('div');if(R.cached)box.append(el('p','st','Showing the last saved copy (offline).'));
  if(c.ro){var ex=el('button','b2','Export CSV');ex.onclick=function(){var cols=c.c.concat(['created_at']),csv=[cols.join(',')].concat(R.d.map(function(r){return cols.map(function(k){return '"'+String(r[k]==null?'':r[k]).replace(/"/g,'""')+'"'}).join(',')})).join('\n'),a=el('a');a.href=URL.createObjectURL(new Blob(['\ufeff'+csv],{type:'text/csv'}));a.download=sub+'.csv';a.click()};box.append(ex);box.lastChild.style.marginBottom='14px'}
  if(!R.d.length)box.append(el('div','box','Nothing here yet.'));
  R.d.forEach(function(r){var b=el('div','box'),h=el('div');h.style.cssText='display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap';h.append(el('b','',(r.name||'')+(r.events?' · '+(r.events.title_en||''):'')),el('span','st',new Date(r.created_at).toLocaleString()));b.append(h);
    c.c.forEach(function(k){if(k!=='name'&&r[k]!=null&&r[k]!=='')b.append(el('div','sm',k.replace(/_/g,' ')+': '+r[k]))});b.lastChild.style.whiteSpace='pre-wrap';
    var rw=el('div','row2');
    if(!c.ro){var s=el('select');s.style.width='auto';c.s.forEach(function(o){var op=el('option','',o);op.value=o;s.append(op)});s.value=r.status;rw.append(s);var ta;
      if(c.rep){ta=el('textarea');ta.rows=2;ta.placeholder='Reply visible to the citizen in their dashboard';ta.value=r.public_reply||'';ta.style.marginTop='12px';b.append(ta)}
      var sv=el('button','b2 main','Save');sv.onclick=async function(){try{var d={status:s.value};if(ta)d.public_reply=ta.value.trim()||null;var ok=await mutate({t:c.tb,m:'update',id:r.id,d:d});toast(ok?'Updated':'Saved offline')}catch(e){toast(fe(e),1)}};rw.append(sv)}
    var x=el('button','b2 red','Delete');x.onclick=async function(){if(await sure('This entry will be permanently deleted.','Delete this entry?')){try{await mutate({t:c.tb,m:'delete',id:r.id});render()}catch(e){toast(fe(e),1)}}};rw.append(x);b.append(rw);box.append(b)});main.append(box)}
async function settingsView(main){var r=await sb.from('site_settings').select('*').maybeSingle(),v=Object.assign({},r.data||{id:true}),box=el('div','box');
  [['hero_tagline','bp'],['hero_description','bpm'],['hero_image_url','img','hero'],['site_name','text'],['phone','text'],['email','text'],['whatsapp','text'],['address','text'],['instagram_url','text'],['facebook_url','text'],['youtube_url','text'],['x_url','text']].forEach(function(f){box.append(field(v,f))});
  var h=el('p','st','Portrait: upload a transparent PNG (cut-out photo) for the best look in the hero.');box.prepend(h);
  var sv=el('button','b2 main','Save settings');sv.onclick=async function(){try{var d={};['hero_tagline_en','hero_tagline_kn','hero_description_en','hero_description_kn','hero_image_url','site_name','phone','email','whatsapp','address','instagram_url','facebook_url','youtube_url','x_url'].forEach(function(k){var x=v[k];d[k]=x===undefined||x===''?null:x});
    if(!d.hero_tagline_kn&&d.hero_tagline_en&&navigator.onLine)try{d.hero_tagline_kn=await translate(d.hero_tagline_en,'en','kn')}catch(e){}
    if(!d.hero_description_kn&&d.hero_description_en&&navigator.onLine)try{d.hero_description_kn=await translate(d.hero_description_en,'en','kn')}catch(e){}
    if(!d.site_name)delete d.site_name;
    var ok=await mutate({t:'site_settings',m:'update',id:true,d:d});toast(ok?'Settings saved':'Saved offline')}catch(e){toast(fe(e),1)}};
  var rw=el('div','row2');rw.append(sv);box.append(rw);main.append(box)}
function editorDash(main){var g=el('div','tiles');main.append(g);return Promise.all([['news','News'],['events','Events'],['gallery','Photos'],['videos','Videos']].map(function(t){return sb.from(t[0]).select('*',{count:'exact',head:true}).then(function(r){return[t[1],r.count||0]},function(){return[t[1],'–']})})).then(function(C){C.forEach(function(c){var d=el('div');d.append(el('b','',c[1]),el('span','',c[0]));g.append(d)});var tip=el('div','box');tip.textContent='You have editor access: you can manage website content. Citizen messages and contact details are visible only to admins and moderators.';main.append(tip)})}
/* ---- event check-in ---- */
async function checkinView(main){
  var top=el('div','box'),res=el('div'),inp=el('input'),go=el('button','btn main sm','Check in'),scan=el('button','btn sm','Scan QR with camera'),cam=el('div','cam'),vid=el('video'),cv=document.createElement('canvas'),run=0,last='',lastAt=0,rec=el('div','box'),stats=el('div','st');
  inp.placeholder='Ticket code or scanned link';inp.maxLength=200;inp.style.maxWidth='340px';
  var row=el('div','row2');row.style.marginTop='0';row.append(inp,go,scan);top.append(el('div','fl','Check in a guest'),row,res,stats);main.append(top);
  vid.setAttribute('playsinline','');vid.muted=true;cam.append(vid);cam.hidden=true;main.append(cam,rec);
  function show(k,h,p){res.replaceChildren();var b=el('div','res '+k);b.append(el('b','',h),el('span','',p));res.append(b)}
  async function loadRecent(){var all=await sb.from('event_rsvps').select('*',{count:'exact',head:true}),ci=await sb.from('event_rsvps').select('*',{count:'exact',head:true}).not('checked_in_at','is',null);stats.textContent='Checked in '+(ci.count||0)+' of '+(all.count||0)+' registrations';
    var R=await sb.from('event_rsvps').select('name,guests,checked_in_at,events(title_en)').not('checked_in_at','is',null).order('checked_in_at',{ascending:false}).limit(10);rec.replaceChildren(el('div','fl','Recent check-ins'));
    if(!(R.data||[]).length)rec.append(el('p','st','No one has checked in yet.'));(R.data||[]).forEach(function(r){var l=el('div','li');l.append(el('div','tt',r.name+' · '+r.guests+' guest'+(r.guests>1?'s':'')),el('div','sm',((r.events&&r.events.title_en)||'')+' · '+new Date(r.checked_in_at).toLocaleTimeString()));rec.append(l)})}
  async function doIn(raw){var t=String(raw).toUpperCase(),m=t.match(/C=([A-Z0-9]{14})/)||t.match(/^\s*([A-Z0-9]{14})\s*$/);if(!m){show('bad','Invalid code','That does not look like a ticket.');return}
    var r=await sb.rpc('check_in',{p_code:m[1]});if(r.error){show('bad','Could not check in',fe(r.error));return}var d=r.data;
    if(d.status==='ok'){show('ok','Welcome, '+d.name,d.guests+' guest'+(d.guests>1?'s':'')+' · '+(d.title_en||''));if(navigator.vibrate)navigator.vibrate(120)}
    else if(d.status==='already')show('warn','Already checked in',d.name+' checked in at '+new Date(d.at).toLocaleTimeString());else show('bad','Invalid ticket','This ticket was not found.');loadRecent()}
  go.onclick=function(){if(inp.value.trim()){doIn(inp.value);inp.value=''}};inp.onkeydown=function(e){if(e.key==='Enter')go.onclick()};
  function stopScan(){run=0;cam.hidden=true;scan.textContent='Scan QR with camera';if(vid.srcObject){vid.srcObject.getTracks().forEach(function(t){t.stop()});vid.srcObject=null}}window.__stop=stopScan;
  function tick(){if(!run)return;if(vid.readyState>=2&&window.jsQR&&vid.videoWidth){cv.width=vid.videoWidth;cv.height=vid.videoHeight;var c=cv.getContext('2d');c.drawImage(vid,0,0);var im=c.getImageData(0,0,cv.width,cv.height),q=jsQR(im.data,im.width,im.height);if(q&&q.data&&(q.data!==last||Date.now()-lastAt>4000)){last=q.data;lastAt=Date.now();doIn(q.data)}}setTimeout(tick,250)}
  scan.onclick=async function(){if(run){stopScan();return}try{var st=await navigator.mediaDevices.getUserMedia({video:{facingMode:'environment'}});vid.srcObject=st;await vid.play();cam.hidden=false;run=1;scan.textContent='Stop camera';tick()}catch(e){toast('The camera is not available. You can type the ticket code instead.',1)}};
  loadRecent()}
/* ---- SMS / WhatsApp alerts ---- */
async function callAlerts(body){var r=await sb.functions.invoke('send-alerts',{body:body});if(r.error){var m='Could not reach the alerts service.';try{var j=await r.error.context.json();if(j&&j.error)m=j.error}catch(e){}return{error:m}}return r.data}
function e164(p){var d=String(p).replace(/\D/g,'');return d.length===10?'91'+d:d}
async function alertsView(main){
  var b=el('div','box'),ch=el('select'),ta=el('textarea'),cnt=el('small','st'),info=el('div','st'),send=el('button','btn main','Send to all supporters'),man=el('button','btn','Open chats manually'),lg=el('div','box'),ml=el('div');
  ch.innerHTML='<option value="whatsapp">WhatsApp</option><option value="sms">SMS</option>';ch.style.maxWidth='240px';ta.rows=5;ta.maxLength=900;ta.placeholder='Write your message in English or Kannada…';
  var rw=el('div','row2');rw.append(send,man);b.append(el('div','fl','Channel'),ch,el('div','fl','Message'),ta,cnt,info,rw,ml);main.append(b,lg);
  ta.oninput=function(){cnt.textContent=ta.value.length+' / 900 characters'};ta.oninput();
  var d=await callAlerts({channel:'sms',dry:true}),n=d&&d.recipients;
  info.textContent=d&&d.error?d.error:('Audience: '+n+' supporter'+(n===1?'':'s')+' who have not opted out. '+(d.configured?'':'The message provider is not connected yet, so you can use the manual option below or add the Twilio secrets in Supabase (Project Settings, Edge Functions, Secrets: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_SMS_FROM, TWILIO_WHATSAPP_FROM).'));info.style.margin='10px 0';
  send.onclick=async function(){var m=ta.value.trim();if(m.length<3){toast('Please write a message first.',1);return}
    if(!await ask({title:'Send this alert?',msg:'It will be sent by '+(ch.value==='sms'?'SMS':'WhatsApp')+' to '+(n||0)+' supporters. A sent message cannot be recalled.',ok:'Send now',cancel:'Not yet',icon:'➤'}))return;
    busy(send,1);var r=await callAlerts({channel:ch.value,message:m});busy(send,0);if(r.error){toast(r.error,1);return}toast('Sent to '+r.sent+' supporter'+(r.sent===1?'':'s')+(r.failed?' · '+r.failed+' failed':''));ta.value='';ta.oninput();log()};
  man.onclick=async function(){var m=ta.value.trim();if(m.length<3){toast('Please write a message first.',1);return}var R=await sb.from('supporters').select('name,phone').eq('alerts_opt_out',false).order('created_at',{ascending:false}).limit(150);ml.replaceChildren(el('div','fl','Tap a name to open WhatsApp with your message ready'));
    (R.data||[]).forEach(function(s){var a=el('a','b2',s.name);a.href='https://wa.me/'+e164(s.phone)+'?text='+encodeURIComponent(m);a.target='_blank';a.rel='noopener';a.style.cssText='margin:0 8px 8px 0;text-decoration:none';ml.append(a)})};
  async function log(){var R=await rows('alert_log','created_at',0);lg.replaceChildren(el('div','fl','Recent alerts'));if(!R.d.length)lg.append(el('p','st','Nothing sent yet.'));R.d.slice(0,10).forEach(function(r){var l=el('div','li'),x=el('div');x.append(el('div','tt',r.message.slice(0,90)),el('div','sm',r.channel+' · '+r.recipients+' sent'+(r.failed?' · '+r.failed+' failed':'')+' · '+new Date(r.created_at).toLocaleString()));l.append(x);lg.append(l)})}log()}
/* ---- team & roles ---- */
async function teamView(main){
  var R=await sb.from('profiles').select('id,full_name,email,role').neq('role','citizen').order('created_at'),box=el('div','box'),add=el('div','box'),em=el('input'),rs=el('select'),ad=el('button','btn main sm','Give access');
  main.append(el('p','st','Admin: everything. Editor: website content only. Moderator: citizen inbox, alerts and event check-in.'));
  em.type='email';em.placeholder='Email of a registered user';em.style.maxWidth='320px';['editor','moderator','admin'].forEach(function(o){var op=el('option','',o);op.value=o;rs.append(op)});rs.style.width='auto';
  var rw=el('div','row2');rw.style.marginTop='0';rw.append(em,rs,ad);add.append(el('div','fl','Add a team member'),el('p','st','They must first create a free account on the Citizen page, then you add their email here.'),rw);
  ad.onclick=async function(){var v=em.value.trim().toLowerCase();if(!v)return;busy(ad,1);var p=await sb.from('profiles').select('id,full_name').ilike('email',v).maybeSingle();
    if(!p.data){busy(ad,0);toast('No account with that email yet. Ask them to sign up on the Citizen page first.',1);return}
    var u=await sb.from('profiles').update({role:rs.value}).eq('id',p.data.id);busy(ad,0);if(u.error){toast(fe(u.error),1);return}toast('Access given');render()};
  (R.data||[]).forEach(function(p){var l=el('div','li'),x=el('div'),sel=el('select'),rm=el('button','b2 red','Remove access'),isMe=p.id===me.id;x.append(el('div','tt',p.full_name||p.email),el('div','sm',p.email||''));
    ['admin','editor','moderator'].forEach(function(o){var op=el('option','',o);op.value=o;sel.append(op)});sel.value=p.role;sel.style.width='auto';sel.disabled=isMe;rm.disabled=isMe;
    sel.onchange=async function(){var u=await sb.from('profiles').update({role:sel.value}).eq('id',p.id);if(u.error){toast(fe(u.error),1);sel.value=p.role}else toast('Role updated')};
    rm.onclick=async function(){if(!await sure((p.full_name||p.email)+' will lose all admin access and become a normal citizen account.','Remove access?','Yes, remove'))return;var u=await sb.from('profiles').update({role:'citizen'}).eq('id',p.id);if(u.error)toast(fe(u.error),1);else{toast('Access removed');render()}};
    var a=el('div','row2');a.style.margin='0';a.append(sel,rm);l.append(x,a);box.append(l)});
  main.append(add,box)}
/* shell */
async function render(){if(window.__stop)window.__stop();var title_=(TABS.filter(function(t){return t[0]===tab})[0]||[])[1]||'',side=el('aside','side'),main=el('div','amain'),top=el('div','topb');
  side.append(el('div','brand','Punith Reddy',el('small','',(ROLE||'admin')+' access')));
  TABS.forEach(function(t){var b=el('button',tab===t[0]?'on':'',t[1]);b.onclick=function(){tab=t[0];render()};side.append(b)});
  side.append(el('div','sp'));var vw=el('button','','View website ↗');vw.onclick=function(){open('/','_blank')};var so=el('button','out','Sign out');so.onclick=function(){sb.auth.signOut()};side.append(vw,so);
  var st=el('span','st');st.id='st';top.append(el('h2','',title_),st);main.append(top);var sh=el('div','shell');sh.append(side,main);root.replaceChildren(sh);statusBar();
  if(tab==='dash')await dashView(main);else if(tab==='inbox')await inboxView(main);else if(tab==='settings')await settingsView(main);else if(tab==='checkin')await checkinView(main);else if(tab==='alerts')await alertsView(main);else if(tab==='team')await teamView(main);else await listView(tab,main)}
function login(msg){hideLoader();root.replaceChildren();var w=el('div','login'),b=el('div','lbox'),f=el('form','frm'),e=el('div','err',msg||'');
  b.innerHTML='<div class="tri" style="margin:-34px -34px 24px;border-radius:10px 10px 0 0"></div><h1>Admin sign in</h1><p style="margin:0 0 18px;color:var(--muted)">Punith Reddy website</p>';
  f.innerHTML='<label class="f"><span>Email</span><input name="e" type="email" required autocomplete="email"></label><label class="f"><span>Password</span><input name="p" type="password" required autocomplete="current-password"></label><button class="btn main">Sign in</button><button type="button" class="b2" id="fp">Forgot password?</button>';
  f.onsubmit=async function(ev){ev.preventDefault();e.textContent='';var d=new FormData(f),r=await sb.auth.signInWithPassword({email:d.get('e'),password:d.get('p')});if(r.error)e.textContent=fe(r.error)};
  b.append(f,e);w.append(b);root.append(w);$('#fp').onclick=async function(){var em=await askText('Reset your password','Enter your admin email and we will send a reset link.','you@example.com','email');if(!em)return;var r=await sb.auth.resetPasswordForEmail(em,{redirectTo:location.origin+'/admin'});toast(r.error?fe(r.error):'Reset link sent',!!r.error)}}
async function boot(){var s=await sb.auth.getSession();me=s.data.session&&s.data.session.user;if(!me){login();return}
  var role=null;try{var p=await sb.from('profiles').select('role').eq('id',me.id).maybeSingle();role=p.data&&p.data.role;if(role)localStorage.setItem('role:'+me.id,role)}catch(e){}
  if(!role)try{role=localStorage.getItem('role:'+me.id)}catch(e){}
  if(['admin','editor','moderator'].indexOf(role)<0){await sb.auth.signOut();login('This account does not have admin access.');return}
  ROLE=role;TABS=ALLT.filter(function(t){return t[2].indexOf(role)>-1});if(!TABS.some(function(t){return t[0]===tab}))tab=TABS[0][0];OBQ=(await SEC.get('outbox'))||[];
  render().then(hideLoader);flush()}
sb.auth.onAuthStateChange(function(ev){if(ev==='SIGNED_IN'&&!me)boot();if(ev==='SIGNED_OUT'){me=null;SEC.wipe();OBQ=[];login()}if(ev==='PASSWORD_RECOVERY'){askText('Set a new password','Use at least 8 characters.','New password','password').then(function(pw){if(pw)sb.auth.updateUser({password:pw}).then(function(r){toast(r.error?fe(r.error):'Password updated',!!r.error)})})}});
boot();
