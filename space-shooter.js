(() => {
  'use strict';
  if (document.getElementById('ww-space-launcher')) return;

  const style = document.createElement('style');
  style.textContent = `
    #ww-space-launcher{position:fixed;z-index:60;top:68px;left:12px;border:0;border-radius:14px;padding:10px 13px;background:#44277a;color:#fff;font:800 14px system-ui;box-shadow:0 5px 18px #170b3540;touch-action:manipulation}
    #ww-space-panel{position:fixed;z-index:100;inset:10px;max-width:760px;max-height:calc(100dvh - 20px);margin:auto;padding:14px;border:1px solid #b9a5ee;border-radius:22px;background:linear-gradient(160deg,#171431,#28204f 65%,#172b4d);color:#fff;box-shadow:0 20px 70px #09051e99;display:flex;flex-direction:column;gap:10px;overflow:auto;font-family:system-ui,sans-serif;pointer-events:auto}
    #ww-space-panel[hidden]{display:none!important}
    #ww-space-panel *{box-sizing:border-box}
    .ww-space-head{display:flex;align-items:center;justify-content:space-between;gap:10px}
    .ww-space-head h2{margin:0;font-size:19px}
    .ww-space-head button,.ww-space-actions button,.ww-space-pad button{border:1px solid #a99be8;border-radius:11px;padding:9px 12px;background:#443775;color:#fff;font:700 14px system-ui;touch-action:manipulation}
    .ww-space-stats{display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap;font-size:13px;font-weight:800}
    #ww-space-canvas{display:block;width:100%;height:min(48vh,390px);min-height:230px;border:1px solid #5e4f9b;border-radius:15px;background:#080b20;touch-action:none}
    .ww-space-actions{display:flex;gap:8px;flex-wrap:wrap}
    .ww-space-actions button{flex:1;min-height:42px}
    .ww-space-pad{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}
    .ww-space-pad button{min-height:48px;font-size:19px}
    #ww-space-message{margin:0;min-height:1.4em;color:#e2dcff;font-size:13px}
    #ww-space-panel button:focus-visible{outline:3px solid #ffdf7e;outline-offset:2px}
    @media(min-width:650px){#ww-space-panel{inset:18px auto 18px 18px;width:min(760px,calc(100vw - 36px))}#ww-space-canvas{height:390px}}
  `;
  document.head.appendChild(style);

  const launcher = document.createElement('button');
  launcher.id = 'ww-space-launcher'; launcher.type = 'button';
  launcher.textContent = '🚀 لعبة الفضاء';
  launcher.setAttribute('aria-controls', 'ww-space-panel');
  launcher.setAttribute('aria-expanded', 'false');
  document.body.appendChild(launcher);

  const panel = document.createElement('section');
  panel.id = 'ww-space-panel'; panel.hidden = true;
  panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-modal', 'true'); panel.setAttribute('aria-label', 'لعبة إطلاق النار الفضائية');
  panel.innerHTML = `
    <div class="ww-space-head"><h2>🚀 حماة المجرة</h2><button id="ww-space-close" type="button" aria-label="إغلاق اللعبة">✕ إغلاق</button></div>
    <div class="ww-space-stats"><span>النقاط: <b id="ww-space-score">0</b></span><span>أفضل نتيجة: <b id="ww-space-best">0</b></span><span>المحاولات: <b id="ww-space-lives">3</b></span></div>
    <canvas id="ww-space-canvas" aria-label="ساحة لعبة فضائية: حرّكي السفينة وتجنبي الشهب وأطلقي النار"></canvas>
    <p id="ww-space-message" role="status">حرّكي السفينة واطلقي النار على الشهب قبل وصولها إليك.</p>
    <div class="ww-space-pad" aria-label="أزرار تحكم السفينة"><button type="button" data-space-move="left" aria-label="يسار">◀</button><button type="button" data-space-move="fire" aria-label="إطلاق النار">🔥 إطلاق</button><button type="button" data-space-move="right" aria-label="يمين">▶</button></div>
    <div class="ww-space-actions"><button id="ww-space-start" type="button">▶ ابدئي اللعب</button><button id="ww-space-pause" type="button">⏸ إيقاف مؤقت</button></div>
    <p style="margin:0;font-size:12px;color:#c7c0ef">التحكم بالأسهم أو A/D، والإطلاق بمسافة. اللعبة مجانية ولا تستخدم مشتريات أو دردشة.</p>
  `;
  document.body.appendChild(panel);

  const canvas = panel.querySelector('#ww-space-canvas');
  const ctx = canvas.getContext('2d');
  const scoreEl = panel.querySelector('#ww-space-score');
  const bestEl = panel.querySelector('#ww-space-best');
  const livesEl = panel.querySelector('#ww-space-lives');
  const message = panel.querySelector('#ww-space-message');
  const startBtn = panel.querySelector('#ww-space-start');
  const pauseBtn = panel.querySelector('#ww-space-pause');
  const closeBtn = panel.querySelector('#ww-space-close');
  let width = 640, height = 360, dpr = 1, raf = 0, last = 0, spawn = 0, shot = 0;
  let running = false, gameOver = false, score = 0, lives = 3, best = 0;
  let ship = { x: 320, y: 310, w: 24, h: 28, speed: 280 };
  let bullets = [], rocks = [], stars = [];
  const keys = new Set();
  const pointer = { left: false, right: false, fire: false };
  try { best = Number(localStorage.getItem('ww-space-shooter-best') || 0) || 0; } catch (_) {}
  bestEl.textContent = String(best);

  function resize() {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    width = rect.width; height = rect.height; dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ship.y = height - 38; ship.x = Math.max(18, Math.min(width - 18, ship.x));
    stars = Array.from({length: Math.max(45, Math.floor(width * height / 3600))}, () => ({x:Math.random()*width,y:Math.random()*height,r:Math.random()*1.7+0.3,v:20+Math.random()*55}));
    draw();
  }
  function reset() {
    score = 0; lives = 3; bullets = []; rocks = []; spawn = 0; shot = 0; gameOver = false;
    ship.x = width / 2; ship.y = height - 38;
    scoreEl.textContent = '0'; livesEl.textContent = '3';
    message.textContent = 'انطلقي! صوّبي على الشهب واحمي المجرة ✨';
    running = true; last = performance.now(); pauseBtn.textContent = '⏸ إيقاف مؤقت';
    if (!raf) raf = requestAnimationFrame(frame);
  }
  function open() {
    panel.hidden = false; launcher.setAttribute('aria-expanded','true');
    requestAnimationFrame(() => { resize(); if (!running && !gameOver) draw(); closeBtn.focus(); });
  }
  function close() {
    panel.hidden = true; launcher.setAttribute('aria-expanded','false');
    running = false; keys.clear(); pointer.left = pointer.right = pointer.fire = false; launcher.focus();
  }
  function hit(a,b) { return Math.abs(a.x-b.x) < (a.w+b.w)/2 && Math.abs(a.y-b.y) < (a.h+b.h)/2; }
  function draw() {
    if (!ctx || panel.hidden) return;
    ctx.clearRect(0,0,width,height);
    const bg = ctx.createLinearGradient(0,0,0,height); bg.addColorStop(0,'#080b20'); bg.addColorStop(1,'#24164b'); ctx.fillStyle=bg;ctx.fillRect(0,0,width,height);
    for (const s of stars) { ctx.globalAlpha=.45+(s.r/2.5);ctx.fillStyle='#e8e5ff';ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fill(); } ctx.globalAlpha=1;
    for (const b of bullets) { ctx.fillStyle='#7ef9ff';ctx.shadowColor='#7ef9ff';ctx.shadowBlur=10;ctx.fillRect(b.x-2,b.y-8,4,12); } ctx.shadowBlur=0;
    for (const r of rocks) { ctx.fillStyle=r.color;ctx.strokeStyle='#ffc4d8';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(r.x-r.w*.45,r.y-r.h*.25);ctx.lineTo(r.x-r.w*.25,r.y-r.h*.5);ctx.lineTo(r.x+r.w*.3,r.y-r.h*.42);ctx.lineTo(r.x+r.w*.5,r.y+r.h*.05);ctx.lineTo(r.x+r.w*.18,r.y+r.h*.48);ctx.lineTo(r.x-r.w*.38,r.y+r.h*.35);ctx.closePath();ctx.fill();ctx.stroke(); }
    ctx.save();ctx.translate(ship.x,ship.y);ctx.fillStyle='#7ef9ff';ctx.shadowColor='#67dfff';ctx.shadowBlur=12;ctx.beginPath();ctx.moveTo(0,-17);ctx.lineTo(13,12);ctx.lineTo(0,7);ctx.lineTo(-13,12);ctx.closePath();ctx.fill();ctx.shadowBlur=0;ctx.fillStyle='#f8c9ff';ctx.beginPath();ctx.ellipse(0,-2,4,6,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#ffad5c';ctx.beginPath();ctx.moveTo(-5,11);ctx.lineTo(0,20+Math.random()*4);ctx.lineTo(5,11);ctx.fill();ctx.restore();
    if (!running) { ctx.fillStyle='#ffffff';ctx.textAlign='center';ctx.font='800 20px system-ui';ctx.fillText(gameOver?'انتهت الجولة!':'حماة المجرة',width/2,height/2-8);ctx.font='14px system-ui';ctx.fillStyle='#d6d0ff';ctx.fillText(gameOver?'ابدئي جولة جديدة وحاولي تحطيم رقمك':'اضغطي «ابدئي اللعب» للانطلاق',width/2,height/2+20); }
  }
  function frame(now) {
    raf = 0;
    if (panel.hidden) return;
    const dt = Math.min((now-last)/1000,.035); last = now;
    if (running) {
      for (const s of stars) { s.y += s.v*dt; if(s.y>height){s.y=0;s.x=Math.random()*width;} }
      if (keys.has('ArrowLeft')||keys.has('a')||keys.has('A')||pointer.left) ship.x -= ship.speed*dt;
      if (keys.has('ArrowRight')||keys.has('d')||keys.has('D')||pointer.right) ship.x += ship.speed*dt;
      ship.x = Math.max(17,Math.min(width-17,ship.x));
      shot -= dt;
      if ((keys.has(' ')||pointer.fire) && shot<=0) { bullets.push({x:ship.x,y:ship.y-18,w:5,h:13,v:440});shot=.22; }
      spawn -= dt;
      if (spawn<=0) { const size=18+Math.random()*20;rocks.push({x:18+Math.random()*(width-36),y:-25,w:size,h:size,v:75+Math.random()*75+Math.min(score,400)*.12,color:['#c7a9ff','#ff8cb5','#ffd07d','#92e4ff'][Math.floor(Math.random()*4)]});spawn=Math.max(.32,.9-score*.0015); }
      for (const b of bullets) b.y -= b.v*dt;
      for (const r of rocks) r.y += r.v*dt;
      bullets = bullets.filter(b=>b.y>-20);
      for (let i=rocks.length-1;i>=0;i--) {
        const r=rocks[i]; let destroyed=false;
        for(let j=bullets.length-1;j>=0;j--) if(hit(r,{...bullets[j],w:8,h:14})){rocks.splice(i,1);bullets.splice(j,1);score+=10;scoreEl.textContent=String(score);destroyed=true;break;}
        if(destroyed)continue;
        if(hit(r,ship)){rocks.splice(i,1);lives--;livesEl.textContent=String(lives);message.textContent='خدي بالك! الشهب قربت من سفينتك.';if(lives<=0){running=false;gameOver=true;message.textContent='انتهت الجولة. نتيجتك '+score+' نقطة — جربي تاني!';if(score>best){best=score;bestEl.textContent=String(best);try{localStorage.setItem('ww-space-shooter-best',String(best));}catch(_){}}}}
        else if(r.y>height+30){rocks.splice(i,1);lives--;livesEl.textContent=String(lives);if(lives<=0){running=false;gameOver=true;message.textContent='انتهت الجولة. نتيجتك '+score+' نقطة — جربي تاني!';if(score>best){best=score;bestEl.textContent=String(best);try{localStorage.setItem('ww-space-shooter-best',String(best));}catch(_){}}}}
      }
    }
    draw();
    if (!panel.hidden) raf=requestAnimationFrame(frame);
  }
  launcher.addEventListener('click',open); closeBtn.addEventListener('click',close);
  window.addEventListener('keydown',e=>{if(!panel.hidden&&e.key==='Escape'){e.preventDefault();close();}});
  startBtn.addEventListener('click',reset);
  pauseBtn.addEventListener('click',()=>{if(gameOver)return;running=!running;pauseBtn.textContent=running?'⏸ إيقاف مؤقت':'▶ متابعة';message.textContent=running?'رجعنا للعب!':'اللعبة متوقفة مؤقتًا.';last=performance.now();if(!raf&&!panel.hidden)raf=requestAnimationFrame(frame);});
  panel.querySelectorAll('[data-space-move]').forEach(btn=>{
    const action=btn.dataset.spaceMove;
    const down=e=>{e.preventDefault();pointer[action]=true;};
    const up=e=>{e.preventDefault();pointer[action]=false;};
    btn.addEventListener('pointerdown',down);btn.addEventListener('pointerup',up);btn.addEventListener('pointercancel',up);btn.addEventListener('pointerleave',up);
  });
  window.addEventListener('keydown',e=>{if(panel.hidden)return;if(['ArrowLeft','ArrowRight',' '].includes(e.key))e.preventDefault();keys.add(e.key);},{passive:false});
  window.addEventListener('keyup',e=>keys.delete(e.key));
  window.addEventListener('blur',()=>{keys.clear();pointer.left=pointer.right=pointer.fire=false;});
  window.addEventListener('resize',resize);
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&running){running=false;pauseBtn.textContent='▶ متابعة';message.textContent='اللعبة متوقفة مؤقتًا لأنك خرجتي من الصفحة.';}});
  canvas.addEventListener('pointerdown',e=>{if(!running)return;const rect=canvas.getBoundingClientRect();ship.x=Math.max(17,Math.min(width-17,e.clientX-rect.left));});
  resize(); draw();
})();