import Link from 'next/link'
import { PackagePlus } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getActiveBusiness } from '@/lib/supabase/get-business'
import { ProductsTable } from '@/components/tables/products-table'
import { LowStockAlert } from '@/components/dashboard/low-stock-alert'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Productos — SeguimientoPro',
}

export default async function ProductsPage() {
  const business = await getActiveBusiness()
  const supabase = await createClient()

  const [{ data: products }, { data: lowStock }] = await Promise.all([
    supabase
      .from('products')
      .select('id, name, category, default_price, cost_price, stock, stock_minimum, track_stock, is_active')
      .eq('business_id', business.id)
      .is('deleted_at', null)
      .order('name', { ascending: true }),
    supabase
      .from('v_low_stock_products')
      .select('id, name, stock, stock_minimum, units_needed')
      .eq('business_id', business.id),
  ])

  // stock y stock_minimum son nullable en DB; ProductRow los espera como number
  const productRows = (products ?? []).map((p) => ({
    ...p,
    stock: p.stock ?? 0,
    stock_minimum: p.stock_minimum ?? 0,
  }))

  const lowStockItems = (lowStock ?? []).map((p) => ({
    id: p.id ?? '',
    name: p.name ?? '—',
    stock: Number(p.stock ?? 0),
    stock_minimum: Number(p.stock_minimum ?? 0),
    units_needed: Number(p.units_needed ?? 0),
  }))

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

      <LowStockAlert count={lowStockItems.length} products={lowStockItems} />

      <ProductsTable products={productRows} currency={business.currency} />
    </div>
  )
}
