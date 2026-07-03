import { z } from 'zod'

export const productSchema = z.object({
  name: z.string().min(2, 'Mínimo 2 caracteres').max(100),
  description: z.string().max(300).optional().or(z.literal('')),
  category: z.string().max(50).optional().or(z.literal('')),
  sku: z.string().max(30).optional().or(z.literal('')),
  default_price: z.coerce.number().min(0, 'El precio no puede ser negativo'),
  cost_price: z.coerce.number().min(0).optional(),
  unit: z.string().min(1).default('unidad'),
  track_stock: z.boolean().default(false),
  stock: z.coerce.number().min(0).default(0),
  stock_minimum: z.coerce.number().min(0).default(0),
})

export type ProductFormData = z.infer<typeof productSchema>
