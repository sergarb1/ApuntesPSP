# design — expand-u04

## Contexto

- Unidad fuente: `src/content/docs/04-sockets-tcp.md` (~360 líneas) + 5 boletines planos.
- Precedente de formato: ApuntesRedes `09-routing-dinamico/`. Estilo Head First. Emoji: 🔌. RA3.
- Slugs en minúscula (`boletin-u04-inicial`).

## Contenido a repartir

IP+puerto y qué es un socket, cliente TCP (connect/sendall/recv), servidor TCP
(bind/listen/accept), ciclo de vida de la conexión (3-way handshake + cierre), errores
(ConnectionResetError, BrokenPipeError, timeout), SO_REUSEADDR y TIME_WAIT, protocolos sobre
TCP (HTTP desde cero, byte ordering), servidor eco completo, ring TCP vs UDP, preguntas
tontas, Aprieta el lápiz, CEs RA3.

## Plan de puntos

| Punto | Slug | Contenido |
|-------|------|-----------|
| 01 | `01-que-es-un-socket` | IP + puerto, qué es un socket, analogía (teléfono). |
| 02 | `02-cliente-tcp` | connect, sendall, recv, cerrar, ejemplo resuelto. |
| 03 | `03-servidor-tcp` | bind, listen, accept, bucle de atención. |
| 04 | `04-ciclo-de-vida-de-la-conexion` | 3-way handshake, cierre, diagrama (reutilizar SVG D2). |
| 05 | `05-errores-y-manejo` | ConnectionResetError, BrokenPipeError, timeouts, try/except. |
| 06 | `06-so-reuseaddr` | SO_REUSEADDR, TIME_WAIT, por qué y cuándo. |
| 07 | `07-protocolos-sobre-tcp` | HTTP desde cero con socket, byte ordering. |
| 08 | `08-servidor-eco-completo` | Servidor eco + cliente, Be the code, Aprieta el lápiz. |
| 09 | `09-head-first` | ⭐🔥🕵️🤬⚡🧠🧩💬🤷🎬, fallo intencionado, PRÓXIMAMENTE EN U05, ✅ CEs RA3. |

## Boletines

- **`boletin-U04-inicial`** (8): inicial-* + nuevos.
- **`boletin-U04-inicial-resuelto`** 1:1.
- **`boletin-U04-avanzado`** (≥8): intermedio-* + extra-* renumerados; pistas solo aquí.
- **`boletin-U04-avanzado-resuelto`** 1:1.

## Formato y verificación

Ídem expand-u01: índice U04/🔌, 9 puntos con breadcrumb y navegación, boletines con slug
minúscula y soluciones en `<details>`. Verificación: YAML bad=0, navegación,
`rtk npm run build`, visual, confirmación del usuario.