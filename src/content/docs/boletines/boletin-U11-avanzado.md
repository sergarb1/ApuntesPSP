---
title: Boletín U11 — Avanzado
description: Ejercicios avanzados de asyncio y Disponibilidad
---

# 💪 Boletín U11 — Avanzado

> Ejercicios que requieren aplicar asyncio de forma más profunda: backoff, timeouts con respaldo, heartbeats múltiples, descargas concurrentes, servidores con latido y monitorización de varios servicios.

---

## 1. Backoff exponencial

Crea una función asíncrona `conectar()` que intente conectarse 4 veces con backoff (1s, 2s, 4s, 8s). Simula el fallo lanzando `ConnectionRefusedError`. Si falla, imprime "Servicio no disponible".

**Pista:** `espera = 2 ** intento`. Envuelve cada intento en `try/except ConnectionRefusedError`, espera con `await asyncio.sleep(espera)` y pasa al siguiente.

## 2. Timeout con respaldo

Crea una corrutina `lenta()` que tarde 8 segundos. Usa `asyncio.wait_for` con timeout de 5s. Si salta `TimeoutError`, ejecuta una corrutina de respaldo que devuelva "Resultado en caché".

**Pista:** `asyncio.wait_for(lenta(), timeout=5)` lanza `TimeoutError`; en el `except` haz `await respaldo()`.

## 3. Dos heartbeats

Crea dos corrutinas heartbeat: `hb_a()` imprime "💓 A" cada 3s, `hb_b()` imprime "💓 B" cada 5s. La función main las lanza con `asyncio.create_task` y espera 12 segundos.

**Pista:** dos `create_task` y luego `await asyncio.sleep(12)` para que `main()` no las cancele antes de tiempo.

## 4. 🎯 Web scraper asíncrono

Descarga 5 URLs a la vez con asyncio y httpx. Compara el tiempo con una versión síncrona.

**Pista:** usa `httpx.AsyncClient` dentro de cada corrutina. Crea una lista de tareas con `[descargar(u) for u in urls]` y ejecútalas con `asyncio.gather(*tareas)`. Mide el tiempo total con `time.time()`.

## 5. 🔍 Servidor asyncio con heartbeat

Servidor asyncio que imprime "💓 Vivo — N conexiones" cada 5s.

**Pista:** usa `asyncio.start_server` para el servidor TCP. Crea una corrutina `heartbeat` con un bucle infinito `while True: await asyncio.sleep(5); ...`. Lánzala con `asyncio.create_task` antes de iniciar el servidor.

## 6. ⏱ Monitorización de servidores

3 servidores simulados. Un monitor asíncrono comprueba su estado cada 3s.

**Pista:** usa un diccionario `estados = {"Server-A": True, ...}`. Cada servidor es una corrutina que cambia su estado aleatoriamente cada ~5-15s. El monitor lee el diccionario cada 3s y reporta servidores caídos.

## 7. 🧩 Semáforo asyncio

Limita a 3 descargas simultáneas usando `asyncio.Semaphore`.

**Pista:** crea `sem = asyncio.Semaphore(3)`. Dentro de la función de descarga, usa `async with sem:` para que solo 3 corrutinas puedan ejecutar el bloque a la vez. Usa `httpbin.org/delay/{n}` para simular descargas lentas.

## 8. 🎭 Timeout con fallback

Intenta descargar de un servidor principal. Si tarda más de 2s, usa un servidor de respaldo.

**Pista:** envuelve la llamada a la corrutina principal con `asyncio.wait_for(descargar_principal(), timeout=2)`. Captura `asyncio.TimeoutError` y en el `except` ejecuta la corrutina de respaldo.

## 9. 🏗️ Chat asíncrono

Crea un servidor de chat con asyncio que reenvíe mensajes a todos los clientes conectados.

**Pista:** mantén un conjunto `clientes` con los objetos `writer` de cada conexión. Crea una función `broadcast(mensaje, emisor=None)` que itere sobre una copia del conjunto y envíe a todos excepto al emisor. Usa `asyncio.wait_for(reader.read(1024), timeout=60)` para detectar desconexiones.