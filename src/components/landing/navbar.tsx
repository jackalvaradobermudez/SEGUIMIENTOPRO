'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { href: '#features', label: 'Funciones' },
  { href: '#pricing', label: 'Precios' },
]

export function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function scrollTo(id: string) {
    setOpen(false)
    const el = document.querySelector(id)
    el?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled
          ? 'border-b border-white/[0.06] bg-[#09090b]/80 backdrop-blur-xl'
          : 'bg-transparent',
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5 font-display text-lg font-bold text-white">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/20">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          Seguimiento<span className="text-indigo-400">PRO</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <button
              key={link.href}
              onClick={() => scrollTo(link.href)}
              className="text-sm font-medium text-zinc-400 transition-colors hover:text-white"
            >
              {link.label}
            </button>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link href="/login" className="text-sm font-medium text-zinc-400 transition-colors hover:text-white">
            Entrar
          </Link>
          <Link href="/register">
            <Button className="h-9 rounded-lg bg-indigo-600 px-5 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors">
              Empezar gratis
            </Button>
          </Link>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={<button className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-zinc-400 md:hidden"><Menu size={18} /></button>}
          />
          <SheetContent side="right" className="w-64 border-l border-white/10 bg-[#09090b] p-6">
            <div className="flex flex-col gap-4 pt-8">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  className="text-left text-sm font-medium text-zinc-400 transition-colors hover:text-white"
                >
                  {link.label}
                </button>
              ))}
              <hr className="border-white/10" />
              <Link href="/login" className="text-sm font-medium text-zinc-400">
                Entrar
              </Link>
              <Link href="/register">
                <Button className="w-full rounded-lg bg-indigo-600 text-sm font-semibold text-white">
                  Empezar gratis
                </Button>
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  )
}
