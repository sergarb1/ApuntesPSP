---
title: Boletín U03 — Inicial (Resuelto)
description: Soluciones de los ejercicios básicos de Sincronización entre Hilos
---

# ✅ Boletín U03 — Inicial (Resuelto)

---

## 1. Lock protege una lista

```python
import threading

lista = []
lock = threading.Lock()

def añadir(letra):
    global lista
    for _ in range(5):
        with lock:
            lista.append(letra)

h1 = threading.Thread(target=añadir, args=("A",))
h2 = threading.Thread(target=añadir, args=("B",))
h1.start()
h2.start()
h1.join()
h2.join()

print(lista)
```

Sin el `Lock`, los `append` se mezclarían (por ejemplo, `AABABB...`). Con `with lock:`, cada añadido es atómico y al final hay **5 A y 5 B** sin mezclas.

## 2. RLock básico

```python
import threading

rlock = threading.RLock()

def función_interna():
    with rlock:
        print("🔹 Función interna: lock adquirido")

def función_externa():
    with rlock:
        print("🔸 Función externa: lock adquirido")
        función_interna()   # mismo hilo → RLock lo permite

función_externa()
```

`función_interna` adquiere el mismo `RLock` que `función_externa` ya tiene puesto. Con un `Lock` normal sería un **deadlock** (el hilo se espera a sí mismo); con `RLock` no hay problema ([punto 3](/ApuntesPSP/03-sincronizacion-entre-hilos/03-rlock)).

## 3. Semáforo con timeout

```python
import threading, time

semaforo = threading.Semaphore(2)

def entrar(id):
    if semaforo.acquire(timeout=1):
        print(f"Hilo-{id}: DENTRO")
        time.sleep(1)
        semaforo.release()
    else:
        print(f"Hilo-{id}: timeout")

hilos = [threading.Thread(target=entrar, args=(i,)) for i in range(4)]
for h in hilos: h.start()
for h in hilos: h.join()
```

Solo 2 hilos entran a la vez; los que no consiguen entrar en 1 segundo muestran **"timeout"** y se van en lugar de esperar eternamente ([punto 4](/ApuntesPSP/03-sincronizacion-entre-hilos/04-semaphore)).

## 4. Carrera sin Lock

```python
import threading
contador = 0
def inc():
    global contador
    for _ in range(1000):
        contador += 1
hilos = [threading.Thread(target=inc) for _ in range(2)]
for h in hilos:
    h.start()
for h in hilos:
    h.join()
print(contador)  # ❌ No será 2000
```

Sin Lock, hay condición de carrera. El valor será **< 2000** y variará en cada ejecución ([punto 1](/ApuntesPSP/03-sincronizacion-entre-hilos/01-condicion-de-carrera)).

## 5. Contador protegido con Lock

```python
import threading
contador = 0
lock = threading.Lock()
def inc():
    global contador
    for _ in range(1000):
        with lock:
            contador += 1
hilos = [threading.Thread(target=inc) for _ in range(2)]
for h in hilos:
    h.start()
for h in hilos:
    h.join()
print(contador)  # ✅ 2000
```

`with lock:` garantiza exclusión mutua: el "leer → sumar → escribir" ocurre de principio a fin sin que se cuele el otro hilo ([punto 2](/ApuntesPSP/03-sincronizacion-entre-hilos/02-lock)).

## 6. Sección crítica con sleep

```python
import threading, time

total = 0
lock = threading.Lock()

def trabajar():
    global total
    for _ in range(20):
        with lock:
            total += 10
        time.sleep(0.1)

hilos = [threading.Thread(target=trabajar) for _ in range(3)]
for h in hilos: h.start()
for h in hilos: h.join()

print(f"Total: {total}")  # ✅ 600 (3 hilos × 20 × 10)
```

El `Lock` protege la sección crítica (`total += 10`); el `sleep` ocurre fuera para no bloquear a los demás.

## 7. Semáforo simple

```python
import threading, time
s = threading.Semaphore(2)
def entrar(id):
    print(f"{id} espera")
    with s:
        print(f"  → {id} dentro")
        time.sleep(1)
    print(f"  ← {id} sale")
hilos = [threading.Thread(target=entrar, args=(i,)) for i in range(4)]
for h in hilos:
    h.start()
for h in hilos:
    h.join()
```

Solo 2 hilos entran a la vez. Los demás esperan hasta que un puesto se libera ([punto 4](/ApuntesPSP/03-sincronizacion-entre-hilos/04-semaphore)).

## 8. Barrera de 3

```python
import threading, time
b = threading.Barrier(3)
def corredor(id):
    time.sleep(id)
    print(f"  {id} preparado")
    b.wait()
    print(f"🏁 {id} salió")
hilos = [threading.Thread(target=corredor, args=(i,)) for i in range(3)]
for h in hilos:
    h.start()
for h in hilos:
    h.join()
```

Todos imprimen "preparado" antes de que nadie "salga": la barrera no deja cruzar hasta que los 3 han llegado ([punto 5](/ApuntesPSP/03-sincronizacion-entre-hilos/05-barrier)).