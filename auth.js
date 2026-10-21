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
#ww-auth-card button:focus-visible,#ww-auth-card input:focus-visible{outline:3px solid #8b61c2;outline-offset:2px}
#ww-auth-card button:disabled{opacity:.6;cursor:wait}
#ww-password-toggle{margin-top:7px}
#ww-forgot-password{padding-inline:4px;background:transparent;color:#2357a6;text-decoration:underline}
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
    <input id="ww-password" type="password" autocomplete="current-password" required minlength="8" maxlength="128" placeholder="12 حرفًا على الأقل">
    <div class="ww-actions">
      <button id="ww-signin" class="ww-primary" type="button">تسجيل الدخول</button>
      <button id="ww-signup" class="ww-secondary" type="button">إنشاء حساب</button>
      <button id="ww-forgot-password" type="button">نسيت كلمة المرور؟</button>
      <button id="ww-password-toggle" class="ww-secondary" type="button" aria-pressed="false">إظهار كلمة المرور</button>
      <button id="ww-save-new-password" class="ww-primary" type="button" hidden>حفظ كلمة المرور الجديدة</button>
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
const close = () => { overlay.hidden = true; launch.focus(); };
launch.addEventListener('click', open);
byId('ww-auth-close').addEventListener('click', close);
overlay.addEventListener('click', (event) => { if (event.target === overlay) close(); });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !overlay.hidden) close(); });

function setBusy(busy) {
  for (const id of ['ww-signin', 'ww-signup', 'ww-forgot-password', 'ww-save-new-password']) byId(id).disabled = busy;
}
function friendlyAuthError(error) {
  const raw = String(error?.message || '').toLowerCase();
  if (raw.includes('invalid login credentials')) return 'البريد الإلكتروني أو كلمة المرور غير صحيحة.';
  if (raw.includes('email not confirmed')) return 'أكّدي البريد الإلكتروني أولًا، ثم حاولي تسجيل الدخول.';
  if (raw.includes('password should be at least') || raw.includes('password is too short')) return 'كلمة المرور أقصر من الحد المطلوب. استخدمي 12 حرفًا على الأقل.';
  if (raw.includes('rate limit') || raw.includes('too many requests')) return 'محاولات كتير في وقت قصير. استني شوية وجربي تاني.';
  if (raw.includes('user already registered')) return 'الحساب موجود بالفعل. جرّبي تسجيل الدخول أو استعادة كلمة المرور.';
  if (raw.includes('network') || raw.includes('fetch')) return 'تعذّر الاتصال بالخدمة. راجعي الإنترنت وحاولي مرة تانية.';
  return 'تعذّرت العملية. راجعي البيانات واتأكدي من الاتصال، ثم حاولي مرة تانية.';
}
function validateCredentials(forSignup = false) {
  const email = byId('ww-email');
  email.value = email.value.trim();
  if (!email.value) { message('اكتبي البريد الإلكتروني.'); email.focus(); return false; }
  if (!email.checkValidity()) { message('اكتبي بريدًا إلكترونيًا صحيحًا.'); email.focus(); return false; }
  const password = byId('ww-password').value;
  if (!password) { message('اكتبي كلمة المرور.'); byId('ww-password').focus(); return false; }
  if (forSignup && password.length < 12) { message('لأمان حسابك، اختاري كلمة مرور من 12 حرفًا على الأقل.'); byId('ww-password').focus(); return false; }
  if (forSignup && password.split('').every((char) => char === password[0])) { message('اختاري كلمة مرور متنوعة، مش نفس الحرف مكرر.'); byId('ww-password').focus(); return false; }
  if (forSignup && /(?:0123456789|1234567890|0987654321|qwertyuiop)/i.test(password)) { message('اختاري كلمة مرور أقوى وفريدة لحساب WonderWorld.'); byId('ww-password').focus(); return false; }
  return true;
}
let recoveryMode = false;
function setRecoveryMode(active, email = '') {
  recoveryMode = active;
  byId('ww-auth-title').textContent = active ? 'تعيين كلمة مرور جديدة' : 'حساب WonderWorld';
  byId('ww-auth-intro').textContent = active
    ? 'اكتبي كلمة مرور جديدة من 12 حرفًا على الأقل لحماية حسابك.'
    : 'سجّلي الدخول لحسابك أو أنشئي حسابًا جديدًا لحفظ هوية اللاعب في Supabase.';
  byId('ww-display-name').hidden = active;
  byId('ww-auth-card').querySelector('label[for="ww-display-name"]').hidden = active;
  byId('ww-signin').hidden = active;
  byId('ww-signup').hidden = active;
  byId('ww-forgot-password').hidden = active;
  byId('ww-save-new-password').hidden = !active;
  byId('ww-password').value = '';
  byId('ww-password').autocomplete = active ? 'new-password' : 'current-password';
  if (email) byId('ww-email').value = email;
  byId('ww-email').readOnly = active && Boolean(email);
  overlay.hidden = false;
  message(active ? 'رابط الاستعادة صالح. اختاري كلمة مرور جديدة.' : '');
  byId('ww-password').focus();
}
function showSignedOut() {
  launch.textContent = '👤 حساب اللاعب';
  byId('ww-auth-form').hidden = false;
  byId('ww-auth-summary').hidden = true;
  byId('ww-signout').hidden = true;
  byId('ww-display-name').disabled = false;
}
let playerRefreshToken = 0;
async function refreshPlayer(user) {
  const refreshToken = ++playerRefreshToken;
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
  if (refreshToken !== playerRefreshToken) return;
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
try {
  if (localStorage.getItem('wonderworld-account-switching') === '1') localStorage.removeItem('wonderworld-account-switching');
} catch (_) {}
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
      try { localStorage.setItem('wonderworld-account-switching', '1'); } catch (_) {}
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
  if (!session?.user) { playerRefreshToken++; showSignedOut(); return; }
  try { await refreshPlayer(session.user); }
  catch (error) { console.error(error); message('تم تسجيل الدخول، لكن تعذّر تحميل بيانات اللاعب.'); }
}

