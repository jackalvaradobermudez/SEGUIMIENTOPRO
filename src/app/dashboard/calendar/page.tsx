import { createClient } from '@/lib/supabase/server'
import { getActiveBusiness } from '@/lib/supabase/get-business'
import { aggregateEvents } from '@/lib/calendar/aggregate-events'
import CalendarPageClient from './calendar-client'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Calendario — SeguimientoPro',
}

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>
}) {
  const { month: monthParam } = await searchParams
  const today = new Date()
  const year = monthParam ? parseInt(monthParam.split('-')[0]) : today.getFullYear()
  const month = monthParam ? parseInt(monthParam.split('-')[1]) - 1 : today.getMonth()

  const business = await getActiveBusiness()
  const supabase = await createClient()

  const monthStart = `${year}-${String(month + 1).padStart(2, '0')}-01`
  const nextMonth = month === 11 ? 0 : month + 1
  const nextYear = month === 11 ? year + 1 : year
  const monthEnd = `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-01`

  const [
    { data: reminders },
    { data: birthdays },
    { data: dueSales },
    { data: promises },
  ] = await Promise.all([
    supabase
      .from('reminders')
      .select('*')
      .eq('business_id', business.id)
      .eq('is_completed', false)
      .is('deleted_at', null)
      .gte('remind_at', monthStart)
      .lt('remind_at', monthEnd),
    supabase
      .from('v_upcoming_birthdays')
      .select('*')
      .eq('business_id', business.id),
    supabase
      .from('sales')
      .select('id, sale_number, due_date, balance, status, client_id')
      .eq('business_id', business.id)
      .gte('due_date', monthStart)
      .lt('due_date', monthEnd)
      .gt('balance', 0)
      .in('status', ['pending', 'partial', 'overdue'])
      .is('deleted_at', null),
    supabase
      .from('collection_actions')
      .select('id, promised_date, sale_id')
      .eq('business_id', business.id)
      .gte('promised_date', monthStart)
      .lt('promised_date', monthEnd),
  ])

  // Resolve client names
  const clientIds = new Set<string>()
  for (const s of dueSales ?? []) clientIds.add(s.client_id)
  const clientMap = new Map<string, string>()
  if (clientIds.size > 0) {
    const { data: clients } = await supabase
      .from('clients')
      .select('id, name')
      .in('id', Array.from(clientIds))
    for (const c of clients ?? []) clientMap.set(c.id, c.name)
  }

  const events = aggregateEvents({
    reminders: reminders ?? [],
    birthdays: birthdays ?? [],
    dueSales: dueSales ?? [],
    promises: promises ?? [],
    clientNames: clientMap,
    year,
    month,
  })

  return (
    <CalendarPageClient year={year} month={month} events={events} currency={business.currency} />
  )
}
