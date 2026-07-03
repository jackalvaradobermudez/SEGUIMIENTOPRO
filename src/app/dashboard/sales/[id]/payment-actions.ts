'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getActiveBusiness } from '@/lib/supabase/get-business'
import { paymentSchema } from '@/lib/validations/payment'

export async function registerPaymentAction(saleId: string, input: unknown) {
  const business = await getActiveBusiness()
  const supabase = await createClient()

  const parsed = paymentSchema.safeParse(input)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Datos inválidos' }
  }

  const { data: sale } = await supabase
    .from('sales')
    .select('id')
    .eq('id', saleId)
    .eq('business_id', business.id)
    .single()

  if (!sale) {
    return { error: 'No se encontró la venta. Verifica el ID o vuelve a buscarla.' }
  }

  const { data } = parsed

  const { error } = await supabase.from('payments').insert({
    sale_id: saleId,
    business_id: business.id,
    amount: data.amount,
    payment_date: data.payment_date,
    payment_method: data.payment_method,
    receipt_number: data.receipt_number?.trim() || null,
    notes: data.notes?.trim() || null,
    deleted_at: null,
  })

  if (error) {
    return { error: 'No se pudo registrar el abono. Intenta de nuevo.' }
  }

  revalidatePath(`/dashboard/sales/${saleId}`)
  revalidatePath('/dashboard/sales')
  revalidatePath('/dashboard')
  return { success: true }
}

export async function voidPaymentAction(saleId: string, paymentId: string) {
  const business = await getActiveBusiness()
  const supabase = await createClient()

  const { error } = await supabase
    .from('payments')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', paymentId)
    .eq('business_id', business.id)

  if (error) {
    return { error: 'No se pudo anular el abono. Intenta de nuevo.' }
  }

  revalidatePath(`/dashboard/sales/${saleId}`)
  revalidatePath('/dashboard/sales')
  revalidatePath('/dashboard')
  return { success: true }
}
