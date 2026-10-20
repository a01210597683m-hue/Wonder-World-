import {
  Application, Color, Entity, FILLMODE_FILL_WINDOW, RESOLUTION_AUTO,
  StandardMaterial, Vec3
} from 'playcanvas';

const canvas = document.getElementById('application');
const status = document.getElementById('status');
const app = new Application(canvas, {
  graphicsDeviceOptions: { antialias: true, alpha: false }
});
app.setCanvasFillMode(FILLMODE_FILL_WINDOW);
app.setCanvasResolution(RESOLUTION_AUTO);
app.start();
app.scene.ambientLight = new Color(0.72, 0.75, 0.82);

function mat(color) {
  const m = new StandardMaterial();
  m.diffuse = color;
  m.update();
  return m;
}
const mats = {
  grass: mat(new Color(0.32, 0.62, 0.35)),
  road: mat(new Color(0.27, 0.31, 0.36)),
  path: mat(new Color(0.82, 0.78, 0.66)),
  wall: mat(new Color(0.94, 0.83, 0.66)),
  wallPink: mat(new Color(0.89, 0.63, 0.62)),
  roof: mat(new Color(0.55, 0.24, 0.21)),
  white: mat(new Color(0.97, 0.96, 0.88)),
  window: mat(new Color(0.28, 0.72, 0.86)),
  door: mat(new Color(0.34, 0.20, 0.13)),
  leaf: mat(new Color(0.18, 0.47, 0.25)),
  trunk: mat(new Color(0.38, 0.23, 0.13)),
  flower: mat(new Color(0.96, 0.42, 0.64)),
  bench: mat(new Color(0.48, 0.29, 0.15)),
  player: mat(new Color(0.53, 0.31, 0.82)),
  outfitMint: mat(new Color(0.18, 0.65, 0.53)),
  outfitCoral: mat(new Color(0.93, 0.38, 0.34)),
  outfitBlue: mat(new Color(0.18, 0.42, 0.78)),
  outfitGold: mat(new Color(0.95, 0.68, 0.16)),
  hairBrown: mat(new Color(0.24, 0.13, 0.09)),
  hairBlack: mat(new Color(0.055, 0.045, 0.07)),
  hairRose: mat(new Color(0.55, 0.19, 0.35)),
  skin: mat(new Color(0.88, 0.63, 0.46)),
  npcBlue: mat(new Color(0.18, 0.53, 0.82)),
  npcPink: mat(new Color(0.89, 0.34, 0.56)),
  npcGold: mat(new Color(0.96, 0.68, 0.19))
};

function box(name, sx, sy, sz, x, y, z, material, parent = app.root) {
  const e = new Entity(name);
  e.addComponent('render', { type: 'box' });
  e.setLocalScale(sx, sy, sz);
  e.setLocalPosition(x, y, z);
  e.render.material = material;
  parent.addChild(e);
  return e;
}
function sphere(name, scale, x, y, z, material, parent = app.root) {
  const e = new Entity(name);
  e.addComponent('render', { type: 'sphere' });
  e.setLocalScale(scale, scale, scale);
  e.setLocalPosition(x, y, z);
  e.render.material = material;
  parent.addChild(e);
  return e;
}
function cylinder(name, sx, sy, sz, x, y, z, material) {
  const e = new Entity(name);
  e.addComponent('render', { type: 'cylinder' });
  e.setLocalScale(sx, sy, sz);
  e.setPosition(x, y, z);
  e.render.material = material;
  app.root.addChild(e);
  return e;
}

// Lighting and a small neighborhood rather than an empty test island.
const sun = new Entity('Sun');
sun.addComponent('light', { type: 'directional', color: new Color(1, 0.94, 0.82), intensity: 1.55, castShadows: true });
sun.setEulerAngles(45, 25, 0);
app.root.addChild(sun);
box('Town green', 48, 0.4, 48, 0, -0.25, 0, mats.grass);
box('Main street', 5.5, 0.06, 42, 0, 0.0, 0, mats.road);
box('Cross street', 42, 0.06, 5.5, 0, 0.01, 0, mats.road);
box('North sidewalk', 7, 0.08, 42, -6.2, 0.03, 0, mats.path);
box('South sidewalk', 7, 0.08, 42, 6.2, 0.03, 0, mats.path);
box('West sidewalk', 42, 0.08, 7, 0, 0.03, -6.2, mats.path);
box('East sidewalk', 42, 0.08, 7, 0, 0.03, 6.2, mats.path);

