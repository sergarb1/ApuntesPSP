---
title: 08 — Servidor concurrente completo con hilos
description: "Todo junto: servidor multihilo, cliente interactivo y lanzador de clientes 🏗️"
---

<p><small>Todo junto: servidor multihilo, cliente interactivo y lanzador de clientes 🏗️</small></p>

> 🗺️ **Estás en:** 🏗️ **UD 6 · Servidores concurrentes** → 08 · Servidor concurrente completo con hilos

---

## 📬 La idea en una frase

> Este punto junta toda la unidad en tres scripts listos para ejecutar: un **servidor concurrente** (`servidor.py`) que atiende a cada cliente en su hilo con un contador protegido por Lock, un **cliente interactivo** (`cliente.py`) para hablar con él a mano, y un **lanzador de clientes** (`lanzaclientes.py`) que lo pone a prueba con N conexiones a la vez.

Es el "Be the code" definitivo: aquí tienes el código completo, cómo ejecutarlo en dos terminales y los ejercicios de "Aprieta el lápiz" para cerrar la teoría.

---

## 🏗️ El servidor: `servidor.py`

Un servidor TCP multihilo con contador de conexiones protegido por Lock (el punto [3](/ApuntesPSP/05-servidores-concurrentes/03-hilo-por-cliente) + el punto [6](/ApuntesPSP/05-servidores-concurrentes/06-sincronizacion-en-servidores)):

```python
import socket, threading

contador = 0
lock = threading.Lock()
num_hilo = 0   # contador monótono para nombrar hilos de forma única

def atender(conn, addr):
    global contador
    with lock:
        contador += 1
        print(f"[+] Cliente {addr} conectado — total: {contador}")
    with conn:
        try:
            # Bucle de mensajes: la conversación dura hasta "SALIR" o cierre
            while True:
                datos = conn.recv(1024)
                if not datos:          # El cliente ha cerrado: b"" en recv
                    break
                mensaje = datos.decode().strip()
                print(f"    Recibido de {addr}: {mensaje}")
                conn.sendall(b"OK: " + datos)
                if mensaje.upper() == "SALIR":
                    break
        except (ConnectionResetError, BrokenPipeError, OSError):
            print(f"    Cliente {addr} se desconectó a mitad")
    with lock:
        contador -= 1
        print(f"[-] Cliente {addr} desconectado — total: {contador}")

def servidor_concurrente():
    global num_hilo
    with socket.socket() as srv:
        srv.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        srv.bind(("127.0.0.1", 5000))
        srv.listen()
        print("🏗️  Servidor CONCURRENTE escuchando en 127.0.0.1:5000")
        while True:
            conn, addr = srv.accept()
            hilo = threading.Thread(target=atender, args=(conn, addr))
            hilo.name = "hilo-" + str(num_hilo)
            num_hilo += 1
            hilo.start()

if __name__ == "__main__":
    servidor_concurrente()
```

Lo que demuestra este servidor:

- **Concurrencia**: `accept()` → crear hilo → `start()` → volver a aceptar (punto 3).
- **Sincronización**: el contador global solo se toca dentro de `with lock:` (punto 6).
- **Limpieza**: `with conn:` cierra el socket sí o sí (punto 7).
- **Convención**: punto de entrada con `if __name__ == "__main__":` y hilos nombrados con `.name`.

---

## 💬 El cliente: `cliente.py`

Antes de disparar clientes masivos, conviene tener un cliente "de una sola persona" con el que hablar a mano. Este cliente interactivo se registra, deja mensajes por consola y cierra limpio:

