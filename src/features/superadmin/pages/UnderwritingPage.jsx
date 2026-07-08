import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import adminColors from '../theme/adminColors';
import AdminLayout from '../components/AdminLayout';
import AdminMetricCard from '../components/AdminMetricCard';
import AdminTable from '../components/AdminTable';
import StatusBadge, { getStatusVariant } from '../components/StatusBadge';
import { underwritingStats, underwritingQueue } from '../data/mockData';

const FILTER_TABS = ['All', 'Critical', 'High Priority', 'Under Review', 'Approved', 'Rejected'];

const getRiskVariant = (risk) => {
  const r = (risk || '').toLowerCase();
  if (r === 'low') return 'success';
  if (r === 'medium') return 'warning';
  if (r === 'high') return 'danger';
  if (r === 'critical') return 'critical';
  return 'muted';
};

const getPriorityVariant = (priority) => {
  const p = (priority || '').toLowerCase();
  if (p === 'critical') return 'critical';
  if (p === 'high') return 'danger';
  return 'muted';
};

const COLUMNS = [
  {
    key: 'id',
    label: 'App ID',
    width: 100,
    render: (val) => <Text style={colStyles.id}>{val}</Text>,
  },
  {
    key: 'applicant',
    label: 'Applicant',
    flex: 1,
    render: (val, row) => (
      <View>
        <Text style={colStyles.name}>{val}</Text>
        <Text style={colStyles.sub}>{row.submitted}</Text>
      </View>
    ),
  },
  {
    key: 'amount',
    label: 'Amount',
    width: 110,
    render: (val) => <Text style={colStyles.amount}>{val}</Text>,
  },
  {
    key: 'score',
    label: 'Credit Score',
    width: 110,
    render: (val) => {
      const color = val >= 750 ? adminColors.success : val >= 680 ? adminColors.warning : adminColors.danger;
      return <Text style={[colStyles.score, { color }]}>{val}</Text>;
    },
  },
  {
    key: 'risk',
    label: 'Risk',
    width: 90,
    render: (val) => <StatusBadge label={val} variant={getRiskVariant(val)} size="sm" dot />,
  },
  {
    key: 'priority',
    label: 'Priority',
    width: 90,
    render: (val) => <StatusBadge label={val} variant={getPriorityVariant(val)} size="sm" />,
  },
  {
    key: 'status',
    label: 'Status',
    width: 130,
    render: (val) => <StatusBadge label={val} variant={getStatusVariant(val)} size="sm" dot />,
  },
  {
    key: 'assignee',
    label: 'Assignee',
    width: 110,
    render: (val) => <Text style={colStyles.assignee}>{val}</Text>,
  },
  {
    key: 'sla',
    label: 'SLA',
    width: 70,
    render: (val) => {
      if (val === '—') return <Text style={colStyles.slaOk}>Done</Text>;
      const hours = parseInt(val);
      const color = hours <= 2 ? adminColors.danger : hours <= 6 ? adminColors.warning : adminColors.fgSub;
      return <Text style={[colStyles.sla, { color }]}>{val}</Text>;
    },
  },
  {
    key: 'id',
    label: 'Actions',
    width: 110,
    render: (_, row) => (
      <View style={colStyles.actions}>
        <TouchableOpacity style={colStyles.btnApprove} activeOpacity={0.75}>
          <Text style={colStyles.btnApproveText}>Review</Text>
        </TouchableOpacity>
        <TouchableOpacity style={colStyles.btnIcon} activeOpacity={0.75}>
          <Ionicons name="ellipsis-horizontal" size={14} color={adminColors.fgMuted} />
        </TouchableOpacity>
      </View>
    ),
  },
];

