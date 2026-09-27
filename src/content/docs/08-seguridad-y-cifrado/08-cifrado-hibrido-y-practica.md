---
title: "08 — Cifrado híbrido y práctica"
description: "AES + RSA, RBAC y el sistema seguro completo 🏗️"
---

<p><small>AES + RSA, RBAC y el sistema seguro completo 🏗️</small></p>

> 🗺️ **Estás en:** 🔐 **UD 9 · Seguridad y cifrado** → 08 · Cifrado híbrido y práctica

---

## 📬 La idea en una frase

> El **cifrado híbrido** combina lo mejor de ambos mundos: **RSA** cifra una **clave AES** aleatoria y **AES** cifra el mensaje completo. Rápido como el simétrico, con el reparto de claves resuelto por el asimétrico. Es exactamente lo que hace **HTTPS**.

---

## 🔄 El intercambio, paso a paso

![Diagrama de secuencia del cifrado híbrido entre Ana y Bob: Ana cifra con AES, envía la clave AES protegida con la RSA pública de Bob y Bob la descifra con su clave privada](/ApuntesPSP/diagrams/cifrado-hibrido.svg)


---

## 🐍 Código completo

```python
from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from cryptography.hazmat.primitives import hashes
import os

# Claves de Bob
clave_bob_privada = rsa.generate_private_key(public_exponent=65537, key_size=2048)
clave_bob_publica = clave_bob_privada.public_key()

# Ana cifra
clave_aes = AESGCM.generate_key(bit_length=256)
nonce = os.urandom(12)
mensaje = b"Hola Bob, ¿quedamos mañana?"

aesgcm = AESGCM(clave_aes)
cifrado = aesgcm.encrypt(nonce, mensaje, None)

# Cifrar clave AES con RSA pública de Bob
clave_aes_cifrada = clave_bob_publica.encrypt(
    clave_aes,
    padding.OAEP(
        mgf=padding.MGF1(algorithm=hashes.SHA256()),
        algorithm=hashes.SHA256(),
        label=None
    )
)

# Se envía: (clave_aes_cifrada, nonce, cifrado)

# Bob descifra
clave_aes_recibida = clave_bob_privada.decrypt(
    clave_aes_cifrada,
    padding.OAEP(
        mgf=padding.MGF1(algorithm=hashes.SHA256()),
        algorithm=hashes.SHA256(),
        label=None
    )
)

aesgcm2 = AESGCM(clave_aes_recibida)
mensaje_descifrado = aesgcm2.decrypt(nonce, cifrado, None)
print(f"Mensaje descifrado: {mensaje_descifrado.decode()}")
```

```
Mensaje descifrado: Hola Bob, ¿quedamos mañana?
```

**Desglose de las dos mitades:**

- **RSA hace el reparto:** cifra los 32 bytes de la clave AES con la pública de Bob.
- **AES hace el volumen:** cifra el mensaje (de cualquier tamaño) con esa clave.

---

## 🌐 Por qué HTTPS usa esto

Cuando entras en una web con `https://`:

1. Tu navegador genera una **clave AES** aleatoria (la clave de sesión).
2. La cifra con la **clave pública RSA** del servidor (su certificado).
3. El servidor la descifra con su **clave privada**: ahora ambos comparten la misma clave AES.
4. Todo el tráfico de la sesión se cifra con **AES**, rápido, y con **firma** (via TLS) para la integridad.

RSA solo se usa al principio, para repartir el secreto. El resto, a toda velocidad con AES.

---

## 🔐 RBAC: Control de acceso basado en roles

**RBAC** (*Role-Based Access Control*) es la forma de decidir **quién puede hacer qué**: los permisos no se asignan a cada persona, sino a su **rol**. Es el principio de **mínimo privilegio** llevado a la práctica.

```python
class Usuario:
    def __init__(self, nombre, rol):
        self.nombre = nombre
        self.rol = rol

PERMISOS = {
    "admin":  ["leer", "escribir", "borrar", "compartir"],
    "editor": ["leer", "escribir"],
    "lector": ["leer"],
}

def puede(usuario, accion):
    return accion in PERMISOS.get(usuario.rol, [])

ana = Usuario("Ana", "admin")
bob = Usuario("Bob", "lector")

print(f"Ana puede borrar: {puede(ana, 'borrar')}")    # True
print(f"Bob puede borrar: {puede(bob, 'borrar')}")    # False
```

RBAC también protege la criptografía:

```python
PERMISOS_CRYPTO = {
    "admin":    ["cifrar", "descifrar", "firmar"],
    "usuario":  ["cifrar", "firmar"],
    "invitado": ["cifrar"],
}

def puede_crypto(usuario, accion):
    return accion in PERMISOS_CRYPTO.get(usuario["rol"], [])

print(puede_crypto({"rol": "admin"}, "descifrar"))   # True
print(puede_crypto({"rol": "invitado"}, "firmar"))   # False
```

