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
  wallBrick: mat(new Color(0.67, 0.31, 0.20)),
  wallGold: mat(new Color(0.88, 0.61, 0.16)),
  wallYellow: mat(new Color(0.96, 0.79, 0.29)),
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
  skinLight: mat(new Color(0.98, 0.78, 0.62)),
  skinTan: mat(new Color(0.68, 0.42, 0.28)),
  skinDeep: mat(new Color(0.39, 0.23, 0.17)),
  hairSilver: mat(new Color(0.72, 0.74, 0.78)),
  eyes: mat(new Color(0.98, 0.98, 0.96)),
  pupil: mat(new Color(0.12, 0.09, 0.18)),
  shoes: mat(new Color(0.16, 0.18, 0.24)),
  npcBlue: mat(new Color(0.18, 0.53, 0.82)),
  npcPink: mat(new Color(0.89, 0.34, 0.56)),
  npcGold: mat(new Color(0.96, 0.68, 0.19)),
  tvFrame: mat(new Color(0.07, 0.09, 0.13)),
  tvScreen: mat(new Color(0.16, 0.28, 0.40))
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
box('Town green', 100, 0.4, 100, 0, -0.25, 0, mats.grass);
box('Main street', 5.5, 0.06, 42, 0, 0.0, 0, mats.road);
box('Cross street', 42, 0.06, 5.5, 0, 0.01, 0, mats.road);
box('North sidewalk', 7, 0.08, 42, -6.2, 0.03, 0, mats.path);
box('South sidewalk', 7, 0.08, 42, 6.2, 0.03, 0, mats.path);
box('West sidewalk', 42, 0.08, 7, 0, 0.03, -6.2, mats.path);
box('East sidewalk', 42, 0.08, 7, 0, 0.03, 6.2, mats.path);

// Fixed neighborhood structures are world content, never per-account save data.
const staticHouseStructures = [];
const staticPoolStructures = [];
// Houses with doors, windows, roofs and little gardens.
function house(name, x, z, wallMaterial, width = 5) {
  const walls = box(name + ' walls', width, 3.1, 4.2, x, 1.55, z, wallMaterial);
  const roof = box(name + ' roof', width + 0.55, 0.38, 4.7, x, 3.28, z, mats.roof);
  const door = box(name + ' door', 0.95, 1.9, 0.16, x, 0.98, z - 2.17, mats.door);
  const windowLeft = box(name + ' window left', 0.95, 0.85, 0.13, x - width * 0.29, 1.95, z - 2.18, mats.window);
  const windowRight = box(name + ' window right', 0.95, 0.85, 0.13, x + width * 0.29, 1.95, z - 2.18, mats.window);
  const step = box(name + ' step', 1.5, 0.18, 0.65, x, 0.1, z - 2.45, mats.path);
  staticHouseStructures.push(walls, roof, door, windowLeft, windowRight, step);
  const bushes = [];
  for (let i = 0; i < 3; i++) {
    bushes.push(sphere(name + ' garden bush ' + i, 0.65, x - width / 2 + i * 0.65, 0.42, z - 2.9, mats.leaf));
  }
  return { walls, roof, bushes };
}
function ensureStaticWorldVisible() {
  for (const structure of [...staticHouseStructures, ...staticPoolStructures]) {
    if (structure && structure.enabled !== true) structure.enabled = true;
    if (structure?.render) structure.render.enabled = true;
  }
}
const playerHomeBuild = house('Home', -10, -10, mats.wall, 5);
house('Family home', 10, -10, mats.wallPink, 5);
house('Wonder Starter Villa', -24, -10, mats.wallGold, 8);
house('Wonder Luxury Villa', 24, -10, mats.wallPink, 9);

// A first backyard/pool activity slice: a visible pool beside the player's home.
staticPoolStructures.push(box('Home pool deck', 6.4, 0.18, 5.2, -16.1, 0.08, -10.0, mats.path));
staticPoolStructures.push(box('Home pool basin', 5.0, 0.22, 3.8, -16.1, 0.15, -10.0, mats.road));
staticPoolStructures.push(box('Home pool water', 4.55, 0.06, 3.35, -16.1, 0.29, -10.0, mats.window));
staticPoolStructures.push(box('Pool edge front', 5.35, 0.22, 0.22, -16.1, 0.29, -11.95, mats.white));
staticPoolStructures.push(box('Pool edge back', 5.35, 0.22, 0.22, -16.1, 0.29, -8.05, mats.white));
staticPoolStructures.push(box('Pool edge left', 0.22, 0.22, 3.8, -18.65, 0.29, -10.0, mats.white));
staticPoolStructures.push(box('Pool edge right', 0.22, 0.22, 3.8, -13.55, 0.29, -10.0, mats.white));
staticPoolStructures.push(box('Pool ladder rail left', 0.08, 0.95, 0.08, -15.55, 0.55, -8.25, mats.tvFrame));
staticPoolStructures.push(box('Pool ladder rail right', 0.08, 0.95, 0.08, -14.85, 0.55, -8.25, mats.tvFrame));
staticPoolStructures.push(box('Pool ladder step', 0.78, 0.08, 0.08, -15.2, 0.35, -8.25, mats.white));

// Shop, sign and colorful awning.
box('Wonder Shop building', 6, 3.5, 4.5, 10, 1.75, 10, mats.white);
box('Shop roof', 6.5, 0.35, 5, 10, 3.7, 10, mats.npcBlue);
box('Shop door', 1.1, 2, 0.16, 10, 1, 7.7, mats.door);
box('Shop window', 2.1, 1.35, 0.12, 8.1, 1.85, 7.68, mats.window);
box('Shop window 2', 2.1, 1.35, 0.12, 11.9, 1.85, 7.68, mats.window);
box('Shop sign', 4.2, 0.75, 0.18, 10, 3.05, 7.55, mats.npcPink);

// Player-owned shop appears in the neighborhood only after purchase in the careers panel.
const playerBusiness = new Entity('Player-Owned Shop');
app.root.addChild(playerBusiness);
box('Player shop walls', 4.8, 2.9, 3.8, 0, 1.45, 0, mats.white, playerBusiness);
box('Player shop roof', 5.2, 0.32, 4.2, 0, 3.05, 0, mats.npcBlue, playerBusiness);
box('Player shop door', 0.9, 1.8, 0.14, 0, 0.9, -1.96, mats.door, playerBusiness);
box('Player shop window left', 1.25, 1.1, 0.12, -1.35, 1.65, -1.97, mats.window, playerBusiness);
box('Player shop window right', 1.25, 1.1, 0.12, 1.35, 1.65, -1.97, mats.window, playerBusiness);
const playerBusinessAwning = box('Player shop awning', 5.0, 0.28, 0.65, 0, 2.35, -2.12, mats.npcPink, playerBusiness);
const playerBusinessSign = box('Player shop sign', 3.3, 0.55, 0.16, 0, 2.85, -2.08, mats.npcBlue, playerBusiness);
const playerBusinessStock = [
  box('Player shop stock crate 1', 0.55, 0.55, 0.55, -1.5, 0.3, -2.55, mats.outfitGold, playerBusiness),
  box('Player shop stock crate 2', 0.55, 0.55, 0.55, -0.8, 0.3, -2.55, mats.outfitMint, playerBusiness),
  box('Player shop stock crate 3', 0.55, 0.55, 0.55, -0.1, 0.3, -2.55, mats.outfitCoral, playerBusiness),
  box('Player shop stock crate 4', 0.55, 0.55, 0.55, 0.6, 0.3, -2.55, mats.outfitBlue, playerBusiness),
  box('Player shop stock crate 5', 0.55, 0.55, 0.55, 1.3, 0.3, -2.55, mats.flower, playerBusiness)
];
playerBusiness.setPosition(-18, 0, -10);
playerBusiness.enabled = false;
playerBusinessStock.forEach(crate => { crate.enabled = false; });
window.addEventListener('wonderworld:career-state', event => {
  const business = event.detail || {};
  playerBusiness.enabled = Boolean(business.hasPremises);
  playerBusinessAwning.render.material = business.decorated ? mats.outfitGold : mats.npcPink;
  playerBusinessSign.render.material = Number(business.businessLevel) >= 2 ? mats.outfitGold : (business.decorated ? mats.npcGold : mats.npcBlue);
  playerBusinessStock.forEach((crate, index) => { crate.enabled = Boolean(business.hasPremises && Number(business.stock) > index); });
});

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

// Visible low-poly transport landmarks connected to the existing playable flight/train activities.
box('Wonder Air runway', 14, 0.12, 30, 34, 0.03, -28, mats.road);
for (let z = -40; z <= -16; z += 4) box('Airport runway marking ' + z, 0.18, 0.025, 1.8, 34, 0.105, z, mats.white);
box('Airport terminal', 8, 3.2, 5, 34, 1.6, -47, mats.white);
box('Airport terminal roof', 8.5, 0.3, 5.5, 34, 3.35, -47, mats.npcBlue);
box('Airport terminal sign', 4.8, 0.7, 0.16, 34, 2.8, -44.35, mats.npcGold);
box('Wonder Air aircraft fuselage', 1.05, 0.78, 8.4, 34, 1.55, -28, mats.white);
box('Wonder Air aircraft wings', 10.2, 0.2, 1.55, 34, 1.65, -28, mats.npcBlue);
box('Wonder Air aircraft tail wing', 3.1, 0.16, 1.05, 34, 2.0, -24.8, mats.npcBlue);
box('Wonder Air aircraft tail fin', 0.22, 1.45, 1.15, 34, 2.35, -24.8, mats.npcPink);
sphere('Wonder Air aircraft nose', 0.72, 34, 1.58, -32.2, mats.tvFrame);
for (const [side, x] of [['left', 31.5], ['right', 36.5]]) {
  box('Aircraft cabin window ' + side, 0.12, 0.28, 0.55, x, 1.8, -29.0, mats.window);
  sphere('Aircraft landing wheel ' + side, 0.32, x, 0.45, -27.5, mats.tvFrame);
}
box('Wonder Central station platform', 18, 0.18, 4.2, -30, 0.08, -20, mats.path);
box('Wonder Central station sign', 6.2, 1.0, 0.18, -30, 3.0, -17.2, mats.npcGold);
box('Railway track left rail', 34, 0.12, 0.16, -30, 0.18, -21.0, mats.tvFrame);
box('Railway track right rail', 34, 0.12, 0.16, -30, 0.18, -19.0, mats.tvFrame);
for (let x = -46; x <= -14; x += 2) box('Railway sleeper ' + x, 0.22, 0.12, 2.8, x, 0.12, -20, mats.bench);
box('Wonder train locomotive body', 4.4, 1.55, 1.7, -30, 1.2, -20, mats.outfitBlue);
box('Wonder train locomotive front', 1.0, 1.0, 1.75, -32.5, 1.0, -20, mats.npcGold);
box('Wonder train locomotive cabin', 1.8, 1.4, 1.55, -28.8, 2.55, -20, mats.white);
for (const [index, x] of [[1, -35.2], [2, -39.2], [3, -43.2]]) {
  box('Wonder train passenger car ' + index, 3.6, 1.55, 1.65, x, 1.15, -20, index % 2 ? mats.wallPink : mats.outfitMint);
  box('Wonder train passenger windows ' + index, 2.8, 0.42, 0.08, x, 1.55, -19.12, mats.window);
}
for (const x of [-32, -29, -35, -38, -42, -45]) for (const z of [-20.8, -19.2]) sphere('Wonder train wheel ' + x + ' ' + z, 0.38, x, 0.52, z, mats.tvFrame);

 // WonderWorld Fashion Week stage: a visible, enterable 3D runway landmark.
box('Fashion Week plaza', 20, 0.2, 16, 25, 0.04, 16, mats.path);
box('Fashion runway stage', 8.0, 0.55, 13, 25, 0.38, 16, mats.flower);
box('Fashion runway carpet', 3.0, 0.08, 10, 25, 0.7, 15, mats.outfitGold);
box('Fashion runway backdrop', 10, 4.8, 0.35, 25, 2.65, 23, mats.npcPink);
box('Fashion Week sign', 7.2, 1.0, 0.18, 25, 4.1, 22.75, mats.outfitGold);
for (const [x, z] of [[20, 20], [30, 20], [20, 17], [30, 17], [20, 14], [30, 14]]) {
  box('Fashion audience seat ' + x + ' ' + z, 1.4, 0.75, 1.0, x, 0.45, z, mats.outfitBlue);
  box('Fashion audience seat back ' + x + ' ' + z, 1.4, 0.9, 0.18, x, 1.0, z + 0.38, mats.npcGold);
}
for (const x of [19, 31]) {
  box('Fashion spotlight stand ' + x, 0.22, 3.0, 0.22, x, 1.5, 22, mats.tvFrame);
  sphere('Fashion spotlight ' + x, 0.55, x, 3.2, 22, mats.white);
}


/*
 * First cross-country travel slice. These are original low-poly landmarks built
 * from engine primitives, not finished country-scale worlds or real transport.
 * The destination menu moves the player between these clearly separated areas.
 */
// Egypt: sandy arrival plaza, stepped pyramids and a small sphinx silhouette.
box('Egypt travel plaza', 17, 0.28, 17, 30, -0.02, 0, mats.path);
for (const [index, width] of [5.6, 4.4, 3.2, 2.0, 0.9].entries()) {
  const tier = box('Egypt stepped pyramid tier ' + index, width, 1.05, width, 30, 0.5 + index * 0.92, -1.2, mats.wall);
  tier.setEulerAngles(0, 45, 0);
}
box('Egypt pyramid entry', 1.0, 1.5, 0.45, 30, 1.0, 2.9, mats.door);
sphere('Egypt sphinx body', 1.15, 25.9, 0.58, 2.7, mats.wallPink);
box('Egypt sphinx head', 0.8, 1.2, 0.8, 25.3, 1.2, 2.7, mats.wall);
box('Egypt arrival marker', 4.2, 0.8, 0.2, 30, 1.2, 7.1, mats.npcGold);

// Paris: a compact Eiffel-inspired landmark with a broad base and cross-braces.
box('Paris travel plaza', 17, 0.28, 17, -30, -0.02, 0, mats.white);
box('Paris tower left leg', 0.45, 7.2, 0.55, -31.3, 3.6, -0.6, mats.road);
box('Paris tower right leg', 0.45, 7.2, 0.55, -28.7, 3.6, -0.6, mats.road);
box('Paris tower first deck', 4.4, 0.28, 1.1, -30, 2.1, -0.6, mats.npcBlue);
box('Paris tower second deck', 2.8, 0.24, 0.9, -30, 4.25, -0.6, mats.npcBlue);
box('Paris tower crown', 0.65, 1.3, 0.65, -30, 7.4, -0.6, mats.road);
box('Paris tower crossbar lower', 2.0, 0.22, 0.28, -30, 3.1, -0.6, mats.road);
box('Paris tower crossbar upper', 1.4, 0.2, 0.25, -30, 5.1, -0.6, mats.road);
box('Paris arrival marker', 4.4, 0.8, 0.2, -30, 1.2, 7.1, mats.npcPink);

