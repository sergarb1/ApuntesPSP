<div align="center">

# 📘 Apuntes PSP — Programación de Servicios y Procesos

**Autor:** Sergi Garcia Barea · **Licencia:** CC BY-SA 4.0  

[![GitHub Pages](https://img.shields.io/badge/🌐%20GitHub%20Pages-Online-success)](https://sergarb1.github.io/ApuntesPSP)
[![Licencia](https://img.shields.io/badge/License-CC%20BY--SA%204.0-lightgrey)](https://creativecommons.org/licenses/by-sa/4.0/)
[![Python](https://img.shields.io/badge/Python-3.10%2F3.11-blue)](https://python.org)
[![Astro](https://img.shields.io/badge/Astro-7.0-ff5a03)](https://astro.build)

---

Apuntes del módulo de **Programación de Servicios y Procesos** (Python),  
organizados en **11 unidades**. Cada unidad se lee como un **libro**: índice + 9 capítulos de teoría  
+ **4 boletines de ejercicios** (inicial y avanzado, con y sin solución).

</div>

---

## 🌐 Acceso web (GitHub Pages)

👉 **[https://sergarb1.github.io/ApuntesPSP](https://sergarb1.github.io/ApuntesPSP)** 👈

Tema **Astro + Starlight** con buscador Pagefind, modo oscuro, diseño premium azul Python (#306998) + teal (#4ecdc4), fuente Geist Sans. Descarga PDF/EPUB desde la propia web.

---

## 📚 Contenido del repositorio

```
PSP/
├── AGENTS.md / README.md                 ← Documentación del repo
├── package.json / astro.config.mjs       ← Config Astro + Starlight
├── .github/workflows/deploy.yml          ← GitHub Actions → gh-pages
│
├── src/content/docs/                     ← 155 archivos de apuntes (MD)
│   ├── index.md                          ← Landing page con cards y descargas
│   ├── 01-procesos-y-subprocess.md       ← Índice de la unidad (11 unidades)
│   ├── 01-procesos-y-subprocess/         ← 9 capítulos por unidad
│   │   ├── 01-*.md … 08-*.md             ← Teoría en progresión
│   │   └── 09-head-first.md              ← Cierre práctico (Head First)
│   ├── boletines/                        ← 44 boletines (4 × 11 unidades)
│   │   ├── boletin-U01-inicial.md        ← 🟢 Inicial SIN resolver
│   │   ├── boletin-U01-inicial-resuelto.md ← ✅ Inicial CON solución
│   │   ├── boletin-U01-avanzado.md       ← 💪 Avanzado SIN resolver
│   │   └── boletin-U01-avanzado-resuelto.md ← ⭐ Avanzado CON solución
│   └── … hasta unidad 11
│
├── src/styles/custom.css                 ← CSS premium (gradientes, cards, animaciones)
├── public/
│   ├── portada.png                       ← Portada para web, PDF y EPUB
│   ├── favicon.svg
│   ├── diagrams/                         ← SVG generados con D2
│   ├── pdf/                              ← PDFs generados (ApuntesPSP.pdf)
│   └── epub/                             ← EPUBs generados (ApuntesPSP.epub)
│
├── scripts/                              ← Generación PDF/EPUB
│   ├── pdf-cover.html                    ← Portada del PDF (portada.png)
│   ├── pdf-header.html                   ← Header vacío (sin hora)
│   ├── pdf-footer.html                   ← Pie con número de página
│   ├── generate-epub.ps1                 ← Genera EPUB con Pandoc
│   └── epub.css                          ← CSS para bloques de código en EPUB
│
├── diagrams/                             ← Fuentes D2
│   └── *.d2                              ← Diagramas en lenguaje D2
│
├── TEMA 00 PRESENTACION/                 ← PDFs introductorios del módulo
├── TEMA 00 PYTHON/                       ← Ejercicios básicos de Python
└── TEMA 01/  → TEMA 05/                 ← Ejercicios y código fuente (Python)
```

---

## 📖 Mapa Temas ↔ RAs

| TEMA | Contenido | RA |
|------|-----------|----|
| **01** — Procesos y Subprocess | Procesos, subprocess.run/Popen, paralela vs distribuida | **RA1** |
| **02** — Hilos Fundamentos | threading, join, daemon, Timer, GIL, estados del hilo | **RA2** |
| **03** — Sincronización entre Hilos | Lock, RLock, Semaphore, Barrier, Condition, condición de carrera | **RA2** |
| **04** — Sockets TCP | socket(), bind(), listen(), accept(), recv/send, SO_REUSEADDR | **RA3** |
| **05** — Sockets UDP y Protocolos | UDP, servidor/cliente UDP, HTTP desde cero, NTP, TCP vs UDP | **RA3** |
| **06** — APIs REST y HTTP | REST, GET/POST/PUT/DELETE, requests, JSON, códigos de estado | **RA4a-b** |
| **07** — APIs Comerciales | API Key, dotenv, OpenWeatherMap, OpenAI, rate limiting, backoff | **RA4a-b** |
| **08** — Hash y Cifrado Clásico | MD5, SHA, hash con sal, cifrado César, principios de seguridad | **RA5** |
| **09** — Cifrado Moderno | AES, RSA, cifrado híbrido, firmas digitales, RBAC | **RA5** |
| **10** — Servidores Concurrentes | ThreadPoolExecutor, benchmark secuencial vs hilos vs pool, servidor multihilo | **RA4c-d** |
| **11** — Asyncio y Disponibilidad | asyncio, corrutinas, heartbeat, backoff, timeouts, threads vs asyncio | **RA4e-g** |

---

## 🎯 Estilo de los apuntes

Cada unidad combina teoría y práctica con secciones dinámicas:

| Sección | Descripción |
|---------|-------------|
| **🎭 Be the code, my friend** | Traza paso a paso del código. "Sé el hilo, sé el socket, sé el cifrado…" |
| **🥊 El ring de los conceptos** | Diálogos comparativos → 🔥 Fireside Chat (TCP vs UDP, Lock vs Semáforo, Threads vs Asyncio) |
| **🧩 Pool Puzzle** | Ordenar líneas de código desordenadas |
| **⏱ Benchmark** | Comparativa de rendimiento (U10: secuencial vs hilos vs ThreadPool) |
| **❓ Preguntas tontas** | FAQ con respuestas directas y sin tecnicismos |
| **✏️ Aprieta el lápiz** | Ejercicios incrustados en la teoría |
| **🧠 Mini-chequeo** | Autoevaluación rápida con respuestas en `<details>` |
| **📋 Criterios de evaluación** | Checklist RA en cada unidad con referencias cruzadas |
| **🏁 Head First** | Cierre de unidad: Sé el Código, Fireside Chat, Laboratorio de Tortura, Crucigrama de Bits, Entrevista de trabajo |

Los conceptos clave se ilustran con **diagramas SVG** generados con [D2](https://d2lang.com/): estados de proceso/hilo, handshake TCP, TCP vs UDP, cifrado híbrido, etc.

---

## 🛠️ Stack tecnológico

| Categoría | Tecnologías |
|-----------|-------------|
| **Lenguaje** | Python 3.10 / 3.11 |
| **Stdlib** | `threading`, `socket`, `subprocess`, `hashlib`, `asyncio`, `time`, `random`, `json`, `struct`, `pathlib` |
| **Externas** | `pycryptodome` (AES, RSA, PKCS1_OAEP), `openai` (GPT), `requests` / `httpx` (HTTP), `python-dotenv` (.env) |
| **Web** | Astro 7 + Starlight 0.41, Node.js 24, Geist Sans (Vercel), Pagefind (buscador) |
| **Diagramas** | D2 v0.7.1 → SVG vectoriales |
| **Generación PDF** | `starlight-to-pdf` (Puppeteer, portada PNG) |
| **Generación EPUB** | Pandoc + pygments (sintaxis coloreada) |

---

## 📦 Progresión de ejercicios por unidad

Cada unidad tiene **4 boletines** (44 boletines en total) en `src/content/docs/boletines/`:

```
Boletín 🟢  →  boletin-UXX-inicial.md               (inicial SIN resolver)
Boletín ✅  →  boletin-UXX-inicial-resuelto.md       (inicial CON solución)
Boletín 💪  →  boletin-UXX-avanzado.md               (avanzado SIN resolver, con pistas)
Boletín ⭐  →  boletin-UXX-avanzado-resuelto.md      (avanzado CON solución)
```

**Total: ~180 ejercicios** repartidos en 44 boletines (≈8 iniciales + ≥8 avanzados por unidad), más los incrustados en la teoría (✏️ Aprieta el lápiz, 🧠 Mini-chequeo, ⚡ Laboratorio de Tortura).

---

## 🚀 GitHub Pages

Cada push a `master` ejecuta el workflow `.github/workflows/deploy.yml` que:
1. Construye el sitio con `npm run build` (Astro → estático)
2. Publica con `actions/deploy-pages@v5`

La web está en: **https://sergarb1.github.io/ApuntesPSP**

> ⚠️ Asegúrate de que en `Settings` → `Pages` la fuente sea **GitHub Actions**.

---

## 📥 Descargas offline

```bash
npm run dev              # Servidor local (http://localhost:4321/ApuntesPSP)
npm run build            # Build estático en dist/
npm run preview          # Previsualizar build
npm run pdf:local:es     # Genera PDF en public/pdf/ApuntesPSP.pdf
npm run epub             # Genera EPUB en public/epub/ApuntesPSP.epub
```

---

## ▶️ Ejecutar ejercicios localmente

```bash
# TEMA 01 - Procesos
python "TEMA 01/EJEMPLOS/hilos.py"
python "TEMA 01/EJEMPLOS/hilos_join.py"
python "TEMA 01/EJEMPLOS/abrir_calc_y_note.py"

# TEMA 02 - Hilos
python "TEMA 01/EJEMPLOS/lock_*.py"
python "TEMA 01/EJEMPLOS/semaforos.py"
python "TEMA 01/EJEMPLOS/barreras.py"

# Servidores TCP/UDP (necesitas 2 terminales)
python "TEMA 02/EJEMPLOS/servidor_tcp.py"    # Terminal 1
python "TEMA 02/EJEMPLOS/cliente_tcp.py"     # Terminal 2
```

---

## 📝 Licencia

**CC BY-SA 4.0 — Sergi Garcia Barea**

Esta obra está bajo una [Licencia Creative Commons Atribución-CompartirIgual 4.0 Internacional](https://creativecommons.org/licenses/by-sa/4.0/).

Puedes:
- ✅ **Compartir** — copiar y redistribuir el material en cualquier medio o formato
- ✅ **Adaptar** — remezclar, transformar y crear a partir del material

Bajo las siguientes condiciones:
- **Atribución** — Debes reconocer la autoría (Sergi Garcia Barea)
- **Compartir Igual** — Si transformas este material, debes distribuirlo bajo la misma licencia

---

<div align="center">
  
**Programación de Servicios y Procesos** · Curso 2025/2026

</div>
