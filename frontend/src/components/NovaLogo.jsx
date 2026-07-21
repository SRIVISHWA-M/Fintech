import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Svg, { Path, Circle, Line, Defs, LinearGradient, Stop, G } from 'react-native-svg';
import colors from '../theme/colors';

export const NovaLogoIcon = ({ size = 64 }) => {
  const strokeWidth = size * 0.03;
  return (
    <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
      <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
        <Defs>
          <LinearGradient id="gradientPrimary" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#34d87c" />
            <Stop offset="50%" stopColor="#22c55e" />
            <Stop offset="100%" stopColor="#06b6d4" />
          </LinearGradient>
          <LinearGradient id="gradientCore" x1="0%" y1="100%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#60a5fa" />
            <Stop offset="100%" stopColor="#ffffff" />
          </LinearGradient>
          <LinearGradient id="glowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#34d87c" stopOpacity="0.4" />
            <Stop offset="100%" stopColor="#34d87c" stopOpacity="0" />
          </LinearGradient>
        </Defs>

        {/* Dynamic Glowing Background Ring */}
        <Circle
          cx="50"
          cy="50"
          r="44"
          stroke="url(#glowGrad)"
          strokeWidth={6}
          strokeDasharray="20, 10"
        />

        {/* Model Network Connections (Grid / Neural Net structure) */}
        {/* Connection lines between model elements */}
        <Line x1="50" y1="15" x2="20" y2="40" stroke="url(#gradientPrimary)" strokeWidth={strokeWidth} opacity={0.6} />
        <Line x1="50" y1="15" x2="80" y2="40" stroke="url(#gradientPrimary)" strokeWidth={strokeWidth} opacity={0.6} />
        <Line x1="20" y1="40" x2="30" y2="75" stroke="url(#gradientPrimary)" strokeWidth={strokeWidth} opacity={0.6} />
        <Line x1="80" y1="40" x2="70" y2="75" stroke="url(#gradientPrimary)" strokeWidth={strokeWidth} opacity={0.6} />
        <Line x1="30" y1="75" x2="50" y2="85" stroke="url(#gradientPrimary)" strokeWidth={strokeWidth} opacity={0.6} />
        <Line x1="70" y1="75" x2="50" y2="85" stroke="url(#gradientPrimary)" strokeWidth={strokeWidth} opacity={0.6} />
        
        {/* Core intersecting model lines */}
        <Line x1="50" y1="15" x2="50" y2="45" stroke="#ffffff" strokeWidth={strokeWidth} opacity={0.8} />
        <Line x1="20" y1="40" x2="50" y2="45" stroke="#ffffff" strokeWidth={strokeWidth} opacity={0.8} />
        <Line x1="80" y1="40" x2="50" y2="45" stroke="#ffffff" strokeWidth={strokeWidth} opacity={0.8} />
        <Line x1="30" y1="75" x2="50" y2="45" stroke="#ffffff" strokeWidth={strokeWidth} opacity={0.8} />
        <Line x1="70" y1="75" x2="50" y2="45" stroke="#ffffff" strokeWidth={strokeWidth} opacity={0.8} />

        {/* Model Elements (Nodes) */}
        {/* Top Node */}
        <Circle cx="50" cy="15" r="5" fill="#34d87c" />
        <Circle cx="50" cy="15" r="8" stroke="#34d87c" strokeWidth={1.5} opacity={0.5} />

        {/* Left Upper Node */}
        <Circle cx="20" cy="40" r="5" fill="#22c55e" />

        {/* Right Upper Node */}
        <Circle cx="80" cy="40" r="5" fill="#06b6d4" />

        {/* Left Lower Node */}
        <Circle cx="30" cy="75" r="5" fill="#34d87c" />

        {/* Right Lower Node */}
        <Circle cx="70" cy="75" r="5" fill="#60a5fa" />

        {/* Bottom Node */}
        <Circle cx="50" cy="85" r="4" fill="#22c55e" />

        {/* Futuristic Center Piece: Combined Lightning Bolt & Star Core */}
        <G transform="translate(40, 32)">
          {/* Neon Glow Star/Bolt hybrid */}
          <Path
            d="M10 0 L18 10 L11 11 L16 22 L5 11 L10 10 Z"
            fill="url(#gradientCore)"
          />
        </G>
        
        {/* Glowing Center Core Node */}
        <Circle cx="50" cy="45" r="6" fill="#ffffff" />
        <Circle cx="50" cy="45" r="10" stroke="#ffffff" strokeWidth={1} opacity={0.6} />
      </Svg>
    </View>
  );
};

export const NovaLogo = ({ size = 64, showText = true, layout = 'column', subtitle = 'Secure Banking' }) => {
  const isRow = layout === 'row';
  return (
    <View style={[styles.container, isRow ? styles.row : styles.column]}>
      <View style={styles.iconWrapper}>
        <NovaLogoIcon size={size} />
        <View style={[styles.glowEffect, { width: size * 1.2, height: size * 1.2, borderRadius: size }]} />
      </View>
      {showText && (
        <View style={[styles.textWrapper, isRow ? styles.textRow : styles.textColumn]}>
          <Text style={[styles.logoText, { fontSize: size * 0.35 }]}>Hidel Finance</Text>
          {subtitle && (
            <View style={styles.badge}>
              <View style={styles.badgeDot} />
              <Text style={styles.badgeText}>{subtitle}</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  column: {
    flexDirection: 'column',
    gap: 12,
  },
  iconWrapper: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  glowEffect: {
    position: 'absolute',
    backgroundColor: 'rgba(52, 216, 124, 0.08)',
    zIndex: -1,
  },
  textWrapper: {
    justifyContent: 'center',
  },
  textRow: {
    alignItems: 'flex-start',
  },
  textColumn: {
    alignItems: 'center',
  },
  logoText: {
    fontWeight: '600',
    color: colors.foreground,
    letterSpacing: -0.5,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.successDim,
    borderWidth: 1,
    borderColor: colors.successBorder,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: colors.radiusFull,
    marginTop: 4,
  },
  badgeDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.success,
  },
  badgeText: {
    fontSize: 10,
    color: colors.success,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default NovaLogo;
