'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/navbar';
import ScrollFadeWrapper from '@/components/scroll-fade-wrapper';
import { Button } from '@/components/ui/button';
import { useProjectBySlug, useCategoryBySlug } from '@/lib/hooks';
import { Loader2, ArrowLeft, ExternalLink, Github } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Custom Medium icon (lucide-react doesn't have one)
const MediumIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    width="24"
    height="24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/>
  </svg>
);

// Color mapping for category badges
const getCategoryColorClass = (color: string) => {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-500/20 text-blue-300',
    purple: 'bg-purple-500/20 text-purple-300',
    green: 'bg-green-500/20 text-green-300',
    yellow: 'bg-yellow-500/20 text-yellow-300',
    red: 'bg-red-500/20 text-red-300',
    orange: 'bg-orange-500/20 text-orange-300',
  };
  return colorMap[color] || 'bg-gray-500/20 text-gray-300';
};

export default function ProjectDetailPage() {
  const params = useParams();
  const t = useTranslations();
  const locale = useLocale();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const slug = params.slug as string;

  // React Query hooks con cache
  const { data: project, isLoading, isError } = useProjectBySlug(slug);
  const { data: category } = useCategoryBySlug(project?.category || '');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
      </div>
    );
  }

  if (isError || !project) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
          <h1 className="text-2xl font-bold mb-4">
            {locale === 'en' ? 'Project not found' : 'Proyecto no encontrado'}
          </h1>
          <Link href="/portfolio">
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {locale === 'en' ? 'Back to Portfolio' : 'Volver al Portafolio'}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Obtener contenido según idioma
  const title = locale === 'en' && project.title_en ? project.title_en : project.title;
  const description = locale === 'en' && project.description_en ? project.description_en : project.description;
  const content = locale === 'en' && project.content_en ? project.content_en : project.content;

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <ScrollFadeWrapper delay={0}>
            <Link
              href="/portfolio"
              className="inline-flex items-center text-blue-400 hover:text-blue-300 text-sm mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {locale === 'en' ? 'Back to Portfolio' : 'Volver al Portafolio'}
            </Link>

            <div className="flex flex-wrap gap-2 mb-4">
              {category && (
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full ${getCategoryColorClass(category.color)}`}
                >
                  {category.emoji} {category.name}
                </span>
              )}
              <span
                className={`px-3 py-1 text-xs font-medium rounded-full ${
                  project.status === 'completed'
                    ? 'bg-green-500/20 text-green-300'
                    : project.status === 'in-progress'
                    ? 'bg-yellow-500/20 text-yellow-300'
                    : 'bg-gray-500/20 text-gray-300'
                }`}
              >
                {project.status === 'completed'
                  ? '✅ ' + (locale === 'en' ? 'Completed' : 'Completado')
                  : project.status === 'in-progress'
                  ? '🔄 ' + (locale === 'en' ? 'In Progress' : 'En Progreso')
                  : '📋 ' + (locale === 'en' ? 'Planned' : 'Planeado')}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">{title}</h1>
            <p className="text-xl text-white/70 mb-6">{description}</p>

            {/* Technologies */}
            <div className="flex flex-wrap gap-2 mb-8">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 text-sm font-medium bg-blue-500/20 text-blue-300 rounded-full"
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-4 mb-8">
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                  <button className="h-9 px-4 py-2 rounded-md text-sm font-medium bg-blue-500 hover:bg-blue-600 text-white inline-flex items-center gap-2 transition-colors cursor-pointer">
                    <ExternalLink className="w-4 h-4 shrink-0" />
                    <span>{locale === 'en' ? 'View Live' : 'Ver Demo'}</span>
                  </button>
                </a>
              )}
              {project.githubUrl && (
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  <button className="h-9 px-4 py-2 rounded-md text-sm font-medium bg-transparent border border-white/30 text-white hover:bg-white/10 hover:border-white/50 inline-flex items-center gap-2 transition-colors cursor-pointer">
                    <Github className="w-4 h-4 shrink-0" />
                    <span>GitHub</span>
                  </button>
                </a>
              )}
              {project.mediumUrl && (
                <a href={project.mediumUrl} target="_blank" rel="noopener noreferrer">
                  <button className="h-9 px-4 py-2 rounded-md text-sm font-medium bg-transparent border border-white/30 text-white hover:bg-white/10 hover:border-white/50 inline-flex items-center gap-2 transition-colors cursor-pointer">
                    <MediumIcon className="w-4 h-4 shrink-0" />
                    <span>Medium</span>
                  </button>
                </a>
              )}
            </div>
          </ScrollFadeWrapper>
        </div>
      </section>

      {/* Main Image */}
      {project.thumbnail && (
        <ScrollFadeWrapper delay={1}>
          <section className="px-4 sm:px-6 lg:px-8 pb-12">
            <div className="max-w-5xl mx-auto">
              <div className="relative aspect-video rounded-2xl overflow-hidden">
                <Image
                  src={project.thumbnail}
                  alt={title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </section>
        </ScrollFadeWrapper>
      )}

      {/* Content */}
        <section className="px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-3xl mx-auto">
            <article className="prose prose-lg prose-invert max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  img: ({ src, alt }) => (
                    <button
                      type="button"
                      onClick={() => setSelectedImage(src || '')}
                      className="relative w-full my-4 rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity block"
                    >
                      <Image
                        src={src || ''}
                        alt={alt || ''}
                        width={800}
                        height={450}
                        className="object-cover w-full"
                      />
                    </button>
                  ),
                }}
              >
                {content}
              </ReactMarkdown>
            </article>
          </div>
        </section>
      

      {/* Gallery */}
      {project.images && project.images.length > 0 && (
        <ScrollFadeWrapper delay={1}>
          <section className="px-4 sm:px-6 lg:px-8 py-12">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">
                {locale === 'en' ? 'Gallery' : 'Galería'}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {project.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(image)}
                    className="relative aspect-video rounded-xl overflow-hidden hover:opacity-90 transition-opacity cursor-pointer"
                  >
                    <Image
                      src={image}
                      alt={`${title} - Image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </section>
        </ScrollFadeWrapper>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white/70 hover:text-white text-4xl"
            onClick={() => setSelectedImage(null)}
          >
            ×
          </button>
          <div className="relative max-w-5xl max-h-[90vh] w-full h-full">
            <Image
              src={selectedImage}
              alt="Gallery image"
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="py-8 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-white/50 text-sm">
            {t('footer.made')} <span className="font-bold text-white">ANGEL HERNANDEZ</span> © 2026
          </p>
        </div>
      </footer>
    </div>
  );
}
