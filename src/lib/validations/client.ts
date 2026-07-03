import { z } from 'zod'

export const clientSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100),
  phone: z.string().max(20).optional().or(z.literal('')),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  address: z.string().max(200).optional().or(z.literal('')),
  company: z.string().max(100).optional().or(z.literal('')),
  id_number: z.string().max(20).optional().or(z.literal('')),
  birthday: z.string().optional().or(z.literal('')),
  notes: z.string().max(500).optional().or(z.literal('')),
})

export type ClientFormData = z.infer<typeof clientSchema>
