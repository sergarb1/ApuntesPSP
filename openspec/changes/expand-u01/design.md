# design — expand-u01

## Contexto

- Unidad fuente: `src/content/docs/01-procesos-y-subprocess.md` (~335 líneas) + 5 boletines planos.
- Precedente de formato: `src/content/docs/09-routing-dinamico.md` en ApuntesRedes.
- Estilo Head First; cierre en `09-head-first.md`. Emoji de unidad: 🚀. RA1.
- Slugs en minúscula (`boletin-u01-inicial`).

## Contenido a repartir

burbuja de memoria (PID, código, estado, contador), características de los procesos, estados
(NUEVO/LISTO/EJECUCIÓN/BLOQUEADO/TERMINADO), paralela vs distribuida + concurrencia,
multiprocessing, `subprocess.run` (parámetros, timeout, errores), `subprocess.Popen`
(wait/poll/terminate/kill/pid), comunicación stdin/stdout/communicate, tabla Windows/Linux,
Be the code (abrir Calc y Bloc), ring run vs Popen, preguntas tontas, Aprieta el lápiz, CEs RA1.

## Plan de puntos

| Punto | Slug | Contenido |
|-------|------|-----------|
| 01 | `01-que-es-un-proceso` | Definición, PID, burbuja de memoria, características, analogía (receta en la cocina). |
| 02 | `02-estados-de-un-proceso` | NUEVO/LISTO/EJECUCIÓN/BLOQUEADO/TERMINADO + diagrama (reutilizar SVG de `public/diagrams/`). |
| 03 | `03-paralela-vs-distribuida` | Paralela, distribuida, concurrencia, multiprocessing, CPU vs máquinas. |
| 04 | `04-subprocess-run` | Lanzar y esperar, parámetros (args, capture_output, text), timeout, retorno. |
| 05 | `05-subprocess-popen` | Lanzar y seguir, wait/poll/terminate/kill, pid. |
| 06 | `06-comunicacion-con-procesos` | stdin/stdout, communicate, data. |
| 07 | `07-compatibilidad-windows-linux` | Tabla Windows/Linux, rutas, comandos. |
| 08 | `08-procesos-en-la-practica` | Be the code (abrir Calc y Bloc), ring run vs Popen, Aprieta el lápiz. |
| 09 | `09-head-first` | ⭐🔥🕵️🤬⚡🧠🧩💬🤷🎬, fallo intencionado, PRÓXIMAMENTE EN U02, ✅ CEs RA1. |

## Boletines

- **`boletin-U01-inicial`** (8): conservar inicial-* (1-3) + 5 nuevos.
- **`boletin-U01-inicial-resuelto`** 1:1 (reaprovechar `inicial-resuelto-*`).
- **`boletin-U01-avanzado`** (≥8): conservar intermedio-* + extra-* renumerados; pistas solo aquí.
- **`boletin-U01-avanzado-resuelto`** 1:1 (reaprovechar `intermedio-resuelto-*` + resolver extra).

## Formato

- Índice `01-procesos-y-subprocess.md`: `title: "U01 — Procesos y Subprocess"`, `description` con 🚀, `nav_order: 01`; ruta del viaje; 🎯; 🗺️ 9 puntos; enlaces boletines (`.ejercicio-links`/`.elink`); ✅ CEs; 🚪.
- Puntos `01-procesos-y-subprocess/0X-….md`: breadcrumb + Anterior/Siguiente + Volver al índice.
- Boletines con slug minúscula, soluciones en `<details>`, `**Pista:**` solo en por resolver.

## Verificación

YAML bad=0 (node+js-yaml); navegación completa; `rtk npm run build` sin errores y subida de páginas; revisión visual; confirmación del usuario.