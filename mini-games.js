// WonderWorld casual arcade: color matching and shell-cup guessing.
(() => {
  'use strict';
  const make=(tag,attrs={},text='')=>{const n=document.createElement(tag);Object.entries(attrs).forEach(([k,v])=>n.setAttribute(k,String(v)));if(text)n.textContent=text;return n;};
  const css=make('style');
  css.textContent=`
  #ww-arcade-launch{width:100%;margin:4px 0;padding:10px;border:0;border-radius:11px;background:#dff4ef;color:#175c50;font:inherit;font-weight:800}
  #ww-arcade-panel{position:fixed;z-index:10021;inset:3dvh 10px auto;margin:auto;max-width:560px;max-height:94dvh;overflow:auto;padding:14px;border-radius:18px;background:#fff;color:#243b53;box-shadow:0 12px 50px #10243c66;font-family:inherit}
  #ww-arcade-panel[hidden]{display:none}.wwa-head{display:flex;justify-content:space-between;align-items:center;gap:8px}.wwa-head button,.wwa-actions button,.wwa-mode{border:0;border-radius:10px;padding:9px 12px;background:#e7edf5;color:#263f58;font:inherit;font-weight:800}.wwa-modes{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:12px 0}.wwa-mode{background:#dff4ef;color:#175c50;min-height:46px}.wwa-status{padding:10px;border-radius:10px;background:#f1f6fb;font-size:13px;line-height:1.6;margin:9px 0}.wwa-actions{display:flex;gap:8px;flex-wrap:wrap;margin:10px 0}.wwa-actions button{background:#26754d;color:white}
  #wwa-color-target{display:grid;place-items:center;min-height:72px;margin:12px auto;padding:12px;border-radius:14px;color:#fff;font-size:18px;font-weight:900;text-shadow:0 1px 3px #0007;max-width:320px}
  #wwa-color-options{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px;max-width:360px;margin:12px auto}.wwa-color-choice{min-height:62px;border:3px solid #fff;border-radius:12px;color:#fff;font:inherit;font-weight:900;text-shadow:0 1px 3px #0008;box-shadow:0 1px 4px #0002}.wwa-color-choice:focus-visible{outline:3px solid #263f58;outline-offset:2px}.wwa-color-choice:disabled{opacity:.72}
  #ww-cups{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin:22px 0}.ww-cup{min-height:100px;border:0;border-radius:18px 18px 28px 28px;background:#f7d7a7;color:#70451a;font-size:36px;font-weight:800}.ww-cup:disabled{opacity:.8}
  .wwa-modes{grid-template-columns:repeat(2,minmax(0,1fr))}
  .wwa-mode{background:linear-gradient(145deg,#fff,#e7e9ff);border:1px solid #d8dafa;box-shadow:0 4px 0 #d4d7f4;min-height:58px}
  .wwa-mode:active{transform:translateY(2px);box-shadow:0 2px 0 #d4d7f4}
  #wwa-match-board{display:grid;grid-template-columns:repeat(8,minmax(0,1fr));gap:4px;padding:8px;border-radius:16px;background:linear-gradient(145deg,#e9dfff,#cde9ff);box-shadow:inset 0 2px 8px #4a3e8a22;touch-action:manipulation}
  .wwa-candy-tile{aspect-ratio:1;min-width:0;border:1px solid #ffffffb8;border-radius:11px;padding:0;font-size:clamp(18px,5vw,28px);background:linear-gradient(145deg,#fff,#f2f5ff);box-shadow:0 3px 0 #b4b7d5,0 5px 8px #35476a22;transition:transform .12s,filter .12s}
  .wwa-candy-tile.selected{outline:3px solid #ffbf47;outline-offset:-2px;transform:scale(.92);filter:saturate(1.35)}
  .wwa-match-meta{display:flex;justify-content:space-between;gap:8px;padding:8px 10px;border-radius:12px;background:#f3efff;font-weight:900}
  #wwa-casual-rope-board{position:relative;width:min(100%,320px);aspect-ratio:1;margin:12px auto;border-radius:18px;overflow:hidden;background:radial-gradient(circle at 25% 20%,#fff9df,#e7e3ff 55%,#c9e9ff);border:1px solid #d6d9fa;touch-action:none;user-select:none}
  #wwa-casual-rope-lines{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}
  .wwa-rope-line{stroke:#f06b8c;stroke-width:5;stroke-linecap:round;filter:drop-shadow(0 2px 1px #5a427755)}
  .wwa-rope-line.clear{stroke:#4eaf91}
  .wwa-casual-rope-node{position:absolute;z-index:2;width:34px;height:34px;transform:translate(-50%,-50%);border:3px solid #fff;border-radius:50%;background:linear-gradient(145deg,#9b7cff,#6145c4);box-shadow:0 4px 8px #30236d55;color:#fff;font-weight:900;touch-action:none}
  .wwa-casual-rope-node:active{transform:translate(-50%,-50%) scale(1.12)}
  .wwa-mode-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
  #wwa-party-board{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;padding:12px;border-radius:18px;background:radial-gradient(circle at 50% 0%,#5c4ca6,#191c4b);box-shadow:inset 0 0 25px #0b103e}
  .wwa-party-star{min-height:68px;border:1px solid #ffffff75;border-radius:16px;background:linear-gradient(145deg,#fff3b0,#ff9bd7 58%,#9d83ff);box-shadow:0 5px 0 #5d428e,0 0 14px #d7a9ff66;font-size:30px;transition:transform .12s,opacity .12s}
  .wwa-party-star:active{transform:translateY(3px) scale(.96)}
  .wwa-party-star:disabled{opacity:.5;background:linear-gradient(145deg,#7e75b9,#484477);box-shadow:none}
  @media(max-width:380px){#ww-arcade-panel{inset:2dvh 5px auto;padding:10px}.wwa-candy-tile{border-radius:7px;font-size:20px}}
  `;
  document.head.appendChild(css);
  function boot(){
    const hud=document.getElementById('life-ui');
    if(!hud||document.getElementById('ww-arcade-launch'))return false;
    const launch=make('button',{id:'ww-arcade-launch',type:'button'},'🎨🎯 ألعاب الأركيد الخفيفة');
    hud.appendChild(launch);
    const panel=make('section',{id:'ww-arcade-panel',role:'dialog','aria-modal':'true','aria-label':'ألعاب الأركيد'});panel.hidden=true;
    panel.innerHTML='<div class="wwa-head"><strong>✨ WonderWorld Arcade</strong><button id="wwa-close" type="button" aria-label="إغلاق">✕</button></div><p class="wwa-status">ألعاب مصغّرة قابلة للعب — اختاري لعبة وابدئي الجولة.</p><div class="wwa-modes"><button class="wwa-mode" id="wwa-match-open" type="button">🍬 Candy Match</button><button class="wwa-mode" id="wwa-rope-open" type="button">🪢 فك الأحبال</button><button class="wwa-mode" id="wwa-party-open" type="button">✨ Sparkle Party</button><button class="wwa-mode" id="wwa-board-open" type="button">🎲 لودو والشطرنج</button><button class="wwa-mode" id="wwa-block-open" type="button">🧩 Block Blast</button><button class="wwa-mode" id="wwa-water-open" type="button">🧪 Water Sort</button><button class="wwa-mode" id="wwa-puzzle-open" type="button">🧠 الألغاز</button><button class="wwa-mode" id="wwa-memory-open" type="button">🃏 لعبة الذاكرة</button><button class="wwa-mode" id="wwa-color-open" type="button">🎨 مطابقة اللون</button><button class="wwa-mode" id="wwa-cups-open" type="button">⭐ تخمين الكأس</button></div><section id="wwa-party-section" hidden><h3>✨ Sparkle Party</h3><div class="wwa-match-meta"><span>النجوم: <b id="wwa-party-score">0</b>/12</span><span>مكافآت مضاعفة ⭐</span></div><p class="wwa-status" id="wwa-party-status" role="status">اجمعي النجوم المضيئة وافتحي كل هدايا الحفلة!</p><div id="wwa-party-board" aria-label="نجوم الحفلة"></div><div class="wwa-actions"><button id="wwa-party-reset" type="button">🎉 حفلة جديدة</button></div></section><section id="wwa-match-section" hidden><h3>🍬 Candy Match</h3><div class="wwa-match-meta"><span>النقاط: <b id="wwa-match-score">0</b></span><span>أفضل نتيجة: <b id="wwa-match-best">0</b></span></div><p class="wwa-status" id="wwa-match-status" role="status">بدّلي بين قطعتين متجاورتين لتكوين 3 قطع متشابهة.</p><div id="wwa-match-board" role="grid" aria-label="لوحة مطابقة الحلوى"></div><div class="wwa-actions"><button id="wwa-match-reset" type="button">🔄 جولة جديدة</button></div></section><section id="wwa-rope-section" hidden><h3>🪢 فكّ الأحبال</h3><p class="wwa-status" id="wwa-rope-status" role="status">اسحبي الدوائر لفكّ تقاطعات الحبال. افصلي كل الخطوط عن بعضها.</p><div id="wwa-casual-rope-board" aria-label="لوحة فك الأحبال"><svg id="wwa-casual-rope-lines" viewBox="0 0 320 320" aria-hidden="true"></svg></div><div class="wwa-actions"><button id="wwa-rope-reset" type="button">🔄 إعادة اللغز</button></div></section><section id="wwa-color-section" hidden><h3>🎨 اختاري اللون المطلوب</h3><div class="wwa-status" id="wwa-color-status" role="status">اختاري اللون المطابق للهدف.</div><p>النقاط: <strong id="wwa-color-score">0</strong></p><div id="wwa-color-target" role="img" aria-label="اللون المطلوب"></div><div id="wwa-color-options"><button class="wwa-color-choice" data-color="mint" type="button">نعناعي</button><button class="wwa-color-choice" data-color="coral" type="button">مرجاني</button><button class="wwa-color-choice" data-color="blue" type="button">أزرق</button><button class="wwa-color-choice" data-color="violet" type="button">بنفسجي</button></div><div class="wwa-actions"><button id="wwa-color-next" type="button" disabled>الجولة التالية</button><button id="wwa-color-reset" type="button">إعادة النقاط</button></div></section><section id="wwa-cups-section" hidden><h3>🎯 أين النجمة؟</h3><div class="wwa-status" id="wwa-cups-status" role="status">اختاري كأسًا واحدًا. النجمة مخبأة تحته!</div><div class="wwa-actions"><button id="wwa-cups-reset" type="button">🔄 خلط من جديد</button></div><div id="ww-cups"><button class="ww-cup" data-cup="0" type="button" aria-label="الكأس الأول">🥤</button><button class="ww-cup" data-cup="1" type="button" aria-label="الكأس الثاني">🥤</button><button class="ww-cup" data-cup="2" type="button" aria-label="الكأس الثالث">🥤</button></div></section>';
    document.body.appendChild(panel);
    const close=()=>{panel.hidden=true;launch.focus();};
    launch.addEventListener('click',()=>{panel.hidden=false;document.getElementById('wwa-close').focus();});
    document.getElementById('wwa-close').addEventListener('click',close);
    panel.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();close();}});
    const colorSection=document.getElementById('wwa-color-section'),cups=document.getElementById('wwa-cups-section');
    const matchSection=document.getElementById('wwa-match-section'),ropeSection=document.getElementById('wwa-rope-section');
    const partySection=document.getElementById('wwa-party-section');
    const arcadeSections=[partySection,matchSection,ropeSection,colorSection,cups];
    function showArcadeSection(section){arcadeSections.forEach(item=>item.hidden=item!==section);panel.scrollTop=0;}
    function launchWorldGame(id){panel.hidden=true;const button=document.getElementById(id);if(button)button.click();else{panel.hidden=false;document.getElementById('wwa-color-status').textContent='اللعبة لسه بتتحمّل. جرّبي بعد لحظة.';colorSection.hidden=false;}}
    document.getElementById('wwa-block-open').addEventListener('click',()=>launchWorldGame('open-blockblast'));
    document.getElementById('wwa-water-open').addEventListener('click',()=>launchWorldGame('open-watersort'));
    document.getElementById('wwa-puzzle-open').addEventListener('click',()=>launchWorldGame('open-puzzle'));
    document.getElementById('wwa-memory-open').addEventListener('click',()=>launchWorldGame('open-memory-match'));
    document.getElementById('wwa-match-open').addEventListener('click',()=>{showArcadeSection(matchSection);candyReset();});
    document.getElementById('wwa-rope-open').addEventListener('click',()=>{showArcadeSection(ropeSection);ropeReset();});
    document.getElementById('wwa-party-open').addEventListener('click',()=>{showArcadeSection(partySection);partyReset();});
    document.getElementById('wwa-board-open').addEventListener('click',()=>launchWorldGame('board-games-launch'));
    document.getElementById('wwa-color-open').addEventListener('click',()=>{showArcadeSection(colorSection);newColorRound();});
    document.getElementById('wwa-cups-open').addEventListener('click',()=>{showArcadeSection(cups);newCups();});
    // Mode selection is wired above so every mini-game opens in a consistent arcade shell.
    const colors=[
      {id:'mint',name:'النعناعي',hex:'#43a875'},
      {id:'coral',name:'المرجاني',hex:'#ed6b72'},
      {id:'blue',name:'الأزرق',hex:'#4296d6'},
      {id:'violet',name:'البنفسجي',hex:'#8b61c2'}
    ];
    let targetColor=colors[0],colorScore=0,colorAnswered=false;
    function newColorRound(){
      targetColor=colors[Math.floor(Math.random()*colors.length)];colorAnswered=false;
      const target=document.getElementById('wwa-color-target');target.textContent=targetColor.name;target.style.background=targetColor.hex;target.setAttribute('data-target',targetColor.id);
      document.querySelectorAll('.wwa-color-choice').forEach(button=>{const color=colors.find(item=>item.id===button.dataset.color);button.disabled=false;button.style.background=color.hex;button.textContent=color.name;});
      document.getElementById('wwa-color-next').disabled=true;
      document.getElementById('wwa-color-status').textContent='اختاري اللون المطابق للمربع المعروض.';
    }
    function chooseColor(id){
      if(colorAnswered)return;colorAnswered=true;
      const correct=id===targetColor.id;if(correct)colorScore++;
      document.getElementById('wwa-color-score').textContent=String(colorScore);
      document.getElementById('wwa-color-status').textContent=correct?'صح! 🎉 اختيار ممتاز.':'مش ده اللون المطلوب. الهدف كان '+targetColor.name+'.';
      document.querySelectorAll('.wwa-color-choice').forEach(button=>button.disabled=true);
      document.getElementById('wwa-color-next').disabled=false;
    }
    document.querySelectorAll('.wwa-color-choice').forEach(button=>button.addEventListener('click',()=>chooseColor(button.dataset.color)));
    document.getElementById('wwa-color-next').addEventListener('click',newColorRound);
    document.getElementById('wwa-color-reset').addEventListener('click',()=>{colorScore=0;document.getElementById('wwa-color-score').textContent='0';newColorRound();});
    let star=0,cupOver=false;
    function newCups(){star=Math.floor(Math.random()*3);cupOver=false;document.querySelectorAll('.ww-cup').forEach(b=>{b.disabled=false;b.textContent='🥤';});document.getElementById('wwa-cups-status').textContent='النجمة مخبأة تحت واحد من 3 كؤوس. خمني مكانها!';}
    document.querySelectorAll('.ww-cup').forEach(b=>b.addEventListener('click',()=>{if(cupOver)return;cupOver=true;const chosen=Number(b.dataset.cup);document.querySelectorAll('.ww-cup').forEach((cup,i)=>{cup.disabled=true;cup.textContent=i===star?'⭐':'🥤';});document.getElementById('wwa-cups-status').textContent=chosen===star?'صح! 🎉 لقيتي النجمة.':'مش دي المرة دي. النجمة تحت الكأس رقم '+(star+1)+'. جربي تاني!';}));
    document.getElementById('wwa-cups-reset').addEventListener('click',newCups);
    // Candy Match-3: adjacent swaps, horizontal/vertical matches, gravity and refill.
    const candyKinds=[{emoji:'🍓',hex:'#ff7b9c'},{emoji:'🍋',hex:'#ffd45c'},{emoji:'🍇',hex:'#aa86f5'},{emoji:'🫐',hex:'#6eb8ff'},{emoji:'🍀',hex:'#68d6a0'},{emoji:'⭐',hex:'#ffab5c'}];
    const candySize=8;let candyBoard=[],candySelected=-1,candyScore=0,candyBest=0;
    try{candyBest=Math.max(0,Number(localStorage.getItem('wonderworld-candy-best'))||0)}catch(_){}
    function candyFindMatches(){
      const found=new Set();
      for(let r=0;r<candySize;r++){let start=0;while(start<candySize){let end=start+1;while(end<candySize&&candyBoard[r][end]===candyBoard[r][start])end++;if(candyBoard[r][start]!==null&&end-start>=3)for(let col=start;col<end;col++)found.add(r*candySize+col);start=end;}}
      for(let col=0;col<candySize;col++){let start=0;while(start<candySize){let end=start+1;while(end<candySize&&candyBoard[end][col]===candyBoard[start][col])end++;if(candyBoard[start][col]!==null&&end-start>=3)for(let row=start;row<end;row++)found.add(row*candySize+col);start=end;}}
      return found;
    }
    function candyRender(){
      const board=document.getElementById('wwa-match-board');board.replaceChildren();
      candyBoard.forEach((line,r)=>line.forEach((kind,col)=>{const b=make('button',{type:'button',class:'wwa-candy-tile'+(candySelected===r*candySize+col?' selected':''),'aria-label':'صف '+(r+1)+' عمود '+(col+1)},kind===null?'':candyKinds[kind].emoji);b.style.background=kind===null?'#ffffff80':'linear-gradient(145deg,#fff,'+candyKinds[kind].hex+')';b.dataset.index=String(r*candySize+col);b.addEventListener('click',()=>candyChoose(r,col));board.appendChild(b);}));
      document.getElementById('wwa-match-score').textContent=String(candyScore);document.getElementById('wwa-match-best').textContent=String(candyBest);
    }
    function candyCollapse(){
      for(let col=0;col<candySize;col++){const values=[];for(let row=candySize-1;row>=0;row--)if(candyBoard[row][col]!==null)values.push(candyBoard[row][col]);while(values.length<candySize)values.push(Math.floor(Math.random()*candyKinds.length));for(let row=candySize-1;row>=0;row--)candyBoard[row][col]=values[candySize-1-row];}
    }
    function candyResolve(){
      let chain=0,matched=candyFindMatches();
      while(matched.size&&chain<8){chain++;candyScore+=matched.size*10*chain;matched.forEach(i=>{candyBoard[Math.floor(i/candySize)][i%candySize]=null;});candyCollapse();matched=candyFindMatches();}
      if(chain){candyBest=Math.max(candyBest,candyScore);try{localStorage.setItem('wonderworld-candy-best',String(candyBest))}catch(_){}document.getElementById('wwa-match-status').textContent='رائع! مسحتي '+(candyScore>0? 'قطع حلوى وكسبتي نقاطًا.':'مجموعة')+' ✨';}
      else document.getElementById('wwa-match-status').textContent='مفيش تطابق في الحركة دي. جرّبي تبديلًا تانيًا.';
      candySelected=-1;candyRender();
    }
    function candyChoose(row,col){
      const index=row*candySize+col;
      if(candySelected<0){candySelected=index;candyRender();return;}
      const sr=Math.floor(candySelected/candySize),sc=candySelected%candySize;
      if(Math.abs(sr-row)+Math.abs(sc-col)!==1){candySelected=index;candyRender();return;}
      const a=candyBoard[sr][sc],b=candyBoard[row][col];candyBoard[sr][sc]=b;candyBoard[row][col]=a;
      if(!candyFindMatches().size){candyBoard[sr][sc]=a;candyBoard[row][col]=b;candySelected=-1;document.getElementById('wwa-match-status').textContent='الحركة دي مش بتكوّن 3 قطع متشابهة.';candyRender();return;}
      candyResolve();
    }
    function candyReset(){
      candyScore=0;candySelected=-1;candyBoard=Array.from({length:candySize},()=>Array.from({length:candySize},()=>Math.floor(Math.random()*candyKinds.length)));
      let safety=0;while(candyFindMatches().size&&safety++<40){candyFindMatches().forEach(i=>{candyBoard[Math.floor(i/candySize)][i%candySize]=Math.floor(Math.random()*candyKinds.length);});}
      document.getElementById('wwa-match-status').textContent='بدّلي قطعتين متجاورتين لتكوين 3 أو أكثر. كل تطابق يكسبك نقاطًا.';candyRender();
    }
    document.getElementById('wwa-match-reset').addEventListener('click',candyReset);

    // Sparkle Party: a bright, family-friendly star-collecting party round.
    let partyScore=0;
    function partyReset(){
      partyScore=0;const board=document.getElementById('wwa-party-board');board.replaceChildren();
      for(let i=0;i<12;i++){const star=make('button',{type:'button',class:'wwa-party-star','aria-label':'نجمة '+(i+1)},'⭐');star.addEventListener('click',()=>{if(star.disabled)return;star.disabled=true;star.textContent='✨';partyScore+=i%4===0?2:1;document.getElementById('wwa-party-score').textContent=String(partyScore);const remaining=board.querySelectorAll('button:not(:disabled)').length;document.getElementById('wwa-party-status').textContent=remaining===0?'الحفلة اكتملت! جمعتي كل النجوم ✨🎉':'جميل! '+(i%4===0?'نجمة مميزة = نقطتين!':'نجمة جديدة اتجمعت!')+' باقي '+remaining+' نجوم.';});board.appendChild(star);}
      document.getElementById('wwa-party-score').textContent='0';document.getElementById('wwa-party-status').textContent='اضغطي على النجوم لجمعها. بعض النجوم المميزة تمنح نقطتين! ✨';
    }
    document.getElementById('wwa-party-reset').addEventListener('click',partyReset);

    // Rope Untangle: drag the six nodes until none of the connecting ropes cross.
    const ropeEdges=[[0,3],[0,4],[1,3],[1,4],[2,4],[2,5],[3,5]];
    const ropeStarts=[{x:65,y:55},{x:255,y:55},{x:65,y:260},{x:255,y:255},{x:160,y:155},{x:255,y:160}];
    let ropeNodes=[],ropeDragging=-1;
    function ropeReset(){ropeNodes=ropeStarts.map(p=>({...p}));ropeDragging=-1;ropeUpdate();document.getElementById('wwa-rope-status').textContent='اسحبي الدوائر بعيدًا عن بعض لحد ما الحبال ما تتقاطعش.';}
    function ropeCross(a,b,c,d){const cross=(p,q,r)=>(q.x-p.x)*(r.y-p.y)-(q.y-p.y)*(r.x-p.x);const x1=cross(a,b,c),x2=cross(a,b,d),x3=cross(c,d,a),x4=cross(c,d,b);return x1*x2<0&&x3*x4<0;}
    function ropeCrossings(){let count=0;for(let i=0;i<ropeEdges.length;i++)for(let j=i+1;j<ropeEdges.length;j++){const [a,b]=ropeEdges[i],[c,d]=ropeEdges[j];if([a,b].some(n=>n===c||n===d))continue;if(ropeCross(ropeNodes[a],ropeNodes[b],ropeNodes[c],ropeNodes[d]))count++;}return count;}
    function ropeUpdate(){
      const svg=document.getElementById('wwa-casual-rope-lines');svg.innerHTML=ropeEdges.map(([a,b])=>'<line class="wwa-rope-line" x1="'+ropeNodes[a].x+'" y1="'+ropeNodes[a].y+'" x2="'+ropeNodes[b].x+'" y2="'+ropeNodes[b].y+'" />').join('');
      const board=document.getElementById('wwa-casual-rope-board');
      ropeNodes.forEach((p,i)=>{let n=board.querySelector('.wwa-casual-rope-node[data-node="'+i+'"]');if(!n){n=make('button',{type:'button',class:'wwa-casual-rope-node','data-node':i,'aria-label':'اسحبي العقدة '+(i+1)},String(i+1));board.appendChild(n);}n.style.left=(p.x/320*100)+'%';n.style.top=(p.y/320*100)+'%';});
    }
    const ropeBoard=document.getElementById('wwa-casual-rope-board');
    ropeBoard.addEventListener('pointerdown',e=>{const node=e.target.closest('.wwa-casual-rope-node');if(!node)return;ropeDragging=Number(node.dataset.node);node.setPointerCapture?.(e.pointerId);e.preventDefault();});
    ropeBoard.addEventListener('pointermove',e=>{if(ropeDragging<0)return;const rect=ropeBoard.getBoundingClientRect();ropeNodes[ropeDragging]={x:Math.max(18,Math.min(302,(e.clientX-rect.left)*320/rect.width)),y:Math.max(18,Math.min(302,(e.clientY-rect.top)*320/rect.height))};ropeUpdate();});
    const ropeRelease=()=>{if(ropeDragging<0)return;ropeDragging=-1;const crossings=ropeCrossings();document.getElementById('wwa-rope-status').textContent=crossings===0?'برافو! فكّيتي كل الأحبال! 🎉':'لسه فيه '+crossings+' تقاطع/تقاطعات. حرّكي عقدة تانية.';document.getElementById('wwa-rope-status').style.background=crossings===0?'#d9f8e9':'#f1f6fb';};
    ropeBoard.addEventListener('pointerup',ropeRelease);ropeBoard.addEventListener('pointercancel',ropeRelease);
    document.getElementById('wwa-rope-reset').addEventListener('click',ropeReset);
    newColorRound();newCups();candyReset();ropeReset();partyReset();return true;
  }
  if(!boot()){const observer=new MutationObserver(()=>{if(boot())observer.disconnect();});observer.observe(document.documentElement,{childList:true,subtree:true});}
})();