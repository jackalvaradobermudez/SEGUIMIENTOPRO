import type { Metadata } from 'next'
import { LandingNavbar } from '@/components/landing/navbar'
import { HeroSection } from '@/components/landing/hero'
import { ProblemSection } from '@/components/landing/problem-section'
import { FeaturesSection } from '@/components/landing/features-section'
import { AppPreviewSection } from '@/components/landing/app-preview'
import { PricingSection } from '@/components/landing/pricing-section'
import { TestimonialsSection } from '@/components/landing/testimonials-section'
import { CtaSection } from '@/components/landing/cta-section'
import { LandingFooter } from '@/components/landing/footer'

export const metadata: Metadata = {
  title: 'SeguimientoPro — Gestión de cobros para emprendedores',
  description:
    'Registra ventas, cobra a tiempo y no pierdas dinero. El sistema de gestión de cobros y ventas a crédito para emprendedores latinoamericanos.',
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'SeguimientoPro',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'COP',
  },
  description:
    'Sistema de gestión de cobros y ventas a crédito para emprendedores latinoamericanos.',
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#09090b]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LandingNavbar />
      <main>
        <HeroSection />
        <ProblemSection />
        <FeaturesSection />
        <AppPreviewSection />
        <PricingSection />
        <TestimonialsSection />
        <CtaSection />
      </main>
      <LandingFooter />
    </div>
  )
}