// Houses with doors, windows, roofs and little gardens.
function house(name, x, z, wallMaterial, width = 5) {
  box(name + ' walls', width, 3.1, 4.2, x, 1.55, z, wallMaterial);
  box(name + ' roof', width + 0.55, 0.38, 4.7, x, 3.28, z, mats.roof);
  box(name + ' door', 0.95, 1.9, 0.16, x, 0.98, z - 2.17, mats.door);
  box(name + ' window left', 0.95, 0.85, 0.13, x - width * 0.29, 1.95, z - 2.18, mats.window);
  box(name + ' window right', 0.95, 0.85, 0.13, x + width * 0.29, 1.95, z - 2.18, mats.window);
  box(name + ' step', 1.5, 0.18, 0.65, x, 0.1, z - 2.45, mats.path);
  for (let i = 0; i < 3; i++) {
    sphere(name + ' garden bush ' + i, 0.65, x - width / 2 + i * 0.65, 0.42, z - 2.9, mats.leaf);
  }
}
house('Home', -10, -10, mats.wall, 5);
house('Family home', 10, -10, mats.wallPink, 5);

// Shop, sign and colorful awning.
box('Wonder Shop building', 6, 3.5, 4.5, 10, 1.75, 10, mats.white);
box('Shop roof', 6.5, 0.35, 5, 10, 3.7, 10, mats.npcBlue);
box('Shop door', 1.1, 2, 0.16, 10, 1, 7.7, mats.door);
box('Shop window', 2.1, 1.35, 0.12, 8.1, 1.85, 7.68, mats.window);
box('Shop window 2', 2.1, 1.35, 0.12, 11.9, 1.85, 7.68, mats.window);
box('Shop sign', 4.2, 0.75, 0.18, 10, 3.05, 7.55, mats.npcPink);

// Added destinations: Wonder Cafe, community office and a town-plaza fountain.
box('Wonder Cafe building', 5.5, 3.1, 4.5, 15, 1.55, 0, mats.wallPink);
box('Wonder Cafe roof', 6, 0.32, 4.9, 15, 3.18, 0, mats.roof);
box('Cafe front window', 2.0, 1.25, 0.14, 13.7, 1.8, -2.3, mats.window);
box('Cafe front window 2', 2.0, 1.25, 0.14, 16.2, 1.8, -2.3, mats.window);
box('Cafe door', 0.95, 1.9, 0.16, 15, 0.98, -2.34, mats.door);
box('Cafe sign', 3.8, 0.55, 0.18, 15, 2.75, -2.4, mats.npcPink);
box('Community office building', 5.4, 3.0, 4.2, 0, 1.5, -16, mats.white);
box('Community office roof', 5.8, 0.32, 4.6, 0, 3.1, -16, mats.npcBlue);
box('Community office door', 1.0, 1.9, 0.16, 0, 0.98, -18.15, mats.door);
box('Community office window', 2.0, 1.1, 0.14, -1.5, 1.8, -18.15, mats.window);
box('Community office sign', 3.8, 0.55, 0.18, 0, 2.65, -18.15, mats.npcBlue);
cylinder('Plaza fountain base', 2.2, 0.35, 2.2, 0, 0.22, 0, mats.white);
cylinder('Plaza fountain bowl', 1.6, 0.25, 1.6, 0, 0.48, 0, mats.window);
sphere('Fountain water sparkle', 0.7, 0, 0.95, 0, mats.window);

// Wonder Fitness: a small gym destination.
box('Wonder Fitness building', 6, 3.2, 4.8, 15, 1.6, -15, mats.white);
box('Wonder Fitness roof', 6.5, 0.35, 5.2, 15, 3.35, -15, mats.npcBlue);
box('Wonder Fitness door', 1.0, 1.9, 0.16, 15, 0.98, -17.45, mats.door);
box('Wonder Fitness window', 2.0, 1.15, 0.14, 13.0, 1.85, -17.45, mats.window);
box('Wonder Fitness sign', 4.0, 0.55, 0.18, 15, 2.75, -17.48, mats.npcGold);
cylinder('Fitness weight left', 0.22, 0.55, 0.22, 13.0, 0.35, -12.0, mats.road);
cylinder('Fitness weight right', 0.22, 0.55, 0.22, 13.8, 0.35, -12.0, mats.road);
box('Fitness weight bar', 1.3, 0.12, 0.12, 13.4, 0.38, -12.0, mats.bench);

// Park, trees, flowers and benches.
box('Park lawn', 12, 0.12, 12, -11, 0.05, 10, mats.leaf);
for (const [x,z] of [[-15,7],[-7,7],[-15,14],[-7,14],[-11,4]]) {
  cylinder('Tree trunk', 0.45, 1.8, 0.45, x, 0.9, z, mats.trunk);
  sphere('Tree crown', 2.2, x, 2.5, z, mats.leaf);
}
for (const [x,z] of [[-13,9],[-9,9],[-13,12],[-9,12]]) {
  sphere('Park flower', 0.38, x, 0.3, z, mats.flower);
}
box('Park bench seat', 2.2, 0.2, 0.65, -11, 0.7, 10, mats.bench);
box('Park bench back', 2.2, 0.8, 0.18, -11, 1.05, 10.28, mats.bench);

