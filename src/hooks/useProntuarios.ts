import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { prontuariosService } from '../services/prontuariosService';
import type { ProntuarioInput } from '../types';

const PRONTUARIOS_KEY = ['prontuarios'] as const;

export function useProntuarios() {
  return useQuery({
    queryKey: PRONTUARIOS_KEY,
    queryFn: () => prontuariosService.list(),
  });
}

export function useProntuario(id?: number) {
  return useQuery({
    queryKey: [...PRONTUARIOS_KEY, id],
    enabled: Number.isFinite(id),
    queryFn: () => prontuariosService.getById(id as number),
  });
}

export function useCreateProntuario() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ProntuarioInput) => prontuariosService.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRONTUARIOS_KEY });
    },
  });
}

export function useUpdateProntuario() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: ProntuarioInput }) =>
      prontuariosService.update(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRONTUARIOS_KEY });
    },
  });
}

export function useDeleteProntuario() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => prontuariosService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRONTUARIOS_KEY });
    },
  });
}
