import { createClient } from '@/lib/supabase/server'
import { getActiveBusiness } from '@/lib/supabase/get-business'
import { BusinessSettingsForm } from '@/components/forms/business-settings-form'
import { GoalForm } from '@/components/forms/goal-form'
import { WhatsAppTemplatesSection } from '@/components/settings/whatsapp-templates-section'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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

        <WhatsAppTemplatesSection />

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
