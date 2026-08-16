---
title: "09 — Cierre: consolida lo aprendido"
description: Sé la Corrutina, el ring final y el último Laboratorio de Tortura 🏁
---

<p><small>Sé la Corrutina, el ring final y el último Laboratorio de Tortura 🏁</small></p>

> 🗺️ **Estás en:** ⏱️ **U11 · asyncio y Disponibilidad** → 09 · Cierre

---

Has terminado la teoría: el event loop, las corrutinas, gather y create_task, los timeouts, el heartbeat, el backoff y la comparativa con los hilos. Este cierre es el aterrizaje final del viaje: recorres lo aprendido con juegos, un laboratorio con fallos intencionados y las preguntas que te harán en una entrevista. Léelo justo después del [punto 8](/ApuntesPSP/11-asyncio-y-disponibilidad/08-disponibilidad-y-practica) y antes de abrir los boletines.

---

## ⭐ Sé la Corrutina

> *Eres una corrutina `monitor()` en un event loop con 2.000 corrutinas más. Tu trabajo: comprobar un servicio cada 5 segundos y avisar si cae.*

**¿Qué pasa?**

1. El event loop te ejecuta. Llegas a `await asyncio.wait_for(open_connection(...), timeout=2)`: **te pausas** y el event loop pasa a otras corrutinas.
2. El servicio responde. El event loop te reanuda: imprimes `💚 disponible`.
3. Llegas a `await asyncio.sleep(5)`: **te vuelves a pausar**. Durante esos 5 segundos, el event loop atiende a las otras 1.999 corrutinas.
4. Un día el servicio no responde: `TimeoutError`. Imprimes `💔 caído` y esperas `2 ** fallos` segundos (**backoff**), pausada, mientras el event loop sigue con las demás.
5. Así, con una corrutina, vigilas un servicio **sin bloquear a nadie**: las otras 2.000 corrutinas nunca se enteran de tu espera.

> 💡 **Ahora tú:** ¿y si fueran 2.000 monitores vigilando 2.000 servicios? Con asyncio no pasa nada: 2.000 corrutinas en un hilo. Con hilos, 2.000 hilos hundirían el sistema ([punto 7](/ApuntesPSP/11-asyncio-y-disponibilidad/07-threads-vs-asyncio)).

---

## 🔥 Fireside Chat: hilos vs asyncio

> *Dos modelos de concurrencia se sientan junto a la chimenea a resolver, de una vez, quién atiende mejor a los clientes.*

**Hilo**: — Yo soy multitarea de verdad. Tengo mi propia pila, mi propio contexto. El SO me gestiona.

**Asyncio**: — Yo soy multitarea cooperativa. Un solo hilo, pero cambio de tarea cuando una espera.

**Hilo**: — Si tengo 10.000 clientes, creo 10.000 hilos. El sistema sufre.

**Asyncio**: — Yo con 10.000 clientes uso un hilo y 10.000 corrutinas. Mucho más ligero.

**Hilo**: — Pero mis operaciones son bloqueantes de verdad. Si llamo a `time.sleep()`, otro hilo ejecuta.

**Asyncio**: — Mis operaciones son `await` — nunca bloqueo. El event loop decide qué toca.

**Hilo**: — Para servidores pequeños (<100 clientes), soy más simple.

**Asyncio**: — Para servidores con mucho I/O y muchas conexiones, soy imbatible.

> **Moraleja**: Hilos para lo simple y bloqueante; asyncio para escalar en I/O. Y si algo calcula a saco, ni uno ni otro: procesos.

---

## 🕵️ ¿Quién Soy?

1. Soy el gestor que decide qué corrutina se ejecuta en cada momento.
2. Soy la función declarada con `async def` que puede pausarse.
3. Soy la marca que le dice al event loop "esto va a tardar, ocúpate de otras cosas".
4. Soy la llamada que lanza varias corrutinas a la vez y espera a todas.
5. Soy el mensaje periódico que confirma que un servicio sigue vivo.
6. Soy la excepción que aparece cuando una operación supera su timeout.
7. Soy la espera que crece en cada reintento: 1, 2, 4, 8…

