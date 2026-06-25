---
title: "💪 INTERMEDIO RESUELTO 5 — Sockets UDP y Protocolos"
nav_order: 5
---
### 4. Cliente HTTP manual

```python
import socket
with socket.socket() as s:
    s.connect(("httpbin.org", 80))
    s.sendall(b"GET /ip HTTP/1.1\r\nHost: httpbin.org\r\nConnection: close\r\n\r\n")
    resp = b""
    while True:
        d = s.recv(4096)
        if not d: break
        resp += d
    print(resp.decode()[:500])
```

HTTP es texto sobre TCP. Mandas una petición y recibes una respuesta.

### 5. Compara TCP y UDP

```python
import socket, time
def test_tcp():
    t = time.time()
    for _ in range(10):
        with socket.socket() as s:
            s.connect(("127.0.0.1", 9000))
            s.send(b"x")
            s.recv(1024)
    return time.time() - t
def test_udp():
    t = time.time()
    for _ in range(10):
        with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:
            s.sendto(b"x", ("127.0.0.1", 9001))
            s.recvfrom(1024)
    return time.time() - t
print(f"TCP: {test_tcp():.3f}s")
print(f"UDP: {test_udp():.3f}s")
```

UDP suele ser más rápido porque no tiene handshake.

### 6. Mini servidor web

```python
import socket
with socket.socket() as srv:
    srv.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    srv.bind(("127.0.0.1", 8080))
    srv.listen()
    conn, addr = srv.accept()
    with conn:
        conn.recv(1024)  # Leer petición (la ignoramos)
        respuesta = "HTTP/1.1 200 OK\r\nContent-Type: text/html\r\n\r\n<h1>Hola mundo</h1>"
        conn.sendall(respuesta.encode())
```

Abre http://127.0.0.1:8080 en tu navegador y verás "Hola mundo".
