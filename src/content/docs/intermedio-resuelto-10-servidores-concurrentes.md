---
title: "💪 INTERMEDIO RESUELTO 10 — Servidores Concurrentes"
nav_order: 10
---
### 4. ThreadPool

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

Máximo 3 hilos. Los clientes adicionales esperan en cola.

### 5. Lanzador de clientes

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

Lanza 5 clientes a la vez.

### 6. Contador de conexiones

```python
contador = 0
lock = threading.Lock()

def atender(conn, addr):
    global contador
    with lock:
        contador += 1
        print(f"Total: {contador}")
    with conn:
        conn.recv(1024)
        conn.sendall(b"OK")
```

El Lock protege la variable compartida `contador`.
