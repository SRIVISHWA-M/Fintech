import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { NovaLogoIcon } from '../../../components/NovaLogo';
import { loanStore } from '../../../store/loanStore';
import { paymentStore } from '../../../store/paymentStore';
import { authStore } from '../../../store/authStore';
import {
  LoanProgressChart,
  PaymentTrendChart,
  EmiBreakdownChart,
} from '../../../components/charts/Charts';
import colors from '../../../theme/colors';
import { loanService } from '../../../services/loanService';
import { paymentService } from '../../../services/paymentService';

const fmt = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
const fmtDate = (d) =>
  new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
const daysUntil = (d) => Math.ceil((new Date(d) - new Date()) / 86400000);

/* ── Mini stat card ─────────────────────────────────────────────────────────── */
const StatCard = ({ iconName, iconColor = colors.success, label, value, sub, onPress }) => (
  <TouchableOpacity
    style={styles.statCard}
    onPress={onPress}
    activeOpacity={onPress ? 0.75 : 1}
  >
    <View style={styles.statCardTop}>
      <View style={[styles.statIconBox, { backgroundColor: `${iconColor}18` }]}>
        <Ionicons name={iconName} size={16} color={iconColor} />
      </View>
      {onPress && <Ionicons name="chevron-forward" size={14} color={colors.mutedForeground} />}
    </View>
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={styles.statValue}>{value}</Text>
    {sub ? <Text style={styles.statSub}>{sub}</Text> : null}
  </TouchableOpacity>
);

/* ── SIM chip ───────────────────────────────────────────────────────────────── */
const SimChip = () => (
  <View style={styles.simChip}>
    <View style={styles.simInner}>
      <View style={styles.simLineH} />
      <View style={styles.simLineV} />
      <View style={styles.simCenter} />
    </View>
  </View>
);

/* ── Card decorative waves ──────────────────────────────────────────────────── */
const CardWaves = () => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    <Svg width="100%" height="100%">
      <Defs>
        <LinearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <Stop offset="0%" stopColor="#34d87c" stopOpacity="0.10" />
          <Stop offset="100%" stopColor="#60a5fa" stopOpacity="0.04" />
        </LinearGradient>
      </Defs>
      <Path d="M -30 40 Q 100 130 220 20 T 420 90" fill="none" stroke="url(#waveGrad)" strokeWidth="60" />
      <Path d="M -20 110 Q 140 20 260 130 T 440 30" fill="none" stroke="rgba(52,216,124,0.05)" strokeWidth="40" />
    </Svg>
  </View>
);

