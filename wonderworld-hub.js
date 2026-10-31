(() => {
  'use strict';
  function setup() {
    const nav = document.getElementById('ww-menu-categories');
    const content = document.getElementById('ww-menu-content');
    if (!nav || !content || nav.dataset.hubReady) return false;
    nav.dataset.hubReady = '1';
    nav.classList.add('ww-hub-grid');
    const heading = document.createElement('div');
    heading.className = 'ww-hub-heading';
    const title = document.createElement('strong');
    title.textContent = 'اكتشفي عالمك';
    const subtitle = document.createElement('small');
    subtitle.textContent = 'اختاري قسمًا لعرض تفاصيله';
    heading.append(title, subtitle);
    const label = document.createElement('label');
    label.className = 'ww-hub-search';
    const glyph = document.createElement('span');
    glyph.textContent = '⌕';
    const input = document.createElement('input');
    input.type = 'search';
    input.id = 'ww-hub-search-input';
    input.placeholder = 'ابحثي عن لعبة أو نشاط أو مكان…';
    input.setAttribute('aria-label', 'ابحثي داخل قوائم اللعبة');
    label.append(glyph, input);
    nav.parentNode.insertBefore(heading, nav);
    nav.parentNode.insertBefore(label, nav);
    const records = Array.from(nav.querySelectorAll('.ww-menu-category')).map(button => {
      const index = Number(button.dataset.categoryIndex);
      const section = content.querySelector('.ww-menu-section[data-category-index="' + index + '"]');
      const badge = document.createElement('small');
      badge.className = 'ww-hub-count';
      button.appendChild(badge);
      const count = section ? section.querySelectorAll('.ww-section-body button').length : 0;
      badge.textContent = count ? count + ' خيارات' : 'استكشاف';
      return {button, section, text: ((button.textContent || '') + ' ' + (section?.textContent || '')).toLocaleLowerCase('ar')};
    });
    const empty = document.createElement('p');
    empty.className = 'ww-hub-empty';
    empty.textContent = 'مش لاقيين نتيجة مطابقة. جرّبي كلمة تانية.';
    empty.hidden = true;
    content.appendChild(empty);
    input.addEventListener('input', () => {
      const q = input.value.trim().toLocaleLowerCase('ar');
      let found = 0;
      for (const item of records) {
        const matches = !q || item.text.includes(q);
        const actions = item.section ? Array.from(item.section.querySelectorAll('.ww-section-body button')) : [];
        actions.forEach(action => { action.hidden = !!q && !action.textContent.toLocaleLowerCase('ar').includes(q); });
        item.button.hidden = !matches && !(q && actions.some(action => !action.hidden));
        if (!item.button.hidden) found++;
      }
      empty.hidden = !q || found > 0;
    });
    input.addEventListener('keydown', event => {
      if (event.key === 'Escape') { input.value = ''; input.dispatchEvent(new Event('input')); input.blur(); }
    });
    nav.addEventListener('click', event => {
      const button = event.target.closest('.ww-menu-category');
      if (button) subtitle.textContent = button.querySelector('.ww-menu-category-label')?.textContent || 'القسم المختار';
    });
    return true;
  }
  if (!setup()) {
    const observer = new MutationObserver(() => { if (setup()) observer.disconnect(); });
    observer.observe(document.body, {childList:true, subtree:true});
  }
})();
