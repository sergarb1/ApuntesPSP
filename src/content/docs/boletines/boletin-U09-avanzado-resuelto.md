---
title: Boletín U09 — Avanzado (Resuelto)
description: Soluciones de los ejercicios avanzados de Cifrado Moderno
---

# 💪 Boletín U09 — Avanzado (Resuelto)

---

## 1. Cifrado híbrido simplificado

```python
from Crypto.PublicKey import RSA
from Crypto.Cipher import AES, PKCS1_OAEP
from Crypto.Random import get_random_bytes

clave_bob = RSA.generate(2048)

# Bob genera clave AES y cifra el mensaje
clave_aes = get_random_bytes(32)
cifrador_aes = AES.new(clave_aes, AES.MODE_EAX)
cifrado, tag = cifrador_aes.encrypt_and_digest(b"El cifrado hibrido funciona")

# La clave AES viaja protegida por la RSA pública de Bob
clave_aes_cifrada = PKCS1_OAEP.new(clave_bob.publickey()).encrypt(clave_aes)

# Descifrado en orden inverso: primero RSA, luego AES
clave_aes_recibida = PKCS1_OAEP.new(clave_bob).decrypt(clave_aes_cifrada)
original = AES.new(clave_aes_recibida, AES.MODE_EAX, nonce=cifrador_aes.nonce).decrypt(cifrado)
print(f"Mensaje original: {original.decode()}")
```

```
Mensaje original: El cifrado hibrido funciona
```

RSA reparte la clave AES (32 bytes) y AES cifra el mensaje completo. El orden de descifrado es el inverso al de cifrado ([punto 6](/ApuntesPSP/09-cifrado-moderno/06-cifrado-hibrido)).

## 2. Firma alterada

```python
from Crypto.Signature import pkcs1_15
from Crypto.Hash import SHA256
from Crypto.PublicKey import RSA

clave = RSA.generate(2048)
mensaje = b"Transferencia de 500€"

h = SHA256.new(mensaje)
firma = pkcs1_15.new(clave).sign(h)

# Modificamos UN byte de la firma
firma_mutada = bytearray(firma)
firma_mutada[0] ^= 0xFF
firma_mutada = bytes(firma_mutada)

try:
    pkcs1_15.new(clave.publickey()).verify(h, firma_mutada)
    print("✅ Firma válida")
except (ValueError, TypeError):
    print("❌ Firma inválida — la firma fue alterada")
```

```
❌ Firma inválida — la firma fue alterada
```

La firma depende del hash y de la clave: **un solo byte distinto** la invalida por completo ([punto 5](/ApuntesPSP/09-cifrado-moderno/05-firmas-digitales)).

## 3. RBAC con permisos cifrado

```python
permisos = {
    "admin":    ["cifrar", "descifrar", "firmar"],
    "usuario":  ["cifrar", "firmar"],
    "invitado": ["cifrar"],
}

def puede(usuario, accion):
    return accion in permisos.get(usuario["rol"], [])

print(puede({"rol": "admin"}, "descifrar"))    # True
print(puede({"rol": "usuario"}, "descifrar"))  # False
print(puede({"rol": "usuario"}, "firmar"))     # True
print(puede({"rol": "invitado"}, "firmar"))    # False
print(puede({"rol": "invitado"}, "cifrar"))    # True
```

```
True
False
True
False
True
```

Cada rol tiene su paquete de permisos; `puede` comprueba si la acción está en el del rol ([punto 7](/ApuntesPSP/09-cifrado-moderno/07-rbac-y-roles)). `permisos.get(usuario["rol"], [])` devuelve lista vacía para roles desconocidos: por defecto, nada permitido.

## 4. Cifrar archivo completo

