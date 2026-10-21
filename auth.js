import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.0';

const SUPABASE_URL = 'https://kkfmrvgpendfziejscsz.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_aOosJXpV_6B_ErSwVFJ1zQ_ZAq_nksS';
const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
});
// Publish the configured client for same-origin game modules; RLS still enforces per-user access.
window.wonderWorldSupabase = supabase;

const style = document.createElement('style');
style.textContent = `
#ww-auth-launch{position:fixed;z-index:1200;top:12px;left:12px;border:1px solid #ffffff55;border-radius:14px;background:#172b4d;color:#fff;padding:10px 14px;font:600 14px system-ui;box-shadow:0 5px 18px #0003}
#ww-auth-overlay{position:fixed;z-index:1300;inset:0;background:#08152bd9;display:flex;align-items:center;justify-content:center;padding:16px;font-family:system-ui;direction:rtl}
#ww-auth-overlay[hidden]{display:none}
#ww-auth-card{width:min(100%,420px);max-height:90dvh;overflow:auto;background:#fff;color:#172b4d;border-radius:20px;padding:22px;box-shadow:0 20px 60px #0005}
#ww-auth-card h2{margin:0 0 8px;font-size:22px}
#ww-auth-card p{line-height:1.6}
#ww-auth-card label{display:block;font-size:13px;font-weight:700;margin:12px 0 5px}
#ww-auth-card input{box-sizing:border-box;width:100%;padding:12px;border:1px solid #cbd5e1;border-radius:10px;font:inherit}
#ww-auth-card button{border:0;border-radius:10px;padding:11px 14px;font:600 14px system-ui;cursor:pointer}
#ww-auth-card .ww-primary{background:#2357a6;color:white}
#ww-auth-card .ww-secondary{background:#e8eef7;color:#172b4d}
#ww-auth-card .ww-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:14px}
#ww-auth-message{min-height:24px;color:#334155;font-size:13px}
#ww-auth-summary{background:#f1f5f9;border-radius:12px;padding:12px;margin-top:12px;font-size:14px;line-height:1.8}
#ww-auth-note{font-size:12px;color:#64748b}
`;
document.head.appendChild(style);

const launch = document.createElement('button');
launch.id = 'ww-auth-launch';
launch.type = 'button';
launch.textContent = '👤 حساب اللاعب';
launch.setAttribute('aria-haspopup', 'dialog');
document.body.appendChild(launch);

const overlay = document.createElement('div');
overlay.id = 'ww-auth-overlay';
overlay.hidden = true;
overlay.innerHTML = `
<section id="ww-auth-card" role="dialog" aria-modal="true" aria-labelledby="ww-auth-title">
  <h2 id="ww-auth-title">حساب WonderWorld</h2>
  <p id="ww-auth-intro">سجّلي الدخول لحسابك أو أنشئي حسابًا جديدًا لحفظ هوية اللاعب في Supabase.</p>
  <div id="ww-auth-form">
    <label for="ww-display-name">اسم اللاعب (للحساب الجديد فقط)</label>
    <input id="ww-display-name" autocomplete="nickname" maxlength="40" placeholder="اسم اللاعب">
    <label for="ww-email">البريد الإلكتروني</label>
    <input id="ww-email" type="email" autocomplete="email" required maxlength="254" placeholder="name@example.com">
    <label for="ww-password">كلمة المرور</label>
    <input id="ww-password" type="password" autocomplete="current-password" required minlength="8" maxlength="128" placeholder="8 أحرف على الأقل">
    <div class="ww-actions">
      <button id="ww-signin" class="ww-primary" type="button">تسجيل الدخول</button>
      <button id="ww-signup" class="ww-secondary" type="button">إنشاء حساب</button>
    </div>
  </div>
  <div id="ww-auth-summary" hidden></div>
  <p id="ww-auth-message" role="status" aria-live="polite"></p>
  <p id="ww-auth-note">الأرصدة والتقدم المعروضان من قاعدة البيانات للقراءة فقط. لا تُجرى مشتريات أو تغييرات في العملات من هذه الواجهة.</p>
  <div class="ww-actions">
    <button id="ww-signout" class="ww-secondary" type="button" hidden>تسجيل الخروج</button>
    <button id="ww-auth-close" class="ww-secondary" type="button">إغلاق</button>
  </div>
</section>`;
document.body.appendChild(overlay);

const byId = (id) => document.getElementById(id);
const message = (text) => { byId('ww-auth-message').textContent = text; };
const open = () => { overlay.hidden = false; message(''); byId('ww-email').focus(); };
const close = () => { overlay.hidden = true; };
launch.addEventListener('click', open);
byId('ww-auth-close').addEventListener('click', close);
overlay.addEventListener('click', (event) => { if (event.target === overlay) close(); });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !overlay.hidden) close(); });

