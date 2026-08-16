---
title: 08 — Buenas prácticas y verificación
description: Checksums, cuándo hash y cuándo cifrar, y a practicar ✏️
---

<p><small>Checksums, cuándo hash y cuándo cifrar, y a practicar ✏️</small></p>

> 🗺️ **Estás en:** 🔐 **U08 · Hash y Cifrado Clásico** → 08 · Buenas prácticas y verificación

---

## 📬 La idea en una frase

> El hash se usa para **verificar integridad**: descargas un archivo, calculas su checksum y lo comparas con el publicado por el autor. Si coincide, el archivo es exactamente el que publicaron; si no, no te fíes de él.

Este punto cierra la teoría con las reglas del oficio y un repaso práctico: cuándo toca hash, cuándo toca cifrar, y los ejercicios "Aprieta el lápiz" del tema para que lo interiorices.

---

## ✅ Verificación de integridad: el checksum de las descargas

La aplicación más cotidiana del hash (ya la rozaste en el [punto 3](/ApuntesPSP/08-hash-y-cifrado-clasico/03-md5-sha1-sha256)): las páginas de descarga de software publican el **SHA-256** de cada archivo. Tú descargas el archivo, calculas su hash y comparas:

```
Página oficial:  SHA256 = a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b
Tu descarga:     SHA256 = a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b
                                                                          ✅ COINCIDEN
```

```python
import hashlib

with open("archivo.pdf", "rb") as f:
    hash_calculado = hashlib.sha256(f.read()).hexdigest()

hash_oficial = "a1b2c3d4..."  # el que publica la web

if hash_calculado == hash_oficial:
    print("✅ El archivo es íntegro: no ha sido manipulado.")
else:
    print("❌ ¡Alerta! El archivo NO coincide con el oficial.")
```

**Por qué funciona:** el efecto avalancha ([punto 2](/ApuntesPSP/08-hash-y-cifrado-clasico/02-que-es-un-hash)) hace que un solo bit distinto produzca un hash completamente diferente. Si el hash coincide, la probabilidad de que el archivo haya sido tocado es prácticamente nula (con SHA-256).

> 🔒 Descarga Ubuntu, un instalador o un ISO desde un espejo no oficial y verifícalo: es la rutina de seguridad que ya practicas sin darte cuenta cada vez que instalas software.

---

## 🤔 ¿Cuándo hash y cuándo cifrado? La regla de oro

Recuerda el [punto 7](/ApuntesPSP/08-hash-y-cifrado-clasico/07-hash-vs-cifrado): no son rivales, son para cosas distintas.

| Necesitas… | ¿Hash o cifrado? | ¿Por qué? |
|---|---|---|
| Verificar que un archivo no cambió | 🧂 **Hash** | Unidireccional, un bit cambia todo el hash |
| Guardar contraseñas | 🧂 **Hash** (con sal) | No quieres recuperarlas nunca, solo comparar |
| Enviar un mensaje que solo el destinatario lea | 🔑 **Cifrado** | El destinatario debe poder descifrarlo |
| Confirmar la identidad del autor de un mensaje | 🧂 Hash + 🔑 **firma digital** (U09) | Combina ambos: hash del mensaje cifrado con clave privada |

> ⚠️ **Error típico de novato:** cifrar la contraseña en vez de hashearla. Si roban la base de datos y la clave de cifrado, recuperan todo. El hash, al ser unidireccional, ni con la clave se deshace. Solo el hash (con sal) es correcto para contraseñas.

---

## 🧭 Guía rápida de buenas prácticas

- **Usa siempre SHA-256 o SHA-512** para seguridad; MD5 y SHA-1 solo como checksum no crítico (lo viste en el [punto 3](/ApuntesPSP/08-hash-y-cifrado-clasico/03-md5-sha1-sha256)).
- **Hashea con sal** toda contraseña antes de guardarla ([punto 5](/ApuntesPSP/08-hash-y-cifrado-clasico/05-hash-con-sal)).
- **Nunca** compares ni imprimas contraseñas en claro ([punto 4](/ApuntesPSP/08-hash-y-cifrado-clasico/04-hash-de-contrasenas)).
- **Verifica la integridad** de archivos descargados contra su checksum oficial.
- **No inventes tu cripto**: usa `hashlib` y las bibliotecas auditadas ([punto 1](/ApuntesPSP/08-hash-y-cifrado-clasico/01-principios-de-seguridad)).

---

## ✏️ Aprieta el lápiz

