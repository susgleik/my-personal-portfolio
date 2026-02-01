import Navbar from "@/components/navbar"
import HeroSection from "@/components/hero-section"
import AboutSection from "@/components/about-section"
import PortfolioSection from "@/components/portfolio-section"
import Footer from "@/components/footer"
import ScrollFadeWrapper from "@/components/scroll-fade-wrapper"
import PageLoader from "@/components/page-loader"

export default function Home() {
  return (
    <PageLoader>
      <main className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900">
        <Navbar />

        <ScrollFadeWrapper delay={0}>
          <HeroSection />
        </ScrollFadeWrapper>

        <ScrollFadeWrapper delay={50}>
          <AboutSection />
        </ScrollFadeWrapper>

        <ScrollFadeWrapper delay={100}>
          <PortfolioSection />
        </ScrollFadeWrapper>

        <ScrollFadeWrapper delay={150}>
          <Footer />
        </ScrollFadeWrapper>
      </main>
    </PageLoader>
  )
}