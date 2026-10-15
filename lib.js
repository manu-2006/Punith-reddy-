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
  function close(){if(closed)return;closed=true;m.classList.add('out');setTimeout(function(){m.remove()},200);document.removeEventListener('keydown',k);
    if(!document.querySelector('.modal:not(.out)'))document.body.style.overflow='';if(prev&&prev.focus)try{prev.focus()}catch(e){}if(onClose)onClose()}
  function k(e){if(e.key==='Escape'){var o=$$('.modal:not(.out)');if(o[o.length-1]===m)close()}}
  x.onclick=close;m.onmousedown=function(e){if(e.target===m)close()};document.addEventListener('keydown',k);
  box.append(x,node);m.append(box);document.body.append(m);document.body.style.overflow='hidden';return close};
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
