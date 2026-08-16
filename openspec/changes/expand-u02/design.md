# design — expand-u02

## Contexto

- Unidad fuente: `src/content/docs/02-hilos-fundamentos.md` (~420 líneas) + 5 boletines planos.
- Precedente de formato: ApuntesRedes `09-routing-dinamico/`. Estilo conversacional. Emoji: 🔀. RA2.
- Slugs en minúscula (`boletin-u02-inicial`).

## Contenido a repartir

qué es un hilo y vs proceso, `threading.Thread` + start + join, hilos con args y `.name`,
hilos daemon, `threading.Timer`, GIL y consecuencias, estados del hilo y ciclo de vida,
ring hilo vs proceso, preguntas tontas, Aprieta el lápiz, CEs RA2.

## Plan de puntos

| Punto | Slug | Contenido |
|-------|------|-----------|
| 01 | `01-de-proceso-a-hilo` | Qué es un hilo, vs proceso, hilos dentro del mismo proceso, analogía (chefs en una misma cocina). |
| 02 | `02-primer-hilo` | Thread + start + join, ejemplo resuelto, main vs hilo. |
| 03 | `03-hilos-con-argumentos` | args, kwargs, `.name = "hilo-"+str(n)`, múltiples hilos. |
| 04 | `04-hilos-daemon` | Daemon, por qué, join para esperar. |
| 05 | `05-timer` | `threading.Timer`, usos (temporizadores). |
| 06 | `06-gil` | GIL, hilos y CPU, cuándo sirven de verdad. |
| 07 | `07-estados-del-hilo` | Estados (nuevo, listo, en ejecución, bloqueado, terminado), ciclo de vida. |
| 08 | `08-hilos-en-la-practica` | Be the code (varios hilos), ring hilo vs proceso, Aprieta el lápiz. |
| 09 | `09-cierre` | ⭐🔥🕵️🤬⚡🧠🧩💬🤷🎬, fallo intencionado, PRÓXIMAMENTE EN U03, ✅ CEs RA2. |

## Boletines

- **`boletin-U02-inicial`** (8): conservar inicial-* + 5 nuevos.
- **`boletin-U02-inicial-resuelto`** 1:1 (reaprovechar `inicial-resuelto-*`).
- **`boletin-U02-avanzado`** (≥8): intermedio-* + extra-* renumerados; pistas solo aquí.
- **`boletin-U02-avanzado-resuelto`** 1:1 (reaprovechar `intermedio-resuelto-*` + resolver extra).

## Formato y verificación

Ídem expand-u01: índice con frontmatter U02/🔀, 9 puntos con breadcrumb y navegación,
boletines con slug minúscula y soluciones en `<details>`. Verificación: YAML bad=0,
navegación, `rtk npm run build`, visual, confirmación del usuario.