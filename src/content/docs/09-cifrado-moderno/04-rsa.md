---
title: 04 — RSA
description: Generar el par de claves y cifrar con la pública 🔑
---

<p><small>Generar el par de claves y cifrar con la pública 🔑</small></p>

> 🗺️ **Estás en:** 🧬 **U09 · Cifrado Moderno** → 04 · RSA

---

## 📬 La idea en una frase

> **RSA** es el cifrado asimétrico por excelencia: generas un **par de claves** (pública + privada), cifras con la **pública** del destinatario y solo su **privada** puede descifrar. Así se resuelve el problema de compartir la clave del cifrado simétrico.

Es lento y tiene límite de tamaño, pero hace algo que AES no puede: **distribuir secretos sin compartirlos**. Por eso es la pieza que reparte claves en HTTPS, el correo cifrado y las firmas digitales.

---

## 🗝️ Generar el par de claves

Con `pycryptodome`, generar 2048 bits es una línea:

```python
from Crypto.PublicKey import RSA

# Generar par de claves
clave_rsa = RSA.generate(2048)
privada = clave_rsa.export_key()
publica = clave_rsa.publickey().export_key()

# Las claves se exportan en formato PEM (texto legible)
print("Pública (PEM):")
print(publica.decode())
print("Privada (PEM):")
print(privada.decode())
```

```
Pública (PEM):
-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA...
-----END PUBLIC KEY-----
```

- La **pública** se puede compartir por cualquier sitio (es *pública*).
- La **privada** es secreto absoluto: quien la tenga puede descifrar todo lo que se cifre con tu pública y firmar en tu nombre.
- Generar claves RSA tarda **~1-2 segundos** (busca números primos enormes). AES genera su clave instantáneamente.

---

## 🔒 Cifrar con la pública, descifrar con la privada

```python
from Crypto.PublicKey import RSA
from Crypto.Cipher import PKCS1_OAEP

# Generar par de claves
clave_rsa = RSA.generate(2048)
privada = clave_rsa.export_key()
publica = clave_rsa.publickey().export_key()

# Cifrar con clave PÚBLICA
cifrador = PKCS1_OAEP.new(RSA.import_key(publica))
mensaje = b"Mensaje secreto para Bob"
texto_cifrado = cifrador.encrypt(mensaje)

# Descifrar con clave PRIVADA
descifrador = PKCS1_OAEP.new(RSA.import_key(privada))
texto_descifrado = descifrador.decrypt(texto_cifrado)
print(f"Descifrado: {texto_descifrado}")
```

```
Descifrado: b'Mensaje secreto para Bob'
```

**El flujo entre dos personas:**

```
🔵 ANA                               🟢 BOB
   │ 1. Pide la pública de Bob         │
   │◄──────────────────────────────────│
   │ 2. Cifra con PKCS1_OAEP(publica)  │
   ├───────────────────────────────────►│
   │   texto_cifrado                    │
   │                                   │ 3. Descifra con su PRIVADA
   │                                   │   → "Mensaje secreto para Bob" ✅
```

- **PKCS1_OAEP** es el esquema de relleno de RSA en `pycryptodome`: añade aleatoriedad al cifrado (el mismo mensaje cifrado dos veces da resultados distintos).
- Nadie más puede descifrar: ni quien intercepte el tráfico, ni quien tenga la pública. Solo la **privada de Bob**.

---

## ⚠️ El límite de RSA

RSA no cifra cualquier cosa:

- Con claves de 2048 bits, el tamaño máximo de mensaje es de **~190 bytes** (depende del relleno).
- La velocidad ronda **~1 MB/s**, frente a los ~1 GB/s de AES.

```
Intentar cifrar un mensaje de 300 bytes:
ValueError: Ciphertext with incorrect length.   ← RSA no puede con tanto
```

> 💡 Para mensajes largos, RSA cifra la **clave AES** (32 bytes) y AES cifra el mensaje completo. Ese es el **cifrado híbrido** del [punto 6](/ApuntesPSP/09-cifrado-moderno/06-cifrado-hibrido).

---

## 🧠 Mini-chequeo

1. ¿Con qué clave cifras un mensaje para que solo lo lea Bob?
2. ¿Qué pasa si se filtra la clave privada de Bob?
3. ¿Por qué no puedes cifrar un archivo de 1 GB con RSA?

<details>
<summary>🔄 Respuestas</summary>

1. Con la clave **pública de Bob**. Su privada es la única que puede descifrarlo.
2. Todo lo cifrado con su pública queda expuesto, y cualquiera puede **firmar en su nombre**. La privada es el secreto absoluto.
3. Por su **límite de tamaño** (~190 bytes con claves de 2048 bits) y su **velocidad** (~1 MB/s). RSA sirve para claves y secretos pequeños, no para el volumen.
</details>

---

## ✅ Resumen en 3 frases

- RSA genera un **par de claves**: pública (compartible) y privada (secreta), en formato PEM.
- Cifras con `PKCS1_OAEP.new(publica).encrypt()` y descifras con `PKCS1_OAEP.new(privada).decrypt()`.
- Es lento y limitado a ~190 bytes: sirve para repartir secretos pequeños, no para cifrar el tráfico.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| RSA | Cifrado asimétrico basado en la dificultad de factorizar primos |
| Par de claves | Pública + privada generadas juntas (`RSA.generate(2048)`) |
| PKCS1_OAEP | Esquema de relleno seguro de RSA en pycryptodome |
| PEM | Formato de texto en el que se exportan las claves |
| Clave privada | Secreto absoluto: descifra y firma |
| Límite de RSA | ~190 bytes de mensaje con claves de 2048 bits |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/09-cifrado-moderno) · **Anterior:** [03 · Modos de AES](/ApuntesPSP/09-cifrado-moderno/03-modos-aes) · **Siguiente:** [05 · Firmas digitales](/ApuntesPSP/09-cifrado-moderno/05-firmas-digitales)