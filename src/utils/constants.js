/** Claves de persistencia en localStorage */
export const LS_KEYS = {
  plan: 'obrapro_plan',
  empresa: 'obrapro_empresa',
  usage: 'obrapro_usage',
  presupuestos: 'obrapro_presupuestos',
  plantillas: 'obrapro_plantillas',
  correlativo: 'obrapro_numero_correlativo',
  onboarding: 'obrapro_onboarding_complete',
}

/** Límite mensual de presupuestos plan gratuito */
export const FREE_MONTHLY_BUDGET_LIMIT = 1

/** Tipos de trabajo para select principal - TODOS los oficios de construcción */
export const TIPOS_TRABAJO = [
  // Albañilería y estructuras
  'Construcción nueva',
  'Refacción integral',
  'Ampliación',
  'Demolición',
  'Mampostería',
  'Estructuras de hormigón',
  'Placas de yeso (drywall)',
  
  // Instalaciones
  'Instalación eléctrica completa',
  'Instalación sanitaria (agua)',
  'Instalación de desagües',
  'Instalación de gas natural',
  'Instalación de gas envasado',
  'Calefacción central',
  'Radiadores y calderas',
  'Piso radiante',
  'Aire acondicionado split',
  'Aire acondicionado central',
  'Ventilación y extractores',
  
  // Pintura y terminaciones
  'Pintura interior',
  'Pintura exterior',
  'Pintura industrial',
  'Empapelado y revestimientos',
  'Microcemento',
  'Estucos y yeso',
  
  // Pisos y revestimientos
  'Pisos cerámicos',
  'Pisos de porcelanato',
  'Pisos de madera',
  'Pisos de vinilo/PVC',
  'Pisos de cemento alisado',
  'Pisos epóxicos',
  'Revestimientos en piedra',
  'Revestimientos 3D',
  'Mosaicos y venecitas',
  
  // Techos y cubiertas
  'Techos de chapa',
  'Techos de tejas',
  'Techos de losa',
  'Cielorrasos desmontables',
  'Cielorrasos de yeso',
  'Impermeabilización de techos',
  'Impermeabilización de terrazas',
  'Canaletas y bajadas',
  
  // Aberturas y cerramientos
  'Herrería y rejas',
  'Herrería artística',
  'Puertas y portones',
  'Ventanas de aluminio',
  'Ventanas de PVC',
  'Carpintería de madera',
  'Muebles a medida',
  'Cocinas y placares',
  'Deck y pergolas de madera',
  
  // Exteriores y jardín
  'Paisajismo y jardines',
  'Riego automatizado',
  'Césped natural y sintético',
  'Cercos perimetrales',
  'Portones automáticos',
  'Iluminación de jardín',
  'Piscinas y piletas',
  
  // Especialidades
  'Vidrios y espejos',
  'Mamparas y boxes',
  'Barandas y escaleras',
  'Aislamiento térmico',
  'Aislamiento acústico',
  'Zinguería y soldadura',
  'Soldadura general',
  
  // Servicios complementarios
  'Limpieza post-obra',
  'Fumigación y control de plagas',
  'Mudanzas y fletes',
  
  'Otro',
]

/** Provincias argentinas */
export const PROVINCIAS_AR = [
  'Buenos Aires',
  'CABA',
  'Catamarca',
  'Chaco',
  'Chubut',
  'Córdoba',
  'Corrientes',
  'Entre Ríos',
  'Formosa',
  'Jujuy',
  'La Pampa',
  'La Rioja',
  'Mendoza',
  'Misiones',
  'Neuquén',
  'Río Negro',
  'Salta',
  'San Juan',
  'San Luis',
  'Santa Cruz',
  'Santa Fe',
  'Santiago del Estero',
  'Tierra del Fuego',
  'Tucumán',
]

export const UNIDADES_MATERIAL = [
  'm²',
  'm³',
  'm lineal',
  'unidad',
  'kg',
  'bolsa',
  'litro',
  'hora',
  'día',
  'semana',
  'lote',
  'global',
]

export const CATEGORIAS_MANO = [
  'Oficial',
  'Medio oficial',
  'Ayudante',
  'Especialista',
  'Subcontratista',
  'Dirección técnica',
]

export const UNIDADES_MANO = ['hora', 'día', 'semana', 'm²', 'm lineal', 'global', 'por trabajo']

export const TAREAS_MANO_DEFAULT = [
  'Mampostería',
  'Revoques',
  'Contrapisos',
  'Colocación de pisos',
  'Colocación de cerámicas',
  'Pintura interior',
  'Pintura exterior',
  'Encofrado y hormigonado',
  'Instalación sanitaria',
  'Instalación eléctrica',
  'Instalación de gas',
  'Demolición',
  'Excavación',
  'Impermeabilización',
  'Colocación de aberturas',
  'Soldadura y herrería',
  'Carpintería de madera',
  'Colocación de chapas y techado',
  'Jardinería y paisajismo',
  'Instalación de aire acondicionado',
  'Limpieza de obra final',
  'Dirección técnica',
]

export const GASTOS_SUGERIDOS = [
  'Flete de materiales',
  'Alquiler de andamio',
  'Alquiler de mezcladora',
  'Alquiler de hidrolavadora',
  'Trámites municipales',
  'Gastos de traslado',
  'Combustible y viáticos',
  'Imprevistos (% del total)',
]

/**
 * EmailJS — .env: VITE_EMAILJS_PUBLIC_KEY, VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID
 * Opcional: VITE_EMAILJS_ATTACHMENT_PARAM (default presupuesto_pdf) para adjunto dinámico en plantilla
 */
export const EMAILJS_CONFIG = {
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '',
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || '',
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '',
}
