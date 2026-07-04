import { z } from 'zod'

export const goalSchema = z.object({
  sales_target: z.coerce.number().min(0, 'La meta de ventas no puede ser negativa'),
  collection_target: z.coerce.number().min(0, 'La meta de recaudo no puede ser negativa'),
})

export type GoalFormData = z.infer<typeof goalSchema>
