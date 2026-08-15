---
title: Boletín U10 — Avanzado (Resuelto)
description: Soluciones de los ejercicios avanzados de Servidores Concurrentes
---

# 💪 Boletín U10 — Avanzado (Resuelto)

---

## 1. Servidor con timeout

```python
import socket

with socket.socket() as srv:
    srv.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    srv.bind(("127.0.0.1", 5000))
    srv.listen()
    print("🕐 Servidor con timeout de 5 segundos")
    while True:
        conn, addr = srv.accept()
        conn.settimeout(5)          # ⏰ 5 segundos máximos para recv
        with conn:
            try:
                datos = conn.recv(1024)
                print(f"  Recibido de {addr}: {datos.decode()}")
            except socket.timeout:
                print(f"  ⏰ {addr} no envió nada en 5s → cierro conexión")
```

`conn.settimeout(5)` limita el `recv()`: si el cliente no envía datos en 5 segundos, salta `socket.timeout` y el `with conn:` cierra el socket ([punto 7](/ApuntesPSP/10-servidores-concurrentes/07-limites-y-buenas-practicas)). Un cliente mudo ya no cuelga un hilo para siempre.

## 2. Cliente con timeout

```python
import socket

try:
    with socket.socket() as s:
        s.settimeout(2)              # ⏰ 2 segundos para conectar y recibir
        s.connect(("127.0.0.1", 9999))
        s.sendall(b"ping")
        print(s.recv(1024))
except socket.timeout:
    print("Servidor no disponible")
```

Al conectar a un puerto en el que nada escucha, o al no recibir respuesta, `socket.timeout` se captura y se muestra "Servidor no disponible" en lugar de un fallo sin control.

## 3. Contador de bytes totales

```python
import socket, threading

total_bytes = 0
lock = threading.Lock()

def atender(conn, addr):
    global total_bytes
    with conn:
        datos = conn.recv(1024)
    with lock:                                  # 🔒 actualización atómica
        total_bytes += len(datos)
        print(f"  {addr} envió {len(datos)} bytes — Total: {total_bytes}")

with socket.socket() as srv:
    srv.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    srv.bind(("127.0.0.1", 5000))
    srv.listen()
    while True:
        conn, addr = srv.accept()
        threading.Thread(target=atender, args=(conn, addr)).start()
```

El `recv()` queda **fuera** del Lock (cada socket es independiente) y solo la suma al contador global entra en `with lock:`: así varios hilos suman bytes sin condición de carrera ([punto 6](/ApuntesPSP/10-servidores-concurrentes/06-sincronizacion-en-servidores)).

## 4. Servidor con límite de clientes

```python
import socket, threading

MAX_CLIENTES = 3
clientes_activos = 0
lock = threading.Lock()

def atender(conn, addr):
    global clientes_activos
    with conn:
        conn.recv(1024)
        conn.sendall(b"OK")
    with lock:
        clientes_activos -= 1

with socket.socket() as srv:
    srv.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    srv.bind(("127.0.0.1", 5000))
    srv.listen()
    print(f"🚦 Máximo {MAX_CLIENTES} clientes a la vez")
    while True:
        conn, addr = srv.accept()
        with lock:
            if clientes_activos >= MAX_CLIENTES:
                conn.sendall(b"Servidor completo")
                conn.close()
                print(f"  ❌ {addr} rechazado: servidor completo")
                continue
            clientes_activos += 1
        threading.Thread(target=atender, args=(conn, addr)).start()
```

Al aceptar se comprueba el máximo bajo `with lock:`. El cuarto cliente recibe `"Servidor completo"` y se cierra **sin incrementar** el contador; los que entran lo decrementan al terminar.

## 5. Prueba de carga

```python
import socket, threading, time

resultados = {}
lock = threading.Lock()

def cliente(id):
    inicio = time.time()
    try:
        with socket.socket() as s:
            s.connect(("127.0.0.1", 5000))
            s.sendall(b"ping")
            s.recv(1024)
        exito = True
    except Exception:
        exito = False
    fin = time.time()
    with lock:
        resultados[id] = (exito, fin - inicio)

hilos = [threading.Thread(target=cliente, args=(i,)) for i in range(20)]
for h in hilos: h.start()
for h in hilos: h.join()

exitosos = sum(1 for ok, _ in resultados.values() if ok)
tiempos = [t for ok, t in resultados.values() if ok]
media = sum(tiempos) / len(tiempos) if tiempos else 0
print(f"Exitosos: {exitosos}/20 | Total: {sum(tiempos):.2f}s | Media: {media:.2f}s")
```

Cada cliente guarda su resultado (éxito + duración) en un diccionario compartido protegido por Lock. Tras `join()` a todos, se calculan las estadísticas: es el **benchmark** del [punto 5](/ApuntesPSP/10-servidores-concurrentes/05-benchmark) llevado a 20 clientes.