// The current avatars are temporary geometric placeholders, not final reference-matched art.
function makePerson(name, x, z, shirtMaterial, isPlayer = false) {
  const person = new Entity(name);
  person.setPosition(x, 0, z);
  app.root.addChild(person);
  const body = box(name + ' body', 0.82, 1.35, 0.58, 0, 0.95, 0, shirtMaterial, person);
  sphere(name + ' head', 0.78, 0, 1.95, 0, mats.skin, person);
  const hair = sphere(name + ' hair', 0.8, 0, 2.28, -0.04, isPlayer ? mats.player : mats.trunk, person);
  const leftArm = box(name + ' left arm', 0.22, 0.95, 0.24, -0.54, 1.0, 0, shirtMaterial, person);
  const rightArm = box(name + ' right arm', 0.22, 0.95, 0.24, 0.54, 1.0, 0, shirtMaterial, person);
  person.outfitParts = [body, leftArm, rightArm];
  person.hairPart = hair;
  person.bodyPart = body;
  person.leftArm = leftArm;
  person.rightArm = rightArm;
  person.baseHeadY = 1.95;
  person.baseHairY = 2.28;
  return person;
}
const player = makePerson('Player', 0, 1.5, mats.player, true);
const npcs = [
  { name: 'ليلى', role: 'جارة', entity: makePerson('Layla', -3, 3, mats.npcPink), relation: 0, x: -3, z: 3 },
  { name: 'آدم', role: 'صديق جديد', entity: makePerson('Adam', 3, -3, mats.npcBlue), relation: 0, x: 3, z: -3 },
  { name: 'نور', role: 'من سكان الحي', entity: makePerson('Nour', -9, 2, mats.npcGold), relation: 0, x: -9, z: 2 }
];

const camera = new Entity('Follow Camera');
camera.addComponent('camera', { clearColor: new Color(0.53, 0.79, 0.96), fov: 60, farClip: 200 });
camera.setPosition(0, 7, 11);
camera.lookAt(0, 1, 0);
app.root.addChild(camera);

