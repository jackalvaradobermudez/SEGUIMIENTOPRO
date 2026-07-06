'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message === 'Invalid login credentials'
        ? 'Email o contraseña incorrectos'
        : error.message
      )
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-slate-50">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[var(--brand-500)]/10 blur-3xl rounded-full pointer-events-none" aria-hidden="true" />

      <div className="clay-card bg-white p-10 w-full max-w-md relative z-10 animate-fade-in">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-12 h-12 flex items-center justify-center rounded-2xl clay-card-inset bg-slate-50">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--brand-500)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="font-display text-xl font-bold text-slate-800">Seguimiento<span className="text-[var(--brand-500)]">PRO</span></span>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-800 mb-2">Bienvenido de vuelta</h1>
          <p className="text-slate-500 font-medium">Ingresa tus credenciales para continuar</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-5" id="login-form">
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

          <div className="flex flex-col gap-2">
            <Label htmlFor="password" className="text-slate-700 font-semibold">Contraseña</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              disabled={loading}
              className="h-12 bg-slate-50 border-slate-200 rounded-xl focus-visible:ring-[var(--brand-500)]"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium" role="alert">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2"/>
                <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2"/>
              </svg>
              {error}
            </div>
          )}

          <button
            type="submit"
            id="login-submit"
            disabled={loading}
            className="clay-btn clay-btn-primary h-14 mt-2 rounded-2xl w-full text-lg flex items-center justify-center"
          >
            {loading ? (
              <span className="flex gap-1 items-center">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </span>
            ) : 'Ingresar'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm font-medium text-slate-500">
          ¿No tienes cuenta?{' '}
          <Link href="/register" id="go-to-register" className="text-[var(--brand-500)] font-bold hover:underline">
            Crear cuenta gratis
          </Link>
        </p>
      </div>
    </div>
  )
}
