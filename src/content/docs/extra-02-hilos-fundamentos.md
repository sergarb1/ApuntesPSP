---
title: "⭐ AVANZADO 2 — Hilos Fundamentos"
nav_order: 2
---

## ⭐ AVANZADO 02 — Hilos Fundamentos

---

### 1. 🎯 Carrera de mensajes

Crea 5 hilos, cada uno imprime su nombre 10 veces. Observa el orden impredecible.

**Pista**: Usa una lista por comprensión para crear los 5 hilos. Lanza todos con un bucle `for h in hilos: h.start()` y espera con `for h in hilos: h.join()`. El orden de salida cambiará en cada ejecución.

### 2. 🔍 Simular descarga con progreso

Crea un hilo que descargue (simulado con sleep) y muestre progreso cada 25%.

**Pista**: Dentro de la función, itera con `range(0, 101, 25)`, usa `time.sleep(0.5)` para simular el tiempo de descarga e imprime el porcentaje en cada paso.

### 3. 🧩 Detener hilo con bandera

Crea un hilo infinito que se detenga cuando pulses Enter.

**Pista**: Declara una variable booleana global `ejecutando = True`. El hilo comprueba la variable en un `while ejecutando:`. Desde el principal, usa `input()` para esperar Enter y luego cambia `ejecutando = False`.

### 4. 🎭 Hilo que devuelve un valor

Usa una variable compartida para que un hilo devuelva un resultado al principal.

**Pista**: Los hilos no tienen `return`. Usa una lista compartida como contenedor: el hilo guarda el resultado con `lista.append(valor)` y el principal lo lee tras `hilo.join()`.

### 5. ⏱ Timer con repetición

El Timer normal solo se dispara una vez. Crea un timer que se repita cada 2 segundos usando recursividad.

**Pista**: Dentro de la función que ejecuta el Timer, crea otro `threading.Timer(2.0, funcion).start()` al final. Así la función se programa a sí misma de nuevo.

### 6. 🏗️ Pool de hilos manual

Crea un "pool" manual con una cola de tareas. 2 hilos cogen tareas de la cola y las ejecutan.

**Pista**: Usa `queue.Queue` (thread-safe) para las tareas. Los trabajadores ejecutan un bucle llamando a `cola.get()`. Al terminar cada tarea llaman a `cola.task_done()`. El principal espera con `cola.join()`. Crea los workers como `daemon=True` para que no bloqueen la salida, o usa un valor centinela (`None`) en la cola para que terminen ordenadamente.
