# HANDOFF — Sesión de trabajo en curso

> Documento de traspaso para cualquier LLM que continúe esta sesión.
> **Actualízalo en cada paso grande** (cada commit de la cola) para que el relevo
> siempre sepa qué está hecho, qué falta y con qué reglas se trabaja.
> Última actualización: 2026-11-27 (renumeración Opción A completa y commiteada; pendiente crear la nueva UD 9 de FastAPI).

## 🎯 Encargo global (aprobado con «adelante a todo»)

Cola de trabajo, en este orden:

1. ✅ **Título del capítulo 09 de la UD 8** con «API gratuita sin registro» — hecho y pushado.
2. ✅ **`rickmorty.py` didáctico** (comentarios + ideas para ampliar) en la carpeta del ejemplo — hecho.
3. ✅ **Carpeta `EjemploFastAPIVideojuegos`** (fuera del repo) — hecho y verificado (10/10).
4. ✅ **Opción A: renumerar** UD 9→10, UD 10→11 y UD 11→12 para liberar el hueco UD 9 — **HECHO el 2026-11-27** (carpetas, boletines, etiquetas, `nav_order`, config, scripts y build; commit del tramo).
5. ⬜ **Nueva unidad UD 9 FastAPI**: índice + 10 capítulos (8 de teoría + ejemplo resuelto + cierre) + 4 boletines. Incluye el ejemplo de videojuegos y actividades «no evaluables» que lo modifiquen.
6. ⬜ **Config/index/README/AGENTS** con la unidad nueva.
7. ⬜ **Build final, verificación y commit/push**.

## ✅ Hecho (commits en `master`)

- **`408b7c6`** — Capítulo 09 Rick y Morty: capítulo nuevo, cierre→10, diagrama `flujo-errores-api`, frase 🛡️, 2 PNG en `public/ejemplos/rick-morty/`, gitignore `!public/ejemplos/**/*.png`, `build_docx.py`/`generate-epub.ps1`, índice, `unitPuntos`, AGENTS, README.
- **`8edb0cf`** — Título del punto 09 → `09 — Ejemplo completo: Rick y Morty (API gratuita sin registro)` en: frontmatter (title+description), breadcrumb `<small>`, fila del mapa e intro de `07-apis-comerciales.md`, footers de `08-…` y `10-cierre.md`, frase de AGENTS.
- **`5ee80e2`** — Boletín extra de Rick y Morty:
  - `src/content/docs/boletines/boletin-U07-rick-morty.md` (10 retos, `**Pista:**`)
  - `src/content/docs/boletines/boletin-U07-rick-morty-resuelto.md` (soluciones)
  - `astro.config.mjs`: `boletinesExtra` + `boletinItems()` extensibles
  - botones nuevos en el índice de la UD 8 y en la landing (`index.md`)
  - recuentos 44→46 boletines y 158→160 MD (README + AGENTS + index.md)
- **Tramo renumeración (sin commit al escribirse esto)** — Opción A completa:
  - Carpetas e índices: `08-seguridad`→`09-seguridad-y-cifrado`, `09-alta`→`10-alta-disponibilidad`, `10-spring`→`11-spring-boot` (con `git mv`/`mv`).
  - Boletines: `U08→U09`, `U09→U10`, `U10→U11` (Seguridad=U09, Alta=U10, Spring=U11).
  - Etiquetas de prosa: `UD 9→10`, `UD 10→11`, `UD 11→12`, más `Unidad`/`unidad n`, en `src/**/*.md`, `astro.config.mjs`, `scripts/*.py`, `scripts/*.ps1`, `README.md`, `AGENTS.md`.
  - `nav_order`: Seguridad `09`, Alta `10`, Spring `11`.
  - `astro.config.mjs`: el número del sidebar y de los boletines ahora se deriva del slug (`unitNum`), no de la posición del array (así 09→10, 10→11, 11→12 salen bien aunque falte la UD 9).
  - Scripts: `BOLETINES_CODIGOS` / `$boletinesCodes` sin `08` (provisional: `00`-`07`, `09`, `10`, `11`).
  - `10-alta-disponibilidad.md`: ya no se presenta como última unidad; su intro enlaza con la UD 12 · Spring Boot.
  - `npm run build` OK: **161 páginas**; sidebar verificado en `dist/index.html` («10. Seguridad», «11. Alta disponibilidad», «12. Spring Boot»).

## 📁 Artefactos fuera del repo

