'use client'

import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Target, TrendingUp, CreditCard } from 'lucide-react'
import { upsertGoalAction } from '@/app/dashboard/settings/actions'

interface QuickGoalModalProps {
  isOpen: boolean
  onClose: () => void
  currentSalesTarget: number
  currentCollectionTarget: number
  onSave: (sales: number, collection: number) => void
}

export function QuickGoalModal({
  isOpen,
  onClose,
  currentSalesTarget,
  currentCollectionTarget,
  onSave,
}: QuickGoalModalProps) {
  const [salesTarget, setSalesTarget] = useState(String(currentSalesTarget))
  const [collectionTarget, setCollectionTarget] = useState(String(currentCollectionTarget))
  const [submitting, setSubmitting] = useState(false)

  const now = new Date()
  const monthName = now.toLocaleDateString('es-CO', { month: 'long' })
  const yearName = now.getFullYear()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)

    const salesVal = parseFloat(salesTarget) || 0
    const collectionVal = parseFloat(collectionTarget) || 0

    const formData = new FormData()
    formData.set('sales_target', String(salesVal))
    formData.set('collection_target', String(collectionVal))

    const result = await upsertGoalAction(formData)
    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success('Metas actualizadas exitosamente')
      onSave(salesVal, collectionVal)
      onClose()
    }
    setSubmitting(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(val) => { if (!val) onClose() }}>
      <DialogContent className="max-w-md p-6 bg-white border border-slate-200 text-[var(--text-primary)] rounded-xl shadow-2xl overflow-hidden animate-fade-in">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-lg font-bold flex items-center gap-2">
            <Target className="text-violet-400" />
            Configurar Metas de {monthName} {yearName}
          </DialogTitle>
          <DialogDescription className="text-slate-500 text-xs">
            Modifica los objetivos de ventas y cobros del mes actual. Se actualizará en tu panel.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3.5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
                <TrendingUp size={14} className="text-violet-500" />
                Meta de Ventas del Mes
              </label>
              <Input
                type="number"
                min={0}
                step="0.01"
                placeholder="0.00"
                value={salesTarget}
                onChange={(e) => setSalesTarget(e.target.value)}
                className="focus:border-violet-500 rounded-lg"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
                <CreditCard size={14} className="text-emerald-500" />
                Meta de Recaudo del Mes
              </label>
              <Input
                type="number"
                min={0}
                step="0.01"
                placeholder="0.00"
                value={collectionTarget}
                onChange={(e) => setCollectionTarget(e.target.value)}
                className="focus:border-violet-500 rounded-lg"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 border-t border-slate-100 pt-4 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={submitting}
              className="border-slate-200 text-[var(--text-primary)] hover:bg-slate-50 hover:text-[var(--brand-700)] rounded-lg cursor-pointer"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-lg cursor-pointer shadow-lg hover:shadow-violet-600/20"
            >
              {submitting ? 'Guardando...' : 'Actualizar Metas'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
