import { ClientForm } from '@/components/forms/client-form'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Nuevo cliente — SeguimientoPro',
}

export default function NewClientPage() {
  return (
    <div className="dashboard-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Nuevo cliente</h1>
          <p className="page-subtitle">Completa los datos del cliente</p>
        </div>
      </div>

      <div className="max-w-xl">
        <ClientForm />
      </div>
    </div>
  )
}
