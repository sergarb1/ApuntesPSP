---
title: "📝 INTERMEDIO POR RESOLVER 11 — Asyncio y Disponibilidad"
nav_order: 11
---
### 4. Backoff exponencial
Crea una función asíncrona `conectar()` que intente conectarse 4 veces con backoff (1s, 2s, 4s, 8s). Simula el fallo lanzando `ConnectionRefusedError`. Si falla, imprime "Servicio no disponible".

### 5. Timeout con respaldo
Crea una corrutina `lenta()` que tarde 8 segundos. Usa `asyncio.wait_for` con timeout de 5s. Si salta `TimeoutError`, ejecuta una corrutina de respaldo que devuelva "Resultado en caché".

### 6. Dos heartbeats
Crea dos corrutinas heartbeat: `hb_a()` imprime "💓 A" cada 3s, `hb_b()` imprime "💓 B" cada 5s. La función main las lanza con `asyncio.create_task` y espera 12 segundos.
