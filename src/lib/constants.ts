import type { PaymentMethod, SaleStatus, SaleType } from '@/types/database'

export const SALE_STATUS_BADGE_CLASS: Record<SaleStatus, string> = {
  paid: 'badge-paid',
  partial: 'badge-partial',
  pending: 'badge-pending',
  overdue: 'badge-overdue',
  cancelled: 'badge-cancelled',
}

export const SALE_STATUS_LABEL: Record<SaleStatus, string> = {
  paid: 'Pagada',
  partial: 'Parcial',
  pending: 'Pendiente',
  overdue: 'Vencida',
  cancelled: 'Cancelada',
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

export const AGING_BUCKETS = {
  current: { label: 'Al día', color: 'aging-current', order: 0 },
  '1_30': { label: '1-30 días', color: 'aging-1-30', order: 1 },
  '31_60': { label: '31-60 días', color: 'aging-31-60', order: 2 },
  '61_90': { label: '61-90 días', color: 'aging-61-90', order: 3 },
  '90_plus': { label: '+90 días', color: 'aging-90-plus', order: 4 },
} as const

export const COLLECTION_TYPES = {
  call: { label: 'Llamada', icon: 'Phone' },
  whatsapp: { label: 'WhatsApp', icon: 'MessageCircle' },
  sms: { label: 'SMS', icon: 'MessageSquare' },
  visit: { label: 'Visita', icon: 'MapPin' },
  email: { label: 'Email', icon: 'Mail' },
  other: { label: 'Otro', icon: 'MoreHorizontal' },
} as const

export type CollectionTypeKey = keyof typeof COLLECTION_TYPES

export const COLLECTION_RESULTS = {
  paid: { label: 'Pagó', color: 'green' },
  promised: { label: 'Prometió pagar', color: 'blue' },
  partial_payment: { label: 'Pago parcial', color: 'amber' },
  rescheduled: { label: 'Reagendado', color: 'orange' },
  no_answer: { label: 'No contestó', color: 'gray' },
  refused: { label: 'Se negó', color: 'red' },
  other: { label: 'Otro', color: 'neutral' },
} as const

export type CollectionResultKey = keyof typeof COLLECTION_RESULTS

export const HEALTH_SCORE_RANGES = [
  { min: 80, label: 'Excelente', color: 'green' },
  { min: 60, label: 'Bueno', color: 'amber' },
  { min: 40, label: 'Regular', color: 'orange' },
  { min: 0, label: 'Crítico', color: 'red' },
] as const

export const REMINDER_TYPES = {
  birthday: { label: 'Cumpleaños', icon: 'Cake' },
  collection: { label: 'Cobro', icon: 'Phone' },
  follow_up: { label: 'Seguimiento', icon: 'RefreshCw' },
  meeting: { label: 'Reunión', icon: 'Calendar' },
  custom: { label: 'Personalizado', icon: 'Bell' },
} as const

export type ReminderTypeKey = keyof typeof REMINDER_TYPES
