import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function getActiveBusiness() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: business } = await supabase
    .from('businesses')
    .select('id, name, description, currency, timezone, plan, plan_expires_at')
    .eq('user_id', user.id)
    .is('deleted_at', null)
    .single()

  if (!business) redirect('/register')

  // Auto-downgrade: si el plan PRO venció, lo revertimos a free en la lectura
  // (evita depender de un cron para que el vencimiento tenga efecto).
  if (business.plan === 'pro' && business.plan_expires_at && new Date(business.plan_expires_at) < new Date()) {
    await supabase
      .from('businesses')
      .update({ plan: 'free', plan_expires_at: null })
      .eq('id', business.id)
    business.plan = 'free'
    business.plan_expires_at = null
  }

  return business
}
