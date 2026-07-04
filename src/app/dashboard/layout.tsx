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

  return (
    <div className="dashboard-root">
      <Sidebar />
      <div className="dashboard-main">
        <Header />
        <main className="dashboard-content" id="main-content" role="main">
          {children}
        </main>
      </div>
    </div>
  )
}
