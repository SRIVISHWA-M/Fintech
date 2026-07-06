import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import adminColors from '../theme/adminColors';
import AdminLayout from '../components/AdminLayout';
import AdminMetricCard from '../components/AdminMetricCard';
import AdminTable from '../components/AdminTable';
import StatusBadge from '../components/StatusBadge';
import { userManagementStats, userManagementCustomers } from '../data/userManagementData';

const FILTER_TABS = ['All', 'Active', 'Paused', 'Suspended', 'KYC Pending'];

const getKycVariant = (kyc) => {
  const s = (kyc || '').toLowerCase();
  if (s === 'verified') return 'success';
  if (s === 'pending') return 'warning';
  if (s === 'rejected') return 'danger';
  return 'muted';
};

const getStatusVariant = (status) => {
  const s = (status || '').toLowerCase();
  if (s === 'active') return 'success';
  if (s === 'paused') return 'orange';
  if (s === 'suspended') return 'danger';
  return 'muted';
};

const getLoanTypeVariant = (type) => {
  const s = (type || '').toLowerCase();
  if (s === 'home loan') return 'info'; // blue
  if (s === 'personal loan') return 'orange';
  if (s === 'vehicle loan') return 'purple';
  if (s === 'business loan') return 'success'; // green
  return 'muted';
};

