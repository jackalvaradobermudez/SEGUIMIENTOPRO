'use client'

import { useState } from 'react'
import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Calendar as CalendarIcon, Cake, Phone, RefreshCw, Bell } from 'lucide-react'
import { reminderSchema, type ReminderFormData } from '@/lib/validations/reminder'
import { createReminderAction } from '@/app/dashboard/calendar/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Calendar as CalendarPicker } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { cn, formatDate } from '@/lib/utils'

const TYPE_OPTIONS = [
  { value: 'collection', label: 'Cobro', icon: Phone },
  { value: 'follow_up', label: 'Seguimiento', icon: RefreshCw },
  { value: 'meeting', label: 'Reunión', icon: Bell },
  { value: 'birthday', label: 'Cumpleaños', icon: Cake },
  { value: 'custom', label: 'Personalizado', icon: Bell },
] as const

export function ReminderForm({ onSuccess }: { onSuccess: () => void }) {
  const [submitting, setSubmitting] = useState(false)

  const form = useForm<ReminderFormData>({
    resolver: zodResolver(reminderSchema) as Resolver<ReminderFormData>,
    defaultValues: {
      reminder_type: 'collection',
      title: '',
      description: '',
      remind_at: new Date().toISOString().split('T')[0],
      client_id: '',
      sale_id: '',
    },
  })

  async function onSubmit(values: ReminderFormData) {
    setSubmitting(true)
    const result = await createReminderAction(values)
    if (result?.error) {
      toast.error(result.error)
      setSubmitting(false)
      return
    }
    toast.success('Recordatorio creado')
    setSubmitting(false)
    onSuccess()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4" id="reminder-form">
        <FormField
          control={form.control}
          name="reminder_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {TYPE_OPTIONS.map((opt) => {
                    const Icon = opt.icon
                    return (
                      <SelectItem key={opt.value} value={opt.value}>
                        <span className="flex items-center gap-2">
                          <Icon size={14} />
                          {opt.label}
                        </span>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título *</FormLabel>
              <FormControl>
                <Input placeholder="Título del recordatorio" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea placeholder="Detalles del recordatorio" rows={2} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="remind_at"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fecha *</FormLabel>
              <Popover>
                <PopoverTrigger
                  render={
                    <Button variant="outline" className={cn('w-full justify-start font-normal', !field.value && 'text-muted-foreground')} />
                  }
                >
                  <CalendarIcon className="mr-2 size-4" />
                  {field.value ? formatDate(field.value) : 'Selecciona una fecha'}
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarPicker
                    mode="single"
                    selected={field.value ? new Date(`${field.value}T00:00:00`) : undefined}
                    onSelect={(date) => field.onChange(date ? date.toISOString().split('T')[0] : '')}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="client_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cliente (opcional)</FormLabel>
                <FormControl>
                  <Input placeholder="ID del cliente" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sale_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Venta (opcional)</FormLabel>
                <FormControl>
                  <Input placeholder="ID de la venta" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" id="reminder-form-submit" disabled={submitting}>
          {submitting ? 'Guardando...' : 'Guardar recordatorio'}
        </Button>
      </form>
    </Form>
  )
}
