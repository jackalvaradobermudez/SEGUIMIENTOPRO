'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getActiveBusiness } from '@/lib/supabase/get-business'

export async function getPendingRemindersAction() {
  try {
    const business = await getActiveBusiness()
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('reminders')
      .select('*')
      .eq('business_id', business.id)
      .eq('is_completed', false)
      .order('remind_at', { ascending: true })

    if (error) {
      console.error('Error fetching pending reminders:', error)
      return { error: 'No se pudieron obtener los recordatorios.' }
    }

    return { data }
  } catch (err) {
    console.error(err)
    return { error: 'Error de servidor al cargar recordatorios.' }
  }
}

export async function completeReminderAction(reminderId: string) {
  try {
    const business = await getActiveBusiness()
    const supabase = await createClient()

    const { error } = await supabase
      .from('reminders')
      .update({
        is_completed: true,
        completed_at: new Date().toISOString(),
      })
      .eq('id', reminderId)
      .eq('business_id', business.id)

    if (error) {
      console.error('Error completing reminder:', error)
      return { error: 'No se pudo completar el recordatorio.' }
    }

    revalidatePath('/dashboard')
    return { success: true }
  } catch (err) {
    console.error(err)
    return { error: 'Error de servidor al completar el recordatorio.' }
  }
}
