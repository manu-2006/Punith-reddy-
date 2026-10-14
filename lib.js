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
