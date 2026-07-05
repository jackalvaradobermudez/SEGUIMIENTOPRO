'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getActiveBusiness } from '@/lib/supabase/get-business'
import { whatsappTemplateSchema } from '@/lib/validations/whatsapp-template'
import { DEFAULT_TEMPLATE_MESSAGES } from '@/lib/constants'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function tbl(supabase: Awaited<ReturnType<typeof createClient>>): any {
  return supabase.from('whatsapp_templates' as never)
}

export async function getWhatsAppTemplates() {
  const business = await getActiveBusiness()
  const supabase = await createClient()

  const { data, error } = await tbl(supabase)
    .select('id, template_type, name, message_body, is_default, is_active, updated_at')
    .eq('business_id' as never, business.id)
    .is('deleted_at' as never, null)
    .order('template_type' as never)

  if (error) return { error: 'No se pudieron cargar las plantillas.' }
  return { data: data as unknown as Array<Record<string, unknown>> }
}

export async function updateWhatsAppTemplate(templateId: string, formData: FormData) {
  const business = await getActiveBusiness()
  const supabase = await createClient()

  const raw = {
    name: formData.get('name'),
    message_body: formData.get('message_body'),
  }

  const parsed = whatsappTemplateSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Datos inválidos' }
  }

  const { error } = await tbl(supabase)
    .update({
      name: parsed.data.name,
      message_body: parsed.data.message_body,
    } as never)
    .eq('id' as never, templateId)
    .eq('business_id' as never, business.id)

  if (error) return { error: 'No se pudo actualizar la plantilla. Intenta de nuevo.' }

  revalidatePath('/dashboard/settings')
  revalidatePath('/dashboard/sales')
  revalidatePath('/dashboard/collections')
  revalidatePath('/dashboard/clients')
  return { success: true }
}

export async function resetWhatsAppTemplate(templateId: string, templateType: string) {
  const business = await getActiveBusiness()
  const supabase = await createClient()

  const defaultMessage = DEFAULT_TEMPLATE_MESSAGES[templateType]
  if (!defaultMessage) return { error: 'Tipo de plantilla no reconocido.' }

  const defaultName: Record<string, string> = {
    reminder_soft: 'Recordatorio suave',
    reminder_due_day: 'Día de vencimiento',
    reminder_overdue: 'Cobro post-vencimiento',
    payment_thanks: 'Agradecimiento por pago',
    account_statement: 'Envío de estado de cuenta',
  }

  const { error } = await tbl(supabase)
    .update({
      name: defaultName[templateType] ?? templateType,
      message_body: defaultMessage,
    } as never)
    .eq('id' as never, templateId)
    .eq('business_id' as never, business.id)

  if (error) return { error: 'No se pudo restaurar la plantilla.' }

  revalidatePath('/dashboard/settings')
  return { success: true }
}

export async function getTemplateByType(templateType: string): Promise<string> {
  const business = await getActiveBusiness()
  const supabase = await createClient()

  const { data } = await tbl(supabase)
    .select('message_body')
    .eq('business_id' as never, business.id)
    .eq('template_type' as never, templateType)
    .eq('is_active' as never, true)
    .is('deleted_at' as never, null)
    .single()

  if (!data) {
    return DEFAULT_TEMPLATE_MESSAGES[templateType] ?? ''
  }

  return (data as { message_body: string }).message_body
}
