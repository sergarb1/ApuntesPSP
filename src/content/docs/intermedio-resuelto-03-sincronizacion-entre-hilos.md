---
title: "💪 INTERMEDIO RESUELTO 3 — Sincronización entre Hilos"
nav_order: 3
---
### 4. Barrera de 3

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

Todos imprimen "preparado" antes de que nadie "salga".

### 5. Productor-Consumidor básico

```python
import threading, time, random
cola = []
c = threading.Condition()
def productor():
    for _ in range(3):
        with c:
            cola.append(random.randint(1,10))
            print(f"Produjo {cola[-1]}")
            c.notify()
        time.sleep(1)
def consumidor():
    for _ in range(3):
        with c:
            while not cola: c.wait()
            print(f"  Consumió {cola.pop(0)}")
threading.Thread(target=productor).start()
threading.Thread(target=consumidor).start()
```

`wait()` espera hasta que `notify()` lo despierte.

### 6. RLock o Lock

```python
import threading
lock = threading.Lock()
lock.acquire()
# lock.acquire()  # ❌ DEADLOCK — el hilo se espera a sí mismo

rlock = threading.RLock()
rlock.acquire()  # ✅ ok
rlock.acquire()  # ✅ ok (mismo hilo)
rlock.release()
rlock.release()
```

RLock permite al mismo hilo adquirirlo varias veces.
