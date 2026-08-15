---
title: 04 — Ciclo de vida de la conexión
description: "Three-way handshake y cierre de una conexión TCP 🤝"
---

<p><small>Three-way handshake y cierre de una conexión TCP 🤝</small></p>

> 🗺️ **Estás en:** 🔌 **U04 · Sockets TCP** → 04 · Ciclo de vida de la conexión

---

## 📬 La idea en una frase

> Una conexión TCP **nace, vive y muere**: arranca con un **three-way handshake** (SYN → SYN+ACK → ACK), transporta los datos y se cierra con un apretón de despedida. Todo esto pasa *debajo* de tu `connect()` y tu `accept()`.

En el [punto 2](/ApuntesPSP/04-sockets-tcp/02-cliente-tcp) y el [3](/ApuntesPSP/04-sockets-tcp/03-servidor-tcp) llamaste a `connect()` y `accept()` sin saber qué pasaba por dentro. Aquí levantas el capó y ves el **protocolo de transporte**: los tres mensajes que estrechan la mano y la despedida cuando la conversación acaba.

---

## 🧱 TCP: orientado a conexión

TCP garantiza que los datos lleguen **en orden** y **sin pérdidas**. A cambio, es un poco más lento que UDP. Ese "orientado a conexión" significa exactamente lo que vas a ver ahora: antes de enviar un solo byte, ambas partes tienen que **ponerse de acuerdo** con un saludo previo.

---

## 🤝 Three-way handshake (establecer conexión)

```
CLIENTE                    SERVIDOR
   │                          │
   ├── SYN ──────────────────►│
   │◄── SYN + ACK ────────────┤
   ├── ACK ──────────────────►│
   │                          │
   ├── Datos ────────────────►│
   │◄── Datos ────────────────┤
   │                          │
```

Los tres primeros mensajes son el handshake:

1. **SYN** (synchronize): el cliente dice *"quiero hablar contigo"*.
2. **SYN + ACK**: el servidor contesta *"de acuerdo, y yo también quiero hablar contigo"*.
3. **ACK** (acknowledge): el cliente confirma *"recibido, hablemos"*.

A partir de ahí, **los datos fluyen en ambas direcciones**. Si cuentas los mensajes (3), tienes el nombre: **three-way handshake**. Es exactamente lo que ocurre dentro de tu `cliente.connect()` en el [punto 2](/ApuntesPSP/04-sockets-tcp/02-cliente-tcp).

---

## 👋 Cierre de la conexión: la despedida

Cuando ya no hay más que decir, la conexión se cierra con un apretón de despedida:

```
CLIENTE                    SERVIDOR
   │                          │
   ├── FIN ──────────────────►│
   │◄── ACK ──────────────────┤
   │◄── FIN ──────────────────┤
   ├── ACK ──────────────────►│
   │                          │
```

1. Quien quiere cerrar envía **FIN** (*"no tengo más que enviar"*).
2. El otro lado responde **ACK** y, cuando también termina, envía su propio **FIN**.
3. El primero confirma con **ACK** y la conexión se libera.

> 💡 En Python no gestionas el cierre a mano: cuando el `with` termina (o llamas a `close()`), el SO ejecuta esta despedida por ti. Aunque lo parezca, **no es instantáneo**: el estado de cierre queda unos segundos en el sistema (eso te dará el problema de "Address already in use" del [punto 6](/ApuntesPSP/04-sockets-tcp/06-so-reuseaddr)).

---

## 📸 El ciclo completo, en una mirada

```
socket() ──► bind() ──► listen() ──► accept() ──► recv()/send() ──► close()
   │                                     │             │             │
 CREAR                             SYN/SYN+ACK/   los datos      FIN/ACK
  teléfono                           ACK (handshake)  fluyen     (despedida)
```

El **ciclo de vida de la conexión** es la historia completa entre la primera `socket()` y el último `close()`: preparar el teléfono, estrechar la mano, hablar y colgar.

---

## 🧠 Mini-chequeo

1. ¿Cuáles son los tres mensajes del handshake y en qué orden?
2. ¿Qué garantiza TCP sobre los datos, a cambio de ser más lento que UDP?
3. ¿Cuándo se cierra la conexión en Python y quién ejecuta la despedida?

<details>
<summary>🔄 Respuestas</summary>

1. **SYN** (cliente), **SYN + ACK** (servidor) y **ACK** (cliente). Después los datos fluyen en ambas direcciones.
2. Que los datos lleguen **en orden** y **sin pérdidas** (retransmite lo que se pierde).
3. Cuando termina el `with` (o se llama a `close()`); la despedida FIN/ACK la ejecuta el **SO** automáticamente.

</details>

---

## ✅ Resumen en 3 frases

- Una conexión TCP arranca con el **three-way handshake** (SYN → SYN+ACK → ACK) antes de enviar datos.
- Se cierra con una despedida de **FIN/ACK** que el SO ejecuta al terminar el `with` o al llamar a `close()`.
- TCP garantiza **orden y sin pérdidas** a cambio de ser algo más lento que UDP.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| Handshake | Saludo previo de TCP antes de enviar datos |
| SYN | "Quiero hablar contigo" (inicia la conexión) |
| SYN + ACK | "De acuerdo, y yo también" |
| ACK | Confirmación de recepción |
| FIN | "No tengo más que enviar" (inicia el cierre) |
| Orientado a conexión | TCP estrecha la mano antes de hablar |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/04-sockets-tcp) · **Anterior:** [03 · Servidor TCP](/ApuntesPSP/04-sockets-tcp/03-servidor-tcp) · **Siguiente:** [05 · Errores y manejo](/ApuntesPSP/04-sockets-tcp/05-errores-y-manejo)