```python
from Crypto.Cipher import AES
from Crypto.Random import get_random_bytes

clave = get_random_bytes(32)

# Cifrar el archivo
with open("mensaje.txt", "rb") as f:
    contenido = f.read()

cifrador = AES.new(clave, AES.MODE_EAX)
cifrado, tag = cifrador.encrypt_and_digest(contenido)

with open("mensaje.cifrado", "wb") as f:
    f.write(cifrador.nonce + tag + cifrado)      # nonce + tag + cifrado

# Descifrar
with open("mensaje.cifrado", "rb") as f:
    paquete = f.read()

nonce = paquete[:16]
tag = paquete[16:32]
cifrado_recibido = paquete[32:]

descifrador = AES.new(clave, AES.MODE_EAX, nonce=nonce)
original = descifrador.decrypt_and_verify(cifrado_recibido, tag)
print(f"Archivo descifrado: {original.decode()}")
```

Se guardan los tres componentes juntos (`nonce + tag + cifrado`) y al descifrar se **separan por sus longitudes** (16 y 16 bytes). `decrypt_and_verify` además comprueba que el archivo no fue manipulado.

## 5. RSA: cifrar mensajes largos

```python
from Crypto.PublicKey import RSA
from Crypto.Cipher import PKCS1_OAEP

clave = RSA.generate(2048)
mensaje_largo = b"x" * 300   # 300 bytes

cifrador = PKCS1_OAEP.new(clave.publickey())
try:
    cifrador.encrypt(mensaje_largo)
except ValueError as e:
    print(f"❌ Error: {e}")
```

```
❌ Error: Plaintext is too long.
```

**El problema:** RSA con claves de 2048 bits solo admite ~190 bytes de mensaje.

**La solución (cifrado híbrido):** no cifres el mensaje con RSA; cifra la clave AES con RSA y el mensaje con AES:

```python
from Crypto.Cipher import AES, PKCS1_OAEP
from Crypto.Random import get_random_bytes

clave_aes = get_random_bytes(32)
cifrador_aes = AES.new(clave_aes, AES.MODE_EAX)
cifrado, tag = cifrador_aes.encrypt_and_digest(mensaje_largo)
clave_aes_cifrada = PKCS1_OAEP.new(clave.publickey()).encrypt(clave_aes)

clave_aes_recibida = PKCS1_OAEP.new(clave).decrypt(clave_aes_cifrada)
original = AES.new(clave_aes_recibida, AES.MODE_EAX, nonce=cifrador_aes.nonce).decrypt(cifrado)
print(f"Longitud del original: {len(original)} bytes")
```

```
Longitud del original: 300 bytes
```

Así cualquier mensaje cabe, sea cual sea su tamaño ([punto 6](/ApuntesPSP/09-cifrado-moderno/06-cifrado-hibrido)).

## 6. Intercambio de claves simulado

```python
from Crypto.PublicKey import RSA
from Crypto.Cipher import AES, PKCS1_OAEP
from Crypto.Random import get_random_bytes

# Ana genera su par RSA
clave_ana = RSA.generate(2048)

# Bob cifra con la RSA pública de Ana
clave_aes = get_random_bytes(32)
mensaje = b"Mensaje para Ana"
cifrador_aes = AES.new(clave_aes, AES.MODE_EAX)
cifrado, tag = cifrador_aes.encrypt_and_digest(mensaje)
clave_aes_cifrada = PKCS1_OAEP.new(clave_ana.publickey()).encrypt(clave_aes)

# Se envían los 4 componentes
# Ana descifra en orden inverso
clave_aes_recibida = PKCS1_OAEP.new(clave_ana).decrypt(clave_aes_cifrada)
original = AES.new(clave_aes_recibida, AES.MODE_EAX, nonce=cifrador_aes.nonce).decrypt(cifrado)
print(f"Ana recibe: {original.decode()}")
```

```
Ana recibe: Mensaje para Ana
```

Los 4 componentes que viajan son `(clave_AES_cifrada, nonce, tag, cifrado)`. Ana usa su **clave privada** para extraer la clave AES y luego descifra con ella ([punto 6](/ApuntesPSP/09-cifrado-moderno/06-cifrado-hibrido)).

## 7. Firma con verificación de integridad

