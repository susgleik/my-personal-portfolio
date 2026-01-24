"use client"

import { Button } from "@/components/ui/button"
import { useTranslations } from 'next-intl'
import Image from "next/image"

export default function CompaniesSection() {
  const t = useTranslations()

  const renderTextWithBold = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g)
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={index} className="text-white font-semibold">
            {part.slice(2, -2)}
          </strong>
        )
      }
      return part
    })
  }

  return (
    <section className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black"></div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Eluter Column */}
          <div className="space-y-6">
            <div className="flex justify-center mb-6">
              <Image
                src="/icons/eluterlogo.svg"
                alt="Eluter Logo"
                width={120}
                height={60}
                className="opacity-90 hover:opacity-100 transition-opacity duration-300"
              />
            </div>

            <p className="text-white/75 leading-relaxed mb-6">
              {renderTextWithBold(t("companies.eluter.description"))}
            </p>

            {/* Eluter Video */}
            <div className="mb-6">
              <div style={{ position: "relative", paddingTop: "56.25%" }}>
                <iframe
                  src="https://iframe.mediadelivery.net/embed/468731/c82c6556-b7ee-4854-88bb-6f3b1f11eac7?autoplay=false&loop=false&muted=false&preload=true&responsive=true"
                  loading="lazy"
                  style={{ border: 0, position: "absolute", top: 0, height: "100%", width: "100%" }}
                  allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;"
                  allowFullScreen={true}
                  className="rounded-lg"
                />
              </div>
            </div>

            <Button
              className="glass glass-hover border border-white/20 hover:border-white/40 text-white font-semibold px-6 py-3 transition-all duration-300 hover:scale-105"
              onClick={() => window.open("https://www.eluter.com/", "_blank")}
            >
              {t("companies.eluter.button")}
            </Button>
          </div>

          {/* DESAFIA Column */}
          <div className="space-y-6">
            <div className="flex justify-center mb-6">
              <Image
                src="/icons/desafialogo.svg"
                alt="DESAFIA Logo"
                width={120}
                height={60}
                className="opacity-90 hover:opacity-100 transition-opacity duration-300"
              />
            </div>

            <p className="text-white/75 leading-relaxed mb-6">
              {renderTextWithBold(t("companies.desafia.description"))}
            </p>

            {/* DESAFIA Video */}
            <div className="mb-6">
              <div style={{ position: "relative", paddingTop: "56.25%" }}>
                <iframe
                  src="https://iframe.mediadelivery.net/embed/468731/a1f38e78-d887-4a33-a625-34d099932bc8?autoplay=false&loop=false&muted=false&preload=true&responsive=true"
                  loading="lazy"
                  style={{ border: 0, position: "absolute", top: 0, height: "100%", width: "100%" }}
                  allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;"
                  allowFullScreen={true}
                  className="rounded-lg"
                />
              </div>
            </div>

            <Button
              className="glass glass-hover border border-white/20 hover:border-white/40 text-white font-semibold px-6 py-3 transition-all duration-300 hover:scale-105"
              onClick={() => window.open("https://desafia.tech/", "_blank")}
            >
              {t("companies.desafia.button")}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
