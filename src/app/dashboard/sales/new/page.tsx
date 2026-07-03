import { createClient } from '@/lib/supabase/server'
import { getActiveBusiness } from '@/lib/supabase/get-business'
import { SaleForm } from '@/components/forms/sale-form'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Nueva venta — SeguimientoPro',
}

export default async function NewSalePage() {
  const business = await getActiveBusiness()
  const supabase = await createClient()

  const { data: clients } = await supabase
    .from('clients')
    .select('id, name, phone')
    .eq('business_id', business.id)
    .is('deleted_at', null)
    .order('name', { ascending: true })

  const { data: products } = await supabase
    .from('products')
    .select('id, name, default_price')
    .eq('business_id', business.id)
    .eq('is_active', true)
    .is('deleted_at', null)
    .order('name', { ascending: true })

  return (
    <div className="dashboard-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Nueva venta</h1>
          <p className="page-subtitle">Registra una venta de contado o a crédito</p>
        </div>
      </div>

      <div className="max-w-2xl">
        <SaleForm clients={clients ?? []} products={products ?? []} currency={business.currency} />
      </div>
    </div>
  )
}
