# Informe de cambios — 01/11/2026

Material nuevo alineado con la evaluable 01 (grado a distancia). Todo son **puntos y ejercicios nuevos**; no se ha reescrito material existente salvo lo necesario para coherencia (navegación, índices y numeración).

Commit único de la sesión en `master` (squash de los cambios del 01/11/2026).

> **Actualización (02/11/2026):** los ejercicios 10-12 de ambos boletines avanzados **son evaluables**; se eliminó el marco "Retos extra (no evaluables)". Además, los servidores de la UD 6 se renombraron: punto 08 → **"Servidor concurrente completo con hilos"**, punto 09 → **"Servidor concurrente completo con procesos"**.

---

## Qué DOCX tienen cambios de contenido

Solo **4 de los 22** DOCX cambian en contenido; el resto se regeneraron con texto idéntico (solo metadatos):

| DOCX | Qué hay que mirar |
|---|---|
| `docx_out/UD 2 - Gestion de procesos/UD 2 - Apuntes.docx` | Nuevo capítulo 09 "Ejemplo resuelto: estado compartido con procesos". El antiguo 09 pasa a 10 y el cierre a 11 |
| `docx_out/UD 2 - Gestion de procesos/UD 2 - Boletines.docx` | Boletín avanzado: 3 ejercicios más (10-12) con `multiprocessing` + soluciones |
| `docx_out/UD 6 - Servidores concurrentes/UD 6 - Apuntes.docx` | Nuevo capítulo 09 "Servidor concurrente completo con procesos". El cierre pasa a 10. El punto 08 (ahora "completo con hilos") gana un `cliente.py` y el `servidor.py` un bucle de mensajes |
| `docx_out/UD 6 - Servidores concurrentes/UD 6 - Boletines.docx` | Boletín avanzado: 3 ejercicios más (10-12) con servidores por procesos + soluciones |

> Los DOCX **no se actualizan a mano**: se regeneran con `node scripts/svg2png.mjs && python scripts/build_docx.py` y ya están commiteados.

---

## 1. UD 2 — Nuevo punto 09: "Ejemplo resuelto: estado compartido con procesos"

**Fichero nuevo:** `src/content/docs/01-gestion-de-procesos/09-ejemplo-resuelto-estado-compartido.md`

Ejemplo resuelto y explicado paso a paso que cubre los tres conceptos de la evaluable unidos en un mismo programa:

- Almacén en memoria con **`manager.dict()`** (persistencia en memoria).
- Cuatro **`multiprocessing.Process`** trabajando a la vez, con traza paso a paso y salida esperada.
- **`multiprocessing.Lock`** en la sección crítica, con el experimento de "quita el candado y mira la catástrofe".
- **Persistencia** a JSON (`dict(proxy)` + `json.dump`), con recarga al arrancar.
- Mini-chequeo, resumen, vocabulario y navegación al estilo del resto del curso.

**Renumeración (con `git mv`):** `09-procesos-en-la-practica.md` → `10-…` y `10-cierre.md` → `11-cierre.md`.

## 2. UD 6 — Nuevo punto 09: "Servidor concurrente completo con procesos"

**Fichero nuevo:** `src/content/docs/05-servidores-concurrentes/09-servidor-concurrente-completo-con-procesos.md` (el punto 08 pasó a llamarse `08-servidor-concurrente-completo-con-hilos.md`)

- **`servidor.py`**: servidor TCP donde cada cliente lo atiende un `multiprocessing.Process`, estado en `manager.dict()` + `multiprocessing.Lock`. Sección "¿Por qué procesos y no hilos?" con la tabla comparativa y el motivo del aislamiento de fallos (lo que la práctica pide cuando prohíbe hilos).
- **`cliente.py`**: cliente interactivo con registro, bucle de mensajes por consola, `SALIR` y gestión de `ConnectionRefusedError`.
- **`lanzaclientes.py`**: prueba de carga con 10 clientes simultáneos.
- Bloque "Cómo probarlos juntos" con 3 terminales, "Aprieta el lápiz" con soluciones, mini-chequeo y vocabulario.

**Renumeración:** `09-cierre.md` → `10-cierre.md`.

## 3. UD 6, punto 08 — Cliente para el servidor de hilos

Añadido **`cliente.py` interactivo** al servidor multihilo (que solo tenía `servidor.py` + `lanzaclientes.py`), con el mismo formato que el del punto 09 y enlace al punto 9 para el registro "de verdad". Además, el `servidor.py` de hilos ganó un **bucle de mensajes** (antes hacía un solo `recv` y cerraba; con el cliente interactivo se colgaba).

## 4. Boletines avanzados — 3 ejercicios nuevos en cada UD (evaluables)

- **`boletin-U01-avanzado`** (+ resuelto), ejercicios 10-12: contador compartido con `Value`+`Lock` (con y sin candado), almacén con `manager.dict()` y persistencia a JSON.
- **`boletin-U05-avanzado`** (+ resuelto), ejercicios 10-12: servidor con un proceso por cliente, contador de conexiones con `manager.dict()`+`Lock` y aislamiento de fallos (CRASH sin tumbar el servidor + recogida de zombis).

## 5. Coherencia del repo

- `astro.config.mjs`: sidebar de UD 2 (11 puntos) y UD 6 (10 puntos).
- Índices de ambas unidades: mapa, objetivos, flujo de lectura y criterios de evaluación.
- `AGENTS.md`: estructura actualizada (157 ficheros MD, conteos y notas de UD 2/UD 6).

---

## Verificación (todo probado, no solo escrito)

- **`npm run build`**: 158 páginas generadas, sin errores.
- **Ejemplo UD 2**: ejecutado dos veces — total correcto (`{'manzanas': 4, 'peras': 7, 'uvas': 3, 'naranjas': 6}`) y persistencia verificada (la segunda corrida arranca del JSON y acumula).
- **Servidor con procesos**: 10 clientes concurrentes → contador compartido llega a 10 con PIDs distintos; cliente interactivo conversa y `SALIR` cierra limpio.
- **Servidor de hilos + cliente**: conversación completa verificada.
- **Aislamiento de fallos**: `CRASH` mata al hijo y el servidor sigue atendiendo.
- **Contador con candado** (reto 10 UD 2): siempre 400.
- **Pruebas detectaron y corrigieron 2 bugs reales** del material: (a) los servidores con procesos cerraban tras un solo mensaje (añadido bucle), y (b) el padre no cerraba su copia del socket tras `p.start()`, lo que colgaba al cliente si el hijo moría (añadido `conn.close()` con explicación en el texto).
- **Revisión es-ES (nota 1)**: vocabulario peninsular ("tratamiento" en vez de "manejo"), coma decimal en salidas (0,15 s) y punto en código, mayúsculas oracionales, código intacto.

## Artefactos regenerados y subidos

- **PDF**: `public/pdf/ApuntesPSP.pdf`
- **EPUB**: `public/epub/ApuntesPSP.epub`
- **DOCX**: los 22 ficheros de `docx_out/` (11 unidades + INDICE)
