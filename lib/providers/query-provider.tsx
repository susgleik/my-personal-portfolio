'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutos - los datos son considerados frescos
            gcTime: 30 * 60 * 1000, // 30 minutos - tiempo en cache antes de garbage collection
            refetchOnWindowFocus: false, // No refetch al enfocar la ventana
            refetchOnReconnect: false, // No refetch al reconectar
            retry: 1, // Solo 1 retry en caso de error
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
