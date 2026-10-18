initLang();
var app=$('#app'),code=(new URLSearchParams(location.search).get('c')||'').toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,14),C=null;
var BR='BJP Yuva Morcha · Bengaluru South District',BRK='ಬಿಜೆಪಿ ಯುವ ಮೋರ್ಚಾ · ಬೆಂಗಳೂರು ದಕ್ಷಿಣ ಜಿಲ್ಲೆ';
function qrCanvas(text,size){var qr=qrcode(0,'M');qr.addData(text);qr.make();var n=qr.getModuleCount(),m=2,cs=Math.max(2,Math.floor(size/(n+m*2))),s=cs*(n+m*2),c=document.createElement('canvas');c.width=c.height=s;var x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,s,s);x.fillStyle='#0B3B2B';for(var r=0;r<n;r++)for(var k=0;k<n;k++)if(qr.isDark(r,k))x.fillRect((k+m)*cs,(r+m)*cs,cs,cs);return c}
function link(){return location.origin+'/?ref='+C.ref_code}
function since(l){return new Date(C.joined).toLocaleDateString(l==='kn'?'kn-IN':'en-IN',{day:'numeric',month:'long',year:'numeric'})}
function dd(k,kn,v,full){var d=el('div',full?'full':''),a=el('dt'),b=el('dd');a.append(bi(k,kn));if(typeof v==='string')b.append(v);else b.append(v);d.append(a,b);return d}
function render(){
  app.replaceChildren();
  if(!C){var n=el('div','nf');n.innerHTML='<h1><span class="en">Card not found</span><span class="kn">ಕಾರ್ಡ್ ಸಿಗಲಿಲ್ಲ</span></h1><p><span class="en">Please check the link you saved when you joined.</span><span class="kn">ಸೇರುವಾಗ ಉಳಿಸಿದ ಲಿಂಕ್ ಪರಿಶೀಲಿಸಿ.</span></p><a class="btn main" href="/#join"><span class="en">Join the movement</span><span class="kn">ಅಭಿಯಾನಕ್ಕೆ ಸೇರಿ</span></a>';app.append(n);return}
  var tk=el('div','tk'),hd=el('div','hd2'),bd=el('div','bd2'),cut=el('div','cut'),qr=el('div','qr2');
  hd.innerHTML='<div class="tri"></div><div class="brand2"><b>PR</b><div><strong><span class="en">Punith Reddy</span><span class="kn">ಪುನೀತ್ ರೆಡ್ಡಿ</span></strong><small><span class="en">'+BR+'</span><span class="kn">'+BRK+'</span></small></div></div><span class="tag2"><span class="en">SUPPORTER</span><span class="kn">ಬೆಂಬಲಿಗ</span></span>';
  var h=el('h2','',C.name);bd.append(h);var dl=el('dl'),sw=el('div');sw.append(el('span','en',since('en')),el('span','kn',since('kn')));
  dl.append(dd('Supporter ID','ಬೆಂಬಲಿಗ ಐಡಿ',C.ref_code,1),dd('Member since','ಸದಸ್ಯತ್ವ',sw),dd('Friends joined','ಸೇರಿದ ಸ್ನೇಹಿತರು',String(C.referrals)));bd.append(dl);cut.innerHTML='<i></i>';
  qr.append(qrCanvas(link(),520));var sm=el('small');sm.append(bi('Friends who scan this QR join under your name.','ಈ QR ಸ್ಕ್ಯಾನ್ ಮಾಡುವ ಸ್ನೇಹಿತರು ನಿಮ್ಮ ಹೆಸರಿನಲ್ಲಿ ಸೇರುತ್ತಾರೆ.'));qr.append(sm);
  tk.append(hd,bd,cut,qr);app.append(tk);
  var ac=el('div','acts'),dl2=el('button','btn main'),wa=el('a','btn'),cp=el('button','btn');dl2.append(bi('Download card','ಕಾರ್ಡ್ ಡೌನ್‌ಲೋಡ್'));wa.append(bi('Invite on WhatsApp','ವಾಟ್ಸಾಪ್‌ನಲ್ಲಿ ಆಹ್ವಾನಿಸಿ'));cp.append(bi('Copy my link','ನನ್ನ ಲಿಂಕ್ ನಕಲಿಸಿ'));
  wa.href='https://wa.me/?text='+encodeURIComponent('I joined the movement with Punith Reddy, BJP Yuva Morcha, Bengaluru South District. Join me: '+link());wa.target='_blank';wa.rel='noopener';
  cp.onclick=function(){if(navigator.clipboard)navigator.clipboard.writeText(link()).then(function(){toast('Link copied')})};
  dl2.onclick=async function(){busy(dl2,1);try{var b=await png(),a=el('a');a.href=URL.createObjectURL(b);a.download='supporter-card.png';a.click()}catch(e){toast('Could not create the image. Please try again.',1)}busy(dl2,0)};
  ac.append(dl2,wa,cp);app.append(ac)}
