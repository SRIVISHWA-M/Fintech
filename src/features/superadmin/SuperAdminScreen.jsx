import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import adminColors from './theme/adminColors';
import OverviewPage from './pages/OverviewPage';
import UnderwritingPage from './pages/UnderwritingPage';
import UserManagementPage from './pages/UserManagementPage';
import CollectionsPage from './pages/CollectionsPage';
import ConfigPage from './pages/ConfigPage';

/**
 * SuperAdminScreen
 *
 * Self-contained super-admin shell. Manages its own page routing
 * with internal state so it can be dropped into any navigator as
 * a single screen node without extra Stack/Tab config.
 *
 * Usage:
 *   <Stack.Screen name="SuperAdmin" component={SuperAdminScreen} />
 */
const PAGES = {
  overview: OverviewPage,
  underwriting: UnderwritingPage,
  users: UserManagementPage,
  collections: CollectionsPage,
  config: ConfigPage,
};

const SuperAdminScreen = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');

  const handleNavigate = (key) => {
    setActiveTab(key);
    setSearchQuery('');   // clear search on page change
  };

  const PageComponent = PAGES[activeTab] || OverviewPage;

  return (
    <SafeAreaView style={styles.safe}>
      <PageComponent
        activeTab={activeTab}
        onNavigate={handleNavigate}
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: adminColors.bg,
  },
});

export default SuperAdminScreen;
