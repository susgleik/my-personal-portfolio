'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { createProject, updateProject, generateSlug, getCategories } from '@/lib/firestore';
import { uploadImage, uploadMultipleImages } from '@/lib/storage';
import { translateProjectFields } from '@/lib/translate';
import type { Project, Category } from '@/types';
import Image from 'next/image';
import { X, Upload, Loader2 } from 'lucide-react';

const projectSchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  description: z.string().min(1, 'La descripción es requerida'),
  content: z.string().min(1, 'El contenido es requerido'),
  category: z.string().optional(),
  technologies: z.string(),
  githubUrl: z.string().url().optional().or(z.literal('')),
  liveUrl: z.string().url().optional().or(z.literal('')),
  mediumUrl: z.string().url().optional().or(z.literal('')),
  isPublished: z.boolean(),
  status: z.enum(['completed', 'in-progress', 'planned']),
  order: z.number().min(0),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

interface ProjectFormProps {
  project?: Project;
  mode: 'create' | 'edit';
}

export default function ProjectForm({ project, mode }: ProjectFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>(project?.thumbnail || '');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>(project?.images || []);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error('Error loading categories:', err);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: project?.title || '',
      description: project?.description || '',
      content: project?.content || '',
      category: project?.category || '',
      technologies: project?.technologies?.join(', ') || '',
      githubUrl: project?.githubUrl || '',
      liveUrl: project?.liveUrl || '',
      mediumUrl: project?.mediumUrl || '',
      isPublished: project?.isPublished ?? true,
      status: project?.status || 'completed',
      order: project?.order || 0,
    },
  });

  const watchedIsPublished = watch('isPublished');
  const watchedCategory = watch('category');
  const watchedStatus = watch('status');

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setImageFiles((prev) => [...prev, ...files]);
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    // Solo remover del array de archivos si es una imagen nueva (no existente)
    if (index >= (project?.images?.length || 0)) {
      const adjustedIndex = index - (project?.images?.length || 0);
      setImageFiles((prev) => prev.filter((_, i) => i !== adjustedIndex));
    }
  };

  const onSubmit = async (data: ProjectFormValues) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // 1. Subir thumbnail si hay uno nuevo
      let thumbnailUrl = project?.thumbnail || '';
      if (thumbnailFile) {
        const slug = generateSlug(data.title);
        thumbnailUrl = await uploadImage(thumbnailFile, `projects/${slug}/thumbnail-${Date.now()}`);
      }

      // 2. Subir nuevas imágenes
      let allImageUrls = project?.images || [];
      if (imageFiles.length > 0) {
        const slug = generateSlug(data.title);
        const newImageUrls = await uploadMultipleImages(imageFiles, `projects/${slug}`);
        // Mantener imágenes existentes + nuevas
        allImageUrls = [...(project?.images || []), ...newImageUrls];
      }
      // Actualizar con las previews actuales (por si se eliminaron algunas)
      allImageUrls = imagePreviews.filter(url => !url.startsWith('data:')).concat(
        allImageUrls.filter(url => url.startsWith('http') && !imagePreviews.includes(url) === false)
      );

      // 3. Traducir campos al inglés
      setIsTranslating(true);
      const translations = await translateProjectFields({
        title: data.title,
        description: data.description,
        content: data.content,
      });
      setIsTranslating(false);

      // 4. Preparar datos del proyecto
      const projectData = {
        title: data.title,
        description: data.description,
        content: data.content,
        title_en: translations.title_en,
        description_en: translations.description_en,
        content_en: translations.content_en,
        slug: generateSlug(data.title),
        thumbnail: thumbnailUrl,
        images: allImageUrls.filter(url => url.startsWith('http')),
        category: data.category || undefined,
        technologies: data.technologies.split(',').map((t) => t.trim()).filter(Boolean),
        githubUrl: data.githubUrl || undefined,
        liveUrl: data.liveUrl || undefined,
        mediumUrl: data.mediumUrl || undefined,
        featured: data.order < 5, // Los primeros 5 proyectos aparecen en Home
        isPublished: data.isPublished,
        status: data.status,
        order: data.order,
        createdAt: project?.createdAt || new Date(),
        updatedAt: new Date(),
      };

      // 5. Crear o actualizar
      if (mode === 'create') {
        await createProject(projectData);
      } else if (project?.id) {
        await updateProject(project.id, projectData);
      }

      router.push('/admin/projects');
      router.refresh();
    } catch (err) {
      console.error('Error saving project:', err);
      setError('Error al guardar el proyecto. Por favor, intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
      setIsTranslating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Columna principal */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información del Proyecto</CardTitle>
              <CardDescription>
                Escribe en español. El contenido se traducirá automáticamente al inglés.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  {...register('title')}
                  placeholder="Nombre del proyecto"
                />
                {errors.title && (
                  <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="description">Descripción corta *</Label>
                <Textarea
                  id="description"
                  {...register('description')}
                  placeholder="Resumen breve que se mostrará en la tarjeta (máx. 200 caracteres)"
                  rows={3}
                />
                {errors.description && (
                  <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="content">Contenido completo (Markdown) *</Label>
                <Textarea
                  id="content"
                  {...register('content')}
                  placeholder="Descripción detallada del proyecto. Soporta Markdown."
                  rows={12}
                  className="font-mono text-sm"
                />
                {errors.content && (
                  <p className="text-sm text-red-500 mt-1">{errors.content.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Imágenes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="thumbnail">Thumbnail (imagen principal) *</Label>
                <div className="mt-2">
                  {thumbnailPreview ? (
                    <div className="relative w-full max-w-md aspect-video rounded-lg overflow-hidden border">
                      <Image
                        src={thumbnailPreview}
                        alt="Thumbnail preview"
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setThumbnailFile(null);
                          setThumbnailPreview('');
                        }}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full max-w-md aspect-video border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                      <Upload className="w-8 h-8 text-gray-400" />
                      <span className="mt-2 text-sm text-gray-500">Click para subir thumbnail</span>
                      <input
                        type="file"
                        id="thumbnail"
                        accept="image/*"
                        className="hidden"
                        onChange={handleThumbnailChange}
                      />
                    </label>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="images">Galería de imágenes (opcional)</Label>
                <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative aspect-video rounded-lg overflow-hidden border">
                      <Image
                        src={preview}
                        alt={`Image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <label className="flex flex-col items-center justify-center aspect-video border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                    <Upload className="w-6 h-6 text-gray-400" />
                    <span className="mt-1 text-xs text-gray-500">Añadir imagen</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleImagesChange}
                    />
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Enlaces</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="liveUrl">URL del proyecto (opcional)</Label>
                <Input
                  id="liveUrl"
                  {...register('liveUrl')}
                  placeholder="https://miproyecto.com"
                />
              </div>
              <div>
                <Label htmlFor="githubUrl">GitHub (opcional)</Label>
                <Input
                  id="githubUrl"
                  {...register('githubUrl')}
                  placeholder="https://github.com/usuario/repo"
                />
              </div>
              <div>
                <Label htmlFor="mediumUrl">Artículo en Medium (opcional)</Label>
                <Input
                  id="mediumUrl"
                  {...register('mediumUrl')}
                  placeholder="https://medium.com/@usuario/articulo"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Publicación</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="isPublished">Publicado</Label>
                <Switch
                  id="isPublished"
                  checked={watchedIsPublished}
                  onCheckedChange={(checked) => setValue('isPublished', checked)}
                />
              </div>
              <p className="text-xs text-gray-500">
                Los primeros 5 proyectos publicados (por orden) aparecerán en el Home.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Clasificación</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="category">Categoría (opcional)</Label>
                {loadingCategories ? (
                  <div className="flex items-center gap-2 text-sm text-gray-500 py-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Cargando categorías...
                  </div>
                ) : categories.length === 0 ? (
                  <p className="text-sm text-gray-500 py-2">
                    No hay categorías creadas aún.
                  </p>
                ) : (
                  <Select
                    value={watchedCategory || ''}
                    onValueChange={(value: string) => setValue('category', value || undefined)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sin categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Sin categoría</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.slug}>
                          {cat.emoji} {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div>
                <Label htmlFor="status">Estado</Label>
                <Select
                  value={watchedStatus}
                  onValueChange={(value: 'completed' | 'in-progress' | 'planned') => setValue('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="completed">✅ Completado</SelectItem>
                    <SelectItem value="in-progress">🔄 En Progreso</SelectItem>
                    <SelectItem value="planned">📋 Planeado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="technologies">Tecnologías</Label>
                <Input
                  id="technologies"
                  {...register('technologies')}
                  placeholder="React, Firebase, TypeScript (separadas por coma)"
                />
              </div>

              <div>
                <Label htmlFor="order">Orden de aparición</Label>
                <Input
                  id="order"
                  type="number"
                  {...register('order', { valueAsNumber: true })}
                  min={0}
                />
                <p className="text-xs text-gray-500 mt-1">Menor número = aparece primero</p>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => router.push('/admin/projects')}
            >
              Cancelar
            </Button>
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {isTranslating ? 'Traduciendo...' : 'Guardando...'}
                </>
              ) : mode === 'create' ? (
                'Crear Proyecto'
              ) : (
                'Actualizar'
              )}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
