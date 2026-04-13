/** System prompt para Anthropic — respuesta JSON estricta */
export const IA_SYSTEM_PROMPT = `Eres un maestro mayor de obras con 30 años de experiencia en Argentina. Conocés los materiales, las cantidades necesarias para cada tipo de trabajo, los precios de mercado actuales y los tiempos de mano de obra. Cuando describís una obra, listás TODOS los materiales necesarios con cantidades realistas y la mano de obra requerida.

REGLAS CRÍTICAS:
1. Respondés ÚNICAMENTE con JSON válido. Cero texto fuera del JSON.
2. Las cantidades deben ser realistas y calculadas para la obra descripta. No subestimés ni sobreestimés.
3. Los precios deben ser orientativos en pesos argentinos a valores de mercado actuales.
4. Incluís TODOS los materiales, incluso los que se olvidan habitualmente (adhesivos, pastinas, clavos, selladores, etc.).
5. La mano de obra debe reflejar el trabajo real necesario.
6. Si la descripción es ambigua, asumís dimensiones razonables y lo aclarás en observaciones.
7. Incluís una lista breve de exclusiones habituales (si aplica) y recomendaciones técnicas clave.

Unidades permitidas para materiales: m², m³, m lineal, unidad, kg, bolsa, litro, hora, día, semana, lote, global.
Unidades permitidas para mano de obra: hora, día, semana, m², m lineal, global, por trabajo.
Categorías de mano: Oficial, Medio oficial, Ayudante, Especialista, Subcontratista, Dirección técnica.`

/**
 * @param {object} params
 * @returns {string}
 */
export function buildUserPrompt({ descripcionObra, tipoTrabajo, ciudad }) {
  return `Elaborá un presupuesto detallado para esta obra:

DESCRIPCIÓN: ${descripcionObra}
TIPO DE TRABAJO: ${tipoTrabajo || 'No especificado'}
CIUDAD: ${ciudad || 'Argentina'} (para contexto de precios)

Respondé ÚNICAMENTE con este JSON exacto:
{
  "tipo_trabajo": "string — tipo de trabajo detectado o confirmado",
  "superficie_estimada": "string o null",
  "materiales": [
    {
      "nombre": "string",
      "unidad": "string",
      "cantidad": number,
      "precio_unitario_estimado": number,
      "categoria": "string",
      "es_frecuentemente_olvidado": boolean
    }
  ],
  "mano_de_obra": [
    {
      "descripcion": "string",
      "categoria": "string",
      "unidad": "string",
      "cantidad": number,
      "precio_unitario_estimado": number
    }
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

/** Datos demo realistas — refacción de baño (~4m²) */
export const IA_DEMO_JSON = {
  tipo_trabajo: 'Refacción de baño',
  superficie_estimada: '4 m²',
  materiales: [
    { nombre: 'Cerámica 45x45', unidad: 'm²', cantidad: 12, precio_unitario_estimado: 8500, categoria: 'Pisos', es_frecuentemente_olvidado: false },
    { nombre: 'Adhesivo para cerámicas', unidad: 'bolsa', cantidad: 3, precio_unitario_estimado: 12000, categoria: 'Pisos', es_frecuentemente_olvidado: true },
    { nombre: 'Pastina cerámica', unidad: 'kg', cantidad: 4, precio_unitario_estimado: 4500, categoria: 'Pisos', es_frecuentemente_olvidado: true },
    { nombre: 'Caño PVC 110mm', unidad: 'm lineal', cantidad: 8, precio_unitario_estimado: 3200, categoria: 'Sanitarios', es_frecuentemente_olvidado: false },
    { nombre: 'Llave de paso esférica', unidad: 'unidad', cantidad: 2, precio_unitario_estimado: 15000, categoria: 'Sanitarios', es_frecuentemente_olvidado: true },
    { nombre: 'Pintura látex interior', unidad: 'litro', cantidad: 8, precio_unitario_estimado: 9000, categoria: 'Pintura', es_frecuentemente_olvidado: false },
    { nombre: 'Enduído plástico', unidad: 'litro', cantidad: 10, precio_unitario_estimado: 6500, categoria: 'Pintura', es_frecuentemente_olvidado: true },
  ],
  mano_de_obra: [
    { descripcion: 'Demolición y retiro de revestimientos', categoria: 'Ayudante', unidad: 'día', cantidad: 2, precio_unitario_estimado: 28000 },
    { descripcion: 'Instalación sanitaria', categoria: 'Especialista', unidad: 'día', cantidad: 3, precio_unitario_estimado: 45000 },
    { descripcion: 'Colocación de cerámicas', categoria: 'Oficial', unidad: 'm²', cantidad: 12, precio_unitario_estimado: 8500 },
    { descripcion: 'Pintura interior', categoria: 'Medio oficial', unidad: 'día', cantidad: 2, precio_unitario_estimado: 22000 },
  ],
  gastos_adicionales: [
    { concepto: 'Flete de escombros y materiales', monto_estimado: 35000 },
    { concepto: 'Contenedor / bajada de materiales', monto_estimado: 18000 },
  ],
  observaciones: [
    'Cálculo orientativo para baño estándar de 4 m² con cambio de revestimientos y grifería.',
  ],
  advertencias: [
    'Verificar cañerías existentes y pendiente de pisos antes de cerrar precios.',
    'Revisar compatibilidad de artefactos sanitarios con instalación actual.',
  ],
  confianza_estimacion: 'media',
  motivo_confianza: 'Descripción típica; puede variar según terminaciones y accesos.',
}
