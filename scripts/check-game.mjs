import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = path => readFileSync(new URL(path, import.meta.url), 'utf8');
const html = read('../index.html');
const game = read('../main.js');
const careers = read('../careers.js');
const boardGames = read('../board-games.js');
const miniGames = read('../mini-games.js');
const activities = read('../wonderworld-activities.js');
const gameSaveMigration = read('../supabase/migrations/202610210006_add_private_player_game_saves.sql');
const economyMigration = read('../supabase/migrations/202610210007_secure_virtual_economy.sql');
const welcomeMigration = read('../supabase/migrations/202610210010_wallet_welcome_bonus.sql');
const careerRewardMigration = read('../supabase/migrations/202610210011_secure_career_shift_rewards.sql');
const css = read('../style.css');
const careerCss = read('../career.css');
const workflow = read('../.github/workflows/deploy-pages.yml');

const checks = [
  ['Backyard pool interaction has proximity and cooldown checks', /name: 'مسبح بيت البداية 🏊'/.test(game) && /lastSwimAt/.test(game) && /poolDistance < poolTarget.radius/.test(game)],
  ['Career persistence function exists', /function save\s*\(/.test(careers)],
  ['Auth exposes the configured client to game modules', /window\.wonderWorldSupabase = supabase/.test(read('../auth.js'))],
  ['Password recovery uses Supabase reset flow and returns to the current game URL', /resetPasswordForEmail\(email\.value, \{ redirectTo: window\.location\.href\.split\('\#'\)\[0\] \}\)/.test(read('../auth.js'))],
  ['Account forms validate email format and stronger signup password rules', /email\.checkValidity\(\)/.test(read('../auth.js')) && /forSignup && password\.length < 12/.test(read('../auth.js')) && /0123456789/.test(read('../auth.js')) && /password\.split\(''\)\.every/.test(read('../auth.js'))],
  ['Password visibility control updates accessible pressed state', /ww-password-toggle/.test(read('../auth.js')) && /setAttribute\('aria-pressed', String\(!showing\)\)/.test(read('../auth.js'))],
  ['Account dialog supports keyboard focus trapping and restores launcher focus', /event\.key !== 'Tab'/.test(read('../auth.js')) && /launch\.focus\(\)/.test(read('../auth.js'))],
  ['Stale profile requests cannot overwrite a newer account state', /playerRefreshToken/.test(read('../auth.js')) && /refreshToken !== playerRefreshToken/.test(read('../auth.js'))],
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
  ['Career shift income is server-priced, authenticated, ledgered and capped daily', careerRewardMigration.includes('auth.uid()') && careerRewardMigration.includes("when 'cafe' then 12") && careerRewardMigration.includes("when 'market' then 11") && careerRewardMigration.includes("when 'delivery' then 13") && careerRewardMigration.includes('if v_count >= 10') && careerRewardMigration.includes("'career_income'") && careerRewardMigration.includes('grant execute on function public.ww_claim_career_shift(text) to authenticated')],
  ['Signed-in career shifts request the server-authoritative wallet reward', /rpc\('ww_claim_career_shift'/.test(careers) && /wonderworld:cloud-wallet-updated/.test(careers)],
  ['Economy RPCs require authenticated users and restrict anonymous execution', economyMigration.includes('auth.uid()') && economyMigration.includes('revoke all on function public.ww_purchase_game_item(text) from public,anon') && economyMigration.includes('grant execute on function public.ww_purchase_game_item(text) to authenticated')],
  ['Mobile viewport allows user zoom', /viewport-fit=cover/.test(html) && !/user-scalable=no|max(?:imum)?-scale=1/i.test(html)],
  ['Browser gameplay smoke tests are required and cannot silently pass on failure', /name: Run browser gameplay smoke tests\s+run: node scripts\/smoke-browser\.mjs/.test(workflow) && !/name: Run browser gameplay smoke tests[\s\S]{0,180}continue-on-error:\s*true/.test(workflow)],

  ['Ludo and chess activities are dynamically wired', /import\(['"]\.\/board-games\.js\?v=/.test(game)],
  ['Casual arcade module is loaded by the page', /mini-games\.js\?v=/.test(html) && /function boot\(\)/.test(miniGames)],
  ['Activity hub adds only missing modes and avoids duplicate gym/cup entries', /wonderworld-activities\.js\?v=/.test(html) && ['battle','football','ropes','fashion','gym','plane','train','arrows','stocks','space','candy','party'].every(id => activities.includes("'" + id + "'")) && activities.includes("['gym','🏋️'") && !activities.includes("['cups','🥤'") && /quick-gym/.test(game) && /wwa-cups-open/.test(miniGames)],
  ['Battle Royale includes health, ammunition, aim and enemy targets', /hp:100,ammo:30/.test(activities) && /state\.aimX/.test(activities) && /targets:\[\]/.test(activities)],
  ['Football match includes a clock, two-team score, possession, pass, shoot, goalkeeper and final result', /function renderFootball/.test(activities) && /seconds:90/.test(activities) && /state\.blue/.test(activities) && /state\.red/.test(activities) && /function pass\(\)/.test(activities) && /state\.passTarget=mate/.test(activities) && /state\.possession==='teammate'&&state\.passTarget/.test(activities) && /function shoot\(\)/.test(activities) && /state\.keeper/.test(activities) && /نهاية المباراة/.test(activities)],
  ['Rope puzzle uses draggable SVG rope endpoints and geometric crossing detection', /function renderRopes\(\)/.test(activities) && /wwa-rope-stage/.test(activities) && /pointermove/.test(activities) && /function crossings\(\)/.test(activities)],
  ['Battle Royale is a survival arena with moving AI opponents, shrinking zone and win/loss states', /function renderBattle\(\)/.test(activities) && /state\.targets=Array\.from\(\{length:6\}/.test(activities) && /state\.elapsed/.test(activities) && /state\.kills>=6/.test(activities) && /state\.hp<=0/.test(activities)],
  ['Avatar profile persists each appearance change and includes a saved hair color', /hairColor: 'brown'/.test(game) && /avatar-hair-color/.test(game) && /avatarHairMaterials/.test(game) && /avatarProfile\.hairColor = event\.target\.value; applyAvatarProfile\(\); saveProgress\(\)/.test(game) && /loadedProgress\.avatarProfile/.test(game)],
  ['Rope puzzle renders braided multi-strand ropes, textured color gradients and touch-friendly draggable endpoints', /function renderRopes/.test(activities) && /wwa-rope-nodes/.test(activities) && /wwa-crossings/.test(activities) && /wwa-rope-red/.test(activities) && /wwa-rope-blue/.test(activities) && /wwa-rope-gold/.test(activities) && /wwa-rope-purple/.test(activities) && /braid\+='M'/.test(activities) && /r:29,fill:'transparent'/.test(activities)],
  ['Fashion show has themed outfits and a judging score', /function renderFashion/.test(activities) && /تقييم لجنة التحكيم/.test(activities)],
  ['Plane and train activities require safe sequence of controls', /function renderPlane/.test(activities) && /زودي قوة المحرك/.test(activities) && /function renderTrain/.test(activities) && /أوقفي القطار تمامًا/.test(activities)],
  ['Arrow escape puzzle tracks cleared arrows and blocks obstructed paths', /function renderArrows/.test(activities) && /function canExit\(a\)/.test(activities) && /wwa-arrow-cleared/.test(activities)],
  ['Gym progression and stock market use local virtual counters only', /function renderGym/.test(activities) && /function renderStocks/.test(activities) && /لا يوجد تداول حقيقي/.test(activities)],
  ['Cup guessing, space shooter, Candy Crush and Sparkle Party are playable', /function renderCups/.test(activities) && /function renderSpace/.test(activities) && /function renderCandy/.test(activities) && /function renderParty/.test(activities)],
  ['Color-matching arcade game scores correct choices and supports restart', /function chooseColor/.test(miniGames) && /function newColorRound/.test(miniGames) && /wwa-color-reset/.test(miniGames)],
  ['Cup guessing game reveals the hidden star and can restart', /function newCups/.test(miniGames) && /ww-cup/.test(miniGames) && /wwa-cups-reset/.test(miniGames)],
  ['Board-game module contains Ludo and chess activities', /function initLudo\(/.test(boardGames) && /function initChess\(/.test(boardGames) && /cpuTurn/.test(boardGames)],
  ['Ludo home pieces are rendered and selectable before launch', /homeSlots=\{/.test(boardGames) && /data-ludo-home/.test(boardGames) && /moveLudo\(slot\[0\],slot\[1\]\)/.test(boardGames)],
  ['Static houses and pool are re-enabled independently of account state', /staticHouseStructures/.test(game) && /staticPoolStructures/.test(game) && /ensureStaticWorldVisible\(\)/.test(game)],
  ['Cloud saves track the active account and clear prior account data for a fresh account', /wonderworld-active-cloud-user-v1/.test(game) && /priorCloudUser !== userId/.test(game) && /localStorage\.removeItem\(GAME_SAVE_KEY\)/.test(game)],
  ['Ludo win-loss record persists locally and only records each finished game once', /wonderworld-ludo-record-v1/.test(boardGames) && /function recordLudoResult/.test(boardGames) && /ludo\.recorded/.test(boardGames)],
  ['Chess supports undo snapshots and resettable history', /chess\.history\.push/.test(boardGames) && /id="chess-undo"/.test(boardGames) && /chess\.history\.pop\(\)/.test(boardGames) && /chess\.history\.length===0/.test(boardGames)],

  ['PlayCanvas scene entry is loaded', /main\.js\?v=/.test(html)],
  ['Fashion Week has a visible 3D runway destination connected to the visual outfit and judging activity', /Fashion runway stage/.test(game) && /منصة WonderWorld Fashion Week/.test(game) && /wwa-fashion-stage/.test(activities) && /wwa-fashion-clothes/.test(activities)],
  ['Activity switching clears stale click handlers instead of stacking duplicate game actions', /content\.replaceWith\(next\)/.test(activities) && /content = next/.test(activities)],
  ['Family/friend gatherings use preset choices, bounded NPC participation, progression rewards and no free-text chat', /open-gathering/.test(game) && /gatheringEvents/.test(game) && /gathering-choices/.test(game) && /input\[type="checkbox"\]:checked/.test(game) && /gathering-panel/.test(css)],
  ['Two distinct ready-made furnished villas exist; free home and virtual-currency premium home are integrated with saved ownership', /Wonder Starter Villa Interior/.test(game) && /Wonder Luxury Villa Interior/.test(game) && /ownedHomes/.test(game) && /250 عملة افتراضية/.test(game) && /فيلا Wonder الجاهزة/.test(game)],
  ['Character creator supports ages 5–65, three presentation styles, four skin tones and four hairstyles with saved profile', /avatar-creator-panel/.test(game) && /min="5" max="65"/.test(game) && /avatarProfile/.test(game) && /avatarHairStyles/.test(game) && /avatar-creator-feedback/.test(game)],
  ['3D airport aircraft and railway train are visible and launch playable plane/train activities', /Wonder Air aircraft fuselage/.test(game) && /Wonder train locomotive body/.test(game) && /مطار Wonder Air/.test(game) && /محطة Wonder Central/.test(game) && /wonderworld:open-activity/.test(game) && /wonderworld:open-activity/.test(activities)],
  ['Cross-country destinations include Egypt, Paris and Tokyo with separate 3D landmark areas and unrestricted world travel', /رحلة إلى مصر — الأهرامات/.test(game) && /رحلة إلى باريس — البرج/.test(game) && /رحلة إلى طوكيو — حديقة الساكورا/.test(game) && /Egypt stepped pyramid tier/.test(game) && /Paris tower left leg/.test(game) && /Tokyo torii lintel/.test(game) && /updateDistrictStreaming\(p\.x, p\.z\)/.test(game)],
  ['Controllable car model is wired to player movement and touch controls', /const playerCar = new Entity/.test(game) && /toggleVehicleMode/.test(game) && /vehicleMode \? 2\.6/.test(game) && /playerCar\.setPosition\(p\.x, 0, p\.z\)/.test(game)],
  ['3D avatars have facial features, legs, shoes, hair recoloring and walk animation', /name \+ ' left pupil'/.test(game) && /name \+ ' left leg'/.test(game) && /person\.hairParts = \[hair, hairFront\]/.test(game) && /player\.leftLeg\.setLocalEulerAngles/.test(game)],
  ['Home swimming pool is a real 3D destination with a gameplay interaction', /Home pool water/.test(game) && /name: 'مسبح البيت/.test(game) && /السعادة \+15/.test(game)],
  ['Home builder offers brick, gold, yellow, cream, pink and mint facades and persists roof/garden design', /open-home-build/.test(game) && /wonderworld-home-design-v1/.test(game) && /wallBrick/.test(game) && /wallGold/.test(game) && /wallYellow/.test(game) && /wall: 'brick'/.test(game) && ['brick','gold','yellow','cream','pink','mint'].every(color => game.includes('data-home-wall="' + color + '"')) && /data-home-roof/.test(game)],
  ['Wonder guide offers bounded, prewritten safety guidance without free-form chat', /wonderGuideTopics = \[/.test(game) && /wonder-guide-choices/.test(game) && /لا تستقبل رسائل حرة/.test(game) && !/textarea[^>]*wonder-guide/i.test(game)],
  ['Career system is loaded', /careers\.js\?v=/.test(html)],
  ['Mobile touch controls exist', /data-dir="up"/.test(html) && /data-dir="left"/.test(html)],
  ['Mobile virtual joystick and camera-relative third-person orbit controls are wired', /id="move-joystick"/.test(html) && /moveJoystick\.addEventListener\('pointerdown'/.test(game) && /cameraOrbitYaw/.test(game) && /inputRight \* cameraCos/.test(game) && /camera-look-hint/.test(css)],
  ['Mobile joystick captures its pointer and always recenters on release, cancel, lost capture, browser blur or hidden tab', /moveJoystick\.setPointerCapture\?\.\(event\.pointerId\)/.test(game) && /\['pointerup','pointercancel','lostpointercapture'\]/.test(game) && /function releaseJoystick\(\)/.test(game) && /document\.addEventListener\('pointerup', releaseJoystickPointer, true\)/.test(game) && /document\.addEventListener\('pointercancel', releaseJoystickPointer, true\)/.test(game) && /window\.addEventListener\('blur', releaseJoystick\)/.test(game) && /analogMoveX = 0/.test(game) && /analogMoveY = 0/.test(game)],
  ['Camera drag starts only on the 3D canvas and releases cleanly without hijacking HUD gestures', /if \(event\.target !== canvas\) return;/.test(game) && /document\.addEventListener\('pointermove'/.test(game) && /document\.addEventListener\('pointerup', releaseCameraPointer/.test(game) && /document\.addEventListener\('pointercancel', releaseCameraPointer/.test(game)],
  ['Camera drag state is cleared when the browser loses focus or the tab becomes hidden', /window\.addEventListener\('blur', clearCameraPointer\)/.test(game) && /document\.addEventListener\('visibilitychange',[\s\S]*?document\.hidden[\s\S]*?clearCameraPointer\(\)/.test(game)],
  ['Mobile camera dock exposes zoom and recenter controls with bounded indoor/outdoor distance', /id="camera-zoom-in"/.test(html) && /id="camera-zoom-out"/.test(html) && /id="camera-reset"/.test(html) && /function setCameraDistance\(/.test(game) && /Math\.max\(3\.2, Math\.min\(7\.5, cameraOrbitDistance\)\)/.test(game) && /#camera-controls/.test(css)],
  ['World interaction control exists', /id="interact"/.test(game)],
  ['Neighborhood destinations include enterable furnished shop and cafe interiors with clickable context actions', /const shopInteriorRoot = new Entity\('Wonder Shop Interior'\)/.test(game) && /const cafeInteriorRoot = new Entity\('Wonder Cafe Interior'\)/.test(game) && /activeIndoorAction\.run\(\)/.test(game) && /متجر Wonder', shopInteriorRoot/.test(game) && /كافيه Wonder', cafeInteriorRoot/.test(game) && /#exit-home, #indoor-place-action\s*\{\s*pointer-events: auto/.test(css)],
  ['Neighborhood destinations exist', /const places = \[/.test(game)],
  ['Restaurant, office and gym each have separate furnished 3D interiors and usable activity actions', /Wonder Restaurant Interior/.test(game) && /Wonder Community Office Interior/.test(game) && /Wonder Fitness Interior/.test(game) && /مطعم Wonder', restaurantInteriorRoot/.test(game) && /مكتب الحي', x: 0, z: -18.3, radius: 4.0, action: \(\) => enterHome\('مكتب الحي', officeInteriorRoot/.test(game) && /Wonder Fitness', x: 15, z: -18, radius: 4.5, action: \(\) => enterHome\('Wonder Fitness', fitnessInteriorRoot/.test(game)],
  ['Restaurant interior includes dining service and a fully equipped kitchen', /Restaurant dining table/.test(game) && /Restaurant commercial stove/.test(game) && /Restaurant refrigerator/.test(game) && /Restaurant plate/.test(game)],
  ['Office interior includes workstations, monitors, keyboards and filing storage', /Office workstation desk/.test(game) && /Office workstation monitor/.test(game) && /Office keyboard/.test(game) && /Office filing cabinet/.test(game)],
  ['Gym interior includes treadmills, dumbbells, weight bench and yoga mats', /Fitness treadmill base/.test(game) && /Fitness dumbbell weight/.test(game) && /Fitness weight bench/.test(game) && /Fitness yoga mat/.test(game)],
  ['Starter home includes desk, laptop, refrigerator, stove and bathroom fixtures', /Home writing desk/.test(game) && /Home laptop screen/.test(game) && /Home refrigerator/.test(game) && /Home stove oven/.test(game) && /Home bathroom toilet base/.test(game)],
  ['Restaurant is reachable from the fast-travel map', /name:'مطعم Wonder',emoji:'🍽️',x:8,z:-25/.test(game)],
  ['Purchased player-owned shop is reachable and opens business management', /if \(playerBusiness\.enabled\)/.test(game) && /مشروعي الخاص — إدارة المحل/.test(game) && /careerButton\.click\(\)/.test(game)],
  ['Social walk requires explicit consent', /موافقة/.test(game) && /accept\.addEventListener/.test(game)],
  ['NPC dialogue choices trigger short two-arm conversation gestures that return to neutral pose', /const npcGestureState = new Map\(\)/.test(game) && /npcGestureState\.set\(npc\.name, \{ started: Date\.now\(\), until: Date\.now\(\) \+ 1900 \}\)/.test(game) && /socialGesture && Date\.now\(\) < socialGesture\.until/.test(game) && /npcGestureState\.delete\(npc\.name\)/.test(game)],
  ['Pet care system exists', /function careForActivePet/.test(game)],
  ['Career progression has a daily contract', /dailyOrderCount/.test(careers) && /contractClaimedDate/.test(careers)],
  ['Business level upgrades are bounded in the UI', /businessLevel >= 5/.test(careers)],
  ['Career panel stacks above HUD controls', careerCss.includes('z-index:150')],
  ['Responsive base styles exist', /@media/.test(css) && /@media/.test(careerCss)],
    ['Expanded procedural mega-world has spacious 96-unit districts, landscaped private homes and enterable furnished business interiors', game.includes('const DISTRICT_CHUNK_SIZE = 96;') && /DISTRICT_STREAM_RADIUS = 1/.test(game) && /makeDistrictHome/.test(game) && game.includes('floors = seed % 4 === 0 ? 2 : 3') && /Generated house balcony/.test(game) && /Home private garden lawn/.test(game) && /Home pool water/.test(game) && /Commercial plots get a front plaza/.test(game) && /districtBusinessTypes/.test(game) && ['Cafes','Restaurants','Fashion stores','Hospitals','Office buildings','Beauty salons','Gyms','Supermarkets','Schools','Cinemas','Pharmacies','Arcades'].every(type => game.includes("name: '" + type + "'")) && game.includes('for(const localX of [-30,-10,10,30])') && game.includes('for(const roadOffset of [-48,48])') && /Procedural District Interior/.test(game) && /prepareDistrictInterior/.test(game) && /districtPlace/.test(game) && /updateDistrictStreaming/.test(game) && /root\.destroy\(\)/.test(game) && /Town green', 6000/.test(game)],
  ['Procedural public buildings have readable English storefront signs while houses and villas remain unlabeled', /districtSignMaterial/.test(game) && /districtLabelFor/.test(game) && /readable storefront sign/.test(game) && /CAFE/.test(game) && /HOSPITAL/.test(game) && /CINEMA/.test(game) && /type.kind !== 'home' && type.kind !== 'villa'/.test(game)],
  ['Procedural interiors show matching signs and pharmacy/apartment interiors have dedicated furnishing', /District interior readable sign/.test(game) && /Pharmacy medicine cabinet/.test(game) && /Apartment lobby reception/.test(game) && /Arcade game cabinet/.test(game)],
  ['Player movement is no longer clamped to the starter neighborhood', !/p\.x = Math\.max\(-42/.test(game) && !/p\.z = Math\.max\(-42/.test(game)],
  ['No service-role credential is hard-coded', !/service_role/i.test(html + game + careers)],
  ['Billiards activity is playable with touch aiming, ball collisions, cushions and pockets', /function renderBilliards\(\)/.test(activities) && /wwa-pool-canvas/.test(activities) && /function shoot\(e\)/.test(activities) && /const pockets=/.test(activities) && /requestAnimationFrame\(step\)/.test(activities)],
  ['Dominoes activity supports matching both chain ends and a computer opponent', /function renderDominoes\(\)/.test(activities) && /function cpuPlay\(\)/.test(activities) && /state\.chain\.unshift/.test(activities) && /wwa-domino-hand/.test(activities)],
  ['Card game supports a shuffled 52-card deck, ten rounds and score-based result', /function renderCards\(\)/.test(activities) && /suits\.flatMap/.test(activities) && /state\.round>=10/.test(activities) && /wwa-card-draw/.test(activities)],
  ['Five screen-edge category shortcuts are generated from the existing menu sections', /ww-menu-categories/.test(game) && /wwMenuCategoryIcons = \['✨', '🌍', '🏡', '🎮', '🎒'\]/.test(game) && /wwMenuSections\.forEach/.test(game)],
  ['Only the selected menu category opens and every original menu action ID is preserved', /wwMenuBodies\.forEach/.test(game) && /item\.section\.hidden = true/.test(game) && /ww-section-body button/.test(game) && ['open-map','open-football','open-puzzle','open-blockblast','open-watersort','open-shop','open-pets'].every(id => game.includes('id="' + id + '"'))],
  ['Additional arcade, board, challenge and space launchers are docked inside the games category', ['ww-activities-launch','ww-arcade-launch','board-games-launch','ww-challenges-launch','ww-space-launcher'].every(id => game.includes("'" + id + "'")) && /dockWonderGameLaunchers/.test(game)],
  ['Category rail and selected panel stay on the screen edge and adapt to landscape phones', /#life-ui #ww-menu-categories/.test(css) && /right: 6px/.test(css) && /orientation: landscape/.test(css) && /#life-ui #ww-menu-content\[hidden\]/.test(css)],
];

let failed = 0;
for (const [label, passed] of checks) {
  console.log((passed ? 'PASS' : 'FAIL') + ' — ' + label);
  if (!passed) failed += 1;
}
if (failed) process.exitCode = 1;
else console.log('All ' + checks.length + ' static regression checks passed.');
