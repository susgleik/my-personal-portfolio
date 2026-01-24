'use client';

import { useEffect, useState } from 'react';
import { getPosts, getProjects } from '@/lib/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalPosts: 0,
    publishedPosts: 0,
    totalProjects: 0,
    featuredProjects: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const allPosts = await getPosts({ published: undefined, limit: 100 });
        const publishedPosts = allPosts.filter(post => post.isPublished);
        const allProjects = await getProjects({ limit: 100 });
        const featuredProjects = allProjects.filter(project => project.featured);

        setStats({
          totalPosts: allPosts.length,
          publishedPosts: publishedPosts.length,
          totalProjects: allProjects.length,
          featuredProjects: featuredProjects.length,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPosts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Posts Publicados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.publishedPosts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Proyectos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProjects}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Proyectos Destacados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.featuredProjects}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Gestión de Posts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-gray-600">
              Crea, edita y gestiona los posts de tu blog
            </p>
            <div className="flex gap-2">
              <Button asChild>
                <Link href="/admin/posts">Ver Posts</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/admin/posts/new">Crear Post</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gestión de Proyectos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-gray-600">
              Crea, edita y gestiona tu portafolio de proyectos
            </p>
            <div className="flex gap-2">
              <Button asChild>
                <Link href="/admin/projects">Ver Proyectos</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/admin/projects/new">Crear Proyecto</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}