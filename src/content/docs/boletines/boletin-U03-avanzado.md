---
title: Boletín U03 — Avanzado
description: Ejercicios avanzados de Sincronización entre Hilos
---

# 💪 Boletín U03 — Avanzado

> Ejercicios que requieren aplicar los conceptos de sincronización de forma más profunda, con programas completos y varios mecanismos a la vez.

---

## 1. Condition con notify_all

Crea 3 hilos consumidores que esperen en una `Condition`. Un hilo productor añade 3 elementos y usa `notify_all()` para despertar a todos los consumidores a la vez.

## 2. Deadlock entre dos hilos

Crea 2 hilos y 2 locks (A y B). El hilo 1 adquiere A luego B. El hilo 2 adquiere B luego A. Añade `time.sleep(0.1)` entre adquisiciones para provocar el deadlock.

## 3. Semáforo con recursos limitados

Simula 3 impresoras compartidas. Crea 6 hilos que necesiten una impresora para imprimir (simulado con sleep). Usa `Semaphore(3)` para que solo 3 impriman a la vez.

## 4. 🎯 Banco con cuentas compartidas

Dos hilos: uno ingresa dinero, otro retira. Usa Lock para evitar saldo negativo.

**Pista:** Usa un Lock global. Cada hilo lo adquiere con `with lock:` antes de modificar el saldo. El hilo retirador debe comprobar `if saldo >= cantidad` antes de restar.

## 5. 🔍 Semáforo con timeout

Crea un semáforo donde los hilos esperen máximo 2s. Si no entran, se van.

**Pista:** `semaforo.acquire(blocking=True, timeout=2)` devuelve `True` si consiguió el recurso, o `False` si pasaron los 2 segundos. Úsalo para decidir si el hilo entra o se rinde.

## 6. 🧩 Barrera con fases múltiples

Crea 3 hilos que trabajen en 3 fases. La fase siguiente no empieza hasta que todos terminan la anterior.

**Pista:** Coloca `barrera.wait()` justo después del trabajo de cada fase. Así ningún hilo avanza a la siguiente fase hasta que todos han llegado al `wait()`.

## 7. 🎭 Condition con timeout

Un productor que produce cada 3s, consumidor que espera máximo 2s. Si no hay producto, se va.

**Pista:** `cond.wait(timeout=2)` devuelve `False` si el tiempo expiró sin ser notificado. Úsalo para que el consumidor salga si el productor tarda demasiado.

## 8. ⏱ Deadlock provocado y solución

Crea un deadlock con 2 hilos y 2 locks. Luego arréglalo adquiriendo los locks en el mismo orden.

**Pista:** El deadlock ocurre cuando el hilo A toma lock1 y espera lock2, mientras B toma lock2 y espera lock1. La solución: ambos hilos adquieren los locks en el mismo orden (lock1 → lock2).

## 9. 🏗️ Productor-Consumidor múltiple

2 productores y 3 consumidores compitiendo por un buffer de tamaño 5.

**Pista:** Usa `queue.Queue(maxsize=5)` como buffer compartido: es thread-safe y no necesita Lock. Los productores llaman a `put()` y los consumidores a `get()`.