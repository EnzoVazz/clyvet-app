import { Alert, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { Redirect, router } from 'expo-router';
import { useAuth } from '../../../src/contexts/AuthContext';
import { useTheme } from '../../../src/contexts/ThemeContext';
import { useDeleteProntuario, useProntuarios } from '../../../src/hooks/useProntuarios';
import { usePets } from '../../../src/hooks/usePets';
import { EmptyState, ErrorState, LoadingState } from '../../../src/components/Feedback';
import { PrimaryButton } from '../../../src/components/PrimaryButton';
import { getErrorMessage } from '../../../src/utils/errors';
import type { Prontuario } from '../../../src/types';

export default function ProntuariosScreen() {
  const { profile } = useAuth();
  const { colors } = useTheme();
  const prontuariosQuery = useProntuarios();
  const petsQuery = usePets();
  const deleteProntuario = useDeleteProntuario();

  if (profile?.tipo !== 'VETERINARIO') {
    return <Redirect href="/" />;
  }

  function nomeDoPet(idPet?: number) {
    if (!idPet) return 'Pet não informado';
    return petsQuery.data?.find((pet) => pet.id === idPet)?.nome ?? `Pet #${idPet}`;
  }

  function confirmarExclusao(item: Prontuario) {
    Alert.alert('Excluir prontuário', 'Remover este registro clínico da API?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () =>
          deleteProntuario.mutate(item.id, {
            onError: (error) => Alert.alert('Erro ao excluir', getErrorMessage(error)),
          }),
      },
    ]);
  }

  if (prontuariosQuery.isLoading) {
    return <LoadingState />;
  }

  if (prontuariosQuery.isError) {
    return (
      <ErrorState
        message={getErrorMessage(prontuariosQuery.error)}
        onRetry={() => prontuariosQuery.refetch()}
      />
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <PrimaryButton title="NOVO PRONTUÁRIO" variant="success" onPress={() => router.push('/prontuarios/form')} />
      <FlatList
        data={prontuariosQuery.data}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={prontuariosQuery.isRefetching} onRefresh={() => prontuariosQuery.refetch()} />
        }
        ListEmptyComponent={
          <EmptyState title="Nenhum prontuário" subtitle="Registre um diagnóstico para ver a integração com a API." />
        }
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: colors.card, borderLeftColor: colors.success }]}>
            <Text style={[styles.pet, { color: colors.text }]}>{nomeDoPet(item.idPet)}</Text>
            <Text style={[styles.data, { color: colors.muted }]}>{item.dataRegistro}</Text>
            <Text style={[styles.diagnostico, { color: colors.text }]}>{item.diagnostico}</Text>
            <View style={styles.actions}>
              <View style={styles.action}>
                <PrimaryButton title="Editar" variant="success" onPress={() => router.push(`/prontuarios/form?id=${item.id}`)} />
              </View>
              <View style={styles.action}>
                <PrimaryButton
                  title="Excluir"
                  variant="danger"
                  loading={deleteProntuario.isPending}
                  onPress={() => confirmarExclusao(item)}
                />
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 12,
  },
  list: {
    paddingBottom: 32,
    gap: 12,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 6,
    gap: 6,
  },
  pet: {
    fontSize: 18,
    fontWeight: '800',
  },
  data: {},
  diagnostico: {},
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  action: {
    flex: 1,
  },
});
