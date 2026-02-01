"use client"

import { useTranslations, useLocale } from 'next-intl'
import { useEffect, useState } from "react"
import Link from "next/link"
import { useFeaturedProjects, useProjectsByCategory, useCategories } from '@/lib/hooks'
import PortfolioCard from './portfolio-card'
import { ArrowRight } from 'lucide-react'

export default function PortfolioSection() {
  const t = useTranslations()
  const locale = useLocale()
  const [mounted, setMounted] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string>('all')

  // React Query hooks con cache
  const { data: categories = [] } = useCategories()
  const { data: featuredProjects = [], isLoading: loadingFeatured } = useFeaturedProjects(3)
  const { data: categoryProjects = [], isLoading: loadingCategory } = useProjectsByCategory(activeCategory, 5)

  // Determinar qué proyectos mostrar
  const projects = activeCategory === 'all' ? featuredProjects : categoryProjects
  const loading = activeCategory === 'all' ? loadingFeatured : loadingCategory

  useEffect(() => {
    setMounted(true)
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    const element = document.getElementById("portfolio")
    if (element) observer.observe(element)

    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="portfolio"
      className="py-24 relative overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 via-black to-gray-900/50" />

      {/* Liquid orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Top-left orb - cyan */}
        <div
          className="absolute top-[10%] left-[5%] w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] rounded-full opacity-40"
          style={{
            background: "radial-gradient(circle, rgba(6, 182, 212, 0.15), transparent 70%)",
            filter: "blur(60px)",
            animation: "orbFloat 20s ease-in-out infinite",
          }}
        />

        {/* Bottom-right orb - purple */}
        <div
          className="absolute bottom-[15%] right-[10%] w-[250px] h-[250px] sm:w-[400px] sm:h-[400px] rounded-full opacity-50"
          style={{
            background: "radial-gradient(circle, rgba(139, 92, 246, 0.18), transparent 70%)",
            filter: "blur(70px)",
            animation: "orbFloat 25s ease-in-out infinite reverse",
          }}
        />

        {/* Center accent */}
        <div
          className="absolute top-[50%] left-[50%] w-[500px] h-[500px] sm:w-[700px] sm:h-[700px]"
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

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section header */}
        <div className={`text-center mb-12 transition-all duration-1000 ${mounted && isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'}`}>
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 mb-6">
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-purple-400 animate-pulse" />
            <span className="text-sm text-white/70 font-medium">
              {t("portfolio.sectionTag") || "Proyectos"}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            {t("portfolio.title")}
          </h2>
          <p className="text-base sm:text-lg text-white/60 max-w-2xl mx-auto">
            {t("portfolio.subtitle")}
          </p>
        </div>

        {/* Category filters */}
        {categories.length > 0 && (
          <div className={`flex justify-center flex-wrap gap-3 mb-12 transition-all duration-1000 delay-200 ${mounted && isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
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

        {/* Projects Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="relative">
              <div className="w-12 h-12 rounded-full border-2 border-white/10" />
              <div className="absolute inset-0 w-12 h-12 rounded-full border-2 border-transparent border-t-cyan-400 animate-spin" />
            </div>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-16">
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
          <div
            className={`flex flex-col gap-6 max-w-4xl mx-auto transition-all duration-700 ${
              mounted && isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            {projects.map((project, index) => (
              <div
                key={project.id}
                className={`transition-all duration-700 ${mounted && isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
                style={{ transitionDelay: `${400 + index * 150}ms` }}
              >
                <PortfolioCard
                  project={project}
                  locale={locale}
                  variant="large"
                  index={index}
                />
              </div>
            ))}
          </div>
        )}

        {/* View All Button */}
        <div className={`flex justify-center mt-12 transition-all duration-1000 ${mounted && isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: "800ms" }}>
          <Link href="/portfolio">
            <button className="group relative cursor-pointer">
              {/* Button glow */}
              <div
                className="absolute -inset-1 rounded-xl opacity-0 group-hover:opacity-60 transition-all duration-500"
                style={{
                  background: "linear-gradient(135deg, rgba(6, 182, 212, 0.4), rgba(139, 92, 246, 0.4))",
                  filter: "blur(15px)",
                }}
              />
              <div className="relative flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/20 hover:border-white/40 transition-all duration-300 group-hover:scale-105">
                <span className="font-medium text-white">
                  {locale === 'en' ? 'View All Projects' : 'Ver Todos los Proyectos'}
                </span>
                <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </button>
          </Link>
        </div>
      </div>

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
    </section>
  )
}
