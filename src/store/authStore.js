import AsyncStorage from '@react-native-async-storage/async-storage';

const DEFAULT_USER = {
  name: 'Aarav Shah',
  customerId: 'NV-48211',
  email: 'aarav.shah@example.com',
  role: 'user',
  phone: '+91 98765 43421',
  phoneMasked: '+91 98••• ••421',
  kycStatus: 'verified',
  activeLoans: 1,
  onTimeRate: 100,
  creditScore: 782,
  preferences: {
    darkMode: true,
    notifications: true,
    loginAlerts: true,
  },
};

let listeners = [];
let state = { user: null, isAuthenticated: false };

// Load persisted state asynchronously at startup
AsyncStorage.getItem('nova_user').then((json) => {
  if (json) {
    state = { user: JSON.parse(json), isAuthenticated: true };
    notify();
  }
});

const notify = () => {
  listeners.forEach((listener) => listener(state));
};

export const authStore = {
  getState() {
    return state;
  },
  subscribe(listener) {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  },
  updateUser(updates) {
    state = { ...state, user: { ...state.user, ...updates } };
    AsyncStorage.setItem('nova_user', JSON.stringify(state.user));
    notify();
  },
  updatePreferences(prefUpdates) {
    state = {
      ...state,
      user: {
        ...state.user,
        preferences: { ...state.user.preferences, ...prefUpdates },
      },
    };
    AsyncStorage.setItem('nova_user', JSON.stringify(state.user));
    notify();
  },
  logout() {
    state = { user: null, isAuthenticated: false };
    AsyncStorage.removeItem('nova_user');
    notify();
  },
  login() {
    state = { user: DEFAULT_USER, isAuthenticated: true };
    AsyncStorage.setItem('nova_user', JSON.stringify(DEFAULT_USER));
    notify();
  },
  // Called after a successful real API login with backend user data
  setUser(userData) {
    const baseUser = userData?.role === 'superadmin' ? {} : DEFAULT_USER;
    state = { user: { ...baseUser, ...userData }, isAuthenticated: true };
    AsyncStorage.setItem('nova_user', JSON.stringify(state.user));
    notify();
  },
};
