---
title: Boletín U02 — Avanzado (Resuelto)
description: Soluciones de los ejercicios avanzados de Hilos Fundamentos
---

# 💪 Boletín U02 — Avanzado (Resuelto)

---

## 1. Join con timeout

```python
import threading, time

def lento():
    print("Hilo empezando")
    time.sleep(5)
    print("Hilo terminó")

h = threading.Thread(target=lento)
h.start()
h.join(timeout=2)
print(f"¿Sigue vivo tras el timeout? {h.is_alive()}")
```

Salida:
```
Hilo empezando
¿Sigue vivo tras el timeout? True
Hilo terminó
```

`join(timeout=2)` espera como máximo 2 segundos: al expirar, el hilo **sigue vivo** (duerme hasta los 5s) y el principal continúa. Como es no-daemon, el programa no termina hasta que el hilo acaba su sueño.

## 2. Listar hilos activos

```python
import threading, time

def tarea(n):
    time.sleep(1)
    print(f"{threading.current_thread().name} terminó")

hilos = [threading.Thread(target=tarea, args=(i,), name="hilo-" + str(i))
         for i in range(1, 4)]

for h in hilos:
    h.start()

print("Hilos activos:")
for h in threading.enumerate():
    print(f"  {h.name}")

for h in hilos:
    h.join()
```

`threading.enumerate()` devuelve la lista de todos los hilos vivos, **incluido el principal** (`MainThread`). Justo tras el `start()` de los tres, la lista contiene 4 entradas: `MainThread`, `hilo-1`, `hilo-2` y `hilo-3`.

## 3. Identificar el hilo actual

```python
import threading

def mostrar():
    h = threading.current_thread()
    print(f"name: {h.name} | ident: {h.ident} | daemon: {h.daemon}")

mostrar()  # desde el hilo principal

h = threading.Thread(target=mostrar, name="secundario")
h.start()
h.join()
```

Salida parecida a:
```
name: MainThread | ident: 14600 | daemon: False
name: secundario | ident: 14601 | daemon: False
```

La misma función devuelve datos distintos según quién la ejecute: `current_thread()` es el objeto Thread que está corriendo en ese momento. El `ident` es un número único mientras el hilo vive.

## 4. 🎯 Carrera de mensajes

```python
import threading

def mensaje(nombre):
    for i in range(1, 11):
        print(f"{nombre}: mensaje {i}")

hilos = [threading.Thread(target=mensaje, args=(f"hilo-{n}",))
         for n in range(1, 6)]

for h in hilos:
    h.start()
for h in hilos:
    h.join()
```

Cinco hilos imprimiendo 10 mensajes cada uno: la salida es un caos predecible en el desorden. El orden exacto cambia en cada ejecución porque lo decide el scheduler del sistema operativo. Solo está garantizado que los 50 mensajes salgan (y que el programa espere gracias a los `join()`).

## 5. 🔍 Simular descarga con progreso

```python
import threading, time

def descargar(archivo):
    for porcentaje in range(0, 101, 25):
        print(f"{archivo}: {porcentaje}%")
        time.sleep(0.5)

h = threading.Thread(target=descargar, args=("libro.pdf",))
h.start()
h.join()
```

Salida:
```
libro.pdf: 0%
libro.pdf: 25%
libro.pdf: 50%
libro.pdf: 75%
libro.pdf: 100%
```

El progreso avanza en saltos de 25% (`range(0, 101, 25)`) con medio segundo de espera por paso: una descarga simulada de 2 segundos en total.

## 6. 🧩 Detener hilo con bandera

```python
import threading, time

ejecutando = True

def infinito():
    while ejecutando:
        print("trabajando...")
        time.sleep(0.5)
    print("Hilo detenido por bandera")

h = threading.Thread(target=infinito)
h.start()

input("Pulsa Enter para detener...")
ejecutando = False
h.join()
print("Programa terminado")
```

Los hilos no se matan desde fuera (no hay `hilo.kill()`). La forma correcta es una **variable bandera** que el hilo comprueba en cada vuelta de su bucle: al pulsar Enter, el principal pone `ejecutando = False` y el hilo sale del bucle y termina ordenadamente.

