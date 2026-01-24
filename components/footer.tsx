"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useTranslations } from 'next-intl'
import { MessageCircle } from "lucide-react"

export default function Footer() {
  const t = useTranslations()

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <footer id="contact" className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-t from-black to-gray-900"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16 text-center md:text-left">
          {/* Portfolio */}
          <div>
            <h3 className="text-2xl font-bold mb-6 text-white">{t("footer.portfolio")}</h3>
            <div className="space-y-3">
              <div
                className="text-white/75 hover:text-white transition-colors cursor-pointer"
                onClick={() => scrollToSection("portfolio")}
              >
                {t("footer.portfolioDesign")}
              </div>
            </div>
          </div>

          {/* About Me */}
          <div>
            <h3 className="text-2xl font-bold mb-6 text-white">{t("footer.about")}</h3>
            <div className="space-y-3">
              <div
                className="text-white/75 hover:text-white transition-colors cursor-pointer"
                onClick={() => scrollToSection("about")}
              >
                {t("footer.aboutBio")}
              </div>
              {
                /* 
                <div
                className="text-white/75 hover:text-white transition-colors cursor-pointer"
                onClick={() => scrollToSection("talks")}
              >
                {t("footer.aboutTalks")}
              </div>
              <div
                className="text-white/75 hover:text-white transition-colors cursor-pointer"
                onClick={() => scrollToSection("blog")}
              >
                {t("footer.aboutArticles")}
              </div>
                */
              }
            </div>
          </div>

          {/* Let's Connect */}
          <div>
            <h3 className="text-2xl font-bold mb-6 text-white">{t("footer.connect")}</h3>
            <p className="text-white/75 mb-4">
              {t("footer.connectProject")}{" "}
              
            </p>
            <p className="text-white/75 mb-6">angelhernades26@gmail.com</p>

            <div className="mb-6">
              <Button
                className="glass glass-hover border border-white/20 hover:border-white/40 text-white font-semibold px-6 py-3 group transition-all duration-300 hover:scale-105"
                onClick={() =>
                  window.open("https://wa.me/50764776873?text=Hola%2C%20%C2%BFC%C3%B3mo%20est%C3%A1s%3F", "_blank")
                }
              >
                <MessageCircle className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                {t("about.cta")}
              </Button>
            </div>

            <div className="flex space-x-4 justify-center md:justify-start">

              <Button
                size="icon"
                className="glass glass-hover rounded-full border-white/20 hover:border-white/40"
                onClick={() => window.open("https://www.linkedin.com/in/angel-hernandez-51789a25a/", "_blank")}
              >
                <Image src="/icons/linkedin.svg" alt="LinkedIn" width={20} height={20} className="w-5 h-5" />
              </Button>
              {/*

              
              <Button
                size="icon"
                className="glass glass-hover rounded-full border-white/20 hover:border-white/40"
                onClick={() => window.open("", "_blank")}
              >
                <Image src="/icons/medium.svg" alt="Medium" width={20} height={20} className="w-5 h-5" />
              </Button>
              <Button
                size="icon"
                className="glass glass-hover rounded-full border-white/20 hover:border-white/40"
                onClick={() => window.open("", "_blank")}
              >
                <Image src="/icons/v0logo.svg" alt="v0" width={20} height={20} className="w-5 h-5" />
              </Button>
              */}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="flex justify-center items-center pt-8 border-t border-white/10">
          <div className="text-white/75 text-sm">
            {t("footer.made")} <span className="font-bold text-white">ANGEL HERNANDEZ</span> © 2025
          </div>
        </div>
      </div>
    </footer>
  )
}
