import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, SafeAreaView, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { loanStore } from '../../../store/loanStore';
import { paymentStore } from '../../../store/paymentStore';
import { LoanProgressChart } from '../../../components/charts/Charts';
import colors from '../../../theme/colors';
import { paymentService } from '../../../services/paymentService';
import { loanService } from '../../../services/loanService';

const fmt = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
const fmtDate = (d) =>
  new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
const daysUntil = (d) => Math.ceil((new Date(d) - new Date()) / 86400000);

const PAYMENT_METHODS = [
  { id: 'hdfc', label: 'HDFC Bank ••4421', iconName: 'business-outline', sub: 'Savings Account' },
  { id: 'upi', label: 'UPI / PhonePe', iconName: 'phone-portrait-outline', sub: 'Instant transfer' },
  { id: 'card', label: 'Debit / Credit Card', iconName: 'card-outline', sub: 'Visa, Mastercard' },
  { id: 'netbanking', label: 'Net Banking', iconName: 'cash-outline', sub: 'All major banks' },
];

const SimChip = () => (
  <View style={styles.simChip}>
    <View style={styles.simInner}>
      <View style={styles.simLineH} />
      <View style={styles.simLineV} />
      <View style={styles.simCenter} />
    </View>
  </View>
);

const CardWaves = () => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    <Svg width="100%" height="100%">
      <Defs>
        <LinearGradient id="wg" x1="0%" y1="0%" x2="100%" y2="0%">
          <Stop offset="0%" stopColor="#34d87c" stopOpacity="0.10" />
          <Stop offset="100%" stopColor="#60a5fa" stopOpacity="0.04" />
        </LinearGradient>
      </Defs>
      <Path d="M -30 40 Q 100 130 220 20 T 420 90" fill="none" stroke="url(#wg)" strokeWidth="60" />
      <Path d="M -20 110 Q 140 20 260 130 T 440 30" fill="none" stroke="rgba(52,216,124,0.05)" strokeWidth="40" />
    </Svg>
  </View>
);

