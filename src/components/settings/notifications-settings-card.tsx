'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Mail, Bell, CheckCircle2, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

export function NotificationsSettingsCard() {
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [emailSummary, setEmailSummary] = useState(false)
  const [pushPermission, setPushPermission] = useState<NotificationPermission>(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission
    }
    return 'default'
  })
  const [requesting, setRequesting] = useState(false)

  async function requestPushPermission() {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      toast.error('Este navegador no soporta notificaciones push.')
      return
    }

    setRequesting(true)
    try {
      const permission = await Notification.requestPermission()
      setPushPermission(permission)

      if (permission === 'granted') {
        toast.success('¡Notificaciones del navegador activadas!')
        // Lanzar una notificación push real de demostración de alto nivel
        new Notification('SeguimientoPro', {
          body: 'Notificaciones activadas. Te alertaremos sobre cobros vencidos y cumpleaños.',
          icon: '/favicon.ico',
        })
      } else if (permission === 'denied') {
        toast.error('Has bloqueado las notificaciones. Habilítalas desde la configuración del navegador.')
      }
    } catch (err) {
      console.error(err)
      toast.error('Ocurrió un error al solicitar permisos.')
    } finally {
      setRequesting(false)
    }
  }

  function handleSaveEmailSettings() {
    toast.success('Preferencias de correo guardadas correctamente.')
  }

  return (
    <div className="sp-card">
      <div className="sp-card-header flex flex-row items-center gap-3 !pb-3">
        <div className="h-8 w-8 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-400">
          <Bell size={18} />
        </div>
        <div>
          <h3 className="text-base font-bold text-white">Preferencias de Alertas</h3>
          <p className="text-xs text-slate-400">Configura cómo deseas recibir avisos de cobro y resúmenes operativos.</p>
        </div>
      </div>
      <div className="sp-card-content space-y-6">
        {/* Sección: Notificaciones de Navegador */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">Notificaciones de Escritorio (Push)</span>
              {pushPermission === 'granted' && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">
                  <CheckCircle2 size={10} /> Activo
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 max-w-md">
              Recibe alertas instantáneas en tu pantalla sobre cobros programados para hoy, promesas de pago rotas y alertas de stock mínimo.
            </p>
          </div>

          <div>
            {pushPermission === 'granted' ? (
              <Button
                variant="outline"
                disabled
                className="border-emerald-500/20 bg-emerald-500/5 text-emerald-400 font-semibold cursor-default"
              >
                Notificaciones Habilitadas
              </Button>
            ) : pushPermission === 'denied' ? (
              <div className="flex items-center gap-2 text-xs text-rose-400 font-medium">
                <AlertCircle size={14} />
                <span>Bloqueado en el navegador</span>
              </div>
            ) : (
              <Button
                onClick={requestPushPermission}
                disabled={requesting}
                className="bg-violet-600 hover:bg-violet-500 text-white font-semibold cursor-pointer shadow-lg hover:shadow-violet-600/20"
              >
                {requesting ? 'Activando...' : 'Activar en este Navegador'}
              </Button>
            )}
          </div>
        </div>

        {/* Sección: Correo electrónico */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <Mail size={16} className="text-violet-400" />
            Alertas de Correo Electrónico
          </h3>

          <div className="space-y-3.5">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="mt-1 rounded bg-[#0d1829] border border-white/10 text-violet-600 focus:ring-violet-500 cursor-pointer"
              />
              <div>
                <p className="text-xs font-bold text-white group-hover:text-violet-300 transition-colors">Enviar alertas automáticas a clientes</p>
                <p className="text-[10px] text-slate-400">Notificar al cliente vía correo electrónico 3 días antes del vencimiento y al vencerse un cobro.</p>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={emailSummary}
                onChange={(e) => setEmailSummary(e.target.checked)}
                className="mt-1 rounded bg-[#0d1829] border border-white/10 text-violet-600 focus:ring-violet-500 cursor-pointer"
              />
              <div>
                <p className="text-xs font-bold text-white group-hover:text-violet-300 transition-colors">Recibir resumen semanal de cartera</p>
                <p className="text-[10px] text-slate-400">Te enviaremos un informe los lunes por la mañana con el total a recaudar de la semana.</p>
              </div>
            </label>
          </div>

          <Button
            size="sm"
            onClick={handleSaveEmailSettings}
            className="bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold cursor-pointer mt-2"
          >
            Guardar preferencias de correo
          </Button>
        </div>
      </div>
    </div>
  )
}
