---
title: 05 — Firmas digitales
description: "Firmar y verificar: integridad + autenticidad ✍️"
---

<p><small>Firmar y verificar: integridad + autenticidad ✍️</small></p>

> 🗺️ **Estás en:** 🧬 **U09 · Cifrado Moderno** → 05 · Firmas digitales

---

## 📬 La idea en una frase

> Una **firma digital** demuestra que un mensaje fue creado por quien dice serlo (autenticidad) y que no fue modificado (integridad): se cifra el **hash SHA-256** del mensaje con la clave **privada** del firmante, y cualquiera puede verificarlo con su clave **pública**.

Es el equivalente digital de la firma en papel, pero mejor: no se puede copiar, no se puede falsificar y arrastra consigo la garantía de que nadie tocó el documento. Lo usan los certificados HTTPS, el software firmado y los correos con firma.

---

## ✍️ Firmar (con tu clave privada)

```python
from Crypto.Signature import pkcs1_15
from Crypto.Hash import SHA256
from Crypto.PublicKey import RSA

clave = RSA.generate(2048)
mensaje = b"Este mensaje es de Ana"

h = SHA256.new(mensaje)
firma = pkcs1_15.new(clave).sign(h)
print(f"Firma: {firma.hex()[:32]}...")
```

```
Firma: 1a3f5b7c9d2e4f6a8b0c1d2e3f4a5b6c...
```

**Firmar es cifrar un hash con tu privada:**

1. Calculas `SHA256` del mensaje (256 bits de huella, lo viste en la U08).
2. Cifras ese hash con tu **clave privada** → eso es la firma.
3. Envías `mensaje + firma`.

---

## ✅ Verificar (con la clave pública del firmante)

```python
try:
    h = SHA256.new(mensaje)
    pkcs1_15.new(clave.publickey()).verify(h, firma)
    print("✅ Firma VÁLIDA — mensaje de Ana, no alterado")
except (ValueError, TypeError):
    print("❌ Firma INVÁLIDA — manipulada o no es de Ana")
```

```
✅ Firma VÁLIDA — mensaje de Ana, no alterado
```

**El flujo completo:**

```
1. Ana escribe mensaje
2. Calcula SHA256 del mensaje
3. Cifra el hash con su clave PRIVADA → esto es la firma
4. Envía: mensaje + firma
5. Bob recibe
6. Descifra firma con clave PÚBLICA de Ana → hash original
7. Calcula SHA256 del mensaje recibido
8. ¿Coinciden? → ✅ Es de Ana y nadie lo modificó
```

> 🔑 **Dos garantías en una:** si los hashes no coinciden, el mensaje fue **modificado** (falla la integridad). Si la clave pública de Ana no descifra la firma, el mensaje **no es de Ana** (falla la autenticidad). El hash da integridad; la clave privada da autenticidad.

---

## 🎭 Be the code, my friend — Firma y verificación

> "Sé el proceso de firma digital desde que Ana escribe hasta que Bob verifica."

```
🔵 ANA

1. Tiene mensaje: "Mañana a las 8 en el café"
2. SHA256 → 256 bits de hash
3. Cifra hash con su RSA privada → firma digital (256 bytes)
4. Envía a Bob: [mensaje] + [firma]

🚀 Por la red viaja: "Mañana a las 8 en el café" + 256 bytes de firma

🟢 BOB

5. Recibe mensaje + firma
6. Calcula SHA256 del mensaje recibido
7. Descifra la firma con clave pública de Ana
8. Compara hashes...

   ┌─────────────────────────────────────┐
   │ ¿Son iguales? → ✅ Mensaje de Ana  │
   │ ¿Son diferentes? → ❌ Algo va mal  │
   └─────────────────────────────────────┘

9. Si alguien modificó el mensaje: hashes diferentes → ❌
10. Si no es de Ana: la clave pública no descifra la firma → ❌
```

---

## 🧠 Mini-chequeo

1. ¿Con qué clave se firma y con qué clave se verifica?
2. ¿Qué garantiza que el mensaje no fue modificado?
3. ¿Qué falla si el mensaje se altera después de firmar?

<details>
<summary>🔄 Respuestas</summary>

1. Se firma con la **clave privada** del firmante y se verifica con su **clave pública**.
2. El **hash SHA-256**: se calcula sobre el mensaje recibido y se compara con el hash que devuelve la firma al descifrarla con la pública.
3. Los hashes **no coinciden** y la verificación lanza `ValueError`/`TypeError`: se muestra `❌ Firma INVÁLIDA`. La firma detecta cualquier modificación, aunque sea de un byte.
</details>

---

## ✅ Resumen en 3 frases

- Firmar = cifrar el **SHA-256** del mensaje con tu **clave privada** (`pkcs1_15.new(clave).sign(h)`).
- Verificar = descifrar la firma con la **clave pública** del firmante y comparar hashes (`verify`).
- La firma aporta **autenticidad** (quién) e **integridad** (no alterado) a la vez.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| Firma digital | Hash del mensaje cifrado con la clave privada del firmante |
| pkcs1_15 | Esquema de firma RSA con hash en pycryptodome |
| Verificar firma | Descifrar la firma con la pública y comparar hashes |
| Autenticidad | Garantía de quién creó el mensaje |
| Integridad | Garantía de que no fue modificado |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/09-cifrado-moderno) · **Anterior:** [04 · RSA](/ApuntesPSP/09-cifrado-moderno/04-rsa) · **Siguiente:** [06 · Cifrado híbrido](/ApuntesPSP/09-cifrado-moderno/06-cifrado-hibrido)