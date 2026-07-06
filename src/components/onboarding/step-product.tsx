'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowRight, ArrowLeft } from 'lucide-react'

export function StepProduct({
  productName,
  productPrice,
  onChangeName,
  onChangePrice,
  onCreateProduct,
  onBack,
  onSkip,
  currency,
}: {
  productName: string
  productPrice: string
  onChangeName: (v: string) => void
  onChangePrice: (v: string) => void
  onCreateProduct: () => Promise<void>
  onBack: () => void
  onSkip: () => void
  currency: string
}) {
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    setLoading(true)
    await onCreateProduct()
    setLoading(false)
  }

  return (
    <div className="py-2">
      <h2 className="font-display text-xl font-bold text-white">Paso 2 de 3: Tu primer producto</h2>
      <p className="mt-1 text-sm text-zinc-400">¿Qué vendes? Agrega al menos un producto o servicio.</p>

      <div className="mt-6 space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-300">Nombre *</label>
          <Input value={productName} onChange={(e) => onChangeName(e.target.value)} placeholder="Nombre del producto" className="h-12" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-300">Precio de venta ({currency}) *</label>
          <Input value={productPrice} onChange={(e) => onChangePrice(e.target.value)} type="number" min="0" placeholder="0" className="h-12" />
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="text-sm text-zinc-500">
          <ArrowLeft size={16} className="mr-1" /> Atrás
        </Button>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={onSkip} className="text-sm text-zinc-500">Saltar</Button>
          <Button onClick={handleSubmit} disabled={!productName.trim() || !productPrice || loading} className="h-12 rounded-xl bg-indigo-600 px-6 text-sm font-semibold text-white">
            {loading ? 'Creando...' : 'Crear y continuar'}
            {!loading && <ArrowRight size={16} className="ml-2" />}
          </Button>
        </div>
      </div>
    </div>
  )
}
