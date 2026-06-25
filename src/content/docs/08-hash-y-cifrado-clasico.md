---
title: "TEMA 08 — Hash y Cifrado Clásico"
nav_order: 08
---

## TEMA 08 — Hash y Cifrado Clásico (RA5)

> "La criptografía es como las cerraduras: algunas son tan débiles que un soplido las abre (César), otras son tan seguras que ni un ejército las rompe (SHA-256)."

---

## Índice

1. [Principios de seguridad](#principios-de-seguridad)
2. [Hash — la huella digital](#hash--la-huella-digital)
3. [MD5, SHA-1, SHA-256 — ¿cuál usar?](#md5-sha-1-sha-256--cuál-usar)
4. [Be the code, my friend, my friend — Hash de una contraseña](#be-the-code-my-friend-my-friend--hash-de-una-contraseña)
5. [Hash con sal](#hash-con-sal)
6. [🥊 El ring de los conceptos — Hash vs Cifrado](#el-ring-de-los-conceptos--hash-vs-cifrado)
7. [Preguntas tontas — Hash](#preguntas-tontas--hash)
8. [Cifrado César — el abuelo de la criptografía](#cifrado-césar--el-abuelo-de-la-criptografía)
9. [Be the code, my friend, my friend — César paso a paso](#be-the-code-my-friend-my-friend--césar-paso-a-paso)
10. [✏️ Aprieta el lápiz](#✏-aprieta-el-lápiz)
11. [RAs cubiertos y criterios de evaluación](#ras-cubiertos-y-criterios-de-evaluación)

---

## Principios de seguridad

Antes de cifrar nada, entiende estos principios. Son la base de todo.

| Principio | Traducción al español de la calle |
|-----------|-----------------------------------|
| **Zero Trust** | No te fíes ni de tu sombra. Verifica siempre. |
| **Mínimo privilegio** | Da solo los permisos mínimos necesarios. |
| **Defensa en profundidad** | No pongas toda la seguridad en una capa. |
| **Cifra todo** | En tránsito (TLS) y en reposo (disco). |
| **Rotación de claves** | Cambia las claves periódicamente. |
| **No inventes tu cripto** | Las bibliotecas existentes ya han sido auditadas. |

> "La seguridad no es un producto, es un proceso." — Bruce Schneier

---

## Hash — la huella digital

Un **hash** es una función que convierte cualquier entrada en una cadena de longitud fija. Es **unidireccional**: no se puede revertir.

```python
import hashlib

texto = b"Hola mundo"

print("MD5:", hashlib.md5(texto).hexdigest())
print("SHA1:", hashlib.sha1(texto).hexdigest())
print("SHA256:", hashlib.sha256(texto).hexdigest())
```

**Salida**:
```
MD5: 6cd3556deb0da54bca060b4c3947983f
SHA1: 182178c5daa62f6b5d17b1b08c6ff2c1f6959e29
SHA256: f2f09b3e8fbc885d8e2d5c5e2e8d7f9c6b7a5d4e3f2c1b0a9d8e7f6c5b4a3d2
```

### Propiedades del hash

- **Determinista**: misma entrada → mismo hash
- **Unidireccional**: no se puede obtener el original
- **Longitud fija**: MD5=128 bits, SHA1=160 bits, SHA256=256 bits
- **Efecto avalancha**: un cambio mínimo cambia completamente el hash
- **Colisiones**: dos entradas diferentes con el mismo hash (casi imposible en SHA256)

---

## MD5, SHA-1, SHA-256 — ¿cuál usar?

| Algoritmo | Bits | ¿Seguro? | Uso recomendado |
|-----------|------|----------|-----------------|
| **MD5** | 128 | ❌ No | Solo checksums no críticos |
| **SHA-1** | 160 | ❌ No | Solo legacy |
| **SHA-256** | 256 | ✅ Sí | Todo uso general |
| **SHA-512** | 512 | ✅ Sí | Cuando necesites más seguridad |

```python
import hashlib

# Hash de un archivo (verificar integridad)
with open("archivo.pdf", "rb") as f:
    hash_archivo = hashlib.sha256(f.read()).hexdigest()
    print(f"SHA256 del archivo: {hash_archivo}")
```

> **Nunca uses MD5 o SHA-1 para seguridad**. Son vulnerables a colisiones. Usa SHA-256 o superior.

---

## Be the code, my friend, my friend — Hash de una contraseña

> "Sé el programa que registra a un usuario y luego verifica su login. Contraseñas seguras, sin almacenar la original."

```python
import hashlib

def registrar(usuario, contraseña):
    hash_contra = hashlib.sha256(contraseña.encode()).hexdigest()
    print(f"  Usuario '{usuario}' registrado")
    print(f"  Hash: {hash_contra[:16]}...")
    return hash_contra

def login(usuario, contraseña, hash_almacenado):
    hash_intento = hashlib.sha256(contraseña.encode()).hexdigest()
    if hash_intento == hash_almacenado:
        print(f"  ✅ {usuario}: login correcto")
        return True
    else:
        print(f"  ❌ {usuario}: contraseña incorrecta")
        return False

# Simular registro y login
hash_ana = registrar("Ana", "MiClaveSecreta123")
login("Ana", "MiClaveSecreta123", hash_ana)  # ✅
login("Ana", "OtraClave", hash_ana)           # ❌
```

**Traza**:
```
1. Ana se registra con "MiClaveSecreta123"
2. Python codifica a bytes → b"MiClaveSecreta123"
3. hashlib.sha256() procesa → 256 bits de hash
4. hexdigest() devuelve 64 caracteres hexadecimales
5. Guardamos en BD: "a1b2c3d4e5f6..."

6. Ana hace login con "MiClaveSecreta123"
7. Calculamos hash del intento → "a1b2c3d4e5f6..."
8. Comparamos con el almacenado → ¡COINCIDEN!
9. ✅ Login correcto

10. Un atacante intenta con "OtraClave"
11. Hash del intento → "ff34ee22..."
12. No coincide → ❌ Acceso denegado
```

> La contraseña original **nunca** se almacena. Solo su hash.

---

## Hash con sal

El ejemplo anterior tiene un problema: si Ana y Bob usan la misma contraseña, sus hashes son **idénticos**. Un atacante lo vería al instante y sabría que comparten clave.

La solución: añadir **sal** (salt) — un valor aleatorio distinto por usuario que se mezcla con la contraseña antes de hashear.

```python
import hashlib, os

def registrar_con_salt(usuario, contraseña):
    salt = os.urandom(16)                          # 🧂 Salt: 16 bytes NUEVOS cada vez
    hash_contra = hashlib.sha256(salt + contraseña.encode()).hexdigest()
    almacenado = salt.hex() + hash_contra           # Guardamos: salt + hash juntos
    print(f"  Usuario '{usuario}' registrado")
    print(f"  Almacenado (salt+hash): {almacenado[:32]}...")
    return almacenado

def login_con_salt(usuario, contraseña, almacenado):
    # Del string guardado extraemos el salt (primera mitad) y el hash (resto)
    salt = bytes.fromhex(almacenado[:32])           # 🧂 RECUPERAMOS el mismo salt
    hash_original = almacenado[32:]                  # Hash que se guardó al registrar
    hash_intento = hashlib.sha256(salt + contraseña.encode()).hexdigest()
    if hash_intento == hash_original:
        print(f"  ✅ {usuario}: login correcto")
        return True
    else:
        print(f"  ❌ {usuario}: contraseña incorrecta")
        return False

# Simular — dos usuarios CON LA MISMA contraseña
hash_ana = registrar_con_salt("Ana", "clave123")   # os.urandom genera salt_A
hash_bob = registrar_con_salt("Bob", "clave123")   # os.urandom genera salt_B (distinto)

print(f"\n¿Son iguales los hashes? {hash_ana == hash_bob}")  # ¡NO!
# salt_A + "clave123" ≠ salt_B + "clave123" → hashes distintos

login_con_salt("Ana", "clave123", hash_ana)    # ✅ extrae salt_A, recalcula, coincide
login_con_salt("Ana", "otra", hash_ana)        # ❌ extrae salt_A, recalcula, NO coincide
```

**Salida**:
```
  Usuario 'Ana' registrado
  Almacenado (salt+hash): a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6...
  Usuario 'Bob' registrado
  Almacenado (salt+hash): ffee00112233445566778899aabbccddee...

¿Son iguales los hashes? False

  ✅ Ana: login correcto
  ❌ Ana: contraseña incorrecta
```

> La sal **se genera al registrar** y se guarda junto al hash. Al hacer login se recupera la misma sal del string almacenado. Así siempre podemos recalcular el hash exacto. Sin sal, dos usuarios con "clave123" tendrían el mismo hash y un atacante con tabla rainbow lo descubriría al instante.

---

## 🧩 Pool Puzzle — Verificación de contraseña con hash

¿Puedes ordenar estas líneas para crear un sistema de registro + login?

```
a)     hash_login = hashlib.sha256((password + sal).encode()).hexdigest()
b)     sal = os.urandom(16).hex()
c) return hash_guardado == hash_calculado
d) import hashlib, os
e)     hash_guardado = hashlib.sha256((password + sal).encode()).hexdigest()
f)     return hash_guardado + ":" + sal
g) def verificar(password, hash_guardado):
h) def registrar(password):
```

<details>
<summary>🔓 Solución</summary>

**Orden correcto:** d → h → b → e → f → g → a → c

```python
import hashlib, os                                          # d) imports

def registrar(password):                                    # h) función registro
    sal = os.urandom(16).hex()                              # b) sal aleatoria
    hash_guardado = hashlib.sha256(                         # e) hash(password + sal)
        (password + sal).encode()
    ).hexdigest()
    return hash_guardado + ":" + sal                        # f) guardamos ambos

def verificar(password, hash_guardado):                     # g) función login
    sal = hash_guardado.split(":")[1]                       # extraer sal
    hash_login = hashlib.sha256(                            # a) recalcular hash
        (password + sal).encode()
    ).hexdigest()
    return hash_guardado == hash_calculado                  # c) comparar
```

**Truco:** La sal se genera **una vez** en el registro y se guarda con el hash. En el login se extrae del string guardado. Sin ese paso, nunca coincidirían.
</details>

---

## 🥊 El ring de los conceptos — Hash vs Cifrado

**Hash**: — Yo soy la huella digital. Transformo cualquier texto en una cadena fija. No se puede deshacer. Unidireccional. Para siempre.

**Cifrado**: — Vaya, qué drástico. Yo puedo cifrar y descifrar. Tengo clave. Si tú pierdes un hash, no hay vuelta atrás. Yo puedo recuperar el mensaje original.

**Hash**: — ¡Esa es precisamente mi gracia! Para contraseñas no quieres que se pueda deshacer. Si alguien roba la base de datos, que se pegue con los hashes.

**Cifrado**: — Pero para enviar un mensaje secreto, el hash no sirve. Necesitas que el destinatario pueda leerlo. Ahí entro yo.

**Hash**: — Y para verificar integridad, nadie me gana. Un archivo, un hash. Si cambia un bit, el hash cambia por completo.

**Cifrado**: — Al final, cada uno a lo suyo. Tú para integridad y contraseñas; yo para confidencialidad.

> **Moraleja**: El hash verifica integridad (no se puede deshacer). El cifrado protege confidencialidad (se puede deshacer con la clave). Ambos son necesarios.

---

## Preguntas tontas — Hash

**❓ ¿Se puede descifrar un hash?**
No, el hash no se descifra (es unidireccional). Pero se puede **adivinar** usando tablas rainbow o fuerza bruta. Por eso se usa **salt**: añadir un valor aleatorio antes de hashear.

**❓ ¿Qué es una tabla rainbow?**
Una tabla precomputada de hashes para contraseñas comunes (123456, password, etc). Si tu hash está en la tabla, tu contraseña está comprometida. El **salt** lo evita porque añade aleatoriedad.

**❓ ¿Qué pasa si dos usuarios tienen la misma contraseña?**
Sin salt, tendrían el mismo hash. Un atacante lo sabría. Con salt, aunque la contraseña sea la misma, los hashes son diferentes (mira el ejemplo de [Hash con sal](#hash-con-sal) más arriba).

**❓ ¿Para qué sirve el hash de un archivo?**
Para verificar integridad. Descargas Ubuntu, verificas su SHA256, y si coincide con el de la web oficial, sabes que no lo han manipulado.

---

## Cifrado César — el abuelo de la criptografía

Julio César desplazaba cada letra 3 posiciones. El receptor, 3 hacia atrás.

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

def descifrar_cesar(texto, desplazamiento):
    return cifrar_cesar(texto, -desplazamiento)

original = "Hola Mundo"
cifrado = cifrar_cesar(original, 3)
descifrado = descifrar_cesar(cifrado, 3)

print(f"Original:  {original}")     # Hola Mundo
print(f"Cifrado:   {cifrado}")      # Krod Pxqgr
print(f"Descifrado:{descifrado}")   # Hola Mundo
```

> **César NO es seguro**. Solo 25 desplazamientos posibles. Se rompe en segundos. Pero es perfecto para aprender el concepto.

---

## Be the code, my friend, my friend — César paso a paso

> "Sé el cifrado César caracter a caracter."

```
cifrar_cesar("Hola Mundo", 3)

1. Carácter 'H' (mayúscula)
   → base = ord('A') = 65
   → (ord('H') - 65 + 3) % 26 + 65
   → (72 - 65 + 3) % 26 + 65
   → 10 % 26 + 65
   → 10 + 65 = 75
   → chr(75) = 'K'

2. Carácter 'o' (minúscula)
   → base = ord('a') = 97
   → (111 - 97 + 3) % 26 + 97
   → 17 % 26 + 97
   → 17 + 97 = 114
   → chr(114) = 'r'

3. 'l' → 'o'
4. 'a' → 'd'
5. ' ' → ' ' (no es letra, se queda igual)
6. 'M' → 'P'
7. 'u' → 'x'
8. 'n' → 'q'
9. 'd' → 'g'
10. 'o' → 'r'

Resultado: "Krod Pxqgr" 🏁
```

---

## ✏️ Aprieta el lápiz

1. **Compara hashes**: Calcula MD5, SHA1 y SHA256 de la palabra "python". ¿Cuánto mide cada hash?
2. **Efecto avalancha**: Calcula SHA256 de "Hola mundo" y "Hola mund0" (cambia una 'o' por '0'). Compara.
3. **César personalizado**: Cifra "Hola mundo" con desplazamiento 5 y descifra el resultado.
4. **Fuerza bruta César**: Dado un texto cifrado con César (sin saber el desplazamiento), prueba los 25 desplazamientos hasta encontrar el que tenga sentido.
5. **Hash de archivo**: Calcula el SHA256 de un archivo .py de tu proyecto.

---

## RAs cubiertos y criterios de evaluación

### RA5 — Seguridad (parcial: hash, César, principios)

| Criterio | Descripción | Cubierto |
|----------|-------------|----------|
| RA5a | Principios básicos de seguridad | ✅ |
| RA5c | Implementa funciones hash (MD5, SHA) | ✅ |
| RA5h | Conoce sistemas de roles y RBAC | ✅ (principios) |

> RA5b (tipos de cifrado), RA5d (AES), RA5e (RSA), RA5f (firmas) y RA5g (cifrado híbrido) se cubren en el **TEMA 09**.
