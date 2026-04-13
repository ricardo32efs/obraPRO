# Obra Pro — checklist final antes de publicar cambios

Usar esta lista cada vez que hagas cambios importantes.

## 1) Flujo principal
- Crear presupuesto nuevo sin errores.
- Agregar al menos 2 materiales y 1 mano de obra.
- Guardar borrador y volver a abrir desde historial.
- Cambiar estado desde historial (borrador/enviado/aprobado).

## 2) PDF (núcleo del producto)
- El logo se ve en preview y en PDF descargado.
- Tablas de materiales/mano de obra centradas y legibles.
- Valores numéricos de columnas alineados de forma consistente.
- Si escenarios/anticipo/checklist están desactivados, no aparecen en PDF.
- El bloque de condiciones generales aparece al final del documento.

## 3) Opcionales y datos de empresa
- Guardar empresa sin CUIT (debe permitirlo).
- Si teléfono/email/CUIT están vacíos, no deben mostrarse con guiones en PDF.
- Verificar que color/acento y datos de empresa se reflejen en el documento.

## 4) Landing y conversión
- Hero carga bien en móvil y desktop.
- CTA principal visible por encima del primer scroll en móvil.
- Textos no prometen IA obligatoria; mencionan que es opcional.
- Card PRO destaca, pero sin confundir con botones secundarios.

## 5) Técnico
- Ejecutar `npm run check` (lint + build) sin errores.
- Probar URL de Vercel y revisar deploy en estado Ready.
- Probar una sesión en incógnito para validar experiencia de usuario nuevo.
