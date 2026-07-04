import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { HEALTH_SCORE_RANGES } from '@/lib/constants'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency = 'COP'): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('es-CO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))
}

export function formatDateShort(date: string | Date): string {
  return new Intl.DateTimeFormat('es-CO', {
    day: 'numeric',
    month: 'short',
  }).format(new Date(date))
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    paid: 'Pagada',
    partial: 'Parcial',
    pending: 'Pendiente',
    overdue: 'Vencida',
    cancelled: 'Cancelada',
  }
  return labels[status] ?? status
}

export function getPaymentMethodLabel(method: string): string {
  const labels: Record<string, string> = {
    cash: 'Efectivo',
    transfer: 'Transferencia',
    card: 'Tarjeta',
    other: 'Otro',
  }
  return labels[method] ?? method
}

export function daysBetween(date1: string | Date, date2: string | Date): number {
  const d1 = new Date(date1)
  const d2 = new Date(date2)
  const diff = Math.abs(d2.getTime() - d1.getTime())
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

export function daysFromToday(date: string | Date): number {
  const today = new Date()
  const target = new Date(date)
  const diff = target.getTime() - today.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

export function buildWhatsAppUrl(phone: string, message: string): string {
  const cleanPhone = phone.replace(/\D/g, '')
  const encodedMessage = encodeURIComponent(message)
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`
}

export function calculateHealthScore(input: {
  totalCurrent: number
  totalPending: number
  avgCollectionDays: number
  clientsWithRecentAction: number
  clientsWithDebt: number
}): number {
  const currentRatio = input.totalPending > 0
    ? input.totalCurrent / input.totalPending
    : 1
  const speedScore = 1 - Math.min(input.avgCollectionDays / 60, 1)
  const activityRatio = input.clientsWithDebt > 0
    ? input.clientsWithRecentAction / input.clientsWithDebt
    : 1

  return Math.round(40 * currentRatio + 30 * speedScore + 30 * activityRatio)
}

export function getHealthLabel(score: number): { label: string; color: string } {
  for (const range of HEALTH_SCORE_RANGES) {
    if (score >= range.min) return { label: range.label, color: range.color }
  }
  return { label: 'Crítico', color: 'red' }
}

export function getClientScore(
  onTimePaymentsRatio: number,
  avgPaymentDays: number,
  daysSinceLastSale: number
): number {
  const onTimeScore = 50 * onTimePaymentsRatio
  const speedScore = 30 * (1 - Math.min(avgPaymentDays / 30, 1))
  const recencyScore = 20 * (1 - Math.min(daysSinceLastSale / 180, 1))
  return Math.round(onTimeScore + speedScore + recencyScore)
}

export function getClientScoreLabel(score: number): { label: string; color: string } {
  if (score >= 80) return { label: 'Cliente estrella', color: 'green' }
  if (score >= 60) return { label: 'Cliente confiable', color: 'amber' }
  if (score >= 40) return { label: 'Cliente regular', color: 'orange' }
  return { label: 'Cliente riesgoso', color: 'red' }
}

export function todayISO(): string {
  return new Date().toISOString().split('T')[0]
}
