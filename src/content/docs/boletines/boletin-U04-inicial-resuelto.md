---
title: Boletín U04 — Inicial (Resuelto)
description: Soluciones de los ejercicios básicos de Sockets TCP
---

# ✅ Boletín U04 — Inicial (Resuelto)

---

## 1. Servidor saludo

```python
import socket
with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as srv:
    srv.bind(("127.0.0.1", 9000))
    srv.listen()
    conn, addr = srv.accept()
    with conn:
        conn.sendall(b"Bienvenido al servidor")
```

`accept()` espera un cliente (bloqueante). Al salir del `with`, la conexión se cierra solo.

## 2. Cliente que envía y recibe

```python
import socket
with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as cli:
    cli.connect(("127.0.0.1", 9000))
    cli.sendall(b"Hola")
    respuesta = cli.recv(1024)
    print(f"Respuesta: {respuesta.decode()}")
```

`connect()` lanza `ConnectionRefusedError` si no hay servidor.

## 3. Servidor contador

```python
import socket
with socket.socket() as srv:
    srv.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    srv.bind(("127.0.0.1", 9000))
    srv.listen()
    conn, addr = srv.accept()
    with conn:
        numero = int(conn.recv(1024).decode())
        conn.sendall(str(numero + 1).encode())
```

Se recibe el número como **texto**, se convierte con `int()`, se incrementa y se devuelve convertido de nuevo a texto con `str()`. El cliente verá `"4"` si envió `"3"`.

## 4. Servidor eco

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

## 5. Cliente mínimo

```python
import socket
with socket.socket() as cli:
    cli.connect(("127.0.0.1", 9000))
    cli.sendall(b"Hola servidor")
```

Sin `recv()`, el cliente solo envía. El `with` cierra el socket al salir.

## 6. Servidor mínimo

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

## 7. IP y puerto

a) La **IP** identifica la **máquina** en la red; el **puerto** identifica el **programa** dentro de esa máquina.

b) **`127.0.0.1`** es **localhost**: tu propia máquina. Se usa para probar sin red real.

c) **TCP** → `socket.SOCK_STREAM`; **UDP** → `socket.SOCK_DGRAM`. Ambos con familia `AF_INET`.

## 8. Servidor hora

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

La hora se obtiene con `time.strftime("%H:%M:%S")` y se envía como bytes con `.encode()`.

---

📚 [Volver a la unidad](/ApuntesPSP/04-sockets-tcp) · Por resolver: [📝 Boletín U04 — Inicial](/ApuntesPSP/boletines/boletin-u04-inicial)