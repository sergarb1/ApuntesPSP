---
title: "📝 INTERMEDIO POR RESOLVER 3 — Sincronización entre Hilos"
nav_order: 3
---
### 4. Condition con notify_all
Crea 3 hilos consumidores que esperen en una `Condition`. Un hilo productor añade 3 elementos y usa `notify_all()` para despertar a todos los consumidores a la vez.

### 5. Deadlock entre dos hilos
Crea 2 hilos y 2 locks (A y B). El hilo 1 adquiere A luego B. El hilo 2 adquiere B luego A. Añade `time.sleep(0.1)` entre adquisiciones para provocar el deadlock.

### 6. Semáforo con recursos limitados
Simula 3 impresoras compartidas. Crea 6 hilos que necesiten una impresora para imprimir (simulado con sleep). Usa `Semaphore(3)` para que solo 3 impriman a la vez.
