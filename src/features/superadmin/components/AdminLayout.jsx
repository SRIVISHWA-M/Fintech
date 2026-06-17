import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import adminColors from '../theme/adminColors';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

/**
 * AdminLayout — reusable shell that wraps every super-admin page.
 *
 * Props:
 *   activeTab     — current route key
 *   onNavigate    — (key) => void
 *   onSearch      — (text) => void
 *   searchQuery   — string
 *   children      — page content
 */
const AdminLayout = ({
  activeTab,
  onNavigate,
  onSearch,
  searchQuery,
  children,
}) => {
  return (
    <View style={styles.root}>
      {/* Sidebar */}
      <AdminSidebar activeTab={activeTab} onNavigate={onNavigate} />

      {/* Main area */}
      <View style={styles.main}>
        {/* Header */}
        <AdminHeader
          activeTab={activeTab}
          onSearch={onSearch}
          searchQuery={searchQuery}
        />

        {/* Scrollable page content */}
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentInner}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: adminColors.bg,
  },
  main: {
    flex: 1,
    flexDirection: 'column',
    overflow: 'hidden',
  },
  content: {
    flex: 1,
  },
  contentInner: {
    padding: 24,
    paddingBottom: 40,
    gap: 20,
  },
});

export default AdminLayout;
