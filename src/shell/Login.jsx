import { useState } from 'react';
import { loginStudent, registerStudent } from './api.js';
import { logEvent } from './analytics.js';
import COURSE_CONFIG from '../../config/course.config.js';

const C = {
  bg: '#0D1117', surface: '#161B22', card: '#1C2333', border: '#30363D',
  blue: '#58A6FF', green: '#3FB950', red: '#F85149', yellow: '#D29922', muted: '#8B949E',
  text: '#E6EDF3', soft: '#C9D1D9',
};

export default function Login({ onLogin, onBack }) {
  // 'signin' = existing account (SRFET roll number OR a previously
  // registered email). 'register' = brand-new public account.
  const [mode, setMode] = useState('signin');

  const [rollNo, setRollNo]     = useState('');   // sign-in: email or roll number
  const [password, setPassword] = useState('');

  const [name, setName]                 = useState('');
  const [email, setEmail]               = useState('');
  const [newPassword, setNewPassword]   = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignIn(e) {
    e.preventDefault();
    if (!rollNo.trim() || !password.trim()) { setError('Please enter your email/roll number and password.'); return; }
    setLoading(true); setError('');
    const result = await loginStudent(rollNo.trim(), password.trim());
    setLoading(false);
    if (result.success) { onLogin(result.student); }
    else { setError(result.message || 'Invalid credentials. Please try again.'); }
  }

  async function handleRegister(e) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !newPassword.trim()) { setError('Please fill in your name, email, and a password.'); return; }
    if (newPassword.length < 6) { setError('Please choose a password with at least 6 characters.'); return; }
    if (newPassword !== confirmPassword) { setError('Passwords do not match.'); return; }
    setLoading(true); setError('');
    const result = await registerStudent(email.trim(), newPassword, name.trim());
    setLoading(false);
    if (result.success) {
      logEvent('signup', { userId: result.student.rollNo }); // only on a real new account, not every sign-in
      onLogin(result.student);
    }
    else { setError(result.message || 'Could not create your account. Please try again.'); }
  }

  return (
    <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, sans-serif', padding: '24px 16px' }}>
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: '40px 40px', width: '100%', maxWidth: 420, boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>

        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>🪜</div>
          <h1 style={{ color: C.text, fontSize: 20, fontWeight: 700, margin: 0 }}>Foothold</h1>
          <p style={{ color: C.blue, fontSize: 15, fontWeight: 600, margin: '6px 0 0' }}>{COURSE_CONFIG.courseTitle}</p>
        </div>

        {/* ── Sign in / Register toggle ── */}
        <div style={{ display: 'flex', border: `1px solid ${C.border}`, borderRadius: 10, marginBottom: 20, overflow: 'hidden' }}>
          {['signin', 'register'].map(m => (
            <button key={m} onClick={() => { setMode(m); setError(''); }}
              style={{
                flex: 1, padding: '10px 0', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 700,
                background: mode === m ? C.blue : 'transparent', color: mode === m ? '#0D1117' : C.muted,
              }}>
              {m === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
          ))}
        </div>

        {mode === 'signin' ? (
          <form onSubmit={handleSignIn}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ color: C.soft, fontSize: 13, display: 'block', marginBottom: 6 }}>Email or Roll Number</label>
              <input type="text" value={rollNo} onChange={e => setRollNo(e.target.value)} placeholder="you@example.com"
                style={inputStyle} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ color: C.soft, fontSize: 13, display: 'block', marginBottom: 6 }}>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password"
                style={inputStyle} />
            </div>
            {error && <ErrorBox text={error} />}
            <SubmitButton loading={loading} label="Sign In →" loadingLabel="Signing in…" />
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ color: C.soft, fontSize: 13, display: 'block', marginBottom: 6 }}>Your Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Priya Sharma" style={inputStyle} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ color: C.soft, fontSize: 13, display: 'block', marginBottom: 6 }}>Email (this becomes your username)</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" style={inputStyle} />
            </div>
            <div style={{ marginBottom: 8 }}>
              <label style={{ color: C.soft, fontSize: 13, display: 'block', marginBottom: 6 }}>Choose a Password</label>
              <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="At least 6 characters" style={inputStyle} />
            </div>
            {/* Important: make it unmistakable this isn't their real email password. */}
            <p style={{ color: C.yellow, fontSize: 12, lineHeight: 1.5, margin: '0 0 16px' }}>
              ⚠️ This is a new password just for Foothold — <strong>not</strong> the password for your email account.
            </p>
            <div style={{ marginBottom: 20 }}>
              <label style={{ color: C.soft, fontSize: 13, display: 'block', marginBottom: 6 }}>Confirm Password</label>
              <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Re-enter your password" style={inputStyle} />
            </div>
            {error && <ErrorBox text={error} />}
            <SubmitButton loading={loading} label="Create Account →" loadingLabel="Creating your account…" />
          </form>
        )}

        {/* Sheets-backed backend can be a little slow, especially the first request -- set expectations rather than let it look stuck. */}
        <p style={{ color: C.muted, fontSize: 11, textAlign: 'center', marginTop: 16, lineHeight: 1.5 }}>
          Signing in or creating an account can take a few seconds — thanks for your patience.
        </p>

        {onBack && (
          <button onClick={onBack} style={{ width: '100%', marginTop: 12, background: 'transparent', border: 'none', color: C.muted, fontSize: 13, cursor: 'pointer', textAlign: 'center' }}>
            ← Continue exploring without an account
          </button>
        )}
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%', padding: '10px 14px', borderRadius: 8, background: C.card, border: `1px solid ${C.border}`,
  color: C.text, fontSize: 15, outline: 'none', boxSizing: 'border-box',
};

function ErrorBox({ text }) {
  return (
    <div style={{ background: '#2D1117', border: `1px solid ${C.red}`, borderRadius: 8, padding: '10px 14px', marginBottom: 16, color: C.red, fontSize: 13 }}>
      {text}
    </div>
  );
}

function SubmitButton({ loading, label, loadingLabel }) {
  return (
    <button type="submit" disabled={loading}
      style={{ width: '100%', padding: '12px', borderRadius: 8, background: loading ? C.muted : C.blue, color: '#fff', fontWeight: 700, fontSize: 15, border: 'none', cursor: loading ? 'not-allowed' : 'pointer' }}>
      {loading ? loadingLabel : label}
    </button>
  );
}
