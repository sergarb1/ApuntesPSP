---
title: "09 — Head First: consolida lo aprendido"
description: Sé el Servidor, el ring final y el Laboratorio de Tortura 🏗️
---

<p><small>Sé el Servidor, el ring final y el Laboratorio de Tortura 🏗️</small></p>

> 🗺️ **Estás en:** 🏗️ **U10 · Servidores Concurrentes** → 09 · Head First

---

Has terminado la teoría: el servidor secuencial y su límite, el cliente lento que bloquea la cola, el hilo por cliente, el ThreadPoolExecutor, el benchmark, el Lock para el estado compartido y las buenas prácticas. Este cierre es el aterrizaje: recorres lo aprendido con juegos, un laboratorio real con fallos intencionados y las preguntas que te harán en una entrevista. Léelo justo después del [punto 8](/ApuntesPSP/10-servidores-concurrentes/08-servidor-concurrente-completo) y antes de abrir los boletines.

---

## ⭐ Sé el Servidor

> *Eres un servidor TCP en `127.0.0.1:5000` con un ThreadPoolExecutor de 5 hilos. De repente llegan 10 clientes a la vez.*

**¿Qué pasa?**

1. Tu bucle principal hace `accept()` y recibe la **conexión-1**: `pool.submit(atender, conn1, addr1)`.
2. La tarea entra en el pool: **hilo-1 libre** la coge al instante y empieza a procesar.
3. Vuelves a `accept()` y recibes la **conexión-2**, **conexión-3**, … hasta la **conexión-5**: cada una ocupa un hilo libre (hilo-1 a hilo-5).
4. Llega la **conexión-6**: los 5 hilos están ocupados, así que `submit()` la **encola** internamente.
5. En cuanto hilo-1 termina con la conexión-1 (responde y cierra con `with conn:`), el pool **reutiliza** ese hilo para la conexión-6.
6. Así hasta la conexión-10: **dos tandas de 5**, el `ceil(10/5)` del [punto 5](/ApuntesPSP/10-servidores-concurrentes/05-benchmark).

**Nunca se crea un hilo nuevo.** El servidor tiene exactamente 5 hilos y una cola: el sistema no se ahoga.

> 💡 **Ahora tú:** ¿y si llegaran 10.000 conexiones? El pool las iría encolando y sirviendo de a 5. Tardarían más, pero el servidor **sobreviviría**. Y para 10.000 conexiones, la solución de la [U11 · asyncio](/ApuntesPSP/11-asyncio-y-disponibilidad) sería todavía más ligera.

---

## 🔥 Fireside Chat: Hilo por cliente vs ThreadPool

> *Dos enfoques de concurrencia se sientan junto a la chimenea a resolver, de una vez, quién sirve mejor a los clientes.*

**HiloPorCliente**: — Soy el enfoque clásico. Llega un cliente, creo un hilo, lo atiendo, el hilo muere. Sencillo y directo.

**ThreadPool**: — ¿Y si llegan 1000 clientes? Creas 1000 hilos y el sistema se colapsa. Yo tengo un número fijo de hilos, como un equipo de camareros limitado.

**HiloPorCliente**: — Pero cada cliente tiene su hilo dedicado. No esperan. Es más justo.

**ThreadPool**: — Justo pero ineficiente. Con mi pool, los clientes esperan un poco pero el sistema no se ahoga. Además, reutilizo hilos, evitando el coste de crearlos y destruirlos constantemente.

**HiloPorCliente**: — Para pocos clientes simultáneos, soy más simple de implementar.

**ThreadPool**: — Y yo escalo mejor. Para servidores en producción, soy la opción sensata.

> **Moraleja**: Hilo por cliente es simple y funciona para pocos clientes. ThreadPool escala mejor y controla los recursos. En producción, usa ThreadPool.

---

## 🕵️ ¿Quién Soy?

1. Soy el `accept()` que se queda atascado mientras se procesa al cliente anterior.
2. Soy la llamada que entrega la tarea al pool y devuelve un Future.
3. Soy la analogía del servidor secuencial: una sola persona atiende a toda la cola.
4. Soy la variable global que dos hilos pueden pisar si no me protegen con Lock.
5. Soy lo que mide cuánto tarda en responder un servidor con N clientes simultáneos.
6. Soy la fórmula del pool: te digo en cuántas tandas se atienden N clientes con W hilos.

