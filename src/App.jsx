import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { LS_KEYS } from './utils/constants'
import { useLocalStorage } from './hooks/useLocalStorage'
import { usePlan } from './hooks/usePlan'
import { ToastProvider, useToast } from './components/UI/ToastNotification'
import { UpgradeModal } from './components/UI/UpgradeModal'
import { BottomNav } from './components/UI/BottomNav'
import { Sidebar } from './components/UI/Sidebar'
import { PreviewModal } from './components/Preview/PreviewModal'
import { EmailSendModal } from './components/UI/EmailSendModal'
import { generatePresupuestoPDF } from './utils/generatePDF'
import { exportPresupuestoExcel } from './utils/exportExcel'
import { mergePayloadConEmpresa } from './utils/presupuestoHelpers'
import { RouteFallback } from './components/UI/RouteFallback'

const Landing = lazy(() => import('./components/Landing/Landing').then((m) => ({ default: m.Landing })))
const ConfigEmpresa = lazy(() =>
  import('./components/Onboarding/ConfigEmpresa').then((m) => ({ default: m.ConfigEmpresa })),
)
const NuevoPresupuesto = lazy(() =>
  import('./components/Presupuesto/NuevoPresupuesto').then((m) => ({ default: m.NuevoPresupuesto })),
)
const Historial = lazy(() => import('./components/Historial/Historial').then((m) => ({ default: m.Historial })))
const Dashboard = lazy(() => import('./components/Dashboard/Dashboard').then((m) => ({ default: m.Dashboard })))

/**
 * Router principal: landing → onboarding → app (nuevo / historial / dashboard / config)
 */
