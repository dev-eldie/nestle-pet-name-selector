import { useQuery } from '@tanstack/react-query';
import { fetchCategories, fetchLetters, fetchNames } from '@/lib/api';

const STALE_TIME = 1000 * 60 * 60;

export function useCategoriesQuery() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: STALE_TIME,
  });
}

export function useNamesQuery() {
  return useQuery({
    queryKey: ['names'],
    queryFn: fetchNames,
    staleTime: STALE_TIME,
  });
}

export function useLettersQuery() {
  return useQuery({
    queryKey: ['letters'],
    queryFn: fetchLetters,
    staleTime: STALE_TIME,
  });
}
