import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import adminColors from '../theme/adminColors';
import { authService } from '../../../services/authService';

const NAV_ITEMS = [
  { key: 'overview', label: 'Overview', icon: 'grid-outline', iconActive: 'grid' },
  { key: 'underwriting', label: 'Underwriting Queue', icon: 'documents-outline', iconActive: 'documents', badge: 12 },
  { key: 'users', label: 'User Management', icon: 'people-outline', iconActive: 'people' },
  { key: 'loan', label: 'Loan Management', icon: 'layers-outline', iconActive: 'layers' },
  { key: 'collections', label: 'Collections', icon: 'wallet-outline', iconActive: 'wallet', badge: 3 },
  { key: 'config', label: 'Platform Config', icon: 'settings-outline', iconActive: 'settings' },
];

const DIVIDER_AFTER = ['overview'];

/**
 * AdminSidebar — fixed left navigation panel.
 *
 * Props:
 *   activeTab   — current page key
 *   onNavigate  — (key) => void
 */
const AdminSidebar = ({ activeTab, onNavigate }) => {
  return (
    <View style={styles.sidebar}>
      {/* Brand */}
      <View style={styles.brand}>
        <View style={styles.brandIcon}>
          <Ionicons name="flash" size={18} color={adminColors.accentFg} />
        </View>
        <View>
          <Text style={styles.brandName}>Hidel Finance</Text>
          <Text style={styles.brandRole}>Super Admin</Text>
        </View>
      </View>

      {/* Nav */}
      <ScrollView style={styles.nav} showsVerticalScrollIndicator={false}>
        <Text style={styles.navSection}>COMMAND CENTER</Text>
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.key;
          return (
            <React.Fragment key={item.key}>
              <TouchableOpacity
                style={[styles.navItem, isActive && styles.navItemActive]}
                onPress={() => onNavigate(item.key)}
                activeOpacity={0.75}
              >
                <Ionicons
                  name={isActive ? item.iconActive : item.icon}
                  size={18}
                  color={isActive ? adminColors.accent : adminColors.fgMuted}
                />
                <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>
                  {item.label}
                </Text>
                {item.badge ? (
                  <View style={[styles.badge, isActive && styles.badgeActive]}>
                    <Text style={[styles.badgeText, isActive && styles.badgeTextActive]}>
                      {item.badge}
                    </Text>
                  </View>
                ) : null}
                {isActive && <View style={styles.activeBar} />}
              </TouchableOpacity>

              {DIVIDER_AFTER.includes(item.key) && (
                <View style={styles.divider} />
              )}
            </React.Fragment>
          );
        })}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerDivider} />
        <View style={styles.adminProfile}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>AK</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.adminName}>Aanya K.</Text>
            <Text style={styles.adminRole}>Super Admin</Text>
          </View>
          <TouchableOpacity onPress={() => authService.logout()} activeOpacity={0.7}>
            <Ionicons name="log-out-outline" size={16} color={adminColors.fgMuted} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    width: adminColors.sidebarWidth,
    backgroundColor: adminColors.sidebar,
    borderRightWidth: 1,
    borderRightColor: adminColors.sidebarBorder,
    flexDirection: 'column',
    height: '100%',
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 18,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: adminColors.sidebarBorder,
  },
  brandIcon: {
    width: 34,
    height: 34,
    borderRadius: adminColors.r8,
    backgroundColor: adminColors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    ...adminColors.shadowGreen,
  },
  brandName: {
    fontSize: 14,
    fontWeight: '800',
    color: adminColors.fg,
    letterSpacing: -0.2,
  },
  brandRole: {
    fontSize: 10,
    color: adminColors.accent,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginTop: 1,
  },
  nav: {
    flex: 1,
    paddingTop: 12,
    paddingHorizontal: 12,
  },
  navSection: {
    fontSize: 9,
    fontWeight: '700',
    color: adminColors.fgMuted,
    letterSpacing: 1.2,
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginBottom: 4,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: adminColors.r8,
    marginBottom: 2,
    position: 'relative',
    overflow: 'hidden',
  },
  navItemActive: {
    backgroundColor: adminColors.accentDim,
  },
  navLabel: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: adminColors.fgMuted,
    letterSpacing: 0.1,
  },
  navLabelActive: {
    color: adminColors.accent,
    fontWeight: '700',
  },
  badge: {
    backgroundColor: adminColors.muted,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: adminColors.rFull,
  },
  badgeActive: {
    backgroundColor: adminColors.accentDimStrong,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: adminColors.fgMuted,
  },
  badgeTextActive: {
    color: adminColors.accent,
  },
  activeBar: {
    position: 'absolute',
    right: 0,
    top: 6,
    bottom: 6,
    width: 3,
    borderRadius: adminColors.rFull,
    backgroundColor: adminColors.accent,
  },
  divider: {
    height: 1,
    backgroundColor: adminColors.sidebarBorder,
    marginVertical: 10,
    marginHorizontal: 8,
  },
  footer: {
    paddingHorizontal: 12,
    paddingBottom: 14,
  },
  footerDivider: {
    height: 1,
    backgroundColor: adminColors.sidebarBorder,
    marginBottom: 12,
  },
  adminProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: adminColors.r8,
    backgroundColor: adminColors.muted,
    borderWidth: 1,
    borderColor: adminColors.border,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: adminColors.r8,
    backgroundColor: adminColors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 11,
    fontWeight: '800',
    color: adminColors.accentFg,
  },
  adminName: {
    fontSize: 12,
    fontWeight: '700',
    color: adminColors.fg,
  },
  adminRole: {
    fontSize: 10,
    color: adminColors.fgMuted,
    fontWeight: '500',
    marginTop: 1,
  },
});

export default AdminSidebar;
