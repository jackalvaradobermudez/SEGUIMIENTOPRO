import { ProductForm } from '@/components/forms/product-form'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Nuevo producto — SeguimientoPro',
}

export default function NewProductPage() {
  return (
    <div className="dashboard-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Nuevo producto</h1>
          <p className="page-subtitle">Completa los datos del producto</p>
        </div>
      </div>

      <div className="max-w-xl">
        <ProductForm />
      </div>
    </div>
  )
}
