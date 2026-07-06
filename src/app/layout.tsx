import type { Metadata } from 'next'
import { TooltipProvider } from '@/components/ui/tooltip'
import { RegisterSW } from '@/components/pwa/register-sw'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://seguimientopro.com'),
  title: {
    default: 'SeguimientoPro — Gestión de cobros para emprendedores',
    template: '%s — SeguimientoPro',
  },
  description:
    'Registra ventas, cobra a tiempo y no pierdas dinero. El sistema de gestión de cobros y ventas a crédito para emprendedores latinoamericanos.',
  keywords: [
    'gestión de cobros',
    'ventas a crédito',
    'cartera pendiente',
    'cobros emprendedores',
    'CRM ventas',
    'control de deudas',
    'seguimiento de pagos',
    'facturación emprendedores',
    'cobrar clientes',
    'cartera por edades',
  ],
  authors: [{ name: 'SeguimientoPro' }],
  creator: 'SeguimientoPro',
  openGraph: {
    type: 'website',
    locale: 'es_CO',
    url: 'https://seguimientopro.com',
    siteName: 'SeguimientoPro',
    title: 'SeguimientoPro — Sabe exactamente cuánto te deben',
    description:
      'Registra ventas, cobra a tiempo y no pierdas dinero. Para emprendedores que venden a crédito.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'SeguimientoPro — Gestión de cobros para emprendedores',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SeguimientoPro — Gestión de cobros para emprendedores',
    description: 'Registra ventas, cobra a tiempo y no pierdas dinero.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
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
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#6366f1" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="SeguimientoPro" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
      </head>
      <body className="bg-slate-50 text-slate-900">
        <TooltipProvider>
          {children}
          <RegisterSW />
        </TooltipProvider>
      </body>
    </html>
  )
}
