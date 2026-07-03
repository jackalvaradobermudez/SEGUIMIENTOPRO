import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SeguimientoPro — Acceder',
  description: 'Inicia sesión en SeguimientoPro',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="auth-layout">
      {children}
    </div>
  )
}
