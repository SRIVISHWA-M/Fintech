import React from 'react';
import { View, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import colors from '../theme/colors';

import LoginScreen from '../features/auth/pages/LoginPage';
import DashboardScreen from '../features/dashboard/pages/DashboardPage';
import LoansScreen from '../features/loans/pages/LoansPage';
import PaymentsScreen from '../features/payments/pages/PaymentsPage';
import ProfileScreen from '../features/profile/pages/ProfilePage';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TAB_ICONS = {
  Dashboard: { active: 'grid', inactive: 'grid-outline' },
  Loans:     { active: 'card', inactive: 'card-outline' },
  Payments:  { active: 'calendar', inactive: 'calendar-outline' },
  Profile:   { active: 'person', inactive: 'person-outline' },
};

const TAB_LABELS = {
  Dashboard: 'Home',
  Loans: 'Loans',
  Payments: 'Payments',
  Profile: 'Profile',
};

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarStyle: {
        backgroundColor: colors.card,
        borderTopColor: colors.border,
        borderTopWidth: 1,
        height: Platform.OS === 'ios' ? 88 : 74,
        paddingBottom: Platform.OS === 'ios' ? 26 : 14,
        paddingTop: 8,
        elevation: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
      },
      tabBarActiveTintColor: colors.success,
      tabBarInactiveTintColor: colors.mutedForeground,
      tabBarLabelStyle: {
        fontSize: 11,
        fontWeight: '600',
        letterSpacing: 0.2,
        marginTop: 2,
      },
      tabBarLabel: TAB_LABELS[route.name],
      tabBarIcon: ({ focused, color }) => {
        const icons = TAB_ICONS[route.name];
        return (
          <View style={{
            alignItems: 'center',
            justifyContent: 'center',
            width: 44,
            height: 32,
            borderRadius: 10,
            backgroundColor: focused ? colors.successDim : 'transparent',
          }}>
            <Ionicons
              name={focused ? icons.active : icons.inactive}
              size={22}
              color={color}
            />
          </View>
        );
      },
    })}
  >
    <Tab.Screen name="Dashboard" component={DashboardScreen} />
    <Tab.Screen name="Loans" component={LoansScreen} />
    <Tab.Screen name="Payments" component={PaymentsScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{ headerShown: false, animation: 'fade' }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Main" component={MainTabs} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;
