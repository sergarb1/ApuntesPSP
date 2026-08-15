---
title: 05 — Hash con sal
description: La sal que arruina las tablas rainbow 🧂
---

<p><small>La sal que arruina las tablas rainbow 🧂</small></p>

> 🗺️ **Estás en:** 🔐 **U08 · Hash y Cifrado Clásico** → 05 · Hash con sal

---

## 📬 La idea en una frase

> Hashear una contraseña sin más tiene un agujero: si Ana y Bob usan la misma clave, sus hashes son **idénticos** y un atacante lo ve al instante. La solución es la **sal** (salt): un valor aleatorio distinto por usuario que se mezcla con la contraseña antes de hashear.

El [punto 4](/ApuntesPSP/08-hash-y-cifrado-clasico/04-hash-de-contrasenas) guardaba el hash, pero había un problema silencioso. Vamos a arreglarlo.

---

## 🕳️ El problema: hashes idénticos

```python
import hashlib
print(hashlib.sha256(b"clave123").hexdigest())
print(hashlib.sha256(b"clave123").hexdigest())
```

Ambas líneas imprimen **exactamente el mismo hash**. Si Ana y Bob usan "clave123", su base de datos tendrá dos filas con el mismo hash:

```
Ana | <mismo_hash_de_clave123>
Bob | <mismo_hash_de_clave123>
```

Un atacante que robe esa base lo ve al instante: *"estos dos comparten contraseña"*. Peor aún: un atacante con una **tabla rainbow** (hash de millones de contraseñas comunes precalculadas) buscaría el hash y encontraría "clave123" en segundos. Todo el sistema del [punto 4](/ApuntesPSP/08-hash-y-cifrado-clasico/04-hash-de-contrasenas) cae.

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

**Salida** (los valores de salt cambian en cada ejecución, por eso son aleatorios):
```
  Usuario 'Ana' registrado
  Almacenado (salt+hash): a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6...
  Usuario 'Bob' registrado
  Almacenado (salt+hash): ffee00112233445566778899aabbccddee...

¿Son iguales los hashes? False

  ✅ Ana: login correcto
  ❌ Ana: contraseña incorrecta
```

**La clave del proceso:** la sal se genera **una vez**, al registrar, y se guarda junto al hash (como `salt.hex() + hash`). En el login **se recupera la misma sal** del string almacenado (`almacenado[:32]` son los 32 caracteres hex de la sal = 16 bytes) para poder recalcular el hash exacto. Sin ese paso, nunca coincidirían.

> 💡 El `[:32]` no es casualidad: `os.urandom(16)` genera 16 bytes, y `salt.hex()` los representa como **32 caracteres hexadecimales** (2 por byte). Por eso la sal ocupa siempre los 32 primeros caracteres del string guardado.

---

## 🌈 Por qué la sal destroza las tablas rainbow

Una **tabla rainbow** es un diccionario precomputado que mapea contraseñas comunes a sus hashes:

```
"123456"  → 8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92
"password"→ 5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8
"clave123"→ 3584f4ef4e3b2e5b5c6f2a…
```

Con esa tabla, buscar un hash de "clave123" es instantáneo. Pero si a cada usuario se le mezcló **su propia sal** con la contraseña, el hash guardado ya no es el de "clave123": es el de "salt_A + clave123", que es único e impredecible. La tabla rainbow deja de servir: para que funcionara, el atacante tendría que precomputar hashes para **todas las salas posibles**, lo cual es inviable.

| Sin sal | Con sal |
|---|---|
| Dos usuarios con la misma clave → mismo hash | → hashes distintos siempre |
| La tabla rainbow funciona al instante | → la tabla rainbow queda inútil |
| Un ataque revela contraseñas compartidas | → nada se delata |

---

## 🧩 Pool Puzzle — Verificación de contraseña con hash

¿Puedes ordenar estas líneas para crear un sistema de registro + login con sal?

```
a)     hash_login = hashlib.sha256((password + sal).encode()).hexdigest()
b)     sal = os.urandom(16).hex()
c) return hash_guardado.split(":")[0] == hash_login
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
    return hash_guardado.split(":")[0] == hash_login        # c) comparar el hash
```

**Truco:** La sal se genera **una vez** en el registro y se guarda con el hash (separada por `:`). En el login se extrae del string guardado con `.split(":")[1]`. Y ojo con el paso c): comparamos la **primera parte** del string guardado (`hash_guardado.split(":")[0]`, el hash) con el hash recalculado. Si comparáramos el string entero (que incluye la sal), nunca coincidiría.
</details>

---

## 🧠 Mini-chequeo

1. ¿Qué problema resuelve la sal y contra qué ataque concreto protege?
2. ¿Por qué los 32 primeros caracteres del string guardado son la sal?
3. En el login, ¿de dónde sale la sal que se usa para recalcular el hash?

<details>
<summary>🔄 Respuestas</summary>

1. Resuelve los **hashes idénticos** cuando dos usuarios usan la misma contraseña, y neutraliza las **tablas rainbow** (y la fuerza bruta precomputada) porque cada hash incluye una sal aleatoria distinta.
2. Porque `os.urandom(16)` genera 16 bytes y `salt.hex()` los representa como **32 caracteres hex** (2 por byte). Al guardar `salt.hex() + hash`, la sal ocupa siempre la primera mitad del string.
3. Del propio string almacenado: `bytes.fromhex(almacenado[:32])` recupera la sal original. Por eso es determinista: recalcular con la misma sal y la misma contraseña da el mismo hash.
</details>

---

## ✅ Resumen en 3 frases

- Sin sal, dos usuarios con la misma contraseña comparten hash y las tablas rainbow triunfan.
- Con sal (`os.urandom(16)`), cada usuario mezcla su contraseña con un valor aleatorio único y sus hashes son irreconocibles entre sí.
- La sal se genera al registrar, se guarda junto al hash, y en el login se recupera para recalcular la huella exacta.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| Sal (salt) | Valor aleatorio mezclado con la contraseña antes de hashear |
| Tabla rainbow | Diccionario precomputado de hashes de contraseñas comunes |
| os.urandom(16) | Genera 16 bytes aleatorios criptográficamente fuertes |
| bytes.fromhex() | Convierte texto hexadecimal de vuelta a bytes |
| Almacenado | String con formato salt + hash |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/08-hash-y-cifrado-clasico) · **Anterior:** [04 · Hash de contraseñas](/ApuntesPSP/08-hash-y-cifrado-clasico/04-hash-de-contrasenas) · **Siguiente:** [06 · Cifrado César](/ApuntesPSP/08-hash-y-cifrado-clasico/06-cifrado-cesar)