<details>
<summary>🔄 Respuestas</summary>

1. **El event loop**.
2. **La corrutina** (`async def`).
3. **`await`**.
4. **`asyncio.gather`**.
5. **El heartbeat** (latido).
6. **`asyncio.TimeoutError`**.
7. **El backoff exponencial** (`2 ** intento`).

</details>

---

## 🤬 CONRAD VS EL MUNDO: "el servidor se cuelga si un cliente no responde"

**CONRAD:** — "Clásico: montas un servidor asyncio, llega un cliente que no envía nada y *'el servidor se ha quedado colgado'*. Pues no: el servidor sigue, lo que pasa es que **una corrutina se queda esperando a un `read()` que nunca llega**. Cada cliente mudo es una corrutina ocupada para siempre. Sin timeout, un puñado de clientes mudos te llena el servicio de corrutinas zombie."

**CONRAD:** — "Y lo mejor: *'he puesto `asyncio.sleep(2)` y mi servidor va lento'*. ¡Pues claro! Y si te olvidas del `await` y escribes `asyncio.sleep(2)` sin más, la corrutina ni se pausa ni espera: la tarea no hace lo que crees. Revisa que cada llamada asíncrona tenga su `await`."

**CONRAD:** — "Y no me vengas con *'¿será que asyncio no vale?'*. El event loop va perfecto: el problema es que **no hay timeout** ni **backoff**. Envuelve el `read()` en `asyncio.wait_for`, añade un heartbeat, y el servicio no se cuelga ni se te muere en silencio. A diagnosticar."

---

## ⚡ Laboratorio de Tortura: el monitor de servicio definitivo

> **Duración:** 45 minutos
> **Herramienta:** Python 3 (solo stdlib: `asyncio`)

**Escenario:** construye un **monitor de servicio** que vigile `127.0.0.1:5000` con heartbeat (comprobar cada 5s), timeout (2s por comprobación) y backoff (2, 4, 8…). Acompáñalo de un servidor asyncio mínimo que se apague a los 15 segundos para que el monitor experimente una caída real.

**Tareas paso a paso:**

1. Escribe el servidor asyncio mínimo con `asyncio.start_server` que responda `b"OK"` y se detenga a los 15s con `asyncio.sleep(15)` ([punto 8](/ApuntesPSP/11-asyncio-y-disponibilidad/08-disponibilidad-y-practica)).
2. Escribe `comprobar_servicio()` con `asyncio.wait_for(asyncio.open_connection(...), timeout=2)` que devuelva `True`/`False` ([punto 4](/ApuntesPSP/11-asyncio-y-disponibilidad/04-timeouts)).
3. Escribe el monitor con `while True` + `asyncio.sleep(5)` y backoff `2 ** min(fallos, 4)` ([puntos 5 y 6](/ApuntesPSP/11-asyncio-y-disponibilidad/05-heartbeat)).
4. Ejecuta monitor y servidor en **terminales separadas**. El servidor se apaga solo a los 15s; el monitor debe pasar de `💚 disponible` a `💔 caído` con esperas crecientes.
5. Vuelve a arrancar el servidor a mano: el monitor debe volver a `💚` (se ha recuperado).

**Fallo intencionado:** cambia el timeout del monitor a **`timeout=0.1`** con el servidor funcionando. ¿Qué pasa? El monitor ve `TimeoutError` casi siempre, aunque el servicio esté sano: con 0.1s no le da tiempo a completar la conexión. Ahora tienes un monitor **falso positivo**: reporta caído un servicio que responde. Un timeout demasiado agresivo es tan malo como no tenerlo.

> **Pista 1:** el fallo no está en el servidor (que responde), está en el **timeout del monitor**: con `timeout=0.1` la comprobación no llega a completarse y salta `TimeoutError`. Es el mismo mecanismo del [punto 4](/ApuntesPSP/11-asyncio-y-disponibilidad/04-timeouts), pero usado mal.
>
> **Pista 2:** fíjate en el orden del [punto 8](/ApuntesPSP/11-asyncio-y-disponibilidad/08-disponibilidad-y-practica): heartbeat (¿compruebo?), timeout (¿respondo a tiempo?), backoff (¿cómo reintento?). Si el monitor dice "caído" con el servicio arriba, el problema es el **umbral**: el timeout debe ser mayor que el tiempo real de respuesta del servicio.

