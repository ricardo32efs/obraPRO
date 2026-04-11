# Pasos para tener Obra Pro en internet (detallado)

Usá esta lista **en orden**. Marcá cada ítem cuando lo termines.

**Tu carpeta del proyecto (ajustá si la moviste):**

`c:\Users\alvar\OneDrive\Documentos\WEB JESUS\obrapro`

---

## Paso 0 — Respaldo (2 minutos, opcional pero recomendado)

1. Abrí la carpeta `obrapro`.
2. Doble clic en **`EXPORTAR_CODIGO_ZIP.bat`**.
3. En el **Escritorio** aparecerá un archivo `ObraPro-codigo-fuente-....zip`. Eso es tu copia de seguridad del código.

---

## Paso 1 — Instalar Git (solo si no lo tenés)

1. Abrí el navegador y entrá a: https://git-scm.com/download/win  
2. Descargá el instalador **64-bit Git for Windows Setup**.  
3. Ejecutalo: **Next** en todo (dejá opciones por defecto) hasta **Install**.  
4. Cerrá el instalador con **Finish**.  
5. **Comprobar:**  
   - Presioná tecla **Windows**, escribí `powershell`, abrí **Windows PowerShell**.  
   - Escribí: `git --version` y Enter.  
   - Si muestra algo como `git version 2.x.x`, seguí al Paso 2.  
   - Si dice que no reconoce el comando, reiniciá la PC y probá de nuevo.

---

## Paso 2 — Crear cuenta en GitHub y un repositorio vacío

1. Entrá a: https://github.com/signup  
2. Creá cuenta (email, contraseña, nombre de usuario). Verificá el email si te lo pide.  
3. Iniciá sesión en GitHub.  
4. Arriba a la derecha hacé clic en el **+** → **New repository**.  
5. **Repository name:** escribí por ejemplo `obrapro` (una sola palabra, sin espacios).  
6. Dejá **Public** marcado.  
7. **No marques** “Add a README file” (dejá desmarcado).  
8. Clic en **Create repository**.  
9. Vas a ver una página casi vacía con instrucciones. **No cierres esa pestaña.**  
10. **Anotá en un papel** la URL de tu repo. Tiene esta forma:  
    `https://github.com/TU_USUARIO/obrapro`  
    (reemplazá `TU_USUARIO` por tu nombre de usuario real de GitHub).

---

## ANTES del Paso 3 — Qué es PowerShell y qué tenés que escribir

**Qué es:** PowerShell es una **ventana negra o azul** donde escribís órdenes de texto. No usás el mouse adentro para abrir carpetas: escribís comandos y presionás **Enter**.

**Cómo abrir PowerShell ya parado en la carpeta `obrapro` (la forma más fácil):**

1. Abrí el **Explorador de archivos** (carpeta amarilla en la barra de tareas).  
2. Andá hasta la carpeta `obrapro` (la que tiene adentro `package.json` y la carpeta `src`).  
   - Ruta completa si no la moviste:  
     `Este equipo → OneDrive → Documentos → WEB JESUS → obrapro`  
3. Cuando estés **dentro** de la carpeta `obrapro` (veas `src`, `package.json`, etc.):  
   - Hacé clic en la **barra de direcciones** (arriba, donde dice el camino de carpetas).  
   - **Borrá** lo que dice y escribí exactamente: `powershell`  
   - Presioná **Enter**.  
4. Se abre PowerShell y la **primera línea** debería mostrar algo como:  
   `PS C:\Users\...\WEB JESUS\obrapro>`  
   Eso significa: **estás en la carpeta correcta**. Si no dice `obrapro` al final, no sigas: volvé al paso 2.

**Cómo pegar texto:** hacé **clic derecho** dentro de la ventana (a veces pega), o probá **Ctrl + V**.

