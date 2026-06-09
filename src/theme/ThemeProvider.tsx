import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, ColorScheme, ThemeColors } from './colors';

type ThemeMode = 'system' | 'light' | 'dark';

interface ThemeContextValue {
  mode: ThemeMode;
  scheme: ColorScheme;
  colors: ThemeColors;
  isDark: boolean;
  setMode: (mode: ThemeMode) => void;
  toggleLowLight: () => void;
}

const STORAGE_KEY = '@homewood/theme-mode';

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const system = useSystemColorScheme() ?? 'light';
  const [mode, setModeState] = useState<ThemeMode>('system');

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (stored === 'light' || stored === 'dark' || stored === 'system') {
        setModeState(stored);
      }
    });
  }, []);

  const setMode = (next: ThemeMode) => {
    setModeState(next);
    void AsyncStorage.setItem(STORAGE_KEY, next);
  };

  const scheme: ColorScheme = mode === 'system' ? (system as ColorScheme) : mode;

  const value = useMemo<ThemeContextValue>(
    () => ({
      mode,
      scheme,
      colors: colors[scheme],
      isDark: scheme === 'dark',
      setMode,
      toggleLowLight: () => setMode(scheme === 'dark' ? 'light' : 'dark'),
    }),
    [mode, scheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
}
