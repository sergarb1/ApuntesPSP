---
title: 05 — Cliente y servidor UDP
description: "sendto, recvfrom y la vida real de los datagramas 📡"
---

<p><small>sendto, recvfrom y la vida real de los datagramas 📡</small></p>

> 🗺️ **Estás en:** 🔌 **UD 5 · Sockets TCP y UDP** → 05 · Cliente y servidor UDP

---

## 📬 La idea en una frase

> UDP **no se conecta**: el cliente manda un datagrama con `sendto()` a una dirección y espera con `recvfrom()`; el servidor solo hace `bind()` y escucha. **Sin `connect()`, sin `accept()`, sin `listen()`**… y sin ninguna garantía de que el mensaje llegue.

Viste en el [punto 1](/ApuntesPSP/04-sockets-tcp-y-udp/01-que-es-un-socket) la tabla del "No": UDP no garantiza conexión, entrega ni orden. Aquí lo compruebas en la API, construyes tu primer cliente y servidor, y aterrizas las consecuencias de lanzar aviones de papel.

---

## 📤 El cliente UDP: `sendto()` y `recvfrom()`

```python
import socket

HOST = "127.0.0.1"
PORT = 5001

with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as cliente:
    cliente.sendto(b"Hola UDP!", (HOST, PORT))
    datos, _ = cliente.recvfrom(1024)
    print(f"Respuesta: {datos.decode()}")
```

| Línea | Qué hace |
|-------|----------|
| `socket(AF_INET, SOCK_DGRAM)` | Crea el socket UDP (el `SOCK_DGRAM` del punto 1) |
| `sendto(b"Hola UDP!", (HOST, PORT))` | Envía el datagrama: **la dirección viaja en la llamada**, no en un `connect()` previo |
| `recvfrom(1024)` | Espera la respuesta y devuelve la tupla `(datos, dirección)`; aquí la dirección se descarta con `_` |

### Sendto contra send: la diferencia visual

| Cliente TCP (puntos 2-3) | Cliente UDP (aquí) |
|---|---|
| `s.connect((HOST, PORT))` | — (no existe) |
| `s.send(datos)` | `s.sendto(datos, (HOST, PORT))` |
| `s.recv(1024)` | `s.recvfrom(1024)` |

En TCP primero te conectas y luego envías; en UDP el "a quién" va dentro del envío.

> ⚠️ Cada `sendto()` es un datagrama independiente. Pueden llegar **desordenados, duplicados o no llegar**. Si el servidor no está escuchando, el datagrama se pierde en el vacío y el `recvfrom()` se queda esperando **para siempre** (a menos que pongas un `settimeout()`).

---

## 📥 El servidor UDP: `bind()` y `recvfrom()`

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

- **`bind((HOST, PORT))`** → reserva el puerto: cualquier datagrama que llegue a `127.0.0.1:5001` es para este proceso. Sin `bind()`, el socket no escucha en ningún sitio.
- **`datos, direccion = servidor.recvfrom(1024)`** → se bloquea esperando un datagrama. Cuando llega, devuelve **el contenido y la dirección del cliente** `(IP, puerto)`.
- **`servidor.sendto(b"Recibido!", direccion)`** → responde usando esa dirección: la única forma de "devolver la pelota" en UDP, porque no hay conexión que recuerde quién eras.

### Sin accept(), sin listen(): la diferencia con TCP

| Servidor TCP (punto 3) | Servidor UDP (aquí) |
|---|---|
| `bind()` | `bind()` |
| `listen()` | — (no existe) |
| `accept()` → devuelve `conn` | — (no existe) |
| `conn.recv(1024)` | `servidor.recvfrom(1024)` |
| (la conexión sabe quién es) | `recvfrom()` devuelve la dirección |

> 💡 Consecuencia importante: un solo servidor UDP puede atender a **cualquier número de clientes** sin `accept()` ni hilos, porque cada mensaje trae su dirección pegada.

---

## 💨 Datagramas: cada envío es un mundo aparte

Imagina que mandas 5 mensajes seguidos desde un cliente UDP:

```python
import socket, time

with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as cliente:
    for i in range(1, 6):
        cliente.sendto(f"Mensaje #{i}".encode(), ("127.0.0.1", 5001))
        time.sleep(0.2)
```

