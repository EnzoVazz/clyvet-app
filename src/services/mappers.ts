export function alertaClinicoPorIdade(idade: number): string {
  if (idade < 1) {
    return 'Filhote: reforçar vacinas e vermifugação';
  }
  if (idade >= 8) {
    return 'Sênior: check-up semestral recomendado';
  }
  return 'Adulto: acompanhamento anual';
}

export function unwrapList<T>(data: unknown): T[] {
  if (Array.isArray(data)) {
    return data as T[];
  }
  if (data && typeof data === 'object' && 'content' in data && Array.isArray((data as { content: T[] }).content)) {
    return (data as { content: T[] }).content;
  }
  return [];
}

export function unwrapItem<T>(data: unknown): T | null {
  if (!data || typeof data !== 'object') {
    return null;
  }
  if (Array.isArray(data)) {
    return (data[0] as T) ?? null;
  }
  return data as T;
}
