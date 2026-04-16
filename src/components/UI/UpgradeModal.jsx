import { motion } from 'framer-motion'
import { useFocusTrap } from '../../hooks/useFocusTrap'
import { PRICING_COPY } from '../../utils/pricingCopy'

const MP_MONTHLY_FALLBACK = 'https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=694c8af4e235462d805a3626647f3c1c'
const MP_ANNUAL_FALLBACK = 'https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=367ba17f12a5489a9bced3ff07824502'
const MONTHLY_URL = import.meta.env.VITE_PRO_CHECKOUT_MONTHLY_URL || import.meta.env.VITE_PRO_CHECKOUT_URL || MP_MONTHLY_FALLBACK
const ANNUAL_URL = import.meta.env.VITE_PRO_CHECKOUT_ANNUAL_URL || import.meta.env.VITE_PRO_CHECKOUT_URL || MP_ANNUAL_FALLBACK
const MONTHLY_STRIPE = import.meta.env.VITE_PRO_CHECKOUT_MONTHLY_URL_STRIPE
const ANNUAL_STRIPE = import.meta.env.VITE_PRO_CHECKOUT_ANNUAL_URL_STRIPE
const hasCheckout = !!(MONTHLY_URL || ANNUAL_URL || MONTHLY_STRIPE || ANNUAL_STRIPE)

/**
 * Modal de upgrade a PRO — fricción en features premium
 */
export function UpgradeModal({ open, onClose, onActivateDemo }) {
  const trapRef = useFocusTrap(open)
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
            'Presupuestos ilimitados (el plan gratis corta a 5 nuevos por mes)',
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
              {!MONTHLY_URL && !MONTHLY_STRIPE && (
                <p className="text-[10px] text-[var(--color-text-2)] opacity-60">Pago próximamente</p>
              )}
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
              {!ANNUAL_URL && !ANNUAL_STRIPE && (
                <p className="text-[10px] text-[var(--color-text-2)] opacity-60">Pago próximamente</p>
              )}
            </div>
          </div>
        </div>
        <p className="mt-2 text-center text-xs text-[var(--color-text-2)]">{PRICING_COPY.annualSavings}</p>
        <button
          type="button"
          onClick={onActivateDemo}
          className="mt-5 w-full rounded-xl bg-gradient-to-r from-[#c1440e] to-[#8b4513] py-3 text-center text-sm font-semibold text-white shadow-md transition hover:brightness-105"
        >
          {hasCheckout ? 'Probar PRO gratis en este dispositivo' : 'Activar PRO de prueba (solo este dispositivo)'}
        </button>
        <p className="mt-2 text-center text-xs text-[var(--color-text-2)]">
          {hasCheckout
            ? 'Pagá por el enlace de arriba para acceso permanente. La prueba es solo en este navegador.'
            : 'PRO de prueba se guarda en este navegador. El pago real estará disponible pronto.'}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-4 w-full text-center text-sm text-[var(--color-text-2)] underline"
        >
          Seguir con plan gratuito
        </button>
      </motion.div>
    </div>
  )
}
