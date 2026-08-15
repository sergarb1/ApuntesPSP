---
title: 03 — MD5, SHA-1 y SHA-256
description: Cuál elegir y por qué algunos ya no sirven 🧮
---

<p><small>Cuál elegir y por qué algunos ya no sirven 🧮</small></p>

> 🗺️ **Estás en:** 🔐 **U08 · Hash y Cifrado Clásico** → 03 · MD5, SHA-1 y SHA-256

---

## 📬 La idea en una frase

> No todos los hash son iguales: **MD5 y SHA-1 están rotos** (se pueden fabricar colisiones) y solo sirven para checksums no críticos; **SHA-256 y SHA-512 son los seguros** para todo uso general.

En el [punto 2](/ApuntesPSP/08-hash-y-cifrado-clasico/02-que-es-un-hash) aprendiste qué es un hash. Ahora toca elegir: la familia SHA-2 (SHA-256, SHA-512) es hoy el estándar de oro, y `hashlib` te la da gratis.

---

## ⚖️ La tabla comparativa

| Algoritmo | Bits | ¿Seguro? | Uso recomendado |
|-----------|------|----------|-----------------|
| **MD5** | 128 | ❌ No | Solo checksums no críticos |
| **SHA-1** | 160 | ❌ No | Solo legacy |
| **SHA-256** | 256 | ✅ Sí | Todo uso general |
| **SHA-512** | 512 | ✅ Sí | Cuando necesites más seguridad |

**El porqué de cada fila:**

- **MD5 (1992)** — Durante décadas fue el rey, hasta que en 2004 se demostraron **colisiones prácticas**: es posible fabricar dos archivos distintos con el mismo MD5. Un atacante puede hacer que un programa legítimo y otro malicioso tengan el mismo hash. Roto.
- **SHA-1 (1995)** — Heredó el trono… y en 2017 el equipo de Google logró la primera **colisión real** (dos PDFs distintos, mismo SHA-1). Roto también.
- **SHA-256 / SHA-512 (familia SHA-2, 2001)** — A día de hoy siguen en pie: no se conoce forma práctica de forzarlos. Son los que ves en las descargas de software, los certificados TLS y las cadenas de bloques.
- **SHA-512** — Mismo algoritmo que SHA-256 pero con resumen de 512 bits: más margen futuro, a costa de ser algo más lento (en el [boletín avanzado](/ApuntesPSP/boletines/boletin-u08-avanzado) lo medirás).

> ⚠️ **Nunca uses MD5 o SHA-1 para seguridad**. Son vulnerables a colisiones. Usa SHA-256 o superior. La única excepción es un checksum casual para detectar corrupción accidental (no ataques).

---

## 📄 Hash de un archivo: verificar integridad

La aplicación más cotidiana del hash es comprobar que un archivo no se ha corrompido ni manipulado. La página de descarga te da su SHA-256; tú calculas el del archivo que has descargado y comparas:

```python
import hashlib

# Hash de un archivo (verificar integridad)
with open("archivo.pdf", "rb") as f:
    hash_archivo = hashlib.sha256(f.read()).hexdigest()
    print(f"SHA256 del archivo: {hash_archivo}")
```

**Salida** (depende del archivo):
```
SHA256 del archivo: 8a1f9c…  (64 caracteres hexadecimales)
```

Dos detalles importantes:

- Se abre en modo binario **`"rb"`** porque queremos el hash de los bytes exactos, sin conversión de texto.
- **Un solo bit cambiado en el archivo → un hash completamente distinto** (efecto avalancha del [punto 2](/ApuntesPSP/08-hash-y-cifrado-clasico/02-que-es-un-hash)). Por eso un checksum te dice si el archivo es *exactamente* el que publicó el autor.

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
SHA512: 34ddb0edac59e441459e07cf33bd628f53fbbf752141125f069f32081b169f933666c71b2f1b83031da66bc905a1e72af7c6cfd779fc197513639a098f94c641
```

Fíjate: SHA-512 devuelve **128 caracteres** hexadecimales (512 bits), el doble que SHA-256.

---

## 🧠 Mini-chequeo

1. ¿Por qué MD5 y SHA-1 no sirven para seguridad?
2. ¿En qué caso seguirías usando MD5 hoy?
3. ¿Para qué abre un archivo en modo `"rb"` cuando calculas su hash?

<details>
<summary>🔄 Respuestas</summary>

1. Porque se han demostrado **colisiones prácticas**: es posible fabricar dos archivos distintos con el mismo hash, rompiendo la garantía de integridad.
2. Solo como **checksum no crítico** para detectar corrupción accidental (un fichero que se corrompió al copiarse), nunca frente a un atacante.
3. Para hashear los **bytes exactos** del archivo. Si lo abres en modo texto, Python podría reinterpretar caracteres y el hash no correspondería al del archivo original.
</details>

---

## ✅ Resumen en 3 frases

- MD5 y SHA-1 tienen colisiones demostradas: **rotos para seguridad**; SHA-256/SHA-512 son hoy los fiables.
- El hash de un archivo (`open(..., "rb")` + `sha256().hexdigest()`) es el checksum con el que verificas que una descarga no fue manipulada.
- Cambia solo el nombre de la función en `hashlib` para pasar de 256 a 512 bits.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| Colisión | Dos entradas distintas con el mismo hash |
| Checksum | Hash de un archivo para verificar integridad |
| SHA-2 | Familia segura: SHA-256 y SHA-512 |
| Legacy | Código antiguo que se mantiene pero no se usa en nada nuevo |
| Modo binario "rb" | Lectura de bytes exactos, necesaria para hashear archivos |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/08-hash-y-cifrado-clasico) · **Anterior:** [02 · Qué es un hash](/ApuntesPSP/08-hash-y-cifrado-clasico/02-que-es-un-hash) · **Siguiente:** [04 · Hash de contraseñas](/ApuntesPSP/08-hash-y-cifrado-clasico/04-hash-de-contrasenas)