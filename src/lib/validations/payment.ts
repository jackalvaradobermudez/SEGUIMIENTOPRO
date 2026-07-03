import { z } from 'zod'

export const paymentSchema = z.object({
  amount: z.coerce.number().min(0.01, 'El monto debe ser mayor a 0'),
  payment_date: z.string(),
  payment_method: z.enum(['cash', 'transfer', 'card', 'other']),
  receipt_number: z.string().max(50).optional().or(z.literal('')),
  notes: z.string().max(200).optional().or(z.literal('')),
})

export type PaymentFormData = z.infer<typeof paymentSchema>
