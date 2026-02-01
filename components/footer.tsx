"use client"

import Image from "next/image"
import { useTranslations } from 'next-intl'
import { useEffect, useState } from "react"
import { MessageCircle, Mail, MapPin } from "lucide-react"

export default function Footer() {
  const t = useTranslations()
  const [mounted, setMounted] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

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

    const element = document.getElementById("contact")
    if (element) observer.observe(element)

    return () => observer.disconnect()
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <footer id="contact" className="py-24 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-gray-900/80 to-gray-900/50" />

      {/* Liquid orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Bottom-left orb - cyan */}
        <div
          className="absolute bottom-[10%] left-[5%] w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] rounded-full opacity-30"
          style={{
            background: "radial-gradient(circle, rgba(6, 182, 212, 0.2), transparent 70%)",
            filter: "blur(60px)",
            animation: "orbFloat 22s ease-in-out infinite",
          }}
        />

        {/* Top-right orb - purple */}
        <div
          className="absolute top-[20%] right-[10%] w-[200px] h-[200px] sm:w-[250px] sm:h-[250px] rounded-full opacity-40"
          style={{
            background: "radial-gradient(circle, rgba(139, 92, 246, 0.18), transparent 70%)",
            filter: "blur(50px)",
            animation: "orbFloat 20s ease-in-out infinite reverse",
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

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${mounted && isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'}`}>
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 mb-6">
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-purple-400 animate-pulse" />
            <span className="text-sm text-white/70 font-medium">
              {t("footer.sectionTag") || "Contacto"}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            {t("footer.connect")}
          </h2>
          <p className="text-base sm:text-lg text-white/60 max-w-xl mx-auto">
            {t("footer.connectProject")}
          </p>
        </div>

        {/* Main content grid */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 transition-all duration-1000 delay-200 ${mounted && isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Portfolio Card */}
          <div className="group relative">
            <div
              className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500"
              style={{
                background: "linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(139, 92, 246, 0.15))",
                filter: "blur(15px)",
              }}
            />
            <div className="relative p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 h-full">
              <h3 className="text-lg font-bold mb-4 text-white">{t("footer.portfolio")}</h3>
              <div className="space-y-3">
                <button
                  className="text-white/60 hover:text-cyan-400 transition-colors cursor-pointer text-sm text-left"
                  onClick={() => scrollToSection("portfolio")}
                >
                  → {t("footer.portfolioDesign")}
                </button>
              </div>
            </div>
          </div>

          {/* About Me Card */}
          <div className="group relative">
            <div
              className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500"
              style={{
                background: "linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(139, 92, 246, 0.15))",
                filter: "blur(15px)",
              }}
            />
            <div className="relative p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 h-full">
              <h3 className="text-lg font-bold mb-4 text-white">{t("footer.about")}</h3>
              <div className="space-y-3">
                <button
                  className="text-white/60 hover:text-cyan-400 transition-colors cursor-pointer text-sm text-left"
                  onClick={() => scrollToSection("about")}
                >
                  → {t("footer.aboutBio")}
                </button>
              </div>
            </div>
          </div>

          {/* Contact Card */}
          <div className="group relative">
            <div
              className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500"
              style={{
                background: "linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(139, 92, 246, 0.15))",
                filter: "blur(15px)",
              }}
            />
            <div className="relative p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 h-full">
              <h3 className="text-lg font-bold mb-4 text-white">{t("footer.connectTouch")}</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-white/60 text-sm">
                  <Mail className="w-4 h-4 text-cyan-400" />
                  <span>angelhernades26@gmail.com</span>
                </div>
                <div className="flex items-center gap-2 text-white/60 text-sm">
                  <MapPin className="w-4 h-4 text-cyan-400" />
                  <span>Panamá City, Panamá</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA and Social */}
        <div className={`flex flex-col items-center gap-8 mb-16 transition-all duration-1000 delay-400 ${mounted && isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* WhatsApp CTA Button */}
          <button
            onClick={() =>
              window.open("https://wa.me/50764776873?text=Hola%2C%20%C2%BFC%C3%B3mo%20est%C3%A1s%3F", "_blank")
            }
            className="group relative cursor-pointer"
          >
            <div
              className="absolute -inset-1 rounded-xl opacity-0 group-hover:opacity-60 transition-all duration-500"
              style={{
                background: "linear-gradient(135deg, rgba(6, 182, 212, 0.4), rgba(139, 92, 246, 0.4))",
                filter: "blur(15px)",
              }}
            />
            <div className="relative flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 backdrop-blur-sm border border-white/20 hover:border-white/40 transition-all duration-300 group-hover:scale-105">
              <MessageCircle className="w-5 h-5 text-cyan-400 group-hover:rotate-12 transition-transform duration-300" />
              <span className="font-semibold text-white">{t("about.cta")}</span>
            </div>
          </button>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {/* LinkedIn */}
            <button
              onClick={() => window.open("https://www.linkedin.com/in/angel-hernandez-51789a25a/", "_blank")}
              className="group relative cursor-pointer"
            >
              <div
                className="absolute -inset-1 rounded-full opacity-0 group-hover:opacity-60 transition-all duration-500"
                style={{
                  background: "linear-gradient(135deg, rgba(6, 182, 212, 0.3), rgba(139, 92, 246, 0.3))",
                  filter: "blur(10px)",
                }}
              />
              <div className="relative w-12 h-12 flex items-center justify-center rounded-full bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/30 transition-all duration-300 group-hover:scale-110">
                <Image src="/icons/linkedin.svg" alt="LinkedIn" width={20} height={20} className="w-5 h-5" />
              </div>
            </button>

            {/* GitHub */}
            <button
              onClick={() => window.open("https://github.com/susgleik", "_blank")}
              className="group relative cursor-pointer"
            >
              <div
                className="absolute -inset-1 rounded-full opacity-0 group-hover:opacity-60 transition-all duration-500"
                style={{
                  background: "linear-gradient(135deg, rgba(6, 182, 212, 0.3), rgba(139, 92, 246, 0.3))",
                  filter: "blur(10px)",
                }}
              />
              <div className="relative w-12 h-12 flex items-center justify-center rounded-full bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/30 transition-all duration-300 group-hover:scale-110">
                <Image src="/images/github.png" alt="GitHub" width={20} height={20} className="w-5 h-5" />
              </div>
            </button>
          </div>
        </div>

        {/* Copyright */}
        <div className={`flex justify-center items-center pt-8 border-t border-white/10 transition-all duration-1000 delay-600 ${mounted && isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <div className="text-white/50 text-sm">
            {t("footer.made")}{" "}
            <span className="font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              ANGEL HERNANDEZ
            </span>{" "}
            © 2026
          </div>
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
    </footer>
  )
}
