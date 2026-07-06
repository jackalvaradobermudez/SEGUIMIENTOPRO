'use client'

import React, { useState, useRef } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Upload, FileText, CheckCircle2, AlertTriangle, ArrowRight, Trash2 } from 'lucide-react'
import { bulkCreateClientsAction } from '@/app/dashboard/clients/actions'

interface ClientImportRow {
  name: string
  phone: string
  email: string
  address: string
  company: string
  id_number: string
  birthday: string
  notes: string
  errors: Record<string, string>
}

export function ImportCsvModal() {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<1 | 2 | 3>(1) // 1: Upload, 2: Mapping, 3: Preview & Edit
  const [csvHeaders, setCsvHeaders] = useState<string[]>([])
  const [csvDataRows, setCsvDataRows] = useState<string[][]>([])
  const [fileName, setFileName] = useState('')
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  // Mappings state
  const [mapping, setMapping] = useState<Record<string, number>>({
    name: -1,
    phone: -1,
    email: -1,
    address: -1,
    company: -1,
    id_number: -1,
    birthday: -1,
    notes: -1,
  })

  // Parsed and validated items
  const [parsedItems, setParsedItems] = useState<ClientImportRow[]>([])

  const fileInputRef = useRef<HTMLInputElement>(null)

  function resetState() {
    setStep(1)
    setCsvHeaders([])
    setCsvDataRows([])
    setFileName('')
    setParsedItems([])
    setMapping({
      name: -1,
      phone: -1,
      email: -1,
      address: -1,
      company: -1,
      id_number: -1,
      birthday: -1,
      notes: -1,
    })
    setProgress(0)
    setUploading(false)
  }

  // Parser CSV robusto
  function parseCSV(text: string): string[][] {
    const lines: string[][] = []
    let row: string[] = []
    let inQuotes = false
    let currentVal = ''

    for (let i = 0; i < text.length; i++) {
      const char = text[i]
      const nextChar = text[i + 1]

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          currentVal += '"'
          i++
        } else {
          inQuotes = !inQuotes
        }
      } else if ((char === ',' || char === ';') && !inQuotes) {
        row.push(currentVal)
        currentVal = ''
      } else if ((char === '\r' || char === '\n') && !inQuotes) {
        if (char === '\r' && nextChar === '\n') {
          i++
        }
        row.push(currentVal)
        if (row.length > 0 && (row.length > 1 || row[0] !== '')) {
          lines.push(row)
        }
        row = []
        currentVal = ''
      } else {
        currentVal += char
      }
    }
    if (row.length > 0 || currentVal !== '') {
      row.push(currentVal)
      lines.push(row)
    }
    return lines
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith('.csv')) {
      toast.error('Por favor, selecciona un archivo en formato .csv')
      return
    }

    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
      if (!text) {
        toast.error('El archivo CSV está vacío.')
        return
      }

      const rows = parseCSV(text)
      if (rows.length < 2) {
        toast.error('El CSV debe contener al menos una cabecera y una fila de datos.')
        return
      }

      const headers = rows[0].map(h => h.trim().replace(/^"|"$/g, ''))
      const data = rows.slice(1)

      setCsvHeaders(headers)
      setCsvDataRows(data)

      // Auto-mapping inteligente
      const newMapping = { ...mapping }
      const fields = ['name', 'phone', 'email', 'address', 'company', 'id_number', 'birthday', 'notes']
      const terms: Record<string, string[]> = {
        name: ['nombre', 'name', 'cliente', 'full name', 'fullname'],
        phone: ['telefono', 'teléfono', 'phone', 'celular', 'mobile'],
        email: ['correo', 'email', 'mail', 'correo electrónico', 'contacto'],
        address: ['direccion', 'dirección', 'address', 'ubicacion', 'ubicación'],
        company: ['empresa', 'company', 'compañia', 'compañía'],
        id_number: ['documento', 'cedula', 'cédula', 'nit', 'id', 'id_number', 'identificacion', 'identificación'],
        birthday: ['cumpleaños', 'cumpleanos', 'birthday', 'fecha nacimiento', 'nacimiento'],
        notes: ['notas', 'notes', 'descripcion', 'descripción', 'observaciones'],
      }

      fields.forEach((field) => {
        const index = headers.findIndex(h =>
          terms[field].some(term => h.toLowerCase().includes(term))
        )
        if (index !== -1) {
          newMapping[field] = index
        }
      })

      setMapping(newMapping)
      setStep(2)
    }
    reader.readAsText(file, 'UTF-8')
  }

  function handleMappingChange(field: string, colIdx: number) {
    setMapping(prev => ({ ...prev, [field]: colIdx }))
  }

  function validateRow(row: Record<string, string>): Record<string, string> {
    const errors: Record<string, string> = {}
    if (!row.name || row.name.trim() === '') {
      errors.name = 'El nombre es obligatorio.'
    }
    if (row.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) {
      errors.email = 'El formato de correo es inválido.'
    }
    // Opcional: Validar formato de teléfono si es requerido
    return errors
  }

  function applyMapping() {
    if (mapping.name === -1) {
      toast.error('Debes mapear obligatoriamente la columna del Nombre.')
      return
    }

    const items: ClientImportRow[] = csvDataRows.map((csvRow) => {
      const getVal = (fieldIndex: number) => {
        if (fieldIndex === -1 || fieldIndex >= csvRow.length) return ''
        return csvRow[fieldIndex].trim().replace(/^"|"$/g, '')
      }

      const rawRow = {
        name: getVal(mapping.name),
        phone: getVal(mapping.phone),
        email: getVal(mapping.email),
        address: getVal(mapping.address),
        company: getVal(mapping.company),
        id_number: getVal(mapping.id_number),
        birthday: getVal(mapping.birthday),
        notes: getVal(mapping.notes),
      }

      const errors = validateRow(rawRow)

      return {
        ...rawRow,
        errors,
      }
    })

    setParsedItems(items)
    setStep(3)
  }

  function updateItemCell(rowIdx: number, field: keyof Omit<ClientImportRow, 'errors'>, value: string) {
    setParsedItems(prev => {
      const next = [...prev]
      const updatedRow = { ...next[rowIdx], [field]: value }
      const rawRow = { ...updatedRow } as Record<string, unknown>
      delete rawRow.errors
      updatedRow.errors = validateRow(rawRow as Record<string, string>)
      next[rowIdx] = updatedRow
      return next
    })
  }

  function deletePreviewRow(rowIdx: number) {
    setParsedItems(prev => prev.filter((_, idx) => idx !== rowIdx))
  }

  async function submitImport() {
    const hasErrors = parsedItems.some(item => Object.keys(item.errors).length > 0)
    if (hasErrors) {
      toast.error('Corrige las celdas marcadas en rojo antes de continuar.')
      return
    }

    if (parsedItems.length === 0) {
      toast.error('No hay clientes válidos para importar.')
      return
    }

    setUploading(true)
    setProgress(10)

    try {
      // Simular progresión en lotes
      const interval = setInterval(() => {
        setProgress(p => Math.min(p + 15, 90))
      }, 150)

      const result = await bulkCreateClientsAction(parsedItems)
      clearInterval(interval)

      if (result.error) {
        toast.error(result.error)
      } else {
        setProgress(100)
        toast.success(`Se importaron ${result.count} clientes exitosamente.`)
        setOpen(false)
        resetState()
      }
    } catch (err) {
      console.error(err)
      toast.error('Ocurrió un error inesperado al importar los clientes.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(val) => { setOpen(val); if (!val) resetState() }}>
      <DialogTrigger className="inline-flex h-9 items-center justify-center rounded-md border border-slate-200 bg-white px-3 text-xs font-semibold text-[var(--text-primary)] hover:bg-slate-50 hover:text-[var(--brand-700)] transition-all cursor-pointer gap-1.5">
        <Upload size={14} />
        Importar CSV
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col p-6 bg-white border border-slate-200 text-[var(--text-primary)] rounded-xl shadow-2xl overflow-hidden">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <FileText className="text-violet-400" />
            Importación Masiva de Clientes
          </DialogTitle>
          <DialogDescription className="text-slate-500 text-sm">
            Carga y mapea tu archivo CSV de clientes en solo 3 pasos.
          </DialogDescription>
        </DialogHeader>

        {/* Barra de Pasos */}
        <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
              step >= 1 ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-400'
            }`}>1</span>
            <span className={`text-xs font-semibold ${step >= 1 ? 'text-[var(--text-primary)]' : 'text-slate-400'}`}>Cargar archivo</span>
          </div>
          <ArrowRight size={14} className="text-slate-600" />
          <div className="flex items-center gap-2">
            <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
              step >= 2 ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-400'
            }`}>2</span>
            <span className={`text-xs font-semibold ${step >= 2 ? 'text-[var(--text-primary)]' : 'text-slate-400'}`}>Mapear columnas</span>
          </div>
          <ArrowRight size={14} className="text-slate-600" />
          <div className="flex items-center gap-2">
            <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
              step >= 3 ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-400'
            }`}>3</span>
            <span className={`text-xs font-semibold ${step >= 3 ? 'text-[var(--text-primary)]' : 'text-slate-400'}`}>Corregir y Guardar</span>
          </div>
        </div>

        {/* Contenido dinámico */}
        <div className="flex-1 overflow-y-auto mb-6 pr-1">
          {step === 1 && (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 hover:border-violet-400 rounded-xl p-10 bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer group"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".csv"
                className="hidden"
              />
              <div className="h-14 w-14 rounded-full bg-violet-500/10 flex items-center justify-center text-violet-400 group-hover:scale-110 transition-transform shadow-[0_0_24px_rgba(124,92,255,0.1)] mb-4">
                <Upload size={24} />
              </div>
              <p className="text-sm font-bold text-[var(--text-primary)] mb-1.5">Arrastra y suelta tu archivo aquí</p>
              <p className="text-xs text-slate-400">Solo se admiten archivos .csv estructurados con delimitador coma o punto y coma.</p>
              <Button size="sm" className="mt-4 bg-violet-600 hover:bg-violet-500 font-semibold cursor-pointer">
                Seleccionar archivo
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-slate-50 border border-slate-100 rounded-lg p-4 flex items-center gap-3">
                <FileText size={20} className="text-violet-400" />
                <div>
                  <p className="text-xs text-slate-400">Archivo seleccionado</p>
                  <p className="text-sm font-bold text-[var(--text-primary)]">{fileName}</p>
                </div>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-5">
                <h3 className="text-sm font-bold mb-4 text-[var(--text-primary)]">Asociar columnas del CSV</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { key: 'name', label: 'Nombre Completo *', required: true },
                    { key: 'phone', label: 'Teléfono', required: false },
                    { key: 'email', label: 'Correo Electrónico', required: false },
                    { key: 'address', label: 'Dirección', required: false },
                    { key: 'company', label: 'Empresa', required: false },
                    { key: 'id_number', label: 'Documento / NIT', required: false },
                    { key: 'birthday', label: 'Fecha de Nacimiento (YYYY-MM-DD)', required: false },
                    { key: 'notes', label: 'Notas / Observaciones', required: false },
                  ].map((field) => (
                    <div key={field.key} className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-slate-400">
                        {field.label}
                      </label>
                      <select
                        value={mapping[field.key]}
                        onChange={(e) => handleMappingChange(field.key, Number(e.target.value))}
                        className="w-full bg-white border border-slate-200 rounded-lg text-sm text-[var(--text-primary)] px-3 py-2 focus:border-violet-500 focus:outline-none transition-colors"
                      >
                        <option value={-1}>
                          {field.required ? '— Selecciona una columna (Requerido) —' : '— Omitir campo —'}
                        </option>
                        {csvHeaders.map((header, colIdx) => (
                          <option key={colIdx} value={colIdx}>
                            CSV: {header}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-fade-in flex flex-col h-full">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[var(--text-primary)]">
                  Vista previa de {parsedItems.length} registros cargados
                </span>
                <span className="text-xs text-slate-500">
                  Haz doble clic o escribe en cualquier celda para corregir errores.
                </span>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white max-h-[350px] overflow-y-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="p-3 font-semibold text-slate-400 text-center w-8">#</th>
                      <th className="p-3 font-semibold text-slate-400">Nombre *</th>
                      <th className="p-3 font-semibold text-slate-400">Teléfono</th>
                      <th className="p-3 font-semibold text-slate-400">Email</th>
                      <th className="p-3 font-semibold text-slate-400">Doc. ID</th>
                      <th className="p-3 font-semibold text-slate-400">Empresa</th>
                      <th className="p-3 font-semibold text-slate-400">Dirección</th>
                      <th className="p-3 font-semibold text-slate-400 text-center w-10">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsedItems.map((item, rowIdx) => (
                      <tr key={rowIdx} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                        <td className="p-3 text-slate-500 text-center">{rowIdx + 1}</td>
                        <td className="p-1">
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => updateItemCell(rowIdx, 'name', e.target.value)}
                            className={`w-full bg-transparent border-0 px-2 py-1.5 focus:bg-slate-100 rounded transition-colors ${
                              item.errors.name ? 'border border-red-500 bg-red-50 text-red-600' : 'text-[var(--text-primary)]'
                            }`}
                            title={item.errors.name}
                          />
                        </td>
                        <td className="p-1">
                          <input
                            type="text"
                            value={item.phone}
                            onChange={(e) => updateItemCell(rowIdx, 'phone', e.target.value)}
                            className="w-full bg-transparent border-0 px-2 py-1.5 focus:bg-slate-100 rounded transition-colors text-[var(--text-primary)]"
                          />
                        </td>
                        <td className="p-1">
                          <input
                            type="text"
                            value={item.email}
                            onChange={(e) => updateItemCell(rowIdx, 'email', e.target.value)}
                            className={`w-full bg-transparent border-0 px-2 py-1.5 focus:bg-slate-100 rounded transition-colors ${
                              item.errors.email ? 'border border-red-500 bg-red-50 text-red-600' : 'text-[var(--text-primary)]'
                            }`}
                            title={item.errors.email}
                          />
                        </td>
                        <td className="p-1">
                          <input
                            type="text"
                            value={item.id_number}
                            onChange={(e) => updateItemCell(rowIdx, 'id_number', e.target.value)}
                            className="w-full bg-transparent border-0 px-2 py-1.5 focus:bg-slate-100 rounded transition-colors text-[var(--text-primary)]"
                          />
                        </td>
                        <td className="p-1">
                          <input
                            type="text"
                            value={item.company}
                            onChange={(e) => updateItemCell(rowIdx, 'company', e.target.value)}
                            className="w-full bg-transparent border-0 px-2 py-1.5 focus:bg-slate-100 rounded transition-colors text-[var(--text-primary)]"
                          />
                        </td>
                        <td className="p-1">
                          <input
                            type="text"
                            value={item.address}
                            onChange={(e) => updateItemCell(rowIdx, 'address', e.target.value)}
                            className="w-full bg-transparent border-0 px-2 py-1.5 focus:bg-slate-100 rounded transition-colors text-[var(--text-primary)]"
                          />
                        </td>
                        <td className="p-1 text-center">
                          <button
                            onClick={() => deletePreviewRow(rowIdx)}
                            className="text-slate-500 hover:text-red-400 p-1.5 rounded transition-colors cursor-pointer"
                            title="Eliminar fila"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {parsedItems.some(item => Object.keys(item.errors).length > 0) && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg p-3.5 flex items-start gap-2.5">
                  <AlertTriangle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Se encontraron errores de validación</p>
                    <p className="mt-0.5">Corrige los campos indicados en rojo (con tooltip de error) antes de continuar con la importación.</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Botones de Navegación de Pasos */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-4 bg-transparent mt-auto">
          {step > 1 ? (
            <Button
              variant="outline"
              onClick={() => setStep(prev => (prev - 1) as 1 | 2)}
              disabled={uploading}
              className="border-slate-200 text-[var(--text-primary)] hover:bg-slate-50 hover:text-[var(--brand-700)] cursor-pointer"
            >
              Atrás
            </Button>
          ) : (
            <div />
          )}

          {uploading ? (
            <div className="w-full max-w-[240px] space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-slate-400">
                <span>Guardando en base de datos...</span>
                <span>{progress}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-violet-500 to-violet-400 rounded-full transition-all duration-150"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : (
            <>
              {step === 2 && (
                <Button
                  onClick={applyMapping}
                  className="bg-violet-600 hover:bg-violet-500 font-semibold cursor-pointer"
                >
                  Confirmar Mapping
                </Button>
              )}
              {step === 3 && (
                <Button
                  onClick={submitImport}
                  disabled={parsedItems.length === 0}
                  className="bg-violet-600 hover:bg-violet-500 font-semibold cursor-pointer"
                >
                  <CheckCircle2 size={16} className="mr-1.5" />
                  Importar {parsedItems.length} Clientes
                </Button>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
