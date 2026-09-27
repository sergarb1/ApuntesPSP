---
title: "07 — Firmas digitales"
description: "Firmar y verificar: integridad + autenticidad ✍️"
---

<p><small>Firmar y verificar: integridad + autenticidad ✍️</small></p>

> 🗺️ **Estás en:** 🔐 **UD 9 · Seguridad y cifrado** → 07 · Firmas digitales

---

## 📬 La idea en una frase

> Una **firma digital** demuestra que un mensaje fue creado por quien dice serlo (autenticidad) y que no fue modificado (integridad): se cifra el **hash SHA-256** del mensaje con la clave **privada** del firmante, y cualquiera puede verificarlo con su clave **pública**.

---

## ✍️ Firmar (con tu clave privada)

```python
from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.primitives import hashes

clave = rsa.generate_private_key(public_exponent=65537, key_size=2048)
mensaje = b"Este mensaje es de Ana"

firma = clave.sign(
    mensaje,
    padding.PKCS1v15(),
    hashes.SHA256()
)
print(f"Firma: {firma.hex()[:32]}...")
```

```
Firma: 1a3f5b7c9d2e4f6a8b0c1d2e3f4a5b6c...
```

**Firmar es cifrar un hash con tu privada:**

1. Se calcula `SHA256` del mensaje internamente.
2. Se cifra ese hash con tu **clave privada** → eso es la firma.
3. Se envía `mensaje + firma`.

---

## ✅ Verificar (con la clave pública del firmante)

```python
try:
    clave.public_key().verify(
        firma,
        mensaje,
        padding.PKCS1v15(),
        hashes.SHA256()
    )
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
6. Verifica con clave PÚBLICA de Ana → hash original
7. Calcula SHA256 del mensaje recibido
8. ¿Coinciden? → ✅ Es de Ana y nadie lo modificó
```

> 🔑 **Dos garantías en una:** si los hashes no coinciden, el mensaje fue **modificado** (falla la integridad). Si la clave pública de Ana no verifica la firma, el mensaje **no es de Ana** (falla la autenticidad).

---

## 🎭 Be the code: Firma y verificación

> "Sé el proceso de firma digital desde que Ana escribe hasta que Bob verifica."


![Diagrama de la firma digital: Ana firma el hash con su clave privada y Bob verifica con la pública](/ApuntesPSP/diagrams/firmas.svg)

---

## 🧠 Mini-chequeo

1. ¿Con qué clave se firma y con qué clave se verifica?
2. ¿Qué garantiza que el mensaje no fue modificado?
3. ¿Qué falla si el mensaje se altera después de firmar?

<details>
<summary>🔄 Respuestas</summary>

1. Se firma con la **clave privada** del firmante y se verifica con su **clave pública**.
2. El **hash SHA-256**: se calcula sobre el mensaje recibido y se compara con el hash que devuelve la firma al descifrarla con la pública.
3. Los hashes **no coinciden** y la verificación lanza `ValueError`/`TypeError`. La firma detecta cualquier modificación, aunque sea de un byte.
</details>

---

## ✅ Resumen en 3 frases

- Firmar = cifrar el **SHA-256** del mensaje con tu **clave privada** (`clave.sign(msg, padding.PKCS1v15(), hashes.SHA256())`).
- Verificar = descifrar la firma con la **clave pública** del firmante y comparar hashes (`.verify()`).
- La firma aporta **autenticidad** (quién) e **integridad** (no alterado) a la vez.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| Firma digital | Hash del mensaje cifrado con la clave privada del firmante |
| PKCS1v15 | Esquema de firma RSA con hash |
| Verificar firma | Descifrar la firma con la pública y comparar hashes |
| Autenticidad | Garantía de quién creó el mensaje |
| Integridad | Garantía de que no fue modificado |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/08-seguridad-y-cifrado) · **Anterior:** [06 · Cifrado asimétrico (RSA)](/ApuntesPSP/08-seguridad-y-cifrado/06-cifrado-asimetrico-rsa) · **Siguiente:** [08 · Cifrado híbrido y práctica](/ApuntesPSP/08-seguridad-y-cifrado/08-cifrado-hibrido-y-practica)
