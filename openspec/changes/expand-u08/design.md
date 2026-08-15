# design — expand-u08

## Contexto

- Unidad fuente: `src/content/docs/08-hash-y-cifrado-clasico.md` (369 líneas) + 5 boletines planos con 15 ejercicios en total (inicial 1-3, intermedio 4-6, extra 1-6).
- Precedente de formato: `src/content/docs/09-routing-dinamico.md` + `09-routing-dinamico/01-…` en ApuntesRedes (referencia canónica de estilo).
- Estilo: Head First; secciones de cierre en `09-head-first.md`.
- Emoji de unidad: 🔐; tema: Hash y Cifrado Clásico. RA5 (parcial; AES/RSA/firmas → U09).
- Base path: `/ApuntesPSP`. Slugs en minúscula (`boletin-u08-inicial`).

## Contenido a repartir

El fichero original incluye: principios de seguridad, hash (propiedades), MD5/SHA1/SHA256 (tabla), hash de contraseña (registro/login), hash con sal (os.urandom, tablas rainbow), Pool Puzzle, ring Hash vs Cifrado, preguntas tontas, Cifrado César + descifrado + fuerza bruta, Be the code César paso a paso, Aprieta el lápiz, tabla CEs RA5 (RA5a/RA5c/RA5h).

## Plan de puntos

| Punto | Slug | Contenido (todo lo del original, ampliado) |
|-------|------|--------------------------------------------|
| 01 | `01-principios-de-seguridad` | Zero Trust, mínimo privilegio, defensa en profundidad, cifra todo, rotación de claves, "no inventes tu cripto" + analogía (cerraduras de una casa). |
| 02 | `02-que-es-un-hash` | Definición, huella digital, propiedades (determinista, unidireccional, longitud fija, avalancha, colisiones), ejemplo hashlib con 3 salidas, analogía (huella dactilar/mezcladora). |
| 03 | `03-md5-sha1-sha256` | Tabla comparativa, hash de archivo (integridad), "nunca uses MD5/SHA1 para seguridad", SHA512. |
| 04 | `04-hash-de-contrasenas` | Be the code registro/login, nunca almacenar la original, traza paso a paso. |
| 05 | `05-hash-con-sal` | Problema hashes idénticos, salt con os.urandom(16), guardar salt+hash, login recuperando salt, tablas rainbow, Pool Puzzle. |
| 06 | `06-cifrado-cesar` | César (historia), cifrar/descifrar, `% 26`, mayúsculas/minúsculas, Be the code paso a paso "Krod Pxqgr", fuerza bruta (25 desplazamientos). |
| 07 | `07-hash-vs-cifrado` | 🔥 Fireside Chat / 🥊 ring Hash vs Cifrado (integridad vs confidencialidad), moraleja. |
| 08 | `08-buenas-practicas-y-verificacion` | Verificación de integridad (checksum de descargas), cuándo hash y cuándo cifrado, Aprieta el lápiz (5 ejercicios con solución en details). |
| 09 | `09-head-first` | ⭐ Sé el Código (mini sistema hash+sal completo), 🕵️ ¿Quién Soy?, 🤬 CONRAD VS EL MUNDO, ⚡ Laboratorio de Tortura (fallo intencionado: hash sin sal), 🧠 Atrévete a Pensar, 🧩 Crucigrama de Bits, 💬 Entrevista de trabajo, 🤷 No hay preguntas tontas, 🎬 Post-Créditos → "PRÓXIMAMENTE EN U09 (Cifrado Moderno)", ✅ CEs RA5. |

## Boletines

**`boletines/boletin-U08-inicial.md`** (8 ejercicios) — conservar y renumerar los 3 de `inicial-*` (SHA1 de tu nombre, MD5 de una frase, Compara Hola vs hola) + 5 nuevos de la misma dificultad (p.ej. longitud de hash, hash de archivo simple, César sencillo, descifrar César, hash determinista).

**`boletines/boletin-U08-inicial-resuelto.md`** — idéntica numeración con soluciones (reaprovechar `inicial-resuelto-*`).

**`boletines/boletin-U08-avanzado.md`** (9 ejercicios) — conservar y renumerar intermedio (hash de archivo de texto, César con espacios, descifrado may/min) + extra (verificador de integridad, fuerza bruta César, hash con salt, comparación de avalancha, velocidad de hashes, mini gestor de contraseñas). Pistas solo en esta versión.

**`boletines/boletin-U08-avanzado-resuelto.md`** — idéntica numeración con soluciones (reaprovechar `intermedio-resuelto-*` + resolver los extra).

## Formato de ficheros

- Índice `08-hash-y-cifrado-clasico.md`: frontmatter `title: "U08 — Hash y Cifrado Clásico"` + `description` con emoji 🔐 + `nav_order: 08`; ruta del viaje; 🎯 objetivo; 🗺️ mapa de 9 puntos enlazados; enlaces a 4 boletines con clases `ejercicio-links`/`elink`; ✅ tabla CEs; 🚪 ¿Por dónde empiezo?.
- Puntos `08-hash-y-cifrado-clasico/0X-….md`: breadcrumb `> 🗺️ **Estás en:** U08 → 0X`; cierre "Volver al índice de la unidad" + Anterior/Siguiente.
- Boletines: enlaces con slug en minúscula (`/boletines/boletin-u08-inicial/`), soluciones en `<details>`, `**Pista:**` solo en por resolver.

## Verificación

- YAML frontmatter válido (node + js-yaml, regex CRLF `/^---\r?\n/`, bad=0).
- Navegación: todos los puntos → "Siguiente" llega a su destino; 09 → "Volver al índice".
- `rtk npm run build` sin errores; conteo de páginas de `dist/` sube respecto a antes del lote.
- Revisión visual en preview (sidebar: U08 → grupo índice+puntos; grupo Boletines con 4 entradas).