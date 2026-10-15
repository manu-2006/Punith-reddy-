initLang();
var app=$('#app'),mode='in',me=null,prof=null,recovery=false;
var ST={new:['New','ಹೊಸದು',''],in_progress:['In progress','ಪ್ರಗತಿಯಲ್ಲಿದೆ',''],resolved:['Resolved','ಪರಿಹರಿಸಲಾಗಿದೆ','ok'],closed:['Closed','ಮುಚ್ಚಲಾಗಿದೆ','ok'],confirmed:['Confirmed','ದೃಢೀಕರಿಸಲಾಗಿದೆ','ok'],completed:['Completed','ಪೂರ್ಣಗೊಂಡಿದೆ','ok'],cancelled:['Cancelled','ರದ್ದುಗೊಂಡಿದೆ','bad']};
function chip(s){var c=ST[s]||[s,s,''],e=el('span','chip '+c[2]);e.append(bi(c[0],c[1]));return e}
function F(l,kn,html){return '<label class="f"><span>'+l+' / '+kn+'</span>'+html+'</label>'}
function panel(){var p=el('div','panel');for(var i=0;i<arguments.length;i++)p.append(arguments[i]);return p}
function auth(){
  app.replaceChildren();var box=el('div','auth'),p=el('div','panel'),t=el('div','tabs'),f=el('form','frm'),err=el('div','err');
  [['in','Sign in','ಲಾಗಿನ್'],['up','Create account','ಖಾತೆ ರಚಿಸಿ']].forEach(function(x){var b=el('button',mode===x[0]?'on':'');b.type='button';b.append(bi(x[1],x[2]));b.onclick=function(){mode=x[0];auth()};t.append(b)});
  if(recovery){f.innerHTML=F('New password','ಹೊಸ ಪಾಸ್‌ವರ್ಡ್','<input name="pw" type="password" minlength="8" required autocomplete="new-password">')+'<button class="btn main">Save password · ಉಳಿಸಿ</button>';
    f.onsubmit=async function(e){e.preventDefault();var r=await sb.auth.updateUser({password:new FormData(f).get('pw')});if(r.error)err.textContent=fe(r.error);else{recovery=false;toast('Password updated');boot()}};}
  else{
    f.innerHTML=(mode==='up'?F('Full name','ಪೂರ್ಣ ಹೆಸರು','<input name="name" required minlength="2" maxlength="100" autocomplete="name">')+F('Phone','ಫೋನ್','<input name="phone" type="tel" required minlength="7" maxlength="30" autocomplete="tel">')+F('Area or ward','ಪ್ರದೇಶ ಅಥವಾ ವಾರ್ಡ್','<input name="area" maxlength="160">'):'')+
      F('Email','ಇಮೇಲ್','<input name="email" type="email" required autocomplete="email">')+F('Password','ಪಾಸ್‌ವರ್ಡ್','<input name="pw" type="password" required minlength="8" autocomplete="'+(mode==='up'?'new':'current')+'-password">')+
      (mode==='up'?'<label class="chk"><input type="checkbox" required><span>I agree to the <a href="/privacy">privacy policy</a>. / ನಾನು <a href="/privacy">ಗೌಪ್ಯತಾ ನೀತಿ</a>ಗೆ ಒಪ್ಪುತ್ತೇನೆ.</span></label>':'')+
      '<button class="btn main">'+(mode==='up'?'Create account · ಖಾತೆ ರಚಿಸಿ':'Sign in · ಲಾಗಿನ್')+'</button>'+(mode==='in'?'<button type="button" class="link" id="fp">Forgot password? · ಪಾಸ್‌ವರ್ಡ್ ಮರೆತಿರಾ?</button>':'');
    f.onsubmit=async function(e){e.preventDefault();err.textContent='';var d=new FormData(f),r;
      if(mode==='up'){r=await sb.auth.signUp({email:d.get('email'),password:d.get('pw'),options:{data:{full_name:d.get('name'),phone:d.get('phone'),area:d.get('area')||''},emailRedirectTo:location.origin+'/citizen'}});
        if(r.error)err.textContent=fe(r.error);else if(!r.data.session){err.style.color='var(--green2)';err.textContent='Check your email to confirm your account. / ಖಾತೆ ದೃಢೀಕರಿಸಲು ನಿಮ್ಮ ಇಮೇಲ್ ಪರಿಶೀಲಿಸಿ.'}}
      else{r=await sb.auth.signInWithPassword({email:d.get('email'),password:d.get('pw')});if(r.error)err.textContent=fe(r.error)}};
    setTimeout(function(){var fp=$('#fp');if(fp)fp.onclick=async function(){var em=await askText('Reset your password','Enter your email and we will send you a reset link.','you@example.com','email');if(!em)return;var r=await sb.auth.resetPasswordForEmail(em,{redirectTo:location.origin+'/citizen'});toast(r.error?fe(r.error):'Reset link sent / ಲಿಂಕ್ ಕಳುಹಿಸಲಾಗಿದೆ',!!r.error)}});
  }
  p.append(recovery?el('h3','','Set a new password'):t,f,err);box.append(p);app.append(box);
}
async function dash(){
  var uid=me.id,P=await sb.from('profiles').select('*').eq('id',uid).maybeSingle();prof=P.data||{};
  var md=me.user_metadata||{};if(!prof.phone&&md.phone){await sb.from('profiles').update({phone:md.phone,area:md.area||null}).eq('id',uid);prof.phone=md.phone;prof.area=md.area}
  var R=await Promise.all([sb.from('grievances').select('*').eq('user_id',uid).order('created_at',{ascending:false}),sb.from('appointment_requests').select('*').eq('user_id',uid).order('created_at',{ascending:false}),sb.from('event_rsvps').select('*,events(title_en,title_kn,starts_at)').eq('user_id',uid).order('created_at',{ascending:false})]);
  var G=R[0].data||[],A=R[1].data||[],V=R[2].data||[];
  app.replaceChildren();
  var staff=['admin','editor','moderator'].indexOf(prof.role)>-1;
  var hi=el('div','panel');hi.style.display='flex';hi.style.justifyContent='space-between';hi.style.flexWrap='wrap';hi.style.gap='12px';hi.style.alignItems='center';
  var w=el('div');w.append(bi('Welcome, '+(prof.full_name||me.email),'ಸ್ವಾಗತ, '+(prof.full_name||me.email)));w.style.fontWeight='700';w.style.fontSize='1.2rem';
  var so=el('button','btn sm');so.append(bi('Sign out','ಲಾಗ್ ಔಟ್'));so.onclick=function(){sb.auth.signOut()};var rt=el('div');rt.style.display='flex';rt.style.gap='10px';
  if(staff){var ad=el('a','btn sm main');ad.href='/admin';ad.append(bi('Open admin','ಅಡ್ಮಿನ್ ತೆರೆಯಿರಿ'));rt.append(ad)}rt.append(so);hi.append(w,rt);app.append(hi);
  var st=el('div','stats');[[G.length,'Issues','ಸಮಸ್ಯೆಗಳು'],[A.length,'Meetings','ಭೇಟಿಗಳು'],[V.length,'Events','ಕಾರ್ಯಕ್ರಮಗಳು']].forEach(function(x){var d=el('div'),b=el('b','',x[0]),s=el('span');s.append(bi(x[1],x[2]));d.append(b,s);st.append(d)});app.append(st);
  var g=el('div','dash'),L=el('div'),Rt=el('div');
  /* forms */
  var fp=panel(),tt=el('div','tabs'),form=el('form','frm'),kind=location.hash==='#appointment'?'a':'g';
  function drawForm(){tt.replaceChildren();[['g','Report an issue','ಸಮಸ್ಯೆ ವರದಿ'],['a','Request a meeting','ಭೇಟಿ ಕೋರಿ']].forEach(function(x){var b=el('button',kind===x[0]?'on':'');b.type='button';b.append(bi(x[1],x[2]));b.onclick=function(){kind=x[0];drawForm()};tt.append(b)});
    form.innerHTML=kind==='g'?F('Category','ವರ್ಗ','<select name="category"><option>Roads</option><option>Water</option><option>Electricity</option><option>Sanitation</option><option>Education</option><option>Health</option><option>Other</option></select>')+F('Subject','ವಿಷಯ','<input name="subject" required maxlength="160">')+F('Describe the issue','ಸಮಸ್ಯೆಯನ್ನು ವಿವರಿಸಿ','<textarea name="message" rows="5" required minlength="5" maxlength="5000"></textarea>')+'<button class="btn main">Submit · ಸಲ್ಲಿಸಿ</button>'
      :F('Preferred date','ಆದ್ಯತೆಯ ದಿನಾಂಕ','<input name="date" type="date" min="'+new Date().toISOString().slice(0,10)+'">')+F('Preferred time','ಆದ್ಯತೆಯ ಸಮಯ','<input name="time" placeholder="e.g. 11 AM">')+F('Purpose','ಉದ್ದೇಶ','<input name="purpose" required minlength="2" maxlength="160">')+F('Details','ವಿವರ','<textarea name="message" rows="4" maxlength="4000"></textarea>')+'<button class="btn main">Request · ಕೋರಿಕೆ ಸಲ್ಲಿಸಿ</button>'}
  form.onsubmit=async function(e){e.preventDefault();var d=new FormData(form),b=$('button:last-child',form),r;b.disabled=true;
    var base={name:prof.full_name||me.email,phone:prof.phone||null,email:me.email};
    if(kind==='g')r=await sb.from('grievances').insert(Object.assign(base,{category:d.get('category'),subject:d.get('subject'),message:d.get('message')}));
    else{if(!base.phone){toast('Add your phone number in your profile first. / ಮೊದಲು ಪ್ರೊಫೈಲ್‌ನಲ್ಲಿ ಫೋನ್ ಸೇರಿಸಿ.',1);b.disabled=false;return}
      r=await sb.from('appointment_requests').insert(Object.assign(base,{preferred_date:d.get('date')||null,preferred_time:d.get('time')||null,purpose:d.get('purpose'),message:d.get('message')||null}))}
    if(r.error){toast('Could not submit. '+fe(r.error),1);b.disabled=false}else{toast('Submitted! / ಸಲ್ಲಿಸಲಾಗಿದೆ!');dash()}};
  fp.append(tt,form);drawForm();L.append(fp);
  /* profile */
  var pp=panel(),pf=el('form','frm'),h3=el('h3','','Profile · ಪ್ರೊಫೈಲ್');
  pf.innerHTML=F('Full name','ಪೂರ್ಣ ಹೆಸರು','<input name="n" value="" maxlength="100" required>')+F('Phone','ಫೋನ್','<input name="p" type="tel" maxlength="30">')+F('Area','ಪ್ರದೇಶ','<input name="a" maxlength="160">')+'<button class="btn sm">Save · ಉಳಿಸಿ</button>';
  pf.n.value=prof.full_name||'';pf.p.value=prof.phone||'';pf.a.value=prof.area||'';
  pf.onsubmit=async function(e){e.preventDefault();var r=await sb.from('profiles').update({full_name:pf.n.value.trim(),phone:pf.p.value.trim()||null,area:pf.a.value.trim()||null}).eq('id',uid);if(r.error)toast(fe(r.error),1);else{toast('Saved');prof.full_name=pf.n.value;prof.phone=pf.p.value}};
  pp.append(h3,pf);L.append(pp);
  /* history */
  var hp=panel(),hh=el('h3','','My requests · ನನ್ನ ಕೋರಿಕೆಗಳು');hp.append(hh);
  var items=G.map(function(x){return{t:'g',d:x}}).concat(A.map(function(x){return{t:'a',d:x}})).sort(function(a,b){return b.d.created_at.localeCompare(a.d.created_at)});
  if(!items.length)hp.append(el('p','empty','Nothing yet. Your requests will appear here. / ಇನ್ನೂ ಯಾವುದೂ ಇಲ್ಲ.'));
  items.forEach(function(x){var r=el('div','row'),h=el('h4','',(x.t==='g'?'🛠 ':'📅 ')+(x.t==='g'?x.d.subject||x.d.category||'Issue':x.d.purpose)),m=el('div','meta');m.append(fdate(x.d.created_at,1),' · ');m.append(chip(x.d.status));r.append(h,m);var tx=x.t==='g'?x.d.message:x.d.message;if(tx)r.append(el('p','',tx));if(x.d.public_reply)r.append(el('div','reply','↳ '+x.d.public_reply));hp.append(r)});
  Rt.append(hp);
  var vp=panel();vp.append(el('h3','','My events · ನನ್ನ ಕಾರ್ಯಕ್ರಮಗಳು'));
  if(!V.length)vp.append(el('p','empty','No RSVPs yet. / ಇನ್ನೂ ನೋಂದಣಿ ಇಲ್ಲ.'));
  V.forEach(function(x){var r=el('div','row'),h=el('h4');h.append(bi(x.events&&x.events.title_en,x.events&&x.events.title_kn));r.append(h);if(x.events&&x.events.starts_at){var m=el('div','meta');m.append(fdate(x.events.starts_at,1));r.append(m)}if(x.ticket_code){var ta=el('a','btn sm main');ta.href='/ticket?c='+x.ticket_code;ta.style.marginTop='8px';ta.append(bi('View ticket','ಟಿಕೆಟ್ ನೋಡಿ'));r.append(ta)}vp.append(r)});
  Rt.append(vp);g.append(L,Rt);app.append(g);
}
async function boot(){var s=await sb.auth.getSession();me=s.data.session&&s.data.session.user;if(me&&!recovery)await dash();else auth();hideLoader()}
sb.auth.onAuthStateChange(function(ev,s){if(ev==='PASSWORD_RECOVERY'){recovery=true;auth();return}if(ev==='SIGNED_IN'&&s&&prof&&prof.id===s.user.id)return;if(ev==='SIGNED_IN'||ev==='SIGNED_OUT'||ev==='TOKEN_REFRESHED'){me=s&&s.user;if(!recovery){if(me&&ev!=='TOKEN_REFRESHED')dash();else if(!me)auth()}}});
boot();logVisit();
