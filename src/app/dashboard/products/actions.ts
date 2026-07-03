'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getActiveBusiness } from '@/lib/supabase/get-business'
import { productSchema } from '@/lib/validations/product'

function toNullable(value: string) {
  return value.trim() === '' ? null : value.trim()
}

function parseProductForm(formData: FormData) {
  return productSchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
    category: formData.get('category'),
    sku: formData.get('sku'),
    default_price: formData.get('default_price'),
    cost_price: formData.get('cost_price') || undefined,
    unit: formData.get('unit'),
    track_stock: formData.get('track_stock') === 'true',
    stock: formData.get('stock'),
    stock_minimum: formData.get('stock_minimum'),
  })
}

export async function createProductAction(formData: FormData) {
  const business = await getActiveBusiness()
  const supabase = await createClient()

  const parsed = parseProductForm(formData)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Datos inválidos' }
  }

  const { data } = parsed

  const { error } = await supabase.from('products').insert({
    business_id: business.id,
    name: data.name,
    description: toNullable(data.description ?? ''),
    category: toNullable(data.category ?? ''),
    sku: toNullable(data.sku ?? ''),
    default_price: data.default_price,
    cost_price: data.cost_price ?? null,
    unit: data.unit,
    track_stock: data.track_stock,
    stock: data.stock,
    stock_minimum: data.stock_minimum,
    is_active: true,
    deleted_at: null,
  })

  if (error) {
    return { error: 'No se pudo crear el producto. Intenta de nuevo.' }
  }

  revalidatePath('/dashboard/products')
  redirect('/dashboard/products')
}

export async function updateProductAction(productId: string, formData: FormData) {
  const business = await getActiveBusiness()
  const supabase = await createClient()

  const parsed = parseProductForm(formData)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Datos inválidos' }
  }

  const { data } = parsed

  const { error } = await supabase
    .from('products')
    .update({
      name: data.name,
      description: toNullable(data.description ?? ''),
      category: toNullable(data.category ?? ''),
      sku: toNullable(data.sku ?? ''),
      default_price: data.default_price,
      cost_price: data.cost_price ?? null,
      unit: data.unit,
      track_stock: data.track_stock,
      stock: data.stock,
      stock_minimum: data.stock_minimum,
    })
    .eq('id', productId)
    .eq('business_id', business.id)

  if (error) {
    return { error: 'No se pudo actualizar el producto. Intenta de nuevo.' }
  }

  revalidatePath('/dashboard/products')
  redirect('/dashboard/products')
}

export async function toggleProductActiveAction(productId: string, isActive: boolean) {
  const business = await getActiveBusiness()
  const supabase = await createClient()

  const { error } = await supabase
    .from('products')
    .update({ is_active: isActive })
    .eq('id', productId)
    .eq('business_id', business.id)

  if (error) {
    return { error: 'No se pudo actualizar el estado del producto.' }
  }

  revalidatePath('/dashboard/products')
  return { success: true }
}

export async function deleteProductAction(productId: string) {
  const business = await getActiveBusiness()
  const supabase = await createClient()

  const { error } = await supabase
    .from('products')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', productId)
    .eq('business_id', business.id)

  if (error) {
    return { error: 'No se pudo eliminar el producto. Intenta de nuevo.' }
  }

  revalidatePath('/dashboard/products')
  return { success: true }
}
