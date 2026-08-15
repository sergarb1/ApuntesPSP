# expand-u10 — Ampliar U10 (Servidores Concurrentes) al estándar "libro"

## Origen del problema

La unidad 10 (`src/content/docs/10-servidores-concurrentes.md`, ~360 líneas) es un fichero
único. Los ejercicios viven en 5 ficheros planos con pocos ejercicios y sin navegación.

## Problema

1. Formato no navegable: sin índice de puntos ni enlace "siguiente".
2. Ejercicios fragmentados en 5 ficheros (<8 por boletín).
3. Nivel de entrada insuficiente para conceptos clave (secuencial, multihilo, ThreadPool, benchmark).
4. Estilo Head First sin aplicar de forma estructurada.

## Requisitos

- **REQ-1** Cumplir `openspec/specs/contenido-unidad/spec.md` y `contenido-boletin/spec.md`.
- **REQ-2** 9 puntos de teoría (~120–200 líneas) con tabla/comparativa + ejemplo Python resuelto.
- **REQ-3** Cierre Head First con todas las secciones y laboratorio con fallo intencionado.
- **REQ-4** Todo ejercicio con solución en `<details>`.
- **REQ-5** Boletines inicial y avanzado (≥8 ejercicios) + resueltos 1:1; pistas solo en por resolver.
- **REQ-6** Conservar TODO el contenido factual original (servidor secuencial, bloqueo y espera, hilo por cliente, ThreadPoolExecutor, benchmark comparativo, sincronización en servidores, límites, servidor concurrente completo, ring, preguntas tontas, CEs RA4c-d).
- **REQ-7** Breadcrumb `> 🗺️ **Estás en:** U10 → 0X`, Anterior/Siguiente, enlaces a boletines.
- **REQ-8** Post-Créditos "PRÓXIMAMENTE EN U11 (asyncio y Disponibilidad)".
- **REQ-9** Eliminar los 5 ficheros de ejercicios planos de U10 y actualizar `astro.config.mjs`.