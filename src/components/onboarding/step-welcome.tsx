'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowRight } from 'lucide-react'

export function StepWelcome({
  businessName,
  onChangeName,
  onContinue,
  onSkip,
}: {
  businessName: string
  onChangeName: (v: string) => void
  onContinue: () => void
  onSkip: () => void
}) {
  return (
    <div className="py-4 text-center">
      <h2 className="font-display text-2xl font-bold text-white">¡Bienvenido a SeguimientoPro!</h2>
      <p className="mt-3 text-sm text-zinc-400">
        En 3 minutos vas a tener tu primera venta registrada. Vamos paso a paso.
      </p>

      <div className="mt-8 text-left">
        <label className="mb-2 block text-sm font-medium text-zinc-300">
          Nombre de tu negocio
        </label>
        <Input
          value={businessName}
          onChange={(e) => onChangeName(e.target.value)}
          placeholder="Mi negocio"
          className="h-12"
        />
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button
          onClick={onContinue}
          className="h-12 rounded-xl bg-indigo-600 px-8 text-sm font-semibold text-white"
        >
          Empezar
          <ArrowRight size={16} className="ml-2" />
        </Button>
        <Button
          variant="ghost"
          onClick={onSkip}
          className="h-12 text-sm text-zinc-500"
        >
          Saltar setup
        </Button>
      </div>
    </div>
  )
}
