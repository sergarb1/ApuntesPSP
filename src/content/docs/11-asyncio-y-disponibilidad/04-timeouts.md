---
title: 04 — Timeouts
description: wait_for para que nada se cuelgue para siempre ⏰
---

<p><small>wait_for para que nada se cuelgue para siempre ⏰</small></p>

> 🗺️ **Estás en:** ⏱️ **U11 · asyncio y Disponibilidad** → 04 · Timeouts

---

## 📬 La idea en una frase

> Un **timeout** es un tope de tiempo: si una operación tarda más de lo previsto, `asyncio.wait_for` lanza `asyncio.TimeoutError` y el servicio sigue vivo. Nada se cuelga para siempre.

---

## ⏰ El problema del cuelgue

Un `reader.read(1024)` espera datos... ¿y si el cliente nunca los envía? La corrutina quedaría esperando para siempre, ocupando su tarea sin hacer nada. En un servidor, un puñado de clientes mudos llena el servicio de corrutinas zombie.

`asyncio.wait_for` pone un límite:

```python
import asyncio

async def atender_con_timeout(reader, writer):
    try:
        # Esperar datos con timeout de 10 segundos
        datos = await asyncio.wait_for(reader.read(1024), timeout=10)
        writer.write(b"OK: " + datos)
        await writer.drain()
    except asyncio.TimeoutError:
        writer.write(b"⏱ Timeout: conexión cerrada por inactividad\n")
        await writer.drain()
    finally:
        writer.close()
        await writer.wait_closed()
```

Con `timeout=10`, un cliente mudo recibe el aviso y la conexión se cierra a los 10 segundos. **El servidor no se queda colgado con él** y la corrutina libera los recursos.

---

## ⏱ wait_for con respaldo

El patrón del "fallback": si la tarea tarda demasiado, usas un plan B.

```python
import asyncio

async def lenta():
    await asyncio.sleep(8)
    return "Resultado lento"

async def respaldo():
    return "Resultado en caché"

async def main():
    try:
        r = await asyncio.wait_for(lenta(), timeout=5)
        print(r)
    except asyncio.TimeoutError:
        print(await respaldo())

asyncio.run(main())
```

Salida: `Resultado en caché` — la tarea lenta no llegó en 5 segundos y el respaldo tomó el relevo. Es la semilla del mecanismo de disponibilidad que montarás en el [punto 8](/ApuntesPSP/11-asyncio-y-disponibilidad/08-disponibilidad-y-practica).

> 💡 El timeout también se combina con el [backoff](/ApuntesPSP/11-asyncio-y-disponibilidad/06-backoff): en cada intento de conexión, `wait_for` corta la espera y el backoff decide cuánto esperar antes del siguiente.

---

## 🧠 Mini-chequeo

1. ¿Qué excepción lanza `wait_for` cuando se supera el tiempo?
2. ¿Qué pasa con la corrutina "lenta" tras el timeout?
3. ¿Por qué un timeout es esencial en un servidor de producción?

<details>
<summary>🔄 Respuestas</summary>

1. **`asyncio.TimeoutError`** (en Python 3.11+ también se puede capturar como `TimeoutError`).
2. `wait_for` **cancela** la corrutina que tardaba: se interrumpe y libera los recursos.
3. Porque un cliente (o un servicio) que nunca responde no debe **ocupar una tarea para siempre**: con timeout, el servidor lo corta y sigue atendiendo a los demás.

</details>

---

## ✅ Resumen en 3 frases

- `asyncio.wait_for(corrutina, timeout=N)` corta una operación que se pasa de N segundos.
- Al saltar `asyncio.TimeoutError` puedes **responder con un plan B** (respaldo, aviso, cierre).
- Los timeouts son el primer mecanismo de **disponibilidad**: un servicio que no se cuelga está disponible.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| Timeout | Tope de tiempo para una operación |
| wait_for | Función que aplica el tope y lanza TimeoutError |
| TimeoutError | Excepción que indica que se superó el tiempo |
| Respaldo (fallback) | La alternativa que se ejecuta ante el timeout |
| Cancelar | Interrumpir una corrutina que ya no vale la pena |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/11-asyncio-y-disponibilidad) · **Anterior:** [03 · create_task y gather](/ApuntesPSP/11-asyncio-y-disponibilidad/03-create-task-y-gather) · **Siguiente:** [05 · Heartbeat](/ApuntesPSP/11-asyncio-y-disponibilidad/05-heartbeat)