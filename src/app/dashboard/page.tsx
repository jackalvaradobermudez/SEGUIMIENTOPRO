import Link from 'next/link'
import { Users } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getActiveBusiness } from '@/lib/supabase/get-business'
import { KpiCards, type KpiData } from '@/components/dashboard/kpi-cards'
import { CriticalAlerts } from '@/components/dashboard/critical-alerts'
import { CollectionFocus } from '@/components/dashboard/collection-focus'
import { PortfolioHealth } from '@/components/dashboard/portfolio-health'
import { MonthlyProgress } from '@/components/dashboard/monthly-progress'
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
  const todayISO = now.toISOString().split('T')[0]
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
  const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().split('T')[0]
  const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]

  const [
    { data: portfolio },
    { data: monthSales },
    { data: monthPayments },
    { data: prevMonthSales },
    { data: prevMonthPayments },
    { data: upcomingCollections },
    { data: recentSalesRaw },
    { data: todayPayments },
    { data: todayDueRaw },
    { data: brokenPromiseActions },
    { data: overdueWithoutAction },
    { data: goals },
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
      .from('sales')
      .select('total_amount')
      .eq('business_id', business.id)
      .gte('sale_date', prevMonthStart)
      .lt('sale_date', prevMonthEnd)
      .is('deleted_at', null)
      .neq('status', 'cancelled'),
    supabase
      .from('payments')
      .select('amount')
      .eq('business_id', business.id)
      .gte('payment_date', prevMonthStart)
      .lt('payment_date', prevMonthEnd)
      .is('deleted_at', null),
    supabase
      .from('v_upcoming_collections')
      .select('*')
      .eq('business_id', business.id)
      .order('due_date', { ascending: true })
      .limit(10),
    supabase
      .from('sales')
      .select('id, sale_number, sale_date, total_amount, status, client_id')
      .eq('business_id', business.id)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('payments')
      .select('amount')
      .eq('business_id', business.id)
      .eq('payment_date', todayISO)
      .is('deleted_at', null),
    supabase
      .from('sales')
      .select('id, balance, client_id')
      .eq('business_id', business.id)
      .eq('due_date', todayISO)
      .gt('balance', 0)
      .is('deleted_at', null)
      .in('status', ['pending', 'partial', 'overdue']),
    supabase
      .from('collection_actions')
      .select('sale_id')
      .eq('business_id', business.id)
      .eq('result', 'promised')
      .lte('promised_date', todayISO),
    // Cartera vencida > 60 días sin gestión reciente
    supabase
      .from('sales')
      .select('id, balance, client_id')
      .eq('business_id', business.id)
      .eq('status', 'overdue')
      .gt('balance', 0)
      .is('deleted_at', null)
      .order('balance', { ascending: false }),
    supabase
      .from('goals')
      .select('*')
      .eq('business_id', business.id)
      .eq('period_year', now.getFullYear())
      .eq('period_month', now.getMonth() + 1)
      .single(),
  ])

  // RPC not yet in generated types; query directly for clients with recent actions
  const { data: recentActions } = await supabase
    .from('collection_actions')
    .select('client_id')
    .eq('business_id', business.id)
    .gte('action_date', new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
  const recentActionClientCount = new Set((recentActions ?? []).map((a) => a.client_id)).size

  // KPI data
  const monthTotal = (monthSales ?? []).reduce((sum, s) => sum + s.total_amount, 0)
  const monthCollected = (monthPayments ?? []).reduce((sum, p) => sum + p.amount, 0)
  const prevMonthTotal = (prevMonthSales ?? []).reduce((sum, s) => sum + s.total_amount, 0)
  const prevMonthCollected = (prevMonthPayments ?? []).reduce((sum, p) => sum + p.amount, 0)
  const pendingBalance = portfolio?.total_pending ?? 0
  const overdueBalance = portfolio?.total_overdue ?? 0
  const overduePercentage = pendingBalance > 0 ? Math.round((overdueBalance / pendingBalance) * 100) : 0

  // Avg collection days approximation
  const avgCollectionDays = portfolio?.clients_with_debt
    ? Math.round(((portfolio?.open_sales ?? 0) > 0 ? 30 : 0))
    : 0

  const kpiData: KpiData = {
    pendingBalance,
    clientsWithDebt: portfolio?.clients_with_debt ?? 0,
    overdueBalance,
    monthTotal,
    monthSalesCount: monthSales?.length ?? 0,
    monthCollected,
    prevMonthTotal,
    prevMonthCollected,
    overduePercentage,
    avgCollectionDays,
  }

  // Alert data
  const brokenSaleIds = new Set((brokenPromiseActions ?? []).map((a) => a.sale_id))
  // Filter to only those with balance > 0
  let brokenCount = 0
  if (brokenSaleIds.size > 0) {
    const { count } = await supabase
      .from('sales')
      .select('id', { count: 'exact', head: true })
      .in('id', Array.from(brokenSaleIds))
      .gt('balance', 0)
      .is('deleted_at', null)
    brokenCount = count ?? 0
  }

  // balance es GENERATED en el schema — nullable en el tipo TS aunque siempre tiene valor en DB
  const todayDueCount = todayDueRaw?.length ?? 0
  const todayDueAmount = (todayDueRaw ?? []).reduce((sum, s) => sum + (s.balance ?? 0), 0)
  const todayPaymentsCount = todayPayments?.length ?? 0
  const todayPaymentsAmount = (todayPayments ?? []).reduce((sum, p) => sum + p.amount, 0)

  // Focus data
  const brokenClientIds = Array.from(brokenSaleIds)
  let brokenFocus: Array<{ saleId: string; clientId: string; clientName: string; balance: number }> = []
  if (brokenClientIds.length > 0) {
    const { data: brokenSales } = await supabase
      .from('sales')
      .select('id, balance, client_id')
      .in('id', brokenClientIds)
      .gt('balance', 0)
      .is('deleted_at', null)
      .limit(5)
    brokenFocus = (brokenSales ?? []).map((s) => ({
      saleId: s.id,
      clientId: s.client_id,
      clientName: '',
      balance: s.balance ?? 0,
    }))
  }

  let overdueFocus = (overdueWithoutAction ?? []).slice(0, 5).map((s) => ({
    saleId: s.id,
    clientId: s.client_id,
    clientName: '',
    balance: s.balance ?? 0,
  }))

  let dueTodayFocus = (todayDueRaw ?? []).slice(0, 5).map((s) => ({
    saleId: s.id,
    clientId: s.client_id,
    clientName: '',
    balance: s.balance ?? 0,
  }))

  // Resolve client names for focus and recent sales
  const allFocusIds = new Set<string>()
  for (const f of [...brokenFocus, ...overdueFocus, ...dueTodayFocus]) allFocusIds.add(f.clientId)
  const allRecentClientIds = new Set((recentSalesRaw ?? []).map((s) => s.client_id))
  for (const id of allRecentClientIds) allFocusIds.add(id)

  let recentSalesForView: RecentSale[] = []

  if (allFocusIds.size > 0) {
    const { data: clients } = await supabase
      .from('clients')
      .select('id, name')
      .in('id', Array.from(allFocusIds))
    const clientMap = new Map((clients ?? []).map((c) => [c.id, c.name]))

    brokenFocus = brokenFocus.map((f) => ({ ...f, clientName: clientMap.get(f.clientId) ?? '—' }))
    overdueFocus = overdueFocus.map((f) => ({ ...f, clientName: clientMap.get(f.clientId) ?? '—' }))
    dueTodayFocus = dueTodayFocus.map((f) => ({ ...f, clientName: clientMap.get(f.clientId) ?? '—' }))

    recentSalesForView = (recentSalesRaw ?? []).map((sale) => ({
      id: sale.id,
      sale_number: sale.sale_number,
      sale_date: sale.sale_date,
      total_amount: sale.total_amount,
      status: sale.status,
      clientName: clientMap.get(sale.client_id) ?? '—',
    }))
  }

  // Health data
  const healthData = {
    totalCurrent: pendingBalance - overdueBalance,
    totalPending: pendingBalance,
    avgCollectionDays,
    clientsWithRecentAction: recentActionClientCount,
    clientsWithDebt: portfolio?.clients_with_debt ?? 0,
  }

  // salesTarget/collectionTarget son nullable en DB (metas opcionales)
  const goalData = goals
    ? {
        salesTarget: goals.sales_target ?? 0,
        collectionTarget: goals.collection_target ?? 0,
        currentSales: monthTotal,
        currentCollected: monthCollected,
      }
    : null

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

      <CriticalAlerts
        data={{
          brokenPromisesCount: brokenCount,
          todayDueCount,
          todayDueAmount,
          todayPaymentsCount,
          todayPaymentsAmount,
        }}
        currency={business.currency}
      />

      <KpiCards data={kpiData} currency={business.currency} />

      <div className="mt-8 mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <CollectionFocus
          data={{
            broken: brokenFocus,
            overdue60: overdueFocus,
            dueToday: dueTodayFocus,
          }}
          currency={business.currency}
        />

        <div className="flex flex-col gap-6">
          <PortfolioHealth data={healthData} />
          <MonthlyProgress data={goalData} currency={business.currency} />
        </div>
      </div>

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

      <RecentSales sales={recentSalesForView} currency={business.currency} />
    </div>
  )
}
