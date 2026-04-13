# Plan IA real (MVP rentable y seguro)

Objetivo: tener IA útil de verdad sin vender humo ni exponer claves.

## Decisión recomendada (CEO)

- Mantener la app usable sin IA (core fuerte).
- IA como módulo opcional premium, con texto claro.
- Implementación por backend propio, nunca con clave secreta en frontend.

## Arquitectura mínima

1. Frontend (`obrapro`) envía descripción + contexto al backend.
2. Backend valida cuota/plan y llama a Anthropic/OpenAI.
3. Backend devuelve JSON estructurado (materiales, mano de obra, advertencias).
4. Frontend muestra sugerencias y permite editar antes de guardar.

## Fase 1 (rápida, 1-2 semanas)

- Endpoint: `POST /api/ia/presupuesto-sugerido`.
- Límite por usuario/mes (anti abuso).
- Timeout y fallback amigable (si falla, seguir manual).
- Registro simple de uso para métricas.

## Fase 2 (producto)

- Guardar historial de sugerencias por presupuesto.
- Mejorar prompt con contexto regional (ciudad, rubro, tipo de obra).
- Ajuste de tono por nivel del usuario (básico/profesional).

## Lo que NO recomiendo

- Prometer “IA automática perfecta”.
- Depender de IA para que el producto funcione.
- Exponer API keys en navegador.

## Copy sugerido

- "Sugerencias con IA (opcional): acelera tu presupuesto, siempre editable."
- "Funciona también sin IA."

## KPI para medir si vale la pena

- Tasa de uso IA por presupuesto creado.
- Tiempo promedio para terminar presupuesto (con IA vs sin IA).
- Conversión Free -> PRO en usuarios que usan IA.
- Tasa de edición manual posterior a sugerencia (calidad percibida).
