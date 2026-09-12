import { QueryClientProvider } from '@tanstack/react-query';
import { Stack, SplashScreen } from 'expo-router';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from '../src/contexts/AuthContext';
import { queryClient } from '../src/config/queryClient';
import { colors } from '../src/theme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SplashController />
        <RootNavigator />
      </AuthProvider>
    </QueryClientProvider>
  );
}

function SplashController() {
  const { isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  return null;
}

function RootNavigator() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.header },
        headerTintColor: '#fff',
      }}
    >
      <Stack.Protected guard={!!user}>
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Protected guard={!user}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
}