El servidor podría recibirlos en **cualquier orden** (o no recibir alguno). La red no promete nada: cada datagrama viaja por su cuenta, como aviones de papel lanzados desde el mismo balcón pero que el viento puede separar.

> 💡 **Ojo con localhost:** en `127.0.0.1` (loopback) esto casi nunca se manifiesta: los datagramas van de un socket a otro en la misma máquina y llegan en orden y sin pérdidas. El desorden y la pérdida se ven en **redes reales** (con routers, congestión y caminos distintos).

### Los males de UDP

1. **Pérdida de paquetes** — No hay confirmación de recepción. Si un paquete se pierde, **se pierde para siempre**: UDP no reenvía nada.
2. **Orden no garantizado** — Los datagramas pueden llegar en distinto orden. Sin números de secuencia, el receptor no tiene cómo reordenarlos.
3. **Duplicados** — En condiciones raras, el mismo datagrama puede llegar **dos veces**. UDP no lo detecta.
4. **Tamaño máximo** — Un datagrama no puede ser gigante: la carga útil útil se limita a **65.535 − 8 (UDP) − 20 (IPv4) ≈ 65.507 bytes**. Si intentas enviar más, `sendto()` lanza un `OSError`.


![Diagrama de cinco datagramas UDP donde el paquete 3 se pierde y jamás llega ni se reenvía](/ApuntesPSP/diagrams/udp-datagramas.svg)

### ¿Por qué alguien elegiría esto?

Porque esos males son el **precio de la velocidad**: sin handshake, sin confirmaciones ni reenvíos, cada paquete cuesta el mínimo. Y hay aplicaciones donde perder un paquete molesta menos que esperar por él: una videollamada, un juego online, DNS. La regla de decisión completa la tienes en el [punto 7](/ApuntesPSP/04-sockets-tcp-y-udp/07-cuando-usar-cada-protocolo).

---

## 🧠 Mini-chequeo

1. ¿Qué dos métodos usa el cliente UDP y qué devuelve cada uno?
2. ¿Por qué el servidor UDP no necesita `accept()`?
3. ¿Qué tres cosas pueden pasarle a datagrama en la red y qué pasa si se pierde?
4. ¿Cuál es el tamaño máximo de un datagrama UDP?

<details>
<summary>🔄 Respuestas</summary>

1. **`sendto(datos, dirección)`** envía el datagrama; **`recvfrom(1024)`** recibe y devuelve `(datos, dirección)`.
2. Porque UDP **no tiene conexiones**: no hay nada que aceptar. Cada datagrama llega independiente y `recvfrom()` le dice de quién viene.
3. Puede **perderse** (no se reenvía), **llegar desordenado** o **duplicarse**. Si se pierde, se pierde para siempre.
4. Unos **65.507 bytes** de carga útil (65.535 menos cabeceras UDP e IPv4).

</details>

---

## ✅ Resumen en 3 frases

- El cliente UDP manda datagramas con `sendto()` y recibe con `recvfrom()`, sin `connect()`; el servidor solo hace `bind()` y escucha, sin `listen()` ni `accept()`.
- `recvfrom()` devuelve datos **y** dirección del emisor: con esa tupla se responde con `sendto()`, y así un mismo servidor atiende a cualquier número de clientes.
- Cada datagrama es un mundo aparte: puede perderse, duplicarse o llegar desordenado, con un límite de ~65.507 bytes; es el precio de la velocidad.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| sendto() | Envía un datagrama con su dirección destino |
| recvfrom() | Recibe un datagrama: datos + dirección del emisor |
| SOCK_DGRAM | Tipo de socket UDP |
| Datagrama | Paquete independiente de UDP (máx. ~65.507 bytes) |
| Sin conexión | No hay handshake: mandas y punto |
| Sin confirmación | UDP no avisa de la recepción (a diferencia de TCP) |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/04-sockets-tcp-y-udp) · **Anterior:** [04 · Ciclo de vida y errores](/ApuntesPSP/04-sockets-tcp-y-udp/04-ciclo-y-errores) · **Siguiente:** [06 · HTTP y NTP](/ApuntesPSP/04-sockets-tcp-y-udp/06-http-y-ntp)
