import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import adminColors from '../theme/adminColors';
import AdminLayout from '../components/AdminLayout';
import AdminMetricCard from '../components/AdminMetricCard';
import StatusBadge, { getStatusVariant } from '../components/StatusBadge';
import {
  overviewMetrics,
  disbursementTrend,
  riskDistribution,
  recentActivity,
} from '../data/mockData';

// ─── Mini Bar Chart ──────────────────────────────────────────────────────────
const BarChart = ({ data }) => {
  const max = Math.max(...data.map((d) => d.amount));
  return (
    <View style={barStyles.wrap}>
      {data.map((d, i) => (
        <View key={i} style={barStyles.col}>
          <View style={barStyles.barBg}>
            <View
              style={[
                barStyles.barFill,
                {
                  height: `${Math.round((d.amount / max) * 100)}%`,
                  backgroundColor: i === data.length - 1 ? adminColors.accent : adminColors.chartBlue,
                },
              ]}
            />
          </View>
          <Text style={barStyles.label}>{d.month}</Text>
          <Text style={barStyles.val}>₹{d.amount}Cr</Text>
        </View>
      ))}
    </View>
  );
};

const barStyles = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'flex-end', gap: 10, height: 100 },
  col: { flex: 1, alignItems: 'center', gap: 4 },
  barBg: {
    flex: 1,
    width: '70%',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: adminColors.r4,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  barFill: { width: '100%', borderRadius: adminColors.r4 },
  label: { fontSize: 9, color: adminColors.fgMuted, fontWeight: '600' },
  val: { fontSize: 9, color: adminColors.fgSub, fontWeight: '700' },
});

// ─── Donut-like Risk Distribution ────────────────────────────────────────────
const RiskRow = ({ label, value, color }) => (
  <View style={riskStyles.row}>
    <View style={[riskStyles.dot, { backgroundColor: color }]} />
    <Text style={riskStyles.label}>{label}</Text>
    <View style={riskStyles.bar}>
      <View style={[riskStyles.fill, { width: `${value}%`, backgroundColor: color }]} />
    </View>
    <Text style={[riskStyles.pct, { color }]}>{value}%</Text>
  </View>
);

const riskStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  dot: { width: 8, height: 8, borderRadius: 99 },
  label: { fontSize: 12, color: adminColors.fgSub, fontWeight: '500', width: 90 },
  bar: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: adminColors.rFull,
    overflow: 'hidden',
  },
  fill: { height: '100%', borderRadius: adminColors.rFull },
  pct: { fontSize: 12, fontWeight: '700', width: 36, textAlign: 'right' },
});

// ─── Activity type icon/color map ─────────────────────────────────────────────
const activityMap = {
  approval:   { icon: 'checkmark-circle',  color: adminColors.success },
  flag:       { icon: 'flag',              color: adminColors.warning },
  collection: { icon: 'cash',              color: adminColors.chartBlue },
  config:     { icon: 'settings',          color: adminColors.chartPurple },
  user:       { icon: 'person-add',        color: adminColors.chartTeal },
};

