"use client"
import { ChevronDown, Code2, Brain, Rocket, Globe, Database, Cloud, Smartphone, Zap } from "lucide-react"
import { useEffect, useState } from "react"
import { useTranslations } from 'next-intl'
import Image from 'next/image'

const skillsConfig = [
  { icon: Code2, key: "webApps", color: "from-cyan-400 to-cyan-600" },
  { icon: Brain, key: "ai", color: "from-purple-400 to-purple-600" },
  { icon: Globe, key: "scalable", color: "from-blue-400 to-blue-600" },
  { icon: Rocket, key: "performance", color: "from-pink-400 to-pink-600" },
  { icon: Database, key: "databases", color: "from-emerald-400 to-emerald-600" },
  { icon: Cloud, key: "cloud", color: "from-indigo-400 to-indigo-600" },
  { icon: Smartphone, key: "responsive", color: "from-orange-400 to-orange-600" },
  { icon: Zap, key: "fullStack", color: "from-yellow-400 to-yellow-600" },
]

export default function HeroLiquid() {
  const [mounted, setMounted] = useState(false)
  const [activeWord, setActiveWord] = useState(0)
  const [hoveredSkill, setHoveredSkill] = useState<number | null>(null)
  const t = useTranslations('hero')

  const words = [
    t('words.software'),
    t('words.experiences'),
    t('words.solutions'),
    t('words.products')
  ]

  useEffect(() => {
    setMounted(true)
    const interval = setInterval(() => {
      setActiveWord((prev) => (prev + 1) % words.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [words.length])

  const scrollToAbout = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section id="home" className="min-h-screen relative flex items-center justify-center overflow-hidden pt-16 md:pt-0">
      {/* Background - Using Next.js Image for optimized loading */}
      <div className="absolute inset-0">
        <Image
          src="/images/background.png"
          alt=""
          fill
          priority
          className="object-cover opacity-10"
          sizes="100vw"
        />
      </div>

      {/* Simplified liquid orbs - cleaner, fewer, better positioned */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Central glow */}
        <div
          className="absolute top-1/2 left-1/2 w-[500px] h-[500px] sm:w-[700px] sm:h-[700px]"
          style={{
            transform: "translate(-50%, -50%)",
            background: "radial-gradient(ellipse at center, rgba(6, 182, 212, 0.12), transparent 60%)",
          }}
        />

        {/* Top-left orb */}
        <div
          className="absolute top-[10%] left-[5%] w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] rounded-full opacity-60"
          style={{
            background: "radial-gradient(circle, rgba(6, 182, 212, 0.2), transparent 70%)",
            filter: "blur(60px)",
            animation: "orbFloat 20s ease-in-out infinite",
          }}
        />

        {/* Bottom-right orb */}
        <div
          className="absolute bottom-[15%] right-[5%] w-[250px] h-[250px] sm:w-[350px] sm:h-[350px] rounded-full opacity-50"
          style={{
            background: "radial-gradient(circle, rgba(139, 92, 246, 0.18), transparent 70%)",
            filter: "blur(70px)",
            animation: "orbFloat 25s ease-in-out infinite reverse",
          }}
        />

        {/* Accent orb */}
        <div
          className="absolute top-[60%] left-[10%] w-[150px] h-[150px] sm:w-[200px] sm:h-[200px] rounded-full opacity-40"
          style={{
            background: "radial-gradient(circle, rgba(236, 72, 153, 0.15), transparent 70%)",
            filter: "blur(50px)",
            animation: "orbFloat 18s ease-in-out infinite",
            animationDelay: "-5s",
          }}
        />
      </div>

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "100px 100px",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center">
        <div>
          {/* Brand Introduction - Clean and minimal */}
          <div className={`mb-8 sm:mb-12 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'}`}>
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-purple-400 animate-pulse" />
              <span className="text-sm sm:text-base text-white/70 font-medium tracking-wide">
                <span className="text-white font-semibold">Angel Hernandez</span>
                <span className="mx-2 text-white/30">|</span>
                <span>Software Developer</span>
              </span>
            </div>
          </div>

          {/* Main title with morphing word */}
          <div className="relative mb-10 sm:mb-14">
            <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white px-2 mb-6 transition-all duration-1000 delay-200 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
              {t('titlePrefix')}{" "}
              <span className="relative inline-block min-w-[180px] sm:min-w-[280px] md:min-w-[380px]">
                <span className="absolute inset-0 flex items-center justify-center">
                  {words.map((word, index) => (
                    <span
                      key={word}
                      className={`absolute transition-all duration-700 ease-out ${
                        activeWord === index
                          ? 'opacity-100 translate-y-0 scale-100 blur-0'
                          : 'opacity-0 translate-y-6 scale-90 blur-sm'
                      }`}
                      style={{
                        background: "linear-gradient(135deg, #22d3ee, #a855f7, #22d3ee)",
                        backgroundSize: "200% 200%",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        animation: activeWord === index ? "gradientShift 4s ease infinite" : "none",
                      }}
                    >
                      {word}
                    </span>
                  ))}
                </span>
                <span className="invisible">{words[0]}</span>
              </span>
            </h1>

            <p className={`text-base sm:text-lg md:text-xl text-white/60 max-w-2xl mx-auto transition-all duration-1000 delay-500 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
              {t('subtitle')}
            </p>

            {/* Word indicator dots */}
            <div className="flex justify-center gap-2 mt-8">
              {words.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveWord(index)}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    activeWord === index
                      ? 'bg-gradient-to-r from-cyan-400 to-purple-400 w-8'
                      : 'bg-white/20 hover:bg-white/40 w-1.5'
                  }`}
                  aria-label={`Select word ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Skills as floating glass bubbles */}
          <div className={`relative transition-all duration-1000 delay-700 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 max-w-4xl mx-auto">
              {skillsConfig.map((skill, index) => {
                const Icon = skill.icon
                const isHovered = hoveredSkill === index
                const label = t(`skills.${skill.key}`)
                return (
                  <div
                    key={skill.key}
                    className={`transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                    style={{
                      transitionDelay: `${800 + index * 60}ms`,
                    }}
                    onMouseEnter={() => setHoveredSkill(index)}
                    onMouseLeave={() => setHoveredSkill(null)}
                  >
                    <div
                      className={`relative cursor-pointer transition-all duration-300 ${isHovered ? 'scale-105 -translate-y-1' : 'scale-100'}`}
                    >
                      {/* Glow effect on hover */}
                      <div
                        className={`absolute -inset-1 rounded-xl transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                        style={{
                          background: `linear-gradient(135deg, ${skill.color.includes('cyan') ? 'rgba(6, 182, 212, 0.3)' : skill.color.includes('purple') ? 'rgba(139, 92, 246, 0.3)' : skill.color.includes('pink') ? 'rgba(236, 72, 153, 0.3)' : skill.color.includes('emerald') ? 'rgba(16, 185, 129, 0.3)' : skill.color.includes('blue') ? 'rgba(59, 130, 246, 0.3)' : skill.color.includes('indigo') ? 'rgba(99, 102, 241, 0.3)' : skill.color.includes('orange') ? 'rgba(249, 115, 22, 0.3)' : 'rgba(234, 179, 8, 0.3)'}, transparent)`,
                          filter: "blur(12px)",
                        }}
                      />

                      {/* Glass bubble */}
                      <div
                        className={`relative flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl transition-all duration-300 ${
                          isHovered
                            ? 'bg-white/10 border-white/30'
                            : 'bg-white/5 border-white/10'
                        } backdrop-blur-sm border`}
                      >
                        {/* Icon with gradient */}
                        <div className={`relative p-1 sm:p-1.5 rounded-md bg-gradient-to-br ${skill.color}`}>
                          <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                        </div>

                        {/* Label */}
                        <span className={`text-xs sm:text-sm font-medium transition-colors duration-300 ${isHovered ? 'text-white' : 'text-white/60'}`}>
                          {label}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Scroll Button */}
          <div className={`flex justify-center mt-14 sm:mt-20 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: "1400ms" }}>
            <button
              onClick={scrollToAbout}
              className="group relative cursor-pointer"
              aria-label="Scroll to about section"
            >
              <div
                className="absolute -inset-2 rounded-full opacity-0 group-hover:opacity-60 transition-all duration-500"
                style={{
                  background: "linear-gradient(135deg, rgba(6, 182, 212, 0.3), rgba(139, 92, 246, 0.3))",
                  filter: "blur(15px)",
                }}
              />
              <div className="relative rounded-full p-3 bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group-hover:scale-110">
                <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-white/50 group-hover:text-white/80 transition-colors" />
              </div>
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes orbFloat {
          0%, 100% {
            transform: translate(0, 0);
          }
          25% {
            transform: translate(20px, -15px);
          }
          50% {
            transform: translate(-10px, 10px);
          }
          75% {
            transform: translate(15px, 5px);
          }
        }
        @keyframes gradientShift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
      `}</style>
    </section>
  )
}