---

## 🏗️ El sistema completo: cifrar + firmar

```python
from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from cryptography.hazmat.primitives import hashes
import os

# 1. Claves de Ana (firmante) y Bob (destinatario)
clave_ana = rsa.generate_private_key(public_exponent=65537, key_size=2048)
clave_bob = rsa.generate_private_key(public_exponent=65537, key_size=2048)

# 2. Ana prepara el mensaje
mensaje = b"Plan de ataque: manana a las 8"

# 3. Cifrado híbrido: AES cifra, RSA protege la clave AES
clave_aes = AESGCM.generate_key(bit_length=256)
nonce = os.urandom(12)
aesgcm = AESGCM(clave_aes)
cifrado = aesgcm.encrypt(nonce, mensaje, None)
clave_aes_cifrada = clave_bob.public_key().encrypt(
    clave_aes,
    padding.OAEP(
        mgf=padding.MGF1(algorithm=hashes.SHA256()),
        algorithm=hashes.SHA256(),
        label=None
    )
)

# 4. Firma: SHA256 + clave privada de Ana
firma = clave_ana.sign(
    mensaje,
    padding.PKCS1v15(),
    hashes.SHA256()
)

# 5. Bob recibe y descifra
clave_aes_recibida = clave_bob.decrypt(
    clave_aes_cifrada,
    padding.OAEP(
        mgf=padding.MGF1(algorithm=hashes.SHA256()),
        algorithm=hashes.SHA256(),
        label=None
    )
)
aesgcm2 = AESGCM(clave_aes_recibida)
original = aesgcm2.decrypt(nonce, cifrado, None)

# 6. Bob verifica la firma de Ana
try:
    clave_ana.public_key().verify(
        firma,
        original,
        padding.PKCS1v15(),
        hashes.SHA256()
    )
    print("✅ Firma VÁLIDA — mensaje de Ana, no alterado")
except (ValueError, TypeError):
    print("❌ Firma INVÁLIDA — no es de Ana o fue manipulado")

print(f"📦 Mensaje recibido: {original.decode()}")
```

```
✅ Firma VÁLIDA — mensaje de Ana, no alterado
📦 Mensaje recibido: Plan de ataque: manana a las 8
```

| Fase | Pieza | Garantía |
|---|---|---|
| 3a. Cifrar mensaje | AES (GCM) | Confidencialidad del contenido |
| 3b. Proteger la clave AES | RSA (OAEP) | Solo Bob la descifra |
| 4. Firmar | SHA256 + RSA privada | Autenticidad de Ana |
| 5. Descifrar | RSA privada + AES | Confidencialidad |
| 6. Verificar | SHA256 + RSA pública | Autenticidad + integridad |

---

## ✏️ Aprieta el lápiz

1. **AES básico**: Cifra un mensaje con AESGCM, luego descifralo. Muestra el nonce.
2. **RSA: cifra y descifra**: Genera un par RSA, cifra un mensaje corto y descifralo.
3. **Cifrado híbrido**: Cifra un mensaje largo con AES, cifra la clave AES con RSA.
4. **Firma y verifica**: Firma un mensaje, modifícalo y comprueba que la verificación falla.
5. **RBAC**: Implementa un sistema con 3 roles y 4 acciones.

---

## 🧠 Mini-chequeo

1. ¿Qué garantiza la fase de cifrado AES y qué garantiza la firma?
2. ¿Por qué el mensaje se cifra con AES y no directamente con RSA?
3. ¿Qué recibe Bob del mensaje y qué comprueba antes de confiar en él?

<details>
<summary>🔄 Respuestas</summary>

1. El cifrado AES garantiza la **confidencialidad**; la firma garantiza la **autenticidad** y la **integridad**.
2. Porque RSA es **lento** y limita el mensaje a ~190 bytes; AES cifra cualquier tamaño a ~1 GB/s.
3. Bob recibe `clave_AES_cifrada_RSA` + `nonce` + `cifrado` + `firma`. Antes de confiar, descifra y **verifica la firma**.
</details>

---

## ✅ Resumen en 3 frases

- El híbrido junta **RSA** (repartir la clave) y **AES** (cifrar el volumen).
- RBAC asigna permisos a **roles**, no a personas: mínima superficie de ataque.
- Un sistema seguro completo combina cifrado híbrido + firma digital + RBAC.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| Cifrado híbrido | AES para el mensaje + RSA para la clave AES |
| RBAC | Control de acceso basado en roles |
| Rol | El paquete de permisos de una función |
| Sistema seguro | Cifrado híbrido + firma digital combinados |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/08-seguridad-y-cifrado) · **Anterior:** [07 · Firmas digitales](/ApuntesPSP/08-seguridad-y-cifrado/07-firmas-digitales) · **Siguiente:** [09 · Cierre](/ApuntesPSP/08-seguridad-y-cifrado/09-cierre)
