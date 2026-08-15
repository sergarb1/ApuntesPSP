---
title: 05 — Heartbeat
description: El latido que confirma que el servicio sigue vivo 💓
---

<p><small>El latido que confirma que el servicio sigue vivo 💓</small></p>

> 🗺️ **Estás en:** ⏱️ **U11 · asyncio y Disponibilidad** → 05 · Heartbeat

---

## 📬 La idea en una frase

> Un **heartbeat** (latido) es un mensaje periódico para verificar que el servidor sigue vivo. Si el latido deja de sonar, algo va mal: ese es el aviso.

---

## 💓 El latido en asyncio

En un hilo, un heartbeat sería un `threading.Thread` daemon con `time.sleep`. En asyncio, es una **corrutina en segundo plano** lanzada con `create_task` (el [punto 3](/ApuntesPSP/11-asyncio-y-disponibilidad/03-create-task-y-gather)):

```python
import asyncio

async def heartbeat(intervalo=5):
    while True:
        print("💓 Heartbeat: servidor vivo")
        await asyncio.sleep(intervalo)

async def servidor_con_heartbeat():
    # Lanzar heartbeat en segundo plano
    asyncio.create_task(heartbeat())

    servidor = await asyncio.start_server(
        lambda r, w: None, "127.0.0.1", 5000
    )
    async with servidor:
        await servidor.serve_forever()

asyncio.run(servidor_con_heartbeat())
```

Cada 5 segundos el servidor imprime que sigue vivo. El `create_task` lo lanza **en segundo plano** mientras el servidor atiende conexiones. La salida:

```
💓 Heartbeat: servidor vivo
💓 Heartbeat: servidor vivo
💓 Heartbeat: servidor vivo
...
```

> El heartbeat responde a la pregunta "¿está vivo el servidor?" sin necesidad de que un cliente haga una petición. Es la **vigilancia pasiva** del servicio.

---

## 🩺 Heartbeat con estado

Un heartbeat más útil informa del **estado**: cuántas conexiones atiende ahora mismo.

```python
import asyncio

conexiones = 0

async def atender(reader, writer):
    global conexiones
    conexiones += 1
    datos = await reader.read(1024)
    writer.write(b"OK: " + datos)
    await writer.drain()
    writer.close()
    await writer.wait_closed()
    conexiones -= 1

async def heartbeat():
    while True:
        print(f"💓 Vivo — {conexiones} conexiones")
        await asyncio.sleep(5)
```

Si el latido deja de aparecer en el log... el proceso está muerto o bloqueado. Y si aparece con `0 conexiones` durante horas, sabes que el servicio está arriba pero nadie lo usa: también es información.

---

## 🧠 Mini-chequeo

1. ¿Qué es un heartbeat?
2. ¿Por qué se lanza con `create_task` y no con un simple `await`?
3. ¿Qué información adicional puede llevar el latido?

<details>
<summary>🔄 Respuestas</summary>

1. Un **mensaje periódico** que verifica que el servidor sigue vivo. Si deja de sonar, algo falla.
2. Porque `await heartbeat()` bloquearía el `main()` para siempre: con `create_task`, el latido corre **en segundo plano** y el servidor sigue su trabajo.
3. El **estado del servicio**: conexiones activas, memoria, últimos errores... Todo lo que ayude a saber si el servicio está sano.

</details>

---

## ✅ Resumen en 3 frases

- Un heartbeat es un **mensaje periódico** que prueba que el servicio sigue vivo.
- En asyncio se implementa como una **corrutina en bucle infinito lanzada con `create_task`**.
- Añadirle el **estado** (conexiones, errores) lo convierte en vigilancia real de disponibilidad.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| Heartbeat | Latido: mensaje periódico de "sigo vivo" |
| create_task | Cómo se lanza el latido en segundo plano |
| Bucle infinito | El `while True` del heartbeat |
| Estado del servicio | Datos que el latido puede reportar (conexiones, errores) |
| Disponibilidad | Capacidad de un servicio de seguir respondiendo |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/11-asyncio-y-disponibilidad) · **Anterior:** [04 · Timeouts](/ApuntesPSP/11-asyncio-y-disponibilidad/04-timeouts) · **Siguiente:** [06 · Backoff](/ApuntesPSP/11-asyncio-y-disponibilidad/06-backoff)