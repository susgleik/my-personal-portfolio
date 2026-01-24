'use client';

import { useEffect, useState } from 'react';
import { getProjects, deleteProject } from '@/lib/firestore';
import { Project } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { format } from 'date-fns';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      const data = await getProjects({ limit: 100 });
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este proyecto?')) return;

    try {
      await deleteProject(id);
      setProjects(projects.filter(project => project.id !== id));
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Error al eliminar el proyecto');
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Proyectos</h1>
        <Button asChild>
          <Link href="/admin/projects/new">Crear Nuevo Proyecto</Link>
        </Button>
      </div>

      <div className="grid gap-4">
        {projects.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-gray-500">No hay proyectos creados</p>
            </CardContent>
          </Card>
        ) : (
          projects.map((project) => (
            <Card key={project.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{project.title}</CardTitle>
                    <p className="text-sm text-gray-500 mt-1">
                      {format(new Date(project.createdAt), 'dd/MM/yyyy')}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {project.featured && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                        Destacado
                      </span>
                    )}
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        project.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : project.status === 'in-progress'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {project.status === 'completed'
                        ? 'Completado'
                        : project.status === 'in-progress'
                        ? 'En Progreso'
                        : 'Planeado'}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{project.description}</p>
                <div className="flex gap-2 mb-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex gap-2 mt-4">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/projects/edit/${project.id}`}>Editar</Link>
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(project.id)}
                  >
                    Eliminar
                  </Button>
                  {project.liveUrl && (
                    <Button asChild variant="ghost" size="sm">
                      <Link href={project.liveUrl} target="_blank">
                        Ver Demo
                      </Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}