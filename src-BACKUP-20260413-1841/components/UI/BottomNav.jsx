import { motion } from 'framer-motion'

function IconNuevo() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" aria-hidden>
      <path d="M5 4h9l5 5v11H5z" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M14 4v5h5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 13h8M8 16h8" fill="none" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  )
}

function IconHistorial() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" aria-hidden>
      <path d="M4 6h16v13H4z" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 4v4M16 4v4M4 10h16" fill="none" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  )
}

function IconDashboard() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" aria-hidden>
      <path d="M4 20h16" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M7 20v-6M12 20V9M17 20v-10" fill="none" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  )
}

function IconConfig() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" aria-hidden>
      <circle cx="12" cy="12" r="3.1" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 4.5v2.2M12 17.3v2.2M4.5 12h2.2M17.3 12h2.2M6.8 6.8l1.5 1.5M15.7 15.7l1.5 1.5M17.2 6.8l-1.5 1.5M8.3 15.7l-1.5 1.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  )
}

const Item = ({ active, icon, label, onClick }) => (
  <button
    type="button"
    aria-label={label}
    onClick={onClick}
    className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-medium ${
      active ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-2)]'
    }`}
  >
    <motion.span layout className="inline-flex items-center justify-center" animate={{ scale: active ? 1.05 : 1 }}>
      {icon}
    </motion.span>
    {label}
  </button>
)

/** Navegación inferior — mobile (<1024px) */
export function BottomNav({ screen, onNavigate }) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-[90] flex border-t border-[var(--_color-border)] bg-[var(--color-surface)]/95 backdrop-blur lg:hidden"
      style={{ '--_color-border': 'var(--color-border)' }}
      aria-label="Navegación principal"
    >
      <Item active={screen === 'nuevo'} icon={<IconNuevo />} label="Nuevo" onClick={() => onNavigate('nuevo')} />
      <Item
        active={screen === 'historial'}
        icon={<IconHistorial />}
        label="Historial"
        onClick={() => onNavigate('historial')}
      />
      <Item
        active={screen === 'dashboard'}
        icon={<IconDashboard />}
        label="Dashboard"
        onClick={() => onNavigate('dashboard')}
      />
      <Item active={screen === 'config'} icon={<IconConfig />} label="Config" onClick={() => onNavigate('config')} />
    </nav>
  )
}
