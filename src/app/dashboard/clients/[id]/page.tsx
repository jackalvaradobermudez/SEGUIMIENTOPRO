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
    .select(
      'id, business_id, name, phone, email, address, company, id_number, birthday, notes, tags, created_at, updated_at, deleted_at'
    )
    .eq('id', id)
    .eq('business_id', business.id)
    .is('deleted_at', null)
    .single()

  if (!client) notFound()

  const sales = await supabase
    .from('sales')
    .select('id, sale_number, sale_date, due_date, total_amount, paid_amount, balance, status')
    .eq('client_id', client.id)
    .eq('business_id', business.id)
    .is('deleted_at', null)
    .order('sale_date', { ascending: false })
    .then(({ data }) => data ?? [])

  const saleIds = sales.map((s) => s.id)

  const [{ data: payments }, { data: collectionActions }, { data: reminders }] =
    await Promise.all([
      supabase
        .from('payments')
        .select('id, sale_id, amount, payment_date, payment_method, receipt_number')
        .eq('business_id', business.id)
        .in('sale_id', saleIds.length > 0 ? saleIds : ['00000000-0000-0000-0000-000000000000'])
        .is('deleted_at', null)
        .order('payment_date', { ascending: false }),
      supabase
        .from('collection_actions')
        .select('*')
        .eq('client_id', client.id)
        .eq('business_id', business.id)
        .order('action_date', { ascending: false }),
      supabase
        .from('reminders')
        .select('*')
        .eq('business_id', business.id)
        .eq('client_id', client.id)
        .order('remind_at', { ascending: false }),
    ])

  // Total debt: excluye canceladas, suma balances (nullable por columna GENERATED)
  const totalDebt = sales
    .filter((s) => s.status !== 'cancelled')
    .reduce((sum, s) => sum + (s.balance ?? 0), 0)

  const completedSales = sales.filter((s) => s.status === 'paid' || s.status === 'partial')

  let onTimePaymentsRatio = 1
  if (completedSales.length > 0) {
    let onTimeCount = 0
    for (const sale of completedSales) {
      if (sale.due_date) {
        const lastPayment = (payments ?? [])
          .filter((p) => p.sale_id === sale.id)
          .sort((a, b) => b.payment_date.localeCompare(a.payment_date))[0]
        if (lastPayment && lastPayment.payment_date <= sale.due_date) {
          onTimeCount++
        }
      }
    }
    onTimePaymentsRatio = onTimeCount / completedSales.length
  }

  let avgPaymentDays = 0
  if (completedSales.length > 0) {
    let totalDays = 0
    let count = 0
    for (const sale of completedSales) {
      const paymentsForSale = (payments ?? []).filter((p) => p.sale_id === sale.id)
      if (paymentsForSale.length > 0 && sale.due_date) {
        const lastPayment = paymentsForSale.sort((a, b) =>
          b.payment_date.localeCompare(a.payment_date),
        )[0]
        const days = Math.ceil(
          (new Date(lastPayment.payment_date).getTime() -
            new Date(sale.due_date).getTime()) /
            (1000 * 60 * 60 * 24),
        )
        totalDays += Math.max(days, 0)
        count++
      }
    }
    if (count > 0) avgPaymentDays = Math.round(totalDays / count)
  }

  const MS_PER_DAY = 1000 * 60 * 60 * 24 // milliseconds per day
  const lastSale = sales[0]
  const daysSinceLastSale = lastSale
    ? Math.floor(
        (new Date().getTime() - new Date(lastSale.sale_date).getTime()) /
          MS_PER_DAY,
      )
    : 0

  const totalPurchased = sales.reduce((sum, s) => sum + s.total_amount, 0)

  return (
    <ClientDetail
      client={client}
      sales={sales}
      payments={payments ?? []}
      collectionActions={collectionActions ?? []}
      reminders={reminders ?? []}
      totalDebt={totalDebt}
      totalPurchased={totalPurchased}
      onTimePaymentsRatio={onTimePaymentsRatio}
      avgPaymentDays={avgPaymentDays}
      daysSinceLastSale={daysSinceLastSale}
      currency={business.currency}
      businessName={business.name}
    />
  )
}