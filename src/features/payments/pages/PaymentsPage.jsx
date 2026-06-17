import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { paymentStore } from '../../../store/paymentStore';
import { loanStore } from '../../../store/loanStore';
import colors from '../../../theme/colors';
import { paymentService } from '../../../services/paymentService';

const fmt = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DAYS   = ['S','M','T','W','T','F','S'];

const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
const getFirstDay    = (y, m) => new Date(y, m, 1).getDay();

const PaymentsPage = () => {
  const today = new Date();
  const [payments, setPayments] = useState(paymentStore.getState());
  const [loan, setLoan]         = useState(loanStore.getState());
  const [calYear, setCalYear]   = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => {
    const u1 = paymentStore.subscribe(setPayments);
    const u2 = loanStore.subscribe(setLoan);
    // Fetch payments from backend on mount
    paymentService.getPayments().catch(e => console.log('Payments API unavailable:', e.message));
    return () => { u1(); u2(); };
  }, []);

  // Refetch calendar data when month/year changes
  useEffect(() => {
    paymentService.getCalendar(calYear, calMonth + 1)
      .catch(e => console.log('Calendar API unavailable:', e.message));
  }, [calYear, calMonth]);

  const paidDates   = new Set(payments.payments.map((p) => p.date));
  const nextDue     = loan.nextDueDate;
  const daysInMonth = getDaysInMonth(calYear, calMonth);
  const firstDay    = getFirstDay(calYear, calMonth);
  const todayStr    = today.toISOString().split('T')[0];

  const getDayStatus = (dateStr) => {
    if (paidDates.has(dateStr)) return 'paid';
    if (dateStr === nextDue)    return 'due';
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

  const filtered   = filterStatus === 'All' ? payments.payments : payments.payments.filter(p => p.status === filterStatus);
  const totalPaid  = payments.payments.reduce((s, p) => s + p.amount, 0);
  const onTimeCount= payments.payments.length;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* ── Page title ────────────────────────────────────────────────── */}
        <View style={styles.pageHeader}>
          <View>
            <Text style={styles.pageTitle}>Payments</Text>
            <Text style={styles.pageSub}>Track your EMI calendar & history</Text>
          </View>
          <View style={styles.headerBadge}>
            <View style={styles.headerBadgeDot} />
            <Text style={styles.headerBadgeText}>All On-Time</Text>
          </View>
        </View>

        {/* ── Summary Stats ──────────────────────────────────────────────── */}
        <View style={styles.statsRow}>
          {[
            { label: 'Total Paid', value: fmt(totalPaid), color: colors.success, icon: 'card-outline' },
            { label: 'EMIs Done', value: `${onTimeCount}/${loan.termMonths}`, color: colors.chartBlue, icon: 'checkmark-circle-outline' },
            { label: 'On-Time Rate', value: '100%', color: colors.chartPurple, icon: 'shield-checkmark-outline' },
          ].map(({ label, value, color, icon }) => (
            <View key={label} style={styles.statCard}>
              <View style={[styles.statIconBox, { backgroundColor: `${color}18` }]}>
                <Ionicons name={icon} size={15} color={color} />
              </View>
              <Text style={[styles.statValue, { color }]}>{value}</Text>
              <Text style={styles.statLabel}>{label}</Text>
            </View>
          ))}
        </View>

        {/* ── Calendar ──────────────────────────────────────────────────── */}
        <View style={styles.card}>
          {/* Nav */}
          <View style={styles.calNav}>
            <TouchableOpacity onPress={prevMonth} style={styles.calNavBtn} activeOpacity={0.75}>
              <Ionicons name="chevron-back" size={16} color={colors.foreground} />
            </TouchableOpacity>
            <View style={{ alignItems: 'center' }}>
              <Text style={styles.calTitle}>{MONTHS[calMonth]} {calYear}</Text>
              <Text style={styles.calSubtitle}>Payment Calendar</Text>
            </View>
            <TouchableOpacity onPress={nextMonth} style={styles.calNavBtn} activeOpacity={0.75}>
              <Ionicons name="chevron-forward" size={16} color={colors.foreground} />
            </TouchableOpacity>
          </View>

          {/* Day labels */}
          <View style={styles.calDayRow}>
            {DAYS.map((d, i) => (
              <Text key={i} style={[styles.calDayLabel, (i === 0 || i === 6) && { color: colors.mutedForeground }]}>{d}</Text>
            ))}
          </View>

          {/* Grid */}
          <View style={styles.calGrid}>
            {Array.from({ length: firstDay }).map((_, i) => (
              <View key={`e-${i}`} style={styles.calCell} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const status  = getDayStatus(dateStr);
              const isToday = dateStr === todayStr;

              return (
                <View key={day} style={[
                  styles.calCell,
                  status === 'paid' && styles.calCellPaid,
                  status === 'due'  && styles.calCellDue,
                  isToday && status !== 'paid' && styles.calCellToday,
                ]}>
                  <Text style={[
                    styles.calDayNum,
                    status === 'paid' && { color: colors.success, fontWeight: '700' },
                    status === 'due'  && { color: colors.destructive, fontWeight: '700' },
                    isToday && { fontWeight: '800' },
                  ]}>
                    {day}
                  </Text>
                  {status === 'paid' && (
                    <View style={[styles.calDot, { backgroundColor: colors.success }]} />
                  )}
                  {status === 'due' && (
                    <View style={[styles.calDot, { backgroundColor: colors.destructive }]} />
                  )}
                </View>
              );
            })}
          </View>

          {/* Legend */}
          <View style={styles.calLegend}>
            {[
              { label: 'Paid', bg: colors.successDim, border: colors.successBorder, dot: colors.success },
              { label: 'Due', bg: colors.destructiveDim, border: colors.destructiveBorder, dot: colors.destructive },
              { label: 'Today', bg: 'transparent', border: colors.success, dot: null },
            ].map(({ label, bg, border, dot }) => (
              <View key={label} style={styles.legendItem}>
                <View style={[styles.legendCell, { backgroundColor: bg, borderColor: border }]}>
                  {dot && <View style={[styles.legendDot, { backgroundColor: dot }]} />}
                </View>
                <Text style={styles.legendLabel}>{label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Transaction History ─────────────────────────────────────────── */}
        <View style={styles.card}>
          {/* Header + filter */}
          <View style={styles.histHeader}>
            <View>
              <Text style={styles.sectionTitle}>Transaction History</Text>
              <Text style={styles.histCount}>{filtered.length} records found</Text>
            </View>
          </View>

          <View style={styles.filterRow}>
            {['All', 'Paid', 'Pending'].map(s => (
              <TouchableOpacity
                key={s}
                style={[styles.filterBtn, filterStatus === s && styles.filterBtnActive]}
                onPress={() => setFilterStatus(s)}
                activeOpacity={0.75}
              >
                <Text style={[styles.filterBtnText, filterStatus === s && styles.filterBtnTextActive]}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Rows */}
          {filtered.length === 0 ? (
            <View style={styles.emptyBox}>
              <Ionicons name="receipt-outline" size={32} color={colors.mutedForeground} />
              <Text style={styles.emptyText}>No transactions found</Text>
            </View>
          ) : (
            <View style={{ gap: 8, marginTop: 4 }}>
              {filtered.map((p) => (
                <View key={p.id} style={styles.txRow}>
                  <View style={styles.txIconBox}>
                    <Ionicons name="receipt-outline" size={15} color={colors.success} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <View>
                        <Text style={styles.txEmi}>EMI #{p.emiNo}</Text>
                        <Text style={styles.txId}>{p.id}</Text>
                      </View>
                      <Text style={styles.txAmount}>{fmt(p.amount)}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                        <Ionicons name="time-outline" size={11} color={colors.mutedForeground} />
                        <Text style={styles.txDate}>
                          {new Date(p.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </Text>
                        <Text style={styles.txDot}>·</Text>
                        <Text style={styles.txMethod}>{p.method}</Text>
                      </View>
                      <View style={[
                        styles.statusBadge,
                        p.status === 'Paid'    && styles.statusBadgePaid,
                        p.status === 'Pending' && styles.statusBadgePending,
                      ]}>
                        <Ionicons
                          name={p.status === 'Paid' ? 'checkmark-circle' : 'time-outline'}
                          size={11}
                          color={p.status === 'Paid' ? colors.success : colors.warning}
                        />
                        <Text style={[
                          styles.statusText,
                          { color: p.status === 'Paid' ? colors.success : colors.warning },
                        ]}>
                          {p.status}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 110, gap: 14 },

  // Page header
  pageHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 4, paddingBottom: 4 },
  pageTitle: { fontSize: 24, fontWeight: '800', color: colors.foreground, letterSpacing: -0.5 },
  pageSub: { fontSize: 13, color: colors.mutedForeground, marginTop: 2 },
  headerBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: colors.successDim, borderWidth: 1, borderColor: colors.successBorder,
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: colors.radiusFull,
  },
  headerBadgeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.success },
  headerBadgeText: { fontSize: 11, color: colors.success, fontWeight: '700' },

  // Stats
  statsRow: { flexDirection: 'row', gap: 10 },
  statCard: {
    flex: 1, backgroundColor: colors.card,
    borderWidth: 1, borderColor: colors.border,
    borderRadius: colors.radiusMd, padding: 14,
    alignItems: 'center', gap: 6, ...colors.shadowCard,
  },
  statIconBox: {
    width: 36, height: 36, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  statValue: { fontSize: 17, fontWeight: '800', letterSpacing: -0.4 },
  statLabel: { fontSize: 10, color: colors.mutedForeground, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, textAlign: 'center' },

  // Card
  card: {
    backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border,
    borderRadius: colors.radiusMd, padding: 16, ...colors.shadowCard,
  },

  // Calendar
  calNav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 },
  calNavBtn: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: colors.muted, borderWidth: 1, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  calTitle: { fontSize: 17, fontWeight: '800', color: colors.foreground },
  calSubtitle: { fontSize: 11, color: colors.mutedForeground, marginTop: 2 },
  calDayRow: { flexDirection: 'row', marginBottom: 8 },
  calDayLabel: { flex: 1, textAlign: 'center', fontSize: 11, fontWeight: '700', color: colors.foregroundSecondary, letterSpacing: 0.3 },
  calGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  calCell: { width: '14.28%', aspectRatio: 1, alignItems: 'center', justifyContent: 'center', padding: 2, borderRadius: 8 },
  calCellPaid: { backgroundColor: 'rgba(52,216,124,0.10)', borderWidth: 1, borderColor: 'rgba(52,216,124,0.22)' },
  calCellDue: { backgroundColor: 'rgba(248,113,113,0.10)', borderWidth: 1, borderColor: 'rgba(248,113,113,0.3)' },
  calCellToday: { borderWidth: 1.5, borderColor: colors.success },
  calDayNum: { fontSize: 12, color: colors.foreground },
  calDot: { width: 4, height: 4, borderRadius: 2, marginTop: 1 },
  calLegend: { flexDirection: 'row', gap: 16, marginTop: 14, paddingTop: 14, borderTopWidth: 1, borderTopColor: colors.border },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  legendCell: {
    width: 22, height: 22, borderRadius: 6,
    borderWidth: 1, alignItems: 'center', justifyContent: 'center',
  },
  legendDot: { width: 6, height: 6, borderRadius: 3 },
  legendLabel: { fontSize: 12, color: colors.mutedForeground, fontWeight: '500' },

  // History
  histHeader: { marginBottom: 10 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.foreground },
  histCount: { fontSize: 12, color: colors.mutedForeground, marginTop: 2 },
  filterRow: {
    flexDirection: 'row', backgroundColor: colors.muted,
    padding: 4, borderRadius: colors.radius, gap: 4, marginBottom: 4,
    borderWidth: 1, borderColor: colors.border,
  },
  filterBtn: { flex: 1, paddingVertical: 7, borderRadius: 10, alignItems: 'center' },
  filterBtnActive: { backgroundColor: colors.card, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 2 },
  filterBtnText: { fontSize: 13, color: colors.mutedForeground, fontWeight: '500' },
  filterBtnTextActive: { color: colors.foreground, fontWeight: '700' },

  // TX row
  txRow: {
    flexDirection: 'row', gap: 12,
    backgroundColor: colors.muted, borderRadius: colors.radius,
    padding: 14, borderWidth: 1, borderColor: colors.border,
  },
  txIconBox: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: colors.successDim,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  txEmi: { fontSize: 14, fontWeight: '700', color: colors.foreground },
  txId: { fontSize: 11, color: colors.mutedForeground, marginTop: 1 },
  txAmount: { fontSize: 16, fontWeight: '800', color: colors.success },
  txDate: { fontSize: 11, color: colors.mutedForeground },
  txDot: { fontSize: 11, color: colors.mutedForeground },
  txMethod: { fontSize: 11, color: colors.mutedForeground },
  statusBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8,
    borderWidth: 1,
  },
  statusBadgePaid: { backgroundColor: colors.successDim, borderColor: colors.successBorder },
  statusBadgePending: { backgroundColor: colors.warningDim, borderColor: 'rgba(251,191,36,0.3)' },
  statusText: { fontSize: 11, fontWeight: '700' },

  // Empty
  emptyBox: { alignItems: 'center', paddingVertical: 36, gap: 10 },
  emptyText: { fontSize: 14, color: colors.mutedForeground },
});

export default PaymentsPage;