1. **Compara hashes**: Calcula MD5, SHA1 y SHA256 de la palabra "python". ¿Cuánto mide cada hash?
2. **Efecto avalancha**: Calcula SHA256 de "Hola mundo" y "Hola mund0" (cambia una 'o' por '0'). Compara.
3. **César personalizado**: Cifra "Hola mundo" con desplazamiento 5 y descifra el resultado.
4. **Fuerza bruta César**: Dado un texto cifrado con César (sin saber el desplazamiento), prueba los 25 desplazamientos hasta encontrar el que tenga sentido.
5. **Hash de archivo**: Calcula el SHA256 de un archivo .py de tu proyecto.

<details>
<summary>🔓 Soluciones</summary>

**1. Compara hashes:**

```python
import hashlib
texto = b"python"
print(f"MD5:    {hashlib.md5(texto).hexdigest()}")    # 32 caracteres (128 bits)
print(f"SHA1:   {hashlib.sha1(texto).hexdigest()}")   # 40 caracteres (160 bits)
print(f"SHA256: {hashlib.sha256(texto).hexdigest()}") # 64 caracteres (256 bits)
```

MD5 → **32**, SHA1 → **40**, SHA256 → **64** caracteres hexadecimales.

**2. Efecto avalancha:**

```python
import hashlib
h1 = hashlib.sha256(b"Hola mundo").hexdigest()
h2 = hashlib.sha256(b"Hola mund0").hexdigest()
print(f"h1: {h1}")
print(f"h2: {h2}")
print(f"¿Son iguales? {h1 == h2}")  # False
```

Un solo carácter distinto ('o' → '0') produce un hash **completamente diferente**.

**3. César personalizado:**

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

cifrado = cifrar_cesar("Hola mundo", 5)
print(cifrado)                    # Mtqf rzsit
print(descifrar_cesar(cifrado, 5))  # Hola mundo
```

**4. Fuerza bruta César:**

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

cifrado = "Mtqf rzsit"  # "Hola mundo" con desplazamiento 5
for desplazamiento in range(1, 26):
    print(f"Desplazamiento {desplazamiento}: {descifrar_cesar(cifrado, desplazamiento)}")
```

Entre los 25 resultados aparece "Hola mundo" en el desplazamiento 5: ese es el correcto.

**5. Hash de archivo:**

```python
import hashlib
with open("mi_script.py", "rb") as f:
    hash_archivo = hashlib.sha256(f.read()).hexdigest()
print(f"SHA256 de mi_script.py: {hash_archivo}")
```

Sustituye `mi_script.py` por un archivo .py real de tu proyecto. Abrir en modo binario (`"rb"`) garantiza que se hashea el archivo **exacto**.

</details>

---

## 🧠 Mini-chequeo

1. ¿Cómo compruebas que una descarga no fue manipulada?
2. ¿Por qué cifrar la contraseña no sirve para guardarla, y el hash sí?
3. ¿Cuál es el primer paso que probarías en fuerza bruta con un texto cifrado con César?

<details>
<summary>🔄 Respuestas</summary>

1. Calculando su hash (por ejemplo SHA-256) y comparándolo con el que publica la página oficial. Si coinciden, el archivo es íntegro.
2. Porque el cifrado es **reversible**: si el atacante roba la clave, recupera la contraseña. El hash es unidireccional: aunque roben la base de datos, solo tienen huellas irreversibles.
3. Probar los **25 desplazamientos** posibles con fuerza bruta y quedarse con el único que produce texto con sentido. En el ejercicio 4, el desplazamiento 5.
</details>

---

## ✅ Resumen en 3 frases

- El checksum (hash del archivo) es la forma estándar de **verificar integridad** en descargas.
- Regla de oro: **hash** para integridad y contraseñas, **cifrado** para confidencialidad.
- Con los 5 ejercicios de "Aprieta el lápiz" tienes el material mínimo para dominar la unidad.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| Checksum | Hash de un archivo para comprobar su integridad |
| Verificar integridad | Confirmar que un dato no fue modificado |
| Regla de oro | Hash → integridad; cifrado → confidencialidad |
| Aprieta el lápiz | Los ejercicios prácticos de la unidad |
| Firma digital | Hash + cifrado con clave privada (U09) |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/08-hash-y-cifrado-clasico) · **Anterior:** [07 · Hash vs Cifrado](/ApuntesPSP/08-hash-y-cifrado-clasico/07-hash-vs-cifrado) · **Siguiente:** [09 · Cierre](/ApuntesPSP/08-hash-y-cifrado-clasico/09-cierre)