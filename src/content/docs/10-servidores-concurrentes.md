---
title: "TEMA 10 — Servidores Concurrentes"
nav_order: 10
---

## TEMA 10 — Servidores Concurrentes (RA4c-d)

> "Un servidor secuencial atiende a un cliente cada vez. Los demás esperan. Un servidor concurrente atiende a todos a la vez. Como un camarero con 10 mesas."

---

## Índice

1. [El problema del servidor secuencial](#el-problema-del-servidor-secuencial)
2. [Be the code, my friend, my friend — Servidor secuencial vs concurrente](#be-the-code-my-friend-my-friend--servidor-secuencial-vs-concurrente)
3. [Servidor con hilos (threading)](#servidor-con-hilos-threading)
4. [ThreadPoolExecutor — control de recursos](#threadpoolexecutor--control-de-recursos)
5. [⏱ Benchmark — Secuencial vs Hilos vs Pool](#⏱-benchmark--secuencial-vs-hilos-vs-pool)
6. [Be the code, my friend, my friend — Servidor multihilo en acción](#be-the-code-my-friend-my-friend--servidor-multihilo-en-acción)
7. [🧩 Pool Puzzle — Servidor concurrente](#🧩-pool-puzzle--servidor-concurrente)
8. [🥊 El ring de los conceptos — Hilo por cliente vs ThreadPool](#el-ring-de-los-conceptos--hilo-por-cliente-vs-threadpool)
9. [Preguntas tontas — Concurrencia](#preguntas-tontas--concurrencia)
10. [✏️ Aprieta el lápiz](#✏-aprieta-el-lápiz)
11. [RAs cubiertos y criterios de evaluación](#ras-cubiertos-y-criterios-de-evaluación)

---

## El problema del servidor secuencial

```python
import socket, time

def servidor_lento():
    with socket.socket() as srv:
        srv.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        srv.bind(("127.0.0.1", 5000))
        srv.listen()
        print("🐢 Servidor SECUENCIAL: 1 cliente cada vez")

        while True:
            conn, addr = srv.accept()
            print(f"  Cliente {addr} conectado")
            time.sleep(3)  # Simula trabajo pesado
            conn.sendall(b"Procesado\n")
            conn.close()
            print(f"  Cliente {addr} atendido")
```

> Si 3 clientes se conectan a la vez: el primero tarda 3s, el segundo 6s, el tercero 9s. 🐢

---

## Be the code, my friend, my friend — Servidor secuencial vs concurrente

**Servidor secuencial** (3 clientes a la vez):
```
Tiempo:  0s ──── Cliente-1 conecta
          │     Servidor procesa cliente-1 (3s)
         3s ──── Cliente-1 listo
          │     Cliente-2 conectó en t=0.1s, pero espera...
          │     Servidor procesa cliente-2 (3s)
         6s ──── Cliente-2 listo
          │     Cliente-3 conectó en t=0.2s, pero espera...
          │     Servidor procesa cliente-3 (3s)
         9s ──── Cliente-3 listo 🏁
```

**Servidor concurrente** (3 clientes a la vez):
```
Tiempo:  0s ──── Cliente-1 conecta → hilo-1 procesa
          │     Cliente-2 conecta → hilo-2 procesa
          │     Cliente-3 conecta → hilo-3 procesa
          │     (Los 3 procesan en paralelo)
         3s ──── Cliente-1 listo 🏁
          │     Cliente-2 listo 🏁
          │     Cliente-3 listo 🏁
```

> Con hilos, todos terminan a la vez. Sin hilos, el último espera 9s.

---

## Servidor con hilos (threading)

Cada cliente recibe su propio hilo.

```python
import socket, threading

def atender(conn, addr):
    print(f"[+] Cliente {addr} conectado")
    with conn:
        datos = conn.recv(1024)
        print(f"    Recibido: {datos.decode()}")
        import time
        time.sleep(2)  # Simular trabajo
        conn.sendall(b"OK: " + datos)
    print(f"[-] Cliente {addr} desconectado")

def servidor_multihilo():
    with socket.socket() as srv:
        srv.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        srv.bind(("127.0.0.1", 5000))
        srv.listen()
        print("🚀 Servidor MULTIHILO — varios clientes a la vez")

        while True:
            conn, addr = srv.accept()
            hilo = threading.Thread(target=atender, args=(conn, addr))
            hilo.start()
```

---

## ThreadPoolExecutor — control de recursos

Crear un hilo por cada cliente puede saturar el sistema con 10.000 conexiones. Un **ThreadPool** reutiliza un número fijo de hilos.

```python
import socket, concurrent.futures

MAX_HILOS = 10

def atender(conn, addr):
    with conn:
        datos = conn.recv(1024)
        conn.sendall(b"OK: " + datos)

def servidor_pool():
    with socket.socket() as srv:
        srv.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        srv.bind(("127.0.0.1", 5000))
        srv.listen()

        with concurrent.futures.ThreadPoolExecutor(max_workers=MAX_HILOS) as pool:
            print(f"⚡ Servidor con Pool de {MAX_HILOS} hilos")
            while True:
                conn, addr = srv.accept()
                pool.submit(atender, conn, addr)
```

| Enfoque | Ventaja | Desventaja |
|---------|---------|------------|
| Hilo por cliente | Simple | Puede saturar el SO (miles de hilos) |
| ThreadPool | Límite controlado | Si el pool se llena, los clientes esperan |

---

## ⏱ Benchmark — Secuencial vs Hilos vs Pool

¿Cuánto más rápido es un servidor concurrente? Aquí tienes un experimento que lanza 10 clientes y mide el tiempo total:

```python
import socket, time, threading, concurrent.futures

def cliente(id):
    """Conecta, envía 'ping', recibe 'pong'"""
    with socket.socket() as s:
        s.connect(("127.0.0.1", 5000))
        s.sendall(b"ping")
        s.recv(1024)

def prueba(tipo_servidor, n=10):
    """Lanza n clientes en paralelo y cronometra"""
    inicios = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=n) as pool:
        futuros = [pool.submit(cliente, i) for i in range(n)]
        concurrent.futures.wait(futuros)
```

| Enfoque | 10 clientes (2s c/u) | Fórmula |
|---------|----------------------|---------|
| 🐢 Secuencial | ~20 segundos | n × tiempo_por_cliente |
| 🚀 Hilos | ~2 segundos | max(tiempo_por_cliente) |
| ⚡ ThreadPool (5 hilos) | ~4 segundos | ceil(n/workers) × tiempo_por_cliente |

> El ThreadPool con 5 hilos tarda el doble que hilos ilimitados, pero **no ahoga el sistema**. Con 1000 clientes, hilos ilimitados matarían el PC; el pool encola y sirve de a 5.

### 🧪 Cliente de prueba — lanzador masivo

```python
import socket, threading, time

def cliente(id):
    try:
        with socket.socket() as s:
            s.connect(("127.0.0.1", 5000))
            s.sendall(f"Cliente-{id}\n".encode())
            resp = s.recv(1024)
            print(f"  ✅ Cliente-{id}: {resp.decode().strip()}")
    except Exception as e:
        print(f"  ❌ Cliente-{id}: {e}")

print("Lanzando 10 clientes...")
hilos = []
for i in range(10):
    t = threading.Thread(target=cliente, args=(i,))
    t.start()
    hilos.append(t)
for t in hilos:
    t.join()
print("🏁 Todos los clientes terminaron")
```

> Este script prueba que tu servidor concurrente realmente atiende a varios clientes a la vez. Si es secuencial, los clientes 2-9 esperarán su turno.

> "Sé el servidor que recibe 3 clientes a la vez. Traza cada hilo."

```
🟢 SERVIDOR PRINCIPAL
1. Crea socket, bind(5000), listen()
2. accept() → espera... ⏳

[Cliente-1: t=0s]
3. accept() → conn1, addr1
4. Crea hilo-1 → start(atender, conn1)
5. Vuelve a accept() inmediatamente

[Cliente-2: t=0.1s]
6. accept() → conn2, addr2
7. Crea hilo-2 → start(atender, conn2)
8. Vuelve a accept()

[Cliente-3: t=0.2s]
9. accept() → conn3, addr3
10. Crea hilo-3 → start(atender, conn3)
11. Vuelve a accept()

AHORA 4 HILOS EJECUTANDO:
┌─────────────┬──────────────────────────────────┐
│ Hilo ppal   │ accept() esperando más clientes  │
│ Hilo-1      │ recibe → procesa (2s) → responde │
│ Hilo-2      │ recibe → procesa (2s) → responde │
│ Hilo-3      │ recibe → procesa (2s) → responde │
└─────────────┴──────────────────────────────────┘

Los 3 clientes son atendidos en paralelo.
A los ~2s, todos reciben respuesta. 🏁
```

---

## 🧩 Pool Puzzle — Servidor con ThreadPool

Desordena y reconstruye este servidor que usa ThreadPoolExecutor:

```
a) from concurrent.futures import ThreadPoolExecutor
b)     pool.submit(atender, conn, addr)
c)     with ThreadPoolExecutor(max_workers=5) as pool:
d) import socket
e) def atender(conn, addr):
f)         conn.sendall(b"OK\n")
g) while True:
h)     with socket.socket() as srv:
i)             datos = conn.recv(1024)
j)         conn, addr = srv.accept()
k)     srv.bind(("0.0.0.0", 5000))
l)     srv.listen()
```

<details>
<summary>🔓 Solución</summary>

**Orden correcto:** d → a → e → i → f → h → k → l → g → j → c → b

```python
import socket                                             # d) import
from concurrent.futures import ThreadPoolExecutor          # a) import pool

def atender(conn, addr):                                  # e) función manejadora
    with conn:                                            # cerrar conn al salir
        datos = conn.recv(1024)                           # i) recibir datos
        conn.sendall(b"OK\n")                             # f) responder

with socket.socket() as srv:                              # h) crear socket
    srv.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    srv.bind(("0.0.0.0", 5000))                           # k) bind
    srv.listen()                                           # l) listen
    with ThreadPoolExecutor(max_workers=5) as pool:        # c) crear pool
        while True:                                        # g) bucle ppal
            conn, addr = srv.accept()                      # j) aceptar
            pool.submit(atender, conn, addr)               # b) enviar al pool
```

**¿Por qué este orden?**
- `bind()` y `listen()` van antes del bucle (se hace una vez)
- El pool se crea **antes** del bucle para no crearlo en cada iteración
- `submit()` va dentro del bucle, para cada nueva conexión
- La función `atender` se define antes de usarla
</details>

---

## 🥊 El ring de los conceptos — Hilo por cliente vs ThreadPool

**HiloPorCliente**: — Soy el enfoque clásico. Llega un cliente, creo un hilo, lo atiendo, el hilo muere. Sencillo y directo.

**ThreadPool**: — ¿Y si llegan 1000 clientes? Creas 1000 hilos y el sistema se colapsa. Yo tengo un número fijo de hilos, como un equipo de camareros limitado.

**HiloPorCliente**: — Pero cada cliente tiene su hilo dedicado. No esperan. Es más justo.

**ThreadPool**: — Justo pero ineficiente. Con mi pool, los clientes esperan un poco pero el sistema no se ahoga. Además, reutilizo hilos, evitando el coste de crearlos y destruirlos constantemente.

**HiloPorCliente**: — Para pocos clientes simultáneos, soy más simple de implementar.

**ThreadPool**: — Y yo escalo mejor. Para servidores en producción, soy la opción sensata.

> **Moraleja**: Hilo por cliente es simple y funciona para pocos clientes. ThreadPool escala mejor y controla los recursos. En producción, usa ThreadPool.

---

## Preguntas tontas — Concurrencia

**❓ ¿Cuántos hilos puede tener un servidor?**
Depende del SO. En Windows, unos pocos miles. Pero más allá de ~100, el cambio de contexto (context switch) perjudica el rendimiento.

**❓ ¿Qué pasa si un hilo se cuelga?**
Ese hilo queda bloqueado, pero los demás siguen. El problema es si no libera el socket (fuga de recursos).

**❓ ¿ThreadPool o hilo por cliente en producción?**
**ThreadPool** siempre. Controlas cuántos hilos se crean. Hilo por cliente solo para prototipos.

**❓ ¿Es seguro compartir variables globales entre hilos del servidor?**
No sin Lock. Si dos hilos modifican la misma variable, usa Lock. Mejor aún: evita compartir estado.

**❓ ¿Puedo mezclar hilos y asyncio?**
Sí, con `loop.run_in_executor()`. Pero empieza con uno u otro.

**❓ ¿Y si el servidor recibe 10.000 conexiones?**
ThreadPool con 100 hilos + cola de espera. O usa **asyncio** (TEMA 11) que escala mejor.

---

## ✏️ Aprieta el lápiz

1. **Servidor secuencial → hilos**: Convierte un servidor TCP secuencial en uno multihilo.
2. **ThreadPool**: Implementa el mismo servidor con ThreadPoolExecutor de 5 hilos.
3. **Lanzador de clientes**: Crea un script que lance 10 clientes simultáneos para probar tu servidor.
4. **Contador de conexiones**: El servidor debe mostrar cuántos clientes han sido atendidos (usa Lock para la variable compartida).

---

## RAs cubiertos y criterios de evaluación

### RA4 — Servicios en red (c-d)

| Criterio | Descripción | Cubierto |
|----------|-------------|----------|
| RA4c | Implementa servidores concurrentes con hilos | ✅ |
| RA4d | Gestiona pools de hilos (ThreadPoolExecutor) | ✅ |

> RA4a-b (APIs REST y comerciales) se cubren en los **TEMAS 06-07**. RA4e-g (asyncio, disponibilidad, comparativa) se cubren en el **TEMA 11**.
