import { Stack } from 'expo-router';
import { colors } from '../../src/theme';

export const unstable_settings = {
  initialRouteName: 'login',
};

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.header },
        headerTintColor: '#fff',
      }}
    >
      <Stack.Screen name="login" options={{ title: 'Login' }} />
      <Stack.Screen name="cadastro" options={{ title: 'Criar conta' }} />
    </Stack>
  );
}
