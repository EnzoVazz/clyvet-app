import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../src/contexts/AuthContext';
import { useTheme } from '../../src/contexts/ThemeContext';
import { PrimaryButton } from '../../src/components/PrimaryButton';
import { getApiBaseUrl } from '../../src/services/api';

export default function HomeScreen() {
  const { profile, user, signOut } = useAuth();
  const { colors } = useTheme();
  const isTutor = profile?.tipo !== 'VETERINARIO';
  const accent = isTutor ? colors.primary : colors.success;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.kicker, { color: accent }]}>
        {isTutor ? 'Área do Tutor' : 'Área do Veterinário'}
      </Text>
      <Text style={[styles.title, { color: colors.text }]}>
        Olá, {profile?.nome ?? user?.displayName ?? 'bem-vindo'}
      </Text>
      <Text style={[styles.subtitle, { color: colors.muted }]}>
        {isTutor
          ? 'Aqui você acompanha somente os pets cadastrados na sua conta.'
          : 'Aqui você vê todos os pets da clínica e atualiza os prontuários.'}
      </Text>

      <Pressable
        style={[styles.card, { backgroundColor: colors.card, borderLeftColor: accent }]}
        onPress={() => router.push('/pets')}
      >
        <Text style={[styles.cardTitle, { color: colors.text }]}>
          {isTutor ? 'Meus pets' : 'Todos os pets'}
        </Text>
        <Text style={[styles.cardText, { color: colors.muted }]}>
          {isTutor
            ? 'Cadastrar, consultar, editar e excluir os seus animais.'
            : 'Consultar a base completa e manter o cadastro dos animais.'}
        </Text>
      </Pressable>

      {!isTutor ? (
        <Pressable
          style={[styles.card, { backgroundColor: colors.card, borderLeftColor: accent }]}
          onPress={() => router.push('/prontuarios')}
        >
          <Text style={[styles.cardTitle, { color: colors.text }]}>Prontuários</Text>
          <Text style={[styles.cardText, { color: colors.muted }]}>
            Registrar diagnósticos e atualizar o histórico clínico.
          </Text>
        </Pressable>
      ) : null}

      <Pressable
        style={[styles.card, { backgroundColor: colors.card, borderLeftColor: accent }]}
        onPress={() => router.push('/perfil')}
      >
        <Text style={[styles.cardTitle, { color: colors.text }]}>Meu perfil</Text>
        <Text style={[styles.cardText, { color: colors.muted }]}>
          Ver dados da sessão, tema, sair ou excluir a conta.
        </Text>
      </Pressable>

      <Pressable
        style={[styles.card, { backgroundColor: colors.card, borderLeftColor: accent }]}
        onPress={() => router.push('/sobre')}
      >
        <Text style={[styles.cardTitle, { color: colors.text }]}>Sobre o App</Text>
        <Text style={[styles.cardText, { color: colors.muted }]}>
          Versão publicada e hash do commit de referência.
        </Text>
      </Pressable>

      <Text style={[styles.api, { color: colors.muted }]}>API: {getApiBaseUrl()}</Text>
      <PrimaryButton title="SAIR DA CONTA" variant="danger" onPress={signOut} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
  subtitle: {
    marginBottom: 8,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 6,
    gap: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  cardText: {},
  api: {
    fontSize: 12,
    marginTop: 'auto',
  },
});
