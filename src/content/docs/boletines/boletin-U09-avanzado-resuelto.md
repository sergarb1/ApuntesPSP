---
title: Boletín UD 10 — Avanzado (Resuelto)
description: Soluciones de los ejercicios avanzados de Seguridad y cifrado
---

# 💪 Boletín UD 10 — Avanzado (Resuelto)

> Los ejercicios 5-12 necesitan `pycryptodome`: `pip install pycryptodome`.

---

## 1. Cifrado César con espacios

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

print(cifrar_cesar("Hola mundo", 5))  # Mtqf rzsit
```

El espacio no es una letra (`isalpha()` es `False`), así que se añade tal cual. Las letras avanzan 5 posiciones: **Hola → Mtqf**, **mundo → rzsit**. Resultado: **Mtqf rzsit**.

## 2. Fuerza bruta César

```python
def descifrar_cesar(texto, desplazamiento):
    resultado = ""
    for caracter in texto:
        if caracter.isalpha():
            base = ord('A') if caracter.isupper() else ord('a')
            resultado += chr((ord(caracter) - base - desplazamiento) % 26 + base)
        else:
            resultado += caracter
    return resultado

palabras = {"hola", "mundo", "python", "clave", "secreto"}

cifrado = "Mtqf rzsit"  # "Hola mundo" con desplazamiento 5
for desplazamiento in range(1, 26):
    intento = descifrar_cesar(cifrado, desplazamiento)
    if any(p in intento.lower() for p in palabras):
        print(f"Desplazamiento {desplazamiento}: {intento}  ← ¡parece correcto!")
```

Solo hay **25 desplazamientos posibles** ([punto 6](/ApuntesPSP/09-seguridad-y-cifrado/04-cifrado-clasico)). Filtrando por palabras comunes en español, el desplazamiento 5 devuelve "Hola mundo" y es el único con sentido. Se rompe en segundos.

## 3. Hash con salt

```python
import hashlib, os

def registrar_con_salt(contraseña):
    salt = os.urandom(16)                                   # 🧂 16 bytes nuevos cada vez
    hash_contra = hashlib.sha256(salt + contraseña.encode()).hexdigest()
    return salt.hex() + hash_contra                          # sal + hash juntos

def verificar(contraseña, almacenado):
    salt = bytes.fromhex(almacenado[:32])                   # 🧂 recuperamos la sal
    hash_original = almacenado[32:]
    hash_intento = hashlib.sha256(salt + contraseña.encode()).hexdigest()
    return hash_intento == hash_original

hash_ana = registrar_con_salt("clave123")
hash_bob = registrar_con_salt("clave123")
print(f"¿Hashes iguales? {hash_ana == hash_bob}")           # False
print(f"¿Ana entra? {verificar('clave123', hash_ana)}")     # True
print(f"¿Ana con otra? {verificar('otra', hash_ana)}")      # False
```

Con la misma contraseña, Ana y Bob tienen **hashes distintos** gracias a sus sales únicas. El salt ocupa los 32 primeros caracteres hex (16 bytes), que se recuperan con `bytes.fromhex()` para el login ([punto 5](/ApuntesPSP/09-seguridad-y-cifrado/03-contrasenas-seguras)).

## 4. Mini gestor de contraseñas

```python
import hashlib, os, json

usuarios = {}

def registrar(usuario, contraseña):
    salt = os.urandom(16)
    hash_contra = hashlib.sha256(salt + contraseña.encode()).hexdigest()
    usuarios[usuario] = salt.hex() + hash_contra

def login(usuario, contraseña):
    almacenado = usuarios[usuario]
    salt = bytes.fromhex(almacenado[:32])
    hash_original = almacenado[32:]
    hash_intento = hashlib.sha256(salt + contraseña.encode()).hexdigest()
    return hash_intento == hash_original

registrar("Ana", "clave123")
registrar("Bob", "clave123")
print(f"Ana login correcto: {login('Ana', 'clave123')}")     # True
print(f"Ana login fallido:  {login('Ana', 'otra')}")        # False
print(f"Hashes distintos:   {usuarios['Ana'] != usuarios['Bob']}")  # True

with open("contraseñas.json", "w") as f:
    json.dump(usuarios, f, indent=2)
```

Cada usuario se guarda como `salt.hex() + hash` en un diccionario, y se exporta a JSON con `json.dump`. Para verificar, el login extrae la sal (primeros 32 caracteres hex), la convierte con `bytes.fromhex()` y recalcula el hash ([punto 5](/ApuntesPSP/09-seguridad-y-cifrado/03-contrasenas-seguras)). Si dos usuarios comparten contraseña, sus registros JSON son **distintos**.

## 5. Cifrado híbrido simplificado

```python
from Crypto.PublicKey import RSA
from Crypto.Cipher import AES, PKCS1_OAEP
from Crypto.Random import get_random_bytes

clave_bob = RSA.generate(2048)

