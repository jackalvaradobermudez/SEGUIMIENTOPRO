# SeguimientoPro

## Contexto de negocio
**Problema que resuelve:** El vendedor independiente pierde dinero porque no lleva control ordenado de quién le debe, cuánto y desde cuándo.  
**Usuario objetivo:** Vendedor independiente que vende a crédito y necesita registro profesional de ventas y cartera.  
**KPI palanca:** Retención — el usuario vuelve diario porque ve su cartera viva.  
**Métrica de éxito:** 80% de usuarios activos a los 30 días del registro.

## Evento de primer valor
El usuario siente valor por primera vez cuando: **registra su primera venta a crédito y ve el saldo pendiente actualizado en el dashboard.**

## Stack

| Capa | Tecnología |
|---|---|
| Framework | Next.js 15 (App Router) |
| Base de datos | PostgreSQL via Supabase |
| Auth | Supabase Auth |
| UI | shadcn/ui + CSS Variables (Quiet Luxury dark) |
| Deploy | Vercel |
| Tipado | TypeScript + Zod |

## ADR Principal
Ver: [Implementación plan](./implementation_plan.md)

**Stack elegido:** Next.js 15 + Supabase + Vercel  
**Alternativas descartadas:** Remix (ecosistema menor), Laravel/Inertia (PHP, no Node-first)  
**Trigger de revisión:** +1,000 usuarios activos o necesidad de edge computing custom

## Fases de desarrollo

- **Fase 0** ✅ — Fundación: Next.js + Supabase + Auth + Layout
- **Fase 1** — Módulos heredados: Clientes, Productos, Ventas, Pagos
- **Fase 2** — Módulos core: Cobros, Cartera por edades, Dashboard completo
- **Fase 3** — Secundarios: Calendario, Metas, PDF, WhatsApp
- **Fase 4** — Landing + PWA + SEO

## Cómo correr localmente

```bash
# 1. Clonar el repo
git clone <repo-url>
cd seguimientopro

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env.local
# Completar NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY

# 4. Ejecutar el schema en Supabase
# Ir a supabase.com → SQL Editor → pegar contenido de supabase/migrations/001_initial_schema.sql

# 5. Correr en desarrollo
npm run dev
```

## Estructura del proyecto

```
src/
├── app/
│   ├── (auth)/          — login, register
│   └── (dashboard)/     — todas las rutas del CRM
├── components/
│   ├── layout/          — sidebar, header
│   ├── ui/              — shadcn primitivos
│   ├── dashboard/       — KPI cards, charts
│   ├── forms/           — formularios
│   └── tables/          — tablas de datos
├── lib/
│   ├── supabase/        — client, server, middleware
│   └── validations/     — schemas Zod
├── hooks/               — custom hooks
└── types/               — TypeScript types
supabase/
└── migrations/          — SQL schema
```

## Variables de entorno requeridas

Ver `.env.example`

## Seguridad

- Row Level Security (RLS) activado en todas las tablas
- Middleware de autenticación en todas las rutas `/dashboard`
- `.env.local` excluido del repositorio
- Service Role Key nunca expuesta al frontend
