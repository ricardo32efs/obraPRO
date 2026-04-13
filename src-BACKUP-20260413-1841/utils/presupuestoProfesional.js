const MATERIALES_CLAVE_POR_TIPO = {
  'Construcción nueva': [
    'Cemento Portland',
    'Arena gruesa',
    'Piedra partida 10/20',
    'Hierro en barra 10mm',
    'Malla de acero Q188',
    'Ladrillos cerámicos 18x18x33',
    'Alambre negro N°16',
    'Madera para encofrado',
  ],
  'Refacción integral': [
    'Adhesivo para cerámicas',
    'Pastina cerámica',
    'Enduído plástico',
    'Sellador acrílico',
    'Llave de paso esférica',
    'Silicona neutra',
  ],
  Ampliación: [
    'Cemento Portland',
    'Ladrillos cerámicos 18x18x33',
    'Hierro en barra 10mm',
    'Malla de acero Q92',
    'Adhesivo para cerámicas',
    'Pastina cerámica',
  ],
  'Pintura interior': [
    'Pintura látex interior',
    'Enduído plástico',
    'Sellador acrílico',
    'Lija al agua N°120',
    'Cinta de enmascarar',
  ],
  'Pintura exterior': [
    'Pintura látex exterior',
    'Impermeabilizante acrílico',
    'Tela de fibra de vidrio',
    'Sellador acrílico',
    'Lija al agua N°120',
  ],
  Demolición: [
    'Guantes de trabajo',
    'Bolsa de residuos reforzada',
    'Contenedor 5 m³',
    'Flete de escombros',
  ],
  'Instalación sanitaria': [
    'Caño PVC 110mm',
    'Caño PVC 50mm',
    'Codo PVC 90° 110mm',
    'Llave de paso esférica',
    'Termofusión 20mm',
    'Trampa PVC',
  ],
  'Instalación eléctrica': [
    'Cable IRAM 2.5mm²',
    'Cable IRAM 4mm²',
    'Caño corrugado ¾"',
    'Caja de paso plástica',
    'Disyuntor 2x25A',
    'Tomacorriente doble',
  ],
  'Techos y cubiertas': [
    'Chapa galvanizada N°25',
    'Membrana asfáltica 4mm',
    'Perfil correa metálica',
    'Tornillos autoperforantes',
    'Silicona neutra',
  ],
  Impermeabilización: [
    'Membrana asfáltica 4mm',
    'Impermeabilizante acrílico',
    'Tela de fibra de vidrio',
    'Sellador acrílico',
  ],
  'Pisos y revestimientos': [
    'Porcelanato 60x60',
    'Adhesivo para cerámicas',
    'Pastina cerámica',
    'Nivelador para cerámicas',
    'Zócalo de porcelanato',
  ],
}

const CONDICIONES_PROFESIONALES = `1) Alcance: este presupuesto incluye solo los ítems detallados en materiales, mano de obra y gastos adicionales.
2) Validez: precios válidos por el plazo indicado en este documento.
3) Forma de pago: anticipo al inicio y saldo según avance/cierre de obra.
4) Variaciones: trabajos adicionales o cambios de alcance se cotizan por separado.
5) Materiales: se consideran marcas y calidades estándar equivalentes; cualquier cambio puede modificar precio/plazo.
6) Plazos: estimados y sujetos a clima, disponibilidad de materiales, logística de obra y aprobaciones del cliente.
7) Exclusiones sugeridas: trámites, derechos municipales, cálculo estructural y honorarios externos no incluidos salvo mención expresa.
8) Garantía: se brinda garantía de ejecución sobre mano de obra según uso normal y mantenimiento adecuado.
9) Seguridad e higiene: se asume disponibilidad de condiciones mínimas de acceso y seguridad en obra.
10) Aceptación: la aprobación del presupuesto implica conformidad con estos términos.`

function normalize(text) {
  return String(text || '')
    .trim()
    .toLowerCase()
}

/**
 * Lista de materiales clave faltantes según tipo de trabajo.
 * @param {string} tipoTrabajo
 * @param {{ nombre?: string }[]} materiales
 * @returns {string[]}
 */
export function getMaterialesClaveFaltantes(tipoTrabajo, materiales) {
  const claves = MATERIALES_CLAVE_POR_TIPO[tipoTrabajo] || []
  if (!claves.length) return []
  const presentes = new Set((materiales || []).map((m) => normalize(m?.nombre)))
  return claves.filter((m) => !presentes.has(normalize(m)))
}

/**
 * Inserta condiciones profesionales base si no estaban ya escritas.
 * @param {string} actuales
 * @returns {string}
 */
export function mergeCondicionesProfesionales(actuales) {
  const current = String(actuales || '').trim()
  if (!current) return CONDICIONES_PROFESIONALES
  const hasAnchor = normalize(current).includes('alcance:')
  if (hasAnchor) return current
  return `${current}\n\n${CONDICIONES_PROFESIONALES}`
}
