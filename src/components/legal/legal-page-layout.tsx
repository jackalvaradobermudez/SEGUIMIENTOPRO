import Link from 'next/link'
import type { ReactNode } from 'react'

export function LegalPageLayout({
  title,
  updatedAt,
  draft,
  children,
}: {
  title: string
  updatedAt: string
  draft?: boolean
  children: ReactNode
}) {
  return (
    <div className="min-h-screen bg-white px-6 py-16">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="text-sm font-semibold text-[var(--brand-600)] hover:underline">
          ← Volver a SeguimientoPro
        </Link>

        <h1 className="mt-6 font-outfit text-4xl font-bold tracking-tight text-slate-900">{title}</h1>
        <p className="mt-2 text-sm text-slate-400">Última actualización: {updatedAt}</p>

        {draft && (
          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            <strong>Documento en borrador.</strong> Este texto es un punto de partida y no ha sido
            revisado por un abogado. Antes de publicarlo como definitivo, verifica que cumple con la
            Ley 1581 de 2012 (Habeas Data) y demás normativa aplicable a tu negocio.
          </div>
        )}

        <div className="mt-10 flex flex-col gap-8 text-[15px] leading-relaxed text-slate-600">
          {children}
        </div>
      </div>
    </div>
  )
}

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 font-outfit text-xl font-bold text-slate-900">{title}</h2>
      <div className="flex flex-col gap-3">{children}</div>
    </section>
  )
}
