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
  indigo: 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-900 dark:text-indigo-100',
  pink: 'bg-pink-50 dark:bg-pink-500/10 text-pink-900 dark:text-pink-100',
  red: 'bg-red-50 dark:bg-red-500/10 text-red-900 dark:text-red-100',
  amber: 'bg-amber-50 dark:bg-amber-500/10 text-amber-900 dark:text-amber-100',
  gray: 'bg-neutral-50 dark:bg-neutral-500/10 text-neutral-900 dark:text-neutral-100',
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
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Calendar size={48} strokeWidth={1} className="text-neutral-300 dark:text-neutral-700 mb-4" />
        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-1">Sin eventos</h3>
        <p className="text-[13px] text-neutral-500">No hay nada programado para este día.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-[13px] font-semibold text-neutral-500 uppercase tracking-wider">{formatDate(date)}</p>
      <div className="flex flex-col gap-3">
        {events.map((event) => {
          const Icon = EVENT_ICONS[event.type] ?? Bell
          const isReminder = event.type === 'reminder'
          return (
            <div
              key={event.id}
              className={`flex flex-col gap-3 rounded-2xl p-4 transition-transform hover:scale-[1.02] shadow-sm ${EVENT_COLORS[event.color] ?? EVENT_COLORS.gray}`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 bg-white/50 dark:bg-black/20 p-1.5 rounded-full shadow-sm">
                  <Icon size={16} className="shrink-0 opacity-80" />
                </div>
                <div className="flex flex-col gap-1 w-full">
                  <span className="text-sm font-semibold leading-tight">{event.title}</span>
                  {event.description && (
                    <span className="text-[13px] opacity-80 leading-relaxed">{event.description}</span>
                  )}
                  {event.amount != null && (
                    <span className="text-sm font-bold mt-1 opacity-90">{formatCurrency(event.amount, currency)}</span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-end gap-2 mt-2 pt-3 border-t border-black/5 dark:border-white/5">
                {event.actionUrl && (
                  <Link href={event.actionUrl} className="text-[13px] font-semibold opacity-80 hover:opacity-100 transition-colors flex items-center px-3 py-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5">
                    Ver detalles →
                  </Link>
                )}
                {isReminder && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-3 text-[13px] font-semibold opacity-80 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5 rounded-full"
                      disabled={completingId === event.id}
                      onClick={() => handleComplete(event.id)}
                    >
                      <Check size={14} className="mr-1.5" />
                      Completar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-3 text-[13px] font-semibold text-red-600 dark:text-red-400 opacity-90 hover:opacity-100 hover:bg-red-500/10 rounded-full"
                      disabled={deletingId === event.id}
                      onClick={() => handleDelete(event.id)}
                    >
                      <Trash2 size={14} className="mr-1.5" />
                      Eliminar
                    </Button>
                  </>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
