---
title: Boletín U10 — Inicial (Resuelto)
description: Soluciones de los ejercicios básicos de Servidores Concurrentes
---

# ✅ Boletín U10 — Inicial (Resuelto)

---

## 1. Servidor eco básico

```python
import socket
with socket.socket() as srv:
    srv.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    srv.bind(("127.0.0.1", 5000))
    srv.listen()
    conn, addr = srv.accept()
    with conn:
        datos = conn.recv(1024)
        conn.sendall(datos)  # eco: devuelve exactamente lo recibido
```

Solo atiende **UN cliente** y termina. `with conn:` cierra el socket al salir.

## 2. Servidor eco con bucle

```python
import socket
with socket.socket() as srv:
    srv.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    srv.bind(("127.0.0.1", 5000))
    srv.listen()
    while True:
        conn, addr = srv.accept()
        with conn:
            datos = conn.recv(1024)
            conn.sendall(datos)  # eco
```

Clientes uno tras otro. Si uno tarda, los demás esperan: es el servidor secuencial del [punto 1](/ApuntesPSP/10-servidores-concurrentes/01-servidor-secuencial).

## 3. Cliente eco

```python
import socket
with socket.socket() as s:
    s.connect(("127.0.0.1", 5000))
    s.sendall(b"Hola eco")
    print(s.recv(1024).decode())
```

Se conecta, envía `b"Hola eco"` y muestra la respuesta del servidor (el mismo mensaje, de vuelta).

## 4. Servidor secuencial

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

Solo atiende UN cliente y termina: `accept()` una vez, responde `b"OK"` y cierra.

## 5. Servidor multihilo

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

Cada cliente en su propio hilo. Todos se atienden en paralelo ([punto 3](/ApuntesPSP/10-servidores-concurrentes/03-hilo-por-cliente)).

## 6. Cliente con respuesta

```python
import socket
with socket.socket() as s:
    s.connect(("127.0.0.1", 5000))
    s.sendall(b"Hola")
    print(s.recv(1024).decode())
```

Muestra por pantalla la respuesta del servidor. Con el servidor multihilo del ejercicio 5, recibiría `OK`.

## 7. Servidor con ThreadPoolExecutor

```python
import socket, concurrent.futures
def atender(conn, addr):
    with conn:
        conn.recv(1024)
        conn.sendall(b"OK")
with socket.socket() as srv, concurrent.futures.ThreadPoolExecutor(3) as pool:
    srv.bind(("127.0.0.1", 5000))
    srv.listen()
    while True:
        conn, addr = srv.accept()
        pool.submit(atender, conn, addr)
```

Máximo **3 hilos**. Los clientes adicionales esperan en cola ([punto 4](/ApuntesPSP/10-servidores-concurrentes/04-threadpoolexecutor)).

## 8. Lanzador de 5 clientes

```python
import socket, threading
def cliente(id):
    with socket.socket() as s:
        s.connect(("127.0.0.1", 5000))
        s.sendall(f"Soy {id}".encode())
        print(s.recv(1024).decode())
hilos = [threading.Thread(target=cliente, args=(i,)) for i in range(5)]
for h in hilos: h.start()
for h in hilos: h.join()
```

Lanza **5 clientes a la vez** contra el servidor. El `join()` espera a que terminen todos antes de acabar el script.