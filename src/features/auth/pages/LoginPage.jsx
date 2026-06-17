import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, ActivityIndicator, KeyboardAvoidingView,
  Platform, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path, Defs, RadialGradient, Stop, Ellipse } from 'react-native-svg';
import { authStore } from '../../../store/authStore';
import colors from '../../../theme/colors';
import { authService } from '../../../services/authService';

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

const LoginPage = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('aarav.shah@example.com');
  const [password, setPassword] = useState('password123');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [pwFocused, setPwFocused] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      // Use authService.login — it persists the token to AsyncStorage automatically
      await authService.login(email, password);
      navigation.replace('Main');
    } catch (error) {
      console.log('Login API error, falling back to local demo login:', error.message);
      authStore.login();
      navigation.replace('Main');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <BgGlow />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

          {/* Logo */}
          <View style={styles.logoArea}>
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

          {/* Heading */}
          <Text style={styles.heading}>Welcome back</Text>
          <Text style={styles.subheading}>Sign in to manage your loan account</Text>

          {/* Card form */}
          <View style={styles.formCard}>
            {/* Email */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Email address</Text>
              <View style={[styles.inputWrapper, emailFocused && styles.inputWrapperFocused]}>
                <Ionicons name="mail-outline" size={17} color={emailFocused ? colors.success : colors.mutedForeground} style={styles.inputIcon} />
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

            {/* Password */}
            <View style={styles.fieldGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Password</Text>
                <TouchableOpacity>
                  <Text style={styles.forgotText}>Forgot password?</Text>
                </TouchableOpacity>
              </View>
              <View style={[styles.inputWrapper, pwFocused && styles.inputWrapperFocused]}>
                <Ionicons name="lock-closed-outline" size={17} color={pwFocused ? colors.success : colors.mutedForeground} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { flex: 1, paddingRight: 44 }]}
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

            {/* Submit */}
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

          {/* Demo hint */}
          <View style={styles.demoCard}>
            <View style={styles.demoIconWrap}>
              <Ionicons name="shield-checkmark" size={15} color={colors.success} />
            </View>
            <Text style={styles.demoText}>
              <Text style={{ color: colors.success, fontWeight: '700' }}>Demo mode</Text>
              {' — credentials are pre-filled. Tap Sign in to explore as Aarav Shah.'}
            </Text>
          </View>

          {/* Security strip */}
          <View style={styles.securityStrip}>
            {[
              { icon: 'shield-outline', text: '256-bit SSL' },
              { icon: 'finger-print-outline', text: 'Biometric' },
              { icon: 'lock-closed-outline', text: 'Encrypted' },
            ].map(({ icon, text }) => (
              <View key={text} style={styles.securityItem}>
                <Ionicons name={icon} size={13} color={colors.mutedForeground} />
                <Text style={styles.securityText}>{text}</Text>
              </View>
            ))}
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    paddingTop: 40,
    paddingBottom: 40,
  },

  // Logo
  logoArea: { alignItems: 'center', marginBottom: 36 },
  logoIconWrap: { position: 'relative', marginBottom: 12 },
  logoIcon: {
    width: 56, height: 56, borderRadius: 18,
    backgroundColor: colors.success,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: colors.success,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5, shadowRadius: 20, elevation: 10,
  },
  logoGlow: {
    position: 'absolute', top: -10, left: -10, right: -10, bottom: -10,
    borderRadius: 30, backgroundColor: 'rgba(52,216,124,0.06)',
  },
  logoText: { fontSize: 22, fontWeight: '800', color: colors.foreground, letterSpacing: -0.5, marginBottom: 8 },
  logoBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: colors.successDim, borderWidth: 1, borderColor: colors.successBorder,
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: colors.radiusFull,
  },
  logoBadgeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.success },
  logoBadgeText: { fontSize: 11, color: colors.success, fontWeight: '600', letterSpacing: 0.5 },

  heading: {
    fontSize: 32, fontWeight: '800', color: colors.foreground,
    letterSpacing: -0.8, marginBottom: 6, textAlign: 'center',
  },
  subheading: {
    fontSize: 14, color: colors.mutedForeground,
    marginBottom: 28, textAlign: 'center', lineHeight: 20,
  },

  // Form card
  formCard: {
    backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border,
    borderRadius: colors.radiusLg, padding: 20, gap: 4,
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35, shadowRadius: 20, elevation: 10,
    marginBottom: 20,
  },
  fieldGroup: { marginBottom: 14 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 },
  label: { fontSize: 13, fontWeight: '600', color: colors.foregroundSecondary, marginBottom: 7 },
  forgotText: { fontSize: 12, color: colors.success, fontWeight: '600' },

  inputWrapper: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.input, borderWidth: 1.5, borderColor: colors.border,
    borderRadius: colors.radius, overflow: 'hidden',
  },
  inputWrapperFocused: { borderColor: colors.success },
  inputIcon: { marginLeft: 14, flexShrink: 0 },
  input: {
    flex: 1, padding: 14, paddingLeft: 10,
    color: colors.foreground, fontSize: 15, fontWeight: '500',
  },
  eyeBtn: { position: 'absolute', right: 14, padding: 4 },

  signInBtn: {
    marginTop: 4, backgroundColor: colors.success,
    borderRadius: colors.radius, padding: 17,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    shadowColor: colors.success, shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.45, shadowRadius: 16, elevation: 8,
  },
  signInBtnDisabled: { backgroundColor: colors.muted, shadowOpacity: 0 },
  signInText: { color: colors.successForeground, fontSize: 16, fontWeight: '800', letterSpacing: 0.2 },

  // Demo card
  demoCard: {
    padding: 16, borderRadius: colors.radius,
    backgroundColor: colors.successDimMid, borderWidth: 1, borderColor: colors.successBorder,
    flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 24,
  },
  demoIconWrap: {
    width: 28, height: 28, borderRadius: 8, backgroundColor: colors.successDim,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  demoText: { fontSize: 13, color: colors.mutedForeground, lineHeight: 20, flex: 1 },

  // Security strip
  securityStrip: {
    flexDirection: 'row', justifyContent: 'center', gap: 20, alignItems: 'center',
  },
  securityItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  securityText: { fontSize: 11, color: colors.mutedForeground, fontWeight: '500' },
});

export default LoginPage;
