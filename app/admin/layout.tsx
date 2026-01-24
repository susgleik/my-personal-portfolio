'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAdmin, loading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (!loading && !isLoginPage && (!user || !isAdmin)) {
      router.push('/admin/login');
    }
  }, [user, isAdmin, loading, router, isLoginPage]);

  // Si es la página de login, renderizar directamente sin verificación
  if (isLoginPage) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Cargando...</p>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/admin" className="text-xl font-bold">
                  Admin Panel
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  href="/admin"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  href="/admin/posts"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium"
                >
                  Posts
                </Link>
                <Link
                  href="/admin/projects"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium"
                >
                  Proyectos
                </Link>
                <Link
                  href="/admin/categories"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium"
                >
                  Categorías
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <span className="mr-4 text-sm">{user.email}</span>
              <Button onClick={signOut} variant="outline" size="sm">
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}