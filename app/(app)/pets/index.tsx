import { Alert, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../../src/contexts/AuthContext';
import { useDeletePet, usePets } from '../../../src/hooks/usePets';
import { EmptyState, ErrorState, LoadingState } from '../../../src/components/Feedback';
import { PrimaryButton } from '../../../src/components/PrimaryButton';
import { getErrorMessage } from '../../../src/utils/errors';
import { colors } from '../../../src/theme';
import type { Pet } from '../../../src/types';

export default function PetsScreen() {
  const { profile } = useAuth();
  const petsQuery = usePets();
  const deletePet = useDeletePet();
  const isTutor = profile?.tipo !== 'VETERINARIO';

  function confirmarExclusao(pet: Pet) {
    Alert.alert('Excluir pet', `Remover ${pet.nome} da API?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () =>
          deletePet.mutate(pet.id, {
            onError: (error) => Alert.alert('Erro ao excluir', getErrorMessage(error)),
          }),
      },
    ]);
  }

  if (petsQuery.isPending) {
    return <LoadingState />;
  }

  if (petsQuery.isError) {
    return <ErrorState message={getErrorMessage(petsQuery.error)} onRetry={() => petsQuery.refetch()} />;
  }

  return (
    <View style={styles.container}>
      <PrimaryButton title="CADASTRAR PET" onPress={() => router.push('/pets/form')} />
      <FlatList
        data={petsQuery.data}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={petsQuery.isRefetching} onRefresh={() => petsQuery.refetch()} />
        }
        ListEmptyComponent={
          <EmptyState
            title={isTutor ? 'Você ainda não cadastrou pets' : 'Nenhum pet na API'}
            subtitle={
              isTutor
                ? 'Cadastre o primeiro animal. Só você verá os pets da sua conta.'
                : 'Quando um tutor cadastrar um pet, ele aparece aqui para o veterinário.'
            }
          />
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.nome}>{item.nome}</Text>
            <Text style={styles.meta}>{item.especie} · {item.cor} · {item.idade} anos · {item.peso} kg</Text>
            <Text style={styles.alerta}>{item.alertaClinico}</Text>
            <View style={styles.actions}>
              <View style={styles.action}>
                <PrimaryButton title="Editar" onPress={() => router.push(`/pets/form?id=${item.id}`)} />
              </View>
              <View style={styles.action}>
                <PrimaryButton
                  title="Excluir"
                  variant="danger"
                  loading={deletePet.isPending}
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
    backgroundColor: colors.background,
    padding: 16,
    gap: 12,
  },
  list: {
    paddingBottom: 32,
    gap: 12,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 6,
    borderLeftColor: colors.primary,
    gap: 6,
  },
  nome: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
  },
  meta: {
    color: colors.muted,
  },
  alerta: {
    color: colors.text,
    fontStyle: 'italic',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  action: {
    flex: 1,
  },
});
