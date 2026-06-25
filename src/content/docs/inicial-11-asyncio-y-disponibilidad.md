---
title: "🟢 INICIAL POR RESOLVER 11 — Asyncio y Disponibilidad"
nav_order: 11
---
### 1. Mensaje diferido
Crea una corrutina `async def preparar()` que imprima "Preparando...", espere 2 segundos con `await asyncio.sleep(2)`, e imprima "¡Listo!". Ejecútala con `asyncio.run()`.

### 2. Saludo y despedida
Crea dos corrutinas: `saludar()` (espera 0.5s y dice "Hola") y `despedirse()` (espera 1s y dice "Adiós"). Ejecuta ambas con `asyncio.gather`.

### 3. Temporizador
Crea una corrutina que imprima "tic" cada 2 segundos, 4 veces. Usa `asyncio.sleep(2)` dentro de un bucle `for`.
