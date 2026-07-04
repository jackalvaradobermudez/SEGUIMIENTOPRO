'use client'

import { useState } from 'react'
import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { goalSchema, type GoalFormData } from '@/lib/validations/goal'
import { upsertGoalAction } from '@/app/dashboard/settings/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

export function GoalForm({
  goal,
}: {
  goal: { sales_target: number; collection_target: number } | null
}) {
  const [submitting, setSubmitting] = useState(false)
  const now = new Date()
  const monthName = MONTH_NAMES[now.getMonth()]

  const form = useForm<GoalFormData>({
    resolver: zodResolver(goalSchema) as Resolver<GoalFormData>,
    defaultValues: {
      sales_target: goal?.sales_target ?? 0,
      collection_target: goal?.collection_target ?? 0,
    },
  })

  async function onSubmit(values: GoalFormData) {
    setSubmitting(true)
    const formData = new FormData()
    formData.set('sales_target', String(values.sales_target))
    formData.set('collection_target', String(values.collection_target))
    const result = await upsertGoalAction(formData)
    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success(`Meta de ${monthName} guardada`)
    }
    setSubmitting(false)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">
          Define las metas para <strong>{monthName}</strong>. Estas aparecerán en tu dashboard.
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="sales_target"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Meta de ventas</FormLabel>
                <FormControl>
                  <Input type="number" min={0} step="0.01" placeholder="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="collection_target"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Meta de recaudo</FormLabel>
                <FormControl>
                  <Input type="number" min={0} step="0.01" placeholder="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={submitting} className="self-start">
          {submitting ? 'Guardando...' : 'Guardar meta'}
        </Button>
      </form>
    </Form>
  )
}
