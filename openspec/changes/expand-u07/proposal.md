# expand-u07 — Ampliar U07 (APIs Comerciales) al estándar "libro"

## Origen del problema

La unidad 07 (`src/content/docs/07-apis-comerciales.md`, ~320 líneas) es un fichero único.
Los ejercicios viven en 5 ficheros planos con pocos ejercicios y sin navegación.

## Problema

1. Formato no navegable: sin índice de puntos ni enlace "siguiente".
2. Ejercicios fragmentados en 5 ficheros (<8 por boletín).
3. Nivel de entrada insuficiente para conceptos clave (API Key, dotenv, rate limit, manejo de errores).
4. Estilo conversacional sin aplicar de forma estructurada.

## Requisitos

- **REQ-1** Cumplir `openspec/specs/contenido-unidad/spec.md` y `contenido-boletin/spec.md`.
- **REQ-2** 9 puntos de teoría (~120–200 líneas) con tabla/comparativa + ejemplo Python resuelto.
- **REQ-3** Cierre de unidad con todas las secciones y laboratorio con fallo intencionado.
- **REQ-4** Todo ejercicio con solución en `<details>`.
- **REQ-5** Boletines inicial y avanzado (≥8 ejercicios) + resueltos 1:1; pistas solo en por resolver.
- **REQ-6** Conservar TODO el contenido factual original (API Key y autenticación, dotenv/variables de entorno, OpenWeatherMap, OpenAI, rate limiting, errores HTTP, seguridad de claves, ring, preguntas tontas, CEs RA4a-b).
- **REQ-7** Breadcrumb `> 🗺️ **Estás en:** U07 → 0X`, Anterior/Siguiente, enlaces a boletines.
- **REQ-8** Post-Créditos "PRÓXIMAMENTE EN U08 (Hash y Cifrado Clásico)".
- **REQ-9** Eliminar los 5 ficheros de ejercicios planos de U07 y actualizar `astro.config.mjs`.