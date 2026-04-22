/** Sidebar fija — desktop */
export function Sidebar({ screen, onNavigate, onHome, onFeedback }) {
  const link = (id, label) => (
    <button
      type="button"
      onClick={() => onNavigate(id)}
      className={`w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition ${
        screen === id
          ? 'bg-[var(--color-primary)] text-white'
          : 'text-[var(--color-text)] hover:bg-[var(--color-surface-2)]'
      }`}
    >
      {label}
    </button>
  )

  return (
    <aside className="fixed left-0 top-0 z-[80] hidden h-full w-60 flex-col border-r border-[var(--color-border)] bg-[var(--color-surface)] p-4 lg:flex">
      <button
        type="button"
        onClick={onHome}
        className="mb-6 flex items-center gap-2 text-left font-display text-lg font-bold text-[var(--color-text)]"
      >
        <LogoMark />
        Obra Pro
      </button>
      <nav className="flex flex-col gap-1" aria-label="Secciones">
        {link('nuevo', 'Nuevo presupuesto')}
        {link('historial', 'Historial')}
        {link('dashboard', 'Dashboard')}
        {link('config', 'Configuración')}
      </nav>
      <div className="mt-auto space-y-2 pt-6">
        <button
          type="button"
          onClick={onFeedback}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium text-[var(--color-text-2)] transition hover:bg-[var(--color-surface-2)]"
        >
          <span>💬</span> Enviar feedback
        </button>
        <div className="text-xs text-[var(--color-text-2)]">© 2026 Obra Pro</div>
      </div>
    </aside>
  )
}

function LogoMark() {
  return (
    <svg width="32" height="32" viewBox="0 0 40 40" aria-hidden className="shrink-0 text-[var(--color-accent)]">
      {/* Círculo exterior */}
      <circle cx="20" cy="20" r="18" fill="none" stroke="currentColor" strokeWidth="2.5" />
      
      {/* Tres líneas verticales estilo gráfico de barras */}
      <rect x="11" y="12" width="4" height="16" rx="1" fill="currentColor" opacity="0.7" />
      <rect x="18" y="6" width="4" height="28" rx="1" fill="currentColor" />
      <rect x="26" y="16" width="4" height="12" rx="1" fill="currentColor" opacity="0.8" />
    </svg>
  )
}
