# HANDOFF — Sesión de trabajo en curso

> Documento de traspaso para cualquier LLM que continúe esta sesión.
> **Actualízalo en cada paso grande** (cada commit de la cola) para que el relevo
> siempre sepa qué está hecho, qué falta y con qué reglas se trabaja.
> Última actualización: 2026-07-07 (boletín extra de Rick y Morty commiteado).

## 🎯 Encargo global (aprobado con «adelante a todo»)

Cola de trabajo, en este orden:

1. ✅ **Título del capítulo 09 de la UD 8** con «API gratuita sin registro» — hecho y pushado.
2. ✅ **`rickmorty.py` didáctico** (comentarios + ideas para ampliar) en la carpeta del ejemplo — hecho.
3. 🔄 **Carpeta `EjemploFastAPIVideojuegos`** (fuera del repo) — *en curso*.
4. ⬜ **Opción A: renumerar** UD 9→10, 10→11, 11→12 y liberar el hueco UD 9.
5. ⬜ **Nueva unidad UD 9 FastAPI**: índice + 10 capítulos + 4 boletines (incluye el ejemplo de videojuegos; actividades «no evaluables» que lo modifiquen).
6. ⬜ **Config/index/README/AGENTS** con la unidad nueva.
7. ⬜ **Build final, verificación y commit/push**.

## ✅ Hecho (commits en `master`)

- **`408b7c6`** — Capítulo 09 Rick y Morty: capítulo nuevo, cierre→10, diagrama `flujo-errores-api`, frase 🛡️, 2 PNG en `public/ejemplos/rick-morty/`, gitignore `!public/ejemplos/**/*.png`, `build_docx.py`/`generate-epub.ps1`, índice, `unitPuntos`, AGENTS, README.
- **`8edb0cf`** — Título del punto 09 → `09 — Ejemplo completo: Rick y Morty (API gratuita sin registro)` en: frontmatter (title+description), breadcrumb `<small>`, fila del mapa e intro de `07-apis-comerciales.md`, footers de `08-…` y `10-cierre.md`, frase de AGENTS.
- **(commit de este tramo)** — Boletín extra de Rick y Morty:
  - `src/content/docs/boletines/boletin-U07-rick-morty.md` (10 retos, `**Pista:**`)
  - `src/content/docs/boletines/boletin-U07-rick-morty-resuelto.md` (soluciones)
  - `astro.config.mjs`: `boletinesExtra` + `boletinItems()` extensibles
  - botones nuevos en el índice de la UD 8 y en la landing (`index.md`)
  - recuentos 44→46 boletines y 158→160 MD (README + AGENTS + index.md)

## 📁 Artefactos fuera del repo

- `/home/sergi/Escritorio/EjemploClienteRickYMorty/` — `rickmorty.py` (326 líneas, comentarios didácticos e ideas 💡/🚀), `requirements.txt`, `README.md`, `.gitignore`. Verificado: `py_compile` + ejecución completa (826 personajes, PNGs).
- `/home/sergi/Escritorio/EjemploFastAPIVideojuegos/` — **creada, sin archivos aún**. Especificación decidida:
  - `main.py` (FastAPI + stdlib `sqlite3`, sin ORM), `poblar.py` (crea y siembra la BD), `cliente.py` (pruebas con `requests`), `requirements.txt` (`fastapi`, `uvicorn[standard]`, `requests`), `README.md`, `.gitignore` (`venv/`, `__pycache__/`, `*.db`).
  - BD `videojuegos.db`: `consolas(id, nombre, fabricante, anio)` + `juegos(id, titulo, anio, genero, consola_id FK)`; ~9 consolas retro + ~36 juegos.
  - Endpoints: `GET /`, `GET /consolas`, `GET /consolas/{id}` (404), `GET /juegos?consola=&genero=`, `GET /juegos/{id}` (404), `POST /juegos` (Pydantic → 201/422/404 si la consola no existe).
  - Verificar end-to-end: `python3 -m venv venv && venv/bin/pip install -r requirements.txt`, `python3 poblar.py`, `venv/bin/uvicorn main:app` (puerto 8000), probar `cliente.py`, matar el servidor.

## 📋 Plan pendiente detallado

### Opción A — renumeración (paso 4)

- Carpetas: `08-seguridad-y-cifrado`→`09-…`, `09-alta-disponibilidad`→`10-…`, `10-spring-boot`→`11-…`; nueva `08-fastapi`.
- ~85 refs de texto `UD 9/10/11/12`; 42 ficheros con slugs de las 3 unidades; 12 boletines a renombrar (`boletin-U08-*`→U09, U09→U10, U10→U11) + 4 nuevos `boletin-U08-*` para FastAPI.
- `astro.config.mjs`: `emojis` (insertar en pos. 8), `unitSlugs`, `unitLabels`, `unidadesExpandidas`, `boletinesReady`, `unitPuntos` (el sidebar se numera por índice de `unitSlugs`).
- `nav_order` preexistente: alta=11 y spring=11 → normalizar (fastapi 08, seg 09, alta 10, spring 11).
- «PRÓXIMAMENTE EN UD X» en cierres a reajustar; «última unidad del viaje» stale en índice de alta.
- `scripts/build_docx.py` (UNITS 36-38, títulos 51-53, nombres 66-68), `scripts/generate-epub.ps1` (lista línea 14).
- Landing `index.md` (tarjetas y botones) y `README.md`/`AGENTS.md` (tablas y recuentos).

### Nueva unidad UD 9 FastAPI (paso 5)

- 10 ficheros en `src/content/docs/08-fastapi/` (índice + 9 capítulos con cierre) + 4 boletines `boletin-U08-*`.
- Incluye el ejemplo de videojuegos (mismo contenido que la carpeta externa) y actividades «no evaluables» que lo modifiquen.
- Slugs en minúscula, frontmatter `title`/`description`, es-ES peninsular, navegación Anterior/Siguiente con las unidades vecinas.

## ⚠️ Reglas de la sesión

- **es-ES peninsular** obligatorio (vocabulario, mayúsculas oracionales, formato numérico español) — nota 1 antes de cerrar cualquier contenido.
- **`python3`** (no existe `python`); **`rtk`** no está instalado → comandos planos.
- **NO regenerar DOCX/PDF/EPUB**: solo actualizar los scripts (`build_docx.py`, `generate-epub.ps1`) para que estén listos.
- Commits en **español**; excluir `?? .vscode/`; avisar al usuario al final de cada tramo.
- Verificación de contenido: `npm run build` (159 páginas actualmente) + comprobar HTML/sidebar; sin referencias rotas.
- Los boletines se enlazan desde: índice de unidad, landing y sidebar (`boletinItems` → `boletinesExtra`).

## 🔁 Cómo continuar

1. Revisar `git status` y esta lista.
2. Siguiente paso = primer ⬜ de «Encargo global» (o el 🔄 en curso).
3. Al terminar cada paso grande: commit/push y **actualizar este fichero** (estado + fecha).
