import { describe, it, expect } from 'vitest'
import {
  formatCurrency,
  daysBetween,
  daysFromToday,
  buildWhatsAppUrl,
  calculateHealthScore,
  getHealthLabel,
  getClientScore,
  getClientScoreLabel,
  getStatusLabel,
  getPaymentMethodLabel,
  interpolateTemplate,
} from './utils'

describe('formatCurrency', () => {
  it('formats COP with no decimals and the currency symbol', () => {
    expect(formatCurrency(1250000)).toBe('$ 1.250.000')
  })

  it('formats zero', () => {
    expect(formatCurrency(0)).toBe('$ 0')
  })

  it('rounds fractional amounts since minimumFractionDigits is 0', () => {
    expect(formatCurrency(1000.5)).toBe('$ 1.001')
  })
})

describe('daysBetween', () => {
  it('returns 0 for the same date', () => {
    expect(daysBetween('2026-07-01', '2026-07-01')).toBe(0)
  })

  it('is symmetric (absolute difference) regardless of argument order', () => {
    expect(daysBetween('2026-07-01', '2026-07-10')).toBe(9)
    expect(daysBetween('2026-07-10', '2026-07-01')).toBe(9)
  })
})

describe('daysFromToday', () => {
  it('returns a positive number for a future date', () => {
    const future = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
    expect(daysFromToday(future)).toBeGreaterThanOrEqual(4)
  })

  it('returns a negative number for a past date', () => {
    const past = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    expect(daysFromToday(past)).toBeLessThanOrEqual(-4)
  })
})

describe('buildWhatsAppUrl', () => {
  it('strips non-digit characters from the phone number', () => {
    const url = buildWhatsAppUrl('+57 300 123 4567', 'Hola')
    expect(url).toBe('https://wa.me/573001234567?text=Hola')
  })

  it('URL-encodes the message', () => {
    const url = buildWhatsAppUrl('3001234567', 'Debes $50.000 & vence hoy')
    expect(url).toContain(encodeURIComponent('Debes $50.000 & vence hoy'))
  })
})

describe('calculateHealthScore', () => {
  it('scores 100 for a perfectly healthy portfolio', () => {
    const score = calculateHealthScore({
      totalCurrent: 1000,
      totalPending: 1000,
      avgCollectionDays: 0,
      clientsWithRecentAction: 5,
      clientsWithDebt: 5,
    })
    expect(score).toBe(100)
  })

  it('does not divide by zero when nothing is pending', () => {
    const score = calculateHealthScore({
      totalCurrent: 0,
      totalPending: 0,
      avgCollectionDays: 0,
      clientsWithRecentAction: 0,
      clientsWithDebt: 0,
    })
    expect(score).toBe(100)
  })

  it('scores lower when collection is slow and portfolio is stale', () => {
    const score = calculateHealthScore({
      totalCurrent: 200,
      totalPending: 1000,
      avgCollectionDays: 60,
      clientsWithRecentAction: 1,
      clientsWithDebt: 10,
    })
    expect(score).toBeLessThan(50)
  })
})

describe('getHealthLabel', () => {
  it('labels a high score as Excelente', () => {
    expect(getHealthLabel(85)).toEqual({ label: 'Excelente', color: 'green' })
  })

  it('labels a low score as Crítico', () => {
    expect(getHealthLabel(10)).toEqual({ label: 'Crítico', color: 'red' })
  })

  it('picks the boundary range correctly', () => {
    expect(getHealthLabel(60)).toEqual({ label: 'Bueno', color: 'amber' })
    expect(getHealthLabel(59)).toEqual({ label: 'Regular', color: 'orange' })
  })
})

describe('getClientScore', () => {
  it('scores 100 for a perfect client (on time, fast, recent)', () => {
    expect(getClientScore(1, 0, 0)).toBe(100)
  })

  it('scores 0 for the worst case', () => {
    expect(getClientScore(0, 30, 180)).toBe(0)
  })
})

describe('getClientScoreLabel', () => {
  it('labels 80+ as Cliente estrella', () => {
    expect(getClientScoreLabel(80).label).toBe('Cliente estrella')
  })

  it('labels below 40 as Cliente riesgoso', () => {
    expect(getClientScoreLabel(10).label).toBe('Cliente riesgoso')
  })
})

describe('getStatusLabel / getPaymentMethodLabel', () => {
  it('translates known sale statuses to Spanish', () => {
    expect(getStatusLabel('overdue')).toBe('Vencida')
    expect(getStatusLabel('paid')).toBe('Pagada')
  })

  it('falls back to the raw value for unknown statuses', () => {
    expect(getStatusLabel('unknown_status')).toBe('unknown_status')
  })

  it('translates known payment methods to Spanish', () => {
    expect(getPaymentMethodLabel('transfer')).toBe('Transferencia')
  })
})

describe('interpolateTemplate', () => {
  it('replaces known variables', () => {
    const result = interpolateTemplate('Hola {nombre}, debes {monto}', {
      nombre: 'María',
      monto: '$50.000',
    })
    expect(result).toBe('Hola María, debes $50.000')
  })

  it('replaces missing variables with an empty string instead of leaving the placeholder', () => {
    const result = interpolateTemplate('Hola {nombre}', {})
    expect(result).toBe('Hola ')
  })
})
