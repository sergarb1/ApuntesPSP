# PSP - Programación de Servicios y Procesos

## Stack

- **Lenguaje:** Python 3.10/3.11
- **Stdlib:** `threading`, `socket`, `subprocess`, `hashlib`, `time`, `random`, `json`, `struct`, `pathlib`
- **Externas:** `pycryptodome`, `openai`, `requests`, `python-dotenv`, `httpx`, `transformers`, `asyncio`
- **Web:** Astro + Starlight, Node.js 24, Geist Sans, Pagefind

## Estructura

```
PSP/
├── AGENTS.md / README.md                ← documentación del repo
├── package.json / astro.config.mjs / tsconfig.json
├── .nojekyll
├── .github/workflows/deploy.yml         ← GitHub Actions → gh-pages
│
├── src/
│   ├── content.config.ts                ← configuración colección Starlight
│   ├── content/docs/                    ← 155 archivos de apuntes (MD)
│   │   ├── index.md                     ← landing page (cards, descargas, licencia)
│   │   ├── 01-procesos-y-subprocess.md  ← índice de la unidad (11 unidades)
│   │   ├── 01-procesos-y-subprocess/    ← 9 capítulos por unidad
│   │   │   ├── 01-*.md … 08-*.md        ← teoría en progresión
│   │   │   └── 09-cierre.md             ← cierre práctico de la unidad
│   │   ├── boletines/                   ← 44 boletines (4 × 11 unidades)
│   │   │   ├── boletin-U01-inicial.md       ← 🟢 inicial SIN resolver
│   │   │   ├── boletin-U01-inicial-resuelto.md ← ✅ inicial CON solución
│   │   │   ├── boletin-U01-avanzado.md       ← 💪 avanzado SIN resolver
│   │   │   └── boletin-U01-avanzado-resuelto.md ← ⭐ avanzado CON solución
│   │   └── ... hasta unidad 11
│   └── styles/
│       └── custom.css                   ← CSS premium (azul Python #306998 + teal)
│
├── public/
│   ├── portada.png                      ← portada para web, PDF y EPUB
│   ├── favicon.svg
│   ├── diagrams/                        ← SVG generados automáticamente
│   ├── pdf/                             ← PDFs generados (ApuntesPSP.pdf)
│   └── epub/                            ← EPUBs generados (ApuntesPSP.epub)
│
├── scripts/
│   ├── pdf-cover.html                   ← portada del PDF (portada.png)
│   ├── pdf-header.html                  ← header vacío (elimina hora impresión)
│   ├── pdf-footer.html                  ← pie con número de página + línea decorativa
│   ├── generate-pdf.ps1                 ← genera PDF con Puppeteer + servidor local
│   ├── generate-epub.ps1                ← genera EPUB con Pandoc
│   └── epub.css                         ← CSS para bloques de código en EPUB
│
├── diagrams/                            ← fuentes D2 para diagramas SVG
│   └── *.d2                             ← diagramas en lenguaje D2
│
├── TEMA 00 PRESENTACION/                ← PDFs introductorios
├── TEMA 00 PYTHON/                      ← ejercicios básicos Python
└── TEMA 01/  → TEMA 05/                ← ejercicios y código fuente (Python)
```

## Mapa RA → TEMAs

| RA | Qué cubre | TEMAs | Archivos clave |
|----|-----------|-------|----------------|
| RA1 | Procesos, paralela vs distribuida | T01 | `abrir_calc_y_note.py`, `hilos.py`, `hilos_join.py` |
| RA2 | Hilos, sincronización, locks, semáforos, barreras, daemon, timer | T01 | `lock_*.py`, `semaforos.py`, `barreras.py`, `productor_consumidor.py`, `hilos_daemon.py`, `timer.py` |
| RA3 | Sockets TCP/UDP, cliente-servidor | T02 | `TeoriaServidorWebTCP.py`, `Tema 4-*TCP-bye.py`, `ServidorHora.py`, `Tarea5*` |
| RA4 | APIs REST, servidores concurrentes, asyncio | T03 + T05 | `APIRest-Meteo*.py`, `API_OpenaAI*.py`, `servidor.py`, `lanzaclientes.py` |
| RA5 | Hash, cifrado (César, AES, RSA), firmas, sockets seguros | T04 | `md5.py`, `sha1.py`, `cesar*.py`, `AESejemplo.py`, `Generador_de_claves.py`, `FrimarRSA.py`, `VerificarRSA.py` |

