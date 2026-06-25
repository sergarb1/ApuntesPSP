param($Port = 4321, $OutDir = "public/pdf", $OutFile = "ApuntesPSP")

$ErrorActionPreference = "Stop"
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$root = Split-Path $scriptDir -Parent
$url = "http://localhost:$Port/ApuntesPSP"

Write-Host "🔨 Building site..." -ForegroundColor Cyan
Push-Location $root
try {
  npm run build
  if ($LASTEXITCODE -ne 0) { throw "Build failed" }

  Write-Host "🚀 Starting local server..." -ForegroundColor Cyan
  $server = Start-Job -ScriptBlock {
    param($p, $r)
    Push-Location $r
    npx astro preview --host 127.0.0.1 --port $p 2>&1 | Out-Null
    Pop-Location
  } -ArgumentList $Port, $root

  Start-Sleep 5

  Write-Host "📖 Generating PDF from $url ..." -ForegroundColor Cyan
  npx starlight-to-pdf $url -p $OutDir -f $OutFile `
    --footer "scripts/pdf-footer.html" `
    --header "scripts/pdf-header.html" `
    --preceding-html "scripts/pdf-cover.html" `
    --print-bg

  if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ PDF generated: $OutDir/$OutFile.pdf" -ForegroundColor Green
  } else {
    Write-Host "❌ PDF generation failed" -ForegroundColor Red
  }
} finally {
  Write-Host "🛑 Stopping server..." -ForegroundColor Cyan
  Stop-Job $server -ErrorAction SilentlyContinue
  Remove-Job $server -ErrorAction SilentlyContinue
  Pop-Location
}
