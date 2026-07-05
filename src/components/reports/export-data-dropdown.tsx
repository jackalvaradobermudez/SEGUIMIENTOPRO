'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Download, FileSpreadsheet, FileText, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { exportToExcel } from '@/lib/utils/export-excel'
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

interface ExportDataDropdownProps {
  data: ExportRow[]
  currency: string
  filename?: string
  id?: string
}

export function ExportDataDropdown({ data, currency, filename = 'reporte-ventas', id }: ExportDataDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

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

  // Cerrar al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Exportar a Excel usando nuestra utilidad enriquecida
  function handleExportExcel() {
    exportToExcel({
      data,
      filename,
      sheetName: 'Ventas y Cartera',
      headers: [
        'Número Venta',
        'Fecha Venta',
        'Cliente',
        'Tipo de Venta',
        'Total Venta',
        'Total Pagado',
        'Saldo Pendiente',
        'Estado',
        'Fecha Vencimiento',
      ],
      mapping: (row) => [
        { type: 'String', value: `#${row.sale_number}`, style: 'Bold' },
        { type: 'String', value: row.sale_date, style: 'Date' },
        { type: 'String', value: row.client_name },
        { type: 'String', value: TYPE_MAP[row.sale_type] ?? row.sale_type },
        { type: 'Number', value: row.total_amount, style: 'Currency' },
        { type: 'Number', value: row.paid_amount, style: 'Currency' },
        { type: 'Number', value: row.balance, style: 'Currency' },
        { type: 'String', value: STATUS_MAP[row.status] ?? row.status },
        { type: 'String', value: row.due_date ?? '—', style: 'Date' },
      ],
    })
    setIsOpen(false)
  }

  // Exportar a CSV nativo
  function handleExportCSV() {
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
    setIsOpen(false)
  }

  return (
    <div className="relative inline-block" ref={dropdownRef} id={id}>
      <Button
        variant="outline"
        size="sm"
        disabled={data.length === 0}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 border-white/10 text-slate-300 hover:bg-white/[0.05] hover:text-white rounded-lg cursor-pointer"
      >
        <Download size={15} />
        <span>Exportar Datos</span>
        <ChevronDown size={12} className={`opacity-80 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-48 origin-top-right rounded-xl border border-white/10 bg-[#091221]/95 p-1 shadow-2xl backdrop-blur-md z-40 animate-fade-in">
          <button
            onClick={handleExportExcel}
            className="w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-slate-300 hover:bg-white/[0.05] hover:text-white transition-colors cursor-pointer text-left font-medium"
          >
            <FileSpreadsheet size={14} className="text-emerald-400" />
            <span>Descargar Excel (.xls)</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-slate-300 hover:bg-white/[0.05] hover:text-white transition-colors cursor-pointer text-left font-medium"
          >
            <FileText size={14} className="text-blue-400" />
            <span>Descargar CSV (.csv)</span>
          </button>
        </div>
      )}
    </div>
  )
}
