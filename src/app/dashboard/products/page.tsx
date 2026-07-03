import Link from 'next/link'
import { PackagePlus } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getActiveBusiness } from '@/lib/supabase/get-business'
import { ProductsTable } from '@/components/tables/products-table'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Productos — SeguimientoPro',
}

export default async function ProductsPage() {
  const business = await getActiveBusiness()
  const supabase = await createClient()

  const { data: products } = await supabase
    .from('products')
    .select('id, name, category, default_price, cost_price, stock, stock_minimum, track_stock, is_active')
    .eq('business_id', business.id)
    .is('deleted_at', null)
    .order('name', { ascending: true })

  return (
    <div className="dashboard-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Productos</h1>
          <p className="page-subtitle">Gestiona tu catálogo de productos y servicios</p>
        </div>

        <Link href="/dashboard/products/new" id="new-product-button" className="quick-link">
          <PackagePlus size={16} />
          Nuevo producto
        </Link>
      </div>

      <ProductsTable products={products ?? []} currency={business.currency} />
    </div>
  )
}
