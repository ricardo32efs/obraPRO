function norm(s) {
  return String(s || '')
    .trim()
    .toLowerCase()
}

function hasSomeMaterial(materiales, names) {
  const set = new Set((materiales || []).map((m) => norm(m.nombre)))
  return names.some((n) => set.has(norm(n)))
}

function hasSomeMano(manoObra, terms) {
  const rows = (manoObra || []).map((m) => norm(m.descripcion))
  return rows.some((d) => terms.some((t) => d.includes(norm(t))))
}

/**
 * Reglas estrictas de coherencia para presupuestos de obra.
 * @param {object} form
 * @param {object} totals
 * @returns {{ criticas: string[], advertencias: string[], recomendaciones: string[] }}
 */
export function runAuditoriaExtrema(form, totals) {
  const out = { criticas: [], advertencias: [], recomendaciones: [] }
  const mats = form.materiales || []
  const manos = form.manoObra || []
  const tipo = form.tipoTrabajo

  if (!mats.some((m) => norm(m.nombre) && Number(m.cantidad) > 0 && Number(m.precioUnitario) > 0) &&
      !manos.some((m) => norm(m.descripcion) && Number(m.cantidad) > 0 && Number(m.precioUnitario) > 0)) {
    out.criticas.push('No hay ítems completos de materiales ni de mano de obra.')
  }

  if (totals.totalFinal <= 0) out.criticas.push('El total final es cero o negativo.')
  if (Number(form.anticipoPct) > 70) out.advertencias.push('Anticipo mayor a 70%: validar política comercial con el cliente.')
  if (Number(form.anticipoPct) < 10) out.advertencias.push('Anticipo muy bajo: puede afectar flujo de caja de obra.')

  // Coherencias por rubro
  if (tipo === 'Pisos y revestimientos') {
    if (!hasSomeMaterial(mats, ['Adhesivo para cerámicas'])) out.criticas.push('Falta adhesivo para colocación de revestimientos.')
    if (!hasSomeMaterial(mats, ['Pastina cerámica'])) out.advertencias.push('No se detecta pastina cerámica.')
    if (!hasSomeMano(manos, ['colocación'])) out.advertencias.push('No se detecta ítem de mano para colocación.')
  }

  if (tipo === 'Instalación sanitaria') {
    if (!hasSomeMaterial(mats, ['Llave de paso esférica'])) out.criticas.push('Falta llave de paso (sanitaria).')
    if (!hasSomeMaterial(mats, ['Caño PVC 110mm', 'Caño PVC 75mm', 'Caño PVC 50mm', 'Termofusión 20mm'])) {
      out.criticas.push('No se detectan cañerías principales para la instalación sanitaria.')
    }
  }

  if (tipo === 'Instalación eléctrica') {
    if (!hasSomeMaterial(mats, ['Cable IRAM 2.5mm²', 'Cable IRAM 4mm²', 'Cable IRAM 6mm²'])) {
      out.criticas.push('No se detectan cables eléctricos.')
    }
    if (!hasSomeMaterial(mats, ['Disyuntor 2x25A', 'Disyuntor 1x16A'])) {
      out.advertencias.push('No se detecta protección diferencial/térmica en materiales.')
    }
  }

  if (tipo === 'Techos y cubiertas') {
    if (!hasSomeMaterial(mats, ['Membrana asfáltica 3mm', 'Membrana asfáltica 4mm', 'Chapa galvanizada N°25', 'Chapa prepintada'])) {
      out.criticas.push('No se detectan materiales principales de cubierta.')
    }
    if (!hasSomeMaterial(mats, ['Silicona neutra', 'Tornillos autoperforantes'])) {
      out.advertencias.push('Faltan consumibles habituales de fijación/sellado.')
    }
  }

  if (tipo === 'Pintura interior' || tipo === 'Pintura exterior') {
    if (!hasSomeMaterial(mats, ['Pintura látex interior', 'Pintura látex exterior', 'Pintura esmalte sintético'])) {
      out.criticas.push('No se detecta pintura principal del trabajo.')
    }
    if (!hasSomeMaterial(mats, ['Sellador acrílico', 'Enduído plástico'])) {
      out.advertencias.push('No se detecta sellador/enduído para preparación de superficies.')
    }
  }

  if (totals.subtotalGastos === 0) {
    out.recomendaciones.push('Considerar gastos indirectos: flete, retiro de escombros, traslados, imprevistos.')
  }
  if (!String(form.condiciones || '').trim()) {
    out.recomendaciones.push('Agregar condiciones comerciales para evitar conflictos de alcance/plazos.')
  }

  return out
}