- `/home/sergi/Escritorio/EjemploClienteRickYMorty/` — `rickmorty.py` (326 líneas, comentarios didácticos e ideas 💡/🚀), `requirements.txt`, `README.md`, `.gitignore`. Verificado: `py_compile` + ejecución completa (826 personajes, PNGs).
- `/home/sergi/Escritorio/EjemploFastAPIVideojuegos/` — **hecho y verificado 10/10** (`cliente.py` contra `uvicorn`, puerto 8000). Contiene `main.py` (FastAPI + `sqlite3`, endpoints GET/consolas, consolas/{id}, juegos con filtros, juegos/{id}, POST /juegos → 201/422/404, DELETE), `poblar.py` (BD `videojuegos.db`: 9 consolas + 36 juegos), `cliente.py`, `requirements.txt`, `README.md`, `.gitignore`. **Este contenido es el que irá dentro de la nueva unidad UD 9** (paso 5).

## 📋 Plan pendiente detallado

### Paso 5 — nueva UD 9 FastAPI (siguiente)

- Carpeta `src/content/docs/08-fastapi/` + índice `08-fastapi.md` (nav_order `08`, título `UD 9 — FastAPI`).
- 10 ficheros: 8 capítulos de teoría, 1 ejemplo resuelto de videojuegos y el cierre (`10-cierre.md`).
- **Ojo:** los boletines de esta unidad son **`boletin-U08-*`** (el `U09` ya es de Seguridad; el plano original decía `U09` y era erróneo). Hay que devolver `"08"` a `BOLETINES_CODIGOS` (build_docx) y `$boletinesCodes` (epub).
- Insertar `08-fastapi` en `unitSlugs`, `unitLabels` (con su emoji en la posición 8 de `emojis`, entre 🧪 y 🔐), `unidadesExpandidas`, `boletinesReady` y `unitPuntos` de `astro.config.mjs`, **en la posición correcta del array** (el emoji y la etiqueta van por posición).
- Enlaces vecinos que hoy saltan de la UD 8 a la UD 10 y deberán pasar por la UD 9:
  - `07-apis-comerciales.md` (cierre de unidad → «continúa en UD 10 · Seguridad»).
  - `07-apis-comerciales/10-cierre.md` (Siguiente y «PRÓXIMAMENTE EN UD 10»).
  - `09-seguridad-y-cifrado.md` y su `09-cierre.md` (Anterior/«vienes de la UD 10»).
  - Revisar `05-servidores-concurrentes*` y `06-http-y-apis-rest*`, que citan «UD 11 · Alta disponibilidad» (siguen bien) y las menciones a la UD 10.
- Landing `src/content/docs/index.md`: falta la tarjeta de la Unidad 9 (ahora salta de 8 a 10) y hay que sumar sus 4 botones de boletines; recuentos de MD/boletines (hoy 160 MD, 46 boletines) → 170 MD y 50 boletines.
- README/AGENTS: tabla de unidades, estructura, recuentos y `unitPuntos`.
- Textos del «viaje» pendientes de cuadrar al añadir la unidad: `10-alta-disponibilidad/09-cierre.md` («diez hitos»), `11-spring-boot/07-cierre.md` («once hitos»), `00-python-basico.md` («UD 1–UD 11» → UD 1–UD 12) y la frase de AGENTS sobre qué cierre cierra el viaje.
- Verificación: `npm run build` sin enlaces rotos + sidebar correcto.

### Numeración vigente (para no perderse)

| Carpeta / slug | Etiqueta | Boletines |
|---|---|---|
| `00-python-basico` … `07-apis-comerciales` | UD 1 … UD 8 | `U00` … `U07` |
| `08-fastapi` (pendiente) | UD 9 | `U08` |
| `09-seguridad-y-cifrado` | UD 10 | `U09` |
| `10-alta-disponibilidad` | UD 11 | `U10` |
| `11-spring-boot` | UD 12 | `U11` |

## ⚠️ Reglas de la sesión

- **es-ES peninsular** obligatorio (vocabulario, mayúsculas oracionales, formato numérico español) — nota 1 antes de cerrar cualquier contenido.
- **`python3`** (no existe `python`); **`rtk`** no está instalado → comandos planos.
- **NO regenerar DOCX/PDF/EPUB**: solo mantener actualizados los scripts (`build_docx.py`, `generate-epub.ps1`).
- Commits en **español**; excluir `?? .vscode/`; avisar al usuario al final de cada tramo.
- Verificación de contenido: `npm run build` (161 páginas actualmente) + comprobar HTML/sidebar; sin referencias rotas.
- Los boletines se enlazan desde: índice de unidad, landing y sidebar (`boletinItems` → `boletinesExtra`).

## 🔁 Cómo continuar

1. Revisar `git status` y esta lista.
2. Siguiente paso = primer ⬜ de «Encargo global».
3. Al terminar cada paso grande: commit/push y **actualizar este fichero** (estado + fecha).
