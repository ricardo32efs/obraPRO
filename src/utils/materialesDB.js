/**
 * Biblioteca de materiales por categoría con unidad habitual (autocompletado + sugerencia de unidad)
 * @type {{ nombre: string, unidad: string, categoria: string }[]}
 */
export const MATERIALES_DB = [
  // Estructuras y mampostería
  { nombre: 'Cemento Portland', unidad: 'bolsa', categoria: 'Estructuras y mampostería' },
  { nombre: 'Cal hidráulica', unidad: 'bolsa', categoria: 'Estructuras y mampostería' },
  { nombre: 'Arena fina', unidad: 'm³', categoria: 'Estructuras y mampostería' },
  { nombre: 'Arena gruesa', unidad: 'm³', categoria: 'Estructuras y mampostería' },
  { nombre: 'Piedra partida 6/20', unidad: 'm³', categoria: 'Estructuras y mampostería' },
  { nombre: 'Piedra partida 10/20', unidad: 'm³', categoria: 'Estructuras y mampostería' },
  { nombre: 'Hormigón elaborado H-17', unidad: 'm³', categoria: 'Estructuras y mampostería' },
  { nombre: 'Hormigón elaborado H-21', unidad: 'm³', categoria: 'Estructuras y mampostería' },
  { nombre: 'Ladrillos comunes', unidad: 'unidad', categoria: 'Estructuras y mampostería' },
  { nombre: 'Ladrillos cerámicos 18x18x33', unidad: 'unidad', categoria: 'Estructuras y mampostería' },
  { nombre: 'Ladrillos cerámicos 12x18x33', unidad: 'unidad', categoria: 'Estructuras y mampostería' },
  { nombre: 'Bloques de hormigón 20x20x40', unidad: 'unidad', categoria: 'Estructuras y mampostería' },
  { nombre: 'Bloques de hormigón 15x20x40', unidad: 'unidad', categoria: 'Estructuras y mampostería' },
  { nombre: 'Ladrillos de vidrio', unidad: 'unidad', categoria: 'Estructuras y mampostería' },
  // Hierro y acero
  { nombre: 'Hierro en barra 6mm', unidad: 'kg', categoria: 'Hierro y acero' },
  { nombre: 'Hierro en barra 8mm', unidad: 'kg', categoria: 'Hierro y acero' },
  { nombre: 'Hierro en barra 10mm', unidad: 'kg', categoria: 'Hierro y acero' },
  { nombre: 'Hierro en barra 12mm', unidad: 'kg', categoria: 'Hierro y acero' },
  { nombre: 'Hierro en barra 16mm', unidad: 'kg', categoria: 'Hierro y acero' },
  { nombre: 'Malla de acero Q92', unidad: 'm²', categoria: 'Hierro y acero' },
  { nombre: 'Malla de acero Q188', unidad: 'm²', categoria: 'Hierro y acero' },
  { nombre: 'Alambre negro N°16', unidad: 'kg', categoria: 'Hierro y acero' },
  { nombre: 'Perfil UPN 80', unidad: 'm lineal', categoria: 'Hierro y acero' },
  { nombre: 'Perfil UPN 100', unidad: 'm lineal', categoria: 'Hierro y acero' },
  { nombre: 'Viga IPN 120', unidad: 'm lineal', categoria: 'Hierro y acero' },
  { nombre: 'Columna metálica 100x100', unidad: 'm lineal', categoria: 'Hierro y acero' },
  // Madera y encofrado
  { nombre: 'Tabla de pino 1" x 6"', unidad: 'm lineal', categoria: 'Madera y encofrado' },
  { nombre: 'Tabla machimbre', unidad: 'm²', categoria: 'Madera y encofrado' },
  { nombre: 'Tirante de pino 3" x 3"', unidad: 'm lineal', categoria: 'Madera y encofrado' },
  { nombre: 'Madera para encofrado', unidad: 'm²', categoria: 'Madera y encofrado' },
  { nombre: 'Parquet de madera', unidad: 'm²', categoria: 'Madera y encofrado' },
  { nombre: 'Deck de madera', unidad: 'm²', categoria: 'Madera y encofrado' },
  { nombre: 'Madera de obra', unidad: 'm³', categoria: 'Madera y encofrado' },
  // Cubiertas
  { nombre: 'Chapa galvanizada N°25', unidad: 'm²', categoria: 'Cubiertas y techados' },
  { nombre: 'Chapa prepintada', unidad: 'm²', categoria: 'Cubiertas y techados' },
  { nombre: 'Membrana asfáltica 3mm', unidad: 'm²', categoria: 'Cubiertas y techados' },
  { nombre: 'Membrana asfáltica 4mm', unidad: 'm²', categoria: 'Cubiertas y techados' },
  { nombre: 'Teja cerámica', unidad: 'm²', categoria: 'Cubiertas y techados' },
  { nombre: 'Teja española', unidad: 'm²', categoria: 'Cubiertas y techados' },
  { nombre: 'Policarbonato alveolar', unidad: 'm²', categoria: 'Cubiertas y techados' },
  { nombre: 'Perfil correa metálica', unidad: 'm lineal', categoria: 'Cubiertas y techados' },
  // Revestimientos
  { nombre: 'Cerámica 30x30', unidad: 'm²', categoria: 'Revestimientos y pisos' },
  { nombre: 'Cerámica 45x45', unidad: 'm²', categoria: 'Revestimientos y pisos' },
  { nombre: 'Porcelanato 60x60', unidad: 'm²', categoria: 'Revestimientos y pisos' },
  { nombre: 'Porcelanato 60x120', unidad: 'm²', categoria: 'Revestimientos y pisos' },
  { nombre: 'Mosaico granítico', unidad: 'm²', categoria: 'Revestimientos y pisos' },
  { nombre: 'Microcemento', unidad: 'm²', categoria: 'Revestimientos y pisos' },
  { nombre: 'Adhesivo para cerámicas', unidad: 'bolsa', categoria: 'Revestimientos y pisos' },
  { nombre: 'Pastina cerámica', unidad: 'kg', categoria: 'Revestimientos y pisos' },
  { nombre: 'Zócalo de madera', unidad: 'm lineal', categoria: 'Revestimientos y pisos' },
  { nombre: 'Zócalo de porcelanato', unidad: 'm lineal', categoria: 'Revestimientos y pisos' },
  // Pintura
  { nombre: 'Pintura látex exterior', unidad: 'litro', categoria: 'Pintura y revestimientos' },
  { nombre: 'Pintura látex interior', unidad: 'litro', categoria: 'Pintura y revestimientos' },
  { nombre: 'Pintura esmalte sintético', unidad: 'litro', categoria: 'Pintura y revestimientos' },
  { nombre: 'Pintura anti-humedad', unidad: 'litro', categoria: 'Pintura y revestimientos' },
  { nombre: 'Enduído plástico', unidad: 'litro', categoria: 'Pintura y revestimientos' },
  { nombre: 'Yeso', unidad: 'bolsa', categoria: 'Pintura y revestimientos' },
  { nombre: 'Masilla para paredes', unidad: 'litro', categoria: 'Pintura y revestimientos' },
  { nombre: 'Sellador acrílico', unidad: 'litro', categoria: 'Pintura y revestimientos' },
  { nombre: 'Impermeabilizante acrílico', unidad: 'litro', categoria: 'Pintura y revestimientos' },
  { nombre: 'Tela de fibra de vidrio', unidad: 'm²', categoria: 'Pintura y revestimientos' },
  // Sanitarias
  { nombre: 'Caño PVC 110mm', unidad: 'm lineal', categoria: 'Instalaciones sanitarias' },
  { nombre: 'Caño PVC 75mm', unidad: 'm lineal', categoria: 'Instalaciones sanitarias' },
  { nombre: 'Caño PVC 50mm', unidad: 'm lineal', categoria: 'Instalaciones sanitarias' },
  { nombre: 'Caño PVC 40mm', unidad: 'm lineal', categoria: 'Instalaciones sanitarias' },
  { nombre: 'Codo PVC 90° 110mm', unidad: 'unidad', categoria: 'Instalaciones sanitarias' },
  { nombre: 'Tee PVC 110mm', unidad: 'unidad', categoria: 'Instalaciones sanitarias' },
  { nombre: 'Pileta de patio PVC', unidad: 'unidad', categoria: 'Instalaciones sanitarias' },
  { nombre: 'Trampa PVC', unidad: 'unidad', categoria: 'Instalaciones sanitarias' },
  { nombre: 'Llave de paso esférica', unidad: 'unidad', categoria: 'Instalaciones sanitarias' },
  { nombre: 'Caño de cobre 1/2"', unidad: 'm lineal', categoria: 'Instalaciones sanitarias' },
  { nombre: 'Caño de cobre 3/4"', unidad: 'm lineal', categoria: 'Instalaciones sanitarias' },
  { nombre: 'Termofusión 20mm', unidad: 'm lineal', categoria: 'Instalaciones sanitarias' },
  { nombre: 'Inodoro', unidad: 'unidad', categoria: 'Instalaciones sanitarias' },
  { nombre: 'Bidet', unidad: 'unidad', categoria: 'Instalaciones sanitarias' },
  { nombre: 'Lavatorio', unidad: 'unidad', categoria: 'Instalaciones sanitarias' },
  { nombre: 'Ducha', unidad: 'unidad', categoria: 'Instalaciones sanitarias' },
  { nombre: 'Bañera', unidad: 'unidad', categoria: 'Instalaciones sanitarias' },
  // Eléctricas
  { nombre: 'Cable IRAM 2.5mm²', unidad: 'm lineal', categoria: 'Instalaciones eléctricas' },
  { nombre: 'Cable IRAM 4mm²', unidad: 'm lineal', categoria: 'Instalaciones eléctricas' },
  { nombre: 'Cable IRAM 6mm²', unidad: 'm lineal', categoria: 'Instalaciones eléctricas' },
  { nombre: 'Caño corrugado ¾"', unidad: 'm lineal', categoria: 'Instalaciones eléctricas' },
  { nombre: 'Caja de paso plástica', unidad: 'unidad', categoria: 'Instalaciones eléctricas' },
  { nombre: 'Caja rectangular empotrable', unidad: 'unidad', categoria: 'Instalaciones eléctricas' },
  { nombre: 'Tablero modular 12 bocas', unidad: 'unidad', categoria: 'Instalaciones eléctricas' },
  { nombre: 'Disyuntor 2x25A', unidad: 'unidad', categoria: 'Instalaciones eléctricas' },
  { nombre: 'Disyuntor 1x16A', unidad: 'unidad', categoria: 'Instalaciones eléctricas' },
  { nombre: 'Tomacorriente doble', unidad: 'unidad', categoria: 'Instalaciones eléctricas' },
  { nombre: 'Interruptor simple', unidad: 'unidad', categoria: 'Instalaciones eléctricas' },
  { nombre: 'Interruptor doble', unidad: 'unidad', categoria: 'Instalaciones eléctricas' },
  // Aberturas
  { nombre: 'Ventana de aluminio', unidad: 'm²', categoria: 'Aberturas y carpintería' },
  { nombre: 'Puerta de madera interior', unidad: 'unidad', categoria: 'Aberturas y carpintería' },
  { nombre: 'Puerta exterior blindada', unidad: 'unidad', categoria: 'Aberturas y carpintería' },
  { nombre: 'Marco metálico', unidad: 'unidad', categoria: 'Aberturas y carpintería' },
  { nombre: 'Puerta de chapa doble contacto', unidad: 'unidad', categoria: 'Aberturas y carpintería' },
  { nombre: 'Vidrio float 3mm', unidad: 'm²', categoria: 'Aberturas y carpintería' },
  { nombre: 'Vidrio float 4mm', unidad: 'm²', categoria: 'Aberturas y carpintería' },
  { nombre: 'Vidrio templado 8mm', unidad: 'm²', categoria: 'Aberturas y carpintería' },
  // Varios
  { nombre: 'Clavos 2"', unidad: 'kg', categoria: 'Varios y consumibles' },
  { nombre: 'Tornillos autoperforantes', unidad: 'unidad', categoria: 'Varios y consumibles' },
  { nombre: 'Silicona neutra', unidad: 'unidad', categoria: 'Varios y consumibles' },
  { nombre: 'Espuma de poliuretano', unidad: 'unidad', categoria: 'Varios y consumibles' },
  { nombre: 'Nivelador para cerámicas', unidad: 'unidad', categoria: 'Varios y consumibles' },
  { nombre: 'Lija al agua N°120', unidad: 'unidad', categoria: 'Varios y consumibles' },
  { nombre: 'Lija al agua N°220', unidad: 'unidad', categoria: 'Varios y consumibles' },
  { nombre: 'Guantes de trabajo', unidad: 'unidad', categoria: 'Varios y consumibles' },
  { nombre: 'Bolsa de residuos reforzada', unidad: 'unidad', categoria: 'Varios y consumibles' },
  { nombre: 'Contenedor 5 m³', unidad: 'unidad', categoria: 'Varios y consumibles' },
  { nombre: 'Flete de escombros', unidad: 'global', categoria: 'Varios y consumibles' },
  { nombre: 'Cinta de enmascarar', unidad: 'unidad', categoria: 'Varios y consumibles' },
  { nombre: 'Thinner', unidad: 'litro', categoria: 'Varios y consumibles' },
]

/** Filtra sugerencias por texto */
export function filterMateriales(query, limit = 12) {
  const q = String(query || '').trim().toLowerCase()
  if (q.length < 2) return []
  return MATERIALES_DB.filter((m) => m.nombre.toLowerCase().includes(q)).slice(0, limit)
}

export function findMaterialByName(name) {
  const n = String(name || '').trim().toLowerCase()
  return MATERIALES_DB.find((m) => m.nombre.toLowerCase() === n) || null
}
