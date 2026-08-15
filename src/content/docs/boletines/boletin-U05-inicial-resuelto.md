---
title: Boletín U05 — Inicial (Resuelto)
description: Soluciones de los ejercicios básicos de Sockets UDP y Protocolos
---

# ✅ Boletín U05 — Inicial (Resuelto)

---

## 1. Cliente UDP con entrada de usuario

```python
import socket

HOST = "127.0.0.1"
PORT = 9001

mensaje = input("Escribe tu mensaje: ")
with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as cliente:
    cliente.sendto(mensaje.encode(), (HOST, PORT))
    datos, _ = cliente.recvfrom(1024)
    print(f"Respuesta: {datos.decode()}")
```

El cliente UDP no tiene `connect()`: la dirección va dentro del `sendto()`, y la respuesta llega con `recvfrom()`.

## 2. Servidor UDP con eco personalizado

```python
import socket

with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as srv:
    srv.bind(("127.0.0.1", 9001))
    datos, direccion = srv.recvfrom(1024)
    print(f"Recibido de {direccion}: {datos.decode()}")
    srv.sendto(f"Recibido: {datos.decode()}".encode(), direccion)
```

Se responde con la **dirección** que devuelve `recvfrom()`: sin ella no hay forma de contestar en UDP.

## 3. Servidor UDP contador

```python
import socket

contador = 0
with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as srv:
    srv.bind(("127.0.0.1", 9001))
    while True:
        datos, direccion = srv.recvfrom(1024)
        contador += 1
        srv.sendto(f"Mensaje #{contador}".encode(), direccion)
```

El contador vive **fuera** del bucle para que no se reinicie con cada mensaje. Cada respuesta lleva su número de orden.

## 4. Cliente UDP mínimo

```python
import socket
with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as cli:
    cli.sendto(b"Hola UDP", ("127.0.0.1", 9001))
```

UDP no tiene `connect()`. Directamente `sendto()`.

## 5. Servidor UDP mínimo

```python
import socket
with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as srv:
    srv.bind(("127.0.0.1", 9001))
    datos, direccion = srv.recvfrom(1024)
    print(f"De {direccion}: {datos.decode()}")
```

UDP no tiene `accept()`. Solo `recvfrom()`, que entrega datos **y** dirección del emisor.

## 6. Servidor UDP eco

```python
import socket
with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as srv:
    srv.bind(("127.0.0.1", 9001))
    datos, direccion = srv.recvfrom(1024)
    srv.sendto(datos, direccion)
```

Eco puro: `sendto(datos, direccion)` reenvía al cliente **exactamente** lo que llegó.

## 7. TCP vs UDP: clasifica

a) **TCP:** Web (HTTP), Email (SMTP), Transferencia de archivos (FTP) → el dato debe llegar **completo y en orden**. **UDP:** Videollamada (Zoom), Juego online (Fortnite), DNS → la **velocidad** importa más; perder un paquete se tolera o se repite.

b)

| Característica | TCP | UDP |
|---|---|---|
| Conexión | **Sí (handshake)** | **No** |
| Entrega garantizada | **Sí** | **No** |
| Orden | **Sí** | **No** |
| Velocidad | **Más lento** | **Más rápido** |

## 8. Cliente HTTP manual

```python
import socket

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    s.connect(("www.example.com", 80))
    peticion = (
        "GET / HTTP/1.1\r\n"
        "Host: www.example.com\r\n"
        "Connection: close\r\n"
        "\r\n"
    )
    s.sendall(peticion.encode())

    respuesta = b""
    while True:
        datos = s.recv(4096)
        if not datos:
            break
        respuesta += datos

print(respuesta.decode()[:500])
```

HTTP es texto sobre TCP: mandas una petición con `sendall()` y recibes la respuesta en trozos hasta que `recv()` devuelve `b""` (el servidor cerró la conexión gracias a `Connection: close`).