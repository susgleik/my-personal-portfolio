'use client';

import { useQuery } from '@tanstack/react-query';
import { getPosts, getPostBySlug } from '@/lib/firestore';

// Keys para el cache
export const postKeys = {
  all: ['posts'] as const,
  lists: () => [...postKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...postKeys.lists(), filters] as const,
  detail: (slug: string) => [...postKeys.all, 'detail', slug] as const,
};

// Hook para obtener posts
export function usePosts(options: { published?: boolean; limit?: number } = {}) {
  return useQuery({
    queryKey: postKeys.list(options),
    queryFn: () => getPosts(options),
  });
}

// Hook para un post específico por slug
export function usePostBySlug(slug: string) {
  return useQuery({
    queryKey: postKeys.detail(slug),
    queryFn: () => getPostBySlug(slug),
    enabled: !!slug,
  });
}
