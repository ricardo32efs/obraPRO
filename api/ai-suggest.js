/**
 * Vercel Serverless Function — Asistente IA para presupuestos
 * POST /api/ai-suggest
 * Body: { descripcionObra, tipoTrabajo, ciudad }
 */

const SYSTEM_PROMPT = `Eres un maestro mayor de obras con 30 años de experiencia en Argentina. Cuando te describen una obra, generás un presupuesto detallado con materiales, mano de obra y gastos adicionales con cantidades y precios realistas en pesos argentinos.

REGLAS CRÍTICAS:
1. Respondés ÚNICAMENTE con JSON válido. Cero texto fuera del JSON.
2. Las cantidades deben ser realistas para la obra descripta.
3. Los precios deben ser orientativos en pesos argentinos (mercado actual).
4. Incluís TODOS los materiales, incluso los que se olvidan (adhesivos, pastinas, selladores, clavos, etc.).
5. Si la descripción es ambigua, asumís dimensiones razonables y lo aclarás en observaciones.

Unidades para materiales — usá la más específica posible:
- Pinturas, adhesivos, selladores: litro o kg (NO "unidad")
- Cerámicas, pisos, revestimientos: m²
- Caños, perfiles, molduras: m lineal
- Bolsas de cemento, yeso, cal: bolsa
- Ladrillos, bloques: unidad (único caso válido)
- Rollos, lonas, membranas: m²
- Lijas, brochas, rodillos, pinceles: unidad (herramientas descartables)
- Arena, piedra, hormigón: m³ o kg
- Lote de pequeños accesorios: lote

Unidades para mano de obra: hora, día, semana, m², m lineal, global, por trabajo.
Categorías de mano: Oficial, Medio oficial, Ayudante, Especialista, Subcontratista, Dirección técnica.`

function buildPrompt({ descripcionObra, tipoTrabajo, ciudad }) {
  return `Elaborá un presupuesto detallado para esta obra:

DESCRIPCIÓN: ${descripcionObra}
TIPO DE TRABAJO: ${tipoTrabajo || 'No especificado'}
CIUDAD: ${ciudad || 'Argentina'}

Respondé ÚNICAMENTE con este JSON exacto (sin texto adicional):
{
  "tipo_trabajo": "string",
  "superficie_estimada": "string o null",
  "materiales": [
    { "nombre": "string", "unidad": "string", "cantidad": number, "precio_unitario_estimado": number, "categoria": "string", "es_frecuentemente_olvidado": boolean }
  ],
  "mano_de_obra": [
    { "descripcion": "string", "categoria": "string", "unidad": "string", "cantidad": number, "precio_unitario_estimado": number }
  ],
  "gastos_adicionales": [
    { "concepto": "string", "monto_estimado": number }
  ],
  "observaciones": ["string"],
  "advertencias": ["string"],
  "exclusiones_habituales": ["string"],
  "recomendaciones_tecnicas": ["string"],
  "confianza_estimacion": "alta | media | baja",
  "motivo_confianza": "string"
}`
}

function extractJson(text) {
  const t = String(text || '').trim()
  const start = t.indexOf('{')
  const end = t.lastIndexOf('}')
  if (start === -1 || end === -1) throw new Error('Respuesta sin JSON válido')
  return JSON.parse(t.slice(start, end + 1))
}

export default async function handler(req, res) {
  const origin = process.env.VITE_SITE_URL || 'https://obraproweb.com'
  res.setHeader('Access-Control-Allow-Origin', origin)
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' })

  const GEMINI_KEY = process.env.GEMINI_API_KEY
  if (!GEMINI_KEY) {
    return res.status(500).json({ error: 'IA no configurada en el servidor.' })
  }

  const { descripcionObra, tipoTrabajo, ciudad } = req.body || {}
  const descStr = String(descripcionObra || '').trim()
  if (descStr.length < 10) {
    return res.status(400).json({ error: 'Descripción demasiado corta. Describí mejor la obra.' })
  }
  if (descStr.length > 1000) {
    return res.status(400).json({ error: 'Descripción demasiado larga (máx. 1000 caracteres).' })
  }

  try {
    const prompt = buildPrompt({ descripcionObra: descStr, tipoTrabajo, ciudad })

    const fullPrompt = `${SYSTEM_PROMPT}\n\n---\n\n${prompt}`

    const geminiRes = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-goog-api-key': GEMINI_KEY },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
          generationConfig: { temperature: 0.3, maxOutputTokens: 4096 },
        }),
      }
    )

    if (!geminiRes.ok) {
      const errData = await geminiRes.json().catch(() => ({}))
      console.error('[ai-suggest] Gemini error:', JSON.stringify(errData))
      const geminiMsg = errData?.error?.message || errData?.error?.status || `HTTP ${geminiRes.status}`
      return res.status(502).json({ error: `Error de la IA: ${geminiMsg}` })
    }

    const geminiData = await geminiRes.json()
    const text = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || ''
    const result = extractJson(text)

    return res.status(200).json({ ok: true, data: result })
  } catch (err) {
    console.error('[ai-suggest] Error:', err)
    return res.status(500).json({ error: 'Error interno al procesar la respuesta de la IA.' })
  }
}
