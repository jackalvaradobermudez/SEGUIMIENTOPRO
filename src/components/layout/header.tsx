import { createClient } from '@/lib/supabase/server'
import { Bell, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function Header() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: business } = user
    ? await supabase
        .from('businesses')
        .select('name, currency')
        .eq('user_id', user.id)
        .is('deleted_at', null)
        .single()
    : { data: null }

  const initials = business?.name
    ? business.name.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase()
    : 'SP'

  return (
    <header className="dashboard-header" role="banner" id="main-header">
      {/* Nombre del negocio */}
      <div className="header-brand">
        <div className="brand-indicator" aria-hidden="true" />
        <span className="brand-name">{business?.name ?? 'Mi Negocio'}</span>
        {business?.currency && (
          <span className="brand-currency">{business.currency}</span>
        )}
      </div>

      {/* Acciones */}
      <div className="header-actions">
        {/* Quick add */}
        <Link href="/dashboard/sales/new" id="header-new-sale">
          <Button size="sm" className="quick-add-btn" aria-label="Nueva venta">
            <Plus size={16} />
            <span>Nueva venta</span>
          </Button>
        </Link>

        {/* Notificaciones */}
        <button
          className="header-icon-btn"
          aria-label="Notificaciones"
          id="header-notifications"
        >
          <Bell size={18} strokeWidth={1.75} />
        </button>

        {/* Avatar */}
        <div className="header-avatar" aria-label={`Usuario: ${user?.email}`} role="img">
          <span>{initials}</span>
        </div>
      </div>
    </header>
  )
}
