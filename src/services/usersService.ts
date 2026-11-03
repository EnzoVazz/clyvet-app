import axios from 'axios';
import { api } from './api';
import { unwrapItem, unwrapList } from './mappers';
import type { Tutor, UserProfile, Veterinario } from '../types';

function isNotFound(error: unknown): boolean {
  return axios.isAxiosError(error) && error.response?.status === 404;
}

function documentoParaCpf(documento: string, uid?: string): string {
  const trimmed = documento.trim();
  if (trimmed) {
    return trimmed;
  }
  const seed = uid ?? 'clyvet';
  let total = 0;
  for (let i = 0; i < seed.length; i += 1) {
    total = (total + seed.charCodeAt(i) * (i + 1)) % 100000000000;
  }
  return String(total).padStart(11, '0');
}

export const tutoresService = {
  async list(): Promise<Tutor[]> {
    const { data } = await api.get('/api/tutores');
    return unwrapList<Tutor>(data);
  },

  async findByCpf(cpf: string): Promise<Tutor | null> {
    try {
      const { data } = await api.get(`/api/tutores/cpf/${encodeURIComponent(cpf)}`);
      return unwrapItem<Tutor>(data);
    } catch (error) {
      if (isNotFound(error)) {
        return null;
      }
      const { data } = await api.get('/api/tutores');
      return unwrapList<Tutor>(data).find((tutor) => tutor.cpf === cpf) ?? null;
    }
  },

  async create(input: Omit<Tutor, 'id'>): Promise<Tutor> {
    const { data } = await api.post('/api/tutores', input);
    return data;
  },

  async ensure(profile: Pick<UserProfile, 'uid' | 'nome' | 'documento' | 'telefone'>): Promise<Tutor> {
    const cpf = documentoParaCpf(profile.documento, profile.uid);
    if (cpf) {
      const existing = await this.findByCpf(cpf);
      if (existing?.id) {
        return existing;
      }
    }
    return this.create({
      nome: profile.nome,
      cpf,
      telefone: profile.telefone || '00000000000',
    });
  },
};

export const veterinariosService = {
  async findByCrmv(crmv: string): Promise<Veterinario | null> {
    try {
      const { data } = await api.get(`/api/veterinarios/crmv/${encodeURIComponent(crmv)}`);
      return unwrapItem<Veterinario>(data);
    } catch (error) {
      if (isNotFound(error)) {
        return null;
      }
      return null;
    }
  },

  async create(input: Omit<Veterinario, 'id'>): Promise<Veterinario> {
    const { data } = await api.post('/api/veterinarios', input);
    return data;
  },

  async ensure(profile: Pick<UserProfile, 'nome' | 'documento' | 'telefone'>): Promise<Veterinario> {
    const existing = await this.findByCrmv(profile.documento);
    if (existing?.id) {
      return existing;
    }
    return this.create({
      nome: profile.nome,
      crmv: profile.documento,
      telefone: profile.telefone,
    });
  },
};
