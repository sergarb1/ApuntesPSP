---
title: "✅ INICIAL RESUELTO 4 — Sockets TCP"
nav_order: 4
---
### 1. Servidor mínimo

```python
import socket
with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as srv:
    srv.bind(("127.0.0.1", 9000))
    srv.listen()
    conn, addr = srv.accept()
    with conn:
        datos = conn.recv(1024)
        print(f"Recibido: {datos.decode()}")
```

`accept()` espera un cliente (bloqueante).

### 2. Cliente mínimo

```python
import socket
with socket.socket() as cli:
    cli.connect(("127.0.0.1", 9000))
    cli.sendall(b"Hola servidor")
```

`connect()` lanza `ConnectionRefusedError` si no hay servidor.

### 3. Servidor eco

```python
import socket
with socket.socket() as srv:
    srv.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    srv.bind(("127.0.0.1", 9000))
    srv.listen()
    conn, addr = srv.accept()
    with conn:
        datos = conn.recv(1024)
        conn.sendall(datos)  # Eco
```

Devuelve exactamente lo mismo que recibe.
