---
title: "06 — Cifrado asimétrico (RSA)"
description: "Generar el par de claves y cifrar con la pública 🔑"
---

<p><small>Generar el par de claves y cifrar con la pública 🔑</small></p>

> 🗺️ **Estás en:** 🔐 **UD 9 · Seguridad y cifrado** → 06 · Cifrado asimétrico (RSA)

---

## 📬 La idea en una frase

> **RSA** es el cifrado asimétrico por excelencia: generas un **par de claves** (pública + privada), cifras con la **pública** del destinatario y solo su **privada** puede descifrar. Así se resuelve el problema de compartir la clave del cifrado simétrico.

---

## 🗝️ Generar el par de claves

Con `cryptography`, generar 2048 bits es sencillo:

```python
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.primitives import serialization

# Generar par de claves
clave_privada = rsa.generate_private_key(
    public_exponent=65537,
    key_size=2048
)

# Exportar en formato PEM
privada_pem = clave_privada.private_bytes(
    encoding=serialization.Encoding.PEM,
    format=serialization.PrivateFormat.PKCS8,
    encryption_algorithm=serialization.NoEncryption()
)
publica_pem = clave_privada.public_key().public_bytes(
    encoding=serialization.Encoding.PEM,
    format=serialization.PublicFormat.SubjectPublicKeyInfo
)

print("Pública (PEM):")
print(publica_pem.decode())
print("Privada (PEM):")
print(privada_pem.decode())
```

```
Pública (PEM):
-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA...
-----END PUBLIC KEY-----
```

- La **pública** se puede compartir por cualquier sitio (es *pública*).
- La **privada** es secreto absoluto: quien la tenga puede descifrar todo lo que se cifre con tu pública y firmar en tu nombre.
- Generar claves RSA tarda **~1-2 segundos** (busca números primos enormes).

---

## 🔒 Cifrar con la pública, descifrar con la privada

```python
from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.primitives import hashes

# Generar par de claves
clave_privada = rsa.generate_private_key(public_exponent=65537, key_size=2048)
clave_publica = clave_privada.public_key()

# Cifrar con clave PÚBLICA
mensaje = b"Mensaje secreto para Bob"
texto_cifrado = clave_publica.encrypt(
    mensaje,
    padding.OAEP(
        mgf=padding.MGF1(algorithm=hashes.SHA256()),
        algorithm=hashes.SHA256(),
        label=None
    )
)

# Descifrar con clave PRIVADA
texto_descifrado = clave_privada.decrypt(
    texto_cifrado,
    padding.OAEP(
        mgf=padding.MGF1(algorithm=hashes.SHA256()),
        algorithm=hashes.SHA256(),
        label=None
    )
)
print(f"Descifrado: {texto_descifrado}")
```

```
Descifrado: b'Mensaje secreto para Bob'
```

**El flujo entre dos personas:**


![Diagrama del cifrado asimétrico RSA: Ana cifra con la pública de Bob y solo su privada descifra](/ApuntesPSP/diagrams/rsa-asimetrico.svg)

- **OAEP** es el esquema de relleno de RSA: añade aleatoriedad al cifrado (el mismo mensaje cifrado dos veces da resultados distintos).
- Nadie más puede descifrar: ni quien intercepte el tráfico, ni quien tenga la pública. Solo la **privada de Bob**.

---

## ⚠️ El límite de RSA

RSA no cifra cualquier cosa:

- Con claves de 2048 bits, el tamaño máximo de mensaje es de **~190 bytes**.
- La velocidad ronda **~1 MB/s**, frente a los ~1 GB/s de AES.

> 💡 Para mensajes largos, RSA cifra la **clave AES** (32 bytes) y AES cifra el mensaje completo. Eso es el **cifrado híbrido** del [punto 8](/ApuntesPSP/08-seguridad-y-cifrado/08-cifrado-hibrido-y-practica).

---

## 🧠 Mini-chequeo

1. ¿Con qué clave cifras un mensaje para que solo lo lea Bob?
2. ¿Qué pasa si se filtra la clave privada de Bob?
3. ¿Por qué no puedes cifrar un archivo de 1 GB con RSA?

<details>
<summary>🔄 Respuestas</summary>

1. Con la clave **pública de Bob**. Su privada es la única que puede descifrarlo.
2. Todo lo cifrado con su pública queda expuesto, y cualquiera puede **firmar en su nombre**. La privada es el secreto absoluto.
3. Por su **límite de tamaño** (~190 bytes con claves de 2048 bits) y su **velocidad** (~1 MB/s).
</details>

---

## ✅ Resumen en 3 frases

- RSA genera un **par de claves**: pública (compartible) y privada (secreta).
- Cifras con `publica.encrypt(msg, padding.OAEP(...))` y descifras con `privada.decrypt(cifrado, padding.OAEP(...))`.
- Es lento y limitado a ~190 bytes: sirve para repartir secretos pequeños, no para cifrar el tráfico.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| RSA | Cifrado asimétrico basado en la dificultad de factorizar primos |
| Par de claves | Pública + privadas generadas juntas |
| OAEP | Esquema de relleno seguro de RSA |
| PEM | Formato de texto en el que se exportan las claves |
| Clave privada | Secreto absoluto: descifra y firma |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/08-seguridad-y-cifrado) · **Anterior:** [05 · Cifrado simétrico (AES)](/ApuntesPSP/08-seguridad-y-cifrado/05-cifrado-simetrico-aes) · **Siguiente:** [07 · Firmas digitales](/ApuntesPSP/08-seguridad-y-cifrado/07-firmas-digitales)
