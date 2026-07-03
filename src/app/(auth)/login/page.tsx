'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
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
    <div className="auth-container">
      {/* Background glow */}
      <div className="auth-glow" aria-hidden="true" />

      <div className="auth-card animate-fade-in">
        {/* Logo */}
        <div className="auth-logo">
          <div className="auth-logo-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" 
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="auth-logo-text">SeguimientoPro</span>
        </div>

        <div className="auth-header">
          <h1>Bienvenido de vuelta</h1>
          <p>Ingresa tus credenciales para continuar</p>
        </div>

        <form onSubmit={handleLogin} className="auth-form" id="login-form">
          <div className="form-group">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              disabled={loading}
            />
          </div>

          {error && (
            <div className="auth-error" role="alert">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2"/>
                <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2"/>
              </svg>
              {error}
            </div>
          )}

          <Button
            type="submit"
            id="login-submit"
            disabled={loading}
            className="auth-submit"
          >
            {loading ? (
              <span className="loading-dots">
                <span /><span /><span />
              </span>
            ) : 'Ingresar'}
          </Button>
        </form>

        <p className="auth-footer">
          ¿No tienes cuenta?{' '}
          <Link href="/register" id="go-to-register">Crear cuenta gratis</Link>
        </p>
      </div>

      <style jsx>{`
        .auth-container {
          min-height: 100dvh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--space-6);
          position: relative;
          overflow: hidden;
        }

        .auth-glow {
          position: absolute;
          top: -200px;
          left: 50%;
          transform: translateX(-50%);
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }

        .auth-card {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 400px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-xl);
          padding: var(--space-10) var(--space-8);
          box-shadow: var(--shadow-xl);
        }

        .auth-logo {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          margin-bottom: var(--space-8);
        }

        .auth-logo-icon {
          width: 40px;
          height: 40px;
          background: var(--accent-light);
          border: 1px solid var(--accent-ring);
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent);
        }

        .auth-logo-text {
          font-family: var(--font-display);
          font-size: var(--text-lg);
          font-weight: 700;
          color: var(--text);
        }

        .auth-header {
          margin-bottom: var(--space-8);
        }

        .auth-header h1 {
          font-size: var(--text-2xl);
          font-weight: 700;
          margin-bottom: var(--space-2);
        }

        .auth-header p {
          color: var(--text-muted);
          font-size: var(--text-sm);
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: var(--space-5);
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }

        .auth-error {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-3) var(--space-4);
          background: var(--danger-bg);
          border: 1px solid rgba(239, 68, 68, 0.25);
          border-radius: var(--radius-md);
          color: var(--danger);
          font-size: var(--text-sm);
        }

        .auth-submit {
          width: 100%;
          height: 44px;
          background: var(--accent) !important;
          color: white !important;
          font-weight: 600;
          font-size: var(--text-sm);
          border-radius: var(--radius-md);
          transition: background var(--transition-fast), transform var(--transition-fast);
          margin-top: var(--space-2);
        }

        .auth-submit:hover:not(:disabled) {
          background: var(--accent-hover) !important;
          transform: translateY(-1px);
        }

        .auth-submit:active:not(:disabled) {
          transform: translateY(0);
        }

        .loading-dots {
          display: flex;
          gap: 4px;
          align-items: center;
        }

        .loading-dots span {
          width: 6px;
          height: 6px;
          background: white;
          border-radius: 50%;
          animation: pulse-subtle 1.2s ease-in-out infinite;
        }

        .loading-dots span:nth-child(2) { animation-delay: 0.2s; }
        .loading-dots span:nth-child(3) { animation-delay: 0.4s; }

        .auth-footer {
          margin-top: var(--space-6);
          text-align: center;
          font-size: var(--text-sm);
          color: var(--text-muted);
        }

        .auth-footer a {
          color: var(--text-accent);
          font-weight: 500;
        }

        .auth-footer a:hover { color: var(--accent); }
      `}</style>
    </div>
  )
}
