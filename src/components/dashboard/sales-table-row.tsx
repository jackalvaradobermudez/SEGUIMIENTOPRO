import { Eye, FileDown, MoreHorizontal } from 'lucide-react'
import { StatBadge } from '@/components/dashboard/stat-badge'
import { cn } from '@/lib/utils'
import type { BadgeVariant } from '@/components/dashboard/stat-badge'

interface SaleRow {
  id: string
  client: { name: string; email: string; initials: string; avatarColor: string }
  date: string
  total: number
  paid: number
  balance: number
  status: BadgeVariant
}

function formatAmount(n: number): string {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(n)
}

export function SalesTableRow({ sale }: { sale: SaleRow }) {
  const balanceColor = sale.status === 'paid' ? 'text-[var(--success-500)]' : sale.status === 'overdue' ? 'text-[var(--danger-500)]' : 'text-[var(--warning-500)]'

  return (
    <tr className="border-t border-white/[0.06] transition-colors duration-200 hover:bg-white/[0.02]">
      <td className="px-5 py-4">
        <span className="inline-flex rounded-lg bg-violet-500/10 border border-violet-500/20 px-3 py-1.5 text-xs font-semibold text-violet-300">
          {sale.id}
        </span>
      </td>
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className={cn('flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]', sale.client.avatarColor)}>
            {sale.client.initials}
          </div>
          <div>
            <p className="text-[14px] font-semibold leading-5 text-white">{sale.client.name}</p>
            <p className="text-[13px] leading-4 text-[var(--text-muted)]">{sale.client.email}</p>
          </div>
        </div>
      </td>
      <td className="px-5 py-4 text-sm text-[var(--text-secondary)] tabular-nums">{sale.date}</td>
      <td className="px-5 py-4 text-right text-sm font-semibold text-white tabular-nums">{formatAmount(sale.total)}</td>
      <td className="px-5 py-4 text-right text-sm font-semibold text-white tabular-nums">{formatAmount(sale.paid)}</td>
      <td className={cn('px-5 py-4 text-right text-sm font-bold tabular-nums', balanceColor)}>{formatAmount(sale.balance)}</td>
      <td className="px-5 py-4"><StatBadge variant={sale.status} /></td>
      <td className="px-5 py-4">
        <div className="flex items-center gap-1.5">
          <button className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-white/[0.03] text-[var(--text-secondary)] transition-colors duration-200 hover:bg-white/[0.06] hover:text-white cursor-pointer" aria-label="Ver detalle">
            <Eye size={15} />
          </button>
          <button className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-white/[0.03] text-[var(--text-secondary)] transition-colors duration-200 hover:bg-white/[0.06] hover:text-white cursor-pointer" aria-label="Descargar recibo">
            <FileDown size={15} />
          </button>
          <button className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-white/[0.03] text-[var(--text-secondary)] transition-colors duration-200 hover:bg-white/[0.06] hover:text-white cursor-pointer" aria-label="Más opciones">
            <MoreHorizontal size={15} />
          </button>
        </div>
      </td>
    </tr>
  )
}
