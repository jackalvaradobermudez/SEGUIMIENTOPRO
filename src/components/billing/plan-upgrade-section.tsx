'use client'

import { Check, X } from 'lucide-react'
import { UpgradeToProButton } from './upgrade-to-pro-button'

const COMPARISON = [
  { feature: 'Clientes', free: 'Hasta 20', pro: 'Ilimitados' },
  { feature: 'Productos', free: 'Hasta 15', pro: 'Ilimitados' },
  { feature: 'Ventas al mes', free: 'Hasta 30', pro: 'Ilimitadas' },
  { feature: 'Importación CSV masiva', free: false, pro: true },
  { feature: 'Reportes exportables', free: false, pro: true },
  { feature: 'Soporte prioritario', free: false, pro: true },
]

export function PlanUpgradeSection() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-500">
            Plan actual: Gratis
          </span>
        </div>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">
          Desbloquea todo el potencial de tu negocio con PRO.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="px-4 py-2.5 text-left font-semibold text-slate-500 text-xs">Característica</th>
              <th className="px-4 py-2.5 text-center font-semibold text-slate-400 text-xs">Gratis</th>
              <th className="px-4 py-2.5 text-center font-semibold text-indigo-600 text-xs">PRO</th>
            </tr>
          </thead>
          <tbody>
            {COMPARISON.map((row) => (
              <tr key={row.feature} className="border-b border-slate-50 last:border-0">
                <td className="px-4 py-2.5 text-[var(--text-primary)] text-xs font-medium">{row.feature}</td>
                <td className="px-4 py-2.5 text-center text-xs text-slate-400">
                  {typeof row.free === 'string' ? (
                    row.free
                  ) : row.free ? (
                    <Check size={14} className="mx-auto text-emerald-500" />
                  ) : (
                    <X size={14} className="mx-auto text-slate-300" />
                  )}
                </td>
                <td className="px-4 py-2.5 text-center text-xs text-slate-600 font-medium">
                  {typeof row.pro === 'string' ? (
                    <span className="font-semibold text-indigo-600">{row.pro}</span>
                  ) : row.pro ? (
                    <Check size={14} className="mx-auto text-emerald-500" />
                  ) : (
                    <X size={14} className="mx-auto text-slate-300" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col items-center gap-2 rounded-xl bg-indigo-50 p-5">
        <p className="font-outfit text-2xl font-extrabold text-slate-900">$29.900 <span className="text-sm font-normal text-slate-500">/mes</span></p>
        <p className="text-xs text-slate-500 text-center">Sin contratos. Cancela cuando quieras.</p>
        <div className="mt-2">
          <UpgradeToProButton />
        </div>
      </div>
    </div>
  )
}
