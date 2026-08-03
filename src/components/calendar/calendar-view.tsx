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
  indigo: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300',
  pink: 'bg-pink-100 text-pink-700 dark:bg-pink-500/20 dark:text-pink-300',
  red: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300',
  amber: 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300',
  gray: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-500/20 dark:text-neutral-300',
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
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-1">
        <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">
          {MONTHS[month]} <span className="text-neutral-400 font-normal ml-1">{year}</span>
        </h2>
        <div className="flex items-center gap-1 bg-neutral-100/50 dark:bg-neutral-800/50 p-1 rounded-full border border-neutral-200/50 dark:border-neutral-700/50 shadow-sm">
          <Button variant="ghost" size="icon-sm" className="rounded-full hover:bg-white dark:hover:bg-neutral-700 transition-colors" onClick={prevMonth} aria-label="Mes anterior">
            <ChevronLeft size={16} />
          </Button>
          <Button variant="ghost" size="icon-sm" className="rounded-full hover:bg-white dark:hover:bg-neutral-700 transition-colors" onClick={nextMonth} aria-label="Mes siguiente">
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 border-t border-l border-neutral-200/60 dark:border-neutral-800/60 bg-white dark:bg-neutral-950 rounded-2xl overflow-hidden shadow-sm">
        {DAY_NAMES.map((name) => (
          <div key={name} className="border-r border-b border-neutral-200/60 dark:border-neutral-800/60 px-2 py-3 text-center text-[13px] font-medium text-neutral-500 bg-neutral-50/50 dark:bg-neutral-900/20">
            {name}
          </div>
        ))}
        {days.map((day, i) => {
          if (day === null) {
            return <div key={`empty-${i}`} className="border-r border-b border-neutral-200/60 dark:border-neutral-800/60 bg-neutral-50/30 dark:bg-neutral-900/10 p-2 min-h-[100px]" />
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
                'group relative flex min-h-[100px] flex-col border-r border-b border-neutral-200/60 dark:border-neutral-800/60 p-1.5 sm:p-2 text-left transition-colors hover:bg-neutral-50/80 dark:hover:bg-neutral-900/60 outline-none focus:outline-none',
                isSelected && 'bg-violet-50/50 dark:bg-violet-500/5',
              )}
            >
              {isSelected && (
                <div className="absolute inset-0 ring-2 ring-inset ring-violet-500/40 dark:ring-violet-400/40 z-10 pointer-events-none rounded-none" />
              )}
              
              <div className="mb-1.5 flex justify-center sm:justify-start">
                <span className={cn(
                  'flex h-7 w-7 items-center justify-center rounded-full text-[13px] transition-all',
                  isToday 
                    ? 'bg-violet-600 text-white font-semibold shadow-sm' 
                    : isSelected 
                      ? 'bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-white font-medium'
                      : 'text-neutral-700 dark:text-neutral-300 font-medium group-hover:text-neutral-900 dark:group-hover:text-white'
                )}>
                  {day}
                </span>
              </div>
              
              <div className="flex flex-col gap-1 w-full relative z-20">
                {dayEvents.slice(0, 3).map((event) => (
                  <div
                    key={event.id}
                    className={cn(
                      "truncate rounded-md px-1.5 py-0.5 text-[11px] font-medium leading-tight",
                      EVENT_COLORS[event.color] ?? EVENT_COLORS.gray
                    )}
                  >
                    {event.title}
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <span className="px-1.5 text-[11px] font-medium text-neutral-500">+{dayEvents.length - 3} más</span>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
