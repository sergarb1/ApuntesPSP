---
title: Boletín U03 — Avanzado (Resuelto)
description: Soluciones de los ejercicios avanzados de Sincronización entre Hilos
---

# 💪 Boletín U03 — Avanzado (Resuelto)

---

## 1. Condition con notify_all

```python
import threading, time

cola = []
condition = threading.Condition()

def consumidor(id):
    for _ in range(1):
        with condition:
            while not cola:
                condition.wait()
            item = cola.pop(0)
            print(f"  🍽️ Consumidor-{id} procesó: {item}")

def productor():
    for i in range(3):
        with condition:
            cola.append(f"item-{i}")
            print(f"📦 Producido: item-{i}")
            condition.notify_all()   # despierta a los 3 consumidores
        time.sleep(0.5)

hilos = [threading.Thread(target=consumidor, args=(i,)) for i in range(3)]
hilos.append(threading.Thread(target=productor))
for h in hilos: h.start()
for h in hilos: h.join()
```

Con 3 consumidores esperando, `notify_all()` los despierta a **todos**; si usáramos `notify()` solo despertaría a uno y los demás podrían quedarse dormidos ([punto 6](/ApuntesPSP/03-sincronizacion-entre-hilos/06-condition)).

## 2. Deadlock entre dos hilos

```python
import threading, time

lockA = threading.Lock()
lockB = threading.Lock()

def hilo_1():
    with lockA:
        time.sleep(0.1)
        with lockB:   # espera a que el hilo 2 libere B
            print("Hilo 1 trabajando")

def hilo_2():
    with lockB:
        time.sleep(0.1)
        with lockA:   # espera a que el hilo 1 libere A
            print("Hilo 2 trabajando")

h1 = threading.Thread(target=hilo_1)
h2 = threading.Thread(target=hilo_2)
h1.start(); h2.start()
h1.join(); h2.join()  # ❌ nunca termina: deadlock
```

El hilo 1 tiene A y espera B; el hilo 2 tiene B y espera A. **Ningún `print` sale nunca** y el programa se queda colgado ([punto 8](/ApuntesPSP/03-sincronizacion-entre-hilos/08-buenas-practicas)).

## 3. Semáforo con recursos limitados

```python
import threading, time

impresoras = threading.Semaphore(3)

def imprimir(id):
    with impresoras:
        print(f"🖨️ Imprimiendo documento-{id}...")
        time.sleep(2)
        print(f"  ✅ Documento-{id} impreso")

hilos = [threading.Thread(target=imprimir, args=(i,)) for i in range(6)]
for h in hilos: h.start()
for h in hilos: h.join()
```

Con `Semaphore(3)` nunca hay más de **3 documentos imprimiendo a la vez**, aunque haya 6 hilos esperando ([punto 4](/ApuntesPSP/03-sincronizacion-entre-hilos/04-semaphore)).

## 4. 🎯 Banco con cuentas compartidas

```python
import threading, time, random

saldo = 100
lock = threading.Lock()

def ingresar():
    global saldo
    for _ in range(5):
        with lock:
            cantidad = random.randint(10, 50)
            saldo += cantidad
            print(f"➕ Ingreso {cantidad} € → saldo {saldo} €")
        time.sleep(random.random())

def retirar():
    global saldo
    for _ in range(5):
        with lock:
            cantidad = random.randint(10, 50)
            if saldo >= cantidad:
                saldo -= cantidad
                print(f"➖ Retiro {cantidad} € → saldo {saldo} €")
            else:
                print(f"❌ Saldo insuficiente ({saldo} €) para retirar {cantidad} €")
        time.sleep(random.random())

h1 = threading.Thread(target=ingresar)
h2 = threading.Thread(target=retirar)
h1.start(); h2.start()
h1.join(); h2.join()
print(f"Saldo final: {saldo} €")
```

El `Lock` global evita que ingreso y retiro se pisen; el retirador comprueba `saldo >= cantidad` **dentro** del lock antes de restar, así el saldo **nunca es negativo**.

## 5. 🔍 Semáforo con timeout

```python
import threading, time

semaforo = threading.Semaphore(2)

def tarea(id):
    if semaforo.acquire(blocking=True, timeout=2):
        print(f"Hilo-{id}: entró")
        time.sleep(3)
        semaforo.release()
    else:
        print(f"Hilo-{id}: se rinde (timeout 2s)")

hilos = [threading.Thread(target=tarea, args=(i,)) for i in range(4)]
for h in hilos: h.start()
for h in hilos: h.join()
```

