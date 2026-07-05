'use client'

import { useState, useRef } from 'react'
import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Bell, Calendar, AlertTriangle, ThumbsUp, FileText, Loader2 } from 'lucide-react'
import { whatsappTemplateSchema, type WhatsAppTemplateFormData, TEMPLATE_VARIABLES } from '@/lib/validations/whatsapp-template'
import { interpolateTemplate } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

const TYPE_ICONS: Record<string, typeof Bell> = {
  reminder_soft: Bell,
  reminder_due_day: Calendar,
  reminder_overdue: AlertTriangle,
  payment_thanks: ThumbsUp,
  account_statement: FileText,
}

const PREVIEW_DATA: Record<string, string> = {
  nombre: 'María López',
  monto: '$150.000',
  monto_pagado: '$50.000',
  saldo_pendiente: '$100.000',
  saldo_total: '$250.000',
  fecha_vencimiento: '15 jul 2026',
  numero_venta: '0042',
  dias_vencido: '12',
  nombre_negocio: 'Mi Negocio',
}

import { updateWhatsAppTemplate } from '@/app/dashboard/settings/template-actions'

interface Props {
  templateId: string
  templateType: string
  name: string
  messageBody: string
  onSuccess: () => void
}

export function WhatsAppTemplateForm({ templateId, templateType, name, messageBody, onSuccess }: Props) {
  const [submitting, setSubmitting] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const Icon = TYPE_ICONS[templateType] ?? Bell

  const form = useForm<WhatsAppTemplateFormData>({
    resolver: zodResolver(whatsappTemplateSchema) as Resolver<WhatsAppTemplateFormData>,
    defaultValues: { name, message_body: messageBody },
  })

  const messageBodyValue = form.watch('message_body')
  const previewMessage = interpolateTemplate(messageBodyValue ?? '', PREVIEW_DATA)

  function insertVariable(variable: string) {
    const textarea = textareaRef.current
    if (!textarea) return
    const start = textarea.selectionStart ?? 0
    const end = textarea.selectionEnd ?? 0
    const current = form.getValues('message_body')
    const newValue = current.slice(0, start) + `{${variable}}` + current.slice(end)
    form.setValue('message_body', newValue)
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + variable.length + 2, start + variable.length + 2)
    }, 0)
  }

  async function onSubmit(values: WhatsAppTemplateFormData) {
    setSubmitting(true)
    const formData = new FormData()
    formData.set('name', values.name)
    formData.set('message_body', values.message_body)
    const result = await updateWhatsAppTemplate(templateId, formData)
    if (result?.error) {
      toast.error(typeof result.error === 'string' ? result.error : 'Error al guardar.')
    } else {
      toast.success('Plantilla actualizada')
      onSuccess()
    }
    setSubmitting(false)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Icon size={16} />
          <span>Editando plantilla de {templateType.replace(/_/g, ' ')}</span>
        </div>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Nombre de la plantilla" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message_body"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mensaje</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Escribe el mensaje..."
                  rows={4}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  disabled={field.disabled}
                  name={field.name}
                  ref={(el) => {
                    field.ref(el)
                    ;(textareaRef as React.MutableRefObject<HTMLTextAreaElement | null>).current = el
                  }}
                />
              </FormControl>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">{field.value?.length ?? 0}/500</span>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        {/* Variables disponibles */}
        <div>
          <p className="mb-2 text-xs font-medium text-slate-400">Variables disponibles — haz clic para insertar:</p>
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(TEMPLATE_VARIABLES).map(([key, desc]) => (
              <button
                key={key}
                type="button"
                onClick={() => insertVariable(key)}
                className="group rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs text-slate-300 transition-all hover:border-violet-500/30 hover:bg-violet-500/10"
                title={desc}
              >
                <span className="font-mono text-violet-400">{`{${key}}`}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Preview */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
          <p className="mb-2 text-xs font-medium text-slate-400">Así se verá tu mensaje:</p>
          <p className="text-sm leading-relaxed text-slate-200">{previewMessage || 'Escribe un mensaje para ver la vista previa...'}</p>
        </div>

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={submitting}>
            {submitting && <Loader2 size={14} className="mr-1.5 animate-spin" />}
            Guardar cambios
          </Button>
        </div>
      </form>
    </Form>
  )
}