/**
 * Plantillas rápidas por tipo de obra para acelerar carga inicial.
 */
export const PLANTILLAS_TIPO_OBRA = {
  'Refacción integral': {
    materiales: [
      { nombre: 'Adhesivo para cerámicas', unidad: 'bolsa', cantidad: 3, precioUnitario: 0 },
      { nombre: 'Pastina cerámica', unidad: 'kg', cantidad: 6, precioUnitario: 0 },
      { nombre: 'Sellador acrílico', unidad: 'litro', cantidad: 4, precioUnitario: 0 },
    ],
    manoObra: [
      { descripcion: 'Demolición y retiro', categoria: 'Ayudante', cantidad: 2, unidad: 'día', precioUnitario: 0 },
      { descripcion: 'Reparaciones y terminación', categoria: 'Oficial', cantidad: 4, unidad: 'día', precioUnitario: 0 },
    ],
    gastosAdicionales: [{ concepto: 'Flete y retiro de escombros', monto: 0, esPorcentaje: false, porcentaje: 0 }],
  },
  'Pisos y revestimientos': {
    materiales: [
      { nombre: 'Porcelanato 60x60', unidad: 'm²', cantidad: 20, precioUnitario: 0 },
      { nombre: 'Adhesivo para cerámicas', unidad: 'bolsa', cantidad: 6, precioUnitario: 0 },
      { nombre: 'Pastina cerámica', unidad: 'kg', cantidad: 8, precioUnitario: 0 },
      { nombre: 'Nivelador para cerámicas', unidad: 'unidad', cantidad: 1, precioUnitario: 0 },
    ],
    manoObra: [{ descripcion: 'Colocación de porcelanato', categoria: 'Oficial', cantidad: 20, unidad: 'm²', precioUnitario: 0 }],
    gastosAdicionales: [],
  },
  'Instalación sanitaria': {
    materiales: [
      { nombre: 'Caño PVC 110mm', unidad: 'm lineal', cantidad: 8, precioUnitario: 0 },
      { nombre: 'Caño PVC 50mm', unidad: 'm lineal', cantidad: 10, precioUnitario: 0 },
      { nombre: 'Llave de paso esférica', unidad: 'unidad', cantidad: 2, precioUnitario: 0 },
      { nombre: 'Termofusión 20mm', unidad: 'm lineal', cantidad: 12, precioUnitario: 0 },
    ],
    manoObra: [{ descripcion: 'Instalación sanitaria completa', categoria: 'Especialista', cantidad: 3, unidad: 'día', precioUnitario: 0 }],
    gastosAdicionales: [],
  },
}

const CHECKLIST_CIERRE_POR_TIPO = {
  'Refacción integral': [
    'Relevar estado final con cliente (ambientes, terminaciones y funcionamiento).',
    'Confirmar limpieza final y retiro de sobrantes/escombros.',
    'Entregar detalle de tareas ejecutadas y materiales principales usados.',
    'Registrar pendientes menores (si existen) con fecha de resolución.',
  ],
  'Pisos y revestimientos': [
    'Verificar nivel, plomo y alineación de piezas en paños principales.',
    'Revisar juntas y pastina sin fisuras ni faltantes.',
    'Confirmar cortes, encuentros y zócalos terminados.',
    'Indicar tiempo de fraguado/uso antes de tránsito normal.',
  ],
  'Instalación sanitaria': [
    'Prueba de pérdidas en uniones, válvulas y artefactos.',
    'Verificar caudales y correcta descarga en desagües.',
    'Comprobar funcionamiento de llaves de paso.',
    'Dejar esquema básico de puntos intervenidos para mantenimiento.',
  ],
  'Instalación eléctrica': [
    'Verificar tablero, térmicas y diferencial operativos.',
    'Probar tomas e interruptores por circuito.',
    'Confirmar puesta a tierra y continuidad según alcance contratado.',
    'Entregar identificación básica de circuitos en tablero.',
  ],
  'Techos y cubiertas': [
    'Inspección visual de sellados, solapes y fijaciones.',
    'Prueba de estanqueidad simulada (si aplica).',
    'Revisión de canaletas y bajadas libres de obstrucciones.',
    'Registrar puntos críticos para mantenimiento periódico.',
  ],
}

export function getChecklistCierrePorTipo(tipoTrabajo) {
  return CHECKLIST_CIERRE_POR_TIPO[tipoTrabajo] || [
    'Revisión final conjunta con cliente.',
    'Verificación de calidad y funcionamiento de lo ejecutado.',
    'Entrega de observaciones y pendientes (si hubiera).',
    'Cierre administrativo y conformidad del cliente.',
  ]
}
