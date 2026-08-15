---
title: Boletín U02 — Inicial
description: Ejercicios básicos de Hilos Fundamentos
---

# 📝 Boletín U02 — Inicial

> Ejercicios básicos para afianzar los conceptos de hilos de la unidad U02: crear, lanzar, esperar, pasar argumentos y nombrar hilos.

---

## 1. Hilo que cuenta

Crea un hilo que ejecute una función que cuente del 1 al 5 imprimiendo cada número. Lánzalo con `start()` y espera con `join()`.

## 2. Múltiples hilos con retardo

Crea 3 hilos que impriman su número (1, 2, 3) y luego duerman 1 segundo con `time.sleep(1)`. Lánzalos todos y espera a que terminen.

## 3. Hilo con argumento

Crea una función que reciba un nombre como argumento e imprima "Hola, {nombre}". Lanza un hilo pasándole el argumento con `args=("Ana",)`.

**Pista:** recuerda la coma final de la tupla: `args=("Ana",)`. Sin la coma, `("Ana")` es solo un string y la función recibe un argumento de más.

## 4. Hilo que saluda

Crea un hilo que ejecute una función que imprima "Hola desde un hilo". Usa `threading.Thread`, `start()` y `join()`.

## 5. Dos hilos en paralelo

Crea dos funciones `hilo_a()` y `hilo_b()`, cada una con un bucle que imprima su nombre 3 veces. Lanza los dos hilos y observa cómo se entremezclan los mensajes.

## 6. Hilo con nombre

Crea una función que imprima `f"Soy {threading.current_thread().name}"`. Lánzala en un hilo con `name="MiHilo"`.

## 7. Esperando con join()

Crea un hilo que imprima "Empezando", duerma 3 segundos y termine imprimiendo "Terminado". En el programa principal, después de `start()`, espera con `join()` y luego imprime "El programa terminó". Comprueba el orden de las tres salidas.

## 8. Varios hilos con nombre y argumentos

Crea 3 hilos en un bucle, cada uno con `name = "hilo-" + str(n)` y que reciba su número como argumento para imprimir `"hilo-N trabajando"`. Lanza todos y espera a todos.

**Pista:** usa una lista por comprensión para crear los 3 hilos y luego dos bucles: `for h in hilos: h.start()` y `for h in hilos: h.join()`.