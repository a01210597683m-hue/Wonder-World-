(() => {
  'use strict';
  if (document.getElementById('ww-memory-open')) return;
  const style = document.createElement('style');
  style.textContent = `
    #ww-memory-open{position:fixed;right:14px;top:118px;z-index:3000;border:0;border-radius:14px;padding:11px 14px;background:#5b43b5;color:#fff;font:700 14px system-ui;box-shadow:0 5px 18px #172b4d55}
    #ww-memory-panel{position:fixed;z-index:3001;inset:4% 3%;max-width:620px;max-height:92%;margin:auto;overflow:auto;background:#fff;color:#20233a;border-radius:22px;padding:18px;box-shadow:0 18px 70px #101a36aa;font-family:system-ui,sans-serif}
    #ww-memory-panel[hidden]{display:none} .wwm-head{display:flex;justify-content:space-between;align-items:center;gap:10px}.wwm-head h2{margin:0;font-size:22px}.wwm-close{border:0;border-radius:10px;padding:8px 12px;background:#eee;font-size:18px}
    .wwm-stats{display:flex;gap:8px;flex-wrap:wrap;margin:14px 0}.wwm-stat{flex:1;min-width:90px;background:#f2efff;border-radius:12px;padding:9px;text-align:center}.wwm-stat b{display:block;font-size:20px}
    .wwm-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:9px}.wwm-card{min-height:70px;border:0;border-radius:14px;background:linear-gradient(145deg,#7765d8,#4c3b9e);color:white;font-size:30px;box-shadow:0 3px 0 #32256f;touch-action:manipulation}.wwm-card.revealed,.wwm-card.matched{background:#e8f8ef;color:#20233a;box-shadow:none;border:2px solid #7bc99b}.wwm-card.matched{opacity:.65}.wwm-actions{display:flex;gap:8px;margin-top:14px;flex-wrap:wrap}.wwm-actions button{border:0;border-radius:12px;padding:10px 14px;background:#5b43b5;color:white;font-weight:700}.wwm-message{min-height:28px;margin:12px 0 0;font-weight:600}
    @media(max-width:420px){#ww-memory-open{right:10px;top:158px;font-size:12px;padding:9px 10px}#ww-memory-panel{inset:2%;padding:12px}.wwm-card{min-height:58px;font-size:26px}.wwm-grid{gap:6px}}
  `;
  document.head.appendChild(style);
  const open = document.createElement('button');
  open.id='ww-memory-open'; open.type='button'; open.textContent='🧠 ذاكرة وندر';
  open.setAttribute('aria-controls','ww-memory-panel'); open.setAttribute('aria-expanded','false');
  const panel = document.createElement('section');
  panel.id='ww-memory-panel'; panel.hidden=true; panel.setAttribute('role','dialog'); panel.setAttribute('aria-modal','true'); panel.setAttribute('aria-labelledby','ww-memory-title');
  panel.innerHTML = `
    <div class="wwm-head"><h2 id="ww-memory-title">🧠 تحدّي ذاكرة WonderWorld</h2><button class="wwm-close" type="button" aria-label="إغلاق">✕</button></div>
    <p>اقلبي الكروت ولاقِي كل زوج متطابق. كل ما تقلّ الحركات، نتيجتك أحسن!</p>
    <div class="wwm-stats"><div class="wwm-stat">الحركات<b id="wwm-moves">0</b></div><div class="wwm-stat">الأزواج<b id="wwm-pairs">0 / 6</b></div><div class="wwm-stat">الوقت<b id="wwm-time">0 ث</b></div><div class="wwm-stat">أفضل نتيجة<b id="wwm-best">—</b></div></div>
    <div class="wwm-grid" id="wwm-grid" aria-label="كروت الذاكرة"></div>
    <p class="wwm-message" id="wwm-message" role="status" aria-live="polite">جاهزة؟ ابدئي بالضغط على أي كارت.</p>
    <div class="wwm-actions"><button type="button" id="wwm-restart">🔄 لعبة جديدة</button><button type="button" id="wwm-close-bottom">الرجوع للعالم</button></div>`;
  document.body.append(open,panel);
  const grid=panel.querySelector('#wwm-grid'), movesEl=panel.querySelector('#wwm-moves'), pairsEl=panel.querySelector('#wwm-pairs'), timeEl=panel.querySelector('#wwm-time'), bestEl=panel.querySelector('#wwm-best'), message=panel.querySelector('#wwm-message');
  const symbols=['🌸','🚗','🏡','⚽','🐱','✈️'];
  let deck=[], first=null, locked=false, moves=0, pairs=0, seconds=0, ticker=null, started=false;
  const bestKey='wonderworld-memory-best';
  function best(){try{return Number(localStorage.getItem(bestKey))||0}catch(_){return 0}}
  function paint(){movesEl.textContent=moves;pairsEl.textContent=pairs+' / 6';timeEl.textContent=seconds+' ث';bestEl.textContent=best()?best()+' حركة':'—'}
  function stopClock(){if(ticker){clearInterval(ticker);ticker=null}}
  function start(){
    stopClock(); deck=[...symbols,...symbols].map((symbol,id)=>({symbol,id})).sort(()=>Math.random()-.5);
    first=null;locked=false;moves=0;pairs=0;seconds=0;started=false;grid.replaceChildren();message.textContent='اختاري كارتين وشوفي إذا كانوا متطابقين.';
    deck.forEach((card,index)=>{const button=document.createElement('button');button.type='button';button.className='wwm-card';button.textContent='?';button.setAttribute('aria-label','كارت مخفي '+(index+1));button.addEventListener('click',()=>flip(index,button));grid.appendChild(button)});paint();
  }
  function flip(index,button){
    if(locked||button.classList.contains('matched')||button.classList.contains('revealed'))return;
    if(!started){started=true;ticker=setInterval(()=>{seconds++;paint()},1000)}
    button.textContent=deck[index].symbol;button.classList.add('revealed');button.setAttribute('aria-label',deck[index].symbol);
    if(first===null){first={index,button};return}
    moves++;const prior=first;first=null;
    if(deck[prior.index].symbol===deck[index].symbol){
      prior.button.classList.remove('revealed');button.classList.remove('revealed');prior.button.classList.add('matched');button.classList.add('matched');
      prior.button.disabled=true;button.disabled=true;pairs++;message.textContent='👏 ممتاز! لقيتي زوج متطابق.';
      paint();
      if(pairs===6){stopClock();let record=false;try{const old=best();if(!old||moves<old){localStorage.setItem(bestKey,String(moves));record=true}}catch(_){}paint();message.textContent='🎉 برافو! خلصتي اللعبة في '+moves+' حركة و'+seconds+' ثانية.'+(record?' رقم قياسي جديد!':'');}
    }else{locked=true;message.textContent='قريب! حاولي تفتكري مكان الصور.';setTimeout(()=>{prior.button.textContent='?';button.textContent='?';prior.button.classList.remove('revealed');button.classList.remove('revealed');prior.button.setAttribute('aria-label','كارت مخفي');button.setAttribute('aria-label','كارت مخفي');locked=false},750);paint()}
  }
  function close(){panel.hidden=true;open.setAttribute('aria-expanded','false');open.focus()}
  open.addEventListener('click',()=>{panel.hidden=false;open.setAttribute('aria-expanded','true');if(!deck.length)start();panel.querySelector('.wwm-close').focus()});
  panel.querySelector('.wwm-close').addEventListener('click',close);panel.querySelector('#wwm-close-bottom').addEventListener('click',close);panel.querySelector('#wwm-restart').addEventListener('click',start);
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden)close()});
  start();
})();