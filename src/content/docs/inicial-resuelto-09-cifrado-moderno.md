---
title: "✅ INICIAL RESUELTO 9 — Cifrado Moderno"
nav_order: 9
---
### 1. AES: cifrar mensaje

```python
from Crypto.Cipher import AES
from Crypto.Random import get_random_bytes
clave = get_random_bytes(32)
cifrador = AES.new(clave, AES.MODE_EAX)
texto_cifrado, tag = cifrador.encrypt_and_digest(b"Hola AES")
print(f"Cifrado: {texto_cifrado.hex()}")
```

`pycryptodome` debe estar instalado: `pip install pycryptodome`.

### 2. AES: descifrar

```python
cifrador2 = AES.new(clave, AES.MODE_EAX, nonce=cifrador.nonce)
original = cifrador2.decrypt(texto_cifrado)
print(f"Original: {original.decode()}")
```

Necesitas la misma clave y el mismo nonce para descifrar.

### 3. RSA: generar claves

```python
from Crypto.PublicKey import RSA
clave = RSA.generate(2048)
print(clave.publickey().export_key().decode()[:50] + "...")
```

La clave pública se puede compartir. La privada NO.
