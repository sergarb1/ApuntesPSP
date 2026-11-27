---
title: Boletín UD 10 — Inicial
description: Ejercicios básicos de Seguridad y cifrado
---

# 📝 Boletín UD 10 — Inicial

> Ejercicios básicos para afianzar los conceptos de hash (MD5, SHA), César y el cifrado moderno (AES, RSA) de la unidad UD 10.

---

## 1. SHA1 de tu nombre

Calcula el hash SHA1 de tu nombre (en minúsculas) usando `hashlib.sha1()`. Muestra el resultado en hexadecimal con `.hexdigest()`.

**Pista:** recuerda que `hashlib` espera bytes: escribe tu nombre como `b"sergi"` o con `.encode()`.

## 2. MD5 de una frase

Calcula el hash MD5 de la frase `"Python es genial"`. Muestra el resultado en hexadecimal.

## 3. Longitud de los hashes de "Hola mundo"

Calcula MD5, SHA1 y SHA256 de `"Hola mundo"` y escribe cuántos caracteres hexadecimales devuelve cada uno.

## 4. Cifrado César sencillo

Implementa una función `cifrar_cesar(texto, desplazamiento)` y cifra `"Hola"` con desplazamiento 3. ¿Qué texto obtienes?

## 5. Determinismo del hash

Calcula dos veces el SHA256 de `"clave123"` y compáralos. ¿Son iguales? ¿Qué propiedad del hash te lo garantiza?

**Pista:** un hash es **determinista**: misma entrada → mismo hash, siempre.

## 6. Nonce y tag

Cifra `b"Hola mundo con AES"` usando AES modo EAX (librería `pycryptodome`). Imprime por pantalla las longitudes del nonce y del tag (en bytes).

**Pista:** `cifrador.nonce` y `tag` son objetos bytes: `len(cifrador.nonce)` y `len(tag)`. El nonce del modo EAX suele medir 16 bytes.

## 7. AES: cifrar y descifrar completo

Cifra `b"El cifrado simetrico es rapido"` con AES (EAX), y descifralo a continuación. Muestra el nonce, el tag y el mensaje original.

**Pista:** usa `encrypt_and_digest` para cifrar y `AES.new(clave, AES.MODE_EAX, nonce=cifrador.nonce).decrypt(texto_cifrado)` para descifrar.

## 8. Simétrico vs asimétrico

Responde razonadamente:

a) ¿Cuántas claves usa el cifrado simétrico? ¿Y el asimétrico?
b) ¿Con qué clave cifras un mensaje para que solo Bob lo lea?
c) ¿Por qué RSA no sirve para cifrar un archivo grande?

---

📚 [Volver a la unidad](/ApuntesPSP/09-seguridad-y-cifrado) · Resuelto: [✅ Boletín UD 10 — Inicial (Resuelto)](/ApuntesPSP/boletines/boletin-u09-inicial-resuelto)
