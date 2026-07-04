import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getActiveBusiness } from '@/lib/supabase/get-business'
import { SaleDetail } from './sale-detail'
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  return { title: `Venta ${id.slice(0, 8)} — SeguimientoPro` }
}

export default async function SaleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const business = await getActiveBusiness()
  const supabase = await createClient()

  const { data: sale } = await supabase
    .from('sales')
    .select('*')
    .eq('id', id)
    .eq('business_id', business.id)
    .is('deleted_at', null)
    .single()

  if (!sale) notFound()

  const [{ data: client }, { data: items }, { data: payments }, { data: collectionActions }] = await Promise.all([
    supabase.from('clients').select('name, phone').eq('id', sale.client_id).single(),
    supabase.from('sale_items').select('*').eq('sale_id', sale.id).order('created_at', { ascending: true }),
    supabase
      .from('payments')
      .select('id, amount, payment_date, payment_method, receipt_number')
      .eq('sale_id', sale.id)
      .is('deleted_at', null)
      .order('payment_date', { ascending: false }),
    supabase
      .from('collection_actions')
      .select('*')
      .eq('sale_id', sale.id)
      .order('action_date', { ascending: false }),
  ])

  return (
    <SaleDetail
      sale={sale}
      clientName={client?.name ?? 'Cliente'}
      clientPhone={client?.phone ?? null}
      items={items ?? []}
      payments={payments ?? []}
      collectionActions={collectionActions ?? []}
      currency={business.currency}
    />
  )
}
