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
  { name: 'ليلى', role: 'جارة', personality: 'اجتماعية وبتحب مساعدة الجيران', favorite: 'الحديقة والزهور', greeting: 'أهلًا! أنا ليلى، بحب أتعرف على جيراني وأساعدهم.', topics: [
    { label: '🌼 نخطط لزيارة الحديقة', reply: 'فكرة جميلة! ممكن نتمشى بين الزهور ونختار ركننا المفضل.', relation: 1, joy: 4, parkTip: true },
    { label: '🤝 أطلب منها نصيحة للجيران', reply: 'أحلى حاجة في الحي إننا نساعد بعض ونحترم اختلافنا.', relation: 2, joy: 5 },
    { label: '🌷 أحكيلها عن زهرة بحبها', reply: 'اختيار جميل! كل زهرة ليها لون وحكاية مختلفة.', relation: 1, joy: 3 }
  ], entity: makePerson('Layla', -3, 3, mats.npcPink), relation: 0, x: -3, z: 3 },
  { name: 'آدم', role: 'صديق جديد', personality: 'مرح وبيحب الألغاز والتحديات', favorite: 'الألغاز والألعاب', greeting: 'أهلًا! أنا آدم، عندك استعداد لتحدي لطيف أو لعبة جديدة؟', topics: [
    { label: '🧩 نتكلم عن الألغاز', reply: 'أنا بحب اللغز اللي يخلينا نفكر بهدوء! جربنا نحل واحد سوا قريبًا.', relation: 2, joy: 4 },
    { label: '🎮 نختار لعبة صغيرة', reply: 'اختيار رائع! الألعاب أحلى لما تكون ممتعة وعادلة للجميع.', relation: 1, joy: 5 },
    { label: '🏆 نتكلم عن التحديات', reply: 'المهم نستمتع ونتعلم، مش لازم نكسب كل مرة.', relation: 1, joy: 3 }
  ], entity: makePerson('Adam', 3, -3, mats.npcBlue), relation: 0, x: 3, z: -3 },
  { name: 'نور', role: 'من سكان الحي', personality: 'هادية وبتحب الفن والطبيعة', favorite: 'الرسم والحديقة', greeting: 'أهلًا بيكي! أنا نور، بحب الفن والأماكن الهادية في الحي.', topics: [
    { label: '🎨 نتكلم عن الرسم', reply: 'كل شخص بيعبر عن نفسه بطريقة مختلفة، وده اللي بيخلي الفن مميز.', relation: 2, joy: 4 },
    { label: '🌳 نختار مكان هادي', reply: 'بحب الأماكن اللي نقدر فيها نرتاح ونلاحظ جمال الطبيعة.', relation: 1, joy: 3, parkTip: true },
    { label: '💡 نتبادل أفكار إبداعية', reply: 'ممكن نجرب نرسم حاجة شفناها في الحي ونضيف لمستنا الخاصة.', relation: 1, joy: 5 }
  ], entity: makePerson('Nour', -9, 2, mats.npcGold), relation: 0, x: -9, z: 2 }
];

const camera = new Entity('Follow Camera');
camera.addComponent('camera', { clearColor: new Color(0.53, 0.79, 0.96), fov: 60, farClip: 200 });
camera.setPosition(0, 7, 11);
camera.lookAt(0, 1, 0);
app.root.addChild(camera);

// First enterable home interior: a separate room scene, reversible without deleting the outdoor world.
const interiorRoot = new Entity('Home Interior Scene');
app.root.addChild(interiorRoot);
box('Interior floor', 14, 0.25, 14, 0, -0.16, 0, mats.path, interiorRoot);
box('Interior back wall', 14, 4.8, 0.3, 0, 2.25, -7, mats.wall, interiorRoot);
box('Interior left wall', 0.3, 4.8, 14, -7, 2.25, 0, mats.white, interiorRoot);
box('Interior right wall', 0.3, 4.8, 14, 7, 2.25, 0, mats.white, interiorRoot);
// Split front wall leaves a visible doorway so the room reads as a space rather than a closed box.
box('Interior front wall left', 4.8, 4.8, 0.3, -4.6, 2.25, 7, mats.wallPink, interiorRoot);
box('Interior front wall right', 4.8, 4.8, 0.3, 4.6, 2.25, 7, mats.wallPink, interiorRoot);
box('Interior door frame left', 0.22, 2.5, 0.35, -2.1, 1.25, 7, mats.door, interiorRoot);
box('Interior door frame right', 0.22, 2.5, 0.35, 2.1, 1.25, 7, mats.door, interiorRoot);
box('Interior rug', 5.2, 0.08, 3.8, 0, 0.02, 1.1, mats.flower, interiorRoot);
box('Living room sofa base', 4.0, 0.65, 1.1, -3.7, 0.45, -1.2, mats.outfitMint, interiorRoot);
box('Living room sofa back', 4.0, 1.25, 0.35, -3.7, 0.95, -0.75, mats.outfitMint, interiorRoot);
box('Coffee table', 2.0, 0.25, 1.2, -1.0, 0.48, -1.0, mats.bench, interiorRoot);
box('Coffee table book', 0.65, 0.06, 0.45, -1.0, 0.64, -1.0, mats.white, interiorRoot);
box('Bedroom bed base', 3.0, 0.45, 4.0, 3.8, 0.35, -3.1, mats.outfitBlue, interiorRoot);
box('Bedroom pillow', 2.1, 0.2, 0.8, 3.8, 0.69, -4.45, mats.white, interiorRoot);
box('Bedroom blanket', 2.9, 0.12, 2.2, 3.8, 0.63, -2.4, mats.outfitCoral, interiorRoot);
box('Bedside table', 0.9, 0.8, 0.9, 5.4, 0.4, -4.8, mats.bench, interiorRoot);
box('Kitchen counter', 3.2, 0.35, 1.0, -3.8, 1.0, -5.4, mats.white, interiorRoot);
box('Kitchen lower cabinets', 3.2, 0.8, 0.9, -3.8, 0.4, -5.4, mats.outfitMint, interiorRoot);
box('Kitchen window', 2.0, 1.2, 0.12, -3.8, 2.65, -6.76, mats.window, interiorRoot);
box('Wall picture frame', 1.6, 1.2, 0.12, 0.0, 2.65, -6.78, mats.outfitGold, interiorRoot);
box('Wall picture art', 1.25, 0.85, 0.06, 0.0, 2.65, -6.68, mats.flower, interiorRoot);
interiorRoot.enabled = false;
let indoors = false;
let indoorReturnPosition = null;
let outdoorEnabledStates = new Map();
function enterHome(homeName) {
  if (indoors) return;
  const position = player.getPosition();
  indoorReturnPosition = new Vec3(position.x, position.y, position.z);
  outdoorEnabledStates = new Map();
  for (const entity of app.root.children) {
    if (entity === player || entity === camera || entity === sun || entity === interiorRoot) continue;
    outdoorEnabledStates.set(entity, entity.enabled);
    entity.enabled = false;
  }
  interiorRoot.enabled = true;
  indoors = true;
  player.setPosition(0, 0, 2.0);
  player.setEulerAngles(0, 180, 0);
  cameraX = 0;
  cameraZ = 6.0;
  cameraHeight = 5.5;
  cameraOffsetZ = 4.0;
  camera.setPosition(cameraX, cameraHeight, cameraZ);
  camera.lookAt(0, 1, 2);
  document.getElementById('exit-home').hidden = false;
  say('دخلتي ' + homeName + ' 🏡 استكشفي الصالة وغرفة النوم والمطبخ. تقدري ترجعي للحي من زر الخروج.');
}
function exitHome() {
  if (!indoors) return;
  interiorRoot.enabled = false;
  for (const [entity, enabled] of outdoorEnabledStates) entity.enabled = enabled;
  outdoorEnabledStates.clear();
  indoors = false;
  if (indoorReturnPosition) player.setPosition(indoorReturnPosition);
  cameraHeight = 7;
  cameraOffsetZ = 11;
  const p = player.getPosition();
  cameraX = p.x;
  cameraZ = p.z + cameraOffsetZ;
  camera.setPosition(cameraX, cameraHeight, cameraZ);
  camera.lookAt(p.x, 1, p.z);
  document.getElementById('exit-home').hidden = true;
  say('رجعتي للحي 🌳 كل الأماكن والأنشطة الخارجية رجعت زي ما كانت.');
}

