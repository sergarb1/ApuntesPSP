---
title: Boletín U08 — Avanzado
description: Ejercicios avanzados de Hash y Cifrado Clásico
---

# 💪 Boletín U08 — Avanzado

> Ejercicios que requieren aplicar los conceptos de hash, sal y cifrado César de forma más profunda, con programas completos.

---

## 1. Hash de un archivo de texto

Escribe "Hola mundo" en un archivo `mensaje.txt`. Lee su contenido en modo binario y calcula el hash SHA256. Verifica que coincida con hacer hash directamente del mismo string.

**Pista:** abre el archivo con `with open("mensaje.txt", "rb") as f:` y pasa `f.read()` directo a `hashlib.sha256().hexdigest()`. El resultado debe coincidir con `hashlib.sha256(b"Hola mundo").hexdigest()`.

## 2. Cifrado César con espacios

Implementa una función `cifrar_cesar(texto, desplazamiento)` que cifre frases completas respetando espacios y signos de puntuación sin modificarlos. Pruébala con `"Hola mundo"` con desplazamiento 5.

**Pista:** recorre carácter a carácter. Si `caracter.isalpha()` es verdadero, aplica la fórmula con `% 26`; si no, añade el carácter tal cual. La salida debe ser `"Mtqf rzsit"`.

## 3. Descifrado con mayúsculas y minúsculas

Implementa descifrado César que gestione tanto mayúsculas como minúsculas. Descifra `"Nkrru"` sabiendo que fue cifrado con desplazamiento 2.

**Pista:** descifrar es cifrar con desplazamiento negativo: `cifrar_cesar(texto, -desplazamiento)`. Usa `ord('A')` o `ord('a')` según `isupper()` para preservar mayúsculas y minúsculas.

## 4. Verificador de integridad

Calcula el SHA256 de un archivo y compáralo con un hash esperado.

**Pista:** lee el archivo en modo binario (`"rb"`) y pásalo directamente a `hashlib.sha256().hexdigest()`. Compara el hash calculado con el hash esperado del mismo contenido. Si coinciden, el archivo no ha sido modificado.

## 5. Fuerza bruta César

Dado un texto cifrado con César (desplazamiento desconocido), prueba los 25 desplazamientos y muestra solo los que tengan palabras en español.

**Pista:** para cada desplazamiento del 1 al 25, aplica el descifrado César. Usa un conjunto de palabras comunes en español (como `"hola"`, `"mundo"`, `"python"`) para filtrar resultados. Si el texto descifrado contiene alguna palabra conocida, es probable que sea el correcto.

## 6. Hash con salt

Añade un salt aleatorio al hash de una contraseña para evitar tablas rainbow.

**Pista:** genera un salt de 16 bytes con `os.urandom(16)`. El hash final es `salt + sha256(salt + password.encode()).digest()`. Para verificar, extrae los primeros 16 bytes (el salt) y repite el cálculo. Si dos usuarios tienen la misma contraseña, sus hashes serán distintos gracias al salt.

## 7. Comparación gráfica de avalancha

Muestra cómo un bit de diferencia en la entrada cambia completamente el hash.

**Pista:** convierte ambos hashes a hexadecimal con `hexdigest()` y compáralos carácter por carácter. Cuenta cuántos caracteres son diferentes. El efecto avalancha debería mostrar aproximadamente el 50% de caracteres distintos aunque la entrada cambie solo un bit.

## 8. Velocidad de hashes

Compara cuánto tarda MD5 vs SHA1 vs SHA256 en hashear 1 millón de veces.

**Pista:** usa un bucle de 1 millón de iteraciones llamando a cada función de hash (`hashlib.md5`, `hashlib.sha1`, `hashlib.sha256`). Mide el tiempo total con `time.time()` antes y después. MD5 es el más rápido; SHA256 el más lento pero más seguro.

## 9. Mini gestor de contraseñas

Guarda contraseñas con hash + salt en un archivo JSON. Permite registro y login.

**Pista:** almacena cada usuario en un JSON con el formato `salt.hex() + hashlib.sha256(salt + password.encode()).hexdigest()`. Para verificar, extrae el salt (primeros 32 caracteres hexadecimales), conviértelo a bytes con `bytes.fromhex()` y recalcula el hash con la contraseña proporcionada.