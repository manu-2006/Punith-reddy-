initLang();
var app=$('#app'),code=(new URLSearchParams(location.search).get('c')||'').toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,14),T=null;
var BR='BJP Yuva Morcha · Bengaluru South District',BRK='ಬಿಜೆಪಿ ಯುವ ಮೋರ್ಚಾ · ಬೆಂಗಳೂರು ದಕ್ಷಿಣ ಜಿಲ್ಲೆ';
function qrCanvas(text,size){var qr=qrcode(0,'M');qr.addData(text);qr.make();var n=qr.getModuleCount(),m=2,cs=Math.max(2,Math.floor(size/(n+m*2))),s=cs*(n+m*2),c=document.createElement('canvas');c.width=c.height=s;var x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,s,s);x.fillStyle='#0B3B2B';for(var r=0;r<n;r++)for(var k=0;k<n;k++)if(qr.isDark(r,k))x.fillRect((k+m)*cs,(r+m)*cs,cs,cs);return c}
function url(){return location.origin+'/ticket?c='+code}
function when(l){if(!T.starts_at)return'To be announced';return new Date(T.starts_at).toLocaleString(l==='kn'?'kn-IN':'en-IN',{weekday:'short',day:'numeric',month:'long',year:'numeric',hour:'numeric',minute:'2-digit'})}
function dd(k,kn,en,knv,full){var d=el('div',full?'full':'');d.append(el('dt','',''),el('dd'));$('dt',d).append(bi(k,kn));$('dd',d).append(typeof en==='string'?bi(en,knv):en);return d}
function render(){
  app.replaceChildren();
  if(!T){var n=el('div','nf');n.innerHTML='<h1><span class="en">Ticket not found</span><span class="kn">ಟಿಕೆಟ್ ಸಿಗಲಿಲ್ಲ</span></h1><p><span class="en">Please check the link or QR code, or contact the organisers.</span><span class="kn">ದಯವಿಟ್ಟು ಲಿಂಕ್ ಅಥವಾ QR ಕೋಡ್ ಪರಿಶೀಲಿಸಿ, ಅಥವಾ ಆಯೋಜಕರನ್ನು ಸಂಪರ್ಕಿಸಿ.</span></p><a class="btn main" href="/"><span class="en">Back to website</span><span class="kn">ವೆಬ್‌ಸೈಟ್‌ಗೆ</span></a>';app.append(n);return}
  var tk=el('div','tk'),hd=el('div','hd2'),bd=el('div','bd2'),cut=el('div','cut'),qr=el('div','qr2');
  hd.innerHTML='<div class="tri"></div><div class="brand2"><b>PR</b><div><strong><span class="en">Punith Reddy</span><span class="kn">ಪುನೀತ್ ರೆಡ್ಡಿ</span></strong><small><span class="en">'+BR+'</span><span class="kn">'+BRK+'</span></small></div></div><span class="tag2"><span class="en">EVENT TICKET</span><span class="kn">ಟಿಕೆಟ್</span></span>';
  var h=el('h2');h.append(bi(T.title_en,T.title_kn));bd.append(h);
  var dl=el('dl'),dw=el('div'),dk=el('div');dw.append(el('span','en',when('en')),el('span','kn',when('kn')));
  dl.append(dd('Date & time','ದಿನಾಂಕ ಮತ್ತು ಸಮಯ',dw,null,1));
  if(T.location)dl.append(dd('Venue','ಸ್ಥಳ',T.location,T.location,1));
  dl.append(dd('Name','ಹೆಸರು',T.name,T.name),dd('Guests','ಅತಿಥಿಗಳು',String(T.guests),String(T.guests)),dd('Ticket code','ಟಿಕೆಟ್ ಕೋಡ್',T.code,T.code,1));
  bd.append(dl);cut.innerHTML='<i></i>';
  var c=qrCanvas(url(),520);qr.append(c);var p=el('p','',T.code);qr.append(p);var sm=el('small');sm.append(bi('Show this QR at the entrance. One ticket admits '+T.guests+' guest'+(T.guests>1?'s':'')+'.','ಪ್ರವೇಶದ್ವಾರದಲ್ಲಿ ಈ QR ತೋರಿಸಿ. ಒಂದು ಟಿಕೆಟ್ '+T.guests+' ಅತಿಥಿ(ಗಳಿಗೆ) ಮಾನ್ಯ.'));qr.append(sm);
  if(T.checked_in){var ch=el('span','chk2');ch.append(bi('Checked in ✓','ಪ್ರವೇಶ ದೃಢೀಕರಿಸಲಾಗಿದೆ ✓'));qr.append(ch)}
  tk.append(hd,bd,cut,qr);app.append(tk);
  var ac=el('div','acts'),dl2=el('button','btn main'),sh=el('button','btn'),ic=el('button','btn');dl2.append(bi('Download ticket','ಟಿಕೆಟ್ ಡೌನ್‌ಲೋಡ್'));sh.append(bi('Share','ಹಂಚಿಕೊಳ್ಳಿ'));ic.append(bi('Add to calendar','ಕ್ಯಾಲೆಂಡರ್‌ಗೆ ಸೇರಿಸಿ'));
  dl2.onclick=async function(){busy(dl2,1);try{var b=await png();var a=el('a');a.href=URL.createObjectURL(b);a.download='ticket-'+code+'.png';a.click()}catch(e){toast('Could not create the image. Please try again.',1)}busy(dl2,0)};
  sh.onclick=async function(){try{var b=await png(),f=new File([b],'ticket-'+code+'.png',{type:'image/png'});if(navigator.canShare&&navigator.canShare({files:[f]}))await navigator.share({files:[f],title:'Event ticket',text:T.title_en});else if(navigator.share)await navigator.share({title:'Event ticket',url:url()});else{await navigator.clipboard.writeText(url());toast('Ticket link copied')}}catch(e){}};
  ic.onclick=function(){if(!T.starts_at){toast('The event date is not fixed yet.',1);return}var s=new Date(T.starts_at),e=new Date(s.getTime()+2*36e5),f=function(d){return d.toISOString().replace(/[-:]/g,'').split('.')[0]+'Z'};
    var ics=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Punith Reddy//Tickets//EN','BEGIN:VEVENT','UID:'+code+'@punithreddy','DTSTAMP:'+f(new Date()),'DTSTART:'+f(s),'DTEND:'+f(e),'SUMMARY:'+(T.title_en||T.title_kn||'Event'),'LOCATION:'+(T.location||''),'END:VEVENT','END:VCALENDAR'].join('\r\n'),a=el('a');a.href=URL.createObjectURL(new Blob([ics],{type:'text/calendar'}));a.download='event.ics';a.click()};
  ac.append(dl2,sh,ic);app.append(ac)}
async function png(){
  try{await Promise.all([document.fonts.load('800 60px "Anek Kannada"'),document.fonts.load('500 34px "Anek Kannada"')])}catch(e){}
  var W=1080,H=1640,c=document.createElement('canvas');c.width=W;c.height=H;var x=c.getContext('2d'),F='"Anek Kannada",system-ui,sans-serif';
  function rr(a,b,w,h,r,fill){x.beginPath();x.roundRect(a,b,w,h,r);x.fillStyle=fill;x.fill()}
  var g=x.createLinearGradient(0,0,W,H);g.addColorStop(0,'#0E4A36');g.addColorStop(1,'#03110C');x.fillStyle=g;x.fillRect(0,0,W,H);
  rr(70,70,940,1500,48,'#FFFAF2');x.save();x.beginPath();x.roundRect(70,70,940,1500,48);x.clip();
  var h=x.createLinearGradient(0,70,W,330);h.addColorStop(0,'#0B3B2B');h.addColorStop(1,'#0E4A36');x.fillStyle=h;x.fillRect(70,70,940,300);
  x.fillStyle='#FF9933';x.fillRect(70,70,314,12);x.fillStyle='#fff';x.fillRect(384,70,314,12);x.fillStyle='#138808';x.fillRect(698,70,312,12);
  var m=x.createLinearGradient(120,0,220,0);m.addColorStop(0,'#FF9933');m.addColorStop(1,'#F6C453');x.beginPath();x.arc(170,190,56,0,7);x.fillStyle=m;x.fill();x.fillStyle='#1F1611';x.font='800 46px '+F;x.textAlign='center';x.fillText('PR',170,206);
  x.textAlign='left';x.fillStyle='#FFF4E2';x.font='800 50px '+F;x.fillText('Punith Reddy  ·  ಪುನೀತ್ ರೆಡ್ಡಿ',250,185);x.font='500 28px '+F;x.fillStyle='rgba(255,244,226,.85)';x.fillText(BR,250,232);x.fillText(BRK,250,274);
  x.fillStyle='#F6C453';x.font='800 26px '+F;x.textAlign='right';x.fillText('EVENT TICKET · ಟಿಕೆಟ್',960,128);x.textAlign='left';
  function wrap(t,a,b,mw,lh,font,col){x.font=font;x.fillStyle=col;var w=String(t||'').split(' '),l='';for(var i=0;i<w.length;i++){var tt=l?l+' '+w[i]:w[i];if(x.measureText(tt).width>mw&&l){x.fillText(l,a,b);b+=lh;l=w[i]}else l=tt}x.fillText(l,a,b);return b+lh}
  var y=wrap(T.title_en,120,450,840,60,'800 52px '+F,'#1F1611');if(T.title_kn&&T.title_kn!==T.title_en)y=wrap(T.title_kn,120,y,840,60,'700 46px '+F,'#0B3B2B');y+=8;
  function row(lab,val,yy){x.fillStyle='#B35200';x.font='700 24px '+F;x.fillText(lab,120,yy);x.fillStyle='#1F1611';x.font='600 36px '+F;return wrap(val,120,yy+44,840,46,'600 36px '+F,'#1F1611')+10}
  y=row('DATE & TIME · ದಿನಾಂಕ ಮತ್ತು ಸಮಯ',when('en'),y+10);if(T.location)y=row('VENUE · ಸ್ಥಳ',T.location,y);y=row('NAME · ಹೆಸರು',T.name,y);y=row('GUESTS · ಅತಿಥಿಗಳು',String(T.guests),y);
  var cy=Math.max(y+20,1000);x.fillStyle='#07241A';x.beginPath();x.arc(70,cy,30,0,7);x.arc(1010,cy,30,0,7);x.fill();x.strokeStyle='rgba(31,22,17,.3)';x.lineWidth=3;x.setLineDash([14,12]);x.beginPath();x.moveTo(120,cy);x.lineTo(960,cy);x.stroke();x.setLineDash([]);
  var q=qrCanvas(url(),520),qs=Math.min(520,1540-cy-150);x.fillStyle='#fff';rr(540-qs/2-14,cy+40,qs+28,qs+28,24,'#fff');x.drawImage(q,540-qs/2,cy+54,qs,qs);
  x.textAlign='center';x.fillStyle='#1F1611';x.font='800 40px '+F;x.fillText(T.code,540,cy+qs+120);x.fillStyle='#6A5D52';x.font='500 26px '+F;x.fillText('Show this QR at the entrance · ಪ್ರವೇಶದ್ವಾರದಲ್ಲಿ ತೋರಿಸಿ',540,1540);x.restore();
  return new Promise(function(res){c.toBlob(res,'image/png')})}
(async function(){
  if(code.length===14){var r=await sb.rpc('get_ticket',{p_code:code});T=r.data||null}
  render();hideLoader();logVisit()})();
