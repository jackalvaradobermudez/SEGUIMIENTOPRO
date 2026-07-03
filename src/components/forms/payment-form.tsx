'use client'

import { useState } from 'react'
import { useForm, useWatch, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { AlertTriangle } from 'lucide-react'
import { paymentSchema, type PaymentFormData } from '@/lib/validations/payment'
import { registerPaymentAction } from '@/app/dashboard/sales/[id]/payment-actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
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
import { PAYMENT_METHOD_OPTIONS } from '@/lib/constants'
import { formatCurrency } from '@/lib/utils'

export function PaymentForm({
  saleId,
  pendingBalance,
  currency,
  onSuccess,
}: {
  saleId: string
  pendingBalance: number
  currency: string
  onSuccess: () => void
}) {
  const [submitting, setSubmitting] = useState(false)

  const form = useForm<PaymentFormData>({
    // z.coerce fields make the resolver's input type diverge from PaymentFormData; cast is safe at runtime.
    resolver: zodResolver(paymentSchema) as Resolver<PaymentFormData>,
    defaultValues: {
      amount: pendingBalance > 0 ? pendingBalance : 0,
      payment_date: new Date().toISOString().split('T')[0],
      payment_method: 'cash',
      receipt_number: '',
      notes: '',
    },
  })

  const amount = useWatch({ control: form.control, name: 'amount' })
  const exceedsBalance = Number(amount) > pendingBalance

  async function onSubmit(values: PaymentFormData) {
    setSubmitting(true)
    const result = await registerPaymentAction(saleId, values)

    if (result?.error) {
      toast.error(result.error)
      setSubmitting(false)
      return
    }

    toast.success('Abono registrado')
    setSubmitting(false)
    onSuccess()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4" id="payment-form">
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Monto *</FormLabel>
              <FormControl>
                <Input type="number" min={0.01} step="0.01" {...field} />
              </FormControl>
              <p className="text-xs text-muted-foreground">
                Saldo pendiente: {formatCurrency(pendingBalance, currency)}
              </p>
              {exceedsBalance && (
                <p className="flex items-center gap-1.5 text-xs font-medium text-[var(--warning)]">
                  <AlertTriangle className="size-3.5" />
                  El monto excede el saldo pendiente
                </p>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="payment_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fecha</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="payment_method"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Método de pago</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {PAYMENT_METHOD_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="receipt_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número de recibo</FormLabel>
              <FormControl>
                <Input placeholder="Opcional" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notas</FormLabel>
              <FormControl>
                <Textarea placeholder="Notas del abono" rows={2} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" id="payment-form-submit" disabled={submitting} className="w-full">
          {submitting ? 'Registrando...' : 'Registrar abono'}
        </Button>
      </form>
    </Form>
  )
}
