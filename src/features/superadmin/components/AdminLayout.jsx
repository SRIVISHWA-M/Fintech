import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Animated, TouchableWithoutFeedback } from 'react-native';
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarAnim = useRef(new Animated.Value(-adminColors.sidebarWidth)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleNavigate = (key) => {
    onNavigate(key);
    setIsSidebarOpen(false);
  };

  useEffect(() => {
    Animated.parallel([
      Animated.timing(sidebarAnim, {
        toValue: isSidebarOpen ? 0 : -adminColors.sidebarWidth,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(overlayAnim, {
        toValue: isSidebarOpen ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isSidebarOpen]);

  return (
    <View style={styles.root}>
      {/* Main area */}
      <View style={styles.main}>
        {/* Header */}
        <AdminHeader
          activeTab={activeTab}
          onSearch={onSearch}
          searchQuery={searchQuery}
          onToggleSidebar={toggleSidebar}
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

      {/* Overlay */}
      {isSidebarOpen && (
        <Animated.View style={[styles.overlay, { opacity: overlayAnim }]}>
          <TouchableWithoutFeedback onPress={() => setIsSidebarOpen(false)}>
            <View style={StyleSheet.absoluteFill} />
          </TouchableWithoutFeedback>
        </Animated.View>
      )}

      {/* Sidebar as Drawer */}
      <Animated.View
        style={[
          styles.sidebarContainer,
          { transform: [{ translateX: sidebarAnim }] },
        ]}
      >
        <AdminSidebar activeTab={activeTab} onNavigate={handleNavigate} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
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
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 10,
  },
  sidebarContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: adminColors.sidebarWidth,
    zIndex: 20,
    backgroundColor: adminColors.sidebar,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default AdminLayout;
