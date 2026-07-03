import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getActiveBusiness } from '@/lib/supabase/get-business'
import { ClientDetail } from './client-detail'
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const business = await getActiveBusiness()
  const supabase = await createClient()
  const { data: client } = await supabase
    .from('clients')
    .select('name')
    .eq('id', id)
    .eq('business_id', business.id)
    .single()

  return { title: client ? `${client.name} — SeguimientoPro` : 'Cliente — SeguimientoPro' }
}

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const business = await getActiveBusiness()
  const supabase = await createClient()

  const { data: client } = await supabase
    .from('clients')
    .select('*')
    .eq('id', id)
    .eq('business_id', business.id)
    .is('deleted_at', null)
    .single()

  if (!client) notFound()

  const { data: sales } = await supabase
    .from('sales')
    .select('id, sale_number, sale_date, total_amount, paid_amount, balance, status')
    .eq('client_id', client.id)
    .eq('business_id', business.id)
    .is('deleted_at', null)
    .order('sale_date', { ascending: false })

  const totalDebt = (sales ?? [])
    .filter((s) => s.status !== 'cancelled')
    .reduce((sum, s) => sum + s.balance, 0)

  return (
    <ClientDetail client={client} sales={sales ?? []} totalDebt={totalDebt} currency={business.currency} />
  )
}
