"use client"

import { useState, useEffect } from "react"
import { useTranslations, useLocale } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/routing'
import { Globe, Menu, X, ArrowLeft } from "lucide-react"
import { Link } from '@/i18n/routing'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const t = useTranslations()
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const isStreamingPage = pathname === "/streaming"
  const isHackathonPage = pathname === "/hackathon"
  const isProjectDetailPage = pathname.startsWith("/portfolio/") && pathname !== "/portfolio"
  const isPortfolioListPage = pathname === "/portfolio"
  const isSubPage = isStreamingPage || isHackathonPage || isProjectDetailPage || isPortfolioListPage

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 50
      setIsScrolled(scrolled)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const scrollToSection = (id: string) => {
    if (pathname !== "/") {
      // Navigate to home page and then scroll to section
      router.push(`/#${id}`)
      setIsMobileMenuOpen(false)
      return
    }
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
    setIsMobileMenuOpen(false)
  }

  const toggleLanguage = () => {
    const newLocale = locale === "en" ? "es" : "en"
    router.replace(pathname, { locale: newLocale })
  }

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 outline-none ${isScrolled ? "px-4 py-2" : ""}`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div
        className={`max-w-7xl mx-auto transition-all duration-300 ${
          isScrolled
            ? "glass rounded-2xl px-6 py-3 border border-white/15"
            : "px-4 sm:px-6 py-4 border border-transparent"
        }`}
      >
        <div className="flex items-center justify-between">
          <Link href="/" className="text-lg sm:text-xl font-bold text-white md:flex-1">
            Angel Hernandez
          </Link>

          {isSubPage && (
            <div className="hidden md:flex items-center mr-6">
              <Link
                href="/"
                className="inline-flex items-center space-x-2 nav-item text-white/75 hover:text-white transition-colors relative"
              >
                <ArrowLeft size={20} />
                <span>{t("portfolio.backToHome")}</span>
              </Link>
            </div>
          )}

          {!isSubPage && (
            <div className="hidden md:flex items-center space-x-8 mr-6">
              <button
                onClick={() => scrollToSection("home")}
                className="nav-item text-white/75 hover:text-white transition-colors relative cursor-pointer"
                aria-label="Navigate to home section"
              >
                {t("nav.home")}
              </button>
              <button
                onClick={() => scrollToSection("about")}
                className="nav-item text-white/75 hover:text-white transition-colors relative cursor-pointer"
                aria-label="Navigate to about section"
              >
                {t("nav.about")}
              </button>
              <button
                onClick={() => scrollToSection("portfolio")}
                className="nav-item text-white/75 hover:text-white transition-colors relative cursor-pointer"
                aria-label="Navigate to portfolio section"
              >
                {t("nav.portfolio")}
              </button>
{/* Articles, Talks, Streaming, Hackathon - Ocultos temporalmente */}
              <button
                onClick={() => scrollToSection("contact")}
                className="nav-item text-white/75 hover:text-white transition-colors relative cursor-pointer"
                aria-label="Navigate to contact section"
              >
                {t("nav.contact")}
              </button>
            </div>
          )}

          <div className="hidden md:flex items-center">
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-2 text-white hover:text-white/80 transition-colors glass px-3 py-2 rounded-lg cursor-pointer"
              aria-label={`Switch to ${locale === "en" ? "Spanish" : "English"} language`}
            >
              <Globe size={16} />
              <span className="text-sm font-medium">{locale === "en" ? "ES" : "EN"}</span>
            </button>
          </div>

          <div className="md:hidden flex items-center space-x-3">
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-1 text-white hover:text-white/80 transition-colors glass px-2 py-1 rounded-lg ml-2"
              aria-label={`Switch to ${locale === "en" ? "Spanish" : "English"} language`}
            >
              <Globe size={14} />
              <span className="text-xs font-medium">{locale === "en" ? "ES" : "EN"}</span>
            </button>

            {isSubPage && (
              <Link
                href="/"
                className="text-white hover:text-white/80 transition-colors glass p-2 rounded-lg"
                aria-label="Back to home"
              >
                <ArrowLeft size={20} />
              </Link>
            )}

            {!isSubPage && (
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-white hover:text-white/80 transition-colors glass p-2 rounded-lg"
                aria-label={isMobileMenuOpen ? "Close mobile menu" : "Open mobile menu"}
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            )}
          </div>
        </div>

        {isMobileMenuOpen && !isStreamingPage && !isHackathonPage && (
          <div className="md:hidden mt-4 glass rounded-lg p-4" role="menu">
            <div className="flex flex-col space-y-4 text-center">
              <button
                onClick={() => scrollToSection("home")}
                className="text-white hover:text-white/80 transition-colors py-2"
                role="menuitem"
                aria-label="Navigate to home section"
              >
                {t("nav.home")}
              </button>
              <button
                onClick={() => scrollToSection("about")}
                className="text-white hover:text-white/80 transition-colors py-2"
                role="menuitem"
                aria-label="Navigate to about section"
              >
                {t("nav.about")}
              </button>
              <button
                onClick={() => scrollToSection("portfolio")}
                className="text-white hover:text-white/80 transition-colors py-2"
                role="menuitem"
                aria-label="Navigate to portfolio section"
              >
                {t("nav.portfolio")}
              </button>
{/* Articles, Talks, Streaming, Hackathon - Ocultos temporalmente */}
              <button
                onClick={() => scrollToSection("contact")}
                className="text-white hover:text-white/80 transition-colors py-2"
                role="menuitem"
                aria-label="Navigate to contact section"
              >
                {t("nav.contact")}
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
