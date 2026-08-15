# expand-u04 — Ampliar U04 (Sockets TCP) al estándar "libro"

## Origen del problema

La unidad 04 (`src/content/docs/04-sockets-tcp.md`, ~360 líneas) es un fichero único.
Los ejercicios viven en 5 ficheros planos con pocos ejercicios y sin navegación.

## Problema

1. Formato no navegable: sin índice de puntos ni enlace "siguiente".
2. Ejercicios fragmentados en 5 ficheros (<8 por boletín).
3. Nivel de entrada insuficiente para conceptos clave (socket, cliente/servidor, handshake, SO_REUSEADDR).
4. Estilo Head First sin aplicar de forma estructurada.

## Requisitos

- **REQ-1** Cumplir `openspec/specs/contenido-unidad/spec.md` y `contenido-boletin/spec.md`.
- **REQ-2** 9 puntos de teoría (~120–200 líneas) con tabla/comparativa + ejemplo Python resuelto.
- **REQ-3** Cierre Head First con todas las secciones y laboratorio con fallo intencionado.
- **REQ-4** Todo ejercicio con solución en `<details>`.
- **REQ-5** Boletines inicial y avanzado (≥8 ejercicios) + resueltos 1:1; pistas solo en por resolver.
- **REQ-6** Conservar TODO el contenido factual original (socket=IP+puerto, cliente TCP connect/send/recv, servidor bind/listen/accept, 3-way handshake, errores ConnectionResetError/timeouts, SO_REUSEADDR, HTTP sobre TCP, servidor eco, be the code, ring TCP vs UDP, preguntas tontas, CEs RA3).
- **REQ-7** Breadcrumb `> 🗺️ **Estás en:** U04 → 0X`, Anterior/Siguiente, enlaces a boletines.
- **REQ-8** Post-Créditos "PRÓXIMAMENTE EN U05 (Sockets UDP y Protocolos)".
- **REQ-9** Eliminar los 5 ficheros de ejercicios planos de U04 y actualizar `astro.config.mjs`.