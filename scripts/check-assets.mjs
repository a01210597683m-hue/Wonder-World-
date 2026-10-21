import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const read = path => readFileSync(new URL(path, import.meta.url), 'utf8');
const root = new URL('../', import.meta.url);
const rootPath = decodeURIComponent(root.pathname);
const exists = path => existsSync(join(rootPath, path));
const files = dir => readdirSync(join(rootPath, dir), { withFileTypes: true });

const checks = [];
function check(label, condition) {
  checks.push([label, Boolean(condition)]);
}

const html = read('../index.html');
const readme = read('../README.md');
const main = read('../main.js');
const auth = read('../auth.js');
const careers = read('../careers.js');
const boardGames = read('../board-games.js');
const miniGames = read('../mini-games.js');

check('Official branding reference is stored in App-Branding', exists('App-Branding/1792530004270.jpg'));
check('Character reference folder exists', exists('assets/characters'));
check('At least three character reference image files are present',
  files('assets/characters').filter(entry => entry.isFile() && /\.(avif|gif|jpe?g|png|webp|bmp)$/i.test(entry.name)).length >= 3);
check('Game-design reference folder contains multiple original references',
  files('game-design-references').filter(entry => entry.isFile() && /\.(avif|gif|jpe?g|png|webp|bmp)$/i.test(entry.name)).length >= 4);
check('Reference panel targets the configured Supabase Storage bucket',
  /const BUCKET = 'Wonder World Game'/.test(html) && /prefix: 'characters'/.test(html));
check('Existing Water Sort game remains wired through the main game panel',
  /id="open-watersort"/.test(main) && /function waterSortReset/.test(main) && /function waterSortTap/.test(main) && /waterSortHistory/.test(main));
check('Water Sort puzzle generation uses reversible moves from a solved board',
  /scramble only with reversible reverse-moves/.test(main) && /لغز جديد قابل للحل/.test(main));
check('Water Sort is not duplicated in the board-games panel',
  !/bg-open-water-sort/.test(boardGames) && !/function initWaterSort/.test(boardGames));
check('Casual arcade module is loaded and both mini-games are wired',
  html.includes('mini-games.js?v=20261021-1') && /wwa-memory-open/.test(miniGames) && /wwa-cups-open/.test(miniGames));
check('Casual arcade source includes pair matching and cup-guess outcomes',
  /function flipMemory/.test(miniGames) && /function newCups/.test(miniGames) && /وجدتي النجمة|لقيتي النجمة/.test(miniGames));
check('Core game and account modules are wired into the HTML',
  /main\.js\?v=/.test(html) && /auth\.js\?v=/.test(html) && /careers\.js\?v=/.test(html));
check('Core game files exist and are non-empty',
  [main, auth, careers].every(source => source.trim().length > 100));
check('No service-role or Supabase secret key is embedded in client code',
  !/(service_role|sb_secret_[A-Za-z0-9]+)/i.test(html + main + auth + careers));
check('README explicitly distinguishes reference images from 3D character models',
  /not 3D character models/i.test(readme));

let failed = 0;
for (const [label, passed] of checks) {
  process.stdout.write((passed ? 'PASS' : 'FAIL') + ' — ' + label + '\n');
  if (!passed) failed += 1;
}
if (failed) {
  process.stderr.write(failed + ' asset/integration check(s) failed.\n');
  process.exitCode = 1;
} else {
  process.stdout.write('All ' + checks.length + ' asset/integration checks passed.\n');
}
