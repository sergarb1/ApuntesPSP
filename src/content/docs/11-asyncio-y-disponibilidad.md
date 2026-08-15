---
title: U11 — asyncio y Disponibilidad
description: "Cerrar el viaje: asincronía, latidos y servicios siempre disponibles ⏱️"
nav_order: 11
---

<p><small>Cerrar el viaje: asincronía, latidos y servicios siempre disponibles ⏱️</small></p>

> 🗺️ **Ruta del viaje:** 🚀 Proceso → 🔀 Hilo → 🔒 Sincronización → 🔌 TCP → 📡 UDP → 🌐 API REST → 🧪 APIs comerciales → 🔐 Hash → 🧬 Cifrado → 🏗️ Servidores → ⏱️ **asyncio y Disponibilidad**

---

> "Asyncio es como un cocinero que, mientras espera a que hierva el agua, corta verduras. En vez de quedarse mirando la olla, hace otras cosas."

En la U10 construiste servidores concurrentes con hilos: un hilo por cliente o un ThreadPool. Funcionan, pero cada hilo cuesta memoria y contexto de sistema. En esta unidad cambiarás de modelo: **asyncio**, un solo hilo que coordina miles de tareas cooperativas, y las herramientas de **disponibilidad** (heartbeat, timeouts y backoff) que mantienen un servicio vivo cuando todo falla alrededor.

También aprenderás a que un servidor **nunca se cuelgue** con un cliente mudo (timeout), a que **avise** de que sigue vivo (heartbeat) y a que **reintente** con cabeza cuando un servicio se cae (backoff). El siguiente tema ya no existe: esta es la última unidad del viaje, y cierras con un servidor asyncio robusto que no se bloquea, se vigila solo y se recupera.

Esta unidad se lee como un **libro de 9 capítulos**: los 8 primeros son teoría en progresión y el 9º aterriza todo en la práctica.

---

## 🎯 Objetivo de la unidad

Al terminar, serás capaz de:

- Explicar qué es el **event loop** y cómo coordina tareas asíncronas sin bloquear.
- Definir y usar **corrutinas** con `async def` y `await`.
- Lanzar tareas concurrentes con `asyncio.create_task` y `asyncio.gather`.
- Evitar que un servicio se cuelgue usando **timeouts** con `asyncio.wait_for`.
- Implementar **heartbeats** que verifiquen que un servidor sigue vivo.
- Diseñar **reintentos con backoff exponencial** para conectar ante fallos transitorios.
- Comparar **hilos vs asyncio** y decidir cuál usar en cada escenario.
- Montar un **monitor de servicio** que combine heartbeat, timeout y backoff.
- Aplicar los mecanismos de disponibilidad (RA4e), los servidores asyncio (RA4f) y la comparativa de modelos (RA4g).

---

## 🗺️ Mapa de la unidad

| Punto | Qué aprenderás | Nivel |
|---|---|---|
| [01 · Event Loop](/ApuntesPSP/11-asyncio-y-disponibilidad/01-event-loop) | El gestor de tareas que no se bloquea nunca | Todos |
| [02 · Corrutinas](/ApuntesPSP/11-asyncio-y-disponibilidad/02-corrutinas) | `async def`, `await` y la función que sabe esperar | Todos |
| [03 · create_task y gather](/ApuntesPSP/11-asyncio-y-disponibilidad/03-create-task-y-gather) | Lanzar varias tareas "a la vez" de verdad | Todos |
| [04 · Timeouts](/ApuntesPSP/11-asyncio-y-disponibilidad/04-timeouts) | `wait_for` para que nada se cuelgue para siempre | Todos |
| [05 · Heartbeat](/ApuntesPSP/11-asyncio-y-disponibilidad/05-heartbeat) | El latido que confirma que el servicio sigue vivo | Todos |
| [06 · Backoff](/ApuntesPSP/11-asyncio-y-disponibilidad/06-backoff) | Reintentos con espera exponencial (1, 2, 4, 8…) | Todos |
| [07 · Threads vs asyncio](/ApuntesPSP/11-asyncio-y-disponibilidad/07-threads-vs-asyncio) | La comparativa definitiva de modelos de concurrencia | Todos |
| [08 · Disponibilidad y práctica](/ApuntesPSP/11-asyncio-y-disponibilidad/08-disponibilidad-y-practica) | El monitor de servicio completo y Aprieta el lápiz | Todos |
| [09 · Head First (cierre)](/ApuntesPSP/11-asyncio-y-disponibilidad/09-head-first) | Sé la Corrutina, Fireside, Laboratorio de Tortura… | Todos |

> 📖 **Flujo de lectura:** los 8 primeros puntos son teoría en progresión. El 9º es el aterrizaje práctico: léelo justo después del 8º y antes de abrir los boletines.

---

## 📝 Boletines de la unidad

> Practica con los pares del curso: empezar siempre el resuelto para ver el estilo y luego intentar el por-resolver.

<div class="ejercicio-links">
  <a href="/ApuntesPSP/boletines/boletin-u11-inicial-resuelto" class="elink">✅ Inicial resuelto</a>
  <a href="/ApuntesPSP/boletines/boletin-u11-inicial" class="elink">🟢 Inicial por resolver</a>
  <a href="/ApuntesPSP/boletines/boletin-u11-avanzado-resuelto" class="elink">💪 Avanzado resuelto</a>
  <a href="/ApuntesPSP/boletines/boletin-u11-avanzado" class="elink">⭐ Avanzado por resolver</a>
</div>

---

## ✅ Criterios de evaluación cubiertos (RA4e-g)

**RA4: Implementa servicios en red, desarrollando mecanismos de disponibilidad y servidores asíncronos.**

| CE | Criterio | Dónde se cubre |
|---|---|---|
| e) | Implementa mecanismos de disponibilidad (heartbeat, reintentos, timeout) | ✅ Puntos 4-6 y 8 + ⚡ Laboratorio (punto 9) |
| f) | Desarrolla servidores con asyncio | ✅ Puntos 1-3 y 8 + ⚡ Laboratorio (punto 9) |
| g) | Compara modelos de concurrencia (hilos vs asyncio) | ✅ Punto 7 + 🔥 Fireside Chat (punto 9) |

> RA4c (servidores concurrentes con hilos) y RA4d (ThreadPool) se cubren en la **U10 · Servidores Concurrentes**.

---

## 🚪 ¿Por dónde empiezo?

¿Vienes de la U10 y dominas los servidores concurrentes? Perfecto, ese es el trampolín ideal: repasa la [U10 · Servidores Concurrentes](/ApuntesPSP/10-servidores-concurrentes) para tener frescos el hilo por cliente, el ThreadPool y el problema del bloqueo, y arranca en el [punto 1](/ApuntesPSP/11-asyncio-y-disponibilidad/01-event-loop), que parte justo del problema de la espera que dejaste planteado.

¿Ya sabes qué es asyncio y solo quieres la disponibilidad? Ve directo al [punto 4](/ApuntesPSP/11-asyncio-y-disponibilidad/04-timeouts) y de ahí a los puntos 5 y 6. Pero si vienes de cero, no te saltes los puntos 1 a 3: el event loop y las corrutinas son la base de todo lo demás.

**📍 Primer punto:** [01 · Event Loop](/ApuntesPSP/11-asyncio-y-disponibilidad/01-event-loop)