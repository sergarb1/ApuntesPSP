---
title: "✅ INICIAL RESUELTO 11 — Asyncio y Disponibilidad"
nav_order: 11
---
### 1. Corrutina básica

```python
import asyncio
async def hola():
    print("Hola")
    await asyncio.sleep(1)
    print("Mundo")
asyncio.run(hola())
```

`await` cede el control. `asyncio.run()` crea el event loop.

### 2. Dos corrutinas

```python
import asyncio
async def tarea(n, s):
    await asyncio.sleep(s)
    print(f"Tarea {n} terminó")
async def main():
    await asyncio.gather(tarea(1, 1), tarea(2, 2))
asyncio.run(main())
```

`gather` ejecuta ambas "a la vez". Terminan en ~2s total.

### 3. asyncio.sleep

```python
import asyncio
async def contar():
    for i in range(1, 4):
        print(i)
        await asyncio.sleep(1)
asyncio.run(contar())
```