const ui = document.createElement('section');
ui.id = 'life-ui';
ui.innerHTML = `
  <div class="life-stats"><span>💛 السعادة: <b id="happiness">60</b></span><span>⚡ الطاقة: <b id="energy">80</b></span><span>🪙 العملات: <b id="coins">20</b></span></div>
  <div class="avatar-tools"><button id="change-outfit" type="button">👕 تغيير الملابس</button><button id="change-hair" type="button">💇 تغيير لون الشعر</button></div>
  <button id="open-shop" type="button">🛍️ افتحي متجر Wonder</button>
  <div class="avatar-tools"><button id="open-puzzle" type="button">🧩 ألغاز سريعة</button></div>
  <div class="avatar-tools"><button id="quick-work" type="button">💼 شغل سريع</button><button id="quick-rest" type="button">🛋️ استراحة</button><button id="quick-cafe" type="button">☕ طلب كافيه</button></div>
  <div class="avatar-tools"><button id="quick-gym" type="button">🏋️ تمرين</button><button id="quick-garden" type="button">🌷 جمع زهور</button></div>
  <button id="interact" type="button">تفاعل / استكشاف</button>
  <section id="shop-panel" hidden aria-label="متجر Wonder">
    <div class="shop-heading"><strong>🛍️ متجر Wonder</strong><button id="close-shop" type="button" aria-label="إغلاق المتجر">✕</button></div>
    <p class="shop-intro">اختاري قطعة، واشتريها بعملاتك، وبعدها تقدري تلبسيها في أي وقت.</p>
    <div id="shop-products"></div>
    <div id="shop-feedback" role="status"></div>
  </section>
  <section id="puzzle-panel" hidden aria-label="لعبة ألغاز">
    <div class="shop-heading"><strong>🧩 تحدّي الألغاز</strong><button id="close-puzzle" type="button" aria-label="إغلاق الألغاز">✕</button></div>
    <p id="puzzle-question">اختاري إجابة اللغز.</p>
    <div id="puzzle-choices"></div>
    <div id="puzzle-feedback" role="status"></div>
    <button id="next-puzzle" type="button" hidden>لغز جديد</button>
  </section>
  <section id="dialogue-panel" hidden aria-label="اختيارات الحوار">
    <div class="shop-heading"><strong id="dialogue-title">حوار</strong><button id="close-dialogue" type="button" aria-label="إغلاق الحوار">✕</button></div>
    <p id="dialogue-text">اختاري ردًا مناسبًا.</p>
    <div id="dialogue-choices"></div>
    <div id="dialogue-feedback" role="status"></div>
  </section>
  <div id="life-message" role="status">أهلًا بكِ في WonderWorld! تحرّكي واستكشفي الحي.</div>
  <div id="life-goal">مهمتك: تعرّفي على شخص، ثم زوري المتجر والحديقة.</div>
`;
document.getElementById('game').appendChild(ui);
const interactButton = document.getElementById('interact');
const outfitOptions = [mats.player, mats.outfitMint, mats.outfitCoral, mats.outfitBlue, mats.outfitGold];
const hairOptions = [mats.player, mats.hairBrown, mats.hairBlack, mats.hairRose];
let outfitIndex = 0;
let hairIndex = 0;
document.getElementById('change-outfit').addEventListener('click', openShop);
document.getElementById('change-hair').addEventListener('click', openShop);
document.getElementById('close-dialogue').addEventListener('click', () => {
  document.getElementById('dialogue-panel').hidden = true;
});
const message = document.getElementById('life-message');
let happiness = 60;
let energy = 80;
let coins = 20;
let lastWorkAt = 0;
let lastWorkoutAt = 0;
let gardenFlowers = 0;
let lastFlowerDay = "";
let puzzleCooldownUntil = 0;
let currentPuzzle = null;
const ownedItems = new Set(['default-outfit', 'default-hair']);
const dailyQuests = { friend: false, park: false, shop: false, rewarded: false };
const todayQuestKey = new Date().toISOString().slice(0, 10);
let questDate = todayQuestKey;
const equippedItems = { outfit: 'default-outfit', hair: 'default-hair' };
let loadedProgress = null;
function say(text) { message.textContent = text; status.textContent = text; }
function updateStats() {
  document.getElementById('happiness').textContent = happiness;
  document.getElementById('energy').textContent = energy;
  document.getElementById('coins').textContent = coins;
  saveProgress();
}
function updateQuestUI() {
  const line = document.getElementById('life-goal');
  const mark = done => done ? '✅' : '⬜';
  line.textContent = `مهام اليوم: ${mark(dailyQuests.friend)} تعرّفي على جار • ${mark(dailyQuests.park)} زوري الحديقة • ${mark(dailyQuests.shop)} اشتري من المتجر`;
  if (dailyQuests.friend && dailyQuests.park && dailyQuests.shop && !dailyQuests.rewarded) {
    dailyQuests.rewarded = true;
    coins += 10;
    happiness = Math.min(100, happiness + 10);
    updateStats();
    say('برافو! خلّصتي كل مهام اليوم 🎉 مكافأة: 10 عملات و+10 سعادة.');
  }
}
function completeQuest(key) {
  dailyQuests[key] = true;
  updateQuestUI();
}
const shopProducts = [
  { id: 'mint-outfit', name: 'طقم نعناعي', category: 'outfit', price: 8, material: mats.outfitMint, emoji: '👕' },
  { id: 'coral-outfit', name: 'طقم مرجاني', category: 'outfit', price: 10, material: mats.outfitCoral, emoji: '🧥' },
  { id: 'blue-outfit', name: 'طقم أزرق', category: 'outfit', price: 12, material: mats.outfitBlue, emoji: '👚' },
  { id: 'gold-outfit', name: 'طقم ذهبي', category: 'outfit', price: 15, material: mats.outfitGold, emoji: '✨' },
  { id: 'brown-hair', name: 'شعر بني', category: 'hair', price: 6, material: mats.hairBrown, emoji: '💇' },
  { id: 'black-hair', name: 'شعر أسود', category: 'hair', price: 8, material: mats.hairBlack, emoji: '🖤' },
  { id: 'rose-hair', name: 'شعر وردي غامق', category: 'hair', price: 10, material: mats.hairRose, emoji: '🌸' }
];
const saveProgress = () => {
  try {
    localStorage.setItem('wonderworld-save-v1', JSON.stringify({
      coins, happiness, energy, gardenFlowers, lastFlowerDay, questDate, ownedItems: [...ownedItems], dailyQuests,
      relationships: Object.fromEntries(npcs.map(npc => [npc.name, npc.relation])),
      equippedItems
    }));
  } catch (_) {}
};
try {
  loadedProgress = JSON.parse(localStorage.getItem('wonderworld-save-v1') || 'null');
  if (loadedProgress) {
    if (Number.isFinite(loadedProgress.coins)) coins = Math.max(0, loadedProgress.coins);
    if (Number.isFinite(loadedProgress.happiness)) happiness = Math.max(0, Math.min(100, loadedProgress.happiness));
    if (Number.isFinite(loadedProgress.energy)) energy = Math.max(0, Math.min(100, loadedProgress.energy));
    if (Number.isFinite(loadedProgress.gardenFlowers)) gardenFlowers = Math.max(0, loadedProgress.gardenFlowers);
    if (typeof loadedProgress.lastFlowerDay === 'string') lastFlowerDay = loadedProgress.lastFlowerDay;
    if (Array.isArray(loadedProgress.ownedItems)) loadedProgress.ownedItems.forEach(id => ownedItems.add(id));
    if (loadedProgress.dailyQuests && typeof loadedProgress.dailyQuests === 'object') {
      for (const key of Object.keys(dailyQuests)) {
        if (typeof loadedProgress.dailyQuests[key] === 'boolean') dailyQuests[key] = loadedProgress.dailyQuests[key];
      }
    }
    if (loadedProgress.questDate !== todayQuestKey) {
      for (const key of Object.keys(dailyQuests)) dailyQuests[key] = false;
      questDate = todayQuestKey;
    } else {
      questDate = loadedProgress.questDate;
    }
    if (loadedProgress.relationships && typeof loadedProgress.relationships === 'object') {
      for (const npc of npcs) {
        const level = loadedProgress.relationships[npc.name];
        if (Number.isFinite(level)) npc.relation = Math.max(0, level);
      }
    }
    if (loadedProgress.equippedItems && typeof loadedProgress.equippedItems === 'object') {
      if (typeof loadedProgress.equippedItems.outfit === 'string') equippedItems.outfit = loadedProgress.equippedItems.outfit;
      if (typeof loadedProgress.equippedItems.hair === 'string') equippedItems.hair = loadedProgress.equippedItems.hair;
    }
  }
} catch (_) { loadedProgress = null; }
function equipItem(item) {
  if (item.category === 'outfit') {
    player.outfitParts.forEach(part => { part.render.material = item.material; });
    equippedItems.outfit = item.id;
    const index = outfitOptions.indexOf(item.material);
    if (index >= 0) outfitIndex = index;
  } else {
    player.hairPart.render.material = item.material;
    equippedItems.hair = item.id;
    const index = hairOptions.indexOf(item.material);
    if (index >= 0) hairIndex = index;
  }
  saveProgress();
}
function restoreEquippedItems() {
  for (const category of ['outfit', 'hair']) {
    const id = equippedItems[category];
    const item = shopProducts.find(product => product.id === id && product.category === category);
    if (item && ownedItems.has(item.id)) equipItem(item);
  }
}
function renderShop() {
  const list = document.getElementById('shop-products');
  list.replaceChildren();
  for (const item of shopProducts) {
    const card = document.createElement('div');
    card.className = 'shop-product';
    const info = document.createElement('div');
    info.className = 'shop-product-info';
    const name = document.createElement('strong');
    name.textContent = item.emoji + ' ' + item.name;
    const price = document.createElement('span');
    price.textContent = '🪙 ' + item.price;
    info.append(name, price);
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.shopItem = item.id;
    button.textContent = ownedItems.has(item.id) ? 'ارتديها' : 'شراء';
    card.append(info, button);
    list.appendChild(card);
  }
}
function openShop() {
  document.getElementById('shop-panel').hidden = false;
  renderShop();
  document.getElementById('shop-feedback').textContent = 'رصيدك الحالي: ' + coins + ' عملة.';
}
document.getElementById('open-shop').addEventListener('click', openShop);
document.getElementById('close-shop').addEventListener('click', () => { document.getElementById('shop-panel').hidden = true; });
document.getElementById('shop-products').addEventListener('click', event => {
  const button = event.target.closest('button[data-shop-item]');
  if (!button) return;
  const item = shopProducts.find(product => product.id === button.dataset.shopItem);
  if (!item) return;
  if (ownedItems.has(item.id)) {
    equipItem(item);
    document.getElementById('shop-feedback').textContent = 'لبستي ' + item.name + ' بالفعل ✨';
    say('تم ارتداء ' + item.name + '!');
    return;
  }
  if (coins < item.price) {
    document.getElementById('shop-feedback').textContent = 'رصيدك مش كفاية. محتاجة ' + item.price + ' عملة.';
    return;
  }
  coins -= item.price;
  ownedItems.add(item.id);
  equipItem(item);
  happiness = Math.min(100, happiness + 3);
  updateStats();
  saveProgress();
  completeQuest('shop');
  document.getElementById('shop-feedback').textContent = 'اشتريتي ' + item.name + ' واتضافت لمقتنياتك 🎉 الرصيد: ' + coins + ' عملة.';
  renderShop();
  say('مبروك! اشتريتي ' + item.name + ' من متجر Wonder 🛍️');
});
const places = [
  { name: 'بيتك', x: -10, z: -7.4, radius: 3.2, action: () => say('وصلتِ إلى بيتك! النموذج الحالي يحدد موقع المنزل؛ تصميم داخلي قابل للدخول مرحلة تطوير لاحقة.') },
  { name: 'بيت العائلة', x: 10, z: -7.4, radius: 3.2, action: () => say('هذا بيت العائلة. تقدري تستكشفي الحي، وسنضيف دخول البيوت وأثاثها في مرحلة تالية.') },
  { name: 'متجر Wonder', x: 10, z: 7.1, radius: 3.5, action: openShop },
  { name: 'كافيه Wonder', x: 15, z: -3.2, radius: 4.0, action: orderCafe },
  { name: 'مكتب الحي', x: 0, z: -18.3, radius: 4.0, action: doQuickWork },
  { name: 'Wonder Fitness', x: 15, z: -18, radius: 4.5, action: doWorkout },
  { name: 'حديقة الأصدقاء', x: -11, z: 6.5, radius: 4.2, action: () => {
    happiness = Math.min(100, happiness + 12); updateStats(); completeQuest('park'); saveProgress(); say('قضيتي وقتًا لطيفًا في الحديقة! السعادة +12 🌷');
  }}
];
let activeDialogueNpc = null;
const puzzles = [
  { q: 'إيه الرقم اللي يكمل السلسلة؟ 2، 4، 6، ؟', choices: ['7', '8', '10'], answer: 1, hint: 'بنزوّد 2 كل مرة.' },
  { q: 'معاكي 3 تفاحات وخدتي 2 كمان. بقي معاكي كام؟', choices: ['5', '6', '4'], answer: 0, hint: '3 + 2 = 5.' },
  { q: 'مين المختلف؟ 🍎 🍎 🍌 🍎', choices: ['التفاحة الأولى', 'الموزة', 'التفاحة الأخيرة'], answer: 1, hint: 'فاكهة مختلفة عن باقي المجموعة.' },
  { q: 'لو الساعة 3 وزوّدنا ساعتين، تبقى كام؟', choices: ['4', '6', '5'], answer: 2, hint: '3 + 2 = 5.' },
  { q: 'إيه اللي بنستخدمه عشان نعرف الاتجاهات؟', choices: ['بوصلة', 'ملعقة', 'وسادة'], answer: 0, hint: 'أداة بتساعدنا نعرف الشمال والجنوب.' }
];
function openPuzzle() {
  document.getElementById('puzzle-panel').hidden = false;
  document.getElementById('puzzle-feedback').textContent = '';
  document.getElementById('next-puzzle').hidden = true;
  currentPuzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
  document.getElementById('puzzle-question').textContent = currentPuzzle.q;
  const choices = document.getElementById('puzzle-choices');
  choices.replaceChildren();
  currentPuzzle.choices.forEach((label, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'dialogue-choice';
    button.textContent = label;
    button.addEventListener('click', () => {
      if (Date.now() < puzzleCooldownUntil) {
        document.getElementById('puzzle-feedback').textContent = 'استني لحظة قبل المحاولة التالية.';
        return;
      }
      puzzleCooldownUntil = Date.now() + 5000;
      for (const option of choices.querySelectorAll('button')) option.disabled = true;
      if (index === currentPuzzle.answer) {
        coins += 5;
        happiness = Math.min(100, happiness + 4);
        updateStats();
        document.getElementById('puzzle-feedback').textContent = 'إجابة صحيحة! +5 عملات و+4 سعادة 🎉 ' + currentPuzzle.hint;
      } else {
        document.getElementById('puzzle-feedback').textContent = 'مش الإجابة دي، جربي لغز تاني. 💡 ' + currentPuzzle.hint;
      }
      document.getElementById('next-puzzle').hidden = false;
    });
    choices.appendChild(button);
  });
}
document.getElementById('open-puzzle').addEventListener('click', openPuzzle);
document.getElementById('close-puzzle').addEventListener('click', () => { document.getElementById('puzzle-panel').hidden = true; });
document.getElementById('next-puzzle').addEventListener('click', openPuzzle);
function orderCafe() {
  if (coins < 5) { say('طلب الكافيه محتاج 5 عملات. زوري مكتب الحي للشغل أو كمّلي المهام.'); return; }
  coins -= 5;
  happiness = Math.min(100, happiness + 10);
  energy = Math.min(100, energy + 8);
  updateStats();
  say('☕ طلبك وصل! دفعتِ 5 عملات، والسعادة +10 والطاقة +8. أهلًا بيكي في Wonder Cafe!');
}
function doQuickWork() {
  if (energy < 15) { say('طاقتك قليلة للشغل. خدي استراحة الأول 🛋️'); return; }
  const now = Date.now();
  if (now - lastWorkAt < 30000) { say('خدي دقيقة بين الشغلانات؛ جربي الكافيه أو الحديقة لحد ما تستعدّي.'); return; }
  lastWorkAt = now;
  energy = Math.max(0, energy - 15);
  happiness = Math.max(0, happiness - 2);
  coins += 12;
  updateStats();
  say('💼 خلصتي وردية قصيرة في مكتب الحي! كسبتي 12 عملة وخسرتِ 15 طاقة. الشغل التالي بعد 30 ثانية.');
}
function doWorkout() {
  if (energy < 12) { say('طاقتك قليلة للتمرين. خدي استراحة أو زوري الكافيه الأول.'); return; }
  const now = Date.now();
  if (now - lastWorkoutAt < 20000) { say('خدي وقتك بين التمارين. المحاولة التالية بعد شوية 💪'); return; }
  lastWorkoutAt = now;
  energy = Math.max(0, energy - 12);
  happiness = Math.min(100, happiness + 8);
  coins += 3;
  updateStats();
  say('💪 خلصتي تمرين Wonder Fitness! السعادة +8، وكسبتي 3 عملات، والطاقة -12.');
}
function collectGardenFlowers() {
  const p = player.getPosition();
  if (Math.hypot(p.x + 11, p.z - 6.5) > 7) { say('اقتربي من حديقة الأصدقاء عشان تجمعي الزهور 🌷'); return; }
  const today = new Date().toISOString().slice(0, 10);
  if (lastFlowerDay === today) { say('جمعتي زهور النهارده بالفعل. ارجعي بكرة لمجموعة جديدة 🌷'); return; }
  lastFlowerDay = today;
  gardenFlowers += 3;
  happiness = Math.min(100, happiness + 5);
  updateStats();
  say('🌷 جمعتي 3 زهور من الحديقة! إجمالي الزهور معاكِ: ' + gardenFlowers + '. السعادة +5.');
}
document.getElementById('quick-gym').addEventListener('click', () => {
  const p = player.getPosition();
  if (Math.hypot(p.x - 15, p.z + 15) > 8) { say('اقتربي من مبنى Wonder Fitness الأزرق في جنوب شرق الحي.'); return; }
  doWorkout();
});
document.getElementById('quick-garden').addEventListener('click', collectGardenFlowers);
function takeRest() {
  energy = Math.min(100, energy + 25);
  happiness = Math.min(100, happiness + 3);
  updateStats();
  say('🛋️ استراحة لطيفة! الطاقة +25 والسعادة +3. (الاستراحة هنا نموذج أولي وليست دخولًا فعليًا للبيت).');
}
document.getElementById('quick-work').addEventListener('click', () => {
  const p = player.getPosition();
  if (Math.hypot(p.x, p.z + 18.3) > 7) { say('اقتربي من مكتب الحي الأزرق في آخر الشارع عشان تشتغلي.'); return; }
  doQuickWork();
});
document.getElementById('quick-rest').addEventListener('click', takeRest);
document.getElementById('quick-cafe').addEventListener('click', () => {
  const p = player.getPosition();
  if (Math.hypot(p.x - 15, p.z + 3.2) > 7) { say('اقتربي من مبنى Wonder Cafe الوردي عشان تطلبي.'); return; }
  orderCafe();
});
function showDialogue(npc) {
  activeDialogueNpc = npc;
  const panel = document.getElementById('dialogue-panel');
  document.getElementById('dialogue-title').textContent = npc.name + ' — ' + npc.role;
  document.getElementById('dialogue-text').textContent = npc.relation === 0
    ? 'لسه بتتعرفوا على بعض. اختاري ردّك:'
    : 'أهلًا برجوعك! علاقتكم دلوقتي مستوى ' + npc.relation + '. اختاري هتتكلموا في إيه:';
  document.getElementById('dialogue-feedback').textContent = '';
  const choices = [
    { label: '👋 نسلّم ونتعرّف على بعض', reply: 'تشرفت بمعرفتك! مبسوطة إننا اتكلمنا 😊', relation: 1, joy: 5 },
    { label: '🌷 نسأل عن الأماكن الحلوة في الحي', reply: 'لازم تزوري الحديقة، مكان لطيف نقضي فيه وقت حلو!', relation: 1, joy: 3, parkTip: true },
    { label: '🎨 نحكي عن الهوايات والاهتمامات', reply: 'جميل إن عندنا اهتمامات مختلفة! خلينا نتكلم تاني قريبًا ✨', relation: 2, joy: 4 }
  ];
  const list = document.getElementById('dialogue-choices');
  list.replaceChildren();
  for (const choice of choices) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'dialogue-choice';
    button.textContent = choice.label;
    button.addEventListener('click', () => {
      npc.relation += choice.relation;
      happiness = Math.min(100, happiness + choice.joy);
      updateStats();
      completeQuest('friend');
      if (choice.parkTip) {
        document.getElementById('dialogue-feedback').textContent = choice.reply;
      } else {
        document.getElementById('dialogue-feedback').textContent = choice.reply;
      }
      say('اتكلمتِ مع ' + npc.name + ' 💬 مستوى العلاقة: ' + npc.relation);
      for (const button of list.querySelectorAll('button')) button.disabled = true;
      const closeButton = document.getElementById('close-dialogue');
      closeButton.focus();
    });
    list.appendChild(button);
  }
  panel.hidden = false;
}

