initLang();(function(){try{var m=(new URLSearchParams(location.search).get('ref')||'').toUpperCase();if(/^[A-Z0-9]{7}$/.test(m))localStorage.setItem('ref',m)}catch(e){}})();V.init(document);(function(){for(var i=0;i<3;i++)$('#nw').append(el('div','sk'));$('#ev').append(el('div','sk wide'),el('div','sk wide'))})();
var hero=$('.hero');
if(!matchMedia('(prefers-reduced-motion:reduce)').matches)hero.addEventListener('pointermove',function(e){var r=hero.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;hero.style.setProperty('--mx',(x*100)+'%');hero.style.setProperty('--my',(y*100)+'%');hero.style.setProperty('--px',(x-.5).toFixed(3));hero.style.setProperty('--py',(y-.5).toFixed(3))});
function count(id,n){var e=document.getElementById(id),t=0,s=Math.max(1,Math.ceil(n/40));(function f(){t=Math.min(n,t+s);e.textContent=t.toLocaleString('en-IN');if(t<n)requestAnimationFrame(f)})()}
function bounded(p,ms,fallback){return Promise.race([Promise.resolve(p),new Promise(function(resolve){setTimeout(function(){resolve({__timeout:true})},ms)})]).then(function(r){return r&&r.__timeout?fallback:r},function(){return fallback})}
async function get(t,fn){return bounded(Promise.resolve().then(function(){return fn(sb.from(t).select('*').eq('status','published'))}).then(function(r){return r.data||[]}),7000,[])}
function vinfo(v){var u=v.video_url||v.external_url||v.youtube_url||'',k='link',id='',yt=u.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/),ig=u.match(/instagram\.com\/(?:reel|reels|p|tv)\/([\w-]+)/);
  if(v.source_type==='upload'||/^video\//.test(v.mime_type||'')||/\.(mp4|webm|mov)(\?|$)/i.test(u))k='file';else if(yt){k='yt';id=yt[1]}else if(ig){k='ig';id=ig[1]}return{u:u,k:k,id:id}}
function playVideo(v){var i=vinfo(v),n;
  if(i.k==='yt'){n=el('iframe');n.src='https://www.youtube-nocookie.com/embed/'+i.id+'?autoplay=1&rel=0';n.allow='autoplay; encrypted-media; picture-in-picture';n.allowFullscreen=true}
  else if(i.k==='file'){n=el('video');n.src=i.u;n.controls=true;n.autoplay=true;n.playsInline=true}
  else if(i.k==='ig'){n=el('iframe','ig');n.src='https://www.instagram.com/p/'+i.id+'/embed';n.allow='encrypted-media'}
  else{if(safe(i.u))window.open(i.u,'_blank','noopener');return}
  openModal(n,'wide')}
(async function(){
  var R=await Promise.all([bounded(sb.from('site_settings').select('*').maybeSingle().then(function(r){return r.data||{}},function(){return{}}),7000,{}),
    get('site_notifications',function(q){return q.order('created_at',{ascending:false}).limit(1)}),
    get('news',function(q){return q.order('published_at',{ascending:false,nullsFirst:false}).limit(9)}),
    get('events',function(q){return q.order('starts_at',{ascending:true})}),
    get('gallery',function(q){return q.order('sort_order')}),get('videos',function(q){return q.order('sort_order')}),
    get('achievements',function(q){return q.order('sort_order')}),get('youth_initiatives',function(q){return q.order('sort_order')}),
    get('service_activities',function(q){return q.order('sort_order')}),
    bounded(sb.rpc('supporter_count').then(function(r){return Number(r.data)||0},function(){return 0}),7000,0)]);
  var CNT={};try{var tcr=await bounded(sb.rpc('ticket_counts'),5000,{data:[]});(tcr.data||[]).forEach(function(x){CNT[x.event_id]=x})}catch(e){}
  try{var lr=await bounded(sb.rpc('top_referrers',{p_limit:10}),5000,{data:[]});var L=lr.data||[];L.forEach(function(x){var li=el('li'),n=el('span','n',x.name),b=el('b','',x.referrals+' ');li.append(n,b);$('#lb').append(li)});$('#leaders').hidden=!L.length}catch(e){}
  var S=R[0],N=R[1],news=R[2],ev=R[3],gal=R[4],vid=R[5],ach=R[6],yi=R[7],sa=R[8],sup=R[9];
  CAP.setKey(S.turnstile_site_key);CAP.mount($('#sf'));
  if(S.hero_image_url&&safe(S.hero_image_url)){var hp=$('#hp');hp.src=S.hero_image_url;hp.hidden=false;$('#hm').hidden=true}
  if(S.hero_description_kn||S.hero_description_en){var d=$('#hdesc');d.replaceChildren(bi(S.hero_description_en,S.hero_description_kn))}
  if(N[0]){var n=el('div','notice '+(N[0].type==='important'?'important':''));n.append(B(N[0],'title'));var x=el('button','','×');x.onclick=function(){n.remove()};n.append(x);$('#notice').append(n)}
  $('#nw').replaceChildren();$('#ev').replaceChildren();count('sc',sup);count('sc2',sup);
  var now=Date.now()-864e5,up=ev.filter(function(e){return !e.starts_at||new Date(e.starts_at)>=now});count('ec',up.length);
  /* work */
  var wg=$('#work-g');
  yi.forEach(function(o){var c=el('div','card'),p=el('div','ph'),b=el('div','bd'),h=el('h3'),d=el('p');if(safe(o.image_url)){var i=el('img');i.src=o.image_url;i.loading='lazy';i.alt='';p.append(i)}else p.textContent=o.icon||'✦';h.append(B(o,'title'));d.append(B(o,'description'));b.append(h,d);c.append(p,b);wg.append(c)});
  sa.forEach(function(o){var c=el('div','card'),b=el('div','bd'),h=el('h3'),d=el('p'),t=el('time');if(o.activity_date)t.append(fdate(o.activity_date));if(o.location)t.append(' · '+o.location);h.append(B(o,'title'));d.append(B(o,'description'));b.append(t,h,d);if(safe(o.image_url)){var p=el('div','ph'),i=el('img');i.src=o.image_url;i.loading='lazy';i.alt='';p.append(i);c.append(p)}c.append(b);wg.append(c)});
  ach.forEach(function(o){var c=el('div','card'),b=el('div','bd'),h=el('h3'),d=el('p'),t=el('time','',o.achievement_year||'');h.append(B(o,'title'));d.append(B(o,'description'));b.append(t,h,d);c.append(b);$('#ach-g').append(c)});
  $('#ach-w').hidden=!ach.length;$('#work').hidden=!(yi.length||sa.length||ach.length);
  /* events */
  var E=$('#ev');up.forEach(function(o){var r=el('div','evt'),d=el('div','d'),m=o.starts_at?new Date(o.starts_at):null,b=el('div'),h=el('h3'),p=el('p'),rs=el('button','btn sm');
    d.append(m?m.getDate():'—');if(m){var s=el('small');s.append(el('span','en',m.toLocaleString('en-IN',{month:'short'})),el('span','kn',m.toLocaleString('kn-IN',{month:'short'})));d.append(s)}
    h.append(B(o,'title'));p.append(B(o,'description'));var meta=el('div','meta');if(o.starts_at)meta.append(fdate(o.starts_at,1));if(o.location)meta.append(' · '+o.location);b.append(meta,h,p);
    var tc=CNT[o.id],left=tc&&tc.ticket_limit!=null?Math.max(0,tc.ticket_limit-tc.taken):null;if(left===0){rs.append(bi('Sold out','ಮಾರಾಟವಾಗಿದೆ'));rs.disabled=true}else{rs.append(bi('Book ticket','ಟಿಕೆಟ್ ಬುಕ್ ಮಾಡಿ'));rs.onclick=function(){rsvp(o,left)}}if(left!=null&&left>0){meta.append(' · ');meta.append(bi(left+' tickets left',left+' ಟಿಕೆಟ್ ಉಳಿದಿವೆ'))}r.append(d,b,rs);E.append(r)});
  $('#ev-e').hidden=!!up.length;
  /* news */
  news.forEach(function(o){var c=el('button','card'),p=el('div','ph'),b=el('div','bd'),h=el('h3'),d=el('p'),t=el('time');c.style.cssText='all:unset;display:block;cursor:pointer;background:var(--card);border:1px solid var(--line);border-radius:6px 6px 26px 6px;overflow:hidden';
    if(safe(o.image_url)){var i=el('img');i.src=o.image_url;i.loading='lazy';i.alt='';p.append(i);c.append(p)}
    if(o.published_at)t.append(fdate(o.published_at));h.append(B(o,'title'));d.append(B(o,'excerpt'));b.append(t,h,d);c.append(b);
    c.onclick=function(){var w=el('div'),hh=el('h3'),bd=el('div');hh.style.cssText='font-size:1.5rem;margin-bottom:10px';hh.append(B(o,'title'));bd.style.whiteSpace='pre-wrap';bd.append(bi(o.body_en||o.excerpt_en,o.body_kn||o.excerpt_kn));if(safe(o.image_url)){var im=el('img','full');im.src=o.image_url;im.alt='';im.style.marginBottom='14px';w.append(im)}w.append(hh,bd);openModal(w)};
    $('#nw').append(c)});
  $('#nw-e').hidden=!!news.length;
  /* videos */
  vid.forEach(function(v){var i=vinfo(v),c=el('button','vcard'),t=el('div','vth'),b=el('div','vb'),h=el('h3'),lab={yt:'YouTube',file:'Video',ig:'Instagram',link:'Link'}[i.k];
    if(safe(v.thumbnail_url)){var im=el('img');im.src=v.thumbnail_url;im.loading='lazy';im.alt='';t.append(im)}
    else if(i.k==='yt'){var im2=el('img');im2.src='https://img.youtube.com/vi/'+i.id+'/hqdefault.jpg';im2.loading='lazy';im2.alt='';t.append(im2)}
    else if(i.k==='file'){var vv=el('video');vv.muted=true;vv.preload='metadata';vv.playsInline=true;vv.src=i.u+'#t=0.7';t.append(vv)}
    t.append(el('div','play'));var ch=el('span','chip',lab);h.append(B(v,'title'));b.append(ch,h);c.append(t,b);c.onclick=function(){playVideo(v)};$('#vd').append(c)});
  $('#videos').hidden=!vid.length;
  /* gallery */
  gal.forEach(function(g){if(!safe(g.image_url))return;var i=el('img');i.src=g.image_url;i.loading='lazy';i.alt=g.alt_en||g.title_en||'';i.onclick=function(){var w=el('div'),im=el('img','full');im.src=g.image_url;im.alt=i.alt;w.append(im);if(g.title_en||g.title_kn){var p=el('p');p.style.textAlign='center';p.append(B(g,'title'));w.append(p)}openModal(w)};$('#gl').append(i)});
  $('#gallery').hidden=!gal.length;
  /* contact details (edited in the admin panel, Settings) */
  var IC={phone:'<svg viewBox="0 0 24 24"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg>',
    wa:'<svg viewBox="0 0 24 24"><path d="M4 20l1.3-4.2A8 8 0 1 1 8.4 18.8L4 20z"/><path d="M9 9.5c.3 2 2 3.800 4.500 4.500l1.300-1.300-1.800-1-.8.7c-.8-.4-1.500-1.100-1.900-1.900l.7-.8-1-1.800z"/></svg>',
    mail:'<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="M3 8l9 6 9-6"/></svg>',
    pin:'<svg viewBox="0 0 24 24"><path d="M12 21s7-6.200 7-11a7 7 0 0 0-14 0c0 4.800 7 11 7 11z"/><circle cx="12" cy="10" r="2.500"/></svg>',
    ig:'<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.500" cy="6.500" r=".6"/></svg>',
    fb:'<svg viewBox="0 0 24 24"><path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8z"/></svg>',
    yt:'<svg viewBox="0 0 24 24"><rect x="2.500" y="6" width="19" height="12" rx="4"/><path d="M10 9.500v5l4.500-2.500z"/></svg>',
    x:'<svg viewBox="0 0 24 24"><path d="M4 4l16 16M20 4L4 20"/></svg>'};
  function fmt(v){var d=String(v).replace(/\D/g,'');if(d.length===12&&d.indexOf('91')===0)d=d.slice(2);if(d.length===10)return{show:'+91 '+d.slice(0,5)+' '+d.slice(5),tel:'+91'+d,wa:'91'+d};return{show:String(v),tel:d?'+'+d:'',wa:d}}
  function cc(ic,en,kn,val,href,ext){var a=el('a','cc'),i=el('i'),d=el('div'),s=el('small');a.href=href;if(ext){a.target='_blank';a.rel='noopener'}i.innerHTML=ic;s.append(bi(en,kn));d.append(s,el('b','',val));a.append(i,d);return a}
  var cg=$('#cards'),cnt=0;
  if(S.phone){var p=fmt(S.phone);if(p.tel){cg.append(cc(IC.phone,'Call us','ಕರೆ ಮಾಡಿ',p.show,'tel:'+p.tel));cnt++}}
  if(S.whatsapp){var w=fmt(S.whatsapp);if(w.wa){cg.append(cc(IC.wa,'WhatsApp','ವಾಟ್ಸಾಪ್',w.show,'https://wa.me/'+w.wa,1));cnt++}}
  if(S.email&&V.isEmail(String(S.email))){cg.append(cc(IC.mail,'Email','ಇಮೇಲ್',S.email,'mailto:'+S.email));cnt++}
  if(S.address){cg.append(cc(IC.pin,'Visit us','ಭೇಟಿ ನೀಡಿ',S.address,'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(S.address),1));cnt++}
  $('#c-e').hidden=cnt>0;
  var so=[['instagram_url','Instagram',IC.ig],['facebook_url','Facebook',IC.fb],['youtube_url','YouTube',IC.yt],['x_url','X',IC.x]],sc=0;
  so.forEach(function(q){var u=safe(S[q[0]]);if(!u)return;var a=el('a','sb');a.href=u;a.target='_blank';a.rel='noopener';a.setAttribute('aria-label',q[1]);a.title=q[1];a.innerHTML=q[2];$('#srow').append(a);sc++});
  $('#csoc').hidden=!sc;hideLoader();
})().catch(function(){hideLoader()});
function joined(d){var link=location.origin+'/?ref='+d.ref_code,w=el('div','ask'),card=el('a','btn main'),wa=el('a','btn'),cp=el('button','btn');
  card.href='/card?c='+encodeURIComponent(d.card_code);card.append(bi('Get my supporter card','ನನ್ನ ಬೆಂಬಲಿಗ ಕಾರ್ಡ್ ಪಡೆಯಿರಿ'));
  wa.href='https://wa.me/?text='+encodeURIComponent('I joined the movement with Punith Reddy, BJP Yuva Morcha, Bengaluru South District. Join me: '+link);wa.target='_blank';wa.rel='noopener';wa.append(bi('Invite friends on WhatsApp','ವಾಟ್ಸಾಪ್‌ನಲ್ಲಿ ಸ್ನೇಹಿತರನ್ನು ಆಹ್ವಾನಿಸಿ'));
  cp.type='button';cp.append(bi('Copy my link','ನನ್ನ ಲಿಂಕ್ ನಕಲಿಸಿ'));cp.onclick=function(){if(navigator.clipboard)navigator.clipboard.writeText(link).then(function(){toast('Link copied')})};
  var row=el('div','arow');row.style.flexDirection='column';row.append(card,wa,cp);
  w.append(el('div','aic','✓'),el('h3','','Welcome to the movement!'),el('p','','Save your supporter card now. It cannot be recovered later. Every friend who joins with your link is counted for you. / ನಿಮ್ಮ ಕಾರ್ಡ್ ಈಗಲೇ ಉಳಿಸಿ.'),row);openModal(w,'askbox')}
async function rsvp(o,left){
  var s=await sb.auth.getSession(),u=s.data.session&&s.data.session.user;
  if(!u){var go=el('a','btn main'),d=el('div','ask');go.href='/citizen?next='+encodeURIComponent('/#events');go.append(bi('Sign in or create account','ಲಾಗಿನ್ ಅಥವಾ ಖಾತೆ ರಚಿಸಿ'));
    d.append(el('div','aic','🔒'),el('h3','','Sign in to book your ticket'),el('p','','Tickets are linked to your citizen account, so only you can use them. It takes under a minute. / ಟಿಕೆಟ್‌ಗಳು ನಿಮ್ಮ ನಾಗರಿಕ ಖಾತೆಗೆ ಲಿಂಕ್ ಆಗಿರುತ್ತವೆ.'),go);openModal(d,'askbox');return}
  var P=await sb.from('profiles').select('full_name,phone').eq('id',u.id).maybeSingle(),pf=P.data||{},max=left?Math.min(left,20):20;
  var w=el('form','frm'),h=el('h3');w.noValidate=true;h.append(B(o,'title'));w.append(h);
  w.insertAdjacentHTML('beforeend','<input class="hp" name="website" tabindex="-1" autocomplete="off" aria-hidden="true"><label class="f"><span>Name / ಹೆಸರು</span><input name="pname" data-v="name" maxlength="100"></label><label class="f"><span>Mobile (10 digits) / ಮೊಬೈಲ್ (10 ಅಂಕಿ)</span><input name="pphone" data-v="phone" type="tel"></label><label class="f"><span>Guests (max '+max+') / ಅತಿಥಿಗಳು</span><input name="guests" type="number" min="1" max="'+max+'" value="1"></label><label class="chk"><input type="checkbox" name="ok" data-v="check"><span>I agree to the <a href="/privacy" target="_blank">privacy policy</a>. / ನಾನು <a href="/privacy" target="_blank">ಗೌಪ್ಯತಾ ನೀತಿ</a>ಗೆ ಒಪ್ಪುತ್ತೇನೆ.</span></label><button class="btn main" type="submit">Book my ticket · ಟಿಕೆಟ್ ಬುಕ್ ಮಾಡಿ</button>');
  w.elements['pname'].value=V.isName(pf.full_name)?pf.full_name:'';w.elements['pphone'].value=V.isPhone(V.phone(pf.phone))?V.phone(pf.phone):'';V.init(w);
  var close=openModal(w);w.onsubmit=async function(e){e.preventDefault();if(!V.check(w))return;var f=new FormData(w),b=$('button',w);if(f.get('website'))return;
    var g=Math.max(1,Math.min(max,Number(f.get('guests'))||1));busy(b,1);
    var r=await sb.rpc('rsvp_event',{p_event:o.id,p_name:f.get('pname').trim(),p_phone:V.phone(f.get('pphone')),p_guests:g,p_consent:true});busy(b,0);
    if(r.error){toast(fe(r.error),1);return}
    close();var d=el('div','ask');d.append(el('div','aic','✓'),el('h3','','Ticket booked!'),el('p','','Opening your ticket… / ನಿಮ್ಮ ಟಿಕೆಟ್ ತೆರೆಯಲಾಗುತ್ತಿದೆ…'));openModal(d,'askbox');
    Promise.resolve().then(function(){return mail({type:'ticket',code:r.data},true)}).catch(function(){}).then(function(){location.href='/ticket?c='+encodeURIComponent(r.data)})}}
$('#sf').onsubmit=async function(e){e.preventDefault();if(!V.check(e.target))return;var f=new FormData(e.target),b=$('button',e.target);if(f.get('website'))return;if(!CAP.ok(e.target))return;busy(b,1);
  var r=await callFn('public-submit',{kind:'supporter',token:CAP.token(e.target),data:{name:f.get('name').trim(),phone:V.phone(f.get('phone')),area:(f.get('area')||'').trim(),ref:(function(){try{return localStorage.getItem('ref')||''}catch(e){return ''}})(),leaderboard:!!f.get('lb')}});busy(b,0);CAP.reset(e.target);
  if(r.error){toast(r.error.code==='23505'?'You have already joined. Thank you! / ನೀವು ಈಗಾಗಲೇ ಸೇರಿದ್ದೀರಿ. ಧನ್ಯವಾದಗಳು!':r.error.message,r.error.code!=='23505')}
  else{toast('Welcome to the movement! / ಅಭಿಯಾನಕ್ಕೆ ಸ್ವಾಗತ!');if(r.data&&r.data.card_code)joined(r.data);e.target.reset();var n=Number($('#sc2').textContent.replace(/,/g,''))+1;$('#sc2').textContent=n.toLocaleString('en-IN');$('#sc').textContent=n.toLocaleString('en-IN')}};
logVisit();