Con `timeout=2`, los hilos que no consiguen entrar en 2 segundos **se rinden** (devuelve `False`) en vez de bloquearse para siempre. Los primeros 2 entran; el resto abandona.

## 6. 🧩 Barrera con fases múltiples

```python
import threading, time

barrera = threading.Barrier(3)

def trabajador(id):
    for fase in range(3):
        print(f"  🧮 Hilo-{id}: trabajando en fase {fase+1}")
        time.sleep(id * 0.3)   # cada hilo tarda distinto
        barrera.wait()         # nadie pasa a la siguiente fase hasta que llegan los 3
        print(f"  🏁 Hilo-{id}: fase {fase+1} completada")

hilos = [threading.Thread(target=trabajador, args=(i,)) for i in range(3)]
for h in hilos: h.start()
for h in hilos: h.join()
```

Los `barrera.wait()` después de cada fase garantizan que **ningún hilo empieza la fase N+1** hasta que los 3 terminaron la fase N ([punto 5](/ApuntesPSP/03-sincronizacion-entre-hilos/05-barrier)).

## 7. 🎭 Condition con timeout

```python
import threading, time

cola = []
condition = threading.Condition()

def productor():
    for _ in range(2):
        time.sleep(3)              # produce cada 3 segundos
        with condition:
            cola.append("producto")
            print("📦 Producido (cada 3s)")
            condition.notify()

def consumidor():
    for _ in range(2):
        with condition:
            if not condition.wait(timeout=2):   # espera máximo 2s
                print("  ⏳ timeout: el consumidor se va")
            elif cola:
                print(f"  🍽️ Consumido: {cola.pop(0)}")

h1 = threading.Thread(target=productor)
h2 = threading.Thread(target=consumidor)
h1.start(); h2.start()
h1.join(); h2.join()
```

`wait(timeout=2)` devuelve `False` si expiran los 2 segundos sin notificación: el consumidor **se va** en lugar de esperar los 3 segundos del productor. Devuelve `True` si le avisan a tiempo.

## 8. ⏱ Deadlock provocado y solución

**Provocación (deadlock):**

```python
import threading, time

lock1 = threading.Lock()
lock2 = threading.Lock()

def hilo_a():
    with lock1:
        time.sleep(0.1)
        with lock2:
            print("A: trabajando")

def hilo_b():
    with lock2:          # ❌ orden invertido
        time.sleep(0.1)
        with lock1:
            print("B: trabajando")

h1 = threading.Thread(target=hilo_a)
h2 = threading.Thread(target=hilo_b)
h1.start(); h2.start()
h1.join(); h2.join()   # se queda colgado
```

**Solución (mismo orden de locks):**

```python
def hilo_b():
    with lock1:          # ✅ mismo orden que A: lock1 → lock2
        time.sleep(0.1)
        with lock2:
            print("B: trabajando")
```

Adquiriendo los locks **siempre en el mismo orden** (`lock1 → lock2`), es imposible que un hilo tenga lock2 esperando lock1 mientras otro tiene lock1 esperando lock2. El programa termina correctamente ([punto 8](/ApuntesPSP/03-sincronizacion-entre-hilos/08-buenas-practicas)).

## 9. 🏗️ Productor-Consumidor múltiple

```python
import threading, time, random, queue

buffer = queue.Queue(maxsize=5)

def productor(id):
    for _ in range(4):
        item = f"p{id}-{random.randint(1, 100)}"
        buffer.put(item)            # thread-safe, no necesita Lock
        print(f"📦 P{id} produjo: {item} (buffer {buffer.qsize()}/5)")
        time.sleep(random.random())

def consumidor(id):
    for _ in range(2):
        item = buffer.get()         # thread-safe
        print(f"  🍽️ C{id} consumió: {item} (buffer {buffer.qsize()}/5)")
        time.sleep(random.random())

hilos = [threading.Thread(target=productor, args=(i,)) for i in range(2)]
hilos += [threading.Thread(target=consumidor, args=(i,)) for i in range(3)]
for h in hilos: h.start()
for h in hilos: h.join()
```

`queue.Queue(maxsize=5)` es **thread-safe**: `put()` y `get()` ya están sincronizadas internamente. Con `maxsize=5`, si el buffer se llena, los productores esperan; si se vacía, los consumidores esperan. Sin locks a mano ([punto 7](/ApuntesPSP/03-sincronizacion-entre-hilos/07-productor-consumidor)).