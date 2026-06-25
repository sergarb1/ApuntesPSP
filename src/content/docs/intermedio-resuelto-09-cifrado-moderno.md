---
title: "💪 INTERMEDIO RESUELTO 9 — Cifrado Moderno"
nav_order: 9
---
### 4. RSA: cifrar y descifrar

```python
from Crypto.PublicKey import RSA
from Crypto.Cipher import PKCS1_OAEP
clave = RSA.generate(2048)
cifrador = PKCS1_OAEP.new(clave.publickey())
c = cifrador.encrypt(b"Hola RSA")
descifrador = PKCS1_OAEP.new(clave)
print(descifrador.decrypt(c).decode())
```

Solo la clave privada puede descifrar lo que cifró la pública.

### 5. Firma digital

```python
from Crypto.Signature import pkcs1_15
from Crypto.Hash import SHA256
from Crypto.PublicKey import RSA
clave = RSA.generate(2048)
mensaje = b"Este mensaje es de Ana"
h = SHA256.new(mensaje)
firma = pkcs1_15.new(clave).sign(h)
try:
    pkcs1_15.new(clave.publickey()).verify(h, firma)
    print("✅ Firma válida")
except:
    print("❌ Firma inválida")
```

### 6. RBAC simple

```python
permisos = {"admin": ["leer", "escribir"], "user": ["leer"]}
def puede(usuario, accion):
    return accion in permisos.get(usuario["rol"], [])
print(puede({"rol": "admin"}, "escribir"))  # True
print(puede({"rol": "user"}, "escribir"))   # False
```
