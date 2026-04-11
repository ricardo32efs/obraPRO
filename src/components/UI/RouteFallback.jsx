/** Marcador de carga entre pantallas (code-splitting) */
export function RouteFallback() {
  return (
    <div
      className="flex min-h-svh flex-col items-center justify-center gap-3 bg-[var(--color-bg)] px-4"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="route-loader shrink-0" aria-hidden />
      <p className="text-sm text-[var(--color-text-2)]">Cargando Obra Pro…</p>
    </div>
  )
}
