'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Bell, Check, Calendar, AlertTriangle, MessageSquare, Info, Loader2 } from 'lucide-react'
import { getPendingRemindersAction, completeReminderAction } from '@/app/dashboard/reminders/actions'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface Reminder {
  id: string
  title: string
  description: string | null
  reminder_type: 'birthday' | 'collection' | 'follow_up' | 'meeting' | 'custom'
  remind_at: string
}

export function NotificationsDropdown() {
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Cargar recordatorios iniciales
  async function loadReminders() {
    const result = await getPendingRemindersAction()
    if (result.error) {
      console.error(result.error)
    } else if (result.data) {
      setReminders(result.data as Reminder[])
    }
    setLoading(false)
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadReminders()
    }, 0)
    return () => clearTimeout(timer)
  }, [])

  // Cerrar al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Completar recordatorio (optimista)
  async function handleComplete(id: string) {
    const previousReminders = [...reminders]
    setReminders(prev => prev.filter(r => r.id !== id))
    toast.success('Recordatorio completado')

    const result = await completeReminderAction(id)
    if (result.error) {
      toast.error(result.error)
      setReminders(previousReminders) // revertir si hay fallo
    }
  }

  const pendingCount = reminders.length

  const getIcon = (type: string) => {
    switch (type) {
      case 'birthday':
        return <Calendar className="h-4 w-4 text-pink-400" />
      case 'collection':
        return <AlertTriangle className="h-4 w-4 text-amber-400" />
      case 'follow_up':
        return <MessageSquare className="h-4 w-4 text-blue-400" />
      default:
        return <Info className="h-4 w-4 text-violet-400" />
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Botón Campana */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "relative p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/[0.05] transition-all cursor-pointer focus:outline-none",
          isOpen && "text-white bg-white/[0.05]"
        )}
        aria-label="Ver notificaciones"
      >
        <Bell size={20} className={cn("transition-transform", isOpen && "scale-110")} />
        {pendingCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-violet-600 text-[10px] font-bold text-white ring-2 ring-[#091221] animate-pulse">
            {pendingCount}
          </span>
        )}
      </button>

      {/* Menú Desplegable Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2.5 w-80 rounded-xl border border-white/10 bg-[#0d1627]/95 backdrop-blur-md shadow-2xl z-50 overflow-hidden animate-fade-in origin-top-right">
          {/* Header */}
          <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
            <span className="text-xs font-bold text-white">Recordatorios Pendientes</span>
            {pendingCount > 0 && (
              <span className="text-[10px] bg-violet-500/20 text-violet-300 font-semibold px-2 py-0.5 rounded-full">
                {pendingCount} hoy
              </span>
            )}
          </div>

          {/* Listado */}
          <div className="max-h-64 overflow-y-auto pr-0.5">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-8 gap-2 text-slate-500 text-xs">
                <Loader2 className="h-4 w-4 animate-spin text-violet-400" />
                Cargando alertas...
              </div>
            ) : reminders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 px-4 text-center gap-1.5">
                <div className="h-10 w-10 rounded-full bg-violet-500/10 flex items-center justify-center text-violet-400 mb-1">
                  <Bell size={18} className="text-violet-400/80" />
                </div>
                <p className="text-xs font-bold text-slate-200">¡Todo al día!</p>
                <p className="text-[10px] text-slate-500 max-w-[200px]">No tienes cobros ni tareas programadas pendientes de gestión.</p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {reminders.map((reminder) => (
                  <div
                    key={reminder.id}
                    className="p-3.5 hover:bg-white/[0.02] flex items-start justify-between gap-3 group transition-colors"
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5 h-7 w-7 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                        {getIcon(reminder.reminder_type)}
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-white leading-tight">
                          {reminder.title}
                        </p>
                        {reminder.description && (
                          <p className="text-[10px] text-slate-400 line-clamp-2">
                            {reminder.description}
                          </p>
                        )}
                        <p className="text-[9px] text-slate-500">
                          {new Date(reminder.remind_at).toLocaleDateString('es-CO', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Botón Completar (Check) */}
                    <button
                      onClick={() => handleComplete(reminder.id)}
                      className="opacity-0 group-hover:opacity-100 flex-shrink-0 h-6 w-6 rounded-full bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white flex items-center justify-center transition-all cursor-pointer border border-emerald-500/20"
                      title="Marcar como completado"
                    >
                      <Check size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
