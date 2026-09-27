---
title: "05 — Cifrado simétrico (AES)"
description: "Una clave o un par, AES con cryptography, modos de operación 🗝️"
---

<p><small>Una clave o un par, AES con cryptography, modos de operación 🗝️</small></p>

> 🗺️ **Estás en:** 🔐 **UD 9 · Seguridad y cifrado** → 05 · Cifrado simétrico (AES)

---

## 📬 La idea en una frase

> El cifrado **simétrico** usa **una sola clave** para cifrar y descifrar; el **asimétrico** usa un **par de claves** (pública + privada). **AES** es el simétrico moderno por excelencia: rápido, auditado y con modos para cada necesidad.

---

## 🗝️ Cifrado simétrico: una sola clave

Todo el mundo con una llave abre la misma cerradura. El **mismo secreto** sirve para cifrar y para descifrar.


![Diagrama del cifrado simétrico AES: Ana cifra con la clave K y Bob descifra con la misma clave; la clave nunca viaja](/ApuntesPSP/diagrams/aes-simetrico.svg)

- ✅ **Rapidez:** cifra cantidades enormes en milisegundos.
- ❌ **El problema:** ¿cómo le haces llegar la clave K a Bob sin que nadie la intercepte? Ese es el *problema de la distribución de claves*.

---

## 🗝️ Cifrado asimétrico: el par público/privado

Dos claves: una **pública** (todos pueden verla) y una **privada** (solo tú).


**La regla de oro de las claves:**

| Operación | ¿Qué clave usas? |
|---|---|
| Cifrar **para** alguien | La clave **pública** de esa persona |
| Descifrar | Tu clave **privada** |
| Firmar | Tu clave **privada** |
| Verificar una firma | La clave **pública** del firmante |

---

## ⚖️ AES vs RSA

| Característica | AES (simétrico) | RSA (asimétrico) |
|----------------|-----|-----|
| Claves | Una | Dos (pública + privada) |
| Velocidad | Rápido (~1GB/s) | Lento (~1MB/s) |
| Tamaño máximo | Ilimitado | ~190 bytes (con 2048 bits) |
| Distribución de clave | Problema | Fácil |

> ⚠️ RSA no sirve para cifrar mensajes grandes. Para eso necesitas **cifrado híbrido** (punto 8).

---

## 🧩 Componentes de AES

Cuando cifras con AES en modo GCM, lo que viaja por la red es **más que el texto cifrado**:

| Componente | Descripción | ¿Se envía? |
|------------|-------------|------------|
| **Clave** | 16, 24 o 32 bytes (AES-128/192/256) | ❌ Secreto |
| **Nonce** | Número aleatorio único | ✅ Se envía con el cifrado |
| **Tag** | Código de autenticación (integridad) | ✅ Se envía |
| **Texto cifrado** | El mensaje cifrado | ✅ Se envía |

---

## 🐍 AES con `cryptography`

Instala la biblioteca (la más usada en Python para criptografía moderna):

```bash
pip install cryptography
```

**Cifrar y descifrar un mensaje:**

```python
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
import os

# Generar clave (32 bytes = 256 bits)
clave = AESGCM.generate_key(bit_length=256)

# Cifrar
nonce = os.urandom(12)  # 12 bytes para GCM
aesgcm = AESGCM(clave)
mensaje = b"Mensaje secreto"
texto_cifrado = aesgcm.encrypt(nonce, mensaje, None)

print(f"Original: {mensaje}")
print(f"Cifrado (hex): {texto_cifrado.hex()}")
print(f"Nonce: {nonce.hex()}")

# Descifrar
aesgcm2 = AESGCM(clave)
texto_descifrado = aesgcm2.decrypt(nonce, texto_cifrado, None)
print(f"Descifrado: {texto_descifrado}")
```

```
Original: b'Mensaje secreto'
Cifrado (hex): 7f2e9b1a4c6d8e0f...
Nonce: 4f3a2b1c9d8e7f6a...
Descifrado: b'Mensaje secreto'
```

> AES es **simétrico**: misma clave para cifrar y descifrar. El problema es compartir esa clave de forma segura (RSA lo resuelve en el [punto 6](/ApuntesPSP/08-seguridad-y-cifrado/06-cifrado-asimetrico-rsa) y el [punto 8](/ApuntesPSP/08-seguridad-y-cifrado/08-cifrado-hibrido-y-practica)).

Si alguien manipula el cifrado, `decrypt` lanza una excepción. Es la integridad dentro del cifrado.

---

## ⛓️ Modos de operación: ECB, CBC, GCM

AES cifra de 16 en 16 bytes. El **modo** decide cómo se encadenan esos bloques:

| Modo | ¿Autentica? | ¿IV/nonce? | ¿Padding? | Veredicto |
|---|---|---|---|---|
| **ECB** | ❌ | ❌ | Sí | ⚠️ Evitar: muestra patrones |
| **CBC** | ❌ | ✅ IV | Sí | ✅ Clásico y seguro |
| **GCM** | ✅ (tag) | ✅ Nonce | No | ✅ Moderno, cifra y autentica |

> ⚠️ **ECB es la trampa clásica.** Cifra cada bloque de forma independiente: mismo bloque de entrada → mismo bloque de salida. En imágenes o documentos con zonas repetidas, el patrón se ve a simple vista.

**GCM** es el recomendado: genera un **tag** que detecta cualquier manipulación. Con `cryptography`, se usa `AESGCM` que implementa GCM directamente.

---

## 🧠 Mini-chequeo

1. ¿Cuántos bytes de clave usa AES-256? ¿Y AES-128?
2. ¿Qué pasa si el receptor descifra sin el nonce correcto?
3. ¿Por qué no debes usar ECB con datos largos o repetitivos?

<details>
<summary>🔄 Respuestas</summary>

1. AES-256 usa **32 bytes** (256 bits); AES-128 usa **16 bytes**.
2. No obtiene el mensaje original: el nonce forma parte del proceso de descifrado. Por eso se **envía junto al cifrado**.
3. Porque **bloques de entrada iguales producen bloques cifrados iguales**: en imágenes o documentos con zonas repetidas el patrón se ve. ECB no mezcla cada bloque con el anterior.
</details>

---

## ✅ Resumen en 3 frases

- El **simétrico** (AES) usa una clave, es rapidísimo y sirve para el volumen; el **asimétrico** (RSA) usa un par de claves y resuelve el reparto.
- Con `cryptography`, AES usa `AESGCM` con `encrypt`/`decrypt` y un nonce de 12 bytes.
- Para esta unidad, **GCM** te da cifrado + integridad en una sola operación.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| AES | Advanced Encryption Standard: cifrado simétrico estándar |
| Nonce | Número aleatorio único que viaja con el cifrado |
| Tag | Código de autenticación que detecta manipulaciones |
| Modo GCM | Modo autenticado: cifra y genera tag de integridad |
| ECB | Modo inseguro: cada bloque se cifra solo (patrones visibles) |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/08-seguridad-y-cifrado) · **Anterior:** [04 · Cifrado clásico](/ApuntesPSP/08-seguridad-y-cifrado/04-cifrado-clasico) · **Siguiente:** [06 · Cifrado asimétrico (RSA)](/ApuntesPSP/08-seguridad-y-cifrado/06-cifrado-asimetrico-rsa)
