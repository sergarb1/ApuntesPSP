---
title: 08 — Práctica eco UDP
description: "Servidor + cliente eco completos y ejercicios resueltos 🛠️"
---

<p><small>Servidor + cliente eco completos y ejercicios resueltos 🛠️</small></p>

> 🗺️ **Estás en:** 📡 **U05 · Sockets UDP y Protocolos** → 08 · Práctica eco UDP

---

## 📬 La idea en una frase

> La práctica clásica de UDP: un **servidor eco** que devuelve al cliente exactamente lo que recibe. Es el "Hola mundo" de los datagramas y la base de todo lo que verás en el laboratorio del [punto 9](/ApuntesPSP/05-sockets-udp-y-protocolos/09-head-first).

Junta todo lo aprendido: cliente UDP ([punto 2](/ApuntesPSP/05-sockets-udp-y-protocolos/02-cliente-udp)), servidor UDP ([punto 3](/ApuntesPSP/05-sockets-udp-y-protocolos/03-servidor-udp)) y la naturaleza de los datagramas ([punto 4](/ApuntesPSP/05-sockets-udp-y-protocolos/04-datagramas-y-perdida)). Con dos terminales y unos pocos bytes, verás el protocolo completo en acción.

---

## 🛠️ El servidor eco

```python
import socket

HOST = "127.0.0.1"
PORT = 9001

with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as servidor:
    servidor.bind((HOST, PORT))
    print(f"Servidor eco UDP en {HOST}:{PORT}")

    datos, direccion = servidor.recvfrom(1024)
    print(f"Recibido de {direccion}: {datos.decode()}")

    # Devolver lo mismo que se ha recibido
    servidor.sendto(datos, direccion)
```

El truco está en la última línea: **`servidor.sendto(datos, direccion)`** devuelve los **mismos bytes** que llegaron, a la **misma dirección** de la que vinieron. Eco, literalmente.

## 📤 El cliente que lo prueba

```python
import socket

HOST = "127.0.0.1"
PORT = 9001

with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as cliente:
    mensaje = "Hola UDP, devuélveme esto"
    cliente.sendto(mensaje.encode(), (HOST, PORT))
    datos, _ = cliente.recvfrom(1024)
    print(f"El servidor me devolvió: {datos.decode()}")
```

**Salida** del cliente (con el servidor corriendo en otra terminal):
```
El servidor me devolvió: Hola UDP, devuélveme esto
```

Prueba a escribir el mensaje con un `input()` y tendrás tu primer chat UDP de una línea.

---

## 🎭 Be the code: eco UDP paso a paso

> "Sé el datagrama que sale del cliente, llega al servidor y vuelve."

```
1. Servidor: bind(("127.0.0.1", 9001))   → reserva el puerto 9001
2. Servidor: recvfrom(1024)              → se queda escuchando (bloqueado)
3. Cliente:  sendto(b"Hola UDP...", ("127.0.0.1", 9001))
             → el datagrama viaja a 127.0.0.1:9001
4. Servidor: recvfrom() despierta → (datos, direccion)
             → datos = b"Hola UDP...", direccion = ("127.0.0.1", <puerto_cliente>)
5. Servidor: sendto(datos, direccion)     → devuelve lo mismo al cliente
6. Cliente:  recvfrom() → recibe el eco y lo imprime
```

La línea 4 es la más importante: la **dirección del cliente** aparece por primera vez cuando el servidor la necesita para responder. Ese es el flujo completo de UDP: fuego, escucha, responde.

---

## ✏️ Aprieta el lápiz

1. **Servidor UDP eco**: Crea un servidor UDP que devuelva al cliente lo mismo que recibe.
2. **Cliente HTTP manual**: Conéctate a `httpbin.org` y haz un GET a `/ip` para ver tu IP pública.
3. **Mini servidor web**: Crea un servidor TCP que responda con HTML básico (`"<h1>Hola</h1>"`) a cualquier petición.
4. **Comparativa velocidad**: Mide cuánto tarda TCP vs UDP en enviar 100 mensajes pequeños.

<details>
<summary>🔓 Soluciones</summary>

**1. Servidor UDP eco:**

```python
import socket
with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as srv:
    srv.bind(("127.0.0.1", 9001))
    datos, direccion = srv.recvfrom(1024)
    srv.sendto(datos, direccion)
```

**2. Cliente HTTP manual a `/ip`:**

```python
import socket
with socket.socket() as s:
    s.connect(("httpbin.org", 80))
    s.sendall(b"GET /ip HTTP/1.1\r\nHost: httpbin.org\r\nConnection: close\r\n\r\n")
    resp = b""
    while True:
        d = s.recv(4096)
        if not d:
            break
        resp += d
    print(resp.decode()[:500])
```

**3. Mini servidor web:**

```python
import socket
with socket.socket() as srv:
    srv.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    srv.bind(("127.0.0.1", 8080))
    srv.listen()
    conn, addr = srv.accept()
    with conn:
        conn.recv(1024)  # Leer petición (la ignoramos)
        respuesta = "HTTP/1.1 200 OK\r\nContent-Type: text/html\r\n\r\n<h1>Hola</h1>"
        conn.sendall(respuesta.encode())
```

Abre `http://127.0.0.1:8080` en tu navegador y verás "Hola".

**4. Comparativa velocidad (100 mensajes):**

```python
import socket, time

def test_tcp():
    t = time.time()
    for _ in range(100):
        with socket.socket() as s:
            s.connect(("127.0.0.1", 9000))
            s.send(b"x")
            s.recv(1024)
    return time.time() - t

def test_udp():
    t = time.time()
    for _ in range(100):
        with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:
            s.sendto(b"x", ("127.0.0.1", 9001))
            s.recvfrom(1024)
    return time.time() - t

print(f"TCP: {test_tcp():.3f}s")
print(f"UDP: {test_udp():.3f}s")
```

UDP suele ser más rápido porque no tiene handshake ni confirmaciones por cada mensaje.

</details>

---

## 🧠 Mini-chequeo

1. ¿Qué línea del servidor eco convierte el servidor en "eco"?
2. ¿Cómo descubre el servidor a quién responder?
3. ¿Qué necesitas para probar el cliente contra el servidor?

<details>
<summary>🔄 Respuestas</summary>

1. **`servidor.sendto(datos, direccion)`**: devuelve los mismos bytes recibidos a la dirección de origen.
2. Con la **dirección** que devuelve `recvfrom()`: la tupla `(IP, puerto)` del cliente que mandó el datagrama.
3. **Dos terminales separadas**: una con el servidor corriendo (queda bloqueado en `recvfrom()`) y otra ejecutando el cliente.

</details>

---

## ✅ Resumen en 3 frases

- El servidor eco devuelve con `sendto(datos, direccion)` exactamente lo que recibió con `recvfrom()`.
- La dirección del cliente llega pegada en cada datagrama: sin ella no habría forma de responder.
- Con el servidor en una terminal y el cliente en otra tienes el protocolo UDP completo funcionando.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| Eco UDP | El servidor devuelve lo mismo que recibe |
| sendto(datos, direccion) | La jugada del eco: reenviar a la dirección de origen |
| Terminal del servidor | Ventana donde el servidor queda escuchando |
| Puerta de respuesta | La dirección que recvfrom() entrega al servidor |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/05-sockets-udp-y-protocolos) · **Anterior:** [07 · Cuándo usar cada protocolo](/ApuntesPSP/05-sockets-udp-y-protocolos/07-cuando-usar-cada-protocolo) · **Siguiente:** [09 · Head First](/ApuntesPSP/05-sockets-udp-y-protocolos/09-head-first)