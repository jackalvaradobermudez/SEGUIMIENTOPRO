import type { PaymentMethod, SaleStatus, SaleType } from '@/types/database'

export const SALE_STATUS_BADGE_CLASS: Record<SaleStatus, string> = {
  paid: 'badge-paid',
  partial: 'badge-partial',
  pending: 'badge-pending',
  overdue: 'badge-overdue',
  cancelled: 'badge-cancelled',
}

export const PAYMENT_METHOD_OPTIONS: { value: PaymentMethod; label: string }[] = [
  { value: 'cash', label: 'Efectivo' },
  { value: 'transfer', label: 'Transferencia' },
  { value: 'card', label: 'Tarjeta' },
  { value: 'other', label: 'Otro' },
]

export const SALE_TYPE_OPTIONS: { value: SaleType; label: string }[] = [
  { value: 'cash', label: 'Contado' },
  { value: 'credit', label: 'Crédito' },
]

export const UNIT_OPTIONS = ['unidad', 'kg', 'lb', 'litro', 'caja', 'paquete', 'servicio'] as const
