// WonderWorld casual arcade: memory pairs and shell-cup guessing.
(() => {
  'use strict';
  const make=(tag,attrs={},text='')=>{const n=document.createElement(tag);Object.entries(attrs).forEach(([k,v])=>n.setAttribute(k,String(v)));if(text)n.textContent=text;return n;};
  const css=make('style');
  css.textContent=`
  #ww-arcade-launch{width:100%;margin:4px 0;padding:10px;border:0;border-radius:11px;background:#dff4ef;color:#175c50;font:inherit;font-weight:800}
  #ww-arcade-panel{position:fixed;z-index:10021;inset:3dvh 10px auto;margin:auto;max-width:560px;max-height:94dvh;overflow:auto;padding:14px;border-radius:18px;background:#fff;color:#243b53;box-shadow:0 12px 50px #10243c66;font-family:inherit}
  #ww-arcade-panel[hidden]{display:none}.wwa-head{display:flex;justify-content:space-between;align-items:center;gap:8px}.wwa-head button,.wwa-actions button,.wwa-mode{border:0;border-radius:10px;padding:9px 12px;background:#e7edf5;color:#263f58;font:inherit;font-weight:800}.wwa-modes{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:12px 0}.wwa-mode{background:#dff4ef;color:#175c50;min-height:46px}.wwa-status{padding:10px;border-radius:10px;background:#f1f6fb;font-size:13px;line-height:1.6;margin:9px 0}.wwa-actions{display:flex;gap:8px;flex-wrap:wrap;margin:10px 0}.wwa-actions button{background:#26754d;color:white}
  #ww-memory-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;max-width:420px;margin:12px auto}
  .ww-memory-card{aspect-ratio:1;border:0;border-radius:12px;background:#e7edf5;color:#243b53;font-size:clamp(24px,7vw,38px);font-weight:800}.ww-memory-card.open,.ww-memory-card.matched{background:#dff4ef}.ww-memory-card.matched{outline:2px solid #4caa91}
  #ww-cups{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin:22px 0}.ww-cup{min-height:100px;border:0;border-radius:18px 18px 28px 28px;background:#f7d7a7;color:#70451a;font-size:36px;font-weight:800}.ww-cup:disabled{opacity:.8}
  @media(max-width:380px){#ww-arcade-panel{inset:2dvh 5px auto;padding:10px}}
  `;
  document.head.appendChild(css);
  function boot(){
    const hud=document.getElementById('life-ui');
    if(!hud||document.getElementById('ww-arcade-launch'))return false;
    const launch=make('button',{id:'ww-arcade-launch',type:'button'},'🧠🎯 ألعاب الأركيد والذاكرة');
    hud.appendChild(launch);
    const panel=make('section',{id:'ww-arcade-panel',role:'dialog','aria-modal':'true','aria-label':'ألعاب الأركيد'});panel.hidden=true;
    panel.innerHTML='<div class="wwa-head"><strong>🧠 ركن الأركيد</strong><button id="wwa-close" type="button" aria-label="إغلاق">✕</button></div><p class="wwa-status">لعبتان خفيفتان تشتغلان داخل المتصفح: ذاكرة الأزواج وتخمين الكأس.</p><div class="wwa-modes"><button class="wwa-mode" id="wwa-memory-open" type="button">🧠 ذاكرة الأزواج</button><button class="wwa-mode" id="wwa-cups-open" type="button">🎯 تخمين الكأس</button></div><section id="wwa-memory" hidden><h3>🧠 ذاكرة الأزواج</h3><div class="wwa-status" id="wwa-memory-status" role="status">اكشفي البطاقات وطابقي الأزواج.</div><div class="wwa-actions"><button id="wwa-memory-reset" type="button">🔄 لعبة جديدة</button></div><div id="ww-memory-grid"></div></section><section id="wwa-cups-section" hidden><h3>🎯 أين النجمة؟</h3><div class="wwa-status" id="wwa-cups-status" role="status">اختاري كأسًا واحدًا. النجمة مخبأة تحته!</div><div class="wwa-actions"><button id="wwa-cups-reset" type="button">🔄 خلط من جديد</button></div><div id="ww-cups"><button class="ww-cup" data-cup="0" type="button" aria-label="الكأس الأول">🥤</button><button class="ww-cup" data-cup="1" type="button" aria-label="الكأس الثاني">🥤</button><button class="ww-cup" data-cup="2" type="button" aria-label="الكأس الثالث">🥤</button></div></section>';
    document.body.appendChild(panel);
    const close=()=>{panel.hidden=true;launch.focus();};
    launch.addEventListener('click',()=>{panel.hidden=false;document.getElementById('wwa-close').focus();});
    document.getElementById('wwa-close').addEventListener('click',close);
    panel.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();close();}});
    const mem=document.getElementById('wwa-memory'),cups=document.getElementById('wwa-cups-section');
    document.getElementById('wwa-memory-open').addEventListener('click',()=>{mem.hidden=false;cups.hidden=true;newMemory();});
    document.getElementById('wwa-cups-open').addEventListener('click',()=>{cups.hidden=false;mem.hidden=true;newCups();});
    let memory={cards:[],opened:[],matched:new Set(),moves:0,locked:false,turn:0};
    function newMemory(){
      memory={cards:['🐱','🐶','🐰','🦊','🐼','🐸','🐱','🐶','🐰','🦊','🐼','🐸'].sort(()=>Math.random()-.5),opened:[],matched:new Set(),moves:0,locked:false,turn:memory.turn+1};
      renderMemory('اكشفي بطاقتين في كل محاولة وابحثي عن الأزواج المتطابقة.');
    }
    function renderMemory(message){
      const root=document.getElementById('ww-memory-grid');root.replaceChildren();
      memory.cards.forEach((symbol,i)=>{const b=make('button',{type:'button',class:'ww-memory-card','aria-label':memory.matched.has(i)?'زوج مكتمل':memory.opened.includes(i)?symbol:'بطاقة مخفية'},memory.matched.has(i)||memory.opened.includes(i)?symbol:'?');if(memory.opened.includes(i))b.classList.add('open');if(memory.matched.has(i))b.classList.add('matched');b.disabled=memory.locked||memory.matched.has(i)||memory.opened.includes(i);b.addEventListener('click',()=>flipMemory(i));root.appendChild(b);});
      document.getElementById('wwa-memory-status').textContent=message+' الحركات: '+memory.moves+' · الأزواج: '+memory.matched.size/2+'/6';
    }
    function flipMemory(i){
      if(memory.locked||memory.matched.has(i)||memory.opened.includes(i))return;
      memory.opened.push(i);
      if(memory.opened.length<2){renderMemory('اختاري البطاقة الثانية.');return;}
      memory.moves++;
      const [a,b]=memory.opened;
      if(memory.cards[a]===memory.cards[b]){memory.matched.add(a);memory.matched.add(b);memory.opened=[];if(memory.matched.size===memory.cards.length){renderMemory('رائع! 🎉 وجدتي كل الأزواج.');return;}renderMemory('زوج صحيح! استمري.');return;}
      memory.locked=true;renderMemory('مش نفس الرمز — شوفيهم كويس قبل ما يتقفلوا.');
      const turn=memory.turn;setTimeout(()=>{if(memory.turn!==turn)return;memory.opened=[];memory.locked=false;renderMemory('حاولي تفتكري أماكن الرموز.');},850);
    }
    document.getElementById('wwa-memory-reset').addEventListener('click',newMemory);
    let star=0,cupOver=false;
    function newCups(){star=Math.floor(Math.random()*3);cupOver=false;document.querySelectorAll('.ww-cup').forEach(b=>{b.disabled=false;b.textContent='🥤';});document.getElementById('wwa-cups-status').textContent='النجمة مخبأة تحت واحد من 3 كؤوس. خمني مكانها!';}
    document.querySelectorAll('.ww-cup').forEach(b=>b.addEventListener('click',()=>{if(cupOver)return;cupOver=true;const chosen=Number(b.dataset.cup);document.querySelectorAll('.ww-cup').forEach((cup,i)=>{cup.disabled=true;cup.textContent=i===star?'⭐':'🥤';});document.getElementById('wwa-cups-status').textContent=chosen===star?'صح! 🎉 لقيتي النجمة.':'مش دي المرة دي. النجمة تحت الكأس رقم '+(star+1)+'. جربي تاني!';}));
    document.getElementById('wwa-cups-reset').addEventListener('click',newCups);
    newMemory();newCups();return true;
  }
  if(!boot()){const observer=new MutationObserver(()=>{if(boot())observer.disconnect();});observer.observe(document.documentElement,{childList:true,subtree:true});}
})();