async function png(){
  try{await Promise.all([document.fonts.load('800 60px "Anek Kannada"'),document.fonts.load('500 34px "Anek Kannada"')])}catch(e){}
  var W=1080,H=1350,c=document.createElement('canvas');c.width=W;c.height=H;var x=c.getContext('2d'),F='"Anek Kannada",system-ui,sans-serif';
  function rr(a,b,w,h,r,f){x.beginPath();x.roundRect(a,b,w,h,r);x.fillStyle=f;x.fill()}
  var g=x.createLinearGradient(0,0,W,H);g.addColorStop(0,'#0E4A36');g.addColorStop(1,'#03110C');x.fillStyle=g;x.fillRect(0,0,W,H);
  rr(70,70,940,1210,48,'#FFFAF2');x.save();x.beginPath();x.roundRect(70,70,940,1210,48);x.clip();
  var h=x.createLinearGradient(0,70,W,330);h.addColorStop(0,'#0B3B2B');h.addColorStop(1,'#0E4A36');x.fillStyle=h;x.fillRect(70,70,940,300);
  x.fillStyle='#FF9933';x.fillRect(70,70,314,12);x.fillStyle='#fff';x.fillRect(384,70,314,12);x.fillStyle='#138808';x.fillRect(698,70,312,12);
  var m=x.createLinearGradient(120,0,220,0);m.addColorStop(0,'#FF9933');m.addColorStop(1,'#F6C453');x.beginPath();x.arc(170,190,56,0,7);x.fillStyle=m;x.fill();x.fillStyle='#1F1611';x.font='800 46px '+F;x.textAlign='center';x.fillText('PR',170,206);
  x.textAlign='left';x.fillStyle='#FFF4E2';x.font='800 50px '+F;x.fillText('Punith Reddy  ·  ಪುನೀತ್ ರೆಡ್ಡಿ',250,185);x.font='500 28px '+F;x.fillStyle='rgba(255,244,226,.85)';x.fillText(BR,250,232);x.fillText(BRK,250,274);
  x.fillStyle='#F6C453';x.font='800 26px '+F;x.textAlign='right';x.fillText('SUPPORTER · ಬೆಂಬಲಿಗ',960,128);x.textAlign='left';
  x.fillStyle='#1F1611';var s=60;x.font='800 '+s+'px '+F;while(x.measureText(C.name).width>840&&s>30){s-=2;x.font='800 '+s+'px '+F}x.fillText(C.name,120,470);
  function row(l,v,yy){x.fillStyle='#B35200';x.font='700 24px '+F;x.fillText(l,120,yy);x.fillStyle='#1F1611';x.font='600 38px '+F;x.fillText(v,120,yy+48)}
  row('SUPPORTER ID · ಬೆಂಬಲಿಗ ಐಡಿ',C.ref_code,540);row('MEMBER SINCE · ಸದಸ್ಯತ್ವ',since('en'),650);row('FRIENDS JOINED · ಸೇರಿದ ಸ್ನೇಹಿತರು',String(C.referrals),760);
  var q=qrCanvas(link(),520);x.fillStyle='#fff';rr(670,520,290,290,20,'#fff');x.drawImage(q,680,530,270,270);
  x.strokeStyle='rgba(31,22,17,.3)';x.lineWidth=3;x.setLineDash([14,12]);x.beginPath();x.moveTo(120,880);x.lineTo(960,880);x.stroke();x.setLineDash([]);
  x.fillStyle='#0B3B2B';x.font='800 44px '+F;x.textAlign='center';x.fillText('I SUPPORT PUNITH REDDY',540,980);x.font='600 32px '+F;x.fillText('ನಾನು ಪುನೀತ್ ರೆಡ್ಡಿ ಅವರನ್ನು ಬೆಂಬಲಿಸುತ್ತೇನೆ',540,1040);
  x.fillStyle='#6A5D52';x.font='500 26px '+F;x.fillText('Scan the QR to join under my name · ನನ್ನ ಹೆಸರಿನಲ್ಲಿ ಸೇರಲು ಸ್ಕ್ಯಾನ್ ಮಾಡಿ',540,1230);x.restore();
  return new Promise(function(res){c.toBlob(res,'image/png')})}
(async function(){
  var fail=false;if(code.length===14){try{var r=await sb.rpc('get_supporter_card',{p_code:code});if(r.error)fail=true;C=r.data||null}catch(e){fail=true}}
  try{render()}catch(e){}finally{hideLoader()}
  if(fail){toast("Couldn't load the card. Check your connection and try again.",1)}logVisit()})();
