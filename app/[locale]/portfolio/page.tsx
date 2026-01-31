'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Navbar from '@/components/navbar';
import ScrollFadeWrapper from '@/components/scroll-fade-wrapper';
import PortfolioCard from '@/components/portfolio-card';
import { usePublishedProjects, useProjectsByCategory, useCategories } from '@/lib/hooks';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function PortfolioPage() {
  const t = useTranslations();
  const locale = useLocale();
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // React Query hooks con cache
  const { data: categories = [] } = useCategories();
  const { data: allProjects = [], isLoading: loadingAll } = usePublishedProjects(50);
  const { data: categoryProjects = [], isLoading: loadingCategory } = useProjectsByCategory(activeCategory, 50);

  // Determinar qué proyectos mostrar
  const projects = activeCategory === 'all' ? allProjects : categoryProjects;
  const loading = activeCategory === 'all' ? loadingAll : loadingCategory;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />

      <section className="flex-1 pt-24 pb-12 md:pt-32 md:pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <ScrollFadeWrapper delay={0}>
            <div className="text-center mb-12">
              <Link
                href="/"
                className="text-blue-400 hover:text-blue-300 text-sm mb-4 inline-block"
              >
                ← {locale === 'en' ? 'Back to Home' : 'Volver al Inicio'}
              </Link>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                {t('portfolio.title')}
              </h1>
              <p className="text-lg md:text-xl text-white/75 max-w-3xl mx-auto">
                {t('portfolio.subtitle')}
              </p>
            </div>
          </ScrollFadeWrapper>

          {categories.length > 0 && (
            <ScrollFadeWrapper delay={100}>
              <div className="flex justify-center flex-wrap gap-4 mb-12">
                <button
                  onClick={() => setActiveCategory('all')}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    activeCategory === 'all'
                      ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                      : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  {locale === 'en' ? 'All' : 'Todos'}
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.slug)}
                    className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                      activeCategory === category.slug
                        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                        : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                    }`}
                  >
                    {category.emoji} {category.name}
                  </button>
                ))}
              </div>
            </ScrollFadeWrapper>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
            </div>
          ) : projects.length === 0 ? (
            <ScrollFadeWrapper delay={200}>
              <div className="text-center py-20">
                <p className="text-white/60 text-lg">
                  {locale === 'en'
                    ? 'No projects found.'
                    : 'No se encontraron proyectos.'}
                </p>
              </div>
            </ScrollFadeWrapper>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, index) => (
                <ScrollFadeWrapper key={project.id} delay={index * 50}>
                  <PortfolioCard
                    project={project}
                    locale={locale}
                    variant="default"
                    index={index}
                  />
                </ScrollFadeWrapper>
              ))}
            </div>
          )}
        </div>
      </section>

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
