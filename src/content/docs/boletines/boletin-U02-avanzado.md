---
title: Boletín U02 — Avanzado
description: Ejercicios avanzados de Hilos Fundamentos
---

# 💪 Boletín U02 — Avanzado

> Ejercicios que requieren aplicar los conceptos de hilos de la unidad U02 de forma más profunda: esperas con timeout, introspección, banderas de parada y timers que se repiten.

---

## 1. Join con timeout

Crea un hilo que duerma 5 segundos. En el hilo principal, usa `join(timeout=2)` y comprueba con `is_alive()` si el hilo sigue ejecutándose después del timeout.

**Pista:** `h.join(2)` devuelve `None` cuando termina a tiempo y también cuando expira. Para saber si sigue vivo después del timeout, pregunta con `h.is_alive()` justo después del `join`.

## 2. Listar hilos activos

Crea 3 hilos que hagan tareas distintas. Usa `threading.enumerate()` para listar todos los hilos activos y muestra sus nombres.

**Pista:** `threading.enumerate()` devuelve una lista de objetos Thread. Itera sobre ella y muestra `.name`. Recuerda que el hilo principal (main) también aparece en la lista.

## 3. Identificar el hilo actual

Crea una función que muestre `threading.current_thread().name`, `threading.current_thread().ident` y `threading.current_thread().daemon`. Ejecútala desde el hilo principal y desde un hilo secundario.

**Pista:** para ejecutar la función desde ambos sitios, llámala directamente en el principal y también como `target` de un `threading.Thread`.

## 4. 🎯 Carrera de mensajes

Crea 5 hilos, cada uno imprime su nombre 10 veces. Observa el orden impredecible.

**Pista:** usa una lista por comprensión para crear los 5 hilos. Lanza todos con un bucle `for h in hilos: h.start()` y espera con `for h in hilos: h.join()`. El orden de salida cambiará en cada ejecución.

## 5. 🔍 Simular descarga con progreso

Crea un hilo que descargue (simulado con sleep) y muestre progreso cada 25%.

**Pista:** dentro de la función, itera con `range(0, 101, 25)`, usa `time.sleep(0.5)` para simular el tiempo de descarga e imprime el porcentaje en cada paso.

## 6. 🧩 Detener hilo con bandera

Crea un hilo infinito que se detenga cuando pulses Enter.

**Pista:** declara una variable booleana global `ejecutando = True`. El hilo comprueba la variable en un `while ejecutando:`. Desde el principal, usa `input()` para esperar Enter y luego cambia `ejecutando = False`.

## 7. 🎭 Hilo que devuelve un valor

Usa una variable compartida para que un hilo devuelva un resultado al principal.

**Pista:** los hilos no tienen `return`. Usa una lista compartida como contenedor: el hilo guarda el resultado con `lista.append(valor)` y el principal lo lee tras `hilo.join()`.

## 8. ⏱ Timer con repetición

El Timer normal solo se dispara una vez. Crea un timer que se repita cada 2 segundos usando recursividad.

**Pista:** dentro de la función que ejecuta el Timer, crea otro `threading.Timer(2.0, funcion).start()` al final. Así la función se programa a sí misma de nuevo.

## 9. 🏗️ Pool de hilos manual

Crea un "pool" manual con una cola de tareas. 2 hilos cogen tareas de la cola y las ejecutan.

**Pista:** usa `queue.Queue` (thread-safe) para las tareas. Los trabajadores ejecutan un bucle llamando a `cola.get()`. Al terminar cada tarea llaman a `cola.task_done()`. El principal espera con `cola.join()`. Crea los workers como `daemon=True` para que no bloqueen la salida, o usa un valor centinela (`None`) en la cola para que terminen ordenadamente.