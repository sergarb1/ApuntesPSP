---
title: 01 — Cifrado simétrico vs asimétrico
description: "Una clave o un par: cuándo usar cada uno 🗝️"
---

<p><small>Una clave o un par: cuándo usar cada uno 🗝️</small></p>

> 🗺️ **Estás en:** 🧬 **U09 · Cifrado Moderno** → 01 · Cifrado simétrico vs asimétrico

---

## 📬 La idea en una frase

> El cifrado **simétrico** usa **una sola clave** para cifrar y descifrar; el **asimétrico** usa un **par de claves** (pública + privada). La primera es rapidísima pero hay que compartir la clave; la segunda resuelve el reparto a costa de velocidad.

Recuerda el principio de la U08: *no inventes tu cripto*. Aquí no inventamos nada: usamos los dos grandes bloques del cifrado moderno y aprendemos cuándo toca cada uno.

---

## 🗝️ Cifrado simétrico: una sola clave

> "Un solo cifrado con una sola clave. El que tiene la clave, puede descifrar."

Todo el mundo con una llave abre la misma cerradura. El **mismo secreto** sirve para cifrar y para descifrar, por eso se llama *simétrico*: los dos lados usan la misma llave.

```
🔵 ANA                               🟢 BOB
   │ 1. Cifra con la clave K           │
   │   → texto_cifrado                 │
   ├───────────────────────────────────►│
   │   mensaje cifrado (la clave NO)    │
   │                                   │ 2. Descifra con la MISMA clave K
   │                                   │   → mensaje original ✅
```

**Las dos caras de la moneda:**

- ✅ **Rapidez:** cifra cantidades enormes en milisegundos. Es el cifrado de los datos en volumen.
- ❌ **El problema:** ¿cómo le haces llegar la clave K a Bob sin que nadie la intercepte? Ese es el *problema de la distribución de claves*. En la vida real, enviar la clave por el mismo canal que el mensaje es como dejar la llave bajo el felpudo.

---

## 🗝️ Cifrado asimétrico: el par público/privado

Dos claves: una **pública** (todos pueden verla) y una **privada** (solo tú).

```
🔵 ANA                               🟢 BOB
   │ 1. Pide la clave pública de Bob   │
   │◄──────────────────────────────────│
   │ 2. Cifra con la clave PÚBLICA     │
   │   de Bob                          │
   ├───────────────────────────────────►│
   │   mensaje cifrado                  │
   │                                   │ 3. Descifra SOLO con su clave
   │                                   │   PRIVADA → mensaje original ✅
```

**La regla de oro de las claves:**

| Operación | ¿Qué clave usas? |
|---|---|
| Cifrar **para** alguien | La clave **pública** de esa persona |
| Descifrar | Tu clave **privada** |
| Firmar | Tu clave **privada** |
| Verificar una firma | La clave **pública** del firmante |

> 🔑 Nadie puede descifrar lo que cifraste con la pública de Bob, salvo Bob con su privada. La pública se puede repartir por todos los sitios: es pública.

---

## ⚖️ La comparativa: AES vs RSA

| Característica | AES (simétrico) | RSA (asimétrico) |
|----------------|-----|-----|
| Claves | Una | Dos (pública + privada) |
| Velocidad | Rápido (~1GB/s) | Lento (~1MB/s) |
| Tamaño máximo | Ilimitado | ~190 bytes (con 2048 bits) |
| Distribución de clave | Problema | Fácil |

> ⚠️ RSA no sirve para cifrar mensajes grandes. Para eso necesitas **cifrado híbrido** (lo verás en el [punto 6](/ApuntesPSP/09-cifrado-moderno/06-cifrado-hibrido)).

---

## 🧭 ¿Cuándo uso cada uno?

| Situación | Eliges |
|---|---|
| Cifrar un archivo, una base de datos, un disco | **Simétrico (AES)** — rápido y no hay problema de volumen |
| Enviar un secreto a alguien por un canal inseguro | **Asimétrico (RSA)** — no hay que compartir la clave |
| Cifrar un mensaje largo en HTTPS | **Híbrido** — RSA reparte la clave AES, AES cifra el tráfico |
| Demostrar quién firmó un documento | **Asimétrico** — la firma digital (punto 5) |

El asimétrico nunca sustituye al simétrico: lo **complementa**. La clave pública/privada resuelve el reparto de secretos; la simétrica se encarga del volumen. La unión de ambos es el cifrado híbrido que mueve Internet.

---

## 🧠 Mini-chequeo

1. ¿Cuál es el problema principal del cifrado simétrico?
2. ¿Con qué clave cifras un mensaje para que solo Bob lo lea?
3. ¿Por qué RSA no sirve para cifrar un archivo de 1 GB?

<details>
<summary>🔄 Respuestas</summary>

1. La **distribución de la clave**: hay que compartir la misma clave K por un canal seguro, y si alguien la intercepta, lo descifra todo.
2. Con la clave **pública de Bob**. Solo la privada de Bob puede descifrarlo.
3. Por su **límite de tamaño** (~190 bytes con claves de 2048 bits) y por ser **lento** (~1MB/s frente a ~1GB/s de AES). Para volúmenes grandes se usa AES (o híbrido).
</details>

---

## ✅ Resumen en 3 frases

- El **simétrico** usa una clave, es rapidísimo y sirve para el volumen; su talón de Aquiles es compartir la clave.
- El **asimétrico** usa un par público/privado: cifrar con la pública de otro, descifrar solo con tu privada.
- No compiten: se **complementan** en el cifrado híbrido, que es lo que usa HTTPS.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| Cifrado simétrico | Una sola clave para cifrar y descifrar (AES) |
| Cifrado asimétrico | Par de claves: pública para cifrar, privada para descifrar (RSA) |
| Clave pública | Se puede repartir libremente; cifra para su dueño |
| Clave privada | Secreto absoluto; descifra y firma |
| Distribución de claves | El problema de hacer llegar el secreto compartido sin que lo intercepten |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/09-cifrado-moderno) · **Siguiente:** [02 · AES](/ApuntesPSP/09-cifrado-moderno/02-aes)