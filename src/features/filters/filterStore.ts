import { create } from 'zustand';
import type { GenderFilter } from '@/types/domain';

interface FilterState {
  gender: GenderFilter | null;
  categoryIds: string[];
  letter: string | null;
  openGroupKey: string | null;
  previewCenterId: string | null;
  confirmedNameId: string | null;
  setGender: (g: GenderFilter) => void;
  toggleCategory: (id: string) => void;
  clearCategories: () => void;
  setLetter: (l: string | null) => void;
  toggleGroup: (key: string) => void;
  closeGroup: () => void;
  setPreviewCenter: (id: string | null) => void;
  confirmName: (id: string | null) => void;
  reset: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  gender: null,
  categoryIds: [],
  letter: null,
  openGroupKey: null,
  previewCenterId: null,
  confirmedNameId: null,
  setGender: (gender) =>
    set({ gender, letter: 'A', previewCenterId: null, confirmedNameId: null }),
  toggleCategory: (id) =>
    set((s) => ({
      categoryIds: s.categoryIds.includes(id)
        ? s.categoryIds.filter((c) => c !== id)
        : [...s.categoryIds, id],
      confirmedNameId: null,
      previewCenterId: null,
    })),
  clearCategories: () => set({ categoryIds: [], confirmedNameId: null, previewCenterId: null }),
  setLetter: (letter) => set({ letter, confirmedNameId: null, previewCenterId: null }),
  toggleGroup: (key) => set((s) => ({ openGroupKey: s.openGroupKey === key ? null : key })),
  closeGroup: () => set({ openGroupKey: null }),
  setPreviewCenter: (previewCenterId) => set({ previewCenterId }),
  confirmName: (confirmedNameId) => set({ confirmedNameId }),
  reset: () =>
    set({
      gender: null,
      categoryIds: [],
      letter: null,
      openGroupKey: null,
      previewCenterId: null,
      confirmedNameId: null,
    }),
}));
