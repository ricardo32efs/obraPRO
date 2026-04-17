/**
 * GET /api/ai-health — diagnóstico de la clave Gemini (solo para debug, no expone la key)
 */
export default async function handler(req, res) {
  const key = process.env.GEMINI_API_KEY

  if (!key) {
    return res.status(200).json({ configured: false, message: 'GEMINI_API_KEY no está configurada en Vercel.' })
  }

  // Verificar formato básico (las keys de AI Studio empiezan con "AIza")
  const formatOk = key.startsWith('AIza') && key.length > 20
  if (!formatOk) {
    return res.status(200).json({ configured: true, formatOk: false, message: 'La clave no parece tener el formato correcto (debe empezar con AIza...).' })
  }

  // Hacer una llamada mínima a Gemini para verificar que la key funciona
  try {
    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