---

## 🏆 Logros de esta unidad

| Logro | Cómo conseguirlo |
|---|---|
| 🏅 **Loop Whisperer** | Explicar qué hace el event loop cuando una corrutina espera |
| 🏅 **Coroutine Master** | Escribir corrutinas con `async def` y `await` sin bloqueos |
| 🏅 **Gather Gatherer** | Lanzar tareas concurrentes con `gather` y `create_task` |
| 🏅 **Timeout Guardian** | Evitar que un servicio se cuelgue con `wait_for` |
| 🏅 **Heartbeat Keeper** | Añadir un latido que avise de que el servicio sigue vivo |
| 🏅 **Backoff Strategist** | Reintentar conexiones con espera exponencial |
| 🏅 **Model Decider** | Elegir con criterio entre hilos y asyncio |

---

## 🧠 Atrévete a Pensar

1. ¿Por qué asyncio usa un solo hilo y aún así atiende miles de conexiones?
2. ¿Qué pasa si olvidas el `await` delante de una operación asíncrona?
3. ¿Cuándo usarías threads y cuándo asyncio en producción?
4. ¿Por qué un timeout demasiado corto es peor que no tenerlo?
5. ¿Cómo combinarías heartbeat, timeout y backoff en un solo servicio?

<details>
<summary>💡 Soluciones</summary>

1. Porque el **event loop** alterna corrutinas en cada `await`: cuando una espera (I/O, timers), otra se ejecuta. Un solo hilo repartido entre miles de corrutinas ([puntos 1-3](/ApuntesPSP/11-asyncio-y-disponibilidad/01-event-loop)).
2. La operación **no se espera** (ni a veces se ejecuta): en el mejor caso es un fallo silencioso; en el peor, una corrutina que no hace lo que crees (por ejemplo, `asyncio.sleep(2)` sin `await` no pausa nada).
3. **Threads** para código bloqueante de terceros y pocos clientes; **asyncio** para I/O masivo y miles de conexiones; **procesos** para CPU-bound ([punto 7](/ApuntesPSP/11-asyncio-y-disponibilidad/07-threads-vs-asyncio)).
4. Porque produce **falsos positivos**: reporta caído un servicio que simplemente tarda un poco más de lo previsto. El timeout debe ser mayor que el tiempo real de respuesta (Laboratorio de Tortura).
5. Heartbeat para **comprobar** periódicamente, timeout para **cortar** lo que no responde, y backoff para **reintentar** sin machacar: el monitor del [punto 8](/ApuntesPSP/11-asyncio-y-disponibilidad/08-disponibilidad-y-practica).

</details>

---

## 🧩 Crucigrama de Bits

```
Horizontal:
1. El gestor que decide qué corrutina ejecutar (11 letras)
4. Función asíncrona que puede pausarse (10 letras)
6. La espera creciente de los reintentos (7 letras)
8. Mensaje periódico que confirma que un servicio vive (9 letras)

Vertical:
2. Llamada que lanza varias corrutinas a la vez y espera a todas (6 letras)
3. La marca "esto va a tardar, ocúpate de otras cosas" (5 letras)
5. Excepción que aparece al superar el tiempo límite (11 letras)
7. Tope de tiempo para una operación (7 letras)
```

<details>
<summary>📝 Soluciones</summary>

**Horizontal:** 1. EVENTLOOP, 4. CORRUTINA, 6. BACKOFF, 8. HEARTBEAT
**Vertical:** 2. GATHER, 3. AWAIT, 5. TIMEOUTERROR, 7. TIMEOUT

</details>

---

## 💬 Entrevista de trabajo

