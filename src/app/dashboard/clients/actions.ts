'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getActiveBusiness } from '@/lib/supabase/get-business'
import { clientSchema } from '@/lib/validations/client'
import { checkClientLimit, FREE_PLAN_LIMITS } from '@/lib/plan-limits'

function toNullable(value: string) {
  return value.trim() === '' ? null : value.trim()
}

export async function createClientAction(formData: FormData) {
  const business = await getActiveBusiness()
  const supabase = await createClient()

  const limitError = await checkClientLimit(supabase, business)
  if (limitError) return limitError

  const parsed = clientSchema.safeParse({
    name: formData.get('name'),
    phone: formData.get('phone'),
    email: formData.get('email'),
    address: formData.get('address'),
    company: formData.get('company'),
    id_number: formData.get('id_number'),
    birthday: formData.get('birthday'),
    notes: formData.get('notes'),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Datos inválidos' }
  }

  const { data } = parsed

  const { error } = await supabase.from('clients').insert({
    business_id: business.id,
    name: data.name,
    phone: toNullable(data.phone ?? ''),
    email: toNullable(data.email ?? ''),
    address: toNullable(data.address ?? ''),
    company: toNullable(data.company ?? ''),
    id_number: toNullable(data.id_number ?? ''),
    birthday: toNullable(data.birthday ?? ''),
    notes: toNullable(data.notes ?? ''),
    tags: null,
    deleted_at: null,
  })

  if (error) {
    return { error: 'No se pudo crear el cliente. Intenta de nuevo.' }
  }

  revalidatePath('/dashboard/clients')
  redirect('/dashboard/clients')
}

export async function updateClientAction(clientId: string, formData: FormData) {
  const business = await getActiveBusiness()
  const supabase = await createClient()

  const parsed = clientSchema.safeParse({
    name: formData.get('name'),
    phone: formData.get('phone'),
    email: formData.get('email'),
    address: formData.get('address'),
    company: formData.get('company'),
    id_number: formData.get('id_number'),
    birthday: formData.get('birthday'),
    notes: formData.get('notes'),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Datos inválidos' }
  }

  const { data } = parsed

  const { error } = await supabase
    .from('clients')
    .update({
      name: data.name,
      phone: toNullable(data.phone ?? ''),
      email: toNullable(data.email ?? ''),
      address: toNullable(data.address ?? ''),
      company: toNullable(data.company ?? ''),
      id_number: toNullable(data.id_number ?? ''),
      birthday: toNullable(data.birthday ?? ''),
      notes: toNullable(data.notes ?? ''),
    })
    .eq('id', clientId)
    .eq('business_id', business.id)

  if (error) {
    return { error: 'No se pudo actualizar el cliente. Intenta de nuevo.' }
  }

  revalidatePath('/dashboard/clients')
  revalidatePath(`/dashboard/clients/${clientId}`)
  redirect(`/dashboard/clients/${clientId}`)
}

export async function deleteClientAction(clientId: string) {
  const business = await getActiveBusiness()
  const supabase = await createClient()

  const { error } = await supabase
    .from('clients')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', clientId)
    .eq('business_id', business.id)

  if (error) {
    return { error: 'No se pudo eliminar el cliente. Intenta de nuevo.' }
  }

  // La redirección la maneja el componente cliente (handleDelete → router.push)
  revalidatePath('/dashboard/clients')
  return { success: true }
}

export async function bulkCreateClientsAction(clients: Array<{
  name: string
  phone?: string | null
  email?: string | null
  address?: string | null
  company?: string | null
  id_number?: string | null
  birthday?: string | null
  notes?: string | null
}>) {
  const business = await getActiveBusiness()
  const supabase = await createClient()

  if (business.plan !== 'pro') {
    const { count } = await supabase
      .from('clients')
      .select('id', { count: 'exact', head: true })
      .eq('business_id', business.id)
      .is('deleted_at', null)

    if ((count ?? 0) + clients.length > FREE_PLAN_LIMITS.clients) {
      const remaining = Math.max(FREE_PLAN_LIMITS.clients - (count ?? 0), 0)
      return {
        error: `El plan Gratis permite hasta ${FREE_PLAN_LIMITS.clients} clientes. Te quedan ${remaining} disponibles — actualiza a PRO en Configuración → Plan para importar sin límite.`,
      }
    }
  }

  // Mapeamos los clientes para insertarlos en Supabase
  const rows = clients.map((client) => ({
    business_id: business.id,
    name: client.name,
    phone: client.phone ? client.phone.trim() : null,
    email: client.email ? client.email.trim() : null,
    address: client.address ? client.address.trim() : null,
    company: client.company ? client.company.trim() : null,
    id_number: client.id_number ? client.id_number.trim() : null,
    birthday: client.birthday ? client.birthday.trim() : null,
    notes: client.notes ? client.notes.trim() : null,
    tags: null,
    deleted_at: null,
  }))

  const { error } = await supabase.from('clients').insert(rows)

  if (error) {
    console.error('Error inserting clients:', error)
    return { error: 'Ocurrió un error al guardar los clientes en la base de datos.' }
  }

  revalidatePath('/dashboard/clients')
  return { success: true, count: rows.length }
}
