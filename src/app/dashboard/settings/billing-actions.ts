'use server'

import { createClient } from '@/lib/supabase/server'
import { getActiveBusiness } from '@/lib/supabase/get-business'
import { WOMPI_PUBLIC_KEY, PRO_PLAN_PRICE_COP, buildIntegritySignature } from '@/lib/wompi/config'

export async function createCheckoutSessionAction() {
  if (!WOMPI_PUBLIC_KEY) {
    return { error: 'Los pagos no están configurados todavía. Contacta al administrador.' }
  }

  const business = await getActiveBusiness()
  const supabase = await createClient()

  const amountInCents = PRO_PLAN_PRICE_COP * 100
  const currency = 'COP'
  const reference = `pro-${business.id}-${Date.now()}`

  const { error: insertError } = await supabase.from('payment_transactions').insert({
    business_id: business.id,
    reference,
    amount_in_cents: amountInCents,
    currency,
    status: 'pending',
    plan: 'pro',
  })

  if (insertError) {
    return { error: 'No se pudo iniciar el pago. Intenta de nuevo.' }
  }

  let signature: string
  try {
    signature = buildIntegritySignature({ reference, amountInCents, currency })
  } catch {
    return { error: 'Los pagos no están configurados todavía. Contacta al administrador.' }
  }

  return {
    data: {
      publicKey: WOMPI_PUBLIC_KEY,
      currency,
      amountInCents,
      reference,
      signature,
    },
  }
}
