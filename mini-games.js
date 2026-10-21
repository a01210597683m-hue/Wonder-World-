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
  @media(max-width:380px){#ww-arcade-panel{inset:2dvh 5px auto;padding:10px}}
  `;
  document.head.appendChild(css);
  function boot(){
    const hud=document.getElementById('life-ui');
    if(!hud||document.getElementById('ww-arcade-launch'))return false;
    const launch=make('button',{id:'ww-arcade-launch',type:'button'},'🎨🎯 ألعاب الأركيد الخفيفة');
    hud.appendChild(launch);
    const panel=make('section',{id:'ww-arcade-panel',role:'dialog','aria-modal':'true','aria-label':'ألعاب الأركيد'});panel.hidden=true;
    panel.innerHTML='<div class="wwa-head"><strong>🎨 ركن الأركيد</strong><button id="wwa-close" type="button" aria-label="إغلاق">✕</button></div><p class="wwa-status">لعبتان خفيفتان: مطابقة اللون وتخمين الكأس.</p><div class="wwa-modes"><button class="wwa-mode" id="wwa-color-open" type="button">🎨 مطابقة اللون</button><button class="wwa-mode" id="wwa-cups-open" type="button">🎯 تخمين الكأس</button></div><section id="wwa-color-section" hidden><h3>🎨 اختاري اللون المطلوب</h3><div class="wwa-status" id="wwa-color-status" role="status">اختاري اللون المطابق للهدف.</div><p>النقاط: <strong id="wwa-color-score">0</strong></p><div id="wwa-color-target" role="img" aria-label="اللون المطلوب"></div><div id="wwa-color-options"><button class="wwa-color-choice" data-color="mint" type="button">نعناعي</button><button class="wwa-color-choice" data-color="coral" type="button">مرجاني</button><button class="wwa-color-choice" data-color="blue" type="button">أزرق</button><button class="wwa-color-choice" data-color="violet" type="button">بنفسجي</button></div><div class="wwa-actions"><button id="wwa-color-next" type="button" disabled>الجولة التالية</button><button id="wwa-color-reset" type="button">إعادة النقاط</button></div></section><section id="wwa-cups-section" hidden><h3>🎯 أين النجمة؟</h3><div class="wwa-status" id="wwa-cups-status" role="status">اختاري كأسًا واحدًا. النجمة مخبأة تحته!</div><div class="wwa-actions"><button id="wwa-cups-reset" type="button">🔄 خلط من جديد</button></div><div id="ww-cups"><button class="ww-cup" data-cup="0" type="button" aria-label="الكأس الأول">🥤</button><button class="ww-cup" data-cup="1" type="button" aria-label="الكأس الثاني">🥤</button><button class="ww-cup" data-cup="2" type="button" aria-label="الكأس الثالث">🥤</button></div></section>';
    document.body.appendChild(panel);
    const close=()=>{panel.hidden=true;launch.focus();};
    launch.addEventListener('click',()=>{panel.hidden=false;document.getElementById('wwa-close').focus();});
    document.getElementById('wwa-close').addEventListener('click',close);
    panel.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();close();}});
    const colorSection=document.getElementById('wwa-color-section'),cups=document.getElementById('wwa-cups-section');
    document.getElementById('wwa-color-open').addEventListener('click',()=>{colorSection.hidden=false;cups.hidden=true;newColorRound();});
    document.getElementById('wwa-cups-open').addEventListener('click',()=>{cups.hidden=false;colorSection.hidden=true;newCups();});
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
    newColorRound();newCups();return true;
  }
  if(!boot()){const observer=new MutationObserver(()=>{if(boot())observer.disconnect();});observer.observe(document.documentElement,{childList:true,subtree:true});}
})();