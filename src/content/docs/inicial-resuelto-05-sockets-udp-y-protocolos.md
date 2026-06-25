---
title: "✅ INICIAL RESUELTO 5 — Sockets UDP y Protocolos"
nav_order: 5
---
### 1. Servidor UDP mínimo

```python
import socket
with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as srv:
    srv.bind(("127.0.0.1", 9001))
    datos, direccion = srv.recvfrom(1024)
    print(f"De {direccion}: {datos.decode()}")
```

UDP no tiene `accept()`. Solo `recvfrom()`.

### 2. Cliente UDP mínimo

```python
import socket
with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as cli:
    cli.sendto(b"Hola UDP", ("127.0.0.1", 9001))
```

UDP no tiene `connect()`. Directamente `sendto()`.

### 3. Servidor UDP eco

```python
import socket
with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as srv:
    srv.bind(("127.0.0.1", 9001))
    datos, direccion = srv.recvfrom(1024)
    srv.sendto(datos, direccion)
```
