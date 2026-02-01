'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ExternalLink, Github } from 'lucide-react';
import type { Project } from '@/types';

interface PortfolioCardProps {
  project: Project;
  locale: string;
  variant?: 'default' | 'large';
  index?: number;
}

export default function PortfolioCard({
  project,
  locale,
  variant = 'default',
  index = 0,
}: PortfolioCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Obtener contenido según idioma
  const title = locale === 'en' && project.title_en ? project.title_en : project.title;
  const description = locale === 'en' && project.description_en ? project.description_en : project.description;

  const isLarge = variant === 'large';

  return (
    <Link
      href={`/portfolio/${project.slug}`}
      className="group block relative"
      style={{
        animationDelay: `${index * 100}ms`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glow effect on hover */}
      <div
        className={`absolute -inset-1 rounded-2xl transition-all duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
        style={{
          background: "linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(139, 92, 246, 0.2))",
          filter: "blur(20px)",
        }}
      />

      {/* Card container */}
      <div
        className={`relative overflow-hidden rounded-2xl transition-all duration-300 ${
          isHovered ? 'border-white/20 bg-white/10' : 'border-white/10 bg-white/5'
        } backdrop-blur-sm border`}
      >
        <div
          className={`relative ${
            isLarge
              ? 'flex flex-col md:flex-row'
              : 'aspect-[4/3]'
          }`}
        >
          {/* Imagen */}
          <div
            className={`overflow-hidden ${
              isLarge
                ? 'relative w-full md:w-1/2 aspect-video md:aspect-[4/3]'
                : 'absolute inset-0'
            }`}
          >
            {project.thumbnail ? (
              <Image
                src={project.thumbnail}
                alt={title}
                fill
                className={`object-cover transition-all duration-500 ${isHovered ? 'scale-105' : 'scale-100'}`}
                sizes={isLarge ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 640px) 100vw, 33vw'}
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/50 to-purple-700/50 flex items-center justify-center">
                <span className="text-4xl font-bold text-white/30">{title.charAt(0)}</span>
              </div>
            )}
            {/* Gradient overlay for large variant */}
            {isLarge && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/50 hidden md:block" />
            )}
            {/* Gradient overlay for default variant */}
            {!isLarge && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            )}
          </div>

          {/* Contenido */}
          {isLarge ? (
            <div className="flex-1 flex flex-col justify-center p-6">
              {/* Status badge */}
              <div className="flex flex-wrap gap-2 mb-3">
                {project.status === 'completed' && (
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-500/20 text-green-300">
                    ✅ {locale === 'en' ? 'Completed' : 'Completado'}
                  </span>
                )}
                {project.status === 'in-progress' && (
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-500/20 text-yellow-300">
                    🔄 {locale === 'en' ? 'In Progress' : 'En Progreso'}
                  </span>
                )}
              </div>

              {/* Title */}
              <h3 className={`text-xl sm:text-2xl md:text-3xl font-bold mb-3 transition-colors duration-300 ${
                isHovered ? 'text-cyan-300' : 'text-white'
              }`}>
                {title}
              </h3>

              {/* Description */}
              <p className="text-white/60 text-sm sm:text-base leading-relaxed line-clamp-3 mb-4">
                {description}
              </p>

              {/* Technologies */}
              <div className="flex flex-wrap gap-2 mb-4">
                {project.technologies.slice(0, 4).map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-1 text-xs font-medium bg-white/5 border border-white/10 text-white/70 rounded-lg"
                  >
                    {tech}
                  </span>
                ))}
                {project.technologies.length > 4 && (
                  <span className="px-2 py-1 text-xs font-medium text-white/50">
                    +{project.technologies.length - 4}
                  </span>
                )}
              </div>

              {/* Action row */}
              <div className="flex items-center gap-4">
                <span className={`text-sm font-medium transition-all duration-300 ${
                  isHovered ? 'text-cyan-400' : 'text-white/50'
                }`}>
                  {locale === 'en' ? 'View Project' : 'Ver Proyecto'}
                  <ArrowRight className={`inline-block w-4 h-4 ml-1 transition-transform duration-300 ${
                    isHovered ? 'translate-x-1' : ''
                  }`} />
                </span>
                {project.liveUrl && (
                  <span
                    onClick={(e) => {
                      e.preventDefault();
                      window.open(project.liveUrl, '_blank');
                    }}
                    className="text-white/40 hover:text-white/70 transition-colors cursor-pointer"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </span>
                )}
                {project.githubUrl && (
                  <span
                    onClick={(e) => {
                      e.preventDefault();
                      window.open(project.githubUrl, '_blank');
                    }}
                    className="text-white/40 hover:text-white/70 transition-colors cursor-pointer"
                  >
                    <Github className="w-4 h-4" />
                  </span>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* Content for default variant */}
              <div className="absolute inset-x-0 bottom-0 p-4">
                {/* Status badge */}
                {project.status && project.status !== 'planned' && (
                  <div className="mb-2">
                    {project.status === 'completed' && (
                      <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-500/20 text-green-300">
                        ✅
                      </span>
                    )}
                    {project.status === 'in-progress' && (
                      <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-yellow-500/20 text-yellow-300">
                        🔄
                      </span>
                    )}
                  </div>
                )}

                {/* Title */}
                <h3 className={`font-bold text-lg mb-1 transition-colors duration-300 ${
                  isHovered ? 'text-cyan-300' : 'text-white'
                }`}>
                  {title}
                </h3>

                {/* Description - shows on hover */}
                <p className={`text-white/70 text-sm line-clamp-2 transition-all duration-300 ${
                  isHovered ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'
                } overflow-hidden`}>
                  {description}
                </p>

                {/* View project hint */}
                <div className={`flex items-center gap-1 mt-2 transition-all duration-300 ${
                  isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}>
                  <span className="text-xs text-cyan-400 font-medium">
                    {locale === 'en' ? 'View' : 'Ver'}
                  </span>
                  <ArrowRight className="w-3 h-3 text-cyan-400" />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
