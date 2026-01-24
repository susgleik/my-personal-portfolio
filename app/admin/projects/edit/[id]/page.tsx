'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ProjectForm from '@/components/project-form';
import { getProjectById } from '@/lib/firestore';
import type { Project } from '@/types';
import { Loader2 } from 'lucide-react';

export default function EditProjectPage() {
  const params = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const id = params.id as string;
        const data = await getProjectById(id);
        if (!data) {
          setError('Proyecto no encontrado');
        } else {
          setProject(data);
        }
      } catch (err) {
        console.error('Error fetching project:', err);
        setError('Error al cargar el proyecto');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProject();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error || 'Proyecto no encontrado'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Editar Proyecto</h1>
        <p className="text-gray-500 mt-1">
          Modifica el contenido en español. Se re-traducirá automáticamente al guardar.
        </p>
      </div>
      <ProjectForm mode="edit" project={project} />
    </div>
  );
}