const ui = document.createElement('section');
ui.id = 'life-ui';
ui.innerHTML = `
  <div class="life-stats"><span>💛 السعادة: <b id="happiness">60</b></span><span>⚡ الطاقة: <b id="energy">80</b></span><span>🪙 العملات: <b id="coins">20</b></span><span>🌷 الزهور: <b id="flowers">0</b></span><span>📸 الذكريات: <b id="photo-memories">0</b></span><span>⭐ المستوى: <b id="player-level">1</b></span></div>
  <div id="xp-panel" aria-label="تقدم الخبرة"><div class="xp-label"><span>خبرة اللاعب</span><span id="xp-count">0 / 100 XP</span></div><div id="xp-track" role="progressbar" aria-label="التقدم للمستوى التالي" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><span id="xp-fill"></span></div></div>
  <div class="avatar-tools"><button id="change-outfit" type="button">👕 تغيير الملابس</button><button id="change-hair" type="button">💇 تغيير لون الشعر</button></div>
  <button id="open-shop" type="button">🛍️ افتحي متجر Wonder</button>
  <button id="open-pets" type="button">🐾 حيواناتي الأليفة</button>
  <button id="open-achievements" type="button">🏅 إنجازاتي وتقدمي</button>
  <button id="open-map" type="button">🗺️ خريطة الحي والتنقّل</button>
  <button id="open-journal" type="button">📔 سجل مغامراتي</button>
  <div class="avatar-tools"><button id="open-puzzle" type="button">🧩 ألغاز سريعة</button></div>
  <div class="avatar-tools"><button id="open-blockblast" type="button">🟦 Block Blast</button></div>
  <div class="avatar-tools"><button id="open-watersort" type="button">🧪 Water Sort</button></div>
  <div class="avatar-tools"><button id="quick-work" type="button">💼 شغل سريع</button><button id="quick-rest" type="button">🛋️ استراحة</button><button id="quick-cafe" type="button">☕ طلب كافيه</button></div>
  <div class="avatar-tools"><button id="quick-gym" type="button">🏋️ تمرين</button><button id="quick-garden" type="button">🌷 جمع زهور</button></div>
  <div class="avatar-tools"><button id="quick-photo" type="button">📸 تصوير ذكرى</button><button id="quick-weather" type="button">🌤️ تغيير الطقس</button></div>
  <div id="world-clock" role="status">🕒 نهار هادئ</div>
  <button id="interact" type="button">تفاعل / استكشاف</button>
  <button id="exit-home" type="button" hidden>🚪 الخروج للحي</button>
  <section id="shop-panel" hidden aria-label="متجر Wonder">
    <div class="shop-heading"><strong>🛍️ متجر Wonder</strong><button id="close-shop" type="button" aria-label="إغلاق المتجر">✕</button></div>
    <p class="shop-intro">اختاري قطعة، واشتريها بعملاتك، وبعدها تقدري تلبسيها في أي وقت.</p>
    <div id="shop-products"></div>
    <div id="shop-feedback" role="status"></div>
  </section>
  <section id="pet-panel" hidden aria-label="الحيوانات الأليفة">
    <div class="shop-heading"><strong>🐾 حيوانات Wonder</strong><button id="close-pets" type="button" aria-label="إغلاق الحيوانات">✕</button></div>
    <p class="pet-intro">تبنّي حيوانك، اختاريه رفيقًا ليكي، واهتمي بيه. الرعاية الأساسية مجانية دائمًا.</p>
    <div id="pet-active-summary" role="status"></div><div id="pet-catalog"></div>
    <div id="pet-naming-tools" class="pet-naming-tools"><label for="pet-name-input">اسم رفيقك</label><div><input id="pet-name-input" maxlength="18" placeholder="اكتبي اسمًا لطيفًا" autocomplete="off"><button id="save-pet-name" type="button">حفظ الاسم</button></div></div>
    <div id="pet-care" hidden><h3>رعاية رفيقك 🧡</h3><div id="pet-needs"></div>
      <div class="pet-care-actions"><button id="pet-feed" type="button">🥣 أكل</button><button id="pet-water" type="button">💧 مياه</button><button id="pet-play" type="button">🎾 لعب</button><button id="pet-groom" type="button">🧼 تنظيف</button><button id="pet-rest" type="button">🛏️ راحة</button></div>
    </div>
    <div id="pet-feedback" role="status"></div>
    <section id="pet-supplies-section"><h3>🛍️ مستلزمات اختيارية</h3><p class="pet-intro">الرعاية الأساسية تفضل مجانية. المستلزمات الإضافية اختيارية وبأسعار واضحة.</p><div id="pet-supplies-catalog"></div><h4>🎒 شنطة المستلزمات</h4><div id="pet-supplies-inventory"></div><div class="pet-care-actions"><button id="pet-use-food" type="button">استخدام وجبة</button><button id="pet-use-toy" type="button">استخدام لعبة</button><button id="pet-use-bed" type="button">استخدام سرير</button></div><button id="pet-park-activity" type="button">🌳 نشاط مع رفيقي في الحديقة</button></section>
    <p class="pet-premium-note">⭐ الحيوانات المميزة بفلوس حقيقية: هتتوفر لاحقًا فقط من خلال دفع آمن وأسعار واضحة. الشراء الحقيقي مش مفعّل في النموذج الحالي.</p>
  </section>
  <section id="achievement-panel" hidden aria-label="إنجازاتي في WonderWorld">
    <div class="shop-heading"><strong>🏅 إنجازاتي وتقدمي</strong><button id="close-achievements" type="button" aria-label="إغلاق الإنجازات">✕</button></div>
    <p id="achievement-summary" role="status"></p><div id="achievement-list"></div>
  </section>
  <section id="map-panel" hidden aria-label="خريطة الحي">
    <div class="shop-heading"><strong>🗺️ خريطة WonderWorld</strong><button id="close-map" type="button" aria-label="إغلاق الخريطة">✕</button></div>
    <p class="shop-intro">اختاري مكانًا للانتقال السريع. التنقّل متاح خارج البيوت فقط.</p><div id="map-destinations"></div><p id="map-feedback" role="status"></p>
  </section>
  <section id="journal-panel" hidden aria-label="سجل مغامراتي">
    <div class="shop-heading"><strong>📔 سجل مغامراتي</strong><button id="close-journal" type="button" aria-label="إغلاق السجل">✕</button></div><p id="journal-summary" class="shop-intro"></p><div id="journal-list"></div>
  </section>
  <section id="puzzle-panel" hidden aria-label="لعبة ألغاز">
    <div class="shop-heading"><strong>🧩 تحدّي الألغاز</strong><button id="close-puzzle" type="button" aria-label="إغلاق الألغاز">✕</button></div>
    <p id="puzzle-question">اختاري إجابة اللغز.</p>
    <div id="puzzle-choices"></div>
    <div id="puzzle-feedback" role="status"></div>
    <button id="next-puzzle" type="button" hidden>لغز جديد</button>
  </section>
  <section id="blockblast-panel" hidden aria-label="لعبة بلوك بلاست">
    <div class="shop-heading"><strong>🧩 Block Blast</strong><button id="close-blockblast" type="button" aria-label="إغلاق اللعبة">✕</button></div>
    <p class="blockblast-help">اختاري قطعة من الأسفل، ثم اضغطي على الخانة التي تريدين وضعها فيها. اكملي صفًا أو عمودًا لمسحه.</p>
    <div class="blockblast-score"><span>النقاط: <b id="blockblast-score">0</b></span><span>أفضل نتيجة: <b id="blockblast-best">0</b></span></div>
    <div id="blockblast-board" role="group" aria-label="لوحة اللعب 8 في 8"></div>
    <div id="blockblast-pieces" aria-label="القطع المتاحة"></div>
    <p id="blockblast-feedback" role="status">اختاري قطعة للبدء.</p>
    <button id="blockblast-restart" type="button">🔄 لعبة جديدة</button>
  </section>
  <section id="watersort-panel" hidden aria-label="لعبة فرز الألوان">
    <div class="shop-heading"><strong>🧪 Water Sort</strong><button id="close-watersort" type="button" aria-label="إغلاق اللعبة">✕</button></div>
    <p class="watersort-help">اختاري أنبوبة، ثم أنبوبة تانية لنقل اللون العلوي. رتّبي كل لون في أنبوبة منفصلة.</p>
    <div class="watersort-score"><span>الحركات: <b id="watersort-moves">0</b></span><span>الأنابيب المكتملة: <b id="watersort-progress">0/4</b></span></div>
    <div id="watersort-tubes" aria-label="أنابيب الألوان"></div>
    <p id="watersort-feedback" role="status">اختاري أنبوبة للبدء.</p>
    <button id="watersort-restart" type="button">🔄 لغز جديد</button>
  </section>
  <section id="dialogue-panel" hidden aria-label="اختيارات الحوار">
    <div class="shop-heading"><strong id="dialogue-title">حوار</strong><button id="close-dialogue" type="button" aria-label="إغلاق الحوار">✕</button></div>
    <p id="dialogue-text">اختاري ردًا مناسبًا.</p>
    <div id="relationship-meter" class="relationship-meter" aria-live="polite">
      <div class="relationship-label"><span id="relationship-level">معارف جدد</span><span id="relationship-points">0 / 10</span></div>
      <div class="relationship-track" role="progressbar" aria-label="مستوى العلاقة" aria-valuemin="0" aria-valuemax="10" aria-valuenow="0"><span id="relationship-fill"></span></div>
      <p id="character-details"></p>
    </div>
    <div id="dialogue-choices"></div>
    <div id="dialogue-feedback" role="status"></div>
  </section>
  <div id="life-message" role="status">أهلًا بكِ في WonderWorld! تحرّكي واستكشفي الحي.</div>
  <div id="life-goal">مهمتك: تعرّفي على شخص، ثم زوري المتجر والحديقة.</div>
`;
document.getElementById('game').appendChild(ui);

// Keep menus independent from the HUD's scroll area so they can never be clipped by it.
for (const panelId of ['shop-panel', 'pet-panel', 'achievement-panel', 'map-panel', 'journal-panel', 'puzzle-panel', 'blockblast-panel', 'watersort-panel', 'dialogue-panel']) {
  const panel = document.getElementById(panelId);
  if (panel) {
    panel.classList.add('wonder-overlay');
    document.body.appendChild(panel);
  }
}

