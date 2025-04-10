import { create } from 'zustand';
import { Platform } from 'react-native';

interface ThemeState {
  isDark: boolean;
  toggleTheme: () => void;
  colors: {
    background: string;
    surface: string;
    text: string;
    subtext: string;
    primary: string;
    border: string;
  };
}

export const useThemeStore = create<ThemeState>((set) => ({
  isDark: Platform.OS === 'web' ? window.matchMedia('(prefers-color-scheme: dark)').matches : false,
  toggleTheme: () => set((state) => {
    const isDark = !state.isDark;
    return {
      isDark,
      colors: getColors(isDark),
    };
  }),
  colors: getColors(Platform.OS === 'web' ? window.matchMedia('(prefers-color-scheme: dark)').matches : false),
}));

function getColors(isDark: boolean) {
  return {
    background: isDark ? '#0f172a' : '#f8fafc',
    surface: isDark ? '#1e293b' : '#ffffff',
    text: isDark ? '#f8fafc' : '#1e293b',
    subtext: isDark ? '#94a3b8' : '#64748b',
    primary: '#6366f1',
    border: isDark ? '#334155' : '#e2e8f0',
  };
}