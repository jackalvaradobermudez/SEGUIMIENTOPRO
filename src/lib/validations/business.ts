import { z } from 'zod'

export const businessSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100),
  description: z.string().max(300).optional().or(z.literal('')),
  currency: z.string().min(1, 'Selecciona una moneda').max(10),
  timezone: z.string().min(1, 'Selecciona la zona horaria'),
})

export type BusinessFormData = z.infer<typeof businessSchema>
