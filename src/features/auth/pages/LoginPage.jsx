import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Defs, RadialGradient, Stop, Ellipse } from 'react-native-svg';
import { authStore } from '../../../store/authStore';
import colors from '../../../theme/colors';
import { authService } from '../../../services/authService';

const DEMO_USERS = [
  {
    email: 'aarav.shah@example.com',
    password: 'password123',
    user: null,
  },
  {
    email: 'superadmin@novafinance.com',
    password: 'superadmin123',
    user: {
      id: 'super-admin',
      name: 'Super Admin',
      email: 'superadmin@novafinance.com',
      role: 'superadmin',
    },
  },
];

const DASHBOARD_METRICS = [
  { label: 'Active loans', value: '1,284', icon: 'layers-outline', color: colors.success },
  { label: 'On-time rate', value: '98.4%', icon: 'checkmark-circle-outline', color: colors.chartBlue },
  { label: 'Collections', value: '42L', icon: 'wallet-outline', color: colors.warning },
  { label: 'Risk alerts', value: '18', icon: 'shield-outline', color: colors.chartPurple },
];

const SECURITY_ITEMS = [
  { icon: 'shield-outline', text: '256-bit SSL' },
  { icon: 'finger-print-outline', text: 'Biometric' },
  { icon: 'lock-closed-outline', text: 'Encrypted' },
];

const BgGlow = () => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
      <Defs>
        <RadialGradient id="glow" cx="50%" cy="30%" r="60%">
          <Stop offset="0%" stopColor="#34d87c" stopOpacity="0.07" />
          <Stop offset="100%" stopColor="#080c12" stopOpacity="0" />
        </RadialGradient>
      </Defs>
      <Ellipse cx="50%" cy="30%" rx="60%" ry="50%" fill="url(#glow)" />
    </Svg>
  </View>
);

const DesktopPanel = () => (
  <View style={styles.desktopPanel}>
    <View style={styles.desktopBrandRow}>
      <View style={styles.desktopBrandIcon}>
        <Ionicons name="flash" size={20} color={colors.successForeground} />
      </View>
      <View>
        <Text style={styles.desktopBrandName}>Nova Finance</Text>
        <Text style={styles.desktopBrandSub}>Secure loan operations</Text>
      </View>
    </View>

    <View style={styles.desktopMetricGrid}>
      {DASHBOARD_METRICS.map(({ label, value, icon, color }) => (
        <View key={label} style={styles.desktopMetric}>
          <View style={[styles.desktopMetricIcon, { backgroundColor: `${color}18` }]}>
            <Ionicons name={icon} size={16} color={color} />
          </View>
          <Text style={styles.desktopMetricValue}>{value}</Text>
          <Text style={styles.desktopMetricLabel}>{label}</Text>
        </View>
      ))}
    </View>

    <View style={styles.desktopActivity}>
      <View style={styles.activityHeader}>
        <Text style={styles.activityTitle}>Live access</Text>
        <View style={styles.activityPulse} />
      </View>
      {['User workspace available', 'Super admin route protected', 'Session tokens encrypted'].map((item) => (
        <View key={item} style={styles.activityRow}>
          <Ionicons name="checkmark-circle" size={15} color={colors.success} />
          <Text style={styles.activityText}>{item}</Text>
        </View>
      ))}
    </View>
  </View>
);

