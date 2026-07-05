'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Bell, Calendar, AlertTriangle, ThumbsUp, FileText, Edit, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { WhatsAppTemplateForm } from '@/components/forms/whatsapp-template-form'
import { getWhatsAppTemplates, resetWhatsAppTemplate } from '@/app/dashboard/settings/template-actions'
import { DEFAULT_TEMPLATE_MESSAGES, WHATSAPP_TEMPLATE_TYPES } from '@/lib/constants'

const TYPE_ICONS: Record<string, typeof Bell> = {
  reminder_soft: Bell,
  reminder_due_day: Calendar,
  reminder_overdue: AlertTriangle,
  payment_thanks: ThumbsUp,
  account_statement: FileText,
}

interface Template {
  id: string
  template_type: string
  name: string
  message_body: string
  is_default: boolean
  is_active: boolean
}

export function WhatsAppTemplatesSection() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null)
  const [resettingId, setResettingId] = useState<string | null>(null)

  useEffect(() => {
    loadTemplates()
  }, [])

  async function loadTemplates() {
    setLoading(true)
    const result = await getWhatsAppTemplates()
    if (result?.error) {
      toast.error(result.error)
    } else if (result?.data) {
      setTemplates((result.data as unknown as Template[]) ?? [])
    }
    setLoading(false)
  }

  async function handleReset(template: Template) {
    setResettingId(template.id)
    const result = await resetWhatsAppTemplate(template.id, template.template_type)
    if (result?.error) {
      toast.error(typeof result.error === 'string' ? result.error : 'Error al restaurar.')
    } else {
      toast.success('Plantilla restaurada')
      loadTemplates()
    }
    setResettingId(null)
  }

  const isModified = (t: Template) =>
    t.message_body !== (DEFAULT_TEMPLATE_MESSAGES[t.template_type] ?? '')

  if (loading) {
    return (
      <div className="sp-card">
        <div className="sp-card-content">
          <p className="text-sm text-slate-400">Cargando plantillas...</p>
        </div>
      </div>
    )
  }

  if (templates.length === 0) {
    return (
      <div className="sp-card">
        <div className="sp-card-content">
          <p className="text-sm text-slate-400">No se encontraron plantillas. Esto no debería pasar — contacta soporte.</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="sp-card">
        <div className="sp-card-header flex flex-col gap-1 !pb-4">
          <h3 className="text-base font-bold text-white">Plantillas de WhatsApp</h3>
          <p className="text-[13px] text-slate-400">
            Personaliza los mensajes que envías a tus clientes. Usa las variables entre llaves para datos dinámicos.
          </p>
        </div>

        <div className="sp-card-content flex flex-col gap-3">
          {templates.map((template) => {
            const Icon = TYPE_ICONS[template.template_type] ?? Bell
            const typeConfig = WHATSAPP_TEMPLATE_TYPES[template.template_type as keyof typeof WHATSAPP_TEMPLATE_TYPES]
            const modified = isModified(template)
            return (
              <div
                key={template.id}
                className="flex items-start gap-5 rounded-2xl border border-white/[0.06] bg-white/[0.01] p-5 px-6 transition-all hover:border-white/16 hover:bg-white/[0.02] duration-150"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/20">
                  <Icon size={16} className="text-violet-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-white">{template.name}</p>
                    {typeConfig && (
                      <span className="rounded-full bg-violet-500/10 px-2 py-0.5 text-[10px] font-medium text-violet-300">
                        {typeConfig.label}
                      </span>
                    )}
                    {template.is_default && !modified && (
                      <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                        Por defecto
                      </span>
                    )}
                    {modified && (
                      <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-300">
                        Personalizada
                      </span>
                    )}
                  </div>
                  <p className="mt-1.5 text-[13px] text-slate-400 line-clamp-2">{template.message_body}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingTemplate(template)}
                    className="h-9 cursor-pointer"
                  >
                    <Edit size={14} className="mr-1" />
                    Editar
                  </Button>
                  {modified && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleReset(template)}
                      disabled={resettingId === template.id}
                      className="h-9 cursor-pointer"
                    >
                      <RotateCcw size={14} className="mr-1" />
                      Restaurar
                    </Button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <Dialog open={!!editingTemplate} onOpenChange={(open) => !open && setEditingTemplate(null)}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Editar plantilla</DialogTitle>
            <DialogDescription>Personaliza el mensaje que se enviará a tus clientes.</DialogDescription>
          </DialogHeader>
          {editingTemplate && (
            <WhatsAppTemplateForm
              templateId={editingTemplate.id}
              templateType={editingTemplate.template_type}
              name={editingTemplate.name}
              messageBody={editingTemplate.message_body}
              onSuccess={() => {
                setEditingTemplate(null)
                loadTemplates()
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
