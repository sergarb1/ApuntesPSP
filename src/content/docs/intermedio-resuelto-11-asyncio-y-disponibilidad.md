---
title: "💪 INTERMEDIO RESUELTO 11 — Asyncio y Disponibilidad"
nav_order: 11
---
### 4. Heartbeat simple

```python
import asyncio
async def heartbeat():
    while True:
        print("💓")
        await asyncio.sleep(2)
async def main():
    asyncio.create_task(heartbeat())
    await asyncio.sleep(5)
    print("Main terminó")
asyncio.run(main())
```

`create_task` lanza en segundo plano.

### 5. Timeout con asyncio

```python
import asyncio
async def lento():
    await asyncio.sleep(10)
    return "Listo"
async def main():
    try:
        r = await asyncio.wait_for(lento(), timeout=3)
        print(r)
    except asyncio.TimeoutError:
        print("Timeout!")
asyncio.run(main())
```

`wait_for` lanza `TimeoutError` si la corrutina excede el tiempo.

### 6. Backoff

```python
import asyncio
async def conectar(intentos=3):
    for i in range(intentos):
        espera = 2 ** i
        try:
            print(f"Intento {i+1}, espera {espera}s")
            # await asyncio.open_connection(...)
            raise ConnectionRefusedError  # Simular error
        except ConnectionRefusedError:
            await asyncio.sleep(espera)
    print("No se pudo conectar")
asyncio.run(conectar())
```

Backoff exponencial: 1s, 2s, 4s.
