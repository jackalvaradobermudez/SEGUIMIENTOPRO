import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/wompi/config', () => ({
  verifyEventChecksum: vi.fn(() => true),
}))

const businessesUpdateSpy = vi.fn(() => ({ eq: vi.fn(() => Promise.resolve({ data: null, error: null })) }))
const transactionsUpdateSpy = vi.fn(() => ({ eq: vi.fn(() => Promise.resolve({ data: null, error: null })) }))

let existingStatus = 'pending'

vi.mock('@/lib/supabase/admin', () => ({
  createAdminClient: () => ({
    from: (table: string) => {
      if (table === 'payment_transactions') {
        return {
          select: () => ({
            eq: () => ({
              single: () =>
                Promise.resolve({
                  data: { status: existingStatus, business_id: 'biz-1', plan: 'pro' },
                }),
            }),
          }),
          update: transactionsUpdateSpy,
        }
      }
      if (table === 'businesses') {
        return { update: businessesUpdateSpy }
      }
      throw new Error(`unexpected table ${table}`)
    },
  }),
}))

const { POST } = await import('./route')

function buildRequest(status: 'APPROVED' | 'DECLINED') {
  const payload = {
    event: 'transaction.updated',
    data: {
      transaction: { id: 'tx-1', reference: 'pro-biz-1-123', status, amount_in_cents: 2990000 },
    },
    signature: { properties: ['transaction.id'], checksum: 'x', timestamp: 1 },
  }
  return new Request('http://localhost/api/webhooks/wompi', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

describe('Wompi webhook idempotency', () => {
  beforeEach(() => {
    businessesUpdateSpy.mockClear()
    transactionsUpdateSpy.mockClear()
    existingStatus = 'pending'
  })

  it('extends the plan on the first APPROVED delivery', async () => {
    await POST(buildRequest('APPROVED'))
    expect(businessesUpdateSpy).toHaveBeenCalledTimes(1)
  })

  it('does NOT extend the plan again if Wompi retries the same APPROVED event', async () => {
    existingStatus = 'approved' // simulates: already processed once
    await POST(buildRequest('APPROVED'))
    expect(businessesUpdateSpy).not.toHaveBeenCalled()
  })

  it('never extends the plan for a non-approved status', async () => {
    await POST(buildRequest('DECLINED'))
    expect(businessesUpdateSpy).not.toHaveBeenCalled()
  })
})
