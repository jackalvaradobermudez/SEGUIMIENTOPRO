import { z } from 'zod'

export const saleItemSchema = z.object({
  product_id: z.string().uuid().optional(),
  description: z.string().min(1, 'Descripción requerida'),
  quantity: z.coerce.number().min(0.01, 'Cantidad debe ser mayor a 0'),
  unit_price: z.coerce.number().min(0, 'Precio no puede ser negativo'),
})

export const saleSchema = z
  .object({
    client_id: z.string().uuid('Selecciona un cliente'),
    sale_type: z.enum(['cash', 'credit']),
    sale_date: z.string(),
    due_date: z.string().optional().or(z.literal('')),
    installments: z.coerce.number().min(1).default(1),
    discount: z.coerce.number().min(0).default(0),
    payment_method: z.enum(['cash', 'transfer', 'card', 'other']),
    notes: z.string().optional().or(z.literal('')),
    items: z.array(saleItemSchema).min(1, 'Agrega al menos un producto'),
  })
  .superRefine((data, ctx) => {
    if (data.sale_type === 'credit' && !data.due_date) {
      ctx.addIssue({
        code: 'custom',
        message: 'La fecha de vencimiento es requerida para ventas a crédito',
        path: ['due_date'],
      })
    }
  })

export type SaleItemFormData = z.infer<typeof saleItemSchema>
export type SaleFormData = z.infer<typeof saleSchema>
