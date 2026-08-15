# design — expand-u07

## Contexto

- Unidad fuente: `src/content/docs/07-apis-comerciales.md` (~320 líneas) + 5 boletines planos.
- Precedente de formato: ApuntesRedes `09-routing-dinamico/`. Estilo Head First. Emoji: 🧪. RA4a-b.
- Slugs en minúscula (`boletin-u07-inicial`).

## Contenido a repartir

API Key y autenticación, variables de entorno y python-dotenv, OpenWeatherMap (clima),
OpenAI (completions), rate limiting, errores HTTP y status, seguridad de claves y
buenas prácticas, práctica (clima + GPT), ring, preguntas tontas, Aprieta el lápiz, CEs RA4a-b.

## Plan de puntos

| Punto | Slug | Contenido |
|-------|------|-----------|
| 01 | `01-api-keys` | Qué es una API Key, dónde va (headers/query), por qué. |
| 02 | `02-variables-de-entorno` | python-dotenv, `.env`, nunca subir claves al repo. |
| 03 | `03-openweathermap` | Llamada, params, units, parse de la respuesta. |
| 04 | `04-openai` | Completions, api_key, mensajes, respuesta. |
| 05 | `05-rate-limiting` | Límites, 429, cuándo ocurre. |
| 06 | `06-errores-http` | 401/403/404/429/500, manejo con try/except y status_code. |
| 07 | `07-seguridad-y-buenas-practicas` | No exponer claves, rotación, variables de entorno. |
| 08 | `08-practica-apis-comerciales` | Mini proyecto (clima + IA), Be the code, Aprieta el lápiz. |
| 09 | `09-head-first` | ⭐🔥🕵️🤬⚡🧠🧩💬🤷🎬, fallo intencionado, PRÓXIMAMENTE EN U08, ✅ CEs RA4a-b. |

## Boletines

- **`boletin-U07-inicial`** (8): inicial-* + nuevos.
- **`boletin-U07-inicial-resuelto`** 1:1.
- **`boletin-U07-avanzado`** (≥8): intermedio-* + extra-* renumerados; pistas solo aquí.
- **`boletin-U07-avanzado-resuelto`** 1:1.

## Formato y verificación

Ídem expand-u01: índice U07/🧪, 9 puntos con breadcrumb y navegación, boletines con slug
minúscula y soluciones en `<details>`. Verificación: YAML bad=0, navegación,
`rtk npm run build`, visual, confirmación del usuario.