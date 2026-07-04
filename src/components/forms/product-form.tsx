'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, useWatch, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { productSchema, type ProductFormData } from '@/lib/validations/product'
import { createProductAction, updateProductAction } from '@/app/dashboard/products/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { UNIT_OPTIONS } from '@/lib/constants'

type ProductFormProps = {
  productId?: string
  defaultValues?: Partial<ProductFormData>
}

export function ProductForm({ productId, defaultValues }: ProductFormProps) {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const isEditing = !!productId

  const form = useForm<ProductFormData>({
    // z.coerce fields make the resolver's input type diverge from ProductFormData; cast is safe at runtime.
    resolver: zodResolver(productSchema) as Resolver<ProductFormData>,
    defaultValues: {
      name: '',
      description: '',
      category: '',
      sku: '',
      default_price: 0,
      cost_price: 0,
      unit: 'unidad',
      track_stock: false,
      stock: 0,
      stock_minimum: 0,
      ...defaultValues,
    },
  })

  const trackStock = useWatch({ control: form.control, name: 'track_stock' })

  async function onSubmit(values: ProductFormData) {
    setSubmitting(true)

    const formData = new FormData()
    formData.set('name', values.name)
    formData.set('description', values.description ?? '')
    formData.set('category', values.category ?? '')
    formData.set('sku', values.sku ?? '')
    formData.set('default_price', String(values.default_price))
    formData.set('cost_price', values.cost_price != null ? String(values.cost_price) : '')
    formData.set('unit', values.unit)
    formData.set('track_stock', String(values.track_stock))
    formData.set('stock', String(values.stock))
    formData.set('stock_minimum', String(values.stock_minimum))

    const result = isEditing
      ? await updateProductAction(productId!, formData)
      : await createProductAction(formData)

    if (result?.error) {
      toast.error(result.error)
      setSubmitting(false)
      return
    }

    toast.success(isEditing ? 'Producto actualizado' : 'Producto creado')
    router.push('/dashboard/products')
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5" id="product-form">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre *</FormLabel>
              <FormControl>
                <Input placeholder="Nombre del producto" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea placeholder="Descripción del producto" rows={2} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoría</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: Bebidas" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sku"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SKU</FormLabel>
                <FormControl>
                  <Input placeholder="Código del producto" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <FormField
            control={form.control}
            name="default_price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Precio de venta *</FormLabel>
                <FormControl>
                  <Input type="number" min={0} step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cost_price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Precio de costo</FormLabel>
                <FormControl>
                  <Input type="number" min={0} step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="unit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unidad</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona unidad" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {UNIT_OPTIONS.map((unit) => (
                      <SelectItem key={unit} value={unit}>
                        {unit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="track_stock"
          render={({ field }) => (
            <FormItem className="flex-row items-center gap-2">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <FormLabel className="cursor-pointer">Controlar inventario</FormLabel>
            </FormItem>
          )}
        />

        {trackStock && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock actual</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="stock_minimum"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock mínimo</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        <Button type="submit" id="product-form-submit" disabled={submitting} className="self-start">
          {submitting ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear producto'}
        </Button>
      </form>
    </Form>
  )
}
