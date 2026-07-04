'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { formatCurrency } from '@/lib/utils'

interface GoalData {
  salesTarget: number
  collectionTarget: number
  currentSales: number
  currentCollected: number
}

export function MonthlyProgress({ data, currency }: { data: GoalData | null; currency: string }) {
  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Progreso mensual</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Configura tu meta del mes{' →'}
            <Link href="/dashboard/settings" className="ml-1 text-accent underline underline-offset-2">
              Ir a configuración
            </Link>
          </p>
        </CardContent>
      </Card>
    )
  }

  const salesPct = data.salesTarget > 0 ? Math.min(Math.round((data.currentSales / data.salesTarget) * 100), 100) : 0
  const collectionPct = data.collectionTarget > 0 ? Math.min(Math.round((data.currentCollected / data.collectionTarget) * 100), 100) : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Progreso mensual</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div>
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Ventas</span>
            <span>
              {formatCurrency(data.currentSales, currency)} / {formatCurrency(data.salesTarget, currency)}
            </span>
          </div>
          <Progress value={salesPct} className="h-2" />
          <span className="text-xs text-muted-foreground">{salesPct}%</span>
        </div>
        <div>
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Recaudado</span>
            <span>
              {formatCurrency(data.currentCollected, currency)} / {formatCurrency(data.collectionTarget, currency)}
            </span>
          </div>
          <Progress value={collectionPct} className="h-2" />
          <span className="text-xs text-muted-foreground">{collectionPct}%</span>
        </div>
      </CardContent>
    </Card>
  )
}
