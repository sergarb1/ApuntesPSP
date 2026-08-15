---
title: 01 — Qué es un socket
description: "IP + puerto y el punto final de toda conexión 🔌"
---

<p><small>IP + puerto y el punto final de toda conexión 🔌</small></p>

> 🗺️ **Estás en:** 🔌 **U04 · Sockets TCP** → 01 · Qué es un socket

---

## 📬 La idea en una frase

> Un **socket** es el punto final de una conexión de red: la interfaz que tu programa usa para enviar y recibir datos a través de la red.

Piensa en una llamada telefónica (la analogía que abre esta unidad): marcas, esperas a que contesten, habláis y colgáis. Tu teléfono es el **socket**; el número que marcas es la **IP**; y la extensión a la que pides hablar es el **puerto**. Sin ese trío no hay conversación posible.

---

## 📇 IP y puerto: el "quién" y el "dónde"

Para que dos programas hablen por la red necesitan dos datos:

| Concepto | Qué es | Ejemplo |
|---|---|---|
| **IP** | Identifica la **máquina** en la red | `127.0.0.1`, `192.168.1.10` |
| **Puerto** | Identifica el **programa** dentro de la máquina | `80` (web), `5000`, `9000` |

- **`127.0.0.1`** es **localhost**: tu propia máquina. Perfecto para pruebas sin red real. Para que otros se conecten, usa tu IP real (ej: `192.168.1.x`).
- Un puerto es un número del **0 al 65535**. El SO se reserva algunos para servicios conocidos (el `80` para web, el `443` para HTTPS); para tus programas usa puertos altos como `5000` o `9000`.

> 💡 La **pareja (IP, puerto)** se llama *dirección de socket* o *endpoint*, y en Python siempre se pasa como una tupla: `("127.0.0.1", 5000)`.

---

## 🐍 Crear un socket en Python

```python
import socket

# Crear un socket TCP
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
```

| Parámetro | Significado | Valores |
|-----------|-------------|---------|
| `AF_INET` | Familia de direcciones | IPv4 |
| `AF_INET6` | IPv6 | |
| `SOCK_STREAM` | TCP (orientado a conexión) | |
| `SOCK_DGRAM` | UDP (sin conexión) | |

- **`AF_INET`** dice al SO que usaremos direcciones **IPv4** (`AF_INET6` para IPv6).
- **`SOCK_STREAM`** pide un socket **TCP**, orientado a conexión: el canal fiable, ordenado y sin pérdidas que estudias en esta unidad.
- **`SOCK_DGRAM`** (lo verás en la [U05](/ApuntesPSP/05-sockets-udp-y-protocolos)) es el UDP sin conexión.

---

## 📞 La analogía del teléfono, al detalle

```
   TELÉFONO                          SOCKET
   ─────────                          ──────
   Tu teléfono           ⇄            socket()
   El número que marcas  ⇄            IP (AF_INET)
   La extensión          ⇄            Puerto
   La centralita         ⇄            El SO (sistema operativo)
```

El **SO** es la centralita: se encarga de que el paquete con tu mensaje salga de tu teléfono y llegue al teléfono correcto. Tú solo te ocupas de marcar (conectarte) y de hablar (enviar y recibir). El socket es ese teléfono: el **punto final** de la conversación.

---

## 🧠 Mini-chequeo

1. ¿Qué identifica la **IP** y qué identifica el **puerto**?
2. ¿Qué representa `127.0.0.1` y para qué sirve?
3. ¿Qué constante de Python crea un socket **TCP** y cuál uno **UDP**?

<details>
<summary>🔄 Respuestas</summary>

1. La **IP** identifica la **máquina** en la red; el **puerto** identifica el **programa** dentro de esa máquina.
2. Es **localhost**: tu propia máquina. Se usa para pruebas locales sin necesidad de red real.
3. **TCP** → `socket.SOCK_STREAM`; **UDP** → `socket.SOCK_DGRAM`. Ambos con familia `AF_INET`.

</details>

---

## ✅ Resumen en 3 frases

- Un **socket** es el punto final de una conexión de red: la interfaz para enviar y recibir datos.
- La **IP** identifica la máquina y el **puerto** identifica el programa dentro de ella: juntos forman la dirección `(IP, puerto)`.
- En Python se crea con `socket.socket(socket.AF_INET, socket.SOCK_STREAM)` para TCP.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| Socket | Punto final de una conexión de red |
| IP | Identifica la máquina en la red |
| Puerto | Identifica el programa dentro de la máquina |
| AF_INET | Familia de direcciones IPv4 |
| SOCK_STREAM | Socket TCP orientado a conexión |
| SOCK_DGRAM | Socket UDP sin conexión |
| localhost | 127.0.0.1, tu propia máquina |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/04-sockets-tcp) · **Siguiente:** [02 · Cliente TCP](/ApuntesPSP/04-sockets-tcp/02-cliente-tcp)