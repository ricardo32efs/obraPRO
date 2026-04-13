import { useEffect, useRef, useState } from 'react'
import { filterMateriales } from '../../utils/materialesDB'

/** Autocompletado de materiales con dropdown */
export function AutocompleteMaterial({ value, onChange, onPickSuggestion }) {
  const [open, setOpen] = useState(false)
  const suggestions = filterMateriales(value, 10)
  const ref = useRef(null)

  useEffect(() => {
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  return (
    <div ref={ref} className="relative">
      <input
        className="w-full min-w-[140px] rounded border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1.5 text-sm"
        value={value}
        onChange={(e) => {
          onChange(e.target.value)
          setOpen(true)
        }}
        onFocus={() => value.length >= 2 && setOpen(true)}
        placeholder="Material"
        autoComplete="off"
      />
      {open && suggestions.length > 0 && (
        <ul
          className="absolute left-0 right-0 z-50 mt-1 max-h-48 overflow-auto rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] py-1 text-sm shadow-lg"
          role="listbox"
        >
          {suggestions.map((s) => (
            <li key={s.nombre}>
              <button
                type="button"
                className="w-full px-3 py-2 text-left hover:bg-[var(--color-surface-2)]"
                onClick={() => {
                  onPickSuggestion?.(s)
                  setOpen(false)
                }}
              >
                <span className="font-medium text-[var(--color-text)]">{s.nombre}</span>
                <span className="ml-2 text-xs text-[var(--color-text-2)]">
                  {s.unidad} · {s.categoria}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