// Tokyo: a red torii gate, cherry blossoms and a small lantern path.
box('Tokyo travel garden', 17, 0.28, 17, 0, -0.02, 30, mats.leaf);
box('Tokyo torii left post', 0.42, 3.8, 0.42, -2.2, 1.9, 27.8, mats.npcPink);
box('Tokyo torii right post', 0.42, 3.8, 0.42, 2.2, 1.9, 27.8, mats.npcPink);
box('Tokyo torii lintel', 5.6, 0.45, 0.65, 0, 3.7, 27.8, mats.npcPink);
box('Tokyo torii upper lintel', 6.2, 0.32, 0.7, 0, 4.08, 27.8, mats.roof);
for (const [x, z] of [[-5, 26], [5, 26], [-5, 34], [5, 34]]) {
  cylinder('Tokyo cherry tree trunk', 0.3, 1.5, 0.3, x, 0.75, z, mats.trunk);
  sphere('Tokyo cherry blossoms', 1.9, x, 2.0, z, mats.flower);
}
for (const [x, z] of [[-3.4, 31], [3.4, 31], [-3.4, 33], [3.4, 33]]) {
  box('Tokyo garden stepping stone', 0.9, 0.12, 0.9, x, 0.18, z, mats.white);
}
box('Tokyo arrival marker', 4.4, 0.8, 0.2, 0, 1.2, 37.1, mats.npcGold);

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
  const body = box(name + ' body', 0.82, 1.22, 0.58, 0, 1.02, 0, shirtMaterial, person);
  const head = sphere(name + ' head', 0.78, 0, 1.95, 0, mats.skin, person);
  const hair = sphere(name + ' hair', 0.8, 0, 2.28, -0.04, isPlayer ? mats.player : mats.trunk, person);
  const hairFront = sphere(name + ' fringe', 0.38, 0, 2.16, 0.31, isPlayer ? mats.player : mats.trunk, person);
  const leftEye = sphere(name + ' left eye', 0.13, -0.18, 2.00, 0.335, mats.eyes, person);
  const rightEye = sphere(name + ' right eye', 0.13, 0.18, 2.00, 0.335, mats.eyes, person);
  sphere(name + ' left pupil', 0.065, -0.18, 2.00, 0.445, mats.pupil, person);
  sphere(name + ' right pupil', 0.065, 0.18, 2.00, 0.445, mats.pupil, person);
  const nose = sphere(name + ' nose', 0.075, 0, 1.86, 0.37, mats.skin, person);
  box(name + ' smile', 0.16, 0.035, 0.04, 0, 1.77, 0.36, mats.outfitCoral, person);
  const leftArm = box(name + ' left arm', 0.22, 0.88, 0.24, -0.54, 1.0, 0, shirtMaterial, person);
  const rightArm = box(name + ' right arm', 0.22, 0.88, 0.24, 0.54, 1.0, 0, shirtMaterial, person);
  const leftLeg = box(name + ' left leg', 0.27, 0.68, 0.3, -0.22, 0.39, 0, mats.outfitBlue, person);
  const rightLeg = box(name + ' right leg', 0.27, 0.68, 0.3, 0.22, 0.39, 0, mats.outfitBlue, person);
  const leftShoe = box(name + ' left shoe', 0.32, 0.16, 0.48, -0.22, 0.09, 0.08, mats.shoes, person);
  const rightShoe = box(name + ' right shoe', 0.32, 0.16, 0.48, 0.22, 0.09, 0.08, mats.shoes, person);
  person.outfitParts = [body, leftArm, rightArm, leftLeg, rightLeg];
  person.headPart = head;
  person.skinParts = [head, nose];
  person.hairPart = hair;
  person.hairParts = [hair, hairFront];
  person.bodyPart = body;
  person.leftArm = leftArm;
  person.rightArm = rightArm;
  person.leftLeg = leftLeg;
  person.rightLeg = rightLeg;
  person.faceParts = [leftEye, rightEye];
  person.baseHeadY = 1.95;
  person.baseHairY = 2.28;
  return person;
}
const player = makePerson('Player', 0, 1.5, mats.player, true);
const avatarHairStyles = {
  long: [
    box('Player long hair left', 0.3, 0.98, 0.38, -0.31, 1.83, 0.01, mats.player, player),
    box('Player long hair right', 0.3, 0.98, 0.38, 0.31, 1.83, 0.01, mats.player, player)
  ],
  curly: [
    sphere('Player curly hair left', 0.42, -0.35, 2.22, 0.0, mats.player, player),
    sphere('Player curly hair right', 0.42, 0.35, 2.22, 0.0, mats.player, player),
    sphere('Player curly hair crown', 0.4, 0, 2.48, -0.02, mats.player, player)
  ],
  bun: [sphere('Player hair bun', 0.38, 0, 2.55, -0.18, mats.player, player)]
};
for (const parts of Object.values(avatarHairStyles)) for (const part of parts) part.enabled = false;
player.hairParts.push(...Object.values(avatarHairStyles).flat());


// First playable vehicle slice: a low-poly car that follows the avatar and uses the same touch/keyboard controls.
const playerCar = new Entity('WonderWorld compact car');
app.root.addChild(playerCar);
box('Car lower chassis', 1.9, 0.42, 3.15, 0, 0.52, 0, mats.outfitBlue, playerCar);
box('Car hood', 1.75, 0.22, 0.82, 0, 0.78, -0.95, mats.outfitBlue, playerCar);
box('Car cabin', 1.35, 0.62, 1.42, 0, 1.02, 0.05, mats.window, playerCar);
box('Car roof', 1.25, 0.13, 0.85, 0, 1.39, 0.03, mats.outfitBlue, playerCar);
box('Car front bumper', 1.75, 0.18, 0.14, 0, 0.34, -1.57, mats.white, playerCar);
box('Car rear bumper', 1.75, 0.18, 0.14, 0, 0.34, 1.57, mats.white, playerCar);
for (const [side, x] of [['left', -0.94], ['right', 0.94]]) {
  for (const [axle, z] of [['front', -1.02], ['rear', 1.02]]) {
    sphere('Car wheel ' + side + ' ' + axle, 0.46, x, 0.38, z, mats.tvFrame, playerCar);
    box('Car headlight ' + side, 0.3, 0.13, 0.08, x * 0.7, 0.72, -1.62, mats.white, playerCar);
  }
}
playerCar.enabled = false;
let vehicleMode = false;
function toggleVehicleMode(forceState) {
  const next = typeof forceState === 'boolean' ? forceState : !vehicleMode;
  if (next === vehicleMode) return;
  if (next && indoors) { say('اخرجي للحي الأول عشان تركبي العربية 🚗'); return; }
  vehicleMode = next;
  const p = player.getPosition();
  if (vehicleMode) {
    playerCar.setPosition(p.x, 0, p.z);
    playerCar.setEulerAngles(0, player.getEulerAngles().y, 0);
    playerCar.enabled = true;
    player.enabled = false;
    document.getElementById('toggle-vehicle').textContent = '🚶 النزول من العربية';
    document.getElementById('toggle-vehicle').setAttribute('aria-pressed', 'true');
    say('ركبتي عربية WonderWorld 🚗 استخدمي الأسهم أو أزرار الشاشة للقيادة. تقدري تنزلي في أي وقت.');
  } else {
    player.enabled = true;
    playerCar.enabled = false;
    document.getElementById('toggle-vehicle').textContent = '🚗 ركوب العربية';
    document.getElementById('toggle-vehicle').setAttribute('aria-pressed', 'false');
    say('نزلتي من العربية. رجع التحكم بالمشي الطبيعي.');
  }
}
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
box('Living room TV frame', 2.15, 1.3, 0.16, 2.35, 1.9, -6.38, mats.tvFrame, interiorRoot);
box('Living room TV screen', 1.9, 1.05, 0.035, 2.35, 1.92, -6.275, mats.tvScreen, interiorRoot);
box('TV stand', 2.35, 0.35, 0.55, 2.35, 0.28, -5.95, mats.bench, interiorRoot);
interiorRoot.enabled = false;

// Dedicated furnished interiors for the neighborhood's public businesses.
const shopInteriorRoot = new Entity('Wonder Shop Interior');
app.root.addChild(shopInteriorRoot);
box('Shop interior floor', 14, 0.22, 14, 0, -0.16, 0, mats.white, shopInteriorRoot);
box('Shop interior back wall', 14, 4.6, 0.28, 0, 2.2, -7, mats.wallPink, shopInteriorRoot);
box('Shop interior left wall', 0.28, 4.6, 14, -7, 2.2, 0, mats.white, shopInteriorRoot);
box('Shop interior right wall', 0.28, 4.6, 14, 7, 2.2, 0, mats.white, shopInteriorRoot);
box('Shop clothing rack 1', 4.8, 0.16, 0.18, -3.5, 2.2, -3.0, mats.tvFrame, shopInteriorRoot);
box('Shop clothing rack 2', 4.8, 0.16, 0.18, 3.3, 2.2, -3.0, mats.tvFrame, shopInteriorRoot);
for (const [x, material] of [[-5, mats.outfitCoral], [-3.5, mats.outfitGold], [-2, mats.outfitMint], [1.8, mats.outfitBlue], [3.3, mats.flower], [4.8, mats.outfitCoral]]) {
  box('Shop displayed outfit ' + x, 0.8, 1.2, 0.22, x, 1.45, -3.0, material, shopInteriorRoot);
}
box('Shop checkout counter', 4.4, 1.0, 1.1, 0, 0.55, -5.0, mats.bench, shopInteriorRoot);
box('Shop checkout top', 4.6, 0.14, 1.2, 0, 1.12, -5.0, mats.outfitGold, shopInteriorRoot);
box('Shop welcome sign', 4.2, 0.8, 0.18, 0, 3.2, -6.7, mats.npcPink, shopInteriorRoot);
shopInteriorRoot.enabled = false;

const cafeInteriorRoot = new Entity('Wonder Cafe Interior');
app.root.addChild(cafeInteriorRoot);
box('Cafe interior floor', 14, 0.22, 14, 0, -0.16, 0, mats.path, cafeInteriorRoot);
box('Cafe interior back wall', 14, 4.6, 0.28, 0, 2.2, -7, mats.wallPink, cafeInteriorRoot);
box('Cafe interior left wall', 0.28, 4.6, 14, -7, 2.2, 0, mats.white, cafeInteriorRoot);
box('Cafe interior right wall', 0.28, 4.6, 14, 7, 2.2, 0, mats.white, cafeInteriorRoot);
box('Cafe service counter', 5.0, 1.0, 1.2, 0, 0.55, -5.0, mats.bench, cafeInteriorRoot);
box('Cafe counter top', 5.2, 0.14, 1.35, 0, 1.12, -5.0, mats.white, cafeInteriorRoot);
box('Cafe espresso machine', 1.0, 1.15, 0.8, -1.0, 1.75, -5.0, mats.tvFrame, cafeInteriorRoot);
box('Cafe menu board', 3.6, 1.0, 0.16, 2.7, 3.0, -6.7, mats.npcGold, cafeInteriorRoot);
for (const [x, z] of [[-4, 1.5], [3.5, 1.5], [-4, -1.8], [3.5, -1.8]]) {
  box('Cafe table top ' + x + ' ' + z, 2.0, 0.16, 1.5, x, 0.9, z, mats.bench, cafeInteriorRoot);
  for (const dx of [-0.7, 0.7]) box('Cafe table leg ' + x + ' ' + z + ' ' + dx, 0.14, 0.8, 0.14, x + dx, 0.42, z, mats.tvFrame, cafeInteriorRoot);
  box('Cafe chair ' + x + ' ' + z, 0.8, 0.65, 0.75, x, 0.38, z + 1.25, mats.outfitMint, cafeInteriorRoot);
}

cafeInteriorRoot.enabled = false;

// Ready-to-live villas: distinct furnished interiors; construction remains optional.
const starterVillaRoot = new Entity('Wonder Starter Villa Interior');
app.root.addChild(starterVillaRoot);
box('Starter villa marble floor', 20, 0.22, 20, 0, -0.16, 0, mats.white, starterVillaRoot);
box('Starter villa back wall', 20, 4.8, 0.28, 0, 2.25, -10, mats.wallGold, starterVillaRoot);
box('Starter villa left wall', 0.28, 4.8, 20, -10, 2.25, 0, mats.white, starterVillaRoot);
box('Starter villa right wall', 0.28, 4.8, 20, 10, 2.25, 0, mats.white, starterVillaRoot);
box('Starter villa lounge sofa', 4.2, 0.9, 1.3, -4.8, 0.55, 4.2, mats.outfitMint, starterVillaRoot);
box('Starter villa sofa cushion', 3.8, 0.18, 1.05, -4.8, 1.05, 4.0, mats.white, starterVillaRoot);
box('Starter villa coffee table', 2.5, 0.18, 1.5, -4.4, 0.55, 1.9, mats.bench, starterVillaRoot);
box('Starter villa TV console', 3.2, 0.55, 0.6, -4.6, 0.45, -2.5, mats.bench, starterVillaRoot);
box('Starter villa television', 2.4, 1.35, 0.16, -4.6, 1.45, -2.8, mats.tvFrame, starterVillaRoot);
box('Starter villa dining table', 3.0, 0.18, 1.7, 4.2, 0.95, 4.0, mats.bench, starterVillaRoot);
for (const [x,z] of [[3.0,4.0],[5.4,4.0],[4.2,2.7],[4.2,5.2]]) box('Starter villa dining chair '+x+' '+z,0.65,0.8,0.65,x,0.42,z,mats.outfitBlue,starterVillaRoot);
box('Starter villa kitchen island', 4.2, 0.95, 1.5, 4.5, 0.58, -0.4, mats.wallGold, starterVillaRoot);
box('Starter villa kitchen counter', 4.4, 0.14, 1.65, 4.5, 1.12, -0.4, mats.white, starterVillaRoot);
box('Starter villa bedroom bed base', 3.6, 0.65, 4.0, -4.2, 0.35, -6.0, mats.bench, starterVillaRoot);
box('Starter villa bedroom mattress', 3.45, 0.28, 3.8, -4.2, 0.78, -6.0, mats.white, starterVillaRoot);
box('Starter villa bedroom blanket', 3.5, 0.12, 2.0, -4.2, 0.97, -6.8, mats.outfitMint, starterVillaRoot);
box('Starter villa bedroom headboard', 3.7, 1.4, 0.22, -4.2, 1.0, -8.0, mats.wallGold, starterVillaRoot);
box('Starter villa wardrobe', 2.0, 2.6, 0.8, 1.0, 1.3, -8.5, mats.bench, starterVillaRoot);
box('Starter villa bath tub', 3.0, 0.65, 1.6, 6.2, 0.38, -6.4, mats.white, starterVillaRoot);
box('Starter villa bathroom mirror', 2.0, 1.3, 0.12, 6.2, 2.0, -9.65, mats.window, starterVillaRoot);
starterVillaRoot.enabled = false;

const luxuryVillaRoot = new Entity('Wonder Luxury Villa Interior');
app.root.addChild(luxuryVillaRoot);
box('Luxury villa polished floor', 22, 0.22, 22, 0, -0.16, 0, mats.path, luxuryVillaRoot);
box('Luxury villa back wall', 22, 5.2, 0.28, 0, 2.45, -11, mats.wallPink, luxuryVillaRoot);
box('Luxury villa left wall', 0.28, 5.2, 22, -11, 2.45, 0, mats.white, luxuryVillaRoot);
box('Luxury villa right wall', 0.28, 5.2, 22, 11, 2.45, 0, mats.white, luxuryVillaRoot);
box('Luxury villa living sofa', 5.0, 1.0, 1.5, -5.8, 0.6, 4.4, mats.outfitBlue, luxuryVillaRoot);
box('Luxury villa loveseat', 3.0, 0.9, 1.3, -2.5, 0.55, 1.7, mats.flower, luxuryVillaRoot);
box('Luxury villa glass coffee table', 2.8, 0.18, 1.8, -5.0, 0.62, 1.8, mats.window, luxuryVillaRoot);
box('Luxury villa chandelier', 0.6, 1.4, 0.6, 0, 3.7, 1.0, mats.npcGold, luxuryVillaRoot);
box('Luxury villa dining table', 4.0, 0.22, 2.0, 5.0, 1.0, 4.0, mats.bench, luxuryVillaRoot);
for (const [x,z] of [[3.5,4.0],[6.5,4.0],[5.0,2.6],[5.0,5.5]]) box('Luxury villa dining chair '+x+' '+z,0.7,0.9,0.7,x,0.45,z,mats.npcGold,luxuryVillaRoot);
box('Luxury villa kitchen island', 5.0, 1.0, 1.7, 5.0, 0.6, -0.3, mats.white, luxuryVillaRoot);
box('Luxury villa kitchen hob', 1.5, 0.08, 1.1, 5.0, 1.15, -0.3, mats.tvFrame, luxuryVillaRoot);
box('Luxury villa bedroom bed base', 4.0, 0.7, 4.2, -5.0, 0.38, -6.2, mats.bench, luxuryVillaRoot);
box('Luxury villa bedroom mattress', 3.85, 0.28, 4.0, -5.0, 0.85, -6.2, mats.white, luxuryVillaRoot);
box('Luxury villa silk blanket', 3.9, 0.14, 2.1, -5.0, 1.04, -7.0, mats.flower, luxuryVillaRoot);
box('Luxury villa headboard', 4.2, 1.7, 0.22, -5.0, 1.15, -8.3, mats.npcGold, luxuryVillaRoot);
box('Luxury villa wardrobe', 2.2, 3.0, 0.9, -0.8, 1.5, -9.2, mats.wallPink, luxuryVillaRoot);
box('Luxury villa spa bath', 3.8, 0.72, 2.0, 6.4, 0.42, -6.8, mats.white, luxuryVillaRoot);
box('Luxury villa spa water', 3.2, 0.12, 1.4, 6.4, 0.83, -6.8, mats.window, luxuryVillaRoot);
box('Luxury villa vanity', 3.2, 1.0, 0.9, 6.0, 0.55, -9.2, mats.bench, luxuryVillaRoot);
box('Luxury villa vanity mirror', 2.6, 1.5, 0.12, 6.0, 2.1, -10.0, mats.npcGold, luxuryVillaRoot);
luxuryVillaRoot.enabled = false;