## 6. Servidor con cola de espera

```python
import socket, threading, queue

COLA = queue.Queue()

def atender():
    while True:
        conn, addr = COLA.get()          # 🔔 espera a que haya trabajo
        with conn:
            datos = conn.recv(1024)
            conn.sendall(b"OK: " + datos)
            print(f"  Atendido {addr}")
        COLA.task_done()

N_TRABAJADORES = 3
for _ in range(N_TRABAJADORES):
    threading.Thread(target=atender, daemon=True).start()

with socket.socket() as srv:
    srv.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    srv.bind(("127.0.0.1", 5000))
    srv.listen()
    print("🔔 Cola de espera con 3 trabajadores")
    while True:
        conn, addr = srv.accept()
        COLA.put((conn, addr))           # 📦 encola la conexión
```

El hilo principal solo **acepta y encola**. Los N trabajadores (daemon) sacan conexiones con `COLA.get()` y las atienden: es un ThreadPool hecho a mano con `queue.Queue`, el mecanismo interno de los pools del [punto 4](/ApuntesPSP/10-servidores-concurrentes/04-threadpoolexecutor).

## 7. Estado del servidor

```python
import socket, threading

activas = 0
lock = threading.Lock()

def atender(conn, addr):
    global activas
    with conn:
        comando = conn.recv(1024).decode().strip()
        if comando == "STATUS":
            with lock:
                conn.sendall(f"Activas: {activas}".encode())
        else:
            conn.sendall(b"OK")
    with lock:
        activas -= 1

with socket.socket() as srv:
    srv.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    srv.bind(("127.0.0.1", 5000))
    srv.listen()
    while True:
        conn, addr = srv.accept()
        with lock:
            activas += 1
        threading.Thread(target=atender, args=(conn, addr)).start()
```

Un cliente que envíe `"STATUS"` recibe el número de conexiones activas (el resto recibe `"OK"`). El contador se incrementa al aceptar y se decrementa al salir, siempre bajo Lock.

## 8. Heartbeat en servidor

```python
import socket, threading, time

activas = 0
lock = threading.Lock()

def heartbeat():
    while True:
        time.sleep(5)
        with lock:
            print(f"💓 Servidor vivo — {activas} conexiones")

threading.Thread(target=heartbeat, daemon=True).start()

def atender(conn, addr):
    global activas
    with lock:
        activas += 1
    with conn:
        conn.recv(1024)
        conn.sendall(b"OK")
    with lock:
        activas -= 1

with socket.socket() as srv:
    srv.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    srv.bind(("127.0.0.1", 5000))
    srv.listen()
    while True:
        conn, addr = srv.accept()
        threading.Thread(target=atender, args=(conn, addr)).start()
```

El hilo heartbeat es **daemon** (muere con el servidor) y cada 5s imprime el estado leyendo el contador bajo Lock. Es la semilla del *heartbeat* de disponibilidad que ampliarás en la [U11 · asyncio](/ApuntesPSP/11-asyncio-y-disponibilidad).

## 9. Balanceador de carga simple

```python
import socket, threading

PUERTOS_WORKERS = [5001, 5002]
indice = 0

def worker(puerto):
    with socket.socket() as srv:
        srv.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        srv.bind(("127.0.0.1", puerto))
        srv.listen()
        print(f"  ⚙️  Worker escuchando en {puerto}")
        while True:
            conn, addr = srv.accept()
            with conn:
                datos = conn.recv(1024)
                conn.sendall(f"Worker-{puerto}: ".encode() + datos)

for puerto in PUERTOS_WORKERS:
    threading.Thread(target=worker, args=(puerto,), daemon=True).start()

def balanceador():
    global indice
    with socket.socket() as srv:
        srv.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        srv.bind(("127.0.0.1", 5000))
        srv.listen()
        print("⚖️  Balanceador en 127.0.0.1:5000 (round-robin)")
        while True:
            conn, addr = srv.accept()
            puerto = PUERTOS_WORKERS[indice % len(PUERTOS_WORKERS)]
            indice += 1
            with conn:
                datos = conn.recv(1024)
                with socket.socket() as worker_s:
                    worker_s.connect(("127.0.0.1", puerto))
                    worker_s.sendall(datos)
                    respuesta = worker_s.recv(1024)
                conn.sendall(respuesta)
            print(f"  {addr} → worker {puerto}")

balanceador()
```

El balanceador (puerto 5000) hace de **proxy**: lee del cliente, reenvía al worker elegido por **round-robin** (`indice % 2`), recibe su respuesta y la devuelve al cliente. Los workers 5001 y 5002 son servidores normales, cada uno en su hilo. Los clientes que envíen varias peticiones verán cómo se alterna la respuesta `Worker-5001`/`Worker-5002`.