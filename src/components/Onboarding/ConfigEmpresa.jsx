import { useState } from 'react'
import { motion } from 'framer-motion'
import { PROVINCIAS_AR } from '../../utils/constants'
import { validateEmpresaConfig } from '../../utils/validateForm'

const defaultEmpresa = () => ({
  nombreEmpresa: '',
  nombreResponsable: '',
  cuit: '',
  telefono: '',
  email: '',
  direccion: '',
  ciudad: '',
  provincia: PROVINCIAS_AR[0],
  logoBase64: '',
  pdfAccentColor: '#C1440E',
  pdfFooter: '',
  condicionesDefault:
    'El presente presupuesto tiene validez desde la fecha de emisión. No incluye imprevistos ni trabajos no detallados. Los precios pueden variar según el mercado de materiales.',
})

/**
 * Onboarding / configuración de empresa — modal o pantalla completa
 */
export function ConfigEmpresa({ initial, embedded, onSave, onCancel, isPro = false, onRequestUpgrade }) {
  const [form, setForm] = useState(() => ({ ...defaultEmpresa(), ...initial }))
  const [errors, setErrors] = useState({})

  const title = embedded ? 'Configuración de la empresa' : 'Bienvenido a Obra Pro'

  const onSubmit = (e) => {
    e.preventDefault()
    const v = validateEmpresaConfig(form)
    setErrors(v.errors || {})
    if (!v.ok) return
    onSave(form)
  }

  const onFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setForm((f) => ({ ...f, logoBase64: String(reader.result || '') }))
    reader.readAsDataURL(file)
  }

  const content = (
    <form onSubmit={onSubmit} className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-[var(--color-text)]">{title}</h1>
          <p className="mt-1 text-sm text-[var(--color-text-2)]">
            Estos datos aparecen en el encabezado del presupuesto y en el PDF (PRO con marca).
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Field
            label="Nombre de la empresa o profesional"
            value={form.nombreEmpresa}
            onChange={(v) => setForm((f) => ({ ...f, nombreEmpresa: v }))}
            error={errors.nombreEmpresa}
            required
          />
          <Field
            label="Responsable (nombre completo)"
            value={form.nombreResponsable}
            onChange={(v) => setForm((f) => ({ ...f, nombreResponsable: v }))}
            error={errors.nombreResponsable}
            required
          />
          <Field
            label="CUIT"
            placeholder="20-12345678-3"
            value={form.cuit}
            onChange={(v) => setForm((f) => ({ ...f, cuit: v }))}
            error={errors.cuit}
          />
          <Field
            label="Teléfono"
            value={form.telefono}
            onChange={(v) => setForm((f) => ({ ...f, telefono: v }))}
          />
          <Field
            label="Email de contacto"
            type="email"
            value={form.email}
            onChange={(v) => setForm((f) => ({ ...f, email: v }))}
            error={errors.email}
          />
          <Field
            label="Dirección"
            value={form.direccion}
            onChange={(v) => setForm((f) => ({ ...f, direccion: v }))}
          />
          <Field
            label="Ciudad/Localidad"
            value={form.ciudad}
            onChange={(v) => setForm((f) => ({ ...f, ciudad: v }))}
          />
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)]">Provincia</label>
            <select
              className="mt-1 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm"
              value={form.provincia}
              onChange={(e) => setForm((f) => ({ ...f, provincia: e.target.value }))}
            >
              {PROVINCIAS_AR.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="rounded-xl border border-dashed border-[var(--color-border)] p-4">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-[var(--color-text)]">Logo de la empresa</p>
            {!isPro && (
              <span className="rounded-full bg-[var(--color-accent)] px-2 py-0.5 text-[10px] font-bold text-white">PRO</span>
            )}
          </div>
          {isPro ? (
            <div className="mt-3 flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-[var(--color-surface-2)] ring-2 ring-[var(--color-border)]">
                {form.logoBase64 ? (
                  <img src={form.logoBase64} alt="Logotipo cargado" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-xs text-[var(--color-text-2)]">Sin logo</span>
                )}
              </div>
              <input type="file" accept="image/*" onChange={onFile} className="text-sm" />
            </div>
          ) : (
            <button
              type="button"
              onClick={onRequestUpgrade}
              className="mt-3 flex w-full items-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 py-3 text-left transition hover:bg-[var(--color-border)]"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--color-surface)] ring-2 ring-[var(--color-border)]">
                <span className="text-lg">🔒</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--color-text)]">Subir logo — solo PRO</p>
                <p className="text-xs text-[var(--color-text-2)]">El logo aparece en el encabezado del PDF. Actualizá a PRO para activarlo.</p>
              </div>
            </button>
          )}
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)]/60 p-4">
          <p className="text-sm font-semibold text-[var(--color-text)]">PDF — personalización PRO</p>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-[var(--color-text-2)]">Color de acento</label>
              <input
                type="color"
                value={form.pdfAccentColor}
                onChange={(e) => setForm((f) => ({ ...f, pdfAccentColor: e.target.value }))}
                className="mt-1 h-10 w-full cursor-pointer rounded border border-[var(--color-border)]"
              />
            </div>
            <Field
              label="Pie de página del PDF"
              value={form.pdfFooter}
              onChange={(v) => setForm((f) => ({ ...f, pdfFooter: v }))}
            />
          </div>
          <label className="mt-3 block text-xs font-medium text-[var(--color-text-2)]">
            Condiciones generales predeterminadas
          </label>
          <textarea
            className="mt-1 min-h-[88px] w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-2 text-sm"
            value={form.condicionesDefault}
            onChange={(e) => setForm((f) => ({ ...f, condicionesDefault: e.target.value }))}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            className="rounded-xl bg-gradient-to-r from-[#c1440e] to-[#8b4513] px-6 py-3 text-sm font-semibold text-white shadow"
          >
            Guardar y comenzar
          </button>
          {embedded && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-xl border border-[var(--color-border)] px-6 py-3 text-sm font-semibold"
            >
              Volver
            </button>
          )}
        </div>
      </form>
  )

  if (embedded) {
    return <div className="mx-auto max-w-3xl px-4 py-8">{content}</div>
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-svh bg-[var(--color-bg)] px-4 py-10"
    >
      <div className="mx-auto max-w-3xl rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-lg md:p-10">
        {content}
      </div>
    </motion.div>
  )
}

function Field({ label, value, onChange, error, type = 'text', required, placeholder }) {
  return (
    <div>
      <label className="block text-sm font-medium text-[var(--color-text)]">
        {label}
        {required ? ' *' : ''}
      </label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm"
      />
      {error && <p className="mt-1 text-xs text-[var(--color-danger)]">Error: {error}</p>}
    </div>
  )
}
