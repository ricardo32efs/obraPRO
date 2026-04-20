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

/** Tipos de trabajo para select principal */
export const TIPOS_TRABAJO = [
  'Construcción nueva',
  'Refacción integral',
  'Ampliación',
  'Pintura interior',
  'Pintura exterior',
  'Demolición',
  'Instalación sanitaria',
  'Instalación eléctrica',
  'Instalación de gas',
  'Techos y cubiertas',
  'Impermeabilización',
  'Pisos y revestimientos',
  'Herrería y rejas',
  'Carpintería y muebles',
  'Paisajismo y jardines',
  'Aire acondicionado',
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
