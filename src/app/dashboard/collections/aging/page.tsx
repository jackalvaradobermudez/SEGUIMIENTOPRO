import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { getActiveBusiness } from '@/lib/supabase/get-business'
import { AgingSummary } from '@/components/collections/aging-summary'
import { AgingChart } from '@/components/collections/aging-chart'
import { AgingTable } from '@/components/collections/aging-table'
import type { Database } from '@/types/database'

type AgingRow = Database['public']['Views']['v_aging_report']['Row']

export const metadata: Metadata = {
  title: 'Cartera por edades — SeguimientoPro',
}

export default async function AgingReportPage() {
  const business = await getActiveBusiness()
  const supabase = await createClient()

  const { data: rows } = await supabase
    .from('v_aging_report')
    .select('*')
    .eq('business_id', business.id)
    .order('days_overdue', { ascending: false })

  return (
    <div className="dashboard-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Cartera por edades</h1>
          <p className="page-subtitle">Análisis de tu cartera pendiente segmentada por antigüedad de vencimiento</p>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        <AgingSummary rows={(rows ?? []) as AgingRow[]} currency={business.currency} />
        <AgingChart rows={(rows ?? []) as AgingRow[]} currency={business.currency} />
        <AgingTable rows={(rows ?? []) as AgingRow[]} currency={business.currency} />
      </div>
    </div>
  )
}
