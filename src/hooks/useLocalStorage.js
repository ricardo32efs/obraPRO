import { useCallback, useEffect, useState } from 'react'

/**
 * Estado sincronizado con localStorage (JSON)
 * @template T
 * @param {string} key
 * @param {T} initialValue
 */
export function useLocalStorage(key, initialValue) {
  const read = useCallback(() => {
    try {
      const raw = localStorage.getItem(key)
      if (raw == null) return initialValue
      return JSON.parse(raw)
    } catch {
      return initialValue
    }
  }, [key, initialValue])

  const [state, setState] = useState(read)

  useEffect(() => {
    setState(read())
  }, [read])

  const setStored = useCallback(
    (valueOrUpdater) => {
      setState((prev) => {
        const next = typeof valueOrUpdater === 'function' ? valueOrUpdater(prev) : valueOrUpdater
        try {
          localStorage.setItem(key, JSON.stringify(next))
        } catch {
          window.dispatchEvent(new CustomEvent('obrapro-storage-full', { detail: { key } }))
        }
        return next
      })
    },
    [key],
  )

  return [state, setStored]
}
