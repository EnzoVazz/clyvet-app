import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../src/contexts/AuthContext';
import { PrimaryButton } from '../../src/components/PrimaryButton';
import { colors } from '../../src/theme';
import { getApiBaseUrl } from '../../src/services/api';

export default function HomeScreen() {
  const { profile, user, signOut } = useAuth();
  const isTutor = profile?.tipo !== 'VETERINARIO';
  const accent = isTutor ? colors.primary : colors.success;

  return (
    <View style={styles.container}>
      <Text style={[styles.kicker, { color: accent }]}>
        {isTutor ? 'Área do Tutor' : 'Área do Veterinário'}
      </Text>
      <Text style={styles.title}>Olá, {profile?.nome ?? user?.displayName ?? 'bem-vindo'}</Text>
      <Text style={styles.subtitle}>
        {isTutor
          ? 'Aqui você acompanha somente os pets cadastrados na sua conta.'
          : 'Aqui você vê todos os pets da clínica e atualiza os prontuários.'}
      </Text>

      <Pressable style={[styles.card, { borderLeftColor: accent }]} onPress={() => router.push('/pets')}>
        <Text style={styles.cardTitle}>{isTutor ? 'Meus pets' : 'Todos os pets'}</Text>
        <Text style={styles.cardText}>
          {isTutor
            ? 'Cadastrar, consultar, editar e excluir os seus animais.'
            : 'Consultar a base completa e manter o cadastro dos animais.'}
        </Text>
      </Pressable>

      {!isTutor ? (
        <Pressable style={[styles.card, { borderLeftColor: accent }]} onPress={() => router.push('/prontuarios')}>
          <Text style={styles.cardTitle}>Prontuários</Text>
          <Text style={styles.cardText}>Registrar diagnósticos e atualizar o histórico clínico.</Text>
        </Pressable>
      ) : null}

      <Pressable style={[styles.card, { borderLeftColor: accent }]} onPress={() => router.push('/perfil')}>
        <Text style={styles.cardTitle}>Meu perfil</Text>
        <Text style={styles.cardText}>Ver dados da sessão, sair ou excluir a conta.</Text>
      </Pressable>

      <Text style={styles.api}>API: {getApiBaseUrl()}</Text>
      <PrimaryButton title="SAIR DA CONTA" variant="danger" onPress={signOut} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
    gap: 12,
  },
  kicker: {
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    color: colors.muted,
    marginBottom: 8,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 6,
    gap: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  cardText: {
    color: colors.muted,
  },
  api: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 'auto',
  },
});
