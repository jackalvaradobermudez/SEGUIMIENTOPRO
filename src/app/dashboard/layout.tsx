import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Sidebar from '@/components/layout/sidebar'
import Header from '@/components/layout/header'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SeguimientoPro — Dashboard',
  description: 'Gestiona tus ventas, clientes y cobros en un solo lugar',
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: business } = await supabase
    .from('businesses')
    .select('id')
    .eq('user_id', user.id)
    .is('deleted_at', null)
    .single()

  let lowStockCount = 0
  if (business) {
    const { count } = await supabase
      .from('v_low_stock_products')
      .select('*', { count: 'exact', head: true })
      .eq('business_id', business.id)
    lowStockCount = count ?? 0
  }

  return (
    <div className="dashboard-root">
      <Sidebar lowStockCount={lowStockCount} />
      <div className="dashboard-main">
        <Header />
        <main className="dashboard-content" id="main-content" role="main">
          {children}
        </main>
      </div>
    </div>
  )
}
