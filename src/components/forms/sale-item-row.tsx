'use client'

import { useState } from 'react'
import type { Control } from 'react-hook-form'
import { Check, ChevronsUpDown, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { cn, formatCurrency } from '@/lib/utils'
import type { SaleFormData } from '@/lib/validations/sale'

export type ProductOption = { id: string; name: string; default_price: number }

export function SaleItemRow({
  index,
  control,
  products,
  currency,
  quantity,
  unitPrice,
  onSelectProduct,
  onRemove,
  canRemove,
}: {
  index: number
  control: Control<SaleFormData>
  products: ProductOption[]
  currency: string
  quantity: number
  unitPrice: number
  onSelectProduct: (index: number, product: ProductOption) => void
  onRemove: () => void
  canRemove: boolean
}) {
  const [open, setOpen] = useState(false)
  const subtotal = (quantity || 0) * (unitPrice || 0)

  return (
    <div className="grid grid-cols-1 items-start gap-3 sm:grid-cols-[1fr_100px_120px_120px_36px]">
      <FormField
        control={control}
        name={`items.${index}.description`}
        render={({ field }) => (
          <FormItem>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger
                render={
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between font-normal"
                  />
                }
              >
                <span className="truncate">{field.value || 'Selecciona un producto...'}</span>
                <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
              </PopoverTrigger>
              <PopoverContent className="w-72 p-0">
                <Command>
                  <CommandInput placeholder="Buscar producto..." />
                  <CommandList>
                    <CommandEmpty>Sin resultados. Escribe una descripción libre.</CommandEmpty>
                    <CommandGroup>
                      {products.map((product) => (
                        <CommandItem
                          key={product.id}
                          value={product.name}
                          onSelect={() => {
                            onSelectProduct(index, product)
                            setOpen(false)
                          }}
                        >
                          <Check
                            className={cn(
                              'mr-2 size-4',
                              field.value === product.name ? 'opacity-100' : 'opacity-0'
                            )}
                          />
                          {product.name} · {formatCurrency(product.default_price, currency)}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <FormControl>
              <input type="hidden" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name={`items.${index}.quantity`}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input type="number" min={0.01} step="0.01" placeholder="Cant." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name={`items.${index}.unit_price`}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input type="number" min={0} step="0.01" placeholder="Precio" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="flex h-9 items-center text-sm text-muted-foreground">
        {formatCurrency(subtotal, currency)}
      </div>

      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={onRemove}
        disabled={!canRemove}
        aria-label="Eliminar línea"
      >
        <X className="size-4" />
      </Button>
    </div>
  )
}
