'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getActiveBusiness } from '@/lib/supabase/get-business'
import { clientSchema } from '@/lib/validations/client'

function toNullable(value: string) {
  return value.trim() === '' ? null : value.trim()
}

export async function createClientAction(formData: FormData) {
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

  revalidatePath('/dashboard/clients')
  redirect('/dashboard/clients')
}
