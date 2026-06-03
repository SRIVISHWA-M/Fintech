import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowRight, Eye, EyeOff, Zap } from 'lucide-react';
import { authStore } from '../../../store/authStore';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('aarav.shah@example.com');
  const [password, setPassword] = useState('••••••••');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      authStore.login();
      navigate('/dashboard');
    }, 900);
  };

  return (
    <div style={{ width: '100%', maxWidth: '420px' }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '2.5rem' }}>
        <div style={{
          width: '2.5rem', height: '2.5rem', borderRadius: '0.75rem',
          background: 'var(--gradient-success)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: 'var(--shadow-glow)'
        }}>
          <Zap size={18} color="var(--success-foreground)" strokeWidth={2.5} />
        </div>
        <span style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em' }}>Nova Finance</span>
      </div>

      <h1 style={{ fontSize: '1.875rem', fontWeight: 700, letterSpacing: '-0.025em', marginBottom: '0.375rem' }}>
        Welcome back
      </h1>
      <p style={{ color: 'var(--muted-foreground)', fontSize: '0.9rem', marginBottom: '2rem' }}>
        Sign in to manage your loan account
      </p>

      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, marginBottom: '0.375rem', color: 'var(--muted-foreground)' }}>
            Email address
          </label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{
              width: '100%', padding: '0.75rem 1rem',
              background: 'var(--input)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius)', color: 'var(--foreground)',
              fontSize: '0.9rem', outline: 'none',
            }}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, marginBottom: '0.375rem', color: 'var(--muted-foreground)' }}>
            Password
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPw ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{
                width: '100%', padding: '0.75rem 3rem 0.75rem 1rem',
                background: 'var(--input)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius)', color: 'var(--foreground)',
                fontSize: '0.9rem', outline: 'none',
              }}
            />
            <button
              type="button"
              onClick={() => setShowPw(s => !s)}
              style={{
                position: 'absolute', right: '0.875rem', top: '50%',
                transform: 'translateY(-50%)', color: 'var(--muted-foreground)',
                background: 'none', border: 'none', cursor: 'pointer'
              }}
            >
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: '0.5rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
            padding: '0.875rem 1.5rem',
            background: loading ? 'var(--muted)' : 'var(--gradient-success)',
            color: loading ? 'var(--muted-foreground)' : 'var(--success-foreground)',
            border: 'none', borderRadius: 'var(--radius)',
            fontWeight: 600, fontSize: '0.9375rem',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'opacity 0.2s ease',
            boxShadow: loading ? 'none' : 'var(--shadow-glow)'
          }}
        >
          {loading ? (
            <>
              <span style={{
                width: '16px', height: '16px', borderRadius: '50%',
                border: '2px solid currentColor', borderTopColor: 'transparent',
                animation: 'spin 0.7s linear infinite', display: 'inline-block'
              }} />
              Signing in…
            </>
          ) : (
            <>Sign in <ArrowRight size={16} /></>
          )}
        </button>
      </form>

      <div style={{
        marginTop: '2rem', padding: '1rem', borderRadius: 'var(--radius)',
        background: 'oklch(74% 0.17 165 / 0.08)',
        border: '1px solid oklch(74% 0.17 165 / 0.2)',
        display: 'flex', alignItems: 'flex-start', gap: '0.625rem'
      }}>
        <Shield size={16} color="var(--success)" style={{ marginTop: '0.125rem', flexShrink: 0 }} />
        <p style={{ fontSize: '0.8125rem', color: 'var(--muted-foreground)', lineHeight: 1.5 }}>
          <span style={{ color: 'var(--success)', fontWeight: 600 }}>Demo mode</span> — click Sign in to explore the dashboard as Aarav Shah.
        </p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default LoginPage;
