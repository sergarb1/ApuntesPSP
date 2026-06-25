---
title: "✅ INICIAL RESUELTO 3 — Sincronización entre Hilos"
nav_order: 3
---
### 1. Carrera sin Lock

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

Sin Lock, hay condición de carrera. El valor será < 2000.

### 2. Carrera con Lock

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

`with lock:` garantiza exclusión mutua.

### 3. Semáforo simple

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

Solo 2 hilos entran a la vez. Los demás esperan.
