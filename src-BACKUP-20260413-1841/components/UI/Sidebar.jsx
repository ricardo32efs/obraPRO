/** Sidebar fija — desktop */
export function Sidebar({ screen, onNavigate, onHome }) {
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
      <div className="mt-auto pt-6 text-xs text-[var(--color-text-2)]">© 2026 Obra Pro</div>
    </aside>
  )
}

function LogoMark() {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" aria-hidden className="shrink-0 text-[var(--color-accent)]">
      <path
        fill="currentColor"
        d="M16 2L4 9v14l12 7 12-7V9L16 2zm0 3.2L22.5 9 16 12.8 9.5 9 16 5.2zM7 11.5l8 4.8v9.4l-8-4.7v-9.5zm10 14.2v-9.4l8-4.8v9.5l-8 4.7z"
      />
    </svg>
  )
}
