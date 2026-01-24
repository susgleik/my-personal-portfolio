import Navbar from "@/components/navbar"
import HeroSection from "@/components/hero-section"
import AboutSection from "@/components/about-section"
import PortfolioSection from "@/components/portfolio-section"
import Footer from "@/components/footer"
import ScrollFadeWrapper from "@/components/scroll-fade-wrapper"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900">
      <Navbar />

      <ScrollFadeWrapper delay={100}>
        <HeroSection />
      </ScrollFadeWrapper>

      <ScrollFadeWrapper delay={200}>
        <AboutSection />
      </ScrollFadeWrapper>

      <ScrollFadeWrapper delay={400}>
        <PortfolioSection />
      </ScrollFadeWrapper>

      <ScrollFadeWrapper delay={700}>
        <Footer />
      </ScrollFadeWrapper>
    </main>
  )
}