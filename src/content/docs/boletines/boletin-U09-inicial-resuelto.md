---
title: Boletín U09 — Inicial (Resuelto)
description: Soluciones de los ejercicios básicos de Cifrado Moderno
---

# ✅ Boletín U09 — Inicial (Resuelto)

> `pycryptodome` debe estar instalado: `pip install pycryptodome`.

---

## 1. AES modo ECB

```python
from Crypto.Cipher import AES
from Crypto.Random import get_random_bytes

clave = get_random_bytes(32)
cifrador = AES.new(clave, AES.MODE_ECB)
texto_cifrado = cifrador.encrypt(b"0123456789ABCDEF")
print(f"Cifrado (hex): {texto_cifrado.hex()}")
```

El mensaje mide **exactamente 16 bytes**, así que no hace falta padding. ECB cifra cada bloque de forma independiente (recuerda: no lo uses con datos largos o repetitivos, [punto 3](/ApuntesPSP/09-cifrado-moderno/03-modos-aes)).

## 2. Nonce y tag

```python
from Crypto.Cipher import AES
from Crypto.Random import get_random_bytes

clave = get_random_bytes(32)
cifrador = AES.new(clave, AES.MODE_EAX)
texto_cifrado, tag = cifrador.encrypt_and_digest(b"Hola mundo con AES")

print(f"Longitud nonce: {len(cifrador.nonce)} bytes")
print(f"Longitud tag:   {len(tag)} bytes")
print(f"Longitud cifrado: {len(texto_cifrado)} bytes")
```

En modo EAX el **nonce** mide **16 bytes** y el **tag** también **16 bytes**. Los tres (nonce, tag y cifrado) viajan juntos; la clave no ([punto 2](/ApuntesPSP/09-cifrado-moderno/02-aes)).

## 3. RSA: exportar clave

```python
from Crypto.PublicKey import RSA

clave = RSA.generate(2048)
publica = clave.publickey().export_key().decode()

print(f"Primeros 40: {publica[:40]}")
print(f"Últimos 40:  {publica[-40:]}")
```

```
Primeros 40: -----BEGIN PUBLIC KEY-----
Últimos 40:  -----END PUBLIC KEY-----
```

La clave pública en formato **PEM** se puede compartir con cualquiera. La privada NO.

## 4. AES: cifrar mensaje

```python
from Crypto.Cipher import AES
from Crypto.Random import get_random_bytes

clave = get_random_bytes(32)
cifrador = AES.new(clave, AES.MODE_EAX)
texto_cifrado, tag = cifrador.encrypt_and_digest(b"Hola AES")
print(f"Cifrado: {texto_cifrado.hex()}")
```

`encrypt_and_digest` devuelve el texto cifrado y el **tag** de integridad de una vez.

## 5. AES: descifrar

```python
cifrador2 = AES.new(clave, AES.MODE_EAX, nonce=cifrador.nonce)
original = cifrador2.decrypt(texto_cifrado)
print(f"Original: {original.decode()}")
```

Necesitas la **misma clave** y el **mismo nonce** para descifrar ([punto 2](/ApuntesPSP/09-cifrado-moderno/02-aes)).

## 6. RSA: generar claves

```python
from Crypto.PublicKey import RSA

clave = RSA.generate(2048)
print(clave.publickey().export_key().decode()[:50] + "...")
```

```
-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA...
```

La clave pública se puede compartir. La privada NO.

## 7. Simétrico vs asimétrico

a) El simétrico usa **una sola clave** (misma para cifrar y descifrar). El asimétrico usa **dos**: pública + privada.

b) Con la clave **pública de Bob**. Solo su clave privada puede descifrarlo.

c) Por su **límite de tamaño** (~190 bytes con claves de 2048 bits) y su **velocidad** (~1 MB/s). Para volúmenes grandes se usa AES (o el cifrado híbrido del [punto 6](/ApuntesPSP/09-cifrado-moderno/06-cifrado-hibrido)).

## 8. AES: cifrar y descifrar completo

```python
from Crypto.Cipher import AES
from Crypto.Random import get_random_bytes

clave = get_random_bytes(32)
mensaje = b"El cifrado simetrico es rapido"

cifrador = AES.new(clave, AES.MODE_EAX)
texto_cifrado, tag = cifrador.encrypt_and_digest(mensaje)

print(f"Nonce: {cifrador.nonce.hex()}")
print(f"Tag:   {tag.hex()}")
print(f"Cifrado: {texto_cifrado.hex()}")

descifrador = AES.new(clave, AES.MODE_EAX, nonce=cifrador.nonce)
original = descifrador.decrypt(texto_cifrado)
print(f"Original: {original.decode()}")
```

El nonce y el tag se envían junto al cifrado; el receptor los usa con la misma clave para descifrar y verificar la integridad ([punto 2](/ApuntesPSP/09-cifrado-moderno/02-aes)).