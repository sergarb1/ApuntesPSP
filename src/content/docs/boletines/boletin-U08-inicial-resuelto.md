---
title: Boletín U08 — Inicial (Resuelto)
description: Soluciones de los ejercicios básicos de Hash y Cifrado Clásico
---

# ✅ Boletín U08 — Inicial (Resuelto)

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

## 3. Compara "Hola" vs "hola"

```python
import hashlib
h1 = hashlib.sha256(b"Hola").hexdigest()
h2 = hashlib.sha256(b"hola").hexdigest()
print(f"Hola:  {h1}")
print(f"hola:  {h2}")
print(f"¿Iguales? {h1 == h2}")
```

- `Hola` → `e633f4fc79badea1dc5db970cf397c8248bac47cc3acf9915ba60b5d76b0e88f`
- `hola` → `b221d9dbb083a7f33428d7c2a3c3198ae925614d70210e28716ccaa7cd4ddb79`

Son **diferentes**: aunque solo cambia la mayúscula por la minúscula, el hash cambia por completo. Es el **efecto avalancha** ([punto 2](/ApuntesPSP/08-hash-y-cifrado-clasico/02-que-es-un-hash)).

## 4. Longitud de los hashes de "Hola mundo"

```python
import hashlib
texto = b"Hola mundo"
print(f"MD5:    {len(hashlib.md5(texto).hexdigest())} chars (128 bits)")
print(f"SHA1:   {len(hashlib.sha1(texto).hexdigest())} chars (160 bits)")
print(f"SHA256: {len(hashlib.sha256(texto).hexdigest())} chars (256 bits)")
```

MD5 → **32**, SHA1 → **40**, SHA256 → **64** caracteres hexadecimales. La longitud es **fija** para cada algoritmo, da igual el tamaño de la entrada.

## 5. Hash de un archivo simple

```python
import hashlib

with open("mensaje.txt", "rb") as f:
    hash_archivo = hashlib.sha256(f.read()).hexdigest()
print(f"SHA256 del archivo: {hash_archivo}")

hash_texto = hashlib.sha256(b"Hola mundo").hexdigest()
print(f"SHA256 del texto:   {hash_texto}")
print(f"¿Coinciden? {hash_archivo == hash_texto}")  # True
```

Si el archivo contiene exactamente `Hola mundo`, ambos coinciden: `ca8f60b2cc7f05837d98b208b57fb6481553fc5f1219d59618fd025002a66f5c`. La clave es abrirlo en **modo binario** `"rb"`.

## 6. Cifrado César sencillo

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

## 7. Descifrar un César dado

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

print(descifrar_cesar("Krod", 3))  # "Hola"
```

Descifrar es cifrar con desplazamiento **negativo** ([punto 6](/ApuntesPSP/08-hash-y-cifrado-clasico/06-cifrado-cesar)): `"Krod"` con -3 devuelve `"Hola"`.

## 8. Determinismo del hash

```python
import hashlib
h1 = hashlib.sha256(b"clave123").hexdigest()
h2 = hashlib.sha256(b"clave123").hexdigest()
print(f"Primera:  {h1}")
print(f"Segunda:  {h2}")
print(f"¿Iguales? {h1 == h2}")  # True
```

Son **iguales**: el hash es **determinista** ([punto 2](/ApuntesPSP/08-hash-y-cifrado-clasico/02-que-es-un-hash)). Misma entrada → mismo hash, siempre. Esa propiedad es la que hace posible el login por comparación de hashes del [punto 4](/ApuntesPSP/08-hash-y-cifrado-clasico/04-hash-de-contrasenas).