## Convenciones de código

- `snake_case` para variables y funciones
- Comentarios y print() en español (con tildes)
- Punto de entrada: `if __name__ == "__main__":`
- Paths relativos: `Path(__file__).parent / "archivo"`
- Nombres de hilos con `.name = "hilo-"+str(n)`
- En sockets: envías con `.sendall()`, recibes con `.recv(1024)`

## 🗣️ Requisito lingüístico (es-ES)

Todo el contenido dirigido al usuario se escribe en **español de España (es-ES)**.

### Vocabulario

| Evitar | Preferir |
|--------|----------|
| prender / prendida | encender / encendida |
| empacar / desempacar | empaquetar / desempaquetar |
| cómputo | procesamiento |
| hacer click / click derecho | hacer clic / clic derecho |
| driver (en prosa) | controlador |
| armar (montar) | montar |
| correr un proceso/programa/servicio | ejecutar / arrancar |
| email (en prosa) | correo |
| manejar/manejo (= gestionar) | gestionar/gestión |
| monitorear / monitoreo | monitorizar / monitorización |
| computadora | ordenador |
| celular | móvil |
| laptop | portátil |
| mouse | ratón |

Excepciones: `aprender`/`comprender`/`sorprender`; `manejar` como destreza; `correr` literal (personas, la metáfora de los relevos del Semaphore); `driver`/`email` dentro de código, APIs o identificadores.

### Mayúsculas

Estilo oracional español: solo la primera palabra y los nombres propios. Nombres de sección ya normalizados: Laboratorio de tortura, Atrévete a pensar, Crucigrama de bits, ¿Quién soy?, Sé el código/proceso/hilo…, Poscréditos. Se conservan tal cual las siglas (TCP, VLAN, GIL), marcas y los nombres ingleses deliberados (`Fireside Chat`, `Pool Puzzle`, `Be the code`) y los segmentos de marca `CONRAD VS EL MUNDO` y `PRÓXIMAMENTE EN UXX`.

### Terminología

Se mantienen en inglés los términos técnicos asentados (socket, timeout, software, hardware, backup, router…) y todo lo que tenga función sintáctica: comandos, flags, parámetros, APIs, variables, nombres de fichero, IPs, versiones.

### Números

Formato español: punto para miles (65.536), coma para decimales (2,4 GHz), espacio antes del símbolo (0,50 €). Nunca dentro de IPs, comandos, versiones ni sintaxis de protocolos.

### Estilo

Claro, natural, didáctico y directo, apto para FP. Trato de `tú`/`vosotros`. Sin latinamericanismos evitables, sin calcos innecesarios del inglés, sin tono burocrático.

### Comprobación obligatoria (nota 1)

Antes de dar por terminado cualquier contenido nuevo o modificado:
1. revisar vocabulario es-ES;
2. revisar mayúsculas;
3. revisar números;
4. comprobar que no se ha alterado código ni terminología técnica;
5. lectura final: debe sonar natural a un profesor de España.

## Testing

No hay framework de testing. Se ejecuta manualmente:
- `python archivo.py` para probar
- Servidores se matan con Ctrl+C
- Cliente y servidor en terminales separadas para pruebas de red

## Comandos rápidos

```bash
npm run dev              # Servidor local (http://localhost:4321/ApuntesPSP)
npm run build            # Build estático en dist/
npm run preview          # Previsualizar build
npm run pdf:local:es     # Generar PDF desde localhost
npm run epub             # Generar EPUB con Pandoc
python "TEMA 01/EJEMPLOS/hilos.py"
```

## Diagramas D2

