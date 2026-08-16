# design — expand-u11

## Contexto

- Unidad fuente: `src/content/docs/11-asyncio-y-disponibilidad.md` (~330 líneas) + 5 boletines planos.
- Precedente de formato: ApuntesRedes `09-routing-dinamico/`. Estilo conversacional. Emoji: ⏱️. RA4e-g.
- **Última unidad**: el cierre es el final del curso (🏁), sin hook a una siguiente unidad.
- Slugs en minúscula (`boletin-u11-inicial`).

## Contenido a repartir

event loop, corrutinas (async/await), create_task y gather, timeouts (wait_for), heartbeat
(monitor de disponibilidad), backoff (reintentos con espera), threads vs asyncio, disponibilidad
de servicios y práctica, ring hilos vs asyncio, preguntas tontas, Aprieta el lápiz, CEs RA4e-g.

## Plan de puntos

| Punto | Slug | Contenido |
|-------|------|-----------|
| 01 | `01-event-loop` | Qué es el event loop, asyncio.run, analogía (recepcionista). |
| 02 | `02-corrutinas` | async/await, definir y lanzar corrutinas. |
| 03 | `03-create-task-y-gather` | create_task, gather, concurrencia real de I/O. |
| 04 | `04-timeouts` | asyncio.wait_for, control del tiempo de espera. |
| 05 | `05-heartbeat` | Heartbeat, monitor de disponibilidad. |
| 06 | `06-backoff` | Reintentos con backoff (espera creciente), por qué. |
| 07 | `07-threads-vs-asyncio` | Tabla comparativa, cuándo usar cada uno. |
| 08 | `08-disponibilidad-y-practica` | Disponibilidad de servicios, práctica completa, Be the code, Aprieta el lápiz. |
| 09 | `09-cierre` | ⭐🔥🕵️🤬⚡🧠🧩💬🤷🎬, fallo intencionado, **🎬 Post-Créditos 🏁 Fin del viaje** (recorrido U01→U11) y ✅ CEs RA4e-g. |

## Boletines

- **`boletin-U11-inicial`** (8): inicial-* + nuevos.
- **`boletin-U11-inicial-resuelto`** 1:1.
- **`boletin-U11-avanzado`** (≥8): intermedio-* + extra-* renumerados; pistas solo aquí.
- **`boletin-U11-avanzado-resuelto`** 1:1.

## Formato y verificación

Ídem expand-u01: índice U11/⏱️, 9 puntos con breadcrumb y navegación, boletines con slug
minúscula y soluciones en `<details>`. El índice puede incluir un apartado de cierre del curso.
Verificación: YAML bad=0, navegación, `rtk npm run build`, visual, confirmación del usuario.