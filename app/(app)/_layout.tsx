import { Stack } from 'expo-router';
import { useAuth } from '../../src/contexts/AuthContext';
import { colors } from '../../src/theme';

export default function AppLayout() {
  const { profile } = useAuth();
  const isVet = profile?.tipo === 'VETERINARIO';

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.header },
        headerTintColor: '#fff',
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Clyvet' }} />
      <Stack.Screen name="pets/index" options={{ title: 'Pets' }} />
      <Stack.Screen name="pets/form" options={{ title: 'Pet' }} />
      <Stack.Protected guard={isVet}>
        <Stack.Screen name="prontuarios/index" options={{ title: 'Prontuários' }} />
        <Stack.Screen name="prontuarios/form" options={{ title: 'Prontuário' }} />
      </Stack.Protected>
      <Stack.Screen name="perfil" options={{ title: 'Meu perfil' }} />
    </Stack>
  );
}
