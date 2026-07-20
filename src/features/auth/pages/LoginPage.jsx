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
import Svg, { Defs, RadialGradient, Stop, Ellipse, Path, LinearGradient } from 'react-native-svg';
import { authStore } from '../../../store/authStore';
import { useTheme } from '../../../theme/useTheme';
import { authService } from '../../../services/authService';
import NovaLogo, { NovaLogoIcon } from '../../../components/NovaLogo';

const DEMO_USERS = [
  {
    email: 'aarav.shah@example.com',
    password: 'password123',
    name: 'Aarav Shah',
    role: 'Client',
  },
  {
    email: 'superadmin@novafinance.com',
    password: 'superadmin123',
    name: 'Super Admin',
    role: 'Superadmin',
  },
];

const getDashboardMetrics = (colors) => [
  { label: 'Active loans', value: '1,284', icon: 'layers-outline', color: colors.success },
  { label: 'On-time rate', value: '98.4%', icon: 'checkmark-circle-outline', color: colors.chartBlue },
  { label: 'Collections', value: '42L', icon: 'wallet-outline', color: colors.warning },
  { label: 'Risk alerts', value: '18', icon: 'shield-outline', color: colors.chartPurple },
];

const SECURITY_ITEMS = [
  { icon: 'shield-checkmark-outline', text: '256-bit SSL Encryption' },
  { icon: 'finger-print-outline', text: 'Biometric Login Ready' },
  { icon: 'lock-closed-outline', text: 'Encrypted Databases' },
];

const BgGlow = () => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
      <Defs>
        <RadialGradient id="glowTop" cx="30%" cy="20%" r="50%">
          <Stop offset="0%" stopColor="#34d87c" stopOpacity="0.08" />
          <Stop offset="100%" stopColor="#080c12" stopOpacity="0" />
        </RadialGradient>
        <RadialGradient id="glowBottom" cx="80%" cy="80%" r="60%">
          <Stop offset="0%" stopColor="#60a5fa" stopOpacity="0.06" />
          <Stop offset="100%" stopColor="#080c12" stopOpacity="0" />
        </RadialGradient>
      </Defs>
      <Ellipse cx="30%" cy="20%" rx="50%" ry="40%" fill="url(#glowTop)" />
      <Ellipse cx="80%" cy="80%" rx="60%" ry="50%" fill="url(#glowBottom)" />
    </Svg>
  </View>
);

const CardWaves = () => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    <Svg width="100%" height="100%">
      <Defs>
        <LinearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <Stop offset="0%" stopColor="#34d87c" stopOpacity="0.12" />
          <Stop offset="100%" stopColor="#60a5fa" stopOpacity="0.05" />
        </LinearGradient>
      </Defs>
      <Path d="M -30 30 Q 120 120 240 10 T 450 80" fill="none" stroke="url(#waveGrad)" strokeWidth="50" />
      <Path d="M -20 90 Q 150 10 280 120 T 460 20" fill="none" stroke="rgba(52,216,124,0.06)" strokeWidth="30" />
    </Svg>
  </View>
);

