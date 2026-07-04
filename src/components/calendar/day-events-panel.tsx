'use client'

import Link from 'next/link'
import { Check, Cake, Phone, Bell, Calendar, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatDate } from '@/lib/utils'
import {
  completeReminderAction,
  deleteReminderAction,
} from '@/app/dashboard/calendar/actions'
import { toast } from 'sonner'
import { useState } from 'react'
import type { CalendarEvent } from '@/lib/calendar/aggregate-events'

const EVENT_ICONS: Record<string, typeof Phone> = {
  reminder: Bell,
  birthday: Cake,
  collection_due: Phone,
  payment_promise: Calendar,
}

const EVENT_COLORS: Record<string, string> = {
  indigo: 'bg-indigo-500/20 border-indigo-500/30',
  pink: 'bg-pink-500/20 border-pink-500/30',
  red: 'bg-red-500/20 border-red-500/30',
  amber: 'bg-amber-500/20 border-amber-500/30',
  gray: 'bg-gray-500/20 border-gray-500/30',
}

export function DayEventsPanel({
  date,
  events,
  currency,
}: {
  date: string
  events: CalendarEvent[]
  currency: string
}) {
  const [completingId, setCompletingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function handleComplete(eventId: string) {
    setCompletingId(eventId)
    const result = await completeReminderAction(eventId)
    if (result?.error) toast.error(result.error)
    else toast.success('Recordatorio completado')
    setCompletingId(null)
  }

  async function handleDelete(eventId: string) {
    setDeletingId(eventId)
    const result = await deleteReminderAction(eventId)
    if (result?.error) toast.error(result.error)
    else toast.success('Recordatorio eliminado')
    setDeletingId(null)
  }

  if (events.length === 0) {
    return <p className="text-sm text-muted-foreground">No hay eventos para este día.</p>
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-medium text-muted-foreground">{formatDate(date)}</p>
      {events.map((event) => {
        const Icon = EVENT_ICONS[event.type] ?? Bell
        const isReminder = event.type === 'reminder'
        return (
          <div
            key={event.id}
            className={`flex flex-col gap-2 rounded-[var(--radius-md)] border p-3 ${EVENT_COLORS[event.color] ?? ''}`}
          >
            <div className="flex items-start gap-2">
              <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium">{event.title}</span>
                {event.description && (
                  <span className="text-xs text-muted-foreground">{event.description}</span>
                )}
                {event.amount != null && (
                  <span className="text-sm font-semibold">{formatCurrency(event.amount, currency)}</span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {event.actionUrl && (
                <Link href={event.actionUrl} className="quick-link text-xs">
                  Ver →
                </Link>
              )}
              {isReminder && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs"
                    disabled={completingId === event.id}
                    onClick={() => handleComplete(event.id)}
                  >
                    <Check size={12} className="mr-1" />
                    Completar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs text-red-400"
                    disabled={deletingId === event.id}
                    onClick={() => handleDelete(event.id)}
                  >
                    <Trash2 size={12} className="mr-1" />
                    Eliminar
                  </Button>
                </>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
