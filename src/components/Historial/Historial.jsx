import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { formatCurrency } from '../../utils/formatCurrency'
import { generatePresupuestoPDF } from '../../utils/generatePDF'
import { mergePayloadConEmpresa } from '../../utils/presupuestoHelpers'
import { ConfirmDialog } from '../UI/ConfirmDialog'

const ESTADOS = ['borrador', 'enviado', 'aprobado', 'rechazado', 'vencido']

function estadoStyle(e) {
  switch (e) {
    case 'borrador':
      return 'bg-gray-200 text-gray-800'
    case 'enviado':
      return 'bg-sky-100 text-sky-900'
    case 'aprobado':
      return 'bg-emerald-100 text-emerald-900'
    case 'rechazado':
      return 'bg-red-100 text-red-900'
    case 'vencido':
      return 'bg-orange-100 text-orange-950'
    default:
      return 'bg-gray-100'
  }
}

function formatDate(iso) {
  if (!iso) return '—'
  const [y, m, d] = iso.slice(0, 10).split('-')
  return `${d}/${m}/${y}`
}

const daysAgo = (iso, referenceNowMs) => {
  const t = new Date(iso).getTime()
  return (referenceNowMs - t) / (1000 * 60 * 60 * 24)
}

/** Estado mostrado y usado en filtros (incluye vencido por fecha de validez). */
function effectiveEstado(r, referenceNow) {
  const base = r.estado || 'borrador'
  if (base === 'aprobado' || base === 'rechazado') return base
  if (base === 'vencido') return 'vencido'
  const val = r.validezDias ?? 15
  const em = r.fechaEmision || r.updatedAt?.slice(0, 10)
  if (em) {
    const v = new Date(em)
    v.setDate(v.getDate() + val)
    if (v < referenceNow) return 'vencido'
  }
  return base
}

/**
 * Historial con búsqueda, filtros y vista lista/tarjetas
 */
