---
title: Boletín U09 — Avanzado
description: Ejercicios avanzados de Cifrado Moderno
---

# 💪 Boletín U09 — Avanzado

> Ejercicios que requieren aplicar AES, RSA, firmas y cifrado híbrido de forma más profunda, con programas completos.

---

## 1. Cifrado híbrido simplificado

Genera una clave AES de 32 bytes y cifra `b"El cifrado hibrido funciona"`. Luego cifra esa clave AES con una clave RSA pública. Descifra en orden inverso y verifica el mensaje original.

**Pista:** cifra el mensaje con `AES.new(clave_aes, AES.MODE_EAX)` y `encrypt_and_digest`; cifra la clave AES con `PKCS1_OAEP.new(clave.publickey()).encrypt(clave_aes)`. Para descifrar, invierte el orden: primero RSA (con la privada), luego AES (con el mismo nonce).

## 2. Firma alterada

Firma digitalmente el mensaje `b"Transferencia de 500€"`. Modifica UN byte de la firma y comprueba que la verificación falla con `pkcs1_15.new(...).verify(...)`.

**Pista:** para modificar un byte de la firma, conviértela a `bytearray`, cambia un índice (`firma_mutada[0] ^= 0xFF`) y vuelve a bytes. La verificación debe lanzar `ValueError` o `TypeError`.

## 3. RBAC con permisos cifrado

Crea un sistema RBAC con 3 roles: `admin` (cifrar, descifrar, firmar), `usuario` (cifrar, firmar), `invitado` (solo cifrar). Implementa la función `puede(usuario, accion)` y pruébala con cada rol.

**Pista:** un diccionario `permisos = {"admin": ["cifrar", "descifrar", "firmar"], ...}` y `return accion in permisos.get(usuario["rol"], [])`. Los roles desconocidos deben devolver `False`.

## 4. Cifrar archivo completo

Cifra un archivo de texto con AES y guarda el resultado. Luego descifralo.

**Pista:** abre el archivo en modo binario `"rb"` / `"wb"`. Usa `AES.MODE_EAX`, cifra con `encrypt_and_digest` y guarda `nonce + tag + cifrado`. Para descifrar, separa los tres componentes y usa `decrypt_and_verify`.

## 5. RSA: cifrar mensajes largos

RSA solo cifra ~190 bytes. Intenta cifrar un mensaje de 300 bytes. ¿Qué pasa? ¿Cómo lo arreglas?

**Pista:** captura el `ValueError` para ver el mensaje de error. Piensa en combinar RSA con un cifrado simétrico como AES (cifrado híbrido).

## 6. Intercambio de claves simulado

Simula el intercambio de claves entre Ana y Bob: Ana genera RSA, Bob cifra una clave AES con RSA pública de Ana.

**Pista:** define una clave AES de 32 bytes del lado de Bob. Bob cifra el mensaje con AES, luego cifra la clave AES con la RSA pública de Ana. Envía los 4 componentes (clave_AES_cifrada, nonce, tag, cifrado). Ana descifra en orden inverso.

## 7. Firma con verificación de integridad

Firma un mensaje, modifica el mensaje, y muestra que la verificación falla.

**Pista:** usa `SHA256.new(mensaje)` y `pkcs1_15.new(clave).sign(h)`. Después de firmar el original, crea un segundo mensaje modificado y verifícalo con la misma firma. La verificación debe lanzar `ValueError` o `TypeError`.

## 8. RSA vs AES benchmark

Mide cuánto tarda cifrar el mismo mensaje con RSA y AES. La diferencia es abismal.

**Pista:** usa `time.time()` antes y después de un bucle de 100 cifrados RSA y otro de 1000 cifrados AES. Con `time.time() - t` obtienes los segundos. Multiplica por 1000 para milisegundos.

## 9. Sistema de cifrado de extremo a extremo

Simula un chat cifrado: cada usuario tiene su par RSA, y los mensajes se cifran con AES + RSA híbrido.

**Pista:** crea una clase `Usuario` con `nombre` y `clave_rsa`. Un método `cifrar_para(mensaje, destinatario)` que genera clave AES, cifra el mensaje y la clave. Otro método `descifrar(nonce, tag, clave_aes_cifrada, cifrado)` que hace el proceso inverso.