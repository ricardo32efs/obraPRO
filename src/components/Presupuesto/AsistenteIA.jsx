import { motion } from 'framer-motion'

/** Panel de resultado del análisis IA */
export function AsistenteIAResultado({ data, onDismiss }) {
  if (!data) return null
  const conf = data.confianza_estimacion || data.confianza || 'media'
  const badge =
    conf === 'alta'
      ? 'bg-[var(--color-success)] text-white'
      : conf === 'baja'
        ? 'bg-[var(--color-danger)] text-white'
        : 'bg-[var(--color-warning)] text-white'

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      className="mb-6 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-display text-lg font-bold text-[var(--color-text)]">Resultado del análisis IA</h3>
        <div className="flex items-center gap-2">
          {data._demo && (
            <span className="rounded-full bg-[var(--color-surface-2)] px-2 py-0.5 text-xs font-semibold">
              Ejemplo de IA
            </span>
          )}
          <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${badge}`}>
            Confianza: {conf}
          </span>
          <button type="button" onClick={onDismiss} className="text-xs text-[var(--color-text-2)] underline">
            Cerrar
          </button>
        </div>
      </div>
      {data.motivo_confianza && (
        <p className="mt-2 text-xs text-[var(--color-text-2)]">{data.motivo_confianza}</p>
      )}
      {data.superficie_estimada && (
        <p className="mt-1 text-xs text-[var(--color-text-2)]">
          Superficie estimada: <strong>{data.superficie_estimada}</strong>
        </p>
      )}
      {data.observaciones?.length > 0 && (
        <ul className="mt-3 space-y-1 text-sm">
          {data.observaciones.map((o, i) => (
            <li key={i} className="flex gap-2 text-[var(--color-text)]">
              <span className="text-sky-600">Info</span>
              {o}
            </li>
          ))}
        </ul>
      )}
      {data.advertencias?.length > 0 && (
        <div className="mt-3 space-y-2">
          {data.advertencias.map((o, i) => (
            <div
              key={i}
              className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950"
            >
              Nota: {o}
            </div>
          ))}
        </div>
      )}
      {data.exclusiones_habituales?.length > 0 && (
        <div className="mt-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] p-3">
          <p className="text-xs font-semibold text-[var(--color-text-2)]">Exclusiones habituales sugeridas</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[var(--color-text)]">
            {data.exclusiones_habituales.map((o, i) => (
              <li key={i}>{o}</li>
            ))}
          </ul>
        </div>
      )}
      {data.recomendaciones_tecnicas?.length > 0 && (
        <div className="mt-3 rounded-lg border border-sky-200 bg-sky-50 p-3">
          <p className="text-xs font-semibold text-sky-900">Recomendaciones técnicas</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-sky-950">
            {data.recomendaciones_tecnicas.map((o, i) => (
              <li key={i}>{o}</li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  )
}
