import {
  Application,
  Color,
  Entity,
  FILLMODE_FILL_WINDOW,
  RESOLUTION_AUTO,
  StandardMaterial,
  Vec3
} from 'playcanvas';

const canvas = document.getElementById('application');
const status = document.getElementById('status');
const app = new Application(canvas, {
  mouse: undefined,
  touch: undefined,
  keyboard: undefined,
  graphicsDeviceOptions: { antialias: true, alpha: false }
});
app.setCanvasFillMode(FILLMODE_FILL_WINDOW);
app.setCanvasResolution(RESOLUTION_AUTO);
app.start();

app.scene.ambientLight = new Color(0.65, 0.69, 0.78);

const sky = new Entity('Sky and lighting');
sky.addComponent('light', { type: 'directional', color: new Color(1, 0.94, 0.82), intensity: 1.6, castShadows: true });
sky.setEulerAngles(45, 25, 0);
app.root.addChild(sky);

const groundMaterial = new StandardMaterial();
groundMaterial.diffuse = new Color(0.25, 0.58, 0.32);
groundMaterial.update();

const ground = new Entity('Green test island');
ground.addComponent('render', { type: 'box' });
ground.setLocalScale(40, 0.5, 40);
ground.setPosition(0, -0.3, 0);
ground.render.material = groundMaterial;
app.root.addChild(ground);

function makeBox(name, scale, position, color) {
  const entity = new Entity(name);
  entity.addComponent('render', { type: 'box' });
  entity.setLocalScale(scale.x, scale.y, scale.z);
  entity.setPosition(position.x, position.y, position.z);
  const material = new StandardMaterial();
  material.diffuse = color;
  material.update();
  entity.render.material = material;
  app.root.addChild(entity);
  return entity;
}

// A colorful placeholder character until custom 3D models are added.
const player = makeBox('WonderWorld Player', new Vec3(0.8, 1.7, 0.7), new Vec3(0, 0.9, 0), new Color(0.94, 0.38, 0.28));
const head = makeBox('Head', new Vec3(0.65, 0.65, 0.65), new Vec3(0, 2.05, 0), new Color(1, 0.76, 0.58));
app.root.removeChild(head);
player.addChild(head);
head.setLocalPosition(0, 1.15, 0);
makeBox('Welcome sign', new Vec3(3.5, 1.1, 0.25), new Vec3(0, 1.1, -6), new Color(0.98, 0.76, 0.25));

const camera = new Entity('Follow Camera');
camera.addComponent('camera', { clearColor: new Color(0.52, 0.78, 0.96), fov: 60, farClip: 200 });
camera.setPosition(0, 6, 10);
camera.lookAt(0, 1, 0);
app.root.addChild(camera);

const pressed = new Set();
const keyMap = {
  ArrowUp: 'up', KeyW: 'up',
  ArrowDown: 'down', KeyS: 'down',
  ArrowLeft: 'left', KeyA: 'left',
  ArrowRight: 'right', KeyD: 'right'
};
window.addEventListener('keydown', e => {
  if (keyMap[e.code]) { pressed.add(keyMap[e.code]); e.preventDefault(); }
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

const moveSpeed = 5;
app.on('update', dt => {
  let x = (pressed.has('right') ? 1 : 0) - (pressed.has('left') ? 1 : 0);
  let z = (pressed.has('down') ? 1 : 0) - (pressed.has('up') ? 1 : 0);
  const length = Math.hypot(x, z);
  if (length > 0) {
    x /= length; z /= length;
    player.translate(x * moveSpeed * dt, 0, z * moveSpeed * dt);
  }
  const p = player.getPosition();
  p.x = Math.max(-17, Math.min(17, p.x));
  p.z = Math.max(-17, Math.min(17, p.z));
  player.setPosition(p);
  camera.setPosition(p.x, 6, p.z + 10);
  camera.lookAt(p.x, 1, p.z);
});

status.textContent = '3D world ready — use the arrows to move';
