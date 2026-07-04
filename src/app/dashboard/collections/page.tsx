import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getActiveBusiness } from '@/lib/supabase/get-business'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { formatCurrency, formatDate, daysBetween, buildWhatsAppUrl } from '@/lib/utils'
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

      <h2 className="section-title">Cobros de hoy</h2>
      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CalendarClock size={18} />
              Vencen hoy
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dueToday.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nada vence hoy.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {dueToday.map((sale) => (
                  <div
                    key={sale.id}
                    className="flex items-center justify-between rounded-[var(--radius-sm)] border border-[var(--border)] p-3 text-sm"
                  >
                    <div>
                      <Link
                        href={`/dashboard/sales/${sale.id}`}
                        className="font-medium text-accent hover:underline"
                      >
                        #{sale.sale_number}
                      </Link>
                      <span className="ml-2">{sale.clientName}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-[var(--warning)]">
                        {formatCurrency(sale.balance, business.currency)}
                      </span>
                      {sale.clientPhone && (
                        <a
                          href={buildWhatsAppUrl(
                            sale.clientPhone,
                            `Hola ${sale.clientName}, te recuerdo que hoy vence tu compra #${sale.sale_number} por ${formatCurrency(sale.balance, business.currency)}. ¿Cuándo podemos coordinar el pago?`,
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="quick-link text-xs"
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock size={18} />
              Promesas pendientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {brokenList.length === 0 ? (
              <p className="text-sm text-muted-foreground">Sin promesas pendientes.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {brokenList.map((bp) => (
                  <div
                    key={bp.saleId}
                    className="flex items-center justify-between rounded-[var(--radius-sm)] border border-[var(--border)] p-3 text-sm"
                  >
                    <div>
                      <Link
                        href={`/dashboard/sales/${bp.saleId}`}
                        className="font-medium text-accent hover:underline"
                      >
                        #{bp.saleNumber}
                      </Link>
                      <span className="ml-2">{bp.clientName}</span>
                      <span className="ml-2 text-xs text-muted-foreground">
                        Prometió {formatDate(bp.promisedDate)}
                        {bp.promisedAmount != null && (
                          <> · {formatCurrency(bp.promisedAmount, business.currency)}</>
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-[var(--warning)]">
                        {formatCurrency(bp.balance, business.currency)}
                      </span>
                      <Link href={`/dashboard/sales/${bp.saleId}`} className="quick-link text-xs">
                        Gestionar →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <h2 className="section-title">Próximos 7 días</h2>
      <Card className="mb-8">
        <CardContent className="pt-6">
          {upcomingCollections.length === 0 ? (
            <p className="text-sm text-muted-foreground">No hay vencimientos en los próximos 7 días.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {upcomingCollections.map((item) => {
                const daysLeft = daysBetween(today, item.due_date ?? today)
                return (
                  <div
                    key={item.sale_id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-[var(--radius-sm)] border border-[var(--border)] p-3 text-sm"
                  >
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/dashboard/sales/${item.sale_id}`}
                        className="font-medium text-accent hover:underline"
                      >
                        #{item.sale_number}
                      </Link>
                      <span>{item.client_name}</span>
                      {item.client_phone && (
                        <a
                          href={buildWhatsAppUrl(
                            item.client_phone,
                      `Hola ${item.client_name}, te recuerdo que tienes un pago pendiente de ${formatCurrency(item.balance ?? 0, business.currency)} que vence ${daysLeft === 0 ? 'hoy' : `en ${daysLeft} días`}.`,
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="quick-link text-xs"
                          aria-label="Contactar por WhatsApp"
                        >
                          <MessageCircle size={14} />
                          WhatsApp
                        </a>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={daysLeft <= 2 ? 'destructive' : 'secondary'} className="text-xs">
                        {daysLeft === 0 ? 'Hoy' : `${daysLeft} días`}
                      </Badge>
                      <span className="font-semibold">{formatCurrency(item.balance ?? 0, business.currency)}</span>
                      <Link href={`/dashboard/sales/${item.sale_id}`} className="quick-link text-xs">
                        Ver →
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <h2 className="section-title">Cartera crítica</h2>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <DollarSign size={18} />
            Top 10 deudores
          </CardTitle>
        </CardHeader>
        <CardContent>
          {criticalList.length === 0 ? (
            <p className="text-sm text-muted-foreground">No tienes cartera en estado crítico.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {criticalList.map((row) => (
                <div
                  key={row.id}
                  className="flex items-center justify-between rounded-[var(--radius-sm)] border border-[var(--border)] border-l-2 border-l-red-500 p-3 text-sm"
                >
                  <div className="flex items-center gap-3">
                    <Link href={`/dashboard/sales/${row.id}`} className="font-medium text-accent hover:underline">
                      #{row.sale_number}
                    </Link>
                    <span>{row.clientName}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-red-400">{formatCurrency(row.balance, business.currency)}</span>
                    <Link href={`/dashboard/sales/${row.id}`} className="quick-link text-xs">
                      Gestionar →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {!hasData && (
        <div className="empty-placeholder mt-8">
          <CreditCard size={32} color="var(--text-subtle)" />
          <p>Hoy no tienes cobros pendientes. ¡Excelente!</p>
        </div>
      )}
    </div>
  )
}
