import { Clock, CheckCircle2, AlertTriangle } from 'lucide-react'

export type BadgeVariant = 'pending' | 'paid' | 'overdue'

const VARIANT_MAP: Record<BadgeVariant, { bg: string; border: string; text: string; Icon: typeof Clock }> = {
  pending: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', text: 'text-cyan-300', Icon: Clock },
  paid: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-300', Icon: CheckCircle2 },
  overdue: { bg: 'bg-rose-500/10', border: 'border-rose-500/30', text: 'text-rose-300', Icon: AlertTriangle },
}

const LABEL_MAP: Record<BadgeVariant, string> = {
  pending: 'Pendiente',
  paid: 'Pagada',
  overdue: 'Vencida',
}

export function StatBadge({ variant }: { variant: BadgeVariant }) {
  const config = VARIANT_MAP[variant]
  const { Icon } = config
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[13px] font-medium ${config.bg} ${config.border} ${config.text}`}>
      <Icon size={12} />
      {LABEL_MAP[variant]}
    </span>
  )
}
