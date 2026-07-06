import { Clock, CheckCircle2, AlertTriangle } from 'lucide-react'

export type BadgeVariant = 'pending' | 'paid' | 'overdue'

const VARIANT_MAP: Record<BadgeVariant, { bg: string; border: string; text: string; Icon: typeof Clock }> = {
  pending: { bg: 'bg-[var(--info-soft)]', border: 'border-[var(--info-border)]', text: 'text-[var(--info-500)]', Icon: Clock },
  paid: { bg: 'bg-[var(--success-soft)]', border: 'border-[var(--success-border)]', text: 'text-[var(--success-500)]', Icon: CheckCircle2 },
  overdue: { bg: 'bg-[var(--danger-soft)]', border: 'border-[var(--danger-border)]', text: 'text-[var(--danger-500)]', Icon: AlertTriangle },
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
    <span className={`inline-flex min-w-[104px] items-center justify-center gap-1.5 rounded-md border px-3 py-1.5 text-[13px] font-semibold ${config.bg} ${config.border} ${config.text}`}>
      <Icon size={12} />
      {LABEL_MAP[variant]}
    </span>
  )
}
