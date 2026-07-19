import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Switch, TextInput, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import adminColors from '../theme/adminColors';
import AdminLayout from '../components/AdminLayout';
import StatusBadge from '../components/StatusBadge';
import { platformConfig } from '../data/mockData';
import { apiRequest } from '../../../services/api';

// ─── Section Card ─────────────────────────────────────────────────────────────
const SectionCard = ({ title, sub, icon, children, badge }) => (
  <View style={styles.sectionCard}>
    <View style={styles.sectionHeader}>
      <View style={styles.sectionLeft}>
        <View style={[styles.sectionIcon, { backgroundColor: `${adminColors.accent}18` }]}>
          <Ionicons name={icon} size={16} color={adminColors.accent} />
        </View>
        <View>
          <Text style={styles.sectionTitle}>{title}</Text>
          {sub && <Text style={styles.sectionSub}>{sub}</Text>}
        </View>
      </View>
      {badge && <StatusBadge label={badge} variant="warning" size="sm" />}
    </View>
    <View style={styles.sectionBody}>{children}</View>
  </View>
);

const NumField = ({ label, value, suffix = '', onChange }) => {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.fieldInputWrap}>
        <TextInput
          style={styles.fieldInput}
          value={String(value)}
          onChangeText={onChange}
          keyboardType="numeric"
          placeholderTextColor={adminColors.fgMuted}
        />
        {suffix && <Text style={styles.fieldSuffix}>{suffix}</Text>}
      </View>
    </View>
  );
};

// ─── Toggle Row ───────────────────────────────────────────────────────────────
const ToggleRow = ({ label, sub, value }) => {
  const [on, setOn] = useState(value);
  return (
    <View style={styles.toggleRow}>
      <View style={{ flex: 1 }}>
        <Text style={styles.toggleLabel}>{label}</Text>
        {sub && <Text style={styles.toggleSub}>{sub}</Text>}
      </View>
      <Switch
        value={on}
        onValueChange={setOn}
        trackColor={{ false: adminColors.muted, true: `${adminColors.accent}50` }}
        thumbColor={on ? adminColors.accent : adminColors.fgMuted}
        ios_backgroundColor={adminColors.muted}
      />
    </View>
  );
};

