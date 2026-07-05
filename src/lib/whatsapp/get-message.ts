import { createClient } from '@/lib/supabase/server'
import { getActiveBusiness } from '@/lib/supabase/get-business'
import { interpolateTemplate, formatCurrency, formatDate, daysBetween } from '@/lib/utils'
import { DEFAULT_TEMPLATE_MESSAGES } from '@/lib/constants'

interface WhatsAppMessageContext {
  clientName: string
  saleBalance?: number
  saleDueDate?: string
  saleNumber?: string
  paymentAmount?: number
  newBalance?: number
  totalDebt?: number
  currency?: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function tbl(supabase: Awaited<ReturnType<typeof createClient>>): any {
  return supabase.from('whatsapp_templates' as never)
}

export async function getWhatsAppMessage(
  templateType: string,
  context: WhatsAppMessageContext,
): Promise<string> {
  const business = await getActiveBusiness()
  const supabase = await createClient()

  const { data } = await tbl(supabase)
    .select('message_body')
    .eq('business_id' as never, business.id)
    .eq('template_type' as never, templateType)
    .eq('is_active' as never, true)
    .is('deleted_at' as never, null)
    .single()

  const template = data?.message_body ?? DEFAULT_TEMPLATE_MESSAGES[templateType] ?? ''
  const currency = context.currency ?? business.currency ?? 'COP'

  const daysOverdue = context.saleDueDate
    ? daysBetween(context.saleDueDate, new Date().toISOString())
    : 0

  return interpolateTemplate(template, {
    nombre: context.clientName,
    monto: context.saleBalance !== undefined ? formatCurrency(context.saleBalance, currency) : '',
    monto_pagado: context.paymentAmount !== undefined ? formatCurrency(context.paymentAmount, currency) : '',
    saldo_pendiente: context.newBalance !== undefined ? formatCurrency(context.newBalance, currency) : '',
    saldo_total: context.totalDebt !== undefined ? formatCurrency(context.totalDebt, currency) : '',
    fecha_vencimiento: context.saleDueDate ? formatDate(context.saleDueDate) : '',
    numero_venta: context.saleNumber ?? '',
    dias_vencido: String(daysOverdue),
    nombre_negocio: business.name,
  })
}
