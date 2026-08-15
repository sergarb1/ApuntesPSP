---
title: 01 — Event Loop
description: El gestor de tareas que no se bloquea nunca ⚙️
---

<p><small>El gestor de tareas que no se bloquea nunca ⚙️</small></p>

> 🗺️ **Estás en:** ⏱️ **U11 · asyncio y Disponibilidad** → 01 · Event Loop

---

## 📬 La idea en una frase

> El **event loop** es el gestor de asyncio: un bucle que decide qué tarea se ejecuta en cada momento. Cuando una corrutina espera, la pausa y ejecuta otra. Un solo hilo, miles de tareas, ninguna espera activa.

Viene directo del problema que dejaste en la [U10 · Servidores Concurrentes](/ApuntesPSP/10-servidores-concurrentes): un servidor que usa `accept()` y `recv()` se **bloquea** mientras espera. La solución de la U10 fueron los hilos. La de hoy es distinta: **un solo hilo que cambia de tarea cuando una espera**.

---

## 🚫 El problema de esperar

```python
# ❌ Esto bloquea TODO el programa
datos = conn.recv(1024)  # El programa se para aquí hasta que lleguen datos
```

Si el código se queda en esa línea, no puede atender a nadie más. El bloqueo es el enemigo. Y las respuestas posibles son dos:

**Solución 1**: Hilos (TEMA 10) — caros si hay muchos clientes: cada hilo consume memoria y contexto del sistema operativo.

**Solución 2**: Asyncio — un solo hilo, pero cambia de tarea cuando una espera. Ningún `recv()` bloqueante, ningún `sleep()` que pare todo.

---

## ☕ La analogía de la cafetería

Imagina a un único camarero en una cafetería con 10 mesas:

| Modelo | El camarero | Problema |
|---|---|---|
| Secuencial | Atiende la mesa 1 hasta el final, luego la 2… | Las mesas 2-10 esperan |
| Hilos | Contrata 10 camareros, uno por mesa | Caro con 10.000 mesas |
| **Event loop** | Anota el pedido de la 1, pasa a la 2 mientras la cafetera trabaja… | Ninguno: nadie espera de brazos cruzados |

El camarero del event loop **nunca se queda mirando la cafetera**: cada espera es una oportunidad para atender a otra mesa. Eso es lo que hace asyncio: "esperar" nunca significa quedarse quieto.

---

## ⚙️ Qué es el event loop, de verdad

El **event loop** es un bucle que mantiene una lista de tareas listas para ejecutarse. En cada vuelta:

1. Ejecuta la tarea que toca, hasta que encuentra un `await` (una espera).
2. Cuando la tarea espera, la aparca y sigue con la siguiente.
3. Cuando la espera termina (llegan datos, pasa el tiempo), la tarea vuelve a la cola de listas.

```python
import asyncio

async def tarea(nombre, segundos):
    print(f"  {nombre} empieza")
    await asyncio.sleep(segundos)
    print(f"  {nombre} termina ({segundos}s)")

async def main():
    # Lanzar 3 tareas "a la vez"
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

> Las 3 empiezan a la vez. B termina primero (solo 1s). El event loop aprovecha los `await` de otras para avanzar.

El event loop también gestiona timers, sockets, procesos y cualquier I/O: cada `await` le dice "esto va a tardar, ocúpate de otras cosas".

---

## 🧠 Mini-chequeo

1. ¿Por qué `conn.recv(1024)` bloquea todo el programa en un servidor síncrono?
2. ¿Cuántos hilos usa asyncio?
3. En la analogía de la cafetería, ¿qué representa la cafetera que trabaja sola?

<details>
<summary>🔄 Respuestas</summary>

1. Porque el hilo que ejecuta esa línea **se queda parado** esperando datos: mientras tanto no puede atender a nadie (el problema del servidor secuencial de la [U10](/ApuntesPSP/10-servidores-concurrentes)).
2. **Uno solo.** El event loop coordina todas las corrutinas en un único hilo.
3. La **operación de I/O asíncrona** (un `await asyncio.sleep(...)` o un `recv()`): la cafetera hace su trabajo mientras el camarero atiende a otras mesas.

</details>

---

## ✅ Resumen en 3 frases

- `recv()`, `accept()` y `sleep()` síncronos **bloquean** el hilo y paralizan todo lo demás.
- El **event loop** es un solo hilo que coordina miles de tareas, pausando las que esperan y ejecutando las que están listas.
- Cada `await` es una oportunidad para atender a otra tarea: nadie se queda mirando la olla.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| Event loop | El gestor que decide qué tarea asíncrona se ejecuta |
| Bloqueo | Cuando el hilo espera sin hacer nada (recv, sleep) |
| Corrutina | Función asíncrona que puede pausarse (punto 2) |
| asyncio.run() | Arranca el event loop y ejecuta la corrutina principal |
| await | La marca de "esto va a tardar, ocúpate de otras cosas" |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/11-asyncio-y-disponibilidad) · **Siguiente:** [02 · Corrutinas](/ApuntesPSP/11-asyncio-y-disponibilidad/02-corrutinas)