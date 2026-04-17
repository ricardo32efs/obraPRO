import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CATEGORIAS_MANO,
  FREE_MONTHLY_BUDGET_LIMIT,
  GASTOS_SUGERIDOS,
  TAREAS_MANO_DEFAULT,
  TIPOS_TRABAJO,
  UNIDADES_MANO,
  UNIDADES_MATERIAL,
} from '../../utils/constants'
import { puedeCrearPresupuestoGratis, countPresupuestosCreadosEsteMes } from '../../utils/presupuestoHelpers'
import { computePresupuestoTotals } from '../../utils/computeTotals'
import { formatCurrency, parseCurrencyInput } from '../../utils/formatCurrency'
import { validatePresupuestoForm } from '../../utils/validateForm'
import { findMaterialByName } from '../../utils/materialesDB'
import {
  getMaterialesClaveFaltantes,
  mergeCondicionesProfesionales,
} from '../../utils/presupuestoProfesional'
import {
  PLANTILLAS_TIPO_OBRA,
  getChecklistCierrePorTipo,
  runAuditoriaExtrema,
} from '../../utils/auditoriaExtrema'
import { AutocompleteMaterial } from './AutocompleteMaterial'
import { PanelTotales } from './PanelTotales'
import { PreviewModal } from '../Preview/PreviewModal'
import { generatePresupuestoPDF } from '../../utils/generatePDF'
import { exportPresupuestoExcel } from '../../utils/exportExcel'
import { loadNumeroCounter, formatNumeroObra, saveNumeroCounter } from '../../hooks/useNumeroCorrelativo'
import { ConfirmDialog } from '../UI/ConfirmDialog'
import { EmailSendModal } from '../UI/EmailSendModal'
import { ModalPlantillas } from '../Plantillas/ModalPlantillas'
import { useToast } from '../UI/ToastNotification'
import { useIAGemini } from '../../hooks/useIAGemini'
import { AsistenteIAResultado } from './AsistenteIA'

const newId = () => crypto.randomUUID()

const emptyMaterial = () => ({
  id: newId(),
  nombre: '',
  unidad: 'm²',
  cantidad: 1,
  precioUnitario: 0,
})

const emptyMano = () => ({
  id: newId(),
  descripcion: '',
  categoria: 'Oficial',
  cantidad: 1,
  unidad: 'día',
  precioUnitario: 0,
})

const emptyGasto = () => ({
  id: newId(),
  concepto: '',
  monto: 0,
  esPorcentaje: false,
  porcentaje: 0,
})

function addDaysISO(iso, days) {
  if (!iso) return ''
  const d = new Date(iso)
  d.setDate(d.getDate() + Number(days || 0))
  return d.toISOString().slice(0, 10)
}

/**
 * Pantalla principal — nuevo presupuesto con paneles responsive
 */
