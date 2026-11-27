---
title: "03 — Contraseñas seguras"
description: "Guarda la huella, nunca la original, con sal para confundir a los robots 🔐"
---

<p><small>Guarda la huella, nunca la original, con sal para confundir a los robots 🔐</small></p>

> 🗺️ **Estás en:** 🔐 **UD 10 · Seguridad y cifrado** → 03 · Contraseñas seguras

---

## 📬 La idea en una frase

> Cuando un usuario se registra, no guardamos su contraseña: guardamos su **hash** con **sal**. Así, si roban la base de datos, no roban contraseñas. Ni siquiera las tablas rainbow sirven.

---

## 🎭 Be the code: registro y login con hash

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

**Salida**:
```
  Usuario 'Ana' registrado
  Hash: 0f2adb0aee3de894...
  ✅ Ana: login correcto
  ❌ Ana: contraseña incorrecta
```

La máquina nunca ve la contraseña: ve su hash. El registro calcula el hash y lo devuelve. El login vuelve a calcular el hash del intento y lo compara con el almacenado.

---

## 🗄️ La regla de oro

> La contraseña original **nunca** se almacena. Solo su hash.

- Si roban la base de datos con hashes, no tienen contraseñas: solo huellas irreversibles.
- Los sistemas serios además añaden **sal** (abajo) para que ni siquiera las huellas idénticas se reconozcan entre usuarios.
- Cifrar la contraseña en lugar de hashaarla **no** sirve para esto: si el atacante roba también la clave de cifrado, recupera todo. El hash es la elección correcta por ser unidireccional.

> ⚠️ **Y lo que NUNCA debe aparecer en tu código:** `if contraseña == contraseña_guardada:` comparando texto plano, ni un `print(f"Contraseña de Ana: {contraseña}")` en los logs.

---

## 🕳️ El problema: hashes idénticos

```python
import hashlib
print(hashlib.sha256(b"clave123").hexdigest())
print(hashlib.sha256(b"clave123").hexdigest())
```

Ambas líneas imprimen **exactamente el mismo hash**. Si Ana y Bob usan "clave123", su base de datos tendrá dos filas con el mismo hash. Un atacante lo ve al instante: *"estos dos comparten contraseña"*. Peor aún: un atacante con una **tabla rainbow** (hash de millones de contraseñas comunes precalculadas) buscaría el hash y encontraría "clave123" en segundos.

---

## 🧂 La solución: salt

La **sal** es un valor aleatorio (16 bytes, generado con `os.urandom`) que se concatena a la contraseña **antes** de hashear. Como cada usuario tiene su propia sal, aunque dos compartan contraseña, sus hashes serán distintos.

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

login_con_salt("Ana", "clave123", hash_ana)    # ✅
login_con_salt("Ana", "otra", hash_ana)        # ❌
```

**La clave del proceso:** la sal se genera **una vez**, al registrar, y se guarda junto al hash. En el login **se recupera la misma sal** del string almacenado para poder recalcular el hash exacto.

---

## 🌈 Por qué la sal destroza las tablas rainbow

Una **tabla rainbow** es un diccionario precomputado que mapea contraseñas comunes a sus hashes. Con sal, el hash guardado ya no es el de "clave123": es el de "salt_A + clave123", que es único e impredecible. La tabla rainbow deja de servir.

| Sin sal | Con sal |
|---|---|
| Dos usuarios con la misma clave → mismo hash | → hashes distintos siempre |
| La tabla rainbow funciona al instante | → la tabla rainbow queda inútil |
| Un ataque revela contraseñas compartidas | → nada se delata |

---

## 🧠 Mini-chequeo

1. ¿Qué guardamos exactamente en la base de datos al registrar a un usuario?
2. ¿Qué problema resuelve la sal y contra qué ataque concreto protege?
3. ¿Por qué los 32 primeros caracteres del string guardado son la sal?

<details>
<summary>🔄 Respuestas</summary>

1. Solo el **hash** de la contraseña con su **sal** (`salt.hex() + hash`). Nunca la contraseña en claro.
2. Resuelve los **hashes idénticos** cuando dos usuarios usan la misma contraseña, y neutraliza las **tablas rainbow** porque cada hash incluye una sal aleatoria distinta.
3. Porque `os.urandom(16)` genera 16 bytes y `salt.hex()` los representa como **32 caracteres hex** (2 por byte). Al guardar `salt.hex() + hash`, la sal ocupa siempre los **32 primeros caracteres** del string.
</details>

---

## ✅ Resumen en 3 frases

- En el registro se guarda el **hash** de la contraseña con **sal**; en el login se hashea el intento con la misma sal y se comparan huellas.
- Sin sal, dos usuarios con la misma contraseña comparten hash y las tablas rainbow triunfan. Con sal, cada hash es único.
- La sal se genera al registrar, se guarda junto al hash, y en el login se recupera para recalcular la huella exacta.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| Hash de contraseña | Huella irreversible que se guarda en lugar del texto plano |
| Sal (salt) | Valor aleatorio mezclado con la contraseña antes de hashear |
| Tabla rainbow | Diccionario precomputado de hashes de contraseñas comunes |
| os.urandom(16) | Genera 16 bytes aleatorios criptográficamente fuertes |
| bytes.fromhex() | Convierte texto hexadecimal de vuelta a bytes |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/09-seguridad-y-cifrado) · **Anterior:** [02 · Hash y huellas digitales](/ApuntesPSP/09-seguridad-y-cifrado/02-hash-y-huellas-digitales) · **Siguiente:** [04 · Cifrado clásico](/ApuntesPSP/09-seguridad-y-cifrado/04-cifrado-clasico)