Los diagramas se crean en lenguaje [D2](https://d2lang.com/) (v0.7.1):

```bash
cd diagrams/
d2 archivo.d2 ../public/diagrams/archivo.svg --pad 20
```

- Fuentes: `diagrams/*.d2`
- SVG generados: `public/diagrams/*.svg`
- Se referencian en MD como `![](/diagrams/archivo.svg)`
- Instalado via winget: `winget install Terrastruct.D2`

## Sitio web (Astro + Starlight)

- **Framework:** [Astro](https://astro.build/) + [Starlight](https://starlight.astro.build/) v0.41
- **Tema:** Azul Python (#306998) + teal (#4ecdc4) + Geist Sans
- **Buscador:** Pagefind integrado (Starlight)
- **PDF:** `starlight-to-pdf` (Puppeteer, portada PNG desde servidor local)
- **EPUB:** Pandoc (sintaxis coloreada con Pygments, portada PNG)
- **Fuente:** Geist Sans (Vercel)
- **Despliegue:** GitHub Actions → GitHub Pages (master branch)
- **URL:** `https://sergarb1.github.io/ApuntesPSP`
- **Portada:** `public/portada.png` (gradiente azul, generado desde SVG vía Puppeteer, usada en web, PDF y EPUB)
- **PDF/EPUB:** generados localmente (`npm run pdf`, `npm run epub`) y commiteados al repo; Astro los copia a `dist/` durante el build para que estén disponibles en GitHub Pages
- **.gitignore:** `public/*.png` excluye PNGs genéricos pero `!public/portada.png` lo re-incluye

## Apuntes (MD por unidad)

Estructura "libro" por unidad (formato replicado de ApuntesRedes): índice + 9 capítulos en subcarpeta + 4 boletines en `boletines/`. Total 155 ficheros MD (~10.000+ líneas). Cada unidad indica al final qué RAs cubre.

Por unidad: `0X-unidad.md` (índice, ~90 líneas) → `0X-unidad/01-…-08.md` (capítulos, 110-280 líneas) + `09-cierre.md` (cierre, ~250 líneas) → `boletines/boletin-UXX-inicial[-resuelto].md` y `-avanzado[-resuelto].md`.

Secciones por capítulo:
- 📬 **La idea en una frase** + 🧠 **Mini-chequeo** (respuestas en `<details>`)
- ✅ **Resumen en 3 frases** + 🐛 **Vocabulario rápido**
- Breadcrumb `🗺️ Estás en` + pie con navegación Anterior/Siguiente entre capítulos
- ✍️ **Revisión es-ES (nota 1)**: vocabulario peninsular, mayúsculas oracionales y formato numérico español antes de dar el capítulo por cerrado

Secciones del índice:
- 🗺️ **Ruta del viaje** (🚀 Proceso → 🔀 Hilo → 🔒 Sincronización → 🔌 TCP → 📡 UDP → 🌐 API REST → 🧪 APIs comerciales → 🔐 Hash → 🧬 Cifrado → 🏗️ Servidores → ⏱️ asyncio)
- 🎯 **Objetivo de la unidad** + 🗺️ **Mapa de la unidad** (9 enlaces)
- 📝 **Boletines** con `.ejercicio-links` + `a.elink` a los 4 boletines
- ✅ **Criterios de evaluación** con columna "Dónde se cubre"
- 🚪 **¿Por dónde empiezo?** con primer punto y enlace a la siguiente unidad

Secciones del cierre `09-cierre.md`: ⭐ Sé el código, 🔥 Fireside Chat, 🕵️ ¿Quién soy?, 🤬 CONRAD VS EL MUNDO, ⚡ Laboratorio de tortura (con pistas), 🏆 Logros, 🧠 Atrévete a pensar, 🧩 Crucigrama de bits, 💬 Entrevista de trabajo, 🤷 No hay preguntas tontas, 🎬 Poscréditos ("PRÓXIMAMENTE EN UYY", salvo U11 que cierra el viaje 🏁), ✅ Criterios.

**Convenciones MD:** frontmatter `title`/`description` (comillas solo si contienen `:`), sin BOM, slugs de URL en minúscula (`boletin-uXX-...`), nombres de fichero `UXX` mayúscula, enlaces internos `/ApuntesPSP/...`.

**Nota 1:** la comprobación lingüística obligatoria está definida en la sección 🗣️ Requisito lingüístico (es-ES) de este documento; aplícala a cualquier contenido nuevo o modificado.

| Unidad | Índice + 9 capítulos | Líneas aprox | Temas clave | RAs |
|--------|----------------------|--------------|-------------|-----|
| U01 Procesos y Subprocess | `01-procesos-y-subprocess.md` + carpeta | ~335 | Procesos, subprocess, paralela vs distribuida | RA1 |
| U02 Hilos Fundamentos | `02-hilos-fundamentos.md` + carpeta | ~420 | Hilos, join, daemon, Timer, GIL, estados | RA2 |
| U03 Sincronización entre Hilos | `03-sincronizacion-entre-hilos.md` + carpeta | ~385 | Lock, Semaphore, Barrier, Condition, RLock | RA2 |
| U04 Sockets TCP | `04-sockets-tcp.md` + carpeta | ~360 | TCP, cliente-servidor, errores, SO_REUSEADDR | RA3 |
| U05 Sockets UDP y Protocolos | `05-sockets-udp-y-protocolos.md` + carpeta | ~250 | UDP, HTTP, NTP, TCP vs UDP | RA3 |
| U06 APIs REST y HTTP | `06-apis-rest-y-http.md` + carpeta | ~370 | REST, métodos HTTP, requests, JSON | RA4a-b |
| U07 APIs Comerciales | `07-apis-comerciales.md` + carpeta | ~320 | OpenWeatherMap, OpenAI, dotenv, rate limit | RA4a-b |
| U08 Hash y Cifrado Clásico | `08-hash-y-cifrado-clasico.md` + carpeta | ~380 | Hash, MD5, SHA, César, principios seguridad | RA5 |
| U09 Cifrado Moderno | `09-cifrado-moderno.md` + carpeta | ~380 | AES, RSA, híbrido, firmas, RBAC | RA5 |
| U10 Servidores Concurrentes | `10-servidores-concurrentes.md` + carpeta | ~360 | ThreadPool, benchmark, servidor multihilo | RA4c-d |
| U11 asyncio y Disponibilidad | `11-asyncio-y-disponibilidad.md` + carpeta | ~330 | asyncio, heartbeat, backoff, timeouts | RA4e-g |

**Boletines (44):** 4 por unidad en `boletines/boletin-UXX-*`: inicial (8 ejercicios), inicial-resuelto, avanzado (≥8), avanzado-resuelto. Pistas inline `**Pista:**` en los por-resolver; respuestas inline en negrita en los resueltos.

**Licencia:** CC BY-SA 4.0 — Sergi Garcia Barea


<!-- headroom:rtk-instructions -->
# RTK (Rust Token Killer) - Token-Optimized Commands

When running shell commands, **always prefix with `rtk`**. This reduces context
usage by 60-90% with zero behavior change. If rtk has no filter for a command,
it passes through unchanged — so it is always safe to use.

## Key Commands
```bash
# Git (59-80% savings)
rtk git status          rtk git diff            rtk git log

# Files & Search (60-75% savings)
rtk ls <path>           rtk read <file>         rtk grep <pattern>
rtk find <pattern>      rtk diff <file>

# Test (90-99% savings) — shows failures only
rtk pytest tests/       rtk cargo test          rtk test <cmd>

# Build & Lint (80-90% savings) — shows errors only
rtk tsc                 rtk lint                rtk cargo build
rtk prettier --check    rtk mypy                rtk ruff check

# Analysis (70-90% savings)
rtk err <cmd>           rtk log <file>          rtk json <file>
rtk summary <cmd>       rtk deps                rtk env

# GitHub (26-87% savings)
rtk gh pr view <n>      rtk gh run list         rtk gh issue list

# Infrastructure (85% savings)
rtk docker ps           rtk kubectl get         rtk docker logs <c>

# Package managers (70-90% savings)
rtk pip list            rtk pnpm install        rtk npm run <script>
```

## Rules
- In command chains, prefix each segment: `rtk git add . && rtk git commit -m "msg"`
- For debugging, use raw command without rtk prefix
- `rtk proxy <cmd>` runs command without filtering but tracks usage
<!-- /headroom:rtk-instructions -->
