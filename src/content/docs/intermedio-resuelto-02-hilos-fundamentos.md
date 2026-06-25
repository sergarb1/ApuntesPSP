---
title: "💪 INTERMEDIO RESUELTO 2 — Hilos Fundamentos"
nav_order: 2
---
### 4. join() o no join()

```python
import threading, time
def lento():
    for i in range(5):
        print(i)
        time.sleep(1)
h = threading.Thread(target=lento)
h.start()
# Sin join() → el programa principal termina antes
print("Fin del programa principal")
```

Sin `join()`, el programa principal no espera.

### 5. Hilo daemon

```python
import threading, time
def tic():
    while True:
        print("tic")
        time.sleep(1)
h = threading.Thread(target=tic, daemon=True)
h.start()
time.sleep(3)
print("Programa termina — el daemon muere")
```

El daemon se mata al salir del programa principal.

### 6. Timer

```python
import threading
def despierta():
    print("¡Despierta!")
t = threading.Timer(4.0, despierta)
t.start()
```

Timer ejecuta UNA SOLA vez después del retardo.
