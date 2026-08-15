---
title: "08 — Práctica: sistema seguro"
description: Cifrar, firmar y verificar un sistema completo 🏗️
---

<p><small>Cifrar, firmar y verificar un sistema completo 🏗️</small></p>

> 🗺️ **Estás en:** 🧬 **U09 · Cifrado Moderno** → 08 · Práctica: sistema seguro

---

## 📬 La idea en una frase

> Este punto junta todas las piezas de la unidad en un **mini sistema seguro**: cifrar un mensaje con **AES** (confidencialidad), proteger su **clave** con **RSA** (reparto) y **firmarlo** (autenticidad + integridad). Un mensaje que viaja cifrado, solo para el destinatario, y firmado por quien dice serlo.

Es la versión "en pequeño" de lo que hacen los protocolos reales: cifrado híbrido para el contenido + firma para la autoría. Aquí lo montas con las piezas que ya conoces de los puntos 2 a 7.

---

## 🏗️ El sistema completo

```python
from Crypto.PublicKey import RSA
from Crypto.Cipher import AES, PKCS1_OAEP
from Crypto.Signature import pkcs1_15
from Crypto.Hash import SHA256
from Crypto.Random import get_random_bytes

# ── 1. Claves de Ana (firmante) y Bob (destinatario)
clave_ana = RSA.generate(2048)
clave_bob = RSA.generate(2048)

# ── 2. Ana prepara el mensaje
mensaje = b"Plan de ataque para el proyecto: mañana a las 8"

# ── 3. Cifrado híbrido: AES cifra, RSA protege la clave AES
clave_aes = get_random_bytes(32)
cifrador_aes = AES.new(clave_aes, AES.MODE_EAX)
cifrado, tag = cifrador_aes.encrypt_and_digest(mensaje)
clave_aes_cifrada = PKCS1_OAEP.new(clave_bob.publickey()).encrypt(clave_aes)

# ── 4. Firma: SHA256 + clave privada de Ana
h = SHA256.new(mensaje)
firma = pkcs1_15.new(clave_ana).sign(h)

# ── 5. Bob recibe y descifra
clave_aes_recibida = PKCS1_OAEP.new(clave_bob).decrypt(clave_aes_cifrada)
original = AES.new(clave_aes_recibida, AES.MODE_EAX, nonce=cifrador_aes.nonce).decrypt(cifrado)

# ── 6. Bob verifica la firma de Ana
try:
    pkcs1_15.new(clave_ana.publickey()).verify(SHA256.new(original), firma)
    print("✅ Firma VÁLIDA — mensaje de Ana, no alterado")
except (ValueError, TypeError):
    print("❌ Firma INVÁLIDA — no es de Ana o fue manipulado")

print(f"📦 Mensaje recibido: {original.decode()}")
```

```
✅ Firma VÁLIDA — mensaje de Ana, no alterado
📦 Mensaje recibido: Plan de ataque para el proyecto: mañana a las 8
```

**Las 6 fases del sistema:**

| Fase | Pieza | Garantía |
|---|---|---|
| 3a. Cifrar mensaje | AES (EAX) | Confidencialidad del contenido |
| 3b. Proteger la clave AES | RSA (PKCS1_OAEP) | Solo Bob la descifra |
| 4. Firmar | SHA256 + RSA privada | Autenticidad de Ana |
| 5. Descifrar | RSA privada + AES | Confidencialidad |
| 6. Verificar | SHA256 + RSA pública | Autenticidad + integridad |

---

## 🎭 Be the code, my friend — El mensaje completo

> "Sé el mensaje desde que Ana lo escribe hasta que Bob lo lee y lo verifica."