/* ── Page ────────────────────────────────────────────────────────────────────── */
const DashboardPage = () => {
  const navigation = useNavigation();
  const [loan, setLoan] = useState(loanStore.getState());
  const [payments, setPayments] = useState(paymentStore.getState());
  const [user] = useState(authStore.getState().user);

  useEffect(() => {
    const u1 = loanStore.subscribe(setLoan);
    const u2 = paymentStore.subscribe(setPayments);
    // Fetch latest data from backend on mount
    loanService.getActiveLoan().catch(e => console.log('Loan API unavailable:', e.message));
    paymentService.getPayments().catch(e => console.log('Payments API unavailable:', e.message));
    return () => { u1(); u2(); };
  }, []);

  const daysLeft = daysUntil(loan.nextDueDate);
  const progress = Math.round((loan.paid / loan.principal) * 100);
  const recentPayments = payments.payments.slice(0, 3);
  const isUrgent = daysLeft <= 3;
  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning,</Text>
            <Text style={styles.userName}>{user?.name?.split(' ')[0]} 👋</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.notifBtn} activeOpacity={0.75}>
              <Ionicons name="notifications-outline" size={20} color={colors.foreground} />
              <View style={styles.notifDot} />
            </TouchableOpacity>
            <View style={styles.avatarBox}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
          </View>
        </View>

        {/* ── Hero Loan Card ──────────────────────────────────────────────── */}
        <View style={styles.heroCard}>
          {/* Credit card visual */}
          <View style={styles.creditCardVisual}>
            <CardWaves />

            <View style={styles.cardHeaderRow}>
              <View style={styles.logoCol}>
                <NovaLogoIcon size={18} />
                <Text style={[styles.logoText, { marginLeft: 6 }]}>NOVA</Text>
              </View>
              <View style={styles.networkBadge}>
                <Text style={styles.networkText}>MASTERCARD</Text>
              </View>
            </View>

            <View style={styles.cardMiddleRow}>
              <View style={styles.chipAndBalance}>
                <SimChip />
                <View style={styles.balanceCol}>
                  <Text style={styles.balLabel}>Outstanding Balance</Text>
                  <Text style={styles.balValue}>{fmt(loan.outstanding)}</Text>
                </View>
              </View>
              <View style={{ flexShrink: 0 }}>
                <LoanProgressChart outstanding={loan.outstanding} principal={loan.principal} size={60} />
              </View>
            </View>

            <View style={styles.cardDivider} />

            <View style={styles.cardBottomRow}>
              <View>
                <Text style={styles.cardBottomLabel}>CARD NUMBER</Text>
                <Text style={styles.cardBottomValue}>•••• •••• •••• 4421</Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text style={styles.cardBottomLabel}>VALID THRU</Text>
                <Text style={styles.cardBottomValue}>06/28</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.cardBottomLabel}>CARDHOLDER</Text>
                <Text style={styles.cardBottomValue}>{user?.name?.split(' ')[0]?.toUpperCase()}</Text>
              </View>
            </View>
          </View>

          {/* Loan progress */}
          <View style={styles.progressSection}>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
            </View>
            <View style={styles.progressMeta}>
              <Text style={styles.progressMetaLeft}>{loan.paidEmis}/{loan.termMonths} EMIs paid</Text>
              <Text style={styles.progressMetaRight}>{progress}% repaid · {fmt(loan.paid)}</Text>
            </View>
          </View>
        </View>

        {/* ── EMI Alert ──────────────────────────────────────────────────── */}
        <View style={[
          styles.alertCard,
          isUrgent ? styles.alertCardUrgent : styles.alertCardNormal,
        ]}>
          <View style={[
            styles.alertIconWrap,
            isUrgent ? styles.alertIconWrapUrgent : styles.alertIconWrapNormal,
          ]}>
            <Ionicons
              name={isUrgent ? 'alert-circle' : 'time-outline'}
              size={18}
              color={isUrgent ? colors.destructive : colors.success}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.alertTitle}>Next EMI: {fmt(loan.nextDueAmount)}</Text>
            <Text style={styles.alertSub}>
              Due {fmtDate(loan.nextDueDate)} ·{' '}
              {daysLeft <= 0 ? 'Overdue!' : `${daysLeft} day${daysLeft !== 1 ? 's' : ''} left`}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.payNowBtn}
            onPress={() => navigation.navigate('Loans')}
            activeOpacity={0.85}
          >
            <Text style={styles.payNowText}>Pay Now</Text>
            <Ionicons name="arrow-forward" size={13} color={colors.successForeground} />
          </TouchableOpacity>
        </View>

        {/* ── Stats Grid ─────────────────────────────────────────────────── */}
        <View style={styles.statsGrid}>
          <StatCard
            iconName="trending-up" label="Interest Rate"
            value={`${loan.interestRate}%`} sub="p.a. flat rate"
          />
          <StatCard
            iconName="calendar-outline" iconColor={colors.chartBlue}
            label="Remaining" value={`${loan.termMonths - loan.paidEmis} mo`}
            sub={`of ${loan.termMonths} months`}
          />
          <StatCard
            iconName="card-outline" iconColor={colors.chartPurple}
            label="EMI Amount" value={fmt(loan.nextDueAmount)}
            sub={`via ${loan.paymentMethod}`}
            onPress={() => navigation.navigate('Loans')}
          />
          <StatCard
            iconName="shield-checkmark-outline" iconColor={colors.warning}
            label="On-Time Rate" value={`${user?.onTimeRate || 100}%`}
            sub="all-time record"
          />
        </View>

        {/* ── Payment Trend Chart ─────────────────────────────────────────── */}
        <View style={styles.chartCard}>
          <View style={styles.chartCardHeader}>
            <View>
              <Text style={styles.cardTitle}>Payment History</Text>
              <Text style={styles.cardSub}>Monthly EMI breakdown</Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('Payments')}
              style={styles.viewAllBtn}
            >
              <Text style={styles.viewAllText}>View all</Text>
              <Ionicons name="chevron-forward" size={13} color={colors.success} />
            </TouchableOpacity>
          </View>
          <PaymentTrendChart payments={payments.payments} />
        </View>

        {/* ── EMI Breakdown + Recent Payments ─────────────────────────────── */}
        <View style={styles.twoCol}>
          {/* EMI Breakdown */}
          <View style={[styles.chartCard, { flex: 1 }]}>
            <Text style={styles.cardTitle}>EMI Breakdown</Text>
            <Text style={styles.cardSub}>Per installment</Text>
            <View style={{ marginTop: 14 }}>
              <EmiBreakdownChart breakdown={loan.breakdown} />
            </View>
            {[
              { label: 'Principal', value: loan.breakdown.principal, color: colors.success },
              { label: 'Interest', value: loan.breakdown.interest, color: colors.chartBlue },
              { label: 'Fees', value: loan.breakdown.fees, color: colors.chartPurple },
            ].map(({ label, value, color }) => (
              <View key={label} style={styles.breakdownRow}>
                <View style={styles.breakdownLeft}>
                  <View style={[styles.breakdownDot, { backgroundColor: color }]} />
                  <Text style={styles.breakdownLabel}>{label}</Text>
                </View>
                <Text style={[styles.breakdownValue, { color }]}>{fmt(value)}</Text>
              </View>
            ))}
          </View>

          {/* Recent Payments */}
          <View style={[styles.chartCard, { flex: 1 }]}>
            <Text style={styles.cardTitle}>Recent</Text>
            <Text style={styles.cardSub}>Last 3 EMIs</Text>
            <View style={{ marginTop: 12, gap: 8 }}>
              {recentPayments.map((p) => (
                <View key={p.id} style={styles.recentRow}>
                  <View style={styles.recentIconBox}>
                    <Ionicons name="checkmark-circle" size={14} color={colors.success} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.recentEmi}>EMI #{p.emiNo}</Text>
                    <Text style={styles.recentDate}>
                      {new Date(p.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </Text>
                  </View>
                  <Text style={styles.recentAmount}>{fmt(p.amount)}</Text>
                </View>
              ))}
            </View>
            <TouchableOpacity
              style={styles.allHistoryBtn}
              onPress={() => navigation.navigate('Payments')}
              activeOpacity={0.75}
            >
              <Text style={styles.allHistoryText}>All history</Text>
              <Ionicons name="chevron-forward" size={12} color={colors.mutedForeground} />
            </TouchableOpacity>
          </View>
        </View>



      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 110, gap: 14 },

  // Header
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingBottom: 4, paddingTop: 4,
  },
  greeting: { fontSize: 13, color: colors.mutedForeground, fontWeight: '500' },
  userName: { fontSize: 24, fontWeight: '800', color: colors.foreground, letterSpacing: -0.6, marginTop: 2 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  notifBtn: { position: 'relative' },
  notifDot: {
    position: 'absolute', top: -1, right: -1,
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: colors.destructive,
    borderWidth: 1.5, borderColor: colors.background,
  },
  avatarBox: {
    width: 42, height: 42, borderRadius: 13,
    backgroundColor: colors.success,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: colors.success,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4, shadowRadius: 10, elevation: 6,
  },
  avatarText: { fontSize: 15, fontWeight: '800', color: colors.successForeground },

  // Hero Card
  heroCard: {
    backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border,
    borderRadius: colors.radiusLg, padding: 16, ...colors.shadowCard,
  },

  // Credit card visual
  creditCardVisual: {
    backgroundColor: '#0a1a10',
    borderRadius: 16, padding: 18,
    overflow: 'hidden',
    borderWidth: 1, borderColor: 'rgba(52,216,124,0.20)',
    marginBottom: 2,
    minHeight: 160,
  },
  cardHeaderRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 22,
  },
  logoCol: { flexDirection: 'row', alignItems: 'center' },
  logoText: { color: '#ffffff', fontSize: 15, fontWeight: '900', letterSpacing: 2 },
  networkBadge: {
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 5,
  },
  networkText: { color: 'rgba(255,255,255,0.6)', fontSize: 8, fontWeight: '700', letterSpacing: 1.5 },
  cardMiddleRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 18,
  },
  chipAndBalance: { flexDirection: 'row', alignItems: 'center', gap: 14, flex: 1 },
  balanceCol: {},
  balLabel: {
    fontSize: 9, color: 'rgba(255,255,255,0.45)',
    textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 3, fontWeight: '600',
  },
  balValue: { fontSize: 26, fontWeight: '800', color: '#ffffff', letterSpacing: -0.5 },
  cardDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.06)', marginBottom: 14 },
  cardBottomRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  cardBottomLabel: {
    fontSize: 7, color: 'rgba(255,255,255,0.35)',
    fontWeight: '600', letterSpacing: 0.8, marginBottom: 3, textTransform: 'uppercase',
  },
  cardBottomValue: { fontSize: 11, color: 'rgba(255,255,255,0.85)', fontWeight: '700', letterSpacing: 0.3 },

  // SIM Chip
  simChip: {
    width: 36, height: 28, borderRadius: 6,
    backgroundColor: '#C9A227', overflow: 'hidden',
    padding: 3, borderWidth: 1, borderColor: 'rgba(0,0,0,0.15)',
  },
  simInner: { flex: 1, position: 'relative' },
  simLineH: { position: 'absolute', left: 0, right: 0, top: '50%', height: 1, backgroundColor: 'rgba(0,0,0,0.25)' },
  simLineV: { position: 'absolute', top: 0, bottom: 0, left: '50%', width: 1, backgroundColor: 'rgba(0,0,0,0.25)' },
  simCenter: {
    position: 'absolute', left: '25%', right: '25%',
    top: '25%', bottom: '25%', borderRadius: 2,
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.2)',
  },

  // Progress
  progressSection: { marginTop: 16 },
  progressBarBg: { height: 5, backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: 99, overflow: 'hidden' },
  progressBarFill: {
    height: '100%', backgroundColor: colors.success,
    borderRadius: 99, shadowColor: colors.success,
    shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 6,
  },
  progressMeta: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  progressMetaLeft: { fontSize: 11, color: colors.mutedForeground, fontWeight: '500' },
  progressMetaRight: { fontSize: 11, color: colors.success, fontWeight: '600' },

  // Alert
  alertCard: {
    borderRadius: colors.radius, padding: 14,
    flexDirection: 'row', alignItems: 'center', gap: 12,
    borderWidth: 1,
  },
  alertCardNormal: { backgroundColor: 'rgba(52,216,124,0.06)', borderColor: colors.successBorder },
  alertCardUrgent: { backgroundColor: colors.destructiveDim, borderColor: colors.destructiveBorder },
  alertIconWrap: {
    width: 40, height: 40, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  alertIconWrapNormal: { backgroundColor: 'rgba(52,216,124,0.15)' },
  alertIconWrapUrgent: { backgroundColor: 'rgba(248,113,113,0.15)' },
  alertTitle: { fontWeight: '700', fontSize: 14, color: colors.foreground },
  alertSub: { fontSize: 12, color: colors.mutedForeground, marginTop: 2 },
  payNowBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: colors.success,
    paddingHorizontal: 14, paddingVertical: 9,
    borderRadius: colors.radius,
    shadowColor: colors.success,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4, shadowRadius: 10, elevation: 5,
  },
  payNowText: { color: colors.successForeground, fontWeight: '800', fontSize: 13 },

  // Stats grid
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  statCard: {
    flex: 1, minWidth: '45%',
    backgroundColor: colors.card,
    borderWidth: 1, borderColor: colors.border,
    borderRadius: colors.radiusMd,
    padding: 16, gap: 6,
    ...colors.shadowCard,
  },
  statCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statIconBox: {
    width: 36, height: 36, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  statLabel: { fontSize: 11, color: colors.mutedForeground, fontWeight: '500', letterSpacing: 0.2 },
  statValue: { fontSize: 20, fontWeight: '800', color: colors.foreground, letterSpacing: -0.5 },
  statSub: { fontSize: 11, color: colors.mutedForeground },

  // Chart card
  chartCard: {
    backgroundColor: colors.card,
    borderWidth: 1, borderColor: colors.border,
    borderRadius: colors.radiusMd, padding: 16,
    ...colors.shadowCard,
  },
  chartCardHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 14,
  },
  cardTitle: { fontSize: 15, fontWeight: '700', color: colors.foreground },
  cardSub: { fontSize: 12, color: colors.mutedForeground, marginTop: 2 },
  viewAllBtn: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  viewAllText: { fontSize: 12, color: colors.success, fontWeight: '600' },

  twoCol: { flexDirection: 'row', gap: 10 },

  // Breakdown
  breakdownRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginTop: 8,
  },
  breakdownLeft: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  breakdownDot: { width: 8, height: 8, borderRadius: 2 },
  breakdownLabel: { fontSize: 12, color: colors.mutedForeground, fontWeight: '500' },
  breakdownValue: { fontSize: 12, fontWeight: '700' },

  // Recent payments
  recentRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  recentIconBox: {
    width: 28, height: 28, borderRadius: 8,
    backgroundColor: colors.successDim,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  recentEmi: { fontSize: 12, fontWeight: '700', color: colors.foreground },
  recentDate: { fontSize: 11, color: colors.mutedForeground, marginTop: 1 },
  recentAmount: { fontSize: 13, fontWeight: '700', color: colors.success },
  allHistoryBtn: {
    marginTop: 10, paddingVertical: 9, borderRadius: colors.radius,
    borderWidth: 1, borderColor: colors.border,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4,
    backgroundColor: colors.muted,
  },
  allHistoryText: { fontSize: 12, color: colors.mutedForeground, fontWeight: '600' },
});

export default DashboardPage;