**Regla de oro:** cada comando que te damos abajo, lo **pegás una vez**, presionás **Enter**, y **esperás** a que aparezca de nuevo la línea `PS ...>` antes de pegar el siguiente. Si aparece texto rojo, **no** sigas: leé el mensaje o copiá todo el texto y pedí ayuda con ese error.

---

## Paso 3 — Subir tu proyecto desde la PC a GitHub

**Ideal:** ya abriste PowerShell **desde la carpeta obrapro** (sección de arriba). Si no, usá el paso 2 de abajo con `cd`.

1. **Mirá la línea del prompt:** ¿termina en `\obrapro>`?  
   - **Sí** → saltá al punto 4.  
   - **No** → hacé el punto 2 y 3.

2. Copiá **exactamente** esto (incluye las comillas), pegá en PowerShell, **Enter**:

```powershell
cd "c:\Users\alvar\OneDrive\Documentos\WEB JESUS\obrapro"
```

3. Si sale error *“no se encuentra la ruta”*: tu proyecto **no está** en esa ruta. Buscá la carpeta `obrapro` en el Explorador, y usá el truco de escribir `powershell` en la barra de direcciones **estando dentro de obrapro**.

4. Con el prompt ya en `...\obrapro>`, ejecutá **una orden por vez** (pegá → Enter → esperá la nueva línea `PS ...>`):

```powershell
git init
```

```powershell
git add .
```

```powershell
git commit -m "Primera subida Obra Pro"
```

```powershell
git branch -M main
```

5. Ahora conectá con **tu** repositorio. **Reemplazá** `TU_USUARIO` por tu usuario de GitHub y `obrapro` si pusiste otro nombre al repo:

```powershell
git remote add origin https://github.com/TU_USUARIO/obrapro.git
```

6. Subí el código:

```powershell
git push -u origin main
```

7. **Qué puede pasar aquí:**  
   - **Te pide usuario y contraseña:** el usuario es tu **nombre de usuario de GitHub**. La contraseña **no** es la de GitHub: desde 2021 hay que usar un **Personal Access Token**.  
     - En GitHub: foto arriba derecha → **Settings** → izquierda abajo **Developer settings** → **Personal access tokens** → **Tokens (classic)** → **Generate new token**.  
     - Marcá al menos **repo**. Generá, copiá el token (solo se ve una vez) y usalo como “contraseña” cuando `git push` lo pida.  
   - **Otra ventana del navegador:** a veces Git abre GitHub para autorizar: seguí los pasos y volvé a PowerShell.

8. Volvé a la página de tu repo en GitHub y **refrescá** (F5). Deberías ver carpetas: `src`, `public`, archivos `package.json`, etc.

**Si llegaste acá, lo más difícil ya está hecho.**

### Qué debería salir en pantalla (si todo va bien)

| Comando | Qué es normal ver |
|--------|-------------------|
| `git init` | `Initialized empty Git repository in ...` |
| `git add .` | A veces no dice nada; a veces lista archivos. |
| `git commit ...` | `... files changed`, `create mode`, etc. |
| `git remote add ...` | No muestra nada si está bien. |
| `git push ...` | Subida con porcentajes o “Writing objects”. |

### Si aparece texto rojo

- **`remote origin already exists`:** ya habías agregado el remoto. Ejecutá: `git remote remove origin` y volvé a hacer `git remote add origin https://github.com/TU_USUARIO/obrapro.git` (con **tu** usuario).  
- **`failed to push ... rejected`:** a veces el repo en GitHub tiene un archivo (README). En GitHub, borrá el README del repo vacío o seguí instrucciones de “pull first” (pedí ayuda con el mensaje completo).  
- **`git is not recognized`:** Git no está instalado o hace falta **reiniciar la PC** después de instalarlo.

### Sin usar PowerShell: GitHub Desktop (programa con botones)

