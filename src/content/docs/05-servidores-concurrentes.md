---
title: UD 6 — Servidores concurrentes con Python
description: "Servidores que atienden a muchos clientes a la vez 🏗️"
nav_order: 05
---

<p><small>Servidores que atienden a muchos clientes a la vez 🏗️</small></p>

---

> "Un servidor secuencial atiende a un cliente cada vez. Los demás esperan. Un servidor concurrente atiende a todos a la vez. Como un camarero con 10 mesas."

Hasta ahora has construido servidores TCP que atienden **de uno en uno**: si un cliente tarda 3 segundos, los que llegan detrás esperan. En esta unidad darás el salto a la **concurrencia**: primero lanzando un **hilo por cada cliente** y después con un **ThreadPoolExecutor**, el equipo de hilos reutilizables que usa la industria.

También medirás cuánto ganas con cada enfoque mediante un **benchmark**, aprenderás a proteger con **Lock** el estado compartido del servidor y cerrarás montando un servidor concurrente completo.

---

## 🎯 Objetivo de la unidad

Al terminar, serás capaz de:

- Explicar por qué un servidor secuencial solo atiende un cliente cada vez.
- Implementar un **servidor multihilo** que lance un hilo por cada conexión.
- Gestionar un **ThreadPoolExecutor** con un número fijo de hilos reutilizables.
- Medir el rendimiento de un servidor con un **benchmark**.
- Proteger con **Lock** las variables compartidas entre los hilos del servidor.
- Montar un **servidor concurrente completo** con su lanzador de clientes.

---

## 🗺️ Mapa de la unidad

| Punto | Qué aprenderás | Nivel |
|---|---|---|
| [01 · Servidor secuencial](/ApuntesPSP/05-servidores-concurrentes/01-servidor-secuencial) | El servidor que atiende de uno en uno y su límite | Todos |
| [02 · El problema de la espera](/ApuntesPSP/05-servidores-concurrentes/02-el-problema-de-la-espera) | Por qué un cliente lento congela a toda la cola | Todos |
| [03 · Hilo por cliente](/ApuntesPSP/05-servidores-concurrentes/03-hilo-por-cliente) | Lanzar un hilo por cada conexión | Todos |
| [04 · ThreadPoolExecutor](/ApuntesPSP/05-servidores-concurrentes/04-threadpoolexecutor) | Un equipo fijo de hilos reutilizables | Todos |
| [05 · Benchmark](/ApuntesPSP/05-servidores-concurrentes/05-benchmark) | Medir cuánto ganas con la concurrencia | Todos |
| [06 · Sincronización en servidores](/ApuntesPSP/05-servidores-concurrentes/06-sincronizacion-en-servidores) | El Lock para el estado compartido | Todos |
| [07 · Límites y buenas prácticas](/ApuntesPSP/05-servidores-concurrentes/07-limites-y-buenas-practicas) | Cuántos hilos puedes crear | Todos |
| [08 · Servidor concurrente completo](/ApuntesPSP/05-servidores-concurrentes/08-servidor-concurrente-completo) | Todo junto: servidor, lanzador y ejercicios | Todos |
| [09 · Cierre](/ApuntesPSP/05-servidores-concurrentes/09-cierre) | Sé el servidor, Fireside, Laboratorio de tortura… | Todos |

---

## 📝 Boletines de la unidad

> Practica con los pares del curso: empezar siempre el resuelto para ver el estilo y luego intentar el por-resolver.

<div class="ejercicio-links">
  <a href="/ApuntesPSP/boletines/boletin-u05-inicial" class="elink">🟢 Inicial por resolver</a>
  <a href="/ApuntesPSP/boletines/boletin-u05-inicial-resuelto" class="elink">✅ Inicial resuelto</a>
  <a href="/ApuntesPSP/boletines/boletin-u05-avanzado" class="elink">⭐ Avanzado por resolver</a>
  <a href="/ApuntesPSP/boletines/boletin-u05-avanzado-resuelto" class="elink">💪 Avanzado resuelto</a>
</div>

---

## ✅ Criterios de evaluación cubiertos (RA4c-d)

**RA4: Implementa servicios en red con servidores concurrentes.**

| CE | Criterio | Dónde se cubre |
|---|---|---|
| RA4c | Implementa servidores concurrentes con hilos | ✅ Puntos 1-3 y 8 + ⚡ Laboratorio (punto 9) |
| RA4d | Gestiona pools de hilos (ThreadPoolExecutor) | ✅ Puntos 4-5 y 8 + ⚡ Laboratorio (punto 9) |

> RA4a-b (APIs REST y comerciales) se cubren en las **UD 7 y UD 8**. RA4e-g (asyncio) se cubren en la **UD 10**.

---

## 🚪 ¿Por dónde empiezo?

¿Vienes de la UD 5 y dominas sockets TCP? Empieza por el [punto 1](/ApuntesPSP/05-servidores-concurrentes/01-servidor-secuencial), que parte de un servidor TCP normal y corriente.

¿Ya sabes escribir servidores y solo quieres el salto a la concurrencia? Saltar al [punto 3](/ApuntesPSP/05-servidores-concurrentes/03-hilo-por-cliente) o al [punto 4](/ApuntesPSP/05-servidores-concurrentes/04-threadpoolexecutor).

**📍 Primer punto:** [01 · Servidor secuencial](/ApuntesPSP/05-servidores-concurrentes/01-servidor-secuencial)
**⏭️ Al acabar la unidad, continúa en [UD 7 · HTTP y APIs REST](/ApuntesPSP/06-http-y-apis-rest).**