export function Historial({
  empresa,
  items,
  setItems,
  isPro,
  onView,
  onEdit,
  onSendEmail,
  onRequestUpgrade,
}) {
  const [q, setQ] = useState('')
  const [estadoFiltro, setEstadoFiltro] = useState('todos')
  const [periodo, setPeriodo] = useState('mes')
  const [orden, setOrden] = useState('reciente')
  const [vista, setVista] = useState(() =>
    typeof window !== 'undefined' && window.innerWidth < 768 ? 'cards' : 'lista'
  )
  const [deleteId, setDeleteId] = useState(null)
  const [confettiId, setConfettiId] = useState(null)

  const duplicarPresupuesto = (r) => {
    const newId = `pres-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    const copia = {
      ...r,
      id: newId,
      numero: `COPIA-${r.numero}`,
      estado: 'borrador',
      fechaEmision: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString(),
      creadoEn: new Date().toISOString(),
      clienteNombre: r.clienteNombre ? `(Copia) ${r.clienteNombre}` : '(Copia)',
    }
    setItems((prev) => [copia, ...prev])
  }

  const shareWhatsApp = (r) => {
    const nombreEmpresa = r.empresa?.nombreEmpresa || empresa?.nombreEmpresa || ''
    const totalStr = r.totalFinal
      ? `*Total: ${formatCurrency(r.totalFinal)}*`
      : '*Total: a confirmar (precios pendientes)*'
    const msg = [
      `Hola! Te comparto el presupuesto N\u00b0 ${r.numero} para *${r.tipoTrabajo}*${r.direccionObra ? ` en ${r.direccionObra}` : ''}.`,
      '',
      totalStr,
      `Cliente: ${r.clienteNombre}`,
      nombreEmpresa ? `Empresa: ${nombreEmpresa}` : '',
      'Cualquier consulta, estamos a disposici\u00f3n.',
    ].filter((l) => l !== undefined && !(l === '' && !nombreEmpresa)).join('\n')
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank')
  }

  const alertas = useMemo(() => {
    const now = new Date()
    return (items || []).reduce((acc, r) => {
      const base = r.estado || 'borrador'
      if (base === 'aprobado' || base === 'rechazado') return acc
      const val = Number(r.validezDias) || 15
      const em = r.fechaEmision || r.updatedAt?.slice(0, 10)
      if (!em) return acc
      const vence = new Date(em)
      vence.setDate(vence.getDate() + val)
      const diffDias = Math.ceil((vence - now) / (1000 * 60 * 60 * 24))
      if (diffDias < 0 && base === 'enviado') acc.vencidos.push(r)
      else if (diffDias >= 0 && diffDias <= 3 && base === 'enviado') acc.porVencer.push({ ...r, diffDias })
      return acc
    }, { vencidos: [], porVencer: [] })
  }, [items])

  const { rows: filtered, referenceNowMs } = useMemo(() => {
    let rows = [...(items || [])]
    const referenceNow = new Date()
    const referenceNowMs = referenceNow.getTime()
    const qq = q.trim().toLowerCase()
    if (qq) {
      rows = rows.filter(
        (r) =>
          r.clienteNombre?.toLowerCase().includes(qq) ||
          r.numero?.toLowerCase().includes(qq) ||
          r.tipoTrabajo?.toLowerCase().includes(qq),
      )
    }
    const now = referenceNow
    if (periodo === 'mes') {
      const m = now.getMonth()
      const y = now.getFullYear()
      rows = rows.filter((r) => {
        const d = new Date(r.fechaEmision || r.updatedAt)
        return d.getMonth() === m && d.getFullYear() === y
      })
    } else if (periodo === 'trimestre') {
      const cut = now.getTime() - 90 * 24 * 60 * 60 * 1000
      rows = rows.filter((r) => new Date(r.fechaEmision || r.updatedAt).getTime() >= cut)
    } else if (periodo === 'anio') {
      const y = now.getFullYear()
      rows = rows.filter((r) => new Date(r.fechaEmision || r.updatedAt).getFullYear() === y)
    }
    /* periodo === 'todo' → sin filtro extra */

    rows = rows.map((r) => ({ ...r, _effectiveEstado: effectiveEstado(r, referenceNow) }))
    if (estadoFiltro !== 'todos') {
      rows = rows.filter((r) => r._effectiveEstado === estadoFiltro)
    }

    if (orden === 'reciente') {
      rows.sort((a, b) => new Date(b.updatedAt || b.fechaEmision) - new Date(a.updatedAt || a.fechaEmision))
    } else if (orden === 'antiguo') {
      rows.sort((a, b) => new Date(a.updatedAt || a.fechaEmision) - new Date(b.updatedAt || b.fechaEmision))
    } else if (orden === 'mayor') {
      rows.sort((a, b) => (b.totalFinal || 0) - (a.totalFinal || 0))
    } else {
      rows.sort((a, b) => (a.totalFinal || 0) - (b.totalFinal || 0))
    }
    return { rows, referenceNowMs }
  }, [items, q, estadoFiltro, periodo, orden])

  const updateEstado = (id, estado) => {
    if (estado === 'aprobado') {
      setConfettiId(id)
      setTimeout(() => setConfettiId(null), 1800)
    }
    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, estado, updatedAt: new Date().toISOString() } : p)))
  }

  const blurOld = (r) => {
    if (isPro) return false
    if (!r.updatedAt && !r.fechaEmision) return false
    return daysAgo(r.updatedAt || r.fechaEmision, referenceNowMs) > 30
  }

  return (
    <div className="px-4 py-6 pb-28 lg:pb-8">
      <h1 className="font-display text-2xl font-bold text-[var(--color-text)]">Historial</h1>

      {(alertas.vencidos.length > 0 || alertas.porVencer.length > 0) && (
        <div className="mt-3 space-y-2">
          {alertas.vencidos.length > 0 && (
            <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm">
              <span className="mt-0.5 text-red-500 font-bold text-base">!</span>
              <div>
                <p className="font-semibold text-red-700">{alertas.vencidos.length} presupuesto{alertas.vencidos.length > 1 ? 's' : ''} vencido{alertas.vencidos.length > 1 ? 's' : ''} sin respuesta</p>
                <p className="text-red-600 text-xs mt-0.5">{alertas.vencidos.map(r => `N° ${r.numero} (${r.clienteNombre})`).join(' · ')}</p>
              </div>
            </div>
          )}
          {alertas.porVencer.length > 0 && (
            <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm">
              <span className="mt-0.5 text-amber-500 font-bold text-base">!</span>
              <div>
                <p className="font-semibold text-amber-700">{alertas.porVencer.length} presupuesto{alertas.porVencer.length > 1 ? 's' : ''} por vencer pronto</p>
                <p className="text-amber-600 text-xs mt-0.5">{alertas.porVencer.map(r => `N° ${r.numero} — vence en ${r.diffDias === 0 ? 'hoy' : `${r.diffDias} día${r.diffDias > 1 ? 's' : ''}`}`).join(' · ')}</p>
              </div>
            </div>
          )}
        </div>
      )}
      <div className="mt-4 flex flex-wrap gap-2">
        <input
          className="min-w-[200px] flex-1 rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm"
          placeholder="Buscar cliente, N° o tipo..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select
          className="rounded-lg border border-[var(--color-border)] px-2 py-2 text-sm"
          value={estadoFiltro}
          onChange={(e) => setEstadoFiltro(e.target.value)}
        >
          <option value="todos">Todos</option>
          {ESTADOS.map((e) => (
            <option key={e} value={e}>
              {e.charAt(0).toUpperCase() + e.slice(1)}
            </option>
          ))}
        </select>
        <select
          className="rounded-lg border border-[var(--color-border)] px-2 py-2 text-sm"
          value={periodo}
          onChange={(e) => setPeriodo(e.target.value)}
        >
          <option value="mes">Este mes</option>
          <option value="trimestre">Último trimestre</option>
          <option value="anio">Este año</option>
          <option value="todo">Todo</option>
        </select>
        <select
          className="rounded-lg border border-[var(--color-border)] px-2 py-2 text-sm"
          value={orden}
          onChange={(e) => setOrden(e.target.value)}
        >
          <option value="reciente">Más reciente</option>
          <option value="antiguo">Más antiguo</option>
          <option value="mayor">Mayor monto</option>
          <option value="menor">Menor monto</option>
        </select>
        <div className="flex rounded-lg border border-[var(--color-border)] p-0.5 text-xs">
          <button
            type="button"
            className={`rounded-md px-2 py-1 ${vista === 'lista' ? 'bg-[var(--color-primary)] text-white' : ''}`}
            onClick={() => setVista('lista')}
          >
            Lista
          </button>
          <button
            type="button"
            className={`rounded-md px-2 py-1 ${vista === 'cards' ? 'bg-[var(--color-primary)] text-white' : ''}`}
            onClick={() => setVista('cards')}
          >
            Tarjetas
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-16 flex flex-col items-center text-center text-[var(--color-text-2)]">
          <svg width="80" height="80" viewBox="0 0 64 64" className="text-[var(--color-border)]" aria-hidden>
            <path
              fill="currentColor"
              d="M12 18h40v32H12V18zm4 4v24h32V22H16zm8 4h16v2H24v-2zm0 6h16v2H24v-2z"
            />
          </svg>
          <p className="mt-4 text-lg font-medium text-[var(--color-text)]">Todavía no generaste ningún presupuesto.</p>
          <p className="mt-1 text-sm">¡Empezá con el primero desde «Nuevo»!</p>
        </div>
      ) : vista === 'lista' ? (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]">
          <table className="w-full min-w-[800px] text-sm">
            <thead className="bg-[var(--color-surface-2)] text-left text-xs uppercase text-[var(--color-text-2)]">
              <tr>
                <th className="p-3">N°</th>
                <th className="p-3">Cliente</th>
                <th className="p-3">Tipo</th>
                <th className="p-3 text-right">Total</th>
                <th className="p-3">Estado</th>
                <th className="p-3">Fecha</th>
                <th className="p-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => {
                const est = r._effectiveEstado
                return (
                  <tr
                    key={r.id}
                    className={`border-t border-[var(--color-border)] ${blurOld(r) ? 'opacity-45' : ''}`}
                  >
                    <td className="p-3 font-mono text-xs">{r.numero}</td>
                    <td className="p-3">{r.clienteNombre}</td>
                    <td className="p-3">{r.tipoTrabajo}</td>
                    <td className="p-3 text-right font-mono">
                      {r.totalFinal ? formatCurrency(r.totalFinal) : <span className="italic text-xs text-[var(--color-text-2)]">Sin precio</span>}
                    </td>
                    <td className="p-3">
                      <div className="relative inline-block">
                        <select
                          className={`rounded-full px-2 py-1 text-xs font-semibold ${estadoStyle(est)}`}
                          value={est}
                          onChange={(e) => updateEstado(r.id, e.target.value)}
                        >
                          {ESTADOS.map((e) => (
                            <option key={e} value={e}>
                              {e.charAt(0).toUpperCase() + e.slice(1)}
                            </option>
                          ))}
                        </select>
                        {confettiId === r.id && <Confetti />}
                      </div>
                    </td>
                    <td className="p-3">{formatDate(r.fechaEmision || r.updatedAt)}</td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        <IconBtn label="Ver" onClick={() => onView(r)} />
                        <IconBtn label="Editar" onClick={() => onEdit(r)} />
                        <IconBtn
                          label="PDF"
                          onClick={() => {
                            try {
                              generatePresupuestoPDF(mergePayloadConEmpresa(r, empresa), { isPro })
                            } catch {
                              /* */
                            }
                          }}
                        />
                        <IconBtn
                          label="Enviar"
                          onClick={() =>
                            isPro ? onSendEmail?.(mergePayloadConEmpresa(r, empresa)) : onRequestUpgrade?.()
                          }
                        />
                        <IconBtn label="Duplicar" onClick={() => duplicarPresupuesto(r)} />
                        <IconBtn label="WhatsApp" onClick={() => shareWhatsApp(r)} />
                        <IconBtn label="Eliminar" onClick={() => setDeleteId(r.id)} />
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {!isPro && (
            <p className="border-t border-[var(--color-border)] p-3 text-xs text-[var(--color-text-2)]">
              Entradas de más de 30 días se muestran atenuadas. PRO: acceso íntegro e historial extendido.
            </p>
          )}
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {filtered.map((r) => {
            const est = r._effectiveEstado
            return (
              <motion.div
                key={r.id}
                layout
                className={`relative rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-sm ${blurOld(r) ? 'opacity-50' : ''}`}
              >
                {confettiId === r.id && <Confetti />}
                <div className="flex items-start justify-between gap-2">
                  <span className="font-mono text-xs text-[var(--color-accent)]">{r.numero}</span>
                  <select
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${estadoStyle(est)}`}
                    value={est}
                    onChange={(e) => updateEstado(r.id, e.target.value)}
                  >
                    {ESTADOS.map((e) => (
                      <option key={e} value={e}>{e.charAt(0).toUpperCase() + e.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div className="mt-2 font-display text-lg font-bold leading-tight text-[var(--color-text)]">{r.clienteNombre}</div>
                <div className="mt-0.5 text-sm text-[var(--color-text-2)]">{r.tipoTrabajo}{r.direccionObra ? ` · ${r.direccionObra}` : ''}</div>
                <div className="mt-3 flex items-end justify-between">
                  <span className="font-mono text-xl font-semibold text-[var(--color-text)]">
                    {r.totalFinal ? formatCurrency(r.totalFinal) : <span className="text-sm font-normal italic text-[var(--color-text-2)]">Sin precio</span>}
                  </span>
                  <span className="text-xs text-[var(--color-text-2)]">{formatDate(r.fechaEmision || r.updatedAt)}</span>
                </div>
                <div className="mt-3 grid grid-cols-4 gap-1.5">
                  <CardBtn label="Ver" onClick={() => onView(r)} />
                  <CardBtn label="Editar" onClick={() => onEdit(r)} />
                  <CardBtn label="PDF" onClick={() => { try { generatePresupuestoPDF(mergePayloadConEmpresa(r, empresa), { isPro }) } catch { /* */ } }} />
                  <CardBtn label="WhatsApp" onClick={() => shareWhatsApp(r)} accent />
                  <CardBtn label="Email" onClick={() => isPro ? onSendEmail?.(mergePayloadConEmpresa(r, empresa)) : onRequestUpgrade?.()} />
                  <CardBtn label="Duplicar" onClick={() => duplicarPresupuesto(r)} />
                  <CardBtn label="Eliminar" onClick={() => setDeleteId(r.id)} danger />
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        title="¿Eliminar presupuesto?"
        message="Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        onCancel={() => setDeleteId(null)}
        onConfirm={() => {
          setItems((prev) => prev.filter((p) => p.id !== deleteId))
          setDeleteId(null)
        }}
      />
    </div>
  )
}

function IconBtn({ label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded border border-[var(--color-border)] px-2 py-1 text-[10px] font-medium hover:bg-[var(--color-surface-2)]"
    >
      {label}
    </button>
  )
}

function CardBtn({ label, onClick, accent, danger }) {
  const base = 'rounded-lg px-2 py-1.5 text-xs font-semibold text-center transition-colors'
  const color = accent
    ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
    : danger
    ? 'bg-red-50 text-red-700 hover:bg-red-100'
    : 'border border-[var(--color-border)] bg-[var(--color-surface-2)] text-[var(--color-text)] hover:bg-[var(--color-border)]'
  return (
    <button type="button" onClick={onClick} className={`${base} ${color}`}>
      {label}
    </button>
  )
}

function Confetti() {
  const pts = Array.from({ length: 12 }, (_, i) => i)
  return (
    <span className="pointer-events-none absolute -top-2 left-1/2 z-10">
      {pts.map((i) => (
        <motion.span
          key={i}
          initial={{ y: 0, opacity: 1, x: 0 }}
          animate={{ y: 28 + (i % 5) * 2, x: (i - 6) * 6, opacity: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className="absolute h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]"
        />
      ))}
    </span>
  )
}
