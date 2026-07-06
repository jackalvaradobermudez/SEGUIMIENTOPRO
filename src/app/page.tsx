import type { Metadata } from 'next'
import { LandingNavbar } from '@/components/landing/navbar'
import { HeroSection } from '@/components/landing/hero'
import { SocialProofBar } from '@/components/landing/social-proof'
import { ProblemSection } from '@/components/landing/problem-section'
import { SolutionSection } from '@/components/landing/solution-section'
import { HowItWorks } from '@/components/landing/how-it-works'
import { ComparisonSection } from '@/components/landing/comparison-section'
import { TestimonialsSection } from '@/components/landing/testimonials-section'
import { PricingSection } from '@/components/landing/pricing-section'
import { FaqSection } from '@/components/landing/faq-section'
import { CtaSection } from '@/components/landing/cta-section'
import { LandingFooter } from '@/components/landing/footer'

export const metadata: Metadata = {
  title: 'SeguimientoPro — Deja de cobrar de memoria',
  description:
    'Controla quién te debe, cuánto te debe y qué debes cobrar hoy. El sistema de gestión de cobros para emprendedores que venden a crédito.',
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'SeguimientoPro',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'COP' },
  description: 'Sistema de gestión de cobros y ventas a crédito para emprendedores latinoamericanos.',
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <LandingNavbar />
      <main>
        <HeroSection />
        <SocialProofBar />
        <ProblemSection />
        <SolutionSection />
        <HowItWorks />
        <ComparisonSection />
        <TestimonialsSection />
        <PricingSection />
        <FaqSection />
        <CtaSection />
      </main>
      <LandingFooter />
    </div>
  )
}
