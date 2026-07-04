import type { Metadata } from 'next'
import { TooltipProvider } from '@/components/ui/tooltip'
import './globals.css'

export const metadata: Metadata = {
  title: 'SeguimientoPro — Control total de tus ventas y cobros',
  description: 'CRM de ventas y cobros para vendedores independientes. Registra ventas a crédito, gestiona tu cartera y cobra a tiempo.',
  keywords: ['CRM', 'cobros', 'ventas', 'cartera', 'emprendedor', 'Colombia'],
  authors: [{ name: 'Holding Alvarado' }],
  openGraph: {
    title: 'SeguimientoPro',
    description: 'Control total de tus ventas y cobros',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  )
}
