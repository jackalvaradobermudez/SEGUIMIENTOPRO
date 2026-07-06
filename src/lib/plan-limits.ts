import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

export const FREE_PLAN_LIMITS = {
  clients: 20,
  products: 15,
  salesPerMonth: 30,
} as const

const UPGRADE_HINT = 'Actualiza a PRO en Configuración → Plan para continuar.'

type Business = { id: string; plan: string }

/** Cuenta cuántos registros más puede crear un negocio del plan gratis antes de bloquear. */
export async function checkClientLimit(
  supabase: SupabaseClient<Database>,
  business: Business,
): Promise<{ error: string } | null> {
  if (business.plan === 'pro') return null

  const { count } = await supabase
    .from('clients')
    .select('id', { count: 'exact', head: true })
    .eq('business_id', business.id)
    .is('deleted_at', null)

  if ((count ?? 0) >= FREE_PLAN_LIMITS.clients) {
    return { error: `El plan Gratis permite hasta ${FREE_PLAN_LIMITS.clients} clientes. ${UPGRADE_HINT}` }
  }
  return null
}

export async function checkProductLimit(
  supabase: SupabaseClient<Database>,
  business: Business,
): Promise<{ error: string } | null> {
  if (business.plan === 'pro') return null

  const { count } = await supabase
    .from('products')
    .select('id', { count: 'exact', head: true })
    .eq('business_id', business.id)
    .is('deleted_at', null)

  if ((count ?? 0) >= FREE_PLAN_LIMITS.products) {
    return { error: `El plan Gratis permite hasta ${FREE_PLAN_LIMITS.products} productos. ${UPGRADE_HINT}` }
  }
  return null
}

export async function checkMonthlySalesLimit(
  supabase: SupabaseClient<Database>,
  business: Business,
): Promise<{ error: string } | null> {
  if (business.plan === 'pro') return null

  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]

  const { count } = await supabase
    .from('sales')
    .select('id', { count: 'exact', head: true })
    .eq('business_id', business.id)
    .is('deleted_at', null)
    .gte('sale_date', monthStart)

  if ((count ?? 0) >= FREE_PLAN_LIMITS.salesPerMonth) {
    return { error: `El plan Gratis permite hasta ${FREE_PLAN_LIMITS.salesPerMonth} ventas al mes. ${UPGRADE_HINT}` }
  }
  return null
}
