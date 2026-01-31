'use client';

import { useQuery } from '@tanstack/react-query';
import { getCategories, getCategoryBySlug } from '@/lib/firestore';

// Keys para el cache
export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  detail: (slug: string) => [...categoryKeys.all, 'detail', slug] as const,
};

// Hook para obtener todas las categorías
export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.lists(),
    queryFn: getCategories,
    staleTime: 10 * 60 * 1000, // 10 minutos - las categorías cambian poco
  });
}

// Hook para una categoría específica por slug
export function useCategoryBySlug(slug: string) {
  return useQuery({
    queryKey: categoryKeys.detail(slug),
    queryFn: () => getCategoryBySlug(slug),
    enabled: !!slug,
  });
}
