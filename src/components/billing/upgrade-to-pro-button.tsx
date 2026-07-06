'use client'

import { useState } from 'react'
import Script from 'next/script'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { createCheckoutSessionAction } from '@/app/dashboard/settings/billing-actions'
import { trackEvent } from '@/lib/analytics/gtag'

interface WompiTransactionResult {
  transaction?: { status: string }
}

declare global {
  interface Window {
    WidgetCheckout?: new (config: {
      currency: string
      amountInCents: number
      reference: string
      publicKey: string
      signature: { integrity: string }
      redirectUrl?: string
    }) => { open: (callback: (result: WompiTransactionResult) => void) => void }
  }
}

export function UpgradeToProButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleUpgrade() {
    setLoading(true)
    const result = await createCheckoutSessionAction()

    if (result.error || !result.data) {
      toast.error(result.error ?? 'No se pudo iniciar el pago')
      setLoading(false)
      return
    }

    if (!window.WidgetCheckout) {
      toast.error('El widget de pagos no cargó. Intenta de nuevo.')
      setLoading(false)
      return
    }

    const { publicKey, currency, amountInCents, reference, signature } = result.data

    const checkout = new window.WidgetCheckout({
      currency,
      amountInCents,
      reference,
      publicKey,
      signature: { integrity: signature },
      redirectUrl: `${window.location.origin}/dashboard/settings`,
    })

    checkout.open((checkoutResult) => {
      setLoading(false)
      const status = checkoutResult.transaction?.status
      if (status === 'APPROVED') {
        trackEvent('upgrade_to_pro', { status: 'approved' })
        toast.success('¡Pago aprobado! Tu plan PRO se activará en unos segundos.')
        router.refresh()
      } else if (status === 'DECLINED') {
        toast.error('El pago fue rechazado. Intenta con otro medio de pago.')
      } else {
        toast.message('Pago pendiente de confirmación.')
      }
    })
  }

  return (
    <>
      <Script src="https://checkout.wompi.co/widget.js" strategy="lazyOnload" />
      <Button onClick={handleUpgrade} disabled={loading} className="cursor-pointer">
        {loading ? 'Abriendo pago...' : 'Actualizar a PRO'}
      </Button>
    </>
  )
}
