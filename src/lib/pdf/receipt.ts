/**
 * receipt.ts — Generación de recibos PDF client-side con jsPDF
 * Importación dinámica recomendada para evitar SSR issues.
 */

export interface ReceiptBusiness {
  name: string
  currency: string
}

export interface ReceiptClient {
  name: string
  phone?: string | null
  email?: string | null
}

export interface ReceiptItem {
  description: string
  quantity: number
  unit_price: number
  subtotal?: number | null
}

export interface ReceiptSale {
  sale_number: number
  sale_date: string
  sale_type: 'cash' | 'credit'
  due_date?: string | null
  total_amount: number
  paid_amount: number
  discount?: number
  notes?: string | null
  payment_method: string
}

export interface StatementSale {
  sale_number: number
  sale_date: string
  due_date?: string | null
  total_amount: number
  paid_amount: number
  balance?: number | null
  status: string
}

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
function formatAmt(amount: number, currency = 'COP'): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('es-CO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateStr))
}

function statusLabel(status: string): string {
  const map: Record<string, string> = {
    paid: 'Pagada',
    partial: 'Parcial',
    pending: 'Pendiente',
    overdue: 'Vencida',
    cancelled: 'Cancelada',
  }
  return map[status] ?? status
}

// ─────────────────────────────────────────────
// RECIBO DE VENTA
// ─────────────────────────────────────────────
export async function generateSaleReceipt(
  sale: ReceiptSale,
  client: ReceiptClient,
  items: ReceiptItem[],
  business: ReceiptBusiness,
): Promise<void> {
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })

  const MARGIN = 48
  const W = doc.internal.pageSize.getWidth()
  const CONTENT_W = W - MARGIN * 2
  let y = MARGIN

  // ── Encabezado ──────────────────────────────
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(20)
  doc.setTextColor(15, 23, 42) // neutral-950
  doc.text(business.name, MARGIN, y)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(100, 116, 139) // slate-500
  doc.text('Recibo de venta', MARGIN, (y += 18))

  // Número de venta (derecha)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.setTextColor(99, 102, 241) // indigo
  doc.text(`#${sale.sale_number}`, W - MARGIN, MARGIN, { align: 'right' })

  y += 20

  // ── Línea divisoria ──────────────────────────
  doc.setDrawColor(226, 232, 240)
  doc.setLineWidth(0.5)
  doc.line(MARGIN, y, W - MARGIN, y)
  y += 16

  // ── Info cliente + fecha ─────────────────────
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.setTextColor(100, 116, 139)
  doc.text('CLIENTE', MARGIN, y)
  doc.text('FECHA', W / 2, y)

  y += 12
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(15, 23, 42)
  doc.text(client.name, MARGIN, y)
  doc.text(formatDate(sale.sale_date), W / 2, y)

  if (client.phone || client.email) {
    y += 12
    doc.setFontSize(9)
    doc.setTextColor(100, 116, 139)
    doc.text(client.phone ?? client.email ?? '', MARGIN, y)
  }

  if (sale.sale_type === 'credit' && sale.due_date) {
    y += 12
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.setTextColor(234, 88, 12) // orange
    doc.text(`Vence: ${formatDate(sale.due_date)}`, MARGIN, y)
  }

  y += 24

  // ── Tabla de productos ───────────────────────
  doc.setDrawColor(226, 232, 240)
  doc.setFillColor(248, 250, 252) // slate-50
  doc.rect(MARGIN, y, CONTENT_W, 22, 'F')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.setTextColor(100, 116, 139)
  doc.text('DESCRIPCIÓN', MARGIN + 8, y + 14)
  doc.text('CANT.', MARGIN + CONTENT_W * 0.55, y + 14)
  doc.text('PRECIO', MARGIN + CONTENT_W * 0.70, y + 14)
  doc.text('SUBTOTAL', W - MARGIN - 8, y + 14, { align: 'right' })

  y += 22

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(15, 23, 42)

  for (const item of items) {
    const subtotal = item.subtotal ?? item.quantity * item.unit_price
    doc.text(item.description.slice(0, 45), MARGIN + 8, y + 14)
    doc.text(String(item.quantity), MARGIN + CONTENT_W * 0.55, y + 14)
    doc.text(formatAmt(item.unit_price, business.currency), MARGIN + CONTENT_W * 0.70, y + 14)
    doc.text(formatAmt(subtotal, business.currency), W - MARGIN - 8, y + 14, { align: 'right' })

    y += 22
    doc.setDrawColor(241, 245, 249)
    doc.line(MARGIN, y, W - MARGIN, y)
  }

  y += 16

  // ── Totales ──────────────────────────────────
  const totalX = W - MARGIN - 160
  const valueX = W - MARGIN - 8

  function summaryRow(label: string, value: string, bold = false, color?: [number, number, number]) {
    doc.setFont('helvetica', bold ? 'bold' : 'normal')
    doc.setFontSize(10)
    doc.setTextColor(100, 116, 139)
    doc.text(label, totalX, y)
    doc.setTextColor(...(color ?? [15, 23, 42]))
    doc.text(value, valueX, y, { align: 'right' })
    y += 18
  }

  if (sale.discount && sale.discount > 0) {
    summaryRow('Subtotal', formatAmt(sale.total_amount + sale.discount, business.currency))
    summaryRow('Descuento', `-${formatAmt(sale.discount, business.currency)}`, false, [22, 163, 74])
  }

  summaryRow('Total', formatAmt(sale.total_amount, business.currency), true)
  summaryRow('Pagado', formatAmt(sale.paid_amount, business.currency), false, [22, 163, 74])

  const balance = sale.total_amount - sale.paid_amount
  if (balance > 0) {
    summaryRow('Saldo pendiente', formatAmt(balance, business.currency), true, [234, 88, 12])
  }

  y += 8
  doc.setDrawColor(226, 232, 240)
  doc.line(MARGIN, y, W - MARGIN, y)
  y += 16

  // ── Notas ────────────────────────────────────
  if (sale.notes) {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(100, 116, 139)
    doc.text('Notas:', MARGIN, y)
    y += 12
    doc.setTextColor(15, 23, 42)
    const lines = doc.splitTextToSize(sale.notes, CONTENT_W) as string[]
    doc.text(lines, MARGIN, y)
  }

  // ── Footer ───────────────────────────────────
  const footerY = doc.internal.pageSize.getHeight() - 32
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(148, 163, 184)
  doc.text('Generado con SeguimientoPro · seguimientopro.vercel.app', W / 2, footerY, { align: 'center' })

  doc.save(`recibo-venta-${sale.sale_number}-${client.name.replace(/\s+/g, '-')}.pdf`)
}

