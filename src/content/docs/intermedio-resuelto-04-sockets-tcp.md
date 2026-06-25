---
title: "💪 INTERMEDIO RESUELTO 4 — Sockets TCP"
nav_order: 4
---
### 4. Cliente eco

```python
import socket
with socket.socket() as cli:
    cli.connect(("127.0.0.1", 9000))
    cli.sendall(b"Prueba")
    print(cli.recv(1024).decode())
```

### 5. SO_REUSEADDR

```python
import socket
with socket.socket() as srv:
    srv.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    srv.bind(("127.0.0.1", 9000))
    srv.listen()
    print("Servidor listo, mata y reinicia sin error")
```

Sin esta opción, al reiniciar puede dar "Address already in use".

### 6. Servidor hora

```python
import socket, time
with socket.socket() as srv:
    srv.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    srv.bind(("127.0.0.1", 9000))
    srv.listen()
    conn, addr = srv.accept()
    with conn:
        hora = time.strftime("%H:%M:%S")
        conn.sendall(hora.encode())
```
