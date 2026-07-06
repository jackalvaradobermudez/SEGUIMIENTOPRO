import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getActiveBusiness } from '@/lib/supabase/get-business'
import Sidebar from '@/components/layout/sidebar'
import Header from '@/components/layout/header'
import { SidebarProvider } from '@/components/layout/sidebar-provider'
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

  const business = await getActiveBusiness()

  return (
    <SidebarProvider>
      <Sidebar plan={business.plan} planExpiresAt={business.plan_expires_at} />
      <div className="dashboard-main">
        <Header user={user} />
        <main className="dashboard-content" id="main-content" role="main">
          {children}
        </main>
      </div>
    </SidebarProvider>
  )
}