// Compact action dock: show only status and the two essential controls until requested.
const actionToggle = document.createElement('button');
actionToggle.id = 'toggle-actions';
actionToggle.type = 'button';
actionToggle.setAttribute('aria-expanded', 'false');
actionToggle.textContent = '☰ الأنشطة والخيارات';
ui.insertBefore(actionToggle, document.getElementById('xp-panel'));
ui.classList.add('actions-collapsed');
actionToggle.addEventListener('click', () => {
  const expanded = ui.classList.toggle('actions-expanded');
  ui.classList.toggle('actions-collapsed', !expanded);
  actionToggle.setAttribute('aria-expanded', String(expanded));
  actionToggle.textContent = expanded ? '✕ إخفاء الأنشطة' : '☰ الأنشطة والخيارات';
});
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
let playerLevel = 1;
let playerXP = 0;
function xpNeededForNextLevel() { return 100 + (playerLevel - 1) * 25; }
function updateXPUI() {
  const needed = xpNeededForNextLevel();
  document.getElementById('player-level').textContent = playerLevel;
  document.getElementById('xp-count').textContent = playerXP + ' / ' + needed + ' XP';
  document.getElementById('xp-fill').style.width = Math.min(100, playerXP / needed * 100) + '%';
  document.getElementById('xp-track').setAttribute('aria-valuenow', String(Math.min(100, Math.round(playerXP / needed * 100))));
}
function awardXP(amount) {
  if (!Number.isFinite(amount) || amount <= 0) return;
  playerXP += amount;
  let leveledUp = false;
  while (playerXP >= xpNeededForNextLevel()) {
    playerXP -= xpNeededForNextLevel();
    playerLevel += 1;
    coins += 10;
    happiness = Math.min(100, happiness + 2);
    leveledUp = true;
  }
  updateStats();
  updateXPUI();
  if (leveledUp) say('🎉 مبروك! وصلتي للمستوى ' + playerLevel + '، وخدتي 10 عملات و+2 سعادة كمكافأة مستوى.');
}
let lastWorkAt = 0;
let lastWorkoutAt = 0;
let gardenFlowers = 0;
let lastFlowerDay = "";
let photoMemories = 0;
let lastPhotoDay = "";
let adventureLog = [];
let puzzleCooldownUntil = 0;
let currentPuzzle = null;
const ownedItems = new Set(['default-outfit', 'default-hair']);
const petCatalog = [
 {id:'wonder-dog',name:'كلب صغير',kind:'dog',emoji:'🐶',price:0,tier:'مجاني — تبنّي'},
 {id:'wonder-cat',name:'قطة لطيفة',kind:'cat',emoji:'🐱',price:12,tier:'12 عملة افتراضية'},
 {id:'wonder-rabbit',name:'أرنب صغير',kind:'rabbit',emoji:'🐰',price:18,tier:'18 عملة افتراضية'}
];
let ownedPets=[]; let activePetId=null; let petCareState={}; let petCompanionEntity=null; let petNames={};
let petSupplies={food:0,toy:0,bed:0,collar:0};
const petSupplyCatalog=[
 {id:'food',name:'وجبة إضافية',emoji:'🥣',price:3,description:'ترفع الشبع 25 نقطة عند الاستخدام.'},
 {id:'toy',name:'لعبة للحيوان',emoji:'🎾',price:5,description:'تزود المرح 25 نقطة وتزيد الرابطة.'},
 {id:'bed',name:'سرير مريح',emoji:'🛏️',price:8,description:'وقت راحة لطيف يرفع المرح 15 نقطة.'},
 {id:'collar',name:'طوق ملوّن',emoji:'🎀',price:6,description:'إضافة تجميلية للمقتنيات؛ الاستخدام التجميلي الكامل لاحقًا.'}
];
const npcInteractionDates = {};
const dailyQuests = { friend: false, park: false, shop: false, flowers: false, rewarded: false };
function localDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
const todayQuestKey = localDateKey();
let questDate = todayQuestKey;
const equippedItems = { outfit: 'default-outfit', hair: 'default-hair' };
let loadedProgress = null;
function say(text) { message.textContent = text; status.textContent = text; }
function logAdventure(text) {
 adventureLog.unshift({text:String(text).slice(0,120),date:new Date().toLocaleString('ar-EG',{dateStyle:'short',timeStyle:'short'})}); adventureLog=adventureLog.slice(0,30); saveProgress(); renderJournal();
}
function renderJournal() {
 const list=document.getElementById('journal-list'),summary=document.getElementById('journal-summary'); if(!list||!summary)return;
 summary.textContent='سجلّك فيه '+adventureLog.length+' نشاطًا. آخر 30 نشاطًا محفوظة على الجهاز ده.';list.replaceChildren();
 if(!adventureLog.length){const p=document.createElement('p');p.className='journal-empty';p.textContent='لسه مفيش مغامرات مسجلة. اختاري مكانًا من الخريطة أو سجّلي ذكرى عند النافورة.';list.appendChild(p);return;}
 for(const item of adventureLog){const card=document.createElement('article');card.className='journal-entry';const title=document.createElement('strong');title.textContent=item.text;const time=document.createElement('time');time.textContent=item.date;card.append(title,time);list.appendChild(card);}
}
function renderNeighborhoodMap() {
 const list=document.getElementById('map-destinations');if(!list)return;list.replaceChildren();
 const destinations=[{name:'نافورة الساحة',emoji:'⛲',x:0,z:3},{name:'حديقة الأصدقاء',emoji:'🌳',x:-11,z:5.5},{name:'متجر Wonder',emoji:'🛍️',x:10,z:4.5},{name:'كافيه Wonder',emoji:'☕',x:15,z:-4},{name:'مكتب الحي',emoji:'💼',x:0,z:-20},{name:'Wonder Fitness',emoji:'🏋️',x:15,z:-19},{name:'البيت الأول',emoji:'🏡',x:-10,z:-6.2},{name:'البيت العائلي',emoji:'🏠',x:10,z:-6.2}];
 for(const d of destinations){const b=document.createElement('button');b.type='button';b.className='map-destination';b.textContent=d.emoji+' '+d.name;b.addEventListener('click',()=>{if(indoors){document.getElementById('map-feedback').textContent='اخرجي للحي الأول قبل التنقّل السريع.';return;}player.setPosition(d.x,0,d.z);cameraX=d.x;cameraZ=d.z+cameraOffsetZ;camera.setPosition(cameraX,cameraHeight,cameraZ);camera.lookAt(d.x,1,d.z);document.getElementById('map-panel').hidden=true;logAdventure('وصلت إلى '+d.name);say('🗺️ وصلتي إلى '+d.name+'!');});list.appendChild(b);}
}

