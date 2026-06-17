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

  const isHome = route.name === 'Home';

  // Highlight and raise the Home button as the center menu
  if (isHome) {
    return (
      <TouchableOpacity
        onPress={onPress}
        onLongPress={onLongPress}
        style={styles.centerButtonOuter}
        activeOpacity={0.85}
      >
        <Animated.View style={[
          styles.centerButton,
          {
            transform: [{ scale: scaleValue }],
            backgroundColor: isFocused ? colors.success : colors.cardElevated,
            borderColor: isFocused ? colors.success : colors.borderStrong,
            shadowColor: isFocused ? colors.success : '#000',
            shadowOpacity: isFocused ? 0.5 : 0.35,
            shadowRadius: isFocused ? 10 : 5,
          }
        ]}>
          <Ionicons
            name={isFocused ? 'home' : 'home-outline'}
            size={20}
            color={isFocused ? colors.successForeground : colors.foreground}
          />
        </Animated.View>
        <Text style={[styles.tabLabel, { color: isFocused ? colors.success : colors.mutedForeground, marginTop: 4 }]}>
          Home
        </Text>
      </TouchableOpacity>
    );
  }

  const icons = {
    Dashboard: { active: 'analytics', inactive: 'analytics-outline' },
    Loans:     { active: 'card', inactive: 'card-outline' },
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
        <Ionicons
          name={getIconName()}
          size={20}
          color={isFocused ? colors.success : colors.foregroundSecondary}
        />
        <Text style={[styles.tabLabel, { color: isFocused ? colors.success : colors.mutedForeground }]}>
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

const AppNavigator = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    authStore.getState().isAuthenticated
  );

  useEffect(() => {
    // Subscribe to auth state — automatically navigate when user logs in/out
    const unsubscribe = authStore.subscribe((state) => {
      setIsAuthenticated(state.isAuthenticated);
    });
    return unsubscribe;
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false, animation: 'fade' }}
      >
        {isAuthenticated ? (
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen
              name="SuperAdmin"
              component={SuperAdminScreen}
              options={{ animation: 'slide_from_right' }}
            />
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
    right: 0,
    height: Platform.OS === 'ios' ? 102 : 86,
    backgroundColor: colors.background,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  tabContainer: {
    width: '92%',
    height: 62,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
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
    fontSize: 9,
    fontWeight: '700',
    marginTop: 3,
    letterSpacing: 0.1,
  }
});

export default AppNavigator;