const colStyles = StyleSheet.create({
  id: { fontSize: 11, fontWeight: '700', color: adminColors.accent, fontFamily: 'monospace' },
  name: { fontSize: 12, fontWeight: '700', color: adminColors.fg },
  sub: { fontSize: 10, color: adminColors.fgMuted, fontWeight: '500', marginTop: 2 },
  amount: { fontSize: 13, fontWeight: '700', color: adminColors.fg },
  score: { fontSize: 14, fontWeight: '800', letterSpacing: -0.5 },
  assignee: { fontSize: 12, fontWeight: '500', color: adminColors.fgSub },
  sla: { fontSize: 12, fontWeight: '700' },
  slaOk: { fontSize: 12, fontWeight: '500', color: adminColors.fgMuted },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  btnApprove: {
    backgroundColor: adminColors.accentDim,
    borderWidth: 1,
    borderColor: adminColors.accentBorder,
    borderRadius: adminColors.r6,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  btnApproveText: { fontSize: 11, fontWeight: '700', color: adminColors.accent },
  btnIcon: {
    width: 28,
    height: 28,
    borderRadius: adminColors.r6,
    backgroundColor: adminColors.muted,
    borderWidth: 1,
    borderColor: adminColors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const UnderwritingPage = ({ activeTab, onNavigate, searchQuery, onSearch }) => {
  const [activeFilter, setActiveFilter] = useState('All');
  const stats = underwritingStats;

  const filteredData = underwritingQueue.filter((row) => {
    const matchSearch = !searchQuery || row.applicant.toLowerCase().includes(searchQuery.toLowerCase()) || row.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchFilter =
      activeFilter === 'All' ||
      (activeFilter === 'Critical' && row.priority === 'Critical') ||
      (activeFilter === 'High Priority' && (row.priority === 'High' || row.priority === 'Critical')) ||
      row.status === activeFilter;
    return matchSearch && matchFilter;
  });

  return (
    <AdminLayout activeTab={activeTab} onNavigate={onNavigate} searchQuery={searchQuery} onSearch={onSearch}>
      {/* Stats */}
      <View style={styles.kpiRow}>
        <AdminMetricCard icon="documents-outline" iconColor={adminColors.chartBlue} label="Active Applications" value={stats.activeApplications} />
        <AdminMetricCard icon="layers-outline" iconColor={adminColors.accent} label="Total Exposure" value={stats.totalExposure} />
        <AdminMetricCard icon="time-outline" iconColor={adminColors.danger} label="SLA Breach Risk" value={stats.slaBreachRisk.toString()} change="-2" positive />
        <AdminMetricCard icon="hourglass-outline" iconColor={adminColors.warning} label="Avg Processing" value={stats.avgProcessingTime} />
        <AdminMetricCard icon="checkmark-circle-outline" iconColor={adminColors.success} label="Approval Rate" value={stats.approvalRate} />
        <AdminMetricCard icon="flash-outline" iconColor={adminColors.chartPurple} label="Auto-Approved" value={stats.autoApproved} />
      </View>

      {/* Filter tabs + table */}
      <View style={styles.tableCard}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableTitle}>Application Queue</Text>
          <View style={styles.filterTabs}>
            {FILTER_TABS.map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[styles.filterTab, activeFilter === tab && styles.filterTabActive]}
                onPress={() => setActiveFilter(tab)}
                activeOpacity={0.75}
              >
                <Text style={[styles.filterTabText, activeFilter === tab && styles.filterTabTextActive]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <AdminTable columns={COLUMNS} data={filteredData} />

        {/* Table footer */}
        <View style={styles.tableFoot}>
          <Text style={styles.tableFootText}>Showing {filteredData.length} of {underwritingQueue.length} applications</Text>
        </View>
      </View>
    </AdminLayout>
  );
};

const styles = StyleSheet.create({
  kpiRow: { flexDirection: 'row', gap: 14, flexWrap: 'wrap' },
  tableCard: {
    backgroundColor: adminColors.card,
    borderRadius: adminColors.r16,
    borderWidth: 1,
    borderColor: adminColors.border,
    overflow: 'hidden',
    ...adminColors.shadowSm,
  },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: adminColors.border,
    flexWrap: 'wrap',
    gap: 10,
  },
  tableTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: adminColors.fg,
  },
  filterTabs: {
    flexDirection: 'row',
    gap: 4,
  },
  filterTab: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: adminColors.rFull,
    borderWidth: 1,
    borderColor: adminColors.border,
    backgroundColor: adminColors.muted,
  },
  filterTabActive: {
    backgroundColor: adminColors.accentDim,
    borderColor: adminColors.accentBorder,
  },
  filterTabText: {
    fontSize: 11,
    fontWeight: '600',
    color: adminColors.fgMuted,
  },
  filterTabTextActive: {
    color: adminColors.accent,
  },
  tableFoot: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: adminColors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tableFootText: {
    fontSize: 11,
    color: adminColors.fgMuted,
    fontWeight: '500',
  },
});

export default UnderwritingPage;
