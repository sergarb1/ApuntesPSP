---
title: "⭐ AVANZADO 3 — Sincronización entre Hilos"
nav_order: 3
---

## ⭐ AVANZADO 03 — Sincronización entre Hilos

---

### 1. 🎯 Banco con cuentas compartidas

Dos hilos: uno ingresa dinero, otro retira. Usa Lock para evitar saldo negativo.

**Pista**: Usa un Lock global. Cada hilo lo adquiere con `with lock:` antes de modificar el saldo. El hilo retirador debe comprobar `if saldo >= cantidad` antes de restar.

### 2. 🔍 Semáforo con timeout

Crea un semáforo donde los hilos esperen máximo 2s. Si no entran, se van.

**Pista**: `semaforo.acquire(blocking=True, timeout=2)` devuelve `True` si consiguió el recurso, o `False` si pasaron los 2 segundos. Úsalo para decidir si el hilo entra o se rinde.

### 3. 🧩 Barrera con fases múltiples

Crea 3 hilos que trabajen en 3 fases. La fase siguiente no empieza hasta que todos terminan la anterior.

**Pista**: Coloca `barrera.wait()` justo después del trabajo de cada fase. Así ningún hilo avanza a la siguiente fase hasta que todos han llegado al `wait()`.

### 4. 🎭 Condition con timeout

Un productor que produce cada 3s, consumidor que espera máximo 2s. Si no hay producto, se va.

**Pista**: `cond.wait(timeout=2)` devuelve `False` si el tiempo expiró sin ser notificado. Úsalo para que el consumidor salga si el productor tarda demasiado.

### 5. ⏱ Deadlock provocado y solución

Crea un deadlock con 2 hilos y 2 locks. Luego arréglalo adquiriendo los locks en el mismo orden.

**Pista**: El deadlock ocurre cuando el hilo A toma lock1 y espera lock2, mientras B toma lock2 y espera lock1. La solución: ambos hilos adquieren los locks en el mismo orden (lock1 → lock2).

### 6. 🏗️ Productor-Consumidor múltiple

2 productores y 3 consumidores compitiendo por un buffer de tamaño 5.

**Pista**: Usa `queue.Queue(maxsize=5)` como buffer compartido: es thread-safe y no necesita Lock. Los productores llaman a `put()` y los consumidores a `get()`.
