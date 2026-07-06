'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowRight, ArrowLeft } from 'lucide-react'
import { useState } from 'react'

export function StepClient({
  clientName,
  clientPhone,
  onChangeName,
  onChangePhone,
  onCreateClient,
  onBack,
  onSkip,
}: {
  clientName: string
  clientPhone: string
  onChangeName: (v: string) => void
  onChangePhone: (v: string) => void
  onCreateClient: () => Promise<void>
  onBack: () => void
  onSkip: () => void
}) {
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    setLoading(true)
    await onCreateClient()
    setLoading(false)
  }

  return (
    <div className="py-2">
      <h2 className="font-display text-xl font-bold text-white">Paso 1 de 3: Tu primer cliente</h2>
      <p className="mt-1 text-sm text-zinc-400">¿A quién le vendes? Agrega al menos uno.</p>

      <div className="mt-6 space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-300">Nombre *</label>
          <Input value={clientName} onChange={(e) => onChangeName(e.target.value)} placeholder="Nombre del cliente" className="h-12" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-300">Teléfono (opcional)</label>
          <Input value={clientPhone} onChange={(e) => onChangePhone(e.target.value)} placeholder="3001234567" className="h-12" />
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="text-sm text-zinc-500">
          <ArrowLeft size={16} className="mr-1" /> Atrás
        </Button>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={onSkip} className="text-sm text-zinc-500">Saltar</Button>
          <Button onClick={handleSubmit} disabled={!clientName.trim() || loading} className="h-12 rounded-xl bg-indigo-600 px-6 text-sm font-semibold text-white">
            {loading ? 'Creando...' : 'Crear y continuar'}
            {!loading && <ArrowRight size={16} className="ml-2" />}
          </Button>
        </div>
      </div>
    </div>
  )
}
