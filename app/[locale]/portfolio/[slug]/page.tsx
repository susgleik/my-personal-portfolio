'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/navbar';
import { useProjectBySlug, useCategoryBySlug } from '@/lib/hooks';
import { ArrowLeft, ExternalLink, Github } from 'lucide-react';
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
    blue: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    purple: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    green: 'bg-green-500/20 text-green-300 border-green-500/30',
    yellow: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    red: 'bg-red-500/20 text-red-300 border-red-500/30',
    orange: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    cyan: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  };
  return colorMap[color] || 'bg-white/10 text-white/70 border-white/20';
};

export default function ProjectDetailPage() {
  const params = useParams();
  const t = useTranslations();
  const locale = useLocale();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const slug = params.slug as string;

  // React Query hooks con cache
  const { data: project, isLoading, isError } = useProjectBySlug(slug);
  const { data: category } = useCategoryBySlug(project?.category || '');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-2 border-white/10" />
          <div className="absolute inset-0 w-12 h-12 rounded-full border-2 border-transparent border-t-cyan-400 animate-spin" />
        </div>
      </div>
    );
  }

  if (isError || !project) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 border border-white/10 mb-4">
            <span className="text-2xl">🔍</span>
          </div>
          <h1 className="text-2xl font-bold mb-4">
            {locale === 'en' ? 'Project not found' : 'Proyecto no encontrado'}
          </h1>
          <Link href="/portfolio">
            <button className="group relative cursor-pointer">
              <div
                className="absolute -inset-1 rounded-xl opacity-0 group-hover:opacity-60 transition-all duration-500"
                style={{
                  background: "linear-gradient(135deg, rgba(6, 182, 212, 0.4), rgba(139, 92, 246, 0.4))",
                  filter: "blur(15px)",
                }}
              />
              <div className="relative flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 backdrop-blur-sm border border-white/20 hover:border-white/40 transition-all duration-300">
                <ArrowLeft className="w-4 h-4" />
                <span>{locale === 'en' ? 'Back to Portfolio' : 'Volver al Portafolio'}</span>
              </div>
            </button>
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
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <Navbar />

      {/* Background elements */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 via-black to-gray-900/50" />

        {/* Liquid orbs */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Top-right orb - cyan */}
          <div
            className="absolute top-[10%] right-[5%] w-[200px] h-[200px] sm:w-[400px] sm:h-[400px] rounded-full opacity-30"
            style={{
              background: "radial-gradient(circle, rgba(6, 182, 212, 0.15), transparent 70%)",
              filter: "blur(60px)",
              animation: "orbFloat 22s ease-in-out infinite",
            }}
          />

          {/* Bottom-left orb - purple */}
          <div
            className="absolute bottom-[20%] left-[5%] w-[250px] h-[250px] sm:w-[350px] sm:h-[350px] rounded-full opacity-40"
            style={{
              background: "radial-gradient(circle, rgba(139, 92, 246, 0.18), transparent 70%)",
              filter: "blur(70px)",
              animation: "orbFloat 25s ease-in-out infinite reverse",
            }}
          />

          {/* Center accent */}
          <div
            className="absolute top-[30%] left-[50%] w-[600px] h-[600px] sm:w-[900px] sm:h-[900px]"
            style={{
              transform: "translate(-50%, -50%)",
              background: "radial-gradient(ellipse at center, rgba(6, 182, 212, 0.04), transparent 60%)",
            }}
          />
        </div>

        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.01]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className={`transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'}`}>
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm mb-6 transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              {locale === 'en' ? 'Back to Portfolio' : 'Volver al Portafolio'}
            </Link>

            <div className="flex flex-wrap gap-2 mb-4">
              {category && (
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full border backdrop-blur-sm ${getCategoryColorClass(category.color)}`}
                >
                  {category.emoji} {category.name}
                </span>
              )}
              <span
                className={`px-3 py-1 text-xs font-medium rounded-full border backdrop-blur-sm ${
                  project.status === 'completed'
                    ? 'bg-green-500/20 text-green-300 border-green-500/30'
                    : project.status === 'in-progress'
                    ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                    : 'bg-white/10 text-white/70 border-white/20'
                }`}
              >
                {project.status === 'completed'
                  ? '✅ ' + (locale === 'en' ? 'Completed' : 'Completado')
                  : project.status === 'in-progress'
                  ? '🔄 ' + (locale === 'en' ? 'In Progress' : 'En Progreso')
                  : '📋 ' + (locale === 'en' ? 'Planned' : 'Planeado')}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 break-words">{title}</h1>
            <p className="text-lg sm:text-xl text-white/60 mb-6">{description}</p>

            {/* Technologies */}
            <div className="flex flex-wrap gap-2 mb-8">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 text-sm font-medium bg-white/5 backdrop-blur-sm border border-white/10 text-white/70 rounded-full hover:border-cyan-500/30 hover:text-cyan-300 transition-colors"
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3 sm:gap-4 mb-8">
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="group relative">
                  <div
                    className="absolute -inset-1 rounded-xl opacity-0 group-hover:opacity-60 transition-all duration-500"
                    style={{
                      background: "linear-gradient(135deg, rgba(6, 182, 212, 0.4), rgba(139, 92, 246, 0.4))",
                      filter: "blur(10px)",
                    }}
                  />
                  <div className="relative h-10 px-4 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-cyan-500/20 to-purple-500/20 backdrop-blur-sm border border-white/20 text-white hover:border-white/40 inline-flex items-center gap-2 transition-all duration-300">
                    <ExternalLink className="w-4 h-4 shrink-0" />
                    <span>{locale === 'en' ? 'View Live' : 'Ver Demo'}</span>
                  </div>
                </a>
              )}
              {project.githubUrl && (
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="group relative">
                  <div
                    className="absolute -inset-1 rounded-xl opacity-0 group-hover:opacity-60 transition-all duration-500"
                    style={{
                      background: "linear-gradient(135deg, rgba(6, 182, 212, 0.3), rgba(139, 92, 246, 0.3))",
                      filter: "blur(10px)",
                    }}
                  />
                  <div className="relative h-10 px-4 py-2 rounded-xl text-sm font-medium bg-white/5 backdrop-blur-sm border border-white/20 text-white hover:border-white/40 inline-flex items-center gap-2 transition-all duration-300">
                    <Github className="w-4 h-4 shrink-0" />
                    <span>GitHub</span>
                  </div>
                </a>
              )}
              {project.mediumUrl && (
                <a href={project.mediumUrl} target="_blank" rel="noopener noreferrer" className="group relative">
                  <div
                    className="absolute -inset-1 rounded-xl opacity-0 group-hover:opacity-60 transition-all duration-500"
                    style={{
                      background: "linear-gradient(135deg, rgba(6, 182, 212, 0.3), rgba(139, 92, 246, 0.3))",
                      filter: "blur(10px)",
                    }}
                  />
                  <div className="relative h-10 px-4 py-2 rounded-xl text-sm font-medium bg-white/5 backdrop-blur-sm border border-white/20 text-white hover:border-white/40 inline-flex items-center gap-2 transition-all duration-300">
                    <MediumIcon className="w-4 h-4 shrink-0" />
                    <span>Medium</span>
                  </div>
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Image */}
      {project.thumbnail && (
        <section className={`relative z-10 px-4 sm:px-6 lg:px-8 pb-12 transition-all duration-1000 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="max-w-5xl mx-auto">
            <div className="group relative">
              <div
                className="absolute -inset-2 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500"
                style={{
                  background: "linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(139, 92, 246, 0.15))",
                  filter: "blur(20px)",
                }}
              />
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10">
                <Image
                  src={project.thumbnail}
                  alt={title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Content */}
      <section className={`relative z-10 px-4 sm:px-6 lg:px-8 py-12 transition-all duration-1000 delay-400 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="max-w-3xl mx-auto">
          <article className="prose prose-lg prose-invert max-w-none prose-pre:overflow-x-auto prose-pre:max-w-full prose-code:break-words [&_*]:max-w-full [&_pre]:rounded-lg [&_a]:break-words prose-headings:text-white prose-p:text-white/70 prose-strong:text-white prose-li:text-white/70">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                img: ({ src, alt }) => (
                  <button
                    type="button"
                    onClick={() => setSelectedImage(src || '')}
                    className="relative w-full my-4 rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity block group"
                  >
                    <div
                      className="absolute -inset-1 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-500"
                      style={{
                        background: "linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(139, 92, 246, 0.2))",
                        filter: "blur(15px)",
                      }}
                    />
                    <Image
                      src={src || ''}
                      alt={alt || ''}
                      width={800}
                      height={450}
                      className="object-cover w-full rounded-xl"
                    />
                  </button>
                ),
                pre: ({ children }) => (
                  <pre className="overflow-x-auto max-w-full text-sm bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl">
                    {children}
                  </pre>
                ),
                code: ({ children, className }) => {
                  const isInline = !className;
                  return isInline ? (
                    <code className="break-words bg-white/10 px-1.5 py-0.5 rounded text-sm text-cyan-300">
                      {children}
                    </code>
                  ) : (
                    <code className={className}>{children}</code>
                  );
                },
                a: ({ href, children }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:text-cyan-300 break-words transition-colors"
                  >
                    {children}
                  </a>
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
        <section className={`relative z-10 px-4 sm:px-6 lg:px-8 py-12 transition-all duration-1000 delay-600 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-purple-400 animate-pulse" />
              <h2 className="text-2xl font-bold">
                {locale === 'en' ? 'Gallery' : 'Galería'}
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {project.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(image)}
                  className="group relative aspect-video rounded-xl overflow-hidden cursor-pointer"
                >
                  <div
                    className="absolute -inset-1 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-500 z-10"
                    style={{
                      background: "linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(139, 92, 246, 0.2))",
                      filter: "blur(15px)",
                    }}
                  />
                  <div className="relative w-full h-full border border-white/10 rounded-xl overflow-hidden group-hover:border-white/20 transition-colors">
                    <Image
                      src={image}
                      alt={`${title} - Image ${index + 1}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 border border-white/20 text-white/70 hover:text-white hover:bg-white/20 transition-colors text-2xl"
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
      <footer className="relative z-10 py-8 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-white/50 text-sm">
            {t('footer.made')}{' '}
            <span className="font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              ANGEL HERNANDEZ
            </span>{' '}
            © 2026
          </p>
        </div>
      </footer>

      <style jsx>{`
        @keyframes orbFloat {
          0%, 100% {
            transform: translate(0, 0);
          }
          25% {
            transform: translate(15px, -20px);
          }
          50% {
            transform: translate(-10px, 15px);
          }
          75% {
            transform: translate(20px, 10px);
          }
        }
      `}</style>
    </div>
  );
}
