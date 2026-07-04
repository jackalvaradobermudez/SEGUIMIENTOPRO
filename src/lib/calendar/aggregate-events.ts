import type { Database } from '@/types/database'

export type CalendarEvent = {
  id: string
  date: string
  type: 'reminder' | 'birthday' | 'collection_due' | 'payment_promise'
  title: string
  description?: string
  amount?: number
  client_id?: string
  sale_id?: string
  color: 'indigo' | 'pink' | 'red' | 'amber' | 'gray'
  actionUrl?: string
}

type ReminderRow = Database['public']['Tables']['reminders']['Row']
type BirthdayRow = Database['public']['Views']['v_upcoming_birthdays']['Row']
type SaleRow = Database['public']['Tables']['sales']['Row']
type CollectionActionRow = Database['public']['Tables']['collection_actions']['Row']

export function aggregateEvents(params: {
  reminders: ReminderRow[]
  birthdays: BirthdayRow[]
  dueSales: Pick<SaleRow, 'id' | 'sale_number' | 'due_date' | 'balance' | 'status' | 'client_id'>[]
  promises: Pick<CollectionActionRow, 'id' | 'promised_date' | 'sale_id'>[]
  clientNames: Map<string, string>
  year: number
  month: number
}): CalendarEvent[] {
  const events: CalendarEvent[] = []
  const monthStart = `${params.year}-${String(params.month + 1).padStart(2, '0')}-01`
  const nextMonth = params.month === 11 ? 0 : params.month + 1
  const nextYear = params.month === 11 ? params.year + 1 : params.year
  const monthEnd = `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-01`

  // 1. Reminders
  for (const r of params.reminders) {
    if (r.remind_at < monthStart || r.remind_at >= monthEnd) continue
    events.push({
      id: r.id,
      date: r.remind_at,
      type: 'reminder',
      title: r.title,
      description: r.description ?? undefined,
      client_id: r.client_id ?? undefined,
      sale_id: r.sale_id ?? undefined,
      color: 'indigo',
      actionUrl: r.sale_id ? `/dashboard/sales/${r.sale_id}` : undefined,
    })
  }

  // 2. Birthdays
  for (const b of params.birthdays) {
    // birthday y client_id siempre tienen valor en v_upcoming_birthdays
    if (!b.birthday) continue
    const birthDate = new Date(b.birthday)
    const eventDateStr = `${params.year}-${String(params.month + 1).padStart(2, '0')}-${String(birthDate.getDate()).padStart(2, '0')}`
    if (eventDateStr < monthStart || eventDateStr >= monthEnd) continue
    events.push({
      id: `birthday-${b.client_id}`,
      date: eventDateStr,
      type: 'birthday',
      title: `Cumpleaños de ${b.name}`,
      client_id: b.client_id ?? undefined,
      color: 'pink',
    })
  }

  // 3. Collection dues
  for (const s of params.dueSales) {
    if (!s.due_date || s.due_date < monthStart || s.due_date >= monthEnd) continue
    const clientName = params.clientNames.get(s.client_id) ?? 'Cliente'
    const daysLeft = Math.ceil((new Date(s.due_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    let color: CalendarEvent['color'] = 'gray'
    if (daysLeft < 0) color = 'red'
    else if (daysLeft <= 3) color = 'amber'

    events.push({
      id: `due-${s.id}`,
      date: s.due_date,
      type: 'collection_due',
      title: `Venta #${s.sale_number} · ${clientName}`,
      // balance es nullable en el tipo generado pero siempre tiene valor en ventas activas
      amount: s.balance ?? undefined,
      client_id: s.client_id,
      sale_id: s.id,
      color,
      actionUrl: `/dashboard/sales/${s.id}`,
    })
  }

  // 4. Payment promises
  for (const p of params.promises) {
    if (!p.promised_date || p.promised_date < monthStart || p.promised_date >= monthEnd) continue
    events.push({
      id: `promise-${p.id}`,
      date: p.promised_date,
      type: 'payment_promise',
      title: 'Promesa de pago',
      sale_id: p.sale_id,
      color: 'amber',
      actionUrl: p.sale_id ? `/dashboard/sales/${p.sale_id}` : undefined,
    })
  }

  return events.sort((a, b) => a.date.localeCompare(b.date))
}
