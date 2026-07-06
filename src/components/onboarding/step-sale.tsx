'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight, ArrowLeft, Calendar as CalendarIcon } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { cn, formatDate } from '@/lib/utils'

export function StepSale({
  clientName,
  productName,
  productPrice,
  onCreateSale,
  onBack,
  onSkip,
}: {
  clientName: string
  productName: string
  productPrice: string
  onCreateSale: () => Promise<void>
  onBack: () => void
  onSkip: () => void
}) {
  const [loading, setLoading] = useState(false)
  const [saleType, setSaleType] = useState<'credit' | 'cash'>('credit')
  const [dueDate, setDueDate] = useState(
    new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  )

  async function handleSubmit() {
    setLoading(true)
    await onCreateSale()
    setLoading(false)
  }

  return (
    <div className="py-2">
      <h2 className="font-display text-xl font-bold text-white">Paso 3 de 3: Tu primera venta</h2>
      <p className="mt-1 text-sm text-zinc-400">Registra una venta para ver cómo funciona.</p>

      <div className="mt-6 space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-300">Cliente</label>
          <div className="flex h-12 items-center rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm text-white">
            {clientName || 'Creado en el paso 1'}
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-300">Producto (1 unidad)</label>
          <div className="flex h-12 items-center rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm text-white">
            {productName || 'Creado en el paso 2'} — ${productPrice || '0'}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-300">Tipo de venta</label>
          <div className="flex gap-2">
            {(['cash', 'credit'] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setSaleType(type)}
                className={cn(
                  'flex-1 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors',
                  saleType === type
                    ? 'border-indigo-500/30 bg-indigo-500/15 text-white'
                    : 'border-white/10 bg-white/[0.03] text-zinc-400',
                )}
              >
                {type === 'cash' ? 'Contado' : 'Crédito'}
              </button>
            ))}
          </div>
        </div>

        {saleType === 'credit' && (
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-300">Fecha de vencimiento</label>
            <Popover>
              <PopoverTrigger
                render={
                  <button className="flex h-12 w-full items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm text-white">
                    <CalendarIcon size={16} className="text-zinc-400" />
                    {formatDate(dueDate)}
                  </button>
                }
              />
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={new Date(`${dueDate}T00:00:00`)}
                  onSelect={(date) => setDueDate(date ? date.toISOString().split('T')[0] : dueDate)}
                />
              </PopoverContent>
            </Popover>
          </div>
        )}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="text-sm text-zinc-500">
          <ArrowLeft size={16} className="mr-1" /> Atrás
        </Button>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={onSkip} className="text-sm text-zinc-500">Saltar</Button>
          <Button onClick={handleSubmit} disabled={loading} className="h-12 rounded-xl bg-indigo-600 px-6 text-sm font-semibold text-white">
            {loading ? 'Registrando...' : 'Registrar venta'}
            {!loading && <ArrowRight size={16} className="ml-2" />}
          </Button>
        </div>
      </div>
    </div>
  )
}
