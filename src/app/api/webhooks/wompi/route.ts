import { NextResponse } from 'next/server'
import { verifyEventChecksum } from '@/lib/wompi/config'
import { createAdminClient } from '@/lib/supabase/admin'

interface WompiEventPayload {
  event: string
  data: {
    transaction: {
      id: string
      reference: string
      status: 'PENDING' | 'APPROVED' | 'DECLINED' | 'VOIDED' | 'ERROR'
      amount_in_cents: number
    }
  }
  signature: { properties: string[]; checksum: string; timestamp: number }
}

const STATUS_MAP: Record<WompiEventPayload['data']['transaction']['status'], string> = {
  PENDING: 'pending',
  APPROVED: 'approved',
  DECLINED: 'declined',
  VOIDED: 'voided',
  ERROR: 'error',
}

export async function POST(request: Request) {
  const payload = (await request.json()) as WompiEventPayload

  if (payload.event !== 'transaction.updated') {
    return NextResponse.json({ received: true })
  }

  let valid: boolean
  try {
    valid = verifyEventChecksum(payload)
  } catch {
    return NextResponse.json({ error: 'Wompi no está configurado' }, { status: 500 })
  }

  if (!valid) {
    return NextResponse.json({ error: 'Firma inválida' }, { status: 401 })
  }

  const { transaction } = payload.data
  const status = STATUS_MAP[transaction.status] ?? 'pending'
  const supabase = createAdminClient()

  // Leemos el estado ANTES de actualizar para detectar reintentos de Wompi:
  // si ya estaba 'approved', no volvemos a extender el plan otros 30 días.
  const { data: existing } = await supabase
    .from('payment_transactions')
    .select('status, business_id, plan')
    .eq('reference', transaction.reference)
    .single()

  if (!existing) {
    return NextResponse.json({ received: true })
  }

  const alreadyApproved = existing.status === 'approved'

  await supabase
    .from('payment_transactions')
    .update({ status, wompi_transaction_id: transaction.id, updated_at: new Date().toISOString() })
    .eq('reference', transaction.reference)

  if (!alreadyApproved && transaction.status === 'APPROVED') {
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 30)

    await supabase
      .from('businesses')
      .update({ plan: existing.plan, plan_expires_at: expiresAt.toISOString() })
      .eq('id', existing.business_id)
  }

  return NextResponse.json({ received: true })
}
