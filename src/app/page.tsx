import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SeguimientoPro — Control total de tus ventas y cobros',
  description: 'CRM para vendedores independientes. Registra ventas a crédito, gestiona tu cartera y cobra a tiempo. Gratis para empezar.',
}

export default function LandingPage() {
  return (
    <main className="landing-page">
      {/* Nav */}
      <nav className="landing-nav" role="navigation" aria-label="Navegación principal">
        <div className="landing-nav-logo">
          <div className="landing-nav-logo-icon" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" 
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span>SeguimientoPro</span>
        </div>
        <div className="landing-nav-actions">
          <Link href="/login" id="landing-login" className="landing-nav-link">Ingresar</Link>
          <Link href="/register" id="landing-register" className="landing-nav-cta">Empezar gratis</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="landing-hero" aria-labelledby="hero-title">
        <div className="hero-badge">Para vendedores independientes</div>
        <h1 id="hero-title" className="hero-title">
          Cobra lo que vendes.<br />
          <span className="hero-accent">Sin perder el hilo.</span>
        </h1>
        <p className="hero-description">
          Registra tus ventas a crédito, gestiona quién te debe y cuánto,
          y actúa antes de que se venza. Todo en un solo lugar.
        </p>
        <div className="hero-actions">
          <Link href="/register" id="hero-cta-primary" className="hero-btn-primary">
            Crear cuenta gratis
          </Link>
          <Link href="/login" id="hero-cta-secondary" className="hero-btn-secondary">
            Ya tengo cuenta →
          </Link>
        </div>
      </section>
    </main>
  )
}
