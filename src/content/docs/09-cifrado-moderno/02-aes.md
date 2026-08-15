---
title: 02 — AES
description: El cifrado simétrico moderno con pycryptodome 🔐
---

<p><small>El cifrado simétrico moderno con pycryptodome 🔐</small></p>

> 🗺️ **Estás en:** 🧬 **U09 · Cifrado Moderno** → 02 · AES

---

## 📬 La idea en una frase

> **AES** es el cifrado simétrico moderno por excelencia: con una sola clave (de 16, 24 o 32 bytes) cifra y descifra a ~1 GB/s. Con `pycryptodome`, cifrar un mensaje es cifrar con la clave y enviar, junto al texto cifrado, el **nonce** y el **tag**.

Es el *estándar de oro* del cifrado simétrico: lo usa tu disco cifrado, tu conexión HTTPS, tu tarjeta bancaria y los chats cifrados. Rápido, auditado y con modos para cada necesidad (los verás en el [punto 3](/ApuntesPSP/09-cifrado-moderno/03-modos-aes)).

---

## 🧩 Componentes de AES

Cuando cifras con AES en modo EAX, lo que viaja por la red es **más que el texto cifrado**:

| Componente | Descripción | ¿Se envía? |
|------------|-------------|------------|
| **Clave** | 16, 24 o 32 bytes (AES-128/192/256) | ❌ Secreto |
| **Nonce** | Número aleatorio único | ✅ Se envía con el cifrado |
| **Tag** | Código de autenticación (integridad) | ✅ Se envía |
| **Texto cifrado** | El mensaje cifrado | ✅ Se envía |

```
Paquete enviado: [nonce 16B | tag 16B | cifrado ...]
```

- El **nonce** (*number used once*) hace que dos cifrados del mismo mensaje con la misma clave den resultados distintos. El receptor lo necesita para descifrar.
- El **tag** es el código de autenticación: si alguien manipula el cifrado, el tag no coincide y el descifrado falla. Es la integridad (U08) dentro del cifrado.

> 🔑 La **clave** no viaja jamás en ese paquete: el receptor ya la tiene (o la recibe por otro canal, como verás en el [cifrado híbrido](/ApuntesPSP/09-cifrado-moderno/06-cifrado-hibrido)).

---

## 🐍 AES con pycryptodome

Instala la biblioteca (la más usada en Python para criptografía):

```bash
pip install pycryptodome
```

**Cifrar y descifrar un mensaje:**

```python
from Crypto.Cipher import AES
from Crypto.Random import get_random_bytes

# Generar clave (32 bytes = 256 bits)
clave = get_random_bytes(32)

# Cifrar
cifrador = AES.new(clave, AES.MODE_EAX)
mensaje = b"Mensaje secreto"
texto_cifrado, tag = cifrador.encrypt_and_digest(mensaje)

print(f"Original: {mensaje}")
print(f"Cifrado (hex): {texto_cifrado.hex()}")
print(f"Nonce: {cifrador.nonce.hex()}")

# Descifrar
cifrador2 = AES.new(clave, AES.MODE_EAX, nonce=cifrador.nonce)
texto_descifrado = cifrador2.decrypt(texto_cifrado)
print(f"Descifrado: {texto_descifrado}")
```

```
Original: b'Mensaje secreto'
Cifrado (hex): 7f2e9b1a4c6d8e0f...
Nonce: 4f3a2b1c9d8e7f6a...
Descifrado: b'Mensaje secreto'
```

> AES es **simétrico**: misma clave para cifrar y descifrar. El problema es compartir esa clave de forma segura (el [punto 4](/ApuntesPSP/09-cifrado-moderno/04-rsa) y el [punto 6](/ApuntesPSP/09-cifrado-moderno/06-cifrado-hibrido) lo resuelven).

**Para verificar la integridad** del descifrado usa `decrypt_and_verify` en lugar de `decrypt`: si el tag no coincide, lanza una excepción (alguien manipuló el mensaje).

---

## 🎭 Be the code, my friend — AES paso a paso

> "Ana quiere enviar un mensaje a Bob. Traza cada byte."

```
🔵 ANA (emisora)

1. Tiene el mensaje: "Nos vemos a las 8"
2. Genera clave AES: get_random_bytes(32) → b'\xa1\xb2\xc3...' (32 bytes)
3. Crea cifrador AES modo EAX
   → AES.new(clave, AES.MODE_EAX)
   → Genera nonce automáticamente: b'\x4f\x3a...' (16 bytes)

4. Cifra:
   → encrypt_and_digest(b"Nos vemos a las 8")
   → Devuelve (texto_cifrado, tag)
   → texto_cifrado = b'\x7f\xe2...' (ilegible)
   → tag = b'\x1a\xb2...' (16 bytes)

5. Envía a Bob: nonce + tag + texto_cifrado
   ┌──────────────────────────────────────┐
   │ nonce (16B) │ tag (16B) │ cifrado    │
   │ \x4f\x3a...  │ \x1a\xb2...  │ \x7f\xe2... │
   └──────────────────────────────────────┘

🟢 BOB (receptor)

6. Recibe: nonce = primeros 16 bytes
            tag = siguientes 16 bytes
            cifrado = resto

7. AES.new(clave, AES.MODE_EAX, nonce=recibido)
8. decrypt_and_verify(cifrado)
   → Si el tag coincide → datos íntegros ✅
   → Si no → lanza excepción (alguien manipuló el mensaje)

9. Bob lee: "Nos vemos a las 8" 🏁
```

---

## 🧠 Mini-chequeo

1. ¿Cuántos bytes de clave usa AES-256? ¿Y AES-128?
2. ¿Qué pasa si el receptor descifra sin el nonce correcto?
3. ¿Para qué sirve el tag? ¿Qué pasa si no se verifica?

<details>
<summary>🔄 Respuestas</summary>

1. AES-256 usa **32 bytes** (256 bits); AES-128 usa **16 bytes**. AES-192 usa 24. El bloque de AES siempre es de **16 bytes**.
2. No obtiene el mensaje original: el nonce forma parte del proceso de descifrado. Por eso se **envía junto al cifrado** (son los primeros 16 bytes del paquete).
3. El tag verifica la **integridad**: si el mensaje fue manipulado, el tag no coincide y `decrypt_and_verify` lanza una excepción. Es la protección frente a alteraciones.
</details>

---

## ✅ Resumen en 3 frases

- AES es el **cifrado simétrico moderno**: una clave de 16/24/32 bytes, rápido y seguro.
- En el paquete viajan **nonce + tag + cifrado**; la clave nunca viaja.
- Con `pycryptodome` cifras con `encrypt_and_digest` y descifras con el mismo nonce, verificando el tag.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| AES | Advanced Encryption Standard: cifrado simétrico estándar |
| Clave AES | 16 (AES-128), 24 (AES-192) o 32 (AES-256) bytes |
| Nonce | Número aleatorio único que viaja con el cifrado |
| Tag | Código de autenticación que detecta manipulaciones |
| encrypt_and_digest | Cifra y genera el tag de integridad a la vez |
| pycryptodome | La biblioteca de criptografía de Python que usarás en todo el tema |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/09-cifrado-moderno) · **Anterior:** [01 · Cifrado simétrico vs asimétrico](/ApuntesPSP/09-cifrado-moderno/01-cifrado-simetrico-vs-asimetrico) · **Siguiente:** [03 · Modos de AES](/ApuntesPSP/09-cifrado-moderno/03-modos-aes)