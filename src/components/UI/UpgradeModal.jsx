import { motion } from 'framer-motion'
import { useFocusTrap } from '../../hooks/useFocusTrap'
import { PRICING_COPY } from '../../utils/pricingCopy'

const PRO_CHECKOUT_URL = import.meta.env.VITE_PRO_CHECKOUT_URL

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
        className="w-full max-w-lg rounded-2xl border-2 border-[var(--color-accent)] bg-[var(--color-surface)] p-8 shadow-2xl"
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
            'Asistente IA para no olvidar ítems ni cantidades',
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
        <div className="mt-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-2)]">Precio referencia</p>
          <div className="mt-1 flex flex-col gap-0.5">
            <span className="font-mono text-3xl font-semibold text-[var(--color-text)]">{PRICING_COPY.monthlyLine}</span>
            <span className="text-sm text-[var(--color-text-2)]">
              o {PRICING_COPY.annualLine} — {PRICING_COPY.annualSavings}
            </span>
          </div>
        </div>
        {PRO_CHECKOUT_URL ? (
          <a
            href={PRO_CHECKOUT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 flex w-full items-center justify-center rounded-xl border-2 border-[var(--color-accent)] bg-[var(--color-surface)] py-3 text-center text-sm font-semibold text-[var(--color-accent)] transition hover:bg-[var(--color-surface-2)]"
          >
            {PRICING_COPY.checkoutCta}
          </a>
        ) : null}
        <button
          type="button"
          onClick={onActivateDemo}
          className={`w-full rounded-xl bg-gradient-to-r from-[#c1440e] to-[#8b4513] py-3 text-center text-sm font-semibold text-white shadow-md transition hover:brightness-105 ${PRO_CHECKOUT_URL ? 'mt-3' : 'mt-6'}`}
        >
          Activar PRO de prueba (solo este dispositivo)
        </button>
        <p className="mt-3 text-center text-xs text-[var(--color-text-2)]">
          {PRO_CHECKOUT_URL
            ? 'El cobro lo hace el enlace (Mercado Pago, Stripe, etc.). Hasta activar cuentas en la app, podés usar PRO de prueba acá después de pagar si lo coordinás vos.'
            : 'PRO de prueba se guarda en este navegador. Cuando el sitio tenga enlace de pago configurado, vas a ver el botón de checkout acá.'}
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
