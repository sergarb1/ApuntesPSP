---
title: "✅ INICIAL RESUELTO 2 — Hilos Fundamentos"
nav_order: 2
---
### 1. Hilo que saluda

```python
import threading
def saludar():
    print("Hola desde un hilo")
h = threading.Thread(target=saludar)
h.start()
h.join()
```

Nunca olvides `start()` para lanzar y `join()` para esperar.

### 2. Dos hilos

```python
import threading
def hilo_a():
    for _ in range(3):
        print("Hilo A")
def hilo_b():
    for _ in range(3):
        print("Hilo B")
h1 = threading.Thread(target=hilo_a)
h2 = threading.Thread(target=hilo_b)
h1.start()
h2.start()
h1.join()
h2.join()
```

Los prints se entremezclarán. El orden no está garantizado.

### 3. Hilo con nombre

```python
import threading
def mostrar():
    print(f"Soy {threading.current_thread().name}")
h = threading.Thread(target=mostrar, name="MiHilo")
h.start()
h.join()
```

`current_thread().name` funciona desde dentro del hilo.