byId('ww-signin').addEventListener('click', async () => {
  if (!validateCredentials(false)) return;
  const email = byId('ww-email').value.trim();
  const password = byId('ww-password').value;
  setBusy(true); message('جاري تسجيل الدخول…');
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    await syncSession(data.session);
    message('تم تسجيل الدخول.');
  } catch (error) { message(friendlyAuthError(error)); }
  finally { setBusy(false); }
});
byId('ww-signup').addEventListener('click', async () => {
  if (!validateCredentials(true)) return;
  const email = byId('ww-email').value.trim();
  const password = byId('ww-password').value;
  const displayName = byId('ww-display-name').value.trim().slice(0, 40);
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
  } catch (error) { message(friendlyAuthError(error)); }
  finally { setBusy(false); }
});
byId('ww-forgot-password').addEventListener('click', async () => {
  const email = byId('ww-email');
  email.value = email.value.trim();
  if (!email.value) { message('اكتبي البريد الإلكتروني الأول عشان نقدر نرسل رابط الاستعادة.'); email.focus(); return; }
  if (!email.checkValidity()) { message('اكتبي بريدًا إلكترونيًا صحيحًا.'); email.focus(); return; }
  setBusy(true); message('جاري إرسال طلب استعادة كلمة المرور…');
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email.value, { redirectTo: window.location.href.split('#')[0] });
    if (error) throw error;
    message('لو البريد مسجّل، هتوصلك رسالة فيها خطوات استعادة كلمة المرور. راجعي الوارد والرسائل غير المرغوب فيها.');
  } catch (error) { message(friendlyAuthError(error)); }
  finally { setBusy(false); }
});
byId('ww-save-new-password').addEventListener('click', async () => {
  const password = byId('ww-password').value;
  if (password.length < 12) { message('اختاري كلمة مرور من 12 حرفًا على الأقل.'); byId('ww-password').focus(); return; }
  if (password.split('').every((char) => char === password[0]) ||
      /(?:0123456789|1234567890|0987654321|qwertyuiop)/i.test(password)) {
    message('اختاري كلمة مرور أقوى ومتنوعة.'); byId('ww-password').focus(); return;
  }
  setBusy(true); message('جاري تحديث كلمة المرور…');
  try {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw error;
    setRecoveryMode(false);
    message('اتغيّرت كلمة المرور بنجاح. حسابك جاهز للاستخدام.');
  } catch (error) {
    const raw = String(error?.message || '').toLowerCase();
    message(raw.includes('expired') || raw.includes('invalid') || raw.includes('session')
      ? 'رابط الاستعادة انتهت صلاحيته أو لم يعد صالحًا. اطلبي رابطًا جديدًا.'
      : friendlyAuthError(error));
  } finally { setBusy(false); }
});
byId('ww-password-toggle').addEventListener('click', () => {
  const password = byId('ww-password');
  const showing = password.type === 'text';
  password.type = showing ? 'password' : 'text';
  byId('ww-password-toggle').textContent = showing ? 'إظهار كلمة المرور' : 'إخفاء كلمة المرور';
  byId('ww-password-toggle').setAttribute('aria-pressed', String(!showing));
});
byId('ww-auth-card').addEventListener('keydown', event => {
  if (event.key !== 'Tab') return;
  const focusable = [...byId('ww-auth-card').querySelectorAll('button:not([disabled]):not([hidden]),input:not([disabled]):not([hidden])')].filter(node => node.offsetParent !== null);
  if (!focusable.length) return;
  const first = focusable[0], last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
});
byId('ww-password').addEventListener('keydown', event => {
  if (event.key === 'Enter' && !event.isComposing) { event.preventDefault(); byId('ww-signin').click(); }
});
byId('ww-signout').addEventListener('click', async () => {
  byId('ww-signout').disabled = true;
  const { error } = await supabase.auth.signOut();
  byId('ww-signout').disabled = false;
  if (error) { message(error.message || 'تعذّر تسجيل الخروج.'); return; }
  showSignedOut(); message('تم تسجيل الخروج.');
});
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'PASSWORD_RECOVERY') setRecoveryMode(true, session?.user?.email || '');
  void syncSession(session);
});
supabase.auth.getSession().then(({ data, error }) => {
  if (error) { message('تعذّر التحقق من جلسة الحساب.'); return; }
  void syncSession(data.session);
});
