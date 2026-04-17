import { useCallback, useState } from 'react'

/**
 * Hook para llamar al Asistente IA via /api/ai-suggest (Gemini).
 */
export function useIAGemini() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const sugerir = useCallback(async ({ descripcionObra, tipoTrabajo, ciudad }) => {
    setError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/ai-suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ descripcionObra, tipoTrabajo, ciudad }),
      })
      const json = await res.json()
      if (!res.ok || !json.ok) {
        throw new Error(json.error || 'Error desconocido')
      }
      return json.data
    } catch (e) {
      const msg = e?.message || 'Error de conexión con la IA'
      setError(msg)
      throw e
    } finally {
      setLoading(false)
    }
  }, [])

  return { sugerir, loading, error, setError }
}