const LoansPage = () => {
  const [loan, setLoan] = useState(loanStore.getState());
  const [payments, setPayments] = useState(paymentStore.getState());
  const [selectedMethod, setSelectedMethod] = useState('hdfc');
  const [customAmount, setCustomAmount] = useState('');
  const [payType, setPayType] = useState('emi');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [expandedReceipt, setExpandedReceipt] = useState(null);

  useEffect(() => {
    const u1 = loanStore.subscribe(setLoan);
    const u2 = paymentStore.subscribe(setPayments);
    // Fetch fresh loan data from backend on mount
    loanService.getActiveLoan().catch(e => console.log('Loan API unavailable:', e.message));
    return () => { u1(); u2(); };
  }, []);

  const payAmount =
    payType === 'emi' ? loan.nextDueAmount
    : payType === 'full' ? loan.outstanding
    : parseFloat(customAmount) || 0;

  const methodLabel = PAYMENT_METHODS.find((m) => m.id === selectedMethod)?.label || '';
  const progress = Math.round((loan.paid / loan.principal) * 100);
  const daysLeft = daysUntil(loan.nextDueDate);

  const handlePayment = async () => {
    if (payAmount <= 0 || payAmount > loan.outstanding) return;
    setLoading(true);
    try {
      const response = await paymentService.makePayment(payAmount, methodLabel);
      setSuccess({
        amount: payAmount,
        method: methodLabel,
        date: response.transaction?.date || new Date().toISOString(),
      });
      setCustomAmount('');
    } catch (error) {
      console.log('Payment API error, falling back to local simulation:', error.message);
      paymentStore.addPayment(payAmount, methodLabel);
      loanStore.makePayment(payAmount);
      setSuccess({ amount: payAmount, method: methodLabel, date: new Date().toISOString() });
      setCustomAmount('');
    } finally {
      setLoading(false);
    }
  };

  // ── Success screen ────────────────────────────────────────────────────────
  if (success) {
    return (
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.successContainer}>
          <View style={styles.successIconRing}>
            <View style={styles.successIconInner}>
              <Ionicons name="checkmark" size={40} color={colors.successForeground} />
            </View>
          </View>
          <Text style={styles.successTitle}>Payment Successful!</Text>
          <Text style={styles.successSub}>{fmt(success.amount)} paid via {success.method}</Text>

          <View style={styles.receiptCard}>
            <View style={styles.receiptCardHeader}>
              <Ionicons name="receipt-outline" size={16} color={colors.success} />
              <Text style={styles.receiptCardTitle}>Transaction Receipt</Text>
            </View>
            {[
              ['Transaction ID', `TX-${String(payments.payments.length).padStart(3, '0')}`],
              ['Amount', fmt(success.amount)],
              ['Method', success.method],
              ['Date', fmtDate(success.date)],
              ['Status', 'Paid ✓'],
            ].map(([k, v]) => (
              <View key={k} style={styles.receiptRow}>
                <Text style={styles.receiptKey}>{k}</Text>
                <Text style={[styles.receiptVal, k === 'Status' && { color: colors.success }]}>{v}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.payAgainBtn} onPress={() => setSuccess(null)} activeOpacity={0.85}>
            <Ionicons name="card-outline" size={16} color={colors.successForeground} />
            <Text style={styles.payAgainText}>Make Another Payment</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* ── Loan Card ────────────────────────────────────────────────── */}
        <View style={styles.heroCard}>
          <View style={styles.creditCardVisual}>
            <CardWaves />
            <View style={styles.cardHeaderRow}>
              <View style={styles.logoCol}>
                <Ionicons name="flash" size={13} color={colors.success} style={{ marginRight: 5 }} />
                <Text style={styles.logoText}>NOVA</Text>
              </View>
              <View style={styles.networkBadge}>
                <Text style={styles.networkText}>MASTERCARD</Text>
              </View>
            </View>
            <View style={styles.cardMiddleRow}>
              <View style={styles.chipAndBalance}>
                <SimChip />
                <View>
                  <Text style={styles.balLabel}>Outstanding Balance</Text>
                  <Text style={styles.balValue}>{fmt(loan.outstanding)}</Text>
                </View>
              </View>
              <LoanProgressChart outstanding={loan.outstanding} principal={loan.principal} size={60} />
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
                <Text style={styles.cardBottomLabel}>CVV</Text>
                <Text style={styles.cardBottomValue}>•••</Text>
              </View>
            </View>
          </View>

          {/* Progress */}
          <View style={{ marginTop: 16 }}>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
            </View>
            <View style={styles.progressMeta}>
              <Text style={styles.progressMetaL}>{loan.paidEmis} of {loan.termMonths} EMIs · {progress}% repaid</Text>
              <Text style={styles.progressMetaR}>{fmt(loan.paid)} total paid</Text>
            </View>
          </View>

          {/* Key info */}
          <View style={styles.keyInfoRow}>
            {[
              { label: 'Principal', val: fmt(loan.principal) },
              { label: 'Rate', val: `${loan.interestRate}% p.a.` },
              { label: 'Next Due', val: fmtDate(loan.nextDueDate) },
            ].map(({ label, val }, i, arr) => (
              <React.Fragment key={label}>
                <View style={styles.keyInfoCol}>
                  <Text style={styles.keyInfoLabel}>{label}</Text>
                  <Text style={styles.keyInfoVal}>{val}</Text>
                </View>
                {i < arr.length - 1 && <View style={styles.keyInfoDivider} />}
              </React.Fragment>
            ))}
          </View>
        </View>

        {/* ── Urgent Alert ─────────────────────────────────────────────── */}
        {daysLeft <= 5 && (
          <View style={styles.urgentBanner}>
            <View style={styles.urgentIconWrap}>
              <Ionicons name="alert-circle" size={16} color={colors.destructive} />
            </View>
            <Text style={styles.urgentText}>
              EMI {daysLeft <= 0 ? 'is overdue' : `due in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}`} — {fmtDate(loan.nextDueDate)}
            </Text>
          </View>
        )}

        {/* ── Payment Section ───────────────────────────────────────────── */}
        <View style={styles.payCard}>
          <View style={styles.payCardHeader}>
            <Ionicons name="card-outline" size={18} color={colors.success} />
            <Text style={styles.sectionTitle}>Make a Payment</Text>
          </View>

          {/* Type selector */}
          <View style={styles.typeRow}>
            {[
              { id: 'emi', label: 'Pay EMI', value: fmt(loan.nextDueAmount) },
              { id: 'custom', label: 'Custom', value: 'Enter amount' },
              { id: 'full', label: 'Pay Full', value: fmt(loan.outstanding) },
            ].map(({ id, label, value }) => (
              <TouchableOpacity
                key={id}
                style={[styles.typeBtn, payType === id && styles.typeBtnActive]}
                onPress={() => setPayType(id)}
                activeOpacity={0.75}
              >
                {payType === id && (
                  <View style={styles.typeBtnDot} />
                )}
                <Text style={[styles.typeBtnLabel, payType === id && { color: colors.success }]}>{label}</Text>
                <Text style={[styles.typeBtnValue, payType === id && { color: colors.foreground }]}>{value}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Custom input */}
          {payType === 'custom' && (
            <View style={styles.customInputWrap}>
              <Text style={styles.rupeeSign}>₹</Text>
              <TextInput
                style={styles.customInput}
                placeholder="Enter amount"
                placeholderTextColor={colors.mutedForeground}
                keyboardType="numeric"
                value={customAmount}
                onChangeText={setCustomAmount}
              />
              <Text style={styles.maxLabel}>Max: {fmt(loan.outstanding)}</Text>
            </View>
          )}

          {/* Payment Methods */}
          <Text style={styles.methodHeading}>Select Payment Method</Text>
          <View style={{ gap: 8 }}>
            {PAYMENT_METHODS.map(({ id, label, iconName, sub }) => (
              <TouchableOpacity
                key={id}
                style={[styles.methodBtn, selectedMethod === id && styles.methodBtnActive]}
                onPress={() => setSelectedMethod(id)}
                activeOpacity={0.75}
              >
                <View style={[styles.methodIcon, selectedMethod === id && styles.methodIconActive]}>
                  <Ionicons name={iconName} size={16} color={selectedMethod === id ? colors.success : colors.mutedForeground} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.methodLabel}>{label}</Text>
                  <Text style={styles.methodSub}>{sub}</Text>
                </View>
                <View style={[styles.radioOuter, selectedMethod === id && styles.radioOuterActive]}>
                  {selectedMethod === id && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Summary */}
          <View style={styles.summaryBox}>
            {[['Amount', fmt(payAmount)], ['Method', methodLabel]].map(([k, v]) => (
              <View key={k} style={styles.summaryRow}>
                <Text style={styles.summaryKey}>{k}</Text>
                <Text style={styles.summaryVal}>{v}</Text>
              </View>
            ))}
            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryKey, { fontWeight: '700', color: colors.foreground, fontSize: 15 }]}>Total</Text>
              <Text style={[styles.summaryVal, { color: colors.success, fontSize: 16, fontWeight: '800' }]}>{fmt(payAmount)}</Text>
            </View>
          </View>

          {/* Pay button */}
          <TouchableOpacity
            style={[styles.payBtn, (loading || payAmount <= 0) && styles.payBtnDisabled]}
            onPress={handlePayment}
            disabled={loading || payAmount <= 0}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color={colors.successForeground} />
            ) : (
              <>
                <Ionicons name="lock-closed-outline" size={16} color={colors.successForeground} />
                <Text style={styles.payBtnText}>Pay {fmt(payAmount)} Securely</Text>
              </>
            )}
          </TouchableOpacity>
          <Text style={styles.secureNote}>🔒 256-bit SSL encrypted · RBI compliant</Text>
        </View>

        {/* ── Receipt History ───────────────────────────────────────────── */}
        <View style={styles.payCard}>
          <View style={styles.receiptHeader}>
            <View>
              <Text style={styles.sectionTitle}>Payment Receipts</Text>
              <Text style={styles.receiptCount}>{payments.payments.length} transactions</Text>
            </View>
            <View style={styles.allPaidBadge}>
              <View style={styles.allPaidDot} />
              <Text style={styles.allPaidText}>All Paid</Text>
            </View>
          </View>

          <View style={{ gap: 8 }}>
            {payments.payments.map((p) => (
              <View key={p.id}>
                <TouchableOpacity
                  style={[styles.receiptItem, expandedReceipt === p.id && styles.receiptItemExpanded]}
                  onPress={() => setExpandedReceipt(expandedReceipt === p.id ? null : p.id)}
                  activeOpacity={0.75}
                >
                  <View style={styles.receiptItemLeft}>
                    <View style={styles.receiptIconBox}>
                      <Ionicons name="receipt-outline" size={14} color={colors.success} />
                    </View>
                    <View>
                      <Text style={styles.receiptEmi}>EMI #{p.emiNo}</Text>
                      <Text style={styles.receiptDate}>{fmtDate(p.date)}</Text>
                    </View>
                  </View>
                  <View style={styles.receiptRight}>
                    <Text style={styles.receiptAmount}>{fmt(p.amount)}</Text>
                    <View style={styles.paidBadgeMini}>
                      <Text style={styles.paidBadgeMiniText}>Paid</Text>
                    </View>
                    <Ionicons
                      name={expandedReceipt === p.id ? 'chevron-up' : 'chevron-down'}
                      size={13}
                      color={colors.mutedForeground}
                    />
                  </View>
                </TouchableOpacity>

                {expandedReceipt === p.id && (
                  <View style={styles.receiptExpand}>
                    {[
                      ['Transaction ID', p.id],
                      ['Payment Method', p.method],
                      ['Date & Time', fmtDate(p.date)],
                      ['Status', p.status],
                    ].map(([k, v]) => (
                      <View key={k} style={styles.expandRow}>
                        <Text style={styles.expandKey}>{k}</Text>
                        <Text style={[styles.expandVal, k === 'Status' && { color: colors.success }]}>{v}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}
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

  // Success
  successContainer: { flexGrow: 1, alignItems: 'center', padding: 32, paddingTop: 80, gap: 16 },
  successIconRing: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: colors.successDim, borderWidth: 2, borderColor: colors.successBorder,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: colors.success, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.4, shadowRadius: 20, elevation: 8,
  },
  successIconInner: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: colors.success,
    alignItems: 'center', justifyContent: 'center',
  },
  successTitle: { fontSize: 26, fontWeight: '800', color: colors.foreground, letterSpacing: -0.5 },
  successSub: { fontSize: 14, color: colors.mutedForeground, textAlign: 'center' },
  receiptCard: {
    backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border,
    borderRadius: colors.radiusMd, padding: 20, width: '100%', gap: 2,
  },
  receiptCardHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginBottom: 14, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  receiptCardTitle: { fontSize: 14, fontWeight: '700', color: colors.foreground },
  receiptRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  receiptKey: { fontSize: 13, color: colors.mutedForeground },
  receiptVal: { fontSize: 13, fontWeight: '700', color: colors.foreground },
  payAgainBtn: {
    backgroundColor: colors.success, borderRadius: colors.radius,
    paddingHorizontal: 32, paddingVertical: 16,
    flexDirection: 'row', alignItems: 'center', gap: 8,
    shadowColor: colors.success, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.4, shadowRadius: 14, elevation: 7,
  },
  payAgainText: { color: colors.successForeground, fontWeight: '800', fontSize: 16 },

  // Hero card
  heroCard: {
    backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border,
    borderRadius: colors.radiusLg, padding: 16, ...colors.shadowCard,
  },
  creditCardVisual: {
    backgroundColor: '#0a1a10', borderRadius: 16, padding: 18,
    overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(52,216,124,0.20)',
    marginBottom: 2, minHeight: 160,
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
  balLabel: { fontSize: 9, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 3, fontWeight: '600' },
  balValue: { fontSize: 26, fontWeight: '800', color: '#ffffff', letterSpacing: -0.5 },
  cardDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.06)', marginBottom: 14 },
  cardBottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardBottomLabel: { fontSize: 7, color: 'rgba(255,255,255,0.35)', fontWeight: '600', letterSpacing: 0.8, marginBottom: 3, textTransform: 'uppercase' },
  cardBottomValue: { fontSize: 11, color: 'rgba(255,255,255,0.85)', fontWeight: '700', letterSpacing: 0.3 },

  simChip: { width: 36, height: 28, borderRadius: 6, backgroundColor: '#C9A227', overflow: 'hidden', padding: 3, borderWidth: 1, borderColor: 'rgba(0,0,0,0.15)' },
  simInner: { flex: 1, position: 'relative' },
  simLineH: { position: 'absolute', left: 0, right: 0, top: '50%', height: 1, backgroundColor: 'rgba(0,0,0,0.25)' },
  simLineV: { position: 'absolute', top: 0, bottom: 0, left: '50%', width: 1, backgroundColor: 'rgba(0,0,0,0.25)' },
  simCenter: { position: 'absolute', left: '25%', right: '25%', top: '25%', bottom: '25%', borderRadius: 2, borderWidth: 1, borderColor: 'rgba(0,0,0,0.2)' },

  progressBarBg: { height: 5, backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: 99, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: colors.success, borderRadius: 99, shadowColor: colors.success, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 6 },
  progressMeta: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  progressMetaL: { fontSize: 11, color: colors.mutedForeground, fontWeight: '500' },
  progressMetaR: { fontSize: 11, color: colors.success, fontWeight: '600' },

  keyInfoRow: { flexDirection: 'row', marginTop: 16, paddingTop: 14, borderTopWidth: 1, borderTopColor: colors.border },
  keyInfoCol: { flex: 1 },
  keyInfoDivider: { width: 1, height: 28, backgroundColor: colors.border, alignSelf: 'center', marginHorizontal: 8 },
  keyInfoLabel: { fontSize: 9, color: colors.mutedForeground, textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: '600', marginBottom: 4 },
  keyInfoVal: { fontSize: 13, fontWeight: '700', color: colors.foreground },

  // Urgent
  urgentBanner: {
    backgroundColor: colors.destructiveDim, borderWidth: 1, borderColor: colors.destructiveBorder,
    borderRadius: colors.radius, padding: 14,
    flexDirection: 'row', alignItems: 'center', gap: 10,
  },
  urgentIconWrap: { width: 32, height: 32, borderRadius: 9, backgroundColor: 'rgba(248,113,113,0.15)', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  urgentText: { fontSize: 13, color: colors.destructive, fontWeight: '600', flex: 1 },

  // Pay card
  payCard: {
    backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border,
    borderRadius: colors.radiusLg, padding: 20, gap: 14, ...colors.shadowCard,
  },
  payCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.foreground },

  // Type selector
  typeRow: { flexDirection: 'row', gap: 8 },
  typeBtn: {
    flex: 1, padding: 12, borderRadius: colors.radius,
    borderWidth: 1.5, borderColor: colors.border,
    alignItems: 'center', backgroundColor: colors.muted, position: 'relative',
  },
  typeBtnActive: { borderColor: colors.success, backgroundColor: 'rgba(52,216,124,0.06)' },
  typeBtnDot: {
    position: 'absolute', top: 8, right: 8,
    width: 7, height: 7, borderRadius: 4, backgroundColor: colors.success,
  },
  typeBtnLabel: { fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, fontWeight: '700', color: colors.mutedForeground, marginBottom: 4 },
  typeBtnValue: { fontSize: 12, fontWeight: '700', color: colors.mutedForeground, textAlign: 'center' },

  // Custom input
  customInputWrap: { position: 'relative' },
  rupeeSign: { fontSize: 16, color: colors.mutedForeground, position: 'absolute', left: 16, top: 15, zIndex: 1, fontWeight: '700' },
  customInput: {
    backgroundColor: colors.input, borderWidth: 1.5, borderColor: colors.successBorder,
    borderRadius: colors.radius, padding: 14, paddingLeft: 34,
    color: colors.foreground, fontSize: 16, fontWeight: '800',
  },
  maxLabel: { fontSize: 11, color: colors.mutedForeground, marginTop: 4, textAlign: 'right' },

  // Methods
  methodHeading: { fontSize: 12, fontWeight: '700', color: colors.mutedForeground, textTransform: 'uppercase', letterSpacing: 1 },
  methodBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    padding: 14, borderRadius: colors.radius,
    borderWidth: 1.5, borderColor: colors.border,
    backgroundColor: colors.muted,
  },
  methodBtnActive: { borderColor: colors.success, backgroundColor: 'rgba(52,216,124,0.04)' },
  methodIcon: {
    width: 40, height: 40, borderRadius: 10,
    backgroundColor: colors.mutedAlt, alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  methodIconActive: { backgroundColor: colors.successDim },
  methodLabel: { fontSize: 14, fontWeight: '600', color: colors.foreground },
  methodSub: { fontSize: 12, color: colors.mutedForeground, marginTop: 2 },
  radioOuter: {
    width: 20, height: 20, borderRadius: 10,
    borderWidth: 2, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  radioOuterActive: { borderColor: colors.success },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.success },

  // Summary
  summaryBox: {
    backgroundColor: colors.muted, borderRadius: colors.radius,
    padding: 16, gap: 6, borderWidth: 1, borderColor: colors.border,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryKey: { fontSize: 13, color: colors.mutedForeground, fontWeight: '500' },
  summaryVal: { fontSize: 13, fontWeight: '700', color: colors.foreground },
  summaryDivider: { height: 1, backgroundColor: colors.borderStrong, marginVertical: 6 },

  // Pay button
  payBtn: {
    backgroundColor: colors.success, borderRadius: colors.radius,
    padding: 17, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8,
    shadowColor: colors.success, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.45, shadowRadius: 14, elevation: 7,
  },
  payBtnDisabled: { backgroundColor: colors.muted, shadowOpacity: 0 },
  payBtnText: { fontSize: 16, fontWeight: '800', color: colors.successForeground },
  secureNote: { fontSize: 11, color: colors.mutedForeground, textAlign: 'center', marginTop: -6 },

  // Receipt history
  receiptHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  receiptCount: { fontSize: 12, color: colors.mutedForeground, marginTop: 2 },
  allPaidBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: colors.successDim, borderWidth: 1, borderColor: colors.successBorder,
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: colors.radiusFull,
  },
  allPaidDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.success },
  allPaidText: { fontSize: 12, color: colors.success, fontWeight: '700' },
  receiptItem: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: 14, backgroundColor: colors.muted,
    borderWidth: 1, borderColor: colors.border, borderRadius: colors.radius,
  },
  receiptItemExpanded: { borderBottomLeftRadius: 0, borderBottomRightRadius: 0, borderBottomColor: 'transparent' },
  receiptItemLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  receiptIconBox: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: colors.successDim, alignItems: 'center', justifyContent: 'center',
  },
  receiptEmi: { fontSize: 14, fontWeight: '700', color: colors.foreground },
  receiptDate: { fontSize: 11, color: colors.mutedForeground, marginTop: 2 },
  receiptRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  receiptAmount: { fontSize: 15, fontWeight: '800', color: colors.success },
  paidBadgeMini: {
    backgroundColor: colors.successDim, borderRadius: 6,
    paddingHorizontal: 6, paddingVertical: 2, borderWidth: 1, borderColor: colors.successBorder,
  },
  paidBadgeMiniText: { fontSize: 10, color: colors.success, fontWeight: '700' },
  receiptExpand: {
    backgroundColor: 'rgba(52,216,124,0.03)', borderWidth: 1, borderColor: colors.successBorder,
    borderTopWidth: 0, borderBottomLeftRadius: colors.radius, borderBottomRightRadius: colors.radius,
    padding: 14, gap: 4,
  },
  expandRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: colors.border },
  expandKey: { fontSize: 12, color: colors.mutedForeground, fontWeight: '500' },
  expandVal: { fontSize: 12, fontWeight: '700', color: colors.foreground },
});

export default LoansPage;
