import React, { useState, useEffect } from 'react';
import {
  CreditCard, Smartphone, Building2, CheckCircle2,
  Download, ChevronDown, ChevronUp, Banknote, Receipt, AlertCircle
} from 'lucide-react';
import { loanStore } from '../../../store/loanStore';
import { paymentStore } from '../../../store/paymentStore';
import LoanProgressChart from '../../../components/charts/LoanProgressChart';

const fmt = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
const fmtDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
const daysUntil = (d) => Math.ceil((new Date(d) - new Date()) / 86400000);

const PAYMENT_METHODS = [
  { id: 'hdfc', label: 'HDFC Bank ••4421', icon: Building2, sub: 'Savings Account' },
  { id: 'upi', label: 'UPI / PhonePe', icon: Smartphone, sub: 'Instant transfer' },
  { id: 'card', label: 'Debit / Credit Card', icon: CreditCard, sub: 'Visa, Mastercard' },
  { id: 'netbanking', label: 'Net Banking', icon: Banknote, sub: 'All major banks' },
];

const LoansPage = () => {
  const [loan, setLoan] = useState(loanStore.getState());
  const [payments, setPayments] = useState(paymentStore.getState());
  const [selectedMethod, setSelectedMethod] = useState('hdfc');
  const [customAmount, setCustomAmount] = useState('');
  const [payType, setPayType] = useState('emi'); // 'emi' | 'custom' | 'full'
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [expandedReceipt, setExpandedReceipt] = useState(null);

  useEffect(() => {
    const unsub1 = loanStore.subscribe(setLoan);
    const unsub2 = paymentStore.subscribe(setPayments);
    return () => { unsub1(); unsub2(); };
  }, []);

  const payAmount = payType === 'emi'
    ? loan.nextDueAmount
    : payType === 'full'
    ? loan.outstanding
    : parseFloat(customAmount) || 0;

  const methodLabel = PAYMENT_METHODS.find(m => m.id === selectedMethod)?.label || '';

  const handlePayment = () => {
    if (payAmount <= 0 || payAmount > loan.outstanding) return;
    setLoading(true);
    setTimeout(() => {
      paymentStore.addPayment(payAmount, methodLabel);
      loanStore.makePayment(payAmount);
      setSuccess({ amount: payAmount, method: methodLabel, date: new Date().toISOString() });
      setLoading(false);
      setCustomAmount('');
    }, 1200);
  };

  const progress = Math.round((loan.paid / loan.principal) * 100);
  const daysLeft = daysUntil(loan.nextDueDate);

  if (success) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3rem 1rem', gap: '1.25rem', textAlign: 'center' }}>
        <div style={{
          width: '5rem', height: '5rem', borderRadius: '50%',
          background: 'oklch(74% 0.17 165 / 0.12)',
          border: '2px solid var(--success)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: 'var(--shadow-glow)'
        }}>
          <CheckCircle2 size={36} color="var(--success)" />
        </div>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.025em' }}>Payment Successful!</h2>
          <p style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem', marginTop: '0.375rem' }}>
            {fmt(success.amount)} paid via {success.method}
          </p>
        </div>
        <div style={{
          background: 'var(--gradient-card)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius)', padding: '1rem 1.5rem', width: '100%', maxWidth: '360px'
        }}>
          {[
            ['Transaction ID', `TX-${String(payments.payments.length).padStart(3, '0')}`],
            ['Amount', fmt(success.amount)],
            ['Method', success.method],
            ['Date', fmtDate(success.date)],
            ['Status', 'Paid'],
          ].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontSize: '0.8125rem', color: 'var(--muted-foreground)' }}>{k}</span>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: k === 'Status' ? 'var(--success)' : 'var(--foreground)' }}>{v}</span>
            </div>
          ))}
        </div>
        <button
          onClick={() => setSuccess(null)}
          style={{
            padding: '0.75rem 2rem',
            background: 'var(--gradient-success)',
            color: 'var(--success-foreground)',
            border: 'none', borderRadius: 'var(--radius)',
            fontWeight: 600, cursor: 'pointer',
            boxShadow: 'var(--shadow-glow)'
          }}
        >
          Make Another Payment
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Loan Summary Card */}
      <div style={{
        background: 'linear-gradient(135deg, oklch(22% 0.035 264), oklch(18% 0.028 264))',
        border: '1px solid var(--border)',
        borderRadius: 'calc(var(--radius) + 0.5rem)',
        padding: '1.5rem',
        boxShadow: 'var(--shadow-card)',
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: '-50px', right: '-50px',
          width: '200px', height: '200px', borderRadius: '50%',
          background: 'oklch(74% 0.17 165 / 0.04)'
        }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <span style={{
                fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
                color: 'var(--success)', background: 'oklch(74% 0.17 165 / 0.12)',
                padding: '0.2rem 0.625rem', borderRadius: '999px', border: '1px solid oklch(74% 0.17 165 / 0.25)'
              }}>Active</span>
              <span style={{ fontSize: '0.8125rem', color: 'var(--muted-foreground)' }}>{loan.id} · {loan.type}</span>
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--muted-foreground)' }}>Outstanding Balance</div>
            <div style={{ fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.03em' }}>{fmt(loan.outstanding)}</div>
          </div>
          <LoanProgressChart paid={loan.paid} outstanding={loan.outstanding} size={88} />
        </div>

        {/* Progress */}
        <div style={{ marginTop: '1.25rem' }}>
          <div style={{ height: '5px', background: 'var(--border)', borderRadius: '999px', overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${progress}%`,
              background: 'var(--gradient-success)', borderRadius: '999px'
            }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
              {loan.paidEmis} of {loan.termMonths} EMIs · {progress}% repaid
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 500 }}>
              {fmt(loan.paid)} total paid
            </span>
          </div>
        </div>

        {/* Key info row */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginTop: '1.25rem',
          paddingTop: '1.25rem', borderTop: '1px solid var(--border)'
        }}>
          {[
            ['Principal', fmt(loan.principal)],
            ['Rate', `${loan.interestRate}% p.a.`],
            ['Next Due', fmtDate(loan.nextDueDate)],
          ].map(([k, v]) => (
            <div key={k}>
              <div style={{ fontSize: '0.6875rem', color: 'var(--muted-foreground)', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{k}</div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Days until due banner */}
      {daysLeft <= 5 && (
        <div style={{
          background: 'oklch(62% 0.22 27 / 0.08)',
          border: '1px solid oklch(62% 0.22 27 / 0.3)',
          borderRadius: 'var(--radius)',
          padding: '0.875rem 1.125rem',
          display: 'flex', alignItems: 'center', gap: '0.625rem'
        }}>
          <AlertCircle size={16} color="var(--destructive)" />
          <span style={{ fontSize: '0.875rem', color: 'var(--destructive)', fontWeight: 500 }}>
            EMI due {daysLeft <= 0 ? 'is overdue' : `in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}`} — {fmtDate(loan.nextDueDate)}
          </span>
        </div>
      )}

      {/* Payment Section */}
      <div style={{
        background: 'var(--gradient-card)',
        border: '1px solid var(--border)',
        borderRadius: 'calc(var(--radius) + 0.25rem)',
        padding: '1.5rem',
        boxShadow: 'var(--shadow-card)'
      }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Make a Payment</h2>

        {/* Amount type selector */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.625rem', marginBottom: '1.25rem' }}>
          {[
            { id: 'emi', label: 'Pay EMI', value: fmt(loan.nextDueAmount) },
            { id: 'custom', label: 'Custom', value: 'Enter amount' },
            { id: 'full', label: 'Pay Full', value: fmt(loan.outstanding) },
          ].map(({ id, label, value }) => (
            <button
              key={id}
              onClick={() => setPayType(id)}
              style={{
                padding: '0.875rem 0.625rem',
                border: `2px solid ${payType === id ? 'var(--success)' : 'var(--border)'}`,
                borderRadius: 'var(--radius)',
                background: payType === id ? 'oklch(74% 0.17 165 / 0.08)' : 'transparent',
                color: payType === id ? 'var(--foreground)' : 'var(--muted-foreground)',
                cursor: 'pointer', textAlign: 'center',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: '0.25rem' }}>{label}</div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: payType === id ? 'var(--success)' : 'inherit' }}>{value}</div>
            </button>
          ))}
        </div>

        {/* Custom amount input */}
        {payType === 'custom' && (
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)',
                color: 'var(--muted-foreground)', fontSize: '0.9375rem', fontWeight: 600
              }}>₹</span>
              <input
                type="number"
                placeholder="Enter amount"
                value={customAmount}
                onChange={e => setCustomAmount(e.target.value)}
                min="1"
                max={loan.outstanding}
                style={{
                  width: '100%', padding: '0.875rem 1rem 0.875rem 2.25rem',
                  background: 'var(--input)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)', color: 'var(--foreground)',
                  fontSize: '1rem', fontWeight: 600, outline: 'none'
                }}
              />
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginTop: '0.375rem' }}>
              Max: {fmt(loan.outstanding)}
            </div>
          </div>
        )}

        {/* Payment Method */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--muted-foreground)' }}>
            Select Payment Method
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {PAYMENT_METHODS.map(({ id, label, icon: Icon, sub }) => (
              <button
                key={id}
                onClick={() => setSelectedMethod(id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.875rem',
                  padding: '0.875rem 1rem',
                  border: `1.5px solid ${selectedMethod === id ? 'var(--success)' : 'var(--border)'}`,
                  borderRadius: 'var(--radius)',
                  background: selectedMethod === id ? 'oklch(74% 0.17 165 / 0.05)' : 'transparent',
                  cursor: 'pointer', textAlign: 'left',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{
                  width: '2.25rem', height: '2.25rem', borderRadius: '0.5rem',
                  background: selectedMethod === id ? 'oklch(74% 0.17 165 / 0.15)' : 'var(--muted)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                  <Icon size={15} color={selectedMethod === id ? 'var(--success)' : 'var(--muted-foreground)'} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 500, color: selectedMethod === id ? 'var(--foreground)' : 'var(--foreground)' }}>{label}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>{sub}</div>
                </div>
                {selectedMethod === id && (
                  <div style={{
                    width: '1.125rem', height: '1.125rem', borderRadius: '50%',
                    background: 'var(--success)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                      <path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Summary + Pay Button */}
        <div style={{
          background: 'var(--muted)',
          borderRadius: 'var(--radius)',
          padding: '1rem',
          marginBottom: '1rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--muted-foreground)' }}>Amount</span>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{fmt(payAmount)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--muted-foreground)' }}>Method</span>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{methodLabel}</span>
          </div>
          <div style={{ height: '1px', background: 'var(--border)', margin: '0.625rem 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.9375rem', fontWeight: 700 }}>Total</span>
            <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--success)' }}>{fmt(payAmount)}</span>
          </div>
        </div>

        <button
          onClick={handlePayment}
          disabled={loading || payAmount <= 0}
          style={{
            width: '100%', padding: '0.9375rem',
            background: loading || payAmount <= 0 ? 'var(--muted)' : 'var(--gradient-success)',
            color: loading || payAmount <= 0 ? 'var(--muted-foreground)' : 'var(--success-foreground)',
            border: 'none', borderRadius: 'var(--radius)',
            fontSize: '1rem', fontWeight: 700, cursor: loading || payAmount <= 0 ? 'not-allowed' : 'pointer',
            boxShadow: loading || payAmount <= 0 ? 'none' : 'var(--shadow-glow)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
            transition: 'all 0.2s ease'
          }}
        >
          {loading ? (
            <>
              <span style={{
                width: '18px', height: '18px', borderRadius: '50%',
                border: '2px solid currentColor', borderTopColor: 'transparent',
                animation: 'spin 0.7s linear infinite', display: 'inline-block'
              }} />
              Processing…
            </>
          ) : `Pay ${fmt(payAmount)}`}
        </button>
      </div>

      {/* Receipt History */}
      <div style={{
        background: 'var(--gradient-card)',
        border: '1px solid var(--border)',
        borderRadius: 'calc(var(--radius) + 0.25rem)',
        padding: '1.5rem',
        boxShadow: 'var(--shadow-card)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>Payment Receipts</h2>
            <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginTop: '0.125rem' }}>
              {payments.payments.length} transactions
            </div>
          </div>
          <div style={{
            fontSize: '0.75rem', color: 'var(--success)', fontWeight: 600,
            padding: '0.25rem 0.75rem', borderRadius: '999px',
            background: 'oklch(74% 0.17 165 / 0.1)', border: '1px solid oklch(74% 0.17 165 / 0.2)'
          }}>
            All Paid
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
          {payments.payments.map((p) => (
            <div key={p.id}>
              <div
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '0.875rem 1rem',
                  background: expandedReceipt === p.id ? 'oklch(74% 0.17 165 / 0.05)' : 'var(--muted)',
                  border: `1px solid ${expandedReceipt === p.id ? 'oklch(74% 0.17 165 / 0.2)' : 'var(--border)'}`,
                  borderRadius: expandedReceipt === p.id ? 'var(--radius) var(--radius) 0 0' : 'var(--radius)',
                  cursor: 'pointer', transition: 'all 0.15s ease'
                }}
                onClick={() => setExpandedReceipt(expandedReceipt === p.id ? null : p.id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '2rem', height: '2rem', borderRadius: '0.5rem',
                    background: 'oklch(74% 0.17 165 / 0.12)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <Receipt size={13} color="var(--success)" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>EMI #{p.emiNo}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
                      {fmtDate(p.date)}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--success)' }}>{fmt(p.amount)}</span>
                  {expandedReceipt === p.id
                    ? <ChevronUp size={14} color="var(--muted-foreground)" />
                    : <ChevronDown size={14} color="var(--muted-foreground)" />
                  }
                </div>
              </div>
              {expandedReceipt === p.id && (
                <div style={{
                  background: 'oklch(74% 0.17 165 / 0.03)',
                  border: '1px solid oklch(74% 0.17 165 / 0.15)',
                  borderTop: 'none',
                  borderRadius: '0 0 var(--radius) var(--radius)',
                  padding: '0.875rem 1rem'
                }}>
                  {[
                    ['Transaction ID', p.id],
                    ['Payment Method', p.method],
                    ['Date & Time', fmtDate(p.date)],
                    ['Status', p.status],
                  ].map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.3125rem 0' }}>
                      <span style={{ fontSize: '0.8125rem', color: 'var(--muted-foreground)' }}>{k}</span>
                      <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: k === 'Status' ? 'var(--success)' : 'var(--foreground)' }}>{v}</span>
                    </div>
                  ))}
                  <button
                    style={{
                      marginTop: '0.625rem', width: '100%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem',
                      padding: '0.5rem', borderRadius: 'var(--radius)',
                      border: '1px solid var(--border)', background: 'transparent',
                      color: 'var(--muted-foreground)', fontSize: '0.8125rem',
                      fontWeight: 500, cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--muted)'; e.currentTarget.style.color = 'var(--foreground)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--muted-foreground)'; }}
                  >
                    <Download size={13} /> Download Receipt
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default LoansPage;
