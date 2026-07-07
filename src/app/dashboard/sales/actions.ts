'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getActiveBusiness } from '@/lib/supabase/get-business'
import { saleSchema } from '@/lib/validations/sale'
import { checkMonthlySalesLimit } from '@/lib/plan-limits'

export async function createSaleAction(input: unknown, options?: { skipRedirect?: boolean }) {
  const business = await getActiveBusiness()
  const supabase = await createClient()

  const limitError = await checkMonthlySalesLimit(supabase, business)
  if (limitError) return limitError

  const parsed = saleSchema.safeParse(input)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Datos inválidos' }
  }

  const { data } = parsed

  const { data: sale, error: saleError } = await supabase
    .from('sales')
    .insert({
      business_id: business.id,
      client_id: data.client_id,
      sale_date: data.sale_date,
      sale_type: data.sale_type,
      due_date: data.sale_type === 'credit' ? data.due_date || null : null,
      installments: data.installments,
      discount: data.discount,
      payment_method: data.payment_method,
      notes: data.notes?.trim() || null,
      deleted_at: null,
    })
    .select('id, total_amount')
    .single()

  if (saleError || !sale) {
    return { error: 'No se pudo registrar la venta. Intenta de nuevo.' }
  }

  const { error: itemsError } = await supabase.from('sale_items').insert(
    data.items.map((item) => ({
      sale_id: sale.id,
      product_id: item.product_id ?? null,
      description: item.description,
      quantity: item.quantity,
      unit_price: item.unit_price,
    }))
  )

  if (itemsError) {
    return { error: 'No se pudieron registrar los productos de la venta.' }
  }

  if (data.sale_type === 'cash') {
    const { data: refreshedSale } = await supabase
      .from('sales')
      .select('total_amount')
      .eq('id', sale.id)
      .single()

    const { error: paymentError } = await supabase.from('payments').insert({
      sale_id: sale.id,
      business_id: business.id,
      amount: refreshedSale?.total_amount ?? sale.total_amount,
      payment_date: data.sale_date,
      payment_method: data.payment_method,
      receipt_number: null,
      notes: null,
      deleted_at: null,
    })

    if (paymentError) {
      return { error: 'La venta se creó pero no se pudo registrar el pago de contado.' }
    }
  }

  revalidatePath('/dashboard/sales')
  revalidatePath('/dashboard')

  if (options?.skipRedirect) {
    return { success: true, id: sale.id }
  }

  redirect(`/dashboard/sales/${sale.id}`)
}

export async function cancelSaleAction(saleId: string) {
  const business = await getActiveBusiness()
  const supabase = await createClient()

  const { error } = await supabase
    .from('sales')
    .update({ status: 'cancelled' })
    .eq('id', saleId)
    .eq('business_id', business.id)

  if (error) {
    return { error: 'No se pudo cancelar la venta. Intenta de nuevo.' }
  }

  revalidatePath('/dashboard/sales')
  revalidatePath(`/dashboard/sales/${saleId}`)
  return { success: true }
}
