import type { Category } from '@/types/domain';

export interface CategoryGroup {
  key: string;
  label: string;
  categoryNames: string[];
}

export const CATEGORY_GROUPS: CategoryGroup[] = [
  {
    key: 'famous',
    label: 'Famous',
    categoryNames: ['Celebrities', 'Most Popular', 'Literary', 'Musical'],
  },
  {
    key: 'size',
    label: 'Pet´s size',
    categoryNames: ['Large', 'Small', 'Short Names'],
  },
  {
    key: 'joyful',
    label: 'Joyful',
    categoryNames: ['Optimistic', 'Magical and Mythical', 'Regal'],
  },
  {
    key: 'funny',
    label: 'Funny',
    categoryNames: ['Cartoon', 'Disney'],
  },
  {
    key: 'food',
    label: 'Food and drinks',
    categoryNames: ['Drinks', 'Foodie'],
  },
  {
    key: 'international',
    label: 'International',
    categoryNames: ['French', 'German', 'Greek', 'Italian', 'Norse', 'Scottish', 'Spanish', 'Chinese'],
  },
  {
    key: 'others',
    label: 'Others',
    categoryNames: ['Nature', 'Space and Science', 'Unusual'],
  },
];

export function resolveGroupCategoryIds(group: CategoryGroup, categories: Category[]): Category[] {
  const wanted = new Set(group.categoryNames);
  return categories.filter((c) => wanted.has(c.name));
}
