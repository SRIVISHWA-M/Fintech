import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight, TrendingUp, Calendar, CreditCard, Shield,
  AlertCircle, CheckCircle2, ChevronRight, Zap, Clock
} from 'lucide-react';
import { loanStore } from '../../../store/loanStore';
import { paymentStore } from '../../../store/paymentStore';
import { authStore } from '../../../store/authStore';
import LoanProgressChart from '../../../components/charts/LoanProgressChart';
import PaymentTrendChart from '../../../components/charts/PaymentTrendChart';
import EmiBreakdownChart from '../../../components/charts/EmiBreakdownChart';

const fmt = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
const fmtDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
const daysUntil = (d) => Math.ceil((new Date(d) - new Date()) / 86400000);

const StatCard = ({ icon: Icon, label, value, sub, accent, onClick }) => (
  <div
    onClick={onClick}
    style={{
      background: 'var(--gradient-card)',
      border: '1px solid var(--border)',
      borderRadius: 'calc(var(--radius) + 0.25rem)',
      padding: '1.25rem',
      display: 'flex', flexDirection: 'column', gap: '0.75rem',
      boxShadow: 'var(--shadow-card)',
      cursor: onClick ? 'pointer' : 'default',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    }}
    onMouseEnter={e => { if (onClick) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-glow)'; } }}
    onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = 'var(--shadow-card)'; }}
  >
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{
        width: '2.25rem', height: '2.25rem', borderRadius: '0.625rem',
        background: accent || 'oklch(74% 0.17 165 / 0.12)',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <Icon size={16} color="var(--success)" />
      </div>
      {onClick && <ChevronRight size={15} color="var(--muted-foreground)" />}
    </div>
    <div>
      <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginBottom: '0.25rem', fontWeight: 500 }}>{label}</div>
      <div style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.1 }}>{value}</div>
      {sub && <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginTop: '0.25rem' }}>{sub}</div>}
    </div>
  </div>
);