1. **"¿Qué es asyncio y en qué se diferencia de los hilos?"**
2. **"Explica qué hace el event loop con un ejemplo."**
3. **"¿Qué es una corrutina? ¿Qué diferencia `await` de un `sleep()` bloqueante?"**
4. **"¿Cómo harías que un servidor no se cuelgue nunca con un cliente mudo?"**
5. **"Diseña un servicio siempre disponible: ¿qué mecanismos le pones?"**

> 💡 **Cómo encararlas:** la 1 y la 4 son las "preguntas reina". Para la 1, recorre la cadena de la unidad: bloqueo → hilos (caros con miles) → event loop → corrutinas → gather/create_task → comparativa del [punto 7](/ApuntesPSP/11-asyncio-y-disponibilidad/07-threads-vs-asyncio). Para la 4, plantea `asyncio.wait_for(reader.read(...), timeout=10)` con `except asyncio.TimeoutError` y cierre de la conexión: el [punto 4](/ApuntesPSP/11-asyncio-y-disponibilidad/04-timeouts) es tu respuesta. Y la 5 es tu momento estrella: heartbeat + timeout + backoff. Si lo cuentas fluido, ya eres medio ingeniero de disponibilidad.

---

## 🤷 No hay preguntas tontas

> ❓ **¿Asyncio es más rápido que threads?**

Para I/O-bound tasks, sí, porque no hay cambio de contexto del SO. Para CPU-bound, no hay diferencia (ambos limitados por el GIL).

> ❓ **¿Puedo mezclar código síncrono con asyncio?**

Sí, con `loop.run_in_executor()`. Pero mejor si todo es asyncio.

> ❓ **¿Qué es una corrutina?**

Una función declarada con `async def` que puede pausarse con `await` y reanudarse después. No es un hilo, es una función que sabe esperar.

> ❓ **¿`await` bloquea el hilo?**

No. `await` le dice al event loop: "ahora no necesito CPU, ocúpate de otras corrutinas". Es **cooperativo**.

> ❓ **¿Cuándo usar threads y cuándo asyncio?**

- Threads: proyectos pequeños, librerías bloqueantes, simplicidad.
- Asyncio: muchos clientes concurrentes, mucho I/O, escalabilidad.

> ❓ **¿Y si me olvido del `await`?**

La operación no se espera (ni a veces se ejecuta): la corrutina no hace lo que crees. Es el fallo más típico al empezar con asyncio.

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
> *Y entonces llegó asyncio: un solo camarero, miles de mesas, ninguna espera quieta.*
>
> *El latido confirma que el servicio sigue vivo. El timeout corta lo que se cuelga. El backoff reintenta con cabeza.*
>
> *El viaje ha recorrido once hitos: 🚀 Proceso, 🔀 Hilo, 🔒 Sincronización, 🔌 TCP, 📡 UDP, 🌐 API REST, 🧪 APIs comerciales, 🔐 Hash, 🧬 Cifrado, 🏗️ Servidores concurrentes y ⏱️ asyncio y Disponibilidad.*

**Y con esto... ¡el viaje ha terminado! 🏁**

---

## ✅ Criterios de evaluación cubiertos (RA4e-g)

**RA4: Implementa servicios en red, desarrollando mecanismos de disponibilidad y servidores asíncronos.**

| CE | Criterio | Cubierto |
|---|---|---|
| e) | Implementa mecanismos de disponibilidad (heartbeat, reintentos, timeout) | ✅ Heartbeat, backoff y timeouts (puntos 4-6) + ⚡ Laboratorio |
| f) | Desarrolla servidores con asyncio | ✅ Corrutinas, gather y start_server (puntos 1-3 y 8) + ⚡ Laboratorio |
| g) | Compara modelos de concurrencia (hilos vs asyncio) | ✅ Comparativa (punto 7) + 🔥 Fireside Chat |

> RA4c (servidores concurrentes con hilos) y RA4d (ThreadPool) se cubrieron en la **U10 · Servidores Concurrentes**.

---

📚 [Volver al índice de la unidad](/ApuntesPSP/11-asyncio-y-disponibilidad) · **Anterior:** [08 · Disponibilidad y práctica](/ApuntesPSP/11-asyncio-y-disponibilidad/08-disponibilidad-y-practica)