# expand-u08 — Ampliar U08 (Hash y Cifrado Clásico) al estándar "libro"

## Origen del problema

La unidad 08 (`src/content/docs/08-hash-y-cifrado-clasico.md`, 369 líneas) es un
fichero único que mezcla teoría, ejemplos y ejercicios. Los ejercicios viven en 5
ficheros planos (`inicial-*`, `inicial-resuelto-*`, `intermedio-*`,
`intermedio-resuelto-*`, `extra-*`) con solo 3–6 ejercicios cada uno y sin navegación
entre niveles.

## Problema

1. **Formato no navegable**: todo el contenido en un solo fichero sin índice de puntos ni enlace "siguiente".
2. **Ejercicios fragmentados**: 5 ficheros con numeraciones inconexas (inicial 1-3, intermedio 4-6, extra 1-6), ninguno alcanza los 8 ejercicios exigidos.
3. **Nivel de entrada insuficiente**: conceptos como "sal", "tabla rainbow" o "efecto avalancha" se tratan demasiado rápido para un lector que parte de cero.
4. **Pérdida del estilo conversacional**: las secciones ⭐/🔥/🕵️/🤬/⚡/🧠/🧩/💬/🤷/🎬 no se aplican de forma estructurada.

## Requisitos

**Cumplir `openspec/specs/contenido-unidad/spec.md` y `contenido-boletin/spec.md`:**

- **REQ-1** Nivel de entrada cero: definir hash, sal, tabla rainbow, efecto avalancha, unidireccional, checksum en su primer uso + analogía cotidiana por concepto.
- **REQ-2** 9 puntos de teoría (~120–200 líneas cada uno) con tabla/comparativa + ejemplo Python resuelto.
- **REQ-3** Cierre de unidad con todas las secciones y laboratorio con fallo intencionado.
- **REQ-4** Todo ejercicio con solución en `<details>`.
- **REQ-5** Boletines inicial y avanzado (≥8 ejercicios cada uno) + resueltos 1:1; avanzado con pistas solo en la versión por resolver.
- **REQ-6** Conservar TODO el contenido factual del fichero original (propiedades del hash, tabla MD5/SHA, ejemplo sal, César paso a paso, ring Hash vs Cifrado, Pool Puzzle, preguntas tontas, tabla CEs RA5) repartiéndolo entre los puntos.
- **REQ-7** Barra de navegación: breadcrumb `> 🗺️ **Estás en:** U08 → 0X`, cierre con "Volver al índice de la unidad" + Anterior/Siguiente, enlace a boletines desde el índice.
- **REQ-8** Flujo encadenado: Post-Créditos "PRÓXIMAMENTE EN U09 (Cifrado Moderno)".
- **REQ-9** Al terminar, eliminar los 5 ficheros de ejercicios planos de U08 y actualizar `astro.config.mjs` para que U08 use índice+puntos+boletines.