import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { LegalInfoModal } from '../UI/LegalInfoModal'
import { PRICING_COPY } from '../../utils/pricingCopy'

function Logo() {
  return (
    <svg width="36" height="36" viewBox="0 0 32 32" className="text-[var(--color-accent)]" aria-hidden>
      <path
        fill="currentColor"
        d="M16 2L4 9v14l12 7 12-7V9L16 2zm0 3.2L22.5 9 16 12.8 9.5 9 16 5.2zM7 11.5l8 4.8v9.4l-8-4.7v-9.5zm10 14.2v-9.4l8-4.8v9.5l-8 4.7z"
      />
    </svg>
  )
}

function StepCard({ n, title, desc }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.35, delay: n * 0.15 }}
      className="obrapro-card rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6"
    >
      <div className="font-display text-4xl font-black text-[var(--color-accent)]/30">{n + 1}</div>
      <h3 className="mt-3 font-display text-lg font-bold text-[var(--color-text)]">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-2)]">{desc}</p>
    </motion.div>
  )
}

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-[var(--color-border)] py-3">
      <button
        type="button"
        className="flex w-full items-center justify-between text-left text-sm font-semibold text-[var(--color-text)]"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        {q}
        <span className="text-[var(--color-accent)]">{open ? '−' : '+'}</span>
      </button>
      {open && <p className="mt-2 text-sm text-[var(--color-text-2)]">{a}</p>}
    </div>
  )
}

/** Mockup de presupuesto en papel */
function PdfMockup() {
  return (
    <div
      className="relative mx-auto w-[min(100%,320px)] -rotate-3 rounded-sm bg-white p-5 shadow-[0_20px_50px_rgba(0,0,0,0.18)] ring-1 ring-black/5"
      aria-hidden
    >
      <div className="h-2 w-16 rounded bg-[var(--color-primary)]" />
      <div className="mt-3 font-display text-lg font-bold text-[var(--color-text)]">PRESUPUESTO</div>
      <div className="mt-1 font-mono text-xs text-[var(--color-accent)]">OBP-2026-0042</div>
      <div className="mt-4 space-y-1 text-[10px] text-[var(--color-text-2)]">
        <div className="flex justify-between border-b border-[var(--color-border)] pb-1">
          <span>Cerámica 45x45</span>
          <span className="font-mono">$184.200</span>
        </div>
        <div className="flex justify-between border-b border-[var(--color-border)] pb-1">
          <span>Mano de obra</span>
          <span className="font-mono">$420.000</span>
        </div>
      </div>
      <div className="mt-4 text-right font-mono text-sm font-bold text-[var(--color-accent)]">TOTAL $612.450</div>
    </div>
  )
}

/**
 * Landing marketing — entrada principal
 */
