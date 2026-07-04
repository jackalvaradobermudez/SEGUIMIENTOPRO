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
  const balanceColor = sale.status === 'paid' ? 'text-emerald-400' : sale.status === 'overdue' ? 'text-rose-400' : 'text-amber-400'

  return (
    <tr className="border-b border-white/[0.04] transition-colors hover:bg-white/[0.02]">
      <td className="px-6 py-4">
        <span className="inline-flex rounded-xl bg-violet-500/10 px-3 py-1.5 text-sm font-medium text-violet-300">
          {sale.id}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className={cn('flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold text-white', sale.client.avatarColor)}>
            {sale.client.initials}
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{sale.client.name}</p>
            <p className="text-[13px] text-slate-400">{sale.client.email}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-slate-300">{sale.date}</td>
      <td className="px-6 py-4 text-right text-sm font-medium text-white">{formatAmount(sale.total)}</td>
      <td className="px-6 py-4 text-right text-sm font-medium text-white">{formatAmount(sale.paid)}</td>
      <td className={cn('px-6 py-4 text-right text-sm font-semibold', balanceColor)}>{formatAmount(sale.balance)}</td>
      <td className="px-6 py-4"><StatBadge variant={sale.status} /></td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-1.5">
          <button className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-400 transition-all hover:bg-white/[0.06] hover:text-white" aria-label="Ver detalle">
            <Eye size={15} />
          </button>
          <button className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-400 transition-all hover:bg-white/[0.06] hover:text-white" aria-label="Descargar recibo">
            <FileDown size={15} />
          </button>
          <button className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-400 transition-all hover:bg-white/[0.06] hover:text-white" aria-label="Más opciones">
            <MoreHorizontal size={15} />
          </button>
        </div>
      </td>
    </tr>
  )
}
