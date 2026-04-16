import { useState } from 'react'
import { motion } from 'framer-motion'
import { useFocusTrap } from '../../hooks/useFocusTrap'
import { PRICING_COPY } from '../../utils/pricingCopy'

const MP_MONTHLY_FALLBACK = 'https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=694c8af4e235462d805a3626647f3c1c'
const MP_ANNUAL_FALLBACK = 'https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=367ba17f12a5489a9bced3ff07824502'
const MONTHLY_URL = import.meta.env.VITE_PRO_CHECKOUT_MONTHLY_URL || import.meta.env.VITE_PRO_CHECKOUT_URL || MP_MONTHLY_FALLBACK
const ANNUAL_URL = import.meta.env.VITE_PRO_CHECKOUT_ANNUAL_URL || import.meta.env.VITE_PRO_CHECKOUT_URL || MP_ANNUAL_FALLBACK
const MONTHLY_STRIPE = import.meta.env.VITE_PRO_CHECKOUT_MONTHLY_URL_STRIPE
const ANNUAL_STRIPE = import.meta.env.VITE_PRO_CHECKOUT_ANNUAL_URL_STRIPE

/**
 * Modal de upgrade a PRO — fricción en features premium
 * onActivatePro(data) se llama cuando la verificación del pago es exitosa
 */
