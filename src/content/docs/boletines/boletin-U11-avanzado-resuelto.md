---
title: Boletín U11 — Avanzado (Resuelto)
description: Soluciones de los ejercicios avanzados de asyncio y Disponibilidad
---

# 💪 Boletín U11 — Avanzado (Resuelto)

---

## 1. Backoff exponencial

```python
import asyncio

async def conectar(intentos=4):
    for i in range(intentos):
        espera = 2 ** i                 # 1, 2, 4, 8
        try:
            print(f"Intento {i+1}...")
            raise ConnectionRefusedError # Simular error
        except ConnectionRefusedError:
            print(f"  Fallo: espero {espera}s")
            await asyncio.sleep(espera)
    print("Servicio no disponible")

asyncio.run(conectar())
```

Backoff exponencial: 1s, 2s, 4s, 8s. El último intento falla y se imprime "Servicio no disponible".

## 2. Timeout con respaldo

```python
import asyncio

async def lenta():
    await asyncio.sleep(8)
    return "Resultado real"

async def respaldo():
    return "Resultado en caché"

async def main():
    try:
        r = await asyncio.wait_for(lenta(), timeout=5)
        print(r)
    except asyncio.TimeoutError:
        r = await respaldo()
        print(r)

asyncio.run(main())
```

A los 5s salta `TimeoutError`; el `except` ejecuta la corrutina de respaldo que devuelve "Resultado en caché".

## 3. Dos heartbeats

```python
import asyncio

async def hb_a():
    while True:
        print("💓 A")
        await asyncio.sleep(3)

async def hb_b():
    while True:
        print("💓 B")
        await asyncio.sleep(5)

async def main():
    asyncio.create_task(hb_a())
    asyncio.create_task(hb_b())
    await asyncio.sleep(12)   # da tiempo a que latan
    print("main terminó")

asyncio.run(main())
```

Los dos latidos corren en segundo plano; `main()` espera 12s (A late 4 veces, B unas 2). Sin ese `await`, las tareas se cancelarían al acabar `main()`.

## 4. 🎯 Web scraper asíncrono

```python
import asyncio, httpx, time

URLS = ["https://httpbin.org/get"] * 5

async def descargar(url):
    async with httpx.AsyncClient() as cliente:
        r = await cliente.get(url)
        return r.status_code

async def main_async():
    tareas = [descargar(u) for u in URLS]
    resultados = await asyncio.gather(*tareas)
    print("Resultados:", resultados)

inicio = time.time()
asyncio.run(main_async())
print(f"Versión asíncrona: {time.time() - inicio:.2f}s")

# Versión síncrona equivalente para comparar:
inicio = time.time()
with httpx.Client() as cliente:
    for u in URLS:
        cliente.get(u)
print(f"Versión síncrona:   {time.time() - inicio:.2f}s")
```

`gather(*tareas)` lanza las 5 descargas a la vez: la versión asíncrona tarda lo que la más lenta, la síncrona la suma de todas.

## 5. 🔍 Servidor asyncio con heartbeat

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

async def main():
    asyncio.create_task(heartbeat())          # latido en segundo plano
    servidor = await asyncio.start_server(atender, "127.0.0.1", 5000)
    print("🚀 Servidor ASYNCIO en 127.0.0.1:5000")
    async with servidor:
        await servidor.serve_forever()

asyncio.run(main())
```

`create_task(heartbeat())` lanza el latido antes de aceptar conexiones. Cada 5s imprime "💓 Vivo — N conexiones". Se mata con Ctrl+C.

## 6. ⏱ Monitoreo de servidores

```python
import asyncio, random

estados = {"Server-A": True, "Server-B": True, "Server-C": True}

async def servidor_simulado(nombre):
    """Cambia su estado aleatoriamente cada 5-15s."""
    while True:
        await asyncio.sleep(random.randint(5, 15))
        estados[nombre] = random.choice([True, False])
        print(f"  [{nombre}] cambia a {'ARRIBA' if estados[nombre] else 'CAÍDO'}")

async def monitor():
    while True:
        await asyncio.sleep(3)
        caidos = [n for n, ok in estados.items() if not ok]
        if caidos:
            print(f"🩺 Caídos: {', '.join(caidos)}")
        else:
            print("🩺 Todo en pie")

async def main():
    for nombre in estados:
        asyncio.create_task(servidor_simulado(nombre))
    await monitor()          # el monitor corre para siempre

asyncio.run(main())
```

Cada servidor simulado cambia su estado de forma aleatoria; el monitor lee el diccionario cada 3s y reporta los caídos. Es el heartbeat del [punto 8](/ApuntesPSP/11-asyncio-y-disponibilidad/08-disponibilidad-y-practica) aplicado a varios servicios a la vez.

## 7. 🧩 Semáforo asyncio

```python
import asyncio, httpx, time

sem = asyncio.Semaphore(3)          # solo 3 a la vez

async def descargar(n):
    async with sem:                 # reserva un hueco del semáforo
        async with httpx.AsyncClient() as cliente:
            r = await cliente.get(f"https://httpbin.org/delay/{n}")
            return r.status_code

async def main():
    tareas = [descargar(n) for n in range(1, 7)]   # 6 descargas
    resultados = await asyncio.gather(*tareas)
    print("Resultados:", resultados)

inicio = time.time()
asyncio.run(main())
print(f"Tiempo total: {time.time() - inicio:.2f}s")
```

`async with sem:` garantiza que como máximo 3 corrutinas ejecutan el bloque a la vez; las otras 3 esperan su turno.

## 8. 🎭 Timeout con fallback

```python
import asyncio

async def descargar_principal():
    await asyncio.sleep(5)          # servidor lento
    return "Datos del principal"

async def descargar_respaldo():
    await asyncio.sleep(1)
    return "Datos del respaldo"

async def main():
    try:
        r = await asyncio.wait_for(descargar_principal(), timeout=2)
    except asyncio.TimeoutError:
        r = await descargar_respaldo()
    print(r)

asyncio.run(main())
```

A los 2s salta `TimeoutError` y el `except` ejecuta la corrutina de respaldo. La disponibilidad gana: siempre se devuelve una respuesta, aunque venga del servidor de backup.

## 9. 🏗️ Chat asíncrono

```python
import asyncio

clientes = set()

async def broadcast(mensaje, emisor=None):
    for writer in list(clientes):       # copia: permite eliminar al iterar
        if writer != emisor:
            writer.write(mensaje)
            await writer.drain()

async def gestionar(reader, writer):
    clientes.add(writer)
    print(f"Cliente conectado ({len(clientes)} en total)")
    try:
        while True:
            try:
                datos = await asyncio.wait_for(reader.read(1024), timeout=60)
            except asyncio.TimeoutError:
                break                    # desconexión silenciosa
            if not datos:
                break
            await broadcast(b"[" + writer.get_extra_info("peername")[0].encode() + b"] " + datos, emisor=writer)
    finally:
        clientes.discard(writer)
        writer.close()
        await writer.wait_closed()

async def main():
    servidor = await asyncio.start_server(gestionar, "127.0.0.1", 6000)
    print("💬 Chat ASYNCIO en 127.0.0.1:6000")
    async with servidor:
        await servidor.serve_forever()

asyncio.run(main())
```

`broadcast` reenvía a todos los clientes menos al emisor. `wait_for(..., timeout=60)` detecta desconexiones: si un cliente no envía nada en 60s, se cierra su conexión y se quita del conjunto.