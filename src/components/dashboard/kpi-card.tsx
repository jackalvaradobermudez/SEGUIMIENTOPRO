import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface KpiCardProps {
  label: string
  value: string
  subtitle?: string
  icon: React.ReactNode
  iconBg: string
  sparklineColor: string
  deltaText?: string
  href?: string
  className?: string
}

export function KpiCard({ label, value, subtitle, icon, iconBg, sparklineColor, deltaText, href, className }: KpiCardProps) {
  const Wrapper = href ? 'a' : 'div'
  const wrapperProps = href ? { href } : {}

  return (
    <Wrapper
      {...wrapperProps}
      className={cn(
        'group flex flex-col gap-3 rounded-3xl border border-white/10 bg-[#121B2B] p-6 transition-all duration-200 hover:border-white/[0.14] hover:shadow-[0_15px_40px_rgba(0,0,0,0.3)] min-w-0',
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <div className={cn('flex h-12 w-12 items-center justify-center rounded-2xl', iconBg)}>
          {icon}
        </div>
        {/* Simple sparkline SVG */}
        <svg width="60" height="32" viewBox="0 0 60 32" className="opacity-40">
          <polyline
            points="0,24 10,20 20,16 30,8 40,4 50,0 60,10"
            fill="none"
            stroke={sparklineColor}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div>
        <p className="text-[13px] font-medium text-slate-400">{label}</p>
        <p className="font-outfit text-[22px] font-semibold tracking-[-0.02em] text-white">{value}</p>
        {subtitle && <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>}
        {deltaText && (
          <div className="mt-2 flex items-center gap-1 text-xs text-slate-500">
            <ArrowUpRight size={12} className="text-emerald-400" />
            <span className="text-emerald-400">{deltaText}</span>
            <span>vs mes anterior</span>
          </div>
        )}
      </div>
    </Wrapper>
  )
}
