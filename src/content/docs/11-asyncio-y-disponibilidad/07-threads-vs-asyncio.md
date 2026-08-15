---
title: 07 — Threads vs asyncio
description: La comparativa definitiva de modelos de concurrencia 🥊
---

<p><small>La comparativa definitiva de modelos de concurrencia 🥊</small></p>

> 🗺️ **Estás en:** ⏱️ **U11 · asyncio y Disponibilidad** → 07 · Threads vs asyncio

---

## 📬 La idea en una frase

> Los **hilos** son multitarea de verdad gestionada por el SO; **asyncio** es multitarea cooperativa en un solo hilo. Para servidores con mucho I/O y miles de conexiones, asyncio gana; para simplicidad con pocos clientes, los hilos.

---

## 🥊 El ring de los conceptos

**Thread**: "Yo soy multitarea de verdad. Tengo mi propia pila, mi propio contexto. El SO me gestiona."

**Asyncio**: "Yo soy multitarea cooperativa. Un solo hilo, pero cambio de tarea cuando una espera."

**Thread**: "Si tengo 10.000 clientes, creo 10.000 hilos. El sistema sufre."

**Asyncio**: "Yo con 10.000 clientes uso un hilo y 10.000 corrutinas. Mucho más ligero."

**Thread**: "Pero mis operaciones son bloqueantes de verdad. Si llamo a `time.sleep()`, otro hilo ejecuta."

**Asyncio**: "Mis operaciones son `await` — nunca bloqueo. El event loop decide qué toca."

**Thread**: "Para servidores pequeños (<100 clientes), soy más simple."

**Asyncio**: "Para servidores con mucho I/O y muchas conexiones, soy imbatible."

---

## ⚖️ La tabla comparativa

| Característica | Threads | Asyncio |
|----------------|---------|---------|
| Nº de hilos | Varios (gestión del SO) | 1 (event loop) |
| Cambio de contexto | Gestionado por el SO | Cooperativo (en await) |
| Escalabilidad | Media (límite de hilos) | Alta (miles de conexiones) |
| Complejidad | Baja (simple) | Media (curva de aprendizaje) |
| CPU-bound | No sirve (GIL) | No sirve |
| I/O-bound | Sí funciona | Excelente |

**Dos reglas de oro de la tabla:**

- **I/O-bound** (esperas de red, disco, timers): asyncio brilla. Las corrutinas esperan sin ocupar hilos.
- **CPU-bound** (cálculo puro, bucles pesados): ni threads ni asyncio con el **GIL**. Para eso están los procesos (`multiprocessing`, TEMA 01).

---

## 🧭 ¿Cuándo usar cada uno?

| Situación | Elige |
|---|---|
| Servidor con pocos clientes (< 100) y quieres simplicidad | Threads |
| Servidor con miles de conexiones y mucho I/O | **Asyncio** |
| Código de terceros bloqueante (`requests`, `time.sleep`) | Threads (o `run_in_executor`) |
| Todo el stack propio, operaciones con `await` | **Asyncio** |
| Cálculo intensivo de CPU | Ninguno: procesos (multiprocessing) |

> 💡 Puedes **mezclar** ambos: `loop.run_in_executor()` lleva código bloqueante a un hilo real mientras el event loop sigue. Pero como norma, "mejor si todo es asyncio": un solo modelo mental.

---

## 🧠 Mini-chequeo

1. ¿Quién gestiona el cambio de contexto en threads? ¿Y en asyncio?
2. ¿Por qué asyncio no sirve para CPU-bound?
3. ¿Cuándo es más simple usar threads?

<details>
<summary>🔄 Respuestas</summary>

1. En threads, **el sistema operativo**; en asyncio, **el event loop** (cooperativo, en cada `await`).
2. Por el **GIL** (Global Interpreter Lock): las corrutinas corren en un solo hilo, así que el cálculo pesado no gana nada. Para CPU-bound se usan **procesos** (TEMA 01).
3. Con **pocos clientes** (< 100) y operaciones bloqueantes: el modelo mental de un hilo por cliente es más directo que las corrutinas.

</details>

---

## ✅ Resumen en 3 frases

- Threads = **multitarea del SO**; asyncio = **multitarea cooperativa en un hilo**.
- Para I/O-bound con muchas conexiones, **asyncio es imbatible**; para pocos clientes, los hilos son más simples.
- Ninguno sirve para CPU-bound (GIL): ahí mandan los **procesos**.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| Multitarea del SO | El sistema operativo decide qué hilo ejecuta |
| Multitarea cooperativa | Las corrutinas ceden el control voluntariamente en cada await |
| GIL | Candado de Python que limita la ejecución paralela de hilos |
| I/O-bound | Tarea que pasa la mayor parte del tiempo esperando |
| CPU-bound | Tarea que pasa la mayor parte del tiempo calculando |
| run_in_executor | Puente para llevar código bloqueante a un hilo real |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/11-asyncio-y-disponibilidad) · **Anterior:** [06 · Backoff](/ApuntesPSP/11-asyncio-y-disponibilidad/06-backoff) · **Siguiente:** [08 · Disponibilidad y práctica](/ApuntesPSP/11-asyncio-y-disponibilidad/08-disponibilidad-y-practica)