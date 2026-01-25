'use client';

import Image from 'next/image';
import Link from 'next/link';
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
  // Obtener contenido según idioma
  const title = locale === 'en' && project.title_en ? project.title_en : project.title;
  const description = locale === 'en' && project.description_en ? project.description_en : project.description;

  const isLarge = variant === 'large';

  return (
    <Link
      href={`/portfolio/${project.slug}`}
      className={`group block relative overflow-hidden rounded-2xl transform transition-all duration-500 hover:scale-[1.02] ${
        isLarge ? 'bg-gradient-to-br from-gray-900 to-gray-800' : ''
      }`}
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      <div
        className={`relative ${
          isLarge
            ? 'flex flex-col md:flex-row gap-6 p-6'
            : 'aspect-[4/3] bg-gray-900'
        }`}
      >
        {/* Imagen */}
        <div
          className={`overflow-hidden ${
            isLarge
              ? 'relative w-full md:w-1/2 aspect-video md:aspect-[4/3] rounded-xl'
              : 'absolute inset-0'
          }`}
        >
          {project.thumbnail ? (
            <Image
              src={project.thumbnail}
              alt={title}
              fill
              className="object-cover transition-all duration-500 group-hover:scale-110"
              sizes={isLarge ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 640px) 100vw, 33vw'}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center">
              <span className="text-4xl font-bold text-white/30">{title.charAt(0)}</span>
            </div>
          )}
          {!isLarge && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          )}
        </div>

        {/* Contenido */}
        {isLarge ? (
          <div className="flex-1 flex flex-col justify-center">
            <div className="flex flex-wrap gap-2 mb-3">
              {project.technologies.slice(0, 4).map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-1 text-xs font-medium bg-blue-500/20 text-blue-300 rounded-full"
                >
                  {tech}
                </span>
              ))}
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
              {title}
            </h3>
            <p className="text-white/70 text-base md:text-lg leading-relaxed line-clamp-3">
              {description}
            </p>
            <div className="mt-4 flex items-center text-blue-400 font-medium">
              <span className="group-hover:translate-x-2 transition-transform duration-300">
                {locale === 'en' ? 'View Project' : 'Ver Proyecto'} →
              </span>
            </div>
          </div>
        ) : (
          <>
            {/* Gradient overlay always visible */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            {/* Content */}
            <div className="absolute inset-x-0 bottom-0 p-4">
              <h3 className="text-white font-bold text-lg mb-1">{title}</h3>
              <p className="text-white/70 text-sm line-clamp-2 max-h-0 group-hover:max-h-20 overflow-hidden transition-all duration-300">
                {description}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Borde hover */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-500/50 transition-colors duration-300 pointer-events-none" />
    </Link>
  );
}
