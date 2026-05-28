import type { GenderFilter, PetName } from '@/types/domain';

export interface FilterArgs {
  names: PetName[];
  gender: GenderFilter | null;
  categoryIds: string[];
  letter: string | null;
}

export function filterNames({ names, gender, categoryIds, letter }: FilterArgs): PetName[] {
  const wantedCats = new Set(categoryIds);

  const filtered = names.filter((n) => {
    if (gender && gender !== 'BOTH' && !n.gender.includes(gender)) return false;

    if (wantedCats.size > 0) {
      const hasAny = n.categories.some((c) => wantedCats.has(c));
      if (!hasAny) return false;
    }

    if (letter && n.title[0]?.toUpperCase() !== letter) return false;

    return true;
  });

  return filtered.sort((a, b) => a.title.localeCompare(b.title));
}

export function findRelatedNames(target: PetName, all: PetName[], limit = 3): PetName[] {
  if (target.categories.length === 0) return [];
  const wanted = new Set(target.categories);
  return all
    .filter((n) => n.id !== target.id && n.categories.some((c) => wanted.has(c)))
    .slice(0, limit);
}