function nearestTarget() {
  const p = player.getPosition();
  let best = null;
  let bestDistance = Infinity;
  for (const place of places) {
    const d = Math.hypot(p.x - place.x, p.z - place.z);
    if (d < place.radius && d < bestDistance) { best = { ...place, distance: d }; bestDistance = d; }
  }
  for (const npc of npcs) {
    const d = Math.hypot(p.x - npc.x, p.z - npc.z);
    if (d < 2.7 && d < bestDistance) {
      best = { name: npc.name, distance: d, action: () => showDialogue(npc) };
      bestDistance = d;
    }
  }
  return best;
}
interactButton.addEventListener('click', () => {
  const target = nearestTarget();
  if (target) target.action();
  else say('اقتربي من شخصية أو البيت أو المتجر أو الحديقة، ثم اضغطي «تفاعل / استكشاف».');
});

const pressed = new Set();
const keyMap = {
  ArrowUp: 'up', KeyW: 'up', ArrowDown: 'down', KeyS: 'down',
  ArrowLeft: 'left', KeyA: 'left', ArrowRight: 'right', KeyD: 'right'
};
window.addEventListener('keydown', e => {
  if (keyMap[e.code]) { pressed.add(keyMap[e.code]); e.preventDefault(); }
  if (e.code === 'Space' || e.code === 'Enter') { interactButton.click(); e.preventDefault(); }
});
window.addEventListener('keyup', e => { if (keyMap[e.code]) pressed.delete(keyMap[e.code]); });
window.addEventListener('blur', () => pressed.clear());
document.querySelectorAll('[data-dir]').forEach(button => {
  const dir = button.dataset.dir;
  const release = e => { pressed.delete(dir); if (e) e.preventDefault(); };
  button.addEventListener('pointerdown', e => {
    pressed.add(dir);
    button.setPointerCapture?.(e.pointerId);
    e.preventDefault();
  });
  button.addEventListener('pointerup', release);
  button.addEventListener('pointercancel', release);
  button.addEventListener('lostpointercapture', release);
});

