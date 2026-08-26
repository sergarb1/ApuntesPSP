---
title: 06 — Cifrado híbrido
description: AES + RSA, el método que usa HTTPS 🤝
---

<p><small>AES + RSA, el método que usa HTTPS 🤝</small></p>

> 🗺️ **Estás en:** 🧬 **U09 · Cifrado Moderno** → 06 · Cifrado híbrido

---

## 📬 La idea en una frase

> El **cifrado híbrido** combina lo mejor de ambos mundos: **RSA** cifra una **clave AES** aleatoria (que viaja protegida) y **AES** cifra el mensaje completo. Rápido como el simétrico, con el reparto de claves resuelto por el asimétrico. Es exactamente lo que hace **HTTPS**.

En el [punto 4](/ApuntesPSP/09-cifrado-moderno/04-rsa) viste que RSA no cifra mensajes grandes. La solución: no cifres el mensaje con RSA, cifra la **clave de sesión** AES. El mensaje (por grande que sea) lo cifra AES, que es rapidísimo.

---

## 🔄 El intercambio, paso a paso

```
🔵 Ana                          🟢 Bob
   │                               │
   │ 1. Genera clave AES           │
   │ 2. Cifra mensaje con AES      │
   │ 3. Cifra clave AES con        │
   │    RSA pública de Bob         │
   │                               │
   ├── [clave_AES_cifrada_RSA] ───►│
   ├── [mensaje_cifrado_AES] ─────►│
   │                               │
   │                               │ 4. Descifra clave AES con su RSA privada
   │                               │ 5. Descifra mensaje con AES
```

![Diagrama del cifrado híbrido](/diagrams/cifrado-hibrido.svg)

> 📦 **Lo que viaja por la red:** `clave_AES_cifrada_RSA` + `nonce` + `tag` + `mensaje_cifrado_AES`. El atacante ve la clave AES cifrada con RSA: inútil sin la privada de Bob.

---

## 🐍 Código completo

```python
from Crypto.PublicKey import RSA
from Crypto.Cipher import AES, PKCS1_OAEP
from Crypto.Random import get_random_bytes

# Claves de Bob
clave_bob = RSA.generate(2048)

# Ana cifra
clave_aes = get_random_bytes(32)
mensaje = b"Hola Bob, ¿quedamos mañana?"

cifrador_aes = AES.new(clave_aes, AES.MODE_EAX)
cifrado, tag = cifrador_aes.encrypt_and_digest(mensaje)

cifrador_rsa = PKCS1_OAEP.new(clave_bob.publickey())
clave_aes_cifrada = cifrador_rsa.encrypt(clave_aes)

# Se envía: (clave_aes_cifrada, nonce, tag, cifrado)

# Bob descifra
descifrador_rsa = PKCS1_OAEP.new(clave_bob)
clave_aes_recibida = descifrador_rsa.decrypt(clave_aes_cifrada)

descifrador_aes = AES.new(clave_aes_recibida, AES.MODE_EAX, nonce=cifrador_aes.nonce)
mensaje_descifrado = descifrador_aes.decrypt(cifrado)

print(f"Mensaje descifrado: {mensaje_descifrado.decode()}")
```

```
Mensaje descifrado: Hola Bob, ¿quedamos mañana?
```

**Desglose de las dos mitades:**

- **RSA hace el reparto:** cifra los 32 bytes de la clave AES con la pública de Bob. Ese es el secreto que viaja protegido.
- **AES hace el volumen:** cifra el mensaje (de cualquier tamaño) con esa clave. Y su `tag` verifica la integridad.

---

## 🌐 Por qué HTTPS usa esto

> Este es el método que usa **HTTPS**: RSA para negociar la clave de sesión, AES para cifrar el tráfico.

Cuando entras en una web con `https://`:

1. Tu navegador genera una **clave AES** aleatoria (la clave de sesión).
2. La cifra con la **clave pública RSA** del servidor (su certificado).
3. El servidor la descifra con su **clave privada**: ahora ambos comparten la misma clave AES.
4. Todo el tráfico de la sesión se cifra con **AES**, rápido, y con **firma** (via TLS) para la integridad.

RSA solo se usa al principio, para repartir el secreto. El resto, a toda velocidad con AES. Así trabajan también WhatsApp, Signal, el correo cifrado y las VPN.

---

## 🧠 Mini-chequeo

1. ¿Qué cifra RSA en un esquema híbrido? ¿Y qué cifra AES?
2. ¿Por qué no se cifra el mensaje completo con RSA?
3. ¿Qué envía Ana a Bob y qué es lo único que no puede leer un atacante?

<details>
<summary>🔄 Respuestas</summary>

1. RSA cifra la **clave AES** (los 32 bytes); AES cifra el **mensaje completo** y genera su tag.
2. Porque RSA es **lento** (~1 MB/s) y está limitado a **~190 bytes**: no puede con mensajes largos. AES lo hace a ~1 GB/s sin límite.
3. Envía `clave_AES_cifrada_RSA` + `nonce` + `tag` + `cifrado`. El atacante ve todo… salvo el mensaje: la clave AES está cifrada con RSA y sin la **privada de Bob** no puede descifrarla.
</details>

---

## ✅ Resumen en 3 frases

- El híbrido junta **RSA** (repartir la clave) y **AES** (cifrar el volumen).
- El mensaje que viaja es `clave_AES_cifrada_RSA + nonce + tag + cifrado`.
- Es el mecanismo de **HTTPS**: RSA negocia la clave de sesión y AES cifra el tráfico.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| Cifrado híbrido | AES para el mensaje + RSA para la clave AES |
| Clave de sesión | Clave AES aleatoria generada para una comunicación |
| Clave_AES_cifrada_RSA | El secreto que viaja protegido por RSA |
| HTTPS | TLS sobre HTTP: RSA negocia, AES cifra |
| Tag | Autenticación del cifrado AES (integridad) |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/09-cifrado-moderno) · **Anterior:** [05 · Firmas digitales](/ApuntesPSP/09-cifrado-moderno/05-firmas-digitales) · **Siguiente:** [07 · RBAC y roles](/ApuntesPSP/09-cifrado-moderno/07-rbac-y-roles)