// ------------------------------------------------------------------
// Page Component
// ------------------------------------------------------------------
const UserManagementPage = ({ activeTab, onNavigate, searchQuery, onSearch }) => {
  const [customers, setCustomers] = useState(userManagementCustomers);
  const [activeFilter, setActiveFilter] = useState('All');
  
  // Modals state
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setViewModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Form State (used for Create & Edit)
  const [formData, setFormData] = useState({
    customerName: '', phone: '', email: '', kycStatus: 'Pending', status: 'Active',
    loanCount: '0', totalLoanAmount: '0', address: '', notes: ''
  });

  // Filter Data
  const filteredData = customers.filter((row) => {
    const matchSearch = !searchQuery || 
      row.id.toLowerCase().includes(searchQuery.toLowerCase());
      
    let matchFilter = activeFilter === 'All';
    if (activeFilter === 'Active') matchFilter = row.status === 'Active';
    if (activeFilter === 'Paused') matchFilter = row.status === 'Paused';
    if (activeFilter === 'Suspended') matchFilter = row.status === 'Suspended';
    if (activeFilter === 'KYC Pending') matchFilter = row.kycStatus === 'Pending';

    return matchSearch && matchFilter;
  });

  // ------------------------------------------------------------------
  // Handlers
  // ------------------------------------------------------------------
  const handlePause = (customer) => {
    setCustomers(prev => prev.map(c => c.id === customer.id ? { ...c, status: 'Paused' } : c));
  };

  const handleResume = (customer) => {
    setCustomers(prev => prev.map(c => c.id === customer.id ? { ...c, status: 'Active' } : c));
  };

  const openDeleteModal = (customer) => {
    setSelectedCustomer(customer);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedCustomer) {
      setCustomers(prev => prev.filter(c => c.id !== selectedCustomer.id));
    }
    setDeleteModalOpen(false);
    setSelectedCustomer(null);
  };

  const openViewModal = (customer) => {
    setSelectedCustomer(customer);
    setViewModalOpen(true);
  };

  const openCreateModal = () => {
    setFormData({
      customerName: '', phone: '', email: '', kycStatus: 'Pending', status: 'Active',
      loanCount: '0', totalLoanAmount: '0', address: '', notes: ''
    });
    setCreateModalOpen(true);
  };

  const openEditModal = (customer) => {
    setSelectedCustomer(customer);
    setFormData({
      customerName: customer.customerName,
      phone: customer.phone,
      email: customer.email,
      kycStatus: customer.kycStatus,
      status: customer.status,
      loanCount: String(customer.loanCount),
      totalLoanAmount: String(customer.totalLoanAmount),
      address: customer.address || '',
      notes: customer.notes || ''
    });
    setEditModalOpen(true);
  };

  const saveCustomer = () => {
    const parsedLoanCount = parseInt(formData.loanCount) || 0;
    const parsedTotalLoanAmount = parseInt(formData.totalLoanAmount) || 0;

    if (isCreateModalOpen) {
      const newId = `CUS-${1000 + customers.length + 1}`;
      const newCustomer = {
        id: newId,
        ...formData,
        loanCount: parsedLoanCount,
        totalLoanAmount: parsedTotalLoanAmount,
        createdDate: new Date().toISOString().split('T')[0],
        loans: [],
        transactions: []
      };
      setCustomers(prev => [newCustomer, ...prev]);
      setCreateModalOpen(false);
    } else if (isEditModalOpen && selectedCustomer) {
      setCustomers(prev => prev.map(c => 
        c.id === selectedCustomer.id ? {
          ...c,
          ...formData,
          loanCount: parsedLoanCount,
          totalLoanAmount: parsedTotalLoanAmount
        } : c
      ));
      setEditModalOpen(false);
      setSelectedCustomer(null);
    }
  };

  // ------------------------------------------------------------------
  // Table Columns
  // ------------------------------------------------------------------
  const COLUMNS = [
    {
      key: 'id',
      label: 'Customer ID',
      width: 100,
      render: (val) => <Text style={colStyles.id}>{val}</Text>,
    },
    {
      key: 'customerName',
      label: 'Name & Contact',
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
            <Text style={colStyles.subMuted}>{row.email}</Text>
          </View>
        </View>
      ),
    },
    {
      key: 'kycStatus',
      label: 'KYC Status',
      width: 90,
      render: (val) => <StatusBadge label={val} variant={getKycVariant(val)} size="sm" />,
    },
    {
      key: 'status',
      label: 'Status',
      width: 90,
      render: (val) => <StatusBadge label={val} variant={getStatusVariant(val)} size="sm" dot />,
    },
    {
      key: 'totalLoanAmount',
      label: 'Loans',
      width: 110,
      render: (val, row) => (
        <View>
          <Text style={colStyles.amt}>₹{val.toLocaleString()}</Text>
          <Text style={colStyles.sub}>{row.loanCount} Loan(s)</Text>
        </View>
      ),
    },
    {
      key: 'createdDate',
      label: 'Created Date',
      width: 90,
      render: (val) => <Text style={colStyles.date}>{val}</Text>,
    },
    {
      key: 'actions',
      label: 'Actions',
      width: 180,
      render: (_, row) => (
        <View style={colStyles.actions}>
          <TouchableOpacity style={colStyles.btnAction} onPress={() => openViewModal(row)}>
            <Text style={colStyles.btnActionText}>View</Text>
          </TouchableOpacity>
          <TouchableOpacity style={colStyles.btnAction} onPress={() => openEditModal(row)}>
            <Text style={colStyles.btnActionText}>Edit</Text>
          </TouchableOpacity>
          {row.status === 'Active' && (
             <TouchableOpacity style={colStyles.btnActionPause} onPress={() => handlePause(row)}>
               <Text style={colStyles.btnActionTextPause}>Pause</Text>
             </TouchableOpacity>
          )}
          {row.status === 'Paused' && (
             <TouchableOpacity style={colStyles.btnActionResume} onPress={() => handleResume(row)}>
               <Text style={colStyles.btnActionTextResume}>Resume</Text>
             </TouchableOpacity>
          )}
          <TouchableOpacity style={colStyles.btnIcon} onPress={() => openDeleteModal(row)}>
            <Ionicons name="trash-outline" size={14} color={adminColors.danger} />
          </TouchableOpacity>
        </View>
      ),
    },
  ];

  // ------------------------------------------------------------------
  // Render Modals Helper
  // ------------------------------------------------------------------
  const renderFormModal = (visible, title, onCancel, onSave) => (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{title}</Text>
          <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Customer Name</Text>
              <TextInput style={styles.input} value={formData.customerName} onChangeText={t => setFormData({...formData, customerName: t})} placeholder="John Doe" placeholderTextColor={adminColors.fgSub} />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <TextInput style={styles.input} value={formData.phone} onChangeText={t => setFormData({...formData, phone: t})} placeholder="+91 XXXXX XXXXX" placeholderTextColor={adminColors.fgSub} />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput style={styles.input} value={formData.email} onChangeText={t => setFormData({...formData, email: t})} placeholder="email@example.com" placeholderTextColor={adminColors.fgSub} />
            </View>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>KYC Status</Text>
                {/* Simplified as TextInput for mock purposes, ideally a dropdown */}
                <TextInput style={styles.input} value={formData.kycStatus} onChangeText={t => setFormData({...formData, kycStatus: t})} placeholder="Verified / Pending / Rejected" placeholderTextColor={adminColors.fgSub} />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>Status</Text>
                <TextInput style={styles.input} value={formData.status} onChangeText={t => setFormData({...formData, status: t})} placeholder="Active / Paused / Suspended" placeholderTextColor={adminColors.fgSub} />
              </View>
            </View>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>Loan Count</Text>
                <TextInput style={styles.input} keyboardType="numeric" value={formData.loanCount} onChangeText={t => setFormData({...formData, loanCount: t})} placeholder="0" placeholderTextColor={adminColors.fgSub} />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>Total Loan Amount</Text>
                <TextInput style={styles.input} keyboardType="numeric" value={formData.totalLoanAmount} onChangeText={t => setFormData({...formData, totalLoanAmount: t})} placeholder="0" placeholderTextColor={adminColors.fgSub} />
              </View>
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Address</Text>
              <TextInput style={styles.input} value={formData.address} onChangeText={t => setFormData({...formData, address: t})} placeholder="Address" placeholderTextColor={adminColors.fgSub} />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Notes</Text>
              <TextInput style={[styles.input, { height: 60 }]} multiline value={formData.notes} onChangeText={t => setFormData({...formData, notes: t})} placeholder="Any notes" placeholderTextColor={adminColors.fgSub} />
            </View>
          </ScrollView>
          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.btnCancel} onPress={onCancel}>
              <Text style={styles.btnCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnSave} onPress={onSave}>
              <Text style={styles.btnSaveText}>Save Customer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <AdminLayout activeTab={activeTab} onNavigate={onNavigate} searchQuery={searchQuery} onSearch={onSearch}>
      {/* Search Bar fallback context if AdminLayout doesn't supply it. AdminLayout does supply the top header. */}
      {/* We will rely on searchQuery prop provided by AdminLayout's header for the main search filtering. */}

      {/* Stats */}
      <View style={styles.kpiRow}>
        <AdminMetricCard icon="people-outline" iconColor={adminColors.chartBlue} label="Total Customers" value={userManagementStats.totalCustomers} />
        <AdminMetricCard icon="person-outline" iconColor={adminColors.success} label="Active Customers" value={userManagementStats.activeCustomers} />
        <AdminMetricCard icon="pause-outline" iconColor={adminColors.orange} label="Paused Customers" value={userManagementStats.pausedCustomers} />
        <AdminMetricCard icon="ban-outline" iconColor={adminColors.danger} label="Suspended" value={userManagementStats.suspendedCustomers} />
        <AdminMetricCard icon="wallet-outline" iconColor={adminColors.chartPurple} label="Loan Customers" value={userManagementStats.totalLoanCustomers} />
        <AdminMetricCard icon="person-add-outline" iconColor={adminColors.chartTeal} label="New This Month" value={userManagementStats.newCustomersThisMonth} />
      </View>

      {/* Table Section */}
      <View style={styles.tableCard}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableTitle}>Customer Directory</Text>
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
            <TouchableOpacity style={styles.addBtn} activeOpacity={0.8} onPress={openCreateModal}>
              <Ionicons name="person-add-outline" size={13} color={adminColors.accentFg} />
              <Text style={styles.addBtnText}>Add Customer</Text>
            </TouchableOpacity>
          </View>
        </View>

        {filteredData.length > 0 ? (
          <AdminTable columns={COLUMNS} data={filteredData} />
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={40} color={adminColors.fgMuted} />
            <Text style={styles.emptyTitle}>No customers found</Text>
            <Text style={styles.emptySub}>Try changing the search or filter criteria</Text>
          </View>
        )}

        <View style={styles.tableFoot}>
          <Text style={styles.tableFootText}>Showing {filteredData.length} of {customers.length} customers</Text>
        </View>
      </View>

      {/* Create Modal */}
      {renderFormModal(isCreateModalOpen, "Add Customer", () => setCreateModalOpen(false), saveCustomer)}

      {/* Edit Modal */}
      {renderFormModal(isEditModalOpen, "Edit Customer", () => { setEditModalOpen(false); setSelectedCustomer(null); }, saveCustomer)}

      {/* Delete Confirmation Modal */}
      <Modal visible={isDeleteModalOpen} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { maxWidth: 400 }]}>
            <Text style={styles.modalTitle}>Delete Customer</Text>
            <Text style={styles.modalText}>
              Are you sure you want to delete this customer? This action cannot be undone.
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.btnCancel} onPress={() => { setDeleteModalOpen(false); setSelectedCustomer(null); }}>
                <Text style={styles.btnCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btnSave, { backgroundColor: adminColors.danger }]} onPress={confirmDelete}>
                <Text style={[styles.btnSaveText, { color: '#fff' }]}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* View Details Modal */}
      <Modal visible={isViewModalOpen} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, styles.viewModalContent]}>
            <View style={styles.viewHeader}>
              <Text style={styles.modalTitle}>Customer Details</Text>
              <TouchableOpacity onPress={() => { setViewModalOpen(false); setSelectedCustomer(null); }}>
                <Ionicons name="close" size={24} color={adminColors.fgMuted} />
              </TouchableOpacity>
            </View>

            {selectedCustomer && (
              <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
                
                {/* Basic Info */}
                <Text style={styles.sectionTitle}>Basic Information</Text>
                <View style={styles.detailGrid}>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Customer ID</Text>
                    <Text style={styles.detailValue}>{selectedCustomer.id}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Name</Text>
                    <Text style={styles.detailValue}>{selectedCustomer.customerName}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Phone</Text>
                    <Text style={styles.detailValue}>{selectedCustomer.phone}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Email</Text>
                    <Text style={styles.detailValue}>{selectedCustomer.email}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Status</Text>
                    <StatusBadge label={selectedCustomer.status} variant={getStatusVariant(selectedCustomer.status)} size="sm" dot />
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>KYC Status</Text>
                    <StatusBadge label={selectedCustomer.kycStatus} variant={getKycVariant(selectedCustomer.kycStatus)} size="sm" />
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Join Date</Text>
                    <Text style={styles.detailValue}>{selectedCustomer.createdDate}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Address</Text>
                    <Text style={styles.detailValue}>{selectedCustomer.address}</Text>
                  </View>
                </View>

                {/* Loan Summary */}
                <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Loan Summary</Text>
                <View style={styles.summaryRow}>
                  <View style={styles.summaryBox}>
                    <Text style={styles.summaryLabel}>Total Loans</Text>
                    <Text style={styles.summaryVal}>{selectedCustomer.loanCount}</Text>
                  </View>
                  <View style={styles.summaryBox}>
                    <Text style={styles.summaryLabel}>Total Amount</Text>
                    <Text style={styles.summaryVal}>₹{selectedCustomer.totalLoanAmount.toLocaleString()}</Text>
                  </View>
                  <View style={styles.summaryBox}>
                    <Text style={styles.summaryLabel}>Active Amount</Text>
                    <Text style={styles.summaryVal}>₹{(selectedCustomer.totalLoanAmount * 0.8).toLocaleString()}</Text>
                  </View>
                  <View style={styles.summaryBox}>
                    <Text style={styles.summaryLabel}>Closed Loans</Text>
                    <Text style={styles.summaryVal}>{selectedCustomer.loans ? selectedCustomer.loans.filter(l => l.status === 'Closed').length : 0}</Text>
                  </View>
                </View>

                {/* Loan Details List */}
                <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Loan Records</Text>
                {selectedCustomer.loans && selectedCustomer.loans.length > 0 ? (
                  <View style={styles.listContainer}>
                    {selectedCustomer.loans.map((loan, i) => (
                      <View key={i} style={styles.listItemRow}>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.listId}>{loan.loanId}</Text>
                          <Text style={styles.listSub}>{loan.applicationDate}</Text>
                        </View>
                        <View style={{ flex: 1.5 }}>
                          <StatusBadge label={loan.loanType} variant={getLoanTypeVariant(loan.loanType)} size="sm" />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.listAmt}>₹{loan.loanAmount.toLocaleString()}</Text>
                        </View>
                        <View style={{ flex: 1, alignItems: 'flex-end' }}>
                          <Text style={[styles.listSub, { color: adminColors.fg, fontWeight: '600' }]}>{loan.status}</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                ) : (
                  <Text style={styles.noDataText}>No loan records found.</Text>
                )}

                {/* Transaction History */}
                <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Transaction History</Text>
                {selectedCustomer.transactions && selectedCustomer.transactions.length > 0 ? (
                  <View style={styles.listContainer}>
                    {selectedCustomer.transactions.map((txn, i) => (
                      <View key={i} style={styles.listItemRow}>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.listId}>{txn.transactionId}</Text>
                          <Text style={styles.listSub}>{txn.date}</Text>
                        </View>
                        <View style={{ flex: 1.5 }}>
                          <Text style={styles.listType}>{txn.type}</Text>
                          <Text style={styles.listSub}>{txn.paymentMethod}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.listAmt}>₹{txn.amount.toLocaleString()}</Text>
                        </View>
                        <View style={{ flex: 1, alignItems: 'flex-end' }}>
                          <StatusBadge label={txn.status} variant={txn.status === 'Success' ? 'success' : 'danger'} size="sm" />
                        </View>
                      </View>
                    ))}
                  </View>
                ) : (
                  <Text style={styles.noDataText}>No transactions found.</Text>
                )}

                <View style={{ height: 40 }} />
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

    </AdminLayout>
  );
};

