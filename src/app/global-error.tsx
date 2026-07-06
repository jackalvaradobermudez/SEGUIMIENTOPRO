'use client'

import { useEffect } from 'react'

export default function GlobalError({
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
    <html lang="es">
      <body className="bg-slate-50 text-slate-900">
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="bg-white p-10 w-full max-w-md rounded-3xl border border-slate-200 shadow-xl text-center">
            <h1 className="text-3xl font-extrabold text-slate-800 mb-2">Algo salió mal</h1>
            <p className="text-slate-500 font-medium mb-8">
              Tuvimos un problema inesperado cargando la aplicación.
            </p>
            <button
              onClick={reset}
              className="h-14 rounded-2xl w-full text-lg font-semibold bg-indigo-600 text-white cursor-pointer hover:bg-indigo-500 transition-colors"
            >
              Intentar de nuevo
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