## 7. 🎭 Hilo que devuelve un valor

```python
import threading, time

resultado = []

def calcular():
    time.sleep(1)
    valor = 6 * 7
    resultado.append(valor)

h = threading.Thread(target=calcular)
h.start()
h.join()
print(f"El resultado del hilo es: {resultado[0]}")
```

Salida:
```
El resultado del hilo es: 42
```

Las funciones de los hilos **no tienen `return`**. Para "devolver" un valor se usa una **lista compartida** (la memoria compartida del [punto 1](/ApuntesPSP/02-hilos-fundamentos/01-de-proceso-a-hilo)): el hilo hace `append`, y tras `join()` el principal lee el valor con seguridad, porque ya sabe que el hilo ha terminado.

## 8. ⏱ Timer con repetición

```python
import threading, time

def tic():
    print(f"⏰ {time.strftime('%H:%M:%S')}")
    threading.Timer(2.0, tic).start()   # se reprograma a sí misma

tic()

time.sleep(6)   # el principal deja correr unos cuantos ticks
print("Programa principal terminando...")
```

Salida parecida a:
```
⏰ 14:35:00
⏰ 14:35:02
⏰ 14:35:04
⏰ 14:35:06
Programa principal terminando...
```

El `Timer` normal solo dispara **una vez** ([punto 5](/ApuntesPSP/02-hilos-fundamentos/05-timer)). Para repetirlo, la propia función crea y lanza otro `Timer` al final: recursividad. Así cada tick programa el siguiente. El principal decide cuándo parar: al terminar, el Timer pendiente (daemon por defecto) muere con él.

## 9. 🏗️ Pool de hilos manual

```python
import threading, queue, time

def trabajador():
    while True:
        tarea = cola.get()
        if tarea is None:          # centinela: fin de trabajo
            break
        print(f"{threading.current_thread().name} hace: {tarea}")
        time.sleep(0.5)
        cola.task_done()

cola = queue.Queue()
for t in ["tarea-1", "tarea-2", "tarea-3", "tarea-4"]:
    cola.put(t)

workers = [threading.Thread(target=trabajador, name="worker-" + str(i))
           for i in range(1, 3)]
for w in workers:
    w.start()

cola.join()                 # espera a que las 4 tareas se marquen como hechas
for w in workers:
    cola.put(None)          # enviamos el centinela a cada worker
for w in workers:
    w.join()

print("Todas las tareas terminadas")
```

`queue.Queue` es **thread-safe**: varios hilos pueden hacer `get()` sin corromper la cola. Dos workers compiten por las 4 tareas (las cogen en cuanto están libres, por eso la repartición puede variar). El principal espera con `cola.join()` y, al terminar, envía `None` (centinela) para que cada worker salga del bucle ordenadamente, sin dejar hilos colgados.

## 🎁 Bonus: tres clásicos resueltos

Tres casos que suelen aparecer en exámenes con su solución completa.

**Bonus 1 — join() o no join()**

```python
import threading, time

def lento():
    for i in range(5):
        print(i)
        time.sleep(1)

h = threading.Thread(target=lento)
h.start()
# Sin join() → el programa principal no espera
print("Fin del programa principal")
```

Sin `join()`, el programa principal no espera: su último `print` aparece mientras el hilo sigue contando. El programa en sí no puede terminar hasta que el hilo (no daemon) acabe, pero el orden de salida queda a merced del scheduler.

**Bonus 2 — Hilo daemon**

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

El daemon imprime "tic" cada segundo y se **mata al salir** del programa principal ([punto 4](/ApuntesPSP/02-hilos-fundamentos/04-hilos-daemon)). Si fuera no-daemon con su `while True`, el programa jamás terminaría.

**Bonus 3 — Timer**

```python
import threading

def despierta():
    print("¡Despierta!")

t = threading.Timer(4.0, despierta)
t.start()
```

Timer ejecuta **UNA SOLA vez** después del retardo de 4 segundos ([punto 5](/ApuntesPSP/02-hilos-fundamentos/05-timer)). No se repite; para repetirlo, la función debe reprogramarse (ejercicio 8).