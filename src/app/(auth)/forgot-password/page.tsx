'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function ForgotPasswordPage() {
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setSent(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-slate-50">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[var(--brand-500)]/10 blur-3xl rounded-full pointer-events-none" aria-hidden="true" />

      <div className="clay-card bg-white p-10 w-full max-w-md relative z-10 animate-fade-in">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-12 h-12 flex items-center justify-center rounded-2xl clay-card-inset bg-slate-50">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--brand-500)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="font-display text-xl font-bold text-slate-800">Seguimiento<span className="text-[var(--brand-500)]">PRO</span></span>
        </div>

        {sent ? (
          <div className="text-center">
            <h1 className="text-2xl font-extrabold text-slate-800 mb-2">Revisa tu correo</h1>
            <p className="text-slate-500 font-medium">
              Si <strong>{email}</strong> tiene una cuenta con nosotros, te enviamos un enlace para restablecer tu contraseña.
            </p>
            <Link href="/login" className="mt-8 inline-block text-[var(--brand-500)] font-bold hover:underline">
              Volver a ingresar
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-extrabold text-slate-800 mb-2">¿Olvidaste tu contraseña?</h1>
              <p className="text-slate-500 font-medium">Te enviamos un enlace para restablecerla.</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5" id="forgot-password-form">
              <div className="flex flex-col gap-2">
                <Label htmlFor="email" className="text-slate-700 font-semibold">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  disabled={loading}
                  className="h-12 bg-slate-50 border-slate-200 rounded-xl focus-visible:ring-[var(--brand-500)]"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium" role="alert">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="clay-btn clay-btn-primary h-14 mt-2 rounded-2xl w-full text-lg flex items-center justify-center"
              >
                {loading ? 'Enviando...' : 'Enviar enlace'}
              </button>
            </form>

            <p className="mt-8 text-center text-sm font-medium text-slate-500">
              <Link href="/login" className="text-[var(--brand-500)] font-bold hover:underline">
                Volver a ingresar
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
