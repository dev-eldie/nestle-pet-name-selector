import { describe, expect, it } from 'vitest';
import { filterNames, findRelatedNames } from './filterNames';
import type { PetName } from '@/types/domain';

const make = (over: Partial<PetName> & { id: string; title: string }): PetName => ({
  definition: '',
  gender: ['M'],
  categories: [],
  ...over,
});

const data: PetName[] = [
  make({ id: '1', title: 'Bella', gender: ['F'], categories: ['cute', 'short'] }),
  make({ id: '2', title: 'Buddy', gender: ['M'], categories: ['cute'] }),
  make({ id: '3', title: 'Charlie', gender: ['M', 'F'], categories: ['short'] }),
  make({ id: '4', title: 'Apollo', gender: ['M'], categories: ['greek'] }),
];

describe('filterNames', () => {
  it('returns all sorted alphabetically when no filters', () => {
    expect(filterNames({ names: data, gender: null, categoryIds: [], letter: null }).map((n) => n.title))
      .toEqual(['Apollo', 'Bella', 'Buddy', 'Charlie']);
  });

  it('filters by male gender', () => {
    const out = filterNames({ names: data, gender: 'M', categoryIds: [], letter: null });
    expect(out.map((n) => n.title)).toEqual(['Apollo', 'Buddy', 'Charlie']);
  });

  it('filters by female gender', () => {
    const out = filterNames({ names: data, gender: 'F', categoryIds: [], letter: null });
    expect(out.map((n) => n.title)).toEqual(['Bella', 'Charlie']);
  });

  it('filters by any of selected categories (OR semantics)', () => {
    const out = filterNames({
      names: data,
      gender: null,
      categoryIds: ['greek', 'short'],
      letter: null,
    });
    expect(out.map((n) => n.title)).toEqual(['Apollo', 'Bella', 'Charlie']);
  });

  it('filters by starting letter', () => {
    const out = filterNames({ names: data, gender: null, categoryIds: [], letter: 'B' });
    expect(out.map((n) => n.title)).toEqual(['Bella', 'Buddy']);
  });

  it('combines all filters', () => {
    const out = filterNames({
      names: data,
      gender: 'M',
      categoryIds: ['cute'],
      letter: 'B',
    });
    expect(out.map((n) => n.title)).toEqual(['Buddy']);
  });

  it('BOTH gender returns all genders', () => {
    const out = filterNames({ names: data, gender: 'BOTH', categoryIds: [], letter: null });
    expect(out.map((n) => n.title)).toEqual(['Apollo', 'Bella', 'Buddy', 'Charlie']);
  });
});

describe('findRelatedNames', () => {
  it('returns names sharing at least one category (excluding self)', () => {
    const target = data[0];
    const related = findRelatedNames(target, data, 8);
    expect(related.map((n) => n.title)).toEqual(['Buddy', 'Charlie']);
  });

  it('returns empty when target has no categories', () => {
    const target = make({ id: 'x', title: 'Loner', categories: [] });
    expect(findRelatedNames(target, data)).toEqual([]);
  });

  it('respects limit', () => {
    const target = data[0];
    expect(findRelatedNames(target, data, 1)).toHaveLength(1);
  });
});
