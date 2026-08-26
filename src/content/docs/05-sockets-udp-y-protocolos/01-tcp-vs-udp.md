---
title: 01 — TCP vs UDP
description: "La carta certificada contra el avión de papel 🚀"
---

<p><small>La carta certificada contra el avión de papel 🚀</small></p>

> 🗺️ **Estás en:** 📡 **U05 · Sockets UDP y Protocolos** → 01 · TCP vs UDP

---

## 📬 La idea en una frase

> UDP **no establece conexión**: mandas el mensaje y rezas porque llegue. No hay garantía de entrega ni de orden. TCP, en cambio, es el mensajero certificado: entrega cada carta, en orden, y si se pierde, la reenvía. Cada uno tiene su momento.

En la U04 conociste a TCP a fondo: handshake, retransmisiones, orden garantizado. Aquí llega su antagonista: **UDP** (User Datagram Protocol), el lanzador de aviones de papel. Más simple, más rápido, y sin ninguna promesa. La gracia está en saber cuándo usar cada uno.

---

## ✈️ La analogía: carta certificada contra avión de papel

- **TCP** es la **carta certificada**: pagas más, el cartero te confirma la entrega, y si se pierde, se reenvía. Sabes que llegó, y en el orden correcto.
- **UDP** es el **avión de papel** desde el balcón: lo lanzas y olvidas. Si aterriza, bien; si el viento se lo lleva, también. Pero puedes lanzar cien aviones en el tiempo que tardas en preparar una carta certificada.

Esas dos filosofías definen el resto de la unidad: **fiabilidad contra velocidad**.

---

## ⚖️ TCP vs UDP cara a cara

| Característica | TCP | UDP |
|----------------|-----|-----|
| Conexión | Sí (handshake) | No |
| Entrega garantizada | Sí | No |
| Orden | Sí | No |
| Velocidad | Más lento | Más rápido |
| Uso típico | Web, correo, FTP | Streaming, juegos, DNS |

```
        TCP                                    UDP
  ┌─────────────┐                     ┌─────────────┐
  │ SYN ──────► │                     │             │
  │ ◄────── SYN │   handshake         │  datagrama  │  sin conexión,
  │      + ACK  │   antes de nada     │  ──────►    │  sin confirmación
  │ ACK ──────► │                     │             │
  ├─────────────┤                     ├─────────────┤
  │ dato ─────► │  confirmado         │  paquete ─► │  fuego y olvido
  │ ◄──── ACK   │  y en orden         │    (si llega)│
  └─────────────┘                     └─────────────┘
```

La columna de la derecha es la que te ocupará en esta unidad: tres filas de "No" que, paradójicamente, son la razón de que UDP sea tan rápido.

---

## 🐍 El socket en código

La diferencia se ve en una sola línea: el tipo de socket.

```python
import socket

# Socket UDP: datagramas sin conexión
s_udp = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

# Socket TCP: flujo fiable con conexión (lo viste en la U04)
s_tcp = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
```

- `SOCK_DGRAM` → datagramas (UDP): cada `sendto()` es un mensaje independiente.
- `SOCK_STREAM` → flujo de bytes (TCP): todo va por el mismo canal, conectado y ordenado.

> 💡 Recuerda el truco para no liarte: **D**GRAM = datagramas sueltos (**UDP**); **S**TREAM = flujo continuo (**TCP**).

---

## 🚦 Fiabilidad vs velocidad: el verdadero dilema

No existe "el mejor" protocolo: existe el adecuado para cada momento.

- **Elige TCP cuando no puedes permitirte perder ni un byte**: una web, un correo, una transferencia de archivos. Si falta un trozo, el documento llega roto.
- **Elige UDP cuando prefieres estar al día antes que completo**: una videollamada, un partido online, una transmisión en vivo. Mejor un frame ligeramente desfasado que esperar eternamente a que se reenvíe el anterior.

Ese razonamiento lo profundizarás en el [punto 7](/ApuntesPSP/05-sockets-udp-y-protocolos/07-cuando-usar-cada-protocolo), con casos reales. De momento, quédate con la tabla y la analogía: son el corazón de la unidad.

---

## 🧠 Mini-chequeo

1. ¿Qué garantiza TCP que UDP no garantiza? (tres cosas)
2. ¿Por qué UDP es más rápido que TCP?
3. ¿Cuál usarías para una videollamada y cuál para una transferencia de archivos?

<details>
<summary>🔄 Respuestas</summary>

1. **Conexión** (handshake previo), **entrega garantizada** (retransmite lo perdido) y **orden**.
2. Porque **no hace handshake ni confirma cada envío**: manda el datagrama y olvida. Menos trabajo por paquete.
3. **Videollamada → UDP** (velocidad ante todo); **transferencia de archivos → TCP** (un byte perdido rompe el archivo).

</details>

---

## ✅ Resumen en 3 frases

- UDP no establece conexión y no garantiza entrega ni orden; TCP sí, a costa de ser más lento.
- TCP es la carta certificada; UDP, el avión de papel: fiabilidad contra velocidad.
- En código se distinguen en el tipo de socket: `SOCK_STREAM` (TCP) frente a `SOCK_DGRAM` (UDP).

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| TCP | Protocolo con conexión, fiable y ordenado (SOCK_STREAM) |
| UDP | Protocolo sin conexión, rápido y sin garantías (SOCK_DGRAM) |
| Handshake | Saludo previo de TCP antes de enviar datos |
| Datagrama | Paquete independiente que manda UDP |
| SOCK_DGRAM | Constante de Python para crear sockets UDP |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/05-sockets-udp-y-protocolos) · **Siguiente:** [02 · Cliente UDP](/ApuntesPSP/05-sockets-udp-y-protocolos/02-cliente-udp)