// WonderWorld activities: self-contained, local-play prototypes for the requested activity set.
(() => {
  'use strict';
  const $ = (s, root=document) => root.querySelector(s);
  const el = (tag, attrs={}, text='') => {
    const n = document.createElement(tag);
    Object.entries(attrs).forEach(([k,v]) => n.setAttribute(k, String(v)));
    if (text !== '') n.textContent = text;
    return n;
  };
  const style = el('style');
  style.textContent = [
    '#ww-activities-launch{width:100%;padding:11px;border:0;border-radius:12px;background:#fce7f3;color:#8b285f;font:inherit;font-weight:900;pointer-events:auto}',
    '#ww-activities{position:fixed;z-index:10030;inset:2dvh 8px 2dvh;margin:auto;max-width:760px;overflow:auto;padding:14px;border-radius:20px;background:#fffaf4;color:#26374b;box-shadow:0 12px 55px #071a2d77;font-family:system-ui,sans-serif}',
    '#ww-activities[hidden],#ww-activities [hidden]{display:none!important}',
    '.wwa-top{display:flex;align-items:center;justify-content:space-between;gap:10px;position:sticky;top:-14px;z-index:2;padding:8px 0;background:#fffaf4}',
    '.wwa-top button,.wwa-btn{border:0;border-radius:10px;padding:10px 12px;background:#e7edf5;color:#26374b;font:inherit;font-weight:800;cursor:pointer}',
    '.wwa-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px;margin:12px 0}',
    '.wwa-tile{display:flex;align-items:center;gap:10px;min-height:68px;text-align:right;border:1px solid #e5dbea;border-radius:14px;padding:10px;background:white;color:#283b52;font:inherit;font-weight:800;cursor:pointer}',
    '.wwa-tile span{font-size:26px}.wwa-note{padding:10px;border-radius:12px;background:#edf5fb;font-size:13px;line-height:1.6;margin:9px 0}',
    '.wwa-actions{display:flex;gap:7px;flex-wrap:wrap;margin:10px 0}.wwa-actions button{background:#2b715b;color:white}.wwa-actions button.secondary{background:#e7edf5;color:#26374b}',
    '.wwa-feedback{min-height:42px;padding:10px;border-radius:10px;background:#f1f5fa;font-size:13px;line-height:1.55;margin:9px 0}',
    '.wwa-canvas{display:block;width:100%;max-width:640px;height:auto;aspect-ratio:16/10;border-radius:14px;background:#d9e8f0;border:1px solid #c8d8e4;touch-action:manipulation;margin:10px auto}',
    '.wwa-controls{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px;max-width:420px;margin:10px auto}.wwa-controls button{min-height:44px;border:0;border-radius:11px;background:#dce7f4;color:#203c59;font:inherit;font-weight:900;touch-action:manipulation}',
    '.wwa-board{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:5px;max-width:430px;margin:12px auto}.wwa-candy{aspect-ratio:1;border:0;border-radius:10px;font-size:clamp(19px,5vw,30px);background:#fff;box-shadow:inset 0 -3px #0001;touch-action:manipulation}',
    '.wwa-rope-stage{width:100%;max-width:640px;margin:12px auto;touch-action:none;user-select:none}.wwa-rope-stage svg{display:block;width:100%;height:auto;border-radius:18px;overflow:visible;touch-action:none}.wwa-rope-stage g[role=button]:focus{outline:none}.wwa-rope-stage g[role=button]:focus circle:first-child{stroke:#172b4d;stroke-width:7}',
    '.wwa-look{padding:12px;border-radius:14px;background:#f9e8f0;text-align:center;font-size:20px}.wwa-stock{display:grid;grid-template-columns:1fr 1fr;gap:8px}.wwa-stock article{padding:12px;background:white;border:1px solid #dfe6ef;border-radius:12px}',
    '.wwa-fashion-stage{position:relative;display:flex;align-items:flex-end;justify-content:center;min-height:250px;overflow:hidden;margin:10px 0;padding:18px;border-radius:18px;background:linear-gradient(180deg,#27234f 0%,#684078 55%,#f2c5df 56%,#f2c5df 100%);isolation:isolate}',
    '.wwa-fashion-sign{position:absolute;top:14px;left:10px;right:10px;text-align:center;color:#fff0bd;font-weight:950;letter-spacing:1.5px;font-size:clamp(11px,3vw,16px);text-shadow:0 2px 8px #160c33}',
    '.wwa-fashion-sparkles{position:absolute;top:48px;left:0;right:0;text-align:center;color:#fff4bf;font-size:23px;letter-spacing:14px}',
    '.wwa-fashion-model{position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;gap:0;filter:drop-shadow(0 7px 4px #351e4055);margin-bottom:15px}',
    '.wwa-fashion-hair{font-size:29px;line-height:1.0}.wwa-fashion-face{font-size:27px;line-height:1.0;background:#f3c49d;border-radius:50%;width:38px;height:38px;text-align:center}',
    '.wwa-fashion-clothes{display:flex;align-items:center;justify-content:center;width:78px;height:83px;margin-top:-1px;border-radius:20px 20px 9px 9px;background:var(--look-color,#b83280);border:3px solid #fff5;box-shadow:inset 0 -8px #0001;font-size:39px}',
    '.wwa-fashion-shoes{font-size:25px;line-height:1}.wwa-fashion-runway{position:absolute;z-index:0;bottom:-35px;left:30%;right:30%;height:130px;background:linear-gradient(90deg,#fff8,#ffffffdd,#fff8);transform:perspective(80px) rotateX(18deg);border:2px solid #fff9}',
    '.wwa-fashion-status{padding:10px;border-radius:12px;background:#fff0f7;color:#632c5a;font-weight:800;text-align:center}',
    '.wwa-stat{font-weight:900;color:#28765c}.wwa-choice{display:block;width:100%;margin:6px 0;padding:10px;border:1px solid #dfe4eb;border-radius:10px;background:white;text-align:right;font:inherit;color:#25364b}',
    '@media(max-width:440px){#ww-activities{inset:1dvh 4px;padding:10px}.wwa-grid{gap:6px}.wwa-tile{padding:8px;font-size:12px}.wwa-top{top:-10px}.wwa-controls button{font-size:13px}}'
  ].join('\n');
  document.head.appendChild(style);

  const activities = [
    ['battle','🎯','Wonder Battle — أكشن مستوحى من PUBG'],
    ['football','⚽','كرة القدم — تحكم قريب من الكونسول'],
    ['ropes','🪢','فك الحبال — Tangle Master'],
    ['fashion','👗','الموضة وعروض الأزياء'],
    ['gym','🏋️','Wonder Fitness — تحدي اللياقة'],
    ['plane','✈️','الطيران والإقلاع والهبوط'],
    ['train','🚆','القطارات والمحطات'],
    ['arrows','🏹','لعبة الأسهم — افتحي المسارات'],
    ['stocks','📈','سوق الأسهم — محفظة افتراضية'],
    ['space','🚀','صواريخ الفضاء — Space Blaster'],
    ['candy','🍬','Candy Crush — مطابقة الحلوى'],
    ['party','✨','Sparkle Party — مسابقات وأسئلة']
  ];
  function boot() {
    const hud = $('#life-ui');
    if (!hud || $('#ww-activities-launch')) return false;
    const launch = el('button',{id:'ww-activities-launch',type:'button'},'🌟 أنشطة WonderWorld الإضافية');
    hud.appendChild(launch);
    const panel = el('section',{id:'ww-activities',role:'dialog','aria-modal':'true','aria-label':'أنشطة وألعاب WonderWorld'});
    panel.hidden = true;
    panel.innerHTML =
      '<div class="wwa-top"><strong>🌈 عالم الأنشطة والألعاب</strong><button id="wwa-home" type="button">القائمة ✕</button></div>' +
      '<p class="wwa-note">دي الأنشطة الإضافية. الجيم موجود بالفعل في العالم، وتحدي الكؤوس موجود ضمن الألعاب المصغّرة؛ مش هنكررهم هنا. النماذج دي محلية، والأكشن والرياضة لسه نماذج أولية وليست تجربة أونلاين مكتملة.</p>' +
      '<div id="wwa-menu" class="wwa-grid"></div>' +
      '<section id="wwa-game" hidden><h3 id="wwa-title"></h3><p id="wwa-description" class="wwa-note"></p><div id="wwa-content"></div><p id="wwa-feedback" class="wwa-feedback" role="status" aria-live="polite"></p><div class="wwa-actions"><button id="wwa-reset" type="button" class="secondary">🔄 إعادة اللعبة</button><button id="wwa-back" type="button" class="secondary">↩️ كل الألعاب</button></div></section>';
    document.body.appendChild(panel);
    const menu = $('#wwa-menu',panel), game = $('#wwa-game',panel), feedback = $('#wwa-feedback',panel);
    let content = $('#wwa-content',panel);
    activities.forEach(([id,emoji,title]) => {
      const b=el('button',{type:'button',class:'wwa-tile','data-game':id});
      b.append(el('span',{},emoji),el('span',{},title));menu.appendChild(b);
    });
    let active='', state={}, frame=0, keys={}, selectedCandy=null;
    const msg = text => { feedback.textContent=text; };
    const html = value => { const next = content.cloneNode(false); content.replaceWith(next); content = next; content.innerHTML = value; };
    const button = (id,label,cls='') => '<button type="button" id="'+id+'" class="wwa-btn '+cls+'">'+label+'</button>';
    const canvas = id => '<canvas id="'+id+'" class="wwa-canvas" width="640" height="400" aria-label="ساحة اللعبة"></canvas>';
    function stopLoop(){if(frame)cancelAnimationFrame(frame);frame=0;keys={};}
    function start(id){
      stopLoop(); active=id; state={}; selectedCandy=null;
      const item=activities.find(x=>x[0]===id); $('#wwa-title',panel).textContent=item[2];
      $('#wwa-description',panel).textContent=({
        battle:'تحركي داخل الساحة، صوبّي، أطلقي على أهداف التدريب، وراقبي الصحة والذخيرة. نسخة فردية آمنة بلا دماء أو تواصل بين اللاعبين.',
        football:'فريقان مصغران، تحرك وتمرير وتسديد ومرمى وحارس. استخدمي الأزرار أو لوحة المفاتيح وسجلي أهدافًا.',
        ropes:'اختاري عقدة ثم حركيها. المطلوب فصل الخطوط المتقاطعة حتى تصبح الحبال واضحة.',
        fashion:'اختاري إطلالة مناسبة لموضوع العرض، ثم ابدئي العرض واحصلي على تقييم افتراضي مع نقاط أناقة.',
        plane:'ارفعي قوة المحرك، اقلعي، حافظي على الارتفاع ثم اهبطي في منطقة المدرج لتحصلي على نتيجة الطيران.',
        gym:'اختاري التمرين وسجلي التكرارات. التقدم افتراضي داخل اللعبة وليس نصيحة طبية.',
        train:'قدمي القطار بين المحطات، توقفي عند العلامات، واجمعي نقاط الالتزام بالجدول.',
        arrows:'أخرجي الأسهم من اللوحة في اتجاه رؤوسها. السهم لا يقدر يمر من خلال سهم آخر؛ اختاري المسارات المفتوحة أولًا.',
        stocks:'تدريب تعليمي بمحفظة وعملة افتراضية فقط. لا يوجد تداول حقيقي ولا أموال حقيقية.',
        cups:'تابعي مكان النجمة تحت الكؤوس، ثم اختاري الكأس الصحيح. كل جولة تعيد خلط المكان.',
        space:'حركي المركبة يمينًا ويسارًا وأطلقي الليزر على النيازك لتحمي سفينة الفضاء.',
        candy:'بدلي حبتين متجاورتين لتكوين ثلاثة أو أكثر من نفس النوع وجمع النقاط.',
        party:'مسابقة خفيفة شبيهة بأجواء Sparkle Party: معلومات عامة وعلوم ورياضة وأزياء مع نقاط وجولات.'
      })[id];
      $('#wwa-menu',panel).hidden=true; game.hidden=false;
      renderGame();
    }
    function renderGame(){
      stopLoop(); state={score:0};
      if(active==='battle') renderBattle();
      else if(active==='football') renderFootball();
      else if(active==='ropes') renderRopes();
      else if(active==='fashion') renderFashion();
      else if(active==='plane') renderPlane();
      else if(active==='gym') renderGym();
      else if(active==='train') renderTrain();
      else if(active==='arrows') renderArrows();
      else if(active==='stocks') renderStocks();
      else if(active==='cups') renderCups();
      else if(active==='space') renderSpace();
      else if(active==='candy') renderCandy();
      else if(active==='party') renderParty();
    }
    function setupCanvas(id, draw){
      const c=$('#'+id,panel),ctx=c.getContext('2d');
      const fit=()=>{const rect=c.getBoundingClientRect(); if(rect.width>0&&c.width!==640)c.width=640; draw(ctx,c);};
      draw(ctx,c);return {c,ctx,draw};
    }
    function renderBattle(){
      state={x:320,y:315,hp:100,ammo:30,score:0,aimX:320,aimY:100,targets:[],kills:0,zone:0,elapsed:0,lastAttack:0,ended:false,won:false};
      const spawn=()=>({x:50+Math.random()*540,y:90+Math.random()*245,hp:2,speed:0.35+Math.random()*0.35,fireAt:Date.now()+1000+Math.random()*1800});
      state.targets=Array.from({length:6},spawn);
      html('<p class="wwa-note">🏝️ ساحة بقاء Battle Royale — اجمعي الإقصاءات وابتعدي عن المنطقة اللي بتضيق. الجولة فردية ضد خصوم آليين.</p>'+canvas('wwa-battle-canvas')+'<div class="wwa-controls"><button data-act="up">▲ للأمام</button><button data-act="reload">🔄 تلقيم</button><button data-act="fire">إطلاق 🎯</button><button data-act="left">◀ يسار</button><button data-act="down">▼ للخلف</button><button data-act="right">يمين ▶</button><button data-act="heal">🩹 علاج</button><button data-act="restart">جولة جديدة</button></div><p>الصحة: <b id="wwa-hp">100</b> | الذخيرة: <b id="wwa-ammo">30</b> | الإقصاءات: <b id="wwa-bscore">0</b>/6 | المنطقة: <b id="wwa-zone">100</b>%</p><p id="wwa-battle-result" role="status">اهزمي الخصوم الستة للبقاء لآخر الجولة.</p>');
      const c=$('#wwa-battle-canvas',panel),ctx=c.getContext('2d');
      const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
      function draw(){
        ctx.clearRect(0,0,640,400);
        ctx.fillStyle='#b6d6a5';ctx.fillRect(0,0,640,400);
        ctx.fillStyle='#d2c59a';for(let i=0;i<10;i++){ctx.beginPath();ctx.ellipse((i*79+23)%640,(i*53+17)%400,19,10,i*.4,0,Math.PI*2);ctx.fill();}
        ctx.fillStyle='#7c9e70';for(const [x,y,w,h] of [[80,110,58,32],[190,210,74,28],[410,125,66,34],[500,270,80,28],[290,70,50,24]]){ctx.fillRect(x,y,w,h);ctx.fillStyle='#4f6f50';ctx.fillRect(x+5,y+5,w-10,h-10);ctx.fillStyle='#7c9e70';}
        const shrink=Math.min(0.38,state.elapsed/90*0.38),pad=18+shrink*270;ctx.strokeStyle='#3e87db';ctx.lineWidth=5;ctx.setLineDash([12,7]);ctx.strokeRect(pad,pad,640-pad*2,400-pad*2);ctx.setLineDash([]);
        state.targets.forEach((t,i)=>{if(t.hp<=0)return;ctx.fillStyle='#c54450';ctx.beginPath();ctx.arc(t.x,t.y,13,0,Math.PI*2);ctx.fill();ctx.fillStyle='#ffe3c8';ctx.beginPath();ctx.arc(t.x,t.y-10,7,0,Math.PI*2);ctx.fill();ctx.fillStyle='#5e2b35';ctx.fillRect(t.x-8,t.y+12,16,5);ctx.fillStyle='#fff';ctx.fillRect(t.x-12,t.y-2,24,3);});
        ctx.fillStyle='#573e91';ctx.beginPath();ctx.arc(state.x,state.y,14,0,Math.PI*2);ctx.fill();ctx.fillStyle='#f4d4b0';ctx.beginPath();ctx.arc(state.x,state.y-15,8,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.beginPath();ctx.arc(state.aimX,state.aimY,10,0,Math.PI*2);ctx.moveTo(state.aimX-15,state.aimY);ctx.lineTo(state.aimX+15,state.aimY);ctx.moveTo(state.aimX,state.aimY-15);ctx.lineTo(state.aimX,state.aimY+15);ctx.stroke();
        ctx.fillStyle='#24364b';ctx.font='bold 14px sans-serif';ctx.fillText('WONDER BATTLE • SURVIVE',16,24);
      }
      function update(){
        $('#wwa-hp',panel).textContent=String(Math.max(0,Math.round(state.hp)));$('#wwa-ammo',panel).textContent=String(state.ammo);$('#wwa-bscore',panel).textContent=String(state.kills);$('#wwa-zone',panel).textContent=String(Math.max(20,Math.round(100-state.elapsed/90*80)));draw();
        if(state.hp<=0&&!state.ended){state.ended=true;state.won=false;$('#wwa-battle-result',panel).textContent='انتهت الجولة — اتدربي وابدئي جولة جديدة.';msg('انتهت الجولة. تقدري تعيدي اللعب.');}
        if(state.kills>=6&&!state.ended){state.ended=true;state.won=true;$('#wwa-battle-result',panel).textContent='🏆 فزتي! بقيتي آخر لاعبة في الساحة.';msg('فوز! بقيتي آخر لاعبة في ساحة Wonder Battle Royale.');}
      }
      const move=(dx,dy)=>{if(state.ended)return;state.x=clamp(state.x+dx,22,618);state.y=clamp(state.y+dy,55,378);update();};
      const fire=()=>{if(state.ended)return;if(state.ammo<=0){msg('الذخيرة خلصت — اضغطي تلقيم.');return;}state.ammo--;const live=state.targets.filter(t=>t.hp>0).sort((a,b)=>Math.hypot(a.x-state.aimX,a.y-state.aimY)-Math.hypot(b.x-state.aimX,b.y-state.aimY));const hit=live[0];if(hit&&Math.hypot(hit.x-state.aimX,hit.y-state.aimY)<38){hit.hp--;if(hit.hp<=0){state.kills++;if(state.kills<6)state.targets.push(spawn());msg('إقصاء! خصم خرج من الجولة.');}else msg('إصابة! كملي التصويب.');}else msg('الطلقة ما أصابتش. لمسي مكان الخصم للتصويب عليه.');update();};
      const restart=()=>{state.x=320;state.y=315;state.hp=100;state.ammo=30;state.kills=0;state.elapsed=0;state.ended=false;state.won=false;state.targets=Array.from({length:6},spawn);state.lastAttack=Date.now();$('#wwa-battle-result',panel).textContent='اهزمي الخصوم الستة للبقاء لآخر الجولة.';update();};
      c.addEventListener('pointerdown',e=>{const r=c.getBoundingClientRect();state.aimX=(e.clientX-r.left)/r.width*640;state.aimY=(e.clientY-r.top)/r.height*400;update();});
      $('#wwa-content',panel).querySelectorAll('[data-act]').forEach(b=>b.addEventListener('click',()=>{const a=b.dataset.act;if(a==='up')move(0,-22);if(a==='down')move(0,22);if(a==='left')move(-22,0);if(a==='right')move(22,0);if(a==='reload'&&!state.ended){state.ammo=Math.min(30,state.ammo+12);msg('تم جمع ذخيرة إضافية.');update();}if(a==='heal'&&!state.ended&&state.hp>0){state.hp=Math.min(100,state.hp+25);msg('استخدمتي حقيبة علاج.');update();}if(a==='fire')fire();if(a==='restart')restart();}));
      const keydown=e=>{const map={ArrowUp:[0,-18],w:[0,-18],W:[0,-18],ArrowDown:[0,18],s:[0,18],S:[0,18],ArrowLeft:[-18,0],a:[-18,0],A:[-18,0],ArrowRight:[18,0],d:[18,0],D:[18,0]};if(map[e.key]&&panel.contains(c)){e.preventDefault();move(...map[e.key]);}if((e.key===' '||e.key==='Enter')&&panel.contains(c)){e.preventDefault();fire();}};
      c.tabIndex=0;c.addEventListener('keydown',keydown);
      const timer=setInterval(()=>{if(!panel.isConnected||panel.hidden||!panel.contains(c)){clearInterval(timer);return;}if(state.ended)return;state.elapsed+=0.5;const now=Date.now();for(const t of state.targets){if(t.hp<=0)continue;const dx=state.x-t.x,dy=state.y-t.y,d=Math.hypot(dx,dy)||1;t.x=clamp(t.x+dx/d*t.speed*7,24,616);t.y=clamp(t.y+dy/d*t.speed*7,52,378);if(now>t.fireAt&&d<240){state.hp=Math.max(0,state.hp-5);t.fireAt=now+1400+Math.random()*900;}}const pad=18+Math.min(0.38,state.elapsed/90*0.38)*270;if(state.x<pad||state.x>640-pad||state.y<pad||state.y>400-pad)state.hp=Math.max(0,state.hp-2);update();},500);
      $('#wwa-reset',panel).textContent='🔄 إعادة الجولة';state.lastAttack=Date.now();update();msg('تحركي، صوبّي باللمس على الخصوم، اجمعي العلاج والذخيرة، وابتعدي عن حدود المنطقة الزرقاء.');
    }
    function renderFootball(){
      state={
        player:{x:320,y:315}, teammates:[{x:220,y:255},{x:420,y:255},{x:280,y:190},{x:360,y:190}],
        opponents:[{x:250,y:92},{x:390,y:92},{x:320,y:140},{x:205,y:175},{x:435,y:175}],
        keeper:{x:320,y:42}, ball:{x:320,y:300,vx:0,vy:0}, possession:'player',
        blue:0,red:0,seconds:90,startedAt:Date.now(),lastTick:Date.now(),ended:false,shots:0,passes:0
      };
      html(
        '<div class="wwa-note" id="wwa-match-status">صافرة البداية! حرّكي اللاعب ومرّري أو سدّدي. المباراة 90 ثانية.</div>'+
        '<div style="display:flex;justify-content:space-between;gap:8px;align-items:center;padding:9px 12px;border-radius:12px;background:#17324c;color:white;font-weight:900">'+
        '<span>🔵 WONDER FC <b id="wwa-blue-score">0</b></span><span id="wwa-match-clock">90:00</span><span>🔴 RIVALS <b id="wwa-red-score">0</b></span></div>'+
        '<canvas id="wwa-football-canvas" class="wwa-canvas" width="640" height="400" tabindex="0" aria-label="ملعب كرة قدم. استخدمي الأسهم أو WASD للحركة"></canvas>'+
        '<div class="wwa-controls">'+
        '<button data-f="up">▲ للأمام</button><button data-f="pass">تمرير ⚽</button><button data-f="shoot">تسديد 🥅</button>'+
        '<button data-f="left">◀ يسار</button><button data-f="down">▼ للخلف</button><button data-f="right">يمين ▶</button></div>'+
        '<p class="wwa-note">هدف الشريحة دي: مباراة محلية قابلة للعب، بوقت ونتيجة وفريقين وحارس وخصوم وحركة الكرة. دي نسخة أولية وليست محاكاة FC كاملة أو لعبًا أونلاين.</p>'
      );
      const c=$('#wwa-football-canvas',panel),ctx=c.getContext('2d');
      const matchStatus=$('#wwa-match-status',panel);
      const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
      const ball=()=>state.ball;
      function draw(){
        ctx.clearRect(0,0,640,400);
        ctx.fillStyle='#318c54';ctx.fillRect(0,0,640,400);
        for(let i=0;i<8;i++){ctx.fillStyle=i%2?'#ffffff08':'#123f2410';ctx.fillRect(20+i*75,20,75,360);}
        ctx.strokeStyle='#f4fff1';ctx.lineWidth=2.5;ctx.strokeRect(18,18,604,364);
        ctx.beginPath();ctx.moveTo(18,200);ctx.lineTo(622,200);ctx.stroke();
        ctx.beginPath();ctx.arc(320,200,48,0,Math.PI*2);ctx.stroke();
        ctx.strokeRect(220,18,200,65);ctx.strokeRect(270,18,100,32);
        ctx.strokeRect(220,317,200,65);ctx.strokeRect(270,350,100,32);
        ctx.fillStyle='#f7f7f7';ctx.fillRect(state.keeper.x-29,24,58,8);
        const drawPlayer=(p,color,shirt,label)=>{
          ctx.fillStyle='#142a22';ctx.beginPath();ctx.ellipse(p.x,p.y+13,12,5,0,0,Math.PI*2);ctx.fill();
          ctx.fillStyle=color;ctx.beginPath();ctx.arc(p.x,p.y-8,7,0,Math.PI*2);ctx.fill();
          ctx.fillStyle=shirt;ctx.fillRect(p.x-10,p.y-2,20,17);
          ctx.fillStyle='#fff';ctx.font='bold 10px sans-serif';ctx.textAlign='center';ctx.fillText(label,p.x,p.y+8);
        };
        state.teammates.forEach((p,i)=>drawPlayer(p,'#f0c9a1','#2565c9',String(i+2)));
        state.opponents.forEach((p,i)=>drawPlayer(p,'#eac19e','#d94d50',String(i+2)));
        drawPlayer(state.player,'#f2c8a3','#174ba5','1');
        drawPlayer(state.keeper,'#e8bf9a','#f0b323','GK');
        ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(ball().x,ball().y,7,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#202a31';ctx.lineWidth=1.5;ctx.stroke();
        ctx.fillStyle='#fff';ctx.font='bold 13px sans-serif';ctx.textAlign='left';ctx.fillText('WONDER FC',26,36);
        ctx.textAlign='right';ctx.fillText('RIVALS',614,36);
        if(state.ended){ctx.fillStyle='#10243acc';ctx.fillRect(90,145,460,100);ctx.fillStyle='#fff';ctx.textAlign='center';ctx.font='bold 26px sans-serif';ctx.fillText('نهاية المباراة',320,183);ctx.font='bold 18px sans-serif';ctx.fillText(state.blue>state.red?'فوز Wonder FC! 🎉':state.blue<state.red?'فوز الفريق المنافس':'تعادل!',320,215);}
      }
      function updateScore(){
        $('#wwa-blue-score',panel).textContent=String(state.blue);
        $('#wwa-red-score',panel).textContent=String(state.red);
        const sec=Math.max(0,Math.ceil(state.seconds));
        $('#wwa-match-clock',panel).textContent=Math.floor(sec/60)+':'+String(sec%60).padStart(2,'0');
      }
      function resetKickoff(scoringTeam){
        state.player={x:320,y:315};state.teammates=[{x:220,y:255},{x:420,y:255},{x:280,y:190},{x:360,y:190}];
        state.opponents=[{x:250,y:92},{x:390,y:92},{x:320,y:140},{x:205,y:175},{x:435,y:175}];
        state.keeper={x:320,y:42};state.ball={x:320,y:300,vx:0,vy:0};state.possession='player';state.passTarget=null;
        matchStatus.textContent=scoringTeam==='player'?'جوووول لـ Wonder FC! ⚽ استعدي لبدء اللعب من جديد.':'الفريق المنافس سجّل. تقدري ترجعي وتعدّلي النتيجة!';
      }
      function move(dx,dy){
        if(state.ended)return;
        const p=state.player;p.x=clamp(p.x+dx,32,608);p.y=clamp(p.y+dy,35,365);
        if(Math.hypot(p.x-ball().x,p.y-ball().y)<38){state.possession='player';ball().vx=0;ball().vy=0;}
        if(state.possession==='player'){ball().x=p.x+10;ball().y=p.y-7;}
        draw();
      }
      function pass(){
        if(state.ended)return;
        const p=state.player,b=ball();
        if(state.possession!=='player'&&Math.hypot(p.x-b.x,p.y-b.y)>42){matchStatus.textContent='قرّبي من الكرة الأول عشان تقدري تمرّري.';return;}
        state.possession='teammate';state.passTarget=null;state.passes++;
        const mate=state.teammates.reduce((best,t)=>Math.hypot(t.x-p.x,t.y-p.y)<Math.hypot(best.x-p.x,best.y-p.y)?t:best,state.teammates[0]);
        state.passTarget=mate;b.x=mate.x+10;b.y=mate.y-7;
        matchStatus.textContent='تمريرة وصلت لزميلتك! تحرّكي للمساحة وكمّلي الهجمة.';
        draw();
      }
      function shoot(){
        if(state.ended)return;
        const p=state.player,b=ball();
        if(state.possession!=='player'&&Math.hypot(p.x-b.x,p.y-b.y)>44){matchStatus.textContent='لازم تستحوذي على الكرة قبل التسديد.';return;}
        state.possession='none';state.shots++;
        const targetX=clamp(320+(p.x-320)*.38+(Math.random()*36-18),245,395);
        b.x=p.x+8;b.y=p.y-12;b.vx=(targetX-b.x)/16;b.vy=-Math.max(8,(b.y-24)/16);
        matchStatus.textContent='تسديدة! ⚽ تابعي الكرة والحارس.';
        draw();
      }
      function tick(now){
        if(state.ended)return;
        const dt=Math.min(.05,(now-state.lastTick)/1000);state.lastTick=now;state.seconds=Math.max(0,state.seconds-dt);
        const p=state.player,b=ball();
        if(state.possession==='player'){b.x=p.x+10;b.y=p.y-7;}
        else if(state.possession==='teammate'&&state.passTarget){b.x=state.passTarget.x+10;b.y=state.passTarget.y-7;}
        else if(state.possession==='opponent'){
          const carrier=state.opponents[2];carrier.y=clamp(carrier.y+45*dt,45,350);b.x=carrier.x;b.y=carrier.y+8;
          if(carrier.y>300){state.possession='none';b.vx=(320-b.x)*.035;b.vy=7;matchStatus.textContent='الفريق المنافس بيهاجم! اقطعي الكرة.';}
        } else {
          b.x+=b.vx;b.y+=b.vy;b.vx*=.985;b.vy*=.985;
          if(b.x<25||b.x>615)b.vx*=-.72;
          if(b.y>375){b.y=375;b.vy*=-.55;}
          if(b.y<28&&b.x>252&&b.x<388){
            if(Math.abs(b.x-state.keeper.x)<27){b.y=38;b.vy=Math.abs(b.vy)*.65;matchStatus.textContent='الحارس صدّ الكرة! جرّبي زاوية تانية.';}
            else {state.blue++;updateScore();resetKickoff('player');}
          } else if(b.y<25){b.y=25;b.vy=Math.abs(b.vy)*.6;}
          if(b.y>360&&b.x>252&&b.x<388){state.red++;updateScore();resetKickoff('opponent');}
          if(Math.hypot(p.x-b.x,p.y-b.y)<23){state.possession='player';state.passTarget=null;b.vx=0;b.vy=0;matchStatus.textContent='استحواذ ممتاز! مرّري أو سدّدي.';}
          else {
            const rival=state.opponents.reduce((best,o)=>Math.hypot(o.x-b.x,o.y-b.y)<Math.hypot(best.x-b.x,best.y-b.y)?o:best,state.opponents[0]);
            const d=Math.hypot(rival.x-b.x,rival.y-b.y);
            if(d<16&&b.y>50&&b.y<345&&Math.random()<.035){state.possession='opponent';matchStatus.textContent='الخصم استحوذ على الكرة — اقطعيها بسرعة!';}
            else if(d>0){rival.x+=((b.x-rival.x)/d)*25*dt;rival.y+=((b.y-rival.y)/d)*25*dt;}
          }
        }
        state.keeper.x=clamp(state.keeper.x+(clamp(b.x-state.keeper.x,-1,1))*95*dt,280,360);
        if(state.seconds<=0){state.ended=true;state.seconds=0;matchStatus.textContent='انتهى الوقت! تقدري تعيدي المباراة أو ترجعي لقائمة الألعاب.';$('#wwa-reset',panel).textContent='🔄 مباراة جديدة';}
        updateScore();draw();if(!state.ended)frame=requestAnimationFrame(tick);
      }
      $('#wwa-content',panel).querySelectorAll('[data-f]').forEach(b=>b.addEventListener('click',()=>{
        const a=b.dataset.f;if(a==='up')move(0,-18);if(a==='down')move(0,18);if(a==='left')move(-18,0);if(a==='right')move(18,0);if(a==='pass')pass();if(a==='shoot')shoot();
      }));
      c.addEventListener('pointerdown',e=>{
        c.focus();if(state.ended)return;
        const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width*640,y=(e.clientY-r.top)/r.height*400;
        const dx=x-state.player.x,dy=y-state.player.y,d=Math.hypot(dx,dy);
        if(d>8)move(dx/d*24,dy/d*24);
      });
      c.addEventListener('keydown',e=>{
        const map={ArrowUp:[0,-18],w:[0,-18],W:[0,-18],ArrowDown:[0,18],s:[0,18],S:[0,18],ArrowLeft:[-18,0],a:[-18,0],A:[-18,0],ArrowRight:[18,0],d:[18,0],D:[18,0]};
        if(map[e.key]){e.preventDefault();move(...map[e.key]);}
        if(e.key===' '){e.preventDefault();shoot();}
      });
      $('#wwa-reset',panel).textContent='🔄 إعادة المباراة';
      updateScore();draw();matchStatus.textContent='صافرة البداية! تحكّمي بالأسهم أو WASD أو أزرار الشاشة. استحوذي على الكرة وسجّلي قبل انتهاء الوقت.';
      frame=requestAnimationFrame(tick);
    }
    function renderRopes(){
      const initial=[{x:115,y:85},{x:525,y:285},{x:115,y:285},{x:525,y:85}];
      state={points:initial.map(p=>({...p})),moves:0,dragging:-1,won:false};
      html('<p>امسكي الدوائر الملوّنة واسحبيها بإصبعك أو بالماوس. حرّكي أطراف الحبال حتى تختفي كل التقاطعات.</p><div class="wwa-rope-stage"><svg id="wwa-rope-nodes" viewBox="0 0 640 360" role="img" aria-label="حبال متشابكة قابلة للسحب"><defs><filter id="wwa-rope-shadow"><feDropShadow dx="0" dy="3" stdDeviation="2" flood-opacity=".3"/></filter></defs><rect x="4" y="4" width="632" height="352" rx="18" fill="#f4f0e7" stroke="#c9b99e" stroke-width="4"/><g id="wwa-rope-lines"></g><g id="wwa-rope-endpoints"></g></svg></div><p>التقاطعات: <b id="wwa-crossings">3</b> | الحركات: <b id="wwa-rope-moves">0</b></p><button id="wwa-rope-reset" type="button">🔄 إعادة ترتيب الحبال</button>');
      const svg=$('#wwa-rope-nodes',panel),lines=$('#wwa-rope-lines',panel),endpoints=$('#wwa-rope-endpoints',panel);
      const colors=['#e34b54','#367bd6','#e5b526','#8a59c4'];
      const makeSvg=(tag,attrs)=>{const n=document.createElementNS('http://www.w3.org/2000/svg',tag);Object.entries(attrs).forEach(([k,v])=>n.setAttribute(k,String(v)));return n;};
      const cross=(a,b,c,d)=>{const orient=(p,q,r)=>(q.x-p.x)*(r.y-p.y)-(q.y-p.y)*(r.x-p.x);const o1=orient(a,b,c),o2=orient(a,b,d),o3=orient(c,d,a),o4=orient(c,d,b);return o1*o2<0&&o3*o4<0;};
      function crossings(){let n=0;for(let i=0;i<state.points.length;i++)for(let j=i+1;j<state.points.length;j++){if(Math.abs(i-j)===1||(i===0&&j===state.points.length-1))continue;if(cross(state.points[i],state.points[(i+1)%4],state.points[j],state.points[(j+1)%4]))n++;}return n;}
      function draw(){
        lines.replaceChildren();endpoints.replaceChildren();
        for(let i=0;i<4;i++){const a=state.points[i],b=state.points[(i+1)%4];const line=makeSvg('line',{x1:a.x,y1:a.y,x2:b.x,y2:b.y,stroke:colors[i], 'stroke-width':15,'stroke-linecap':'round',filter:'url(#wwa-rope-shadow)'});lines.appendChild(line);const highlight=makeSvg('line',{x1:a.x,y1:a.y-3,x2:b.x,y2:b.y-3,stroke:'#ffffff88','stroke-width':3,'stroke-linecap':'round','pointer-events':'none'});lines.appendChild(highlight);}
        state.points.forEach((p,i)=>{const g=makeSvg('g',{'data-node':i,tabindex:0,role:'button','aria-label':'اسحبي طرف الحبل '+(i+1),style:'cursor:grab;touch-action:none'});const ring=makeSvg('circle',{cx:p.x,cy:p.y,r:20,fill:colors[i],stroke:state.dragging===i?'#1c2733':'#fff','stroke-width':5,filter:'url(#wwa-rope-shadow)'});const hole=makeSvg('circle',{cx:p.x,cy:p.y,r:5,fill:'#fff9'});g.append(ring,hole);g.addEventListener('pointerdown',e=>{if(state.won)return;state.dragging=i;svg.setPointerCapture?.(e.pointerId);e.preventDefault();});g.addEventListener('keydown',e=>{const d=e.shiftKey?20:8;const move={ArrowLeft:[-d,0],ArrowRight:[d,0],ArrowUp:[0,-d],ArrowDown:[0,d]}[e.key];if(move){e.preventDefault();p.x=Math.max(28,Math.min(612,p.x+move[0]));p.y=Math.max(28,Math.min(332,p.y+move[1]));state.moves++;update();}});endpoints.appendChild(g);});
        $('#wwa-crossings',panel).textContent=String(crossings());$('#wwa-rope-moves',panel).textContent=String(state.moves);
      }
      function update(){draw();const count=crossings();$('#wwa-crossings',panel).textContent=String(count);if(count===0&&!state.won){state.won=true;msg('ممتاز! الحبال بقت منفصلة من غير أي تقاطع. 🪢');}}
      const position=e=>{const r=svg.getBoundingClientRect();return{x:Math.max(24,Math.min(616,(e.clientX-r.left)/r.width*640)),y:Math.max(24,Math.min(336,(e.clientY-r.top)/r.height*360))};};
      svg.addEventListener('pointermove',e=>{if(state.dragging<0)return;state.points[state.dragging]=position(e);state.moves++;draw();});
      const stop=()=>{state.dragging=-1;const count=crossings();$('#wwa-crossings',panel).textContent=String(count);$('#wwa-rope-moves',panel).textContent=String(state.moves);if(count===0&&!state.won){state.won=true;msg('ممتاز! الحبال بقت منفصلة من غير أي تقاطع. 🪢');}};
      svg.addEventListener('pointerup',stop);svg.addEventListener('pointercancel',stop);svg.addEventListener('lostpointercapture',stop);
      $('#wwa-rope-reset',panel).addEventListener('click',()=>{state.points=initial.map(p=>({...p}));state.moves=0;state.won=false;state.dragging=-1;update();msg('رجعنا الحبال متشابكة. اسحبي الأطراف لحد ما تختفي التقاطعات.');});
      draw();msg('دي حبال مرسومة فعلًا: اسحبي الدوائر الملوّنة، مش مجرد تبديل حروف.');
    }
    function renderFashion(){
      state={theme:0,look:-1,score:0,shown:false};
      const themes=['حفلة سباركل','إطلالة رياضية','سجادة حمراء'];
      const looks=[['👗✨','فستان سهرة لامع',3,'#b83280'],['👟🎽','ملابس رياضية مريحة',2,'#218a79'],['🧥👠','إطلالة رسمية أنيقة',2,'#3159a7'],['🩱🧢','ملابس سباحة',0,'#de8d35'],['🌸👗','فستان ربيعي',2,'#df78a6']];
      html('<p>موضوع العرض: <b id="wwa-fashion-theme"></b> | اختاري إطلالة ثم اعرضيها على منصة WonderWorld Fashion Week</p><div class="wwa-fashion-stage"><div class="wwa-fashion-sign">WONDERWORLD FASHION WEEK</div><div class="wwa-fashion-sparkles">✦ ✨ ✦ ✨ ✦</div><div class="wwa-fashion-model" id="wwa-fashion-avatar"><div class="wwa-fashion-hair">💇🏽‍♀️</div><div class="wwa-fashion-face">☺️</div><div class="wwa-fashion-clothes" id="wwa-fashion-clothes">👗</div><div class="wwa-fashion-shoes">👠</div></div><div class="wwa-fashion-runway"></div></div><div class="wwa-grid" id="wwa-looks"></div><p class="wwa-fashion-status" id="wwa-fashion-selected">اختاري إطلالتك من المجموعة</p>'+button('wwa-runway-go','👠 ابدئي عرض الأزياء'));
      function draw(){ $('#wwa-fashion-theme',panel).textContent=themes[state.theme];const wrap=$('#wwa-looks',panel);wrap.replaceChildren();looks.forEach((l,i)=>{const b=el('button',{type:'button',class:'wwa-tile','aria-pressed':String(state.look===i)},l[0]+' '+l[1]);b.addEventListener('click',()=>{state.look=i;state.shown=false;$('#wwa-fashion-selected',panel).textContent='الإطلالة المختارة: '+l[1];$('#wwa-fashion-clothes',panel).textContent=l[0];$('#wwa-fashion-avatar',panel).style.setProperty('--look-color',l[3]);draw();});wrap.appendChild(b);});}
      $('#wwa-content',panel).addEventListener('click',e=>{if(e.target.id!=='wwa-runway-go')return;if(state.look<0){msg('اختاري إطلالة الأول.');return;}const ideal=state.theme===0?[0,4].includes(state.look):state.theme===1?state.look===1:state.look===2;state.score=ideal?100:65;state.shown=true;$('#wwa-fashion-selected',panel).textContent='تقييم لجنة التحكيم: '+state.score+'/100 — '+looks[state.look][1];msg('تقييم لجنة التحكيم: '+state.score+'/100 — '+(ideal?'اختيار مناسب للموضوع! ⭐':'إطلالة جميلة، جربي تنسيقًا أنسب لموضوع العرض.'));state.theme=(state.theme+1)%themes.length;$('#wwa-fashion-theme',panel).textContent=themes[state.theme];});
      draw();msg('اختاري الملابس، شوفي شكل الإطلالة على العارضة، وبعدها ابدئي العرض لتحصلي على تقييم لجنة التحكيم.');
    }
    function renderPlane(){
      state={thrust:0,alt:0,distance:0,phase:0};
      html('<div class="wwa-look">✈️ 🛫 مدرج Wonder Air</div><p>قوة المحرك: <b id="wwa-thrust">0</b>% | الارتفاع: <b id="wwa-alt">0</b> م | التقدم: <b id="wwa-dist">0</b>%</p><div style="height:18px;border-radius:99px;background:#dce5ef;overflow:hidden"><div id="wwa-runway-progress" style="height:100%;width:0;background:#3c9a75"></div></div><div class="wwa-actions">'+button('wwa-thrust-up','زيادة قوة المحرك')+button('wwa-takeoff','🛫 إقلاع')+button('wwa-level','تثبيت الارتفاع','secondary')+button('wwa-land','🛬 هبوط','secondary')+'</div>');
      $('#wwa-content',panel).addEventListener('click',e=>{if(e.target.id==='wwa-thrust-up'){state.thrust=Math.min(100,state.thrust+20);msg('قوة المحرك الآن '+state.thrust+'%.');}else if(e.target.id==='wwa-takeoff'){if(state.thrust<60){msg('زودي قوة المحرك إلى 60% على الأقل قبل الإقلاع.');return;}state.phase=1;state.alt=300;state.distance=Math.min(100,state.distance+30);msg('تم الإقلاع! حافظي على الارتفاع.');}else if(e.target.id==='wwa-level'){if(state.phase!==1){msg('اقلعي أولًا قبل تثبيت الارتفاع.');return;}state.alt=Math.min(3000,state.alt+600);state.distance=Math.min(100,state.distance+20);msg('الطائرة مستقرة على ارتفاع '+state.alt+' متر.');}else if(e.target.id==='wwa-land'){if(state.phase!==1||state.distance<60){msg('لسه بدري على الهبوط. اكملي الرحلة وثبتي الطائرة.');return;}state.phase=2;state.alt=0;msg('هبوط ناجح في مدرج Wonder Air! ✨');}else return;$('#wwa-thrust',panel).textContent=state.thrust;$('#wwa-alt',panel).textContent=state.alt;$('#wwa-dist',panel).textContent=state.distance;$('#wwa-runway-progress',panel).style.width=state.distance+'%';});
      msg('ارفعي قوة المحرك، أقلعي، ثبتي الارتفاع ثم اهبطي بعد التقدم في الرحلة.');
    }
    function renderGym(){
      state={reps:0,exercise:'🏋️ رفع أوزان',energy:100};
      html('<div class="wwa-look" id="wwa-exercise">🏋️ رفع أوزان</div><p>التكرارات: <b id="wwa-reps">0</b> | الطاقة: <b id="wwa-gym-energy">100</b>% | نقاط اللياقة: <b id="wwa-fitness">0</b></p><div class="wwa-actions">'+button('wwa-lift','💪 تكرار')+button('wwa-change-exercise','تغيير التمرين','secondary')+button('wwa-gym-rest','استراحة','secondary')+'</div>');
      const exercises=['🏋️ رفع أوزان','🧘 تمدد','🚴 دراجة ثابتة','🏃 مشي سريع'];
      $('#wwa-content',panel).addEventListener('click',e=>{if(e.target.id==='wwa-lift'){if(state.energy<10){msg('طاقتك قليلة — خدي استراحة.');return;}state.reps++;state.energy-=10;$('#wwa-reps',panel).textContent=state.reps;$('#wwa-gym-energy',panel).textContent=state.energy;$('#wwa-fitness',panel).textContent=state.reps*5;msg('تكرار ممتاز! كل تكرار يضيف 5 نقاط لياقة.');}else if(e.target.id==='wwa-change-exercise'){state.exercise=exercises[(exercises.indexOf(state.exercise)+1)%exercises.length];$('#wwa-exercise',panel).textContent=state.exercise;msg('التمرين الحالي: '+state.exercise);}else if(e.target.id==='wwa-gym-rest'){state.energy=Math.min(100,state.energy+40);$('#wwa-gym-energy',panel).textContent=state.energy;msg('استعدتي جزءًا من طاقتك.');}});
      msg('اختاري تمرينًا وسجلي التكرارات، وخدي استراحة للحفاظ على الطاقة.');
    }
    function renderTrain(){
      state={speed:0,progress:0,station:0,stops:0};
      html('<div class="wwa-look" id="wwa-train-scene">🚆 محطة Wonder Central</div><p>السرعة: <b id="wwa-train-speed">0</b> كم/س | التقدم: <b id="wwa-train-progress">0</b>% | المحطات: <b id="wwa-train-stops">0</b>/3</p><div style="height:18px;border-radius:99px;background:#dce5ef;overflow:hidden"><div id="wwa-track-progress" style="height:100%;width:0;background:#3d8dc3"></div></div><div class="wwa-actions">'+button('wwa-train-accelerate','🚆 تسريع')+button('wwa-train-brake','🛑 فرامل','secondary')+button('wwa-train-open','فتح الأبواب')+'</div>');
      $('#wwa-content',panel).addEventListener('click',e=>{if(e.target.id==='wwa-train-accelerate'){state.speed=Math.min(120,state.speed+20);state.progress=Math.min(100,state.progress+12);msg('القطار يتحرك بسرعة '+state.speed+' كم/س.');}else if(e.target.id==='wwa-train-brake'){state.speed=Math.max(0,state.speed-30);msg('خفّضتي السرعة. استخدمي الفرامل قرب المحطة.');}else if(e.target.id==='wwa-train-open'){if(state.speed>0){msg('أوقفي القطار تمامًا قبل فتح الأبواب!');return;}if(state.progress<(state.station+1)*30){msg('لسه ما وصلتيش للمحطة التالية.');return;}if(state.station<3){state.station++;state.stops++;msg('وصلتي للمحطة '+state.station+' بأمان. أحسنتِ!');}else msg('خلصت الرحلة بنجاح.');}else return;$('#wwa-train-speed',panel).textContent=state.speed;$('#wwa-train-progress',panel).textContent=state.progress;$('#wwa-train-stops',panel).textContent=state.stops;$('#wwa-track-progress',panel).style.width=state.progress+'%';$('#wwa-train-scene',panel).textContent=state.speed?'🚆 القطار على السكة — المحطة التالية':'🚉 '+(state.station>=3?'وصلتي لنهاية الرحلة':'توقّف في المحطة');});
      msg('سرّعي للوصول، افرملي حتى الصفر، ثم افتحي الأبواب في المحطة.');
    }
    function renderArrows(){
      state={arrows:[
        {id:0,x:0,y:1,d:'←',dx:-1,dy:0},
        {id:1,x:2,y:0,d:'↑',dx:0,dy:-1},
        {id:2,x:1,y:3,d:'→',dx:1,dy:0},
        {id:3,x:4,y:2,d:'↓',dx:0,dy:1},
        {id:4,x:3,y:4,d:'←',dx:-1,dy:0},
        {id:5,x:4,y:4,d:'↑',dx:0,dy:-1}
      ],moves:0,cleared:0};
      html('<p>الأسهم لازم تخرج من حافة اللوحة في اتجاه رأس السهم. لو فيه سهم في طريقه، المسار مقفول.</p><div id="wwa-arrow-board" class="wwa-board" style="grid-template-columns:repeat(5,minmax(0,1fr))"></div><p>الأسهم الخارجة: <b id="wwa-arrow-cleared">0</b>/6 | الحركات: <b id="wwa-arrow-moves">0</b></p>');
      function canExit(a){for(let x=a.x+a.dx,y=a.y+a.dy;x>=0&&x<5&&y>=0&&y<5;x+=a.dx,y+=a.dy){if(state.arrows.some(other=>other.id!==a.id&&other.x===x&&other.y===y))return false;}return true;}
      function draw(){const wrap=$('#wwa-arrow-board',panel);wrap.replaceChildren();for(let y=0;y<5;y++)for(let x=0;x<5;x++){const a=state.arrows.find(v=>v.x===x&&v.y===y);const b=el('button',{type:'button',class:'wwa-candy','aria-label':a?'سهم '+a.d:'خانة فارغة'},a?a.d:'·');b.style.background=a?(canExit(a)?'#d5f4df':'#f9dfe2'):'#edf2f7';b.disabled=!a;b.addEventListener('click',()=>{if(canExit(a)){state.arrows=state.arrows.filter(v=>v.id!==a.id);state.cleared++;msg('السهم خرج من اللوحة بنجاح!');}else msg('المسار مقفول بسهم آخر. اختاري سهمًا بمسار مفتوح.');state.moves++;$('#wwa-arrow-cleared',panel).textContent=state.cleared;$('#wwa-arrow-moves',panel).textContent=state.moves;draw();if(!state.arrows.length)msg('رائع! فضّيتي اللوحة من كل الأسهم. 🏹');});wrap.appendChild(b);}}
      draw();msg('ابدئي بالأسهم ذات المسار الأخضر، ثم افتحي طريق الأسهم المحجوبة.');
    }
    function renderStocks(){
      state={cash:1000,shares:{WON:0,SKY:0,SPK:0},prices:{WON:20,SKY:35,SPK:15},history:[]};
      html('<p>الرصيد الافتراضي: <b id="wwa-cash">1000</b> عملة | قيمة المحفظة: <b id="wwa-portfolio">0</b></p><div class="wwa-stock" id="wwa-stock-list"></div><div class="wwa-actions">'+button('wwa-market-tick','📊 تحديث السوق')+button('wwa-stock-reset','إعادة المحفظة','secondary')+'</div>');
      function draw(){const wrap=$('#wwa-stock-list',panel);wrap.replaceChildren();Object.keys(state.prices).forEach(ticker=>{const article=el('article');const title=el('strong',{},ticker+' — '+({WON:'Wonder Tech',SKY:'Sky Travel',SPK:'Sparkle Studio'}[ticker]));const price=el('p',{},'السعر: '+state.prices[ticker]+' 🪙');const qty=el('p',{},'الأسهم: '+state.shares[ticker]);const buy=el('button',{type:'button',class:'wwa-btn'},'شراء سهم');const sell=el('button',{type:'button',class:'wwa-btn secondary'},'بيع سهم');buy.addEventListener('click',()=>{if(state.cash<state.prices[ticker]){msg('الرصيد الافتراضي مش كفاية.');return;}state.cash-=state.prices[ticker];state.shares[ticker]++;draw();});sell.addEventListener('click',()=>{if(!state.shares[ticker]){msg('ما عندكيش أسهم من النوع ده.');return;}state.shares[ticker]--;state.cash+=state.prices[ticker];draw();});article.append(title,price,qty,buy,sell);wrap.appendChild(article);});$('#wwa-cash',panel).textContent=state.cash;$('#wwa-portfolio',panel).textContent=Object.keys(state.prices).reduce((sum,k)=>sum+state.prices[k]*state.shares[k],0);}
      $('#wwa-content',panel).addEventListener('click',e=>{if(e.target.id==='wwa-market-tick'){Object.keys(state.prices).forEach(k=>state.prices[k]=Math.max(5,state.prices[k]+Math.floor(Math.random()*11)-5));draw();msg('تغيّرت الأسعار عشوائيًا للتدريب فقط. الأرباح والخسائر افتراضية.');}if(e.target.id==='wwa-stock-reset'){state.cash=1000;state.shares={WON:0,SKY:0,SPK:0};state.prices={WON:20,SKY:35,SPK:15};draw();msg('بدأت محفظة افتراضية جديدة.');}});
      draw();msg('تعلّمي الشراء والبيع بمحفظة افتراضية. لا يوجد ربط بسوق مالي حقيقي.');
    }
    function renderCups(){
      state={star:Math.floor(Math.random()*3),score:0,done:false};
      html('<p>النقاط: <b id="wwa-cup-score">0</b></p><div class="wwa-grid" id="wwa-cup-grid"></div>'+button('wwa-cup-shuffle','🔀 خلط الكؤوس','secondary'));
      function draw(){const wrap=$('#wwa-cup-grid',panel);wrap.replaceChildren();for(let i=0;i<3;i++){const b=el('button',{type:'button',class:'wwa-tile','data-cup':i},'🥤 كأس '+(i+1));b.style.justifyContent='center';b.addEventListener('click',()=>{if(state.done)return;state.done=true;const right=i===state.star;if(right)state.score++;wrap.querySelectorAll('button').forEach((cup,j)=>{cup.disabled=true;cup.textContent=(j===state.star?'⭐':'🥤')+' كأس '+(j+1);});$('#wwa-cup-score',panel).textContent=state.score;msg(right?'صح! النجمة كانت هنا. ⭐':'مش دي — النجمة كانت تحت الكأس '+(state.star+1)+'.');});wrap.appendChild(b);}}
      $('#wwa-content',panel).addEventListener('click',e=>{if(e.target.id==='wwa-cup-shuffle'){state.star=Math.floor(Math.random()*3);state.done=false;draw();msg('اتخلطت الكؤوس. فين النجمة؟');}});
      draw();msg('اختاري الكأس اللي تتوقعي إن النجمة مخبأة تحته.');
    }
    function renderSpace(){
      state={x:320,y:345,shots:0,score:0,rocks:[{x:100,y:75},{x:250,y:120},{x:420,y:80},{x:540,y:145}]};
      html(canvas('wwa-space-canvas')+'<div class="wwa-controls"><button data-s="left">◀ يسار</button><button data-s="fire">🚀 إطلاق</button><button data-s="right">يمين ▶</button></div><p>النتيجة: <b id="wwa-space-score">0</b> | الذخيرة: طاقة ليزر غير محدودة</p>');
      const c=$('#wwa-space-canvas',panel),ctx=c.getContext('2d');
      function draw(){ctx.fillStyle='#111a3e';ctx.fillRect(0,0,640,400);for(let i=0;i<55;i++){ctx.fillStyle='#fff';ctx.fillRect((i*97)%640,(i*61)%400,2,2);}ctx.fillStyle='#5ce0e8';ctx.beginPath();ctx.moveTo(state.x,state.y-22);ctx.lineTo(state.x-19,state.y+17);ctx.lineTo(state.x+19,state.y+17);ctx.closePath();ctx.fill();state.rocks.forEach(r=>{ctx.fillStyle='#e99a75';ctx.beginPath();ctx.arc(r.x,r.y,16,0,Math.PI*2);ctx.fill();ctx.fillStyle='#f8d7aa';ctx.fillRect(r.x-5,r.y-3,8,5);});ctx.fillStyle='#fff';ctx.font='bold 15px sans-serif';ctx.fillText('SPACE BLASTER',18,25);}
      const fire=()=>{state.shots++;let hit=state.rocks.find(r=>Math.abs(r.x-state.x)<45);if(hit){state.rocks=state.rocks.filter(r=>r!==hit);state.score++;msg('إصابة نيزك! +1 ⭐');}else msg('الليزر مرّ بعيدًا. حرّكي المركبة تحت النيازك.');$('#wwa-space-score',panel).textContent=state.score;if(!state.rocks.length){state.rocks=[{x:80,y:90},{x:210,y:140},{x:380,y:75},{x:560,y:120}];msg('موجة جديدة من النيازك!');}draw();};
      $('#wwa-content',panel).querySelectorAll('[data-s]').forEach(b=>b.addEventListener('click',()=>{if(b.dataset.s==='left')state.x=Math.max(25,state.x-40);if(b.dataset.s==='right')state.x=Math.min(615,state.x+40);if(b.dataset.s==='fire')fire();draw();}));
      c.addEventListener('pointerdown',e=>{const r=c.getBoundingClientRect();state.x=Math.max(25,Math.min(615,(e.clientX-r.left)/r.width*640));draw();});
      draw();msg('حركي سفينة الفضاء أسفل النيازك واضغطي إطلاق.');
    }
    function renderCandy(){
      const symbols=['🍬','🍭','🍓','🍋','🍇','🍊'];
      state={board:Array.from({length:36},()=>Math.floor(Math.random()*6)),score:0,moves:0};
      html('<p>النقاط: <b id="wwa-candy-score">0</b> | الحركات: <b id="wwa-candy-moves">0</b></p><div id="wwa-candy-board" class="wwa-board"></div>');
      function matches(board){const out=new Set();for(let r=0;r<6;r++)for(let c=0;c<6;c++){const i=r*6+c;if(c<4&&board[i]===board[i+1]&&board[i]===board[i+2]){let j=c;while(j<6&&board[r*6+j]===board[i]){out.add(r*6+j);j++;}}if(r<4&&board[i]===board[i+6]&&board[i]===board[i+12]){let j=r;while(j<6&&board[j*6+c]===board[i]){out.add(j*6+c);j++;}}}return out;}
      function draw(){const wrap=$('#wwa-candy-board',panel);wrap.replaceChildren();state.board.forEach((v,i)=>{const b=el('button',{type:'button',class:'wwa-candy','aria-label':'حلوى '+(i+1)},symbols[v]);if(selectedCandy===i)b.style.outline='3px solid #9b5bc4';b.addEventListener('click',()=>{if(selectedCandy===null){selectedCandy=i;draw();return;}const a=selectedCandy;selectedCandy=null;if(Math.abs(a-i)!==6&&!(Math.floor(a/6)===Math.floor(i/6)&&Math.abs(a-i)===1)){msg('بدّلي حبتين متجاورتين فقط.');draw();return;}[state.board[a],state.board[i]]=[state.board[i],state.board[a]];const m=matches(state.board);if(m.size){m.forEach(j=>state.board[j]=Math.floor(Math.random()*6));state.score+=m.size*10;msg('مطابقة ممتازة! جمعتي '+(m.size*10)+' نقطة 🍬');}else{[state.board[a],state.board[i]]=[state.board[i],state.board[a]];msg('المبادلة دي ما عملتش 3 متشابهين. جربي غيرها.');}state.moves++;$('#wwa-candy-score',panel).textContent=state.score;$('#wwa-candy-moves',panel).textContent=state.moves;draw();});wrap.appendChild(b);});}
      draw();msg('اختاري حبة ثم حبة مجاورة لتكوين خط من 3 أو أكثر. المطابقات تمنح نقاطًا.');
    }
    function renderParty(){
      const qs=[
        ['ما الكوكب المعروف بالكوكب الأحمر؟',['المريخ','الزهرة','زحل'],0],
        ['كم لاعبًا في فريق كرة القدم داخل الملعب؟',['7','11','15'],1],
        ['أي لون ينتج من مزج الأزرق والأصفر؟',['بنفسجي','أخضر','وردي'],1],
        ['ما الحيوان الذي يُعرف بملك الغابة؟',['الفيل','الأسد','الذئب'],1],
        ['أي قطعة ملابس مناسبة عادةً للتمرين؟',['حذاء رياضي','كعب سهرة','تاج'],0],
        ['ما النجم الأقرب إلى الأرض؟',['الشمس','الشعرى','النجم القطبي'],0],
        ['ما وسيلة النقل التي تسير على القضبان؟',['الطائرة','القطار','السفينة'],1],
        ['أي شيء يساعد الطائرة على الطيران؟',['الأجنحة','العجلات فقط','المراسي'],0]
      ];
      state={index:0,score:0,answered:false,order:qs.slice().sort(()=>Math.random()-.5)};
      html('<p>السؤال <b id="wwa-party-num">1</b>/8 | النقاط: <b id="wwa-party-score">0</b></p><h3 id="wwa-party-question"></h3><div id="wwa-party-answers"></div>');
      function draw(){const q=state.order[state.index];$('#wwa-party-num',panel).textContent=state.index+1;$('#wwa-party-question',panel).textContent=q[0];const wrap=$('#wwa-party-answers',panel);wrap.replaceChildren();q[1].forEach((a,i)=>{const b=el('button',{type:'button',class:'wwa-choice'},a);b.addEventListener('click',()=>{if(state.answered)return;state.answered=true;const correct=i===q[2];if(correct)state.score+=10;$('#wwa-party-score',panel).textContent=state.score;msg(correct?'إجابة صحيحة! +10 نقاط ✨':'مش الإجابة الصحيحة. الإجابة: '+q[1][q[2]]);wrap.querySelectorAll('button').forEach(x=>x.disabled=true);const next=el('button',{type:'button',class:'wwa-btn'},state.index===7?'عرض النتيجة':'السؤال التالي ➜');next.addEventListener('click',()=>{if(state.index===7){msg('انتهت المسابقة! نتيجتك '+state.score+'/80 نقطة. تقدري تعيديها لجولة جديدة.');return;}state.index++;state.answered=false;draw();});wrap.appendChild(next);});wrap.appendChild(b);});}
      draw();msg('جاوبي على الأسئلة المتنوعة واجمعي النقاط. لا يوجد دردشة بين اللاعبين.');
    }
    launch.addEventListener('click',()=>{panel.hidden=false;$('#wwa-home',panel).focus();});
    $('#wwa-home',panel).addEventListener('click',()=>{stopLoop();game.hidden=true;menu.hidden=false;active='';panel.hidden=true;launch.focus();});
    $('#wwa-back',panel).addEventListener('click',()=>{stopLoop();game.hidden=true;menu.hidden=false;active='';});
    $('#wwa-reset',panel).addEventListener('click',renderGame);
    menu.addEventListener('click',e=>{const b=e.target.closest('[data-game]');if(b)start(b.dataset.game);});
    panel.addEventListener('keydown',e=>{if(e.key==='Escape'){panel.hidden=true;stopLoop();launch.focus();}});
    return true;
  }
  if(!boot()){const observer=new MutationObserver(()=>{if(boot())observer.disconnect();});observer.observe(document.documentElement,{childList:true,subtree:true});}
  window.addEventListener('wonderworld:open-activity', event => {
    const requestedId = event.detail && event.detail.id;
    if (!activities.some(([id]) => id === requestedId)) return;
    const launchButton = $('#ww-activities-launch');
    const panel = $('#ww-activities');
    if (!launchButton || !panel) return;
    if (panel.hidden) launchButton.click();
    if (!$('#wwa-game', panel).hidden) $('#wwa-back', panel).click();
    const tile = $('#wwa-menu [data-game="' + requestedId + '"]', panel);
    if (tile) tile.click();
  });
})();