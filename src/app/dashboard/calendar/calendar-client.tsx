'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { CalendarView } from '@/components/calendar/calendar-view'
import { DayEventsPanel } from '@/components/calendar/day-events-panel'
import { ReminderForm } from '@/components/forms/reminder-form'
import { formatDate } from '@/lib/utils'
import type { CalendarEvent } from '@/lib/calendar/aggregate-events'

export default function CalendarPageClient({
  year,
  month,
  events,
  currency,
}: {
  year: number
  month: number
  events: CalendarEvent[]
  currency: string
}) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [reminderOpen, setReminderOpen] = useState(false)

  const selectedEvents = events.filter((e) => e.date === selectedDate)

  return (
    <div className="dashboard-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Calendario</h1>
          <p className="page-subtitle">Vista mensual de tus eventos de cobro, cumpleaños y recordatorios</p>
        </div>
        <Button onClick={() => setReminderOpen(true)} id="new-reminder-button">
          <Plus size={16} />
          Nuevo recordatorio
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div className="overflow-x-auto">
          <CalendarView
            year={year}
            month={month}
            events={events}
            onSelectDate={setSelectedDate}
            selectedDate={selectedDate}
          />
        </div>

        <div className="hidden lg:block">
          <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-4">
            <h3 className="mb-4 text-sm font-semibold">
              {selectedDate ? formatDate(selectedDate) : 'Selecciona un día'}
            </h3>
            {selectedDate ? (
              <DayEventsPanel date={selectedDate} events={selectedEvents} currency={currency} />
            ) : (
              <p className="text-sm text-muted-foreground">Haz clic en un día para ver sus eventos.</p>
            )}
          </div>
        </div>
      </div>

      <Sheet open={!!selectedDate} onOpenChange={(open) => !open && setSelectedDate(null)}>
        <SheetContent side="bottom" className="h-[60vh] lg:hidden">
          <SheetHeader>
            <SheetTitle>{selectedDate ? formatDate(selectedDate) : 'Eventos'}</SheetTitle>
            <SheetDescription>Eventos del día seleccionado</SheetDescription>
          </SheetHeader>
          <div className="mt-4 overflow-y-auto">
            {selectedDate && <DayEventsPanel date={selectedDate} events={selectedEvents} currency={currency} />}
          </div>
        </SheetContent>
      </Sheet>

      <Dialog open={reminderOpen} onOpenChange={setReminderOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nuevo recordatorio</DialogTitle>
            <DialogDescription>Crea un recordatorio manual</DialogDescription>
          </DialogHeader>
          <ReminderForm onSuccess={() => setReminderOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