<details>
<summary>🔄 Respuestas</summary>

1. **El bucle secuencial** (el `accept()` del servidor de una ventanilla).
2. **`pool.submit()`** — de `ThreadPoolExecutor`.
3. **La ventanilla única** (el servidor secuencial).
4. **La condición de carrera** (el contador compartido sin Lock).
5. **El benchmark** (el lanzador masivo de clientes).
6. **`ceil(N/W)`** — el número de tandas del ThreadPool.

</details>

---

## 🤬 CONRAD VS EL MUNDO: "un cliente lento bloquea el servidor"

**CONRAD:** — "Clásico: montas un servidor secuencial, llega un cliente que tarda 30 segundos y *'el servidor se ha quedado colgado'*. Pues no: solo tiene **una ventanilla**. Mientras procesa al lento, el `accept()` no corre y toda la cola espera. Los clientes 2 al 10 ya están conectados al socket… pero nadie los atiende."

**CONRAD:** — "Y lo mejor: *'he puesto time.sleep(3) y las pruebas van lentas'*. ¡Pues claro! Cada cliente suma 3 segundos. Con 10 clientes, el último espera 30. **n × tiempo_por_cliente**, lo dijimos en el [punto 1](/ApuntesPSP/10-servidores-concurrentes/01-servidor-secuencial). Si quieres que todos terminen a la vez, necesitas hilos o un pool."

**CONRAD:** — "Y no me vengas con *'¿será que el puerto está ocupado?'*. El puerto va bien: lo que pasa es que el servidor atiende de uno en uno. Lanza el **lanzador de clientes** del [punto 5](/ApuntesPSP/10-servidores-concurrentes/05-benchmark) y míralo en el log: si las respuestas llegan de una en una, tienes un secuencial. A diagnosticar."

---

## ⚡ Laboratorio de Tortura: servidor concurrente con ThreadPool

> **Duración:** 45 minutos
> **Herramienta:** Python 3 (solo stdlib: `socket`, `threading`, `concurrent.futures`)

**Escenario:** construye un servidor TCP en `127.0.0.1:5000` que responda `"OK: " + datos` a cada cliente, usando **ThreadPoolExecutor con `max_workers=3`**. Acompáñalo de un lanzador que dispare 10 clientes simultáneos y cronometre el total.

**Tareas paso a paso:**

1. Escribe `atender(conn, addr)` con `with conn:`: recibe con `recv(1024)` y responde con `sendall(b"OK: " + datos)`.
2. Monta el servidor con `with socket.socket() as srv, ThreadPoolExecutor(max_workers=3) as pool:` (patrón del [punto 4](/ApuntesPSP/10-servidores-concurrentes/04-threadpoolexecutor)).
3. En el bucle: `conn, addr = srv.accept()` → `pool.submit(atender, conn, addr)`.
4. Escribe el lanzador de 10 clientes con `threading.Thread` y mide el tiempo total con `time.time()` ([punto 5](/ApuntesPSP/10-servidores-concurrentes/05-benchmark)).
5. Añade un **contador global de conexiones activas** protegido con `Lock` ([punto 6](/ApuntesPSP/10-servidores-concurrentes/06-sincronizacion-en-servidores)) que se imprima con cada `[+]`/`[-]`.
6. Ejecuta servidor y lanzador en terminales separadas. El servidor se mata con **Ctrl+C**.

**Fallo intencionado:** cambia `max_workers=3` por **`max_workers=1`**. ¿Qué pasa? El pool se convierte en un servidor **secuencial de facto**: una sola tarea a la vez, las otras 9 en cola. El tiempo total pasa de ~1 tanda a **10 tandas**: con clientes que tardan 2s, el lanzador marca ~20s en lugar de ~8s (ceil(10/3)=4 tandas × 2s).

