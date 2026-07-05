'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { formatCurrency } from '@/lib/utils'
import { Edit2, Target } from 'lucide-react'
import { QuickGoalModal } from '@/components/dashboard/quick-goal-modal'

interface GoalData {
  salesTarget: number
  collectionTarget: number
  currentSales: number
  currentCollected: number
}

export function MonthlyProgress({ data: initialData, currency }: { data: GoalData | null; currency: string }) {
  const [data, setData] = useState<GoalData | null>(initialData)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Si no hay meta configurada inicialmente, de todas formas permitimos configurar
  const currentSalesTarget = data?.salesTarget ?? 0
  const currentCollectionTarget = data?.collectionTarget ?? 0
  const currentSales = data?.currentSales ?? 0
  const currentCollected = data?.currentCollected ?? 0

  const salesPct = currentSalesTarget > 0 ? Math.min(Math.round((currentSales / currentSalesTarget) * 100), 100) : 0
  const collectionPct = currentCollectionTarget > 0 ? Math.min(Math.round((currentCollected / currentCollectionTarget) * 100), 100) : 0

  function handleSaveGoal(newSales: number, newCollection: number) {
    setData({
      salesTarget: newSales,
      collectionTarget: newCollection,
      currentSales,
      currentCollected,
    })
  }

  return (
    <Card className="relative overflow-hidden group">
      <CardHeader className="flex flex-row items-center justify-between pb-3.5">
        <CardTitle className="text-base font-bold flex items-center gap-2">
          <Target className="h-4 w-4 text-violet-400" />
          Progreso mensual
        </CardTitle>
        <button
          onClick={() => setIsModalOpen(true)}
          className="p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
          title="Editar metas"
        >
          <Edit2 size={13} />
        </button>
      </CardHeader>
      
      <CardContent className="flex flex-col gap-4">
        {(!data || (currentSalesTarget === 0 && currentCollectionTarget === 0)) ? (
          <div>
            <p className="text-xs text-slate-400">
              No has configurado tus metas de ventas y recaudo para este mes.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-3 text-xs font-bold text-violet-400 hover:text-violet-300 transition-colors flex items-center gap-1 cursor-pointer"
            >
              Configurar metas ahora →
            </button>
          </div>
        ) : (
          <>
            <div>
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Meta de Ventas</span>
                <span className="font-bold text-white">
                  {formatCurrency(currentSales, currency)} / {formatCurrency(currentSalesTarget, currency)}
                </span>
              </div>
              <Progress value={salesPct} className="h-2" />
              <div className="mt-1 flex items-center justify-between text-[10px] text-slate-500">
                <span>Progreso</span>
                <span className="font-semibold text-slate-400">{salesPct}%</span>
              </div>
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Meta de Recaudo (Cobros)</span>
                <span className="font-bold text-white">
                  {formatCurrency(currentCollected, currency)} / {formatCurrency(currentCollectionTarget, currency)}
                </span>
              </div>
              <Progress value={collectionPct} className="h-2" />
              <div className="mt-1 flex items-center justify-between text-[10px] text-slate-500">
                <span>Progreso</span>
                <span className="font-semibold text-slate-400">{collectionPct}%</span>
              </div>
            </div>
          </>
        )}
      </CardContent>

      <QuickGoalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentSalesTarget={currentSalesTarget}
        currentCollectionTarget={currentCollectionTarget}
        onSave={handleSaveGoal}
      />
    </Card>
  )
}
