import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Animated, TouchableWithoutFeedback, useWindowDimensions } from 'react-native';
import adminColors from '../theme/adminColors';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

/**
 * AdminLayout — shell that wraps super-admin pages with collapsible sidebar.
 */
const AdminLayout = ({
  activeTab,
  onNavigate,
  onSearch,
  searchQuery,
  children,
}) => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;

  // Drawer sidebar state for mobile/tablet
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarAnim = useRef(new Animated.Value(-adminColors.sidebarWidth)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;

  // Hover expansion state for desktop
  const [isHovered, setIsHovered] = useState(false);
  const desktopSidebarWidth = useRef(new Animated.Value(76)).current;

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleNavigate = (key) => {
    onNavigate(key);
    setIsSidebarOpen(false);
  };

  // Mobile drawer animation
  useEffect(() => {
    if (!isDesktop) {
      Animated.parallel([
        Animated.timing(sidebarAnim, {
          toValue: isSidebarOpen ? 0 : -adminColors.sidebarWidth,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(overlayAnim, {
          toValue: isSidebarOpen ? 1 : 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isSidebarOpen, isDesktop]);

  // Desktop hover width animation
  useEffect(() => {
    if (isDesktop) {
      Animated.timing(desktopSidebarWidth, {
        toValue: isHovered ? 240 : 76,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  }, [isHovered, isDesktop]);

  return (
    <View style={styles.root}>
      {/* Desktop Sidebar (Permanent Collapsible Rail) */}
      {isDesktop && (
        <Animated.View
          style={[
            styles.desktopSidebarContainer,
            { width: desktopSidebarWidth },
            isHovered && styles.shadowExpanded,
          ]}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <AdminSidebar
            activeTab={activeTab}
            onNavigate={onNavigate}
            isExpanded={isHovered}
          />
        </Animated.View>
      )}

      {/* Main Area */}
      <View style={[styles.main, isDesktop && { marginLeft: 76 }]}>
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

      {/* Mobile/Tablet Overlay */}
      {!isDesktop && isSidebarOpen && (
        <Animated.View style={[styles.overlay, { opacity: overlayAnim }]}>
          <TouchableWithoutFeedback onPress={() => setIsSidebarOpen(false)}>
            <View style={StyleSheet.absoluteFill} />
          </TouchableWithoutFeedback>
        </Animated.View>
      )}

      {/* Mobile/Tablet Sidebar Drawer */}
      {!isDesktop && (
        <Animated.View
          style={[
            styles.sidebarContainer,
            { transform: [{ translateX: sidebarAnim }] },
          ]}
        >
          <AdminSidebar
            activeTab={activeTab}
            onNavigate={handleNavigate}
            isExpanded={true}
          />
        </Animated.View>
      )}
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
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  desktopSidebarContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    zIndex: 30,
    overflow: 'hidden',
  },
  shadowExpanded: {
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
  },
});

export default AdminLayout;