> **Pista 1:** el problema no está en el código del cliente ni del servidor: está en el **tamaño del pool**. Con `max_workers=1`, el ThreadPool se comporta como el servidor secuencial del [punto 1](/ApuntesPSP/10-servidores-concurrentes/01-servidor-secuencial): el tiempo total es `n × tiempo_por_cliente`.
>
> **Pista 2:** usa la fórmula del [punto 5](/ApuntesPSP/10-servidores-concurrentes/05-benchmark): `ceil(n/workers) × tiempo_por_cliente`. Con workers=1, `ceil(10/1) = 10` tandas. Con workers=3, `ceil(10/3) = 4`. La diferencia de tiempo te delata la configuración.

---

## 🏆 Logros de esta unidad

| Logro | Cómo conseguirlo |
|---|---|
| 🏅 **Cola Crusher** | Explicar por qué un cliente lento bloquea a todo un servidor secuencial |
| 🏅 **Thread Spawner** | Montar un servidor multihilo que lanza un hilo por cada cliente |
| 🏅 **Pool Master** | Implementar un servidor con ThreadPoolExecutor y elegir el tamaño del pool |
| 🏅 **Benchmarker** | Medir con un lanzador masivo la diferencia entre secuencial, hilos y pool |
| 🏅 **Lock Guardian** | Proteger con Lock el contador de conexiones de un servidor concurrente |

---

## 🧠 Atrévete a Pensar

1. ¿Por qué un servidor secuencial "acepta" a los clientes pero no los atiende?
2. ¿Qué ventaja real tiene un pool de 5 hilos frente a 5 hilos creados y destruidos por cliente?
3. ¿Cuándo vale la pena sacrificar velocidad (esperar en cola del pool) por estabilidad?
4. ¿Por qué el `recv()`/`sendall()` de cada conexión no necesita Lock, pero el contador global sí?
5. ¿Qué problemas aparecerían si lanzaras 100.000 hilos contra tu servidor?

<details>
<summary>💡 Soluciones</summary>

1. Porque la conexión TCP la **acepta el sistema operativo** en la cola del socket. El `accept()` del código no se ejecuta hasta que termina el cliente actual: los demás están conectados a nivel de red, pero sin atención.
2. **Coste de creación/destrucción**: el pool reutiliza los mismos 5 hilos una y otra vez, evitando el trabajo de crear y destruir hilos por cada conexión (el [punto 4](/ApuntesPSP/10-servidores-concurrentes/04-threadpoolexecutor)).
3. Cuando la **carga es impredecible** (picos): esperar en la cola del pool es mejor que saturar el sistema y que el servidor muera. Estabilidad > latencia en producción.
4. Porque cada `conn` es un **socket distinto** (independiente entre hilos), mientras que el contador es **una única variable compartida** que todos modifican: sin Lock hay condición de carrera ([punto 6](/ApuntesPSP/10-servidores-concurrentes/06-sincronizacion-en-servidores)).
5. Se agotaría la **memoria** (pila de cada hilo) y el **context switch** degradaría la CPU hasta dejar el servidor inútil ([punto 7](/ApuntesPSP/10-servidores-concurrentes/07-limites-y-buenas-practicas)). El pool y asyncio existen precisamente para no llegar ahí.

</details>

---

## 🧩 Crucigrama de Bits

```
Horizontal:
1. Atiende a un cliente cada vez, el enemigo de la concurrencia (10 letras)
4. Hilos por conexión, el patrón del punto 3 (4 letras)
6. Equipo fijo de hilos reutilizables (4 letras)
8. Lo que hace el bucle principal tras lanzar un hilo (6 letras)

Vertical:
2. Protege la variable compartida entre hilos (4 letras)
3. Prueba que lanza N clientes y mide el tiempo (9 letras)
5. Método que entrega una tarea al pool (6 letras)
7. Se libera con with conn: aunque haya excepción (6 letras)
```

<details>
<summary>📝 Soluciones</summary>

**Horizontal:** 1. SECUENCIAL, 4. HILO, 6. POOL, 8. ACEPTAR
**Vertical:** 2. LOCK, 3. BENCHMARK, 5. SUBMIT, 7. SOCKET

</details>

---

## 💬 Entrevista de trabajo

