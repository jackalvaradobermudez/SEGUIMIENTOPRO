'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

const LINKS = [
  { href: '#features', label: 'Funciones' },
  { href: '#how-it-works', label: 'Cómo funciona' },
  { href: '#pricing', label: 'Precios' },
  { href: '#testimonials', label: 'Testimonios' },
]

export function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 20) }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function scrollTo(id: string) {
    setOpen(false)
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav
      className={cn(
        'fixed inset-x-0 top-0 z-50 h-[76px] transition-all duration-300',
        scrolled ? 'border-b border-slate-200 bg-white/80 backdrop-blur-xl' : 'bg-transparent',
      )}
    >
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5 font-outfit text-lg font-bold text-slate-900">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/15">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          Seguimiento<span className="text-indigo-500">PRO</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <button key={l.href} onClick={() => scrollTo(l.href)} className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-900">
              {l.label}
            </button>
          ))}
        </div>

        <div className="hidden items-center gap-4 md:flex">
          <Link href="/login" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Entrar</Link>
          <Link href="/register">
            <Button className="h-10 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white shadow-none hover:bg-indigo-500 transition-colors">
              Empieza gratis
            </Button>
          </Link>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger render={<button className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 md:hidden"><Menu size={18} /></button>} />
          <SheetContent side="right" className="w-64 border-l border-slate-200 bg-white p-6">
            <div className="flex flex-col gap-4 pt-8">
              {LINKS.map((l) => (
                <button key={l.href} onClick={() => scrollTo(l.href)} className="text-left text-sm font-medium text-slate-600 hover:text-slate-900">
                  {l.label}
                </button>
              ))}
              <hr className="border-slate-200" />
              <Link href="/login" className="text-sm font-medium text-slate-600">Entrar</Link>
              <Link href="/register"><Button className="w-full rounded-xl bg-indigo-600 text-sm font-semibold text-white">Empieza gratis</Button></Link>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  )
}
