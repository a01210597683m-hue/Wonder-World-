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
    '.wwa-ropes{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin:12px 0}.wwa-rope{padding:12px 4px;border:2px solid #dfd5eb;border-radius:12px;background:#fff;font:inherit;font-weight:800}',
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
    const menu = $('#wwa-menu',panel), game = $('#wwa-game',panel), content = $('#wwa-content',panel), feedback = $('#wwa-feedback',panel);
    activities.forEach(([id,emoji,title]) => {
      const b=el('button',{type:'button',class:'wwa-tile','data-game':id});
      b.append(el('span',{},emoji),el('span',{},title));menu.appendChild(b);
    });
    let active='', state={}, frame=0, keys={}, selectedCandy=null;
    const msg = text => { feedback.textContent=text; };
    const html = value => { content.innerHTML=value; };
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
      state={x:320,y:315,hp:100,ammo:12,score:0,targets:[{x:115,y:115,hp:2},{x:320,y:90,hp:2},{x:510,y:130,hp:2}],aimX:320,aimY:100};
      html(canvas('wwa-battle-canvas')+'<div class="wwa-controls"><button data-act="up">▲ تحرك</button><button data-act="reload">🔄 تلقيم</button><button data-act="fire">إطلاق 🎯</button><button data-act="left">◀ يسار</button><button data-act="down">▼ خلف</button><button data-act="right">يمين ▶</button></div><p>الصحة: <b id="wwa-hp">100</b> | الذخيرة: <b id="wwa-ammo">12</b> | الأهداف: <b id="wwa-bscore">0</b>/3</p>');
      const c=$('#wwa-battle-canvas',panel),ctx=c.getContext('2d');
      function draw(){
        ctx.clearRect(0,0,640,400);ctx.fillStyle='#cfe6cb';ctx.fillRect(0,0,640,400);
        ctx.fillStyle='#c6d3df';ctx.fillRect(0,0,640,45);ctx.fillStyle='#3e5367';ctx.fillRect(0,45,640,8);
        for(let i=0;i<5;i++){ctx.fillStyle=i%2?'#b3c2cd':'#9fb0bd';ctx.fillRect(45+i*125,175,62,45);ctx.fillStyle='#687f90';ctx.fillRect(55+i*125,185,42,25);}
        state.targets.forEach(t=>{if(t.hp<=0)return;ctx.fillStyle='#b54f55';ctx.beginPath();ctx.arc(t.x,t.y,17,0,Math.PI*2);ctx.fill();ctx.fillStyle='#fff';ctx.fillRect(t.x-4,t.y-10,8,20);ctx.fillRect(t.x-10,t.y-4,20,8);});
        ctx.fillStyle='#533c86';ctx.beginPath();ctx.arc(state.x,state.y,15,0,Math.PI*2);ctx.fill();ctx.fillStyle='#f8e6c8';ctx.beginPath();ctx.arc(state.x,state.y-18,9,0,Math.PI*2);ctx.fill();
        ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.beginPath();ctx.arc(state.aimX,state.aimY,10,0,Math.PI*2);ctx.moveTo(state.aimX-15,state.aimY);ctx.lineTo(state.aimX+15,state.aimY);ctx.moveTo(state.aimX,state.aimY-15);ctx.lineTo(state.aimX,state.aimY+15);ctx.stroke();
        ctx.fillStyle='#26374b';ctx.font='bold 15px sans-serif';ctx.fillText('TRAINING ZONE',18,27);
      }
      function update(){ $('#wwa-hp',panel).textContent=state.hp;$('#wwa-ammo',panel).textContent=state.ammo;$('#wwa-bscore',panel).textContent=state.score;draw(); }
      const move=(dx,dy)=>{state.x=Math.max(20,Math.min(620,state.x+dx));state.y=Math.max(70,Math.min(370,state.y+dy));update();};
      const fire=()=>{if(state.ammo<=0){msg('الذخيرة خلصت — اضغطي تلقيم.');return;}state.ammo--;let hit=state.targets.filter(t=>t.hp>0).sort((a,b)=>Math.hypot(a.x-state.aimX,a.y-state.aimY)-Math.hypot(b.x-state.aimX,b.y-state.aimY))[0];if(hit&&Math.hypot(hit.x-state.aimX,hit.y-state.aimY)<42){hit.hp--;if(hit.hp===0)state.score++;msg(hit.hp===0?'إصابة دقيقة! هدف اتدمر في تدريب آمن.':'إصابة! كملي التصويب.');}else msg('الطلقة ما أصابتش الهدف. حاولي التصويب على علامة الهدف.');update();if(state.score===3)msg('فوز! خلصتي تدريب الأهداف الثلاثة ⭐');};
      c.addEventListener('pointerdown',e=>{const r=c.getBoundingClientRect();state.aimX=(e.clientX-r.left)/r.width*640;state.aimY=(e.clientY-r.top)/r.height*400;update();});
      $('#wwa-content',panel).querySelectorAll('[data-act]').forEach(b=>b.addEventListener('click',()=>{const a=b.dataset.act;if(a==='up')move(0,-18);if(a==='down')move(0,18);if(a==='left')move(-18,0);if(a==='right')move(18,0);if(a==='reload'){state.ammo=12;msg('تم تلقيم 12 طلقة تدريبية.');update();}if(a==='fire')fire();}));
      update();msg('ابدئي بالتحرك والتصويب على الأهداف. ده تدريب تصويب 2D، مش نسخة PUBG ثلاثية الأبعاد.');
    }
    function renderFootball(){
      state={x:320,y:205,ballX:350,ballY:205,score:0,shots:0,keeperX:320};
      html(canvas('wwa-football-canvas')+'<div class="wwa-controls"><button data-f="up">▲ للأمام</button><button data-f="pass">تمرير ⚽</button><button data-f="shoot">تسديد 🥅</button><button data-f="left">◀ يسار</button><button data-f="down">▼ للخلف</button><button data-f="right">يمين ▶</button></div><p>النتيجة: <b id="wwa-goals">0</b> أهداف</p>');
      const c=$('#wwa-football-canvas',panel),ctx=c.getContext('2d');
      function draw(){ctx.clearRect(0,0,640,400);ctx.fillStyle='#3d9a62';ctx.fillRect(0,0,640,400);ctx.strokeStyle='#eaffec';ctx.lineWidth=3;ctx.strokeRect(18,18,604,364);ctx.beginPath();ctx.moveTo(320,18);ctx.lineTo(320,382);ctx.stroke();ctx.beginPath();ctx.arc(320,200,55,0,Math.PI*2);ctx.stroke();ctx.strokeRect(235,18,170,65);ctx.strokeRect(270,18,100,35);ctx.fillStyle='#fff';ctx.fillRect(280,18,80,9);ctx.fillStyle='#f4f4f4';ctx.beginPath();ctx.arc(state.ballX,state.ballY,9,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#27364b';ctx.stroke();ctx.fillStyle='#e9f2ff';ctx.beginPath();ctx.arc(state.x,state.y,14,0,Math.PI*2);ctx.fill();ctx.fillStyle='#255dba';ctx.fillRect(state.x-11,state.y-4,22,14);ctx.fillStyle='#ee6a65';ctx.beginPath();ctx.arc(state.keeperX,49,12,0,Math.PI*2);ctx.fill();ctx.fillStyle='#fff';ctx.font='bold 16px sans-serif';ctx.fillText('WONDER FC',25,36);ctx.fillText('GOAL',292,76);}
      const move=(dx,dy)=>{state.x=Math.max(30,Math.min(610,state.x+dx));state.y=Math.max(35,Math.min(365,state.y+dy));if(Math.hypot(state.x-state.ballX,state.y-state.ballY)<36){state.ballX=state.x+18;state.ballY=state.y-4;}draw();};
      const shoot=()=>{state.shots++;if(state.y<145&&Math.abs(state.x-320)<105&&Math.random()>.28){state.score++;msg('جوووول! تسديدة ناجحة ⚽');}else msg('الحارس صد التسديدة أو كنتي بعيدة. قرّبي الكرة من منطقة الجزاء.');$('#wwa-goals',panel).textContent=state.score;state.ballX=state.x+18;state.ballY=state.y-4;draw();};
      const pass=()=>{state.ballX=Math.max(25,Math.min(615,state.x+(state.x<320?85:-85)));state.ballY=Math.max(30,Math.min(370,state.y-35));msg('تمريرة! تحركي لمكان الكرة وكملي الهجمة.');draw();};
      $('#wwa-content',panel).querySelectorAll('[data-f]').forEach(b=>b.addEventListener('click',()=>{const a=b.dataset.f;if(a==='up')move(0,-20);if(a==='down')move(0,20);if(a==='left')move(-20,0);if(a==='right')move(20,0);if(a==='pass')pass();if(a==='shoot')shoot();}));
      c.addEventListener('pointerdown',e=>{const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width*640,y=(e.clientY-r.top)/r.height*400;state.x=x;state.y=y;if(Math.hypot(x-state.ballX,y-state.ballY)<70){state.ballX=x+18;state.ballY=y-4;}draw();});
      draw();msg('حرّكي اللاعب باتجاه المرمى، قرّبي الكرة ثم سددي. كل الأهداف محسوبة في الجولة.');
    }
    function renderRopes(){
      state={nodes:[0,1,2,3],selected:0,moves:0};
      html('<p>اختاري عقدة ثم اضغطي عقدة أخرى لتبديل مكانيهما. الهدف إزالة التقاطعات.</p><div class="wwa-ropes" id="wwa-rope-nodes"></div><p>التقاطعات: <b id="wwa-crossings">3</b> | الحركات: <b id="wwa-rope-moves">0</b></p>');
      const points=()=>{const pos=[[0,0],[2,2],[0,2],[2,0]], actual=state.nodes.map(i=>pos[i]);return actual;};
      function crossings(){const p=points();let n=0;for(let i=0;i<4;i++)for(let j=i+1;j<4;j++){if((p[i][0]-p[j][0])*(p[(i+1)%4][1]-p[j][1])-(p[i][1]-p[j][1])*(p[(i+1)%4][0]-p[j][0])<0)n++;}return Math.max(0,3-state.nodes.filter((v,i)=>v===i).length);}
      function draw(){const wrap=$('#wwa-rope-nodes',panel);wrap.replaceChildren();state.nodes.forEach((node,i)=>{const b=el('button',{type:'button',class:'wwa-rope','aria-pressed':String(state.selected===i)},['🔴 عقدة A','🔵 عقدة B','🟡 عقدة C','🟣 عقدة D'][node]);b.style.borderColor=state.selected===i?'#7b4cb2':'#dfd5eb';b.addEventListener('click',()=>{if(state.selected===i){state.selected=(i+1)%4;}else{[state.nodes[state.selected],state.nodes[i]]=[state.nodes[i],state.nodes[state.selected]];state.moves++;state.selected=i;}$('#wwa-crossings',panel).textContent=String(crossings());$('#wwa-rope-moves',panel).textContent=state.moves;draw();if(crossings()===0)msg('ممتاز! فكّيتي التشابك. 🪢');});wrap.appendChild(b);});$('#wwa-crossings',panel).textContent=String(crossings());}
      draw();msg('بدّلي مواقع العقد حتى تتخلصي من التقاطعات. كل تبديل حركة.');
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