const DesktopPanel = ({ colors, styles }) => (
  <View style={styles.desktopPanel}>
    <View style={styles.desktopBrandRow}>
      <NovaLogo size={46} layout="row" subtitle="Secure loan operations" />
    </View>

    {/* Custom Credit Card Visual */}
    <View style={styles.creditCardVisual}>
      <CardWaves />
      <View style={styles.cardHeaderRow}>
        <View style={styles.logoCol}>
          <NovaLogoIcon size={18} />
          <Text style={styles.cardLogoText}>HIDEL</Text>
        </View>
        <Text style={styles.cardNetworkText}>PREMIUM MEMBER</Text>
      </View>
      <View style={styles.cardMiddleRow}>
        <View style={styles.simChip}>
          <View style={styles.simInner}>
            <View style={styles.simLineH} />
            <View style={styles.simLineV} />
            <View style={styles.simCenter} />
          </View>
        </View>
        <View style={styles.balanceCol}>
          <Text style={styles.balLabel}>CREDIT LINE ACCESS</Text>
          <Text style={styles.balValue}>₹25,00,000</Text>
        </View>
      </View>
      <View style={styles.cardBottomRow}>
        <Text style={styles.cardNumber}>•••• •••• •••• 8890</Text>
        <Text style={styles.cardHolder}>HIDEL FINANCE INC</Text>
      </View>
    </View>

    <View style={styles.desktopMetricGrid}>
      {getDashboardMetrics(colors).map(({ label, value, icon, color }) => (
        <View key={label} style={styles.desktopMetric}>
          <View style={[styles.desktopMetricIcon, { backgroundColor: `${color}12` }]}>
            <Ionicons name={icon} size={15} color={color} />
          </View>
          <View>
            <Text style={styles.desktopMetricValue}>{value}</Text>
            <Text style={styles.desktopMetricLabel}>{label}</Text>
          </View>
        </View>
      ))}
    </View>

    <View style={styles.desktopActivity}>
      <View style={styles.activityHeader}>
        <Text style={styles.activityTitle}>Live Operations Status</Text>
        <View style={styles.activityPulseContainer}>
          <View style={styles.activityPulse} />
          <Text style={styles.pulseText}>Active</Text>
        </View>
      </View>
      {['Workspace initialized successfully', 'Encrypted handshake verified', 'Super admin routes active'].map((item) => (
        <View key={item} style={styles.activityRow}>
          <Ionicons name="checkmark-circle" size={14} color={colors.success} />
          <Text style={styles.activityText}>{item}</Text>
        </View>
      ))}
    </View>
  </View>
);