clave_aes = get_random_bytes(32)
cifrador_aes = AES.new(clave_aes, AES.MODE_EAX)
cifrado, tag = cifrador_aes.encrypt_and_digest(b"El cifrado hibrido funciona")

clave_aes_cifrada = PKCS1_OAEP.new(clave_bob.publickey()).encrypt(clave_aes)

clave_aes_recibida = PKCS1_OAEP.new(clave_bob).decrypt(clave_aes_cifrada)
original = AES.new(clave_aes_recibida, AES.MODE_EAX, nonce=cifrador_aes.nonce).decrypt(cifrado)
print(f"Mensaje original: {original.decode()}")
```

```
Mensaje original: El cifrado hibrido funciona
```

RSA reparte la clave AES (32 bytes) y AES cifra el mensaje completo. El orden de descifrado es el inverso al de cifrado ([punto 6](/ApuntesPSP/09-seguridad-y-cifrado/08-cifrado-hibrido-y-practica)).

## 6. Firma alterada

```python
from Crypto.Signature import pkcs1_15
from Crypto.Hash import SHA256
from Crypto.PublicKey import RSA

clave = RSA.generate(2048)
mensaje = "Transferencia de 500€".encode()

h = SHA256.new(mensaje)
firma = pkcs1_15.new(clave).sign(h)

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

La firma depende del hash y de la clave: **un solo byte distinto** la invalida por completo ([punto 5](/ApuntesPSP/09-seguridad-y-cifrado/07-firmas-digitales)).

## 7. RBAC con permisos cifrado

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

Cada rol tiene su paquete de permisos; `puede` comprueba si la acción está en el del rol ([punto 7](/ApuntesPSP/09-seguridad-y-cifrado/08-cifrado-hibrido-y-practica)). `permisos.get(usuario["rol"], [])` devuelve lista vacía para roles desconocidos: por defecto, nada permitido.

## 8. Cifrar archivo completo

```python
from Crypto.Cipher import AES
from Crypto.Random import get_random_bytes

clave = get_random_bytes(32)

with open("mensaje.txt", "w") as f:
    f.write("Contenido secreto del proyecto")

with open("mensaje.txt", "rb") as f:
    contenido = f.read()

cifrador = AES.new(clave, AES.MODE_EAX)
cifrado, tag = cifrador.encrypt_and_digest(contenido)

with open("mensaje.cifrado", "wb") as f:
    f.write(cifrador.nonce + tag + cifrado)      # nonce + tag + cifrado

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

## 9. RSA: cifrar mensajes largos

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

Así cualquier mensaje cabe, sea cual sea su tamaño ([punto 6](/ApuntesPSP/09-seguridad-y-cifrado/08-cifrado-hibrido-y-practica)).

## 10. Firma con verificación de integridad

```python
from Crypto.Signature import pkcs1_15
from Crypto.Hash import SHA256
from Crypto.PublicKey import RSA

clave = RSA.generate(2048)
mensaje = b"Este mensaje es de Ana"

h = SHA256.new(mensaje)
firma = pkcs1_15.new(clave).sign(h)

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

La firma se calcula sobre el **hash del mensaje original**. Si el mensaje cambia un solo byte, el hash es distinto y la verificación falla: la firma detecta cualquier modificación ([punto 5](/ApuntesPSP/09-seguridad-y-cifrado/07-firmas-digitales)).

## 11. RSA vs AES benchmark

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

inicio = time.time()
for _ in range(100):
    cifrador_rsa.encrypt(mensaje[:16])
rsa_ms = (time.time() - inicio) * 1000

inicio = time.time()
for _ in range(1000):
    cifrador_aes.encrypt(mensaje)
aes_ms = (time.time() - inicio) * 1000

print(f"100 cifrados RSA:  {rsa_ms:.1f} ms")
print(f"1000 cifrados AES: {aes_ms:.1f} ms")
```

La diferencia es **abismal**: cifrar 10 veces más mensajes con AES tarda una fracción de lo que tarda RSA con solo 100. Por eso AES va para el volumen y RSA solo para repartir la clave ([punto 1](/ApuntesPSP/09-seguridad-y-cifrado/05-cifrado-simetrico-aes)).

## 12. Sistema de cifrado de extremo a extremo

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

`cifrar_para` cifra el mensaje con AES y protege la clave AES con la **pública del destinatario**. `descifrar` invierte el proceso usando la **privada del propio usuario** y verifica el tag. Es el esquema del [punto 8](/ApuntesPSP/09-seguridad-y-cifrado/08-cifrado-hibrido-y-practica): cada usuario guarda su privada y solo él puede descifrar lo que le envían.

---

📚 [Volver a la unidad](/ApuntesPSP/09-seguridad-y-cifrado) · Por resolver: [💪 Boletín UD 10 — Avanzado](/ApuntesPSP/boletines/boletin-u09-avanzado)
