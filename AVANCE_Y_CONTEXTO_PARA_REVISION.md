# Obra Pro — avance del proyecto (documento para revisión externa)

**Para quién es este archivo:** quien evalúe el producto (por ejemplo Claude u otro asistente) sin tener que recorrer todo el repo. El dueño del proyecto completará la **URL pública** abajo cuando la use.

**Cómo usarlo:** adjuntá este archivo al chat de revisión y, si podés, el **link en vivo** de Vercel y/o el repo de GitHub.

---

## URL pública (completar)

- **Sitio en producción (Vercel):** _pegá aquí tu URL, ej. `https://….vercel.app`_
- **Repositorio:** `https://github.com/ricardo32efs/obrapro` (ajustar si cambió el usuario o nombre)

---

## Qué es Obra Pro

Aplicación web para **presupuestos de obra** (Argentina / español): materiales, mano de obra, totales, IVA, PDF profesional, exportación Excel, historial, dashboard, plantillas, asistente con IA opcional, envío por email (EmailJS en PRO). PWA instalable.

**Usuario objetivo:** maestros mayores, contratistas, refacciones, quienes necesitan cotizar obras con documento serio desde PC o celular.

---

## Estado actual del avance

- **Versión en código:** 1.0.0 (`package.json`).
- **Desplegado en Vercel** con build `npm run build` y salida `dist`.
- **Dominio propio:** pendiente (planeado).
- **Cobro PRO:** enlace externo vía `VITE_PRO_CHECKOUT_URL` (Mercado Pago u otro); el plan PRO “de prueba” hoy es **local al navegador** hasta integrar cuentas/pagos en servidor.

---

## Stack técnico

| Área | Tecnología |
|------|------------|
| UI | React 19, Vite 5, Tailwind CSS v4 |
| Animación | Framer Motion |
| PDF / Excel | jsPDF + autotable, xlsx |
| Email | EmailJS (variables de entorno) |
| IA | Anthropic vía proxy en desarrollo; demo u otro backend en producción |
| Datos | localStorage (sin backend propio en esta versión) |
| PWA | vite-plugin-pwa |

---

## Flujo para el usuario

1. **Landing** (`Landing.jsx`) — marketing, precios, FAQ, CTA a crear presupuesto.
2. **Onboarding** — datos de empresa (`ConfigEmpresa.jsx`) si no están cargados.
3. **App interna** (navegación lateral / bottom nav):
   - **Nuevo presupuesto** (`NuevoPresupuesto.jsx`) — formulario principal, IA, auditoría, plantillas, totales con margen/contingencia.
   - **Historial** (`Historial.jsx`) — lista, filtros, PDF, estados.
   - **Dashboard** (`Dashboard.jsx`) — métricas y gráfico.
   - **Config** — misma pantalla de empresa.
4. **Modales:** vista previa (`PreviewModal.jsx`), upgrade PRO (`UpgradeModal.jsx`), email (`EmailSendModal.jsx`), plantillas, legales (`LegalInfoModal.jsx`).

---

## Plan gratuito vs PRO (lógica de negocio)

- **Gratis:** hasta **5 presupuestos nuevos por mes** (constante `FREE_MONTHLY_BUDGET_LIMIT` en `src/utils/constants.js`).
- **PRO:** ilimitado, PDF con marca, IA, historial completo, dashboard, plantillas, Excel, email; modal con precios de referencia en `src/utils/pricingCopy.js`.

---

## Identidad visual (referencia)

- Fondo tipo papel `#f4f1ec`, acento terracota `#c1440e`, tipografías: Playfair Display (títulos), DM Sans (cuerpo), JetBrains Mono (números/código).
- Definido en `src/index.css` (`@theme` / `:root`).

---

## Archivos clave si la revisión es de UX, textos o maquetación

| Tema | Archivo(s) |
|------|------------|
| Landing y precios | `src/components/Landing/Landing.jsx` |
| Modal suscripción PRO | `src/components/UI/UpgradeModal.jsx` |
| Textos de precios compartidos | `src/utils/pricingCopy.js` |
| App shell, rutas | `src/App.jsx` |
| Formulario presupuesto | `src/components/Presupuesto/NuevoPresupuesto.jsx` |
| Totales y escenarios | `src/components/Presupuesto/PanelTotales.jsx` |
| Documento PDF / preview | `src/components/Preview/DocumentoPresupuesto.jsx`, `src/utils/generatePDF.js` |
| Historial | `src/components/Historial/Historial.jsx` |
| Navegación móvil | `src/components/UI/BottomNav.jsx`, `Sidebar.jsx` |
| Estilos globales | `src/index.css` |

---

## Variables de entorno (producción)

Definidas en Vercel según necesidad:

- `VITE_SITE_URL` — URL canónica (SEO / Open Graph).
- `VITE_PRO_CHECKOUT_URL` — checkout externo PRO.
- `VITE_EMAILJS_*` — envío de mail.
- `VITE_GA_MEASUREMENT_ID` — analytics opcional.
- IA: `VITE_ANTHROPIC_BASE_URL` si hay proxy propio.

Detalle en `.env.example`.

---

## Limitaciones que un revisor debe conocer

- Sin servidor propio: datos en **localStorage** del navegador.
- El pago real no desbloquea PRO automáticamente en servidor; hay copy honesto en UI al respecto.
- Rutas son **estado interno** (no URLs `/historial` etc. en la barra del navegador).

---

## Qué se pide a la revisión

Lista abierta para el evaluador:

1. **UX / usabilidad** en mobile y desktop (fricción, claridad, orden de pasos).
2. **Copy** (landing, modales, errores, CTAs): tono, claridad, confianza.
3. **Conversión** a PRO sin engaños (ética + efectividad).
4. **Coherencia visual** (espaciados, jerarquía, accesibilidad básica).
5. **Ideas concretas** de mejora priorizadas (rápidas vs grandes).

**Salida deseada:** lista numerada de cambios sugeridos, indicando pantalla o archivo si es posible.

---

## Cómo probar en local (quien tenga el repo)

```bash
npm install
npm run dev
```

Abrir `http://localhost:5173`. Scripts Windows: `INICIAR_OBRAPRO_LOCAL.bat`.

---

*Última actualización del documento: generado para acompañar revisiones de producto; actualizar la URL de Vercel y el link del repo si cambian.*
