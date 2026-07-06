import { LegalPageLayout, LegalSection } from '@/components/legal/legal-page-layout'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Privacidad — SeguimientoPro',
}

export default function PrivacidadPage() {
  return (
    <LegalPageLayout title="Política de Privacidad" updatedAt="6 de julio de 2026" draft>
      <LegalSection title="1. Qué datos recolectamos">
        <ul className="list-disc pl-5">
          <li>Datos de tu cuenta: nombre del negocio, correo electrónico.</li>
          <li>Datos que registras dentro de la app: clientes, productos, ventas, pagos y gestiones de cobro.</li>
          <li>Datos de uso básicos para analítica de producto (páginas visitadas, eventos de activación).</li>
        </ul>
      </LegalSection>

      <LegalSection title="2. Para qué usamos tus datos">
        <p>
          Usamos tus datos únicamente para operar el servicio: mostrar tu información en tu propio
          dashboard, procesar pagos del plan PRO, enviarte notificaciones operativas (recordatorios,
          alertas de cobro) y mejorar el producto.
        </p>
      </LegalSection>

      <LegalSection title="3. Con quién compartimos datos">
        <p>
          No vendemos tus datos. Los compartimos únicamente con los proveedores necesarios para
          operar el servicio: Supabase (base de datos y autenticación), Wompi (procesamiento de
          pagos) y Google Analytics (analítica de producto).
        </p>
      </LegalSection>

      <LegalSection title="4. Tus derechos (Ley 1581 de 2012 — Habeas Data)">
        <p>
          Como titular de tus datos, tienes derecho a conocer, actualizar, rectificar y solicitar la
          eliminación de tu información personal, así como a revocar la autorización para su
          tratamiento. Puedes ejercer estos derechos desde Configuración de tu cuenta o
          escribiéndonos desde la página de{' '}
          <a href="/contacto" className="font-semibold text-[var(--brand-600)] hover:underline">Contacto</a>.
        </p>
      </LegalSection>

      <LegalSection title="5. Datos de tus propios clientes">
        <p>
          Si registras información de tus clientes (nombre, teléfono, dirección) dentro de
          SeguimientoPro, tú actúas como responsable de esos datos frente a tus clientes, y nosotros
          como encargados del tratamiento en tu nombre, únicamente para prestarte el servicio.
        </p>
      </LegalSection>

      <LegalSection title="6. Seguridad">
        <p>
          Tu información está protegida con controles de acceso a nivel de fila (Row Level Security)
          en la base de datos, de forma que solo tú puedes ver los datos de tu negocio.
        </p>
      </LegalSection>

      <LegalSection title="7. Contacto">
        <p>
          Para cualquier solicitud relacionada con tus datos, visita{' '}
          <a href="/contacto" className="font-semibold text-[var(--brand-600)] hover:underline">Contacto</a>.
        </p>
      </LegalSection>
    </LegalPageLayout>
  )
}
