import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = path => readFileSync(new URL(path, import.meta.url), 'utf8');
const html = read('../index.html');
const game = read('../main.js');
const careers = read('../careers.js');
const boardGames = read('../board-games.js');
const css = read('../style.css');
const careerCss = read('../career.css');

const checks = [
  ['Ludo and chess activities are dynamically wired', /import\(['"]\.\/board-games\.js\?v=/.test(game)],
  ['Board-game module contains Ludo and chess activities', /function initLudo\(/.test(boardGames) && /function initChess\(/.test(boardGames) && /cpuTurn/.test(boardGames)],

  ['PlayCanvas scene entry is loaded', /main\.js\?v=/.test(html)],
  ['Career system is loaded', /careers\.js\?v=/.test(html)],
  ['Mobile touch controls exist', /data-dir="up"/.test(html) && /data-dir="left"/.test(html)],
  ['World interaction control exists', /id="interact"/.test(game)],
  ['Neighborhood destinations exist', /const places = \[/.test(game)],
  ['Social walk requires explicit consent', /موافقة/.test(game) && /accept\.addEventListener/.test(game)],
  ['Pet care system exists', /function careForActivePet/.test(game)],
  ['Career progression has a daily contract', /dailyOrderCount/.test(careers) && /contractClaimedDate/.test(careers)],
  ['Business level upgrades are bounded in the UI', /businessLevel >= 5/.test(careers)],
  ['Responsive base styles exist', /@media/.test(css) && /@media/.test(careerCss)],
  ['No service-role credential is hard-coded', !/service_role/i.test(html + game + careers)]
];

let failed = 0;
for (const [label, passed] of checks) {
  console.log((passed ? 'PASS' : 'FAIL') + ' — ' + label);
  if (!passed) failed += 1;
}
if (failed) process.exitCode = 1;
else console.log('All ' + checks.length + ' static regression checks passed.');
