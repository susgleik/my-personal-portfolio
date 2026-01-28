"use client"

import { useTranslations, useLocale } from 'next-intl'
import { useEffect, useState } from "react"
import Link from "next/link"
import { getProjectsByCategory, getCategories, getFeaturedProjects } from '@/lib/firestore'
import type { Project, Category } from '@/types'
import PortfolioCard from './portfolio-card'
import { Button } from './ui/button'
import { Loader2, ArrowRight } from 'lucide-react'

export default function PortfolioSection() {
  const t = useTranslations()
  const locale = useLocale()
  const [isVisible, setIsVisible] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [activeCategory, setActiveCategory] = useState<string>('all')

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  // Cargar categorías
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories()
        setCategories(data)
      } catch (error) {
        console.error('Error fetching categories:', error)
      } finally {
        setLoadingCategories(false)
      }
    }
    fetchCategories()
  }, [])

  // Cargar proyectos
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true)
      try {
        if (activeCategory === 'all') {
          // Cargar los primeros 5 proyectos destacados
          const data = await getFeaturedProjects(3)
          setProjects(data)
        } else {
          // Filtrar por categoría
          const data = await getProjectsByCategory(activeCategory, { limit: 5 })
          setProjects(data)
        }
      } catch (error) {
        console.error('Error fetching projects:', error)
      } finally {
        setLoading(false)
      }
    }

    if (!loadingCategories) {
      fetchProjects()
    }
  }, [activeCategory, loadingCategories])

  return (
    <section
      id="portfolio"
      className="py-16 md:py-24 bg-gradient-to-b from-black to-gray-900/80 relative overflow-hidden"
    >
      {/* Background effects */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 animate-fadeInUp">
            {t("portfolio.title")}
          </h2>
          <p
            className="text-lg md:text-xl text-white/75 max-w-3xl mx-auto animate-fadeInUp mb-8"
            style={{ animationDelay: "0.2s" }}
          >
            {t("portfolio.subtitle")}
          </p>

          {/* Category buttons - solo mostrar si hay categorías */}
          {categories.length > 0 && (
            <div className="flex justify-center flex-wrap gap-4 mb-8">
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeCategory === 'all'
                    ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25"
                    : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
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
                      ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25"
                      : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
                  }`}
                >
                  {category.emoji} {category.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Projects Grid - Large cards (1 per row) */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-white/60">
              {locale === 'en'
                ? 'No projects found. Check back soon!'
                : 'No se encontraron proyectos. ¡Vuelve pronto!'}
            </p>
          </div>
        ) : (
          <div
            className={`flex flex-col gap-6 max-w-4xl mx-auto transition-all duration-700 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            {projects.map((project, index) => (
              <PortfolioCard
                key={project.id}
                project={project}
                locale={locale}
                variant="large"
                index={index}
              />
            ))}
          </div>
        )}

        {/* View More Button */}
        <div className="text-center mt-12">
          <Link href="/portfolio">
            <Button
              size="lg"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40 rounded-full px-8"
            >
              {locale === 'en' ? 'View All Projects' : 'Ver Todos los Proyectos'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
