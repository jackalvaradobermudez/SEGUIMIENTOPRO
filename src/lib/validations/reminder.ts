import { z } from 'zod'

export const reminderSchema = z.object({
  reminder_type: z.enum(['birthday', 'collection', 'follow_up', 'meeting', 'custom']),
  title: z.string().min(2, 'El título debe tener al menos 2 caracteres').max(100),
  description: z.string().max(300).optional().or(z.literal('')),
  remind_at: z.string().min(1, 'La fecha es obligatoria'),
  client_id: z.string().uuid().optional().or(z.literal('')),
  sale_id: z.string().uuid().optional().or(z.literal('')),
})

export type ReminderFormData = z.infer<typeof reminderSchema>
