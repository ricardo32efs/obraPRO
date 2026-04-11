import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useFocusTrap } from '../../hooks/useFocusTrap'

const CONTENT = {
  privacidad: {
    title: 'Privacidad de tus datos',
    body: (
      <div className="space-y-3 text-sm leading-relaxed text-[var(--color-text-2)]">
        <p>
          Obra Pro funciona principalmente en tu navegador. Los presupuestos, la configuración de tu empresa y las
          preferencias se guardan en el almacenamiento local de tu dispositivo (localStorage), salvo que uses
          funciones que envían datos a servicios externos.
        </p>
        <p>
          <strong className="text-[var(--color-text)]">Email (PRO):</strong> si configurás EmailJS, el envío de correos
          pasa por los servidores de EmailJS según su política. No almacenamos tus mensajes en un servidor propio de
          Obra Pro en esta versión.
        </p>
        <p>
          <strong className="text-[var(--color-text)]">Asistente IA:</strong> si activás sugerencias con Anthropic, el
          texto que envías a la API sigue los términos de Anthropic. En modo demo no se llama a servicios externos.
        </p>
        <p>
          Podés borrar todos los datos locales desde el navegador o desinstalando datos del sitio. Esto elimina
          presupuestos y configuración almacenados aquí.
        </p>
      </div>
    ),
  },
  terminos: {
    title: 'Términos de uso',
    body: (
      <div className="space-y-3 text-sm leading-relaxed text-[var(--color-text-2)]">
        <p>
          Obra Pro es una herramienta para elaborar y documentar presupuestos. Los importes, textos y documentos
          generados son tu responsabilidad. Verificá siempre cifras, alcance y condiciones antes de enviarlos a un
          cliente.
        </p>
        <p>
          Los PDF y exportaciones son herramientas comerciales cotidianas: vos decidís cómo usarlos. La app no ofrece
          servicios legales ni contables; cualquier trámite formal es bajo tu propio criterio.
        </p>
        <p>
          El plan gratuito y las funciones PRO pueden modificarse con aviso en futuras versiones. El modo PRO de
          demostración en esta versión activa prestaciones locales en tu navegador y no constituye una suscripción
          comercial real hasta que exista un medio de pago integrado en la aplicación.
        </p>
      </div>
    ),
  },
}

/**
 * Modal informativo (privacidad / términos) — texto orientativo, no sustituto legal.
 */
export function LegalInfoModal({ open, section, onClose }) {
  const trapRef = useFocusTrap(open)
  const data = section ? CONTENT[section] : null

  useEffect(() => {
    if (!open) return
    const onEsc = (e) => e.key === 'Escape' && onClose?.()
    window.addEventListener('keydown', onEsc)
    return () => window.removeEventListener('keydown', onEsc)
  }, [open, onClose])

  if (!open || !data) return null

  return (
    <div
      className="fixed inset-0 z-[170] flex items-center justify-center bg-black/45 p-4"
      role="presentation"
      onMouseDown={(e) => e.target === e.currentTarget && onClose?.()}
    >
      <motion.div
        ref={trapRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="legal-title"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        className="max-h-[85vh] w-full max-w-lg overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xl"
      >
        <div className="flex items-start justify-between gap-3 border-b border-[var(--color-border)] p-4">
          <h2 id="legal-title" className="font-display text-lg font-bold text-[var(--color-text)]">
            {data.title}
          </h2>
          <button
            type="button"
            aria-label="Cerrar"
            className="rounded-lg p-2 text-lg leading-none text-[var(--color-text-2)] hover:bg-[var(--color-surface-2)]"
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>
        <div className="max-h-[calc(85vh-4rem)] overflow-y-auto p-4">{data.body}</div>
        <p className="border-t border-[var(--color-border)] px-4 py-3 text-xs text-[var(--color-text-2)]">
          Texto orientativo para usar la app con claridad. No reemplaza estudios ni gestorías que elijas por tu cuenta si
          alguna vez los necesitás.
        </p>
      </motion.div>
    </div>
  )
}
