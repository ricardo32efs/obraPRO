@echo off
chcp 65001 >nul
title Obra Pro - Exportar codigo a ZIP
cd /d "%~dp0"

echo.
echo Creando archivo ZIP en el Escritorio (sin node_modules ni dist)...
echo.

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0export-codigo-zip.ps1"
if errorlevel 1 (
  echo Error al exportar.
  pause
  exit /b 1
)

pause



