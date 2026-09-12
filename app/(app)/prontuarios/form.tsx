import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Stack, Redirect, router, useLocalSearchParams } from 'expo-router';
import { usePets } from '../../../src/hooks/usePets';
import { useCreateProntuario, useProntuario, useUpdateProntuario } from '../../../src/hooks/useProntuarios';
import { useAuth } from '../../../src/contexts/AuthContext';
import { LoadingState } from '../../../src/components/Feedback';
import { PrimaryButton } from '../../../src/components/PrimaryButton';
import { TextField } from '../../../src/components/TextField';
import { getErrorMessage } from '../../../src/utils/errors';
import { colors } from '../../../src/theme';

function hojeIso() {
  return new Date().toISOString().slice(0, 10);
}

export default function ProntuarioFormScreen() {
  const { profile } = useAuth();
  const params = useLocalSearchParams<{ id?: string }>();
  const prontuarioId = params.id ? Number(params.id) : undefined;
  const isEditing = Number.isFinite(prontuarioId);

  const petsQuery = usePets();
  const prontuarioQuery = useProntuario(prontuarioId);
  const createProntuario = useCreateProntuario();
  const updateProntuario = useUpdateProntuario();

  const [diagnostico, setDiagnostico] = useState('');
  const [dataRegistro, setDataRegistro] = useState(hojeIso());
  const [idPet, setIdPet] = useState<number | undefined>();

  useEffect(() => {
    if (prontuarioQuery.data) {
      setDiagnostico(prontuarioQuery.data.diagnostico);
      setDataRegistro(prontuarioQuery.data.dataRegistro);
      setIdPet(prontuarioQuery.data.idPet);
    }
  }, [prontuarioQuery.data]);

  if (profile?.tipo !== 'VETERINARIO') {
    return <Redirect href="/" />;
  }

  async function salvar() {
    if (!diagnostico.trim() || !dataRegistro.trim()) {
      Alert.alert('Validação', 'Informe o diagnóstico e a data.');
      return;
    }
    if (!idPet) {
      Alert.alert('Validação', 'Selecione o pet vinculado ao prontuário.');
      return;
    }

    const input = {
      diagnostico: diagnostico.trim(),
      dataRegistro: dataRegistro.trim(),
      idPet,
    };

    try {
      if (isEditing && prontuarioId) {
        await updateProntuario.mutateAsync({ id: prontuarioId, input });
      } else {
        await createProntuario.mutateAsync(input);
      }
      router.back();
    } catch (error) {
      Alert.alert('Erro ao salvar prontuário', getErrorMessage(error));
    }
  }

  if (isEditing && prontuarioQuery.isPending) {
    return <LoadingState message="Buscando prontuário na API..." />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Stack.Screen options={{ title: isEditing ? 'Editar prontuário' : 'Novo prontuário' }} />

      <Text style={styles.label}>Pet vinculado</Text>
      {(petsQuery.data ?? []).length === 0 ? (
        <Text style={styles.emptyPets}>Nenhum pet cadastrado na API para vincular.</Text>
      ) : null}
      <View style={styles.pets}>
        {(petsQuery.data ?? []).map((pet) => {
          const ativo = idPet === pet.id;
          return (
            <Pressable
              key={pet.id}
              onPress={() => setIdPet(pet.id)}
              style={[styles.chip, ativo && styles.chipAtivo]}
            >
              <Text style={[styles.chipTexto, ativo && styles.chipTextoAtivo]}>{pet.nome}</Text>
            </Pressable>
          );
        })}
      </View>

      <TextField
        label="Data (AAAA-MM-DD)"
        value={dataRegistro}
        onChangeText={setDataRegistro}
        placeholder="2026-09-11"
      />
      <TextField
        label="Diagnóstico / conduta"
        value={diagnostico}
        onChangeText={setDiagnostico}
        placeholder="Descreva o atendimento"
        multiline
      />
      <PrimaryButton
        title={isEditing ? 'SALVAR ALTERAÇÕES' : 'REGISTRAR PRONTUÁRIO'}
        variant="success"
        loading={createProntuario.isPending || updateProntuario.isPending}
        onPress={salvar}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 12,
    backgroundColor: colors.background,
    flexGrow: 1,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.muted,
    textTransform: 'uppercase',
  },
  emptyPets: {
    color: colors.muted,
  },
  pets: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.card,
  },
  chipAtivo: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  chipTexto: {
    fontWeight: '700',
    color: colors.text,
  },
  chipTextoAtivo: {
    color: '#fff',
  },
});
