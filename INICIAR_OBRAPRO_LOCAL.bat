@echo off
setlocal EnableDelayedExpansion
chcp 65001 >nul
title Obra Pro - Servidor local (desarrollo)
cd /d "%~dp0"

echo.
echo === Obra Pro (desarrollo) ===
echo Carpeta: %CD%
echo.

where node >nul 2>&1
if errorlevel 1 (
  echo [ERROR] No se encontró Node.js en el PATH.
  echo Instalá Node.js 20 LTS desde https://nodejs.org y volvé a ejecutar este archivo.
  echo.
  pause
  exit /b 1
)

where npm >nul 2>&1
if errorlevel 1 (
  echo [ERROR] No se encontró npm. Reinstalá Node.js desde https://nodejs.org
  echo.
  pause
  exit /b 1
)

echo Abrí en el navegador: http://127.0.0.1:5173  (o http://localhost:5173^)
echo IMPORTANTE: no cierres esta ventana negra mientras uses la web.
echo No abras index.html con doble clic: la app necesita este servidor.
echo.

if not exist node_modules (
  echo Instalando dependencias ^(solo la primera vez^)...
  call npm install
  if errorlevel 1 (
    echo.
    echo [ERROR] npm install falló. Revisá tu conexión y permisos en esta carpeta.
    pause
    exit /b 1
  )
  echo.
)

call npm run start:local
set EXITCODE=!ERRORLEVEL!
echo.
if not "!EXITCODE!"=="0" (
  echo [ERROR] El servidor terminó con código !EXITCODE!.
  echo Si el puerto 5173 está ocupado, cerrá otras ventanas de Obra Pro o reiniciá la PC.
)
pause
exit /b !EXITCODE!