```python
import socket

def cliente():
    nombre = input("Tu nombre de usuario: ").strip() or "anónimo"
    try:
        with socket.socket() as s:
            s.connect(("127.0.0.1", 5000))
            s.sendall(f"REGISTRO:{nombre}".encode())
            print(f"📩 {s.recv(1024).decode().strip()}")

            # Bucle de conversación con el servidor
            while True:
                texto = input("tú> ").strip()
                if not texto:
                    continue
                s.sendall(texto.encode())
                respuesta = s.recv(1024).decode().strip()
                print(f"servidor> {respuesta}")
                if texto.upper() == "SALIR":
                    print("👋 Conexión cerrada")
                    break
    except ConnectionRefusedError:
        print("❌ Servidor no disponible. ¿Está arrancado en la terminal 1?")
    except (ConnectionResetError, BrokenPipeError):
        print("\n🛑 El servidor ha cerrado la conexión")

if __name__ == "__main__":
    cliente()
```

Traza del cliente:

1. **`input()`** pide el nombre (si no hay nada, usa `"anónimo"`).
2. **`socket()` → `connect()`** abre la conexión TCP al puerto 5000. Si el servidor no está, salta `ConnectionRefusedError` y el mensaje amable.
3. **`sendall(f"REGISTRO:{nombre}")`** envía el registro y espera la respuesta con `recv(1024)`.
4. **Bucle**: cada línea que escribes se envía con `sendall()` y la respuesta llega con `recv(1024)`. `SALIR` cierra desde el cliente.
5. **`with socket`** se asegura de cerrar la conexión al salir (por cualquier vía).

> 💡 `recv(1024)` devuelve `b""` (bytes vacíos) cuando el otro extremo ha cerrado: por eso el servidor comprueba `if not datos` antes de intentar decodificar. El servidor del punto 8 responde `OK: <datos>` a cualquier mensaje y cierra al recibir `SALIR`; el tratamiento de registros "de verdad" (con `manager.dict()`) aparece en el [punto 9](/ApuntesPSP/05-servidores-concurrentes/09-servidor-concurrente-completo-con-procesos).

---

## 🚀 El lanzador: `lanzaclientes.py`

Un script que lanza 10 clientes simultáneos contra el servidor (el lanzador masivo del [punto 5](/ApuntesPSP/05-servidores-concurrentes/05-benchmark)):

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

> 💡 Para convertirlo en benchmark, envuelve el bloque con `inicio = time.time()` al principio y `print(f"Tiempo total: {time.time() - inicio:.2f}s")` al final.

---

## 🤝 Cómo probarlos juntos

```
TERMINAL 1 (servidor)          TERMINAL 2 (lanzador)
─────────────────────          ─────────────────────
python servidor.py             python lanzaclientes.py
🏗️  Servidor CONCURRENTE…      Lanzando 10 clientes...
[+] Cliente ('127.0.0.1', …)     ✅ Cliente-0: OK: Cliente-0
[+] Cliente ('127.0.0.1', …)     ✅ Cliente-1: OK: Cliente-1
    Recibido: Cliente-0           … (todos responden)
    Recibido: Cliente-1         🏁 Todos los clientes terminaron
```

Si el servidor fuera secuencial, el lanzador tardaría 10 × tiempo_por_cliente y las respuestas llegarían de una en una. Con el servidor concurrente, **todas responden casi a la vez**: ese es el resultado del punto [5](/ApuntesPSP/05-servidores-concurrentes/05-benchmark). En lugar del lanzador, también puedes usar la terminal 2 para arrancar `cliente.py` y hablar con el servidor a mano. Se mata el servidor con **Ctrl+C** y cada script se ejecuta en su terminal.

---

## ✏️ Aprieta el lápiz

1. **Servidor secuencial → hilos**: Convierte un servidor TCP secuencial en uno multihilo.
2. **ThreadPool**: Implementa el mismo servidor con ThreadPoolExecutor de 5 hilos.
3. **Lanzador de clientes**: Crea un script que lance 10 clientes simultáneos para probar tu servidor.
4. **Contador de conexiones**: El servidor debe mostrar cuántos clientes han sido atendidos (usa Lock para la variable compartida).

<details>
<summary>🔓 Soluciones</summary>

