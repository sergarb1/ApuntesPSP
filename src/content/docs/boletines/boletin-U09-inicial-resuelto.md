---
title: Boletín UD 10 — Inicial (Resuelto)
description: Soluciones de los ejercicios básicos de Seguridad y cifrado
---

# ✅ Boletín UD 10 — Inicial (Resuelto)

> Los ejercicios 6 y 7 necesitan `pycryptodome`: `pip install pycryptodome`.

---

## 1. SHA1 de tu nombre

```python
import hashlib
print(hashlib.sha1(b"sergi").hexdigest())
# 52a431556910f83a3d65e1e7c3772f5d44011eb3
```

Con tu nombre (en minúsculas), por ejemplo `b"ana"`, obtendrías su hash SHA1 de **40 caracteres** hexadecimales (160 bits).

## 2. MD5 de una frase

```python
import hashlib
print(hashlib.md5("Python es genial".encode()).hexdigest())
# 1bdf047b34a4890934fc36d12b464f2c
```

MD5 devuelve **32 caracteres** hexadecimales (128 bits).

## 3. Longitud de los hashes de "Hola mundo"

```python
import hashlib
texto = b"Hola mundo"
print(f"MD5:    {len(hashlib.md5(texto).hexdigest())} chars (128 bits)")
print(f"SHA1:   {len(hashlib.sha1(texto).hexdigest())} chars (160 bits)")
print(f"SHA256: {len(hashlib.sha256(texto).hexdigest())} chars (256 bits)")
```

MD5 → **32**, SHA1 → **40**, SHA256 → **64** caracteres hexadecimales. La longitud es **fija** para cada algoritmo, da igual el tamaño de la entrada.

## 4. Cifrado César sencillo

```python
def cifrar_cesar(texto, desplazamiento):
    resultado = ""
    for caracter in texto:
        if caracter.isalpha():
            base = ord('A') if caracter.isupper() else ord('a')
            resultado += chr((ord(caracter) - base + desplazamiento) % 26 + base)
        else:
            resultado += caracter
    return resultado

print(cifrar_cesar("Hola", 3))  # "Krod"
```

Cada letra avanza 3 posiciones: **H→K, o→r, l→o, a→d**. Resultado: **Krod**.

## 5. Determinismo del hash

```python
import hashlib
h1 = hashlib.sha256(b"clave123").hexdigest()
h2 = hashlib.sha256(b"clave123").hexdigest()
print(f"Primera:  {h1}")
print(f"Segunda:  {h2}")
print(f"¿Iguales? {h1 == h2}")  # True
```

Son **iguales**: el hash es **determinista** ([punto 2](/ApuntesPSP/09-seguridad-y-cifrado/02-hash-y-huellas-digitales)). Misma entrada → mismo hash, siempre. Esa propiedad es la que hace posible el login por comparación de hashes del [punto 4](/ApuntesPSP/09-seguridad-y-cifrado/03-contrasenas-seguras).

## 6. Nonce y tag

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

En modo EAX el **nonce** mide **16 bytes** y el **tag** también **16 bytes**. Los tres (nonce, tag y cifrado) viajan juntos; la clave no ([punto 2](/ApuntesPSP/09-seguridad-y-cifrado/05-cifrado-simetrico-aes)).

## 7. AES: cifrar y descifrar completo

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

El nonce y el tag se envían junto al cifrado; el receptor los usa con la misma clave para descifrar y verificar la integridad ([punto 2](/ApuntesPSP/09-seguridad-y-cifrado/05-cifrado-simetrico-aes)).

## 8. Simétrico vs asimétrico

a) El simétrico usa **una sola clave** (misma para cifrar y descifrar). El asimétrico usa **dos**: pública + privada.

b) Con la clave **pública de Bob**. Solo su clave privada puede descifrarlo.

c) Por su **límite de tamaño** (~190 bytes con claves de 2048 bits) y su **velocidad** (~1 MB/s). Para volúmenes grandes se usa AES (o el cifrado híbrido del [punto 6](/ApuntesPSP/09-seguridad-y-cifrado/08-cifrado-hibrido-y-practica)).

---

📚 [Volver a la unidad](/ApuntesPSP/09-seguridad-y-cifrado) · Por resolver: [📝 Boletín UD 10 — Inicial](/ApuntesPSP/boletines/boletin-u09-inicial)
