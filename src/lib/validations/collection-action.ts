import { z } from 'zod'

export const collectionActionSchema = z
  .object({
    action_type: z.enum(['call', 'whatsapp', 'sms', 'visit', 'email', 'other']),
    action_date: z.string().min(1, 'La fecha es obligatoria'),
    result: z
      .enum(['promised', 'paid', 'no_answer', 'refused', 'rescheduled', 'partial_payment', 'other'])
      .optional(),
    promised_date: z.string().optional().or(z.literal('')),
    promised_amount: z.coerce.number().min(0).optional(),
    notes: z.string().max(500).optional().or(z.literal('')),
  })
  .refine(
    (data) => {
      if ((data.result === 'promised' || data.result === 'partial_payment') && !data.promised_date) {
        return false
      }
      return true
    },
    { message: 'Si el cliente prometió pagar, indica la fecha prometida', path: ['promised_date'] },
  )

export type CollectionActionFormData = z.infer<typeof collectionActionSchema>
