---
title: Boletín U08 — Avanzado (Resuelto)
description: Soluciones de los ejercicios avanzados de Hash y Cifrado Clásico
---

# 💪 Boletín U08 — Avanzado (Resuelto)

---

## 1. Hash de un archivo de texto

```python
import hashlib

with open("mensaje.txt", "rb") as f:
    hash_archivo = hashlib.sha256(f.read()).hexdigest()
print(f"SHA256 del archivo: {hash_archivo}")

hash_texto = hashlib.sha256(b"Hola mundo").hexdigest()
print(f"SHA256 del texto:   {hash_texto}")
print(f"¿Coinciden? {hash_archivo == hash_texto}")  # True
```

Si `mensaje.txt` contiene exactamente `Hola mundo` (sin salto de línea extra, o con el mismo contenido exacto), el hash coincide: `ca8f60b2cc7f05837d98b208b57fb6481553fc5f1219d59618fd025002a66f5c`. Hashear un archivo en modo binario es hashear **sus bytes exactos** ([punto 3](/ApuntesPSP/08-hash-y-cifrado-clasico/03-md5-sha1-sha256)).

## 2. Cifrado César con espacios

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

## 3. Descifrado con mayúsculas y minúsculas

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

print(descifrar_cesar("Nkrru", 2))  # Lipps
```

Descifrar es cifrar con desplazamiento **negativo** ([punto 6](/ApuntesPSP/08-hash-y-cifrado-clasico/06-cifrado-cesar)): cada letra se mueve 2 hacia atrás. La mayúscula inicial `N` usa la base `ord('A')` y devuelve `L`; el resto, minúsculas, usan `ord('a')`. `isupper()` garantiza que el caso se preserva.

## 4. Verificador de integridad

```python
import hashlib

with open("archivo.pdf", "rb") as f:
    hash_calculado = hashlib.sha256(f.read()).hexdigest()

hash_oficial = "8a1f9c..."  # el hash publicado por la web oficial

if hash_calculado == hash_oficial:
    print("✅ El archivo es íntegro: no ha sido manipulado.")
else:
    print("❌ ¡Alerta! El archivo NO coincide con el oficial.")
```

La comparación de hashes detecta **cualquier** modificación: un solo bit distinto produce un hash completamente diferente (efecto avalancha). Es la verificación de integridad del [punto 8](/ApuntesPSP/08-hash-y-cifrado-clasico/08-buenas-practicas-y-verificacion).

## 5. Fuerza bruta César

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

Solo hay **25 desplazamientos posibles** ([punto 6](/ApuntesPSP/08-hash-y-cifrado-clasico/06-cifrado-cesar)). Filtrando por palabras comunes en español, el desplazamiento 5 devuelve "Hola mundo" y es el único con sentido. Se rompe en segundos.

## 6. Hash con salt

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

Con la misma contraseña, Ana y Bob tienen **hashes distintos** gracias a sus sales únicas. El salt ocupa los 32 primeros caracteres hex (16 bytes), que se recuperan con `bytes.fromhex()` para el login ([punto 5](/ApuntesPSP/08-hash-y-cifrado-clasico/05-hash-con-sal)).

## 7. Comparación gráfica de avalancha

```python
import hashlib

h1 = hashlib.sha256(b"Hola mundo").hexdigest()
h2 = hashlib.sha256(b"Hola mund0").hexdigest()  # una 'o' por un '0'

diferentes = sum(1 for a, b in zip(h1, h2) if a != b)
print(f"h1: {h1}")
print(f"h2: {h2}")
print(f"Caracteres diferentes: {diferentes} de {len(h1)}")
```

La entrada cambia **una sola letra**, pero de los 64 caracteres hex suelen diferir la mitad o más (≈50%), que es el **efecto avalancha** ([punto 2](/ApuntesPSP/08-hash-y-cifrado-clasico/02-que-es-un-hash)). Ninguna parte del hash "se parece" al del texto original.

## 8. Velocidad de hashes

```python
import hashlib, time

texto = b"clave123"
iteraciones = 1_000_000

for nombre, func in (("MD5", hashlib.md5), ("SHA1", hashlib.sha1), ("SHA256", hashlib.sha256)):
    inicio = time.time()
    for _ in range(iteraciones):
        func(texto).hexdigest()
    fin = time.time()
    print(f"{nombre}: {fin - inicio:.2f} segundos")
```

MD5 suele ser el más rápido, SHA1 intermedio y **SHA256 el más lento**: más bits que procesar. Ahora bien, "más lento" es justo lo que quieres en una contraseña: al atacante le cuesta más adivinar por fuerza bruta. Nunca elijas el algoritmo por velocidad, sino por seguridad ([punto 3](/ApuntesPSP/08-hash-y-cifrado-clasico/03-md5-sha1-sha256)).

## 9. Mini gestor de contraseñas

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

Cada usuario se guarda como `salt.hex() + hash` en un diccionario, y se exporta a JSON con `json.dump`. Para verificar, el login extrae la sal (primeros 32 caracteres hex), la convierte con `bytes.fromhex()` y recalcula el hash ([punto 5](/ApuntesPSP/08-hash-y-cifrado-clasico/05-hash-con-sal)). Si dos usuarios comparten contraseña, sus registros JSON son **distintos**.