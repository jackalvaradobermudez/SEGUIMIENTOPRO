import type { Metadata } from 'next'
import SalesPageClient from './sales-page-client'

export const metadata: Metadata = { title: 'Ventas — SeguimientoPro' }

export default function SalesPage() {
  return <SalesPageClient />
}
