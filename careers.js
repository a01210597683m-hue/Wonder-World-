// WonderWorld careers and player-owned business — local, non-monetary prototype.
(() => {
  'use strict';
  const KEY = 'wonderworld-careers-prototype-v1';
  const today = () => {
    const d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  };
  const defaults = {
    workCredits: 35, shifts: 0, hasPremises: false, stock: 0, orders: 0,
    businessRevenue: 0, decorated: false, selectedJob: 'cafe',
    jobExperience: 0, reputation: 0, businessLevel: 1, upgradedShelves: false,
    marketingDate: '', dailyOrderDate: today(), dailyOrderCount: 0, contractClaimedDate: ''
  };
  let state = { ...defaults };
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (saved && typeof saved === 'object' && !Array.isArray(saved)) state = { ...defaults, ...saved };
  } catch (_) {}
  // Local persistence is always available; signed-in players also sync this demo state to a private cloud row.
  let cloudUserId = null;
  let cloudReady = false;
  let cloudSyncToken = 0;
  let cloudSaveTimer = null;
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (_) {}
    if (!cloudReady || !cloudUserId || !window.wonderWorldSupabase) return;
    if (cloudSaveTimer) window.clearTimeout(cloudSaveTimer);
    cloudSaveTimer = window.setTimeout(async () => {
      const userId = cloudUserId;
      const payload = {};
      for (const key of Object.keys(defaults)) payload[key] = state[key];
      try {
        const { error } = await window.wonderWorldSupabase.from('player_career_saves').upsert({
          player_id: userId, save_data: payload, updated_at: new Date().toISOString()
        }, { onConflict: 'player_id' });
        if (error) throw error;
        const status = document.getElementById('career-cloud-status');
        if (status && cloudUserId === userId) status.textContent = '☁️ تم حفظ تقدم الوظائف والمحل على حسابك.';
      } catch (error) {
        console.warn('WonderWorld career cloud save failed:', error);
        const status = document.getElementById('career-cloud-status');
        if (status && cloudUserId === userId) status.textContent = 'الحفظ على الجهاز يعمل؛ تعذّر تحديث النسخة السحابية الآن.';
      }
    }, 500);
  }
  const jobs = [
    { id: 'cafe', title: 'مساعدة في الكافيه', icon: '☕', wage: 12, detail: 'جهزي طلبات المشروبات وساعدي الزبائن.' },
    { id: 'market', title: 'مساعدة في المتجر', icon: '🛍️', wage: 11, detail: 'رتبي المنتجات ووجهي الزبائن.' },
    { id: 'delivery', title: 'تنسيق التوصيل', icon: '📦', wage: 13, detail: 'نظمي الطلبات وجهزيها للتسليم.' }
  ];
  let lastShiftAt = 0;
  const el = (tag, attrs = {}, text = '') => {
    const node = document.createElement(tag);
    Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, String(value)));
    if (text) node.textContent = text;
    return node;
  };
  function init() {
    const hud = document.getElementById('life-ui');
    if (!hud || document.getElementById('open-careers')) return;
    if (state.dailyOrderDate !== today()) {
      state.dailyOrderDate = today();
      state.dailyOrderCount = 0;
    }
    if (!jobs.some(job => job.id === state.selectedJob)) state.selectedJob = 'cafe';
    state.workCredits = Math.max(0, Number(state.workCredits) || 0);
    state.stock = Math.max(0, Number(state.stock) || 0);
    state.orders = Math.max(0, Number(state.orders) || 0);
    state.businessRevenue = Math.max(0, Number(state.businessRevenue) || 0);
    state.reputation = Math.max(0, Number(state.reputation) || 0);
    state.businessLevel = Math.max(1, Number(state.businessLevel) || 1);

    const button = el('button', { id: 'open-careers', type: 'button' }, '💼 الوظائف ومشروعي الخاص');
    hud.appendChild(button);
    const panel = el('section', { id: 'career-panel', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'career-title', hidden: '' });
    const heading = el('div', { class: 'career-heading' });
    heading.append(el('strong', { id: 'career-title' }, '💼 الوظائف ومشروعي الخاص'));
    const close = el('button', { type: 'button', 'aria-label': 'إغلاق لوحة العمل' }, '✕');
    heading.appendChild(close);
    const note = el('p', { class: 'career-note' }, 'نموذج تجريبي: الأرصدة افتراضية وليست أموالًا حقيقية. الحفظ السحابي يحفظ حالة هذا النموذج فقط، وليس رصيد المحفظة الرسمي.');
    const cloudStatus = el('p', { id: 'career-cloud-status', class: 'career-subtle', role: 'status' }, '☁️ يمكنك اللعب محليًا، وسيتفعّل الحفظ السحابي بعد تسجيل الدخول.');
    const stats = el('div', { id: 'career-stats', class: 'career-stats', 'aria-live': 'polite' });
    const feedback = el('p', { id: 'career-feedback', role: 'status', class: 'career-feedback' }, 'اختاري وظيفة، أو طوّري مشروعك الخاص خطوة بخطوة.');

    const jobCard = el('section', { class: 'career-card' });
    jobCard.append(el('h3', {}, '👩‍💼 الوظائف والورديات'), el('p', {}, 'اختاري مسار العمل، ثم أنجزي وردية لتحصلي على أجر وخبرة.'));
    const jobList = el('div', { class: 'career-job-list', role: 'group', 'aria-label': 'اختيار الوظيفة' });
    const jobButtons = new Map();
    jobs.forEach(job => {
      const b = el('button', { type: 'button', class: 'career-job', 'data-job': job.id });
      b.append(el('strong', {}, job.icon + ' ' + job.title), el('span', {}, '+ ' + job.wage + ' رصيد'));
      b.appendChild(el('small', {}, job.detail));
      b.addEventListener('click', () => { state.selectedJob = job.id; tell('اختيارك الحالي: ' + job.title + '. جاهزة للوردية!'); });
      jobButtons.set(job.id, b);
      jobList.appendChild(b);
    });
    const shift = el('button', { type: 'button', id: 'career-shift', class: 'career-primary' }, 'ابدئي الوردية');
    const jobProgress = el('p', { id: 'career-job-progress', class: 'career-subtle' });
    jobCard.append(jobList, shift, jobProgress);

    const business = el('section', { class: 'career-card' });
    business.append(el('h3', {}, '🏪 مشروعك الخاص'), el('p', {}, 'اشتري محلًا، جهزيه، زوّدي المخزون، واكسبي سمعة من خدمة العملاء.'));
    const businessState = el('p', { id: 'business-state', class: 'business-state' });
    const businessProgress = el('div', { class: 'career-progress-wrap' });
    businessProgress.append(el('div', { class: 'career-progress-label' }, '⭐ سمعة المحل'), el('div', { class: 'career-progress-track', role: 'progressbar', 'aria-label': 'سمعة المحل', 'aria-valuemin': '0', 'aria-valuemax': '10', id: 'career-reputation-track' }));
    const reputationFill = el('span', { id: 'career-reputation-fill' });
    businessProgress.querySelector('#career-reputation-track').appendChild(reputationFill);
    const actions = el('div', { class: 'career-actions' });
    const buy = el('button', { type: 'button', id: 'career-buy-premises' }, '🏪 شراء محل (50)');
    const decorate = el('button', { type: 'button', id: 'career-decorate' }, '🎨 تجهيز المحل (15)');
    const stock = el('button', { type: 'button', id: 'career-stock' }, '📦 شراء مخزون (8)');
    const order = el('button', { type: 'button', id: 'career-order' }, '🧾 تنفيذ طلب عميل');
    const upgrade = el('button', { type: 'button', id: 'career-upgrade' }, '✨ ترقية المحل (30)');
    const shelves = el('button', { type: 'button', id: 'career-shelves' }, '🗄️ رفوف إضافية (20)');
    const marketing = el('button', { type: 'button', id: 'career-marketing' }, '📣 حملة تعريفية (12)');
    actions.append(buy, decorate, stock, order, upgrade, shelves, marketing);
    business.append(businessState, businessProgress, actions);

    const contract = el('section', { class: 'career-card career-contract' });
    contract.append(el('h3', {}, '🎯 تحدّي خدمة العملاء اليومي'));
    const contractText = el('p', { id: 'career-contract-text' });
    const contractTrack = el('div', { class: 'career-progress-track', role: 'progressbar', 'aria-label': 'تقدم تحدي اليوم', 'aria-valuemin': '0', 'aria-valuemax': '3', id: 'career-contract-track' });
    const contractFill = el('span', { id: 'career-contract-fill' });
    contractTrack.appendChild(contractFill);
    contract.append(contractText, contractTrack, el('p', { class: 'career-subtle' }, 'أكملي 3 طلبات في يوم واحد لتحصلي على مكافأة إضافية قدرها 25 رصيدًا مرة واحدة يوميًا.'));

    const achievements = el('section', { class: 'career-card' });
    achievements.append(el('h3', {}, '🏅 إنجازات العمل'));
    const achievementList = el('div', { id: 'career-achievements', class: 'career-achievements' });
    achievements.appendChild(achievementList);
    panel.append(heading, note, cloudStatus, stats, jobCard, business, contract, achievements, feedback);
    document.body.appendChild(panel);

    const selectedJob = () => jobs.find(job => job.id === state.selectedJob) || jobs[0];
    const tell = message => { feedback.textContent = message; render(); };
    const canAfford = amount => state.workCredits >= amount;
    function render() {
      const job = selectedJob();
      stats.replaceChildren(
        el('span', {}, '🪙 الرصيد: ' + state.workCredits),
        el('span', {}, '📋 الورديات: ' + state.shifts),
        el('span', {}, '📦 الطلبات: ' + state.orders),
        el('span', {}, '💵 إيراد المحل: ' + state.businessRevenue),
        el('span', {}, '⭐ خبرة العمل: ' + state.jobExperience),
        el('span', {}, '🏆 مستوى المحل: ' + state.businessLevel)
      );
      jobButtons.forEach((b, id) => {
        const active = id === state.selectedJob;
        b.classList.toggle('is-selected', active);
        b.setAttribute('aria-pressed', String(active));
      });
      shift.textContent = 'ابدئي وردية ' + job.title + ' (+' + job.wage + ' رصيد)';
      jobProgress.textContent = 'خبرة العمل: ' + state.jobExperience + ' · الورديات المكتملة: ' + state.shifts + ' · الوظيفة المختارة: ' + job.title;
      businessState.textContent = !state.hasPremises
        ? 'لسه ما اشتريتيش محلًا. رصيدك الحالي ' + state.workCredits + ' من 50 مطلوبًا لشراء أول محل.'
        : 'المحل مفتوح ' + (state.decorated ? 'ومجهز 🎨' : 'ويحتاج إلى تجهيز') + ' · المخزون: ' + state.stock + (state.upgradedShelves ? ' (سعة توريد أكبر)' : '') + ' · السمعة: ' + state.reputation + ' · مستوى المحل: ' + state.businessLevel;
      buy.disabled = state.hasPremises || !canAfford(50);
      decorate.disabled = !state.hasPremises || state.decorated || !canAfford(15);
      stock.disabled = !state.hasPremises || !canAfford(8);
      order.disabled = !state.hasPremises || !state.decorated || state.stock < 1;
      upgrade.disabled = !state.hasPremises || state.businessLevel >= 5 || !canAfford(30 * state.businessLevel);
      upgrade.textContent = state.businessLevel >= 5 ? '🏆 وصل المحل لأعلى مستوى' : '✨ ترقية المحل (' + (30 * state.businessLevel) + ')';
      shelves.disabled = !state.hasPremises || state.upgradedShelves || !canAfford(20);
      shelves.textContent = state.upgradedShelves ? '✅ الرفوف الإضافية مملوكة' : '🗄️ رفوف إضافية (20)';
      marketing.disabled = !state.hasPremises || state.marketingDate === today() || !canAfford(12);
      marketing.textContent = state.marketingDate === today() ? '📣 تم استخدام حملة اليوم' : '📣 حملة تعريفية (12)';
      const count = Math.min(3, state.dailyOrderCount || 0);
      contractText.textContent = state.contractClaimedDate === today()
        ? 'تم استلام مكافأة اليوم بالفعل. عودي غدًا لتحدٍ جديد! (' + count + '/3)'
        : 'الطلبات المكتملة اليوم: ' + count + '/3';
      contractFill.style.width = (count / 3 * 100) + '%';
      contractTrack.setAttribute('aria-valuenow', String(count));
      reputationFill.style.width = (Math.min(10, state.reputation) / 10 * 100) + '%';
      document.getElementById('career-reputation-track').setAttribute('aria-valuenow', String(Math.min(10, state.reputation)));
      achievementList.replaceChildren();
      const badges = [
        ['first-shift', '💼 أول وردية', state.shifts >= 1],
        ['steady-worker', '📋 5 ورديات', state.shifts >= 5],
        ['shop-owner', '🏪 صاحبة محل', state.hasPremises],
        ['first-sale', '🧾 أول طلب', state.orders >= 1],
        ['regulars', '⭐ 10 طلبات', state.orders >= 10],
        ['upgrade', '✨ تطوير المحل', state.businessLevel >= 2],
        ['daily-contract', '🎯 تحدي يومي', state.contractClaimedDate === today()]
      ];
      badges.forEach(([, label, unlocked]) => achievementList.appendChild(el('span', { class: 'career-badge' + (unlocked ? ' unlocked' : '') }, (unlocked ? '✓ ' : '🔒 ') + label)));
      save();
      window.dispatchEvent(new CustomEvent('wonderworld:career-state', { detail: {
        hasPremises: Boolean(state.hasPremises), decorated: Boolean(state.decorated), stock: state.stock,
        orders: state.orders, businessLevel: state.businessLevel, upgradedShelves: Boolean(state.upgradedShelves),
        reputation: state.reputation
      }}));
    }
    shift.addEventListener('click', () => {
      const now = Date.now();
      if (now - lastShiftAt < 2500) return tell('خدي نفسًا قصيرًا قبل الوردية التالية.');
      lastShiftAt = now;
      const job = selectedJob();
      state.shifts += 1;
      state.workCredits += job.wage;
      state.jobExperience += 5;
      if (state.shifts % 3 === 0) state.reputation += 1;
      tell('أحسنتِ! أنهيتِ وردية ' + job.title + ' وحصلتِ على ' + job.wage + ' رصيد وخبرة عمل +5.');
    });
    buy.addEventListener('click', () => {
      if (state.hasPremises || !canAfford(50)) return tell('تحتاجين إلى 50 رصيدًا افتراضيًا لشراء المحل.');
      state.workCredits -= 50; state.hasPremises = true;
      tell('مبروك! أصبح عندك محل في الحي. جهزيه قبل استقبال العملاء.');
    });
    decorate.addEventListener('click', () => {
      if (!state.hasPremises || state.decorated || !canAfford(15)) return tell('تحتاجين إلى امتلاك المحل و15 رصيدًا لتجهيزه.');
      state.workCredits -= 15; state.decorated = true;
      tell('اتجهز المحل! تقدري الآن تشتري مخزونًا وتنفذي طلبات العملاء.');
    });
    stock.addEventListener('click', () => {
      if (!state.hasPremises || !canAfford(8)) return tell('تحتاجين إلى محل و8 أرصدة لشراء المخزون.');
      const quantity = state.upgradedShelves ? 5 : 3;
      state.workCredits -= 8; state.stock += quantity;
      tell('وصل ' + quantity + ' وحدات مخزون إلى المحل.');
    });
    order.addEventListener('click', () => {
      if (!state.hasPremises || !state.decorated || state.stock < 1) return tell('جهزي المحل وتحققي من توفر المخزون قبل قبول الطلب.');
      state.stock -= 1; state.orders += 1;
      const payout = 14 + (state.businessLevel - 1) * 2 + Math.floor(state.reputation / 3);
      state.businessRevenue += payout; state.workCredits += payout; state.reputation += 1;
      if (state.dailyOrderDate !== today()) { state.dailyOrderDate = today(); state.dailyOrderCount = 0; }
      state.dailyOrderCount = Math.min(3, (Number(state.dailyOrderCount) || 0) + 1);
      let message = 'تم تسليم الطلب! حصلتِ على ' + payout + ' رصيد، وزادت سمعة المحل.';
      if (state.dailyOrderCount >= 3 && state.contractClaimedDate !== today()) {
        state.contractClaimedDate = today(); state.workCredits += 25;
        message += ' 🎉 أكملتِ تحدي اليوم وحصلتِ على مكافأة 25 رصيدًا!';
      }
      tell(message);
    });
    upgrade.addEventListener('click', () => {
      const cost = 30 * state.businessLevel;
      if (!state.hasPremises || state.businessLevel >= 5 || !canAfford(cost)) return tell('الترقية التالية تحتاج إلى ' + cost + ' رصيدًا، ويجب امتلاك المحل أولًا.');
      state.workCredits -= cost; state.businessLevel += 1; state.reputation += 2;
      tell('ترقية ناجحة! ارتفع مستوى المحل إلى ' + state.businessLevel + '، وأصبحت الطلبات القادمة أعلى قيمة.');
    });
    shelves.addEventListener('click', () => {
      if (!state.hasPremises || state.upgradedShelves || !canAfford(20)) return tell('تحتاجين إلى محل و20 رصيدًا لشراء الرفوف الإضافية.');
      state.workCredits -= 20; state.upgradedShelves = true;
      tell('أضيفت رفوف جديدة! كل طلب مخزون يمنحك 5 وحدات بدلًا من 3.');
    });
    marketing.addEventListener('click', () => {
      if (!state.hasPremises || state.marketingDate === today() || !canAfford(12)) return tell('الحملة التعريفية تحتاج إلى 12 رصيدًا، ومسموح بحملة واحدة يوميًا.');
      state.workCredits -= 12; state.marketingDate = today(); state.reputation += 2;
      tell('نجحت الحملة التعريفية! زادت سمعة المحل، وقد ترتفع قيمة الطلبات القادمة.');
    });
    button.addEventListener('click', () => { panel.hidden = false; render(); });
    close.addEventListener('click', () => { panel.hidden = true; });
    panel.addEventListener('keydown', event => { if (event.key === 'Escape') panel.hidden = true; });
    render();

    async function syncCareerCloud(user) {
      try { if (user?.id && localStorage.getItem('wonderworld-account-switching') === '1') return; } catch (_) {}
      const token = ++cloudSyncToken;
      cloudUserId = user?.id || null;
      cloudReady = false;
      if (cloudSaveTimer) { window.clearTimeout(cloudSaveTimer); cloudSaveTimer = null; }
      if (!cloudUserId || !window.wonderWorldSupabase) {
        cloudStatus.textContent = 'الحفظ المحلي متاح. سجّلي الدخول لتفعيل الحفظ السحابي.';
        return;
      }
      cloudStatus.textContent = '☁️ جاري تحميل حفظ حسابك…';
      try {
        const { data, error } = await window.wonderWorldSupabase
          .from('player_career_saves').select('save_data').eq('player_id', cloudUserId).maybeSingle();
        if (token !== cloudSyncToken) return;
        if (error) throw error;
        if (data?.save_data && typeof data.save_data === 'object' && !Array.isArray(data.save_data)) {
          const incoming = data.save_data;
          const safe = { ...defaults };
          for (const key of Object.keys(defaults)) {
            const value = incoming[key], fallback = defaults[key];
            if (typeof fallback === 'number' && Number.isFinite(Number(value))) safe[key] = Math.max(0, Math.min(1000000000, Number(value)));
            else if (typeof fallback === 'boolean' && typeof value === 'boolean') safe[key] = value;
            else if (typeof fallback === 'string' && typeof value === 'string' && value.length <= 40) safe[key] = value;
          }
          if (!jobs.some(job => job.id === safe.selectedJob)) safe.selectedJob = defaults.selectedJob;
          state = { ...state, ...safe };
          if (state.dailyOrderDate !== today()) { state.dailyOrderDate = today(); state.dailyOrderCount = 0; }
          cloudStatus.textContent = '☁️ تم تحميل حفظك من الحساب.';
          cloudReady = true;
          save();
          render();
        } else {
          cloudReady = true;
          save();
          cloudStatus.textContent = '☁️ تم تفعيل الحفظ السحابي لحسابك.';
        }
      } catch (error) {
        if (token !== cloudSyncToken) return;
        cloudReady = false;
        cloudStatus.textContent = 'الحفظ المحلي يعمل؛ تعذّر الاتصال بالحفظ السحابي. جرّبي فتح اللعبة مع اتصال بالإنترنت.';
        console.warn('WonderWorld career cloud load failed:', error);
      }
    }
    window.addEventListener('wonderworld:auth-state', event => { void syncCareerCloud(event.detail?.user || null); });
    if (window.wonderWorldSupabase) {
      window.wonderWorldSupabase.auth.getSession().then(({ data, error }) => {
        if (!error) void syncCareerCloud(data.session?.user || null);
      }).catch(error => console.warn('WonderWorld auth session unavailable:', error));
    }
  }
  function bootWhenHudExists() {
    if (document.getElementById('life-ui')) { init(); return; }
    const observer = new MutationObserver(() => {
      if (document.getElementById('life-ui')) {
        observer.disconnect();
        init();
      }
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootWhenHudExists, { once: true });
  } else {
    bootWhenHudExists();
  }
})();