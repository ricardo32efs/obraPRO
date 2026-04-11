import { useCallback, useState } from 'react'
import { buildUserPrompt, IA_DEMO_JSON, IA_SYSTEM_PROMPT } from '../utils/buildIAPrompt'

const MODEL = 'claude-sonnet-4-20250514'

function anthropicMessagesUrl() {
  const custom = (import.meta.env.VITE_ANTHROPIC_BASE_URL || '').replace(/\/$/, '')
  if (custom) return `${custom}/v1/messages`
  /* Proxy en Vite (dev o `vite preview` con VITE_ANTHROPIC_USE_PROXY=true) evita CORS */
  const useProxy =
    import.meta.env.DEV || import.meta.env.VITE_USE_ANTHROPIC_USE_PROXY === 'true'
  if (useProxy) return '/anthropic/v1/messages'
  return 'https://api.anthropic.com/v1/messages'
}

function extractJson(text) {
  const t = String(text || '').trim()
  const start = t.indexOf('{')
  const end = t.lastIndexOf('}')
  if (start === -1 || end === -1) throw new Error('Respuesta sin JSON')
  return JSON.parse(t.slice(start, end + 1))
}

/**
 * Llama a Anthropic Messages API.
 * - Local: usa proxy `/anthropic` (sin CORS).
 * - Producción estática: definí VITE_ANTHROPIC_BASE_URL apuntando a tu backend/proxy o usá modo demo.
 */
export function useAnthropicAPI() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const runCompletion = useCallback(async ({ apiKey, descripcionObra, tipoTrabajo, ciudad, demoMode }) => {
    setError(null)
    if (demoMode || !apiKey) {
      return { ...IA_DEMO_JSON, _demo: true }
    }
    setLoading(true)
    try {
      const res = await fetch(anthropicMessagesUrl(), {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: 8192,
          system: IA_SYSTEM_PROMPT,
          messages: [{ role: 'user', content: buildUserPrompt({ descripcionObra, tipoTrabajo, ciudad }) }],
        }),
      })
      if (!res.ok) {
        const errTxt = await res.text()
        throw new Error(errTxt || `Error API ${res.status}`)
      }
      const data = await res.json()
      const text = data?.content?.[0]?.text ?? ''
      return extractJson(text)
    } catch (e) {
      setError(e?.message || 'Error de conexión con la IA')
      throw e
    } finally {
      setLoading(false)
    }
  }, [])

  return { runCompletion, loading, error, setError }
}
