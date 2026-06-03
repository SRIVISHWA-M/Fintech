import React, { useState, useEffect } from 'react';
import { CheckCircle2, Clock, XCircle, ChevronLeft, ChevronRight, Filter, Download } from 'lucide-react';
import { paymentStore } from '../../../store/paymentStore';
import { loanStore } from '../../../store/loanStore';

const fmt = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

const PaymentsPage = () => {
  const today = new Date();
  const [payments, setPayments] = useState(paymentStore.getState());
  const [loan, setLoan] = useState(loanStore.getState());
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [hoveredDay, setHoveredDay] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => {
    const u1 = paymentStore.subscribe(setPayments);
    const u2 = loanStore.subscribe(setLoan);
    return () => { u1(); u2(); };
  }, []);

  // Build a set of paid date strings
  const paidDates = new Set(payments.payments.map(p => p.date));

  // Next due date
  const nextDue = loan.nextDueDate;

  const daysInMonth = getDaysInMonth(calYear, calMonth);
  const firstDay = getFirstDayOfMonth(calYear, calMonth);

  const getDayStatus = (dateStr) => {
    if (paidDates.has(dateStr)) return 'paid';
    if (dateStr === nextDue) return 'due';
    const d = new Date(dateStr);
    if (d > today) return 'upcoming';
    return null;
  };

  const prevMonth = () => {
    if (calMonth === 0) { setCalYear(y => y - 1); setCalMonth(11); }
    else setCalMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (calMonth === 11) { setCalYear(y => y + 1); setCalMonth(0); }
    else setCalMonth(m => m + 1);
  };

  const filtered = filterStatus === 'All'
    ? payments.payments
    : payments.payments.filter(p => p.status === filterStatus);

  // Stats
  const totalPaid = payments.payments.reduce((s, p) => s + p.amount, 0);
  const onTimeCount = payments.payments.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Summary Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.875rem' }}>
        {[
          { label: 'Total Paid', value: fmt(totalPaid), color: 'var(--success)' },
          { label: 'EMIs Completed', value: `${onTimeCount}/${loan.termMonths}`, color: 'oklch(74% 0.15 240)' },
          { label: 'On-Time Rate', value: '100%', color: 'oklch(74% 0.14 300)' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{
            background: 'var(--gradient-card)', border: '1px solid var(--border)',
            borderRadius: 'calc(var(--radius) + 0.25rem)', padding: '1.125rem',
            boxShadow: 'var(--shadow-card)', textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.375rem', fontWeight: 800, color, letterSpacing: '-0.025em' }}>{value}</div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--muted-foreground)', marginTop: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Interactive Calendar */}
      <div style={{
        background: 'var(--gradient-card)', border: '1px solid var(--border)',
        borderRadius: 'calc(var(--radius) + 0.5rem)', padding: '1.5rem',
        boxShadow: 'var(--shadow-card)'
      }}>
        {/* Calendar header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <button onClick={prevMonth} style={{
            width: '2rem', height: '2rem', borderRadius: '0.5rem',
            border: '1px solid var(--border)', background: 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--muted-foreground)', cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--muted)'; e.currentTarget.style.color = 'var(--foreground)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--muted-foreground)'; }}
          >
            <ChevronLeft size={15} />
          </button>
          <div style={{ fontWeight: 700, fontSize: '0.9375rem' }}>
            {MONTHS[calMonth]} {calYear}
          </div>
          <button onClick={nextMonth} style={{
            width: '2rem', height: '2rem', borderRadius: '0.5rem',
            border: '1px solid var(--border)', background: 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--muted-foreground)', cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--muted)'; e.currentTarget.style.color = 'var(--foreground)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--muted-foreground)'; }}
          >
            <ChevronRight size={15} />
          </button>
        </div>

        {/* Day labels */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', marginBottom: '0.5rem' }}>
          {DAYS.map(d => (
            <div key={d} style={{ textAlign: 'center', fontSize: '0.6875rem', fontWeight: 600, color: 'var(--muted-foreground)', padding: '0.25rem 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {d}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '3px' }}>
          {/* Empty cells before first day */}
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`e-${i}`} />
          ))}
          {/* Day cells */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const status = getDayStatus(dateStr);
            const isToday = dateStr === today.toISOString().split('T')[0];
            const isHovered = hoveredDay === dateStr;

            let bg = 'transparent';
            let color = 'var(--foreground)';
            let border = '1px solid transparent';
            let dotColor = null;

            if (status === 'paid') { dotColor = 'var(--success)'; bg = 'oklch(74% 0.17 165 / 0.08)'; border = '1px solid oklch(74% 0.17 165 / 0.2)'; }
            if (status === 'due') { bg = 'oklch(62% 0.22 27 / 0.12)'; border = '1px solid oklch(62% 0.22 27 / 0.35)'; color = 'oklch(62% 0.22 27)'; dotColor = 'oklch(62% 0.22 27)'; }
            if (isToday && status !== 'paid') { border = '1px solid var(--success)'; }
            if (isHovered && status) { bg = status === 'paid' ? 'oklch(74% 0.17 165 / 0.15)' : bg; }

            const payment = payments.payments.find(p => p.date === dateStr);

            return (
              <div
                key={day}
                onMouseEnter={() => setHoveredDay(dateStr)}
                onMouseLeave={() => setHoveredDay(null)}
                style={{
                  aspectRatio: '1', display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  borderRadius: '0.5rem', position: 'relative',
                  background: bg, border,
                  cursor: status ? 'pointer' : 'default',
                  transition: 'all 0.15s ease',
                  gap: '2px'
                }}
                title={payment ? `Paid ${fmt(payment.amount)}` : status === 'due' ? `EMI Due: ${fmt(loan.nextDueAmount)}` : ''}
              >
                <span style={{ fontSize: '0.75rem', fontWeight: isToday ? 700 : 400, color }}>{day}</span>
                {dotColor && (
                  <div style={{
                    width: '4px', height: '4px', borderRadius: '50%',
                    background: dotColor, flexShrink: 0
                  }} />
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.125rem', paddingTop: '1rem', borderTop: '1px solid var(--border)', flexWrap: 'wrap' }}>
          {[
            { color: 'var(--success)', label: 'Paid' },
            { color: 'oklch(62% 0.22 27)', label: 'Due' },
            { color: 'var(--border)', label: 'Today', border: true },
          ].map(({ color, label, border: hasBorder }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <div style={{
                width: '10px', height: '10px', borderRadius: '3px',
                background: hasBorder ? 'transparent' : color,
                border: hasBorder ? `2px solid ${color}` : 'none'
              }} />
              <span style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Payment History Table */}
      <div style={{
        background: 'var(--gradient-card)', border: '1px solid var(--border)',
        borderRadius: 'calc(var(--radius) + 0.25rem)', padding: '1.5rem',
        boxShadow: 'var(--shadow-card)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.125rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>Transaction History</h2>
            <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginTop: '0.125rem' }}>
              {filtered.length} records
            </div>
          </div>
          {/* Filter tabs */}
          <div style={{ display: 'flex', gap: '0.375rem', background: 'var(--muted)', padding: '0.25rem', borderRadius: 'var(--radius)' }}>
            {['All', 'Paid', 'Pending'].map(s => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                style={{
                  padding: '0.375rem 0.875rem',
                  borderRadius: 'calc(var(--radius) - 0.125rem)',
                  border: 'none',
                  background: filterStatus === s ? 'var(--card)' : 'transparent',
                  color: filterStatus === s ? 'var(--foreground)' : 'var(--muted-foreground)',
                  fontSize: '0.8125rem', fontWeight: filterStatus === s ? 600 : 400,
                  cursor: 'pointer', transition: 'all 0.15s ease'
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Table header */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1.5fr 1fr 0.75fr',
          padding: '0.5rem 0.75rem', marginBottom: '0.375rem'
        }}>
          {['EMI #', 'Date & Method', 'Amount', 'Status'].map(h => (
            <div key={h} style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {h}
            </div>
          ))}
        </div>

        {/* Table rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>
              No transactions found
            </div>
          ) : (
            filtered.map((p, idx) => (
              <div
                key={p.id}
                style={{
                  display: 'grid', gridTemplateColumns: '1fr 1.5fr 1fr 0.75fr',
                  padding: '0.875rem 0.75rem',
                  background: idx % 2 === 0 ? 'var(--muted)' : 'transparent',
                  borderRadius: 'var(--radius)',
                  alignItems: 'center',
                  transition: 'background 0.15s ease'
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'oklch(74% 0.17 165 / 0.05)'}
                onMouseLeave={e => e.currentTarget.style.background = idx % 2 === 0 ? 'var(--muted)' : 'transparent'}
              >
                {/* EMI # */}
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>#{p.emiNo}</div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--muted-foreground)' }}>{p.id}</div>
                </div>
                {/* Date + Method */}
                <div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 500 }}>
                    {new Date(p.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--muted-foreground)', marginTop: '0.125rem' }}>{p.method}</div>
                </div>
                {/* Amount */}
                <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--success)' }}>
                  {fmt(p.amount)}
                </div>
                {/* Status badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  {p.status === 'Paid'
                    ? <CheckCircle2 size={13} color="var(--success)" />
                    : p.status === 'Pending'
                    ? <Clock size={13} color="oklch(74% 0.17 60)" />
                    : <XCircle size={13} color="var(--destructive)" />
                  }
                  <span style={{
                    fontSize: '0.75rem', fontWeight: 600,
                    color: p.status === 'Paid' ? 'var(--success)'
                      : p.status === 'Pending' ? 'oklch(74% 0.17 60)'
                      : 'var(--destructive)'
                  }}>
                    {p.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Export button */}
        {filtered.length > 0 && (
          <button
            style={{
              marginTop: '1.125rem', width: '100%',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem',
              padding: '0.625rem', borderRadius: 'var(--radius)',
              border: '1px solid var(--border)', background: 'transparent',
              color: 'var(--muted-foreground)', fontSize: '0.8125rem',
              fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s ease'
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--muted)'; e.currentTarget.style.color = 'var(--foreground)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--muted-foreground)'; }}
          >
            <Download size={14} /> Export as CSV
          </button>
        )}
      </div>
    </div>
  );
};

export default PaymentsPage;