export function NuevoPresupuesto({
  empresa,
  isPro,
  onRequestUpgrade,
  presupuestos,
  setPresupuestos,
  plantillas,
  setPlantillas,
  initialDraft,
  onClearInitial,
}) {
  const { push: toast } = useToast()

  const [numeroManual, setNumeroManual] = useState('')
  const [form, setForm] = useState(() => ({
    clienteNombre: '',
    clienteTelefono: '',
    clienteEmail: '',
    direccionObra: '',
    tipoTrabajo: TIPOS_TRABAJO[0],
    tipoTrabajoOtro: '',
    descripcion: '',
    fechaInicio: new Date().toISOString().slice(0, 10),
    fechaEntrega: addDaysISO(new Date().toISOString().slice(0, 10), 30),
    validezDias: '',
    materiales: [emptyMaterial()],
    manoObra: [],
    gastosAdicionales: [],
    gastosOpen: false,
    incluirIva: false,
    anticipoPct: 30,
    margenPct: 20,
    contingenciaPct: 10,
    includeEscenariosPdf: false,
    includeAnticipoPdf: false,
    includeChecklistCierrePdf: false,
    includeFirmasPdf: true,
    checklistPersonalizado: '',
    condiciones: empresa?.condicionesDefault || '',
    estado: 'borrador',
  }))

  const [fieldErrors, setFieldErrors] = useState({})
  const [previewOpen, setPreviewOpen] = useState(false)
  const [emailSendOpen, setEmailSendOpen] = useState(false)
  const [emailModalInstance, setEmailModalInstance] = useState(0)
  const [confirmDiscard, setConfirmDiscard] = useState(false)
  const [plantillasOpen, setPlantillasOpen] = useState(false)
  const [dragMatIdx, setDragMatIdx] = useState(null)
  const [iaOpen, setIaOpen] = useState(false)
  const [iaDescripcion, setIaDescripcion] = useState('')
  const [iaResult, setIaResult] = useState(null)
  const { sugerir, loading: iaLoading, error: iaError, setError: setIaError } = useIAGemini()

  /** ID estable para borradores nuevos (evita un Nº distinto en cada guardado) */
  const sessionIdRef = useRef(null)
  useEffect(() => {
    if (initialDraft?.id) sessionIdRef.current = initialDraft.id
  }, [initialDraft?.id])
  const presupuestoId =
    initialDraft?.id || sessionIdRef.current || (sessionIdRef.current = newId())

  const numero = useMemo(() => {
    if (numeroManual.trim()) return numeroManual.trim()
    const { next } = loadNumeroCounter()
    return formatNumeroObra(next)
  }, [numeroManual])

  const totals = useMemo(() => computePresupuestoTotals(form), [form])
  const materialesClaveFaltantes = useMemo(
    () => getMaterialesClaveFaltantes(form.tipoTrabajo, form.materiales),
    [form.tipoTrabajo, form.materiales],
  )
  const auditoria = useMemo(() => runAuditoriaExtrema(form, totals), [form, totals])
  const shouldShowAuditoria = useMemo(() => {
    const hasCliente = Boolean(form.clienteNombre.trim() && form.direccionObra.trim())
    const hasMaterial = form.materiales.some((m) => String(m.nombre || '').trim() && Number(m.cantidad) > 0)
    const hasManoObra = form.manoObra.some((m) => String(m.descripcion || '').trim() && Number(m.cantidad) > 0)
    return hasCliente && (hasMaterial || hasManoObra)
  }, [form.clienteNombre, form.direccionObra, form.materiales, form.manoObra])
  const checklistCierre = useMemo(() => {
    const base = getChecklistCierrePorTipo(form.tipoTrabajo)
    const extra = String(form.checklistPersonalizado || '')
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)
    return [...base, ...extra]
  }, [form.tipoTrabajo, form.checklistPersonalizado])

  const buildPayload = useCallback(() => {
    const fechaEmision = new Date().toISOString().slice(0, 10)
    const validoHasta = addDaysISO(fechaEmision, form.validezDias)
    const totalConContingencia = totals.totalFinal * (1 + Number(form.contingenciaPct || 0) / 100)
    const precioSugeridoMargen = totals.totalFinal * (1 + Number(form.margenPct || 0) / 100)
    const precioSugeridoMargenContingencia =
      totalConContingencia * (1 + Number(form.margenPct || 0) / 100)
    return {
      id: presupuestoId,
      numero,
      fechaEmision,
      validoHasta,
      empresa,
      clienteNombre: form.clienteNombre,
      clienteTelefono: form.clienteTelefono,
      clienteEmail: form.clienteEmail,
      direccionObra: form.direccionObra,
      tipoTrabajo: form.tipoTrabajo,
      tipoTrabajoOtro: form.tipoTrabajoOtro,
      descripcion: form.descripcion,
      fechaInicio: form.fechaInicio,
      fechaEntrega: form.fechaEntrega,
      materiales: form.materiales,
      manoObra: form.manoObra,
      gastosAdicionales: totals.gastosRowsComputed,
      subtotalMateriales: totals.subtotalMateriales,
      subtotalMano: totals.subtotalMano,
      subtotalGastos: totals.subtotalGastos,
      subtotal: totals.subtotal,
      incluirIva: form.incluirIva,
      ivaMonto: totals.ivaMonto,
      totalFinal: totals.totalFinal,
      anticipoPct: form.anticipoPct,
      anticipoMonto: totals.anticipoMonto,
      margenPct: form.margenPct,
      contingenciaPct: form.contingenciaPct,
      includeEscenariosPdf: form.includeEscenariosPdf,
      includeAnticipoPdf: form.includeAnticipoPdf,
      includeChecklistCierrePdf: form.includeChecklistCierrePdf,
      includeFirmasPdf: form.includeFirmasPdf,
      totalConContingencia,
      precioSugeridoMargen,
      precioSugeridoMargenContingencia,
      checklistCierre,
      condiciones: form.condiciones,
      validezDias: form.validezDias,
    }
  }, [checklistCierre, empresa, form, numero, presupuestoId, totals])

  const applyIAResult = (data) => {
    if (!data) return
    setForm((f) => ({
      ...f,
      tipoTrabajo: data.tipo_trabajo || f.tipoTrabajo,
      materiales: data.materiales?.length
        ? data.materiales.map((m) => ({
            id: newId(),
            nombre: m.nombre,
            unidad: m.unidad,
            cantidad: m.cantidad,
            precioUnitario: m.precio_unitario_estimado,
          }))
        : f.materiales,
      manoObra: data.mano_de_obra?.length
        ? data.mano_de_obra.map((m) => ({
            id: newId(),
            descripcion: m.descripcion,
            categoria: m.categoria,
            unidad: m.unidad,
            cantidad: m.cantidad,
            precioUnitario: m.precio_unitario_estimado,
          }))
        : f.manoObra,
      gastosAdicionales: data.gastos_adicionales?.length
        ? data.gastos_adicionales.map((g) => ({
            id: newId(),
            concepto: g.concepto,
            monto: g.monto_estimado,
            esPorcentaje: false,
          }))
        : f.gastosAdicionales,
    }))
    setIaResult(null)
    setIaOpen(false)
    toast('¡Listo! Revisá y ajustá los valores generados por la IA.', 'success')
  }

  const validateAll = () => {
    const v = validatePresupuestoForm(form)
    setFieldErrors(v.errors)
    if (!v.ok) {
      toast(Object.values(v.errors)[0] || 'Revisá los campos marcados.', 'warning')
    }
    return v.ok
  }

  const checkFreeLimit = () => {
    if (
      puedeCrearPresupuestoGratis({
        isPro,
        presupuestos,
        presupuestoIdActual: presupuestoId,
      })
    ) {
      return true
    }
    onRequestUpgrade?.()
    return false
  }

  const persistPresupuesto = (extra = {}, meta = {}) => {
    const toastMsg = meta.toastMsg ?? 'Presupuesto guardado'
    const payload = { ...buildPayload(), ...extra }
    const id = presupuestoId
    const existedBefore = presupuestos.some((p) => p.id === id)
    const prev = presupuestos.find((p) => p.id === id)
    const nowIso = new Date().toISOString()
    const creadoEn = existedBefore ? (prev?.creadoEn || prev?.updatedAt || nowIso) : nowIso
    const record = {
      id,
      ...payload,
      estado: extra.estado || form.estado,
      creadoEn,
      updatedAt: nowIso,
    }
    setPresupuestos((p0) => {
      const idx = p0.findIndex((p) => p.id === id)
      if (idx >= 0) {
        const copy = [...p0]
        copy[idx] = record
        return copy
      }
      return [record, ...p0]
    })
    if (!existedBefore) {
      const { next } = loadNumeroCounter()
      saveNumeroCounter(next + 1)
    }
    if (!meta.skipClearInitial) onClearInitial?.()
    if (!meta.silentToast) toast(toastMsg, 'success')
    return record
  }

  const openPreview = () => {
    if (!validateAll()) return
    setPreviewOpen(true)
  }

  const handlePdf = () => {
    if (!validateAll()) return
    const exists = presupuestos.some((p) => p.id === presupuestoId)
    if (!exists && !isPro && !checkFreeLimit()) return
    try {
      generatePresupuestoPDF(buildPayload(), { isPro })
      toast('PDF descargado', 'success')
    } catch {
      toast('Error al generar el PDF', 'error')
    }
  }

  const handleSaveDraft = () => {
    const exists = presupuestos.some((p) => p.id === presupuestoId)
    if (!exists && !checkFreeLimit()) return
    persistPresupuesto({ estado: 'borrador' })
  }

  const addMaterialRapido = (nombreMaterial) => {
    const base = findMaterialByName(nombreMaterial)
    setForm((f) => ({
      ...f,
      materiales: [
        ...f.materiales,
        {
          id: newId(),
          nombre: nombreMaterial,
          unidad: base?.unidad || 'unidad',
          cantidad: 1,
          precioUnitario: 0,
        },
      ],
    }))
    toast(`Agregado: ${nombreMaterial}`, 'success')
  }

  const aplicarPlantillaTipoObra = () => {
    const tpl = PLANTILLAS_TIPO_OBRA[form.tipoTrabajo]
    if (!tpl) {
      toast('No hay plantilla rápida para este tipo de trabajo.', 'warning')
      return
    }
    setForm((f) => ({
      ...f,
      materiales: tpl.materiales.map((m) => ({ id: newId(), ...m })),
      manoObra: tpl.manoObra.map((m) => ({ id: newId(), ...m })),
      gastosAdicionales: (tpl.gastosAdicionales || []).map((g) => ({ id: newId(), ...g })),
    }))
    toast(`Plantilla aplicada: ${form.tipoTrabajo}`, 'success')
  }

  // Cargar borrador / edición desde historial (una vez por id de presupuesto).
  useEffect(() => {
    if (!initialDraft?.id) return
    setForm((f) => ({
      ...f,
      clienteNombre: initialDraft.clienteNombre || '',
      clienteTelefono: initialDraft.clienteTelefono || '',
      clienteEmail: initialDraft.clienteEmail || '',
      direccionObra: initialDraft.direccionObra || '',
      tipoTrabajo: initialDraft.tipoTrabajo || TIPOS_TRABAJO[0],
      tipoTrabajoOtro: initialDraft.tipoTrabajoOtro || '',
      descripcion: initialDraft.descripcion || '',
      fechaInicio: initialDraft.fechaInicio || f.fechaInicio,
      fechaEntrega: initialDraft.fechaEntrega || f.fechaEntrega,
      validezDias: initialDraft.validezDias ?? '',
      materiales:
        initialDraft.materiales?.length > 0
          ? initialDraft.materiales.map((m) => ({ ...m, id: m.id || newId() }))
          : [emptyMaterial()],
      manoObra: initialDraft.manoObra?.map((m) => ({ ...m, id: m.id || newId() })) || [],
      gastosAdicionales: initialDraft.gastosAdicionales?.map((g) => ({ ...g, id: g.id || newId() })) || [],
      incluirIva: !!initialDraft.incluirIva,
      anticipoPct: initialDraft.anticipoPct ?? 30,
      margenPct: initialDraft.margenPct ?? 20,
      contingenciaPct: initialDraft.contingenciaPct ?? 10,
      includeEscenariosPdf: initialDraft.includeEscenariosPdf ?? false,
      includeAnticipoPdf: initialDraft.includeAnticipoPdf ?? false,
      includeChecklistCierrePdf: initialDraft.includeChecklistCierrePdf ?? false,
      includeFirmasPdf: initialDraft.includeFirmasPdf ?? true,
      checklistPersonalizado: '',
      condiciones: initialDraft.condiciones || empresa?.condicionesDefault || '',
      estado: initialDraft.estado || 'borrador',
    }))
    setNumeroManual(initialDraft.numero || '')
    // eslint-disable-next-line react-hooks/exhaustive-deps -- entradas enlazadas a initialDraft.id únicamente
  }, [initialDraft?.id])

  const reorderMateriales = (from, to) => {
    if (from == null || to == null || from === to) return
    setForm((f) => {
      const arr = [...f.materiales]
      const [item] = arr.splice(from, 1)
      arr.splice(to, 0, item)
      return { ...f, materiales: arr }
    })
  }

  const applyTemplate = (tpl) => {
    setForm((f) => ({
      ...f,
      clienteNombre: '',
      clienteTelefono: '',
      clienteEmail: '',
      tipoTrabajo: tpl.tipoTrabajo || f.tipoTrabajo,
      tipoTrabajoOtro: tpl.tipoTrabajoOtro || '',
      descripcion: tpl.descripcion || '',
      validezDias: tpl.validezDias ?? f.validezDias,
      materiales: tpl.materiales?.length ? tpl.materiales.map((m) => ({ ...m, id: newId() })) : [emptyMaterial()],
      manoObra: tpl.manoObra?.map((m) => ({ ...m, id: newId() })) || [],
      gastosAdicionales: tpl.gastosAdicionales?.map((g) => ({ ...g, id: newId() })) || [],
      incluirIva: !!tpl.incluirIva,
      anticipoPct: tpl.anticipoPct ?? f.anticipoPct,
      condiciones: tpl.condiciones || f.condiciones,
    }))
    sessionIdRef.current = newId()
    setNumeroManual('')
    setPlantillasOpen(false)
    toast('Plantilla aplicada', 'success')
  }

  return (
    <div className="pb-24 pt-4 lg:pb-8">
      <div className="mb-4 px-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-text-2)]">
              Presupuesto N°
            </p>
            <input
              className="font-mono text-lg font-bold text-[var(--color-accent)] bg-transparent border-b border-transparent hover:border-[var(--color-border)] focus:border-[var(--color-accent)] outline-none"
              value={numeroManual || numero}
              onChange={(e) => setNumeroManual(e.target.value)}
              aria-label="Número de presupuesto editable"
            />
          </div>
          <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              if (!isPro) { onRequestUpgrade?.(); return }
              setIaResult(null)
              setIaError(null)
              setIaOpen((v) => !v)
            }}
            className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
              isPro
                ? 'bg-[var(--color-accent)] text-white hover:brightness-105'
                : 'border border-[var(--color-border)] text-[var(--color-text-2)]'
            }`}
          >
            {isPro ? '✨ Asistente IA' : '✨ IA (PRO)'}
          </button>
          <button
            type="button"
            onClick={() => {
              if (!isPro) onRequestUpgrade?.()
              else setPlantillasOpen(true)
            }}
            className="rounded-lg border border-[var(--color-border)] px-3 py-2 text-xs font-semibold"
          >
            Cargar plantilla
          </button>
          <button
            type="button"
            onClick={() => {
              if (!isPro) onRequestUpgrade?.()
              else {
                if (!validateAll()) return
                // Plantilla: todo excepto datos del cliente y fechas específicas
                // eslint-disable-next-line no-unused-vars
                const { clienteNombre, clienteTelefono, clienteEmail, fechaInicio, fechaEntrega, ...plantillaForm } =
                  form
                setPlantillas((prev) => [
                  {
                    id: newId(),
                    nombre: `Plantilla ${plantillaForm.tipoTrabajo}`.trim(),
                    ...plantillaForm,
                    savedAt: new Date().toISOString(),
                  },
                  ...prev,
                ])
                toast('Plantilla guardada', 'success')
              }
            }}
            className="rounded-lg border border-[var(--color-border)] px-3 py-2 text-xs font-semibold"
          >
            Guardar como plantilla
          </button>
        </div>
        </div>
        {!isPro && (() => {
          const usados = countPresupuestosCreadosEsteMes(presupuestos)
          const restantes = Math.max(0, FREE_MONTHLY_BUDGET_LIMIT - usados)
          const resetDate = new Date()
          resetDate.setMonth(resetDate.getMonth() + 1, 1)
          const resetStr = resetDate.toLocaleDateString('es-AR', { day: 'numeric', month: 'long' })
          return (
            <div className={`mt-2 flex items-center justify-between rounded-xl px-4 py-2.5 text-sm font-medium ${
              restantes === 0
                ? 'bg-red-50 border border-red-200 text-red-700'
                : restantes <= 2
                ? 'bg-amber-50 border border-amber-200 text-amber-700'
                : 'bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-text-2)]'
            }`}>
              <span>
                {restantes === 0
                  ? `Límite del plan gratuito alcanzado. Se resetea el ${resetStr}.`
                  : `Plan gratuito: ${restantes} presupuesto${restantes === 1 ? '' : 's'} restante${restantes === 1 ? '' : 's'} · Se resetea el ${resetStr}.`}
              </span>
              <button
                type="button"
                onClick={onRequestUpgrade}
                className="ml-3 shrink-0 rounded-lg bg-[var(--color-accent)] px-3 py-1 text-xs font-semibold text-white"
              >
                Ir a PRO
              </button>
            </div>
          )
        })()}
      </div>

      {/* ── Asistente IA ── */}
      <AnimatePresence>
        {iaOpen && (
          <motion.div
            key="ia-panel"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden px-4"
          >
            <div className="mt-4 rounded-2xl border-2 border-[var(--color-accent)]/40 bg-[var(--color-surface)] p-4 shadow-sm">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h3 className="font-display text-base font-bold text-[var(--color-text)]">✨ Asistente IA</h3>
                  <p className="text-xs text-[var(--color-text-2)]">Describí la obra y la IA genera materiales, mano de obra y gastos automáticamente.</p>
                </div>
                <button type="button" onClick={() => setIaOpen(false)} className="text-xs text-[var(--color-text-2)] underline">Cerrar</button>
              </div>
              <textarea
                className="mt-3 min-h-[80px] w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-3 text-sm"
                placeholder="Ej: Quiero renovar un baño de 4m² en CABA, cambio de cerámica, grifería y pintura..."
                value={iaDescripcion}
                maxLength={1000}
                onChange={(e) => setIaDescripcion(e.target.value)}
              />
              <p className="mt-1 text-right text-[11px] text-[var(--color-text-2)]">{iaDescripcion.length}/1000</p>
              {iaError && (
                <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">{iaError}</p>
              )}
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  disabled={iaLoading || iaDescripcion.trim().length < 10}
                  onClick={async () => {
                    try {
                      const data = await sugerir({
                        descripcionObra: iaDescripcion,
                        tipoTrabajo: form.tipoTrabajo,
                        ciudad: empresa?.ciudad || '',
                      })
                      setIaResult(data)
                    } catch {
                      /* error ya seteado por el hook */
                    }
                  }}
                  className="rounded-xl bg-[var(--color-accent)] px-4 py-2 text-sm font-semibold text-white transition hover:brightness-105 disabled:opacity-50"
                >
                  {iaLoading ? 'Generando…' : 'Generar presupuesto'}
                </button>
                <button
                  type="button"
                  onClick={() => { setIaDescripcion(''); setIaResult(null); setIaError(null) }}
                  className="rounded-xl border border-[var(--color-border)] px-4 py-2 text-sm font-semibold"
                >
                  Limpiar
                </button>
              </div>

              {iaResult && (
                <div className="mt-4">
                  <AsistenteIAResultado data={iaResult} onDismiss={() => setIaResult(null)} />
                  <button
                    type="button"
                    onClick={() => applyIAResult(iaResult)}
                    className="mt-3 w-full rounded-xl bg-[var(--color-accent)] py-2.5 text-sm font-semibold text-white transition hover:brightness-105"
                  >
                    ✅ Aplicar al formulario
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-6 px-4 lg:grid-cols-[minmax(0,26%)_minmax(0,1.4fr)_minmax(280px,24%)]">
        {/* Panel izquierdo: cliente */}
        <motion.div
          layout
          className="space-y-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-sm"
        >
          <h2 className="font-display text-lg font-bold text-[var(--color-text)]">Cliente y obra</h2>
          <Field
            label="Nombre del cliente"
            value={form.clienteNombre}
            onChange={(v) => setForm((f) => ({ ...f, clienteNombre: v }))}
            error={fieldErrors.clienteNombre}
            required
          />
          <Field
            label="Teléfono del cliente"
            value={form.clienteTelefono}
            onChange={(v) => setForm((f) => ({ ...f, clienteTelefono: v }))}
          />
          <Field
            label="Email del cliente"
            type="email"
            value={form.clienteEmail}
            onChange={(v) => setForm((f) => ({ ...f, clienteEmail: v }))}
            error={fieldErrors.clienteEmail}
          />
          <Field
            label="Dirección de la obra"
            value={form.direccionObra}
            onChange={(v) => setForm((f) => ({ ...f, direccionObra: v }))}
            error={fieldErrors.direccionObra}
            required
          />
          <div>
            <label className="text-sm font-medium">Tipo de trabajo *</label>
            <select
              className="mt-1 w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm"
              value={form.tipoTrabajo}
              onChange={(e) => setForm((f) => ({ ...f, tipoTrabajo: e.target.value }))}
            >
              {TIPOS_TRABAJO.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
            {fieldErrors.tipoTrabajo && (
              <p className="mt-1 text-xs text-[var(--color-danger)]">{fieldErrors.tipoTrabajo}</p>
            )}
            {PLANTILLAS_TIPO_OBRA[form.tipoTrabajo] && (
              <button
                type="button"
                onClick={aplicarPlantillaTipoObra}
                className="mt-2 rounded-lg border border-[var(--color-border)] px-2 py-1 text-xs font-semibold hover:bg-[var(--color-surface-2)]"
              >
                + Cargar plantilla rápida para {form.tipoTrabajo}
              </button>
            )}
          </div>
          {form.tipoTrabajo === 'Otro' && (
            <Field
              label="Detalle del tipo"
              value={form.tipoTrabajoOtro}
              onChange={(v) => setForm((f) => ({ ...f, tipoTrabajoOtro: v }))}
            />
          )}
          {materialesClaveFaltantes.length > 0 && (
            <div className="rounded-xl border border-[var(--color-warning)]/30 bg-[var(--color-surface-2)] p-3">
              <p className="text-xs font-semibold text-[var(--color-warning)]">
                Control profesional: materiales que suelen faltar
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {materialesClaveFaltantes.slice(0, 6).map((mat) => (
                  <button
                    key={mat}
                    type="button"
                    onClick={() => addMaterialRapido(mat)}
                    className="rounded-full border border-[var(--color-border)] bg-white px-2.5 py-1 text-xs hover:bg-[var(--color-surface)]"
                  >
                    + {mat}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-[11px] text-[var(--color-text-2)]">
                Sugerencia automática según tipo de trabajo. Revisá cantidades y precios antes de enviar.
              </p>
            </div>
          )}
          <div>
            <label className="text-sm font-medium">Descripción <span className="text-xs font-normal text-[var(--color-text-2)]">(opcional, máx. 2000)</span></label>
            <textarea
              maxLength={2000}
              className="mt-1 min-h-[100px] w-full rounded-lg border border-[var(--color-border)] p-2 text-sm"
              value={form.descripcion}
              onChange={(e) => setForm((f) => ({ ...f, descripcion: e.target.value }))}
            />
            <p className="text-xs text-[var(--color-text-2)]">{form.descripcion.length}/2000</p>
          </div>
          <div className="rounded-xl border-2 border-[var(--color-accent)]/30 bg-[var(--color-surface)] p-4 space-y-4 shadow-sm">
            <p className="text-sm font-bold text-[var(--color-text)] border-b border-[var(--color-border)] pb-2">Fechas y validez</p>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text)]">Inicio estimado <span className="text-xs font-normal text-[var(--color-text-2)]">(opcional)</span></label>
              <input
                type="date"
                className="mt-1 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2 text-sm font-medium"
                value={form.fechaInicio}
                onChange={(e) => setForm((f) => ({ ...f, fechaInicio: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text)]">Entrega estimada <span className="text-xs font-normal text-[var(--color-text-2)]">(opcional)</span></label>
              <input
                type="date"
                className="mt-1 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2 text-sm font-medium"
                value={form.fechaEntrega}
                onChange={(e) => setForm((f) => ({ ...f, fechaEntrega: e.target.value }))}
              />
              {fieldErrors.fechaEntrega && (
                <p className="mt-1 text-xs text-[var(--color-danger)]">{fieldErrors.fechaEntrega}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text)]">Validez del presupuesto (días)</label>
              <input
                type="number"
                min={1}
                placeholder="Ej: 15"
                className="mt-1 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2 text-sm font-medium"
                value={form.validezDias}
                onChange={(e) => setForm((f) => ({ ...f, validezDias: e.target.value ? Math.max(1, parseInt(e.target.value, 10)) : '' }))}
              />
            </div>
          </div>

          {fieldErrors.items && (
            <p className="text-xs text-[var(--color-danger)]">{fieldErrors.items}</p>
          )}
        </motion.div>

        {/* Centro: tablas */}
        <div className="min-w-0 space-y-6">
          <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-sm">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-display text-lg font-bold">Materiales</h2>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, materiales: [...f.materiales, emptyMaterial()] }))}
                  className="rounded-lg bg-[var(--color-primary)] px-3 py-1.5 text-xs font-semibold text-white"
                >
                  + Agregar material
                </button>
              </div>
            </div>
            <p className="mb-3 text-xs text-[var(--color-text-2)]">
              Unidad de medida = cómo se compra/cotiza el ítem (ej: m², bolsa, kg, unidad).
            </p>

            {fieldErrors.items && <p className="mb-2 text-xs text-[var(--color-danger)]">{fieldErrors.items}</p>}

            {/* Desktop table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[720px] border-collapse text-sm">
                <thead>
                  <tr className="bg-[var(--color-surface-2)] text-left text-xs uppercase text-[var(--color-text-2)]">
                    <th className="p-2 w-8" aria-hidden />
                    <th className="p-2">Material</th>
                    <th className="p-2">Unidad de medida</th>
                    <th className="p-2">Cantidad</th>
                    <th className="p-2">P. Unit.</th>
                    <th className="p-2">Subtotal</th>
                    <th className="p-2 w-10" />
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence initial={false}>
                    {form.materiales.map((row, idx) => (
                      <motion.tr
                        key={row.id}
                        layout
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        draggable
                        onDragStart={() => setDragMatIdx(idx)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => {
                          reorderMateriales(dragMatIdx, idx)
                          setDragMatIdx(null)
                        }}
                        className="border-t border-[var(--color-border)]"
                      >
                        <td className="p-1 text-[var(--color-text-2)] cursor-grab" title="Arrastrar">
                          ⋮⋮
                        </td>
                        <td className="p-1">
                          <AutocompleteMaterial
                            value={row.nombre}
                            onChange={(v) =>
                              setForm((f) => {
                                const mats = [...f.materiales]
                                mats[idx] = { ...mats[idx], nombre: v }
                                return { ...f, materiales: mats }
                              })
                            }
                            onPickSuggestion={(s) =>
                              setForm((f) => {
                                const mats = [...f.materiales]
                                mats[idx] = { ...mats[idx], nombre: s.nombre, unidad: s.unidad }
                                return { ...f, materiales: mats }
                              })
                            }
                          />
                          {fieldErrors[`material_${idx}`] && (
                            <p className="text-xs text-[var(--color-danger)]">{fieldErrors[`material_${idx}`]}</p>
                          )}
                        </td>
                        <td className="p-1">
                          <select
                            className="w-full rounded border border-[var(--color-border)] px-1 py-1.5 text-sm"
                            value={row.unidad}
                            onChange={(e) =>
                              setForm((f) => {
                                const mats = [...f.materiales]
                                mats[idx] = { ...mats[idx], unidad: e.target.value }
                                return { ...f, materiales: mats }
                              })
                            }
                          >
                            {UNIDADES_MATERIAL.map((u) => (
                              <option key={u}>{u}</option>
                            ))}
                          </select>
                        </td>
                        <td className="p-1">
                          <input
                            inputMode="decimal"
                            className="w-full rounded border border-[var(--color-border)] px-2 py-1.5 font-mono text-sm"
                            value={row.cantidad}
                            onChange={(e) =>
                              setForm((f) => {
                                const mats = [...f.materiales]
                                mats[idx] = { ...mats[idx], cantidad: parseFloat(e.target.value) || 0 }
                                return { ...f, materiales: mats }
                              })
                            }
                          />
                        </td>
                        <td className="p-1">
                          <input
                            inputMode="decimal"
                            placeholder="Opcional"
                            className="w-full rounded border border-[var(--color-border)] px-2 py-1.5 font-mono text-sm"
                            value={row.precioUnitario}
                            onChange={(e) =>
                              setForm((f) => {
                                const mats = [...f.materiales]
                                mats[idx] = {
                                  ...mats[idx],
                                  precioUnitario: parseCurrencyInput(e.target.value),
                                }
                                return { ...f, materiales: mats }
                              })
                            }
                          />
                        </td>
                        <td className="p-1 font-mono text-right text-[var(--color-text-2)]">
                          {row.precioUnitario ? formatCurrency(row.cantidad * row.precioUnitario) : '—'}
                        </td>
                        <td className="p-1">
                          <button
                            type="button"
                            aria-label="Eliminar material"
                            className="text-[var(--color-danger)]"
                            onClick={() =>
                              setForm((f) => ({
                                ...f,
                                materiales:
                                  f.materiales.length > 1
                                    ? f.materiales.filter((_, i) => i !== idx)
                                    : f.materiales,
                              }))
                            }
                          >
                            Quitar
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="space-y-3 md:hidden">
              {form.materiales.map((row, idx) => (
                <div key={row.id} className="rounded-xl border border-[var(--color-border)] p-3">
                  <AutocompleteMaterial
                    value={row.nombre}
                    onChange={(v) =>
                      setForm((f) => {
                        const mats = [...f.materiales]
                        mats[idx] = { ...mats[idx], nombre: v }
                        return { ...f, materiales: mats }
                      })
                    }
                    onPickSuggestion={(s) =>
                      setForm((f) => {
                        const mats = [...f.materiales]
                        mats[idx] = { ...mats[idx], nombre: s.nombre, unidad: s.unidad }
                        return { ...f, materiales: mats }
                      })
                    }
                  />
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <select
                      className="rounded border border-[var(--color-border)] px-2 py-2 text-sm"
                      value={row.unidad}
                      onChange={(e) =>
                        setForm((f) => {
                          const mats = [...f.materiales]
                          mats[idx] = { ...mats[idx], unidad: e.target.value }
                          return { ...f, materiales: mats }
                        })
                      }
                    >
                      {UNIDADES_MATERIAL.map((u) => (
                        <option key={u}>{u}</option>
                      ))}
                    </select>
                    <input
                      inputMode="decimal"
                      placeholder="Cantidad"
                      className="rounded border px-2 py-2 font-mono text-sm"
                      value={row.cantidad}
                      onChange={(e) =>
                        setForm((f) => {
                          const mats = [...f.materiales]
                          mats[idx] = { ...mats[idx], cantidad: parseFloat(e.target.value) || 0 }
                          return { ...f, materiales: mats }
                        })
                      }
                    />
                    <input
                      inputMode="decimal"
                      placeholder="Precio (opcional)"
                      className="col-span-2 rounded border border-[var(--color-border)] px-2 py-2 font-mono text-sm"
                      value={row.precioUnitario}
                      onChange={(e) =>
                        setForm((f) => {
                          const mats = [...f.materiales]
                          mats[idx] = { ...mats[idx], precioUnitario: parseCurrencyInput(e.target.value) }
                          return { ...f, materiales: mats }
                        })
                      }
                    />
                  </div>
                  <div className="mt-2 flex justify-between text-sm">
                    <span className="font-mono text-[var(--color-text-2)]">{row.precioUnitario ? formatCurrency(row.cantidad * row.precioUnitario) : '—'}</span>
                    <button
                      type="button"
                      className="text-[var(--color-danger)]"
                      onClick={() =>
                        setForm((f) => ({
                          ...f,
                          materiales:
                            f.materiales.length > 1 ? f.materiales.filter((_, i) => i !== idx) : f.materiales,
                        }))
                      }
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-3 text-right text-sm font-semibold">
              Subtotal materiales:{' '}
              <span className="font-mono">{totals.subtotalMateriales ? formatCurrency(totals.subtotalMateriales) : '—'}</span>
            </p>
          </section>

          {/* Mano de obra */}
          <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-sm">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-display text-lg font-bold">Mano de obra</h2>
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, manoObra: [...f.manoObra, emptyMano()] }))}
                className="rounded-lg bg-[var(--color-accent-2)] px-3 py-1.5 text-xs font-semibold text-white"
              >
                + Agregar ítem
              </button>
            </div>
            <p className="mb-3 text-xs text-[var(--color-text-2)]">
              Unidad de medida = cómo cobrás el trabajo (ej: hora, día, m² o por trabajo completo).
            </p>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[680px] border-collapse text-sm">
                <thead>
                  <tr className="bg-[var(--color-surface-2)] text-left text-xs uppercase text-[var(--color-text-2)]">
                    <th className="p-2">Descripción</th>
                    <th className="p-2">Categoría</th>
                    <th className="p-2">Cantidad</th>
                    <th className="p-2">Unidad de medida</th>
                    <th className="p-2">P. Unit.</th>
                    <th className="p-2">Subtotal</th>
                    <th className="p-2" />
                  </tr>
                </thead>
                <tbody>
                  {form.manoObra.map((row, idx) => (
                    <tr key={row.id} className="border-t border-[var(--color-border)]">
                      <td className="p-1">
                        <input
                          className="w-full min-w-[120px] rounded border px-2 py-1.5 text-sm"
                          list="tareas-mano"
                          value={row.descripcion}
                          onChange={(e) =>
                            setForm((f) => {
                              const rows = [...f.manoObra]
                              rows[idx] = { ...rows[idx], descripcion: e.target.value }
                              return { ...f, manoObra: rows }
                            })
                          }
                        />
                        <datalist id="tareas-mano">
                          {TAREAS_MANO_DEFAULT.map((t) => (
                            <option key={t} value={t} />
                          ))}
                        </datalist>
                        {fieldErrors[`mano_${idx}`] && (
                          <p className="text-xs text-[var(--color-danger)]">{fieldErrors[`mano_${idx}`]}</p>
                        )}
                      </td>
                      <td className="p-1">
                        <select
                          className="w-full rounded border px-1 py-1.5"
                          value={row.categoria}
                          onChange={(e) =>
                            setForm((f) => {
                              const rows = [...f.manoObra]
                              rows[idx] = { ...rows[idx], categoria: e.target.value }
                              return { ...f, manoObra: rows }
                            })
                          }
                        >
                          {CATEGORIAS_MANO.map((c) => (
                            <option key={c}>{c}</option>
                          ))}
                        </select>
                      </td>
                      <td className="p-1">
                        <input
                          inputMode="decimal"
                          className="w-full rounded border px-2 py-1.5 font-mono"
                          value={row.cantidad}
                          onChange={(e) =>
                            setForm((f) => {
                              const rows = [...f.manoObra]
                              rows[idx] = { ...rows[idx], cantidad: parseFloat(e.target.value) || 0 }
                              return { ...f, manoObra: rows }
                            })
                          }
                        />
                      </td>
                      <td className="p-1">
                        <select
                          className="w-full rounded border px-1 py-1.5"
                          value={row.unidad}
                          onChange={(e) =>
                            setForm((f) => {
                              const rows = [...f.manoObra]
                              rows[idx] = { ...rows[idx], unidad: e.target.value }
                              return { ...f, manoObra: rows }
                            })
                          }
                        >
                          {UNIDADES_MANO.map((u) => (
                            <option key={u}>{u}</option>
                          ))}
                        </select>
                      </td>
                      <td className="p-1">
                        <input
                          inputMode="decimal"
                          placeholder="Opcional"
                          className="w-full rounded border px-2 py-1.5 font-mono"
                          value={row.precioUnitario}
                          onChange={(e) =>
                            setForm((f) => {
                              const rows = [...f.manoObra]
                              rows[idx] = { ...rows[idx], precioUnitario: parseCurrencyInput(e.target.value) }
                              return { ...f, manoObra: rows }
                            })
                          }
                        />
                      </td>
                      <td className="p-1 font-mono text-right text-[var(--color-text-2)]">
                        {row.precioUnitario ? formatCurrency(row.cantidad * row.precioUnitario) : '—'}
                      </td>
                      <td className="p-1">
                        <button
                          type="button"
                          className="text-[var(--color-danger)]"
                          onClick={() =>
                            setForm((f) => ({
                              ...f,
                              manoObra: f.manoObra.filter((_, i) => i !== idx),
                            }))
                          }
                        >
                          Quitar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards mano de obra */}
            <div className="space-y-3 md:hidden">
              {form.manoObra.map((row, idx) => (
                <div key={row.id} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-3">
                  <input
                    className="w-full rounded border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-2 text-sm"
                    list="tareas-mano-mobile"
                    placeholder="Descripción del trabajo"
                    value={row.descripcion}
                    onChange={(e) =>
                      setForm((f) => {
                        const rows = [...f.manoObra]
                        rows[idx] = { ...rows[idx], descripcion: e.target.value }
                        return { ...f, manoObra: rows }
                      })
                    }
                  />
                  <datalist id="tareas-mano-mobile">
                    {TAREAS_MANO_DEFAULT.map((t) => <option key={t} value={t} />)}
                  </datalist>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <select
                      className="rounded border border-[var(--color-border)] px-2 py-2 text-sm"
                      value={row.categoria}
                      onChange={(e) =>
                        setForm((f) => {
                          const rows = [...f.manoObra]
                          rows[idx] = { ...rows[idx], categoria: e.target.value }
                          return { ...f, manoObra: rows }
                        })
                      }
                    >
                      {CATEGORIAS_MANO.map((c) => <option key={c}>{c}</option>)}
                    </select>
                    <input
                      inputMode="decimal"
                      placeholder="Cantidad"
                      className="rounded border border-[var(--color-border)] px-2 py-2 font-mono text-sm"
                      value={row.cantidad}
                      onChange={(e) =>
                        setForm((f) => {
                          const rows = [...f.manoObra]
                          rows[idx] = { ...rows[idx], cantidad: parseFloat(e.target.value) || 0 }
                          return { ...f, manoObra: rows }
                        })
                      }
                    />
                    <select
                      className="rounded border border-[var(--color-border)] px-2 py-2 text-sm"
                      value={row.unidad}
                      onChange={(e) =>
                        setForm((f) => {
                          const rows = [...f.manoObra]
                          rows[idx] = { ...rows[idx], unidad: e.target.value }
                          return { ...f, manoObra: rows }
                        })
                      }
                    >
                      {UNIDADES_MANO.map((u) => <option key={u}>{u}</option>)}
                    </select>
                    <input
                      inputMode="decimal"
                      placeholder="Precio (opcional)"
                      className="rounded border border-[var(--color-border)] px-2 py-2 font-mono text-sm"
                      value={row.precioUnitario}
                      onChange={(e) =>
                        setForm((f) => {
                          const rows = [...f.manoObra]
                          rows[idx] = { ...rows[idx], precioUnitario: parseCurrencyInput(e.target.value) }
                          return { ...f, manoObra: rows }
                        })
                      }
                    />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm">
                    <span className="font-mono text-[var(--color-text-2)]">
                      {row.precioUnitario ? formatCurrency(row.cantidad * row.precioUnitario) : '—'}
                    </span>
                    <button
                      type="button"
                      className="text-[var(--color-danger)]"
                      onClick={() =>
                        setForm((f) => ({
                          ...f,
                          manoObra: f.manoObra.filter((_, i) => i !== idx),
                        }))
                      }
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-3 text-right text-sm font-semibold">
              Subtotal mano de obra: <span className="font-mono">{totals.subtotalMano ? formatCurrency(totals.subtotalMano) : '—'}</span>
            </p>
          </section>

          {/* Gastos adicionales */}
          <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-sm">
            <button
              type="button"
              className="flex w-full items-center justify-between font-display text-lg font-bold"
              onClick={() => setForm((f) => ({ ...f, gastosOpen: !f.gastosOpen }))}
              aria-expanded={form.gastosOpen}
            >
              Gastos adicionales
              <span>{form.gastosOpen ? '−' : '+'}</span>
            </button>
            {form.gastosOpen && (
              <div className="mt-4 space-y-3">
                {form.gastosAdicionales.map((g, idx) => (
                  <div key={g.id} className="flex flex-wrap items-end gap-2">
                    <input
                      className="min-w-[160px] flex-1 rounded border px-2 py-2 text-sm"
                      list="gastos-sug"
                      placeholder="Concepto"
                      value={g.concepto}
                      onChange={(e) =>
                        setForm((f) => {
                          const rows = [...f.gastosAdicionales]
                          rows[idx] = { ...rows[idx], concepto: e.target.value }
                          return { ...f, gastosAdicionales: rows }
                        })
                      }
                    />
                    <datalist id="gastos-sug">
                      {GASTOS_SUGERIDOS.map((x) => (
                        <option key={x} value={x} />
                      ))}
                    </datalist>
                    <label className="flex items-center gap-1 text-xs">
                      <input
                        type="checkbox"
                        checked={g.esPorcentaje}
                        onChange={(e) =>
                          setForm((f) => {
                            const rows = [...f.gastosAdicionales]
                            rows[idx] = { ...rows[idx], esPorcentaje: e.target.checked }
                            return { ...f, gastosAdicionales: rows }
                          })
                        }
                      />
                      % del subtotal
                    </label>
                    {g.esPorcentaje ? (
                      <input
                        type="number"
                        className="w-24 rounded border px-2 py-2 font-mono text-sm"
                        value={g.porcentaje}
                        onChange={(e) =>
                          setForm((f) => {
                            const rows = [...f.gastosAdicionales]
                            rows[idx] = { ...rows[idx], porcentaje: parseFloat(e.target.value) || 0 }
                            return { ...f, gastosAdicionales: rows }
                          })
                        }
                      />
                    ) : (
                      <input
                        inputMode="decimal"
                        className="w-32 rounded border px-2 py-2 font-mono text-sm"
                        value={g.monto}
                        onChange={(e) =>
                          setForm((f) => {
                            const rows = [...f.gastosAdicionales]
                            rows[idx] = { ...rows[idx], monto: parseCurrencyInput(e.target.value) }
                            return { ...f, gastosAdicionales: rows }
                          })
                        }
                      />
                    )}
                    <button
                      type="button"
                      className="text-[var(--color-danger)]"
                      onClick={() =>
                        setForm((f) => ({
                          ...f,
                          gastosAdicionales: f.gastosAdicionales.filter((_, i) => i !== idx),
                        }))
                      }
                    >
                      Eliminar
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="text-sm font-semibold text-[var(--color-accent)]"
                  onClick={() =>
                    setForm((f) => ({ ...f, gastosAdicionales: [...f.gastosAdicionales, emptyGasto()] }))
                  }
                >
                  + Agregar gasto
                </button>
              </div>
            )}
          </section>

          {shouldShowAuditoria &&
            (auditoria.criticas.length > 0 || auditoria.advertencias.length > 0 || auditoria.recomendaciones.length > 0) && (
              <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-sm">
                <h2 className="font-display text-lg font-bold">Auditoría extrema</h2>
                {auditoria.criticas.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {auditoria.criticas.map((t, i) => (
                      <div key={`c-${i}`} className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900">
                        Crítico: {t}
                      </div>
                    ))}
                  </div>
                )}
                {auditoria.advertencias.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {auditoria.advertencias.map((t, i) => (
                      <div key={`a-${i}`} className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950">
                        Advertencia: {t}
                      </div>
                    ))}
                  </div>
                )}
                {auditoria.recomendaciones.length > 0 && (
                  <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-[var(--color-text-2)]">
                    {auditoria.recomendaciones.map((t, i) => (
                      <li key={`r-${i}`}>{t}</li>
                    ))}
                  </ul>
                )}
              </section>
            )}

          <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="text-sm font-medium">Condiciones del presupuesto <span className="text-xs font-normal text-[var(--color-text-2)]">(opcional)</span></label>
              <button
                type="button"
                onClick={() =>
                  setForm((f) => ({
                    ...f,
                    condiciones: mergeCondicionesProfesionales(f.condiciones),
                  }))
                }
                className="rounded-lg border border-[var(--color-border)] px-2 py-1 text-xs font-semibold hover:bg-[var(--color-surface-2)]"
              >
                + Insertar condiciones profesionales
              </button>
            </div>
            <textarea
              className="mt-2 min-h-[100px] w-full rounded-lg border border-[var(--color-border)] p-2 text-sm"
              value={form.condiciones}
              onChange={(e) => setForm((f) => ({ ...f, condiciones: e.target.value }))}
            />
            <label className="mt-4 block text-sm font-medium">
              Checklist de cierre (personalizado, una línea por ítem)
            </label>
            <div className="mt-2 grid gap-2 md:grid-cols-2">
              <label className="flex items-center gap-2 text-sm text-[var(--color-text)]">
                <input
                  type="checkbox"
                  checked={form.includeEscenariosPdf}
                  onChange={(e) => setForm((f) => ({ ...f, includeEscenariosPdf: e.target.checked }))}
                />
                Incluir escenarios comerciales en PDF
              </label>
              <label className="flex items-center gap-2 text-sm text-[var(--color-text)]">
                <input
                  type="checkbox"
                  checked={form.includeAnticipoPdf}
                  onChange={(e) => setForm((f) => ({ ...f, includeAnticipoPdf: e.target.checked }))}
                />
                Incluir anticipo en PDF
              </label>
              <label className="flex items-center gap-2 text-sm text-[var(--color-text)]">
                <input
                  type="checkbox"
                  checked={form.includeFirmasPdf}
                  onChange={(e) => setForm((f) => ({ ...f, includeFirmasPdf: e.target.checked }))}
                />
                Incluir bloque de firmas en PDF
              </label>
            </div>
            <label className="mt-2 flex items-center gap-2 text-sm text-[var(--color-text)]">
              <input
                type="checkbox"
                checked={form.includeChecklistCierrePdf}
                onChange={(e) => setForm((f) => ({ ...f, includeChecklistCierrePdf: e.target.checked }))}
              />
              Incluir checklist de cierre en el PDF
            </label>
            <textarea
              className="mt-2 min-h-[84px] w-full rounded-lg border border-[var(--color-border)] p-2 text-sm"
              value={form.checklistPersonalizado}
              onChange={(e) => setForm((f) => ({ ...f, checklistPersonalizado: e.target.value }))}
              placeholder="Ejemplo: \nVerificar pendientes con cliente\nEntregar manuales y garantías"
            />
          </section>
        </div>

        {/* Totales lateral */}
        <div className="lg:block">
          <PanelTotales
            totals={totals}
            incluirIva={form.incluirIva}
            onToggleIva={(v) => setForm((f) => ({ ...f, incluirIva: v }))}
            anticipoPct={form.anticipoPct}
            onAnticipoChange={(v) => setForm((f) => ({ ...f, anticipoPct: v }))}
            margenPct={form.margenPct}
            onMargenChange={(v) => setForm((f) => ({ ...f, margenPct: v }))}
            contingenciaPct={form.contingenciaPct}
            onContingenciaChange={(v) => setForm((f) => ({ ...f, contingenciaPct: v }))}
          />
        </div>
      </div>

      {/* Sticky footer acciones */}
      <div className="fixed bottom-16 left-0 right-0 z-[70] border-t border-[var(--color-border)] bg-[var(--color-surface)]/95 p-3 backdrop-blur lg:bottom-0 lg:left-60">
        <div className="mx-auto flex max-w-6xl flex-wrap gap-2">
          <button
            type="button"
            onClick={openPreview}
            className="flex-1 rounded-xl border border-[var(--color-border)] px-3 py-3 text-sm font-semibold min-w-[140px]"
          >
            Vista previa
          </button>
          <button
            type="button"
            onClick={handlePdf}
            className="flex-1 rounded-xl bg-[var(--color-accent)] px-3 py-3 text-sm font-semibold text-white min-w-[140px]"
          >
            Generar PDF
          </button>
          <button
            type="button"
            onClick={handleSaveDraft}
            className="flex-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-3 text-sm font-semibold text-[var(--color-text)] min-w-[140px]"
          >
            Guardar borrador
          </button>
          <button
            type="button"
            onClick={() => setConfirmDiscard(true)}
            className="flex-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-3 text-sm font-semibold text-[var(--color-text)] min-w-[120px]"
          >
            Descartar
          </button>
        </div>
      </div>

      {/* Barra sticky mobile total breve */}
      <div className="fixed bottom-16 left-0 right-0 z-[60] flex items-center justify-between bg-[var(--color-primary)] px-4 py-2 text-white lg:hidden">
        <span className="text-xs opacity-90">Total</span>
        <span className="font-mono text-lg font-bold">{totals.totalFinal ? formatCurrency(totals.totalFinal) : 'Sin precio'}</span>
      </div>

      <PreviewModal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        payload={buildPayload()}
        empresa={empresa}
        isPro={isPro}
        onDownloadPdf={() => {
          if (!validateAll()) return
          handlePdf()
        }}
        onExportExcel={() => {
          if (!isPro) onRequestUpgrade?.()
          else if (validateAll()) {
            try {
              exportPresupuestoExcel(
                buildPayload(),
                `Presupuesto-${form.clienteNombre}-${numero}`.replace(/\s/g, '_'),
              )
              toast('Excel exportado', 'success')
            } catch {
              toast('Error al exportar Excel', 'error')
            }
          }
        }}
        onEmail={() => {
          if (!isPro) onRequestUpgrade?.()
          else {
            if (!validateAll()) return
            setEmailModalInstance((n) => n + 1)
            setPreviewOpen(false)
            setEmailSendOpen(true)
          }
        }}
        onSave={() => {
          const exists = presupuestos.some((p) => p.id === presupuestoId)
          if (!exists && !checkFreeLimit()) return
          if (!validateAll()) return
          persistPresupuesto({ estado: 'borrador' })
          setPreviewOpen(false)
        }}
        onContinueEdit={() => setPreviewOpen(false)}
      />

      <EmailSendModal
        open={emailSendOpen}
        onClose={() => setEmailSendOpen(false)}
        instanceKey={emailModalInstance}
        empresa={empresa}
        payload={buildPayload()}
        isPro={isPro}
        onRequestUpgrade={onRequestUpgrade}
        onSent={() => {
          persistPresupuesto(
            { estado: 'enviado', enviadoAt: new Date().toISOString() },
            {
              toastMsg: 'Email enviado. Presupuesto marcado como enviado.',
              skipClearInitial: true,
            },
          )
          setEmailSendOpen(false)
        }}
      />

      <ConfirmDialog
        open={confirmDiscard}
        title="¿Descartar cambios?"
        message="Se perderán los datos no guardados de este presupuesto."
        confirmLabel="Descartar"
        onCancel={() => setConfirmDiscard(false)}
        onConfirm={() => {
          setConfirmDiscard(false)
          sessionIdRef.current = newId()
          setNumeroManual('')
          setForm({
            clienteNombre: '',
            clienteTelefono: '',
            clienteEmail: '',
            direccionObra: '',
            tipoTrabajo: TIPOS_TRABAJO[0],
            tipoTrabajoOtro: '',
            descripcion: '',
            fechaInicio: new Date().toISOString().slice(0, 10),
            fechaEntrega: addDaysISO(new Date().toISOString().slice(0, 10), 30),
            validezDias: '',
            materiales: [emptyMaterial()],
            manoObra: [],
            gastosAdicionales: [],
            gastosOpen: false,
            incluirIva: false,
            anticipoPct: 30,
            margenPct: 20,
            contingenciaPct: 10,
            includeEscenariosPdf: false,
            includeAnticipoPdf: false,
            includeChecklistCierrePdf: false,
            includeFirmasPdf: true,
            checklistPersonalizado: '',
            condiciones: empresa?.condicionesDefault || '',
            estado: 'borrador',
          })
          onClearInitial?.()
          toast('Formulario limpio', 'success')
        }}
      />

      <ModalPlantillas
        open={plantillasOpen}
        plantillas={plantillas}
        onClose={() => setPlantillasOpen(false)}
        onPick={applyTemplate}
        onDelete={(id) => {
          setPlantillas((prev) => prev.filter((p) => p.id !== id))
          toast('Plantilla eliminada', 'success')
        }}
      />

    </div>
  )
}

function Field({ label, value, onChange, error, type = 'text', required }) {
  return (
    <div>
      <label className="text-sm font-medium text-[var(--color-text)]">
        {label}
        {required ? ' *' : <span className="ml-1 text-xs font-normal text-[var(--color-text-2)]"> (opcional)</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm"
      />
      {error && <p className="mt-1 text-xs text-[var(--color-danger)]">{error}</p>}
    </div>
  )
}
