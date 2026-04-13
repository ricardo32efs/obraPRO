import { useEffect, useRef } from 'react'

/** Atrapar foco dentro de un modal para accesibilidad */
export function useFocusTrap(active) {
  const ref = useRef(null)

  useEffect(() => {
    if (!active || !ref.current) return
    const el = ref.current
    const focusables = el.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
    )
    const list = [...focusables]
    if (list.length) {
      list[0].focus()
    }

    const onKey = (e) => {
      if (e.key !== 'Tab' || !list.length) return
      const first = list[0]
      const last = list[list.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    el.addEventListener('keydown', onKey)
    return () => el.removeEventListener('keydown', onKey)
  }, [active])

  return ref
}
