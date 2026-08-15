---
title: 07 — Límites y buenas prácticas
description: Cuántos hilos puedes crear y cómo hacerlo bien 🛡️
---

<p><small>Cuántos hilos puedes crear y cómo hacerlo bien 🛡️</small></p>

> 🗺️ **Estás en:** 🏗️ **U10 · Servidores Concurrentes** → 07 · Límites y buenas prácticas

---

## 📬 La idea en una frase

> Más hilos no es siempre mejor: el sistema operativo tiene límites, el cambio de contexto tiene coste y un hilo colgado puede fugarse de recursos. La buena práctica es **controlar los límites** y elegir la herramienta adecuada para cada escala.

Ya tienes las dos herramientas (hilo por cliente y ThreadPool). Este punto responde a las preguntas que te harás cuando el servidor vaya a producción: ¿cuántos hilos puedo crear? ¿qué pasa si uno se cuelga? ¿y si llegan 10.000 conexiones?

---

## 🔢 ¿Cuántos hilos puede tener un servidor?

**Depende del SO.** En Windows, unos pocos miles. Pero hay un matiz importante:

> Más allá de **~100 hilos**, el **cambio de contexto** (context switch) perjudica el rendimiento.

Cada vez que la CPU alterna entre hilos, pierde tiempo en guardar y restaurar el estado de cada uno. Con pocos hilos, ese coste es despreciable; con cientos, la CPU pasa más tiempo *cambiando de hilo* que *trabajando*. Por eso el ThreadPool del [punto 4](/ApuntesPSP/10-servidores-concurrentes/04-threadpoolexecutor) limita `max_workers`: el rendimiento sube con los hilos… hasta un punto, y luego baja.

| Nº de hilos | Efecto esperado |
|---|---|
| 1-10 | Sencillo, bajo consumo, poco paralelismo |
| ~100 | Punto de equilibrio razonable en un servidor de clase |
| Miles | Riesgo de agotar memoria y coste de context switch alto |

---

## 🧟 ¿Qué pasa si un hilo se cuelga?

Ese hilo queda **bloqueado**, pero los demás siguen funcionando: la concurrencia te salva de un colapso total. El problema real es si el hilo colgado **no libera el socket** (fuga de recursos):

- Cada conexión abierta ocupa un **file descriptor** y memoria en el SO.
- Con suficientes fugas, el servidor agota los descriptores y **deja de aceptar** nuevas conexiones.
- La solución es garantizar el cierre: el `with conn:` que usamos en toda la unidad cierra el socket al salir del bloque, **aunque haya una excepción**.

> 🛡️ Si un hilo se queda eternamente esperando datos que nunca llegan, un **timeout** (`conn.settimeout()`) lo libera a los pocos segundos. Lo practicarás en el boletín avanzado.

---

## 🏭 ¿ThreadPool o hilo por cliente en producción?

**ThreadPool siempre.** Controlas cuántos hilos se crean y evitas saturar el SO. Hilo por cliente es **solo para prototipos**:

| Criterio | Hilo por cliente | ThreadPool |
|---|---|---|
| Control de recursos | ❌ Ninguno | ✅ `max_workers` fijo |
| Escala a miles de conexiones | ❌ Satura el sistema | ✅ Encola y sirve de a N |
| Complejidad | ✅ Simple | ✅ Igual de simple (`submit()`) |
| Uso recomendado | Prototipos, clases | **Producción** |

---

## 🌊 ¿Y si el servidor recibe 10.000 conexiones?

- Con hilo por cliente: 10.000 hilos → el sistema se colapsa.
- Con ThreadPool de **100 hilos + cola de espera**: el servidor sobrevive, aunque los clientes esperen turno.
- La alternativa que **escala mejor** es **asyncio** (la verás en la [U11 · asyncio y Disponibilidad](/ApuntesPSP/11-asyncio-y-disponibilidad)): atiende miles de conexiones sin un hilo por conexión, con un bucle de eventos muy ligero.

---

## 🔀 ¿Puedo mezclar hilos y asyncio?

Sí, con `loop.run_in_executor()`. Pero como principiante, la recomendación es clara: **empieza con uno u otro**. Los dos modelos (hilos y asyncio) son potentes por separado y confusos juntos. Cuando domines asyncio en la [U11](/ApuntesPSP/11-asyncio-y-disponibilidad), podrás combinar bloqueos de bibliotecas de terceros (que no son asíncronas) usando el ejecutor.

---

## ✅ Guía rápida de buenas prácticas

- **Limita los hilos**: usa `ThreadPoolExecutor(max_workers=N)` en producción, nunca hilos ilimitados.
- **Cierra siempre la conexión**: `with conn:` libera el socket aunque haya errores.
- **Protege el estado compartido** con `Lock` (punto 6); mejor aún, evita compartir estado.
- **Usa timeouts** en `recv()` para que un cliente mudo no cuelgue un hilo para siempre.
- **Mide con el benchmark** (punto 5) antes de tocar `max_workers`: los datos mandan, no las corazonadas.
- **El pool se crea una vez**, fuera del bucle `accept()` (punto 4).

---

## 🧠 Mini-chequeo

1. ¿Por qué "miles de hilos" puede ser *peor* que "100 hilos" aunque la CPU tenga muchos núcleos?
2. Un hilo se cuelga sin liberar su socket. ¿Qué les pasa a los demás? ¿Y al servidor a largo plazo?
3. Recibes 10.000 conexiones simultáneas. ¿Qué herramienta usarías y por qué?

<details>
<summary>🔄 Respuestas</summary>

1. Por el **coste del context switch**: la CPU pierde tiempo alternando entre miles de hilos, y además cada hilo consume memoria. El rendimiento empeora a partir de cierto punto.
2. Los demás hilos **siguen trabajando** (ventaja de la concurrencia), pero cada socket sin cerrar es una **fuga de recursos**: a largo plazo el servidor agota descriptores y deja de aceptar conexiones.
3. Un **ThreadPool de ~100 hilos con cola de espera**, o directamente **asyncio** (U11), que es el que mejor escala para miles de conexiones. Nunca 10.000 hilos.

</details>

---

## ✅ Resumen en 3 frases

- Los hilos tienen **límites del SO** y el **context switch** penaliza por encima de ~100.
- Un hilo colgado no tumba al servidor, pero **fugarse de sockets** sí lo ahoga con el tiempo.
- Regla de producción: **ThreadPool con límite + timeouts + `with conn:` + benchmark**.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| Context switch | Cambio de hilo de la CPU: necesario, pero caro |
| Fuga de recursos | Socket o memoria que nunca se libera |
| setimeout() | Límite de tiempo para `recv()`: evita hilos colgados |
| max_workers | Límite de hilos del pool (tu freno de mano) |
| asyncio | Modelo de concurrencia ligera para miles de conexiones (U11) |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/10-servidores-concurrentes) · **Anterior:** [06 · Sincronización en servidores](/ApuntesPSP/10-servidores-concurrentes/06-sincronizacion-en-servidores) · **Siguiente:** [08 · Servidor concurrente completo](/ApuntesPSP/10-servidores-concurrentes/08-servidor-concurrente-completo)