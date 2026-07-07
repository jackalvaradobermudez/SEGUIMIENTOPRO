"use client";

import { useState } from "react";
import Link from "next/link";
import {
  useForm,
  useFieldArray,
  useWatch,
  type Resolver,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Check, ChevronsUpDown, Plus, CalendarIcon } from "lucide-react";
import { saleSchema, type SaleFormData } from "@/lib/validations/sale";
import { createSaleAction } from "@/app/dashboard/sales/actions";
import { trackEvent } from "@/lib/analytics/gtag";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  SaleItemRow,
  type ProductOption,
} from "@/components/forms/sale-item-row";
import { PAYMENT_METHOD_OPTIONS } from "@/lib/constants";
import { cn, formatCurrency, formatDate } from "@/lib/utils";

export type ClientOption = { id: string; name: string; phone: string | null };

export function SaleForm({
  clients,
  products,
  currency,
}: {
  clients: ClientOption[];
  products: ProductOption[];
  currency: string;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [clientPopoverOpen, setClientPopoverOpen] = useState(false);

  const form = useForm<SaleFormData>({
    // z.coerce fields make the resolver's input type diverge from SaleFormData; cast is safe at runtime.
    resolver: zodResolver(saleSchema) as Resolver<SaleFormData>,
    defaultValues: {
      client_id: "",
      sale_type: "cash",
      sale_date: new Date().toISOString().split("T")[0],
      due_date: "",
      installments: 1,
      discount: 0,
      payment_method: "cash",
      notes: "",
      items: [{ description: "", quantity: 1, unit_price: 0 }],
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "items",
  });
  const saleType = useWatch({ control: form.control, name: "sale_type" });
  const clientId = useWatch({ control: form.control, name: "client_id" });
  const discount = useWatch({ control: form.control, name: "discount" }) || 0;
  const items = useWatch({ control: form.control, name: "items" });

  const selectedClient = clients.find((c) => c.id === clientId);
  const subtotal = items.reduce(
    (sum, item) =>
      sum + (Number(item.quantity) || 0) * (Number(item.unit_price) || 0),
    0,
  );
  const total = Math.max(subtotal - Number(discount), 0);

  function handleSelectProduct(index: number, product: ProductOption) {
    update(index, {
      ...form.getValues(`items.${index}`),
      product_id: product.id,
      description: product.name,
      unit_price: product.default_price,
    });
  }

  async function onSubmit(values: SaleFormData) {
    setSubmitting(true);
    const result = await createSaleAction(values);

    if (result && 'error' in result) {
      toast.error(result.error);
      setSubmitting(false);
      return;
    }

    toast.success("Venta registrada");
    trackEvent("sale_created", { sale_type: values.sale_type });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
        id="sale-form"
      >
        <FormField
          control={form.control}
          name="client_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cliente *</FormLabel>
              <Popover
                open={clientPopoverOpen}
                onOpenChange={setClientPopoverOpen}
              >
                <PopoverTrigger
                  render={
                    <Button
                      variant="outline"
                      role="combobox"
                      className="w-full justify-between font-normal sm:w-80"
                    />
                  }
                >
                  <span className="truncate">
                    {selectedClient
                      ? `${selectedClient.name}${selectedClient.phone ? ` · ${selectedClient.phone}` : ""}`
                      : "Selecciona un cliente..."}
                  </span>
                  <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0">
                  <Command>
                    <CommandInput placeholder="Buscar cliente..." />
                    <CommandList>
                      <CommandEmpty>
                        <div className="flex flex-col items-center gap-2 py-2">
                          <span>No se encontró el cliente.</span>
                          <Link
                            href="/dashboard/clients/new"
                            target="_blank"
                            id="sale-form-new-client-link"
                            className="text-accent underline"
                          >
                            Crear cliente nuevo
                          </Link>
                        </div>
                      </CommandEmpty>
                      <CommandGroup>
                        {clients.map((client) => (
                          <CommandItem
                            key={client.id}
                            value={`${client.name} ${client.phone ?? ""}`}
                            onSelect={() => {
                              field.onChange(client.id);
                              setClientPopoverOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 size-4",
                                field.value === client.id
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                            {client.name}
                            {client.phone && (
                              <span className="ml-2 text-muted-foreground">
                                {client.phone}
                              </span>
                            )}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sale_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de venta</FormLabel>
              <Tabs value={field.value} onValueChange={field.onChange}>
                <TabsList>
                  <TabsTrigger value="cash" id="sale-type-cash">
                    Contado
                  </TabsTrigger>
                  <TabsTrigger value="credit" id="sale-type-credit">
                    Crédito
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </FormItem>
          )}
        />

        {saleType === "credit" && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="due_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha de vencimiento *</FormLabel>
                  <Popover>
                    <PopoverTrigger
                      render={
                        <Button
                          variant="outline"
                          className="w-full justify-start font-normal"
                        />
                      }
                    >
                      <CalendarIcon className="mr-2 size-4" />
                      {field.value
                        ? formatDate(field.value)
                        : "Selecciona una fecha"}
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={
                          field.value
                            ? new Date(`${field.value}T00:00:00`)
                            : undefined
                        }
                        onSelect={(date) =>
                          field.onChange(
                            date ? date.toISOString().split("T")[0] : "",
                          )
                        }
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sale_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha de venta</FormLabel>
                  <Popover>
                    <PopoverTrigger
                      render={
                        <Button
                          variant="outline"
                          className="w-full justify-start font-normal sm:w-64"
                        />
                      }
                    >
                      <CalendarIcon className="mr-2 size-4" />
                      {field.value
                        ? formatDate(field.value)
                        : "Selecciona una fecha"}
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={
                          field.value
                            ? new Date(`${field.value}T00:00:00`)
                            : undefined
                        }
                        onSelect={(date) =>
                          field.onChange(
                            date ? date.toISOString().split("T")[0] : "",
                          )
                        }
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="installments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de cuotas</FormLabel>
                  <FormControl>
                    <Input type="number" min={1} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        <div className="flex flex-col gap-3">
          {/* Label decorativo de sección — no pertenece a un FormField, usa <p> para no romper useFormField() */}
          <p className="text-sm font-medium leading-none">Productos *</p>
          {fields.map((item, index) => (
            <SaleItemRow
              key={item.id}
              index={index}
              control={form.control}
              products={products}
              currency={currency}
              quantity={Number(items[index]?.quantity) || 0}
              unitPrice={Number(items[index]?.unit_price) || 0}
              onSelectProduct={handleSelectProduct}
              onRemove={() => remove(index)}
              canRemove={fields.length > 1}
            />
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="self-start"
            id="add-sale-item"
            onClick={() =>
              append({ description: "", quantity: 1, unit_price: 0 })
            }
          >
            <Plus className="size-4" />
            Agregar línea
          </Button>
        </div>

        <div className="ml-auto flex w-full max-w-xs flex-col gap-2 rounded-[var(--radius-md)] border border-[var(--border)] p-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatCurrency(subtotal, currency)}</span>
          </div>
          <FormField
            control={form.control}
            name="discount"
            render={({ field }) => (
              <FormItem className="flex-row items-center justify-between gap-2 space-y-0">
                <FormLabel className="text-muted-foreground">
                  Descuento
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    step="0.01"
                    className="w-28"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="flex items-center justify-between border-t border-[var(--border)] pt-2 font-semibold">
            <span>Total</span>
            <span>{formatCurrency(total, currency)}</span>
          </div>
        </div>

        <FormField
          control={form.control}
          name="payment_method"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Método de pago</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-56">
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {PAYMENT_METHOD_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notas</FormLabel>
              <FormControl>
                <Textarea placeholder="Notas de la venta" rows={2} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          id="sale-form-submit"
          disabled={submitting}
          className="self-start"
        >
          {submitting ? "Registrando..." : "Registrar venta"}
        </Button>
      </form>
    </Form>
  );
}