let activeInteriorRoot = interiorRoot;
let activeIndoorAction = null;
let indoors = false;
let indoorReturnPosition = null;
let outdoorEnabledStates = new Map();
function enterHome(homeName, targetInteriorRoot = interiorRoot, indoorAction = null) {
  if (indoors) return;
  if (vehicleMode) toggleVehicleMode(false);
  if (activeWalkNpc) endSharedWalk('انتهت التمشية لأنك دخلتي البيت. تقدري تبدأي تمشية جديدة بعد الخروج.');
  const position = player.getPosition();
  indoorReturnPosition = new Vec3(position.x, position.y, position.z);
  outdoorEnabledStates = new Map();
  for (const entity of app.root.children) {
    if (entity === player || entity === camera || entity === sun || entity === targetInteriorRoot) continue;
    outdoorEnabledStates.set(entity, entity.enabled);
    entity.enabled = false;
  }
  activeInteriorRoot = targetInteriorRoot;
  activeIndoorAction = indoorAction;
  activeInteriorRoot.enabled = true;
  const indoorActionButton = document.getElementById('indoor-place-action');
  indoorActionButton.hidden = !activeIndoorAction;
  if (activeIndoorAction) indoorActionButton.textContent = activeIndoorAction.label;
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
  if (activeIndoorAction) say('دخلتي ' + homeName + ' ✨ استكشفي المكان، واستخدمي زر النشاط لتجربة خدماته. تقدري ترجعي للحي من زر الخروج.');
  else say('دخلتي ' + homeName + ' 🏡 استكشفي الصالة وغرفة النوم والمطبخ. تقدري ترجعي للحي من زر الخروج.');
}
function exitHome() {
  if (!indoors) return;
  activeInteriorRoot.enabled = false;
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
  document.getElementById('indoor-place-action').hidden = true;
  activeIndoorAction = null;
  say('رجعتي للحي 🌳 كل الأماكن والأنشطة الخارجية رجعت زي ما كانت.');
}