1. Descargá **GitHub Desktop**: https://desktop.github.com/  
2. Instalá e iniciá sesión con tu cuenta **GitHub**.  
3. **File → Add local repository** → **Choose…** → seleccioná la carpeta `obrapro`.  
4. Si dice que no es un repositorio, elegí **create a repository** o **publish** según lo que muestre el asistente.  
5. Buscá un botón tipo **Publish repository** o **Push origin**: eso sube el código a GitHub sin escribir comandos.  
6. Entrá a tu repo en el navegador y comprobá que veas `src` y `package.json`. Después seguí el **Paso 4 (Vercel)**.

---

## Paso 4 — Publicar con Vercel (sitio web público)

1. Entrá a: https://vercel.com  
2. **Sign Up** → elegí **Continue with GitHub**.  
3. Autorizá a Vercel (podés dar acceso a **solo** el repositorio `obrapro` si te lo permite).  
4. En el panel de Vercel: **Add New…** → **Project**.  
5. En la lista, buscá y elegí el repositorio **obrapro** → **Import**.  
6. Pantalla de configuración:  
   - **Framework Preset:** elegí **Vite** (si no está, **Other** está bien).  
   - **Root Directory:** dejá `./` (por defecto).  
   - **Build Command:** debe decir `npm run build` (si está vacío, escribilo).  
   - **Output Directory:** escribí exactamente: `dist`  
   - **Install Command:** dejá `npm install` o vacío.  
7. **Environment Variables:** podés dejar vacío en el primer deploy.  
8. Clic en **Deploy**.  
9. Esperá 1–3 minutos. Cuando termine, Vercel muestra **Visit** o un enlace tipo `https://obrapro-xxx.vercel.app`.  
10. Abrí ese enlace en el celular y en la PC: **esa es tu web pública**.

---

## Paso 5 — (Recomendado) Variable para SEO y redes

1. En Vercel: tu proyecto → **Settings** → **Environment Variables**.  
2. **Add New:**  
   - **Name:** `VITE_SITE_URL`  
   - **Value:** la misma URL que te dio Vercel, por ejemplo `https://obrapro-xxx.vercel.app` **sin barra al final**.  
   - Environment: marcá **Production** (y **Preview** si querés).  
3. **Save**.  
4. Andá a **Deployments** → en el último deploy, menú **…** → **Redeploy** (confirmar).

---

## Paso 6 — (Cuando quieras cobrar) Enlace Mercado Pago

1. Creá cuenta o entrá a Mercado Pago y generá un **link o plan de suscripción** para PRO.  
2. Copiá la URL del checkout (empieza con `https://`).  
3. En Vercel → **Settings** → **Environment Variables** → agregá:  
   - **Name:** `VITE_PRO_CHECKOUT_URL`  
   - **Value:** pegá el link.  
4. **Redeploy** como en el Paso 5.

---

## Cuando cambies el código en tu PC

1. Guardá los archivos en el proyecto.  
2. En PowerShell, dentro de la carpeta `obrapro`:

```powershell
cd "c:\Users\alvar\OneDrive\Documentos\WEB JESUS\obrapro"
git add .
git commit -m "Descripcion de cambios"
git push
```

3. Vercel desplegará solo. Esperá un minuto y recargá la URL.

---

## Si algo falla

- **PowerShell “no reconoce git”:** instalá Git (Paso 1) o reiniciá la PC.  
- **El `cd` dice que no encuentra la ruta:** la carpeta no está ahí. Usá el Explorador, entrá a `obrapro`, escribí `powershell` en la barra de direcciones y Enter (sección “ANTES del Paso 3”).  
- **`git push` pide contraseña:** usá **token** de GitHub, no la contraseña de la cuenta.  
- **Vercel build falla:** en el deploy fallido, leé el log; muchas veces falta `npm install` local para probar: en la carpeta `obrapro` ejecutá `npm run build` y si falla ahí, el error te dice qué archivo revisar.  
- **Página en blanco:** revisá que **Output Directory** sea `dist` y **Build** sea `npm run build`.