export function Landing({
  onCrearPresupuesto,
  onVerEjemploPdf,
  hasEmpresaConfigured,
}) {
  const [legalSection, setLegalSection] = useState(null)

  return (
    <div className="min-h-svh bg-gradient-to-b from-[var(--color-bg)] to-white">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
        <div className="flex items-center gap-2 font-display text-xl font-bold text-[var(--color-text)]">
          <Logo />
          Obra Pro
        </div>
        <button
          type="button"
          onClick={onCrearPresupuesto}
          className="text-sm font-semibold text-[var(--color-accent)] underline"
        >
          Ingresar
        </button>
      </header>

      <section className="mx-auto grid max-w-6xl gap-10 px-4 pb-16 pt-6 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1 text-xs font-medium text-[var(--color-text-2)]">
            Diseñado para obras, refacciones y contratistas en Argentina
          </div>
          <h1 className="mt-5 font-display text-[2.6rem] font-black leading-[1.05] text-[var(--color-text)] lg:text-[4.25rem]">
            Presupuestos de obra que te hacen ganar clientes.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-[var(--color-text-2)]">
            Calculá materiales, mano de obra y costos en minutos. Enviá un presupuesto PDF profesional desde tu
            celular o computadora. Con inteligencia artificial que te ayuda a no olvidar nada.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onCrearPresupuesto}
              className="rounded-xl bg-gradient-to-r from-[#c1440e] to-[#8b4513] px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:brightness-105"
            >
              Crear mi primer presupuesto
            </button>
            <button
              type="button"
              onClick={onVerEjemploPdf}
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-3 text-sm font-semibold text-[var(--color-text)] transition hover:bg-[var(--color-surface-2)]"
            >
              Ver ejemplo de presupuesto
            </button>
          </div>
          <p className="mt-6 text-xs text-[var(--color-text-2)]">
            Gratis para empezar · Sin tarjeta para el plan gratis · Listo en minutos
          </p>
          <p className="mt-2 text-xs font-medium text-[var(--color-text-2)]">
            Sin permanencia · Cancelás cuando quieras · El pago lo procesa Mercado Pago u otro checkout seguro (cuando
            actives el enlace)
          </p>
          {!hasEmpresaConfigured && (
            <p className="mt-2 text-xs font-medium text-[var(--color-warning)]">
              Primera vez: vamos a pedirte los datos de tu empresa (un solo paso).
            </p>
          )}
        </div>
        <div className="flex justify-center lg:justify-end">
          <PdfMockup />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-center font-display text-3xl font-bold text-[var(--color-text)]">
          Tres pasos. Un presupuesto perfecto.
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <StepCard
            n={0}
            title="Cargás datos del cliente"
            desc="Tipo de obra, plazos y descripción. Todo en un formulario claro y validado."
          />
          <StepCard
            n={1}
            title="Materiales y mano de obra"
            desc="Tablas inteligentes con biblioteca de materiales y sugerencias de la IA."
          />
          <StepCard
            n={2}
            title="PDF formal en segundos"
            desc="Documento listo para enviar, con totales, IVA, anticipo y condiciones."
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-center font-display text-3xl font-bold text-[var(--color-text)]">
          Todo lo que necesita un módulo profesional
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ['Biblioteca de materiales', 'Más de 80 ítems con autocompletado y unidades habituales.'],
            ['Asistente IA', 'Sugerencias realistas de materiales, cantidades y mano de obra.'],
            ['PDF profesional', 'Encabezado con tu empresa, tablas y bloque de firmas.'],
            ['Dashboard de negocio', 'Métricas de facturación y tasa de aprobación (PRO).'],
            ['Envío por email', 'Contacto directo con plantilla editable (PRO + EmailJS).'],
            ['Estados y seguimiento', 'Borrador, enviado, aprobado, rechazado o vencido.'],
          ].map(([t, d]) => (
            <div
              key={t}
              className="obrapro-card rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5"
            >
              <h3 className="mt-1 font-display text-lg font-bold text-[var(--color-text)]">{t}</h3>
              <p className="mt-2 text-sm text-[var(--color-text-2)]">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-center font-display text-3xl font-bold text-[var(--color-text)]">
          Por qué conviene ordenar los números de la obra
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-[var(--color-text-2)]">
          Obra Pro está pensado para que lleves cliente, materiales y totales en un solo documento profesional, sin
          depender de planillas sueltas.
        </p>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {[
            ['Claridad con el cliente', 'Itemización y totales explícitos reducen malentendidos sobre alcance y precio.'],
            ['Menos tiempo administrativo', 'Reutilizás plantillas, historial y exportaciones en segundos.'],
            ['Desde la obra o la oficina', 'Interfaz pensada para celular y escritorio con la misma información.'],
          ].map(([t, d]) => (
            <div
              key={t}
              className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-sm"
            >
              <h3 className="mt-1 font-display text-base font-bold text-[var(--color-text)]">{t}</h3>
              <p className="mt-2 text-sm text-[var(--color-text-2)]">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="precios" className="mx-auto max-w-4xl scroll-mt-20 px-4 py-16">
        <h2 className="text-center font-display text-3xl font-bold text-[var(--color-text)]">
          Simple y sin sorpresas.
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-[var(--color-text-2)]">
          {PRICING_COPY.shortDisclaimer} Recomendamos <strong className="text-[var(--color-text)]">mensual</strong> para
          entrar fácil y <strong className="text-[var(--color-text)]">anual</strong> si ya usás la herramienta todos los
          meses (mejor precio por mes).
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
            <h3 className="font-display text-xl font-bold">Gratis</h3>
            <p className="mt-4 font-mono text-3xl">$0</p>
            <ul className="mt-4 space-y-2 text-sm text-[var(--color-text-2)]">
              <li>Hasta 5 presupuestos nuevos por mes</li>
              <li>PDF estándar</li>
              <li>Funciones esenciales para probar el flujo</li>
            </ul>
            <button
              type="button"
              onClick={onCrearPresupuesto}
              className="mt-6 w-full rounded-xl border border-[var(--color-border)] py-3 text-sm font-semibold"
            >
              Empezar gratis
            </button>
          </div>
          <div className="relative rounded-2xl border-2 border-[var(--color-accent)] bg-[var(--color-primary)] p-6 text-white shadow-xl">
            <span className="absolute -top-3 right-4 rounded-full bg-[var(--color-accent)] px-3 py-0.5 text-xs font-bold">
              Más elegido
            </span>
            <h3 className="font-display text-xl font-bold">PRO</h3>
            <p className="mt-4 font-mono text-3xl">{PRICING_COPY.monthlyLine}</p>
            <p className="text-sm opacity-80">
              o {PRICING_COPY.annualLine} ({PRICING_COPY.annualSavings})
            </p>
            <ul className="mt-4 space-y-2 text-sm opacity-95">
              <li>Ilimitado + IA + marca en PDF</li>
              <li>Dashboard, plantillas, Excel, email</li>
            </ul>
            <button
              type="button"
              onClick={onCrearPresupuesto}
              className="mt-6 w-full rounded-xl bg-[var(--color-accent)] py-3 text-sm font-semibold text-white"
            >
              Entrar a la app y elegir PRO
            </button>
          </div>
        </div>
        <div className="mx-auto mt-8 max-w-2xl rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-5 text-sm text-[var(--color-text-2)]">
          <p className="font-display text-base font-bold text-[var(--color-text)]">¿Qué modelo conviene?</p>
          <p className="mt-2">
            <strong className="text-[var(--color-text)]">Mensual o anual</strong> encajan bien con una herramienta que
            usás seguido: el costo se compara con un solo presupuesto ganado.{' '}
            <strong className="text-[var(--color-text)]">Semanal</strong> suele generar desconfianza (muchas cobranzas) y
            más trabajo administrativo; no lo recomendamos. Un{' '}
            <strong className="text-[var(--color-text)]">pago único “de por vida”</strong> puede servir como oferta de
            lanzamiento acotada; para mantener mejoras y soporte, lo recurrente es más sostenible.
          </p>
        </div>
        <p className="mt-6 text-center text-sm text-[var(--color-text-2)]">
          Sin permanencia obligatoria. Cancelás cuando quieras.
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-12">
        <h2 className="text-center font-display text-2xl font-bold">Preguntas frecuentes</h2>
        <div className="mt-6">
          <FaqItem
            q="¿Los presupuestos tienen validez legal?"
            a="Son cotizaciones comerciales habituales entre partes: sirven para acordar montos y alcance con claridad. Lo que firmen o acuerden después depende de ustedes; Obra Pro solo te ayuda a documentar el presupuesto."
          />
          <FaqItem
            q="¿Puedo usar la app en la obra con el celular?"
            a="Sí. El diseño es mobile-first: tablas con scroll o vista de cards según el tamaño de pantalla."
          />
          <FaqItem
            q="¿Cómo funciona el asistente con IA?"
            a="Analiza tu descripción y sugiere materiales, cantidades y precios orientativos. Siempre podés editar todo. Requiere API key de Anthropic o modo demo."
          />
          <FaqItem
            q="¿Puedo poner el logo en el PDF?"
            a="En PRO podés subir logo y color de acento del documento."
          />
          <FaqItem
            q="¿Qué pasa si llego al límite del plan gratuito?"
            a="En el plan gratuito podés crear hasta 5 presupuestos nuevos por mes calendario (según la fecha de creación guardada). Los que ya tenés podés seguir editándolos. Si necesitás más, podés activar PRO o esperar al mes siguiente."
          />
          <FaqItem
            q="¿Están seguros mis datos?"
            a="Todo se guarda en tu navegador (localStorage). No tenemos servidor propio en esta versión."
          />
          <FaqItem
            q="¿Cómo pago la suscripción PRO si no sé de tecnología?"
            a="Cuando el sitio tenga activado el enlace de pago (por ejemplo Mercado Pago), tocás el botón en la app, completás el pago en esa página y listo. No tenés que programar nada: es igual que pagar cualquier compra online."
          />
          <FaqItem
            q="¿Es mejor pagar semanal, mensual o de una vez?"
            a="Para esta app recomendamos mensual o anual: son fáciles de entender y el anual suele salir más barato por mes. El cobro semanal no lo recomendamos (muchas veces genera desconfianza). Un pago único de por vida puede usarse como promoción puntual, pero para mantener el producto en el tiempo lo habitual es suscripción."
          />
        </div>
      </section>

      <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface)] py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 text-center text-sm text-[var(--color-text-2)]">
          <div className="flex items-center gap-2 font-display text-lg font-bold text-[var(--color-text)]">
            <Logo />
            Obra Pro
          </div>
          <p>Presupuestos profesionales para la construcción</p>
          <nav className="flex flex-wrap justify-center gap-x-2 gap-y-1 text-[var(--color-text)]" aria-label="Pie de página">
            <button type="button" className="underline" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              Inicio
            </button>
            <span className="text-[var(--color-border)]" aria-hidden>
              |
            </span>
            <a href="#precios" className="underline">
              Precios
            </a>
            <span className="text-[var(--color-border)]" aria-hidden>
              |
            </span>
            <button type="button" className="underline" onClick={() => setLegalSection('privacidad')}>
              Privacidad
            </button>
            <span className="text-[var(--color-border)]" aria-hidden>
              |
            </span>
            <button type="button" className="underline" onClick={() => setLegalSection('terminos')}>
              Términos
            </button>
          </nav>
          <p className="text-xs">© 2026 Obra Pro.</p>
        </div>
      </footer>

      <LegalInfoModal open={!!legalSection} section={legalSection} onClose={() => setLegalSection(null)} />
    </div>
  )
}
