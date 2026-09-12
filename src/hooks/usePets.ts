import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { petsService } from '../services/petsService';
import { tutoresService } from '../services/usersService';
import type { PetInput } from '../types';

const PETS_KEY = ['pets'] as const;

type PetFormInput = Omit<PetInput, 'alertaClinico' | 'idTutor'> & {
  idTutor?: number;
};

export function usePets() {
  const { profile } = useAuth();

  return useQuery({
    queryKey: [...PETS_KEY, profile?.tipo, profile?.apiUserId],
    enabled: !!profile,
    queryFn: async () => {
      if (profile?.tipo === 'TUTOR') {
        if (!profile.apiUserId) {
          return [];
        }
        return petsService.list(profile.apiUserId);
      }
      return petsService.list();
    },
  });
}

export function usePet(id?: number) {
  return useQuery({
    queryKey: [...PETS_KEY, 'detalhe', id],
    enabled: Number.isFinite(id),
    queryFn: () => petsService.getById(id as number),
  });
}

export function useTutores() {
  return useQuery({
    queryKey: ['tutores'],
    queryFn: () => tutoresService.list(),
  });
}

export function useCreatePet() {
  const queryClient = useQueryClient();
  const { profile, updateApiUserId } = useAuth();

  return useMutation({
    mutationFn: async (input: PetFormInput) => {
      if (!profile) {
        throw new Error('Sessão expirada. Entre novamente.');
      }

      let tutorId = input.idTutor;
      if (!tutorId && profile.tipo === 'TUTOR') {
        tutorId = profile.apiUserId ?? undefined;
        if (!tutorId) {
          const tutor = await tutoresService.ensure(profile);
          tutorId = tutor.id;
          await updateApiUserId(tutor.id);
        }
      }

      if (!tutorId) {
        throw new Error('Selecione um tutor para vincular o pet.');
      }

      return petsService.create({ ...input, idTutor: tutorId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PETS_KEY });
    },
  });
}

export function useUpdatePet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, input }: { id: number; input: PetFormInput }) => {
      const current = await petsService.getById(id);
      return petsService.update(id, {
        ...input,
        idTutor: input.idTutor ?? current.idTutor,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PETS_KEY });
    },
  });
}

export function useDeletePet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => petsService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PETS_KEY });
    },
  });
}
