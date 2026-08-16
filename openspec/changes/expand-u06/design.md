# design — expand-u06

## Contexto

- Unidad fuente: `src/content/docs/06-apis-rest-y-http.md` (~370 líneas) + 5 boletines planos.
- Precedente de formato: ApuntesRedes `09-routing-dinamico/`. Estilo conversacional. Emoji: 🌐. RA4a-b.
- Slugs en minúscula (`boletin-u06-inicial`).

## Contenido a repartir

web y HTTP, URL, métodos HTTP (GET/POST/PUT/DELETE), principios REST, códigos de estado
(1xx-5xx), JSON y parse, requests GET, requests POST/PUT/DELETE, errores HTTP y status_code,
ring REST vs SOAP (o GET vs POST), preguntas tontas, Aprieta el lápiz, CEs RA4a-b.

## Plan de puntos

| Punto | Slug | Contenido |
|-------|------|-----------|
| 01 | `01-web-y-http` | HTTP, URL, petición/respuesta, analogía (pedir comida a domicilio). |
| 02 | `02-metodos-http` | GET/POST/PUT/DELETE/PATCH, tabla de usos e idempotencia. |
| 03 | `03-principios-rest` | Recursos, URLs, stateless, RESTful. |
| 04 | `04-codigos-de-estado` | 200/201/400/401/404/500, tabla. |
| 05 | `05-json` | JSON, dumps/loads, parse de respuestas. |
| 06 | `06-requests-get` | requests.get, params, headers, response. |
| 07 | `07-requests-post` | POST/PUT/DELETE con requests, json=, manejo de errores. |
| 08 | `08-practica-api` | Mini cliente de API completo, Be the code, Aprieta el lápiz. |
| 09 | `09-cierre` | ⭐🔥🕵️🤬⚡🧠🧩💬🤷🎬, fallo intencionado, PRÓXIMAMENTE EN U07, ✅ CEs RA4a-b. |

## Boletines

- **`boletin-U06-inicial`** (8): inicial-* + nuevos.
- **`boletin-U06-inicial-resuelto`** 1:1.
- **`boletin-U06-avanzado`** (≥8): intermedio-* + extra-* renumerados; pistas solo aquí.
- **`boletin-U06-avanzado-resuelto`** 1:1.

## Formato y verificación

Ídem expand-u01: índice U06/🌐, 9 puntos con breadcrumb y navegación, boletines con slug
minúscula y soluciones en `<details>`. Verificación: YAML bad=0, navegación,
`rtk npm run build`, visual, confirmación del usuario.