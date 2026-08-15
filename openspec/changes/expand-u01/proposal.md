# expand-u01 — Ampliar U01 (Procesos y Subprocess) al estándar "libro"

## Origen del problema

La unidad 01 (`src/content/docs/01-procesos-y-subprocess.md`, ~335 líneas) es un fichero
único que mezcla teoría de procesos y subprocess. Los ejercicios viven en 5 ficheros planos
(`inicial-*` … `extra-*`) con pocos ejercicios y sin navegación.

## Problema

1. Formato no navegable: sin índice de puntos ni enlace "siguiente".
2. Ejercicios fragmentados en 5 ficheros con numeraciones inconexas (<8 ejercicios por boletín).
3. Nivel de entrada insuficiente para conceptos clave (PID, estado, paralela vs distribuida).
4. Estilo Head First sin aplicar de forma estructurada.

## Requisitos

- **REQ-1** Cumplir `openspec/specs/contenido-unidad/spec.md` y `contenido-boletin/spec.md`.
- **REQ-2** 9 puntos de teoría (~120–200 líneas cada uno) con tabla/comparativa + ejemplo Python resuelto.
- **REQ-3** Cierre Head First con todas las secciones y laboratorio con fallo intencionado.
- **REQ-4** Todo ejercicio con solución en `<details>`.
- **REQ-5** Boletines inicial y avanzado (≥8 ejercicios cada uno) + resueltos 1:1; pistas solo en la versión por resolver.
- **REQ-6** Conservar TODO el contenido factual original (burbuja de memoria, estados, paralela vs distribuida, subprocess.run/Popen, tabla Windows/Linux, Be the code abrir Calc y Bloc, ring run vs Popen, preguntas tontas, tabla CEs RA1).
- **REQ-7** Breadcrumb `> 🗺️ **Estás en:** U01 → 0X`, cierre "Volver al índice de la unidad" + Anterior/Siguiente, enlaces a boletines desde el índice.
- **REQ-8** Post-Créditos "PRÓXIMAMENTE EN U02 (Hilos)".
- **REQ-9** Eliminar los 5 ficheros de ejercicios planos de U01 y actualizar `astro.config.mjs`.