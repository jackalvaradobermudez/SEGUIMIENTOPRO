import { createClient } from '@/lib/supabase/server'
import { getActiveBusiness } from '@/lib/supabase/get-business'
import { BusinessSettingsForm } from '@/components/forms/business-settings-form'
import { GoalForm } from '@/components/forms/goal-form'
import { WhatsAppTemplatesSection } from '@/components/settings/whatsapp-templates-section'
import { NotificationsSettingsCard } from '@/components/settings/notifications-settings-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { UpgradeToProButton } from '@/components/billing/upgrade-to-pro-button'
import { formatDate } from '@/lib/utils'
import { LogoutButton } from './logout-button'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Configuración — SeguimientoPro',
}

export default async function SettingsPage() {
  const business = await getActiveBusiness()
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const now = new Date()
  const { data: goal } = await supabase
    .from('goals')
    .select('*')
    .eq('business_id', business.id)
    .eq('period_year', now.getFullYear())
    .eq('period_month', now.getMonth() + 1)
    .maybeSingle()

  return (
    <div className="dashboard-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Configuración</h1>
          <p className="page-subtitle">Gestiona la información de tu negocio y tus metas</p>
        </div>
      </div>

      <div className="flex max-w-3xl flex-col gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Negocio</CardTitle>
          </CardHeader>
          <CardContent>
            <BusinessSettingsForm business={business} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Meta del mes</CardTitle>
          </CardHeader>
          <CardContent>
            <GoalForm
              goal={
                goal
                  ? {
                      sales_target: goal.sales_target ?? 0,
                      collection_target: goal.collection_target ?? 0,
                    }
                  : null
              }
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-[var(--text-primary)]">
                  {business.plan === 'pro' ? 'Plan PRO' : 'Plan Gratis'}
                </p>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">
                  {business.plan === 'pro' && business.plan_expires_at
                    ? `Activo hasta ${formatDate(business.plan_expires_at)}`
                    : 'Clientes, productos y ventas ilimitados con PRO.'}
                </p>
              </div>
              {business.plan !== 'pro' && <UpgradeToProButton />}
            </div>
          </CardContent>
        </Card>

        <WhatsAppTemplatesSection />

        <NotificationsSettingsCard />

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Cuenta</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Correo electrónico</p>
                <p className="text-sm font-medium">{user?.email ?? '—'}</p>
              </div>
              <LogoutButton />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
