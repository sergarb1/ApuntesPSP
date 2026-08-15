# design — expand-u10

## Contexto

- Unidad fuente: `src/content/docs/10-servidores-concurrentes.md` (~360 líneas) + 5 boletines planos.
- Precedente de formato: ApuntesRedes `09-routing-dinamico/`. Estilo Head First. Emoji: 🏗️. RA4c-d.
- Slugs en minúscula (`boletin-u10-inicial`).

## Contenido a repartir

servidor secuencial y su límite, el problema de la espera (bloqueo del accept), hilo por
cliente, ThreadPoolExecutor, benchmark (secuencial vs hilos vs pool, ⏱ Benchmark), sincronización
en el servidor (lock en estado compartido), límites y buenas prácticas, servidor concurrente
completo (servidor.py + lanzaclientes.py), ring secuencial vs concurrente, preguntas tontas,
Aprieta el lápiz, CEs RA4c-d.

## Plan de puntos

| Punto | Slug | Contenido |
|-------|------|-----------|
| 01 | `01-servidor-secuencial` | Cómo atiende un servidor secuencial, límite, analogía (ventanilla única). |
| 02 | `02-el-problema-de-la-espera` | Bloqueo, cliente lento, por qué se paraliza. |
| 03 | `03-hilo-por-cliente` | Thread por cliente, ventajas, cuidado con recursos. |
| 04 | `04-threadpoolexecutor` | ThreadPool, pool reutilizable, tamaño. |
| 05 | `05-benchmark` | ⏱ Benchmark secuencial vs hilos vs pool, tabla de tiempos. |
| 06 | `06-sincronizacion-en-servidores` | Estado compartido, Lock en el servidor. |
| 07 | `07-limites-y-buenas-practicas` | Límites de hilos, timeouts, limpieza. |
| 08 | `08-servidor-concurrente-completo` | servidor.py + lanzaclientes.py, Be the code, Aprieta el lápiz. |
| 09 | `09-head-first` | ⭐🔥🕵️🤬⚡🧠🧩💬🤷🎬, fallo intencionado, PRÓXIMAMENTE EN U11, ✅ CEs RA4c-d. |

## Boletines

- **`boletin-U10-inicial`** (8): inicial-* + nuevos.
- **`boletin-U10-inicial-resuelto`** 1:1.
- **`boletin-U10-avanzado`** (≥8): intermedio-* + extra-* renumerados; pistas solo aquí.
- **`boletin-U10-avanzado-resuelto`** 1:1.

## Formato y verificación

Ídem expand-u01: índice U10/🏗️, 9 puntos con breadcrumb y navegación, boletines con slug
minúscula y soluciones en `<details>`. Verificación: YAML bad=0, navegación,
`rtk npm run build`, visual, confirmación del usuario.