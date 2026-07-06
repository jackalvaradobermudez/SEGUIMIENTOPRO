import crypto from 'crypto'
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { buildIntegritySignature, verifyEventChecksum } from './config'

function sha256(raw: string): string {
  return crypto.createHash('sha256').update(raw).digest('hex')
}

describe('buildIntegritySignature', () => {
  const secret = 'prod_integrity_Z5mMke9x0k8gpErbDqwrJXMqsI6SFli6'

  beforeEach(() => {
    process.env.WOMPI_INTEGRITY_SECRET = secret
  })

  afterEach(() => {
    delete process.env.WOMPI_INTEGRITY_SECRET
  })

  it('matches SHA256(reference + amountInCents + currency + secret) per the Wompi docs example', () => {
    const params = { reference: 'sk8-438k4-xmxm392-sn2m', amountInCents: 2490000, currency: 'COP' }
    const expected = sha256(`${params.reference}${params.amountInCents}${params.currency}${secret}`)
    expect(buildIntegritySignature(params)).toBe(expected)
  })

  it('produces a 64-character hex digest', () => {
    const signature = buildIntegritySignature({ reference: 'abc-123', amountInCents: 1000, currency: 'COP' })
    expect(signature).toMatch(/^[a-f0-9]{64}$/)
  })

  it('throws if the integrity secret is not configured', () => {
    delete process.env.WOMPI_INTEGRITY_SECRET
    expect(() => buildIntegritySignature({ reference: 'x', amountInCents: 1, currency: 'COP' })).toThrow()
  })
})

describe('verifyEventChecksum', () => {
  const secret = 'prod_events_OcHnIzeBl5socpwByQ4hA52Em3USQ93Z'

  beforeEach(() => {
    process.env.WOMPI_EVENTS_SECRET = secret
  })

  afterEach(() => {
    delete process.env.WOMPI_EVENTS_SECRET
  })

  function buildPayload(checksum: string) {
    return {
      data: {
        transaction: {
          id: '1234-1610641025-49201',
          status: 'APPROVED',
          amount_in_cents: 4490000,
        },
      },
      signature: {
        properties: ['transaction.id', 'transaction.status', 'transaction.amount_in_cents'],
        checksum,
        timestamp: 1530291411,
      },
    }
  }

  it('accepts a checksum computed the same way Wompi documents it', () => {
    const raw = `1234-1610641025-49201APPROVED44900001530291411${secret}`
    const validChecksum = sha256(raw)
    expect(verifyEventChecksum(buildPayload(validChecksum))).toBe(true)
  })

  it('rejects a tampered checksum', () => {
    expect(verifyEventChecksum(buildPayload('0'.repeat(64)))).toBe(false)
  })

  it('rejects a payload whose data was modified after signing (amount tampering)', () => {
    const raw = `1234-1610641025-49201APPROVED44900001530291411${secret}`
    const validChecksum = sha256(raw)
    const payload = buildPayload(validChecksum)
    payload.data.transaction.amount_in_cents = 1 // attacker lowers the charged amount
    expect(verifyEventChecksum(payload)).toBe(false)
  })

  it('throws if the events secret is not configured', () => {
    delete process.env.WOMPI_EVENTS_SECRET
    expect(() => verifyEventChecksum(buildPayload('irrelevant'))).toThrow()
  })
})