function setBusy(busy) {
  byId('ww-signin').disabled = busy;
  byId('ww-signup').disabled = busy;
}
function showSignedOut() {
  launch.textContent = '👤 حساب اللاعب';
  byId('ww-auth-form').hidden = false;
  byId('ww-auth-summary').hidden = true;
  byId('ww-signout').hidden = true;
  byId('ww-display-name').disabled = false;
}
async function refreshPlayer(user) {
  byId('ww-auth-form').hidden = true;
  byId('ww-auth-summary').hidden = false;
  byId('ww-signout').hidden = false;
  byId('ww-display-name').disabled = true;
  launch.textContent = '👤 ' + (user.user_metadata?.display_name || user.email || 'حساب اللاعب');
  const summary = byId('ww-auth-summary');
  summary.textContent = 'جاري تحميل بيانات اللاعب…';
  const [profileResult, progressResult, walletResult] = await Promise.all([
    supabase.from('player_profiles').select('display_name,avatar_id,created_at').eq('id', user.id).maybeSingle(),
    supabase.from('player_progress').select('level,experience,updated_at').eq('player_id', user.id).maybeSingle(),
    supabase.from('player_wallets').select('coins,updated_at').eq('player_id', user.id).maybeSingle()
  ]);
  const errors = [profileResult, progressResult, walletResult].filter((r) => r.error);
  summary.replaceChildren();
  const line = (label, value) => {
    const row = document.createElement('div');
    const strong = document.createElement('strong');
    strong.textContent = label + ': ';
    row.append(strong, document.createTextNode(String(value)));
    summary.appendChild(row);
  };
  line('اللاعب', profileResult.data?.display_name || user.user_metadata?.display_name || user.email || 'لا يوجد اسم');
  line('المستوى', progressResult.data?.level ?? 'لم يُنشأ بعد');
  line('الخبرة', progressResult.data?.experience ?? '—');
  line('عملات اللعبة', walletResult.data?.coins ?? '—');
  if (errors.length) {
    const warning = document.createElement('p');
    warning.textContent = 'تعذّر تحميل بعض بيانات اللاعب. تحققي من إعدادات قاعدة البيانات؛ لم يتم تغيير أي بيانات.';
    summary.appendChild(warning);
    console.error('WonderWorld profile read failed', errors.map((r) => r.error));
  }
  if (!profileResult.data && !progressResult.data && !walletResult.data && !errors.length) {
    const note = document.createElement('p');
    note.textContent = 'الحساب مسجّل، لكن سجلات اللاعب لم تظهر بعد. قد تحتاجين لتأكيد البريد الإلكتروني أو مراجعة trigger التسجيل.';
    summary.appendChild(note);
  }
}
let accountSwitching = false;
async function syncSession(session) {
  if (accountSwitching) return;
  const signedInUserId = session?.user?.id || null;
  // Keep browser-local prototype saves isolated when a different account signs in.
  // The first account adopts existing local progress; switching accounts clears local game state
  // before any module can upload the previous account's data to the new account.
  if (signedInUserId) {
    const ownerKey = 'wonderworld-local-owner';
    let previousOwner = null;
    try { previousOwner = localStorage.getItem(ownerKey); } catch (_) {}
    if (previousOwner && previousOwner !== signedInUserId) {
      accountSwitching = true;
      try {
        for (let i = localStorage.length - 1; i >= 0; i--) {
          const key = localStorage.key(i);
          if (key && key.startsWith('wonderworld-') && key !== ownerKey) localStorage.removeItem(key);
        }
        localStorage.setItem(ownerKey, signedInUserId);
      } catch (_) {}
      window.location.reload();
      return;
    }
    try { if (!previousOwner) localStorage.setItem(ownerKey, signedInUserId); } catch (_) {}
  }
  window.dispatchEvent(new CustomEvent('wonderworld:auth-state', {
    detail: { user: signedInUserId ? { id: signedInUserId } : null }
  }));
  if (!session?.user) { showSignedOut(); return; }
  try { await refreshPlayer(session.user); }
  catch (error) { console.error(error); message('تم تسجيل الدخول، لكن تعذّر تحميل بيانات اللاعب.'); }
}

byId('ww-signin').addEventListener('click', async () => {
  const email = byId('ww-email').value.trim();
  const password = byId('ww-password').value;
  if (!email || !password) { message('اكتبي البريد الإلكتروني وكلمة المرور.'); return; }
  setBusy(true); message('جاري تسجيل الدخول…');
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    await syncSession(data.session);
    message('تم تسجيل الدخول.');
  } catch (error) { message(error.message || 'تعذّر تسجيل الدخول.'); }
  finally { setBusy(false); }
});
byId('ww-signup').addEventListener('click', async () => {
  const email = byId('ww-email').value.trim();
  const password = byId('ww-password').value;
  const displayName = byId('ww-display-name').value.trim().slice(0, 40);
  if (!email || !password) { message('اكتبي البريد الإلكتروني وكلمة المرور.'); return; }
  if (password.length < 8) { message('كلمة المرور لازم تكون 8 أحرف على الأقل.'); return; }
  setBusy(true); message('جاري إنشاء الحساب…');
  try {
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { data: { display_name: displayName || 'Player' } }
    });
    if (error) throw error;
    if (data.session?.user) {
      await syncSession(data.session);
      message('تم إنشاء الحساب وتسجيل الدخول.');
    } else {
      message('تم إرسال طلب إنشاء الحساب. لو تأكيد البريد مفعّل، افتحي رسالة التأكيد ثم سجّلي الدخول.');
    }
  } catch (error) { message(error.message || 'تعذّر إنشاء الحساب.'); }
  finally { setBusy(false); }
});
byId('ww-signout').addEventListener('click', async () => {
  byId('ww-signout').disabled = true;
  const { error } = await supabase.auth.signOut();
  byId('ww-signout').disabled = false;
  if (error) { message(error.message || 'تعذّر تسجيل الخروج.'); return; }
  showSignedOut(); message('تم تسجيل الخروج.');
});
supabase.auth.onAuthStateChange((_event, session) => { void syncSession(session); });
supabase.auth.getSession().then(({ data, error }) => {
  if (error) { message('تعذّر التحقق من جلسة الحساب.'); return; }
  void syncSession(data.session);
});
