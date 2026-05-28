export type Gender = 'M' | 'F';

export type GenderFilter = 'M' | 'F' | 'BOTH';

export interface Category {
  id: string;
  name: string;
  description: string | null;
}

export interface PetName {
  id: string;
  title: string;
  definition: string;
  gender: Gender[];
  categories: string[];
}

export interface Envelope<T> {
  data: T;
}
