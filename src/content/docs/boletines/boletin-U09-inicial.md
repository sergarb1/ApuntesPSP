---
title: Boletín U09 — Inicial
description: Ejercicios básicos de Cifrado Moderno
---

# 📝 Boletín U09 — Inicial

> Ejercicios básicos para afianzar los conceptos de AES, RSA y la diferencia simétrico/asimétrico de la unidad U09.

---

## 1. AES modo ECB

Cifra el mensaje `b"0123456789ABCDEF"` (16 bytes exactos) usando AES en modo ECB. Muestra el resultado en hexadecimal.

**Pista:** ECB no necesita nonce ni tag: `AES.new(clave, AES.MODE_ECB)` y `cifrador.encrypt(mensaje)`. El mensaje debe medir exactamente 16 bytes (o usar `pad`).

## 2. Nonce y tag

Cifra `b"Hola mundo con AES"` usando AES modo EAX. Imprime por pantalla las longitudes del nonce y del tag (en bytes).

**Pista:** `cifrador.nonce` y `tag` son objetos bytes: `len(cifrador.nonce)` y `len(tag)`. El nonce del modo EAX suele medir 16 bytes.

## 3. RSA: exportar clave

Genera un par de claves RSA de 2048 bits. Exporta la clave pública a formato PEM (string) y muestra sus primeros 40 caracteres y sus últimos 40 caracteres.

## 4. AES: cifrar mensaje

Cifra el mensaje `b"Hola AES"` con AES en modo EAX y muestra el texto cifrado en hexadecimal.

## 5. AES: descifrar

Descifra el mensaje cifrado en el ejercicio 4 y muestra el original.

**Pista:** necesitas la **misma clave** y el **mismo nonce**: `AES.new(clave, AES.MODE_EAX, nonce=cifrador.nonce)`.

## 6. RSA: generar claves

Genera un par RSA de 2048 bits y muestra los primeros 50 caracteres de la clave pública en formato PEM.

## 7. Simétrico vs asimétrico

Responde razonadamente:

a) ¿Cuántas claves usa el cifrado simétrico? ¿Y el asimétrico?
b) ¿Con qué clave cifras un mensaje para que solo Bob lo lea?
c) ¿Por qué RSA no sirve para cifrar un archivo grande?

## 8. AES: cifrar y descifrar completo

Cifra `b"El cifrado simetrico es rapido"` con AES (EAX), y descifralo a continuación. Muestra el nonce, el tag y el mensaje original.

**Pista:** usa `encrypt_and_digest` para cifrar y `AES.new(clave, AES.MODE_EAX, nonce=cifrador.nonce).decrypt(texto_cifrado)` para descifrar.