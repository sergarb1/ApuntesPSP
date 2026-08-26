---
title: Boletín U11 — Inicial (Resuelto)
description: Soluciones de los ejercicios básicos de asyncio y Disponibilidad
---

# ✅ Boletín U11 — Inicial (Resuelto)

---

## 1. Mensaje diferido

```python
import asyncio

async def preparar():
    print("Preparando...")
    await asyncio.sleep(2)
    print("¡Listo!")

asyncio.run(preparar())
```

`await asyncio.sleep(2)` pausa la corrutina 2 segundos; `asyncio.run()` crea el event loop.

## 2. Saludo y despedida

```python
import asyncio

async def saludar():
    await asyncio.sleep(0.5)
    print("Hola")

async def despedirse():
    await asyncio.sleep(1)
    print("Adiós")

async def main():
    await asyncio.gather(saludar(), despedirse())

asyncio.run(main())
```

`gather` ejecuta ambas "a la vez": el total es ~1s (la más lenta), no 1.5s.

## 3. Temporizador

```python
import asyncio

async def tic():
    for i in range(4):
        print("tic")
        await asyncio.sleep(2)

asyncio.run(tic())
```

4 "tic" espaciados 2 segundos. Un `asyncio.sleep` dentro de un `for`.

## 4. Corrutina que devuelve

```python
import asyncio

async def sumar(a, b):
    await asyncio.sleep(1)
    return a + b

async def main():
    resultado = await sumar(3, 4)
    print(resultado)

asyncio.run(main())
```

Para obtener el valor hace falta `await`: sin él tendrías un objeto corrutina, no el resultado.

## 5. Tres tareas a la vez

```python
import asyncio, time

async def tarea(nombre, segundos):
    await asyncio.sleep(segundos)
    print(f"  {nombre} terminó")

async def main():
    inicio = time.time()
    await asyncio.gather(
        tarea("A", 1), tarea("B", 2), tarea("C", 3)
    )
    print(f"Tiempo total: {time.time() - inicio:.2f}s")

asyncio.run(main())
```

**~3 segundos**, el de la tarea más lenta. `gather` las lanza concurrentemente: los tiempos no se suman.

## 6. Tarea en segundo plano

```python
import asyncio

async def contar():
    for i in range(1, 5):
        print(f"  contar: {i}")
        await asyncio.sleep(0.5)

async def main():
    asyncio.create_task(contar())   # en segundo plano
    await asyncio.sleep(1)
    print("main sigue")

asyncio.run(main())
```

`contar()` se ejecuta "en segundo plano": mientras `main()` espera su segundo, la tarea cuenta. Se ve la alternancia de las dos corrutinas en el event loop.

## 7. Heartbeat básico

```python
import asyncio

async def heartbeat():
    while True:
        print("💓 vivo")
        await asyncio.sleep(2)

async def main():
    asyncio.create_task(heartbeat())
    await asyncio.sleep(5)
    print("main terminó")

asyncio.run(main())
```

`create_task` lanza el latido en segundo plano; `main()` espera 5s y lo deja latir tres veces antes de terminar. Si `main()` no esperara, la tarea moriría con él.

## 8. Timeout básico

```python
import asyncio

async def lenta():
    await asyncio.sleep(8)
    return "Hecho"

async def main():
    try:
        r = await asyncio.wait_for(lenta(), timeout=3)
        print(r)
    except asyncio.TimeoutError:
        print("Timeout!")

asyncio.run(main())
```

`wait_for` corta a los 3s: salta `asyncio.TimeoutError`, la corrutina `lenta()` se cancela y el programa imprime "Timeout!".