param($OutDir = "public/epub")

$ErrorActionPreference = "Stop"

$units = @(
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

$evalFiles = @(
  "inicial-resuelto-{0}",
  "inicial-{0}",
  "intermedio-resuelto-{0}",
  "intermedio-{0}",
  "extra-{0}"
)

$metaTitle = "Apuntes PSP - Programacion de Servicios y Procesos"
$metaLang = "es"
$outFile = "ApuntesPSP.epub"

$srcDir = "src/content/docs"
$outPath = "$OutDir/$outFile"
$coverPath = Join-Path (Get-Location) "public/portada.png"
if (-not (Test-Path $coverPath)) {
  $coverPath = Join-Path (Get-Location) "public/portada.svg"
}

New-Item -ItemType Directory -Path $OutDir -Force | Out-Null

$sb = [System.Text.StringBuilder]::new()
$null = $sb.AppendLine("---")
$null = $sb.AppendLine("title: '$metaTitle'")
$null = $sb.AppendLine("author: 'Sergi Garcia Barea'")
$null = $sb.AppendLine("language: $metaLang")
$null = $sb.AppendLine("---")
$null = $sb.AppendLine("")

foreach ($u in $units) {
  # --- Unit content ---
  $file = "$srcDir/$u.md"
  if (Test-Path $file) {
    $content = Get-Content $file -Raw -Encoding UTF8

    $title = ""
    if ($content -match '(?ms)^---\s*\n(.+?)\n^---') {
      $frontmatter = $matches[1]
      if ($frontmatter -match '^title:\s*"(.+?)"') {
        $title = $matches[1]
      }
    }
    if (-not $title) {
      $title = ($u -replace '^\d+-', '' -replace '-', ' ')
    }

    $content = $content -replace '(?ms)^---.*?^---\s*', ''
    $content = $content.Trim()
    $content = $content -replace '/ApuntesPSP/cc-by-sa\.png', 'public/cc-by-sa.png'
    $content = $content -replace '/diagrams/', 'public/diagrams/'

    $null = $sb.AppendLine("# $title")
    $null = $sb.AppendLine("")
    if ($content) {
      $null = $sb.AppendLine($content)
      $null = $sb.AppendLine("")
    }
  }

  # --- Ejercicios ---
  foreach ($ef in $evalFiles) {
    $efName = $ef -f $u
    $efFile = "$srcDir/$efName.md"
    if (Test-Path $efFile) {
      $eContent = Get-Content $efFile -Raw -Encoding UTF8

      $eTitle = ""
      if ($eContent -match '(?ms)^---\s*\n(.+?)\n^---') {
        $efront = $matches[1]
        if ($efront -match '^title:\s*"(.+?)"') {
          $eTitle = $matches[1]
        }
      }

      $eContent = $eContent -replace '(?ms)^---.*?^---\s*', ''
      $eContent = $eContent.Trim()
      $eContent = $eContent -replace '/ApuntesPSP/cc-by-sa\.png', 'public/cc-by-sa.png'
      $eContent = $eContent -replace '/diagrams/', 'public/diagrams/'

      $eContent = $eContent -replace '(?m)^(#+)', '#$1'

      if ($eTitle) {
        $null = $sb.AppendLine("## $eTitle")
        $null = $sb.AppendLine("")
      }
      if ($eContent) {
        $null = $sb.AppendLine($eContent)
        $null = $sb.AppendLine("")
      }
    }
  }
}

$tempMd = [System.IO.Path]::GetTempFileName() + ".md"
[System.IO.File]::WriteAllText($tempMd, $sb.ToString(), [System.Text.Encoding]::UTF8)

$cssPath = Join-Path $PSScriptRoot "epub.css"
try {
  & pandoc $tempMd --from markdown --to epub3 --toc --toc-depth=3 --epub-cover-image="$coverPath" --syntax-highlighting pygments --css $cssPath -o $outPath
  if ($LASTEXITCODE -eq 0) { Write-Host "OK: $outPath" } else { Write-Host "FAIL" }
} finally {
  Remove-Item $tempMd -Force -ErrorAction SilentlyContinue
}
