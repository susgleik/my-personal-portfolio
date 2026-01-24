'use client';

import ProjectForm from '@/components/project-form';

export default function NewProjectPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Crear Nuevo Proyecto</h1>
        <p className="text-gray-500 mt-1">
          Escribe el contenido en español. Se traducirá automáticamente al inglés al guardar.
        </p>
      </div>
      <ProjectForm mode="create" />
    </div>
  );
}
