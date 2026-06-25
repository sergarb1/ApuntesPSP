---
title: "TEMA 09 — Cifrado Moderno"
nav_order: 09
---

## TEMA 09 — Cifrado Moderno (RA5)

> "El cifrado moderno es como tener una caja fuerte con dos cerraduras: una rápida (AES) y otra segura para intercambiar llaves (RSA)."

---

## Índice

1. [Cifrado simétrico — AES](#cifrado-simétrico--aes)
2. [Componentes de AES](#componentes-de-aes)
3. [Be the code, my friend, my friend — AES paso a paso](#be-the-code-my-friend-my-friend--aes-paso-a-paso)
4. [Cifrado asimétrico — RSA](#cifrado-asimétrico--rsa)
5. [🥊 El ring de los conceptos — AES vs RSA](#el-ring-de-los-conceptos--aes-vs-rsa)
6. [Cifrado híbrido — lo mejor de ambos mundos](#cifrado-híbrido--lo-mejor-de-ambos-mundos)
7. [Firmas digitales — demostrar autoría](#firmas-digitales--demostrar-autoría)
8. [Roles y RBAC](#roles-y-rbac)
9. [Be the code, my friend, my friend — Firma y verificación](#be-the-code-my-friend-my-friend--firma-y-verificación)
10. [Preguntas tontas — Cifrado Moderno](#preguntas-tontas--cifrado-moderno)
11. [✏️ Aprieta el lápiz](#✏-aprieta-el-lápiz)
12. [RAs cubiertos y criterios de evaluación](#ras-cubiertos-y-criterios-de-evaluación)

---

## Cifrado simétrico — AES

Un solo cifrado con una sola clave. El que tiene la clave, puede descifrar.

```python
from Crypto.Cipher import AES
from Crypto.Random import get_random_bytes

# Generar clave (32 bytes = 256 bits)
clave = get_random_bytes(32)

# Cifrar
cifrador = AES.new(clave, AES.MODE_EAX)
mensaje = b"Mensaje secreto"
texto_cifrado, tag = cifrador.encrypt_and_digest(mensaje)

print(f"Original: {mensaje}")
print(f"Cifrado (hex): {texto_cifrado.hex()}")
print(f"Nonce: {cifrador.nonce.hex()}")

# Descifrar
cifrador2 = AES.new(clave, AES.MODE_EAX, nonce=cifrador.nonce)
texto_descifrado = cifrador2.decrypt(texto_cifrado)
print(f"Descifrado: {texto_descifrado}")
```

> AES es **simétrico**: misma clave para cifrar y descifrar. El problema es compartir esa clave de forma segura.

---

## Componentes de AES

| Componente | Descripción | ¿Se envía? |
|------------|-------------|------------|
| **Clave** | 16, 24 o 32 bytes (AES-128/192/256) | ❌ Secreto |
| **Nonce** | Número aleatorio único | ✅ Se envía con el cifrado |
| **Tag** | Código de autenticación (integridad) | ✅ Se envía |
| **Texto cifrado** | El mensaje cifrado | ✅ Se envía |

```
Paquete enviado: [nonce 16B | tag 16B | cifrado ...]
```

---

## Be the code, my friend, my friend — AES paso a paso

> "Ana quiere enviar un mensaje a Bob. Traza cada byte."

```
🔵 ANA (emisora)

1. Tiene el mensaje: "Nos vemos a las 8"
2. Genera clave AES: get_random_bytes(32) → b'\xa1\xb2\xc3...' (32 bytes)
3. Crea cifrador AES modo EAX
   → AES.new(clave, AES.MODE_EAX)
   → Genera nonce automáticamente: b'\x4f\x3a...' (16 bytes)

4. Cifra:
   → encrypt_and_digest(b"Nos vemos a las 8")
   → Devuelve (texto_cifrado, tag)
   → texto_cifrado = b'\x7f\xe2...' (ilegible)
   → tag = b'\x1a\xb2...' (16 bytes)

5. Envía a Bob: nonce + tag + texto_cifrado
   ┌──────────────────────────────────────┐
   │ nonce (16B) │ tag (16B) │ cifrado    │
   │ \x4f\x3a...  │ \x1a\xb2...  │ \x7f\xe2... │
   └──────────────────────────────────────┘

🟢 BOB (receptor)

6. Recibe: nonce = primeros 16 bytes
            tag = siguientes 16 bytes
            cifrado = resto

7. AES.new(clave, AES.MODE_EAX, nonce=recibido)
8. decrypt_and_verify(cifrado)
   → Si el tag coincide → datos íntegros ✅
   → Si no → lanza excepción (alguien manipuló el mensaje)

9. Bob lee: "Nos vemos a las 8" 🏁
```

---

## Cifrado asimétrico — RSA

Dos claves: una **pública** (todos pueden verla) y una **privada** (solo tú).

```python
from Crypto.PublicKey import RSA
from Crypto.Cipher import PKCS1_OAEP

# Generar par de claves
clave_rsa = RSA.generate(2048)
privada = clave_rsa.export_key()
publica = clave_rsa.publickey().export_key()

# Cifrar con clave PÚBLICA
cifrador = PKCS1_OAEP.new(RSA.import_key(publica))
mensaje = b"Mensaje secreto para Bob"
texto_cifrado = cifrador.encrypt(mensaje)

# Descifrar con clave PRIVADA
descifrador = PKCS1_OAEP.new(RSA.import_key(privada))
texto_descifrado = descifrador.decrypt(texto_cifrado)
print(f"Descifrado: {texto_descifrado}")
```

| Característica | AES | RSA |
|----------------|-----|-----|
| Claves | Una | Dos (pública + privada) |
| Velocidad | Rápido (~1GB/s) | Lento (~1MB/s) |
| Tamaño máximo | Ilimitado | ~190 bytes (con 2048 bits) |
| Distribución de clave | Problema | Fácil |

> RSA no sirve para cifrar mensajes grandes. Para eso necesitas **cifrado híbrido**.

---

## 🥊 El ring de los conceptos — AES vs RSA

**AES**: "Soy rapidísimo. Cifro un archivo entero en milisegundos. ¿El problema? Ambos necesitamos la misma clave."

**RSA**: "Yo soy lento, pero elegante. Tú me das tu clave pública, yo cifro, y solo tú con tu privada puedes descifrar."

**AES**: "Entonces, ¿para qué sirves si eres tan lento?"

**RSA**: "Para **distribuir tu clave**. Yo cifro tu clave AES con mi RSA. Tú la descifras con tu privada. Luego usamos AES para todo."

**AES**: "O sea, ¿trabajamos en equipo?"

**RSA**: "Exacto. Eso se llama **cifrado híbrido**. Lo usan HTTPS, WhatsApp, Signal..."

---

## Cifrado híbrido — lo mejor de ambos mundos

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

![](/diagrams/cifrado-hibrido.svg)

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

> Este es el método que usa **HTTPS**: RSA para negociar la clave de sesión, AES para cifrar el tráfico.

---

## Firmas digitales — demostrar autoría

Una **firma digital** demuestra que un mensaje fue creado por quien dice serlo y que no fue modificado.

**Firmar** (con clave privada):
```python
from Crypto.Signature import pkcs1_15
from Crypto.Hash import SHA256
from Crypto.PublicKey import RSA

clave = RSA.generate(2048)
mensaje = b"Este mensaje es de Ana"

h = SHA256.new(mensaje)
firma = pkcs1_15.new(clave).sign(h)
print(f"Firma: {firma.hex()[:32]}...")
```

**Verificar** (con clave pública):
```python
try:
    h = SHA256.new(mensaje)
    pkcs1_15.new(clave.publickey()).verify(h, firma)
    print("✅ Firma VÁLIDA — mensaje de Ana, no alterado")
except (ValueError, TypeError):
    print("❌ Firma INVÁLIDA — manipulada o no es de Ana")
```

**Flujo completo**:
```
1. Ana escribe mensaje
2. Calcula SHA256 del mensaje
3. Cifra el hash con su clave PRIVADA → esto es la firma
4. Envía: mensaje + firma
5. Bob recibe
6. Descifra firma con clave PÚBLICA de Ana → hash original
7. Calcula SHA256 del mensaje recibido
8. ¿Coinciden? → ✅ Es de Ana y nadie lo modificó
```

---

## Roles y RBAC

RBAC = Role-Based Access Control. Los permisos dependen del **rol** del usuario.

```python
class Usuario:
    def __init__(self, nombre, rol):
        self.nombre = nombre
        self.rol = rol

class Documento:
    def __init__(self, titulo, contenido):
        self.titulo = titulo
        self.contenido = contenido

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

| Rol | Leer | Escribir | Borrar | Compartir |
|-----|------|----------|--------|-----------|
| admin | ✅ | ✅ | ✅ | ✅ |
| editor | ✅ | ✅ | ❌ | ❌ |
| lector | ✅ | ❌ | ❌ | ❌ |

---

## Be the code, my friend, my friend — Firma y verificación

> "Sé el proceso de firma digital desde que Ana escribe hasta que Bob verifica."

```
🔵 ANA

1. Tiene mensaje: "Mañana a las 8 en el café"
2. SHA256 → 256 bits de hash
3. Cifra hash con su RSA privada → firma digital (256 bytes)
4. Envía a Bob: [mensaje] + [firma]

🚀 Por la red viaja: "Mañana a las 8 en el café" + 256 bytes de firma

🟢 BOB

5. Recibe mensaje + firma
6. Calcula SHA256 del mensaje recibido
7. Descifra la firma con clave pública de Ana
8. Compara hashes...

   ┌─────────────────────────────────────┐
   │ ¿Son iguales? → ✅ Mensaje de Ana  │
   │ ¿Son diferentes? → ❌ Algo va mal  │
   └─────────────────────────────────────┘

9. Si alguien modificó el mensaje: hashes diferentes → ❌
10. Si no es de Ana: la clave pública no descifra la firma → ❌
```

---

## Preguntas tontas — Cifrado Moderno

**❓ ¿Qué clave uso para cada operación?**
- Cifrar para alguien: usa su clave **pública**
- Descifrar: usa tu clave **privada**
- Firmar: usa tu clave **privada**
- Verificar firma: usa la clave **pública** del firmante

**❓ ¿Qué es más seguro, AES-256 o RSA-2048?**
Ambos son seguros hoy en día. No compiten: son herramientas diferentes para problemas diferentes.

**❓ ¿Qué pasa si pierdo mi clave privada?**
Pierdes acceso a todo lo cifrado con tu clave pública. Por eso se hacen **copias de seguridad** (y se guardan bien).

**❓ ¿Puedo tener la misma clave RSA siempre?**
Sí, las claves no caducan. Pero por seguridad se recomienda rotarlas cada cierto tiempo (como cambiar la contraseña).

**❓ ¿Cuánto tarda RSA en generar claves?**
Generar RSA 2048 bits lleva ~1-2 segundos. AES genera clave instantáneamente.

---

## ✏️ Aprieta el lápiz

1. **AES básico**: Cifra un mensaje con AES, luego descifralo. Muestra el nonce y el tag.
2. **RSA: cifra y descifra**: Genera un par RSA, cifra un mensaje corto y descifralo.
3. **Cifrado híbrido**: Cifra un mensaje largo con AES, cifra la clave AES con RSA. Simula el intercambio.
4. **Firma y verifica**: Firma un mensaje, luego modifícalo y comprueba que la verificación falla.
5. **RBAC**: Implementa un sistema con 3 roles (admin, editor, lector) y 4 acciones (leer, escribir, borrar, compartir).

---

## RAs cubiertos y criterios de evaluación

### RA5 — Seguridad (completo)

| Criterio | Descripción | Cubierto |
|----------|-------------|----------|
| RA5a | Principios básicos de seguridad | ✅ |
| RA5b | Tipos de cifrado (simétrico, asimétrico) | ✅ |
| RA5c | Funciones hash | ✅ |
| RA5d | AES | ✅ |
| RA5e | RSA | ✅ |
| RA5f | Firmas digitales | ✅ |
| RA5g | Cifrado híbrido | ✅ |
| RA5h | Roles y RBAC | ✅ |
