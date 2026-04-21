# Guía Ultra Detallada: EmailJS Paso a Paso

## PASO 1: Crear Cuenta (2 minutos)

1. Andá a https://www.emailjs.com/
2. Click en el botón **"Sign Up"** (arriba a la derecha, color naranja)
3. Elegí **"Sign up with Email"**
4. Completá:
   - **Name**: Obra Pro
   - **Email**: tu-gmail-de-obra@gmail.com (tu email específico)
   - **Password**: creá una segura
5. Click en **"Create Account"**
6. Andá a tu Gmail y abrí el email de EmailJS
7. Click en el botón **"Verify Email"**

---

## PASO 2: Conectar tu Gmail (3 minutos)

Una vez dentro del dashboard de EmailJS:

### 2.1 Entrá a Email Services
- En el menú de la izquierda, click en **"Email Services"**
- (Está debajo de "Dashboard", tiene un icono de carta 📧)

### 2.2 Agregar Servicio
- Click en el botón **"Add New Service"** (botón azul, arriba a la derecha)
- Seleccioná **"Gmail"** de la lista (tiene el logo de Gmail)
- Click en **"Connect Account"**
- Se abre una ventana de Google
- Elegí tu cuenta de Gmail de Obra Pro
- Dá permisos (click en "Allow" o "Permitir")

### 2.3 Copiar el Service ID
- Una vez conectado, vas a ver un recuadro con tu servicio
- El nombre es algo como: **service_abc123** o **service_xyz789**
- Copiá ese código (seleccioná y Ctrl+C)
- **Guardalo en un archivo de texto temporal**

---

## PASO 3: Crear el Template de Email (5 minutos)

### 3.1 Entrá a Email Templates
- En el menú de la izquierda, click en **"Email Templates"**
- (Está debajo de "Email Services")

### 3.2 Crear Nuevo Template
- Click en **"Create New Template"** (botón azul, arriba a la derecha)
- Se abre el editor de templates

### 3.3 Configurar el Template (IMPORTANTE - Copiá exacto)

**En el campo "Subject" (Asunto):**
```
Nuevo feedback de Obra Pro - {{tipo}}
```

**En el campo "From Name" (Nombre del remitente):**
```
Obra Pro Feedback
```

**En el campo "From Email" (Email del remitente):**
```
noreply@obraproweb.com
```

**En el campo "To Email" (Email destino - TU GMAIL):**
```
tu-gmail-de-obra@gmail.com
```

**En el cuerpo del mensaje (la caja grande de texto):**
```
NUEVO FEEDBACK RECIBIDO
========================

De: {{from_name}}
Email: {{from_email}}
Tipo: {{tipo}}
Fecha: {{fecha}}
URL: {{url}}

MENSAJE:
{{mensaje}}

---
Enviado desde obraproweb.com
```

### 3.4 Guardar y Copiar Template ID
- Click en **"Save"** (botón verde, arriba a la derecha)
- Te va a redirigir a la lista de templates
- Vas a ver tu template con un nombre como **template_abc123**
- Copiá ese código
- **Guardalo en el archivo de texto temporal**

---

## PASO 4: Obtener API Keys (2 minutos)

### 4.1 Entrá a Account
- Click en tu foto/nombre (arriba a la derecha)
- Del menú desplegable, click en **"Account"**

### 4.2 Copiar Public Key
- Buscá el campo **"Public Key"**
- Es un código largo, tipo: **XxXxXxXxXxXxXxXxX**
- Click en el botón **"Copy"** al lado
- **Guardalo en el archivo de texto temporal**

### 4.3 Copiar Private Key
- En la misma página, buscá **"Private Key"**
- Click en **"Generate Private Key"** si no existe
- Click en **"Copy"**
- **Guardalo en el archivo de texto temporal**

**Tu archivo de texto temporal debería tener:**
```
Service ID: service_xxxxxx
Template ID: template_xxxxxx
Public Key: XXXXXXXXXXXXX
Private Key: XXXXXXXXXXXXX
```

