"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useTranslations } from 'next-intl'
import { MessageCircle, Briefcase, GraduationCap, Award, MapPin } from "lucide-react"

const statsConfig = [
  { icon: Briefcase, key: "experience", value: "2+", label: "Años Exp." },
  { icon: GraduationCap, key: "education", value: "UTP", label: "Ing. Software" },
  { icon: Award, key: "certifications", value: "5+", label: "Certificaciones" },
  { icon: MapPin, key: "location", value: "PTY", label: "Panamá" },
]

export default function AboutSection2() {
  const [mounted, setMounted] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const t = useTranslations()

  const renderBioWithLinks = (text: string) => {
    const processedText = text
      .replace(
        /\[Riservi\]/g,
        '<a href="https://www.riservi.com/" target="_blank" rel="noopener noreferrer" class="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 transition-colors">Riservi</a>',
      )

    const parts = processedText.split(/(\*.*?\*)/g)
    return parts.map((part, index) => {
      if (part.startsWith("*") && part.endsWith("*")) {
        const boldContent = part.slice(1, -1)
        return (
          <strong key={index} className="text-white font-semibold" dangerouslySetInnerHTML={{ __html: boldContent }} />
        )
      }
      return <span key={index} dangerouslySetInnerHTML={{ __html: part }} />
    })
  }

  useEffect(() => {
    setMounted(true)
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 },
    )

    const element = document.getElementById("about")
    if (element) observer.observe(element)

    return () => observer.disconnect()
  }, [])

  return (
    <section id="about" className="py-24 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900/50 to-black" />

      {/* Liquid orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Top-right orb - purple */}
        <div
          className="absolute top-[5%] right-[10%] w-[250px] h-[250px] sm:w-[350px] sm:h-[350px] rounded-full opacity-40"
          style={{
            background: "radial-gradient(circle, rgba(139, 92, 246, 0.2), transparent 70%)",
            filter: "blur(60px)",
            animation: "orbFloat 22s ease-in-out infinite",
          }}
        />

        {/* Bottom-left orb - cyan */}
        <div
          className="absolute bottom-[10%] left-[5%] w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] rounded-full opacity-50"
          style={{
            background: "radial-gradient(circle, rgba(6, 182, 212, 0.18), transparent 70%)",
            filter: "blur(70px)",
            animation: "orbFloat 25s ease-in-out infinite reverse",
          }}
        />

        {/* Center accent orb */}
        <div
          className="absolute top-[40%] left-[50%] w-[400px] h-[400px] sm:w-[600px] sm:h-[600px]"
          style={{
            transform: "translate(-50%, -50%)",
            background: "radial-gradient(ellipse at center, rgba(6, 182, 212, 0.08), transparent 60%)",
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
        <div className={`text-center mb-16 transition-all duration-1000 ${mounted && isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'}`}>
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 mb-6">
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-cyan-400 animate-pulse" />
            <span className="text-sm text-white/70 font-medium">
              {t("about.sectionTag") || "Sobre Mí"}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
            Angel Hernandez
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Profile Image - Left side */}
          <div className={`lg:col-span-5 flex justify-center transition-all duration-1000 delay-200 ${mounted && isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}>
            <div className="relative">
              {/* Glow effect behind image */}
              <div
                className="absolute -inset-4 rounded-full opacity-60"
                style={{
                  background: "radial-gradient(circle, rgba(6, 182, 212, 0.2), rgba(139, 92, 246, 0.15), transparent 70%)",
                  filter: "blur(30px)",
                }}
              />

              {/* Rotating border effect */}
              <div
                className="absolute -inset-1 rounded-full opacity-30"
                style={{
                  background: "conic-gradient(from 0deg, rgba(6, 182, 212, 0.5), rgba(139, 92, 246, 0.5), rgba(236, 72, 153, 0.3), rgba(6, 182, 212, 0.5))",
                  animation: "spin 8s linear infinite",
                }}
              />

              {/* Glass frame */}
              <div className="relative p-1 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
                <Image
                  src="/images/profile.png"
                  alt="Angel Hernandez - Software Developer"
                  width={320}
                  height={320}
                  className="relative rounded-full"
                  priority
                />
              </div>

              {/* Floating badge */}
              <div className="absolute -bottom-2 -right-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 backdrop-blur-sm border border-white/20">
                <span className="text-xs font-medium text-white">Software Developer</span>
              </div>
            </div>
          </div>

          {/* Content - Right side */}
          <div className={`lg:col-span-7 space-y-6 transition-all duration-1000 delay-400 ${mounted && isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}>
            {/* Stats bubbles */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-8">
              {statsConfig.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <div
                    key={stat.key}
                    className={`transition-all duration-500 ${mounted && isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                    style={{ transitionDelay: `${500 + index * 100}ms` }}
                  >
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group cursor-default">
                      <div className="p-1.5 rounded-lg bg-gradient-to-br from-cyan-400/20 to-purple-400/20">
                        <Icon className="w-4 h-4 text-cyan-400" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-white">{stat.value}</span>
                        <span className="text-xs text-white/50">{stat.label}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Bio content in glass card */}
            <div className="relative">
              <div
                className="absolute -inset-2 rounded-2xl opacity-20"
                style={{
                  background: "linear-gradient(135deg, rgba(6, 182, 212, 0.3), rgba(139, 92, 246, 0.2))",
                  filter: "blur(20px)",
                }}
              />
              <div className="relative p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="space-y-4 text-white/70 leading-relaxed text-sm sm:text-base">
                  <p>{renderBioWithLinks(t("about.bio1"))}</p>
                  <p>{renderBioWithLinks(t("about.bio2"))}</p>
                  <p>{renderBioWithLinks(t("about.bio3"))}</p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className={`flex justify-center lg:justify-start pt-4 transition-all duration-1000 ${mounted && isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: "900ms" }}>
              <button
                onClick={() =>
                  window.open("https://wa.me/50764776873?text=Hola%2C%20%C2%BFC%C3%B3mo%20est%C3%A1s%3F", "_blank")
                }
                className="group relative cursor-pointer"
              >
                {/* Button glow */}
                <div
                  className="absolute -inset-1 rounded-xl opacity-0 group-hover:opacity-60 transition-all duration-500"
                  style={{
                    background: "linear-gradient(135deg, rgba(6, 182, 212, 0.4), rgba(139, 92, 246, 0.4))",
                    filter: "blur(15px)",
                  }}
                />
                <div className="relative flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 backdrop-blur-sm border border-white/20 hover:border-white/40 transition-all duration-300 group-hover:scale-105">
                  <MessageCircle className="w-5 h-5 text-cyan-400 group-hover:rotate-12 transition-transform duration-300" />
                  <span className="font-medium text-white">{t("about.cta")}</span>
                </div>
              </button>
            </div>
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
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </section>
  )
}
