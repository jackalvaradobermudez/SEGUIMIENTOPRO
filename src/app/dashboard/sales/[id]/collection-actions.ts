'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getActiveBusiness } from '@/lib/supabase/get-business'
import { collectionActionSchema } from '@/lib/validations/collection-action'

export async function createCollectionActionAction(
  saleId: string,
  clientId: string,
  input: unknown,
) {
  const business = await getActiveBusiness()
  const supabase = await createClient()

  const parsed = collectionActionSchema.safeParse(input)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Datos inválidos' }
  }

  const { data } = parsed

  const { error } = await supabase.from('collection_actions').insert({
    sale_id: saleId,
    business_id: business.id,
    client_id: clientId,
    action_type: data.action_type,
    action_date: data.action_date,
    result: data.result ?? null,
    promised_date: data.promised_date?.trim() || null,
    promised_amount: data.promised_amount ?? null,
    notes: data.notes?.trim() || null,
  })

  if (error) {
    return { error: 'No se pudo registrar la gestión. Intenta de nuevo.' }
  }

  revalidatePath(`/dashboard/sales/${saleId}`)
  revalidatePath('/dashboard/collections')
  revalidatePath('/dashboard')
  return { success: true }
}

export async function deleteCollectionActionAction(
  saleId: string,
  actionId: string,
) {
  const business = await getActiveBusiness()
  const supabase = await createClient()

  const { error } = await supabase
    .from('collection_actions')
    .update({ notes: '(Eliminado)', result: null })
    .eq('id', actionId)
    .eq('business_id', business.id)

  if (error) {
    return { error: 'No se pudo eliminar la gestión. Intenta de nuevo.' }
  }

  revalidatePath(`/dashboard/sales/${saleId}`)
  revalidatePath('/dashboard/collections')
  revalidatePath('/dashboard')
  return { success: true }
}
