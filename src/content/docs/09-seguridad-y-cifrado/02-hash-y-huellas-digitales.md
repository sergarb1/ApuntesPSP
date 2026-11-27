---
title: "02 — Hash y huellas digitales"
description: "La huella digital de cualquier dato, MD5, SHA-1, SHA-256 y SHA-512 🔍"
---

<p><small>La huella digital de cualquier dato, MD5, SHA-1, SHA-256 y SHA-512 🔍</small></p>

> 🗺️ **Estás en:** 🔐 **UD 10 · Seguridad y cifrado** → 02 · Hash y huellas digitales

---

## 📬 La idea en una frase

> Un **hash** es una función que convierte cualquier entrada (un texto, un archivo, una contraseña) en una cadena de **longitud fija**, y lo hace de forma **unidireccional**: no se puede revertir. Pero no todos los hash son iguales: **MD5 y SHA-1 están rotos** y solo sirven para checksums no críticos; **SHA-256 y SHA-512 son los seguros**.

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

Nota la diferencia de longitudes: MD5 devuelve **32** caracteres (128 bits), SHA1 **40** (160 bits) y SHA256 **64** (256 bits).

> 💡 El `b` antes del texto lo convierte a **bytes**, que es lo que espera `hashlib`. Si tienes un `str`, usa `.encode()`.

---

## ⚖️ La tabla comparativa

| Algoritmo | Bits | ¿Seguro? | Uso recomendado |
|-----------|------|----------|-----------------|
| **MD5** | 128 | ❌ No | Solo checksums no críticos |
| **SHA-1** | 160 | ❌ No | Solo legacy |
| **SHA-256** | 256 | ✅ Sí | Todo uso general |
| **SHA-512** | 512 | ✅ Sí | Cuando necesites más seguridad |

**El porqué de cada fila:**

- **MD5 (1992)** — Durante décadas fue el rey, hasta que en 2004 se demostraron **colisiones prácticas**: es posible fabricar dos archivos distintos con el mismo MD5. Roto.
- **SHA-1 (1995)** — Heredó el trono… y en 2017 el equipo de Google logró la primera **colisión real** (dos PDFs distintos, mismo SHA-1). Roto también.
- **SHA-256 / SHA-512 (familia SHA-2, 2001)** — A día de hoy siguen en pie: no se conoce forma práctica de forzarlos. Son los que ves en las descargas de software, los certificados TLS y las cadenas de bloques.

> ⚠️ **Nunca uses MD5 o SHA-1 para seguridad**. Son vulnerables a colisiones. Usa SHA-256 o superior. La única excepción es un checksum casual para detectar corrupción accidental (no ataques).

---

## 📄 Hash de un archivo: verificar integridad

La aplicación más cotidiana del hash es comprobar que un archivo no se ha corrompido ni manipulado:

```python
import hashlib

# Hash de un archivo (verificar integridad)
with open("archivo.pdf", "rb") as f:
    hash_archivo = hashlib.sha256(f.read()).hexdigest()
    print(f"SHA256 del archivo: {hash_archivo}")
```

Dos detalles importantes:

- Se abre en modo binario **`"rb"`** porque queremos el hash de los bytes exactos, sin conversión de texto.
- **Un solo bit cambiado en el archivo → un hash completamente distinto** (efecto avalancha). Por eso un checksum te dice si el archivo es *exactamente* el que publicó el autor.

---

## 🐍 SHA-512 en acción

Si necesitas más margen, el código es idéntico cambiando el nombre:

```python
import hashlib

texto = b"Hola mundo"

print("SHA256:", hashlib.sha256(texto).hexdigest())
print("SHA512:", hashlib.sha512(texto).hexdigest())
```

**Salida**:
```
SHA256: ca8f60b2cc7f05837d98b208b57fb6481553fc5f1219d59618fd025002a66f5c
SHA512: 34ddb0edac59e441459e07cf33bd628f53fbbf752141125f069f32081b169f93...
```

---

## 📐 Las cinco propiedades del hash

- **Determinista**: misma entrada → mismo hash. Siempre.
- **Unidireccional**: no se puede obtener el original a partir del hash.
- **Longitud fija**: MD5 = 128 bits, SHA1 = 160 bits, SHA256 = 256 bits, pase lo que pase con la entrada.
- **Efecto avalancha**: un cambio mínimo (una letra, un bit) cambia el hash **por completo**.
- **Colisiones**: dos entradas diferentes con el mismo hash. En teoría posibles, en la práctica **casi imposibles** en SHA-256.

---

## 🧠 Mini-chequeo

1. ¿Qué longitud tiene un hash SHA-256 expresado en hexadecimal? ¿Y en bits?
2. ¿Por qué MD5 y SHA-1 no sirven para seguridad?
3. ¿Por qué "unidireccional" es la propiedad más importante para guardar contraseñas?

<details>
<summary>🔄 Respuestas</summary>

1. **64 caracteres** hexadecimales = **256 bits** (cada carácter hex son 4 bits: 64 × 4 = 256).
2. Porque se han demostrado **colisiones prácticas**: es posible fabricar dos archivos distintos con el mismo hash, rompiendo la garantía de integridad.
3. Porque si alguien roba la base de datos, no puede obtener las contraseñas a partir de los hashes: son **huellas irreversibles**. La única forma de "romper" un hash es adivinando (fuerza bruta o tablas rainbow, que verás en el [punto 3](/ApuntesPSP/09-seguridad-y-cifrado/03-contrasenas-seguras)).
</details>

---

## ✅ Resumen en 3 frases

- Un hash convierte cualquier entrada en una huella de **longitud fija**, siempre la misma para la misma entrada.
- MD5 y SHA-1 tienen colisiones demostradas: **rotos para seguridad**; SHA-256/SHA-512 son hoy los fiables.
- `hashlib.md5/sha1/sha256(texto).hexdigest()` te da la huella en una línea.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| Hash | Función que resume cualquier dato en una cadena fija |
| Unidireccional | Imposible de revertir |
| Efecto avalancha | Un bit de cambio altera todo el hash |
| Colisión | Dos entradas con el mismo hash |
| Checksum | Hash de un archivo para verificar integridad |
| SHA-2 | Familia segura: SHA-256 y SHA-512 |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/09-seguridad-y-cifrado) · **Anterior:** [01 · Principios de seguridad](/ApuntesPSP/09-seguridad-y-cifrado/01-principios-de-seguridad) · **Siguiente:** [03 · Contraseñas seguras](/ApuntesPSP/09-seguridad-y-cifrado/03-contrasenas-seguras)
