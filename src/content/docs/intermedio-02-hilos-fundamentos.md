---
title: "📝 INTERMEDIO POR RESOLVER 2 — Hilos Fundamentos"
nav_order: 2
---
### 4. Join con timeout
Crea un hilo que duerma 5 segundos. En el hilo principal, usa `join(timeout=2)` y comprueba con `is_alive()` si el hilo sigue ejecutándose después del timeout.

### 5. Listar hilos activos
Crea 3 hilos que hagan tareas distintas. Usa `threading.enumerate()` para listar todos los hilos activos y muestra sus nombres.

### 6. Identificar el hilo actual
Crea una función que muestre `threading.current_thread().name`, `threading.current_thread().ident` y `threading.current_thread().daemon`. Ejecútala desde el hilo principal y desde un hilo secundario.
