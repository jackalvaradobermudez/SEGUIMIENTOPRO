'use client'

import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { CalendarEvent } from '@/lib/calendar/aggregate-events'

const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

const DAY_NAMES = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

const EVENT_COLORS: Record<string, string> = {
  indigo: 'bg-indigo-500',
  pink: 'bg-pink-500',
  red: 'bg-red-500',
  amber: 'bg-amber-500',
  gray: 'bg-gray-500',
}

export function CalendarView({
  year,
  month,
  events,
  onSelectDate,
  selectedDate,
}: {
  year: number
  month: number
  events: CalendarEvent[]
  onSelectDate: (date: string) => void
  selectedDate: string | null
}) {
  const router = useRouter()

  const firstDay = new Date(year, month, 1)
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const startDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1

  const prevMonth = () => {
    const prev = month === 0 ? 11 : month - 1
    const prevY = month === 0 ? year - 1 : year
    router.push(`/dashboard/calendar?month=${prevY}-${String(prev + 1).padStart(2, '0')}`)
  }

  const nextMonth = () => {
    const next = month === 11 ? 0 : month + 1
    const nextY = month === 11 ? year + 1 : year
    router.push(`/dashboard/calendar?month=${nextY}-${String(next + 1).padStart(2, '0')}`)
  }

  const today = new Date().toISOString().split('T')[0]

  const days: Array<number | null> = []
  for (let i = 0; i < startDayOfWeek; i++) days.push(null)
  for (let d = 1; d <= daysInMonth; d++) days.push(d)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon-sm" onClick={prevMonth} aria-label="Mes anterior">
            <ChevronLeft size={16} />
          </Button>
          <h2 className="font-display text-lg font-bold">
            {MONTHS[month]} {year}
          </h2>
          <Button variant="outline" size="icon-sm" onClick={nextMonth} aria-label="Mes siguiente">
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--border)]">
        {DAY_NAMES.map((name) => (
          <div key={name} className="bg-[var(--surface)] px-2 py-2 text-center text-xs font-medium text-muted-foreground">
            {name}
          </div>
        ))}
        {days.map((day, i) => {
          if (day === null) {
            return <div key={`empty-${i}`} className="bg-[var(--surface)] p-1" />
          }
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          const dayEvents = events.filter((e) => e.date === dateStr)
          const isToday = dateStr === today
          const isSelected = dateStr === selectedDate

          return (
            <button
              key={dateStr}
              type="button"
              onClick={() => onSelectDate(dateStr)}
              className={cn(
                'flex min-h-[80px] flex-col bg-[var(--surface)] p-1 text-left transition-colors hover:bg-[var(--surface-2)]',
                isSelected && 'ring-2 ring-[var(--accent)]',
              )}
            >
              <span className={cn('text-xs', isToday ? 'font-bold text-[var(--accent)]' : 'text-muted-foreground')}>
                {day}
              </span>
              <div className="mt-1 flex flex-col gap-0.5">
                {dayEvents.slice(0, 3).map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center gap-1 truncate rounded px-1 py-0.5 text-[10px]"
                    style={{ backgroundColor: `${EVENT_COLORS[event.color] ?? '#6b7280'}30` }}
                  >
                    <span className={`inline-block size-1.5 shrink-0 rounded-full ${EVENT_COLORS[event.color] ?? 'bg-gray-500'}`} />
                    <span className="truncate">{event.title}</span>
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <span className="px-1 text-[10px] text-muted-foreground">+{dayEvents.length - 3} más</span>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
