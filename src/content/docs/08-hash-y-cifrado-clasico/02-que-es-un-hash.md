---
title: 02 — Qué es un hash
description: La huella digital de cualquier dato 🔍
---

<p><small>La huella digital de cualquier dato 🔍</small></p>

> 🗺️ **Estás en:** 🔐 **U08 · Hash y Cifrado Clásico** → 02 · Qué es un hash

---

## 📬 La idea en una frase

> Un **hash** es una función que convierte cualquier entrada (un texto, un archivo, una contraseña) en una cadena de **longitud fija**, y lo hace de forma **unidireccional**: no se puede revertir.

Piensa en una **huella dactilar**: aunque conozcas la huella, no puedes reconstruir el dedo. El hash funciona igual: conoces la huella digital del dato, pero el dato original es irrecuperable.

---

## 👣 La huella digital

Un hash toma un mensaje de cualquier tamaño y devuelve un resumen de tamaño fijo:

```
"a"                        → ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb   (SHA-256)
"Hola mundo"               → ca8f60b2cc7f05837d98b208b57fb6481553fc5f1219d59618fd025002a66f5c   (SHA-256)
"En un lugar de la Mancha" → e6ff77084bec551e5c5ae84a1b44d4eed6dd9cabf86bea2abbfd510230bb3ec7   (SHA-256)
```

Fíjate en la clave: da igual que la entrada tenga 1 carácter o 1 millón, el hash **siempre tiene la misma longitud** (64 caracteres en SHA-256). Eso lo convierte en una herramienta ideal para comprobar que "esto que me han enviado es exactamente lo que esperaba".

---

## 🐍 Hash en Python: tres sabores

Con el módulo `hashlib` (de la librería estándar, sin instalar nada) puedes calcular hashes de cualquier texto:

```python
import hashlib

texto = b"Hola mundo"

print("MD5:", hashlib.md5(texto).hexdigest())
print("SHA1:", hashlib.sha1(texto).hexdigest())
print("SHA256:", hashlib.sha256(texto).hexdigest())
```

**Salida**:
```
MD5: f822102f4515609fc31927a84c6db7f8
SHA1: c083106c930790151165b95bd11860724e3836cb
SHA256: ca8f60b2cc7f05837d98b208b57fb6481553fc5f1219d59618fd025002a66f5c
```

Nota la diferencia de longitudes: MD5 devuelve **32** caracteres (128 bits), SHA1 **40** (160 bits) y SHA256 **64** (256 bits). En el [punto 3](/ApuntesPSP/08-hash-y-cifrado-clasico/03-md5-sha1-sha256) decides cuál usar.

> 💡 El `b` antes del texto lo convierte a **bytes**, que es lo que espera `hashlib`. Si tienes un `str`, usa `.encode()`.

---

## 🥤 La analogía de la licuadora

Un hash es como una licuadora: metes lo que sea (una manzana, un ladrillo, un contrato) y siempre sale **batido**. Pero es un batido **unidireccional**: nadie puede reconstruir la manzana a partir del zumo. Añade la propiedad clave: si cambias una sola brizna de la entrada, el batido cambia por completo (eso es el **efecto avalancha**, que verás abajo).

---

## 📐 Las cinco propiedades del hash

- **Determinista**: misma entrada → mismo hash. Siempre. Da igual cuántas veces lo calcules.
- **Unidireccional**: no se puede obtener el original a partir del hash.
- **Longitud fija**: MD5 = 128 bits, SHA1 = 160 bits, SHA256 = 256 bits, pase lo que pase con la entrada.
- **Efecto avalancha**: un cambio mínimo (una letra, un bit) cambia el hash **por completo**.
- **Colisiones**: dos entradas diferentes con el mismo hash. En teoría posibles, en la práctica **casi imposibles** en SHA-256 (harían falta más intentos que átomos en el universo).

La propiedad estrella para la seguridad es la **unidireccionalidad**: por eso en el [punto 4](/ApuntesPSP/08-hash-y-cifrado-clasico/04-hash-de-contrasenas) guardaremos contraseñas como hash, y no como texto plano.

---

## 🧠 Mini-chequeo

1. ¿Qué longitud tiene un hash SHA-256 expresado en hexadecimal? ¿Y en bits?
2. Calcula el hash SHA-256 de "Hola mundo". ¿Qué pasa si cambias una letra?
3. ¿Por qué "unidireccional" es la propiedad más importante para guardar contraseñas?

<details>
<summary>🔄 Respuestas</summary>

1. **64 caracteres** hexadecimales = **256 bits** (cada carácter hex son 4 bits: 64 × 4 = 256).
2. `ca8f60b2cc7f05837d98b208b57fb6481553fc5f1219d59618fd025002a66f5c`. Si cambias una letra, el hash cambia por completo (**efecto avalancha**); pruébalo en el boletín inicial con "Hola" y "hola".
3. Porque si alguien roba la base de datos, no puede obtener las contraseñas a partir de los hashes: son **huellas irreversibles**. La única forma de "romper" un hash es adivinando (fuerza bruta o tablas rainbow, que verás en el [punto 5](/ApuntesPSP/08-hash-y-cifrado-clasico/05-hash-con-sal)).
</details>

---

## ✅ Resumen en 3 frases

- Un hash convierte cualquier entrada en una huella de **longitud fija**, siempre la misma para la misma entrada.
- Es **unidireccional** (irreversible), con **efecto avalancha** ante cambios mínimos y colisiones prácticamente imposibles en SHA-256.
- `hashlib.md5/sha1/sha256(texto).hexdigest()` te da la huella en una línea.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| Hash | Función que resume cualquier dato en una cadena fija |
| Unidireccional | Imposible de revertir |
| Efecto avalancha | Un bit de cambio altera todo el hash |
| Colisión | Dos entradas con el mismo hash |
| hexdigest() | Convierte el hash a texto hexadecimal legible |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/08-hash-y-cifrado-clasico) · **Anterior:** [01 · Principios de seguridad](/ApuntesPSP/08-hash-y-cifrado-clasico/01-principios-de-seguridad) · **Siguiente:** [03 · MD5, SHA-1 y SHA-256](/ApuntesPSP/08-hash-y-cifrado-clasico/03-md5-sha1-sha256)
