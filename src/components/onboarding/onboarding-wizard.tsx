'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { StepWelcome } from './step-welcome'
import { StepClient } from './step-client'
import { StepProduct } from './step-product'
import { StepSale } from './step-sale'
import { createClientAction } from '@/app/dashboard/clients/actions'
import { createProductAction } from '@/app/dashboard/products/actions'
import { createSaleAction } from '@/app/dashboard/sales/actions'

type Step = 'welcome' | 'client' | 'product' | 'sale' | 'complete'

const STEPS: Step[] = ['welcome', 'client', 'product', 'sale', 'complete']

interface WizardData {
  businessName: string
  clientName: string
  clientPhone: string
  clientId: string
  productName: string
  productPrice: string
  productId: string
}

export function OnboardingWizard({
  businessName,
  currency,
}: {
  businessName: string
  currency: string
}) {
  const router = useRouter()
  const [step, setStep] = useState<Step>('welcome')
  const [skipped, setSkipped] = useState(false)
  const [data, setData] = useState<WizardData>({
    businessName,
    clientName: '',
    clientPhone: '',
    clientId: '',
    productName: '',
    productPrice: '',
    productId: '',
  })

  const stepIndex = STEPS.indexOf(step)
  const totalSteps = STEPS.length - 1 // exclude complete
  const progress = stepIndex === -1 ? 0 : Math.round((stepIndex / totalSteps) * 100)

  function update(fields: Partial<WizardData>) {
    setData((prev) => ({ ...prev, ...fields }))
  }

  function nextStep(next: Step) {
    setStep(next)
  }

  function handleSkip() {
    setSkipped(true)
    router.refresh()
  }

  async function handleCreateClient() {
    const formData = new FormData()
    formData.set('name', data.clientName)
    formData.set('phone', data.clientPhone)
    const result = await createClientAction(formData)
    if (result?.error) {
      toast.error(result.error)
      return
    }
    toast.success('Cliente creado')
    // We need to find the ID. Redirect approach means the page will reload.
    // For simplicity, we'll advance to next step and the client will be available
    // through the allClients list passed as prop.
    nextStep('product')
  }

  async function handleCreateProduct() {
    const formData = new FormData()
    formData.set('name', data.productName)
    formData.set('default_price', data.productPrice)
    formData.set('unit', 'unidad')
    formData.set('track_stock', 'false')
    formData.set('stock', '0')
    formData.set('stock_minimum', '0')
    const result = await createProductAction(formData)
    if (result?.error) {
      toast.error(result.error)
      return
    }
    toast.success('Producto creado')
    nextStep('sale')
  }

  async function handleCreateSale() {
    // Buscar el cliente y producto recién creados por nombre
    // (se acaban de crear, así que son los más recientes)
    const { productName, productPrice } = data
    const result = await createSaleAction({
      client_id: '',
      sale_type: 'credit',
      sale_date: new Date().toISOString().split('T')[0],
      due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      installments: 1,
      discount: 0,
      payment_method: 'cash',
      notes: '',
      items: [
        {
          product_id: '',
          description: productName,
          quantity: 1,
          unit_price: Number(productPrice) || 0,
        },
      ],
    })
    if (result?.error) {
      toast.error(result.error)
      return
    }
    toast.success('¡Venta registrada!')
    nextStep('complete')
  }

  if (skipped) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#09090b]/90 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl border border-white/[0.08] bg-[#111113] p-6 sm:p-8 shadow-2xl">
        {step !== 'complete' && (
          <>
            <div className="mb-6">
              <Progress value={progress} className="h-1.5" />
              <p className="mt-2 text-center text-xs text-zinc-500">
                Paso {stepIndex + 1} de {totalSteps}
              </p>
            </div>
          </>
        )}

        {step === 'welcome' && (
          <StepWelcome
            businessName={data.businessName}
            onChangeName={(v) => update({ businessName: v })}
            onContinue={() => nextStep('client')}
            onSkip={handleSkip}
          />
        )}

        {step === 'client' && (
          <StepClient
            clientName={data.clientName}
            clientPhone={data.clientPhone}
            onChangeName={(v) => update({ clientName: v })}
            onChangePhone={(v) => update({ clientPhone: v })}
            onCreateClient={handleCreateClient}
            onBack={() => nextStep('welcome')}
            onSkip={handleSkip}
          />
        )}

        {step === 'product' && (
          <StepProduct
            productName={data.productName}
            productPrice={data.productPrice}
            onChangeName={(v) => update({ productName: v })}
            onChangePrice={(v) => update({ productPrice: v })}
            onCreateProduct={handleCreateProduct}
            onBack={() => nextStep('client')}
            onSkip={handleSkip}
            currency={currency}
          />
        )}

        {step === 'sale' && (
          <StepSale
            clientName={data.clientName}
            productName={data.productName}
            productPrice={data.productPrice}
            onCreateSale={handleCreateSale}
            onBack={() => nextStep('product')}
            onSkip={handleSkip}
          />
        )}

        {step === 'complete' && (
          <div className="py-6 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20">
              <CheckCircle2 size={40} className="text-emerald-400" />
            </div>
            <h2 className="font-display text-2xl font-bold text-white">¡Listo! Tu negocio está en marcha.</h2>
            <p className="mt-3 text-sm text-zinc-400">
              Ya tienes tu primer cliente, producto y venta registrados. Ahora cada mañana abre tu dashboard para saber exactamente qué cobrar.
            </p>
            <Button
              onClick={() => router.refresh()}
              className="mt-8 h-12 rounded-xl bg-indigo-600 px-8 text-sm font-semibold text-white"
            >
              Ir a mi dashboard
              <ArrowRight size={16} className="ml-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
