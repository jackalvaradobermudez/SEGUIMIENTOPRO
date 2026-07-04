import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function getActiveBusiness() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: business } = await supabase
    .from('businesses')
    .select('id, name, description, currency, timezone')
    .eq('user_id', user.id)
    .is('deleted_at', null)
    .single()

  if (!business) redirect('/register')
  return business
}
