import { LegalPageLayout, LegalSection } from '@/components/legal/legal-page-layout'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contacto — SeguimientoPro',
}

export default function ContactoPage() {
  return (
    <LegalPageLayout title="Contacto" updatedAt="6 de julio de 2026">
      <LegalSection title="¿Tienes una pregunta?">
        <p>
          Escríbenos a{' '}
          <a href="mailto:soporte@seguimientopro.com" className="font-semibold text-[var(--brand-600)] hover:underline">
            soporte@seguimientopro.com
          </a>{' '}
          y te respondemos lo antes posible.
        </p>
      </LegalSection>

      <LegalSection title="Soporte técnico">
        <p>
          Si tienes un problema con tu cuenta, tu plan PRO o cualquier módulo de la app, incluye tu
          correo de registro para que podamos ayudarte más rápido.
        </p>
      </LegalSection>
    </LegalPageLayout>
  )
}
