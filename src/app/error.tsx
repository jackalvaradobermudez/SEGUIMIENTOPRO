'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-slate-50">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-rose-500/10 blur-3xl rounded-full pointer-events-none" aria-hidden="true" />

      <div className="clay-card bg-white p-10 w-full max-w-md relative z-10 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl clay-card-inset bg-slate-50">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#e11d48" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-800 mb-2">Algo salió mal</h1>
        <p className="text-slate-500 font-medium mb-8">
          Tuvimos un problema inesperado. Puedes intentar de nuevo o volver al inicio.
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={reset}
            className="clay-btn clay-btn-primary h-14 rounded-2xl w-full text-lg flex items-center justify-center cursor-pointer"
          >
            Intentar de nuevo
          </button>
          <Link
            href="/"
            className="h-12 rounded-2xl w-full text-sm font-semibold text-slate-500 flex items-center justify-center hover:text-slate-700"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}
