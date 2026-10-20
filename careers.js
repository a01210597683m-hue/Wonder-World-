// WonderWorld careers and player-owned business — local prototype only.
(() => {
  const KEY = 'wonderworld-careers-prototype-v1';
  const defaults = { workCredits: 35, shifts: 0, hasPremises: false, stock: 0, orders: 0, businessRevenue: 0, decorated: false };
  let state = { ...defaults };
  try { const saved = JSON.parse(localStorage.getItem(KEY) || 'null'); if (saved && typeof saved === 'object') state = { ...defaults, ...saved }; } catch {}
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {} };
  const el = (tag, attrs = {}, text = '') => { const node = document.createElement(tag); Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value)); if (text) node.textContent = text; return node; };
  function init() {
    const hud = document.getElementById('life-ui');
    if (!hud || document.getElementById('open-careers')) return;
    const button = el('button', { id: 'open-careers', type: 'button' }, '💼 الوظائف ومشروعي الخاص');
    hud.appendChild(button);
    const panel = el('section', { id: 'career-panel', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'career-title', hidden: '' });
    const heading = el('div', { class: 'career-heading' });
    heading.append(el('strong', { id: 'career-title' }, '💼 الوظائف ومشروعي الخاص'));
    const close = el('button', { type: 'button', 'aria-label': 'إغلاق لوحة العمل' }, '✕'); heading.appendChild(close);
    const note = el('p', { class: 'career-note' }, 'نموذج لعب تجريبي: الرصيد هنا افتراضي ومحفوظ على هذا الجهاز فقط، وليس مالًا حقيقيًا ولا متصلًا بمحفظة اللعبة أو Supabase.');
    const stats = el('div', { id: 'career-stats', class: 'career-stats', 'aria-live': 'polite' });
    const feedback = el('p', { id: 'career-feedback', role: 'status', class: 'career-feedback' }, 'اختاري وظيفة أو ابدئي مشروعك الخاص.');
    const job = el('section', { class: 'career-card' });
    job.append(el('h3', {}, '👩‍💼 وظيفة عند صاحب عمل'), el('p', {}, 'أنجزي وردية عمل لتحصلي على أجر افتراضي.'));
    const shift = el('button', { type: 'button', id: 'career-shift' }, 'ابدئي وردية عمل (+10 رصيد)'); job.appendChild(shift);
    const business = el('section', { class: 'career-card' });
    business.append(el('h3', {}, '🏪 مشروعك الخاص'), el('p', {}, 'اشتري محلًا تجريبيًا، جهزيه، خزّني المنتجات، ثم نفّذي طلبات العملاء الافتراضيين.'));
    const businessState = el('p', { id: 'business-state', class: 'business-state' });
    const actions = el('div', { class: 'career-actions' });
    const buy = el('button', { type: 'button', id: 'career-buy-premises' }, 'شراء محل (50)');
    const decorate = el('button', { type: 'button', id: 'career-decorate' }, 'تجهيز المحل (15)');
    const stock = el('button', { type: 'button', id: 'career-stock' }, 'شراء مخزون (8)');
    const order = el('button', { type: 'button', id: 'career-order' }, 'تنفيذ طلب (+14)');
    actions.append(buy, decorate, stock, order); business.append(businessState, actions);
    panel.append(heading, note, stats, job, business, feedback); document.body.appendChild(panel);
    const tell = message => { feedback.textContent = message; render(); };
    function render() {
      stats.replaceChildren(el('span', {}, '🪙 رصيد العمل: ' + state.workCredits), el('span', {}, '📋 الورديات: ' + state.shifts), el('span', {}, '📦 الطلبات المنجزة: ' + state.orders), el('span', {}, '💵 إيراد المشروع: ' + state.businessRevenue));
      businessState.textContent = !state.hasPremises ? 'لم تشتري محلًا بعد. يمكنك بدء العمل الوظيفي أو توفير الرصيد للمحل.' : 'المحل: مفتوح' + (state.decorated ? ' ومجهز' : ' ويحتاج إلى تجهيز') + ' · المخزون: ' + state.stock + ' · الطلبات: ' + state.orders;
      buy.disabled = state.hasPremises || state.workCredits < 50; decorate.disabled = !state.hasPremises || state.decorated || state.workCredits < 15; stock.disabled = !state.hasPremises || state.workCredits < 8; order.disabled = !state.hasPremises || !state.decorated || state.stock < 1; save();
      // Keep the 3D neighborhood in sync with this device's local prototype business state.
      window.dispatchEvent(new CustomEvent('wonderworld:career-state', { detail: { hasPremises: state.hasPremises, decorated: state.decorated, stock: state.stock, orders: state.orders } }));
    }
    shift.addEventListener('click', () => { state.shifts += 1; state.workCredits += 10; tell('أحسنتِ! خلصتِ وردية تجريبية وحصلتِ على 10 رصيد افتراضي.'); });
    buy.addEventListener('click', () => { if (state.hasPremises || state.workCredits < 50) return tell('تحتاجين إلى 50 رصيدًا افتراضيًا لشراء المحل.'); state.workCredits -= 50; state.hasPremises = true; tell('مبروك! أصبح عندك محل تجريبي. جهزيه قبل استقبال الطلبات.'); });
    decorate.addEventListener('click', () => { if (!state.hasPremises || state.decorated || state.workCredits < 15) return tell('المحل يحتاج إلى 15 رصيدًا للتجهيز، ويجب امتلاكه أولًا.'); state.workCredits -= 15; state.decorated = true; tell('اتجهز المحل! تقدري الآن تشتري مخزونًا وتنفذي طلبات العملاء.'); });
    stock.addEventListener('click', () => { if (!state.hasPremises || state.workCredits < 8) return tell('تحتاجين إلى محل و8 أرصدة لشراء المخزون.'); state.workCredits -= 8; state.stock += 3; tell('وصلت 3 وحدات مخزون إلى المحل.'); });
    order.addEventListener('click', () => { if (!state.hasPremises || !state.decorated || state.stock < 1) return tell('جهزي المحل وتحققي من توفر المخزون قبل قبول الطلب.'); state.stock -= 1; state.orders += 1; state.businessRevenue += 14; state.workCredits += 14; tell('تم تنفيذ طلب عميل افتراضي بنجاح! أضيف 14 رصيدًا إلى حساب العمل التجريبي.'); });
    button.addEventListener('click', () => { panel.hidden = false; render(); }); close.addEventListener('click', () => { panel.hidden = true; });
    panel.addEventListener('keydown', event => { if (event.key === 'Escape') panel.hidden = true; }); render();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true }); else init();
})();