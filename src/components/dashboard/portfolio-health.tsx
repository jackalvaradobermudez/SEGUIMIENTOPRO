'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { calculateHealthScore, getHealthLabel } from '@/lib/utils'

interface HealthData {
  totalCurrent: number
  totalPending: number
  avgCollectionDays: number
  clientsWithRecentAction: number
  clientsWithDebt: number
}

export function PortfolioHealth({ data }: { data: HealthData }) {
  if (data.clientsWithDebt === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Salud del portafolio</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Registra ventas para ver la salud de tu portafolio.</p>
        </CardContent>
      </Card>
    )
  }

  const score = calculateHealthScore(data)
  const { label, color } = getHealthLabel(score)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Salud del portafolio</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <div className="relative flex size-16 items-center justify-center rounded-full border-4" style={{ borderColor: `var(--${color === 'amber' ? 'warning' : color === 'red' ? 'danger' : color === 'orange' ? 'warning' : 'success'})` }}>
            <span className="font-display text-xl font-bold">{score}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-semibold">{label}</span>
            <Progress value={score} className="h-2 w-40" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