const colStyles = StyleSheet.create({
  id: { fontSize: 11, fontWeight: '700', color: adminColors.accent, fontFamily: 'monospace' },
  name: { fontSize: 12, fontWeight: '700', color: adminColors.fg },
  sub: { fontSize: 10, color: adminColors.fgMuted, fontWeight: '500', marginTop: 2 },
  subMuted: { fontSize: 9, color: adminColors.fgSub, marginTop: 1 },
  amt: { fontSize: 13, fontWeight: '800', letterSpacing: -0.5, color: adminColors.fg },
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
  btnAction: {
    backgroundColor: adminColors.muted,
    borderWidth: 1,
    borderColor: adminColors.border,
    borderRadius: adminColors.r6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  btnActionText: { fontSize: 10, fontWeight: '700', color: adminColors.fg },
  btnActionPause: {
    backgroundColor: adminColors.orangeDim,
    borderWidth: 1,
    borderColor: 'rgba(251,146,60,0.25)',
    borderRadius: adminColors.r6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  btnActionTextPause: { fontSize: 10, fontWeight: '700', color: adminColors.orange },
  btnActionResume: {
    backgroundColor: adminColors.successDim,
    borderWidth: 1,
    borderColor: adminColors.accentBorder,
    borderRadius: adminColors.r6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  btnActionTextResume: { fontSize: 10, fontWeight: '700', color: adminColors.success },
  btnIcon: {
    width: 26,
    height: 26,
    borderRadius: adminColors.r6,
    backgroundColor: adminColors.dangerDim,
    borderWidth: 1,
    borderColor: adminColors.dangerBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const styles = StyleSheet.create({
  kpiRow: { flexDirection: 'row', gap: 14, flexWrap: 'wrap' },
  tableCard: {
    backgroundColor: adminColors.card,
    borderRadius: adminColors.r16,
    borderWidth: 1,
    borderColor: adminColors.border,
    overflow: 'hidden',
    ...adminColors.shadowSm,
    flex: 1,
    minHeight: 400,
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
  emptyState: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: adminColors.fg,
    marginTop: 12,
  },
  emptySub: {
    fontSize: 13,
    color: adminColors.fgSub,
    marginTop: 4,
  },
  
  // Modals styling
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: adminColors.card,
    borderRadius: adminColors.r12,
    borderWidth: 1,
    borderColor: adminColors.border,
    width: '100%',
    maxWidth: 500,
    maxHeight: '90%',
    padding: 20,
    ...adminColors.shadowSm,
  },
  viewModalContent: {
    maxWidth: 700,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: adminColors.fg,
    marginBottom: 16,
  },
  modalText: {
    fontSize: 13,
    color: adminColors.fgSub,
    marginBottom: 20,
    lineHeight: 20,
  },
  modalScroll: {
    maxHeight: '100%',
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: adminColors.fgMuted,
    marginBottom: 6,
  },
  input: {
    backgroundColor: adminColors.bg,
    borderWidth: 1,
    borderColor: adminColors.border,
    borderRadius: adminColors.r8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: adminColors.fg,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: adminColors.border,
  },
  btnCancel: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: adminColors.r8,
    backgroundColor: adminColors.muted,
  },
  btnCancelText: {
    fontSize: 13,
    fontWeight: '600',
    color: adminColors.fg,
  },
  btnSave: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: adminColors.r8,
    backgroundColor: adminColors.accent,
  },
  btnSaveText: {
    fontSize: 13,
    fontWeight: '700',
    color: adminColors.accentFg,
  },
  
  // View Details styling
  viewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: adminColors.fg,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: adminColors.border,
    paddingBottom: 6,
  },
  detailGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  detailItem: {
    width: '45%',
  },
  detailLabel: {
    fontSize: 11,
    color: adminColors.fgSub,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '600',
    color: adminColors.fg,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  summaryBox: {
    flex: 1,
    minWidth: 120,
    backgroundColor: adminColors.bg,
    padding: 12,
    borderRadius: adminColors.r8,
    borderWidth: 1,
    borderColor: adminColors.border,
  },
  summaryLabel: {
    fontSize: 11,
    color: adminColors.fgMuted,
  },
  summaryVal: {
    fontSize: 16,
    fontWeight: '800',
    color: adminColors.fg,
    marginTop: 4,
  },
  listContainer: {
    borderWidth: 1,
    borderColor: adminColors.border,
    borderRadius: adminColors.r8,
    overflow: 'hidden',
  },
  listItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: adminColors.border,
    backgroundColor: adminColors.bg,
  },
  listId: { fontSize: 12, fontWeight: '700', color: adminColors.accent, fontFamily: 'monospace' },
  listSub: { fontSize: 10, color: adminColors.fgSub, marginTop: 2 },
  listType: { fontSize: 12, fontWeight: '600', color: adminColors.fg },
  listAmt: { fontSize: 13, fontWeight: '700', color: adminColors.fg },
  noDataText: {
    fontSize: 13,
    color: adminColors.fgSub,
    fontStyle: 'italic',
    padding: 10,
  }
});

export default UserManagementPage;
