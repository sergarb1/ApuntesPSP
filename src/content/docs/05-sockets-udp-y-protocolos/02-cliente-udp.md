---
title: 02 — Cliente UDP
description: "Enviar y recibir sin conexión: sendto() y recvfrom() 📤"
---

<p><small>Enviar y recibir sin conexión: sendto() y recvfrom() 📤</small></p>

> 🗺️ **Estás en:** 📡 **U05 · Sockets UDP y Protocolos** → 02 · Cliente UDP

---

## 📬 La idea en una frase

> Un cliente UDP **no se conecta**: crea el socket, manda un datagrama con `sendto()` a una dirección y espera la respuesta con `recvfrom()`. Nada de `connect()`, nada de handshake.

En la U04, el cliente TCP pasaba por `connect()` para estrechar la mano antes de hablar. UDP no tiene mano que estrechar: tu mensaje y la dirección del destinatario se envían **juntos**, en el mismo `sendto()`. Es el primer protocolo de esta unidad en el que comprobarás que "sin conexión" se nota hasta en la API.

---

## 📤 Enviar sin conectarse: `sendto()`

El método clave del cliente UDP es `sendto(datos, dirección)`:

```python
import socket

HOST = "127.0.0.1"
PORT = 5001

with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as cliente:
    cliente.sendto(b"Hola UDP!", (HOST, PORT))
    datos, _ = cliente.recvfrom(1024)
    print(f"Respuesta: {datos.decode()}")
```

Desglose de cada línea:

- **`socket.socket(socket.AF_INET, socket.SOCK_DGRAM)`** → socket UDP (el `SOCK_DGRAM` del [punto 1](/ApuntesPSP/05-sockets-udp-y-protocolos/01-tcp-vs-udp)).
- **`cliente.sendto(b"Hola UDP!", (HOST, PORT))`** → envía el datagrama a `127.0.0.1:5001`. La dirección viaja **en la llamada**, no en un `connect()` previo.
- **`cliente.recvfrom(1024)`** → espera la respuesta; devuelve una tupla `(datos, dirección)`. Como aquí no nos importa de quién viene, la dirección se descarta con `_`.
- **`datos.decode()`** → los bytes recibidos se convierten a texto para poder imprimirlos.

---

## 🆚 Sendto contra send: la diferencia visual

| Cliente TCP (U04) | Cliente UDP (aquí) |
|---|---|
| `s.connect((HOST, PORT))` | — (no existe) |
| `s.send(datos)` | `s.sendto(datos, (HOST, PORT))` |
| `s.recv(1024)` | `s.recvfrom(1024)` |

En TCP primero te conectas y luego envías; en UDP el "a quién" va dentro del envío. Y como no hay conexión, **tampoco hay `close()` explícito que cierre el canal**: el `with` se encarga de liberar el socket.

> ⚠️ En UDP, cada `sendto()` es un datagrama independiente. Pueden llegar **desordenados, duplicados o no llegar**. La API te lo pone fácil; la red, no tanto. Eso lo verás en detalle en el [punto 4](/ApuntesPSP/05-sockets-udp-y-protocolos/04-datagramas-y-perdida).

---

## 🎭 Be the code: cliente UDP paso a paso

> "Sé el cliente UDP y manda tu primer avión de papel."

```
cliente.sendto(b"Hola UDP!", ("127.0.0.1", 5001))

1. socket.socket(AF_INET, SOCK_DGRAM)  → crea el socket sin conexión
2. sendto(b"Hola UDP!", ("127.0.0.1", 5001))
   → empaqueta datagrama: bytes + dirección destino
   → el SO lo lanza a la red en un solo paquete
3. recvfrom(1024)                      → se queda escuchando hasta que llegue algo
   → devuelve (datos, dirección): datos = respuesta del servidor
4. print(f"Respuesta: {datos.decode()}") → "Respuesta: Recibido!"
```

Fíjate en el paso 2: **dirección y datos van juntos**. Si el servidor no está escuchando, no pasa nada raro: el datagrama se pierde en el vacío y el cliente se queda esperando en el `recvfrom()` para siempre (a menos que pongas un `settimeout()`, que verás en el [punto 6](/ApuntesPSP/05-sockets-udp-y-protocolos/06-ntp-y-servidores-de-tiempo)).

---

## 🧠 Mini-chequeo

1. ¿Qué dos métodos usa el cliente UDP y qué devuelve cada uno?
2. ¿Por qué no hay `connect()` en un cliente UDP?
3. ¿Qué pasa si envías un datagrama y no hay nadie escuchando?

<details>
<summary>🔄 Respuestas</summary>

1. **`sendto(datos, dirección)`** envía el datagrama; **`recvfrom(1024)`** recibe y devuelve una tupla `(datos, dirección)`.
2. Porque UDP **no establece conexión**: la dirección destino va dentro de cada `sendto()`, no hay handshake previo que preparar.
3. El datagrama **se pierde** y el `recvfrom()` se queda bloqueado esperando una respuesta que nunca llega.

</details>

---

## ✅ Resumen en 3 frases

- El cliente UDP manda datagramas con `sendto(datos, dirección)` sin necesidad de `connect()`.
- La respuesta llega con `recvfrom()`, que devuelve los datos y la dirección del remitente.
- Como no hay conexión, cada datagrama es independiente: puede perderse, duplicarse o llegar desordenado.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| sendto() | Envía un datagrama con su dirección destino |
| recvfrom() | Recibe un datagrama y devuelve datos + dirección |
| SOCK_DGRAM | Tipo de socket UDP |
| Sin conexión | No hay handshake: mandas y punto |
| `_` | Variable de Python para descartar un valor |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/05-sockets-udp-y-protocolos) · **Anterior:** [01 · TCP vs UDP](/ApuntesPSP/05-sockets-udp-y-protocolos/01-tcp-vs-udp) · **Siguiente:** [03 · Servidor UDP](/ApuntesPSP/05-sockets-udp-y-protocolos/03-servidor-udp)