const LoginPage = () => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;
  const [email, setEmail] = useState('aarav.shah@example.com');
  const [password, setPassword] = useState('password123');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [pwFocused, setPwFocused] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await authService.login(email, password);
    } catch (error) {
      const demoUser = DEMO_USERS.find(
        (item) =>
          item.email.toLowerCase() === email.trim().toLowerCase() &&
          item.password === password
      );

      if (!demoUser) {
        Alert.alert('Login failed', 'Incorrect email or password.');
        return;
      }

      console.log('Login API error, using local demo credentials:', error.message);
      if (demoUser.user) {
        authStore.setUser(demoUser.user);
      } else {
        authStore.login();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <BgGlow />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboard}
      >
        <ScrollView
          contentContainerStyle={[styles.scroll, isDesktop && styles.scrollDesktop]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.shell, isDesktop && styles.shellDesktop]}>
            {isDesktop && <DesktopPanel />}

            <View style={[styles.formColumn, isDesktop && styles.formColumnDesktop]}>
              <View style={[styles.logoArea, isDesktop && styles.logoAreaDesktop]}>
                <View style={styles.logoIconWrap}>
                  <View style={styles.logoIcon}>
                    <Ionicons name="flash" size={22} color={colors.successForeground} />
                  </View>
                  <View style={styles.logoGlow} />
                </View>
                <Text style={styles.logoText}>Nova Finance</Text>
                <View style={styles.logoBadge}>
                  <View style={styles.logoBadgeDot} />
                  <Text style={styles.logoBadgeText}>Secure Banking</Text>
                </View>
              </View>

              <Text style={[styles.heading, isDesktop && styles.headingDesktop]}>Welcome back</Text>
              <Text style={[styles.subheading, isDesktop && styles.subheadingDesktop]}>
                Sign in to manage your loan account
              </Text>

              <View style={[styles.formCard, isDesktop && styles.formCardDesktop]}>
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Email address</Text>
                  <View style={[styles.inputWrapper, emailFocused && styles.inputWrapperFocused]}>
                    <Ionicons
                      name="mail-outline"
                      size={17}
                      color={emailFocused ? colors.success : colors.mutedForeground}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      placeholderTextColor={colors.mutedForeground}
                      onFocus={() => setEmailFocused(true)}
                      onBlur={() => setEmailFocused(false)}
                    />
                  </View>
                </View>

                <View style={styles.fieldGroup}>
                  <View style={styles.labelRow}>
                    <Text style={styles.label}>Password</Text>
                    <TouchableOpacity>
                      <Text style={styles.forgotText}>Forgot password?</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={[styles.inputWrapper, pwFocused && styles.inputWrapperFocused]}>
                    <Ionicons
                      name="lock-closed-outline"
                      size={17}
                      color={pwFocused ? colors.success : colors.mutedForeground}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={[styles.input, styles.passwordInput]}
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPw}
                      placeholderTextColor={colors.mutedForeground}
                      onFocus={() => setPwFocused(true)}
                      onBlur={() => setPwFocused(false)}
                    />
                    <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPw((s) => !s)}>
                      <Ionicons
                        name={showPw ? 'eye-off-outline' : 'eye-outline'}
                        size={18}
                        color={colors.mutedForeground}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <TouchableOpacity
                  style={[styles.signInBtn, loading && styles.signInBtnDisabled]}
                  onPress={handleLogin}
                  disabled={loading}
                  activeOpacity={0.85}
                >
                  {loading ? (
                    <ActivityIndicator color={colors.successForeground} />
                  ) : (
                    <>
                      <Text style={styles.signInText}>Sign in</Text>
                      <Ionicons name="arrow-forward" size={16} color={colors.successForeground} />
                    </>
                  )}
                </TouchableOpacity>
              </View>

              <View style={[styles.demoCard, isDesktop && styles.demoCardDesktop]}>
                <View style={styles.demoIconWrap}>
                  <Ionicons name="shield-checkmark" size={15} color={colors.success} />
                </View>
                <Text style={styles.demoText}>
                  <Text style={styles.demoTextStrong}>Demo mode</Text>
                  {' - use the pre-filled user account or sign in as superadmin@novafinance.com.'}
                </Text>
              </View>

              <View style={[styles.securityStrip, isDesktop && styles.securityStripDesktop]}>
                {SECURITY_ITEMS.map(({ icon, text }) => (
                  <View key={text} style={styles.securityItem}>
                    <Ionicons name={icon} size={13} color={colors.mutedForeground} />
                    <Text style={styles.securityText}>{text}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  keyboard: { flex: 1 },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    paddingTop: 40,
    paddingBottom: 40,
  },
  scrollDesktop: {
    minHeight: 680,
    paddingHorizontal: 48,
    paddingVertical: 32,
  },
  shell: {
    width: '100%',
    alignSelf: 'center',
  },
  shellDesktop: {
    maxWidth: 1180,
    minHeight: 680,
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'center',
    gap: 28,
  },
  formColumn: {
    width: '100%',
  },
  formColumnDesktop: {
    width: 430,
    flexShrink: 0,
    justifyContent: 'center',
  },

  desktopPanel: {
    flex: 1,
    minWidth: 0,
    borderRadius: colors.radiusLg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#0d131b',
    padding: 28,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.28,
    shadowRadius: 24,
  },
  desktopBrandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  desktopBrandIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  desktopBrandName: {
    color: colors.foreground,
    fontSize: 18,
    fontWeight: '800',
  },
  desktopBrandSub: {
    color: colors.mutedForeground,
    fontSize: 12,
    marginTop: 3,
    fontWeight: '600',
  },
  desktopMetricGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginVertical: 32,
  },
  desktopMetric: {
    flexBasis: '48%',
    minWidth: 180,
    borderRadius: colors.radius,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    padding: 16,
  },
  desktopMetricIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  desktopMetricValue: {
    color: colors.foreground,
    fontSize: 25,
    fontWeight: '800',
  },
  desktopMetricLabel: {
    color: colors.mutedForeground,
    fontSize: 12,
    marginTop: 4,
    fontWeight: '600',
  },
  desktopActivity: {
    borderRadius: colors.radius,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.muted,
    padding: 18,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  activityTitle: {
    color: colors.foreground,
    fontSize: 14,
    fontWeight: '800',
  },
  activityPulse: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: colors.success,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    paddingVertical: 7,
  },
  activityText: {
    color: colors.foregroundSecondary,
    fontSize: 13,
    fontWeight: '600',
  },

  logoArea: { alignItems: 'center', marginBottom: 36 },
  logoAreaDesktop: { marginBottom: 28 },
  logoIconWrap: { position: 'relative', marginBottom: 12 },
  logoIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.success,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  logoGlow: {
    position: 'absolute',
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    borderRadius: 30,
    backgroundColor: 'rgba(52,216,124,0.06)',
  },
  logoText: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.foreground,
    marginBottom: 8,
  },
  logoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.successDim,
    borderWidth: 1,
    borderColor: colors.successBorder,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: colors.radiusFull,
  },
  logoBadgeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.success },
  logoBadgeText: {
    fontSize: 11,
    color: colors.success,
    fontWeight: '600',
    letterSpacing: 0.5,
  },

  heading: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.foreground,
    marginBottom: 6,
    textAlign: 'center',
  },
  headingDesktop: {
    fontSize: 30,
  },
  subheading: {
    fontSize: 14,
    color: colors.mutedForeground,
    marginBottom: 28,
    textAlign: 'center',
    lineHeight: 20,
  },
  subheadingDesktop: {
    marginBottom: 24,
  },

  formCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: colors.radiusLg,
    padding: 20,
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 10,
    marginBottom: 20,
  },
  formCardDesktop: {
    padding: 24,
  },
  fieldGroup: { marginBottom: 14 },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 7,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.foregroundSecondary,
    marginBottom: 7,
  },
  forgotText: { fontSize: 12, color: colors.success, fontWeight: '600' },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.input,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: colors.radius,
    overflow: 'hidden',
    minHeight: 50,
  },
  inputWrapperFocused: { borderColor: colors.success },
  inputIcon: { marginLeft: 14, flexShrink: 0 },
  input: {
    flex: 1,
    padding: 14,
    paddingLeft: 10,
    color: colors.foreground,
    fontSize: 15,
    fontWeight: '500',
    minWidth: 0,
  },
  passwordInput: {
    paddingRight: 44,
  },
  eyeBtn: { position: 'absolute', right: 14, padding: 4 },

  signInBtn: {
    marginTop: 4,
    backgroundColor: colors.success,
    borderRadius: colors.radius,
    minHeight: 52,
    paddingHorizontal: 17,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: colors.success,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 8,
  },
  signInBtnDisabled: { backgroundColor: colors.muted, shadowOpacity: 0 },
  signInText: {
    color: colors.successForeground,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.2,
  },

  demoCard: {
    padding: 16,
    borderRadius: colors.radius,
    backgroundColor: colors.successDimMid,
    borderWidth: 1,
    borderColor: colors.successBorder,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 24,
  },
  demoCardDesktop: {
    marginBottom: 20,
  },
  demoIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: colors.successDim,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  demoText: {
    fontSize: 13,
    color: colors.mutedForeground,
    lineHeight: 20,
    flex: 1,
  },
  demoTextStrong: {
    color: colors.success,
    fontWeight: '700',
  },

  securityStrip: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  securityStripDesktop: {
    gap: 14,
  },
  securityItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  securityText: { fontSize: 11, color: colors.mutedForeground, fontWeight: '500' },
});

export default LoginPage;
