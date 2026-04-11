# Genera un ZIP con el codigo fuente de Obra Pro (excluye node_modules, dist, .git)
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$stamp = Get-Date -Format "yyyyMMdd-HHmm"
$zipName = "ObraPro-codigo-fuente-$stamp.zip"
$desktop = [Environment]::GetFolderPath("Desktop")
$destZip = Join-Path $desktop $zipName
$tempRoot = Join-Path $env:TEMP "obrapro-export-$stamp"

if (Test-Path $tempRoot) { Remove-Item $tempRoot -Recurse -Force }
New-Item -ItemType Directory -Path $tempRoot | Out-Null

$exclude = @("node_modules", "dist", ".git")
Get-ChildItem -LiteralPath $root -Force | ForEach-Object {
  if ($exclude -contains $_.Name) { return }
  $target = Join-Path $tempRoot $_.Name
  Copy-Item -LiteralPath $_.FullName -Destination $target -Recurse -Force
}

if (Test-Path $destZip) { Remove-Item $destZip -Force }
Compress-Archive -Path (Join-Path $tempRoot "*") -DestinationPath $destZip -CompressionLevel Optimal
Remove-Item $tempRoot -Recurse -Force

Write-Host ""
Write-Host "Listo: $destZip"
Write-Host "Incluye el proyecto sin node_modules ni dist (se regeneran con npm install / npm run build)."
Write-Host ""

