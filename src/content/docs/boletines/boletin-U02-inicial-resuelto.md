---
title: Boletín U02 — Inicial (Resuelto)
description: Soluciones de los ejercicios básicos de Hilos Fundamentos
---

# ✅ Boletín U02 — Inicial (Resuelto)

---

## 1. Hilo que cuenta

```python
import threading

def contar():
    for i in range(1, 6):
        print(i)

h = threading.Thread(target=contar)
h.start()
h.join()
```

Salida: `1 2 3 4 5`. La función cuenta del 1 al 5, se lanza con `start()` y se espera con `join()`.

## 2. Múltiples hilos con retardo

```python
import threading, time

def numero(n):
    print(f"Hilo {n} empieza")
    time.sleep(1)
    print(f"Hilo {n} termina")

hilos = [threading.Thread(target=numero, args=(i,)) for i in range(1, 4)]
for h in hilos:
    h.start()
for h in hilos:
    h.join()
```

Los tres hilos se lanzan a la vez y duermen su segundo **en paralelo**: todo el lote acaba en ~1 segundo, no en 3. Los mensajes se entremezclan sin orden garantizado.

## 3. Hilo con argumento

```python
import threading

def saludar(nombre):
    print(f"Hola, {nombre}")

h = threading.Thread(target=saludar, args=("Ana",))
h.start()
h.join()
```

Salida: `Hola, Ana`. La coma final de `("Ana",)` convierte el valor en una tupla de un elemento, que es lo que espera `args=`.

## 4. Hilo que saluda

```python
import threading

def saludar():
    print("Hola desde un hilo")

h = threading.Thread(target=saludar)
h.start()
h.join()
```

Nunca olvides `start()` para lanzar y `join()` para esperar.

## 5. Dos hilos en paralelo

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

## 6. Hilo con nombre

```python
import threading

def mostrar():
    print(f"Soy {threading.current_thread().name}")

h = threading.Thread(target=mostrar, name="MiHilo")
h.start()
h.join()
```

`current_thread().name` funciona desde dentro del hilo.

## 7. Esperando con join()

```python
import threading, time

def tarea():
    print("Empezando")
    time.sleep(3)
    print("Terminado")

h = threading.Thread(target=tarea)
h.start()
h.join()
print("El programa terminó")
```

Salida:
```
Empezando
Terminado
El programa terminó
```

Sin `join()`, el "El programa terminó" podría salir antes que "Terminado" (o incluso antes que "Empezando", según el scheduler). Con `join()`, el orden es garantizado.

## 8. Varios hilos con nombre y argumentos

```python
import threading

def trabajar(n):
    print(f"hilo-{n} trabajando")

hilos = [threading.Thread(target=trabajar, args=(n,), name="hilo-" + str(n))
         for n in range(1, 4)]

for h in hilos:
    h.start()
for h in hilos:
    h.join()
```

Cada hilo lleva su nombre (`hilo-1`, `hilo-2`, `hilo-3`) y recibe su número como argumento. Los mensajes se entremezclan, pero el orden de lanzamiento y espera es correcto gracias a los dos bucles.