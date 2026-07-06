import { describe, it, expect } from 'vitest'
import { checkClientLimit, checkProductLimit, checkMonthlySalesLimit, FREE_PLAN_LIMITS } from './plan-limits'

/** Mock mínimo de un query builder de Supabase: cada método encadenable
 * devuelve `this`, y el objeto es "thenable" para resolver como el conteo dado. */
function mockSupabase(count: number) {
  const builder = {
    from: () => builder,
    select: () => builder,
    eq: () => builder,
    is: () => builder,
    gte: () => builder,
    then: (resolve: (value: { count: number }) => void) => resolve({ count }),
  }
  return builder as unknown as Parameters<typeof checkClientLimit>[0]
}

const proBusiness = { id: 'biz-1', plan: 'pro' }
const freeBusiness = { id: 'biz-1', plan: 'free' }

describe('checkClientLimit', () => {
  it('never blocks a pro business regardless of count', async () => {
    const supabase = mockSupabase(9999)
    expect(await checkClientLimit(supabase, proBusiness)).toBeNull()
  })

  it('allows a free business under the limit', async () => {
    const supabase = mockSupabase(FREE_PLAN_LIMITS.clients - 1)
    expect(await checkClientLimit(supabase, freeBusiness)).toBeNull()
  })

  it('blocks a free business at the limit', async () => {
    const supabase = mockSupabase(FREE_PLAN_LIMITS.clients)
    const result = await checkClientLimit(supabase, freeBusiness)
    expect(result?.error).toContain(String(FREE_PLAN_LIMITS.clients))
  })
})

describe('checkProductLimit', () => {
  it('blocks a free business at the product limit', async () => {
    const supabase = mockSupabase(FREE_PLAN_LIMITS.products)
    const result = await checkProductLimit(supabase, freeBusiness)
    expect(result?.error).toContain(String(FREE_PLAN_LIMITS.products))
  })

  it('allows a pro business past the product limit', async () => {
    const supabase = mockSupabase(FREE_PLAN_LIMITS.products + 100)
    expect(await checkProductLimit(supabase, proBusiness)).toBeNull()
  })
})

describe('checkMonthlySalesLimit', () => {
  it('blocks a free business at the monthly sales limit', async () => {
    const supabase = mockSupabase(FREE_PLAN_LIMITS.salesPerMonth)
    const result = await checkMonthlySalesLimit(supabase, freeBusiness)
    expect(result?.error).toContain(String(FREE_PLAN_LIMITS.salesPerMonth))
  })

  it('allows a free business under the monthly sales limit', async () => {
    const supabase = mockSupabase(FREE_PLAN_LIMITS.salesPerMonth - 1)
    expect(await checkMonthlySalesLimit(supabase, freeBusiness)).toBeNull()
  })
})