function AppInner() {
  const [plan, setPlan] = useLocalStorage(LS_KEYS.plan, 'free')
  const { isPro, activateProDemo } = usePlan(plan, setPlan)
  const [empresa, setEmpresa] = useLocalStorage(LS_KEYS.empresa, null)
  const [presupuestos, setPresupuestos] = useLocalStorage(LS_KEYS.presupuestos, [])
  const [plantillas, setPlantillas] = useLocalStorage(LS_KEYS.plantillas, [])
  const [onboardingDone, setOnboardingDone] = useLocalStorage(LS_KEYS.onboarding, false)

  const [route, setRoute] = useState('landing') // landing | onboarding | app
  const [appScreen, setAppScreen] = useState('nuevo')
  const [upgradeOpen, setUpgradeOpen] = useState(false)
  const [editDraft, setEditDraft] = useState(null)
  const [viewRecord, setViewRecord] = useState(null)
  const [exampleOpen, setExampleOpen] = useState(false)
  const [emailModalPayload, setEmailModalPayload] = useState(null)
  const [emailModalInstance, setEmailModalInstance] = useState(0)

  const { push: toast } = useToast()

  useEffect(() => {
    const onFull = () => {
      toast('No hay espacio suficiente para guardar. Liberá espacio en el navegador o borrá datos antiguos.', 'error')
    }
    window.addEventListener('obrapro-storage-full', onFull)
    return () => window.removeEventListener('obrapro-storage-full', onFull)
  }, [toast])

  const hasEmpresa = useMemo(
    () => Boolean(empresa?.nombreEmpresa && empresa?.nombreResponsable && empresa?.cuit),
    [empresa],
  )

  const requestUpgrade = useCallback(() => setUpgradeOpen(true), [])

  const openEmailComposer = useCallback(
    (rawPayload) => {
      if (!isPro) {
        requestUpgrade()
        return
      }
      setEmailModalInstance((n) => n + 1)
      setEmailModalPayload({
        ...rawPayload,
        empresa: rawPayload?.empresa || empresa,
      })
    },
    [isPro, empresa, requestUpgrade],
  )

  const enterApp = useCallback(
    (screen = 'nuevo') => {
      if (!hasEmpresa) {
        setRoute('onboarding')
        return
      }
      setRoute('app')
      setAppScreen(screen)
    },
    [hasEmpresa],
  )

  const onEmpresaSave = (data) => {
    setEmpresa(data)
    setOnboardingDone(true)
    setRoute('app')
    setAppScreen('nuevo')
    toast('Datos de empresa guardados', 'success')
  }

  const examplePayload = useMemo(
    () => ({
      numero: 'OBP-2026-DEMO',
      fechaEmision: '2026-03-01',
      validoHasta: '2026-03-16',
      clienteNombre: 'Cliente ejemplo',
      clienteTelefono: '+54 11 5555-0000',
      clienteEmail: 'cliente@ejemplo.com',
      direccionObra: 'Av. Siempre Viva 742, CABA',
      tipoTrabajo: 'Refacción integral',
      tipoTrabajoOtro: '',
      descripcion: 'Obra de ejemplo para demostración del documento.',
      fechaInicio: '2026-03-01',
      fechaEntrega: '2026-03-31',
      materiales: [
        { nombre: 'Cerámica 45x45', unidad: 'm²', cantidad: 12, precioUnitario: 8500 },
        { nombre: 'Adhesivo', unidad: 'bolsa', cantidad: 2, precioUnitario: 12000 },
      ],
      manoObra: [
        { descripcion: 'Colocación de cerámicas', categoria: 'Oficial', cantidad: 12, unidad: 'm²', precioUnitario: 8000 },
      ],
      gastosAdicionales: [],
      subtotalMateriales: 12 * 8500 + 2 * 12000,
      subtotalMano: 12 * 8000,
      subtotalGastos: 0,
      subtotal: 12 * 8500 + 2 * 12000 + 12 * 8000,
      incluirIva: true,
      ivaMonto: 0,
      totalFinal: 0,
      anticipoPct: 30,
      anticipoMonto: 0,
      condiciones: 'Presupuesto de demostración. No válido como cotización real.',
      validezDias: 15,
    }),
    [],
  )

  const examplePayloadComputed = useMemo(() => {
    const sub = examplePayload.subtotal
    const iva = examplePayload.incluirIva ? sub * 0.21 : 0
    const total = sub + iva
    return {
      ...examplePayload,
      ivaMonto: iva,
      totalFinal: total,
      anticipoMonto: (total * examplePayload.anticipoPct) / 100,
    }
  }, [examplePayload])

  return (
    <>
      <a
        href="#main-content"
        className="skip-to-content"
        onClick={(e) => {
          const el = document.getElementById('main-content')
          if (!el) return
          e.preventDefault()
          el.focus()
          const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
          el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })
        }}
      >
        Ir al contenido
      </a>

      <AnimatePresence mode="wait">
        {route === 'landing' && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Suspense fallback={<RouteFallback />}>
              <Landing
                hasEmpresaConfigured={hasEmpresa}
                onCrearPresupuesto={() => enterApp('nuevo')}
                onVerEjemploPdf={() => setExampleOpen(true)}
              />
            </Suspense>
          </motion.div>
        )}

        {route === 'onboarding' && (
          <motion.div
            key="onboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Suspense fallback={<RouteFallback />}>
              <ConfigEmpresa
                initial={empresa || {}}
                onSave={onEmpresaSave}
                onCancel={onboardingDone ? () => setRoute('app') : undefined}
                embedded={false}
              />
            </Suspense>
          </motion.div>
        )}

        {route === 'app' && (
          <motion.div
            key="app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="min-h-svh lg:pl-60"
          >
            <header className="sticky top-0 z-[70] flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-surface)]/95 px-4 py-3 backdrop-blur lg:hidden">
              <button
                type="button"
                className="flex items-center gap-2 font-display text-lg font-bold"
                onClick={() => setRoute('landing')}
              >
                <span className="text-[var(--color-accent)]">OP</span>
                Obra Pro
              </button>
              <button
                type="button"
                className="text-xl"
                aria-label="Configuración"
                onClick={() => setAppScreen('config')}
              >
                <span className="inline-flex items-center gap-1 text-sm font-medium">
                  <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" aria-hidden>
                    <circle cx="12" cy="12" r="3.1" fill="none" stroke="currentColor" strokeWidth="1.8" />
                    <path
                      d="M12 4.5v2.2M12 17.3v2.2M4.5 12h2.2M17.3 12h2.2M6.8 6.8l1.5 1.5M15.7 15.7l1.5 1.5M17.2 6.8l-1.5 1.5M8.3 15.7l-1.5 1.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    />
                  </svg>
                  Config
                </span>
              </button>
            </header>

            <Sidebar
              screen={appScreen}
              onNavigate={setAppScreen}
              onHome={() => setRoute('landing')}
            />

            <main id="main-content" tabIndex={-1} className="min-h-svh outline-none">
              {appScreen === 'nuevo' && (
                <Suspense fallback={<RouteFallback />}>
                  <NuevoPresupuesto
                    empresa={empresa}
                    isPro={isPro}
                    onRequestUpgrade={requestUpgrade}
                    presupuestos={presupuestos}
                    setPresupuestos={setPresupuestos}
                    plantillas={plantillas}
                    setPlantillas={setPlantillas}
                    initialDraft={editDraft}
                    onClearInitial={() => setEditDraft(null)}
                  />
                </Suspense>
              )}
              {appScreen === 'historial' && (
                <Suspense fallback={<RouteFallback />}>
                  <Historial
                    empresa={empresa}
                    items={presupuestos}
                    setItems={setPresupuestos}
                    isPro={isPro}
                    onRequestUpgrade={requestUpgrade}
                    onView={(r) => setViewRecord(r)}
                    onEdit={(r) => {
                      setEditDraft(r)
                      setAppScreen('nuevo')
                    }}
                    onSendEmail={(r) => openEmailComposer(r)}
                  />
                </Suspense>
              )}
              {appScreen === 'dashboard' && (
                <Suspense fallback={<RouteFallback />}>
                  <Dashboard presupuestos={presupuestos} isPro={isPro} onRequestUpgrade={requestUpgrade} />
                </Suspense>
              )}
              {appScreen === 'config' && (
                <Suspense fallback={<RouteFallback />}>
                  <ConfigEmpresa
                    embedded
                    initial={empresa || {}}
                    onSave={(d) => {
                      setEmpresa(d)
                      toast('Configuración actualizada', 'success')
                    }}
                    onCancel={() => setAppScreen('nuevo')}
                  />
                </Suspense>
              )}
            </main>

            <BottomNav screen={appScreen} onNavigate={setAppScreen} />
          </motion.div>
        )}
      </AnimatePresence>

      <UpgradeModal
        open={upgradeOpen}
        onClose={() => setUpgradeOpen(false)}
        onActivateDemo={() => {
          activateProDemo()
          setUpgradeOpen(false)
          toast('Plan PRO activado en este dispositivo', 'success')
        }}
      />

      <PreviewModal
        open={!!viewRecord || exampleOpen}
        readOnly={!!viewRecord || exampleOpen}
        onClose={() => {
          setViewRecord(null)
          setExampleOpen(false)
        }}
        payload={mergePayloadConEmpresa(viewRecord || examplePayloadComputed, empresa)}
        empresa={empresa || { nombreEmpresa: 'Obra Pro' }}
        isPro={isPro}
        onDownloadPdf={() => {
          try {
            const merged = mergePayloadConEmpresa(viewRecord || examplePayloadComputed, empresa)
            generatePresupuestoPDF(merged, { isPro })
            toast('PDF descargado', 'success')
          } catch {
            toast('Error al generar PDF', 'error')
          }
        }}
        onExportExcel={() => {
          if (!isPro) requestUpgrade()
          else {
            try {
              const merged = mergePayloadConEmpresa(viewRecord || examplePayloadComputed, empresa)
              const baseName = viewRecord
                ? `Presupuesto-${String(viewRecord.numero || 'obra').replace(/\s/g, '_')}`
                : 'Ejemplo-ObraPro'
              exportPresupuestoExcel(merged, baseName)
              toast('Excel exportado', 'success')
            } catch {
              toast('Error al exportar', 'error')
            }
          }
        }}
        onEmail={() => openEmailComposer(mergePayloadConEmpresa(viewRecord || examplePayloadComputed, empresa))}
        onSave={() => {
          setExampleOpen(false)
          setViewRecord(null)
        }}
        onContinueEdit={() => {
          setExampleOpen(false)
          setViewRecord(null)
        }}
      />

      <EmailSendModal
        open={!!emailModalPayload}
        onClose={() => setEmailModalPayload(null)}
        instanceKey={emailModalInstance}
        empresa={empresa}
        payload={emailModalPayload}
        isPro={isPro}
        onRequestUpgrade={requestUpgrade}
        onSent={() => {
          const id = emailModalPayload?.id
          if (id) {
            const ts = new Date().toISOString()
            setPresupuestos((prev) =>
              prev.map((p) =>
                p.id === id ? { ...p, estado: 'enviado', enviadoAt: ts, updatedAt: ts } : p,
              ),
            )
          }
          toast('Email enviado', 'success')
          setEmailModalPayload(null)
        }}
      />
    </>
  )
}

export default function App() {
  return (
    <ToastProvider>
      <AppInner />
    </ToastProvider>
  )
}
