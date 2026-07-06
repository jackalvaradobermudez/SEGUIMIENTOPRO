import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-slate-50">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[var(--brand-500)]/10 blur-3xl rounded-full pointer-events-none" aria-hidden="true" />

      <div className="clay-card bg-white p-10 w-full max-w-md relative z-10 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl clay-card-inset bg-slate-50">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--brand-500)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-800 mb-2">Página no encontrada</h1>
        <p className="text-slate-500 font-medium mb-8">
          Esta página no existe o fue movida. Revisa el enlace o vuelve al inicio.
        </p>
        <Link
          href="/"
          className="clay-btn clay-btn-primary h-14 rounded-2xl w-full text-lg flex items-center justify-center"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}
