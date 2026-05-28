import type { Category, Envelope, PetName } from '@/types/domain';

const API_BASE = import.meta.env.VITE_API_BASE ?? '/api';

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, { cache: 'no-cache' });
  if (!res.ok) {
    throw new Error(`API ${path} failed: ${res.status} ${res.statusText}`);
  }
  return (await res.json()) as T;
}

export async function fetchCategories(): Promise<Category[]> {
  const json = await getJson<Envelope<Category[]>>('/categories.json');
  return json.data;
}

export async function fetchNames(): Promise<PetName[]> {
  const json = await getJson<Envelope<PetName[]>>('/names.json');
  return json.data;
}

export async function fetchLetters(): Promise<string[]> {
  const json = await getJson<Envelope<string[]>>('/letters.json');
  return json.data;
}
