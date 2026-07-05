import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getActiveBusiness } from '@/lib/supabase/get-business'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import {
  AlertTriangle,
  CalendarClock,
  Clock,
  DollarSign,
  MessageCircle,
  ArrowRight,
  CreditCard,
} from 'lucide-react'
import { formatCurrency, formatDate, daysBetween, buildWhatsAppUrl, interpolateTemplate } from '@/lib/utils'
import { getBusinessTemplates } from '@/lib/whatsapp/get-message'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cobros — SeguimientoPro',
}

interface DueTodayEntry {
  id: string
  balance: number
  sale_number: number
  due_date: string | null
  client_id: string
  clientName: string
  clientPhone: string | null
}

interface BrokenPromiseEntry {
  saleId: string
  saleNumber: number
  balance: number
  promisedDate: string
  promisedAmount: number | null
  clientName: string
  clientPhone: string | null
}

interface CriticalEntry {
  id: string
  balance: number
  sale_number: number
  client_id: string
  clientName: string
  clientPhone: string | null
}

function collectClientIds(
  ...items: Array<Array<{ client_id: string } | { clientId: string } | null | undefined> | null | undefined>
): string[] {
  const ids = new Set<string>()
  for (const list of items) {
    if (!list) continue
    for (const item of list) {
      if (!item) continue
      if ('client_id' in item && item.client_id) ids.add(item.client_id)
      if ('clientId' in item && item.clientId) ids.add(item.clientId)
    }
  }
  return Array.from(ids)
}

async function fetchClientMap(
  supabase: Awaited<ReturnType<typeof createClient>>,
  ids: string[],
): Promise<Map<string, { name: string; phone: string | null }>> {
  if (ids.length === 0) return new Map()
  const { data } = await supabase
    .from('clients')
    .select('id, name, phone')
    .in('id', ids)
  return new Map((data ?? []).map((c) => [c.id, c]))
}

