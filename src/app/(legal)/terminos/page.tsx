import { LegalPageLayout, LegalSection } from '@/components/legal/legal-page-layout'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Términos de Servicio — SeguimientoPro',
}

export default function TerminosPage() {
  return (
    <LegalPageLayout title="Términos de Servicio" updatedAt="6 de julio de 2026" draft>
      <LegalSection title="1. Aceptación de los términos">
        <p>
          Al crear una cuenta y usar SeguimientoPro aceptas estos términos. Si no estás de acuerdo,
          no debes usar el servicio.
        </p>
      </LegalSection>

      <LegalSection title="2. Descripción del servicio">
        <p>
          SeguimientoPro es un software de gestión de ventas, clientes y cartera pensado para
          emprendedores y pequeños negocios que venden a crédito. Ofrecemos un plan Gratis con
          límites de uso y un plan PRO de pago con funciones y capacidad ampliadas.
        </p>
      </LegalSection>

      <LegalSection title="3. Cuenta y responsabilidad del usuario">
        <ul className="list-disc pl-5">
          <li>Eres responsable de la exactitud de la información que registras (ventas, clientes, cobros).</li>
          <li>Eres responsable de mantener segura tu contraseña.</li>
          <li>No debes usar la plataforma para actividades ilegales o para acosar a tus clientes.</li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Planes, precios y facturación">
        <p>
          El plan PRO se cobra mensualmente a través de Wompi. Los precios pueden cambiar con aviso
          previo. Puedes cancelar tu plan PRO en cualquier momento desde Configuración; el acceso PRO
          se mantiene hasta el final del periodo ya pagado.
        </p>
      </LegalSection>

      <LegalSection title="5. Disponibilidad y limitación de responsabilidad">
        <p>
          Hacemos lo posible por mantener el servicio disponible, pero no garantizamos un
          funcionamiento ininterrumpido. SeguimientoPro no reemplaza asesoría contable o legal
          profesional, y no somos responsables por decisiones de negocio tomadas con base en la
          información registrada por el propio usuario.
        </p>
      </LegalSection>

      <LegalSection title="6. Terminación">
        <p>
          Puedes eliminar tu cuenta cuando quieras. Podemos suspender cuentas que incumplan estos
          términos o que representen un riesgo para otros usuarios.
        </p>
      </LegalSection>

      <LegalSection title="7. Contacto">
        <p>
          Para preguntas sobre estos términos, escríbenos desde la página de{' '}
          <a href="/contacto" className="font-semibold text-[var(--brand-600)] hover:underline">Contacto</a>.
        </p>
      </LegalSection>
    </LegalPageLayout>
  )
}
