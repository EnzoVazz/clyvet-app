import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Stack, Redirect, router, useLocalSearchParams } from 'expo-router';
import { usePets } from '../../../src/hooks/usePets';
import { useCreateProntuario, useProntuario, useUpdateProntuario } from '../../../src/hooks/useProntuarios';
import { useAuth } from '../../../src/contexts/AuthContext';
import { useTheme } from '../../../src/contexts/ThemeContext';
import { LoadingState } from '../../../src/components/Feedback';
import { PrimaryButton } from '../../../src/components/PrimaryButton';
import { TextField } from '../../../src/components/TextField';
import { getErrorMessage } from '../../../src/utils/errors';

function hojeIso() {
  return new Date().toISOString().slice(0, 10);
}

export default function ProntuarioFormScreen() {
  const { profile } = useAuth();
  const { colors } = useTheme();
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
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: isEditing ? 'Editar prontuário' : 'Novo prontuário' }} />

      <Text style={[styles.label, { color: colors.muted }]}>Pet vinculado</Text>
      {(petsQuery.data ?? []).length === 0 ? (
        <Text style={{ color: colors.muted }}>Nenhum pet cadastrado na API para vincular.</Text>
      ) : null}
      <View style={styles.pets}>
        {(petsQuery.data ?? []).map((pet) => {
          const ativo = idPet === pet.id;
          return (
            <Pressable
              key={pet.id}
              onPress={() => setIdPet(pet.id)}
              style={[
                styles.chip,
                {
                  borderColor: ativo ? colors.success : colors.border,
                  backgroundColor: ativo ? colors.success : colors.card,
                },
              ]}
            >
              <Text style={[styles.chipTexto, { color: ativo ? '#fff' : colors.text }]}>{pet.nome}</Text>
            </Pressable>
          );
        })}
      </View>

      <TextField
        label="Data (AAAA-MM-DD)"
        value={dataRegistro}
        onChangeText={setDataRegistro}
        placeholder="2026-11-02"
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
    flexGrow: 1,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  pets: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chipTexto: {
    fontWeight: '700',
  },
});
