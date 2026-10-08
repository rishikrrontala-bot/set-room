'use client';

import Link from 'next/link';
import { useEffect, useState, type FormEvent } from 'react';
import { ArrowLeft, ArrowRight, Bookmark, Check, LoaderCircle } from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import './auth.css';

function safeReturnTo(value: string | null) {
  if (!value || !value.startsWith('/') || value.startsWith('//') || /[\\\u0000-\u001f\u007f]/.test(value)) return '/';
  try {
    const url = new URL(value, window.location.origin);
    if (url.origin !== window.location.origin || url.pathname === '/signin') return '/';
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return '/';
  }
}

export default function SignInPage() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [returnTo, setReturnTo] = useState('/');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const { data: session, isPending: sessionPending } = authClient.useSession();

  useEffect(() => {
    setReturnTo(safeReturnTo(new URLSearchParams(window.location.search).get('returnTo')));
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setError('');
    if (mode === 'signup' && !name.trim()) {
      setError('Enter your name to create an account.');
      return;
    }
    setBusy(true);
    try {
      const result = mode === 'signin'
        ? await authClient.signIn.email({ email: email.trim(), password })
        : await authClient.signUp.email({ name: name.trim(), email: email.trim(), password });
      if (result.error) {
        if (result.error.status === 429) {
          setError('Too many attempts. Wait a minute, then try again.');
        } else if (result.error.status >= 500) {
          setError('Sign-in is temporarily unavailable. Try again shortly.');
        } else {
          setError(mode === 'signin'
            ? 'The email or password doesn’t match. Check both and try again.'
            : 'We couldn’t create your account. Check your details, or sign in if you already have one.');
        }
        setBusy(false);
        return;
      }
      window.location.assign(returnTo);
    } catch {
      setError('Couldn’t connect. Check your connection and try again.');
      setBusy(false);
    }
  }

  function switchMode(next: 'signin' | 'signup') {
    setMode(next);
    setError('');
    setPassword('');
  }

  return (
    <div className="auth-page">
      <header className="site-header auth-header">
        <Link href="/" className="wordmark" aria-label="Set Room home">
          <span className="brand-mark" aria-hidden="true"><i /><i /><i /></span>
          set<span className="wordmark-room">room</span><span className="brand-period">.</span>
        </Link>
        <Link href={returnTo} className="auth-back"><ArrowLeft size={15} aria-hidden="true" /> Back to the table</Link>
      </header>
      <main className="auth-main">
        <div className="auth-context">
          <span className="auth-eyebrow"><Bookmark size={16} aria-hidden="true" /> Your classroom, saved</span>
          <h1>Keep your rooms<br />within reach.</h1>
          <p>Sign in to save your classroom rooms and find them again on any device.</p>
          <div className="auth-public-note"><Check size={17} aria-hidden="true" /><span>You can play and join rooms without an account.</span></div>
        </div>
        <section className="auth-panel" aria-label="Account access">
          {session && !sessionPending ? (
            <div className="auth-signed-in">
              <span className="auth-signed-in-icon"><Check size={22} aria-hidden="true" /></span>
              <h2>You’re signed in.</h2>
              <p>Welcome back, {session.user.name}.</p>
              <Link href={returnTo} className="primary-button auth-submit">Return to the table <ArrowRight size={16} aria-hidden="true" /></Link>
              <button type="button" className="text-button auth-switch-account" disabled={busy} onClick={async () => {
                setBusy(true);
                setError('');
                try {
                  const result = await authClient.signOut();
                  if (result.error) setError('Couldn’t sign out. Try again.');
                } catch { setError('Couldn’t connect. Try again.'); }
                setBusy(false);
              }}>Use another account</button>
              {error && <p className="auth-error" role="alert">{error}</p>}
            </div>
          ) : (
            <>
              <div className="auth-modes" aria-label="Account options">
                <button type="button" aria-pressed={mode === 'signin'} disabled={busy} onClick={() => switchMode('signin')}>Sign in</button>
                <button type="button" aria-pressed={mode === 'signup'} disabled={busy} onClick={() => switchMode('signup')}>Create account</button>
              </div>
              <h2>{mode === 'signin' ? 'Welcome back.' : 'Make yourself at home.'}</h2>
              <p className="auth-panel-intro">{mode === 'signin' ? 'Pick up where your classroom left off.' : 'One account for all your saved rooms.'}</p>
              <form className="auth-form" onSubmit={submit} aria-busy={busy}>
                {mode === 'signup' && (
                  <label htmlFor="auth-name">Your name
                    <input id="auth-name" name="name" autoComplete="name" value={name} onChange={event => setName(event.target.value)} maxLength={100} required disabled={busy} />
                  </label>
                )}
                <label htmlFor="auth-email">Email
                  <input id="auth-email" name="email" type="email" inputMode="email" autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} maxLength={254} required disabled={busy} />
                </label>
                <label htmlFor="auth-password">Password
                  <input id="auth-password" name="password" type="password" autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} value={password} onChange={event => setPassword(event.target.value)} minLength={mode === 'signup' ? 10 : undefined} maxLength={128} required disabled={busy} aria-describedby={mode === 'signup' ? 'auth-password-hint' : undefined} />
                  {mode === 'signup' && <span id="auth-password-hint" className="auth-field-hint">Use at least 10 characters.</span>}
                </label>
                {error && <p className="auth-error" role="alert">{error}</p>}
                <button className="primary-button auth-submit" type="submit" disabled={busy}>
                  {busy ? <><LoaderCircle size={17} className="auth-spinner" aria-hidden="true" /> {mode === 'signin' ? 'Signing in…' : 'Creating account…'}</> : <>{mode === 'signin' ? 'Sign in' : 'Create account'} <ArrowRight size={16} aria-hidden="true" /></>}
                </button>
              </form>
              <Link href={returnTo} className="auth-play-link">Continue playing</Link>
            </>
          )}
        </section>
      </main>
      <footer className="auth-footer"><span>A little friendly classroom competition.</span><span>Built by <strong>Rishik Rontala</strong></span></footer>
    </div>
  );
}