export function UpgradeModal({ open, onClose, onActivatePro }) {
  const trapRef = useFocusTrap(open)
  const [recoverId, setRecoverId] = useState('')
  const [recoverStatus, setRecoverStatus] = useState(null) // null | 'loading' | 'ok' | 'error'
  const [recoverMsg, setRecoverMsg] = useState('')

  const handleRecover = async () => {
    const id = recoverId.trim()
    if (!id || recoverStatus === 'loading') return
    setRecoverStatus('loading')
    setRecoverMsg('')
    try {
      const isNumeric = /^\d+$/.test(id)
      const qs = isNumeric ? `payment_id=${encodeURIComponent(id)}` : `preapproval_id=${encodeURIComponent(id)}`
      const r = await fetch(`/api/verify-payment?${qs}`)
      const data = await r.json()
      if (data.ok) {
        setRecoverStatus('ok')
        onActivatePro?.(data)
      } else {
        setRecoverStatus('error')
        setRecoverMsg(data.error || 'No se pudo verificar el pago. Revisá el ID e intentá nuevamente.')
      }
    } catch {
      setRecoverStatus('error')
      setRecoverMsg('Error de conexión. Verificá tu internet e intentá de nuevo.')
    }
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[160] flex items-center justify-center bg-black/45 p-4"
      role="presentation"
      onMouseDown={(e) => e.target === e.currentTarget && onClose?.()}
    >
      <motion.div
        ref={trapRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="upgrade-title"
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        className="w-full max-w-lg rounded-2xl border-2 border-[var(--color-accent)] bg-[var(--color-surface)] p-6 shadow-2xl overflow-y-auto max-h-[90dvh]"
      >
        <h2 id="upgrade-title" className="font-display text-2xl font-bold text-[var(--color-text)]">
          Pasá a PRO: presupuestos sin techo
        </h2>
        <p className="mt-2 text-[var(--color-text-2)]">
          Un solo lugar para materiales, mano de obra, PDF con tu marca e historial. {PRICING_COPY.shortDisclaimer}
        </p>
        <ul className="mt-5 space-y-2 text-sm text-[var(--color-text)]">
          {[
            'Presupuestos ilimitados (el plan gratis solo permite 1 nuevo por mes)',
            'PDF con tu logo y colores',
            'Plantillas inteligentes por tipo de obra',
            'Historial completo con búsqueda y estados',
            'Dashboard de métricas',
            'Plantillas, Excel y envío por email',
          ].map((t) => (
            <li key={t} className="flex gap-2">
              <span className="text-[var(--color-accent)]">•</span>
              <span>{t}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-2)]">Mensual</p>
            <p className="mt-1 font-mono text-2xl font-bold text-[var(--color-text)]">{PRICING_COPY.monthlyLine}</p>
            <div className="mt-3 flex flex-col gap-1.5">
              {MONTHLY_URL ? (
                <a href={MONTHLY_URL} target="_blank" rel="noopener noreferrer"
                  className="flex w-full items-center justify-center rounded-lg border-2 border-[var(--color-accent)] py-2 text-xs font-semibold text-[var(--color-accent)] transition hover:bg-[var(--color-surface)]">
                  Mercado Pago
                </a>
              ) : null}
              {MONTHLY_STRIPE ? (
                <a href={MONTHLY_STRIPE} target="_blank" rel="noopener noreferrer"
                  className="flex w-full items-center justify-center rounded-lg border-2 border-[#635BFF] py-2 text-xs font-semibold text-[#635BFF] transition hover:bg-[#635BFF]/5">
                  Stripe
                </a>
              ) : null}
            </div>
          </div>
          <div className="rounded-xl border-2 border-[var(--color-accent)]/40 bg-[var(--color-accent)]/5 px-4 py-3 relative">
            <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-[var(--color-accent)] px-2 py-0.5 text-[10px] font-bold text-white">MEJOR PRECIO</span>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-2)]">Anual</p>
            <p className="mt-1 font-mono text-2xl font-bold text-[var(--color-text)]">{PRICING_COPY.annualLine}</p>
            <div className="mt-3 flex flex-col gap-1.5">
              {ANNUAL_URL ? (
                <a href={ANNUAL_URL} target="_blank" rel="noopener noreferrer"
                  className="flex w-full items-center justify-center rounded-lg bg-[var(--color-accent)] py-2 text-xs font-semibold text-white transition hover:brightness-105">
                  Mercado Pago
                </a>
              ) : null}
              {ANNUAL_STRIPE ? (
                <a href={ANNUAL_STRIPE} target="_blank" rel="noopener noreferrer"
                  className="flex w-full items-center justify-center rounded-lg bg-[#635BFF] py-2 text-xs font-semibold text-white transition hover:brightness-105">
                  Stripe
                </a>
              ) : null}
            </div>
          </div>
        </div>
        <p className="mt-2 text-center text-xs text-[var(--color-text-2)]">{PRICING_COPY.annualSavings}</p>

        <div className="mt-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-4">
          <p className="text-sm font-semibold text-[var(--color-text)]">¿Ya pagaste? Recuperá tu acceso PRO</p>
          <p className="mt-1 text-xs text-[var(--color-text-2)]">
            Ingresá el ID de tu suscripción de Mercado Pago. Lo encontrás en el email de confirmación o en mercadopago.com.ar → Suscripciones.
          </p>
          <div className="mt-3 flex gap-2">
            <input
              type="text"
              value={recoverId}
              onChange={(e) => { setRecoverId(e.target.value); setRecoverStatus(null) }}
              onKeyDown={(e) => e.key === 'Enter' && handleRecover()}
              placeholder="ID de suscripción o pago"
              className="min-w-0 flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm outline-none focus:border-[var(--color-accent)]"
            />
            <button
              type="button"
              onClick={handleRecover}
              disabled={recoverStatus === 'loading' || !recoverId.trim()}
              className="rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white transition hover:brightness-105 disabled:opacity-50"
            >
              {recoverStatus === 'loading' ? 'Verificando…' : 'Verificar'}
            </button>
          </div>
          {recoverStatus === 'error' && (
            <p className="mt-2 text-xs text-red-600">{recoverMsg}</p>
          )}
          {recoverStatus === 'ok' && (
            <p className="mt-2 text-xs font-semibold text-emerald-600">¡PRO activado con éxito en este dispositivo!</p>
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full text-center text-sm text-[var(--color-text-2)] underline"
        >
          Seguir con plan gratuito
        </button>
      </motion.div>
    </div>
  )
}
