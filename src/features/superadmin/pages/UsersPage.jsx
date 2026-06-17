import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import adminColors from '../theme/adminColors';
import AdminLayout from '../components/AdminLayout';
import AdminMetricCard from '../components/AdminMetricCard';
import AdminTable from '../components/AdminTable';
import StatusBadge, { getStatusVariant } from '../components/StatusBadge';
import { userStats, usersList } from '../data/mockData';

const FILTER_TABS = ['All', 'Active', 'Suspended', 'KYC Pending', 'Restricted'];

const getRiskVariant = (r) => {
  const s = (r || '').toLowerCase();
  if (s === 'low') return 'success';
  if (s === 'medium') return 'warning';
  if (s === 'high') return 'danger';
  if (s === 'critical') return 'critical';
  return 'muted';
};

const getKycVariant = (k) => {
  const s = (k || '').toLowerCase();
  if (s === 'tier-2') return 'success';
  if (s === 'tier-1') return 'warning';
  if (s === 'pending') return 'orange';
  return 'muted';
};

const COLUMNS = [
  {
    key: 'id',
    label: 'User ID',
    width: 100,
    render: (val) => <Text style={colStyles.id}>{val}</Text>,
  },
  {
    key: 'name',
    label: 'Name',
    flex: 1,
    render: (val, row) => (
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <View style={[colStyles.initials, { backgroundColor: `${adminColors.accent}18` }]}>
          <Text style={[colStyles.initialsText, { color: adminColors.accent }]}>
            {val.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </Text>
        </View>
        <View>
          <Text style={colStyles.name}>{val}</Text>
          <Text style={colStyles.sub}>{row.phone}</Text>
        </View>
      </View>
    ),
  },
  {
    key: 'kyc',
    label: 'KYC',
    width: 90,
    render: (val) => <StatusBadge label={val} variant={getKycVariant(val)} size="sm" />,
  },
  {
    key: 'creditScore',
    label: 'Score',
    width: 80,
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
    key: 'loanStatus',
    label: 'Loan Status',
    width: 110,
    render: (val) => <StatusBadge label={val} variant={getStatusVariant(val)} size="sm" dot />,
  },
  {
    key: 'status',
    label: 'Account Status',
    width: 120,
    render: (val) => <StatusBadge label={val} variant={getStatusVariant(val)} size="sm" dot />,
  },
  {
    key: 'joined',
    label: 'Joined',
    width: 110,
    render: (val) => <Text style={colStyles.date}>{val}</Text>,
  },
  {
    key: 'id',
    label: 'Actions',
    width: 110,
    render: (_, row) => (
      <View style={colStyles.actions}>
        <TouchableOpacity style={colStyles.btnView} activeOpacity={0.75}>
          <Text style={colStyles.btnViewText}>View</Text>
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
  score: { fontSize: 14, fontWeight: '800', letterSpacing: -0.5 },
  date: { fontSize: 11, color: adminColors.fgSub, fontWeight: '500' },
  initials: {
    width: 30,
    height: 30,
    borderRadius: adminColors.r8,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  initialsText: { fontSize: 11, fontWeight: '800' },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  btnView: {
    backgroundColor: adminColors.accentDim,
    borderWidth: 1,
    borderColor: adminColors.accentBorder,
    borderRadius: adminColors.r6,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  btnViewText: { fontSize: 11, fontWeight: '700', color: adminColors.accent },
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

const UsersPage = ({ activeTab, onNavigate, searchQuery, onSearch }) => {
  const [activeFilter, setActiveFilter] = useState('All');
  const stats = userStats;

  const filteredData = usersList.filter((row) => {
    const matchSearch = !searchQuery ||
      row.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.phone.includes(searchQuery);
    const matchFilter =
      activeFilter === 'All' ||
      row.status === activeFilter;
    return matchSearch && matchFilter;
  });

  return (
    <AdminLayout activeTab={activeTab} onNavigate={onNavigate} searchQuery={searchQuery} onSearch={onSearch}>
      {/* Stats */}
      <View style={styles.kpiRow}>
        <AdminMetricCard icon="people-outline"         iconColor={adminColors.chartBlue}   label="Total Borrowers"   value={stats.totalBorrowers}   />
        <AdminMetricCard icon="person-outline"         iconColor={adminColors.accent}       label="Active Borrowers"  value={stats.activeBorrowers}  change="+1,240" positive />
        <AdminMetricCard icon="shield-checkmark-outline" iconColor={adminColors.success}    label="KYC Tier-2"        value={stats.kycTier2}        />
        <AdminMetricCard icon="ban-outline"            iconColor={adminColors.danger}       label="Suspended"         value={stats.suspended}        />
        <AdminMetricCard icon="star-outline"           iconColor={adminColors.chartPurple}  label="Avg Credit Score"  value={stats.avgCreditScore}   />
        <AdminMetricCard icon="person-add-outline"     iconColor={adminColors.chartTeal}    label="New This Month"    value={stats.newThisMonth}     change="+382" positive />
      </View>

      {/* Table */}
      <View style={styles.tableCard}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableTitle}>Borrower Directory</Text>
          <View style={styles.rightTools}>
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
            <TouchableOpacity style={styles.addBtn} activeOpacity={0.8}>
              <Ionicons name="person-add-outline" size={13} color={adminColors.accentFg} />
              <Text style={styles.addBtnText}>Add User</Text>
            </TouchableOpacity>
          </View>
        </View>

        <AdminTable columns={COLUMNS} data={filteredData} />

        <View style={styles.tableFoot}>
          <Text style={styles.tableFootText}>Showing {filteredData.length} of {usersList.length} users</Text>
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
  rightTools: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  filterTabs: { flexDirection: 'row', gap: 4 },
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
  filterTabText: { fontSize: 11, fontWeight: '600', color: adminColors.fgMuted },
  filterTabTextActive: { color: adminColors.accent },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: adminColors.accent,
    borderRadius: adminColors.r8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    ...adminColors.shadowGreen,
  },
  addBtnText: { fontSize: 12, fontWeight: '700', color: adminColors.accentFg },
  tableFoot: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: adminColors.border,
  },
  tableFootText: { fontSize: 11, color: adminColors.fgMuted, fontWeight: '500' },
});

export default UsersPage;