1. **"¿Qué es un servidor concurrente y en qué se diferencia de uno secuencial?"**
2. **"¿Cómo implementarías un servidor que atienda a 500 clientes a la vez?"**
3. **"Hilo por cliente o ThreadPoolExecutor: ¿cuál elegirías y por qué?"**
4. **"¿Qué es una condición de carrera? Pon un ejemplo en un servidor."**
5. **"¿Cómo medirías si tu servidor es realmente concurrente?"**

> 💡 **Cómo encararlas:** la 1 y la 2 son las "preguntas reina". Para la 1, recorre la cadena de la unidad: secuencial → `n × tiempo` → cliente lento bloquea → hilo por cliente → pool. Para la 2, plantea ThreadPoolExecutor con un `max_workers` razonable, `submit()` en el bucle de `accept()`, `with conn:` y un contador con Lock. Si sabes contarlo fluido y defiendes por qué **no** lanzarías 500 hilos, ya eres medio programador de servidores.

---

## 🤷 No hay preguntas tontas

> ❓ **¿Cuántos hilos puede tener un servidor?**

Depende del SO. En Windows, unos pocos miles. Pero más allá de ~100, el cambio de contexto (context switch) perjudica el rendimiento ([punto 7](/ApuntesPSP/10-servidores-concurrentes/07-limites-y-buenas-practicas)).

> ❓ **¿Qué pasa si un hilo se cuelga?**

Ese hilo queda bloqueado, pero los demás siguen. El problema es si no libera el socket (fuga de recursos).

> ❓ **¿ThreadPool o hilo por cliente en producción?**

**ThreadPool** siempre. Controlas cuántos hilos se crean. Hilo por cliente solo para prototipos.

> ❓ **¿Es seguro compartir variables globales entre hilos del servidor?**

No sin Lock. Si dos hilos modifican la misma variable, usa Lock. Mejor aún: evita compartir estado.

> ❓ **¿Puedo mezclar hilos y asyncio?**

Sí, con `loop.run_in_executor()`. Pero empieza con uno u otro.

> ❓ **¿Y si el servidor recibe 10.000 conexiones?**

ThreadPool con 100 hilos + cola de espera. O usa **asyncio** ([U11](/ApuntesPSP/11-asyncio-y-disponibilidad)) que escala mejor.

---

## 🎬 Post-Créditos

> *El servidor secuencial hacía esperar a todos en la cola de la ventanilla única.*
>
> *Llegó el hilo por cliente y cada conexión tuvo su propia ventanilla.*
>
> *El ThreadPool puso límites al entusiasmo: cinco camareros, cola ordenada, nadie se ahoga.*
>
> *El Lock protegió el contador. El benchmark demostró la mejora. Los clientes responden a la vez.*
>
> *El servidor ya atiende a muchos. Pero 10.000 conexiones siguen esperando algo más ligero…*

**PRÓXIMAMENTE EN U11:** *asyncio y disponibilidad. Sin un hilo por conexión, un solo bucle de eventos atenderá miles de clientes a la vez. El servidor concurrente se vuelve esbelto.*

---

## ✅ Criterios de evaluación cubiertos (RA4c-d)

**RA4: Implementa servicios en red, desarrollando servidores concurrentes capaces de atender a varios clientes simultáneamente.**

| CE | Criterio | Cubierto |
|---|---|---|
| c) | Implementa servidores concurrentes con hilos | ✅ Hilo por cliente (puntos 3 y 8) + ⚡ Laboratorio |
| d) | Gestiona pools de hilos (ThreadPoolExecutor) | ✅ ThreadPool y benchmark (puntos 4-5) + ⚡ Laboratorio |

> RA4a-b (APIs REST y comerciales) se cubren en las **U06 y U07**. RA4e-g (asyncio, disponibilidad, comparativa de modelos) se cubren en la **U11 · asyncio y Disponibilidad**.

---

📚 [Volver al índice de la unidad](/ApuntesPSP/10-servidores-concurrentes) · **Anterior:** [08 · Servidor concurrente completo](/ApuntesPSP/10-servidores-concurrentes/08-servidor-concurrente-completo) · **Siguiente:** **[U11 · asyncio y Disponibilidad](/ApuntesPSP/11-asyncio-y-disponibilidad)**