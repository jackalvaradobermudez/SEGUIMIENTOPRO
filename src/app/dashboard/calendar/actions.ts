'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getActiveBusiness } from '@/lib/supabase/get-business'
import { reminderSchema } from '@/lib/validations/reminder'

export async function createReminderAction(input: unknown) {
  const business = await getActiveBusiness()
  const supabase = await createClient()

  const parsed = reminderSchema.safeParse(input)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Datos inválidos' }
  }

  const { data } = parsed

  const { error } = await supabase.from('reminders').insert({
    business_id: business.id,
    client_id: data.client_id?.trim() || null,
    sale_id: data.sale_id?.trim() || null,
    reminder_type: data.reminder_type,
    title: data.title,
    description: data.description?.trim() || null,
    remind_at: data.remind_at,
    is_completed: false,
    completed_at: null,
  })

  if (error) {
    return { error: 'No se pudo crear el recordatorio. Intenta de nuevo.' }
  }

  revalidatePath('/dashboard/calendar')
  revalidatePath('/dashboard')
  return { success: true }
}

export async function completeReminderAction(reminderId: string) {
  const business = await getActiveBusiness()
  const supabase = await createClient()

  const { error } = await supabase
    .from('reminders')
    .update({ is_completed: true, completed_at: new Date().toISOString() })
    .eq('id', reminderId)
    .eq('business_id', business.id)

  if (error) {
    return { error: 'No se pudo completar el recordatorio.' }
  }

  revalidatePath('/dashboard/calendar')
  revalidatePath('/dashboard')
  return { success: true }
}

export async function deleteReminderAction(reminderId: string) {
  const business = await getActiveBusiness()
  const supabase = await createClient()

  const { error } = await supabase
    .from('reminders')
    .update({ is_completed: true, completed_at: new Date().toISOString() })
    .eq('id', reminderId)
    .eq('business_id', business.id)

  if (error) {
    return { error: 'No se pudo eliminar el recordatorio.' }
  }

  revalidatePath('/dashboard/calendar')
  revalidatePath('/dashboard')
  return { success: true }
}
