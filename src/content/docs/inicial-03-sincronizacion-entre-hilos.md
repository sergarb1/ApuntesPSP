---
title: "🟢 INICIAL POR RESOLVER 3 — Sincronización entre Hilos"
nav_order: 3
---
### 1. Lock protege una lista
Crea 2 hilos que añadan elementos a una lista compartida. Uno añade "A" 5 veces, el otro "B" 5 veces. Usa un `Lock` para evitar mezclas.

### 2. RLock básico
Crea una función que adquiera un `RLock` dos veces desde el mismo hilo (llamando a otra función que también lo adquiera). Comprueba que no se produce deadlock.

### 3. Semáforo con timeout
Crea un `Semaphore(2)` y lanza 4 hilos que intenten entrar. Cada hilo espera como máximo 1 segundo con `acquire(timeout=1)`. Los que no consigan entrar deben mostrar "timeout".
