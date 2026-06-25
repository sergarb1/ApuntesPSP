---
title: "⭐ AVANZADO 9 — Cifrado Moderno"
nav_order: 9
---

## ⭐ AVANZADO 09 — Cifrado Moderno


---

### 1. 🎯 Cifrar archivo completo

Cifra un archivo de texto con AES y guarda el resultado. Luego descifralo.

**Pista**: Abre el archivo en modo binario `"rb"` / `"wb"`. Usa `AES.MODE_EAX`, cifra con `encrypt_and_digest` y guarda `nonce + tag + cifrado`. Para descifrar, separa los tres componentes y usa `decrypt_and_verify`.

---

### 2. 🔍 RSA: cifrar mensajes largos

RSA solo cifra ~190 bytes. Intenta cifrar un mensaje de 300 bytes. ¿Qué pasa? ¿Cómo lo arreglas?

**Pista**: Captura el `ValueError` para ver el mensaje de error. Piensa en combinar RSA con un cifrado simétrico como AES (cifrado híbrido).

---

### 3. 🧩 Intercambio de claves simulado

Simula el intercambio de claves entre Ana y Bob: Ana genera RSA, Bob cifra una clave AES con RSA pública de Ana.

**Pista**: Define una clave AES de 32 bytes del lado de Bob. Bob cifra el mensaje con AES, luego cifra la clave AES con la RSA pública de Ana. Envía los 4 componentes (clave_AES_cifrada, nonce, tag, cifrado). Ana descifra en orden inverso.

---

### 4. 🎭 Firma con verificación de integridad

Firma un mensaje, modifica el mensaje, y muestra que la verificación falla.

**Pista**: Usa `SHA256.new(mensaje)` y `pkcs1_15.new(clave).sign(h)`. Después de firmar el original, crea un segundo mensaje modificado y verifícalo con la misma firma. La verificación debe lanzar `ValueError` o `TypeError`.

---

### 5. ⏱ RSA vs AES benchmark

Mide cuánto tarda cifrar el mismo mensaje con RSA y AES. La diferencia es abismal.

**Pista**: Usa `time.time()` antes y después de un bucle de 100 cifrados RSA y otro de 1000 cifrados AES. Con `time.time() - t` obtienes los segundos. Multiplica por 1000 para milisegundos.

---

### 6. 🏗️ Sistema de cifrado de extremo a extremo

Simula un chat cifrado: cada usuario tiene su par RSA, y los mensajes se cifran con AES + RSA híbrido.

**Pista**: Crea una clase `Usuario` con `nombre` y `clave_rsa`. Un método `cifrar_para(mensaje, destinatario)` que genera clave AES, cifra el mensaje y la clave. Otro método `descifrar(nonce, tag, clave_aes_cifrada, cifrado)` que hace el proceso inverso.

---
