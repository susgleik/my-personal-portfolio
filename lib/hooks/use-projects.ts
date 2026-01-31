'use client';

import { useQuery } from '@tanstack/react-query';
import {
  getProjects,
  getFeaturedProjects,
  getPublishedProjects,
  getProjectsByCategory,
  getProjectBySlug,
} from '@/lib/firestore';
import type { Project } from '@/types';

// Keys para el cache
export const projectKeys = {
  all: ['projects'] as const,
  lists: () => [...projectKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...projectKeys.lists(), filters] as const,
  featured: (limit: number) => [...projectKeys.all, 'featured', limit] as const,
  published: (limit: number) => [...projectKeys.all, 'published', limit] as const,
  byCategory: (category: string, limit: number) => [...projectKeys.all, 'category', category, limit] as const,
  detail: (slug: string) => [...projectKeys.all, 'detail', slug] as const,
};

// Hook para obtener proyectos con filtros
export function useProjects(options: {
  featured?: boolean;
  published?: boolean;
  limit?: number;
} = {}) {
  return useQuery({
    queryKey: projectKeys.list(options),
    queryFn: () => getProjects(options),
  });
}

// Hook para proyectos destacados (Home)
export function useFeaturedProjects(limit: number = 5) {
  return useQuery({
    queryKey: projectKeys.featured(limit),
    queryFn: () => getFeaturedProjects(limit),
  });
}

// Hook para proyectos publicados
export function usePublishedProjects(limit: number = 20) {
  return useQuery({
    queryKey: projectKeys.published(limit),
    queryFn: () => getPublishedProjects(limit),
  });
}

// Hook para proyectos por categoría
export function useProjectsByCategory(category: string, limit: number = 50) {
  return useQuery({
    queryKey: projectKeys.byCategory(category, limit),
    queryFn: () => getProjectsByCategory(category, { limit }),
    enabled: !!category && category !== 'all', // Solo ejecutar si hay categoría y no es 'all'
  });
}

// Hook para un proyecto específico por slug
export function useProjectBySlug(slug: string) {
  return useQuery({
    queryKey: projectKeys.detail(slug),
    queryFn: () => getProjectBySlug(slug),
    enabled: !!slug,
  });
}
