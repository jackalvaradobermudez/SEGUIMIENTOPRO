import { COLLECTION_RESULTS, type CollectionResultKey } from '@/lib/constants'
import { cn } from '@/lib/utils'

const RESULT_COLOR_MAP: Record<CollectionResultKey, string> = {
  paid: 'bg-green-500/20 text-green-400',
  promised: 'bg-blue-500/20 text-blue-400',
  partial_payment: 'bg-amber-500/20 text-amber-400',
  rescheduled: 'bg-orange-500/20 text-orange-400',
  no_answer: 'bg-gray-500/20 text-gray-400',
  refused: 'bg-red-500/20 text-red-400',
  other: 'bg-[var(--border)] text-muted-foreground',
}

export function CollectionResultBadge({ result }: { result: string | null }) {
  if (!result) return <span className="text-muted-foreground text-sm">—</span>

  const config = COLLECTION_RESULTS[result as CollectionResultKey]
  if (!config) return <span>{result}</span>

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
        RESULT_COLOR_MAP[result as CollectionResultKey],
      )}
    >
      {config.label}
    </span>
  )
}
