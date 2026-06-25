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
│   ├── content/docs/                    ← 67 archivos de apuntes (MD)
│   │   ├── index.md                     ← landing page (cards, descargas, licencia)
│   │   ├── 01-procesos-y-subprocess.md  ← teoría (11 temas)
│   │   ├── inicial-resuelto-01-*.md    ← ✅ inicial CON solución (3 ejercicios)
│   │   ├── inicial-01-*.md             ← 🟢 inicial SIN resolver (3 ejercicios distintos)
│   │   ├── intermedio-resuelto-01-*.md ← 💪 intermedio CON solución (3 ejercicios)
│   │   ├── intermedio-01-*.md          ← 📝 intermedio SIN resolver (3 ejercicios distintos)
│   │   ├── extra-01-*.md               ← ⭐ avanzado SIN resolver (con pistas)
│   │   └── ... hasta unidad 11
│   └── styles/
│       └── custom.css                   ← CSS premium (azul Python #306998 + teal)
│
├── public/
│   ├── portada.svg                      ← portada para web, PDF y EPUB
│   ├── favicon.svg
│   ├── diagrams/                        ← SVG generados automáticamente
│   ├── pdf/                             ← PDFs generados (ApuntesPSP.pdf)
│   └── epub/                            ← EPUBs generados (ApuntesPSP.epub)
│
├── scripts/
│   ├── pdf-cover.html                   ← portada del PDF (SVG directo)
│   ├── pdf-header.html                  ← header vacío (elimina hora impresión)
│   ├── pdf-footer.html                  ← pie con número de página + línea decorativa
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
- **PDF:** `starlight-to-pdf` (generar PDF completo del sitio con portada)
- **EPUB:** Pandoc (generar EPUB con sintaxis coloreada y portada SVG)
- **Fuente:** Geist Sans (Vercel)
- **Despliegue:** GitHub Actions → GitHub Pages (master branch)
- **URL:** `https://sergarb1.github.io/ApuntesPSP`
- **Portada:** `public/portada.svg` (gradiente azul, usada en web, PDF y EPUB)

## Apuntes (MD por TEMA)

~3.500 líneas en 11 archivos de teoría + 55 archivos de ejercicios (5 por tema) + 6 diagramas D2 = 72 archivos. Cada tema indica al final qué RAs cubre.

Secciones:
- 🎭 **Be the code, my friend** / **Sé el código** (trazas paso a paso)
- 🥊 **El ring de los conceptos** (diálogos comparativos)
- ❓ **Preguntas tontas** (FAQ)
- ✏️ **Aprieta el lápiz** (ejercicios)
- 🧩 **Pool Puzzle** (reordenar código) — T03, T04, T06, T08, T10
- ⏱ **Benchmark** — comparativa rendimiento (T10)
- 📋 **Criterios de evaluación** al final de cada TEMA
- Diagramas SVG en `public/diagrams/` generados con D2

| Archivo | Líneas | Temas clave | RAs |
|---------|--------|-------------|-----|
| `src/content/docs/01-procesos-y-subprocess.md` | ~335 | Procesos, subprocess, paralela vs distribuida | RA1 |
| `src/content/docs/02-hilos-fundamentos.md` | ~420 | Hilos, join, daemon, Timer, GIL, estados | RA2 |
| `src/content/docs/03-sincronizacion-entre-hilos.md` | ~385 | Lock, Semaphore, Barrier, Condition, RLock | RA2 |
| `src/content/docs/04-sockets-tcp.md` | ~360 | TCP, cliente-servidor, errores, SO_REUSEADDR | RA3 |
| `src/content/docs/05-sockets-udp-y-protocolos.md` | ~250 | UDP, HTTP, NTP, TCP vs UDP | RA3 |
| `src/content/docs/06-apis-rest-y-http.md` | ~370 | REST, métodos HTTP, requests, JSON | RA4a-b |
| `src/content/docs/07-apis-comerciales.md` | ~320 | OpenWeatherMap, OpenAI, dotenv, rate limit | RA4a-b |
| `src/content/docs/08-hash-y-cifrado-clasico.md` | ~380 | Hash, MD5, SHA, César, principios seguridad | RA5 |
| `src/content/docs/09-cifrado-moderno.md` | ~380 | AES, RSA, híbrido, firmas, RBAC | RA5 |
| `src/content/docs/10-servidores-concurrentes.md` | ~360 | ThreadPool, benchmark, servidor multihilo | RA4c-d |
| `src/content/docs/11-asyncio-y-disponibilidad.md` | ~330 | asyncio, heartbeat, backoff, timeouts | RA4e-g |

**Licencia:** CC BY-SA 4.0 — Sergi Garcia Barea