```python
from Crypto.Signature import pkcs1_15
from Crypto.Hash import SHA256
from Crypto.PublicKey import RSA

clave = RSA.generate(2048)
mensaje = b"Este mensaje es de Ana"

# Firmar el original
h = SHA256.new(mensaje)
firma = pkcs1_15.new(clave).sign(h)

# Mensaje MODIFICADO después de firmar
mensaje_tocado = b"Este mensaje es de Ana pero lo cambie"

try:
    pkcs1_15.new(clave.publickey()).verify(SHA256.new(mensaje_tocado), firma)
    print("✅ Firma válida")
except (ValueError, TypeError):
    print("❌ Firma inválida — el mensaje fue manipulado")
```

```
❌ Firma inválida — el mensaje fue manipulado
```

La firma se calcula sobre el **hash del mensaje original**. Si el mensaje cambia un solo byte, el hash es distinto y la verificación falla: la firma detecta cualquier modificación ([punto 5](/ApuntesPSP/09-cifrado-moderno/05-firmas-digitales)).

## 8. RSA vs AES benchmark

```python
from Crypto.PublicKey import RSA
from Crypto.Cipher import AES, PKCS1_OAEP
from Crypto.Random import get_random_bytes
import time

clave_rsa = RSA.generate(2048)
clave_aes = get_random_bytes(32)
mensaje = b"Rendimiento de cifrado"

cifrador_rsa = PKCS1_OAEP.new(clave_rsa.publickey())
cifrador_aes = AES.new(clave_aes, AES.MODE_EAX)

# 100 cifrados RSA
inicio = time.time()
for _ in range(100):
    cifrador_rsa.encrypt(mensaje[:16])
rsa_ms = (time.time() - inicio) * 1000

# 1000 cifrados AES
inicio = time.time()
for _ in range(1000):
    cifrador_aes.encrypt(mensaje)
aes_ms = (time.time() - inicio) * 1000

print(f"100 cifrados RSA:  {rsa_ms:.1f} ms")
print(f"1000 cifrados AES: {aes_ms:.1f} ms")
```

La diferencia es **abismal**: cifrar 10 veces más mensajes con AES tarda una fracción de lo que tarda RSA con solo 100. Por eso AES va para el volumen y RSA solo para repartir la clave ([punto 1](/ApuntesPSP/09-cifrado-moderno/01-cifrado-simetrico-vs-asimetrico)).

## 9. Sistema de cifrado de extremo a extremo

```python
from Crypto.PublicKey import RSA
from Crypto.Cipher import AES, PKCS1_OAEP
from Crypto.Random import get_random_bytes

class Usuario:
    def __init__(self, nombre):
        self.nombre = nombre
        self.clave_rsa = RSA.generate(2048)

    def cifrar_para(self, mensaje, destinatario):
        clave_aes = get_random_bytes(32)
        cifrador_aes = AES.new(clave_aes, AES.MODE_EAX)
        cifrado, tag = cifrador_aes.encrypt_and_digest(mensaje.encode())
        clave_aes_cifrada = PKCS1_OAEP.new(destinatario.clave_rsa.publickey()).encrypt(clave_aes)
        return cifrador_aes.nonce, tag, clave_aes_cifrada, cifrado

    def descifrar(self, nonce, tag, clave_aes_cifrada, cifrado):
        clave_aes = PKCS1_OAEP.new(self.clave_rsa).decrypt(clave_aes_cifrada)
        original = AES.new(clave_aes, AES.MODE_EAX, nonce=nonce).decrypt_and_verify(cifrado, tag)
        return original.decode()

ana = Usuario("Ana")
bob = Usuario("Bob")

nonce, tag, clave_aes_cifrada, cifrado = ana.cifrar_para("Hola Bob, quedamos a las 8", bob)
print(f"Bob recibe: {bob.descifrar(nonce, tag, clave_aes_cifrada, cifrado)}")
```

```
Bob recibe: Hola Bob, quedamos a las 8
```

`cifrar_para` cifra el mensaje con AES y protege la clave AES con la **pública del destinatario**. `descifrar` invierte el proceso usando la **privada del propio usuario** y verifica el tag. Es el esquema del [punto 8](/ApuntesPSP/09-cifrado-moderno/08-practica-sistema-seguro): cada usuario guarda su privada y solo él puede descifrar lo que le envían.