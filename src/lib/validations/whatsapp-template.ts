import { z } from 'zod'

export const whatsappTemplateSchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no debe exceder 50 caracteres'),
  message_body: z
    .string()
    .min(10, 'El mensaje debe tener al menos 10 caracteres')
    .max(500, 'El mensaje no debe exceder 500 caracteres (límite de WhatsApp)'),
})

export type WhatsAppTemplateFormData = z.infer<typeof whatsappTemplateSchema>

export const TEMPLATE_VARIABLES = {
  nombre: 'Nombre del cliente',
  monto: 'Saldo pendiente de la venta (formateado con moneda)',
  monto_pagado: 'Monto del último pago registrado',
  saldo_pendiente: 'Saldo restante después del pago',
  saldo_total: 'Deuda total del cliente (todas las ventas)',
  fecha_vencimiento: 'Fecha de vencimiento de la venta',
  numero_venta: 'Número de la venta (#001, #002...)',
  dias_vencido: 'Días transcurridos desde el vencimiento',
  nombre_negocio: 'Nombre del negocio del emprendedor',
} as const

export type TemplateVariable = keyof typeof TEMPLATE_VARIABLES
