import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = path => readFileSync(new URL(path, import.meta.url), 'utf8');
const html = read('../index.html');
const game = read('../main.js');
const careers = read('../careers.js');
const boardGames = read('../board-games.js');
const gameSaveMigration = read('../supabase/migrations/202610210006_add_private_player_game_saves.sql');
const economyMigration = read('../supabase/migrations/202610210007_secure_virtual_economy.sql');
const welcomeMigration = read('../supabase/migrations/202610210010_wallet_welcome_bonus.sql');
const css = read('../style.css');
const careerCss = read('../career.css');

const checks = [
  ['Career persistence function exists', /function save\s*\(/.test(careers)],
  ['Auth exposes the configured client to game modules', /window\.wonderWorldSupabase = supabase/.test(read('../auth.js'))],
  ['Account switching isolates local progression before cloud sync', /wonderworld-local-owner/.test(read('../auth.js')) && /wonderworld-account-switching/.test(read('../auth.js')) && /wonderworld-account-switching/.test(careers)],
  ['Career state supports private Supabase cloud saves', /player_career_saves/.test(careers) && /wonderworld:auth-state/.test(careers)],
  ['Full game progression has private cloud-save sync', /player_game_saves/.test(game) && /buildProgressSnapshot/.test(game) && /deviceRecords/.test(game)],
  ['Game-save status is visible in the HUD', /game-cloud-status/.test(game)],
  ['Game-save migration enables RLS and owner-scoped policies', gameSaveMigration.includes('enable row level security') && gameSaveMigration.includes('Players can read their own game save') && gameSaveMigration.includes('Players can update their own game save') && gameSaveMigration.includes('with check ((select auth.uid()) = player_id)')],
  ['Daily objective completion rewards XP', game.includes('awardXP(10);') && game.includes('خلّصتي كل مهام اليوم')],
  ['Secure cloud wallet uses authenticated RPCs for signed-in purchases', /ww_purchase_game_item/.test(game) && /ww_ensure_wallet/.test(game) && /cloudOwnedItemIds/.test(game)],
  ['Signed-in wardrobe purchases always use server-validated checkout', /if \(gameCloudUserId\) \{[\s\S]*?void purchaseCloudItem\(item, button\)/.test(game) && /ww_purchase_game_item/.test(game)],
  ['Main wardrobe buy buttons call the authenticated cloud purchase RPC directly', /async function purchaseCloudItem/.test(game) && /void purchaseCloudItem\(item, button\)/.test(game) && /ww_purchase_game_item/.test(game)],
  ['Cloud shop refresh rejects stale results after account changes', /cloudPanelRefreshToken/.test(game) && /refreshToken !== cloudPanelRefreshToken/.test(game)],
  ['Economy migration has owner-only transaction reads and daily-claim uniqueness', economyMigration.includes('enable row level security') && economyMigration.includes('Players can view their own economy transactions') && economyMigration.includes('primary key(player_id,reward_code,claim_date)')],
  ['Cloud wallets receive a one-time starter balance with a ledger record', welcomeMigration.includes('values (v_uid, 20)') && welcomeMigration.includes("'welcome_bonus'") && welcomeMigration.includes('where w.coins = 0')],
  ['Economy RPCs require authenticated users and restrict anonymous execution', economyMigration.includes('auth.uid()') && economyMigration.includes('revoke all on function public.ww_purchase_game_item(text) from public,anon') && economyMigration.includes('grant execute on function public.ww_purchase_game_item(text) to authenticated')],
  ['Mobile viewport allows user zoom', /viewport-fit=cover/.test(html) && !/user-scalable=no|max(?:imum)?-scale=1/i.test(html)],

  ['Ludo and chess activities are dynamically wired', /import\(['"]\.\/board-games\.js\?v=/.test(game)],
  ['Board-game module contains Ludo and chess activities', /function initLudo\(/.test(boardGames) && /function initChess\(/.test(boardGames) && /cpuTurn/.test(boardGames)],

  ['PlayCanvas scene entry is loaded', /main\.js\?v=/.test(html)],
  ['Controllable car model is wired to player movement and touch controls', /const playerCar = new Entity/.test(game) && /toggleVehicleMode/.test(game) && /vehicleMode \? 2\.6/.test(game) && /playerCar\.setPosition\(p\.x, 0, p\.z\)/.test(game)],
  ['3D avatars have facial features, legs, shoes, hair recoloring and walk animation', /name \+ ' left pupil'/.test(game) && /name \+ ' left leg'/.test(game) && /person\.hairParts = \[hair, hairFront\]/.test(game) && /player\.leftLeg\.setLocalEulerAngles/.test(game)],
  ['Home swimming pool is a real 3D destination with a gameplay interaction', /Home pool water/.test(game) && /name: 'مسبح البيت/.test(game) && /السعادة \+15/.test(game)],
  ['Home builder changes and persists facade, roof and garden design', /open-home-build/.test(game) && /wonderworld-home-design-v1/.test(game) && /data-home-wall/.test(game) && /data-home-roof/.test(game)],
  ['Career system is loaded', /careers\.js\?v=/.test(html)],
  ['Mobile touch controls exist', /data-dir="up"/.test(html) && /data-dir="left"/.test(html)],
  ['World interaction control exists', /id="interact"/.test(game)],
  ['Neighborhood destinations exist', /const places = \[/.test(game)],
  ['Purchased player-owned shop is reachable and opens business management', /if \(playerBusiness\.enabled\)/.test(game) && /مشروعي الخاص — إدارة المحل/.test(game) && /careerButton\.click\(\)/.test(game)],
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
