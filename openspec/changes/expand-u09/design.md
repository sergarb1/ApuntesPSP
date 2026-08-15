# design — expand-u09

## Contexto

- Unidad fuente: `src/content/docs/09-cifrado-moderno.md` (~380 líneas) + 5 boletines planos.
- Precedente de formato: ApuntesRedes `09-routing-dinamico/`. Estilo Head First. Emoji: 🧬. RA5.
- Slugs en minúscula (`boletin-u09-inicial`).

## Contenido a repartir

simétrico vs asimétrico (tabla), AES con pycryptodome (AESejemplo.py, Generador_de_claves.py),
modos ECB vs CBC vs GCM, RSA (generar claves, cifrar/descifrar), firmas digitales
(FirmarRSA.py, VerificarRSA.py), cifrado híbrido AES+RSA, RBAC y roles, práctica (mini
sistema seguro), ring simétrico vs asimétrico, preguntas tontas, Aprieta el lápiz, CEs RA5.

## Plan de puntos

| Punto | Slug | Contenido |
|-------|------|-----------|
| 01 | `01-cifrado-simetrico-vs-asimetrico` | Tabla, una clave vs par, cuándo usar cada uno. |
| 02 | `02-aes` | AES con pycryptodome, cifrar/descifrar en memoria. |
| 03 | `03-modos-aes` | ECB vs CBC vs GCM, IV, tabla. |
| 04 | `04-rsa` | Generar par de claves, cifrar/descifrar con RSA. |
| 05 | `05-firmas-digitales` | Firmar y verificar, integridad + autenticidad. |
| 06 | `06-cifrado-hibrido` | Híbrido AES+RSA (cifrar la clave de sesión con RSA). |
| 07 | `07-rbac-y-roles` | RBAC, roles, mínimos privilegios. |
| 08 | `08-practica-sistema-seguro` | Mini sistema completo, Be the code, Aprieta el lápiz. |
| 09 | `09-head-first` | ⭐🔥🕵️🤬⚡🧠🧩💬🤷🎬, fallo intencionado, PRÓXIMAMENTE EN U10, ✅ CEs RA5. |

## Boletines

- **`boletin-U09-inicial`** (8): inicial-* + nuevos.
- **`boletin-U09-inicial-resuelto`** 1:1.
- **`boletin-U09-avanzado`** (≥8): intermedio-* + extra-* renumerados; pistas solo aquí.
- **`boletin-U09-avanzado-resuelto`** 1:1.

## Formato y verificación

Ídem expand-u01: índice U09/🧬, 9 puntos con breadcrumb y navegación, boletines con slug
minúscula y soluciones en `<details>`. Verificación: YAML bad=0, navegación,
`rtk npm run build`, visual, confirmación del usuario.