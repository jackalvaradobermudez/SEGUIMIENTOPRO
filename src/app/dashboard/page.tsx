import Link from 'next/link'
import { Users } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getActiveBusiness } from '@/lib/supabase/get-business'
import { KpiCards } from '@/components/dashboard/kpi-cards'
import { UpcomingCollections } from '@/components/dashboard/upcoming-collections'
import { RecentSales, type RecentSale } from '@/components/dashboard/recent-sales'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard — SeguimientoPro',
  description: 'Resumen de tu cartera, ventas y cobros',
}

export default async function DashboardPage() {
  const business = await getActiveBusiness()
  const supabase = await createClient()

  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]

  const [
    { data: portfolio },
    { data: monthSales },
    { data: monthPayments },
    { data: upcomingCollections },
    { data: recentSalesRaw },
  ] = await Promise.all([
    supabase.from('v_portfolio_summary').select('*').eq('business_id', business.id).single(),
    supabase
      .from('sales')
      .select('total_amount')
      .eq('business_id', business.id)
      .gte('sale_date', monthStart)
      .is('deleted_at', null)
      .neq('status', 'cancelled'),
    supabase
      .from('payments')
      .select('amount')
      .eq('business_id', business.id)
      .gte('payment_date', monthStart)
      .is('deleted_at', null),
    supabase
      .from('v_upcoming_collections')
      .select('*')
      .eq('business_id', business.id)
      .order('due_date', { ascending: true }),
    supabase
      .from('sales')
      .select('id, sale_number, sale_date, total_amount, status, client_id')
      .eq('business_id', business.id)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  const monthTotal = (monthSales ?? []).reduce((sum, s) => sum + s.total_amount, 0)
  const monthCollected = (monthPayments ?? []).reduce((sum, p) => sum + p.amount, 0)

  const clientIds = Array.from(new Set((recentSalesRaw ?? []).map((s) => s.client_id)))
  const { data: recentClients } = clientIds.length
    ? await supabase.from('clients').select('id, name').in('id', clientIds)
    : { data: [] }
  const clientNameById = new Map((recentClients ?? []).map((c) => [c.id, c.name]))

  const recentSales: RecentSale[] = (recentSalesRaw ?? []).map((sale) => ({
    id: sale.id,
    sale_number: sale.sale_number,
    sale_date: sale.sale_date,
    total_amount: sale.total_amount,
    status: sale.status,
    clientName: clientNameById.get(sale.client_id) ?? '—',
  }))

  return (
    <div className="dashboard-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">
            {now.toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="header-quick-links">
          <Link href="/dashboard/clients/new" className="quick-link" id="dash-new-client">
            <Users size={16} />
            Nuevo cliente
          </Link>
        </div>
      </div>

      <KpiCards
        data={{
          pendingBalance: portfolio?.total_pending ?? 0,
          clientsWithDebt: portfolio?.clients_with_debt ?? 0,
          overdueBalance: portfolio?.total_overdue ?? 0,
          monthTotal,
          monthSalesCount: monthSales?.length ?? 0,
          monthCollected,
        }}
        currency={business.currency}
      />

      <div className="section-header">
        <h2 className="section-title">Próximos cobros (7 días)</h2>
        <Link href="/dashboard/collections" className="section-link" id="dash-see-all-collections">
          Ver todos →
        </Link>
      </div>

      <div className="mb-10">
        <UpcomingCollections collections={upcomingCollections ?? []} currency={business.currency} />
      </div>

      <div className="section-header">
        <h2 className="section-title">Ventas recientes</h2>
        <Link href="/dashboard/sales" className="section-link" id="dash-see-all-sales">
          Ver todas →
        </Link>
      </div>

      <RecentSales sales={recentSales} currency={business.currency} />
    </div>
  )
}
