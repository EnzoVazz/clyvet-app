import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useAuth } from '../../../src/contexts/AuthContext';
import { useCreatePet, usePet, useTutores, useUpdatePet } from '../../../src/hooks/usePets';
import { LoadingState } from '../../../src/components/Feedback';
import { PrimaryButton } from '../../../src/components/PrimaryButton';
import { TextField } from '../../../src/components/TextField';
import { getErrorMessage } from '../../../src/utils/errors';
import { colors } from '../../../src/theme';

export default function PetFormScreen() {
  const params = useLocalSearchParams<{ id?: string }>();
  const petId = params.id ? Number(params.id) : undefined;
  const isEditing = Number.isFinite(petId);
  const { profile } = useAuth();
  const isVeterinario = profile?.tipo === 'VETERINARIO';

  const petQuery = usePet(petId);
  const tutoresQuery = useTutores();
  const createPet = useCreatePet();
  const updatePet = useUpdatePet();

  const [nome, setNome] = useState('');
  const [especie, setEspecie] = useState('');
  const [cor, setCor] = useState('');
  const [idade, setIdade] = useState('');
  const [peso, setPeso] = useState('');
  const [idTutor, setIdTutor] = useState<number | undefined>();

  useEffect(() => {
    if (petQuery.data) {
      setNome(petQuery.data.nome);
      setEspecie(petQuery.data.especie);
      setCor(petQuery.data.cor);
      setIdade(String(petQuery.data.idade));
      setPeso(String(petQuery.data.peso));
      setIdTutor(petQuery.data.idTutor);
    }
  }, [petQuery.data]);

  async function salvar() {
    if (!nome.trim() || !especie.trim() || !cor.trim() || !idade.trim() || !peso.trim()) {
      Alert.alert('Validação', 'Preencha todos os campos do pet.');
      return;
    }

    const input = {
      nome: nome.trim(),
      especie: especie.trim(),
      cor: cor.trim(),
      idade: Number(idade),
      peso: Number(peso),
      idTutor,
    };

    if (!Number.isFinite(input.idade) || !Number.isFinite(input.peso)) {
      Alert.alert('Validação', 'Idade e peso precisam ser numéricos.');
      return;
    }

    try {
      if (isEditing && petId) {
        await updatePet.mutateAsync({ id: petId, input });
      } else {
        await createPet.mutateAsync(input);
      }
      router.back();
    } catch (error) {
      Alert.alert('Erro ao salvar pet', getErrorMessage(error));
    }
  }

  if (isEditing && petQuery.isPending) {
    return <LoadingState message="Buscando pet na API..." />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Stack.Screen options={{ title: isEditing ? 'Editar pet' : 'Novo pet' }} />
      <TextField label="Nome" value={nome} onChangeText={setNome} placeholder="Luna" />
      <TextField label="Espécie" value={especie} onChangeText={setEspecie} placeholder="Cão ou Gato" />
      <TextField label="Cor" value={cor} onChangeText={setCor} placeholder="Caramelo" />
      <TextField label="Idade" value={idade} onChangeText={setIdade} keyboardType="numeric" placeholder="4" />
      <TextField label="Peso (kg)" value={peso} onChangeText={setPeso} keyboardType="numeric" placeholder="12.5" />

      {isVeterinario ? (
        <>
          <Text style={styles.label}>Tutor responsável</Text>
          <View style={styles.chips}>
            {(tutoresQuery.data ?? []).map((tutor) => {
              const ativo = idTutor === tutor.id;
              return (
                <Pressable
                  key={tutor.id}
                  onPress={() => setIdTutor(tutor.id)}
                  style={[styles.chip, ativo && styles.chipAtivo]}
                >
                  <Text style={[styles.chipTexto, ativo && styles.chipTextoAtivo]}>{tutor.nome}</Text>
                </Pressable>
              );
            })}
          </View>
        </>
      ) : null}

      <PrimaryButton
        title={isEditing ? 'SALVAR ALTERAÇÕES' : 'CADASTRAR PET'}
        loading={createPet.isPending || updatePet.isPending}
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
  chips: {
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
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipTexto: {
    fontWeight: '700',
    color: colors.text,
  },
  chipTextoAtivo: {
    color: '#fff',
  },
});
