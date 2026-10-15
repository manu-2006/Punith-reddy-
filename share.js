initLang();
var cv=$('#cv'),x=cv.getContext('2d'),F='"Anek Kannada",system-ui,sans-serif',img=null,theme=0;
var TH=[{n:'Saffron',a:'#FF9933',b:'#D9700A',t:'#1F1611',s:'#FFF4E2',bar:'#0B3B2B'},{n:'Green',a:'#0E4A36',b:'#03110C',t:'#FFF4E2',s:'#F6C453',bar:'#FF9933'},{n:'Gold',a:'#F6C453',b:'#FF9933',t:'#0B3B2B',s:'#1F1611',bar:'#0B3B2B'}];
var th=$('#th');TH.forEach(function(t,i){var b=el('button');b.type='button';b.style.background='linear-gradient(135deg,'+t.a+','+t.b+')';b.setAttribute('aria-label',t.n);b.setAttribute('aria-pressed',String(i===theme));b.onclick=function(){theme=i;$$('button',th).forEach(function(z,k){z.setAttribute('aria-pressed',String(k===i))});draw()};th.append(b)});
function fit(t,mw,size,wt){var s=size;x.font=wt+' '+s+'px '+F;while(x.measureText(t).width>mw&&s>24){s-=2;x.font=wt+' '+s+'px '+F}return s}
async function draw(){
  try{await Promise.all([document.fonts.load('800 60px "Anek Kannada"'),document.fonts.load('600 36px "Anek Kannada"')])}catch(e){}
  var T=TH[theme],W=1080,H=1350,g=x.createLinearGradient(0,0,W,H);g.addColorStop(0,T.a);g.addColorStop(1,T.b);x.fillStyle=g;x.fillRect(0,0,W,H);
  x.fillStyle='rgba(255,255,255,.12)';x.beginPath();x.arc(820,520,430,0,7);x.fill();x.strokeStyle='rgba(255,255,255,.35)';x.lineWidth=3;x.setLineDash([12,14]);x.beginPath();x.arc(820,520,470,0,7);x.stroke();x.setLineDash([]);
  x.fillStyle='#FF9933';x.fillRect(0,0,360,14);x.fillStyle='#fff';x.fillRect(360,0,360,14);x.fillStyle='#138808';x.fillRect(720,0,360,14);
  x.textAlign='left';x.fillStyle=T.s;x.font='700 34px '+F;x.fillText('I SUPPORT  ·  ನಾನು ಬೆಂಬಲಿಸುತ್ತೇನೆ',70,110);
  x.fillStyle=T.t;var s1=fit('PUNITH REDDY',900,150,800);x.fillText('PUNITH REDDY',70,260);x.font='800 90px '+F;var s2=fit('ಪುನೀತ್ ರೆಡ್ಡಿ',900,92,800);x.fillText('ಪುನೀತ್ ರೆಡ್ಡಿ',70,370);
  if(img){var h=1010,w=img.width*h/img.height;if(w>1000){w=1000;h=img.height*w/img.width}x.drawImage(img,W-w+60,H-h-190,w,h)}
  else{x.fillStyle='rgba(255,255,255,.2)';x.font='800 420px '+F;x.textAlign='center';x.fillText('PR',760,860);x.textAlign='left'}
  x.fillStyle=T.bar;x.fillRect(0,H-210,W,210);x.fillStyle='#FFF4E2';x.font='700 38px '+F;x.textAlign='left';
  var nm=($('#nm').value||'').trim(),wd=($('#wd').value||'').trim(),line=nm?('— '+nm+(wd?', '+wd:'')):'— Add your name';fit(line,940,50,800);x.font='800 '+fit(line,940,50,800)+'px '+F;x.fillStyle='#F6C453';x.fillText(line,70,H-130);
  x.fillStyle='#FFF4E2';x.font='600 30px '+F;x.fillText('BJP Yuva Morcha · Bengaluru South District',70,H-82);x.font='500 28px '+F;x.fillStyle='rgba(255,244,226,.85)';x.fillText('ಬಿಜೆಪಿ ಯುವ ಮೋರ್ಚಾ · ಬೆಂಗಳೂರು ದಕ್ಷಿಣ ಜಿಲ್ಲೆ',70,H-40);
}
function blob(){return new Promise(function(r){cv.toBlob(r,'image/png')})}
$('#dl').onclick=async function(){var b=await blob(),a=el('a');a.href=URL.createObjectURL(b);a.download='i-support-punith-reddy.png';a.click();toast('Card saved')};
$('#sh').onclick=async function(){try{var b=await blob(),f=new File([b],'i-support-punith-reddy.png',{type:'image/png'}),t='I support Punith Reddy, BJP Yuva Morcha, Bengaluru South District. '+location.origin;
  if(navigator.canShare&&navigator.canShare({files:[f]}))await navigator.share({files:[f],text:t});else if(navigator.share)await navigator.share({text:t,url:location.origin});else{await navigator.clipboard.writeText(t);toast('Link copied. Download the card and attach it.')}}catch(e){}};
['nm','wd'].forEach(function(i){$('#'+i).oninput=function(){draw()}});
(async function(){
  var r=await sb.from('site_settings').select('hero_image_url').maybeSingle(),u=r.data&&safe(r.data.hero_image_url);
  if(u){await new Promise(function(res){var i=new Image();i.crossOrigin='anonymous';i.onload=function(){img=i;res()};i.onerror=function(){res()};i.src=u})}
  await draw();hideLoader();logVisit()})();