```
🔵 ANA

1. Escribe: "Plan de ataque para el proyecto: mañana a las 8"
2. Genera clave AES de 32 bytes
3. Cifra con AES (EAX) → cifrado + tag
4. Cifra la clave AES con la RSA pública de Bob → clave_aes_cifrada
5. SHA256 del mensaje → lo firma con su RSA privada → firma

🚀 Viaja por la red:
   ┌────────────────────────────────────────────────┐
   │ clave_AES_cifrada_RSA │ nonce │ tag │ cifrado │
   │                        │       │     │ firma   │
   └────────────────────────────────────────────────┘

🟢 BOB

6. Descifra clave_aes_cifrada con su RSA privada → clave AES
7. Descifra el mensaje con AES (nonce + cifrado)
8. SHA256 del mensaje recibido
9. Verifica la firma con la RSA pública de Ana
   ┌──────────────────────────────────────────────┐
   │ ¿Firma válida? → ✅ Es de Ana, nadie lo tocó │
   │ ¿Firma inválida? → ❌ Algo va mal            │
   └──────────────────────────────────────────────┘

10. Bob lee: "Plan de ataque para el proyecto: mañana a las 8" 🏁
```

---

## ✏️ Aprieta el lápiz

1. **AES básico**: Cifra un mensaje con AES, luego descifralo. Muestra el nonce y el tag.
2. **RSA: cifra y descifra**: Genera un par RSA, cifra un mensaje corto y descifralo.
3. **Cifrado híbrido**: Cifra un mensaje largo con AES, cifra la clave AES con RSA. Simula el intercambio.
4. **Firma y verifica**: Firma un mensaje, luego modifícalo y comprueba que la verificación falla.
5. **RBAC**: Implementa un sistema con 3 roles (admin, editor, lector) y 4 acciones (leer, escribir, borrar, compartir).

<details>
<summary>🔓 Soluciones</summary>

**1. AES básico:**

```python
from Crypto.Cipher import AES
from Crypto.Random import get_random_bytes

clave = get_random_bytes(32)
cifrador = AES.new(clave, AES.MODE_EAX)
texto_cifrado, tag = cifrador.encrypt_and_digest(b"Mensaje secreto")

print(f"Nonce: {cifrador.nonce.hex()}")
print(f"Tag:   {tag.hex()}")
print(f"Cifrado: {texto_cifrado.hex()}")

descifrador = AES.new(clave, AES.MODE_EAX, nonce=cifrador.nonce)
print(f"Descifrado: {descifrador.decrypt(texto_cifrado)}")
```

El nonce y el tag viajan con el cifrado; la clave no. Para descifrar hace falta la misma clave y el mismo nonce.

**2. RSA: cifra y descifra:**

```python
from Crypto.PublicKey import RSA
from Crypto.Cipher import PKCS1_OAEP

clave_rsa = RSA.generate(2048)
cifrador = PKCS1_OAEP.new(clave_rsa.publickey())
texto_cifrado = cifrador.encrypt(b"Hola RSA")

descifrador = PKCS1_OAEP.new(clave_rsa)
print(f"Descifrado: {descifrador.decrypt(texto_cifrado)}")
```

Solo la clave privada puede descifrar lo que cifró la pública.

**3. Cifrado híbrido:**

```python
from Crypto.PublicKey import RSA
from Crypto.Cipher import AES, PKCS1_OAEP
from Crypto.Random import get_random_bytes

clave_bob = RSA.generate(2048)

clave_aes = get_random_bytes(32)
mensaje = b"Hola Bob, ¿quedamos mañana?"

cifrador_aes = AES.new(clave_aes, AES.MODE_EAX)
cifrado, tag = cifrador_aes.encrypt_and_digest(mensaje)
clave_aes_cifrada = PKCS1_OAEP.new(clave_bob.publickey()).encrypt(clave_aes)

# Se envía: (clave_aes_cifrada, nonce, tag, cifrado)

clave_aes_recibida = PKCS1_OAEP.new(clave_bob).decrypt(clave_aes_cifrada)
mensaje_descifrado = AES.new(clave_aes_recibida, AES.MODE_EAX,
                             nonce=cifrador_aes.nonce).decrypt(cifrado)
print(f"Mensaje descifrado: {mensaje_descifrado.decode()}")
```