function renderAchievementPanel() {
  const list = document.getElementById('achievement-list');
  const summary = document.getElementById('achievement-summary');
  if (!list || !summary) return;
  const definitions = [
    { emoji:'🤝', name:'صديقة الحي', detail:'ابدئي صداقة مع واحدة من الشخصيات', done:npcs.some(npc=>npc.relation>=1) },
    { emoji:'🐾', name:'رفيق وفيّ', detail:'تبنّي أول حيوان أليف', done:ownedPets.length>=1 },
    { emoji:'🌷', name:'محبة الطبيعة', detail:'اجمعي 3 زهور أو أكثر', done:gardenFlowers>=3 },
    { emoji:'📸', name:'صانعة الذكريات', detail:'سجّلي أول ذكرى عند النافورة', done:photoMemories>=1 },
    { emoji:'⭐', name:'نجمة صاعدة', detail:'وصلي للمستوى 3', done:playerLevel>=3 }
  ];
  const unlocked=definitions.filter(item=>item.done).length;
  summary.textContent='فتحتي '+unlocked+' من '+definitions.length+' إنجازات. كمّلي استكشاف العالم لفتح الباقي!';
  list.replaceChildren();
  for(const item of definitions){
    const card=document.createElement('div');card.className='achievement-card'+(item.done?' is-unlocked':'');
    const icon=document.createElement('span');icon.className='achievement-icon';icon.textContent=item.done?item.emoji:'🔒';
    const body=document.createElement('div');body.className='achievement-info';
    const title=document.createElement('strong');title.textContent=item.name;
    const detail=document.createElement('span');detail.textContent=item.detail;
    const status=document.createElement('b');status.textContent=item.done?'تم الفتح ✓':'لسه مقفول';
    body.append(title,detail,status);card.append(icon,body);list.appendChild(card);
  }
}
function updateStats() {
  document.getElementById('happiness').textContent = happiness;
  document.getElementById('energy').textContent = energy;
  document.getElementById('coins').textContent = coins;
  document.getElementById('flowers').textContent = gardenFlowers;
  document.getElementById('photo-memories').textContent = photoMemories;
  updateXPUI();
  renderAchievementPanel();
  saveProgress();
}
function updateQuestUI() {
  const line = document.getElementById('life-goal');
  const mark = done => done ? '✅' : '⬜';
  line.textContent = `مهام اليوم: ${mark(dailyQuests.friend)} تعرّفي على جار • ${mark(dailyQuests.park)} زوري الحديقة • ${mark(dailyQuests.shop)} اشتري من المتجر • ${mark(dailyQuests.flowers)} اجمعي الزهور`;
  if (dailyQuests.friend && dailyQuests.park && dailyQuests.shop && dailyQuests.flowers && !dailyQuests.rewarded) {
    dailyQuests.rewarded = true;
    coins += 15;
    happiness = Math.min(100, happiness + 10);
    updateStats();
    say('برافو! خلّصتي كل مهام اليوم 🎉 مكافأة: 15 عملة و+10 سعادة.');
  }
}
function completeQuest(key) {
  if (!Object.prototype.hasOwnProperty.call(dailyQuests, key) || key === 'rewarded') return;
  dailyQuests[key] = true;
  updateQuestUI();
  saveProgress();
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
      coins, happiness, energy, playerLevel, playerXP, gardenFlowers, lastFlowerDay, photoMemories, lastPhotoDay, adventureLog: adventureLog.slice(-30), questDate, dailyQuests: { ...dailyQuests }, ownedItems: [...ownedItems],
      relationships: Object.fromEntries(npcs.map(npc => [npc.name, npc.relation])),
      npcInteractionDates,
      equippedItems, ownedPets:[...ownedPets], activePetId, petCareState, petSupplies, petNames
    }));
  } catch (_) {}
};
try {
  loadedProgress = JSON.parse(localStorage.getItem('wonderworld-save-v1') || 'null');
  if (loadedProgress) {
    if (Number.isFinite(loadedProgress.coins)) coins = Math.max(0, loadedProgress.coins);
    if (Number.isFinite(loadedProgress.happiness)) happiness = Math.max(0, Math.min(100, loadedProgress.happiness));
    if (Number.isFinite(loadedProgress.energy)) energy = Math.max(0, Math.min(100, loadedProgress.energy));
    if (Number.isFinite(loadedProgress.playerLevel)) playerLevel = Math.max(1, Math.floor(loadedProgress.playerLevel));
    if (Number.isFinite(loadedProgress.playerXP)) playerXP = Math.max(0, loadedProgress.playerXP);
    if (Number.isFinite(loadedProgress.gardenFlowers)) gardenFlowers = Math.max(0, loadedProgress.gardenFlowers);
    if (typeof loadedProgress.lastFlowerDay === 'string') lastFlowerDay = loadedProgress.lastFlowerDay;
    if (Number.isFinite(loadedProgress.photoMemories)) photoMemories = Math.max(0, Math.floor(loadedProgress.photoMemories));
    if (typeof loadedProgress.lastPhotoDay === 'string') lastPhotoDay = loadedProgress.lastPhotoDay;
    if (Array.isArray(loadedProgress.adventureLog)) adventureLog = loadedProgress.adventureLog.filter(item => item && typeof item.text === 'string' && typeof item.date === 'string').slice(-30);
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
        if (Number.isFinite(level)) npc.relation = Math.max(0, Math.min(10, level));
      }
    }
    if (loadedProgress.npcInteractionDates && typeof loadedProgress.npcInteractionDates === 'object') {
      for (const npc of npcs) {
        const date = loadedProgress.npcInteractionDates[npc.name];
        if (typeof date === 'string') npcInteractionDates[npc.name] = date;
      }
    }
    if (loadedProgress.equippedItems && typeof loadedProgress.equippedItems === 'object') {
      if (typeof loadedProgress.equippedItems.outfit === 'string') equippedItems.outfit = loadedProgress.equippedItems.outfit;
      if (typeof loadedProgress.equippedItems.hair === 'string') equippedItems.hair = loadedProgress.equippedItems.hair;
    }
    if (Array.isArray(loadedProgress.ownedPets)) ownedPets=[...new Set(loadedProgress.ownedPets.filter(id=>petCatalog.some(p=>p.id===id)))];
    if (typeof loadedProgress.activePetId==='string' && ownedPets.includes(loadedProgress.activePetId)) activePetId=loadedProgress.activePetId;
    if (loadedProgress.petNames && typeof loadedProgress.petNames==='object') for (const id of ownedPets) if (typeof loadedProgress.petNames[id] === 'string') petNames[id] = loadedProgress.petNames[id].slice(0,18);
    if (loadedProgress.petSupplies && typeof loadedProgress.petSupplies==='object') for(const key of Object.keys(petSupplies)) petSupplies[key]=Number.isFinite(loadedProgress.petSupplies[key])?Math.max(0,Math.floor(loadedProgress.petSupplies[key])):0;
    if (loadedProgress.petCareState && typeof loadedProgress.petCareState==='object') for(const id of ownedPets){
      const care=loadedProgress.petCareState[id]; if(care&&typeof care==='object') petCareState[id]={
        hunger:clampPetValue(care.hunger,60),thirst:clampPetValue(care.thirst,60),joy:clampPetValue(care.joy,50),
        cleanliness:clampPetValue(care.cleanliness,70),bond:clampPetValue(care.bond,0)};
    }
  }
} catch (_) { loadedProgress = null; }
function clampPetValue(v,f){return Number.isFinite(v)?Math.max(0,Math.min(100,Math.round(v))):f}
function ensurePetCare(id){if(!petCareState[id])petCareState[id]={hunger:60,thirst:60,joy:50,cleanliness:70,bond:0};return petCareState[id]}
function syncPetCompanion(){
 const pet=petCatalog.find(p=>p.id===activePetId&&ownedPets.includes(p.id));
 if(!pet){if(petCompanionEntity)petCompanionEntity.destroy();petCompanionEntity=null;return}
 if(petCompanionEntity&&petCompanionEntity.petId===pet.id)return;
 if(petCompanionEntity)petCompanionEntity.destroy();
 const root=new Entity('Pet companion: '+pet.name);root.petId=pet.id;root.setLocalPosition(-1,0,.8);player.addChild(root);
 const fur=pet.kind==='dog'?mats.bench:mats.white;
 sphere('Pet body',.58,0,.34,0,fur,root);sphere('Pet head',.43,0,.63,-.32,fur,root);
 sphere('Pet nose',.12,0,.61,-.69,mats.door,root);sphere('Pet left eye',.07,-.18,.73,-.63,mats.hairBlack,root);sphere('Pet right eye',.07,.18,.73,-.63,mats.hairBlack,root);
 for(const x of [-.22,.22])box('Pet leg',.16,.34,.17,x,.12,.03,fur,root);
 if(pet.kind==='cat'||pet.kind==='rabbit'){box('Pet left ear',.16,pet.kind==='rabbit'?.52:.34,.14,-.2,1,-.34,fur,root);box('Pet right ear',.16,pet.kind==='rabbit'?.52:.34,.14,.2,1,-.34,fur,root)}
 else{sphere('Pet left floppy ear',.22,-.34,.5,-.27,mats.trunk,root);sphere('Pet right floppy ear',.22,.34,.5,-.27,mats.trunk,root);sphere('Pet tail',.18,0,.43,.52,mats.trunk,root)}
 petCompanionEntity=root;
}
function renderPetPanel(){
 const catalog=document.getElementById('pet-catalog'),summary=document.getElementById('pet-active-summary'),carePanel=document.getElementById('pet-care'),needs=document.getElementById('pet-needs');
 const active=petCatalog.find(p=>p.id===activePetId&&ownedPets.includes(p.id));
 summary.textContent=active?active.emoji+' رفيقك الحالي: '+(petNames[active.id]||active.name)+' — بيتبعك في العالم. اختاري رعايته من تحت.':'لسه مفيش حيوان عندك. تقدري تبدأي بتبنّي كلب صغير مجانًا.';
 const petNameInput=document.getElementById('pet-name-input'); if(petNameInput) petNameInput.value=active?(petNames[active.id]||active.name):'';
 const naming=document.getElementById('pet-naming-tools'); if(naming) naming.hidden=!active;
 carePanel.hidden=!active;catalog.replaceChildren();
 for(const pet of petCatalog){
  const card=document.createElement('div');card.className='pet-card';const info=document.createElement('div');info.className='pet-card-info';
  const name=document.createElement('strong');name.textContent=pet.emoji+' '+pet.name;const tier=document.createElement('span');tier.textContent=pet.tier;info.append(name,tier);
  const button=document.createElement('button');button.type='button';
  if(ownedPets.includes(pet.id)){button.textContent=activePetId===pet.id?'رفيقي الحالي ✓':'اختاريه رفيقًا';button.disabled=activePetId===pet.id;button.addEventListener('click',()=>{activePetId=pet.id;ensurePetCare(pet.id);syncPetCompanion();renderPetPanel();saveProgress();document.getElementById('pet-feedback').textContent=pet.name+' بقى رفيقك دلوقتي 🐾'})}
  else{button.textContent=pet.price===0?'تبنّي مجانًا':'شراء بـ '+pet.price+' عملة';button.addEventListener('click',()=>{
    if(pet.price>coins){document.getElementById('pet-feedback').textContent='محتاجه '+pet.price+' عملة لشراء '+pet.name+'. تقدري تكملي اللعب وتجمعي عملات.';return}
    coins-=pet.price;ownedPets.push(pet.id);ensurePetCare(pet.id);activePetId=pet.id;syncPetCompanion();updateStats();renderPetPanel();saveProgress();awardXP(8);
    document.getElementById('pet-feedback').textContent=pet.price===0?'تم التبنّي مجانًا! '+pet.name+' بقى رفيقك 🐾':'مبروك! اشتريتي '+pet.name+' بالعملات الافتراضية وبقى رفيقك 🐾';
  })}
  card.append(info,button);catalog.appendChild(card)
 }
 if(active){const care=ensurePetCare(active.id);const labels=[['hunger','الشبع'],['thirst','الارتواء'],['joy','المرح'],['cleanliness','النظافة'],['bond','الرابطة']];needs.replaceChildren();
  for(const [key,label] of labels){const row=document.createElement('div');row.className='pet-need-row';const title=document.createElement('span');title.textContent=label;const meter=document.createElement('progress');meter.max=100;meter.value=care[key];meter.setAttribute('aria-label',label);const value=document.createElement('b');value.textContent=care[key]+'%';row.append(title,meter,value);needs.appendChild(row)}
 }
 renderPetSupplies();
}
function renderPetSupplies(){
 const catalog=document.getElementById('pet-supplies-catalog'),inventory=document.getElementById('pet-supplies-inventory');if(!catalog||!inventory)return;catalog.replaceChildren();inventory.replaceChildren();
 for(const item of petSupplyCatalog){const card=document.createElement('div');card.className='pet-card';const info=document.createElement('div');info.className='pet-card-info';const name=document.createElement('strong');name.textContent=item.emoji+' '+item.name;const desc=document.createElement('span');desc.textContent=item.description;const price=document.createElement('span');price.textContent='🪙 '+item.price+' عملات افتراضية';info.append(name,desc,price);const button=document.createElement('button');button.type='button';button.textContent='شراء';button.addEventListener('click',()=>buyPetSupply(item.id));card.append(info,button);catalog.appendChild(card)}
 for(const item of petSupplyCatalog){const row=document.createElement('div');row.className='pet-inventory-row';row.textContent=item.emoji+' '+item.name+': '+(petSupplies[item.id]||0);inventory.appendChild(row)}
 document.getElementById('pet-use-food').disabled=(petSupplies.food||0)<1;document.getElementById('pet-use-toy').disabled=(petSupplies.toy||0)<1;document.getElementById('pet-use-bed').disabled=(petSupplies.bed||0)<1;
}
function buyPetSupply(id){const item=petSupplyCatalog.find(x=>x.id===id);if(!item)return;if(coins<item.price){document.getElementById('pet-feedback').textContent='رصيدك مش كفاية. سعر '+item.name+' هو '+item.price+' عملات؛ الرعاية الأساسية مجانية ومستمرة.';return}coins-=item.price;petSupplies[id]=(petSupplies[id]||0)+1;updateStats();saveProgress();renderPetSupplies();document.getElementById('pet-feedback').textContent='اشتريتي '+item.name+'؛ بقت في شنطتك. تقدري تستخدميها وقت ما تحبي.';awardXP(2)}
function usePetSupply(id){const pet=petCatalog.find(p=>p.id===activePetId&&ownedPets.includes(p.id));if(!pet){document.getElementById('pet-feedback').textContent='تبنّي رفيقًا الأول عشان تستخدمي المستلزمات.';return}if((petSupplies[id]||0)<1){document.getElementById('pet-feedback').textContent='المستلزم ده مش موجود في شنطتك.';return}const care=ensurePetCare(pet.id);if(id==='food')care.hunger=Math.min(100,care.hunger+25);if(id==='toy'){care.joy=Math.min(100,care.joy+25);care.bond=Math.min(100,care.bond+5)}if(id==='bed')care.joy=Math.min(100,care.joy+15);petSupplies[id]--;renderPetPanel();document.getElementById('pet-feedback').textContent='استخدمتي '+petSupplyCatalog.find(x=>x.id===id).name+' مع '+pet.name+' 🐾';saveProgress();awardXP(3)}
function petParkActivity(){const pet=petCatalog.find(p=>p.id===activePetId&&ownedPets.includes(p.id));if(!pet){document.getElementById('pet-feedback').textContent='تبنّي حيوانًا واختاريه رفيقًا قبل نشاط الحديقة.';return}if(indoors){document.getElementById('pet-feedback').textContent='اخرجي للحي الأول وروحي حديقة الأصدقاء مع رفيقك.';return}const p=player.getPosition();if(Math.hypot(p.x+11,p.z-6.5)>7){document.getElementById('pet-feedback').textContent='النشاط ده في حديقة الأصدقاء 🌳 اتحركي ناحية الحديقة ومعاكي رفيقك.';return}const care=ensurePetCare(pet.id);care.joy=Math.min(100,care.joy+20);care.bond=Math.min(100,care.bond+8);happiness=Math.min(100,happiness+5);updateStats();renderPetPanel();awardXP(8);saveProgress();document.getElementById('pet-feedback').textContent='🌳 قضيتوا وقت ممتع في حديقة الأصدقاء! المرح +20 والرابطة +8 والسعادة +5. النشاط مجاني.'}
function careForActivePet(action){
 const pet=petCatalog.find(p=>p.id===activePetId&&ownedPets.includes(p.id));
 if(!pet){document.getElementById('pet-feedback').textContent='تبنّي حيوانًا أو اختاري رفيقًا الأول عشان تعتني بيه.';return}
 const care=ensurePetCare(pet.id),actions={feed:['hunger',20,'🥣 قدّمتي وجبة لـ'+pet.name+'.'],water:['thirst',20,'💧 قدّمتي مياه نظيفة لـ'+pet.name+'.'],play:['joy',18,'🎾 لعبتي مع '+pet.name+'، والمرح والرابطة زادوا!'],groom:['cleanliness',20,'🧼 اهتميتي بنظافة '+pet.name+'.'],rest:['joy',8,'🛏️ وفرتي وقت راحة هادي لـ'+pet.name+'.']};
 const [key,amount,feedback]=actions[action];care[key]=Math.min(100,care[key]+amount);care.bond=Math.min(100,care.bond+(action==='play'?8:2));
 renderPetPanel();document.getElementById('pet-feedback').textContent=feedback+' الرعاية الأساسية مجانية، ومفيش عقوبة لو خرجتي من اللعبة.';
 happiness=Math.min(100,happiness+(action==='play'?2:1));updateStats();awardXP(2);saveProgress()
}
document.getElementById('open-pets').addEventListener('click',()=>{document.getElementById('pet-panel').hidden=false;document.getElementById('pet-feedback').textContent='';renderPetPanel()});
document.getElementById('save-pet-name').addEventListener('click',()=>{
 if(!activePetId||!ownedPets.includes(activePetId)){document.getElementById('pet-feedback').textContent='تبنّي حيوانًا الأول عشان تختاري اسمه.';return}
 const input=document.getElementById('pet-name-input');const chosen=(input.value||'').trim().replace(/[<>]/g,'').slice(0,18);
 if(!chosen){document.getElementById('pet-feedback').textContent='اكتبي اسمًا من حرف إلى 18 حرفًا.';return}
 petNames[activePetId]=chosen;saveProgress();renderPetPanel();document.getElementById('pet-feedback').textContent='🐾 من النهارده اسم رفيقك '+chosen+'!';
});
document.getElementById('open-achievements').addEventListener('click',()=>{renderAchievementPanel();document.getElementById('achievement-panel').hidden=false});
document.getElementById('open-map').addEventListener('click',()=>{renderNeighborhoodMap();document.getElementById('map-feedback').textContent='اختاري وجهتك من القائمة.';document.getElementById('map-panel').hidden=false});
document.getElementById('close-map').addEventListener('click',()=>{document.getElementById('map-panel').hidden=true});
document.getElementById('open-journal').addEventListener('click',()=>{renderJournal();document.getElementById('journal-panel').hidden=false});
document.getElementById('close-journal').addEventListener('click',()=>{document.getElementById('journal-panel').hidden=true});
document.getElementById('close-achievements').addEventListener('click',()=>{document.getElementById('achievement-panel').hidden=true});
document.getElementById('close-pets').addEventListener('click',()=>{document.getElementById('pet-panel').hidden=true});
document.getElementById('pet-feed').addEventListener('click',()=>careForActivePet('feed'));
document.getElementById('pet-water').addEventListener('click',()=>careForActivePet('water'));
document.getElementById('pet-play').addEventListener('click',()=>careForActivePet('play'));
document.getElementById('pet-groom').addEventListener('click',()=>careForActivePet('groom'));
document.getElementById('pet-rest').addEventListener('click',()=>careForActivePet('rest'));
document.getElementById('pet-use-food').addEventListener('click',()=>usePetSupply('food'));
document.getElementById('pet-use-toy').addEventListener('click',()=>usePetSupply('toy'));
document.getElementById('pet-use-bed').addEventListener('click',()=>usePetSupply('bed'));
document.getElementById('pet-park-activity').addEventListener('click',petParkActivity);
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
  awardXP(12);
  saveProgress();
  completeQuest('shop');
  document.getElementById('shop-feedback').textContent = 'اشتريتي ' + item.name + ' واتضافت لمقتنياتك 🎉 الرصيد: ' + coins + ' عملة.';
  renderShop();
  say('مبروك! اشتريتي ' + item.name + ' من متجر Wonder 🛍️');
});
const places = [
  { name: 'بيتك', x: -10, z: -7.4, radius: 3.2, action: () => enterHome('بيتك') },
  { name: 'بيت العائلة', x: 10, z: -7.4, radius: 3.2, action: () => enterHome('بيت العائلة') },
  { name: 'متجر Wonder', x: 10, z: 7.1, radius: 3.5, action: openShop },
  { name: 'كافيه Wonder', x: 15, z: -3.2, radius: 4.0, action: orderCafe },
  { name: 'مكتب الحي', x: 0, z: -18.3, radius: 4.0, action: doQuickWork },
  { name: 'Wonder Fitness', x: 15, z: -18, radius: 4.5, action: doWorkout },
  { name: 'حديقة الأصدقاء', x: -11, z: 6.5, radius: 4.2, action: () => {
    happiness = Math.min(100, happiness + 12); updateStats(); awardXP(8); completeQuest('park'); saveProgress(); say('قضيتي وقتًا لطيفًا في الحديقة! السعادة +12 🌷');
  }},
  { name: 'نافورة الساحة — تصوير ذكرى', x: 0, z: 0, radius: 3.6, action: takePhotoMemory }
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
        awardXP(8);
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

// Block Blast mini-game: tap a piece, then tap a valid board cell.
const blockBlastSize = 8;
const blockBlastShapes = [
  [[0,0]], [[0,0],[0,1]], [[0,0],[1,0]], [[0,0],[0,1],[0,2]],
  [[0,0],[1,0],[2,0]], [[0,0],[0,1],[1,0],[1,1]],
  [[0,0],[1,0],[2,0],[2,1]], [[0,0],[0,1],[0,2],[1,1]],
  [[0,0],[0,1],[1,1],[1,2]], [[0,0],[1,0],[2,0],[3,0]],
  [[0,0],[0,1],[0,2],[0,3]], [[0,0],[1,0],[2,0],[0,1],[0,2]]
];
let blockBlastBoard = Array.from({length:blockBlastSize},()=>Array(blockBlastSize).fill(false));
let blockBlastPieces = [];
let blockBlastSelected = -1;
let blockBlastScore = 0;
let blockBlastBest = 0;
let blockBlastOver = false;
try { blockBlastBest = Math.max(0, Number(localStorage.getItem('wonderworld-blockblast-best')) || 0); } catch (_) {}
function blockBlastRandomShape() {
  const shape = blockBlastShapes[Math.floor(Math.random() * blockBlastShapes.length)];
  return shape.map(([r,c])=>[r,c]);
}
function blockBlastNewPieces() {
  blockBlastPieces = [blockBlastRandomShape(),blockBlastRandomShape(),blockBlastRandomShape()];
  blockBlastSelected = -1;
}
function blockBlastCanPlace(shape,row,col) {
  return shape.every(([dr,dc])=>{
    const r=row+dr,c=col+dc;
    return r>=0 && r<blockBlastSize && c>=0 && c<blockBlastSize && !blockBlastBoard[r][c];
  });
}
function blockBlastAnyMove() {
  return blockBlastPieces.some(shape=>shape && blockBlastBoard.some((line,r)=>line.some((_,c)=>blockBlastCanPlace(shape,r,c))));
}
function blockBlastRender() {
  const board=document.getElementById('blockblast-board');
  board.replaceChildren();
  for(let r=0;r<blockBlastSize;r++) for(let c=0;c<blockBlastSize;c++) {
    const cell=document.createElement('button');
    cell.type='button'; cell.className='blockblast-cell'+(blockBlastBoard[r][c]?' filled':'');
    cell.dataset.row=String(r); cell.dataset.col=String(c);
    cell.setAttribute('aria-label','صف '+(r+1)+' عمود '+(c+1)+(blockBlastBoard[r][c]?' مشغول':'فارغ'));
    cell.disabled=blockBlastOver;
    board.appendChild(cell);
  }
  const pieces=document.getElementById('blockblast-pieces');
  pieces.replaceChildren();
  blockBlastPieces.forEach((shape,index)=>{
    const button=document.createElement('button');
    button.type='button'; button.className='blockblast-piece'+(index===blockBlastSelected?' selected':'');
    button.disabled=!shape || blockBlastOver;
    button.dataset.piece=String(index);
    if(shape) {
      const maxR=Math.max(...shape.map(p=>p[0])),maxC=Math.max(...shape.map(p=>p[1]));
      const mini=document.createElement('span'); mini.className='blockblast-mini';
      mini.style.gridTemplateColumns='repeat('+(maxC+1)+', 12px)';
      for(let r=0;r<=maxR;r++) for(let c=0;c<=maxC;c++) {
        const dot=document.createElement('i');
        if(shape.some(([sr,sc])=>sr===r&&sc===c)) dot.className='on';
        mini.appendChild(dot);
      }
      button.appendChild(mini);
    } else button.textContent='تم استخدامها';
    pieces.appendChild(button);
  });
  document.getElementById('blockblast-score').textContent=String(blockBlastScore);
  document.getElementById('blockblast-best').textContent=String(blockBlastBest);
}
async function openLandscapeGame(panelId) {
  const panel=document.getElementById(panelId);
  panel.hidden=false;
  // Ask supported mobile browsers to enter fullscreen and rotate to landscape.
  // Browsers that prohibit orientation locking still get a responsive landscape layout.
  try {
    if (panel.requestFullscreen && !document.fullscreenElement) {
      await panel.requestFullscreen();
    }
  } catch (error) { /* Fullscreen is optional; keep the game playable in-page. */ }
  try {
    if (screen.orientation && screen.orientation.lock) {
      await screen.orientation.lock('landscape');
    }
  } catch (error) { /* iOS and some browsers only allow manual device rotation. */ }
}
function closeLandscapeGame(panelId) {
  document.getElementById(panelId).hidden=true;
  try {
    if (screen.orientation && screen.orientation.unlock) screen.orientation.unlock();
  } catch (error) {}
  if (document.fullscreenElement && document.exitFullscreen) {
    document.exitFullscreen().catch(()=>{});
  }
}
function openBlockBlast() {
  openLandscapeGame('blockblast-panel');
  if(!blockBlastPieces.length || blockBlastOver) blockBlastReset();
  else blockBlastRender();
}
function blockBlastReset() {
  blockBlastBoard=Array.from({length:blockBlastSize},()=>Array(blockBlastSize).fill(false));
  blockBlastScore=0; blockBlastOver=false;
  blockBlastNewPieces();
  document.getElementById('blockblast-feedback').textContent='اختاري قطعة، وبعدها مكانها على اللوحة.';
  blockBlastRender();
}
function blockBlastFinishIfNeeded() {
  if(blockBlastPieces.every(shape=>!shape)) blockBlastNewPieces();
  if(!blockBlastAnyMove()) {
    blockBlastOver=true;
    document.getElementById('blockblast-feedback').textContent='انتهت الجولة! نتيجتك '+blockBlastScore+'. اضغطي «لعبة جديدة» للمحاولة مرة تانية.';
  }
  blockBlastRender();
}
document.getElementById('blockblast-board').addEventListener('click',event=>{
  const cell=event.target.closest('button[data-row]');
  if(!cell || blockBlastOver) return;
  if(blockBlastSelected<0 || !blockBlastPieces[blockBlastSelected]) {
    document.getElementById('blockblast-feedback').textContent='اختاري واحدة من القطع الثلاث الأول.';
    return;
  }
  const row=Number(cell.dataset.row),col=Number(cell.dataset.col),shape=blockBlastPieces[blockBlastSelected];
  if(!blockBlastCanPlace(shape,row,col)) {
    document.getElementById('blockblast-feedback').textContent='المكان ده مش مناسب للقطعة. اختاري خانة فاضية تناسب شكلها.';
    return;
  }
  for(const [dr,dc] of shape) blockBlastBoard[row+dr][col+dc]=true;
  blockBlastScore+=shape.length;
  blockBlastPieces[blockBlastSelected]=null;
  blockBlastSelected=-1;
  let fullRows=[];
  for(let r=0;r<blockBlastSize;r++) if(blockBlastBoard[r].every(Boolean)) fullRows.push(r);
  let fullCols=[];
  for(let c=0;c<blockBlastSize;c++) if(blockBlastBoard.every(line=>line[c])) fullCols.push(c);
  for(const r of fullRows) for(let c=0;c<blockBlastSize;c++) blockBlastBoard[r][c]=false;
  for(const c of fullCols) for(let r=0;r<blockBlastSize;r++) blockBlastBoard[r][c]=false;
  const cleared=fullRows.length+fullCols.length;
  if(cleared) {
    blockBlastScore+=cleared*10;
    coins+=cleared*2;
    happiness=Math.min(100,happiness+cleared);
    updateStats();
    awardXP(cleared*8);
    document.getElementById('blockblast-feedback').textContent='برافو! مسحتي '+cleared+' صف/عمود 🎉 +'+(cleared*2)+' عملة و+'+(cleared*8)+' XP.';
  } else {
    awardXP(2);
    document.getElementById('blockblast-feedback').textContent='حلو! حطيتي قطعة وكسبتي '+shape.length+' نقطة.';
  }
  if(blockBlastScore>blockBlastBest) {
    blockBlastBest=blockBlastScore;
    try { localStorage.setItem('wonderworld-blockblast-best',String(blockBlastBest)); } catch (_) {}
  }
  blockBlastFinishIfNeeded();
});
document.getElementById('blockblast-pieces').addEventListener('click',event=>{
  const button=event.target.closest('button[data-piece]');
  if(!button || button.disabled || blockBlastOver) return;
  blockBlastSelected=Number(button.dataset.piece);
  document.getElementById('blockblast-feedback').textContent='دلوقتي اضغطي على خانة فاضية تناسب شكل القطعة.';
  blockBlastRender();
});
document.getElementById('close-blockblast').addEventListener('click',()=>closeLandscapeGame('blockblast-panel'));
document.getElementById('blockblast-restart').addEventListener('click',blockBlastReset);
document.getElementById('open-blockblast').addEventListener('click',openBlockBlast);
  
// Water Sort mini-game — tap a source tube, then a compatible target.
const waterSortColors=[{name:'بنفسجي',value:'#8b61c2'},{name:'مرجاني',value:'#ed6b72'},{name:'أزرق',value:'#4296d6'},{name:'أخضر',value:'#43a875'}];
let waterSortTubes=[],waterSortSelected=-1,waterSortMoves=0,waterSortWon=false;
function waterSortReset(){
 const pool=[];waterSortColors.forEach((_,c)=>{for(let i=0;i<4;i++)pool.push(c);});
 for(let i=pool.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]];}
 waterSortTubes=[pool.slice(0,4),pool.slice(4,8),pool.slice(8,12),pool.slice(12,16),[],[]];
 waterSortSelected=-1;waterSortMoves=0;waterSortWon=false;
 document.getElementById('watersort-feedback').textContent='اختاري أنبوبة فيها لون، ثم أنبوبة فاضية أو لونها العلوي مطابق.';
 waterSortRender();
}
function waterSortComplete(t){return !t.length||(t.length===4&&t.every(c=>c===t[0]));}
function waterSortRender(){
 const root=document.getElementById('watersort-tubes');root.replaceChildren();
 waterSortTubes.forEach((tube,i)=>{
  const b=document.createElement('button');b.type='button';b.className='watersort-tube'+(waterSortSelected===i?' selected':'');b.setAttribute('aria-label','أنبوبة '+(i+1));b.disabled=waterSortWon;
  const glass=document.createElement('span');glass.className='watersort-glass';
  for(let k=0;k<4;k++){const layer=document.createElement('i');layer.className='watersort-layer';if(tube[k]!==undefined)layer.style.background=waterSortColors[tube[k]].value;glass.appendChild(layer);}
  b.appendChild(glass);const label=document.createElement('small');label.textContent=String(i+1);b.appendChild(label);b.addEventListener('click',()=>waterSortTap(i));root.appendChild(b);
 });
 document.getElementById('watersort-moves').textContent=String(waterSortMoves);
 document.getElementById('watersort-progress').textContent=waterSortTubes.filter(t=>t.length===4&&t.every(c=>c===t[0])).length+'/4';
}
function waterSortTap(i){
 if(waterSortWon)return;
 const target=waterSortTubes[i];
 if(waterSortSelected<0){if(!target.length){document.getElementById('watersort-feedback').textContent='الأنبوبة فاضية؛ اختاري أنبوبة فيها لون.';return;}waterSortSelected=i;waterSortRender();return;}
 if(waterSortSelected===i){waterSortSelected=-1;waterSortRender();return;}
 const source=waterSortTubes[waterSortSelected],top=source[source.length-1];
 if(target.length>=4||(target.length&&target[target.length-1]!==top)){document.getElementById('watersort-feedback').textContent='اختاري أنبوبة فاضية أو لونها العلوي نفس اللون.';waterSortSelected=-1;waterSortRender();return;}
 let moved=0;while(source.length&&source[source.length-1]===top&&target.length<4){target.push(source.pop());moved++;}
 waterSortMoves++;waterSortSelected=-1;
 const won=waterSortTubes.every(waterSortComplete);
 document.getElementById('watersort-feedback').textContent=won?'🎉 برافو! رتّبتي الألوان في '+waterSortMoves+' حركة. مكافأتك 5 عملات و10 نقاط خبرة!':'نقلتي '+moved+' طبقة. كمّلي ترتيب الألوان!';
 if(won){waterSortWon=true;coins+=5;updateStats();awardXP(10);}
 waterSortRender();
}
function openWaterSort(){openLandscapeGame('watersort-panel');waterSortReset();}
document.getElementById('open-watersort').addEventListener('click',openWaterSort);
document.getElementById('close-watersort').addEventListener('click',()=>closeLandscapeGame('watersort-panel'));
document.getElementById('watersort-restart').addEventListener('click',waterSortReset);


