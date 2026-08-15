---
title: Boletín U08 — Inicial
description: Ejercicios básicos de Hash y Cifrado Clásico
---

# 📝 Boletín U08 — Inicial

> Ejercicios básicos para afianzar los conceptos de hash (MD5, SHA-1, SHA-256) y cifrado César de la unidad U08.

---

## 1. SHA1 de tu nombre

Calcula el hash SHA1 de tu nombre (en minúsculas) usando `hashlib.sha1()`. Muestra el resultado en hexadecimal con `.hexdigest()`.

**Pista:** recuerda que `hashlib` espera bytes: escribe tu nombre como `b"sergi"` o con `.encode()`.

## 2. MD5 de una frase

Calcula el hash MD5 de la frase `"Python es genial"`. Muestra el resultado en hexadecimal.

## 3. Compara "Hola" vs "hola"

Calcula SHA256 de `"Hola"` y de `"hola"`. ¿Los hashes son iguales o diferentes? ¿Por qué?

**Pista:** solo cambia la mayúscula por la minúscula… y el hash cambia por completo. Así es el **efecto avalancha**.

## 4. Longitud de los hashes de "Hola mundo"

Calcula MD5, SHA1 y SHA256 de `"Hola mundo"` y escribe cuántos caracteres hexadecimales devuelve cada uno.

## 5. Hash de un archivo simple

Crea un archivo de texto con el contenido `"Hola mundo"`, ábrelo en modo binario (`"rb"`) y calcula su hash SHA256. Compara el resultado con el hash SHA256 del propio texto.

**Pista:** `hashlib.sha256(f.read()).hexdigest()` dentro de un `with open("mensaje.txt", "rb") as f:`. El hash debe coincidir con `hashlib.sha256(b"Hola mundo").hexdigest()`.

## 6. Cifrado César sencillo

Implementa una función `cifrar_cesar(texto, desplazamiento)` y cifra `"Hola"` con desplazamiento 3. ¿Qué texto obtienes?

## 7. Descifrar un César dado

Usando la función de descifrado César, descifra `"Krod"` con desplazamiento 3. ¿Qué texto original aparece?

**Pista:** descifrar es cifrar con desplazamiento **negativo**: `cifrar_cesar(texto, -desplazamiento)`.

## 8. Determinismo del hash

Calcula dos veces el SHA256 de `"clave123"` y compáralos. ¿Son iguales? ¿Qué propiedad del hash te lo garantiza?

**Pista:** un hash es **determinista**: misma entrada → mismo hash, siempre.