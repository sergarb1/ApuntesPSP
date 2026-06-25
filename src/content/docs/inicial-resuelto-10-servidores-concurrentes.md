---
title: "✅ INICIAL RESUELTO 10 — Servidores Concurrentes"
nav_order: 10
---

### 1. Servidor secuencial

```python
import socket
with socket.socket() as srv:
    srv.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    srv.bind(("127.0.0.1", 5000))
    srv.listen()
    conn, addr = srv.accept()
    with conn:
        datos = conn.recv(1024)
        conn.sendall(b"OK")
```

Solo atiende UN cliente y termina.

### 2. Bucle de clientes

```python
import socket
with socket.socket() as srv:
    srv.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    srv.bind(("127.0.0.1", 5000))
    srv.listen()
    while True:
        conn, addr = srv.accept()
        with conn:
            conn.recv(1024)
            conn.sendall(b"OK")
```

Clientes uno tras otro. Si uno tarda, los demás esperan.

### 3. Hilo por cliente

```python
import socket, threading
def atender(conn, addr):
    with conn:
        conn.recv(1024)
        conn.sendall(b"OK")
with socket.socket() as srv:
    srv.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    srv.bind(("127.0.0.1", 5000))
    srv.listen()
    while True:
        conn, addr = srv.accept()
        threading.Thread(target=atender, args=(conn, addr)).start()
```

Cada cliente en su propio hilo. Todos se atienden en paralelo.
