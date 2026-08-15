---
title: 06 — Sincronización en servidores
description: El Lock para el estado compartido entre hilos 🔒
---

<p><small>El Lock para el estado compartido entre hilos 🔒</small></p>

> 🗺️ **Estás en:** 🏗️ **U10 · Servidores Concurrentes** → 06 · Sincronización en servidores

---

## 📬 La idea en una frase

> Cuando varios hilos del servidor tocan la **misma variable global** (un contador de conexiones, un total de bytes), hay **condición de carrera**: dos hilos pueden leer y escribir a la vez y perder actualizaciones. La solución es el **Lock** de la [U03](/ApuntesPSP/03-sincronizacion-entre-hilos).

En el [punto 3](/ApuntesPSP/10-servidores-concurrentes/03-hilo-por-cliente) y el [punto 4](/ApuntesPSP/10-servidores-concurrentes/04-threadpoolexecutor) los hilos eran independientes. Pero un servidor real suele llevar **estado**: "¿cuántos clientes he atendido?", "¿cuántos bytes he recibido?". Ese estado es compartido… y eso es un problema.

---

## 💥 La condición de carrera en el servidor

Imagina un contador global de conexiones atendidas, sin protección:

```python
import socket, threading

contador = 0  # ← variable global compartida

def atender(conn, addr):
    global contador
    contador += 1          # ⚠️ ¡no es atómico!
    print(f"Total atendidos: {contador}")
    with conn:
        conn.recv(1024)
        conn.sendall(b"OK")
```

El problema es que `contador += 1` se ejecuta en **varios pasos**: leer el valor → sumar 1 → guardarlo. Dos hilos pueden leer el mismo valor (p. ej. 7) a la vez y los dos guardar 8: **una conexión se pierde**.

```
Hilo-A:  lee contador (=7)
Hilo-B:  lee contador (=7)   ← ¡mismo valor!
Hilo-A:  guarda 8
Hilo-B:  guarda 8            ← contador debía ser 9, quedó en 8 💥
```

> ⚠️ **Regla de oro:** si dos hilos del servidor modifican la misma variable, usa **Lock**. Mejor aún: **evita compartir estado** cuando puedas.

---

## 🔒 El Lock en acción

Con un `threading.Lock`, la sección crítica queda protegida:

```python
import socket, threading

contador = 0
lock = threading.Lock()

def atender(conn, addr):
    global contador
    with lock:                    # 🔒 nadie más puede entrar aquí
        contador += 1
        print(f"Total atendidos: {contador}")
    with conn:
        conn.recv(1024)
        conn.sendall(b"OK")

def servidor_multihilo():
    with socket.socket() as srv:
        srv.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        srv.bind(("127.0.0.1", 5000))
        srv.listen()
        while True:
            conn, addr = srv.accept()
            threading.Thread(target=atender, args=(conn, addr)).start()
```

`with lock:` adquiere el lock al entrar y lo libera al salir (aunque haya una excepción). Entre esas líneas, **un solo hilo a la vez**: los demás esperan su turno. La lectura, suma y guardado del contador ya son indivisibles.

> 💡 El `with lock:` del servidor es exactamente el patrón que ya conoces de la [U03 · Sincronización entre hilos](/ApuntesPSP/03-sincronizacion-entre-hilos): misma herramienta, distinto escenario.

---

## 🔍 ¿Y el contador de bytes?

El mismo patrón sirve para acumular cualquier valor global. Un contador de bytes totales recibidos:

```python
import socket, threading

total_bytes = 0
lock = threading.Lock()

def atender(conn, addr):
    global total_bytes
    with conn:
        datos = conn.recv(1024)
    with lock:
        total_bytes += len(datos)          # 🔒 actualización atómica
        print(f"  {addr} envió {len(datos)} bytes — Total: {total_bytes}")
```

Nota: el `recv()` y el `sendall()` **no** necesitan lock (cada conexión es un socket distinto); solo lo necesita la **variable compartida**. Proteger de más (meter el recv dentro del lock) volvería el servidor secuencial sin querer.

---

## 🧠 Mini-chequeo

1. ¿Por qué `contador += 1` no es una operación segura entre hilos?
2. ¿Qué pasa si dos hilos incrementan el contador a la vez sin Lock?
3. En el servidor, ¿qué necesita Lock: el `recv()` del socket o la variable global?

<details>
<summary>🔄 Respuestas</summary>

1. Porque se ejecuta en **varios pasos** (leer, sumar, guardar) y los hilos se entrelazan: pueden leer el mismo valor y perder una actualización.
2. **Se pierde una conexión**: si ambos leen 7, los dos guardan 8, y el contador "debería" ser 9. Eso es una **condición de carrera**.
3. La **variable global**: cada socket es independiente y no compite con otros. El Lock solo rodea la sección crítica que toca estado compartido.

</details>

---

## ✅ Resumen en 3 frases

- Los hilos del servidor compiten por las **variables globales** (contadores, totales) y eso causa condiciones de carrera.
- El **Lock** (`with lock:`) hace indivisible la actualización: un hilo a la vez en la sección crítica.
- Regla práctica: protege solo lo compartido; lo que es por conexión (recv/sendall) no necesita lock.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| Condición de carrera | Dos hilos compiten por la misma variable y se pierden datos |
| Sección crítica | Código que toca estado compartido y necesita Lock |
| threading.Lock() | Cerradura para exclusión mutua entre hilos |
| with lock: | Adquiere el lock al entrar y lo libera al salir |
| Estado compartido | Variables globales que varios hilos leen/escriben |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/10-servidores-concurrentes) · **Anterior:** [05 · Benchmark](/ApuntesPSP/10-servidores-concurrentes/05-benchmark) · **Siguiente:** [07 · Límites y buenas prácticas](/ApuntesPSP/10-servidores-concurrentes/07-limites-y-buenas-practicas)