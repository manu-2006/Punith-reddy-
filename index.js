initLang();(function(){for(var i=0;i<3;i++)$('#nw').append(el('div','sk'));$('#ev').append(el('div','sk wide'),el('div','sk wide'))})();
var hero=$('.hero');
if(!matchMedia('(prefers-reduced-motion:reduce)').matches)hero.addEventListener('pointermove',function(e){var r=hero.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;hero.style.setProperty('--mx',(x*100)+'%');hero.style.setProperty('--my',(y*100)+'%');hero.style.setProperty('--px',(x-.5).toFixed(3));hero.style.setProperty('--py',(y-.5).toFixed(3))});
function count(id,n){var e=document.getElementById(id),t=0,s=Math.max(1,Math.ceil(n/40));(function f(){t=Math.min(n,t+s);e.textContent=t.toLocaleString('en-IN');if(t<n)requestAnimationFrame(f)})()}
async function get(t,fn){try{var r=await fn(sb.from(t).select('*').eq('status','published'));return r.data||[]}catch(e){return[]}}
function vinfo(v){var u=v.video_url||v.external_url||v.youtube_url||'',k='link',id='',yt=u.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/),ig=u.match(/instagram\.com\/(?:reel|reels|p|tv)\/([\w-]+)/);
  if(v.source_type==='upload'||/^video\//.test(v.mime_type||'')||/\.(mp4|webm|mov)(\?|$)/i.test(u))k='file';else if(yt){k='yt';id=yt[1]}else if(ig){k='ig';id=ig[1]}return{u:u,k:k,id:id}}
function playVideo(v){var i=vinfo(v),n;
  if(i.k==='yt'){n=el('iframe');n.src='https://www.youtube-nocookie.com/embed/'+i.id+'?autoplay=1&rel=0';n.allow='autoplay; encrypted-media; picture-in-picture';n.allowFullscreen=true}
  else if(i.k==='file'){n=el('video');n.src=i.u;n.controls=true;n.autoplay=true;n.playsInline=true}
  else if(i.k==='ig'){n=el('iframe','ig');n.src='https://www.instagram.com/p/'+i.id+'/embed';n.allow='encrypted-media'}
  else{if(safe(i.u))window.open(i.u,'_blank','noopener');return}
  openModal(n,'wide')}
(async function(){
  var R=await Promise.all([sb.from('site_settings').select('*').maybeSingle().then(function(r){return r.data||{}},function(){return{}}),
    get('site_notifications',function(q){return q.order('created_at',{ascending:false}).limit(1)}),
    get('news',function(q){return q.order('published_at',{ascending:false,nullsFirst:false}).limit(9)}),
    get('events',function(q){return q.order('starts_at',{ascending:true})}),
    get('gallery',function(q){return q.order('sort_order')}),get('videos',function(q){return q.order('sort_order')}),
    get('achievements',function(q){return q.order('sort_order')}),get('youth_initiatives',function(q){return q.order('sort_order')}),
    get('service_activities',function(q){return q.order('sort_order')}),
    sb.rpc('supporter_count').then(function(r){return Number(r.data)||0},function(){return 0})]);
  var S=R[0],N=R[1],news=R[2],ev=R[3],gal=R[4],vid=R[5],ach=R[6],yi=R[7],sa=R[8],sup=R[9];
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
    rs.append(bi('RSVP','ನೋಂದಣಿ'));rs.onclick=function(){rsvp(o)};r.append(d,b,rs);E.append(r)});
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
  /* contact info */
  var ci=$('#ci');[['phone','📞'],['email','✉️'],['address','📍']].forEach(function(p){if(S[p[0]]){var d=el('div','',p[1]+' '+S[p[0]]);ci.append(d)}});
  var soc=el('div');soc.style.marginTop='10px';[['whatsapp','WhatsApp',function(v){return 'https://wa.me/'+String(v).replace(/\D/g,'')}],['instagram_url','Instagram'],['facebook_url','Facebook'],['youtube_url','YouTube'],['x_url','X']].forEach(function(p){var v=S[p[0]];if(!v)return;var u=p[2]?p[2](v):safe(v);if(!u)return;var a=el('a','',p[1]);a.href=u;a.target='_blank';a.rel='noopener';a.style.marginRight='16px';a.style.fontWeight='700';soc.append(a)});ci.append(soc);hideLoader();
})().catch(function(){hideLoader()});
function rsvp(o){var w=el('form','frm'),h=el('h3');h.append(B(o,'title'));w.append(h);
  w.innerHTML+='<input class="hp" name="website" tabindex="-1" autocomplete="off" aria-hidden="true"><label class="f"><span>Name / ಹೆಸರು</span><input name="name" required minlength="2" maxlength="100"></label><label class="f"><span>Phone / ಫೋನ್</span><input name="phone" type="tel" required minlength="7" maxlength="30"></label><label class="f"><span>Guests / ಅತಿಥಿಗಳು</span><input name="guests" type="number" min="1" max="20" value="1"></label><button class="btn main" type="submit">Get my ticket · ಟಿಕೆಟ್ ಪಡೆಯಿರಿ</button>';
  var close=openModal(w);w.onsubmit=async function(e){e.preventDefault();var f=new FormData(w),b=$('button',w);if(f.get('website'))return;busy(b,1);
    var r=await sb.rpc('rsvp_event',{p_event:o.id,p_name:f.get('name').trim(),p_phone:f.get('phone').trim(),p_guests:Number(f.get('guests'))||1});busy(b,0);
    if(r.error){toast(r.error.code==='23505'?'You are already registered. Open your Citizen dashboard to see your ticket. / ನೀವು ಈಗಾಗಲೇ ನೋಂದಾಯಿಸಿದ್ದೀರಿ.':fe(r.error),1);return}
    close();var d=el('div','ask'),a=el('a','btn main');a.href='/ticket?c='+encodeURIComponent(r.data);a.append(bi('View my ticket','ನನ್ನ ಟಿಕೆಟ್ ನೋಡಿ'));
    d.append(el('div','aic','✓'),el('h3','','You are registered!'),el('p','','Your ticket has a QR code. Save it and show it at the entrance. / ನಿಮ್ಮ ಟಿಕೆಟ್‌ನಲ್ಲಿ QR ಕೋಡ್ ಇದೆ.'),a);openModal(d,'askbox')}}
