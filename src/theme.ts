export type ThemeScheme = 'light' | 'dark';

export type ThemeColors = {
  background: string;
  card: string;
  text: string;
  muted: string;
  primary: string;
  success: string;
  danger: string;
  border: string;
  header: string;
};

export const palettes: Record<ThemeScheme, ThemeColors> = {
  light: {
    background: '#F4F6F8',
    card: '#FFFFFF',
    text: '#1F2933',
    muted: '#6B7280',
    primary: '#1D4ED8',
    success: '#15803D',
    danger: '#DC2626',
    border: '#E5E7EB',
    header: '#121212',
  },
  dark: {
    background: '#0F1419',
    card: '#1A2332',
    text: '#F3F4F6',
    muted: '#9CA3AF',
    primary: '#60A5FA',
    success: '#34D399',
    danger: '#F87171',
    border: '#374151',
    header: '#070A0E',
  },
};

export const spacing = {
  screen: 20,
  gap: 12,
};
