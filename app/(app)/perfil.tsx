import { useState } from 'react';
import { Alert, StyleSheet, Switch, Text, View } from 'react-native';
import { useAuth } from '../../src/contexts/AuthContext';
import { useTheme } from '../../src/contexts/ThemeContext';
import { PrimaryButton } from '../../src/components/PrimaryButton';
import { getErrorMessage } from '../../src/utils/errors';

export default function PerfilScreen() {
  const { profile, user, signOut, deleteAccount } = useAuth();
  const { colors, scheme, toggleScheme } = useTheme();
  const [excluindo, setExcluindo] = useState(false);
  const modoEscuro = scheme === 'dark';

  function confirmarExclusao() {
    Alert.alert(
      'Excluir conta',
      'Isso remove o login deste e-mail. Você precisará se cadastrar de novo para entrar. Não dá para desfazer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir conta',
          style: 'destructive',
          onPress: () => {
            void excluirConta();
          },
        },
      ]
    );
  }

  async function excluirConta() {
    try {
      setExcluindo(true);
      await deleteAccount();
    } catch (error) {
      Alert.alert('Não foi possível excluir a conta', getErrorMessage(error));
    } finally {
      setExcluindo(false);
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Meu perfil</Text>
      <View style={[styles.card, { backgroundColor: colors.card, borderLeftColor: colors.header }]}>
        <Text style={[styles.label, { color: colors.muted }]}>Nome</Text>
        <Text style={[styles.value, { color: colors.text }]}>
          {profile?.nome ?? user?.displayName ?? 'Não informado'}
        </Text>
        <Text style={[styles.label, { color: colors.muted }]}>E-mail</Text>
        <Text style={[styles.value, { color: colors.text }]}>{profile?.email ?? user?.email}</Text>
        <Text style={[styles.label, { color: colors.muted }]}>Tipo de conta</Text>
        <Text style={[styles.value, { color: colors.text }]}>{profile?.tipo ?? 'Sessão Firebase'}</Text>
        <Text style={[styles.label, { color: colors.muted }]}>Documento</Text>
        <Text style={[styles.value, { color: colors.text }]}>{profile?.documento ?? '-'}</Text>
        <Text style={[styles.label, { color: colors.muted }]}>Telefone</Text>
        <Text style={[styles.value, { color: colors.text }]}>{profile?.telefone ?? '-'}</Text>
      </View>

      <View style={[styles.card, { backgroundColor: colors.card, borderLeftColor: colors.primary }]}>
        <View style={styles.temaRow}>
          <View style={styles.temaTexto}>
            <Text style={[styles.label, { color: colors.muted, marginTop: 0 }]}>Aparência</Text>
            <Text style={[styles.value, { color: colors.text }]}>
              {modoEscuro ? 'Modo escuro' : 'Modo claro'}
            </Text>
          </View>
          <Switch
            value={modoEscuro}
            onValueChange={() => {
              void toggleScheme();
            }}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor="#fff"
          />
        </View>
      </View>

      <PrimaryButton title="ENCERRAR SESSÃO" variant="ghost" onPress={signOut} />
      <PrimaryButton
        title="EXCLUIR CONTA"
        variant="danger"
        loading={excluindo}
        onPress={confirmarExclusao}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
  },
  card: {
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 10,
  },
  value: {
    fontSize: 18,
    fontWeight: '600',
  },
  temaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  temaTexto: {
    flex: 1,
  },
});