---

## PASO 5: Configurar Netlify (5 minutos)

### 5.1 Entrá a Netlify
- Andá a https://app.netlify.com/
- Logueate con tu cuenta

### 5.2 Encontrá tu sitio
- Vas a ver "obraproweb" o "obrapro"
- Click en el nombre del sitio

### 5.3 Ir a Environment Variables
- En el menú superior, click en **"Site configuration"**
- En el menú lateral izquierdo, click en **"Environment variables"**
- (Si no lo ves, buscá "Variables de entorno" o "Env vars")

### 5.4 Agregar Variables (una por una)

Click en **"Add a variable"** o **"New variable"**

**Variable 1:**
- Key: `EMAILJS_SERVICE_ID`
- Value: (pegá tu Service ID del paso 2)
- Click "Save"

**Variable 2:**
- Key: `EMAILJS_TEMPLATE_ID`
- Value: (pegá tu Template ID del paso 3)
- Click "Save"

**Variable 3:**
- Key: `EMAILJS_PUBLIC_KEY`
- Value: (pegá tu Public Key del paso 4)
- Click "Save"

**Variable 4:**
- Key: `EMAILJS_PRIVATE_KEY`
- Value: (pegá tu Private Key del paso 4)
- Click "Save"

**Variable 5:**
- Key: `EMAIL_TO`
- Value: (tu Gmail de Obra Pro, ej: `tugmail@gmail.com`)
- Click "Save"

### 5.5 Verificar Deploy
- Andá a "Deploys" en el menú superior
- Esperá a que termine el deploy (aparece "Published" en verde)
- Esto toma 1-2 minutos

---

## PASO 6: Probar (2 minutos)

1. Andá a https://obraproweb.com
2. Hacé **Ctrl + Shift + R** (para limpiar caché)
3. Click en cualquier botón de **"💬 Enviar feedback"**
4. Completá el formulario:
   - Tipo: Sugerencia
   - Nombre: Test
   - Email: (vacío o uno de prueba)
   - Mensaje: "Esto es una prueba del sistema de feedback"
5. Click en **"Enviar feedback"**
6. Esperá 5-10 segundos
7. Debería aparecer "¡Gracias por tu feedback!"

### 6.1 Verificar Email
- Andá a tu Gmail de Obra Pro
- Revisá la bandeja de entrada
- Si no está, revisá **Spam**
- Deberías ver un email con el asunto "Nuevo feedback de Obra Pro - sugerencia"

---

## ❌ Si algo falla

**"Failed to send" o error rojo:**
1. Revisá que las 5 variables de entorno estén en Netlify
2. Verificá que no haya espacios extra en las variables
3. En EmailJS, asegurate de que el template esté guardado
4. Reintentá el deploy en Netlify (Site settings → Build & deploy → Trigger deploy)

**No llega el email:**
1. Revisá Spam
2. En EmailJS, verificá que el servicio Gmail diga "Active" (en verde)
3. Probá mandar un email de prueba desde EmailJS (botón "Send Test")

---

## 📞 Capturas de referencia (descripción textual)

**Email Services:**
```
Menú izquierdo:
  📊 Dashboard
  📧 Email Services  <-- CLICK AQUÍ
  📝 Email Templates
  ...
```

**Crear Template:**
```
+------------------------------------------+
|  Email Templates                [+ New]  |  <-- CLICK "+ New"
+------------------------------------------+
```

**Editor de Template:**
```
Subject: [______________________________]  <-- Escribí aquí
From:    [______________________________]
To:      [______________________________]

Body:
+----------------------------------------+
|                                        |
|  ESCRIBÍ EL CUERPO AQUÍ                |  <-- Caja grande
|                                        |
+----------------------------------------+

                           [Save] [Cancel]  <-- CLICK Save
```

---

**¿Te queda claro o necesitás que profundice en algún paso específico?**
