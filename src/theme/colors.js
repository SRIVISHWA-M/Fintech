// Nova Finance — Design Tokens

export const darkColors = {
  // Background & Surface
  background: '#080c12',
  card: '#10141d',
  cardElevated: '#141820',
  input: '#181d28',
  muted: '#1a1f2e',
  mutedAlt: '#1e2435',

  // Foreground / Text
  foreground: '#eaedf5',
  foregroundSecondary: '#c4c8d8',
  mutedForeground: '#5c6478',

  // Border
  border: 'rgba(255,255,255,0.07)',
  borderStrong: 'rgba(255,255,255,0.12)',

  // Accent / Success (emerald green)
  success: '#34d87c',
  successLight: '#4ade80',
  successDim: 'rgba(52,216,124,0.12)',
  successDimMid: 'rgba(52,216,124,0.07)',
  successBorder: 'rgba(52,216,124,0.22)',
  successForeground: '#041a0d',

  // Destructive / Warning
  destructive: '#f87171',
  destructiveDim: 'rgba(248,113,113,0.08)',
  destructiveBorder: 'rgba(248,113,113,0.28)',

  // Warning / amber
  warning: '#fbbf24',
  warningDim: 'rgba(251,191,36,0.10)',

  // Chart colors
  chartBlue: '#60a5fa',
  chartPurple: '#a78bfa',
  chartOrange: '#fb923c',

  // Shadows
  shadowCard: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  shadowGlow: {
    shadowColor: '#34d87c',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  shadowStrong: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
  },

  // Radius
  radius: 14,
  radiusMd: 18,
  radiusLg: 22,
  radiusFull: 999,
};

export const lightColors = {
  // Background & Surface
  background: '#f8fafc',
  card: '#ffffff',
  cardElevated: '#ffffff',
  input: '#f1f5f9',
  muted: '#e2e8f0',
  mutedAlt: '#cbd5e1',

  // Foreground / Text
  foreground: '#0f172a',
  foregroundSecondary: '#334155',
  mutedForeground: '#64748b',

  // Border
  border: 'rgba(0,0,0,0.07)',
  borderStrong: 'rgba(0,0,0,0.12)',

  // Accent / Success
  success: '#22c55e',
  successLight: '#16a34a',
  successDim: 'rgba(34,197,94,0.12)',
  successDimMid: 'rgba(34,197,94,0.07)',
  successBorder: 'rgba(34,197,94,0.22)',
  successForeground: '#ffffff',

  // Destructive / Warning
  destructive: '#ef4444',
  destructiveDim: 'rgba(239,68,68,0.08)',
  destructiveBorder: 'rgba(239,68,68,0.28)',

  // Warning / amber
  warning: '#f59e0b',
  warningDim: 'rgba(245,158,11,0.10)',

  // Chart colors
  chartBlue: '#3b82f6',
  chartPurple: '#8b5cf6',
  chartOrange: '#f97316',

  // Shadows
  shadowCard: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  shadowGlow: {
    shadowColor: '#22c55e',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 4,
  },
  shadowStrong: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 6,
  },

  // Radius
  radius: 14,
  radiusMd: 18,
  radiusLg: 22,
  radiusFull: 999,
};

// For backward compatibility during refactoring
export const colors = darkColors;
export default colors;