const ui = document.createElement('section');
ui.id = 'life-ui';
ui.innerHTML = `
  <div class="life-stats"><span>💛 السعادة: <b id="happiness">60</b></span><span>⚡ الطاقة: <b id="energy">80</b></span><span>🪙 العملات: <b id="coins">20</b></span><span>🌷 الزهور: <b id="flowers">0</b></span><span>📸 الذكريات: <b id="photo-memories">0</b></span><span>⭐ المستوى: <b id="player-level">1</b></span></div>
  <div id="xp-panel" aria-label="تقدم الخبرة"><div class="xp-label"><span>خبرة اللاعب</span><span id="xp-count">0 / 100 XP</span></div><div id="xp-track" role="progressbar" aria-label="التقدم للمستوى التالي" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><span id="xp-fill"></span></div></div>
  <p id="game-cloud-status" role="status">💾 التقدم محفوظ على هذا الجهاز. سجّلي الدخول لتفعيل النسخة السحابية.</p>
  <div class="avatar-tools"><button id="change-outfit" type="button">👕 تغيير الملابس</button><button id="change-hair" type="button">💇 تغيير لون الشعر</button></div>
  <button id="open-avatar-creator" type="button">✨ تصميم شخصيتي (العمر والشكل)</button>
  <button id="open-shop" type="button">🛍️ افتحي متجر Wonder</button>
  <button id="open-pets" type="button">🐾 حيواناتي الأليفة</button>
  <button id="open-achievements" type="button">🏅 إنجازاتي وتقدمي</button>
  <button id="open-map" type="button">🗺️ خريطة الحي والتنقّل</button>
  <button id="open-home-build" type="button">🏡 تخصيص البيت والحديقة</button>
  <button id="open-walks" type="button">🚶 تمشية مع صديق</button>
  <button id="open-gathering" type="button">🎉 تجمعات العيلة والأصحاب</button>
  <button id="open-wonder-guide" type="button">🤖 مساعد Wonder الإرشادي</button>
  <button id="open-football" type="button">⚽ كرة القدم — تحدّي التسديد</button>
  <button id="open-journal" type="button">📔 سجل مغامراتي</button>
  <div class="avatar-tools"><button id="open-puzzle" type="button">🧩 ألغاز سريعة</button></div>
  <div class="avatar-tools"><button id="open-blockblast" type="button">🟦 Block Blast</button></div>
  <div class="avatar-tools"><button id="open-watersort" type="button">🧪 Water Sort</button></div>
  <div class="avatar-tools"><button id="open-memory-match" type="button">🃏 لعبة ذاكرة الصور</button></div>
  <div class="avatar-tools"><button id="quick-work" type="button">💼 شغل سريع</button><button id="quick-rest" type="button">🛋️ استراحة</button><button id="quick-cafe" type="button">☕ طلب كافيه</button></div>
  <div class="avatar-tools"><button id="quick-gym" type="button">🏋️ تمرين</button><button id="quick-garden" type="button">🌷 جمع زهور</button></div>
  <div class="avatar-tools"><button id="quick-photo" type="button">📸 تصوير ذكرى</button><button id="quick-weather" type="button">🌤️ تغيير الطقس</button></div>
  <div class="avatar-tools"><button id="toggle-vehicle" type="button" aria-pressed="false">🚗 ركوب العربية</button><span id="vehicle-hint" role="status">قيادة تجريبية داخل الحي، والتحكم بنفس أزرار الحركة.</span></div>
  <div id="world-clock" role="status">🕒 نهار هادئ</div>
  <button id="interact" type="button">تفاعل / استكشاف</button>
  <button id="exit-home" type="button" hidden>🚪 الخروج للحي</button>\n  <button id="indoor-place-action" type="button" hidden>تنفيذ نشاط المكان</button>
  <section id="avatar-creator-panel" hidden aria-label="تصميم الشخصية">
    <div class="shop-heading"><strong>✨ استوديو تصميم شخصيتك</strong><button id="close-avatar-creator" type="button" aria-label="إغلاق">✕</button></div>
    <p>اختاري عمر الشخصية من 5 إلى 65 سنة، وطابع المظهر، ودرجة البشرة وتسريحة الشعر. التغييرات تظهر على الشخصية داخل العالم وتُحفظ مع تقدمك.</p>
    <div class="avatar-creator-grid">
      <label for="avatar-age">العمر: <output id="avatar-age-value">22 سنة</output><input id="avatar-age" type="range" min="5" max="65" step="1" value="22"></label>
      <label for="avatar-presentation">ستايل الشخصية<select id="avatar-presentation"><option value="feminine">ستايل أنثوي</option><option value="masculine">ستايل ذكوري</option><option value="neutral">ستايل محايد</option></select></label>
      <label for="avatar-skin">درجة البشرة<select id="avatar-skin"><option value="light">فاتحة</option><option value="medium" selected>قمحية</option><option value="tan">سمراء فاتحة</option><option value="deep">سمراء داكنة</option></select></label>
      <label for="avatar-hair-style">تسريحة الشعر<select id="avatar-hair-style"><option value="short">قصير</option><option value="long" selected>طويل</option><option value="curly">كيرلي</option><option value="bun">كعكة شعر</option></select></label>
    </div>
    <button id="save-avatar-profile" type="button">💾 حفظ شكل شخصيتي</button>
    <p id="avatar-creator-feedback" role="status">كل التغييرات شكلية ومحفوظة داخل تقدم اللعبة.</p>
  </section>
  <section id="shop-panel" hidden aria-label="متجر Wonder">
    <div class="shop-heading"><strong>🛍️ متجر Wonder</strong><button id="close-shop" type="button" aria-label="إغلاق المتجر">✕</button></div>
    <p class="shop-intro">اختاري قطعة، واشتريها بعملاتك، وبعدها تقدري تلبسيها في أي وقت. كل فئة مستقلة، وتقدري تغيّري إطلالتك من غير ما تخسري القطع القديمة.</p>
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
  <section id="home-build-panel" class="wonder-overlay" hidden aria-label="تخصيص البيت">
    <div class="shop-heading"><strong>🏡 ورشة تصميم البيت</strong><button id="close-home-build" type="button" aria-label="إغلاق">✕</button></div>
    <p class="shop-intro">غيّري ألوان واجهة بيتك والسقف، واظهري أو اخفي الشجيرات. التصميم يُحفظ على هذا الجهاز في النسخة التجريبية.</p>
    <h4>لون وخامة الواجهة</h4><div class="avatar-tools"><button type="button" data-home-wall="brick">🧱 طوب أحمر</button><button type="button" data-home-wall="gold">✨ دهبي</button><button type="button" data-home-wall="yellow">🌞 أصفر دافئ</button><button type="button" data-home-wall="cream">🤍 كريمي</button><button type="button" data-home-wall="pink">🌸 وردي</button><button type="button" data-home-wall="mint">🌿 نعناعي</button></div>
    <h4>لون السقف</h4><div class="avatar-tools"><button type="button" data-home-roof="terracotta">🧱 طوبي</button><button type="button" data-home-roof="blue">💙 أزرق</button><button type="button" data-home-roof="gold">✨ ذهبي</button></div>
    <button id="toggle-home-garden" type="button" aria-pressed="true">🌳 إخفاء شجيرات الحديقة</button><p id="home-build-feedback" role="status"></p>
  </section>
  <section id="map-panel" hidden aria-label="خريطة الحي">
    <div class="shop-heading"><strong>🗺️ خريطة WonderWorld</strong><button id="close-map" type="button" aria-label="إغلاق الخريطة">✕</button></div>
    <p class="shop-intro">اختاري مكانًا للانتقال السريع. التنقّل متاح خارج البيوت فقط.</p><div id="map-destinations"></div><p id="map-feedback" role="status"></p>
  </section>
    <section id="social-walk-panel" hidden aria-label="التمشية مع صديق">
    <div class="shop-heading"><strong>🚶 تمشية مع صديق</strong><button id="close-walks" type="button" aria-label="إغلاق">✕</button></div>
    <p class="shop-intro">اختاري شخصية وابعتي طلب تمشية. المشوار يبدأ فقط بعد تأكيد الموافقة؛ تقدري ترفضي الطلب أو تنهي المشوار في أي وقت.</p>
    <p id="walk-consent-status" role="status">مفيش تمشية نشطة. اختاري صديقًا لإرسال طلب.</p><div id="walk-friends"></div>
    <div id="walk-active-tools" hidden><p id="walk-active-text"></p><div class="walk-activity-actions"><button id="walk-picnic" type="button">🧺 نزهة في الحديقة (4 عملات)</button><button id="walk-cafe" type="button">☕ خروجة كافيه (5 عملات)</button><button id="walk-photo" type="button">📸 ذكرى سوا عند النافورة</button><button id="walk-challenge" type="button">🧠 تحدّي تعاون سريع</button></div><p id="walk-activity-feedback" role="status">اختاري نشاطًا لما توصلي للمكان المناسب.</p><button id="end-shared-walk" type="button">👋 إنهاء التمشية</button></div>
    <p class="walk-prototype-note">الشخصيات المتاحة هنا شخصيات NPC داخل النموذج. الموافقة الحقيقية بين لاعبين مختلفين تحتاج حسابات وخادمًا مشتركًا، وده مش متفعّل في النسخة دي.</p>
  </section>
  <section id="gathering-panel" hidden aria-label="تجمعات عائلية وأصدقاء">
    <div class="shop-heading"><strong>🎉 تجمعات العيلة والأصحاب</strong><button id="close-gathering" type="button" aria-label="إغلاق التجمعات">✕</button></div>
    <p class="shop-intro">اختاري تجمعًا ومكانًا، وادعي حتى 3 شخصيات من سكان WonderWorld. كل التفاعل باختيارات جاهزة وردود مناسبة للموقف، من غير دردشة حرة.</p>
    <div class="gathering-controls">
      <label for="gathering-location">📍 مكان التجمع
        <select id="gathering-location"><option value="home">البيت — تجمع عائلي</option><option value="park">حديقة الأصدقاء — نزهة جماعية</option><option value="cafe">كافيه Wonder — خروجة</option></select>
      </label>
      <label for="gathering-event">🎈 المناسبة
        <select id="gathering-event"><option value="lunch">غداء عائلي</option><option value="birthday">عيد ميلاد</option><option value="games">ليلة ألعاب وضحك</option></select>
      </label>
    </div>
    <p><strong>اختاري المشاركين (حتى 3):</strong></p><div id="gathering-invites"></div>
    <button id="start-gathering" type="button">💌 ابدئي التجمع</button>
    <div id="gathering-active" hidden><p id="gathering-status" role="status"></p><div id="gathering-choices"></div><button id="finish-gathering" type="button" hidden>✨ إنهاء التجمع وحفظ الذكرى</button></div>
    <p class="walk-prototype-note">المشاركون حاليًا شخصيات NPC داخل النموذج، وليسوا لاعبين حقيقيين. لا يوجد شات بين اللاعبين أو إدخال رسائل حرة.</p>
  </section>
  <section id="wonder-guide-panel" class="wonder-overlay" hidden aria-label="مساعد Wonder الإرشادي">
    <div class="shop-heading"><strong>🤖 مساعد Wonder</strong><button id="close-wonder-guide" type="button" aria-label="إغلاق">✕</button></div>
    <p class="shop-intro">اختاري سؤالًا من الأسئلة الجاهزة للحصول على إرشاد آمن. النسخة دي لا تستقبل رسائل حرة ولا تتصل بنموذج ذكاء اصطناعي خارجي بعد.</p>
    <div id="wonder-guide-choices"></div>
    <p id="wonder-guide-answer" role="status">أهلًا بيكي! اختاري موضوعًا وسأرشدك داخل اللعبة.</p>
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
    <div class="watersort-actions"><button id="watersort-undo" type="button" disabled>↩️ تراجع عن آخر حركة</button><button id="watersort-restart" type="button">🔄 لغز جديد</button></div>
    <p id="watersort-feedback" role="status">اختاري أنبوبة للبدء.</p>
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
document.getElementById('open-wonder-guide').addEventListener('click', () => { document.getElementById('wonder-guide-panel').hidden = false; });
document.getElementById('close-wonder-guide').addEventListener('click', () => { document.getElementById('wonder-guide-panel').hidden = true; });
const wonderGuideTopics = [
  { question: '🎮 إزاي أبدأ اللعب؟', answer: 'استخدمي الأسهم أو WASD أو أزرار الحركة للمشي، واقتربي من مكان أو شخصية ثم اضغطي «تفاعل / استكشاف» أو Space/Enter. في كرة القدم اختاري اتجاه التسديد من الأزرار أو السهمين يمين/شمال، وR تعيد التدريب. جربي الحديقة والمتجر والألغاز وBlock Blast وWater Sort.' },
  { question: '👗 إزاي أغيّر شعري وهدومي؟', answer: 'افتحي متجر Wonder واختاري القطعة. مشتريات الحساب المسجّل تُراجع على الخادم، أما الدفع بفلوس حقيقية فغير مفعّل. لو زر الشراء ما استجابش، افتحي حساب اللاعب وتحققي من تسجيل الدخول.' },
  { question: '🤝 إزاي أتعامل مع صديق؟', answer: 'في النموذج الحالي تقدري تتفاعلي مع شخصيات NPC. أي زيارة بين لاعبين حقيقيين لازم يكون فيها موافقة واضحة من الطرفين، والنظام المشترك لزيارات اللاعبين لسه غير مكتمل.' },
  { question: '🪙 إزاي أكسب عملات؟', answer: 'الحساب السحابي يحصل على مكافأة يومية حسب قواعد الخادم. الوظائف والمحل ما زالا نموذجًا محليًا، لذلك لا تعتبري أرصدتهما رصيدًا سحابيًا موثوقًا حتى يكتمل الربط الآمن.' },
  { question: '🛡️ إيه أعمل لو حاجة ضايقتني؟', answer: 'أنهي النشاط فورًا ولا تشاركي اسمك الكامل أو عنوانك أو كلمة السر. الدردشة الحرة بين اللاعبين غير متاحة. أدوات البلاغات والإشراف الكامل لسه مطلوبة قبل الإطلاق العام.' }
];
const wonderGuideChoices = document.getElementById('wonder-guide-choices');
wonderGuideTopics.forEach(topic => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'wonder-guide-choice';
  button.textContent = topic.question;
  button.addEventListener('click', () => { document.getElementById('wonder-guide-answer').textContent = topic.answer; });
  wonderGuideChoices.appendChild(button);
});
document.getElementById('open-home-build').addEventListener('click', () => { document.getElementById('home-build-panel').hidden = false; });
document.getElementById('close-home-build').addEventListener('click', () => { document.getElementById('home-build-panel').hidden = true; });
const homeDesignDefaults = { wall: 'brick', roof: 'terracotta', garden: true };
let homeDesign = { ...homeDesignDefaults };
try { const savedDesign = JSON.parse(localStorage.getItem('wonderworld-home-design-v1') || 'null'); if (savedDesign && typeof savedDesign === 'object') homeDesign = { ...homeDesignDefaults, ...savedDesign }; } catch (_) {}
const homeWallMaterials = { cream: mats.wall, brick: mats.wallBrick, gold: mats.wallGold, yellow: mats.wallYellow, pink: mats.wallPink, mint: mats.outfitMint };
const homeRoofMaterials = { terracotta: mats.roof, blue: mats.npcBlue, gold: mats.outfitGold };
function applyHomeDesign() {
  playerHomeBuild.walls.render.material = homeWallMaterials[homeDesign.wall] || mats.wall;
  playerHomeBuild.roof.render.material = homeRoofMaterials[homeDesign.roof] || mats.roof;
  playerHomeBuild.bushes.forEach(bush => { bush.enabled = Boolean(homeDesign.garden); });
  const gardenButton = document.getElementById('toggle-home-garden');
  gardenButton.setAttribute('aria-pressed', String(Boolean(homeDesign.garden)));
  gardenButton.textContent = homeDesign.garden ? '🌳 إخفاء شجيرات الحديقة' : '🌱 إظهار شجيرات الحديقة';
}
function saveHomeDesign(message) {
  try { localStorage.setItem('wonderworld-home-design-v1', JSON.stringify(homeDesign)); } catch (_) {}
  applyHomeDesign();
  document.getElementById('home-build-feedback').textContent = message + ' تم حفظ تصميمك على الجهاز.';
}
document.querySelectorAll('[data-home-wall]').forEach(button => button.addEventListener('click', () => {
  homeDesign.wall = button.dataset.homeWall;
  const labels = { cream: 'الكريمي', brick: 'الطوبي', gold: 'الذهبي', yellow: 'الأصفر', pink: 'الوردي', mint: 'النعناعي' };
  saveHomeDesign('اتغير لون واجهة البيت إلى ' + labels[homeDesign.wall] + '.');
}));
document.querySelectorAll('[data-home-roof]').forEach(button => button.addEventListener('click', () => {
  homeDesign.roof = button.dataset.homeRoof;
  const labels = { terracotta: 'الطوبي', blue: 'الأزرق', gold: 'الذهبي' };
  saveHomeDesign('اتغير لون السقف إلى ' + labels[homeDesign.roof] + '.');
}));
document.getElementById('toggle-home-garden').addEventListener('click', () => {
  homeDesign.garden = !homeDesign.garden;
  saveHomeDesign(homeDesign.garden ? 'رجّعنا شجيرات الحديقة.' : 'اتشالت شجيرات الحديقة من العرض.');
});
applyHomeDesign();
document.getElementById('toggle-vehicle').addEventListener('click', () => { toggleVehicleMode(); document.getElementById('toggle-vehicle').setAttribute('aria-pressed', String(vehicleMode)); });

 // Playable memory-match activity: eight pairs, tap-to-flip, move counter and restart.
 const memoryPanel = document.createElement('section');
 memoryPanel.id = 'memory-match-panel';
 memoryPanel.className = 'wonder-overlay';
 memoryPanel.hidden = true;
 memoryPanel.setAttribute('aria-label', 'لعبة ذاكرة الصور');
 memoryPanel.innerHTML = '<div class="shop-heading"><strong>🃏 لعبة ذاكرة الصور</strong><button id="close-memory-match" type="button" aria-label="إغلاق اللعبة">✕</button></div><p class="shop-intro">اقلبي كارتين في كل مرة، وافتكري أماكن الرموز لحد ما تلاقي كل الأزواج.</p><div class="memory-match-status"><span>الحركات: <b id="memory-moves">0</b></span><span>الأزواج: <b id="memory-pairs">0 / 8</b></span></div><div id="memory-board" aria-label="لوحة كروت الذاكرة"></div><p id="memory-feedback" role="status">جاهزة؟ ابدئي وركزي في أماكن الصور ✨</p><button id="memory-restart" type="button">🔄 لعبة جديدة</button>';
 document.getElementById('game').appendChild(memoryPanel);

const footballPanel = document.createElement('section');
footballPanel.id = 'football-panel';
footballPanel.className = 'wonder-overlay';
footballPanel.hidden = true;
footballPanel.setAttribute('aria-label', 'تحدي كرة القدم');
footballPanel.tabIndex = -1;
footballPanel.innerHTML = '<div class="shop-heading"><strong>⚽ تحدّي كرة القدم</strong><button id="close-football" type="button" aria-label="إغلاق كرة القدم">✕</button></div><p class="shop-intro">حرّكي اللاعبة ناحية الكرة، قرّبي منها، ثم سدّدي نحو المرمى. دي مرحلة لعب أولية قابلة للتحكم؛ مباريات الفرق الكاملة ولسه حركات التمرير والتدخل والحارس المتقدم ضمن التطوير.</p><div class="football-scorebar"><span>الأهداف: <b id="football-score">0</b></span><span>التسديدات: <b id="football-shots">0 / 5</b></span><span>أفضل نتيجة: <b id="football-best">0</b></span></div><div id="football-pitch" role="application" aria-label="ملعب كرة قدم"><div class="football-goal"><span id="football-target" aria-hidden="true"></span></div><div class="football-midline"></div><div class="football-circle"></div><div id="football-keeper" class="football-player keeper" aria-label="حارسة المرمى">🧤</div><div id="football-avatar" class="football-player avatar" aria-label="لاعبة">👟</div><div id="football-ball" aria-label="الكرة">⚽</div></div><div class="football-controls"><div class="football-pad"><button data-foot-dir="up" aria-label="تحركي للأعلى">▲</button><button data-foot-dir="left" aria-label="تحركي لليسار">◀</button><button data-foot-dir="down" aria-label="تحركي للأسفل">▼</button><button data-foot-dir="right" aria-label="تحركي لليمين">▶</button></div><div class="football-aim-controls" role="group" aria-label="اختيار اتجاه التسديد"><button type="button" data-foot-aim="40" aria-pressed="false">↖️ يسار</button><button type="button" data-foot-aim="50" aria-pressed="true">⬆️ وسط</button><button type="button" data-foot-aim="60" aria-pressed="false">↗️ يمين</button></div><button id="football-shoot">🥅 تسديد!</button></div><p id="football-feedback" role="status">ابدئي بتحريك اللاعبة نحو الكرة.</p><button id="football-restart" type="button">🔄 مباراة تدريبية جديدة</button>';
document.getElementById('game').appendChild(footballPanel);



// Keep menus independent from the HUD's scroll area so they can never be clipped by it.
for (const panelId of ['shop-panel', 'pet-panel', 'achievement-panel', 'map-panel', 'journal-panel', 'social-walk-panel', 'puzzle-panel', 'blockblast-panel', 'watersort-panel', 'dialogue-panel', 'football-panel']) {
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

document.getElementById('open-football').addEventListener('click', () => { footballPanel.hidden = false; resetFootballGame(); footballPanel.focus(); });
document.getElementById('close-football').addEventListener('click', () => { footballPanel.hidden = true; });
document.getElementById('football-restart').addEventListener('click', resetFootballGame);
let football = { playerX: 50, playerY: 76, ballX: 50, ballY: 64, keeperX: 50, aimX: 50, score: 0, shots: 0 };
let footballBest = 0;
try { footballBest = Number(localStorage.getItem('wonderworld-football-best')) || 0; } catch (_) {}
function renderFootball() {
  document.getElementById('football-avatar').style.left = football.playerX + '%';
  document.getElementById('football-avatar').style.top = football.playerY + '%';
  document.getElementById('football-ball').style.left = football.ballX + '%';
  document.getElementById('football-ball').style.top = football.ballY + '%';
  document.getElementById('football-keeper').style.left = football.keeperX + '%';
  document.getElementById('football-target').style.left = Math.max(0, Math.min(100, ((football.aimX - 35) / 30) * 100)) + '%';
  document.querySelectorAll('[data-foot-aim]').forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.footAim) === football.aimX)));
  document.getElementById('football-score').textContent = football.score;
  document.getElementById('football-shots').textContent = football.shots + ' / 5';
  document.getElementById('football-best').textContent = footballBest;
}
function resetFootballGame() {
  football = { playerX: 50, playerY: 76, ballX: 50, ballY: 64, keeperX: 50, aimX: 50, score: 0, shots: 0 };
  renderFootball();
  document.getElementById('football-feedback').textContent = 'ابدئي بتحريك اللاعبة نحو الكرة، ثم سدّدي قبل انتهاء المحاولات الخمس.';
  document.getElementById('football-shoot').disabled = false;
}
function moveFootball(dir) {
  if (football.shots >= 5) return;
  const step = 5;
  if (dir === 'up') football.playerY = Math.max(12, football.playerY - step);
  if (dir === 'down') football.playerY = Math.min(91, football.playerY + step);
  if (dir === 'left') football.playerX = Math.max(8, football.playerX - step);
  if (dir === 'right') football.playerX = Math.min(92, football.playerX + step);
  if (Math.hypot(football.playerX - football.ballX, football.playerY - football.ballY) < 12) {
    football.ballX = Math.max(8, Math.min(92, football.ballX + (football.playerX - football.ballX) * 0.48));
    football.ballY = Math.max(8, Math.min(91, football.ballY + (football.playerY - football.ballY) * 0.48));
  }
  renderFootball();
}
function shootFootball() {
  if (football.shots >= 5) return;
  if (Math.hypot(football.playerX - football.ballX, football.playerY - football.ballY) > 13) {
    document.getElementById('football-feedback').textContent = 'قرّبي اللاعبة من الكرة الأول عشان تقدري تسدّدي!';
    return;
  }
  football.shots += 1;
  // Aim is player-controlled. The keeper follows a predictable training pattern,
  // so goals depend on reading the keeper and choosing a different lane, not luck.
  const lane = football.aimX;
  const keeperPattern = [50, 40, 60, 50, 60];
  football.keeperX = keeperPattern[football.shots - 1];
  const scored = Math.abs(lane - football.keeperX) >= 9;
  if (scored) {
    football.score += 1;
    happiness = Math.min(100, happiness + 2);
    awardXP(3);
    logAdventure('سجّلت هدفًا في تحدّي كرة القدم');
    document.getElementById('football-feedback').textContent = 'جوووول! ⚽🥳 هدف جميل!';
  } else {
    document.getElementById('football-feedback').textContent = 'الحارسة صدّت الكرة! شوفي مكانها واختاري الجهة الأبعد في التسديدة الجاية. 🧤';
  }
  football.ballX = lane;
  football.ballY = 18;
  if (football.shots >= 5) {
    if (football.score > footballBest) {
      footballBest = football.score;
      try { localStorage.setItem('wonderworld-football-best', String(footballBest)); } catch (_) {}
    }
    document.getElementById('football-feedback').textContent += ' انتهى التدريب: ' + football.score + ' أهداف من 5. ' + (football.score >= 3 ? 'أداء ممتاز!' : 'حاولي تاني لتحسّني نتيجتك!');
    document.getElementById('football-shoot').disabled = true;
    saveProgress();
  } else {
    football.ballX = 50; football.ballY = 64; football.playerX = 50; football.playerY = 76;
  }
  renderFootball();
}
document.querySelectorAll('[data-foot-dir]').forEach(button => button.addEventListener('click', () => moveFootball(button.dataset.footDir)));
document.querySelectorAll('[data-foot-aim]').forEach(button => button.addEventListener('click', () => {
  if (football.shots >= 5) return;
  football.aimX = Number(button.dataset.footAim);
  renderFootball();
  document.getElementById('football-feedback').textContent = 'اتجاه التسديد اتحدد: ' + (football.aimX < 45 ? 'الزاوية اليسرى' : football.aimX > 55 ? 'الزاوية اليمنى' : 'منتصف المرمى') + '. راقبي الحارسة ثم سدّدي!';
}));
document.getElementById('football-shoot').addEventListener('click', shootFootball);

// Keyboard support for the football mini-game. Focus stays inside the game controls,
// and movement keys won't accidentally trigger the world interaction behind the panel.
footballPanel.addEventListener('keydown', event => {
  if (footballPanel.hidden) return;
  const target = event.target;
  if (target instanceof HTMLElement && target.matches('input, textarea, select, [contenteditable="true"]')) return;
  if (event.code === 'ArrowLeft' || event.code === 'ArrowRight') {
    const lanes = [40, 50, 60];
    const current = Math.max(0, lanes.indexOf(football.aimX));
    const next = event.code === 'ArrowLeft' ? Math.max(0, current - 1) : Math.min(lanes.length - 1, current + 1);
    football.aimX = lanes[next];
    renderFootball();
    document.getElementById('football-feedback').textContent = 'اتجاه التسديد اتحدد من لوحة المفاتيح. اضغطي Enter للتسديد.';
    event.preventDefault();
    event.stopPropagation();
  } else if (event.code === 'Space' || event.code === 'Enter') {
    // Let native button activation work when a real button has focus.
    if (target instanceof HTMLElement && target.closest('button')) return;
    shootFootball();
    event.preventDefault();
    event.stopPropagation();
  } else if (event.code === 'KeyR') {
    resetFootballGame();
    event.preventDefault();
    event.stopPropagation();
  }
});

const outfitOptions = [mats.player, mats.outfitMint, mats.outfitCoral, mats.outfitBlue, mats.outfitGold];
const hairOptions = [mats.player, mats.hairBrown, mats.hairBlack, mats.hairRose];
let outfitIndex = 0;
let hairIndex = 0;
document.getElementById('change-outfit').addEventListener('click', openShop);
document.getElementById('open-avatar-creator').addEventListener('click', () => {
  applyAvatarProfile();
  document.getElementById('avatar-creator-feedback').textContent = 'اختاري التفاصيل، وهتشوفي التغيير على شخصيتك فورًا.';
  document.getElementById('avatar-creator-panel').hidden = false;
});
document.getElementById('close-avatar-creator').addEventListener('click', () => { document.getElementById('avatar-creator-panel').hidden = true; });
document.getElementById('avatar-age').addEventListener('input', event => { avatarProfile.age = Number(event.target.value); applyAvatarProfile(); });
document.getElementById('avatar-presentation').addEventListener('change', event => { avatarProfile.presentation = event.target.value; applyAvatarProfile(); });
document.getElementById('avatar-skin').addEventListener('change', event => { avatarProfile.skin = event.target.value; applyAvatarProfile(); });
document.getElementById('avatar-hair-style').addEventListener('change', event => { avatarProfile.hairStyle = event.target.value; applyAvatarProfile(); });
document.getElementById('save-avatar-profile').addEventListener('click', () => {
  applyAvatarProfile();
  saveProgress();
  document.getElementById('avatar-creator-feedback').textContent = 'اتحفظ شكل شخصيتك وعمرها على الجهاز، وهيتزامن مع حسابك لو تسجيل الدخول السحابي متاح. ✨';
  say('حفظنا شكل شخصيتك الجديد! تقدري ترجعي تغيريه وقت ما تحبي.');
});

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
let activeWalkNpc = null;
let walkVisitedDestinations = new Set();
let walkRewardDate = (()=>{try{return localStorage.getItem('wonderworld-shared-walk-reward-day')||'';}catch{return '';}})();
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
const npcGiftDates = {};
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
const avatarProfile = { age: 22, presentation: 'feminine', skin: 'medium', hairStyle: 'long' };
const avatarSkinMaterials = { light: mats.skinLight, medium: mats.skin, tan: mats.skinTan, deep: mats.skinDeep };
function applyAvatarProfile() {
  const age = Math.max(5, Math.min(65, Number(avatarProfile.age) || 22));
  avatarProfile.age = age;
  const scale = age <= 12 ? 0.68 + (age - 5) * 0.022 : age <= 18 ? 0.834 + (age - 12) * 0.023 : age <= 25 ? 0.972 + (age - 18) * 0.004 : 1 + Math.min(0.035, (age - 25) * 0.000875);
  player.setLocalScale(scale, scale, scale);
  player.headPart.setLocalScale(0.78 * (age <= 12 ? 1.1 : age <= 18 ? 1.04 : 1), 0.78 * (age <= 12 ? 1.1 : age <= 18 ? 1.04 : 1), 0.78 * (age <= 12 ? 1.1 : age <= 18 ? 1.04 : 1));
  const bodyWidth = avatarProfile.presentation === 'masculine' ? 0.9 : avatarProfile.presentation === 'feminine' ? 0.76 : 0.82;
  player.bodyPart.setLocalScale(bodyWidth, 1.22, 0.58);
  player.leftArm.setLocalPosition(-bodyWidth / 2 - 0.13, 1.0, 0);
  player.rightArm.setLocalPosition(bodyWidth / 2 + 0.13, 1.0, 0);
  const skin = avatarSkinMaterials[avatarProfile.skin] || mats.skin;
  player.skinParts.forEach(part => { part.render.material = skin; });
  for (const [style, parts] of Object.entries(avatarHairStyles)) for (const part of parts) part.enabled = style === avatarProfile.hairStyle;
  const ageLabel = document.getElementById('avatar-age-value');
  if (ageLabel) ageLabel.textContent = age + ' سنة';
  const ageInput = document.getElementById('avatar-age');
  if (ageInput && ageInput.value !== String(age)) ageInput.value = String(age);
  const presentation = document.getElementById('avatar-presentation');
  if (presentation) presentation.value = avatarProfile.presentation;
  const skinInput = document.getElementById('avatar-skin');
  if (skinInput) skinInput.value = avatarProfile.skin;
  const hairInput = document.getElementById('avatar-hair-style');
  if (hairInput) hairInput.value = avatarProfile.hairStyle;
}

let loadedProgress = null;
const ownedHomes = new Set(['starter-villa']);
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
function renderWalkPanel() {
 const list=document.getElementById('walk-friends');if(!list)return;list.replaceChildren();
 const status=document.getElementById('walk-consent-status'),activeTools=document.getElementById('walk-active-tools'),activeText=document.getElementById('walk-active-text');
 if(activeWalkNpc){status.textContent='الموافقة اتأكدت من الطرفين داخل النموذج ✅';activeTools.hidden=false;activeText.textContent='بتتمشّي دلوقتي مع '+activeWalkNpc.name+'. تقدري تتحركي بحرية وتزوروا أماكن الحي سوا.';}
 else{status.textContent='اختاري صديقًا لإرسال طلب تمشية. مفيش حركة مشتركة قبل الموافقة.';activeTools.hidden=true;}
 for(const npc of npcs){
  const card=document.createElement('article');card.className='walk-friend-card';
  const title=document.createElement('strong');title.textContent=npc.name+' — '+npc.role;
  const detail=document.createElement('p');detail.textContent='مستوى الصداقة: '+npc.relation+'/10 • '+npc.favorite;
  const giftRow=document.createElement('div');giftRow.className='walk-gift-actions';
  const giftButton=document.createElement('button');giftButton.type='button';giftButton.textContent='🌷 وردة (3 عملات)';
  const cafeButton=document.createElement('button');cafeButton.type='button';cafeButton.textContent='☕ دعوة كافيه (5 عملات)';
  const giveGift=(kind,cost,label)=>{
   if(npcGiftDates[npc.name]===localDateKey()){status.textContent='قدّمتي هدية أو دعوة لـ'+npc.name+' النهارده بالفعل. جربي بكرة!';return;}
   if(npc.relation>=10){status.textContent='صداقتك مع '+npc.name+' وصلت لأقصى مستوى!';return;}
   if(coins<cost){status.textContent='محتاجه '+cost+' عملات عشان '+label+'.';return;}
   coins-=cost;npc.relation=Math.min(10,npc.relation+1);happiness=Math.min(100,happiness+(kind==='cafe'?5:3));npcGiftDates[npc.name]=localDateKey();
   saveProgress();updateStats();awardXP(4);logAdventure('قدّمت '+label+' إلى '+npc.name+' وزادت الصداقة');status.textContent='🎁 '+npc.name+' فرحت بـ'+label+'! مستوى الصداقة '+npc.relation+'/10. هدية أو دعوة واحدة لكل شخصية يوميًا.';
   renderWalkPanel();say('💚 لحظة لطيفة مع '+npc.name+'! الصداقة زادت.');
  };
  giftButton.addEventListener('click',()=>giveGift('flower',3,'وردة'));cafeButton.addEventListener('click',()=>giveGift('cafe',5,'دعوة كافيه'));
  giftButton.disabled=npcGiftDates[npc.name]===localDateKey();cafeButton.disabled=npcGiftDates[npc.name]===localDateKey();
  giftRow.append(giftButton,cafeButton);
  const invite=document.createElement('button');invite.type='button';invite.textContent=activeWalkNpc===npc?'التمشية نشطة':'🚶 طلب تمشية';invite.disabled=Boolean(activeWalkNpc);
  invite.addEventListener('click',()=>{
   if(activeWalkNpc||indoors){status.textContent=indoors?'اخرجي من البيت الأول قبل بدء التمشية.':'في تمشية نشطة بالفعل؛ انهيها الأول.';return;}
   const consent=document.createElement('div');consent.className='walk-consent-card';
   const question=document.createElement('p');question.textContent='طلبتي من '+npc.name+' تتمشوا سوا. هل توافق '+npc.name+' على الدعوة؟ اختاري رد الشخصية بوضوح.';
   const accept=document.createElement('button');accept.type='button';accept.textContent='💚 موافقة — نتمشى سوا';
   const decline=document.createElement('button');decline.type='button';decline.textContent='🙅 اعتذار عن التمشية';
   accept.addEventListener('click',()=>{if(activeWalkNpc||indoors)return;activeWalkNpc=npc;walkVisitedDestinations=new Set();npc.entity.enabled=true;const p=player.getPosition();npc.entity.setPosition(p.x-1.5,0,p.z-1.5);logAdventure('بدأت تمشية بموافقة متبادلة مع '+npc.name);say('🚶 '+npc.name+' وافقت! اتحركي، وهتتمشى معاكي في الحي.');renderWalkPanel();});
   decline.addEventListener('click',()=>{status.textContent=npc.name+' اعتذرت عن التمشية. مفيش حركة مشتركة، وتقدري تختاري نشاطًا تانيًا.';invite.disabled=false;consent.remove();say('💬 '+npc.name+' اعتذرت بلطف؛ مفيش تمشية من غير موافقة.');});
   consent.append(question,accept,decline);card.appendChild(consent);invite.disabled=true;status.textContent='تم إرسال الدعوة. المشوار مش هيبدأ إلا بعد اختيار الموافقة.';
  });
  card.append(title,detail,giftRow,invite);list.appendChild(card);
 }
}
function startSharedCoopChallenge(){
 const status=document.getElementById('walk-activity-feedback');
 if(!activeWalkNpc){status.textContent='ابدئي تمشية بموافقة واضحة الأول.';return;}
 if(indoors){status.textContent='التحدّي متاح في الحي الخارجي.';return;}
 const companion=activeWalkNpc;
 const key='wonderworld-coop-challenge-'+companion.name+'-'+localDateKey();
 try{if(localStorage.getItem(key)==='done'){status.textContent='كمّلتوا تحدّي التعاون مع '+companion.name+' النهارده بالفعل. تحدّي جديد بكرة!';return;}}catch{}
 const rounds=[
  {question:'لغز تعاون: إيه اللي بييجي بعد 2، 4، 6؟',options:['7','8','10'],answer:'8'},
  {question:'عشان الحديقة تفضل جميلة، نعمل إيه؟',options:['نرمي الزبالة','نحافظ على النظافة','نكسر الزرع'],answer:'نحافظ على النظافة'},
  {question:'لو صديقك محتاج مساعدة في لعبة، الأفضل…',options:['نسمعه ونتعاون','نضحك عليه','نمنعه يلعب'],answer:'نسمعه ونتعاون'}
 ];
 const round=rounds[Math.floor(Math.random()*rounds.length)];
 status.replaceChildren();
 const q=document.createElement('strong');q.textContent=round.question;status.appendChild(q);
 const choices=document.createElement('div');choices.className='walk-challenge-options';
 for(const option of round.options){
  const b=document.createElement('button');b.type='button';b.textContent=option;
  b.addEventListener('click',()=>{
   if(!activeWalkNpc||activeWalkNpc!==companion){status.textContent='التحدّي اتوقف لأن التمشية انتهت.';return;}
   if(option!==round.answer){status.textContent='قربتي! جرّبي إجابة تانية، والتعاون أهم من السرعة 💚';return;}
   try{localStorage.setItem(key,'done');}catch{}
   companion.relation=Math.min(10,companion.relation+1);happiness=Math.min(100,happiness+4);
   updateStats();awardXP(8);saveProgress();logAdventure('نجحت في تحدّي تعاون مع '+companion.name);
   status.textContent='🎉 إجابة صحيحة! +1 صداقة، +4 سعادة، +8 XP. التحدّي مرة واحدة يوميًا لكل شخصية.';
   say('🧠 حلّيتوا التحدّي سوا! الصداقة بتكبر بالتعاون.');
   for(const choiceButton of choices.querySelectorAll('button'))choiceButton.disabled=true;
  });
  choices.appendChild(b);
 }
 status.appendChild(choices);
}
function takeSharedWalkPhoto(){
 const status=document.getElementById('walk-activity-feedback');
 if(!activeWalkNpc){status.textContent='ابدئي تمشية مع صديق بموافقة واضحة الأول.';return;}
 if(indoors){status.textContent='الذكرى المشتركة محتاجة تكونوا في الساحة الخارجية.';return;}
 const p=player.getPosition();
 if(Math.hypot(p.x,p.z)>4.2){status.textContent='اتنقلوا لنافورة الساحة من الخريطة عشان تسجلوا ذكرى سوا.';return;}
 const companion=activeWalkNpc;
 const key='wonderworld-shared-photo-'+companion.name+'-'+localDateKey();
 try{if(localStorage.getItem(key)==='done'){status.textContent='سجلتوا ذكرى عند النافورة مع '+companion.name+' النهارده بالفعل. ارجعوا بكرة لذكرى جديدة!';return;}}catch{}
 try{localStorage.setItem(key,'done');}catch{}
 photoMemories+=1;happiness=Math.min(100,happiness+5);updateStats();awardXP(5);saveProgress();
 logAdventure('ذكرى مشتركة عند نافورة WonderWorld مع '+companion.name);
 status.textContent='📸 اتسجلت ذكرى مشتركة مع '+companion.name+'! +5 سعادة و+5 XP. دي ذكرى داخل اللعبة وليست صورة محفوظة من الكاميرا.';
 say('💖 ذكرى جميلة اتضافت لسجلك مع '+companion.name+'!');
}
function doSharedWalkActivity(kind){
 const status=document.getElementById('walk-activity-feedback');
 if(!activeWalkNpc){status.textContent='ابدئي تمشية بموافقة واضحة الأول.';return;}
 if(indoors){status.textContent='النشاط محتاج تكونوا في الحي الخارجي.';return;}
 const activity=kind==='picnic'?{name:'نزهة في الحديقة',cost:4,x:-11,z:5.5,radius:4.5,key:'picnic'}:{name:'خروجة كافيه',cost:5,x:15,z:-4,radius:4.5,key:'cafe'};
 const p=player.getPosition();
 if(Math.hypot(p.x-activity.x,p.z-activity.z)>activity.radius){status.textContent='روحوا '+activity.name+' الأول من خريطة الحي، وبعدها ابدئي النشاط.';return;}
 const rewardKey='wonderworld-walk-'+activity.key+'-'+activeWalkNpc.name+'-'+localDateKey();
 try{if(localStorage.getItem(rewardKey)==='done'){status.textContent='عملتوا النشاط ده مع '+activeWalkNpc.name+' النهارده بالفعل. جربوه بكرة!';return;}}catch{}
 if(coins<activity.cost){status.textContent='محتاجين '+activity.cost+' عملات افتراضية للنشاط ده.';return;}
 const companion=activeWalkNpc;coins-=activity.cost;companion.relation=Math.min(10,companion.relation+1);happiness=Math.min(100,happiness+7);
 try{localStorage.setItem(rewardKey,'done');}catch{}
 updateStats();awardXP(8);saveProgress();logAdventure('عملت '+activity.name+' مع '+companion.name+' بموافقة التمشية');
 status.textContent='✨ وقت لطيف مع '+companion.name+'! +1 صداقة، +7 سعادة، +8 XP. النشاط مرة واحدة يوميًا لكل شخصية.';
 say('💚 خلصتوا '+activity.name+' سوا! علاقتكم بقت أقوى.');
}
function endSharedWalk(reason='انتهت التمشية بناءً على طلبك.'){
 if(!activeWalkNpc)return;const name=activeWalkNpc.name;activeWalkNpc=null;walkVisitedDestinations.clear();
 document.getElementById('walk-consent-status').textContent=reason;document.getElementById('walk-active-tools').hidden=true;
 logAdventure('انتهت التمشية مع '+name);say('👋 انتهت التمشية مع '+name+'. تقدري تبعتي دعوة جديدة في أي وقت.');renderWalkPanel();
}
function renderNeighborhoodMap() {
 const list=document.getElementById('map-destinations');if(!list)return;list.replaceChildren();
 const destinations=[{name:'نافورة الساحة',emoji:'⛲',x:0,z:3},{name:'حديقة الأصدقاء',emoji:'🌳',x:-11,z:5.5},{name:'متجر Wonder',emoji:'🛍️',x:10,z:4.5},{name:'كافيه Wonder',emoji:'☕',x:15,z:-4},{name:'مكتب الحي',emoji:'💼',x:0,z:-20},{name:'Wonder Fitness',emoji:'🏋️',x:15,z:-19},{name:'مطار Wonder Air',emoji:'✈️',x:34,z:-28},{name:'محطة Wonder Central',emoji:'🚆',x:-30,z:-20},{name:'منصة عروض الأزياء',emoji:'👗',x:25,z:15},{name:'البيت الأول',emoji:'🏡',x:-10,z:-6.2},{name:'البيت العائلي',emoji:'🏠',x:10,z:-6.2},{name:'فيلا Wonder الجاهزة (مجانية)',emoji:'🏡',x:-24,z:-8,homeId:'starter-villa',price:0},{name:'فيلا Wonder الفاخرة (250 عملة)',emoji:'💎',x:24,z:-8,homeId:'luxury-villa',price:250},{name:'رحلة إلى مصر — الأهرامات',emoji:'🇪🇬',x:30,z:5},{name:'رحلة إلى باريس — البرج',emoji:'🇫🇷',x:-30,z:5},{name:'رحلة إلى طوكيو — حديقة الساكورا',emoji:'🇯🇵',x:0,z:35}];
 for(const d of destinations){const b=document.createElement('button');b.type='button';b.className='map-destination';b.textContent=d.emoji+' '+d.name;b.addEventListener('click',()=>{if(indoors){document.getElementById('map-feedback').textContent='اخرجي للحي الأول قبل التنقّل السريع.';return;}if(d.homeId&&!ownedHomes.has(d.homeId)){if(coins<d.price){document.getElementById('map-feedback').textContent='تحتاجي '+d.price+' عملة افتراضية لشراء الفيلا دي. رصيدك '+coins+'.';return;}if(d.price>0){coins-=d.price;updateStats();}ownedHomes.add(d.homeId);saveProgress();document.getElementById('map-feedback').textContent=d.price===0?'الفيلا الجاهزة بقت ملكك، اضغطي عليها مرة تانية للانتقال إليها.':'مبروك! الفيلا الفاخرة بقت ملكك، اضغطي عليها مرة تانية للانتقال إليها.';renderNeighborhoodMap();return;}player.setPosition(d.x,0,d.z);cameraX=d.x;cameraZ=d.z+cameraOffsetZ;camera.setPosition(cameraX,cameraHeight,cameraZ);camera.lookAt(d.x,1,d.z);document.getElementById('map-panel').hidden=true;logAdventure('وصلت إلى '+d.name);if(activeWalkNpc){walkVisitedDestinations.add(d.name);if(walkVisitedDestinations.size>=3&&walkRewardDate!==localDateKey()){walkRewardDate=localDateKey();try{localStorage.setItem('wonderworld-shared-walk-reward-day',walkRewardDate);}catch{}happiness=Math.min(100,happiness+8);coins+=5;updateStats();awardXP(12);logAdventure('مغامرة تمشية مكتملة مع '+activeWalkNpc.name+' — زرت 3 أماكن مختلفة');say('🌟 مغامرة مشتركة رائعة! زرتوا 3 أماكن مع '+activeWalkNpc.name+'؛ +8 سعادة و+5 عملات و+12 XP. المكافأة مرة واحدة يوميًا.');}else{say('🗺️ وصلتي إلى '+d.name+' مع '+activeWalkNpc.name+'! زارتم '+walkVisitedDestinations.size+' من 3 أماكن للمغامرة المشتركة.');}}else{say('🗺️ وصلتي إلى '+d.name+'!');}});list.appendChild(b);}
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
    { emoji:'⭐', name:'نجمة صاعدة', detail:'وصلي للمستوى 3', done:playerLevel>=3 },
    { emoji:'🎮', name:'عاشقة الألعاب', detail:'سجّلي نتيجة في لعبة الذاكرة أو Block Blast', done:(()=>{try{return Number(localStorage.getItem('wonderworld-memory-best'))>0||Number(localStorage.getItem('wonderworld-blockblast-best'))>0;}catch{return false;}})() },
    { emoji:'📅', name:'ملتزمة بعالمها', detail:'كمّلي كل مهام اليوم', done:dailyQuests.friend&&dailyQuests.park&&dailyQuests.shop&&dailyQuests.flowers },
    { emoji:'🔥', name:'سلسلة الاستمرار', detail:'ادخلي WonderWorld في 3 أيام متتالية', done:(()=>{try{return Number(localStorage.getItem('wonderworld-login-streak'))>=3;}catch{return false;}})() },
    { emoji:'🗺️', name:'مستكشفة الحي', detail:'كمّلي مغامرة تمشية بزيارة 3 أماكن', done:(()=>{try{return localStorage.getItem('wonderworld-shared-walk-reward-day')===localDateKey();}catch{return false;}})() }
  ];
  const unlocked=definitions.filter(item=>item.done).length;
  summary.textContent='فتحتي '+unlocked+' من '+definitions.length+' إنجازات. سلسلة دخولك الحالية: '+(Number((()=>{try{return localStorage.getItem('wonderworld-login-streak')||0;}catch{return 0;}})())||0)+' يوم. كمّلي استكشاف العالم لفتح الباقي!';
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
    awardXP(10);
    say('برافو! خلّصتي كل مهام اليوم 🎉 مكافأة: 15 عملة و+10 سعادة و+10 XP.');
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
const GAME_SAVE_KEY = 'wonderworld-save-v1';
const ACTIVE_CLOUD_USER_KEY = 'wonderworld-active-cloud-user-v1';
let gameCloudUserId = null;
let gameCloudReady = false;
let gameCloudTimer = null;
let gameCloudSyncToken = 0;
const GAME_RECORD_KEYS = [
  'wonderworld-football-best', 'wonderworld-blockblast-best',
  'wonderworld-memory-best', 'wonderworld-memory-best-moves', 'wonderworld-memory-reward-day',
  'wonderworld-login-streak', 'wonderworld-last-daily-reward',
  'wonderworld-shared-walk-reward-day'
];
function readGameRecords() {
  const records = {};
  try { for (const key of GAME_RECORD_KEYS) { const value = localStorage.getItem(key); if (value !== null) records[key] = value; } } catch (_) {}
  return records;
}
function buildProgressSnapshot() {
  return {
    coins, happiness, energy, playerLevel, playerXP, gardenFlowers, lastFlowerDay,
    photoMemories, lastPhotoDay, adventureLog: adventureLog.slice(-30), questDate,
    dailyQuests: { ...dailyQuests }, ownedItems: [...ownedItems],
    relationships: Object.fromEntries(npcs.map(npc => [npc.name, npc.relation])),
    npcInteractionDates: { ...npcInteractionDates }, npcGiftDates: { ...npcGiftDates },
    equippedItems: { ...equippedItems }, avatarProfile: { ...avatarProfile }, ownedHomes: [...ownedHomes], ownedPets: [...ownedPets], activePetId,
    petCareState: { ...petCareState }, petSupplies: { ...petSupplies }, petNames: { ...petNames },
    deviceRecords: readGameRecords()
  };
}
function stableJSON(value) {
  if (Array.isArray(value)) return '[' + value.map(stableJSON).join(',') + ']';
  if (value && typeof value === 'object') return '{' + Object.keys(value).sort().map(key => JSON.stringify(key) + ':' + stableJSON(value[key])).join(',') + '}';
  return JSON.stringify(value);
}
const saveProgress = () => {
  const snapshot = buildProgressSnapshot();
  try { localStorage.setItem(GAME_SAVE_KEY, JSON.stringify(snapshot)); } catch (_) {}
  if (!gameCloudReady || !gameCloudUserId || !window.wonderWorldSupabase) return;
  if (gameCloudTimer) window.clearTimeout(gameCloudTimer);
  gameCloudTimer = window.setTimeout(async () => {
    const userId = gameCloudUserId;
    const status = document.getElementById('game-cloud-status');
    try {
      const { error } = await window.wonderWorldSupabase.from('player_game_saves').upsert({
        player_id: userId, save_data: buildProgressSnapshot(), updated_at: new Date().toISOString()
      }, { onConflict: 'player_id' });
      if (error) throw error;
      if (gameCloudUserId === userId && status) status.textContent = '☁️ تقدم العالم والمهام والملابس والحيوانات محفوظ على حسابك.';
    } catch (error) {
      console.warn('WonderWorld game cloud save failed:', error);
      if (gameCloudUserId === userId && status) status.textContent = '⚠️ التقدم محفوظ على الجهاز؛ تعذّرت المزامنة السحابية الآن.';
    }
  }, 650);
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
    if (Array.isArray(loadedProgress.ownedHomes)) loadedProgress.ownedHomes.filter(id => ['starter-villa','luxury-villa'].includes(id)).forEach(id => ownedHomes.add(id));
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
    if (loadedProgress.npcGiftDates && typeof loadedProgress.npcGiftDates === 'object') {
      for (const npc of npcs) {
        const date = loadedProgress.npcGiftDates[npc.name];
        if (typeof date === 'string') npcGiftDates[npc.name] = date;
      }
    }
    if (loadedProgress.avatarProfile && typeof loadedProgress.avatarProfile === 'object') {
      const profile = loadedProgress.avatarProfile;
      if (Number.isFinite(profile.age)) avatarProfile.age = Math.max(5, Math.min(65, Math.floor(profile.age)));
      if (['feminine','masculine','neutral'].includes(profile.presentation)) avatarProfile.presentation = profile.presentation;
      if (['light','medium','tan','deep'].includes(profile.skin)) avatarProfile.skin = profile.skin;
      if (['short','long','curly','bun'].includes(profile.hairStyle)) avatarProfile.hairStyle = profile.hairStyle;
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

// Sync the complete browser-game progression to a private row belonging to the signed-in player.
// A cloud import is applied before gameplay state is uploaded; client-side coins remain prototype-only.
window.addEventListener('wonderworld:auth-state', async event => {
  ensureStaticWorldVisible();
  const userId = event.detail?.user?.id || null;
  gameCloudUserId = userId;
  gameCloudReady = false;
  gameCloudSyncToken += 1;
  const token = gameCloudSyncToken;
  if (gameCloudTimer) window.clearTimeout(gameCloudTimer);
  const status = document.getElementById('game-cloud-status');
  if (!userId || !window.wonderWorldSupabase) {
    if (status) status.textContent = '💾 التقدم محفوظ على هذا الجهاز. سجّلي الدخول لتفعيل النسخة السحابية.';
    return;
  }
  if (status) status.textContent = '☁️ جاري فحص الحفظ السحابي…';
  try {
    const client = window.wonderWorldSupabase;
    const { data, error } = await client.from('player_game_saves')
      .select('save_data,updated_at').eq('player_id', userId).maybeSingle();
    if (error) throw error;
    if (token !== gameCloudSyncToken || gameCloudUserId !== userId) return;
    if (!data?.save_data || typeof data.save_data !== 'object' || Array.isArray(data.save_data)) {
      let priorCloudUser = '';
      try { priorCloudUser = localStorage.getItem(ACTIVE_CLOUD_USER_KEY) || ''; } catch (_) {}
      if (priorCloudUser && priorCloudUser !== userId) {
        try {
          localStorage.removeItem(GAME_SAVE_KEY);
          for (const key of GAME_RECORD_KEYS) localStorage.removeItem(key);
          localStorage.setItem(ACTIVE_CLOUD_USER_KEY, userId);
        } catch (_) {}
        window.location.reload();
        return;
      }
      try { localStorage.setItem(ACTIVE_CLOUD_USER_KEY, userId); } catch (_) {}
      gameCloudReady = true;
      if (status) status.textContent = '☁️ الحساب جاهز؛ جاري حفظ تقدم اللعبة عليه.';
      saveProgress();
      return;
    }
    let cloudSave = data.save_data;
    if (cloudSave.questDate !== todayQuestKey) {
      cloudSave = { ...cloudSave, questDate: todayQuestKey, dailyQuests: { friend:false, park:false, shop:false, flowers:false, rewarded:false } };
    }
    let localSave = null;
    try { localSave = JSON.parse(localStorage.getItem(GAME_SAVE_KEY) || 'null'); } catch (_) {}
    const differs = stableJSON(localSave) !== stableJSON(cloudSave);
    if (differs) {
      try {
        localStorage.setItem(GAME_SAVE_KEY, JSON.stringify(cloudSave));
        if (cloudSave.deviceRecords && typeof cloudSave.deviceRecords === 'object') {
          for (const key of GAME_RECORD_KEYS) {
            if (typeof cloudSave.deviceRecords[key] === 'string') localStorage.setItem(key, cloudSave.deviceRecords[key]);
            else localStorage.removeItem(key);
          }
        }
        localStorage.setItem(ACTIVE_CLOUD_USER_KEY, userId);
      } catch (_) {}
      if (status) status.textContent = '☁️ تم العثور على تقدمك السحابي؛ جاري تحميله…';
      window.location.reload();
      return;
    }
    try { localStorage.setItem(ACTIVE_CLOUD_USER_KEY, userId); } catch (_) {}
    gameCloudReady = true;
    if (stableJSON(cloudSave) !== stableJSON(data.save_data)) {
      const { error: normalizeError } = await client.from('player_game_saves').upsert({
        player_id: userId, save_data: cloudSave, updated_at: new Date().toISOString()
      }, { onConflict: 'player_id' });
      if (normalizeError) throw normalizeError;
    }
    if (status) status.textContent = '☁️ الحساب متصل؛ مزامنة تقدم العالم مفعّلة.';
    if (differs) saveProgress();
  } catch (error) {
    console.warn('WonderWorld game cloud load failed:', error);
    if (token === gameCloudSyncToken && status) status.textContent = '⚠️ تعذّرت المزامنة السحابية؛ الحفظ المحلي مستمر.';
  }
});
window.addEventListener('wonderworld:cloud-wallet-updated', () => {
  const shopPanel = document.getElementById('shop-panel');
  if (shopPanel && !shopPanel.hidden) void refreshCloudEconomyPanel('تم تحديث الرصيد السحابي من أجر الوظيفة.');
});

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
document.getElementById('open-walks').addEventListener('click',()=>{renderWalkPanel();document.getElementById('social-walk-panel').hidden=false});

let activeGathering = null;
const gatheringEvents = {
 lunch: { title: 'غداء عائلي', choices: [
   { label: '🍽️ أساعد في تجهيز السفرة', reply: 'الكل انبسط من روح التعاون!' },
   { label: '😂 أحكي موقفًا مضحكًا', reply: 'ضحكتم سوا والجو بقى ألطف!' },
   { label: '💗 أشكر كل الموجودين', reply: 'الكلمة الحلوة قرّبتكم من بعض!' }
 ]},
 birthday: { title: 'عيد ميلاد', choices: [
   { label: '🎂 أغني مع الكل', reply: 'احتفلتوا سوا وصنعتوا ذكرى جميلة!' },
   { label: '🎁 أقدم هدية رمزية', reply: 'الهدية اللطيفة فرّحت صاحب المناسبة!' },
   { label: '🎲 أختار لعبة جماعية', reply: 'اللعبة جمعت الكل في لحظة ممتعة!' }
 ]},
 games: { title: 'ليلة ألعاب وضحك', choices: [
   { label: '🧩 أختار لغزًا لطيفًا', reply: 'فكرتوا سوا وشجعتوا بعض!' },
   { label: '🎉 أشجع كل المشاركين', reply: 'التشجيع خلّى الجو مرح من غير ضغط!' },
   { label: '🤝 أبدّل اللعبة عشان الكل يشارك', reply: 'كل شخص لقى طريقة يشارك بيها!' }
 ]}
};
function renderGatheringInvites() {
 const list=document.getElementById('gathering-invites');list.replaceChildren();
 npcs.forEach((npc,index)=>{
  const label=document.createElement('label');label.className='gathering-invite';
  const input=document.createElement('input');input.type='checkbox';input.value=npc.name;input.checked=index<2;
  input.addEventListener('change',()=>{
   const chosen=list.querySelectorAll('input[type="checkbox"]:checked');
   if(chosen.length>3){input.checked=false;document.getElementById('gathering-status').textContent='مسموح بدعوة 3 شخصيات بحد أقصى.';}
  });
  const name=document.createElement('span');name.textContent=npc.name+' — '+npc.role+' · صداقة '+npc.relation+'/10';
  label.append(input,name);list.append(label);
 });
}
function moveToGatheringPlace(location) {
 if(location==='home'){
  if(indoors) exitHome();
  enterHome('تجمع عائلي في البيت',interiorRoot);
  return 'البيت';
 }
 if(location==='cafe'){
  if(indoors) exitHome();
  enterHome('خروجة جماعية في كافيه Wonder',cafeInteriorRoot,{label:'☕ طلب من الكافيه',run:orderCafe});
  return 'كافيه Wonder';
 }
 if(indoors) exitHome();
 player.setPosition(-11,0,6.5);cameraX=-11;cameraZ=6.5+cameraOffsetZ;
 camera.setPosition(cameraX,cameraHeight,cameraZ);camera.lookAt(-11,1,6.5);
 return 'حديقة الأصدقاء';
}
function renderGatheringChoices() {
 const wrap=document.getElementById('gathering-choices');wrap.replaceChildren();
 const event=gatheringEvents[activeGathering.event];
 for(const npc of activeGathering.participants){
  const card=document.createElement('article');card.className='walk-friend-card gathering-person';
  const title=document.createElement('strong');title.textContent='💬 '+npc.name+' — '+event.title;
  const reaction=document.createElement('p');reaction.className='gathering-reaction';reaction.textContent=activeGathering.responded.has(npc.name)?'شاركتي مع '+npc.name+' بالفعل.':'اختاري رد فعلك في الموقف:';
  const row=document.createElement('div');row.className='walk-gift-actions';
  event.choices.forEach(choice=>{
   const b=document.createElement('button');b.type='button';b.textContent=choice.label;b.disabled=activeGathering.responded.has(npc.name);
   b.addEventListener('click',()=>{
    if(!activeGathering||activeGathering.responded.has(npc.name))return;
    activeGathering.responded.add(npc.name);
    npc.relation=Math.min(10,npc.relation+1);
    happiness=Math.min(100,happiness+3);energy=Math.max(0,energy-1);
    awardXP(4);updateStats();saveProgress();
    reaction.textContent=npc.name+': '+choice.reply+' 💖';
    row.querySelectorAll('button').forEach(button=>button.disabled=true);
    const completed=activeGathering.responded.size===activeGathering.participants.length;
    document.getElementById('gathering-status').textContent=completed?'كل المشاركين تفاعلوا! السعادة زادت والصداقة اتحسنت. تقدري تحفظي الذكرى دلوقتي.':'تفاعل لطيف! اختاري ردًا لكل شخصية من المشاركين.';
    document.getElementById('finish-gathering').hidden=!completed;
    logAdventure('تجمع '+event.title+' في '+activeGathering.place+' مع '+npc.name);
   });
   row.append(b);
  });
  card.append(title,reaction,row);wrap.append(card);
 }
}
document.getElementById('open-gathering').addEventListener('click',()=>{
 renderGatheringInvites();
 document.getElementById('gathering-active').hidden=true;
 document.getElementById('gathering-status').textContent='';
 document.getElementById('finish-gathering').hidden=true;
 document.getElementById('gathering-panel').hidden=false;
});
document.getElementById('close-gathering').addEventListener('click',()=>{document.getElementById('gathering-panel').hidden=true;});
document.getElementById('start-gathering').addEventListener('click',()=>{
 const list=document.getElementById('gathering-invites');
 const names=[...list.querySelectorAll('input[type="checkbox"]:checked')].map(input=>input.value).slice(0,3);
 const status=document.getElementById('gathering-status');
 if(!names.length){status.textContent='اختاري شخصية واحدة على الأقل عشان يبدأ التجمع.';document.getElementById('gathering-active').hidden=false;return;}
 const event=document.getElementById('gathering-event').value;
 const location=document.getElementById('gathering-location').value;
 const place=moveToGatheringPlace(location);
 activeGathering={participants:npcs.filter(npc=>names.includes(npc.name)),event,place,responded:new Set()};
 document.getElementById('gathering-active').hidden=false;
 document.getElementById('finish-gathering').hidden=true;
 status.textContent='بدأ '+gatheringEvents[event].title+' في '+place+' 🎉 اختاري ردًا لكل مشارك.';
 renderGatheringChoices();
});
document.getElementById('finish-gathering').addEventListener('click',()=>{
 if(!activeGathering||activeGathering.responded.size!==activeGathering.participants.length)return;
 happiness=Math.min(100,happiness+4);awardXP(5);updateStats();saveProgress();
 say('📸 اتحفظت ذكرى '+gatheringEvents[activeGathering.event].title+' في '+activeGathering.place+'. تقدري تعملي تجمعًا جديدًا وقت ما تحبي.');
 activeGathering=null;
 document.getElementById('gathering-active').hidden=true;
 document.getElementById('finish-gathering').hidden=true;
});

document.getElementById('close-walks').addEventListener('click',()=>{document.getElementById('social-walk-panel').hidden=true});
document.getElementById('end-shared-walk').addEventListener('click',()=>endSharedWalk());
document.getElementById('walk-picnic').addEventListener('click',()=>doSharedWalkActivity('picnic'));
document.getElementById('walk-cafe').addEventListener('click',()=>doSharedWalkActivity('cafe'));
document.getElementById('walk-photo').addEventListener('click',takeSharedWalkPhoto);
document.getElementById('walk-challenge').addEventListener('click',startSharedCoopChallenge);
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
    (player.hairParts || [player.hairPart]).forEach(part => { part.render.material = item.material; });
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
  const wardrobe = document.createElement('div');
  wardrobe.className = 'wardrobe-summary';
  const outfit = shopProducts.find(item => item.id === equippedItems.outfit);
  const hair = shopProducts.find(item => item.id === equippedItems.hair);
  const summaryTitle = document.createElement('strong');
  summaryTitle.textContent = '✨ إطلالتك الحالية';
  const summaryText = document.createElement('span');
  summaryText.textContent = (outfit ? outfit.name : 'الملابس الأساسية') + ' · ' + (hair ? hair.name : 'الشعر الأساسي');
  const collectionText = document.createElement('span');
  collectionText.textContent = 'مقتنياتك: ' + ownedItems.size + ' / ' + (shopProducts.length + 2) + ' قطعة';
  wardrobe.append(summaryTitle, summaryText, collectionText);
  list.appendChild(wardrobe);
  const categories = [{id:'outfit',label:'👗 الملابس'},{id:'hair',label:'💇 الشعر'}];
  for (const category of categories) {
    const heading = document.createElement('h3');
    heading.className = 'wardrobe-category';
    heading.textContent = category.label;
    list.appendChild(heading);
    for (const item of shopProducts.filter(product => product.category === category.id)) {
      const card = document.createElement('div');
      card.className = 'shop-product';
      const info = document.createElement('div');
      info.className = 'shop-product-info';
      const name = document.createElement('strong');
      name.textContent = item.emoji + ' ' + item.name;
      const price = document.createElement('span');
      const isOwned = gameCloudUserId ? cloudOwnedItemIds.has(item.id) : ownedItems.has(item.id);
      const isEquipped = equippedItems[category.id] === item.id;
      price.textContent = isEquipped ? '✨ مرتداة الآن' : isOwned ? 'موجودة في مقتنياتك' : '🪙 ' + item.price;
      info.append(name, price);
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.shopItem = item.id;
      button.textContent = isEquipped ? 'مرتداة' : isOwned ? 'ارتديها' : 'شراء';
      button.disabled = isEquipped;
      card.append(info, button);
      list.appendChild(card);
    }
  }
}
let cloudWalletBalance = null;
let cloudEconomyBusy = false;
let cloudOwnedItemIds = new Set();
let cloudPanelRefreshToken = 0;
async function purchaseCloudItem(item, triggerButton = null) {
  const client = window.wonderWorldSupabase;
  const feedback = document.getElementById('shop-feedback');
  if (!client || !gameCloudUserId) {
    if (feedback) feedback.textContent = 'سجّلي الدخول من زر «حساب اللاعب» عشان تشتري القطعة على حسابك.';
    return;
  }
  if (cloudEconomyBusy) {
    if (feedback) feedback.textContent = 'لحظة واحدة، جاري إنهاء عملية المتجر الحالية…';
    return;
  }
  cloudEconomyBusy = true;
  if (triggerButton) triggerButton.disabled = true;
  const panelFeedback = document.querySelector('#cloud-economy-panel .cloud-economy-feedback');
  if (panelFeedback) panelFeedback.textContent = 'جاري التحقق من الرصيد والشراء بأمان…';
  if (feedback) feedback.textContent = 'جاري التحقق من الرصيد والشراء بأمان…';
  try {
    const { data, error } = await client.rpc('ww_purchase_game_item', { p_item_id: item.id });
    if (error) throw error;
    if (data && Number.isFinite(Number(data.coins))) cloudWalletBalance = Number(data.coins);
    if (data?.ok) {
      cloudOwnedItemIds.add(item.id);
      ownedItems.add(item.id);
      equipItem(item);
      happiness = Math.min(100, happiness + 3);
      updateStats();
      awardXP(12);
      saveProgress();
      completeQuest('shop');
      const text = '🎉 تم شراء ' + item.name + ' وتسجيلها في مقتنيات حسابك. الرصيد السحابي: ' + cloudWalletBalance + ' عملة.';
      if (feedback) feedback.textContent = text;
      if (panelFeedback) panelFeedback.textContent = text;
    } else if (data?.reason === 'insufficient_funds') {
      const text = 'رصيد الحساب غير كافٍ. سعر القطعة ' + data.price + ' عملة؛ استلمي مكافأة اليوم أو اجمعي عملات داخل اللعبة.';
      if (feedback) feedback.textContent = text;
      if (panelFeedback) panelFeedback.textContent = text;
    } else if (data?.reason === 'already_owned') {
      cloudOwnedItemIds.add(item.id);
      ownedItems.add(item.id);
      equipItem(item);
      const text = 'القطعة دي موجودة بالفعل في مقتنيات حسابك؛ تم ارتداؤها ✨';
      if (feedback) feedback.textContent = text;
      if (panelFeedback) panelFeedback.textContent = text;
    } else {
      const text = 'لم يكتمل الشراء. حدّثي المتجر وحاولي مجددًا.';
      if (feedback) feedback.textContent = text;
      if (panelFeedback) panelFeedback.textContent = text;
    }
  } catch (error) {
    const text = 'الشراء لم يكتمل، ولم نعرضه كعملية ناجحة. تأكدي من تسجيل الدخول والاتصال ثم جرّبي تاني.';
    if (feedback) feedback.textContent = text;
    if (panelFeedback) panelFeedback.textContent = text;
    console.error('Cloud item purchase failed', error);
  } finally {
    cloudEconomyBusy = false;
    await refreshCloudEconomyPanel((document.getElementById('shop-feedback')?.textContent || ''));
    renderShop();
  }
}

function ensureCloudEconomyPanel() {
  let panel = document.getElementById('cloud-economy-panel');
  if (panel) return panel;
  panel = document.createElement('section');
  panel.id = 'cloud-economy-panel';
  panel.className = 'cloud-economy-panel';
  const products = document.getElementById('shop-products');
  products.before(panel);
  return panel;
}
async function refreshCloudEconomyPanel(messageText = '') {
  const refreshToken = ++cloudPanelRefreshToken;
  const panel = ensureCloudEconomyPanel();
  const client = window.wonderWorldSupabase;
  if (!client || !gameCloudUserId) {
    panel.replaceChildren();
    const title = document.createElement('strong'); title.textContent = '☁️ متجر الحساب الآمن';
    const note = document.createElement('p'); note.textContent = 'سجّلي الدخول عشان تستخدمي المحفظة السحابية وتحتفظي بمشتريات الشعر والهدوم على حسابك. من غير حساب، المتجر بيشتغل كتجربة محلية على الجهاز فقط.';
    const login = document.createElement('button'); login.id = 'cloud-wallet-login'; login.type = 'button'; login.textContent = '👤 تسجيل الدخول لتفعيل المحفظة';
    login.addEventListener('click', () => { const launch = document.getElementById('ww-auth-launch'); if (launch) launch.click(); else note.textContent = 'افتحي زر «حساب اللاعب» أعلى الشاشة لتسجيل الدخول.'; });
    panel.append(title,note,login); return;
  }
  panel.replaceChildren();
  const title = document.createElement('strong'); title.textContent = '☁️ محفظة الحساب — رصيد موثّق من الخادم';
  const balance = document.createElement('p'); balance.textContent = cloudWalletBalance === null ? 'جاري تحميل الرصيد…' : 'الرصيد السحابي: ' + cloudWalletBalance + ' عملة';
  const feedback = document.createElement('p'); feedback.className='cloud-economy-feedback'; feedback.setAttribute('role','status'); feedback.textContent=messageText;
  const daily = document.createElement('button'); daily.type='button'; daily.textContent='🎁 استلام مكافأة اليوم (+10)';
  daily.disabled=cloudEconomyBusy;
  daily.addEventListener('click',async()=>{
    if(cloudEconomyBusy)return; cloudEconomyBusy=true; daily.disabled=true; feedback.textContent='جاري التحقق من مكافأة اليوم…';
    try{
      const {data,error}=await client.rpc('ww_claim_daily_wallet_reward'); if(error)throw error;
      cloudWalletBalance=Number(data.coins);
      feedback.textContent=data.ok?'🎉 اتضافت 10 عملات لمحفظتك السحابية!':(data.reason==='already_claimed'?'استلمتي مكافأة اليوم بالفعل. ارجعي بكرة!':'تعذّر استلام المكافأة.');
      balance.textContent='الرصيد السحابي: '+cloudWalletBalance+' عملة';
    }catch(error){feedback.textContent='تعذّر التحقق من المكافأة. جرّبي تاني بعد قليل.';console.error('Cloud daily reward failed',error);}
    finally{cloudEconomyBusy=false;daily.disabled=false;}
  });
  const catalogTitle=document.createElement('p');catalogTitle.textContent='محفظتك بتبدأ بـ20 عملة ترحيب، وتقدري تستلمي +10 عملات مرة كل يوم. مشتريات الشعر والهدوم بتتراجع على الخادم وتتسجل في مقتنيات حسابك.';
  panel.append(title,balance,daily,catalogTitle,feedback);
  try{
    const [{data:wallet,error:walletError},{data:inventory,error:inventoryError}]=await Promise.all([
      client.rpc('ww_ensure_wallet'),
      client.from('player_inventory').select('item_id').eq('player_id',gameCloudUserId)
    ]);
    if (refreshToken !== cloudPanelRefreshToken || !gameCloudUserId) return;
    if(walletError)throw walletError;
    if(inventoryError)throw inventoryError;
    cloudWalletBalance=Number(wallet);
    cloudOwnedItemIds=new Set((inventory||[]).map(row=>row.item_id));
    for(const id of cloudOwnedItemIds) ownedItems.add(id);
    balance.textContent='الرصيد السحابي: '+cloudWalletBalance+' عملة';
    if(panel.isConnected) renderShop();
  }catch(error){feedback.textContent='تعذّر تحميل المحفظة أو المقتنيات. تأكدي من الاتصال ثم افتحي المتجر مجددًا.';console.error('Cloud economy read failed',error);}
  for (const item of shopProducts) {
    const buy = document.createElement('button');
    buy.type = 'button';
    buy.dataset.cloudBuyItem = item.id;
    buy.textContent = cloudOwnedItemIds.has(item.id) ? '☑️ مشتراة على الحساب' : 'شراء من المحفظة السحابية — ' + item.price + ' عملة';
    buy.disabled = cloudEconomyBusy || cloudOwnedItemIds.has(item.id);
    buy.addEventListener('click', () => void purchaseCloudItem(item, buy));
    panel.appendChild(buy);
  }
}
window.addEventListener('wonderworld:auth-state',event=>{
  cloudPanelRefreshToken += 1;
  gameCloudUserId=event.detail?.user?.id||null; cloudWalletBalance=null; cloudOwnedItemIds=new Set();
  if(!document.getElementById('shop-panel').hidden) void refreshCloudEconomyPanel();
});
function openShop() {
  document.getElementById('shop-panel').hidden = false;
  renderShop();
  document.getElementById('shop-feedback').textContent = 'رصيدك الحالي: ' + coins + ' عملة.';
  void refreshCloudEconomyPanel();
}
document.getElementById('open-shop').addEventListener('click', openShop);
document.getElementById('close-shop').addEventListener('click', () => { document.getElementById('shop-panel').hidden = true; });
document.getElementById('shop-products').addEventListener('click', event => {
  const button = event.target.closest('button[data-shop-item]');
  if (!button) return;
  const item = shopProducts.find(product => product.id === button.dataset.shopItem);
  if (!item) return;
  if (gameCloudUserId) {
    if (cloudOwnedItemIds.has(item.id)) {
      ownedItems.add(item.id);
      equipItem(item);
      renderShop();
      document.getElementById('shop-feedback').textContent = 'تم ارتداء ' + item.name + ' من مقتنيات حسابك السحابية ✨';
    } else {
      void purchaseCloudItem(item, button);
    }
    return;
  }
  if (ownedItems.has(item.id)) {
    equipItem(item);
    renderShop();
    document.getElementById('shop-feedback').textContent = 'تم تحديث إطلالتك إلى ' + item.name + ' ✨';
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
  { name: 'فيلا Wonder الجاهزة', x: -24, z: -10, radius: 5.5, action: () => enterHome('فيلا Wonder الجاهزة', starterVillaRoot) },
  { name: 'فيلا Wonder الفاخرة', x: 24, z: -10, radius: 5.5, action: () => { if (!ownedHomes.has('luxury-villa')) { if (coins < 250) { say('الفيلا الفاخرة متاحة للشراء مقابل 250 عملة افتراضية. رصيدك الحالي '+coins+' عملة.'); return; } coins -= 250; ownedHomes.add('luxury-villa'); updateStats(); saveProgress(); say('مبروك! اشتريتي فيلا Wonder الفاخرة بـ250 عملة افتراضية. تفاعلي مع الفيلا مرة ثانية للدخول.'); return; } enterHome('فيلا Wonder الفاخرة', luxuryVillaRoot); } },
  { name: 'مسبح البيت 🏊', x: -16.1, z: -10.0, radius: 3.7, action: () => {
    if (indoors) { say('اخرجي من البيت الأول عشان تروحي للمسبح.'); return; }
    energy = Math.max(0, energy - 8); happiness = Math.min(100, happiness + 15); awardXP(5); updateStats(); saveProgress();
    say('قضيتي وقت لطيف في مسبح البيت 🏊 السعادة +15، والطاقة -8. تقدري ترجعي تستريحي في البيت.');
  }},
  { name: 'متجر Wonder', x: 10, z: 7.1, radius: 3.5, action: () => enterHome('متجر Wonder', shopInteriorRoot, { label: '🛍️ تصفح المنتجات', run: openShop }) },
  { name: 'كافيه Wonder', x: 15, z: -3.2, radius: 4.0, action: () => enterHome('كافيه Wonder', cafeInteriorRoot, { label: '☕ طلب من الكافيه', run: orderCafe }) },
  { name: 'مكتب الحي', x: 0, z: -18.3, radius: 4.0, action: doQuickWork },
  { name: 'Wonder Fitness', x: 15, z: -18, radius: 4.5, action: doWorkout },
  { name: 'مطار Wonder Air', x: 34, z: -28, radius: 8, action: () => window.dispatchEvent(new CustomEvent('wonderworld:open-activity', { detail: { id: 'plane' } })) },
  { name: 'محطة Wonder Central', x: -30, z: -20, radius: 6, action: () => window.dispatchEvent(new CustomEvent('wonderworld:open-activity', { detail: { id: 'train' } })) },
  { name: 'منصة WonderWorld Fashion Week', x: 25, z: 15, radius: 8, action: () => window.dispatchEvent(new CustomEvent('wonderworld:open-activity', { detail: { id: 'fashion' } })) },
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
let waterSortTubes=[],waterSortSelected=-1,waterSortMoves=0,waterSortWon=false,waterSortHistory=[];
function waterSortReset(){
 // Start from a solved board and scramble only with reversible reverse-moves.
 // Each moved top run can be poured back in reverse order, so every generated
 // puzzle remains solvable (unlike shuffling all 16 color units arbitrarily).
 waterSortTubes=waterSortColors.map((_,color)=>Array(4).fill(color)).concat([[],[]]);
 for(let step=0;step<80;step++){
  const candidates=[];
  for(let source=0;source<waterSortTubes.length;source++){
   const from=waterSortTubes[source];
   if(!from.length)continue;
   const color=from[from.length-1];
   let runLength=1;
   for(let i=from.length-2;i>=0&&from[i]===color;i--)runLength++;
   for(let target=0;target<waterSortTubes.length;target++){
    if(target===source)continue;
    const to=waterSortTubes[target];
    if(to.length>=4||(to.length&&to[to.length-1]===color))continue;
    const maxAmount=Math.min(runLength,4-to.length);
    for(let amount=1;amount<=maxAmount;amount++){
     // Avoid pointless full-tube swaps between a full tube and an empty one.
     if(from.length===amount&&to.length===0)continue;
     candidates.push({source,target,amount});
    }
   }
  }
  if(!candidates.length)break;
  const move=candidates[Math.floor(Math.random()*candidates.length)];
  for(let n=0;n<move.amount;n++)waterSortTubes[move.target].push(waterSortTubes[move.source].pop());
 }
 waterSortSelected=-1;waterSortMoves=0;waterSortWon=false;waterSortHistory=[];
 document.getElementById('watersort-feedback').textContent='لغز جديد قابل للحل! اختاري أنبوبة فيها لون، ثم أنبوبة فاضية أو لونها العلوي مطابق.';
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
 document.getElementById('watersort-undo').disabled=waterSortHistory.length===0||waterSortWon;
}
function waterSortTap(i){
 if(waterSortWon)return;
 const target=waterSortTubes[i];
 if(waterSortSelected<0){if(!target.length){document.getElementById('watersort-feedback').textContent='الأنبوبة فاضية؛ اختاري أنبوبة فيها لون.';return;}waterSortSelected=i;waterSortRender();return;}
 if(waterSortSelected===i){waterSortSelected=-1;waterSortRender();return;}
 const source=waterSortTubes[waterSortSelected],top=source[source.length-1];
 if(target.length>=4||(target.length&&target[target.length-1]!==top)){document.getElementById('watersort-feedback').textContent='اختاري أنبوبة فاضية أو لونها العلوي نفس اللون.';waterSortSelected=-1;waterSortRender();return;}
 waterSortHistory.push(waterSortTubes.map(tube=>tube.slice()));
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
document.getElementById('watersort-undo').addEventListener('click',()=>{
 if(!waterSortHistory.length||waterSortWon)return;
 waterSortTubes=waterSortHistory.pop();
 waterSortMoves=Math.max(0,waterSortMoves-1);
 waterSortSelected=-1;
 document.getElementById('watersort-feedback').textContent='رجعنا آخر حركة. تقدري تجربي ترتيبًا مختلفًا.';
 waterSortRender();
});
document.getElementById('watersort-restart').addEventListener('click',waterSortReset);

let memoryCards=[], memoryFirst=null, memoryLocked=false, memoryMoves=0, memoryPairs=0;
const memorySymbols=['🌷','🐱','⭐','🍓','🎈','🦋','🌈','🐰'];
function memoryMatchStart(){
 memoryCards=[...memorySymbols,...memorySymbols].map((symbol,index)=>({symbol,id:index,matched:false,revealed:false}));
 for(let i=memoryCards.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[memoryCards[i],memoryCards[j]]=[memoryCards[j],memoryCards[i]];}
 memoryFirst=null;memoryLocked=false;memoryMoves=0;memoryPairs=0;
 document.getElementById('memory-moves').textContent='0';document.getElementById('memory-pairs').textContent='0 / 8';
 let best=Number(localStorage.getItem('wonderworld-memory-best-moves'));
 document.getElementById('memory-feedback').textContent='اقلبي كارتين وحاولي تلاقي الرمزين المتشابهين.'+(Number.isFinite(best)&&best>0?' أفضل نتيجة: '+best+' حركة.':'');
 memoryMatchRender();
}
function memoryMatchRender(){
 const board=document.getElementById('memory-board');board.replaceChildren();
 memoryCards.forEach((card,index)=>{
  const b=document.createElement('button');b.type='button';b.className='memory-card'+(card.matched?' matched':'');
  b.textContent=(card.matched||card.revealed)?card.symbol:'?';b.setAttribute('aria-label',card.matched||card.revealed?'كارت '+card.symbol:'كارت مخفي رقم '+(index+1));
  b.disabled=card.matched||memoryLocked||card.revealed;
  b.addEventListener('click',()=>memoryMatchFlip(index));board.appendChild(b);
 });
}
function memoryMatchFlip(index){
 const card=memoryCards[index];if(!card||card.matched||card.revealed||memoryLocked)return;
 card.revealed=true;
 if(memoryFirst===null){memoryFirst=index;memoryMatchRender();return;}
 memoryMoves++;document.getElementById('memory-moves').textContent=String(memoryMoves);
 const first=memoryCards[memoryFirst];
 if(first.symbol===card.symbol){
  first.matched=true;card.matched=true;first.revealed=false;card.revealed=false;memoryFirst=null;memoryPairs++;
  document.getElementById('memory-pairs').textContent=memoryPairs+' / 8';
  document.getElementById('memory-feedback').textContent='🎉 زوج صحيح! كمّلي، فاضل '+(8-memoryPairs)+' أزواج.';
  memoryMatchRender();
  if(memoryPairs===8){
   const bestKey='wonderworld-memory-best-moves';
   let bestMoves=Number(localStorage.getItem(bestKey));
   if(!Number.isFinite(bestMoves)||bestMoves<1||memoryMoves<bestMoves){bestMoves=memoryMoves;localStorage.setItem(bestKey,String(bestMoves));}
   const rewardKey='wonderworld-memory-reward-day',today=localDateKey(),alreadyRewarded=localStorage.getItem(rewardKey)===today;
   if(alreadyRewarded){
    document.getElementById('memory-feedback').textContent='🏆 ممتاز! خلصتي كل الأزواج في '+memoryMoves+' حركة. أفضل نتيجة: '+bestMoves+' حركة. مكافأة الفوز اليومية اتاخدت بالفعل.';
   }else{
    document.getElementById('memory-feedback').textContent='🏆 ممتاز! خلصتي كل الأزواج في '+memoryMoves+' حركة. أفضل نتيجة: '+bestMoves+' حركة. مكافأة اليوم: 5 عملات و10 XP.';
    coins+=5;updateStats();awardXP(10);localStorage.setItem(rewardKey,today);
   }
   logAdventure('🏆 فزت بلعبة ذاكرة الصور في '+memoryMoves+' حركة');saveProgress();
  }
 }else{
  memoryLocked=true;memoryMatchRender();
  document.getElementById('memory-feedback').textContent='قريبين! حاولي تفتكري الرمزين.';
  setTimeout(()=>{first.revealed=false;card.revealed=false;memoryFirst=null;memoryLocked=false;memoryMatchRender();},750);
 }
}
document.getElementById('open-memory-match').addEventListener('click',()=>{document.getElementById('memory-match-panel').hidden=false;memoryMatchStart();});
document.getElementById('close-memory-match').addEventListener('click',()=>{document.getElementById('memory-match-panel').hidden=true;memoryLocked=false;});
document.getElementById('memory-restart').addEventListener('click',memoryMatchStart);



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
let lastTvTimeAt = 0;
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
    name: 'التلفزيون',
    x: 2.35, z: -4.8, radius: 2.0,
    action: () => {
      const now = Date.now();
      if (now - lastTvTimeAt < 15000) {
        say('📺 لسه خلصتي فقرة مشاهدة قصيرة؛ استني شوية قبل ما تختاري برنامج تاني.');
        return;
      }
      lastTvTimeAt = now;
      happiness = Math.min(100, happiness + 8);
      updateStats();
      awardXP(2);
      logAdventure('قضيت وقتًا هادئًا أمام تلفزيون البيت');
      say('📺 اتفرجتي على برنامج ترفيهي في بيتك! السعادة +8 و+2 خبرة. دي مشاهدة تفاعلية مبسطة داخل النموذج؛ تشغيل فيديوهات فعلية أو المشاهدة المتزامنة مع صديق لسه ضمن التطوير.');
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
  // The player's purchased business is a real world destination, not just scenery.
  // The building faces negative Z, so interaction is targeted at its front entrance.
  if (playerBusiness.enabled) {
    const businessTarget = { name: 'مشروعي الخاص — إدارة المحل', x: -18, z: -12.35, radius: 4.5, action: () => {
      const careerButton = document.getElementById('open-careers');
      if (careerButton) careerButton.click();
      else say('لوحة الوظائف والمشروع الخاص لسه بتحمّل. جرّبي بعد لحظة.');
    }};
    const d = Math.hypot(p.x - businessTarget.x, p.z - businessTarget.z);
    if (d < businessTarget.radius && d < bestDistance) {
      best = { ...businessTarget, distance: d };
      bestDistance = d;
    }
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
document.getElementById('indoor-place-action').addEventListener('click', () => { if (activeIndoorAction) activeIndoorAction.run(); });

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
  const target = e.target;
  // Don't hijack typing, form submission, or native keyboard activation of UI controls.
  if (target instanceof HTMLElement && (target.matches('input, textarea, select, button, a, [role="button"], [contenteditable="true"]') || target.isContentEditable)) return;
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
    const activeSpeed = moveSpeed * (vehicleMode ? 2.6 : 1);
    player.translate(x * activeSpeed * dt, 0, z * activeSpeed * dt);
    walkClock += dt * 9;
    player.setEulerAngles(0, Math.atan2(x, z) * 180 / Math.PI, 0);
    const swing = Math.sin(walkClock) * 24;
    player.leftArm.setLocalEulerAngles(swing, 0, 0);
    player.rightArm.setLocalEulerAngles(-swing, 0, 0);
    player.leftLeg.setLocalEulerAngles(-swing * 0.7, 0, 0);
    player.rightLeg.setLocalEulerAngles(swing * 0.7, 0, 0);
    player.bodyPart.setLocalPosition(0, 1.02 + Math.abs(Math.sin(walkClock * 2)) * 0.055, 0);
  } else {
    player.leftArm.setLocalEulerAngles(0, 0, 0);
    player.rightArm.setLocalEulerAngles(0, 0, 0);
    player.leftLeg.setLocalEulerAngles(0, 0, 0);
    player.rightLeg.setLocalEulerAngles(0, 0, 0);
    player.bodyPart.setLocalPosition(0, 1.02, 0);
  }

  const p = player.getPosition();
  if(activeWalkNpc && !indoors){const friendPos=activeWalkNpc.entity.getPosition();const dx=p.x-friendPos.x,dz=p.z-friendPos.z,dist=Math.hypot(dx,dz);if(dist>1.65){const step=Math.min(dist-1.1,moveSpeed*dt*0.92);activeWalkNpc.entity.setPosition(friendPos.x+dx/dist*step,0,friendPos.z+dz/dist*step);activeWalkNpc.entity.setEulerAngles(0,Math.atan2(dx,dz)*180/Math.PI,0);}}
  p.x = Math.max(-42, Math.min(42, p.x));
  p.z = Math.max(-42, Math.min(42, p.z));
  player.setPosition(p);
  if (vehicleMode) {
    playerCar.setPosition(p.x, 0, p.z);
    playerCar.setEulerAngles(0, player.getEulerAngles().y, 0);
  }

  // Ease the camera toward the player instead of snapping on every frame.
  const follow = 1 - Math.exp(-5 * dt);
  cameraX += (p.x - cameraX) * follow;
  cameraZ += (p.z + cameraOffsetZ - cameraZ) * follow;
  camera.setPosition(cameraX, cameraHeight, cameraZ);
  camera.lookAt(p.x, 1, p.z);
});

applyAvatarProfile();
restoreEquippedItems();
syncPetCompanion();
renderPetPanel();
updateQuestUI();
updateStats();
let loginStreak = 0;
try {
  const today = localDateKey();
  const rewardKey = 'wonderworld-last-daily-reward';
  const streakKey = 'wonderworld-login-streak';
  const lastReward = localStorage.getItem(rewardKey);
  loginStreak = Math.max(0, Number(localStorage.getItem(streakKey)) || 0);
  if (lastReward !== today) {
    const yesterday = new Date(); yesterday.setDate(yesterday.getDate()-1);
    const wasYesterday = lastReward === localDateKey(yesterday);
    loginStreak = wasYesterday ? Math.min(365,loginStreak+1) : 1;
    const streakBonus = Math.min(6,Math.max(0,loginStreak-1));
    coins += 5 + streakBonus;
    playerXP += 5;
    while (playerXP >= xpNeededForNextLevel()) {
      playerXP -= xpNeededForNextLevel();
      playerLevel += 1;
      coins += 10;
      happiness = Math.min(100, happiness + 2);
    }
    localStorage.setItem(rewardKey, today);
    localStorage.setItem(streakKey, String(loginStreak));
    say('🎁 هدية دخول اليوم: '+(5+streakBonus)+' عملات و+5 XP! سلسلة دخولك '+loginStreak+' يوم. '+(loginStreak>=3?'استمري، مكافأة الاستمرار بتكبر لحد 6 عملات إضافية!':'ارجعي بكرة عشان تكملي سلسلة الدخول.'));
  } else {
    localStorage.setItem(streakKey, String(loginStreak));
  }
} catch (_) {}
updateStats();
status.textContent = 'WonderWorld prototype ready — تحرّكي واستكشفي الحي';
updateStats();


// Load the standalone Ludo/chess activities after the game HUD is created.
import('./board-games.js?v=20261021-3').catch(error => console.error('WonderWorld board games failed to load:', error));
