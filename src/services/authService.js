import { apiRequest } from './api';
import { authStore } from '../store/authStore';

export const authService = {
  login: async () => {
    return apiRequest(authStore.getState().user).then(user => {
      authStore.login();
      return user;
    });
  },
  logout: async () => {
    return apiRequest(true).then(() => {
      authStore.logout();
    });
  },
  updateProfile: async (updates) => {
    return apiRequest(updates).then(data => {
      authStore.updateUser(data);
      return authStore.getState().user;
    });
  },
  updatePreferences: async (prefs) => {
    return apiRequest(prefs).then(data => {
      authStore.updatePreferences(data);
      return authStore.getState().user;
    });
  }
};
