---
title: 02 — Corrutinas
description: async def, await y la función que sabe esperar 🌀
---

<p><small>async def, await y la función que sabe esperar 🌀</small></p>

> 🗺️ **Estás en:** ⏱️ **U11 · asyncio y Disponibilidad** → 02 · Corrutinas

---

## 📬 La idea en una frase

> Una **corrutina** es una función declarada con `async def` que puede **pausarse** con `await` y reanudarse después: no es un hilo, es una función que sabe esperar.

---

## 🌀 async def y await

La pieza básica de asyncio:

```python
import asyncio

async def saludar():
    print("Hola")
    await asyncio.sleep(1)  # "Oye, mientras duermo, haz otras cosas"
    print("Mundo")

asyncio.run(saludar())
```

| Concepto | Qué es |
|----------|--------|
| `async def` | Define una **corrutina** (función que puede pausarse) |
| `await` | Pausa la corrutina hasta que algo termine |
| `asyncio.run()` | Crea el event loop y ejecuta la corrutina principal |

> `await = "Oye, esto va a tardar. Mientras, ocúpate de otras cosas."`

Cuando se encuentra `await asyncio.sleep(1)`, la corrutina `saludar()` se pausa y devuelve el control al event loop. Un segundo después, el event loop la reanuda en la siguiente línea (`print("Mundo")`). Ese ir-y-volver es lo que hace que un solo hilo sirva a miles de corrutinas.

---

## 🤔 Corrutina no es una función normal

La diferencia clave con una función normal:

```python
import asyncio

async def tarea():
    return 42

print(tarea())          # ❌ No imprime 42: imprime <coroutine object ...>
```

Llamar a una corrutina **no ejecuta su cuerpo**: crea un objeto corrutina. Solo se ejecuta cuando el event loop la programa, de una de estas formas:

```python
asyncio.run(tarea())          # Desde fuera: arranca el event loop

async def main():
    resultado = await tarea() # Desde dentro: espera y obtiene el resultado
```

| Forma | Cuándo usarla |
|---|---|
| `asyncio.run(c)` | Solo para la corrutina principal, una vez por programa |
| `await c()` | Dentro de otra corrutina: espera su resultado |
| `asyncio.gather(c1, c2)` | Lanza varias a la vez (punto 3) |
| `asyncio.create_task(c)` | Lanza en segundo plano (punto 3) |

---

## 🧠 Mini-chequeo

1. ¿Qué diferencia hay entre `async def f()` y `def f()`?
2. ¿Qué hace `await` con el hilo?
3. Si llamas a `tarea()` (sin `await` ni `run`), ¿qué obtienes?

<details>
<summary>🔄 Respuestas</summary>

1. `async def f()` define una **corrutina**: puede pausarse con `await` y reanudarse. Una función normal se ejecuta de principio a fin sin pausas.
2. **No lo bloquea.** `await` le dice al event loop "ahora no necesito CPU, ocúpate de otras corrutinas". Es **cooperativo**.
3. Un **objeto corrutina**, no un resultado. Para ejecutarlo hace falta que el event loop lo programe (`asyncio.run`, `await`, `gather` o `create_task`).

</details>

---

## ✅ Resumen en 3 frases

- Una corrutina es una **función que puede pausarse** (`async def` + `await`).
- `await` no bloquea el hilo: cede el control al event loop.
- Para ejecutar una corrutina hace falta `asyncio.run()` o programarla dentro de otra corrutina.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| Corrutina | Función `async def` que puede pausarse y reanudarse |
| await | Pausa la corrutina y devuelve el control al event loop |
| asyncio.run() | Arranca el event loop y ejecuta la corrutina principal |
| Objeto corrutina | El resultado de llamar a una `async def` sin ejecutarla |
| Cooperativo | Las tareas se ceden el control voluntariamente en cada await |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/11-asyncio-y-disponibilidad) · **Anterior:** [01 · Event Loop](/ApuntesPSP/11-asyncio-y-disponibilidad/01-event-loop) · **Siguiente:** [03 · create_task y gather](/ApuntesPSP/11-asyncio-y-disponibilidad/03-create-task-y-gather)