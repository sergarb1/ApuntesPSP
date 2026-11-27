---
title: Boletín UD 10 — Avanzado
description: Ejercicios avanzados de Seguridad y cifrado
---

# 💪 Boletín UD 10 — Avanzado

> Ejercicios que requieren aplicar hash, César, AES, RSA y firmas de forma más profunda, con programas completos.

---

## 1. Cifrado César con espacios

Implementa una función `cifrar_cesar(texto, desplazamiento)` que cifre frases completas respetando espacios y signos de puntuación sin modificarlos. Pruébala con `"Hola mundo"` con desplazamiento 5.

**Pista:** recorre carácter a carácter. Si `caracter.isalpha()` es verdadero, aplica la fórmula con `% 26`; si no, añade el carácter tal cual. La salida debe ser `"Mtqf rzsit"`.

## 2. Fuerza bruta César

Dado un texto cifrado con César (desplazamiento desconocido), prueba los 25 desplazamientos y muestra solo los que tengan palabras en español.

**Pista:** para cada desplazamiento del 1 al 25, aplica el descifrado César. Usa un conjunto de palabras comunes en español (como `"hola"`, `"mundo"`, `"python"`) para filtrar resultados. Si el texto descifrado contiene alguna palabra conocida, es probable que sea el correcto.

## 3. Hash con salt

Añade un salt aleatorio al hash de una contraseña para evitar tablas rainbow.

**Pista:** genera un salt de 16 bytes con `os.urandom(16)` y calcula `hashlib.sha256(salt + password.encode()).hexdigest()`. Guarda el resultado como `salt.hex() + hash` (string hex). Para verificar, extrae los primeros 32 caracteres (la sal en hex, 16 bytes) con `bytes.fromhex()` y repite el cálculo. Si dos usuarios tienen la misma contraseña, sus hashes serán distintos gracias al salt.

## 4. Mini gestor de contraseñas

Guarda contraseñas con hash + salt en un archivo JSON. Permite registro y login.

**Pista:** almacena cada usuario en un JSON con el formato `salt.hex() + hashlib.sha256(salt + password.encode()).hexdigest()`. Para verificar, extrae el salt (primeros 32 caracteres hexadecimales), conviértelo a bytes con `bytes.fromhex()` y recalcula el hash con la contraseña proporcionada.

## 5. Cifrado híbrido simplificado

Genera una clave AES de 32 bytes y cifra `b"El cifrado hibrido funciona"`. Luego cifra esa clave AES con una clave RSA pública. Descifra en orden inverso y verifica el mensaje original.

**Pista:** cifra el mensaje con `AES.new(clave_aes, AES.MODE_EAX)` y `encrypt_and_digest`; cifra la clave AES con `PKCS1_OAEP.new(clave.publickey()).encrypt(clave_aes)`. Para descifrar, invierte el orden: primero RSA (con la privada), luego AES (con el mismo nonce).

## 6. Firma alterada

Firma digitalmente el mensaje `"Transferencia de 500€".encode()`. Modifica UN byte de la firma y comprueba que la verificación falla con `pkcs1_15.new(...).verify(...)`.

**Pista:** para modificar un byte de la firma, conviértela a `bytearray`, cambia un índice (`firma_mutada[0] ^= 0xFF`) y vuelve a bytes. La verificación debe lanzar `ValueError` o `TypeError`.

## 7. RBAC con permisos cifrado

Crea un sistema RBAC con 3 roles: `admin` (cifrar, descifrar, firmar), `usuario` (cifrar, firmar), `invitado` (solo cifrar). Implementa la función `puede(usuario, accion)` y pruébala con cada rol.

**Pista:** un diccionario `permisos = {"admin": ["cifrar", "descifrar", "firmar"], ...}` y `return accion in permisos.get(usuario["rol"], [])`. Los roles desconocidos deben devolver `False`.

## 8. Cifrar archivo completo

Crea un archivo de texto `mensaje.txt` con algún contenido y cifra el archivo completo con AES, guardando el resultado. Luego descifralo y comprueba que coincide.

**Pista:** primero crea `mensaje.txt` (p. ej. `open("mensaje.txt", "w").write("Contenido secreto")`). Abre el archivo en modo binario `"rb"` / `"wb"`. Usa `AES.MODE_EAX`, cifra con `encrypt_and_digest` y guarda `nonce + tag + cifrado`. Para descifrar, separa los tres componentes y usa `decrypt_and_verify`.

## 9. RSA: cifrar mensajes largos

RSA solo cifra ~190 bytes. Intenta cifrar un mensaje de 300 bytes. ¿Qué pasa? ¿Cómo lo arreglas?

**Pista:** captura el `ValueError` para ver el mensaje de error. Piensa en combinar RSA con un cifrado simétrico como AES (cifrado híbrido).

## 10. Firma con verificación de integridad

Firma un mensaje, modifica el mensaje, y muestra que la verificación falla.

**Pista:** usa `SHA256.new(mensaje)` y `pkcs1_15.new(clave).sign(h)`. Después de firmar el original, crea un segundo mensaje modificado y verifícalo con la misma firma. La verificación debe lanzar `ValueError` o `TypeError`.

## 11. RSA vs AES benchmark

Mide cuánto tarda cifrar el mismo mensaje con RSA y AES. La diferencia es abismal.

**Pista:** usa `time.time()` antes y después de un bucle de 100 cifrados RSA y otro de 1000 cifrados AES. Con `time.time() - t` obtienes los segundos. Multiplica por 1000 para milisegundos.

## 12. Sistema de cifrado de extremo a extremo

Simula un chat cifrado: cada usuario tiene su par RSA, y los mensajes se cifran con AES + RSA híbrido.

**Pista:** crea una clase `Usuario` con `nombre` y `clave_rsa`. Un método `cifrar_para(mensaje, destinatario)` que genera clave AES, cifra el mensaje y la clave. Otro método `descifrar(nonce, tag, clave_aes_cifrada, cifrado)` que hace el proceso inverso.

---

📚 [Volver a la unidad](/ApuntesPSP/09-seguridad-y-cifrado) · Resuelto: [✅ Boletín UD 10 — Avanzado (Resuelto)](/ApuntesPSP/boletines/boletin-u09-avanzado-resuelto)
