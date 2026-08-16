---
title: 08 — Disponibilidad y práctica
description: "Todo junto: el monitor de servicio y Aprieta el lápiz 🩺"
---

<p><small>Todo junto: el monitor de servicio y Aprieta el lápiz 🩺</small></p>

> 🗺️ **Estás en:** ⏱️ **U11 · asyncio y Disponibilidad** → 08 · Disponibilidad y práctica

---

## 📬 La idea en una frase

> Este punto junta la unidad: un **monitor de servicio** que vigila un servidor con **heartbeat** (¿sigue vivo?), lo comprueba con **timeout** (¿responde a tiempo?) y reconecta con **backoff** (¿reintento sin machacar?). Disponibilidad = latido + timeout + backoff.

---

## 🩺 El monitor de servicio

Un monitor asíncrono que comprueba el estado de un servicio cada N segundos y reintenta con backoff cuando cae:

```python
import asyncio

async def comprobar_servicio(host, port):
    """Devuelve True si el servicio responde dentro del timeout."""
    try:
        reader, writer = await asyncio.wait_for(
            asyncio.open_connection(host, port), timeout=2
        )
        writer.close()
        await writer.wait_closed()
        return True
    except (asyncio.TimeoutError, ConnectionRefusedError):
        return False

async def monitor(host, port):
    fallos = 0
    while True:
        if await comprobar_servicio(host, port):
            print(f"💚 {host}:{port} disponible (fallos seguidos: {fallos})")
            fallos = 0
        else:
            fallos += 1
            espera = 2 ** min(fallos, 4)   # backoff: 2, 4, 8, 16, 16…
            print(f"💔 {host}:{port} caído — reintento en {espera}s")
            await asyncio.sleep(espera)
            continue
        await asyncio.sleep(5)             # comprobación periódica

asyncio.run(monitor("127.0.0.1", 5000))
```

Tres mecanismos de disponibilidad en un solo script:

| Mecanismo | Qué hace | Dónde |
|---|---|---|
| **Heartbeat** | Comprueba el servicio periódicamente (cada 5s) | `while True` + `asyncio.sleep(5)` |
| **Timeout** | No espera a un servicio mudo más de 2s | `asyncio.wait_for(..., timeout=2)` |
| **Backoff** | Ante fallos, espera cada vez más (2, 4, 8…) | `2 ** min(fallos, 4)` |

---

## 🎭 Be the code: el event loop en un servidor

> "Sé el event loop. Tu trabajo es coordinar corrutinas sin bloquear ni un milisegundo."

El servidor asyncio con todas las piezas (del [punto 3](/ApuntesPSP/11-asyncio-y-disponibilidad/03-create-task-y-gather) + el [punto 5](/ApuntesPSP/11-asyncio-y-disponibilidad/05-heartbeat)):

```python
import asyncio

async def atender(reader, writer):
    addr = writer.get_extra_info('peername')
    print(f"[+] Cliente {addr} conectado")

    datos = await reader.read(1024)
    print(f"    Recibido: {datos.decode()}")

    writer.write(b"OK: " + datos)
    await writer.drain()  # Espera a que se envíe

    writer.close()
    await writer.wait_closed()
    print(f"[-] Cliente {addr} desconectado")

async def main():
    servidor = await asyncio.start_server(atender, "127.0.0.1", 5000)
    print("🚀 Servidor ASYNCIO en 127.0.0.1:5000")

    async with servidor:
        await servidor.serve_forever()

asyncio.run(main())
```

La traza, paso a paso:

```
Event Loop arranca
│
├── 1. Ejecuta main()
│      ├── Crea servidor TCP
│      └── Registra atender() para nuevos clientes
│
├── 2. Event Loop: "Espero eventos... (I/O, timers, etc.)"
│
├── [Cliente-1 conecta]
│  3. Event Loop: "¡Cliente nuevo! Ejecuto atender(cliente1)"
│  4. atender(cliente1) empieza
│  5. await reader.read() → "No hay datos aún"
│  6. atender(cliente1) se pausa (cede el control)
│
├── [Cliente-2 conecta mientras cliente1 espera]
│  7. Event Loop: "¡Otro cliente! Ejecuto atender(cliente2)"
│  8. atender(cliente2) empieza
│  9. await reader.read() → "Tampoco hay datos"
│ 10. atender(cliente2) se pausa
│
├── [Cliente-1 envía datos]
│ 11. Event Loop: "Cliente1 tiene datos → reanudo atender(cliente1)"
│ 12. atender(cliente1) recibe los datos
│ 13. writer.write() → escribe buffer
│ 14. await writer.drain() → espera envío → se pausa
│
├── [Cliente-2 envía datos]
│ 15. Event Loop: "Cliente2 tiene datos → reanudo atender(cliente2)"
│ 16. atender(cliente2) recibe, responde, termina 🏁
│
├── [writer.drain() de cliente1 listo]
│ 17. Event Loop: "Cliente1 puede finalizar"
│ 18. atender(cliente1) termina 🏁
│
└── Event Loop sigue esperando más clientes...
```