const LoginPage = () => {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;
  const [email, setEmail] = useState('aarav.shah@example.com');
  const [password, setPassword] = useState('password123');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [pwFocused, setPwFocused] = useState(false);

  // Forgot password & Signup flow states
  const [mode, setMode] = useState('login'); // 'login' | 'signup' | 'forgot' | 'reset'
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  // Signup specific states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [nameFocused, setNameFocused] = useState(false);
  const [phoneFocused, setPhoneFocused] = useState(false);

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
        setLoading(false);
        return;
      }

      console.log('Login API error, using local demo credentials:', error.message);
      const mappedUser = {
        id: demoUser.email === 'superadmin@novafinance.com' ? 'super-admin' : 'user-aarav',
        name: demoUser.name,
        email: demoUser.email,
        role: demoUser.email === 'superadmin@novafinance.com' ? 'superadmin' : 'user',
      };
      
      authStore.setUser(mappedUser);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!name.trim() || !email.trim() || !phone.trim() || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      await authService.signup(name, email, phone, password);
    } catch (error) {
      Alert.alert('Signup Failed', error.message || 'An error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email or Customer ID');
      return;
    }
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      Alert.alert('Success', 'An OTP has been sent to your registered email and mobile number. (Check your backend terminal logs to see the generated code).');
      setMode('reset');
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!otp || otp.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit OTP');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }
    setLoading(true);
    try {
      await authService.resetPassword(email, otp, newPassword);
      Alert.alert('Success', 'Your password has been successfully reset. You can now login with your new password.');
      setPassword(newPassword);
      setMode('login');
      setOtp('');
      setNewPassword('');
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to reset password');
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
            <View style={[styles.formColumn, isDesktop && styles.formColumnDesktop]}>
              <View style={[styles.logoArea, isDesktop && styles.logoAreaDesktop]}>
                <NovaLogo size={60} layout="column" subtitle="Secure Banking" />
              </View>

              <Text style={[styles.heading, isDesktop && styles.headingDesktop]}>Control Center</Text>
              <Text style={[styles.subheading, isDesktop && styles.subheadingDesktop]}>
                Sign in to manage and verify secure transactions
              </Text>

              {/* Glassmorphic Form Card */}
              <View style={[styles.formCard, isDesktop && styles.formCardDesktop]}>
                
                {/* Pre-filled Account Quick Select */}
                {mode === 'login' && (
                  <View style={styles.quickSelectSection}>
                  <Text style={styles.quickSelectTitle}>Quick Sign-In</Text>
                  <View style={styles.quickSelectRow}>
                    {DEMO_USERS.map((user) => (
                      <TouchableOpacity
                        key={user.email}
                        style={[
                          styles.quickSelectBtn,
                          email === user.email && styles.quickSelectBtnActive,
                        ]}
                        onPress={() => {
                          setEmail(user.email);
                          setPassword(user.password);
                        }}
                      >
                        <Ionicons
                          name={user.role === 'Superadmin' ? 'shield-checkmark' : 'person-circle'}
                          size={15}
                          color={email === user.email ? colors.successForeground : colors.success}
                        />
                        <Text
                          style={[
                            styles.quickSelectText,
                            email === user.email && styles.quickSelectTextActive,
                          ]}
                        >
                          {user.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
                )}

                {/* Form fields based on Mode */}
                {mode === 'login' ? (
                  <>
                    <View style={styles.fieldGroup}>
                      <Text style={styles.label}>Email Address or Customer ID</Text>
                      <View style={[styles.inputWrapper, emailFocused && styles.inputWrapperFocused]}>
                        <Ionicons
                          name="mail-outline"
                          size={16}
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
                          multiline={false}
                          underlineColorAndroid="transparent"
                        />
                      </View>
                    </View>

                    <View style={styles.fieldGroup}>
                      <View style={styles.labelRow}>
                        <Text style={styles.label}>Security Password</Text>
                        <TouchableOpacity onPress={() => setMode('forgot')}>
                          <Text style={styles.forgotText}>Forgot?</Text>
                        </TouchableOpacity>
                      </View>
                      <View style={[styles.inputWrapper, pwFocused && styles.inputWrapperFocused]}>
                        <Ionicons
                          name="lock-closed-outline"
                          size={16}
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
                          multiline={false}
                          underlineColorAndroid="transparent"
                        />
                        <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPw((s) => !s)}>
                          <Ionicons
                            name={showPw ? 'eye-off-outline' : 'eye-outline'}
                            size={17}
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
                          <Text style={styles.signInText}>Sign In Securely</Text>
                          <Ionicons name="arrow-forward" size={16} color={colors.successForeground} />
                        </>
                      )}
                    </TouchableOpacity>

                    <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 16 }}>
                      <Text style={{ color: colors.mutedForeground, fontSize: 13 }}>New to Hidel? </Text>
                      <TouchableOpacity onPress={() => {
                        setMode('signup');
                        setEmail('');
                        setPassword('');
                      }}>
                        <Text style={{ color: colors.success, fontSize: 13, fontWeight: '700' }}>Create an Account</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                ) : mode === 'signup' ? (
                  <>
                    <View style={styles.fieldGroup}>
                      <Text style={styles.label}>Full Name</Text>
                      <View style={[styles.inputWrapper, nameFocused && styles.inputWrapperFocused]}>
                        <Ionicons name="person-outline" size={16} color={nameFocused ? colors.success : colors.mutedForeground} style={styles.inputIcon} />
                        <TextInput
                          style={styles.input}
                          value={name}
                          onChangeText={setName}
                          placeholderTextColor={colors.mutedForeground}
                          onFocus={() => setNameFocused(true)}
                          onBlur={() => setNameFocused(false)}
                        />
                      </View>
                    </View>

                    <View style={styles.fieldGroup}>
                      <Text style={styles.label}>Email Address</Text>
                      <View style={[styles.inputWrapper, emailFocused && styles.inputWrapperFocused]}>
                        <Ionicons name="mail-outline" size={16} color={emailFocused ? colors.success : colors.mutedForeground} style={styles.inputIcon} />
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
                      <Text style={styles.label}>Phone Number</Text>
                      <View style={[styles.inputWrapper, phoneFocused && styles.inputWrapperFocused]}>
                        <Ionicons name="call-outline" size={16} color={phoneFocused ? colors.success : colors.mutedForeground} style={styles.inputIcon} />
                        <TextInput
                          style={styles.input}
                          value={phone}
                          onChangeText={setPhone}
                          keyboardType="phone-pad"
                          placeholderTextColor={colors.mutedForeground}
                          onFocus={() => setPhoneFocused(true)}
                          onBlur={() => setPhoneFocused(false)}
                        />
                      </View>
                    </View>

                    <View style={styles.fieldGroup}>
                      <Text style={styles.label}>Password</Text>
                      <View style={[styles.inputWrapper, pwFocused && styles.inputWrapperFocused]}>
                        <Ionicons name="lock-closed-outline" size={16} color={pwFocused ? colors.success : colors.mutedForeground} style={styles.inputIcon} />
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
                          <Ionicons name={showPw ? 'eye-off-outline' : 'eye-outline'} size={17} color={colors.mutedForeground} />
                        </TouchableOpacity>
                      </View>
                    </View>

                    <TouchableOpacity
                      style={[styles.signInBtn, loading && styles.signInBtnDisabled]}
                      onPress={handleSignup}
                      disabled={loading}
                      activeOpacity={0.85}
                    >
                      {loading ? (
                        <ActivityIndicator color={colors.successForeground} />
                      ) : (
                        <Text style={styles.signInText}>Register Account</Text>
                      )}
                    </TouchableOpacity>

                    <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 16 }}>
                      <Text style={{ color: colors.mutedForeground, fontSize: 13 }}>Already have an account? </Text>
                      <TouchableOpacity onPress={() => {
                        setMode('login');
                        setEmail('aarav.shah@example.com');
                        setPassword('password123');
                      }}>
                        <Text style={{ color: colors.success, fontSize: 13, fontWeight: '700' }}>Sign In</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                ) : mode === 'forgot' ? (
                  <>
                    <View style={styles.fieldGroup}>
                      <Text style={styles.label}>Enter Email or Customer ID</Text>
                      <View style={[styles.inputWrapper, emailFocused && styles.inputWrapperFocused]}>
                        <Ionicons name="mail-outline" size={16} color={emailFocused ? colors.success : colors.mutedForeground} style={styles.inputIcon} />
                        <TextInput
                          style={styles.input}
                          value={email}
                          onChangeText={setEmail}
                          autoCapitalize="none"
                          placeholderTextColor={colors.mutedForeground}
                          onFocus={() => setEmailFocused(true)}
                          onBlur={() => setEmailFocused(false)}
                        />
                      </View>
                    </View>
                    
                    <TouchableOpacity
                      style={[styles.signInBtn, loading && styles.signInBtnDisabled]}
                      onPress={handleForgotPassword}
                      disabled={loading}
                      activeOpacity={0.85}
                    >
                      {loading ? <ActivityIndicator color={colors.successForeground} /> : <Text style={styles.signInText}>Send Reset Code</Text>}
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setMode('login')} style={{ alignItems: 'center', marginTop: 10 }}>
                      <Text style={{ color: colors.mutedForeground, fontSize: 13, fontWeight: '600' }}>Back to Login</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <View style={styles.fieldGroup}>
                      <Text style={styles.label}>Enter 6-Digit OTP</Text>
                      <View style={[styles.inputWrapper, { borderColor: colors.border }]}>
                        <Ionicons name="keypad-outline" size={16} color={colors.mutedForeground} style={styles.inputIcon} />
                        <TextInput
                          style={styles.input}
                          value={otp}
                          onChangeText={setOtp}
                          keyboardType="numeric"
                          maxLength={6}
                          placeholder="e.g. 123456"
                          placeholderTextColor={colors.mutedForeground}
                        />
                      </View>
                    </View>

                    <View style={styles.fieldGroup}>
                      <Text style={styles.label}>New Password</Text>
                      <View style={[styles.inputWrapper, { borderColor: colors.border }]}>
                        <Ionicons name="lock-closed-outline" size={16} color={colors.mutedForeground} style={styles.inputIcon} />
                        <TextInput
                          style={styles.input}
                          value={newPassword}
                          onChangeText={setNewPassword}
                          secureTextEntry={!showPw}
                          placeholderTextColor={colors.mutedForeground}
                        />
                        <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPw((s) => !s)}>
                          <Ionicons name={showPw ? 'eye-off-outline' : 'eye-outline'} size={17} color={colors.mutedForeground} />
                        </TouchableOpacity>
                      </View>
                    </View>

                    <TouchableOpacity
                      style={[styles.signInBtn, loading && styles.signInBtnDisabled]}
                      onPress={handleResetPassword}
                      disabled={loading}
                      activeOpacity={0.85}
                    >
                      {loading ? <ActivityIndicator color={colors.successForeground} /> : <Text style={styles.signInText}>Confirm New Password</Text>}
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setMode('login')} style={{ alignItems: 'center', marginTop: 10 }}>
                      <Text style={{ color: colors.mutedForeground, fontSize: 13, fontWeight: '600' }}>Back to Login</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>

              <View style={[styles.securityStrip, isDesktop && styles.securityStripDesktop]}>
                {SECURITY_ITEMS.map(({ icon, text }) => (
                  <View key={text} style={styles.securityItem}>
                    <Ionicons name={icon} size={12} color={colors.success} style={{ marginRight: 4 }} />
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

const getStyles = (colors) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  keyboard: { flex: 1 },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    paddingTop: 30,
    paddingBottom: 30,
  },
  scrollDesktop: {
    minHeight: 700,
    paddingHorizontal: 40,
    paddingVertical: 32,
  },
  shell: {
    width: '100%',
    alignSelf: 'center',
  },
  shellDesktop: {
    maxWidth: 1100,
    minHeight: 660,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 32,
  },
  formColumn: {
    width: '100%',
  },
  formColumnDesktop: {
    width: 410,
    flexShrink: 0,
    justifyContent: 'center',
  },

  /* Desktop Panel Redesign */
  desktopPanel: {
    flex: 1,
    minWidth: 0,
    borderRadius: colors.radiusLg,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: '#0a0e16',
    padding: 32,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.4,
    shadowRadius: 30,
    elevation: 12,
  },
  desktopBrandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  creditCardVisual: {
    backgroundColor: '#081710',
    borderRadius: 20,
    padding: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(52,216,124,0.18)',
    marginVertical: 18,
    minHeight: 180,
    justifyContent: 'space-between',
    shadowColor: colors.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoCol: { flexDirection: 'row', alignItems: 'center' },
  cardLogoText: { color: '#ffffff', fontSize: 15, fontWeight: '900', letterSpacing: 2, marginLeft: 6 },
  cardNetworkText: { color: 'rgba(255,255,255,0.4)', fontSize: 8, fontWeight: '700', letterSpacing: 1 },
  cardMiddleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  simChip: {
    width: 38,
    height: 28,
    borderRadius: 5,
    backgroundColor: '#C59E27',
    padding: 3,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.15)',
  },
  simInner: { flex: 1, position: 'relative' },
  simLineH: { position: 'absolute', left: 0, right: 0, top: '50%', height: 1, backgroundColor: 'rgba(0,0,0,0.2)' },
  simLineV: { position: 'absolute', top: 0, bottom: 0, left: '50%', width: 1, backgroundColor: 'rgba(0,0,0,0.2)' },
  simCenter: { position: 'absolute', left: '25%', right: '25%', top: '25%', bottom: '25%', borderRadius: 1.5, borderWidth: 1, borderColor: 'rgba(0,0,0,0.15)' },
  balanceCol: {},
  balLabel: { fontSize: 8, color: 'rgba(255,255,255,0.4)', letterSpacing: 1, fontWeight: '600' },
  balValue: { fontSize: 24, fontWeight: '800', color: '#ffffff', marginTop: 2 },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardNumber: { fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: '600', letterSpacing: 0.5 },
  cardHolder: { fontSize: 10, color: 'rgba(255,255,255,0.5)', fontWeight: '700' },

  desktopMetricGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginVertical: 10,
  },
  desktopMetric: {
    flexBasis: '47%',
    flexGrow: 1,
    borderRadius: colors.radius,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  desktopMetricIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  desktopMetricValue: {
    color: colors.foreground,
    fontSize: 18,
    fontWeight: '800',
  },
  desktopMetricLabel: {
    color: colors.mutedForeground,
    fontSize: 11,
    marginTop: 2,
    fontWeight: '500',
  },
  desktopActivity: {
    borderRadius: colors.radius,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.muted,
    padding: 16,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  activityTitle: {
    color: colors.foreground,
    fontSize: 13,
    fontWeight: '700',
  },
  activityPulseContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  activityPulse: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.success,
  },
  pulseText: {
    fontSize: 11,
    color: colors.success,
    fontWeight: '600',
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 5,
  },
  activityText: {
    color: colors.foregroundSecondary,
    fontSize: 12,
    fontWeight: '500',
  },

  /* Auth form area redesign */
  logoArea: { alignItems: 'center', marginBottom: 28 },
  logoAreaDesktop: { marginBottom: 20 },
  heading: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.foreground,
    marginBottom: 6,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  headingDesktop: {
    fontSize: 26,
  },
  subheading: {
    fontSize: 13,
    color: colors.mutedForeground,
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 18,
  },
  subheadingDesktop: {
    marginBottom: 20,
  },

  /* Glassmorphic Auth Form Card */
  formCard: {
    backgroundColor: 'rgba(16, 20, 29, 0.75)',
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: colors.radiusLg,
    padding: 24,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 10,
    marginBottom: 20,
  },
  formCardDesktop: {
    padding: 28,
  },

  /* Quick select section */
  quickSelectSection: {
    marginBottom: 4,
  },
  quickSelectTitle: {
    fontSize: 11,
    color: colors.mutedForeground,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  quickSelectRow: {
    flexDirection: 'row',
    gap: 10,
  },
  quickSelectBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: colors.radius,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.input,
  },
  quickSelectBtnActive: {
    borderColor: colors.success,
    backgroundColor: colors.success,
  },
  quickSelectText: {
    fontSize: 12,
    color: colors.foregroundSecondary,
    fontWeight: '600',
  },
  quickSelectTextActive: {
    color: colors.successForeground,
    fontWeight: '800',
  },

  fieldGroup: { gap: 8 },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.foregroundSecondary,
    letterSpacing: 0.2,
  },
  forgotText: { fontSize: 12, color: colors.success, fontWeight: '700' },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.input,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: colors.radius,
    height: 48,
  },
  inputWrapperFocused: { borderColor: colors.success },
  inputIcon: { marginLeft: 12, flexShrink: 0 },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    paddingLeft: 8,
    paddingVertical: 0,
    marginVertical: 0,
    color: colors.foreground,
    fontSize: 14,
    fontWeight: '500',
    minWidth: 0,
    height: '100%',
    textAlignVertical: 'center',
    backgroundColor: 'transparent',
    borderWidth: 0,
    outlineStyle: 'none',
  },
  passwordInput: {
    paddingRight: 40,
  },
  eyeBtn: { position: 'absolute', right: 12, padding: 4 },

  signInBtn: {
    backgroundColor: colors.success,
    borderRadius: colors.radius,
    minHeight: 48,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: colors.success,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
    marginTop: 6,
  },
  signInBtnDisabled: { backgroundColor: colors.muted, shadowOpacity: 0 },
  signInText: {
    color: colors.successForeground,
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.1,
  },

  securityStrip: {
    flexDirection: 'column',
    gap: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  securityStripDesktop: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 8,
  },
  securityItem: { flexDirection: 'row', alignItems: 'center' },
  securityText: { fontSize: 11, color: colors.mutedForeground, fontWeight: '600' },
});

export default LoginPage;
