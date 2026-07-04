'use client'

import { useState } from 'react'
import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'

interface ExportRow {
  sale_number: number
  sale_date: string
  client_name: string
  sale_type: string
  total_amount: number
  paid_amount: number
  balance: number
  status: string
  due_date?: string | null
}

interface ExportCSVButtonProps {
  data: ExportRow[]
  currency: string
  filename?: string
  id?: string
}

export function ExportCSVButton({ data, currency, filename = 'reporte-ventas', id }: ExportCSVButtonProps) {
  const [loading, setLoading] = useState(false)

  function handleExport() {
    setLoading(true)

    const STATUS_MAP: Record<string, string> = {
      paid: 'Pagada',
      partial: 'Parcial',
      pending: 'Pendiente',
      overdue: 'Vencida',
      cancelled: 'Cancelada',
    }

    const TYPE_MAP: Record<string, string> = {
      cash: 'Contado',
      credit: 'Crédito',
    }

    const header = [
      '#Venta',
      'Fecha',
      'Cliente',
      'Tipo',
      'Total',
      'Pagado',
      'Saldo',
      'Estado',
      'Vence',
    ]

    const rows = data.map((row) => [
      `#${row.sale_number}`,
      row.sale_date,
      row.client_name,
      TYPE_MAP[row.sale_type] ?? row.sale_type,
      formatCurrency(row.total_amount, currency),
      formatCurrency(row.paid_amount, currency),
      formatCurrency(row.balance, currency),
      STATUS_MAP[row.status] ?? row.status,
      row.due_date ?? '—',
    ])

    const csv = [header, ...rows]
      .map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n')

    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${filename}-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)

    setLoading(false)
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleExport}
      disabled={loading || data.length === 0}
      id={id ?? 'export-csv-button'}
      aria-label="Exportar CSV"
    >
      <Download size={16} />
      Exportar CSV
    </Button>
  )
}
