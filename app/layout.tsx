import type React from "react"
import type { Metadata } from "next"
import { Space_Grotesk } from "next/font/google"
import "./globals.css"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
  preload: true,
  fallback: ["system-ui", "arial"],
})

export const metadata: Metadata = {
  title: "Angel Hernandez - Desarrollador de Software",
  description:
    "Portfolio de Angel Hernandez: Desarrollador de Software con experiencia en React, Next.js, TypeScript, Python y tecnologías cloud. Especializado en desarrollo web y análisis de datos.",
  keywords: [
    "Angel Hernandez",
    "Desarrollador de Software",
    "Software Developer",
    "React Developer",
    "Next.js Developer",
    "Full Stack Developer Panama",
    "Frontend Developer",
    "TypeScript",
    "Python",
    "AWS",
    "Web Development",
  ],
  authors: [{ name: "Angel Hernandez" }],
  creator: "Angel Hernandez",
  publisher: "Angel Hernandez",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "es_PA",
    alternateLocale: "en_US",
    url: "https://angelhernandez.dev",
    siteName: "Angel Hernandez Portfolio",
    title: "Angel Hernandez - Desarrollador de Software",
    description:
      "Portfolio de Angel Hernandez: Desarrollador de Software con experiencia en React, Next.js, TypeScript, Python y tecnologías cloud.",
    images: [
      {
        url: "/images/portfolioimage.png",
        width: 1200,
        height: 630,
        alt: "Angel Hernandez - Desarrollador de Software Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Angel Hernandez - Desarrollador de Software",
    description:
      "Portfolio de Angel Hernandez: Desarrollador de Software con experiencia en React, Next.js, TypeScript, Python y tecnologías cloud.",
    images: ["/images/portfolioimage.png"],
  },
  alternates: {
    canonical: "",
    languages: {
      "es-PA": "",
      "en-US": "",
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${spaceGrotesk.variable} antialiased`} suppressHydrationWarning>
      <head>
        <link rel="preload" href="/images/portfolioimage.png" as="image" type="image/png" />
        <link rel="preload" href="/images/profile.png" as="image" type="image/jpeg" />
        <link rel="preload" href="/images/background.png" as="image" type="image/jpeg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Person",
                  "@id": "https://angelhernandez.dev/#person",
                  name: "Angel Hernandez",
                  description:
                    "Desarrollador de Software con experiencia en desarrollo web, análisis de datos y proyectos de TI",
                  jobTitle: ["Software Developer", "Front-End Developer", "Full Stack Developer"],
                  worksFor: [
                    {
                      "@type": "Organization",
                      name: "Riservi",
                      description: "Company where I worked as Front-End Developer",
                    },
                  ],
                  nationality: "Panama",
                  birthPlace: "Ciudad de Panamá, Panamá",
                  url: "https://angelhernandez.dev",
                  image: "https://angelhernandez.dev/images/profile.jpg",
                  sameAs: [
                    "https://www.linkedin.com/in/angel-hernandez-51789a25a/",
                  ],
                  knowsAbout: [
                    "React",
                    "Next.js",
                    "TypeScript",
                    "JavaScript",
                    "Python",
                    "FastAPI",
                    "SQL",
                    "MongoDB",
                    "Supabase",
                    "AWS",
                    "Azure",
                    "Data Analysis",
                    "Machine Learning",
                    "Web Development",
                  ],
                  alumniOf: "Universidad - Licenciatura en Ingeniería de Software",
                  hasOccupation: {
                    "@type": "Occupation",
                    name: "Software Developer",
                    description:
                      "Specializes in web development with React, Next.js, and modern technologies",
                  },
                  hasCredential: [
                    {
                      "@type": "EducationalOccupationalCredential",
                      name: "Samsung Innovation Campus SIC 2024",
                      description: "Data Analyst and Machine Learning",
                    },
                    {
                      "@type": "EducationalOccupationalCredential",
                      name: "The Complete 2023 Web Development Bootcamp",
                      credentialCategory: "certificate",
                    },
                    {
                      "@type": "EducationalOccupationalCredential",
                      name: "AWS Academy Cloud Foundations",
                      credentialCategory: "certificate",
                    },
                  ],
                },
                {
                  "@type": "WebSite",
                  "@id": "https://angelhernandez.dev/#website",
                  url: "https://angelhernandez.dev",
                  name: "Angel Hernandez Portfolio",
                  description: "Portfolio profesional de Angel Hernandez - Desarrollador de Software",
                  publisher: {
                    "@id": "https://angelhernandez.dev/#person",
                  },
                  inLanguage: ["es-PA", "en-US"],
                },
              ],
            }),
          }}
        />
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      </head>
      <body className={spaceGrotesk.className}>
        {children}
      </body>
    </html>
  )
}