$('#sf').onsubmit=async function(e){e.preventDefault();var f=new FormData(e.target),b=$('button',e.target);if(f.get('website'))return;busy(b,1);
  var r=await sb.from('supporters').insert({name:f.get('name').trim(),phone:f.get('phone').trim(),area:(f.get('area')||'').trim()||null});busy(b,0);
  if(r.error){toast(r.error.code==='23505'?'You have already joined. Thank you! / ನೀವು ಈಗಾಗಲೇ ಸೇರಿದ್ದೀರಿ. ಧನ್ಯವಾದಗಳು!':fe(r.error),r.error.code!=='23505')}
  else{toast('Welcome to the movement! / ಅಭಿಯಾನಕ್ಕೆ ಸ್ವಾಗತ!');e.target.reset();var n=Number($('#sc2').textContent.replace(/,/g,''))+1;$('#sc2').textContent=n.toLocaleString('en-IN');$('#sc').textContent=n.toLocaleString('en-IN')}};
$('#cf').onsubmit=async function(e){e.preventDefault();var f=new FormData(e.target),b=$('button',e.target);if(f.get('website'))return;busy(b,1);
  var r=await sb.from('contact_messages').insert({name:f.get('name').trim(),phone:f.get('phone')||null,email:f.get('email')||null,subject:f.get('subject')||null,message:f.get('message').trim()});busy(b,0);
  if(r.error)toast(fe(r.error),1);else{toast('Message sent. Thank you! / ಸಂದೇಶ ಕಳುಹಿಸಲಾಗಿದೆ.');e.target.reset()}};
logVisit();
