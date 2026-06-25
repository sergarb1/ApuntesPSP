---
title: "⭐ AVANZADO 11 — Asyncio y Disponibilidad"
nav_order: 11
---

## ⭐ AVANZADO 11 — Asyncio y Disponibilidad

---

### 1. 🎯 Web scraper asíncrono

Descarga 5 URLs a la vez con asyncio y httpx. Compara el tiempo con una versión síncrona.

**Pista**: Usa `httpx.AsyncClient` dentro de cada corrutina. Crea una lista de tareas con `[descargar(u) for u in urls]` y ejecútalas con `asyncio.gather(*tareas)`. Mide el tiempo total con `time.time()`.

---

### 2. 🔍 Servidor asyncio con heartbeat

Servidor asyncio que imprime "💓 Vivo — N conexiones" cada 5s.

**Pista**: Usa `asyncio.start_server` para el servidor TCP. Crea una corrutina `heartbeat` con un bucle infinito `while True: await asyncio.sleep(5); ...`. Lánzala con `asyncio.create_task` antes de iniciar el servidor.

---

### 3. 🧩 Semáforo asyncio

Limita a 3 descargas simultáneas usando `asyncio.Semaphore`.

**Pista**: Crea `sem = asyncio.Semaphore(3)`. Dentro de la función de descarga, usa `async with sem:` para que solo 3 corrutinas puedan ejecutar el bloque a la vez. Usa `httpbin.org/delay/{n}` para simular descargas lentas.

---

### 4. 🎭 Timeout con fallback

Intenta descargar de un servidor principal. Si tarda más de 2s, usa un servidor de respaldo.

**Pista**: Envuelve la llamada a la corrutina principal con `asyncio.wait_for(descargar_principal(), timeout=2)`. Captura `asyncio.TimeoutError` y en el `except` ejecuta la corrutina de respaldo.

---

### 5. ⏱ Monitoreo de servidores

3 servidores simulados. Un monitor asíncrono comprueba su estado cada 3s.

**Pista**: Usa un diccionario `estados = {"Server-A": True, ...}`. Cada servidor es una corrutina que cambia su estado aleatoriamente cada ~5-15s. El monitor lee el diccionario cada 3s y reporta servidores caídos.

---

### 6. 🏗️ Chat asíncrono

Crea un servidor de chat con asyncio que reenvíe mensajes a todos los clientes conectados.

**Pista**: Mantén un conjunto `clientes` con los objetos `writer` de cada conexión. Crea una función `broadcast(mensaje, emisor=None)` que itere sobre una copia del conjunto y envíe a todos excepto al emisor. Usa `asyncio.wait_for(reader.read(1024), timeout=60)` para detectar desconexiones.

---
