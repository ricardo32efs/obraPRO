# Guia de lanzamiento paso a paso (Obra Pro)

Esta guia esta pensada para que publiques hoy mismo.

## 1) Preparar entorno local

1. Abri terminal en la carpeta `obrapro`.
2. Instala dependencias:
   - `npm install`
3. Crea `.env` a partir de `.env.example`.
4. Completa (si aplica):
   - EmailJS: `VITE_EMAILJS_PUBLIC_KEY`, `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`
   - Link de pago externo: `VITE_PRO_CHECKOUT_URL`
   - IA via backend propio: `VITE_ANTHROPIC_BASE_URL`

## 2) Verificar calidad antes de publicar

Ejecuta:

- `npm run check`

Debe terminar sin errores.

## 3) Elegir hosting (recomendado: Netlify o Vercel)

### Opcion A: Netlify

1. Crea cuenta o entra en Netlify.
2. "Add new site" -> "Import an existing project".
3. Conecta GitHub/GitLab/Bitbucket y selecciona repo.
4. Build command:
   - `npm run build`
5. Publish directory:
   - `dist`
6. Variables de entorno:
   - agrega las de `.env` en panel de Netlify.
7. Deploy.

### Opcion B: Vercel

1. Crea cuenta o entra en Vercel.
2. "Add New..." -> "Project".
3. Importa el repo.
4. Framework preset: Vite.
5. Variables de entorno:
   - agrega las de `.env`.
6. Deploy.

## 4) Conectar dominio propio

1. Compra/usa dominio.
2. En Netlify o Vercel, agrega "Custom domain".
3. Configura DNS segun instrucciones del proveedor.
4. Espera propagacion y verifica SSL activo (https).

## 5) Checklist funcional post deploy

Proba en produccion:

1. Landing carga rapido.
2. Crear presupuesto nuevo.
3. Guardar borrador y verlo en historial.
4. Descargar PDF.
5. Exportar Excel.
6. Modal email (si EmailJS configurado).
7. Dashboard (PRO).
8. Instalacion PWA en movil (si navegador soporta).

## 6) Si algo falla

- Error 404 al refrescar ruta:
  - revisar `netlify.toml` o `vercel.json`.
- Email no envia:
  - revisar variables EmailJS y plantilla.
- IA no responde en hosting estatico:
  - activar modo demo o usar backend proxy real.
- Cambios no se ven:
  - limpiar cache y recargar (Ctrl+F5).

## 7) Operacion recomendada semanal

1. Revisar feedback real de usuarios.
2. Ajustar UX y copy.
3. Correr `npm run check`.
4. Publicar nueva version.

---

Si queres, el siguiente paso ideal es agregar un backend minimo para:

- validar suscripcion PRO real por usuario,
- API proxy segura para IA,
- backup en nube de presupuestos.
