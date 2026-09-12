import { api } from './api';
import { unwrapList } from './mappers';
import type { Prontuario, ProntuarioInput } from '../types';

export const prontuariosService = {
  async list(): Promise<Prontuario[]> {
    const { data } = await api.get('/api/prontuarios');
    return unwrapList<Prontuario>(data);
  },

  async getById(id: number): Promise<Prontuario> {
    const { data } = await api.get(`/api/prontuarios/${id}`);
    return data;
  },

  async create(input: ProntuarioInput): Promise<Prontuario> {
    const { data } = await api.post('/api/prontuarios', input);
    return data;
  },

  async update(id: number, input: ProntuarioInput): Promise<Prontuario> {
    const { data } = await api.put(`/api/prontuarios/${id}`, input);
    return data;
  },

  async remove(id: number): Promise<void> {
    await api.delete(`/api/prontuarios/${id}`);
  },
};