RSA reparte la clave AES; AES cifra el mensaje completo. Es el esquema de HTTPS.

**4. Firma y verifica:**

```python
from Crypto.Signature import pkcs1_15
from Crypto.Hash import SHA256
from Crypto.PublicKey import RSA

clave = RSA.generate(2048)
mensaje = b"Transferencia de 500 euros"
h = SHA256.new(mensaje)
firma = pkcs1_15.new(clave).sign(h)

# Modificamos el mensaje DESPUÉS de firmar
mensaje_tocado = b"Transferencia de 5000 euros"
try:
    pkcs1_15.new(clave.publickey()).verify(SHA256.new(mensaje_tocado), firma)
    print("✅ Firma válida")
except (ValueError, TypeError):
    print("❌ Firma inválida — el mensaje fue manipulado")
```

Cambiar una sola cifra hace que el hash no coincida: la verificación falla y salta la excepción.

**5. RBAC:**

```python
PERMISOS = {
    "admin":  ["leer", "escribir", "borrar", "compartir"],
    "editor": ["leer", "escribir"],
    "lector": ["leer"],
}

def puede(usuario, accion):
    return accion in PERMISOS.get(usuario.rol, [])

class Usuario:
    def __init__(self, nombre, rol):
        self.nombre = nombre
        self.rol = rol

ana = Usuario("Ana", "admin")
bob = Usuario("Bob", "lector")
print(f"Ana puede borrar: {puede(ana, 'borrar')}")   # True
print(f"Bob puede borrar: {puede(bob, 'borrar')}")   # False
```

Cada rol tiene su paquete de permisos; `puede` comprueba si la acción está en el del rol del usuario.

</details>

---

## 🧠 Mini-chequeo

1. ¿Qué garantiza la fase de cifrado AES y qué garantiza la firma?
2. ¿Por qué el mensaje se cifra con AES y no directamente con RSA?
3. ¿Qué recibe Bob del mensaje y qué comprueba antes de confiar en él?

<details>
<summary>🔄 Respuestas</summary>

1. El cifrado AES garantiza la **confidencialidad** (solo Bob, con su clave, lo lee); la firma garantiza la **autenticidad** (es de Ana) y la **integridad** (no fue tocado).
2. Porque RSA es **lento** y limita el mensaje a ~190 bytes; AES cifra cualquier tamaño a ~1 GB/s. RSA solo protege la clave AES (32 bytes).
3. Bob recibe `clave_AES_cifrada_RSA` + `nonce` + `tag` + `cifrado` + `firma`. Antes de confiar, descifra con su privada y **verifica la firma** con la pública de Ana.
</details>

---

## ✅ Resumen en 3 frases

- Un sistema seguro junta **cifrado híbrido** (AES + RSA) y **firma digital** (SHA-256 + RSA privada).
- El mensaje viaja como `clave_AES_cifrada_RSA + nonce + tag + cifrado + firma`; cada pieza aporta una garantía distinta.
- Con los 5 ejercicios de "Aprieta el lápiz" (y sus soluciones) tienes el material para montar el sistema completo por tu cuenta.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| Sistema seguro | Cifrado híbrido + firma digital combinados |
| Confidencialidad | Solo el destinatario lee (AES + RSA) |
| Autenticidad | Se sabe quién firmó (RSA privada del firmante) |
| Integridad | Nadie modificó el mensaje (hash + tag) |
| Fase | Cada pieza del pipeline cifrar → firmar → verificar |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/09-cifrado-moderno) · **Anterior:** [07 · RBAC y roles](/ApuntesPSP/09-cifrado-moderno/07-rbac-y-roles) · **Siguiente:** [09 · Head First](/ApuntesPSP/09-cifrado-moderno/09-head-first)