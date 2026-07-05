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

export const WHATSAPP_TEMPLATE_TYPES = {
  reminder_soft: {
    label: 'Recordatorio suave',
    description: 'Antes del vencimiento. Tono amable.',
    icon: 'Bell',
  },
  reminder_due_day: {
    label: 'Día de vencimiento',
    description: 'El día exacto que vence el pago.',
    icon: 'Calendar',
  },
  reminder_overdue: {
    label: 'Cobro post-vencimiento',
    description: 'Después del vencimiento. Tono firme.',
    icon: 'AlertTriangle',
  },
  payment_thanks: {
    label: 'Agradecimiento por pago',
    description: 'Después de registrar un abono.',
    icon: 'ThumbsUp',
  },
  account_statement: {
    label: 'Envío de estado de cuenta',
    description: 'Al compartir el estado de cuenta.',
    icon: 'FileText',
  },
} as const

export const DEFAULT_TEMPLATE_MESSAGES: Record<string, string> = {
  reminder_soft:
    'Hola {nombre}, te recordamos que tu saldo de {monto} vence el {fecha_vencimiento}. ¿Podemos coordinar el pago? Quedo atento.',
  reminder_due_day:
    'Hola {nombre}, hoy vence tu saldo de {monto} de la venta #{numero_venta}. ¿Ya pudiste realizar el pago? Quedo pendiente.',
  reminder_overdue:
    'Hola {nombre}, tu saldo de {monto} lleva {dias_vencido} días de vencido. Necesitamos coordinar el pago lo antes posible. ¿Cuándo puedes abonar?',
  payment_thanks:
    'Hola {nombre}, confirmamos tu pago de {monto_pagado}. Tu nuevo saldo es {saldo_pendiente}. ¡Gracias por tu puntualidad!',
  account_statement:
    'Hola {nombre}, te envío tu estado de cuenta actualizado. Tu saldo pendiente total es {saldo_total}. Cualquier duda quedo atento.',
}