// ─────────────────────────────────────────────
// ESTADO DE CUENTA POR CLIENTE
// ─────────────────────────────────────────────
export async function generateAccountStatement(
  client: ReceiptClient,
  sales: StatementSale[],
  business: ReceiptBusiness,
): Promise<void> {
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })

  const MARGIN = 48
  const W = doc.internal.pageSize.getWidth()
  const CONTENT_W = W - MARGIN * 2
  let y = MARGIN

  // ── Encabezado ──────────────────────────────
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(18)
  doc.setTextColor(15, 23, 42)
  doc.text('Estado de cuenta', MARGIN, y)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(100, 116, 139)
  doc.text(business.name, MARGIN, (y += 16))
  doc.text(`Generado: ${formatDate(new Date().toISOString())}`, W - MARGIN, y, { align: 'right' })

  y += 24

  // ── Info cliente ─────────────────────────────
  doc.setFillColor(248, 250, 252)
  doc.rect(MARGIN, y, CONTENT_W, 40, 'F')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.setTextColor(15, 23, 42)
  doc.text(client.name, MARGIN + 12, y + 16)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(100, 116, 139)
  const contactParts = [client.phone, client.email].filter(Boolean).join(' · ')
  doc.text(contactParts || 'Sin datos de contacto', MARGIN + 12, y + 30)

  y += 52

  // ── Resumen ──────────────────────────────────
  const activeSales = sales.filter(s => s.status !== 'cancelled')
  const totalDebt = activeSales.reduce((acc, s) => acc + (s.balance ?? (s.total_amount - s.paid_amount)), 0)
  const totalBought = activeSales.reduce((acc, s) => acc + s.total_amount, 0)
  const totalPaid = activeSales.reduce((acc, s) => acc + s.paid_amount, 0)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.setTextColor(100, 116, 139)
  doc.text('TOTAL COMPRADO', MARGIN, y)
  doc.text('TOTAL PAGADO', W / 3 + MARGIN / 2, y)
  doc.text('SALDO PENDIENTE', W * 0.66, y)

  y += 14
  doc.setFontSize(14)
  doc.setTextColor(15, 23, 42)
  doc.text(formatAmt(totalBought, business.currency), MARGIN, y)
  doc.text(formatAmt(totalPaid, business.currency), W / 3 + MARGIN / 2, y)
  doc.setTextColor(totalDebt > 0 ? 234 : 22, totalDebt > 0 ? 88 : 163, totalDebt > 0 ? 12 : 74)
  doc.text(formatAmt(totalDebt, business.currency), W * 0.66, y)

  y += 28
  doc.setDrawColor(226, 232, 240)
  doc.line(MARGIN, y, W - MARGIN, y)
  y += 16

  // ── Tabla ventas ─────────────────────────────
  doc.setFillColor(248, 250, 252)
  doc.rect(MARGIN, y, CONTENT_W, 22, 'F')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.setTextColor(100, 116, 139)
  doc.text('#', MARGIN + 8, y + 14)
  doc.text('FECHA', MARGIN + 32, y + 14)
  doc.text('VENCE', MARGIN + CONTENT_W * 0.35, y + 14)
  doc.text('TOTAL', MARGIN + CONTENT_W * 0.53, y + 14)
  doc.text('PAGADO', MARGIN + CONTENT_W * 0.68, y + 14)
  doc.text('SALDO', W - MARGIN - 60, y + 14)
  doc.text('ESTADO', W - MARGIN - 8, y + 14, { align: 'right' })

  y += 22

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)

  for (const sale of sales) {
    if (sale.status === 'cancelled') continue
    const balance = sale.balance ?? (sale.total_amount - sale.paid_amount)

    const statusColor: [number, number, number] =
      sale.status === 'paid' ? [22, 163, 74]
      : sale.status === 'overdue' ? [220, 38, 38]
      : [234, 88, 12]

    doc.setTextColor(15, 23, 42)
    doc.text(`#${sale.sale_number}`, MARGIN + 8, y + 13)
    doc.text(formatDate(sale.sale_date), MARGIN + 32, y + 13)
    doc.text(sale.due_date ? formatDate(sale.due_date) : '—', MARGIN + CONTENT_W * 0.35, y + 13)
    doc.text(formatAmt(sale.total_amount, business.currency), MARGIN + CONTENT_W * 0.53, y + 13)
    doc.text(formatAmt(sale.paid_amount, business.currency), MARGIN + CONTENT_W * 0.68, y + 13)
    doc.text(formatAmt(balance, business.currency), W - MARGIN - 60, y + 13)
    doc.setTextColor(...statusColor)
    doc.text(statusLabel(sale.status), W - MARGIN - 8, y + 13, { align: 'right' })

    y += 20
    doc.setDrawColor(241, 245, 249)
    doc.setTextColor(15, 23, 42)
    doc.line(MARGIN, y, W - MARGIN, y)
  }

  // ── Footer ───────────────────────────────────
  const footerY = doc.internal.pageSize.getHeight() - 32
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(148, 163, 184)
  doc.text('Generado con SeguimientoPro · seguimientopro.vercel.app', W / 2, footerY, { align: 'center' })

  doc.save(`estado-cuenta-${client.name.replace(/\s+/g, '-')}.pdf`)
}
