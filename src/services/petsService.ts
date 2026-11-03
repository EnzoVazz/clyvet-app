import { api } from './api';
import { alertaClinicoPorIdade, unwrapList } from './mappers';
import type { Pet, PetInput } from '../types';

export const petsService = {
  async list(tutorId?: number): Promise<Pet[]> {
    const { data } = await api.get('/api/pets');
    const pets = unwrapList<Pet>(data);
    if (tutorId) {
      return pets.filter((pet) => Number(pet.idTutor) === Number(tutorId));
    }
    return pets;
  },

  async getById(id: number): Promise<Pet> {
    const { data } = await api.get(`/api/pets/${id}`);
    return data;
  },

  async create(input: Omit<PetInput, 'alertaClinico'>): Promise<Pet> {
    const payload: PetInput = {
      ...input,
      alertaClinico: alertaClinicoPorIdade(input.idade),
    };
    const { data } = await api.post('/api/pets', payload);
    return data;
  },

  async update(id: number, input: Omit<PetInput, 'alertaClinico'>): Promise<Pet> {
    const payload: PetInput = {
      ...input,
      alertaClinico: alertaClinicoPorIdade(input.idade),
    };
    const { data } = await api.put(`/api/pets/${id}`, payload);
    return data;
  },

  async remove(id: number): Promise<void> {
    await api.delete(`/api/pets/${id}`);
  },
};
