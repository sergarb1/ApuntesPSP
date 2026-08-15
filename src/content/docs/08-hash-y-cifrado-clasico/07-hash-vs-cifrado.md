---
title: 07 — Hash vs Cifrado
description: "El ring de los conceptos: integridad contra confidencialidad 🥊"
---

<p><small>El ring de los conceptos: integridad contra confidencialidad 🥊</small></p>

> 🗺️ **Estás en:** 🔐 **U08 · Hash y Cifrado Clásico** → 07 · Hash vs Cifrado

---

## 📬 La idea en una frase

> El **hash** y el **cifrado** no son rivales: son herramientas distintas para problemas distintos. El hash es **unidireccional** (integridad, contraseñas); el cifrado es **reversible** con clave (confidencialidad). Ambos son necesarios.

Ya has visto las dos piezas: el hash en los [puntos 2](/ApuntesPSP/08-hash-y-cifrado-clasico/02-que-es-un-hash) a 5 y el cifrado (César) en el [punto 6](/ApuntesPSP/08-hash-y-cifrado-clasico/06-cifrado-cesar). Ahora llega el momento de ponerlas frente a frente para que nunca las confundas. Y la mejor forma de hacerlo es con el clásico ring de la unidad.

---

## 🥊 El ring de los conceptos: Hash vs Cifrado

> *Dos mecanismos de seguridad se citan en el ring de los conceptos para resolver de una vez quién hace qué.*

**Hash**: — Yo soy la huella digital. Transformo cualquier texto en una cadena fija. No se puede deshacer. Unidireccional. Para siempre.

**Cifrado**: — Vaya, qué drástico. Yo puedo cifrar y descifrar. Tengo clave. Si tú pierdes un hash, no hay vuelta atrás. Yo puedo recuperar el mensaje original.

**Hash**: — ¡Esa es precisamente mi gracia! Para contraseñas no quieres que se pueda deshacer. Si alguien roba la base de datos, que se pegue con los hashes.

**Cifrado**: — Pero para enviar un mensaje secreto, el hash no sirve. Necesitas que el destinatario pueda leerlo. Ahí entro yo.

**Hash**: — Y para verificar integridad, nadie me gana. Un archivo, un hash. Si cambia un bit, el hash cambia por completo.

**Cifrado**: — Al final, cada uno a lo suyo. Tú para integridad y contraseñas; yo para confidencialidad.

---

## ⚖️ La moraleja: cada uno a lo suyo

| | Hash | Cifrado |
|---|---|---|
| **¿Qué hace?** | Resume en una huella de longitud fija | Transforma con una clave |
| **¿Reversible?** | ❌ No, unidireccional | ✅ Sí, con la clave |
| **Protege** | Integridad (y contraseñas) | Confidencialidad |
| **Ejemplo típico** | Checksum de descarga, login | Enviar un mensaje secreto |
| **Ejemplo en esta unidad** | SHA-256 de "clave123" | Cifrado César "Hola" → "Krod" |

> **Moraleja**: El hash verifica integridad (no se puede deshacer). El cifrado protege confidencialidad (se puede deshacer con la clave). Ambos son necesarios.

---

## 🎬 La escena que lo aclara todo

Imagina que envías un mensaje secreto por una red hostil:

- **Solo cifrado:** el mensaje llega cifrado, pero ¿y si un atacante lo modifica por el camino? El destinatario descifra un mensaje manipulado y no lo sabe. La confidencialidad estaba protegida; la **integridad, no**.
- **Solo hash:** puedes comprobar que el mensaje no cambió, pero cualquier persona que lo intercepte **lo lee tal cual**. La integridad estaba protegida; la **confidencialidad, no**.
- **Cifrado + hash:** cifras el mensaje (nadie lo lee) y además calculas su hash (el destinatario comprueba que nadie lo tocó). Así lo hacen de verdad los sistemas serios.

El cifrado moderno (AES y RSA) y las **firmas digitales** que verás en la [U09 · Cifrado Moderno](/ApuntesPSP/09-cifrado-moderno) combinan exactamente estas dos ideas.

---

## 🧠 Mini-chequeo

1. Si quieres que nadie pueda leer un mensaje, ¿qué necesitas: hash o cifrado?
2. Y si solo quieres comprobar que un archivo no fue manipulado, ¿qué usas?
3. ¿Por qué un hash sirve para guardar contraseñas y el cifrado no es la mejor opción ahí?

<details>
<summary>🔄 Respuestas</summary>

1. **Cifrado**: es reversible con la clave, así que el destinatario puede leerlo. El hash, al ser unidireccional, impediría que cualquiera (incluido el destinatario legítimo) recuperara el mensaje.
2. **Hash**: si el archivo cambia un bit, su hash cambia por completo (efecto avalancha). Comparar el hash calculado con el publicado por el autor verifica la integridad.
3. Porque para contraseñas no queremos recuperarlas nunca: solo comprobar que coinciden. El hash es unidireccional (perfecto); el cifrado es reversible y, si roban la clave, recuperan todo.
</details>

---

## ✅ Resumen en 3 frases

- El hash es **unidireccional**: verifica integridad y guarda contraseñas, pero no se puede deshacer.
- El cifrado es **reversible con clave**: protege la confidencialidad y permite recuperar el mensaje original.
- No se excluyen: en los sistemas reales se combinan (cifrar para esconder, hashear para verificar).

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| Integridad | Que un dato no ha sido modificado (hash) |
| Confidencialidad | Que solo quien corresponde lo lea (cifrado) |
| Unidireccional | Imposible de revertir, propia del hash |
| Reversible con clave | Se deshace con la clave correcta, propia del cifrado |
| Firma digital | Combinación de hash + cifrado (lo verás en U09) |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/08-hash-y-cifrado-clasico) · **Anterior:** [06 · Cifrado César](/ApuntesPSP/08-hash-y-cifrado-clasico/06-cifrado-cesar) · **Siguiente:** [08 · Buenas prácticas y verificación](/ApuntesPSP/08-hash-y-cifrado-clasico/08-buenas-practicas-y-verificacion)