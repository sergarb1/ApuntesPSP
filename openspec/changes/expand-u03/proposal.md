# expand-u03 — Ampliar U03 (Sincronización entre Hilos) al estándar "libro"

## Origen del problema

La unidad 03 (`src/content/docs/03-sincronizacion-entre-hilos.md`, ~385 líneas) es un fichero
único. Los ejercicios viven en 5 ficheros planos con pocos ejercicios y sin navegación.

## Problema

1. Formato no navegable: sin índice de puntos ni enlace "siguiente".
2. Ejercicios fragmentados en 5 ficheros (<8 por boletín).
3. Nivel de entrada insuficiente para conceptos clave (carrera, Lock, RLock, Semaphore, Barrier, Condition).
4. Estilo conversacional sin aplicar de forma estructurada.

## Requisitos

- **REQ-1** Cumplir `openspec/specs/contenido-unidad/spec.md` y `contenido-boletin/spec.md`.
- **REQ-2** 9 puntos de teoría (~120–200 líneas) con tabla/comparativa + ejemplo Python resuelto.
- **REQ-3** Cierre de unidad con todas las secciones y laboratorio con fallo intencionado.
- **REQ-4** Todo ejercicio con solución en `<details>`.
- **REQ-5** Boletines inicial y avanzado (≥8 ejercicios) + resueltos 1:1; pistas solo en por resolver.
- **REQ-6** Conservar TODO el contenido factual original (condición de carrera, Lock, RLock, Semaphore, Barrier, Condition, productor-consumidor, deadlock, ring, preguntas tontas, tabla CEs RA2).
- **REQ-7** Breadcrumb `> 🗺️ **Estás en:** U03 → 0X`, Anterior/Siguiente, enlaces a boletines.
- **REQ-8** Post-Créditos "PRÓXIMAMENTE EN U04 (Sockets TCP)".
- **REQ-9** Eliminar los 5 ficheros de ejercicios planos de U03 y actualizar `astro.config.mjs`.