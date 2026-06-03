import React, { useState, useEffect } from 'react';
import {
  User, Mail, Phone, Shield, Star, TrendingUp, Bell,
  Lock, ChevronRight, CheckCircle2, Edit3, LogOut, CreditCard
} from 'lucide-react';
import { authStore } from '../../../store/authStore';
import { loanStore } from '../../../store/loanStore';
import { paymentStore } from '../../../store/paymentStore';

const fmt = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

const Toggle = ({ checked, onChange }) => (
  <button
    onClick={() => onChange(!checked)}
    style={{
      width: '2.75rem', height: '1.5rem', borderRadius: '999px',
      background: checked ? 'var(--success)' : 'var(--muted)',
      border: 'none', cursor: 'pointer', position: 'relative',
      transition: 'background 0.25s ease', flexShrink: 0,
      boxShadow: checked ? '0 0 12px oklch(74% 0.17 165 / 0.4)' : 'none'
    }}
  >
    <span style={{
      position: 'absolute', top: '3px', left: checked ? 'calc(100% - 21px)' : '3px',
      width: '18px', height: '18px', borderRadius: '50%',
      background: 'white', transition: 'left 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
      boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
    }} />
  </button>
);

const ProfilePage = () => {
  const [auth, setAuth] = useState(authStore.getState());
  const [loan, setLoan] = useState(loanStore.getState());
  const [payments, setPayments] = useState(paymentStore.getState());
  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');

  useEffect(() => {
    const u1 = authStore.subscribe(setAuth);
    const u2 = loanStore.subscribe(setLoan);
    const u3 = paymentStore.subscribe(setPayments);
    return () => { u1(); u2(); u3(); };
  }, []);

  const user = auth.user;
  if (!user) return null;

  const totalPaid = payments.payments.reduce((s, p) => s + p.amount, 0);
  const progress = Math.round((loan.paid / loan.principal) * 100);

  const startEdit = () => {
    setEditName(user.name);
    setEditEmail(user.email);
    setEditMode(true);
  };

  const saveEdit = () => {
    authStore.updateUser({ name: editName, email: editEmail });
    setEditMode(false);
  };

  const handlePrefToggle = (key) => {
    authStore.updatePreferences({ [key]: !user.preferences[key] });
  };

  // Avatar initials
  const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Profile Hero Card */}
      <div style={{
        background: 'linear-gradient(135deg, oklch(22% 0.035 264), oklch(18% 0.028 264))',
        border: '1px solid var(--border)',
        borderRadius: 'calc(var(--radius) + 0.5rem)',
        padding: '1.75rem',
        boxShadow: 'var(--shadow-card)',
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: '-40px', right: '-40px',
          width: '200px', height: '200px', borderRadius: '50%',
          background: 'oklch(74% 0.17 165 / 0.05)', pointerEvents: 'none'
        }} />

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem', flexWrap: 'wrap' }}>
          {/* Avatar */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div style={{
              width: '5rem', height: '5rem', borderRadius: '1.25rem',
              background: 'var(--gradient-success)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.5rem', fontWeight: 800, color: 'var(--success-foreground)',
              boxShadow: 'var(--shadow-glow)'
            }}>
              {initials}
            </div>
            <div style={{
              position: 'absolute', bottom: '-4px', right: '-4px',
              width: '1.5rem', height: '1.5rem', borderRadius: '50%',
              background: 'var(--success)',
              border: '2px solid var(--background)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                <circle cx="4" cy="4" r="3" fill="white" />
              </svg>
            </div>
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {editMode ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                <input
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  style={{
                    background: 'var(--input)', border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)', padding: '0.5rem 0.875rem',
                    color: 'var(--foreground)', fontSize: '0.9rem', outline: 'none', fontWeight: 600
                  }}
                />
                <input
                  value={editEmail}
                  onChange={e => setEditEmail(e.target.value)}
                  style={{
                    background: 'var(--input)', border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)', padding: '0.5rem 0.875rem',
                    color: 'var(--foreground)', fontSize: '0.875rem', outline: 'none'
                  }}
                />
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={saveEdit}
                    style={{
                      padding: '0.5rem 1.25rem', borderRadius: 'var(--radius)',
                      background: 'var(--gradient-success)', color: 'var(--success-foreground)',
                      border: 'none', fontWeight: 600, fontSize: '0.8125rem',
                      cursor: 'pointer', boxShadow: 'var(--shadow-glow)'
                    }}
                  >Save</button>
                  <button
                    onClick={() => setEditMode(false)}
                    style={{
                      padding: '0.5rem 1.25rem', borderRadius: 'var(--radius)',
                      background: 'transparent', color: 'var(--muted-foreground)',
                      border: '1px solid var(--border)', fontWeight: 500, fontSize: '0.8125rem', cursor: 'pointer'
                    }}
                  >Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexWrap: 'wrap' }}>
                  <h1 style={{ fontSize: '1.375rem', fontWeight: 800, letterSpacing: '-0.025em' }}>{user.name}</h1>
                  {user.kycStatus === 'verified' && (
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '0.25rem',
                      fontSize: '0.6875rem', fontWeight: 600, color: 'var(--success)',
                      background: 'oklch(74% 0.17 165 / 0.12)',
                      padding: '0.2rem 0.625rem', borderRadius: '999px',
                      border: '1px solid oklch(74% 0.17 165 / 0.25)'
                    }}>
                      <CheckCircle2 size={11} /> KYC Verified
                    </div>
                  )}
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--muted-foreground)', marginTop: '0.25rem' }}>
                  Customer ID: {user.customerId}
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--muted-foreground)', marginTop: '0.125rem' }}>
                  {user.email}
                </div>
                <button
                  onClick={startEdit}
                  style={{
                    marginTop: '0.75rem',
                    display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
                    padding: '0.4rem 0.875rem', borderRadius: 'var(--radius)',
                    border: '1px solid var(--border)', background: 'transparent',
                    color: 'var(--muted-foreground)', fontSize: '0.8125rem',
                    fontWeight: 500, cursor: 'pointer', transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--muted)'; e.currentTarget.style.color = 'var(--foreground)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--muted-foreground)'; }}
                >
                  <Edit3 size={12} /> Edit Profile
                </button>
              </>
            )}
          </div>
        </div>

        {/* Credit score mini bar */}
        <div style={{
          marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
            <div style={{
              width: '2.25rem', height: '2.25rem', borderRadius: '0.625rem',
              background: 'oklch(74% 0.17 165 / 0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Star size={15} color="var(--success)" />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Credit Score</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--success)', letterSpacing: '-0.025em' }}>{user.creditScore}</span>
                <span style={{ fontSize: '0.8125rem', color: 'var(--muted-foreground)' }}>/900</span>
              </div>
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginBottom: '0.375rem', textAlign: 'right' }}>
              {user.creditScore}/900 — Excellent
            </div>
            <div style={{ width: '160px', height: '6px', background: 'var(--border)', borderRadius: '999px', overflow: 'hidden' }}>
              <div style={{
                height: '100%', width: `${(user.creditScore / 900) * 100}%`,
                background: 'var(--gradient-success)', borderRadius: '999px'
              }} />
            </div>
          </div>
        </div>
      </div>

      {/* Personal Details */}
      <div style={{
        background: 'var(--gradient-card)', border: '1px solid var(--border)',
        borderRadius: 'calc(var(--radius) + 0.25rem)', padding: '1.5rem',
        boxShadow: 'var(--shadow-card)'
      }}>
        <h2 style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: '1.125rem' }}>Personal Information</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {[
            { icon: User, label: 'Full Name', value: user.name },
            { icon: Mail, label: 'Email Address', value: user.email },
            { icon: Phone, label: 'Mobile Number', value: user.phoneMasked },
            { icon: Shield, label: 'KYC Status', value: 'Verified', isStatus: true },
            { icon: CreditCard, label: 'Customer ID', value: user.customerId },
          ].map(({ icon: Icon, label, value, isStatus }, idx, arr) => (
            <div
              key={label}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.875rem',
                padding: '0.875rem 0',
                borderBottom: idx < arr.length - 1 ? '1px solid var(--border)' : 'none'
              }}
            >
              <div style={{
                width: '2.25rem', height: '2.25rem', borderRadius: '0.625rem',
                background: 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}>
                <Icon size={14} color="var(--muted-foreground)" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginBottom: '0.125rem' }}>{label}</div>
                <div style={{
                  fontSize: '0.9rem', fontWeight: 500,
                  color: isStatus ? 'var(--success)' : 'var(--foreground)'
                }}>{value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Loan Statistics */}
      <div style={{
        background: 'var(--gradient-card)', border: '1px solid var(--border)',
        borderRadius: 'calc(var(--radius) + 0.25rem)', padding: '1.5rem',
        boxShadow: 'var(--shadow-card)'
      }}>
        <h2 style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: '1.125rem' }}>Loan Statistics</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
          {[
            { label: 'Active Loans', value: user.activeLoans, icon: TrendingUp },
            { label: 'On-Time Rate', value: `${user.onTimeRate}%`, icon: CheckCircle2 },
            { label: 'Total Paid', value: fmt(totalPaid), icon: CreditCard },
            { label: 'Loan Progress', value: `${progress}%`, icon: Star },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} style={{
              background: 'var(--muted)', borderRadius: 'var(--radius)',
              padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem'
            }}>
              <div style={{
                width: '1.875rem', height: '1.875rem', borderRadius: '0.5rem',
                background: 'oklch(74% 0.17 165 / 0.12)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Icon size={13} color="var(--success)" />
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em' }}>{value}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Preferences & Alerts */}
      <div style={{
        background: 'var(--gradient-card)', border: '1px solid var(--border)',
        borderRadius: 'calc(var(--radius) + 0.25rem)', padding: '1.5rem',
        boxShadow: 'var(--shadow-card)'
      }}>
        <h2 style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: '1.125rem' }}>Preferences & Alerts</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {[
            { key: 'notifications', icon: Bell, label: 'Push Notifications', sub: 'EMI reminders and payment alerts' },
            { key: 'loginAlerts', icon: Lock, label: 'Login Alerts', sub: 'Get notified on new logins' },
            { key: 'darkMode', icon: Shield, label: 'Dark Mode', sub: 'Current theme preference' },
          ].map(({ key, icon: Icon, label, sub }, idx, arr) => (
            <div
              key={key}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem',
                padding: '1rem 0',
                borderBottom: idx < arr.length - 1 ? '1px solid var(--border)' : 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                <div style={{
                  width: '2.25rem', height: '2.25rem', borderRadius: '0.625rem',
                  background: user.preferences[key] ? 'oklch(74% 0.17 165 / 0.12)' : 'var(--muted)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                  <Icon size={14} color={user.preferences[key] ? 'var(--success)' : 'var(--muted-foreground)'} />
                </div>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>{label}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginTop: '0.125rem' }}>{sub}</div>
                </div>
              </div>
              <Toggle
                checked={user.preferences[key]}
                onChange={() => handlePrefToggle(key)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Settings Links */}
      <div style={{
        background: 'var(--gradient-card)', border: '1px solid var(--border)',
        borderRadius: 'calc(var(--radius) + 0.25rem)',
        overflow: 'hidden', boxShadow: 'var(--shadow-card)'
      }}>
        {[
          { icon: Lock, label: 'Change Password', sub: 'Update your account password' },
          { icon: Shield, label: 'Security Settings', sub: '2FA and device management' },
          { icon: CreditCard, label: 'Linked Accounts', sub: 'Manage payment methods' },
        ].map(({ icon: Icon, label, sub }, idx, arr) => (
          <button
            key={label}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: '0.875rem',
              padding: '1rem 1.5rem',
              borderBottom: idx < arr.length - 1 ? '1px solid var(--border)' : 'none',
              background: 'transparent', border: 'none',
              cursor: 'pointer', textAlign: 'left',
              transition: 'background 0.15s ease',
              borderLeft: 'none', borderRight: 'none', borderTop: 'none',
              borderBottomWidth: idx < arr.length - 1 ? '1px' : '0',
              borderBottomStyle: 'solid', borderBottomColor: 'var(--border)'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--muted)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <div style={{
              width: '2.25rem', height: '2.25rem', borderRadius: '0.625rem',
              background: 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              <Icon size={14} color="var(--muted-foreground)" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>{label}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginTop: '0.125rem' }}>{sub}</div>
            </div>
            <ChevronRight size={15} color="var(--muted-foreground)" />
          </button>
        ))}
      </div>

      {/* Sign Out */}
      <button
        style={{
          width: '100%', padding: '0.9375rem',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
          background: 'oklch(62% 0.22 27 / 0.08)',
          border: '1px solid oklch(62% 0.22 27 / 0.25)',
          borderRadius: 'calc(var(--radius) + 0.25rem)',
          color: 'var(--destructive)', fontSize: '0.9375rem', fontWeight: 600,
          cursor: 'pointer', transition: 'all 0.2s ease'
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'oklch(62% 0.22 27 / 0.14)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'oklch(62% 0.22 27 / 0.08)'; }}
        onClick={() => authStore.logout()}
      >
        <LogOut size={17} /> Sign Out
      </button>
    </div>
  );
};

export default ProfilePage;