function orderCafe() {
  if (coins < 5) { say('طلب الكافيه محتاج 5 عملات. زوري مكتب الحي للشغل أو كمّلي المهام.'); return; }
  coins -= 5;
  happiness = Math.min(100, happiness + 10);
  energy = Math.min(100, energy + 8);
  updateStats();
  awardXP(6);
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
  awardXP(15);
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
  awardXP(12);
  say('💪 خلصتي تمرين Wonder Fitness! السعادة +8، وكسبتي 3 عملات، والطاقة -12.');
}
function collectGardenFlowers() {
  const p = player.getPosition();
  if (Math.hypot(p.x + 11, p.z - 6.5) > 7) { say('اقتربي من حديقة الأصدقاء عشان تجمعي الزهور 🌷'); return; }
  const today = localDateKey();
  if (lastFlowerDay === today) { say('جمعتي زهور النهارده بالفعل. ارجعي بكرة لمجموعة جديدة 🌷'); return; }
  lastFlowerDay = today;
  gardenFlowers += 3;
  happiness = Math.min(100, happiness + 5);
  completeQuest('flowers');
  updateStats();
  awardXP(8);
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
  awardXP(4);
  say('🛋️ استراحة لطيفة! الطاقة +25 والسعادة +3. (الاستراحة هنا نموذج أولي وليست دخولًا فعليًا للبيت).');
}
document.getElementById('quick-work').addEventListener('click', () => {
  const p = player.getPosition();
  if (Math.hypot(p.x, p.z + 18.3) > 7) { say('اقتربي من مكتب الحي الأزرق في آخر الشارع عشان تشتغلي.'); return; }
  doQuickWork();
});
document.getElementById('quick-rest').addEventListener('click', takeRest);
document.getElementById('quick-photo').addEventListener('click', takePhotoMemory);
document.getElementById('quick-weather').addEventListener('click', cycleWeather);
document.getElementById('quick-cafe').addEventListener('click', () => {
  const p = player.getPosition();
  if (Math.hypot(p.x - 15, p.z + 3.2) > 7) { say('اقتربي من مبنى Wonder Cafe الوردي عشان تطلبي.'); return; }
  orderCafe();
});
function updateRelationshipPanel(npc) {
  const points = Math.max(0, Math.min(10, npc.relation));
  const level = points >= 8 ? 'صداقة قوية 💖' : points >= 4 ? 'أصدقاء 😊' : points >= 1 ? 'بدأت الصداقة 🌷' : 'معارف جدد';
  document.getElementById('relationship-level').textContent = level;
  document.getElementById('relationship-points').textContent = points + ' / 10';
  const track = document.querySelector('#relationship-meter .relationship-track');
  track.setAttribute('aria-valuenow', String(points));
  document.getElementById('relationship-fill').style.width = (points * 10) + '%';
  document.getElementById('character-details').textContent = 'الشخصية: ' + npc.personality + ' • بتحب: ' + npc.favorite;
}
function showDialogue(npc) {
  activeDialogueNpc = npc;
  const panel = document.getElementById('dialogue-panel');
  document.getElementById('dialogue-title').textContent = npc.name + ' — ' + npc.role;
  document.getElementById('dialogue-text').textContent = npc.greeting + ' ' + (npc.relation === 0
    ? 'لسه بتتعرفوا على بعض. اختاري ردّك:'
    : 'سعيدة إني شفتك تاني! اختاري هنعمل إيه المرة دي:');
  updateRelationshipPanel(npc);
  document.getElementById('dialogue-feedback').textContent = '';
  const alreadyRewardedToday = npcInteractionDates[npc.name] === localDateKey();
  document.getElementById('dialogue-text').textContent += alreadyRewardedToday
    ? ' أخدتي مكافأة التعارف مع ' + npc.name + ' النهارده؛ تقدري تكملي الحوار للمتعة، والمكافأة تتجدد بكرة.'
    : ' أول اختيار النهارده يطوّر الصداقة ويمنح مكافأة.';
  const choices = [...npc.topics];
  if (npc.relation >= 4) {
    choices.push({
      label: '🎲 نلعب نشاط تعاوني سوا',
      reply: 'اتفقنا! التعاون وتقسيم الأدوار بيخلّي النشاط ألطف، وكل واحدة فينا تقدر تضيف فكرة.',
      relation: 1,
      joy: 4
    });
  }
  if (npc.relation >= 8) {
    choices.push({
      label: '🌟 نخطط لمغامرة لطيفة في الحي',
      reply: 'يا سلام! نختار مكانًا جديدًا ونخلي المغامرة مناسبة وآمنة للجميع.',
      relation: 1,
      joy: 5
    });
  }
  const list = document.getElementById('dialogue-choices');
  list.replaceChildren();
  for (const choice of choices) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'dialogue-choice';
    button.textContent = choice.label;
    button.addEventListener('click', () => {
      if (npcInteractionDates[npc.name] !== localDateKey()) {
        const previousRelation = npc.relation;
        npc.relation = Math.min(10, npc.relation + choice.relation);
        happiness = Math.min(100, happiness + choice.joy);
        npcInteractionDates[npc.name] = localDateKey();
        updateStats();
        awardXP(10 + choice.relation * 2);
        updateRelationshipPanel(npc);
        completeQuest('friend');
        document.getElementById('dialogue-feedback').textContent = choice.reply + ' 🎁 مكافأة اليوم: +' + (npc.relation - previousRelation) + ' صداقة و+' + choice.joy + ' سعادة.';
        say('اتكلمتِ مع ' + npc.name + ' 💬 ' + document.getElementById('relationship-level').textContent + ' (' + npc.relation + '/10)');
      } else {
        document.getElementById('dialogue-feedback').textContent = choice.reply + ' 🌷 مكافأة الحوار اتاخدت النهارده؛ تقدري ترجعي بكرة لتطوير الصداقة.';
        say('حوار لطيف مع ' + npc.name + ' 💬 مكافأة الصداقة اليومية محفوظة لحد بكرة.');
      }
      for (const button of list.querySelectorAll('button')) button.disabled = true;
      const closeButton = document.getElementById('close-dialogue');
      closeButton.focus();
    });
    list.appendChild(button);
  }
  panel.hidden = false;
}

