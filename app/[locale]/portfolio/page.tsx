'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Navbar from '@/components/navbar';
import PortfolioCard from '@/components/portfolio-card';
import { usePublishedProjects, useProjectsByCategory, useCategories } from '@/lib/hooks';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PortfolioPage() {
  const t = useTranslations();
  const locale = useLocale();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

      <section className="flex-1 pt-24 pb-12 md:pt-32 md:pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 via-black to-gray-900/50" />

        {/* Liquid orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Top-left orb - cyan */}
          <div
            className="absolute top-[5%] left-[5%] w-[200px] h-[200px] sm:w-[350px] sm:h-[350px] rounded-full opacity-40"
            style={{
              background: "radial-gradient(circle, rgba(6, 182, 212, 0.15), transparent 70%)",
              filter: "blur(60px)",
              animation: "orbFloat 20s ease-in-out infinite",
            }}
          />

          {/* Bottom-right orb - purple */}
          <div
            className="absolute bottom-[10%] right-[5%] w-[250px] h-[250px] sm:w-[450px] sm:h-[450px] rounded-full opacity-50"
            style={{
              background: "radial-gradient(circle, rgba(139, 92, 246, 0.18), transparent 70%)",
              filter: "blur(70px)",
              animation: "orbFloat 25s ease-in-out infinite reverse",
            }}
          />

          {/* Center accent */}
          <div
            className="absolute top-[40%] left-[50%] w-[500px] h-[500px] sm:w-[800px] sm:h-[800px]"
            style={{
              transform: "translate(-50%, -50%)",
              background: "radial-gradient(ellipse at center, rgba(6, 182, 212, 0.06), transparent 60%)",
            }}
          />
        </div>

        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "80px 80px",
          }}
        />

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Header */}
          <div className={`text-center mb-12 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'}`}>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm mb-6 transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              {locale === 'en' ? 'Back to Home' : 'Volver al Inicio'}
            </Link>

            {/* Section badge */}
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-purple-400 animate-pulse" />
                <span className="text-sm text-white/70 font-medium">
                  {t('portfolio.sectionTag') || 'Projects'}
                </span>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              {t('portfolio.title')}
            </h1>
            <p className="text-lg md:text-xl text-white/60 max-w-3xl mx-auto">
              {t('portfolio.subtitle')}
            </p>
          </div>

          {/* Category filters */}
          {categories.length > 0 && (
            <div className={`flex justify-center flex-wrap gap-3 mb-12 transition-all duration-1000 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer ${
                  activeCategory === 'all'
                    ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-white/30 text-white"
                    : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white"
                } backdrop-blur-sm border`}
              >
                {locale === 'en' ? 'All' : 'Todos'}
              </button>
              {categories.map((category, index) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.slug)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer ${
                    activeCategory === category.slug
                      ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-white/30 text-white"
                      : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white"
                  } backdrop-blur-sm border`}
                  style={{ transitionDelay: `${(index + 1) * 50}ms` }}
                >
                  {category.emoji} {category.name}
                </button>
              ))}
            </div>
          )}

          {/* Loading state */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="relative">
                <div className="w-12 h-12 rounded-full border-2 border-white/10" />
                <div className="absolute inset-0 w-12 h-12 rounded-full border-2 border-transparent border-t-cyan-400 animate-spin" />
              </div>
            </div>
          ) : projects.length === 0 ? (
            <div className={`text-center py-16 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 border border-white/10 mb-4">
                <span className="text-2xl">📂</span>
              </div>
              <p className="text-white/50">
                {locale === 'en'
                  ? 'No projects found. Check back soon!'
                  : 'No se encontraron proyectos. ¡Vuelve pronto!'}
              </p>
            </div>
          ) : (
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '300ms' }}>
              {projects.map((project, index) => (
                <div
                  key={project.id}
                  className={`transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
                  style={{ transitionDelay: `${400 + index * 100}ms` }}
                >
                  <PortfolioCard
                    project={project}
                    locale={locale}
                    variant="default"
                    index={index}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-white/10 relative z-10">
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
