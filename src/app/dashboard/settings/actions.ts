'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getActiveBusiness } from '@/lib/supabase/get-business'
import { businessSchema } from '@/lib/validations/business'
import { goalSchema } from '@/lib/validations/goal'

export async function updateBusinessAction(formData: FormData) {
  const business = await getActiveBusiness()
  const supabase = await createClient()

  const parsed = businessSchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
    currency: formData.get('currency'),
    timezone: formData.get('timezone'),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Datos inválidos' }
  }

  const { data } = parsed

  const { error } = await supabase
    .from('businesses')
    .update({
      name: data.name,
      description: data.description?.trim() || null,
      currency: data.currency,
      timezone: data.timezone,
    })
    .eq('id', business.id)

  if (error) {
    return { error: 'No se pudo actualizar la información del negocio.' }
  }

  revalidatePath('/dashboard/settings')
  revalidatePath('/dashboard')
  return { success: true }
}

export async function upsertGoalAction(formData: FormData) {
  const business = await getActiveBusiness()
  const supabase = await createClient()

  const parsed = goalSchema.safeParse({
    sales_target: formData.get('sales_target'),
    collection_target: formData.get('collection_target'),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Datos inválidos' }
  }

  const { data } = parsed
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1

  const { data: existing } = await supabase
    .from('goals')
    .select('id')
    .eq('business_id', business.id)
    .eq('period_year', year)
    .eq('period_month', month)
    .maybeSingle()

  if (existing) {
    const { error } = await supabase
      .from('goals')
      .update({
        sales_target: data.sales_target,
        collection_target: data.collection_target,
      })
      .eq('id', existing.id)

    if (error) {
      return { error: 'No se pudo actualizar la meta del mes.' }
    }
  } else {
    const { error } = await supabase.from('goals').insert({
      business_id: business.id,
      period_year: year,
      period_month: month,
      sales_target: data.sales_target,
      collection_target: data.collection_target,
    })

    if (error) {
      return { error: 'No se pudo crear la meta del mes.' }
    }
  }

  revalidatePath('/dashboard/settings')
  revalidatePath('/dashboard')
  return { success: true }
}
