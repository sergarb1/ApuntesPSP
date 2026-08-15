---
title: 03 — create_task y gather
description: Lanzar varias tareas "a la vez" de verdad 🚀
---

<p><small>Lanzar varias tareas "a la vez" de verdad 🚀</small></p>

> 🗺️ **Estás en:** ⏱️ **U11 · asyncio y Disponibilidad** → 03 · create_task y gather

---

## 📬 La idea en una frase

> `asyncio.gather` lanza varias corrutinas a la vez y espera a todas; `asyncio.create_task` lanza una corrutina **en segundo plano** para que la principal siga su camino. Así se consigue la **concurrencia real** de asyncio.

---

## 🚀 asyncio.gather: todas a la vez

Del [punto 1](/ApuntesPSP/11-asyncio-y-disponibilidad/01-event-loop):

```python
import asyncio

async def tarea(nombre, segundos):
    print(f"  {nombre} empieza")
    await asyncio.sleep(segundos)
    print(f"  {nombre} termina ({segundos}s)")

async def main():
    await asyncio.gather(
        tarea("A", 3),
        tarea("B", 1),
        tarea("C", 2)
    )

asyncio.run(main())
```

**Salida**:

```
  A empieza
  B empieza
  C empieza
  B termina (1s)
  C termina (2s)
  A termina (3s)
```

`gather` espera a **todas** las corrutinas: el `main()` no termina hasta que A, B y C lo hacen. El tiempo total es el de la más lenta (3s), no la suma (6s).

> Si en lugar de `gather` hicieras `await tarea("A", 3)` → `await tarea("B", 1)` → `await tarea("C", 2)`, serían 3 + 1 + 2 = **6 segundos**. La concurrencia de `gather` es lo que lo reduce a 3.

---

## 🎯 asyncio.create_task: en segundo plano

A veces no quieres esperar: lanzas una tarea y sigues con lo tuyo.

```python
import asyncio

async def heartbeat():
    while True:
        print("💓 latido")
        await asyncio.sleep(2)

async def main():
    asyncio.create_task(heartbeat())   # 🎯 en segundo plano, no la espero
    for i in range(3):
        print(f"main trabajando {i}")
        await asyncio.sleep(1)
    print("main termina")

asyncio.run(main())
```

| | `gather` | `create_task` |
|---|---|---|
| Espera | Espera a todas | No espera (segundo plano) |
| Cuándo usarla | Quieres el resultado de todas | Tareas de fondo: heartbeat, timers, monitorización |
| Captura | Se puede `await` el resultado | Hay que guardar la referencia para no perderla |

> ⚠️ **Truco del maestro:** si creas una tarea con `create_task`, el `main()` termina y **se lleva la tarea consigo**. Para que una tarea de fondo sobreviva, `main()` debe esperar (un `await asyncio.sleep(...)` o `await tarea`) — lo verás en el [punto 5](/ApuntesPSP/11-asyncio-y-disponibilidad/05-heartbeat).

---

## 🧠 Mini-chequeo

1. ¿Cuánto tarda `gather` con tareas de 1, 2 y 3 segundos?
2. ¿Qué hace `create_task` con la corrutina?
3. ¿Qué pasa si `main()` termina y deja tareas creadas con `create_task`?

<details>
<summary>🔄 Respuestas</summary>

1. **3 segundos**: el de la más lenta. `gather` las ejecuta concurrentemente, no en serie.
2. La **programa en el event loop** y devuelve un `Task`: la corrutina empieza a ejecutarse "en segundo plano" mientras la principal continúa.
3. El event loop cierra y las tareas **se cancelan** sin terminar. Hay que darles tiempo (un `await`) para que completen.

</details>

---

## ✅ Resumen en 3 frases

- `asyncio.gather` lanza varias corrutinas a la vez y **espera a todas**.
- `asyncio.create_task` lanza una corrutina **en segundo plano** sin bloquear a la principal.
- La concurrencia de asyncio reduce el tiempo total al de la tarea más lenta, no a la suma.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| gather | Lanza corrutinas a la vez y espera a todas |
| create_task | Lanza una corrutina en segundo plano |
| Task | La corrutina ya programada en el event loop |
| Concurrencia | Varias tareas avanzan en el mismo hilo, alternándose |
| Segundo plano | La tarea corre mientras la principal sigue su camino |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/11-asyncio-y-disponibilidad) · **Anterior:** [02 · Corrutinas](/ApuntesPSP/11-asyncio-y-disponibilidad/02-corrutinas) · **Siguiente:** [04 · Timeouts](/ApuntesPSP/11-asyncio-y-disponibilidad/04-timeouts)