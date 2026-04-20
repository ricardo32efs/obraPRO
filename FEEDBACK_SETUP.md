# Configuración de Feedback con EmailJS + Netlify

## Paso 1: Crear cuenta en EmailJS
1. Andá a https://www.emailjs.com/
2. Registrate con tu Gmail de Obra Pro
3. Verificá tu email

## Paso 2: Configurar Servicio de Email (Gmail)
1. En EmailJS dashboard → "Email Services" → "Add New Service"
2. Seleccioná "Gmail"
3. Conectá con tu cuenta de Gmail de Obra Pro
4. Copiá el **Service ID** (se ve como `service_xxxxxx`)

## Paso 3: Crear Template de Email
1. Andá a "Email Templates" → "Create New Template"
2. Usá este formato:

```
Subject: Nuevo feedback de Obra Pro - {{tipo}}

De: {{from_name}} ({{from_email}})
Tipo: {{tipo}}
Fecha: {{fecha}}
URL: {{url}}

Mensaje:
{{mensaje}}
```

3. Guardá y copiá el **Template ID** (se ve como `template_xxxxxx`)

## Paso 4: Obtener API Keys
1. Andá a "Account" → "API Keys"
2. Copiá:
   - **Public Key** (se ve como `xxxxxxxxxxxxx`)
   - **Private Key** (se ve como `xxxxxxxxxxxxx`)

## Paso 5: Configurar Variables de Entorno en Netlify
1. Andá a https://app.netlify.com/
2. Seleccioná tu sitio `obraproweb`
3. Site settings → Environment variables
4. Agregá estas 5 variables:

| Variable | Valor |
|----------|-------|
| `EMAILJS_SERVICE_ID` | `service_xxxxxx` (del paso 2) |
| `EMAILJS_TEMPLATE_ID` | `template_xxxxxx` (del paso 3) |
| `EMAILJS_PUBLIC_KEY` | `xxxxxxxxxxxxx` (del paso 4) |
| `EMAILJS_PRIVATE_KEY` | `xxxxxxxxxxxxx` (del paso 4) |
| `EMAIL_TO` | `tugmaildeobra@gmail.com` (tu Gmail) |

5. Guardá cambios

## Paso 6: Deploy
Hacé push a GitHub y Netlify redeploya automáticamente:

```bash
git add .
git commit -m "feat: feedback system con EmailJS"
git push origin main
```

## Verificación
1. Andá a obraproweb.com
2. Click en "💬 Enviar feedback" (sidebar o footer)
3. Mandá un mensaje de prueba
4. Revisá tu Gmail (también spam por las dudas)

## Seguridad ✅
- Tu API key **NO** está expuesta en el código
- Todo pasa por el servidor (Netlify Function)
- Tu número de WhatsApp **NO** aparece en ningún lado
- Los usuarios no ven tu email

## Costos
- EmailJS: 200 emails/mes GRATIS (más que suficiente)
- Netlify Functions: 125,000 requests/mes GRATIS
- Gmail: GRATIS

---
**Dudas?** El modal de feedback ya está funcionando, solo necesitás completar los pasos 1-5.