**1. Secuencial → multihilo:** el `atender()` se mueve a una función y el bucle solo acepta y lanza hilos:

```python
import socket, threading

def atender(conn, addr):
    with conn:
        datos = conn.recv(1024)
        conn.sendall(b"OK: " + datos)

with socket.socket() as srv:
    srv.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    srv.bind(("127.0.0.1", 5000))
    srv.listen()
    while True:
        conn, addr = srv.accept()
        threading.Thread(target=atender, args=(conn, addr)).start()
```

**2. Con ThreadPoolExecutor de 5 hilos:** cambia `Thread(...).start()` por `pool.submit(...)`:

```python
import socket, concurrent.futures

def atender(conn, addr):
    with conn:
        datos = conn.recv(1024)
        conn.sendall(b"OK: " + datos)

with socket.socket() as srv, concurrent.futures.ThreadPoolExecutor(max_workers=5) as pool:
    srv.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    srv.bind(("127.0.0.1", 5000))
    srv.listen()
    while True:
        conn, addr = srv.accept()
        pool.submit(atender, conn, addr)
```

**3. Lanzador de 10 clientes:**

```python
import socket, threading, time

def cliente(id):
    with socket.socket() as s:
        s.connect(("127.0.0.1", 5000))
        s.sendall(f"Cliente-{id}\n".encode())
        print(f"  ✅ Cliente-{id}: {s.recv(1024).decode().strip()}")

inicio = time.time()
hilos = [threading.Thread(target=cliente, args=(i,)) for i in range(10)]
for h in hilos: h.start()
for h in hilos: h.join()
print(f"🏁 Todos terminados en {time.time() - inicio:.2f}s")
```

**4. Contador de conexiones con Lock:**

```python
import socket, threading

contador = 0
lock = threading.Lock()

def atender(conn, addr):
    global contador
    with lock:
        contador += 1
        print(f"Atendidos: {contador}")
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

</details>

---

## 🧠 Mini-chequeo

1. ¿Por qué el contador se incrementa y decrementa dentro de `with lock:`?
2. ¿Qué pasa en el lanzador si el servidor no está arrancado?
3. ¿Dónde se nombra el hilo y con qué valor?

<details>
<summary>🔄 Respuestas</summary>

1. Porque es una **variable global compartida** por todos los hilos: la actualización debe ser atómica (punto 6) o perderíamos conexiones en la condición de carrera.
2. El cliente lanza una excepción (`ConnectionRefusedError`) y el `except Exception as e:` imprime `❌ Cliente-N: <error>`. Por eso el lanzador incluye el `try/except`.
3. En `servidor.py`, justo antes de `start()`: `hilo.name = "hilo-" + str(contador)`. Es la convención del módulo para trazar hilos.

</details>

---

## ✅ Resumen en 3 frases

- `servidor.py` combina **hilo por cliente + Lock + `with conn:`** en un servidor de producción sencillo.
- `lanzaclientes.py` prueba que atiende a **N clientes a la vez** y sirve de benchmark.
- Los ejercicios "Aprieta el lápiz" cubren las dos variantes (hilos y pool) y el contador sincronizado.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| servidor.py | El servidor concurrente completo de la unidad |
| cliente.py | El cliente interactivo para hablar con el servidor a mano |
| lanzaclientes.py | El script que dispara N clientes simultáneos |
| hilo.name | Nombre del hilo para trazarlo ("hilo-1", "hilo-2"…) |
| if __name__ | Punto de entrada del script |
| Ctrl+C | Cómo se mata el servidor en pruebas |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/05-servidores-concurrentes) · **Anterior:** [07 · Límites y buenas prácticas](/ApuntesPSP/05-servidores-concurrentes/07-limites-y-buenas-practicas) · **Siguiente:** [09 · Servidor concurrente completo con procesos](/ApuntesPSP/05-servidores-concurrentes/09-servidor-concurrente-completo-con-procesos)