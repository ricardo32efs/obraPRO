# Obra Pro

App web para crear presupuestos de obra (Argentina) con PDF, Excel, email y asistente IA opcional.

## Stack

- React + Vite 5
- Tailwind CSS v4
- Framer Motion
- jsPDF + autotable
- xlsx
- EmailJS
- PWA (vite-plugin-pwa)

## Requisitos

- Node.js 20 LTS (recomendado)
- npm 10+

## Estrategia de despliegue (resumen)

Ver **`ESTRATEGIA_RECOMENDADA.md`**: se recomienda **GitHub + Vercel o Netlify** para actualizar el sitio sin subir archivos a mano.

**Guía paso a paso (imposible saltearse orden):** abrí **`PASOS_DESPLIEGUE_INTERNET.md`** en esta misma carpeta.

**Para revisar el producto con otro asistente (ej. Claude):** abrí **`AVANCE_Y_CONTEXTO_PARA_REVISION.md`**, completá la URL de Vercel arriba del archivo y adjuntalo al chat junto con el link en vivo.

## Backup del codigo en un archivo

Doble clic en **`EXPORTAR_CODIGO_ZIP.bat`**: crea en el **Escritorio** un `.zip` con todo el proyecto **sin** `node_modules` ni `dist` (se regeneran con `npm install` y `npm run build`).

## Inicio rapido

1. Instalar dependencias:
   - `npm install`
2. Crear variables de entorno:
   - copiar `.env.example` a `.env`
3. Ejecutar en desarrollo:
   - `npm run dev`
4. Abrir:
   - `http://localhost:5173`

### Inicio con doble clic (Windows)

- `INICIAR_OBRAPRO_LOCAL.bat`: inicia en modo desarrollo (`http://localhost:5173`)
- `INICIAR_OBRAPRO_PROD_LOCAL.bat`: compila y sirve modo producción local (`http://localhost:4173`)

## Comandos

- `npm run dev`: desarrollo
- `npm run dev:local`: desarrollo accesible por red local
- `npm run lint`: lint
- `npm run build`: build produccion
- `npm run preview`: previsualizar build
- `npm run preview:local`: preview accesible por red local
- `npm run start:local`: alias de dev local
- `npm run start:prod-local`: build + preview local
- `npm run check`: lint + build

## Variables de entorno

Ver `.env.example`. Las principales:

- `VITE_EMAILJS_PUBLIC_KEY`
- `VITE_EMAILJS_SERVICE_ID`
- `VITE_EMAILJS_TEMPLATE_ID`
- `VITE_ANTHROPIC_BASE_URL` (si tenes backend proxy propio)
- `VITE_ANTHROPIC_USE_PROXY=true` (en preview con proxy)
- `VITE_PRO_CHECKOUT_URL` (opcional, boton de pago externo)
- `VITE_SITE_URL` (opcional, URL canónica para SEO y redes; si no, se usa el dominio actual)
- `VITE_GA_MEASUREMENT_ID` (opcional, Google Analytics 4, formato `G-...`, solo en build producción)

## Pagos (plan PRO)

La app es **estática** (sin servidor propio obligatorio). El modal PRO puede mostrar un botón que abre un **enlace de pago externo** si configurás:

- `VITE_PRO_CHECKOUT_URL` = URL pública de checkout (misma en `.env` local y en el panel del hosting).

**Opciones habituales en Argentina / LATAM**

