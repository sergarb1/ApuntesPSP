param($OutDir = "public/epub")

$ErrorActionPreference = "Stop"

$unitSlugs = @(
  "01-procesos-y-subprocess",
  "02-hilos-fundamentos",
  "03-sincronizacion-entre-hilos",
  "04-sockets-tcp",
  "05-sockets-udp-y-protocolos",
  "06-apis-rest-y-http",
  "07-apis-comerciales",
  "08-hash-y-cifrado-clasico",
  "09-cifrado-moderno",
  "10-servidores-concurrentes",
  "11-asyncio-y-disponibilidad"
)

$boletinesCodes = @(
  "01", "02", "03", "04", "05", "06",
  "07", "08", "09", "10", "11"
)

$boletinSections = @(
  "inicial-resuelto",
  "inicial",
  "avanzado-resuelto",
  "avanzado"
)

$metaTitle = "Apuntes PSP - Programacion de Servicios y Procesos"
$metaLang = "es"
$outFile = "ApuntesPSP.epub"

$srcDir = "src/content/docs"
$outPath = "$OutDir/$outFile"
$coverPath = Join-Path (Get-Location) "public/portada.png"

New-Item -ItemType Directory -Path $OutDir -Force | Out-Null

$sb = [System.Text.StringBuilder]::new()
$null = $sb.AppendLine("---")
$null = $sb.AppendLine("title: '$metaTitle'")
$null = $sb.AppendLine("author: 'Sergi Garcia Barea'")
$null = $sb.AppendLine("language: $metaLang")
$null = $sb.AppendLine("---")
$null = $sb.AppendLine("")

function Get-FrontTitle {
  param($Content, $Fallback)
  if ($Content -match '(?ms)^---\s*\n(.+?)\n^---') {
    $fm = $matches[1]
    if ($fm -match '(?m)^title:\s*"?([^"\r\n]+)"?') {
      return $matches[1].Trim()
    }
  }
  return $Fallback
}

function Add-MdFile {
  param($Path, [int]$HeadingLevel)

  $content = Get-Content $Path -Raw -Encoding UTF8
  $title = Get-FrontTitle -Content $content -Fallback ([System.IO.Path]::GetFileNameWithoutExtension($Path))

  $content = $content -replace '(?ms)^---.*?^---\s*', ''
  $content = $content.Trim()
  $content = $content -replace '/ApuntesPSP/cc-by-sa\.png', 'public/cc-by-sa.png'
  $content = $content -replace '/ApuntesPSP/diagrams/', 'public/diagrams/'
  $content = $content -replace '/diagrams/', 'public/diagrams/'

  $level = '#' * $HeadingLevel
  $null = $sb.AppendLine("$level $title")
  $null = $sb.AppendLine("")
  if ($content) {
    $null = $sb.AppendLine($content)
    $null = $sb.AppendLine("")
  }
}

foreach ($u in $unitSlugs) {
  # --- Unit index (root file, e.g. 01-procesos-y-subprocess.md) ---
  $indexFile = "$srcDir/$u.md"
  if (-not (Test-Path $indexFile)) { $indexFile = "$srcDir/$u.mdx" }
  if (Test-Path $indexFile) {
    Add-MdFile -Path $indexFile -HeadingLevel 1
  }

  # --- Unit puntos (subcarpeta, e.g. 01-procesos-y-subprocess/01-*.md) ---
  $unitDir = "$srcDir/$u"
  if (Test-Path $unitDir) {
    $puntos = Get-ChildItem -Path $unitDir -Filter "*.md" -File | Sort-Object Name
    foreach ($p in $puntos) {
      Add-MdFile -Path $p.FullName -HeadingLevel 1
    }
  }

  # --- Boletines de la unidad ---
  $code = ($u -split '-')[0]
  if ($boletinesCodes -contains $code) {
    foreach ($sec in $boletinSections) {
      $bfName = "boletin-U$code-$sec"
      $bfFile = "$srcDir/boletines/$bfName.md"
      if (-not (Test-Path $bfFile)) { $bfFile = "$srcDir/boletines/$bfName.mdx" }
      if (Test-Path $bfFile) {
        $eContent = Get-Content $bfFile -Raw -Encoding UTF8
        $eTitle = Get-FrontTitle -Content $eContent -Fallback $bfName

        $eContent = $eContent -replace '(?ms)^---.*?^---\s*', ''
        $eContent = $eContent.Trim()
        $eContent = $eContent -replace '/ApuntesPSP/cc-by-sa\.png', 'public/cc-by-sa.png'
        $eContent = $eContent -replace '/ApuntesPSP/diagrams/', 'public/diagrams/'
        $eContent = $eContent -replace '(?m)^(#+)', '##$1'

        $null = $sb.AppendLine("## $eTitle")
        $null = $sb.AppendLine("")
        if ($eContent) {
          $null = $sb.AppendLine($eContent)
          $null = $sb.AppendLine("")
        }
      }
    }
  }
}

$tempMd = [System.IO.Path]::GetTempFileName() + ".md"
[System.IO.File]::WriteAllText($tempMd, $sb.ToString(), [System.Text.Encoding]::UTF8)

$cssPath = Join-Path $PSScriptRoot "epub.css"
$pandoc = Get-ChildItem -Recurse -Filter "pandoc.exe" -Path "$env:LOCALAPPDATA\Microsoft\WinGet\Packages" -ErrorAction SilentlyContinue | Select-Object -First 1 -ExpandProperty FullName
if (-not $pandoc) { $pandoc = "pandoc" }
try {
  & $pandoc $tempMd --from markdown --to epub3 --toc --toc-depth=3 --epub-cover-image="$coverPath" --syntax-highlighting pygments --css $cssPath -o $outPath
  if ($LASTEXITCODE -eq 0) { Write-Host "OK: $outPath" } else { Write-Host "FAIL" }
} finally {
  Remove-Item $tempMd -Force -ErrorAction SilentlyContinue
}