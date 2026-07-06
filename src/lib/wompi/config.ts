import crypto from 'crypto'

export const WOMPI_PUBLIC_KEY = process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY

export const PRO_PLAN_PRICE_COP = 29_900

/** SHA256(reference + amountInCents + currency + integritySecret) — firma para abrir el widget de checkout. */
export function buildIntegritySignature(params: {
  reference: string
  amountInCents: number
  currency: string
}): string {
  const secret = process.env.WOMPI_INTEGRITY_SECRET
  if (!secret) {
    throw new Error('WOMPI_INTEGRITY_SECRET no está configurado')
  }
  const raw = `${params.reference}${params.amountInCents}${params.currency}${secret}`
  return crypto.createHash('sha256').update(raw).digest('hex')
}

/**
 * Verifica el checksum de un evento de Wompi.
 * checksum = SHA256(valores de signature.properties en orden + timestamp + eventsSecret)
 */
export function verifyEventChecksum(payload: {
  data: Record<string, unknown>
  signature: { properties: string[]; checksum: string; timestamp: number }
}): boolean {
  const secret = process.env.WOMPI_EVENTS_SECRET
  if (!secret) {
    throw new Error('WOMPI_EVENTS_SECRET no está configurado')
  }

  const values = payload.signature.properties.map((path) => {
    const value = path.split('.').reduce<unknown>((acc, key) => {
      if (acc && typeof acc === 'object') return (acc as Record<string, unknown>)[key]
      return undefined
    }, payload.data)
    return String(value ?? '')
  })

  const raw = `${values.join('')}${payload.signature.timestamp}${secret}`
  const computed = crypto.createHash('sha256').update(raw).digest('hex')

  return computed.toLowerCase() === payload.signature.checksum.toLowerCase()
}
