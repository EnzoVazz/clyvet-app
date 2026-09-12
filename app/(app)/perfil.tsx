import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../src/contexts/AuthContext';
import { PrimaryButton } from '../../src/components/PrimaryButton';
import { getErrorMessage } from '../../src/utils/errors';
import { colors } from '../../src/theme';

export default function PerfilScreen() {
  const { profile, user, signOut, deleteAccount } = useAuth();
  const [excluindo, setExcluindo] = useState(false);

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
    <View style={styles.container}>
      <Text style={styles.title}>Meu perfil</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Nome</Text>
        <Text style={styles.value}>{profile?.nome ?? user?.displayName ?? 'Não informado'}</Text>
        <Text style={styles.label}>E-mail</Text>
        <Text style={styles.value}>{profile?.email ?? user?.email}</Text>
        <Text style={styles.label}>Tipo de conta</Text>
        <Text style={styles.value}>{profile?.tipo ?? 'Sessão Firebase'}</Text>
        <Text style={styles.label}>Documento</Text>
        <Text style={styles.value}>{profile?.documento ?? '-'}</Text>
        <Text style={styles.label}>Telefone</Text>
        <Text style={styles.value}>{profile?.telefone ?? '-'}</Text>
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
    backgroundColor: colors.background,
    padding: 20,
    gap: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 6,
    borderLeftColor: colors.header,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.muted,
    marginTop: 10,
  },
  value: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
});
