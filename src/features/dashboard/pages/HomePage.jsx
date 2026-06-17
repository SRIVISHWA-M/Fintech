import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { loanStore } from '../../../store/loanStore';
import { authStore } from '../../../store/authStore';
import colors from '../../../theme/colors';
import { loanService } from '../../../services/loanService';

const fmt = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

const fmtDate = (d) => {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

const HomePage = () => {
  const navigation = useNavigation();
  const [loan, setLoan] = useState(loanStore.getState());
  const [user] = useState(authStore.getState().user);
  const [isLopOpen, setIsLopOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = loanStore.subscribe(setLoan);
    // Fetch latest data on mount
    loanService.getActiveLoan().catch(e => console.log('Loan API unavailable:', e.message));
    return unsubscribe;
  }, []);

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  // Check if they are an existing user with active/outstanding loan
  const isExistingUser = loan && loan.outstanding > 0;

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.userName}>{user?.name?.split(' ')[0]} 👋</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.notifBtn} activeOpacity={0.75}>
            <Ionicons name="notifications-outline" size={22} color={colors.foreground} />
            <View style={styles.notifDot} />
          </TouchableOpacity>
          <View style={styles.avatarBox}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Existing User Section (Next Payment & Pay Now) */}
        {isExistingUser && (
          <View style={styles.activeLoanCard}>
            <View style={styles.activeLoanHeader}>
              <View style={styles.activeLoanBadge}>
                <Ionicons name="shield-checkmark" size={12} color={colors.success} />
                <Text style={styles.activeLoanBadgeText}>Active Loan</Text>
              </View>
              <Text style={styles.activeLoanId}>{loan.id}</Text>
            </View>

            <View style={styles.activeLoanMain}>
              <View>
                <Text style={styles.activeLoanLabel}>Outstanding Balance</Text>
                <Text style={styles.activeLoanVal}>{fmt(loan.outstanding)}</Text>
              </View>
              <View style={styles.dueDivider} />
              <View>
                <Text style={styles.activeLoanLabel}>Next Payment Date</Text>
                <Text style={styles.activeLoanDueDate}>{fmtDate(loan.nextDueDate)}</Text>
                <Text style={styles.activeLoanDueAmount}>EMI: {fmt(loan.nextDueAmount)}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.payNowButton}
              onPress={() => navigation.navigate('Loans')}
              activeOpacity={0.85}
            >
              <Text style={styles.payNowButtonText}>Pay Now</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.successForeground} />
            </TouchableOpacity>
          </View>
        )}

        {/* Profile Re-Verification Banner
        <View style={[styles.verifyCard, { borderColor: colors.destructiveBorder }]}>
          <View style={[styles.verifyIconOuter, { backgroundColor: colors.destructiveDim }]}>
            <Ionicons name="alert-circle-outline" size={24} color={colors.destructive} />
          </View>
          <View style={styles.verifyTextCol}>
            <Text style={styles.verifyTitle}>Re-verify your profile</Text>
            <Text style={styles.verifySub}>Unlock your credit limit in just a few steps</Text>
          </View>
          <TouchableOpacity
            style={styles.verifyBtn}
            onPress={() => navigation.navigate('Profile')}
            activeOpacity={0.85}
          >
            <Text style={styles.verifyBtnText}>Re-verify</Text>
          </TouchableOpacity>
        </View> */}

        {/* Types of Loans Section */}
        <Text style={styles.sectionTitle}>Available Loan Options</Text>

        {/* Personal Loan - Salaried */}
        <View style={[styles.loanCard, { borderLeftColor: '#6ee7b7', borderLeftWidth: 4 }]}>
          <View style={styles.loanCardHeader}>
            <Text style={styles.loanCardTitle}>Personal Loan - Salaried</Text>
            <View style={[styles.loanCardBadge, { backgroundColor: 'rgba(110,231,183,0.12)' }]}>
              <Ionicons name="arrow-up" size={10} color="#6ee7b7" style={{ marginRight: 2 }} />
              <Text style={[styles.loanCardBadgeText, { color: '#6ee7b7' }]}>Higher credit limit</Text>
            </View>
          </View>
          <View style={styles.loanCardBody}>
            <View style={styles.loanIconBox}>
              <Ionicons name="cash-outline" size={28} color="#6ee7b7" />
            </View>
            <View style={styles.loanCardInfo}>
              <Text style={styles.loanLimitLabel}>UP TO</Text>
              <Text style={styles.loanLimitVal}>₹10,000,000</Text>
              <Text style={styles.loanDuration}>60 months</Text>
            </View>
            <TouchableOpacity
              style={styles.applyBtn}
              onPress={() => navigation.navigate('Loans')}
              activeOpacity={0.85}
            >
              <Text style={styles.applyBtnText}>Apply now</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Personal Loan */}
        <View style={[styles.loanCard, { borderLeftColor: '#10b981', borderLeftWidth: 4 }]}>
          <View style={styles.loanCardHeader}>
            <Text style={styles.loanCardTitle}>Personal Loan</Text>
            <View style={[styles.loanCardBadge, { backgroundColor: 'rgba(16,185,129,0.12)' }]}>
              <Ionicons name="flash" size={10} color="#10b981" style={{ marginRight: 2 }} />
              <Text style={[styles.loanCardBadgeText, { color: '#10b981' }]}>Instant transfer</Text>
            </View>
          </View>
          <View style={styles.loanCardBody}>
            <View style={styles.loanIconBox}>
              <Ionicons name="wallet-outline" size={28} color="#10b981" />
            </View>
            <View style={styles.loanCardInfo}>
              <Text style={styles.loanLimitLabel}>UP TO</Text>
              <Text style={styles.loanLimitVal}>₹34,000</Text>
              <Text style={styles.loanDuration}>9 months</Text>
            </View>
            <TouchableOpacity
              style={styles.applyBtn}
              onPress={() => navigation.navigate('Loans')}
              activeOpacity={0.85}
            >
              <Text style={styles.applyBtnText}>Get now</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Business Loan */}
        <View style={[styles.loanCard, { borderLeftColor: '#34d87c', borderLeftWidth: 4 }]}>
          <View style={styles.loanCardHeader}>
            <Text style={styles.loanCardTitle}>Business Loan</Text>
            <View style={[styles.loanCardBadge, { backgroundColor: 'rgba(52,216,124,0.1)' }]}>
              <Ionicons name="trending-up" size={10} color="#15803d" style={{ marginRight: 2 }} />
              <Text style={[styles.loanCardBadgeText, { color: '#34d87c' }]}>For business owners</Text>
            </View>
          </View>
          <View style={styles.loanCardBody}>
            <View style={styles.loanIconBox}>
              <Ionicons name="briefcase-outline" size={28} color="#34d87c" />
            </View>
            <View style={styles.loanCardInfo}>
              <Text style={styles.loanLimitLabel}>UP TO</Text>
              <Text style={styles.loanLimitVal}>₹5,000,000</Text>
              <Text style={styles.loanDuration}>48 months</Text>
            </View>
            <TouchableOpacity
              style={styles.applyBtn}
              onPress={() => navigation.navigate('Loans')}
              activeOpacity={0.85}
            >
              <Text style={styles.applyBtnText}>Apply now</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Loan Against Property (Accordion style) */}
        <TouchableOpacity
          style={[styles.lapCard, { borderLeftColor: '#059669', borderLeftWidth: 4 }]}
          onPress={() => setIsLopOpen(!isLopOpen)}
          activeOpacity={0.9}
        >
          <View style={styles.lapHeader}>
            <View style={styles.lapTitleRow}>
              <Ionicons name="document-text-outline" size={22} color="#059669" style={{ marginRight: 10 }} />
              <Text style={styles.lapTitle}>Loan Against Property</Text>
            </View>
            <View style={styles.lapRight}>
              <Text style={styles.lapLimit}>UP TO <Text style={{ fontWeight: '800', color: colors.foreground }}>₹1 Crore</Text></Text>
              <Ionicons
                name={isLopOpen ? 'chevron-up' : 'chevron-down'}
                size={18}
                color="#059669"
                style={{ marginLeft: 8 }}
              />
            </View>
          </View>

          {isLopOpen && (
            <View style={styles.lapDetails}>
              <Text style={styles.lapDesc}>
                Unlock the value of your property with our low-interest loans. Suitable for funding large business expansions, education, or personal needs.
              </Text>
              <View style={styles.lapMeta}>
                <View>
                  <Text style={styles.lapMetaLabel}>Interest Rate</Text>
                  <Text style={styles.lapMetaVal}>From 8.5% p.a.</Text>
                </View>
                <View>
                  <Text style={styles.lapMetaLabel}>Tenure Options</Text>
                  <Text style={styles.lapMetaVal}>Up to 15 Years</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.lapApplyBtn}
                onPress={() => navigation.navigate('Loans')}
                activeOpacity={0.85}
              >
                <Text style={styles.lapApplyBtnText}>Enquire Now</Text>
              </TouchableOpacity>
            </View>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 110, gap: 16 },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 8,
    paddingTop: Platform.OS === 'ios' ? 4 : 16,
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
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: colors.success,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: colors.success,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  avatarText: { fontSize: 14, fontWeight: '800', color: colors.successForeground },

  // Active Loan Card (Existing User Panel)
  activeLoanCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: 'rgba(52,216,124,0.15)',
    borderRadius: colors.radiusMd,
    padding: 16,
    gap: 14,
    ...colors.shadowCard,
  },
  activeLoanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activeLoanBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.successDim,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  activeLoanBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.success,
  },
  activeLoanId: {
    fontSize: 11,
    color: colors.mutedForeground,
    fontWeight: '600',
  },
  activeLoanMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  dueDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border,
  },
  activeLoanLabel: {
    fontSize: 9,
    color: colors.mutedForeground,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  activeLoanVal: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.foreground,
  },
  activeLoanDueDate: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.foreground,
  },
  activeLoanDueAmount: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.success,
    marginTop: 2,
  },
  payNowButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.success,
    paddingVertical: 12,
    borderRadius: colors.radius,
    gap: 6,
  },
  payNowButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.successForeground,
  },

  // Verification Banner
  verifyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: '#fcd34d',
    borderRadius: colors.radius,
    padding: 14,
    gap: 12,
    ...colors.shadowCard,
  },
  verifyIconOuter: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: 'rgba(245,158,11,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifyTextCol: { flex: 1 },
  verifyTitle: { fontSize: 13, fontWeight: '700', color: colors.foreground },
  verifySub: { fontSize: 11, color: colors.mutedForeground, marginTop: 2 },
  verifyBtn: {
    backgroundColor: colors.success,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: colors.success,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  verifyBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.successForeground,
  },

  // Section title
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.foreground,
    marginTop: 8,
    letterSpacing: -0.3,
  },

  // Loan Cards
  loanCard: {
    backgroundColor: colors.card,
    borderRadius: colors.radius,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 10,
    ...colors.shadowCard,
  },
  loanCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  loanCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.foreground,
  },
  loanCardBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(110,231,183,0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  loanCardBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#6ee7b7',
  },
  loanCardBody: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  loanIconBox: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.03)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loanCardInfo: {
    flex: 1,
    marginLeft: 14,
  },
  loanLimitLabel: {
    fontSize: 8,
    color: colors.mutedForeground,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  loanLimitVal: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.foreground,
  },
  loanDuration: {
    fontSize: 11,
    color: colors.mutedForeground,
    marginTop: 2,
  },
  applyBtn: {
    backgroundColor: colors.success,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 22,
    minWidth: 96,
    alignItems: 'center',
    shadowColor: colors.success,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  applyBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.successForeground,
  },

  // Loan Against Property (Accordion)
  lapCard: {
    backgroundColor: colors.card,
    borderRadius: colors.radius,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    ...colors.shadowCard,
  },
  lapHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lapTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lapTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.foreground,
  },
  lapRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lapLimit: {
    fontSize: 10,
    color: colors.mutedForeground,
    fontWeight: '600',
  },
  lapDetails: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 12,
  },
  lapDesc: {
    fontSize: 11,
    color: colors.mutedForeground,
    lineHeight: 16,
  },
  lapMeta: {
    flexDirection: 'row',
    gap: 24,
  },
  lapMetaLabel: {
    fontSize: 9,
    color: colors.mutedForeground,
    fontWeight: '600',
  },
  lapMetaVal: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.foreground,
    marginTop: 2,
  },
  lapApplyBtn: {
    backgroundColor: colors.success,
    paddingVertical: 10,
    borderRadius: 22,
    alignItems: 'center',
    shadowColor: colors.success,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  lapApplyBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.successForeground,
  },
});

export default HomePage;