| Proveedor | Qué creás en su panel | Notas |
|-----------|------------------------|--------|
| **Mercado Pago** | Link de pago, suscripción o plan; copiás la URL que abre el checkout | Muy usado en AR; tarjetas, dinero en cuenta, cuotas según config |
| **Stripe** | [Payment Links](https://stripe.com/docs/payments/payment-links) o Checkout | Si operás con cuenta Stripe habilitada |
| Otros | Cualquier URL de pago (Lemon Squeezy, Hotmart, etc.) | Mientras sea `https://...` |

**Estrategia de precios (resumen):** conviene ofrecer **mensual** y **anual con descuento**; evitar **semanal** (fricción y desconfianza). Un **pago único vitalicio** solo como oferta acotada de lanzamiento si querés cash inicial; para mantener el producto, lo recurrente es más sano.

**Importante:** Obra Pro **no verifica automáticamente** que el pago se completó: el usuario puede seguir usando **«PRO de prueba (este dispositivo)»** hasta que conectes un **backend** con webhooks del proveedor y cuentas de usuario. Para el lanzamiento, el flujo típico es: cobrás por el enlace externo y, si hace falta, activás PRO manualmente o dejás el texto legal/claro en la landing.

## Despliegue (que la web sea pública)

Hay configuración lista: `netlify.toml`, `vercel.json`. Build: `npm run build`, carpeta: `dist`.

### 1) Subir el código a Git (GitHub)

1. Creá un repositorio vacío en GitHub (sin README si ya tenés proyecto local).
2. En la carpeta `obrapro` (una sola vez):

```bash
git init
git add .
git commit -m "Obra Pro 1.0"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
git push -u origin main
```

(Si Git no está instalado: [Git for Windows](https://git-scm.com/download/win).)

### 2) Vercel (recomendado para Vite)

1. Entrá a [vercel.com](https://vercel.com), iniciá sesión (podés usar cuenta de GitHub).
2. **Add New → Project → Import** el repositorio `obrapro`.
3. Framework: **Vite** (o “Other”): **Build Command** `npm run build`, **Output Directory** `dist`.
4. En **Environment Variables**, agregá las mismas que uses en producción, por ejemplo:
   - `VITE_EMAILJS_PUBLIC_KEY`, `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID` (si enviás mails)
   - `VITE_PRO_CHECKOUT_URL` (enlace de pago)
   - `VITE_SITE_URL` = `https://tu-proyecto.vercel.app` o tu dominio (sin barra final)
   - `VITE_GA_MEASUREMENT_ID` (opcional)
5. **Deploy**. En unos minutos tendrás una URL `https://....vercel.app` accesible para todo el mundo.

**Dominio propio:** en el proyecto Vercel → **Settings → Domains** y seguí el asistente (DNS en tu registrador).

### 3) Netlify (alternativa)

1. [app.netlify.com](https://app.netlify.com) → **Add new site → Import an existing project** → conectá GitHub y el repo.
2. Build: `npm run build`, publish: `dist` (ya viene alineado con `netlify.toml`).
3. **Site configuration → Environment variables** y cargá las mismas `VITE_*` que arriba.
4. **Deploy**. Opcional: **Domain management** para dominio propio.

### 4) Después del primer deploy

- Probá la URL en el celular y en otra red.
- En Mercado Pago / Stripe, permití la **URL de retorno** o dominios permitidos si el proveedor lo pide.
- Compartí el enlace en redes: la imagen `og-share.png` y las meta tags ayudan al preview en WhatsApp.

## Dónde están los archivos de la web

Proyecto completo:

- `c:\Users\alvar\OneDrive\Documentos\WEB JESUS\obrapro`

Carpetas clave:

- Código fuente: `src`
- Archivos públicos: `public`
- Configuración: `vite.config.js`, `package.json`, `.env*`
- Build final para publicar: `dist` (se genera con `npm run build`)

## Cómo trasladar la web a otra PC

Opción recomendada:

1. Copiar toda la carpeta `obrapro` a la otra PC.
2. Instalar Node.js 20 LTS.
3. Abrir terminal en la carpeta copiada.
4. Ejecutar `npm install`.
5. Copiar `.env` (si usás EmailJS / IA / pago).
6. Iniciar con:
   - `npm run dev` (desarrollo) o
   - `npm run start:prod-local` (modo producción local).

Si querés mover solo lo ya compilado:

1. Ejecutar `npm run build`.
2. Copiar carpeta `dist`.
3. Servir `dist` con cualquier servidor estático.

## PWA

- Manifest y service worker se generan en build.
- En dispositivos compatibles se puede instalar como app.

## Nota IA (Anthropic)

En desarrollo, Vite usa proxy `/anthropic` a `https://api.anthropic.com`.
En hosting estatico sin backend, usa modo demo o configura tu backend proxy.
