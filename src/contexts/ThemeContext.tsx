import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react';
import { useColorScheme } from 'react-native';
import { palettes, type ThemeColors, type ThemeScheme } from '../theme';

const THEME_KEY = '@clyvet/theme';

type ThemePreference = ThemeScheme | 'system';

type ThemeContextValue = {
  preference: ThemePreference;
  scheme: ThemeScheme;
  colors: ThemeColors;
  setPreference: (preference: ThemePreference) => Promise<void>;
  toggleScheme: () => Promise<void>;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function resolveScheme(preference: ThemePreference, system: ThemeScheme): ThemeScheme {
  if (preference === 'system') {
    return system;
  }
  return preference;
}

export function ThemeProvider({ children }: PropsWithChildren) {
  const systemScheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const [preference, setPreferenceState] = useState<ThemePreference>('system');

  useEffect(() => {
    AsyncStorage.getItem(THEME_KEY).then((stored) => {
      if (stored === 'light' || stored === 'dark' || stored === 'system') {
        setPreferenceState(stored);
      }
    });
  }, []);

  async function setPreference(next: ThemePreference) {
    setPreferenceState(next);
    await AsyncStorage.setItem(THEME_KEY, next);
  }

  async function toggleScheme() {
    const current = resolveScheme(preference, systemScheme);
    await setPreference(current === 'dark' ? 'light' : 'dark');
  }

  const scheme = resolveScheme(preference, systemScheme);
  const colors = palettes[scheme];

  const value = useMemo(
    () => ({
      preference,
      scheme,
      colors,
      setPreference,
      toggleScheme,
    }),
    [preference, scheme, colors]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme deve ser usado dentro de ThemeProvider');
  }
  return context;
}