// ─── Config Page ─────────────────────────────────────────────────────────────
const ConfigPage = ({ activeTab, onNavigate, searchQuery, onSearch }) => {
  const cfg = platformConfig;

  const handleSaveSettings = async () => {
    try {
      alert('Settings saved successfully!');
    } catch (e) {
      alert('Failed to save settings: ' + e.message);
    }
  };

  return (
    <AdminLayout activeTab={activeTab} onNavigate={onNavigate} searchQuery={searchQuery} onSearch={onSearch}>
      {/* Policy version banner */}
      <View style={styles.policyBanner}>
        <View style={styles.policyLeft}>
          <View style={styles.policyIconWrap}>
            <Ionicons name="document-text" size={20} color={adminColors.accent} />
          </View>
          <View>
            <Text style={styles.policyVersion}>Underwriting Policy {cfg.policyVersion}</Text>
            <Text style={styles.policySub}>
              Last published by {cfg.lastPublishedBy} on {cfg.lastPublishedOn}
            </Text>
          </View>
        </View>
        <View style={styles.policyRight}>
          {cfg.pendingChanges > 0 && (
            <View style={styles.pendingBadge}>
              <Ionicons name="ellipse" size={6} color={adminColors.warning} />
              <Text style={styles.pendingText}>{cfg.pendingChanges} pending changes</Text>
            </View>
          )}
          <TouchableOpacity style={styles.publishBtn} activeOpacity={0.8} onPress={handleSaveSettings}>
            <Ionicons name="cloud-upload-outline" size={14} color={adminColors.accentFg} />
            <Text style={styles.publishText}>Publish Changes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.historyBtn} activeOpacity={0.8}>
            <Ionicons name="time-outline" size={14} color={adminColors.fgSub} />
            <Text style={styles.historyText}>History</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.twoCol}>
        {/* Left Column */}
        <View style={styles.col}>
          {/* Underwriting Rules */}
          <SectionCard title="Underwriting Rules" sub="Core eligibility & limits" icon="list-outline" badge="Editable">
            <View style={styles.fieldGrid}>
              <NumField label="Min Credit Score" value={cfg.underwritingRules.minCreditScore} onChange={() => {}} />
              <NumField label="Auto-Approve Score" value={cfg.underwritingRules.autoApprovalScore} onChange={() => {}} />
              <NumField label="Auto-Reject Score" value={cfg.underwritingRules.autoRejectionScore} onChange={() => {}} />
              <NumField label="Max DTI Ratio" value={cfg.underwritingRules.maxDTIRatio} suffix="%" onChange={() => {}} />
              <NumField label="Min Loan Amount" value={cfg.underwritingRules.minLoanAmount / 1000} suffix="K" onChange={() => {}} />
              <NumField label="Max Loan Amount" value={cfg.underwritingRules.maxLoanAmount / 100000} suffix="L" onChange={() => {}} />
              <NumField label="Max Tenure" value={cfg.underwritingRules.maxTenureMonths} suffix="mo" onChange={() => {}} />
              <NumField label="Processing Fee" value={cfg.underwritingRules.processingFeePct} suffix="%" onChange={() => {}} />
            </View>
          </SectionCard>



          {/* Risk Thresholds */}
          <SectionCard title="Risk Thresholds" sub="System trigger levels" icon="shield-outline">
            <View style={styles.fieldGrid}>
              <NumField label="Low Risk Max Score"    value={cfg.riskThresholds.lowRiskMax} onChange={() => {}} />
              <NumField label="Medium Risk Max Score" value={cfg.riskThresholds.mediumRiskMax} onChange={() => {}} />
              <NumField label="High Risk Max Score"   value={cfg.riskThresholds.highRiskMax} onChange={() => {}} />
              <NumField label="NPL Trigger (%)"       value={cfg.riskThresholds.nplTrigger} suffix="%" onChange={() => {}} />
              <NumField label="SLA Breach (hrs)"      value={cfg.riskThresholds.slaBreach} suffix="h" onChange={() => {}} />
              <NumField label="SLA Warning (hrs)"     value={cfg.riskThresholds.slaWarning} suffix="h" onChange={() => {}} />
            </View>
          </SectionCard>
        </View>

        {/* Right Column */}
        <View style={styles.col}>
          {/* Rate Cards */}
          <SectionCard title="Rate Cards" sub="Segment-wise interest rates" icon="pricetag-outline">
            {cfg.rateCards.map((r) => (
              <View key={r.segment} style={styles.rateRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.rateSegment}>{r.segment}</Text>
                  <Text style={styles.rateTenure}>{r.tenure}</Text>
                </View>
                <View style={styles.rateRight}>
                  <View style={styles.rateTag}>
                    <Text style={styles.rateValue}>{r.rate}</Text>
                  </View>
                  <Text style={styles.rateProcess}>{r.processing} fee</Text>
                </View>
              </View>
            ))}
          </SectionCard>

          {/* Feature Flags */}
          <SectionCard title="Feature Flags" sub="Enable / disable platform capabilities" icon="toggle-outline" badge="Live">
            {Object.entries(cfg.features).map(([key, val]) => {
              const labels = {
                autoUnderwriting: { label: 'Auto Underwriting', sub: 'AI-powered credit decisions' },
                instantDisbursement: { label: 'Instant Disbursement', sub: 'Sub-60s loan payout' },
                dynamicPricing: { label: 'Dynamic Pricing', sub: 'Risk-based rate adjustment' },
                collectionAutomation: { label: 'Collection Automation', sub: 'Auto-reminders & escalation' },
                emailAlerts: { label: 'Email Alerts', sub: 'Transactional email notifications' },
                smsAlerts: { label: 'SMS Alerts', sub: 'SMS OTP & payment reminders' },
                whatsappAlerts: { label: 'WhatsApp Alerts', sub: 'WhatsApp Business messaging' },
              };
              const info = labels[key] || { label: key, sub: '' };
              return (
                <ToggleRow key={key} label={info.label} sub={info.sub} value={val} />
              );
            })}
          </SectionCard>
        </View>
      </View>
    </AdminLayout>
  );
};

