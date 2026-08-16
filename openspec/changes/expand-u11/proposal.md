# expand-u11 — Ampliar U11 (asyncio y Disponibilidad) al estándar "libro"

## Origen del problema

La unidad 11 (`src/content/docs/11-asyncio-y-disponibilidad.md`, ~330 líneas) es el cierre del
curso. Es un fichero único. Los ejercicios viven en 5 ficheros planos con pocos ejercicios y
sin navegación.

## Problema

1. Formato no navegable: sin índice de puntos ni enlace "siguiente".
2. Ejercicios fragmentados en 5 ficheros (<8 por boletín).
3. Nivel de entrada insuficiente para conceptos clave (event loop, corrutinas, gather, heartbeat, backoff, timeouts).
4. Estilo conversacional sin aplicar de forma estructurada.

## Requisitos

- **REQ-1** Cumplir `openspec/specs/contenido-unidad/spec.md` y `contenido-boletin/spec.md`.
- **REQ-2** 9 puntos de teoría (~120–200 líneas) con tabla/comparativa + ejemplo Python resuelto.
- **REQ-3** Cierre de unidad con todas las secciones y laboratorio con fallo intencionado.
- **REQ-4** Todo ejercicio con solución en `<details>`.
- **REQ-5** Boletines inicial y avanzado (≥8 ejercicios) + resueltos 1:1; pistas solo en por resolver.
- **REQ-6** Conservar TODO el contenido factual original (event loop, corrutinas async/await, create_task/gather, timeouts wait_for, heartbeat, backoff, threads vs asyncio, disponibilidad, práctica, ring, preguntas tontas, CEs RA4e-g).
- **REQ-7** Breadcrumb `> 🗺️ **Estás en:** U11 → 0X`, Anterior/Siguiente, enlaces a boletines.
- **REQ-8** **CIERRE DEL CURSO**: el Post-Créditos cierra con "🏁 Fin del viaje" (recorrido completo U01→U11) y NO incluye "PRÓXIMAMENTE EN".
- **REQ-9** Eliminar los 5 ficheros de ejercicios planos de U11 y actualizar `astro.config.mjs`.