'use client'

import { useState } from 'react'
import { useForm, useWatch, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { CalendarIcon, Phone, MessageCircle, MessageSquare, MapPin, Mail, MoreHorizontal } from 'lucide-react'
import { collectionActionSchema, type CollectionActionFormData } from '@/lib/validations/collection-action'
import { createCollectionActionAction } from '@/app/dashboard/sales/[id]/collection-actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
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
import { COLLECTION_RESULTS } from '@/lib/constants'
import { cn, formatDate } from '@/lib/utils'

const TYPE_ICON_MAP: Record<string, typeof Phone> = {
  call: Phone,
  whatsapp: MessageCircle,
  sms: MessageSquare,
  visit: MapPin,
  email: Mail,
  other: MoreHorizontal,
}

const ACTION_TYPES = [
  { value: 'call', label: 'Llamada' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'sms', label: 'SMS' },
  { value: 'visit', label: 'Visita' },
  { value: 'email', label: 'Email' },
  { value: 'other', label: 'Otro' },
] as const

export function CollectionActionForm({
  saleId,
  clientId,
  onSuccess,
}: {
  saleId: string
  clientId: string
  onSuccess: () => void
}) {
  const [submitting, setSubmitting] = useState(false)

  const form = useForm<CollectionActionFormData>({
    // z.coerce fields cause type divergence; cast is safe at runtime
    resolver: zodResolver(collectionActionSchema) as Resolver<CollectionActionFormData>,
    defaultValues: {
      action_type: 'call',
      action_date: new Date().toISOString().split('T')[0],
      result: '' as CollectionActionFormData['result'],
      promised_date: '',
      promised_amount: 0,
      notes: '',
    },
  })

  const actionType = useWatch({ control: form.control, name: 'action_type' })
  const result = useWatch({ control: form.control, name: 'result' })

  const needsPromise = result === 'promised' || result === 'partial_payment'
  const TypeIcon = TYPE_ICON_MAP[actionType] ?? Phone

  async function onSubmit(values: CollectionActionFormData) {
    setSubmitting(true)
    const res = await createCollectionActionAction(saleId, clientId, values)
    if (res?.error) {
      toast.error(res.error)
      setSubmitting(false)
      return
    }
    toast.success('Gestión registrada')
    setSubmitting(false)
    onSuccess()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4" id="collection-action-form">
        <FormField
          control={form.control}
          name="action_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de gestión *</FormLabel>
              <div className="flex flex-wrap gap-2">
                {ACTION_TYPES.map((type) => {
                  const Icon = TYPE_ICON_MAP[type.value]
                  return (
                    <Button
                      key={type.value}
                      type="button"
                      variant={field.value === type.value ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => field.onChange(type.value)}
                      id={`collection-type-${type.value}`}
                    >
                      <Icon className="mr-1.5 size-4" />
                      {type.label}
                    </Button>
                  )
                })}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="action_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fecha *</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="result"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Resultado</FormLabel>
              <Select value={field.value ?? ''} onValueChange={(v) => field.onChange(v || undefined)}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el resultado" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.entries(COLLECTION_RESULTS).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {needsPromise && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="promised_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha prometida *</FormLabel>
                  <Popover>
                    <PopoverTrigger
                      render={<Button variant="outline" className={cn('w-full justify-start font-normal', !field.value && 'text-muted-foreground')} />}
                    >
                      <CalendarIcon className="mr-2 size-4" />
                      {field.value ? formatDate(field.value) : 'Selecciona una fecha'}
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
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

            <FormField
              control={form.control}
              name="promised_amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monto prometido</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} step="0.01" placeholder="0" {...field} value={field.value ?? ''} onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notas</FormLabel>
              <FormControl>
                <Textarea placeholder="¿Qué te dijo el cliente?" rows={3} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <TypeIcon className="size-4" />
          <span>Gestión por {ACTION_TYPES.find((t) => t.value === actionType)?.label.toLowerCase()}</span>
        </div>

        <Button type="submit" id="collection-action-form-submit" disabled={submitting}>
          {submitting ? 'Guardando...' : 'Guardar gestión'}
        </Button>
      </form>
    </Form>
  )
}