const moveSpeed = 4.2;
let walkClock = 0;
let cameraX = 0;
let cameraZ = 12.5;
app.on('update', dt => {
  // Smooth, normalized movement and a small walk cycle for the temporary avatar.
  let x = (pressed.has('right') ? 1 : 0) - (pressed.has('left') ? 1 : 0);
  let z = (pressed.has('down') ? 1 : 0) - (pressed.has('up') ? 1 : 0);
  const length = Math.hypot(x, z);
  const moving = length > 0;
  if (moving) {
    x /= length; z /= length;
    player.translate(x * moveSpeed * dt, 0, z * moveSpeed * dt);
    walkClock += dt * 9;
    player.setEulerAngles(0, Math.atan2(x, z) * 180 / Math.PI, 0);
    const swing = Math.sin(walkClock) * 24;
    player.leftArm.setLocalEulerAngles(swing, 0, 0);
    player.rightArm.setLocalEulerAngles(-swing, 0, 0);
    player.bodyPart.setLocalPosition(0, 0.95 + Math.abs(Math.sin(walkClock * 2)) * 0.055, 0);
  } else {
    player.leftArm.setLocalEulerAngles(0, 0, 0);
    player.rightArm.setLocalEulerAngles(0, 0, 0);
    player.bodyPart.setLocalPosition(0, 0.95, 0);
  }

  const p = player.getPosition();
  p.x = Math.max(-21, Math.min(21, p.x));
  p.z = Math.max(-21, Math.min(21, p.z));
  player.setPosition(p);

  // Ease the camera toward the player instead of snapping on every frame.
  const follow = 1 - Math.exp(-5 * dt);
  cameraX += (p.x - cameraX) * follow;
  cameraZ += (p.z + 11 - cameraZ) * follow;
  camera.setPosition(cameraX, 7, cameraZ);
  camera.lookAt(p.x, 1, p.z);
});

restoreEquippedItems();
updateQuestUI();
updateStats();
try {
  const today = new Date().toLocaleDateString('en-CA');
  const rewardKey = 'wonderworld-last-daily-reward';
  if (localStorage.getItem(rewardKey) !== today) {
    coins += 5;
    localStorage.setItem(rewardKey, today);
    say('🎁 هدية دخول اليوم: 5 عملات جديدة! استكشفي الحي وجربي الكافيه والشغل.');
  }
} catch (_) {}
updateStats();
status.textContent = 'WonderWorld prototype ready — تحرّكي واستكشفي الحي';