// ─── Overview Page ────────────────────────────────────────────────────────────
const OverviewPage = ({ activeTab, onNavigate, searchQuery, onSearch }) => {
  const m = overviewMetrics;

  return (
    <AdminLayout activeTab={activeTab} onNavigate={onNavigate} searchQuery={searchQuery} onSearch={onSearch}>
      {/* ── KPI Row ────────────────────────────────────────────────────────── */}
      <View style={styles.kpiRow}>
        <AdminMetricCard icon="layers-outline" iconColor={adminColors.accent}    label="Total AUM"             value={m.totalAUM}          change={m.totalAUMChange}       positive />
        <AdminMetricCard icon="people-outline" iconColor={adminColors.chartBlue}  label="Active Loans"          value={m.activeLoans}        change={m.activeLoansChange}    positive />
        <AdminMetricCard icon="flash-outline"  iconColor={adminColors.chartPurple} label="Disbursed Today"       value={m.disbursedToday}     change={m.disbursedTodayChange} positive />
        <AdminMetricCard icon="shield-checkmark-outline" iconColor={adminColors.success} label="Collection Rate" value={m.collectionRate}    change={m.collectionRateChange} positive />
        <AdminMetricCard icon="alert-circle-outline" iconColor={adminColors.danger} label="NPL Ratio"           value={m.nplRatio}           change={m.nplRatioChange}       positive />
        <AdminMetricCard icon="documents-outline" iconColor={adminColors.warning} label="Pending Apps"          value={m.pendingApplications} change={m.pendingChange}       positive={false} />
      </View>

      {/* ── Charts Row ─────────────────────────────────────────────────────── */}
      <View style={styles.chartsRow}>
        {/* Disbursement trend */}
        <View style={[styles.card, { flex: 2 }]}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.cardTitle}>Disbursement Trend</Text>
              <Text style={styles.cardSub}>Monthly · Crore INR</Text>
            </View>
            <View style={styles.legend}>
              <View style={[styles.legendDot, { backgroundColor: adminColors.chartBlue }]} />
              <Text style={styles.legendText}>Previous</Text>
              <View style={[styles.legendDot, { backgroundColor: adminColors.accent }]} />
              <Text style={styles.legendText}>Current</Text>
            </View>
          </View>
          <BarChart data={disbursementTrend} />
        </View>

        {/* Risk distribution */}
        <View style={[styles.card, { flex: 1 }]}>
          <Text style={styles.cardTitle}>Portfolio Risk Split</Text>
          <Text style={[styles.cardSub, { marginBottom: 16 }]}>By credit segment</Text>
          {riskDistribution.map((r) => (
            <RiskRow key={r.label} {...r} />
          ))}
        </View>
      </View>

      {/* ── Bottom Row ─────────────────────────────────────────────────────── */}
      <View style={styles.chartsRow}>
        {/* Recent Activity */}
        <View style={[styles.card, { flex: 1.2 }]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Recent Activity</Text>
            <TouchableOpacity style={styles.viewAll}>
              <Text style={styles.viewAllText}>View all</Text>
              <Ionicons name="chevron-forward" size={12} color={adminColors.accent} />
            </TouchableOpacity>
          </View>
          {recentActivity.map((a) => {
            const { icon, color } = activityMap[a.type] || { icon: 'ellipse', color: adminColors.fgMuted };
            return (
              <View key={a.id} style={styles.actRow}>
                <View style={[styles.actIcon, { backgroundColor: `${color}18` }]}>
                  <Ionicons name={icon} size={14} color={color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.actMsg}>{a.message}</Text>
                  <Text style={styles.actMeta}>{a.user} · {a.time}</Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Quick Stats Cards */}
        <View style={[styles.statsCol, { flex: 0.8 }]}>
          {[
            { label: 'Auto-Approved', value: '38%', sub: 'of total applications', icon: 'checkmark-done-circle', color: adminColors.success },
            { label: 'Avg Credit Score', value: '701', sub: 'portfolio average', icon: 'star', color: adminColors.chartBlue },
            { label: 'SLA Breach Risk', value: '7', sub: 'applications at risk', icon: 'time', color: adminColors.warning },
            { label: 'Agents Online', value: '12', sub: 'of 18 total', icon: 'headset', color: adminColors.chartPurple },
          ].map((s) => (
            <View key={s.label} style={styles.quickStat}>
              <View style={[styles.quickIcon, { backgroundColor: `${s.color}18` }]}>
                <Ionicons name={s.icon} size={16} color={s.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.quickLabel}>{s.label}</Text>
                <Text style={styles.quickSub}>{s.sub}</Text>
              </View>
              <Text style={[styles.quickVal, { color: s.color }]}>{s.value}</Text>
            </View>
          ))}
        </View>
      </View>
    </AdminLayout>
  );
};

const styles = StyleSheet.create({
  kpiRow: {
    flexDirection: 'row',
    gap: 14,
    flexWrap: 'wrap',
  },
  chartsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  card: {
    backgroundColor: adminColors.card,
    borderRadius: adminColors.r16,
    borderWidth: 1,
    borderColor: adminColors.border,
    padding: 20,
    ...adminColors.shadowSm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: adminColors.fg,
    letterSpacing: -0.2,
  },
  cardSub: {
    fontSize: 11,
    color: adminColors.fgMuted,
    fontWeight: '500',
    marginTop: 3,
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 7,
    height: 7,
    borderRadius: 99,
  },
  legendText: {
    fontSize: 10,
    color: adminColors.fgMuted,
    fontWeight: '500',
    marginRight: 6,
  },
  viewAll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  viewAllText: {
    fontSize: 12,
    color: adminColors.accent,
    fontWeight: '600',
  },
  // Activity
  actRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.04)',
  },
  actIcon: {
    width: 30,
    height: 30,
    borderRadius: adminColors.r8,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  actMsg: {
    fontSize: 12,
    fontWeight: '600',
    color: adminColors.fg,
    lineHeight: 17,
  },
  actMeta: {
    fontSize: 10,
    color: adminColors.fgMuted,
    fontWeight: '500',
    marginTop: 3,
  },
  // Quick stats
  statsCol: {
    gap: 10,
  },
  quickStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: adminColors.card,
    borderWidth: 1,
    borderColor: adminColors.border,
    borderRadius: adminColors.r12,
    padding: 14,
    flex: 1,
    ...adminColors.shadowSm,
  },
  quickIcon: {
    width: 36,
    height: 36,
    borderRadius: adminColors.r8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: adminColors.fg,
  },
  quickSub: {
    fontSize: 10,
    color: adminColors.fgMuted,
    fontWeight: '500',
    marginTop: 2,
  },
  quickVal: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
});

export default OverviewPage;