let lastBedRestAt = 0;
let lastReadingAt = 0;
const indoorTargets = [
  {
    name: 'الكنبة',
    x: -3.7, z: -1.2, radius: 2.5,
    action: () => {
      happiness = Math.min(100, happiness + 5);
      updateStats();
      awardXP(3);
      say('🛋️ قعدتي على الكنبة شوية! السعادة +5. خدي وقتك في بيتك.');
    }
  },
  {
    name: 'السرير',
    x: 3.8, z: -3.1, radius: 2.5,
    action: () => {
      const now = Date.now();
      if (now - lastBedRestAt < 20000) {
        say('😴 لسه واخدة راحة على السرير؛ استني شوية قبل الراحة التالية.');
        return;
      }
      lastBedRestAt = now;
      energy = Math.min(100, energy + 20);
      happiness = Math.min(100, happiness + 2);
      updateStats();
      awardXP(5);
      say('🛏️ ارتحتي في سريرك! الطاقة +20 والسعادة +2.');
    }
  },
  {
    name: 'مطبخ البيت',
    x: -3.8, z: -5.4, radius: 2.5,
    action: () => {
      if (coins < 3) {
        say('🍎 تجهيز وجبة بسيطة محتاج 3 عملات. تقدري تكسبي عملات من الشغل أو الأنشطة.');
        return;
      }
      coins -= 3;
      energy = Math.min(100, energy + 10);
      happiness = Math.min(100, happiness + 4);
      updateStats();
      awardXP(6);
      say('🍲 جهزتي وجبة في مطبخ البيت! اتخصم 3 عملات، والطاقة +10 والسعادة +4.');
    }
  },
  {
    name: 'كتاب الترابيزة',
    x: -1, z: -1, radius: 2.0,
    action: () => {
      const now = Date.now();
      if (now - lastReadingAt < 10000) {
        say('📖 خلّصي استراحة القراءة الأولى وبعدين ارجعي للكتاب بعد شوية.');
        return;
      }
      lastReadingAt = now;
      happiness = Math.min(100, happiness + 4);
      updateStats();
      awardXP(4);
      say('📚 قضيتي وقت لطيف مع كتابك! السعادة +4.');
    }
  }
];
function nearestTarget() {
  const p = player.getPosition();
  let best = null;
  let bestDistance = Infinity;
  if (indoors) {
    const pet = petCatalog.find(item => item.id === activePetId && ownedPets.includes(item.id));
    if (pet) {
      const petState = ensurePetCare(pet.id);
      const petFurnitureTargets = [
        { name: 'اللعب مع رفيقك 🐾', x: -3.7, z: -1.2, radius: 1.8, action: () => {
          petState.joy = clampPetValue(petState.joy + 14); petState.bond = clampPetValue(petState.bond + 6);
          happiness = Math.min(100, happiness + 3); renderPetPanel(); updateStats(); awardXP(4); saveProgress();
          say('🐾 لعبتي مع ' + pet.name + ' في الصالة! المرح والرابطة زادوا.');
        }},
        { name: 'راحة رفيقك 🛏️', x: 3.8, z: -3.1, radius: 1.8, action: () => {
          petState.joy = clampPetValue(petState.joy + 8); petState.hunger = clampPetValue(petState.hunger - 2);
          renderPetPanel(); updateStats(); awardXP(3); saveProgress();
          say('😴 ' + pet.name + ' أخد راحة هادئة جنب السرير.');
        }}
      ];
      for (const target of petFurnitureTargets) {
        const d = Math.hypot(p.x - target.x, p.z - target.z);
        if (d < target.radius && d < bestDistance) { best = { ...target, distance: d }; bestDistance = d; }
      }
    }
    for (const target of indoorTargets) {
      const d = Math.hypot(p.x - target.x, p.z - target.z);
      if (d < target.radius && d < bestDistance) {
        best = { ...target, distance: d };
        bestDistance = d;
      }
    }
    return best;
  }
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
document.getElementById('exit-home').addEventListener('click', exitHome);

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
let worldClockSeconds = 0;
let weatherMode = 'clear';
let weatherFeedbackAt = 0;
const rainDrops = [];
const rainMaterial = mat(new Color(0.55, 0.78, 0.98));
for (let i = 0; i < 42; i++) {
  const drop = box('Rain drop ' + i, 0.035, 0.55, 0.035, (Math.random() - 0.5) * 38, 5 + Math.random() * 10, (Math.random() - 0.5) * 38, rainMaterial);
  drop.enabled = false;
  rainDrops.push(drop);
}
function takePhotoMemory() {
  if (indoors) { say('📸 تعالي للساحة أو نافورة الحي عشان تصوري ذكرى.'); return; }
  const p = player.getPosition();
  if (Math.hypot(p.x, p.z) > 4.2) { say('📸 اقتربي من نافورة الساحة عشان تصوري ذكرى جميلة.'); return; }
  const today = localDateKey();
  if (lastPhotoDay === today) {
    say('📸 صورة اليوم اتسجلت بالفعل! تقدري ترجعي للنافورة بكرة لصورة ومكافأة جديدة.'); return;
  }
  lastPhotoDay = today; photoMemories += 1; happiness = Math.min(100, happiness + 6);
  updateStats(); awardXP(5); saveProgress();
  logAdventure('سجّلت ذكرى عند نافورة WonderWorld');
  say('📸 اتسجلت ذكرى جديدة عند نافورة WonderWorld! +6 سعادة و+5 خبرة. الصور الفعلية لسه مش محفوظة؛ دي ذكرى داخل اللعبة.');
}
function cycleWeather() {
  weatherMode = weatherMode === 'clear' ? 'cloudy' : weatherMode === 'cloudy' ? 'rain' : 'clear';
  const labels = { clear: '☀️ الجو صافي', cloudy: '☁️ الجو غائم', rain: '🌧️ بدأ المطر' };
  document.getElementById('quick-weather').textContent = (weatherMode === 'clear' ? '🌤️' : weatherMode === 'cloudy' ? '☁️' : '🌧️') + ' تغيير الطقس';
  say(labels[weatherMode] + ' — تقدري تغيّري الطقس في أي وقت.');
}
function updateWorldAtmosphere(dt) {
  worldClockSeconds = (worldClockSeconds + dt) % 240;
  const phase = worldClockSeconds / 240;
  const daylight = 0.25 + 0.75 * (0.5 + 0.5 * Math.sin(phase * Math.PI * 2 - Math.PI / 2));
  const night = 1 - daylight;
  const dim = weatherMode === 'cloudy' ? 0.72 : weatherMode === 'rain' ? 0.52 : 1;
  sun.light.intensity = (0.25 + daylight * 1.35) * dim;
  app.scene.ambientLight = new Color(0.20 + daylight * 0.52, 0.24 + daylight * 0.51, 0.34 + daylight * 0.48);
  const sky = weatherMode === 'rain'
    ? new Color(0.27 + daylight * 0.18, 0.36 + daylight * 0.25, 0.48 + daylight * 0.27)
    : weatherMode === 'cloudy'
      ? new Color(0.42 + daylight * 0.25, 0.49 + daylight * 0.28, 0.58 + daylight * 0.30)
      : new Color(0.06 + daylight * 0.47, 0.10 + daylight * 0.69, 0.20 + daylight * 0.76);
  camera.camera.clearColor = sky;
  const clockLabel = night > 0.58 ? '🌙 ليل' : daylight < 0.48 ? '🌅 غروب/شروق' : '☀️ نهار';
  document.getElementById('world-clock').textContent = '🕒 ' + clockLabel + ' • ' + (weatherMode === 'clear' ? 'صافي' : weatherMode === 'cloudy' ? 'غائم' : 'ممطر');
  for (const drop of rainDrops) {
    const pos = drop.getPosition();
    pos.y -= dt * 9;
    if (pos.y < 0.15) { pos.y = 8 + Math.random() * 7; pos.x = pRandom(-19,19); pos.z = pRandom(-19,19); }
    drop.setPosition(pos);
    drop.enabled = weatherMode === 'rain' && !indoors;
  }
}
function pRandom(min, max) { return min + Math.random() * (max - min); }
let cameraX = 0;
let cameraZ = 12.5;
let cameraHeight = 7;
let cameraOffsetZ = 11;
app.on('update', dt => {
  updateWorldAtmosphere(dt);
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
  cameraZ += (p.z + cameraOffsetZ - cameraZ) * follow;
  camera.setPosition(cameraX, cameraHeight, cameraZ);
  camera.lookAt(p.x, 1, p.z);
});

restoreEquippedItems();
syncPetCompanion();
renderPetPanel();
updateQuestUI();
updateStats();
try {
  const today = localDateKey();
  const rewardKey = 'wonderworld-last-daily-reward';
  if (localStorage.getItem(rewardKey) !== today) {
    coins += 5;
    playerXP += 5;
    while (playerXP >= xpNeededForNextLevel()) {
      playerXP -= xpNeededForNextLevel();
      playerLevel += 1;
      coins += 10;
      happiness = Math.min(100, happiness + 2);
    }
    localStorage.setItem(rewardKey, today);
    say('🎁 هدية دخول اليوم: 5 عملات جديدة! استكشفي الحي وجربي الكافيه والشغل.');
  }
} catch (_) {}
updateStats();
status.textContent = 'WonderWorld prototype ready — تحرّكي واستكشفي الحي';
updateStats();
