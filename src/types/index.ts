export type UserTipo = 'TUTOR' | 'VETERINARIO';

export type UserProfile = {
  uid: string;
  nome: string;
  email: string;
  tipo: UserTipo;
  documento: string;
  telefone: string;
  apiUserId: number | null;
};

export type Pet = {
  id: number;
  nome: string;
  especie: string;
  cor: string;
  idade: number;
  peso: number;
  idTutor: number;
  alertaClinico?: string;
};

export type PetInput = {
  nome: string;
  especie: string;
  cor: string;
  idade: number;
  peso: number;
  idTutor: number;
  alertaClinico: string;
};

export type Prontuario = {
  id: number;
  diagnostico: string;
  dataRegistro: string;
  idPet?: number;
};

export type ProntuarioInput = {
  diagnostico: string;
  dataRegistro: string;
  idPet: number;
};

export type Tutor = {
  id: number;
  nome: string;
  cpf: string;
  telefone: string;
};

export type Veterinario = {
  id: number;
  nome: string;
  crmv: string;
  telefone: string;
};
