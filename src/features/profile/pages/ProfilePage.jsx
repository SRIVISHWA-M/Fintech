import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, SafeAreaView, Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { authStore } from '../../../store/authStore';
import { loanStore } from '../../../store/loanStore';
import { paymentStore } from '../../../store/paymentStore';
import colors from '../../../theme/colors';

const fmt = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

const ProfilePage = () => {
  const [auth, setAuth]         = useState(authStore.getState());
  const [loan, setLoan]         = useState(loanStore.getState());
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

  const totalPaid  = payments.payments.reduce((s, p) => s + p.amount, 0);
  const progress   = Math.round((loan.paid / loan.principal) * 100);
  const initials   = user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const startEdit = () => { setEditName(user.name); setEditEmail(user.email); setEditMode(true); };
  const saveEdit  = () => { authStore.updateUser({ name: editName, email: editEmail }); setEditMode(false); };
  const handlePrefToggle = (key) => authStore.updatePreferences({ [key]: !user.preferences[key] });

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* ── Profile Hero ────────────────────────────────────────────── */}
        <View style={styles.heroCard}>
          {/* Decorative glow blob */}
          <View style={styles.heroBlobTL} />
          <View style={styles.heroBlobBR} />

          <View style={styles.heroRow}>
            {/* Avatar */}
            <View style={styles.avatarWrap}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{initials}</Text>
              </View>
              <View style={styles.onlineDot} />
            </View>

            {/* Info */}
            <View style={{ flex: 1, minWidth: 0 }}>
              {editMode ? (
                <View style={{ gap: 8 }}>
                  <View style={styles.editInputWrap}>
                    <Ionicons name="person-outline" size={14} color={colors.mutedForeground} />
                    <TextInput
                      style={styles.editInput}
                      value={editName}
                      onChangeText={setEditName}
                      placeholderTextColor={colors.mutedForeground}
                    />
                  </View>
                  <View style={styles.editInputWrap}>
                    <Ionicons name="mail-outline" size={14} color={colors.mutedForeground} />
                    <TextInput
                      style={styles.editInput}
                      value={editEmail}
                      onChangeText={setEditEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      placeholderTextColor={colors.mutedForeground}
                    />
                  </View>
                  <View style={styles.editBtnRow}>
                    <TouchableOpacity style={styles.saveBtn} onPress={saveEdit} activeOpacity={0.85}>
                      <Ionicons name="checkmark" size={14} color={colors.successForeground} />
                      <Text style={styles.saveBtnText}>Save</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cancelBtn} onPress={() => setEditMode(false)} activeOpacity={0.75}>
                      <Text style={styles.cancelBtnText}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <>
                  <View style={styles.nameRow}>
                    <Text style={styles.userName} numberOfLines={1}>{user.name}</Text>
                    {user.kycStatus === 'verified' && (
                      <View style={styles.kycBadge}>
                        <Ionicons name="checkmark-circle" size={11} color={colors.success} />
                        <Text style={styles.kycText}>KYC</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.userEmail}>{user.email}</Text>
                  <Text style={styles.customerId}>ID: {user.customerId}</Text>
                  <TouchableOpacity style={styles.editProfileBtn} onPress={startEdit} activeOpacity={0.75}>
                    <Ionicons name="pencil-outline" size={12} color={colors.mutedForeground} />
                    <Text style={styles.editProfileText}>Edit Profile</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </View>

        {/* ── Loan Statistics ─────────────────────────────────────────── */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="trending-up-outline" size={16} color={colors.success} />
            <Text style={styles.sectionTitle}>Loan Statistics</Text>
          </View>
          <View style={styles.statsGrid}>
            {[
              { label: 'Active Loans', value: String(user.activeLoans), icon: 'layers-outline', color: colors.success },
              { label: 'On-Time Rate', value: `${user.onTimeRate}%`, icon: 'checkmark-circle-outline', color: colors.chartBlue },
              { label: 'Total Paid', value: fmt(totalPaid), icon: 'card-outline', color: colors.chartPurple },
              { label: 'Progress', value: `${progress}%`, icon: 'pie-chart-outline', color: colors.warning },
            ].map(({ label, value, icon, color }) => (
              <View key={label} style={styles.statCell}>
                <View style={[styles.statIconBox, { backgroundColor: `${color}18` }]}>
                  <Ionicons name={icon} size={14} color={color} />
                </View>
                <Text style={styles.statValue}>{value}</Text>
                <Text style={styles.statLabel}>{label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Personal Information ─────────────────────────────────────── */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="person-outline" size={16} color={colors.success} />
            <Text style={styles.sectionTitle}>Personal Information</Text>
          </View>
          {[
            { icon: 'person-outline', label: 'Full Name', value: user.name },
            { icon: 'mail-outline', label: 'Email Address', value: user.email },
            { icon: 'call-outline', label: 'Mobile Number', value: user.phoneMasked },
            { icon: 'shield-checkmark-outline', label: 'KYC Status', value: 'Verified ✓', isStatus: true },
            { icon: 'card-outline', label: 'Customer ID', value: user.customerId },
          ].map(({ icon, label, value, isStatus }, idx, arr) => (
            <View key={label} style={[styles.infoRow, idx < arr.length - 1 && styles.infoRowBorder]}>
              <View style={styles.infoIconBox}>
                <Ionicons name={icon} size={14} color={isStatus ? colors.success : colors.mutedForeground} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.infoLabel}>{label}</Text>
                <Text style={[styles.infoValue, isStatus && { color: colors.success, fontWeight: '700' }]}>{value}</Text>
              </View>
              <Ionicons name="chevron-forward" size={14} color={colors.border} />
            </View>
          ))}
        </View>

        {/* ── Preferences ─────────────────────────────────────────────── */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="settings-outline" size={16} color={colors.success} />
            <Text style={styles.sectionTitle}>Preferences & Alerts</Text>
          </View>
          {[
            { key: 'notifications', icon: 'notifications-outline', label: 'Push Notifications', sub: 'EMI reminders and payment alerts' },
            { key: 'loginAlerts', icon: 'lock-closed-outline', label: 'Login Alerts', sub: 'Get notified on new logins' },
            { key: 'darkMode', icon: 'moon-outline', label: 'Dark Mode', sub: 'Current theme preference' },
          ].map(({ key, icon, label, sub }, idx, arr) => (
            <View key={key} style={[styles.prefRow, idx < arr.length - 1 && styles.prefRowBorder]}>
              <View style={[styles.prefIconBox, user.preferences[key] && styles.prefIconBoxActive]}>
                <Ionicons name={icon} size={15} color={user.preferences[key] ? colors.success : colors.mutedForeground} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.prefLabel}>{label}</Text>
                <Text style={styles.prefSub}>{sub}</Text>
              </View>
              <Switch
                value={user.preferences[key]}
                onValueChange={() => handlePrefToggle(key)}
                trackColor={{ false: colors.mutedAlt, true: colors.success }}
                thumbColor="white"
                ios_backgroundColor={colors.mutedAlt}
              />
            </View>
          ))}
        </View>

        {/* ── Settings Links ───────────────────────────────────────────── */}
        <View style={[styles.card, { padding: 0, overflow: 'hidden' }]}>
          {[
            { icon: 'lock-closed-outline', label: 'Change Password', sub: 'Update your account password', color: colors.chartBlue },
            { icon: 'shield-outline', label: 'Security Settings', sub: '2FA and device management', color: colors.chartPurple },
            { icon: 'card-outline', label: 'Linked Accounts', sub: 'Manage payment methods', color: colors.warning },
          ].map(({ icon, label, sub, color }, idx, arr) => (
            <TouchableOpacity
              key={label}
              style={[styles.settingsRow, idx < arr.length - 1 && styles.settingsRowBorder]}
              activeOpacity={0.75}
            >
              <View style={[styles.settingsIconBox, { backgroundColor: `${color}18` }]}>
                <Ionicons name={icon} size={15} color={color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.settingsLabel}>{label}</Text>
                <Text style={styles.settingsSub}>{sub}</Text>
              </View>
              <View style={styles.settingsChevronBox}>
                <Ionicons name="chevron-forward" size={14} color={colors.mutedForeground} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Sign Out ─────────────────────────────────────────────────── */}
        <TouchableOpacity
          style={styles.signOutBtn}
          onPress={() => authStore.logout()}
          activeOpacity={0.85}
        >
          <Ionicons name="log-out-outline" size={18} color={colors.destructive} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>Nova Finance v1.0.0 · RBI Regulated</Text>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 40, gap: 14 },

  // Hero
  heroCard: {
    backgroundColor: '#0f1820', borderWidth: 1, borderColor: colors.border,
    borderRadius: colors.radiusLg, padding: 20, overflow: 'hidden', ...colors.shadowCard,
  },
  heroBlobTL: {
    position: 'absolute', top: -50, left: -50,
    width: 150, height: 150, borderRadius: 75,
    backgroundColor: 'rgba(52,216,124,0.05)',
  },
  heroBlobBR: {
    position: 'absolute', bottom: -30, right: -30,
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: 'rgba(96,165,250,0.04)',
  },
  heroRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 16, marginBottom: 20 },
  avatarWrap: { position: 'relative', flexShrink: 0 },
  avatar: {
    width: 76, height: 76, borderRadius: 20,
    backgroundColor: colors.success,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: colors.success, shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.45, shadowRadius: 14, elevation: 7,
  },
  avatarText: { fontSize: 24, fontWeight: '900', color: colors.successForeground },
  onlineDot: {
    position: 'absolute', bottom: -2, right: -2,
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: colors.success,
    borderWidth: 2.5, borderColor: '#0f1820',
  },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 3 },
  userName: { fontSize: 19, fontWeight: '800', color: colors.foreground, letterSpacing: -0.4, flex: 1 },
  kycBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: colors.successDim, borderWidth: 1, borderColor: colors.successBorder,
    paddingHorizontal: 7, paddingVertical: 2, borderRadius: colors.radiusFull,
  },
  kycText: { fontSize: 10, color: colors.success, fontWeight: '800' },
  userEmail: { fontSize: 13, color: colors.mutedForeground, marginBottom: 2 },
  customerId: { fontSize: 12, color: colors.mutedForeground },
  editProfileBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    marginTop: 10, paddingVertical: 6, paddingHorizontal: 12,
    borderWidth: 1, borderColor: colors.border, borderRadius: colors.radius,
    alignSelf: 'flex-start', backgroundColor: colors.muted,
  },
  editProfileText: { fontSize: 12, color: colors.mutedForeground, fontWeight: '600' },
  editInputWrap: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: colors.input, borderWidth: 1.5, borderColor: colors.border,
    borderRadius: colors.radius, paddingHorizontal: 12,
  },
  editInput: { flex: 1, padding: 10, color: colors.foreground, fontSize: 14, fontWeight: '600' },
  editBtnRow: { flexDirection: 'row', gap: 8 },
  saveBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: colors.success, borderRadius: colors.radius,
    paddingHorizontal: 18, paddingVertical: 9,
    shadowColor: colors.success, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.35, shadowRadius: 8, elevation: 4,
  },
  saveBtnText: { color: colors.successForeground, fontWeight: '800', fontSize: 13 },
  cancelBtn: { borderWidth: 1, borderColor: colors.border, borderRadius: colors.radius, paddingHorizontal: 16, paddingVertical: 9, backgroundColor: colors.muted },
  cancelBtnText: { color: colors.mutedForeground, fontWeight: '600', fontSize: 13 },



  // Card
  card: {
    backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border,
    borderRadius: colors.radiusMd, padding: 16, ...colors.shadowCard,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: colors.foreground },

  // Stats
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  statCell: {
    flex: 1, minWidth: '45%', backgroundColor: colors.muted,
    borderRadius: colors.radius, padding: 14, gap: 6,
    borderWidth: 1, borderColor: colors.border,
  },
  statIconBox: { width: 32, height: 32, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  statValue: { fontSize: 19, fontWeight: '800', color: colors.foreground, letterSpacing: -0.4 },
  statLabel: { fontSize: 11, color: colors.mutedForeground, fontWeight: '500' },

  // Info rows
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 13 },
  infoRowBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  infoIconBox: { width: 36, height: 36, borderRadius: 10, backgroundColor: colors.muted, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  infoLabel: { fontSize: 11, color: colors.mutedForeground, marginBottom: 2, fontWeight: '500' },
  infoValue: { fontSize: 14, fontWeight: '600', color: colors.foreground },

  // Preferences
  prefRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, gap: 12 },
  prefRowBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  prefIconBox: { width: 38, height: 38, borderRadius: 11, backgroundColor: colors.muted, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  prefIconBoxActive: { backgroundColor: colors.successDim },
  prefLabel: { fontSize: 14, fontWeight: '600', color: colors.foreground },
  prefSub: { fontSize: 12, color: colors.mutedForeground, marginTop: 2 },

  // Settings
  settingsRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16 },
  settingsRowBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  settingsIconBox: { width: 38, height: 38, borderRadius: 11, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  settingsLabel: { fontSize: 14, fontWeight: '600', color: colors.foreground },
  settingsSub: { fontSize: 12, color: colors.mutedForeground, marginTop: 2 },
  settingsChevronBox: {
    width: 28, height: 28, borderRadius: 8,
    backgroundColor: colors.muted, borderWidth: 1, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
  },

  // Sign out
  signOutBtn: {
    backgroundColor: colors.destructiveDim,
    borderWidth: 1, borderColor: colors.destructiveBorder,
    borderRadius: colors.radiusMd, padding: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  signOutText: { fontSize: 15, fontWeight: '800', color: colors.destructive },

  versionText: { textAlign: 'center', fontSize: 11, color: colors.mutedForeground },
});

export default ProfilePage;