const styles = StyleSheet.create({
  policyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: adminColors.card,
    borderRadius: adminColors.r16,
    borderWidth: 1,
    borderColor: adminColors.accentBorder,
    padding: 18,
    gap: 16,
    ...adminColors.shadowSm,
  },
  policyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  policyIconWrap: {
    width: 44,
    height: 44,
    borderRadius: adminColors.r12,
    backgroundColor: adminColors.accentDim,
    alignItems: 'center',
    justifyContent: 'center',
  },
  policyVersion: {
    fontSize: 15,
    fontWeight: '800',
    color: adminColors.fg,
    letterSpacing: -0.2,
  },
  policySub: {
    fontSize: 11,
    color: adminColors.fgMuted,
    fontWeight: '500',
    marginTop: 3,
  },
  policyRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  pendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: adminColors.warningDim,
    borderWidth: 1,
    borderColor: 'rgba(251,191,36,0.25)',
    borderRadius: adminColors.rFull,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  pendingText: {
    fontSize: 11,
    fontWeight: '700',
    color: adminColors.warning,
  },
  publishBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: adminColors.accent,
    borderRadius: adminColors.r8,
    paddingHorizontal: 16,
    paddingVertical: 9,
    ...adminColors.shadowGreen,
  },
  publishText: {
    fontSize: 12,
    fontWeight: '700',
    color: adminColors.accentFg,
  },
  historyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: adminColors.muted,
    borderWidth: 1,
    borderColor: adminColors.border,
    borderRadius: adminColors.r8,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  historyText: {
    fontSize: 12,
    fontWeight: '600',
    color: adminColors.fgSub,
  },
  twoCol: { flexDirection: 'row', gap: 16, alignItems: 'flex-start' },
  col: { flex: 1, gap: 16 },
  sectionCard: {
    backgroundColor: adminColors.card,
    borderRadius: adminColors.r16,
    borderWidth: 1,
    borderColor: adminColors.border,
    overflow: 'hidden',
    ...adminColors.shadowSm,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: adminColors.border,
  },
  sectionLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  sectionIcon: {
    width: 34,
    height: 34,
    borderRadius: adminColors.r8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: adminColors.fg },
  sectionSub: { fontSize: 10, color: adminColors.fgMuted, fontWeight: '500', marginTop: 2 },
  sectionBody: { padding: 16, gap: 10 },
  // Field grid
  fieldGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  field: { width: '47%', gap: 6 },
  fieldLabel: { fontSize: 10, color: adminColors.fgMuted, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.4 },
  fieldInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: adminColors.input,
    borderWidth: 1,
    borderColor: adminColors.border,
    borderRadius: adminColors.r8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    gap: 4,
  },
  fieldInput: { flex: 1, fontSize: 13, fontWeight: '700', color: adminColors.fg, outlineStyle: 'none' },
  fieldSuffix: { fontSize: 11, color: adminColors.fgMuted, fontWeight: '600' },
  // Rate cards
  rateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: adminColors.border,
  },
  rateSegment: { fontSize: 12, fontWeight: '700', color: adminColors.fg },
  rateTenure: { fontSize: 10, color: adminColors.fgMuted, fontWeight: '500', marginTop: 2 },
  rateRight: { alignItems: 'flex-end', gap: 3 },
  rateTag: {
    backgroundColor: adminColors.accentDim,
    borderWidth: 1,
    borderColor: adminColors.accentBorder,
    borderRadius: adminColors.r6,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  rateValue: { fontSize: 13, fontWeight: '800', color: adminColors.accent },
  rateProcess: { fontSize: 10, color: adminColors.fgMuted, fontWeight: '500' },
  // Toggle
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: adminColors.border,
  },
  toggleLabel: { fontSize: 12, fontWeight: '600', color: adminColors.fg },
  toggleSub: { fontSize: 10, color: adminColors.fgMuted, fontWeight: '500', marginTop: 2 },
});

export default ConfigPage;
