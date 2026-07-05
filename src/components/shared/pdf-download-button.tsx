'use client'

import { useState } from 'react'
import { FileDown, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type {
  ReceiptSale,
  ReceiptClient,
  ReceiptItem,
  ReceiptBusiness,
  StatementSale,
  StatementPayment,
} from '@/lib/pdf/receipt'

// ─────────────────────────────────────────────
// Botón: Descargar recibo de una venta
// ─────────────────────────────────────────────
interface SalePDFButtonProps {
  sale: ReceiptSale
  client: ReceiptClient
  items: ReceiptItem[]
  business: ReceiptBusiness
  id?: string
}

export function SalePDFButton({ sale, client, items, business, id }: SalePDFButtonProps) {
  const [loading, setLoading] = useState(false)

  async function handleDownload() {
    setLoading(true)
    try {
      const { generateSaleReceipt } = await import('@/lib/pdf/receipt')
      await generateSaleReceipt(sale, client, items, business)
    } catch {
      // silently fail — usuario verá que no descargó
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleDownload}
      disabled={loading}
      id={id ?? 'download-sale-pdf'}
      aria-label="Descargar recibo PDF"
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : <FileDown size={16} />}
      {loading ? 'Generando…' : 'Descargar PDF'}
    </Button>
  )
}

// ─────────────────────────────────────────────
// Botón: Descargar estado de cuenta del cliente
// ─────────────────────────────────────────────
interface StatementPDFButtonProps {
  client: ReceiptClient
  sales: StatementSale[]
  business: ReceiptBusiness
  payments?: StatementPayment[]
  id?: string
}

export function StatementPDFButton({ client, sales, business, payments, id }: StatementPDFButtonProps) {
  const [loading, setLoading] = useState(false)

  async function handleDownload() {
    setLoading(true)
    try {
      const { generateAccountStatement } = await import('@/lib/pdf/receipt')
      await generateAccountStatement(client, sales, business, payments)
    } catch {
      // silently fail
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleDownload}
      disabled={loading}
      id={id ?? 'download-statement-pdf'}
      aria-label="Descargar estado de cuenta PDF"
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : <FileDown size={16} />}
      {loading ? 'Generando…' : 'Estado de cuenta PDF'}
    </Button>
  )
}
