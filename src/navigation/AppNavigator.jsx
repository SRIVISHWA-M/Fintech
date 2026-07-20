import React, { useState, useEffect, useRef } from 'react';
import { View, Platform, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import colors from '../theme/colors';
import { authStore } from '../store/authStore';

import LoginScreen from '../features/auth/pages/LoginPage';
import HomePage from '../features/dashboard/pages/HomePage';
import DashboardScreen from '../features/dashboard/pages/DashboardPage';
import LoansScreen from '../features/loans/pages/LoansPage';
import PersonalLoanDetailsPage from '../features/loans/pages/PersonalLoanDetailsPage';
import PaymentsScreen from '../features/payments/pages/PaymentsPage';
import ProfileScreen from '../features/profile/pages/ProfilePage';
import SuperAdminScreen from '../features/superadmin/SuperAdminScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Custom Tab Button with Spring Scale & Opacity transitions
const TabBarButton = ({ route, label, isFocused, onPress, onLongPress }) => {
  const scaleValue = useRef(new Animated.Value(1)).current;
  const opacityValue = useRef(new Animated.Value(isFocused ? 1 : 0.65)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleValue, {
        toValue: isFocused ? 1.15 : 1.0,
        useNativeDriver: true,
        friction: 5,
        tension: 40,
      }),
      Animated.timing(opacityValue, {
        toValue: isFocused ? 1.0 : 0.65,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isFocused]);



  const icons = {
    Dashboard: { active: 'analytics', inactive: 'analytics-outline' },
    Loans:     { active: 'card', inactive: 'card-outline' },
    Home:      { active: 'home', inactive: 'home-outline' },
    Payments:  { active: 'calendar', inactive: 'calendar-outline' },
    Profile:   { active: 'person', inactive: 'person-outline' },
  };

  const getIconName = () => {
    const iconConfig = icons[route.name];
    if (!iconConfig) return 'ellipse';
    return isFocused ? iconConfig.active : iconConfig.inactive;
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.tabButton}
      activeOpacity={0.7}
    >
      <Animated.View style={{ transform: [{ scale: scaleValue }], opacity: opacityValue, alignItems: 'center' }}>
        <View style={{
          width: 42,
          height: 28,
          borderRadius: 14,
          backgroundColor: isFocused ? 'rgba(255, 255, 255, 0.25)' : 'transparent',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 3,
          shadowColor: isFocused ? '#000' : 'transparent',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isFocused ? 0.1 : 0,
          shadowRadius: 3,
          elevation: isFocused ? 2 : 0,
        }}>
          <Ionicons
            name={getIconName()}
            size={18}
            color={isFocused ? '#0A4A28' : 'rgba(255,255,255,0.75)'}
          />
        </View>
        <Text style={[styles.tabLabel, { color: isFocused ? '#FFFFFF' : 'rgba(255,255,255,0.7)' }]}>
          {label}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

// Animated Custom Hovering Tab Bar component
const CustomTabBar = ({ state, descriptors, navigation }) => {
  return (
    <View style={styles.tabBarWrapper}>
      <View style={styles.tabContainer}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <TabBarButton
              key={route.key}
              route={route}
              label={label}
              isFocused={isFocused}
              onPress={onPress}
              onLongPress={onLongPress}
            />
          );
        })}
      </View>
    </View>
  );
};

const MainTabs = () => (
  <Tab.Navigator
    tabBar={(props) => <CustomTabBar {...props} />}
    screenOptions={{ headerShown: false }}
    initialRouteName="Home"
  >
    <Tab.Screen name="Dashboard" component={DashboardScreen} />
    <Tab.Screen name="Loans" component={LoansScreen} />
    <Tab.Screen name="Home" component={HomePage} />
    <Tab.Screen name="Payments" component={PaymentsScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

const linking = {
  prefixes: ['http://localhost:8081', 'http://localhost:19006', 'fintech://'],
  config: {
    screens: {
      SuperAdmin: 'super-admin',
      Main: {
        path: 'user',
        screens: {
          Home: '',
          Dashboard: 'dashboard',
          Loans: 'loans',
          Payments: 'payments',
          Profile: 'profile',
        },
      },
      PersonalLoanDetails: 'user/loan-details',
      Login: 'login',
    },
  },
};

const AppNavigator = () => {
  const [authState, setAuthState] = useState(authStore.getState());

  useEffect(() => {
    // Subscribe to auth state — automatically navigate when user logs in/out
    const unsubscribe = authStore.subscribe((state) => {
      setAuthState(state);
      
      // Fix for React Native Web: When auth state changes, if the URL is still /login,
      // React Navigation will render a blank screen because Login is no longer in the stack.
      // We manually update the URL to match the new stack's initial route.
      if (Platform.OS === 'web' && typeof window !== 'undefined' && state.isAuthenticated) {
        if (window.location.pathname === '/login' || window.location.pathname === '/') {
          const targetPath = state.user?.role?.toLowerCase() === 'superadmin' ? '/super-admin' : '/user';
          window.history.replaceState(null, '', targetPath);
        }
      }
    });
    return unsubscribe;
  }, []);

  const isAuthenticated = authState.isAuthenticated;
  const isSuperAdmin = authState.user?.role?.toLowerCase() === 'superadmin';

  if (!authState.isHydrated) {
    return <View style={{ flex: 1, backgroundColor: colors.background }} />;
  }

  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
      >
        {isAuthenticated && isSuperAdmin ? (
          <Stack.Screen name="SuperAdmin" component={SuperAdminScreen} />
        ) : isAuthenticated ? (
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen name="PersonalLoanDetails" component={PersonalLoanDetailsPage} />
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  tabBarWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: Platform.OS === 'ios' ? 88 : 74,
    backgroundColor: 'transparent',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  tabContainer: {
    width: '94%',
    maxWidth: 440,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(36, 185, 120, 0.45)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
    marginTop: 6,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  centerButtonOuter: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -14,
    width: 54,
    zIndex: 99,
  },
  centerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    elevation: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  tabLabel: {
    fontSize: 8.5,
    fontWeight: '700',
    marginTop: 2,
    letterSpacing: 0.1,
  }
});

export default AppNavigator;
