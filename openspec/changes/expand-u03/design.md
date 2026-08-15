# design — expand-u03

## Contexto

- Unidad fuente: `src/content/docs/03-sincronizacion-entre-hilos.md` (~385 líneas) + 5 boletines planos.
- Precedente de formato: ApuntesRedes `09-routing-dinamico/`. Estilo Head First. Emoji: 🔒. RA2.
- Slugs en minúscula (`boletin-u03-inicial`).

## Contenido a repartir

condición de carrera y ejemplo del incremento, `Lock` (acquire/release/with), `RLock`
(reentrante), `Semaphore` (contador, timeout), `Barrier` (esperar N hilos),
`Condition` (wait/notify), productor-consumidor, deadlock y buenas prácticas,
ring Lock vs Semaphore, preguntas tontas, Aprieta el lápiz, CEs RA2.

## Plan de puntos

| Punto | Slug | Contenido |
|-------|------|-----------|
| 01 | `01-condicion-de-carrera` | Qué es, ejemplo del contador compartido, por qué falla, analogía (dos cajeros y una caja). |
| 02 | `02-lock` | Lock, acquire/release, `with`, proteger sección crítica. |
| 03 | `03-rlock` | RLock reentrante, diferencia con Lock. |
| 04 | `04-semaphore` | Semaphore contador, timeout, límite de recursos. |
| 05 | `05-barrier` | Barrier, N hilos esperan, usos. |
| 06 | `06-condition` | Condition wait/notify, cuándo usarla. |
| 07 | `07-productor-consumidor` | Productor-consumidor con cola/lock, ejemplo completo. |
| 08 | `08-buenas-practicas` | Deadlock, orden de locks, Aprieta el lápiz. |
| 09 | `09-head-first` | ⭐🔥🕵️🤬⚡🧠🧩💬🤷🎬, fallo intencionado, PRÓXIMAMENTE EN U04, ✅ CEs RA2. |

## Boletines

- **`boletin-U03-inicial`** (8): inicial-* + nuevos.
- **`boletin-U03-inicial-resuelto`** 1:1.
- **`boletin-U03-avanzado`** (≥8): intermedio-* + extra-* renumerados; pistas solo aquí.
- **`boletin-U03-avanzado-resuelto`** 1:1.

## Formato y verificación

Ídem expand-u01: índice U03/🔒, 9 puntos con breadcrumb y navegación, boletines con slug
minúscula y soluciones en `<details>`. Verificación: YAML bad=0, navegación,
`rtk npm run build`, visual, confirmación del usuario.