export default async function CollectionsPage() {
  const business = await getActiveBusiness()
  const supabase = await createClient()
  const today = new Date().toISOString().split('T')[0]

  const [
    { data: portfolio },
    { data: dueTodayRaw },
    { data: upcomingRaw },
    { data: brokenSaleIds },
    { data: criticalRaw },
  ] = await Promise.all([
    supabase.from('v_portfolio_summary').select('*').eq('business_id', business.id).single(),
    supabase
      .from('sales')
      .select('id, balance, sale_number, due_date, client_id')
      .eq('business_id', business.id)
      .eq('due_date', today)
      .gt('balance', 0)
      .is('deleted_at', null)
      .in('status', ['pending', 'partial', 'overdue'])
      .order('balance', { ascending: false }),
    supabase
      .from('v_upcoming_collections')
      .select('*')
      .eq('business_id', business.id)
      .order('due_date', { ascending: true })
      .limit(20),
    // Promesas incumplidas: sales con due_date pasado que tienen collection_action con result=promised
    supabase
      .from('collection_actions')
      .select('sale_id, promised_date, promised_amount')
      .eq('business_id', business.id)
      .eq('result', 'promised')
      .lte('promised_date', today),
    supabase
      .from('sales')
      .select('id, balance, sale_number, client_id')
      .eq('business_id', business.id)
      .eq('status', 'overdue')
      .gt('balance', 0)
      .is('deleted_at', null)
      .order('balance', { ascending: false })
      .limit(10),
  ])

  const templates = await getBusinessTemplates()

  const totalOverdue = portfolio?.total_overdue ?? 0
  const hasOverdue = totalOverdue > 0

  // Construir broken promises: combinar brokenSaleIds con los sales que aún tienen balance
  const brokenPromiseMap = new Map<string, { promisedDate: string; promisedAmount: number | null }>()
  for (const action of brokenSaleIds ?? []) {
    if (!brokenPromiseMap.has(action.sale_id)) {
      brokenPromiseMap.set(action.sale_id, {
        promisedDate: action.promised_date ?? '',
        promisedAmount: action.promised_amount,
      })
    }
  }

  // Obtener las sales reales de esas promesas para filtrar por balance > 0
  let brokenList: BrokenPromiseEntry[] = []
  if (brokenPromiseMap.size > 0) {
    const { data: brokenSales } = await supabase
      .from('sales')
      .select('id, balance, sale_number, client_id')
      .in('id', Array.from(brokenPromiseMap.keys()))
      .gt('balance', 0)
      .is('deleted_at', null)

    brokenList = (brokenSales ?? []).map((s) => {
      const bp = brokenPromiseMap.get(s.id)!
      return {
        saleId: s.id,
        saleNumber: s.sale_number,
        // balance es GENERATED — nullable en el tipo TS pero siempre tiene valor
        balance: s.balance ?? 0,
        promisedDate: bp.promisedDate,
        promisedAmount: bp.promisedAmount,
        clientName: '',
        clientPhone: null,
      }
    })
  }

  const hasBrokenPromises = brokenList.length > 0

  // Resolver nombres de clientes de todas las fuentes
  // upcomingRaw tiene client_id nullable (tipo generado de view); filtramos los no-nulos
  const allClientIds = collectClientIds(
    dueTodayRaw ?? [],
    brokenList.length > 0 ? brokenList.map(b => ({ client_id: b.saleId })) : [],
    criticalRaw ?? [],
    (upcomingRaw ?? []).filter((u): u is typeof u & { client_id: string } => u.client_id !== null),
  )

  const clientMap = await fetchClientMap(supabase, allClientIds)

  const dueToday: DueTodayEntry[] = (dueTodayRaw ?? []).map((s) => ({
    ...s,
    // balance es GENERATED — nullable en tipo TS pero siempre tiene valor
    balance: s.balance ?? 0,
    clientName: clientMap.get(s.client_id)?.name ?? '—',
    clientPhone: clientMap.get(s.client_id)?.phone ?? null,
  }))

  brokenList = brokenList.map((b) => ({
    ...b,
    clientName: clientMap.get(b.saleId)?.name ?? '—',
    clientPhone: clientMap.get(b.saleId)?.phone ?? null,
  }))

  const criticalList: CriticalEntry[] = (criticalRaw ?? []).map((c) => ({
    ...c,
    // balance es GENERATED — nullable en tipo TS pero siempre tiene valor
    balance: c.balance ?? 0,
    clientName: clientMap.get(c.client_id)?.name ?? '—',
    clientPhone: clientMap.get(c.client_id)?.phone ?? null,
  }))

  const upcomingCollections = (upcomingRaw ?? []).filter((u) => (u.balance ?? 0) > 0)
  const hasData =
    dueToday.length > 0 ||
    brokenList.length > 0 ||
    upcomingCollections.length > 0 ||
    criticalList.length > 0

  return (
    <div className="dashboard-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Cobros</h1>
          <p className="page-subtitle">Tu centro de cobro diario</p>
        </div>
        <Link href="/dashboard/collections/aging" id="view-aging-report" className="quick-link">
          <ArrowRight size={16} />
          Ver cartera por edades
        </Link>
      </div>

      {hasOverdue && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="size-4" />
          <AlertTitle>Atención</AlertTitle>
          <AlertDescription className="flex items-center gap-2">
            Tienes {formatCurrency(totalOverdue, business.currency)} en cartera vencida.
            <Link href="/dashboard/collections/aging" className="font-medium underline underline-offset-2">
              Ver por edades →
            </Link>
          </AlertDescription>
        </Alert>
      )}

      {hasBrokenPromises && (
        <Alert className="mb-6 border-[var(--warning)] text-[var(--warning)]">
          <AlertTriangle className="size-4" />
          <AlertTitle>Promesas incumplidas</AlertTitle>
          <AlertDescription>
            {brokenList.length} {brokenList.length === 1 ? 'cliente prometió pagar y no cumplió.' : 'clientes prometieron pagar y no cumplieron.'}
          </AlertDescription>
        </Alert>
      )}

      <div className="section-header">
        <h2 className="section-title">Cobros de hoy</h2>
      </div>
      <div className="mb-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="sp-card">
          <div className="sp-card-header flex flex-row items-center gap-2 !pb-3">
            <CalendarClock size={18} className="text-slate-400" />
            <h3 className="text-base font-bold text-white">Vencen hoy</h3>
          </div>
          <div className="sp-card-content !pt-2">
            {dueToday.length === 0 ? (
              <p className="text-sm text-[var(--text-muted)]">Nada vence hoy.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {dueToday.map((sale) => (
                  <div
                    key={sale.id}
                    className="flex items-center justify-between rounded-2xl border border-white/[0.06] bg-white/[0.01] p-4 px-5 text-sm hover:bg-white/[0.02] transition-all duration-150"
                  >
                    <div>
                      <Link
                        href={`/dashboard/sales/${sale.id}`}
                        className="font-semibold text-[var(--brand-500)] hover:underline"
                      >
                        #{sale.sale_number}
                      </Link>
                      <span className="ml-3 text-white font-medium">{sale.clientName}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-[var(--warning-500)] tabular-nums">
                        {formatCurrency(sale.balance, business.currency)}
                      </span>
                      {sale.clientPhone && (
                        <a
                          href={buildWhatsAppUrl(
                            sale.clientPhone,
                            interpolateTemplate(
                              templates.reminder_due_day ?? '',
                              {
                                nombre: sale.clientName,
                                monto: formatCurrency(sale.balance, business.currency),
                                numero_venta: String(sale.sale_number),
                                nombre_negocio: business.name,
                              },
                            ),
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="quick-link text-xs cursor-pointer"
                          aria-label="Contactar por WhatsApp"
                        >
                          <MessageCircle size={14} />
                          WhatsApp
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="sp-card">
          <div className="sp-card-header flex flex-row items-center gap-2 !pb-3">
            <Clock size={18} className="text-slate-400" />
            <h3 className="text-base font-bold text-white">Promesas pendientes</h3>
          </div>
          <div className="sp-card-content !pt-2">
            {brokenList.length === 0 ? (
              <p className="text-sm text-[var(--text-muted)]">Sin promesas pendientes.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {brokenList.map((bp) => (
                  <div
                    key={bp.saleId}
                    className="flex items-center justify-between rounded-2xl border border-white/[0.06] bg-white/[0.01] p-4 px-5 text-sm hover:bg-white/[0.02] transition-all duration-150"
                  >
                    <div>
                      <Link
                        href={`/dashboard/sales/${bp.saleId}`}
                        className="font-semibold text-[var(--brand-500)] hover:underline"
                      >
                        #{bp.saleNumber}
                      </Link>
                      <span className="ml-3 text-white font-medium">{bp.clientName}</span>
                      <span className="ml-3 text-xs text-[var(--text-secondary)] font-medium">
                        Prometió {formatDate(bp.promisedDate)}
                        {bp.promisedAmount != null && (
                          <> · {formatCurrency(bp.promisedAmount, business.currency)}</>
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-[var(--warning-500)] tabular-nums">
                        {formatCurrency(bp.balance, business.currency)}
                      </span>
                      <Link href={`/dashboard/sales/${bp.saleId}`} className="quick-link text-xs cursor-pointer">
                        Gestionar →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="section-header mt-10">
        <h2 className="section-title">Próximos 7 días</h2>
      </div>
      <div className="sp-card mb-10">
        <div className="sp-card-content !pt-6">
          {upcomingCollections.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)]">No hay vencimientos en los próximos 7 días.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {upcomingCollections.map((item) => {
                const daysLeft = daysBetween(today, item.due_date ?? today)
                return (
                  <div
                    key={item.sale_id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.01] p-4 px-5 text-sm hover:bg-white/[0.02] transition-all duration-150"
                  >
                    <div className="flex items-center gap-4">
                      <Link
                        href={`/dashboard/sales/${item.sale_id}`}
                        className="font-semibold text-[var(--brand-500)] hover:underline"
                      >
                        #{item.sale_number}
                      </Link>
                      <span className="text-white font-medium">{item.client_name}</span>
                      {item.client_phone && (
                        <a
                          href={buildWhatsAppUrl(
                            item.client_phone,
                            interpolateTemplate(
                              daysLeft === 0
                                ? (templates.reminder_due_day ?? '')
                                : (templates.reminder_soft ?? ''),
                              {
                                nombre: item.client_name ?? 'Cliente',
                                monto: formatCurrency(item.balance ?? 0, business.currency),
                                numero_venta: String(item.sale_number),
                                dias_vencido: String(Math.abs(daysLeft)),
                                fecha_vencimiento: formatDate(item.due_date ?? new Date().toISOString().split('T')[0]),
                                nombre_negocio: business.name,
                              },
                            ),
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="quick-link text-xs cursor-pointer"
                          aria-label="Contactar por WhatsApp"
                        >
                          <MessageCircle size={14} />
                          WhatsApp
                        </a>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant={daysLeft <= 2 ? 'destructive' : 'secondary'} className="text-xs font-semibold">
                        {daysLeft === 0 ? 'Hoy' : `${daysLeft} días`}
                      </Badge>
                      <span className="font-bold text-white tabular-nums">{formatCurrency(item.balance ?? 0, business.currency)}</span>
                      <Link href={`/dashboard/sales/${item.sale_id}`} className="quick-link text-xs cursor-pointer">
                        Ver →
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <div className="section-header mt-10">
        <h2 className="section-title">Cartera crítica</h2>
      </div>
      <div className="sp-card">
        <div className="sp-card-header flex flex-row items-center gap-2 !pb-3">
          <DollarSign size={18} className="text-slate-400" />
          <h3 className="text-base font-bold text-white">Top 10 deudores</h3>
        </div>
        <div className="sp-card-content !pt-2">
          {criticalList.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)]">No tienes cartera en estado crítico.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {criticalList.map((row) => (
                <div
                  key={row.id}
                  className="flex items-center justify-between rounded-2xl border border-white/[0.06] border-l-2 border-l-[var(--danger-500)] bg-white/[0.01] p-4 px-5 text-sm hover:bg-white/[0.02] transition-all duration-150"
                >
                  <div className="flex items-center gap-4">
                    <Link href={`/dashboard/sales/${row.id}`} className="font-semibold text-[var(--brand-500)] hover:underline">
                      #{row.sale_number}
                    </Link>
                    <span className="text-white font-medium">{row.clientName}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-[var(--danger-500)] tabular-nums">{formatCurrency(row.balance, business.currency)}</span>
                    <Link href={`/dashboard/sales/${row.id}`} className="quick-link text-xs cursor-pointer">
                      Gestionar →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {!hasData && (
        <div className="empty-placeholder mt-10">
          <CreditCard size={32} className="text-[var(--text-muted)]" />
          <p>Hoy no tienes cobros pendientes. ¡Excelente!</p>
        </div>
      )}
    </div>
  )
}
