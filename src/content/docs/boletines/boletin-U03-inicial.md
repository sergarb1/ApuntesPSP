---
title: Boletín U03 — Inicial
description: Ejercicios básicos de Sincronización entre Hilos
---

# 📝 Boletín U03 — Inicial

> Ejercicios básicos para afianzar los conceptos de sincronización: condición de carrera, Lock, RLock, semáforo y barrera.

---

## 1. Lock protege una lista

Crea 2 hilos que añadan elementos a una lista compartida. Uno añade "A" 5 veces, el otro "B" 5 veces. Usa un `Lock` para evitar mezclas.

## 2. RLock básico

Crea una función que adquiera un `RLock` dos veces desde el mismo hilo (llamando a otra función que también lo adquiera). Comprueba que no se produce deadlock.

## 3. Semáforo con timeout

Crea un `Semaphore(2)` y lanza 4 hilos que intenten entrar. Cada hilo espera como máximo 1 segundo con `acquire(timeout=1)`. Los que no consigan entrar deben mostrar "timeout".

**Pista:** `acquire(timeout=1)` devuelve `True` si consiguió el recurso y `False` si pasó el segundo. Usa ese `True`/`False` para decidir si el hilo entra o muestra "timeout".

## 4. Carrera sin Lock

Crea 2 hilos que incrementen un contador compartido 1000 veces cada uno **sin** usar Lock. Ejecuta el programa varias veces y anota los resultados.

**Pista:** el contador casi nunca será 2000: esa es la condición de carrera. `contador += 1` no es atómico (leer → sumar → escribir).

## 5. Contador protegido con Lock

Repite el ejercicio 4 pero protege el incremento con `lock = threading.Lock()` y `with lock:`. ¿Qué valor obtienes ahora?

## 6. Sección crítica con sleep

Crea una variable compartida `total = 0` y 3 hilos que hagan `total += 10` y luego `time.sleep(0.1)` repetido 20 veces. Protege la sección con un `Lock` y comprueba que al final `total` vale 600.

## 7. Semáforo simple

Crea un `Semaphore(2)` y lanza 4 hilos que simulen entrar en un recurso (imprime "entra", duerme 1 segundo, imprime "sale"). Comprueba que solo 2 hilos están dentro a la vez.

## 8. Barrera de 3

Crea 3 hilos que simulen corredores: cada uno se prepara (duerme un tiempo distinto) y después espera en una `Barrier(3)`. Imprime "🏁 salió" cuando cruzan. Comprueba que los 3 salen a la vez.