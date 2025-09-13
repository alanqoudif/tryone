import { create } from 'zustand';
import storage from '../utils/storage';
import { COLORS, STORAGE_KEYS } from '../constants';
import type { Theme } from '../types';


type ThemeMode = 'dark' | 'light' | 'system';
type ThemeColors = typeof COLORS.DARK | typeof COLORS.LIGHT;

interface ThemeState {
  mode: ThemeMode;
  isDark: boolean;
  colors: ThemeColors;
  setTheme: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const getSystemTheme = (): boolean => {
  // In a real app, this would check system settings
  // For now, default to dark theme
  return true;
};

const getInitialTheme = (): ThemeMode => {
  const savedTheme = storage.getString(STORAGE_KEYS.THEME);
  return (savedTheme as ThemeMode) || 'dark';
};

const getIsDark = (mode: ThemeMode): boolean => {
  if (mode === 'system') {
    return getSystemTheme();
  }
  return mode === 'dark';
};

const getColors = (isDark: boolean): ThemeColors => {
  return isDark ? COLORS.DARK : COLORS.LIGHT;
};

export const useTheme = create<ThemeState>((set, get) => {
  const initialMode = getInitialTheme();
  const initialIsDark = getIsDark(initialMode);
  const initialColors = getColors(initialIsDark);

  return {
    mode: initialMode,
    isDark: initialIsDark,
    colors: initialColors,
    setTheme: (mode: ThemeMode) => {
      const isDark = getIsDark(mode);
      const colors = getColors(isDark);
      
      storage.set(STORAGE_KEYS.THEME, mode);
      
      set({
        mode,
        isDark,
        colors,
      });
    },
    toggleTheme: () => {
      const { mode } = get();
      const newMode = mode === 'dark' ? 'light' : 'dark';
      get().setTheme(newMode);
    },
  };
});

// Hook for easy access to theme values
export const useThemeColors = () => {
  const colors = useTheme(state => state.colors);
  return colors;
};

export const useIsDark = () => {
  const isDark = useTheme(state => state.isDark);
  return isDark;
};
