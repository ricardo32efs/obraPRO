/**
 * GET /api/ai-health — diagnóstico de la clave Gemini (solo para debug, no expone la key)
 */
export default async function handler(req, res) {
  const key = process.env.GEMINI_API_KEY

  if (!key) {
    return res.status(200).json({ configured: false, message: 'GEMINI_API_KEY no está configurada en Vercel.' })
  }

  // Probar la key directamente contra Gemini
  try {
    const r = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-goog-api-key': key },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: 'Di solo: ok' }] }],
          generationConfig: { maxOutputTokens: 5 },
        }),
      }
    )
    const data = await r.json()
    if (r.ok) {
      return res.status(200).json({ configured: true, formatOk: true, geminiOk: true, message: 'Todo OK. La IA está lista.' })
    }
    return res.status(200).json({
      configured: true,
      formatOk: true,
      geminiOk: false,
      message: `Gemini rechazó la key: ${data?.error?.message || data?.error?.status || `HTTP ${r.status}`}`,
    })
  } catch (e) {
    return res.status(200).json({ configured: true, formatOk: true, geminiOk: false, message: `Error de red: ${e.message}` })
  }
}
