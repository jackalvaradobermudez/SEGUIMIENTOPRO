import Link from 'next/link'
import { UserPlus } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getActiveBusiness } from '@/lib/supabase/get-business'
import { ClientsTable, type ClientRow } from '@/components/tables/clients-table'
import { ImportCsvModal } from '@/components/clients/import-csv-modal'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Clientes — SeguimientoPro',
}

export default async function ClientsPage() {
  const business = await getActiveBusiness()
  const supabase = await createClient()

  const { data: clients } = await supabase
    .from('clients')
    .select('id, name, phone')
    .eq('business_id', business.id)
    .is('deleted_at', null)
    .order('name', { ascending: true })

  const { data: sales } = await supabase
    .from('sales')
    .select('client_id, balance, status, sale_date')
    .eq('business_id', business.id)
    .is('deleted_at', null)
    .neq('status', 'cancelled')

  const rows: ClientRow[] = (clients ?? []).map((client) => {
    const clientSales = (sales ?? []).filter((s) => s.client_id === client.id)
    const pendingBalance = clientSales.reduce((sum, s) => sum + (s.balance ?? 0), 0)
    const lastSaleDate = clientSales.reduce<string | null>((latest, s) => {
      if (!latest || s.sale_date > latest) return s.sale_date
      return latest
    }, null)

    return {
      id: client.id,
      name: client.name,
      phone: client.phone,
      pendingBalance,
      lastSaleDate,
    }
  })

  return (
    <div className="dashboard-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Clientes</h1>
          <p className="page-subtitle">Gestiona tus clientes y su saldo pendiente</p>
        </div>

        <div className="header-quick-links">
          <ImportCsvModal />
          <Link href="/dashboard/clients/new" id="new-client-button" className="quick-link">
            <UserPlus size={16} />
            Nuevo cliente
          </Link>
        </div>
      </div>

      <ClientsTable clients={rows} currency={business.currency} />
    </div>
  )
}
