# Estrategia recomendada para Obra Pro (decisión de producto)

## Despliegue y actualizaciones

**Recomendación:** subir el código a **GitHub** y conectar **Vercel** o **Netlify** al repositorio.

**Por qué es la mejor opción para este proyecto:**

1. **Un solo lugar** con todo el historial: si cambiás algo mal, podés volver atrás.
2. **Deploy automático:** cada vez que subís cambios (`git push`), el sitio se vuelve a generar solo. No tenés que acordarte de subir la carpeta `dist` a mano.
3. **Profesional y escalable:** es el estándar para un producto que querés monetizar; más adelante podés sumar dominio propio, variables de entorno y revisión de código sin drama.
4. **Respaldo:** si se rompe la PC, el proyecto sigue en GitHub.

**Alternativa válida solo para una primera prueba rápida:** generar `dist` con `npm run build` y arrastrar esa carpeta a [Netlify Drop](https://app.netlify.com/drop). Sirve para decir “ya está online”, pero cada cambio obliga a repetir el proceso manualmente. Para un negocio en marcha, conviene pasar a Git + hosting conectado.

**Resumen:** empezá por Netlify Drop si necesitás ver la URL hoy mismo; en cuanto puedas, **GitHub + Vercel/Netlify** es la decisión más sólida para Obra Pro.

## Código en un solo archivo

El script `EXPORTAR_CODIGO_ZIP.bat` genera **un archivo `.zip`** en el Escritorio con todo el código fuente (sin `node_modules` ni `dist`, que se regeneran con `npm install` y `npm run build`). Ese zip es la forma práctica de “todo en un archivo” para backup o enviar a otra PC.
