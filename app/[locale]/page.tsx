import Navbar from "@/components/navbar"
import HeroSection from "@/components/hero-section"
import PortfolioSection from "@/components/portfolio-section"
import Footer from "@/components/footer"
import AboutSection from "@/components/about-section"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <PortfolioSection />
      <Footer />
    </main>
  )
}