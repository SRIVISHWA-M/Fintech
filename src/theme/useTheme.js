import { useState, useEffect } from 'react';
import { authStore } from '../store/authStore';
import { darkColors, lightColors } from './colors';

export const useTheme = () => {
  const [auth, setAuth] = useState(authStore.getState());
  
  useEffect(() => {
    return authStore.subscribe(setAuth);
  }, []);

  const isDark = auth.user?.preferences?.darkMode ?? true;
  const colors = isDark ? darkColors : lightColors;

  return { colors, isDark };
};