const DashboardPage = () => {
  const navigate = useNavigate();
  const [loan, setLoan] = useState(loanStore.getState());
  const [payments, setPayments] = useState(paymentStore.getState());
  const [user] = useState(authStore.getState().user);

  useEffect(() => {
    const unsub1 = loanStore.subscribe(setLoan);
    const unsub2 = paymentStore.subscribe(setPayments);
    return () => { unsub1(); unsub2(); };
  }, []);

  const daysLeft = daysUntil(loan.nextDueDate);
  const progress = Math.round((loan.paid / loan.principal) * 100);
  const recentPayments = payments.payments.slice(0, 3);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Hero Loan Card */}
      <div style={{
        background: 'linear-gradient(135deg, oklch(22% 0.035 264) 0%, oklch(18% 0.028 264) 100%)',
        border: '1px solid var(--border)',
        borderRadius: 'calc(var(--radius) + 0.5rem)',
        padding: '1.75rem',
        boxShadow: 'var(--shadow-card)',
        position: 'relative', overflow: 'hidden'
      }}>
        {/* Background decoration */}
        <div style={{
          position: 'absolute', top: '-40px', right: '-40px',
          width: '220px', height: '220px', borderRadius: '50%',
          background: 'oklch(74% 0.17 165 / 0.05)', pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', bottom: '-60px', right: '60px',
          width: '160px', height: '160px', borderRadius: '50%',
          background: 'oklch(74% 0.17 165 / 0.04)', pointerEvents: 'none'
        }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{
                fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
                color: 'var(--success)', background: 'oklch(74% 0.17 165 / 0.12)',
                padding: '0.2rem 0.625rem', borderRadius: '999px', border: '1px solid oklch(74% 0.17 165 / 0.25)'
              }}>
                {loan.type}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>#{loan.id}</span>
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--muted-foreground)', marginBottom: '0.375rem' }}>Outstanding Balance</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.035em', lineHeight: 1 }}>
              {fmt(loan.outstanding)}
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--muted-foreground)', marginTop: '0.375rem' }}>
              of {fmt(loan.principal)} total principal
            </div>
          </div>

          {/* Mini donut */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.375rem' }}>
            <LoanProgressChart paid={loan.paid} outstanding={loan.outstanding} size={90} />
            <span style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>{progress}% repaid</span>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ marginTop: '1.5rem' }}>
          <div style={{
            height: '6px', background: 'var(--border)',
            borderRadius: '999px', overflow: 'hidden'
          }}>
            <div style={{
              height: '100%', width: `${progress}%`,
              background: 'var(--gradient-success)',
              borderRadius: '999px',
              transition: 'width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
              {loan.paidEmis}/{loan.termMonths} EMIs paid
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 500 }}>
              {fmt(loan.paid)} paid
            </span>
          </div>
        </div>
      </div>

      {/* EMI Due Alert */}
      <div style={{
        background: daysLeft <= 3
          ? 'oklch(62% 0.22 27 / 0.08)'
          : 'oklch(74% 0.17 165 / 0.08)',
        border: `1px solid ${daysLeft <= 3 ? 'oklch(62% 0.22 27 / 0.3)' : 'oklch(74% 0.17 165 / 0.25)'}`,
        borderRadius: 'var(--radius)',
        padding: '1rem 1.25rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '2.25rem', height: '2.25rem', borderRadius: '50%',
            background: daysLeft <= 3 ? 'oklch(62% 0.22 27 / 0.15)' : 'oklch(74% 0.17 165 / 0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
          }}>
            {daysLeft <= 3
              ? <AlertCircle size={16} color="var(--destructive)" />
              : <Clock size={16} color="var(--success)" />
            }
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>
              Next EMI: {fmt(loan.nextDueAmount)}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
              Due {fmtDate(loan.nextDueDate)} · {daysLeft <= 0 ? 'Overdue!' : `${daysLeft} day${daysLeft !== 1 ? 's' : ''} left`}
            </div>
          </div>
        </div>
        <button
          onClick={() => navigate('/loans')}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.375rem',
            padding: '0.5rem 1.125rem',
            background: 'var(--gradient-success)',
            color: 'var(--success-foreground)',
            border: 'none', borderRadius: 'var(--radius)',
            fontWeight: 600, fontSize: '0.8125rem', cursor: 'pointer',
            boxShadow: 'var(--shadow-glow)', whiteSpace: 'nowrap'
          }}
        >
          Pay Now <ArrowRight size={14} />
        </button>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.875rem' }}>
        <StatCard
          icon={TrendingUp}
          label="Interest Rate"
          value={`${loan.interestRate}%`}
          sub="p.a. flat rate"
        />
        <StatCard
          icon={Calendar}
          label="Remaining Term"
          value={`${loan.termMonths - loan.paidEmis} mo`}
          sub={`of ${loan.termMonths} months`}
        />
        <StatCard
          icon={CreditCard}
          label="EMI Amount"
          value={fmt(loan.nextDueAmount)}
          sub={`via ${loan.paymentMethod}`}
          onClick={() => navigate('/loans')}
        />
        <StatCard
          icon={Shield}
          label="On-Time Rate"
          value={`${user?.onTimeRate || 100}%`}
          sub="all-time record"
        />
      </div>

      {/* Payment Trend Chart */}
      <div style={{
        background: 'var(--gradient-card)',
        border: '1px solid var(--border)',
        borderRadius: 'calc(var(--radius) + 0.25rem)',
        padding: '1.25rem',
        boxShadow: 'var(--shadow-card)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>Payment History</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>Monthly EMI trend</div>
          </div>
          <button
            onClick={() => navigate('/payments')}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.25rem',
              fontSize: '0.75rem', color: 'var(--success)',
              background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500
            }}
          >
            View all <ChevronRight size={14} />
          </button>
        </div>
        <PaymentTrendChart payments={payments.payments} />
      </div>

      {/* EMI Breakdown + Recent Payments side by side */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
        {/* EMI Breakdown */}
        <div style={{
          background: 'var(--gradient-card)',
          border: '1px solid var(--border)',
          borderRadius: 'calc(var(--radius) + 0.25rem)',
          padding: '1.25rem',
          boxShadow: 'var(--shadow-card)'
        }}>
          <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.25rem' }}>EMI Breakdown</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginBottom: '1rem' }}>Per installment</div>
          <EmiBreakdownChart breakdown={loan.breakdown} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
            {[
              { label: 'Principal', value: loan.breakdown.principal, color: 'var(--success)' },
              { label: 'Interest', value: loan.breakdown.interest, color: 'oklch(74% 0.15 240)' },
              { label: 'Fees', value: loan.breakdown.fees, color: 'oklch(74% 0.14 300)' },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: color }} />
                  <span style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>{label}</span>
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color }}>{fmt(value)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Payments */}
        <div style={{
          background: 'var(--gradient-card)',
          border: '1px solid var(--border)',
          borderRadius: 'calc(var(--radius) + 0.25rem)',
          padding: '1.25rem',
          boxShadow: 'var(--shadow-card)',
          display: 'flex', flexDirection: 'column'
        }}>
          <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.25rem' }}>Recent Payments</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginBottom: '1rem' }}>Last 3 EMIs</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', flex: 1 }}>
            {recentPayments.map((p) => (
              <div key={p.id} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '0.5rem 0',
                borderBottom: '1px solid var(--border)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={14} color="var(--success)" />
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 500 }}>EMI #{p.emiNo}</div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--muted-foreground)' }}>
                      {new Date(p.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </div>
                  </div>
                </div>
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--success)' }}>
                  {fmt(p.amount)}
                </span>
              </div>
            ))}
          </div>
          <button
            onClick={() => navigate('/payments')}
            style={{
              marginTop: '0.875rem', width: '100%',
              padding: '0.5rem', borderRadius: 'var(--radius)',
              border: '1px solid var(--border)',
              background: 'transparent', color: 'var(--muted-foreground)',
              fontSize: '0.75rem', fontWeight: 500, cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem'
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.color = 'var(--foreground)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--muted-foreground)'; }}
          >
            All history <ChevronRight size={13} />
          </button>
        </div>
      </div>

      {/* Credit Score Banner */}
      <div style={{
        background: 'linear-gradient(135deg, oklch(22% 0.04 264), oklch(19% 0.035 264))',
        border: '1px solid oklch(74% 0.17 165 / 0.15)',
        borderRadius: 'calc(var(--radius) + 0.25rem)',
        padding: '1.25rem 1.5rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: '1rem', boxShadow: 'var(--shadow-card)'
      }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginBottom: '0.25rem', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Credit Score</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.375rem' }}>
            <span style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--success)', letterSpacing: '-0.03em' }}>
              {user?.creditScore || 782}
            </span>
            <span style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>/ 900</span>
          </div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--success)', fontWeight: 500, marginTop: '0.125rem' }}>Excellent</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Zap size={16} color="var(--success)" />
          <span style={{ fontSize: '0.8125rem', color: 'var(--muted-foreground)' }}>Eligible for better rates</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