> Nunca hay espera activa. Cuando una corrutina espera, otra aprovecha. **Un solo hilo, miles de conexiones.**

---

## ✏️ Aprieta el lápiz

1. **Asyncio básico**: Crea 3 corrutinas que esperen 1, 2 y 3 segundos. Lánzalas con `gather` y mide el tiempo total.
2. **Servidor asyncio**: Convierte el servidor TCP del TEMA 10 a asyncio.
3. **Heartbeat**: Añade un heartbeat que imprima "💓 vivo" cada 3s mientras el servidor funciona.
4. **Backoff**: Crea un cliente que intente conectarse 3 veces con backoff exponencial.
5. **Monitor**: Monta el monitor de servicio con heartbeat + timeout + backoff que vigile un puerto.

<details>
<summary>🔓 Soluciones</summary>

**1. Tres corrutinas con gather:**

```python
import asyncio, time

async def tarea(nombre, segundos):
    await asyncio.sleep(segundos)
    print(f"  {nombre} terminó ({segundos}s)")

async def main():
    inicio = time.time()
    await asyncio.gather(
        tarea("A", 1), tarea("B", 2), tarea("C", 3)
    )
    print(f"Tiempo total: {time.time() - inicio:.2f}s")

asyncio.run(main())
```

Con `gather` el total es ~3s (la más lenta), no 6s.

**2. Servidor TCP → asyncio:**

```python
import asyncio

async def atender(reader, writer):
    datos = await reader.read(1024)
    writer.write(b"OK: " + datos)
    await writer.drain()
    writer.close()
    await writer.wait_closed()

async def main():
    servidor = await asyncio.start_server(atender, "127.0.0.1", 5000)
    async with servidor:
        await servidor.serve_forever()

asyncio.run(main())
```

El `recv()` síncrono se convierte en `await reader.read(1024)`.

**3. Heartbeat cada 3s:**

```python
import asyncio

async def heartbeat():
    while True:
        print("💓 vivo")
        await asyncio.sleep(3)

async def main():
    asyncio.create_task(heartbeat())
    servidor = await asyncio.start_server(lambda r, w: None, "127.0.0.1", 5000)
    async with servidor:
        await servidor.serve_forever()

asyncio.run(main())
```

**4. Cliente con backoff (3 intentos):**

```python
import asyncio

async def conectar(max_intentos=3):
    for intento in range(max_intentos):
        try:
            reader, writer = await asyncio.wait_for(
                asyncio.open_connection("127.0.0.1", 5000), timeout=3
            )
            print("✅ Conectado")
            return reader, writer
        except (asyncio.TimeoutError, ConnectionRefusedError):
            espera = 2 ** intento
            print(f"⚠️ Intento {intento+1} fallido, espero {espera}s")
            await asyncio.sleep(espera)
    raise Exception("No se pudo conectar")

asyncio.run(conectar())
```

Esperas: 1s, 2s, 4s.

**5. Monitor con las tres piezas:** el del inicio de este punto. Arranca un servidor mínimo en 127.0.0.1:5000 y para el monitor con Ctrl+C; verás cómo pasa de 💚 a 💔 con esperas crecientes.

</details>

---

## 🧠 Mini-chequeo

1. ¿Qué tres mecanismos de disponibilidad combina el monitor?
2. En la traza del servidor, ¿qué hace el event loop cuando `atender(cliente1)` llega a `await reader.read()`?
3. ¿Por qué el servidor asyncio atiende a 2 clientes a la vez sin hilos?

<details>
<summary>🔄 Respuestas</summary>

1. **Heartbeat** (comprobación periódica), **timeout** (`wait_for`) y **backoff** (espera creciente ante fallos).
2. La pausa y pasa a **otra corrutina**: por eso el cliente 2 se atiende mientras el 1 espera datos.
3. Porque cuando una corrutina espera (`await reader.read()`), el **event loop** reanuda otra. Un solo hilo repartido entre corrutinas = concurrencia sin hilos.

</details>

---

## ✅ Resumen en 3 frases

- Disponibilidad = **heartbeat + timeout + backoff**: vigilas, cortas lo que tarda y reintentas con cabeza.
- El servidor asyncio atiende miles de conexiones en **un solo hilo** gracias a los `await`.
- Con el monitor y el servidor completos, ya tienes el material para el cierre y los boletines.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| Monitor de servicio | Vigila el estado de un servicio periódicamente |
| Disponibilidad | Un servicio que no se cuelga, avisa y se recupera |
| start_server | La función de asyncio que crea el servidor TCP |
| serve_forever | Mantiene el servidor escuchando hasta el Ctrl+C |
| reader / writer | Los objetos asyncio de lectura y escritura de cada cliente |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/11-asyncio-y-disponibilidad) · **Anterior:** [07 · Threads vs asyncio](/ApuntesPSP/11-asyncio-y-disponibilidad/07-threads-vs-asyncio) · **Siguiente:** [09 · Cierre](/ApuntesPSP/11-asyncio-y-disponibilidad/09-cierre)