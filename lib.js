(function(){
var U='https://cqmtheiotinwjwhqopkq.supabase.co',K='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxbXRoZWlvdGlud2p3aHFvcGtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA1MzAzMzEsImV4cCI6MjEwNjEwNjMzMX0.T2dXgr9pS3X1eaEw71_xAgB-_mXMoRQXqVatKXZAYQE';
window.sb=supabase.createClient(U,K);
window.$=function(s,r){return (r||document).querySelector(s)};
window.$$=function(s,r){return Array.from((r||document).querySelectorAll(s))};
window.el=function(t,c){var e=document.createElement(t);if(c)e.className=c;for(var i=2;i<arguments.length;i++)e.append(arguments[i]);return e};
window.bi=function(en,kn){var f=document.createDocumentFragment();f.append(el('span','en',en||kn||''),el('span','kn',kn||en||''));return f};
window.B=function(o,k){return bi(o[k+'_en'],o[k+'_kn'])};
window.safe=function(u){return /^https?:\/\//i.test(u||'')?u:''};
var DO={day:'numeric',month:'short',year:'numeric'};
window.fdate=function(d,time){if(!d)return document.createDocumentFragment();var x=new Date(d),o=time?Object.assign({hour:'numeric',minute:'2-digit'},DO):DO,f=document.createDocumentFragment();
  f.append(el('span','en',x.toLocaleString('en-IN',o)),el('span','kn',x.toLocaleString('kn-IN',o)));return f};
window.setLang=function(l){document.documentElement.lang=l;try{localStorage.setItem('lang',l)}catch(e){}$$('.lang button').forEach(function(b){b.setAttribute('aria-pressed',String(b.dataset.l===l))})};
window.initLang=function(){var l='en';try{l=localStorage.getItem('lang')||((navigator.language||'').indexOf('kn')===0?'kn':'en')}catch(e){}setLang(l);$$('.lang button').forEach(function(b){b.onclick=function(){setLang(b.dataset.l)}})};
window.toast=function(m,bad){var t=el('div','toast'+(bad?' bad':''),m);document.body.append(t);setTimeout(function(){t.classList.add('out');setTimeout(function(){t.remove()},400)},3800)};
window.dec=function(s){var t=document.createElement('textarea');t.innerHTML=s;return t.value};
window.translate=async function(text,from,to){
  var parts=text.match(/[^.!?।\n]+[.!?।\n]*\s*/g)||[text],chunks=[],cur='';
  parts.forEach(function(p){if((cur+p).length>420){if(cur)chunks.push(cur);cur=p}else cur+=p});if(cur)chunks.push(cur);
  var out=[];
  for(var i=0;i<chunks.length;i++){
    var r=await fetch('https://api.mymemory.translated.net/get?q='+encodeURIComponent(chunks[i])+'&langpair='+from+'|'+to),j=await r.json();
    var o=j&&j.responseData&&j.responseData.translatedText;
    if(!o||Number(j.responseStatus)!==200||/MYMEMORY WARNING/i.test(o))throw new Error('translate');
    out.push(dec(o).trim());
  }
  return out.join(' ');
};
window.openModal=function(node,cls){
  var m=el('div','modal'),box=el('div','mbox '+(cls||'')),x=el('button','mx','×');x.setAttribute('aria-label','Close');
  function close(){m.remove();document.body.style.overflow='';document.removeEventListener('keydown',k)}
  function k(e){if(e.key==='Escape')close()}
  x.onclick=close;m.onclick=function(e){if(e.target===m)close()};document.addEventListener('keydown',k);
  box.append(x,node);m.append(box);document.body.append(m);document.body.style.overflow='hidden';return close;
};
window.logVisit=function(){try{if(sessionStorage.getItem('v:'+location.pathname))return;sessionStorage.setItem('v:'+location.pathname,1)}catch(e){}
  sb.from('site_visits').insert({path:location.pathname.slice(0,120),lang:document.documentElement.lang==='kn'?'kn':'en'}).then(function(){},function(){})};
})();
(function(){
window.openModal=function(node,cls,onClose){
  var m=el('div','modal'),box=el('div','mbox '+(cls||'')),x=el('button','mx','×'),prev=document.activeElement,closed=false;
  m.setAttribute('role','dialog');m.setAttribute('aria-modal','true');x.type='button';x.setAttribute('aria-label','Close');
  function focusable(){return Array.from(box.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])')).filter(function(e){return !e.hidden&&e.getAttribute('aria-hidden')!=='true'&&e.getClientRects().length})}
  function close(){if(closed)return;closed=true;m.classList.add('out');setTimeout(function(){m.remove()},200);document.removeEventListener('keydown',k);
    if(!document.querySelector('.modal:not(.out)'))document.body.style.overflow='';if(prev&&prev.focus)try{prev.focus()}catch(e){}if(onClose)onClose()}
  function k(e){var o=$('.modal:not(.out)');if(o[o.length-1]!==m)return;if(e.key==='Escape'){close();return}if(e.key==='Tab'){var f=focusable();if(!f.length){e.preventDefault();x.focus();return}var first=f[0],last=f[f.length-1];if(e.shiftKey&&(document.activeElement===first||!box.contains(document.activeElement))){e.preventDefault();last.focus()}else if(!e.shiftKey&&(document.activeElement===last||!box.contains(document.activeElement))){e.preventDefault();first.focus()}}}
  x.onclick=close;m.onmousedown=function(e){if(e.target===m)close()};document.addEventListener('keydown',k);
  box.append(x,node);m.append(box);document.body.append(m);document.body.style.overflow='hidden';setTimeout(function(){var f=focusable();(f[1]||f[0]||x).focus()},0);return close};
window.toast=function(msg,bad){var h=document.getElementById('toasts');if(!h){h=el('div');h.id='toasts';h.setAttribute('aria-live','polite');document.body.append(h)}
  var t=el('div','toast'+(bad?' bad':''),el('i','ti',bad?'!':'✓'),el('span','tm',msg),el('b','tp'));h.append(t);
  setTimeout(function(){t.classList.add('out');setTimeout(function(){t.remove()},350)},bad?5200:3600)};
window.fe=function(e){var m=(e&&(e.message||e.msg||e.error_description))||String(e||''),c=e&&e.code;
  if(/Invalid login credentials/i.test(m))return 'The email or password is not correct.';
  if(/Email not confirmed/i.test(m))return 'Please confirm your email first. Check your inbox.';
  if(/already registered/i.test(m))return 'An account with this email already exists. Try signing in.';
  if(/rate limit|too many requests/i.test(m))return 'Too many attempts. Please wait a minute and try again.';
  if(!navigator.onLine||/fetch|network|Failed to|Load failed/i.test(m))return 'Can’t reach the server. Please check your internet connection.';
  if(c==='42501'||/row-level security|permission denied/i.test(m))return 'You don’t have permission to do that.';
  if(c==='23505'||/duplicate key/i.test(m))return 'This already exists.';
  if(/At least one admin|Too many submissions|Not allowed|Please write|not connected|Event not found|Password should/i.test(m))return m;
  return 'Something went wrong. Please try again.'};
window.ask=function(o){return new Promise(function(res){
  var box=el('div','ask'),ic=el('div','aic'+(o.danger?' danger':''),o.icon||(o.danger?'!':'?')),h=el('h3','',o.title||'Are you sure?'),inp,row=el('div','arow'),done=false,close;
  box.append(ic,h);if(o.msg)box.append(el('p','',o.msg));
  if(o.input){inp=el('input');inp.type=o.type||'text';inp.placeholder=o.ph||'';inp.value=o.value||'';box.append(inp)}
  var no=el('button','btn',o.cancel||'Cancel'),yes=el('button','btn main'+(o.danger?' danger':''),o.ok||'Continue');no.type=yes.type='button';
  function fin(v){if(done)return;done=true;close();res(v)}
  no.onclick=function(){fin(o.input?null:false)};yes.onclick=function(){fin(o.input?((inp.value||'').trim()||null):true)};
  if(inp)inp.onkeydown=function(e){if(e.key==='Enter')yes.click()};
  row.append(no,yes);box.append(row);
  close=openModal(box,'askbox',function(){if(!done){done=true;res(o.input?null:false)}});setTimeout(function(){(inp||yes).focus()},60)})};
window.sure=function(msg,title,ok){return ask({title:title||'Are you sure?',msg:msg,danger:true,ok:ok||'Yes, delete',cancel:'Keep it'})};
window.askText=function(title,msg,ph,type){return ask({title:title,msg:msg,input:1,ph:ph,type:type,ok:'Continue'})};
window.busy=function(b,on){if(!b)return;b.classList.toggle('busy',!!on);b.disabled=!!on};
window.hideLoader=function(){var l=document.getElementById('ldr');if(l){l.classList.add('done');setTimeout(function(){l.remove()},800)}};
})();
(function(){
window.PV='2026-10';
var MSG={phone:['Enter a valid 10-digit mobile number (digits only).','ಮಾನ್ಯ 10 ಅಂಕಿಗಳ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ (ಅಂಕೆಗಳು ಮಾತ್ರ).'],email:['Enter a valid email address.','ಮಾನ್ಯ ಇಮೇಲ್ ವಿಳಾಸ ನಮೂದಿಸಿ.'],name:['Enter a valid name (letters only, at least 2 characters).','ಮಾನ್ಯ ಹೆಸರು ನಮೂದಿಸಿ (ಅಕ್ಷರಗಳು ಮಾತ್ರ, ಕನಿಷ್ಠ 2).'],req:['This field is required.','ಈ ಕ್ಷೇತ್ರ ಅಗತ್ಯ.'],check:['Please accept the privacy policy to continue.','ಮುಂದುವರಿಯಲು ಗೌಪ್ಯತಾ ನೀತಿಗೆ ಒಪ್ಪಿಗೆ ನೀಡಿ.'],min:['Please write a little more.','ದಯವಿಟ್ಟು ಇನ್ನಷ್ಟು ವಿವರಿಸಿ.'],pw:['Use at least 10 characters, with letters and numbers.','ಕನಿಷ್ಠ 10 ಅಕ್ಷರಗಳು, ಅಕ್ಷರ ಮತ್ತು ಸಂಖ್ಯೆ ಬಳಸಿ.']};
window.V={
 phone:function(v){var d=String(v||'').replace(/\D/g,'');if(d.length===12&&d.indexOf('91')===0)d=d.slice(2);if(d.length===11&&d[0]==='0')d=d.slice(1);return d},
 isPhone:function(d){return /^[6-9][0-9]{9}$/.test(d)},
 isEmail:function(v){return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)&&v.length<=254},
 isName:function(v){v=(v||'').trim();return v.length>=2&&v.length<=100&&!/[0-9<>@#$%^*=+|~_{}]/.test(v)},
 isPw:function(v){return v.length>=10&&/[A-Za-z]/.test(v)&&/[0-9]/.test(v)},
 err:function(inp,k){var n=inp.closest('label,.fld')||inp.parentNode,e=n.querySelector('.ferr');if(!e){e=el('small','ferr');n.append(e)}e.replaceChildren();
  if(k){e.append(bi(MSG[k][0],MSG[k][1]));inp.classList.add('invalid');inp.setAttribute('aria-invalid','true')}else{inp.classList.remove('invalid');inp.removeAttribute('aria-invalid')}},
 check:function(form){var ok=true,first=null;$$('[data-v]',form).forEach(function(i){var t=i.dataset.v,v=i.type==='checkbox'?i.checked:(i.value||'').trim(),opt=i.hasAttribute('data-opt'),k=null;
   if(t==='check'){if(!v)k='check'}else if(!v){if(!opt)k='req'}
   else if(t==='phone'){var d=V.phone(v);if(!V.isPhone(d))k='phone';else{i.value=d;i.dispatchEvent(new Event('input',{bubbles:true}))}}
   else if(t==='email'){if(!V.isEmail(v))k='email'}else if(t==='name'){if(!V.isName(v))k='name'}else if(t==='pw'){if(!V.isPw(i.value))k='pw'}else if(t==='min'){if(v.length<(+i.dataset.min||5))k='min'}
   V.err(i,k);if(k){ok=false;if(!first)first=i}});if(first)try{first.focus()}catch(e){}return ok},
 init:function(root){$$('[data-v=phone]',root).forEach(function(i){i.setAttribute('inputmode','numeric');i.setAttribute('maxlength','20');i.setAttribute('autocomplete','tel-national');i.addEventListener('input',function(){var d=V.phone(i.value);if(i.value!==d.slice(0,10))i.value=d.slice(0,10)})});
  $$('[data-v]',root).forEach(function(i){var c=function(){V.err(i,null)};i.addEventListener('input',c);i.addEventListener('change',c)})}
};
var _fe=window.fe;window.fe=function(e){var m=(e&&(e.message||e.msg))||'',c=e&&e.code;
  if(/sold out|ticket\(s\) are left|accept the privacy|sign in to book|valid 10-digit/i.test(m))return m;
  if(c==='23514'||/violates check constraint/i.test(m))return 'Please check the details you entered. Phone numbers must be exactly 10 digits.';
  return _fe(e)};
window.consentBanner=function(){try{if(localStorage.getItem('pp')===PV)return}catch(e){return}if(/^\/(admin|privacy)/.test(location.pathname)||document.querySelector('.cbn'))return;
  var b=el('div','cbn'),t=el('div','cbt'),a=el('a'),ok=el('button','btn main sm');a.href='/privacy';a.append(bi('Read our privacy policy','ಗೌಪ್ಯತಾ ನೀತಿ ಓದಿ'));
  t.append(bi('We use only essential storage (your language and sign-in). We collect personal details only when you submit a form. ','ನಾವು ಅಗತ್ಯ ಸಂಗ್ರಹಣೆ ಮಾತ್ರ ಬಳಸುತ್ತೇವೆ (ಭಾಷೆ ಮತ್ತು ಲಾಗಿನ್). ನೀವು ಫಾರ್ಮ್ ಸಲ್ಲಿಸಿದಾಗ ಮಾತ್ರ ವೈಯಕ್ತಿಕ ವಿವರ ಸಂಗ್ರಹಿಸುತ್ತೇವೆ. '),a);ok.append(bi('I understand','ಅರ್ಥವಾಯಿತು'));
  ok.onclick=function(){try{localStorage.setItem('pp',PV)}catch(e){}b.remove()};b.append(t,ok);document.body.append(b)};
var _h=window.hideLoader;window.hideLoader=function(){_h();setTimeout(window.consentBanner,1200)};
})();
/* ===== CAPTCHA (Cloudflare Turnstile), edge-function calls and e-mail helpers ===== */
(function(){
var key='',loading=null;
window.CAP={
  setKey:function(k){key=(k||'').trim()},
  on:function(){return !!key},
  load:function(){if(!key)return Promise.resolve(false);if(window.turnstile)return Promise.resolve(true);if(loading)return loading;
    loading=new Promise(function(res){var s=document.createElement('script');s.src='https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';s.async=true;s.onload=function(){res(true)};s.onerror=function(){res(false)};document.head.append(s)});return loading},
  mount:async function(form){if(!key||!form||form.querySelector('.cf-ts'))return;var ok=await CAP.load();if(!ok||!window.turnstile)return;
    var d=el('div','cf-ts'),b=form.querySelector('button[type=submit],button:not([type])');d.style.margin='6px 0';form.insertBefore(d,b||null);
    form.__cap=window.turnstile.render(d,{sitekey:key,theme:'auto',language:'auto'})},
  token:function(form){return(form&&form.__cap!==undefined&&window.turnstile)?window.turnstile.getResponse(form.__cap):null},
  ok:function(form){if(!key)return true;if(form&&CAP.token(form))return true;toast('Please complete the security check first. / ಮೊದಲು ಭದ್ರತಾ ಪರಿಶೀಲನೆ ಪೂರ್ಣಗೊಳಿಸಿ.',1);return false},
  reset:function(form){if(form&&form.__cap!==undefined&&window.turnstile)try{window.turnstile.reset(form.__cap)}catch(e){}},
  init:async function(){try{var r=await sb.from('site_settings').select('turnstile_site_key').maybeSingle();CAP.setKey(r.data&&r.data.turnstile_site_key)}catch(e){}}
};
window.callFn=async function(name,body){var r=await sb.functions.invoke(name,{body:body});
  if(r.error){var m='Something went wrong. Please try again.',c=null;try{var j=await r.error.context.json();if(j&&j.error)m=j.error;c=j&&j.code}catch(e){}return{error:{message:m,code:c}}}return{data:r.data}};
window.mail=function(body,wait){var p=sb.functions.invoke('notify',{body:body}).then(function(r){return r},function(){return null});return wait?Promise.race([p,new Promise(function(r){setTimeout(r,2500)})]):p};
window.resetPw=function(redirect){var f=el('form','frm'),h=el('h3','','Reset your password'),inp=el('input'),go=el('button','btn main'),err=el('small','ferr'),close;
  f.noValidate=true;inp.type='email';inp.placeholder='you@example.com';inp.dataset.v='email';go.type='submit';go.append('Send reset link');
  var lab=el('label','f');lab.append(el('span','','Email'),inp);f.append(h,el('p','','Enter your email and we will send you a reset link.'),lab,go);V.init(f);close=openModal(f,'askbox');CAP.mount(f);
  f.onsubmit=async function(e){e.preventDefault();if(!V.check(f)||!CAP.ok(f))return;busy(go,1);
    var o={redirectTo:redirect},t=CAP.token(f);if(t)o.captchaToken=t;var r=await sb.auth.resetPasswordForEmail(inp.value.trim(),o);busy(go,0);
    if(r.error){toast(fe(r.error),1);CAP.reset(f);return}close();toast('If that email has an account, a reset link is on its way.')}};
})();
