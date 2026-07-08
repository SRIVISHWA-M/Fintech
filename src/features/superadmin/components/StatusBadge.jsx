import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import adminColors from '../theme/adminColors';

/**
 * StatusBadge — color-coded pill badge for statuses, risk levels, KYC tiers, etc.
 *
 * Props:
 *   label    — text to display
 *   variant  — 'success' | 'warning' | 'danger' | 'info' | 'orange' | 'muted' | 'critical'
 *   size     — 'sm' | 'md' (default 'md')
 *   dot      — show a leading dot indicator (bool)
 */
const variants = {
  success:  { bg: adminColors.successDim,  text: adminColors.success,  border: adminColors.accentBorder },
  warning:  { bg: adminColors.warningDim,  text: adminColors.warning,  border: 'rgba(251,191,36,0.25)' },
  danger:   { bg: adminColors.dangerDim,   text: adminColors.danger,   border: adminColors.dangerBorder },
  orange:   { bg: adminColors.orangeDim,   text: adminColors.orange,   border: 'rgba(251,146,60,0.25)' },
  info:     { bg: 'rgba(96,165,250,0.10)', text: adminColors.chartBlue, border: 'rgba(96,165,250,0.25)' },
  muted:    { bg: adminColors.muted,       text: adminColors.fgSub,    border: adminColors.border },
  critical: { bg: 'rgba(248,113,113,0.18)', text: '#f87171',           border: 'rgba(248,113,113,0.40)' },
  purple:   { bg: 'rgba(167,139,250,0.12)', text: adminColors.chartPurple, border: 'rgba(167,139,250,0.25)' },
  teal:     { bg: 'rgba(45,212,191,0.12)', text: adminColors.chartTeal,   border: 'rgba(45,212,191,0.25)' },
};

const StatusBadge = ({ label, variant = 'muted', size = 'md', dot = false }) => {
  const { bg, text, border } = variants[variant] || variants.muted;
  const isSmall = size === 'sm';

  return (
    <View style={[
      styles.badge,
      {
        backgroundColor: bg,
        borderColor: border,
        paddingHorizontal: isSmall ? 7 : 10,
        paddingVertical: isSmall ? 2 : 4,
        borderRadius: adminColors.rFull,
      }
    ]}>
      {dot && (
        <View style={[styles.dot, { backgroundColor: text }]} />
      )}
      <Text style={[styles.text, { color: text, fontSize: isSmall ? 9 : 11 }]}>
        {label}
      </Text>
    </View>
  );
};

// Helper: derive variant from common status/risk strings
export const getStatusVariant = (status) => {
  const s = (status || '').toLowerCase();
  if (['approved', 'active', 'paid', 'tier-2', 'low'].includes(s)) return 'success';
  if (['pending review', 'under review', 'kyc pending', 'contacted', 'reminder sent', 'medium', 'tier-1'].includes(s)) return 'warning';
  if (['rejected', 'suspended', 'default', 'overdue', 'high', 'legal notice', 'escalated'].includes(s)) return 'danger';
  if (['flagged', 'critical', 'npa'].includes(s)) return 'critical';
  if (['promise to pay', 'in progress'].includes(s)) return 'orange';
  if (['restricted'].includes(s)) return 'purple';
  if (['business loan', 'teal'].includes(s)) return 'teal';
  return 'muted';
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    gap: 5,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 99,
  },
  text: {
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});

export default StatusBadge;
