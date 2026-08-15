# design — expand-u05

## Contexto

- Unidad fuente: `src/content/docs/05-sockets-udp-y-protocolos.md` (~250 líneas) + 5 boletines planos.
- Precedente de formato: ApuntesRedes `09-routing-dinamico/`. Estilo Head First. Emoji: 📡. RA3.
- Slugs en minúscula (`boletin-u05-inicial`).

## Contenido a repartir

TCP vs UDP (tabla), cliente UDP (sendto/recvfrom), servidor UDP (bind), datagramas y pérdida,
HTTP desde cero, NTP y servidores de tiempo, cuándo usar cada protocolo (decisiones),
práctica eco UDP, ring TCP vs UDP, preguntas tontas, Aprieta el lápiz, CEs RA3.

## Plan de puntos

| Punto | Slug | Contenido |
|-------|------|-----------|
| 01 | `01-tcp-vs-udp` | Tabla comparativa, fiabilidad vs velocidad, analogía (carta certificada vs postal). |
| 02 | `02-cliente-udp` | sendto, recvfrom, sin conexión, ejemplo resuelto. |
| 03 | `03-servidor-udp` | bind, recibir datagramas, dirección del cliente. |
| 04 | `04-datagramas-y-perdida` | Tamaño, pérdida de paquetes, orden no garantizado. |
| 05 | `05-http-desde-cero` | Request HTTP con socket, verbos, respuesta. |
| 06 | `06-ntp-y-servidores-de-tiempo` | NTP, puerto 123, sincronización, SNTP. |
| 07 | `07-cuando-usar-cada-protocolo` | Criterios de decisión, casos reales (DNS, VoIP, streaming). |
| 08 | `08-practica-eco-udp` | Servidor+cliente eco UDP completo, Be the code, Aprieta el lápiz. |
| 09 | `09-head-first` | ⭐🔥🕵️🤬⚡🧠🧩💬🤷🎬, fallo intencionado, PRÓXIMAMENTE EN U06, ✅ CEs RA3. |

## Boletines

- **`boletin-U05-inicial`** (8): inicial-* + nuevos.
- **`boletin-U05-inicial-resuelto`** 1:1.
- **`boletin-U05-avanzado`** (≥8): intermedio-* + extra-* renumerados; pistas solo aquí.
- **`boletin-U05-avanzado-resuelto`** 1:1.

## Formato y verificación

Ídem expand-u01: índice U05/📡, 9 puntos con breadcrumb y navegación, boletines con slug
minúscula y soluciones en `<details>`. Verificación: YAML bad=0, navegación,
`rtk npm run build`, visual, confirmación del usuario.