---
title: 03 — Servidor UDP
description: "Bind, recibir datagramas y saber de quién vienen 📥"
---

<p><small>Bind, recibir datagramas y saber de quién vienen 📥</small></p>

> 🗺️ **Estás en:** 📡 **U05 · Sockets UDP y Protocolos** → 03 · Servidor UDP

---

## 📬 La idea en una frase

> Un servidor UDP se limita a `bind()` en un puerto y a esperar datagramas con `recvfrom()`. **Sin `accept()`, sin `listen()`**: cualquiera que conozca la dirección puede hablarle, y él descubre de quién viene cada mensaje.

El servidor TCP de la U04 pasaba por `listen()` y `accept()`: creaba una conexión dedicada por cada cliente. UDP no tiene conexiones que aceptar: es como estar en un patio y escuchar quién te llama. El servidor **no se entera de quién llegará**, pero cuando recibe un datagrama, `recvfrom()` le dice exactamente de dónde vino.

---

## 📥 El servidor más pequeño del mundo

```python
import socket

HOST = "127.0.0.1"
PORT = 5001

with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as servidor:
    servidor.bind((HOST, PORT))
    print(f"Servidor UDP en {HOST}:{PORT}")

    # Recibir datagrama (recvfrom devuelve datos + dirección)
    datos, direccion = servidor.recvfrom(1024)
    print(f"Recibido de {direccion}: {datos.decode()}")

    # Responder
    servidor.sendto(b"Recibido!", direccion)
```

Repasemos qué hace cada pieza:

- **`servidor.bind((HOST, PORT))`** → "reserva" el puerto 5001: a partir de ese momento, cualquier datagrama que llegue a `127.0.0.1:5001` es para este proceso. Sin `bind()`, el socket no escucha en ningún sitio.
- **`datos, direccion = servidor.recvfrom(1024)`** → se bloquea esperando un datagrama. Cuando llega, devuelve **dos cosas**: el contenido (`datos`) y la **dirección del cliente** (`direccion`), que es una tupla `(IP, puerto)`.
- **`servidor.sendto(b"Recibido!", direccion)`** → responde al cliente usando precisamente esa dirección. Es la única forma de "devolver la pelota" en UDP: no hay conexión que recuerde quién eras.

---

## 🚫 Sin accept(), sin listen(): la diferencia con TCP

| Servidor TCP (U04) | Servidor UDP (aquí) |
|---|---|
| `bind()` | `bind()` |
| `listen()` | — (no existe) |
| `accept()` → devuelve `conn` | — (no existe) |
| `conn.recv(1024)` | `servidor.recvfrom(1024)` |
| (la conexión sabe quién es) | `recvfrom()` devuelve la dirección |

En TCP, `accept()` crea una **conexión dedicada** y a partir de ahí todo va por ese canal. En UDP **no hay canal**: cada datagrama llega por su cuenta y el servidor debe mirar la dirección para saber a quién responder.

> 💡 Esto tiene una consecuencia importante: un solo servidor UDP puede atender a **cualquier número de clientes** sin `accept()` ni hilos, porque cada mensaje trae su dirección pegada. Eso lo explotarás en la práctica del [punto 8](/ApuntesPSP/05-sockets-udp-y-protocolos/08-practica-eco-udp).

---

## 🧠 Mini-chequeo

1. ¿Qué método es imprescindible para que el servidor UDP escuche en un puerto?
2. ¿Qué devuelve `recvfrom()` y para qué sirve la segunda parte?
3. ¿Por qué el servidor UDP no necesita `accept()`?

<details>
<summary>🔄 Respuestas</summary>

1. **`bind((HOST, PORT))`**: reserva el puerto para que los datagramas dirigidos a él lleguen a este proceso.
2. Devuelve una tupla **`(datos, dirección)`**: el contenido del datagrama y la dirección del cliente (`IP`, puerto), que se usa para responder con `sendto()`.
3. Porque UDP **no tiene conexiones**: no hay nada que aceptar. Cada datagrama llega independiente y `recvfrom()` te dice de quién viene.

</details>

---

## ✅ Resumen en 3 frases

- El servidor UDP escucha con `bind()` y recibe datagramas con `recvfrom()`, sin `accept()` ni `listen()`.
- `recvfrom()` devuelve datos **y** dirección del cliente: con ella se responde usando `sendto()`.
- Al no haber conexiones, un mismo servidor atiende a cualquier número de clientes sin estructuras de conexión.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| bind() | Reserva un puerto para escuchar datagramas |
| recvfrom() | Recibe un datagrama: datos + dirección del emisor |
| dirección | Tupla (IP, puerto) que identifica al cliente |
| sendto() | Responde al cliente con su dirección |
| Puerto reservado | El bind() marca el puerto donde el SO entrega los datagramas |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/05-sockets-udp-y-protocolos) · **Anterior:** [02 · Cliente UDP](/ApuntesPSP/05-sockets-udp-y-protocolos/02-cliente-udp) · **Siguiente:** [04 · Datagramas y pérdida](/ApuntesPSP/05-sockets-udp-y-protocolos/04-datagramas-y-perdida)