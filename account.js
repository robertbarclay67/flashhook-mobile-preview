(() => {
'use strict';
const $ = id => document.getElementById(id);
const panels = ['auth-forms','signed-in','recovery','unavailable'];
let client, mode = 'login', busy = false, recoveryFlow = false, currentUser = null, lastEmail = '';
function status(message, kind = 'info') {
  $('auth-status').textContent = message;
  $('auth-status').dataset.kind = kind;
}
function show(panel) { panels.forEach(id => $(id).hidden = id !== panel); $('auth-loading').hidden = true; }
function setBusy(value) {
  busy = value;
  document.querySelectorAll('button').forEach(button => { button.disabled = value; });
  $('auth-form').setAttribute('aria-busy',String(value));
  $('recovery-form').setAttribute('aria-busy',String(value));
}
function clearPasswords() {
  ['password','confirm-password','new-password','confirm-new-password'].forEach(id => { $(id).value = ''; });
}
function showMode(next, focus = true, force = false) {
  if (busy && !force) return;
  mode = ['login','register','reset'].includes(next) ? next : 'login';
  show('auth-forms'); status(''); $('resend-form').hidden = true;
  const registration = mode === 'register', reset = mode === 'reset';
  $('account-title').textContent = registration ? 'Start with a spark.' : reset ? 'Reset your password.' : 'Welcome back.';
  $('mode-description').textContent = registration ? 'Create your free Flash-Hook account. No payment required.' : reset ? 'We’ll email a secure password-reset link if this address has an account.' : 'Log in to your Flash-Hook account.';
  $('password-fields').hidden = reset; $('password').disabled = reset; $('password').required = !reset;
  $('password').minLength = registration ? 12 : 1;
  $('password').autocomplete = registration ? 'new-password' : 'current-password';
  $('confirm-fields').hidden = !registration; $('confirm-password').disabled = !registration; $('confirm-password').required = registration;
  $('password-help').hidden = !registration; $('register-privacy').hidden = !registration;
  $('forgot-password').hidden = reset; $('back-login').hidden = !reset;
  $('submit-auth').textContent = registration ? 'Create account' : reset ? 'Send reset link' : 'Log in';
  document.querySelectorAll('[data-mode]').forEach(b => b.setAttribute('aria-pressed',String(b.dataset.mode === mode)));
  clearPasswords(); if (focus) $('email').focus();
}
function friendlyError(error, action) {
  const code = error?.code || '';
  if (code === 'email_not_confirmed') { $('resend-form').hidden = false; return 'Please confirm your email before logging in. Check your inbox, or request another confirmation below.'; }
  if (['over_email_send_rate_limit','over_request_rate_limit','email_send_rate_limit_exceeded'].includes(code) || error?.status === 429) return 'Too many attempts. Please wait a few minutes and try again.';
  if (code === 'weak_password') return 'Choose a stronger password with at least 12 characters.';
  if (code === 'signup_disabled') return 'Registration is temporarily unavailable. Please try again later.';
  if (code === 'email_address_not_authorized' || code === 'unexpected_failure') return 'Account email delivery is temporarily unavailable. Please try again later.';
  if (action === 'login') return 'We couldn’t log you in. Check your email and password, or use password recovery.';
  if (action === 'register') return 'We couldn’t complete registration. Try again, or log in if you already have an account.';
  return 'We couldn’t complete that request. Please try again later.';
}
function cleanCallbackUrl() {
  if (location.hash.includes('access_token=') || location.hash.includes('refresh_token=') || new URLSearchParams(location.search).has('code')) {
    history.replaceState(null,'',location.pathname);
  }
}
async function refreshUser() {
  try {
    const { data, error } = await client.auth.getUser();
    if (error || !data?.user) { currentUser = null; recoveryFlow = false; showMode(mode,false,true); return false; }
    currentUser = data.user;
    if (recoveryFlow) { show('recovery'); return true; }
    show('signed-in');
    $('account-email').textContent = currentUser.email || 'Your Flash-Hook account';
    $('email-state').textContent = currentUser.email_confirmed_at ? 'Email confirmed.' : 'Email confirmation is pending.';
    return true;
  } catch { currentUser = null; showMode(mode,false,true); status('We couldn’t check your session. Please log in again.','error'); return false; }
}
const callbackUrl = () => new URL('account.html',location.href).href.split('?')[0].split('#')[0];
document.querySelectorAll('[data-mode]').forEach(b => b.addEventListener('click',() => showMode(b.dataset.mode)));
$('forgot-password').addEventListener('click',() => showMode('reset'));
$('back-login').addEventListener('click',() => showMode('login'));
$('auth-form').addEventListener('submit',async event => {
  event.preventDefault(); if (busy || !client) return;
  const action = mode, email = $('email').value.trim(), password = $('password').value;
  if (action === 'register' && password !== $('confirm-password').value) { status('The passwords don’t match.','error'); $('confirm-password').focus(); return; }
  lastEmail = email; setBusy(true); status('Please wait…');
  try {
    if (action === 'register') {
      const { data, error } = await client.auth.signUp({ email, password, options:{ emailRedirectTo:callbackUrl() } });
      if (error) throw error;
      if (data?.session) { if (await refreshUser()) status('Your account is ready.'); }
      else { status('Check your inbox to confirm your email. If you already have an account, log in or reset your password.'); $('resend-form').hidden = false; }
    } else if (action === 'reset') {
      const { error } = await client.auth.resetPasswordForEmail(email,{ redirectTo:callbackUrl() });
      if (error) throw error;
      status('If this address has an account, a password-reset email is on its way. Check your inbox and spam folder.');
    } else {
      const { error } = await client.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (await refreshUser()) status('You’re logged in.');
    }
  } catch (error) { status(friendlyError(error,action),'error'); }
  finally { clearPasswords(); setBusy(false); $('password').disabled = mode === 'reset'; $('confirm-password').disabled = mode !== 'register'; }
});
$('resend-form').addEventListener('submit',async event => {
  event.preventDefault(); if (busy || !client || !lastEmail) return;
  setBusy(true);
  try {
    const { error } = await client.auth.resend({ type:'signup',email:lastEmail,options:{ emailRedirectTo:callbackUrl() } });
    if (error) throw error;
    status('If confirmation is needed, another email is on its way. Please check your inbox.');
  } catch(error) { status(friendlyError(error,'resend'),'error'); }
  finally { setBusy(false); }
});
$('recovery-form').addEventListener('submit',async event => {
  event.preventDefault(); if (busy || !client || !recoveryFlow || !currentUser) return;
  const password = $('new-password').value;
  if (password !== $('confirm-new-password').value) { status('The passwords don’t match.','error'); $('confirm-new-password').focus(); return; }
  setBusy(true); status('Saving your new password…');
  try {
    const { error } = await client.auth.updateUser({ password });
    if (error) throw error;
    recoveryFlow = false; await refreshUser(); status('Your password has been updated.');
  } catch(error) { status(friendlyError(error,'recovery'),'error'); }
  finally { clearPasswords(); setBusy(false); }
});
$('cancel-recovery').addEventListener('click',async () => {
  if (busy) return;
  recoveryFlow = false; clearPasswords(); await refreshUser(); status('');
});
$('logout').addEventListener('click',async () => {
  if (busy || !client) return;
  setBusy(true);
  try {
    const { error } = await client.auth.signOut({ scope:'local' }); if (error) throw error;
    currentUser = null; recoveryFlow = false;
    setBusy(false); showMode('login'); status('You’re logged out of this browser.');
  } catch(error) { status('We couldn’t log you out. Please try again.','error'); }
  finally { setBusy(false); }
});
$('send-account-reset').addEventListener('click',async () => {
  if (busy || !currentUser?.email) return;
  setBusy(true);
  try {
    const { error } = await client.auth.resetPasswordForEmail(currentUser.email,{ redirectTo:callbackUrl() });
    if (error) throw error;
    status('A password-reset email has been requested. Check your inbox.');
  } catch(error) { status(friendlyError(error,'reset'),'error'); }
  finally { setBusy(false); }
});
async function initialize() {
  const config = window.FLASHHOOK_AUTH || {};
  try {
    const projectUrl = new URL(config.url);
    if (projectUrl.protocol !== 'https:' || !projectUrl.hostname.endsWith('.supabase.co') || !String(config.publishableKey).startsWith('sb_publishable_') || !window.supabase?.createClient) throw Error('Unavailable');
    if (location.protocol !== 'https:' && !['localhost','127.0.0.1'].includes(location.hostname)) throw Error('HTTPS required');
    const params = new URLSearchParams(location.search);
    mode = params.get('mode') === 'register' ? 'register' : 'login';
    const hash = new URLSearchParams(location.hash.slice(1));
    recoveryFlow = hash.get('type') === 'recovery';
    const callbackError = params.has('error') || hash.has('error');
    client = window.supabase.createClient(projectUrl.origin,config.publishableKey,{
      auth:{ persistSession:true,autoRefreshToken:true,detectSessionInUrl:true,flowType:'implicit',storageKey:'flash-hook-account-session-v1' }
    });
    client.auth.onAuthStateChange(event => {
      if (event === 'PASSWORD_RECOVERY') recoveryFlow = true;
      if (event === 'SIGNED_OUT') { currentUser = null; recoveryFlow = false; if (!busy) showMode('login',false); }
      if (['SIGNED_IN','PASSWORD_RECOVERY','USER_UPDATED'].includes(event)) setTimeout(() => { if (!busy) refreshUser(); },0);
    });
    const { error } = await client.auth.getSession();
    cleanCallbackUrl();
    if (error || callbackError) { showMode('login',false); status('This account link is invalid or expired. Request a new confirmation or password-reset email.','error'); return; }
    await refreshUser();
  } catch {
    show('unavailable'); status(''); clearPasswords();
  }
}
initialize();
})();

