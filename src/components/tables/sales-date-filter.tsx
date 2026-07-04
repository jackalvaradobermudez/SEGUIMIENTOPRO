'use client'

import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'

export function SalesDateFilter({
  from,
  to,
  status,
}: {
  from: string
  to: string
  status: string
}) {
  const router = useRouter()

  function navigate(nextFrom: string, nextTo: string) {
    const params = new URLSearchParams()
    if (status && status !== 'all') params.set('status', status)
    params.set('period', 'custom')
    if (nextFrom) params.set('from', nextFrom)
    if (nextTo) params.set('to', nextTo)
    router.push(`/dashboard/sales?${params.toString()}`)
  }

  return (
    <div className="flex items-center gap-2">
      <Input
        type="date"
        value={from}
        onChange={(e) => navigate(e.target.value, to)}
        className="w-40"
        aria-label="Fecha desde"
      />
      <span className="text-sm text-muted-foreground">—</span>
      <Input
        type="date"
        value={to}
        onChange={(e) => navigate(from, e.target.value)}
        className="w-40"
        aria-label="Fecha hasta"
      />
    </div>
  )
}
