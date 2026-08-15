---
title: 03 — Modos de AES
description: "ECB, CBC y GCM: cómo se aplica el bloque, IV y padding 🧱"
---

<p><small>ECB, CBC y GCM: cómo se aplica el bloque, IV y padding 🧱</small></p>

> 🗺️ **Estás en:** 🧬 **U09 · Cifrado Moderno** → 03 · Modos de AES

---

## 📬 La idea en una frase

> AES cifra de 16 en 16 bytes. El **modo** decide cómo se encadenan esos bloques: **ECB** los cifra iguales (y deja ver patrones), **CBC** mezcla cada bloque con el anterior usando un **IV**, y **GCM/EAX** añaden autenticación con un **tag**. Si el mensaje no llena un bloque, entra el **padding**.

El modo importa tanto como el algoritmo: usar AES en modo ECB es como poner la misma cerradura a todas las puertas de un pasillo… con la misma llave.

---

## 🧱 ¿Por qué hace falta un modo?

AES trabaja sobre **bloques de 16 bytes**. Un mensaje de 3 bytes o de 50 bytes no es múltiplo de 16, y además si dos bloques son idénticos, con el mismo proceso producirían el mismo cifrado. El modo de operación resuelve los dos problemas: cómo tratar bloques repetidos y qué hacer con el trozo que sobra.

```
Mensaje de 45 bytes:
┌──────────┬──────────┬──────────┬──────────┐
│ bloque 1 │ bloque 2 │ bloque 3 │ sobra 13 │ ← hace falta padding
└──────────┴──────────┴──────────┴──────────┘
```

---

## ⚖️ La tabla de los modos

| Modo | ¿Autentica? (tag) | ¿Necesita IV/nonce? | ¿Padding? | Veredicto |
|---|---|---|---|---|
| **ECB** | ❌ No | ❌ No | Sí | ⚠️ Evitar: muestra patrones |
| **CBC** | ❌ No | ✅ IV | Sí | ✅ Clásico y seguro |
| **GCM** | ✅ Sí (tag) | ✅ Nonce | No | ✅ Moderno, cifra y autentica |
| **EAX** | ✅ Sí (tag) | ✅ Nonce | No | ✅ El que usas en esta unidad |

> ⚠️ **ECB es la trampa clásica.** Cifra cada bloque de forma independiente: mismo bloque de entrada → mismo bloque de salida. En imágenes o documentos con zonas repetidas, el patrón se ve a simple vista. Por eso *nunca* cifres datos largos o estructurados en modo ECB.

---

## ⛓️ CBC: cada bloque depende del anterior

En **CBC** (*Cipher Block Chaining*), cada bloque se mezcla (XOR) con el cifrado del bloque anterior antes de cifrarse. El primer bloque se mezcla con el **IV** (*vector de inicialización*), un valor aleatorio de 16 bytes que viaja junto al cifrado.

```python
from Crypto.Cipher import AES
from Crypto.Random import get_random_bytes
from Crypto.Util.Padding import pad, unpad

clave = get_random_bytes(32)
iv = get_random_bytes(16)                     # vector de inicialización
mensaje = b"Mensaje que no mide 16 bytes exactos"

cifrador = AES.new(clave, AES.MODE_CBC, iv=iv)
texto_cifrado = cifrador.encrypt(pad(mensaje, 16))   # padding hasta múltiplo de 16

descifrador = AES.new(clave, AES.MODE_CBC, iv=iv)
original = unpad(descifrador.decrypt(texto_cifrado), 16)
print(f"Original: {original}")
```

- El **IV** es como el nonce: aleatorio, único por cifrado, y **se envía** con el texto cifrado.
- El **padding** rellena el último bloque hasta 16 bytes. `pad`/`unpad` de `Crypto.Util.Padding` lo hacen por ti; **el receptor tiene que aplicar `unpad`** para recuperar el mensaje exacto.

---

## 🔐 GCM y EAX: cifrar y autenticar a la vez

**GCM** (*Galois/Counter Mode*) y **EAX** son modos *autenticados*: además del texto cifrado producen un **tag** que detecta cualquier manipulación. Es el "tag" que ya usaste en el [punto 2](/ApuntesPSP/09-cifrado-moderno/02-aes) con `encrypt_and_digest`.

```python
from Crypto.Cipher import AES
from Crypto.Random import get_random_bytes

clave = get_random_bytes(32)
cifrador = AES.new(clave, AES.MODE_GCM)                 # genera nonce automáticamente
texto_cifrado, tag = cifrador.encrypt_and_digest(b"Autenticado y cifrado")

descifrador = AES.new(clave, AES.MODE_GCM, nonce=cifrador.nonce)
try:
    original = descifrador.decrypt_and_verify(texto_cifrado, tag)
    print(f"✅ Descifrado y verificado: {original}")
except ValueError:
    print("❌ El tag no coincide: el mensaje fue manipulado.")
```

> 💡 **Regla práctica:** si solo necesitas confidencialidad, CBC; si además quieres integridad, GCM o EAX. En esta unidad usamos **EAX** por su sencillez: `encrypt_and_digest` cifra y autentica en una llamada, sin padding manual.

---

## 🧠 Mini-chequeo

1. ¿Por qué no debes usar ECB con datos largos o repetitivos?
2. ¿Qué es el IV en modo CBC y por qué hay que enviarlo?
3. ¿Qué hace `decrypt_and_verify` que no haga `decrypt`?

<details>
<summary>🔄 Respuestas</summary>

1. Porque **bloques de entrada iguales producen bloques cifrados iguales**: en imágenes o documentos con zonas repetidas el patrón se ve. ECB no mezcla cada bloque con el anterior.
2. El **IV** es un valor aleatorio de 16 bytes que se mezcla con el primer bloque (y en cadena con los demás). Se envía con el cifrado porque el receptor lo necesita para descifrar.
3. **Verifica el tag de integridad**: si el mensaje fue manipulado, `decrypt_and_verify` lanza `ValueError` en vez de devolver basura silenciosamente.
</details>

---

## ✅ Resumen en 3 frases

- AES cifra en bloques de 16 bytes y el **modo** decide cómo encadenarlos: ECB (inseguro), CBC (clásico, con IV y padding) o GCM/EAX (autenticados, con tag).
- El **IV**/nonce viaja siempre con el cifrado; el **padding** rellena el último bloque hasta 16 bytes y se retira con `unpad`.
- Para esta unidad, **EAX** te da cifrado + integridad en una sola llamada: `encrypt_and_digest` y `decrypt_and_verify`.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| Modo de operación | Cómo se encadenan los bloques de 16 bytes de AES |
| ECB | Modo inseguro: cada bloque se cifra solo (patrones visibles) |
| CBC | Modo clásico: cada bloque se mezcla con el anterior (IV + padding) |
| GCM / EAX | Modos autenticados: cifran y generan tag de integridad |
| IV | Vector de inicialización: aleatorio, se envía con el cifrado |
| Padding | Relleno del último bloque hasta 16 bytes (`pad`/`unpad`) |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/09-cifrado-moderno) · **Anterior:** [02 · AES](/ApuntesPSP/09-cifrado-moderno/02-aes) · **Siguiente:** [04 · RSA](/ApuntesPSP/09-cifrado-moderno/04-rsa)