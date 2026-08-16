---
title: U10 — Servidores Concurrentes
description: Servidores que atienden a muchos clientes a la vez 🏗️
nav_order: 10
---

<p><small>Servidores que atienden a muchos clientes a la vez 🏗️</small></p>

> 🗺️ **Ruta del viaje:** 🚀 Proceso → 🔀 Hilo → 🔒 Sincronización → 🔌 TCP → 📡 UDP → 🌐 API REST → 🧪 APIs comerciales → 🔐 Hash → 🧬 Cifrado → 🏗️ **Servidores Concurrentes** → ⏱️ asyncio

---

> "Un servidor secuencial atiende a un cliente cada vez. Los demás esperan. Un servidor concurrente atiende a todos a la vez. Como un camarero con 10 mesas."

Hasta ahora has construido servidores TCP que atienden **de uno en uno**: si un cliente tarda 3 segundos en procesarse, los que llegan detrás esperan su turno en una cola invisible. Esos servidores funcionan, pero se quedan cortos en cuanto el tráfico crece. En esta unidad darás el salto a la **concurrencia**: primero lanzando un **hilo por cada cliente** y después con un **ThreadPoolExecutor**, el equipo de hilos reutilizables que usa la industria.

También medirás cuánto ganas con cada enfoque mediante un **benchmark**, aprenderás a proteger con **Lock** el estado compartido del servidor (esos contadores globales que varios hilos tocan a la vez) y cerrarás montando un servidor concurrente completo con su lanzador de clientes. El siguiente tema, [U11 · asyncio y Disponibilidad](/ApuntesPSP/11-asyncio-y-disponibilidad), tomará el relevo con un modelo aún más ligero para miles de conexiones.

Esta unidad se lee como un **libro de 9 capítulos**: los 8 primeros son teoría en progresión y el 9º aterriza todo en la práctica.

---

## 🎯 Objetivo de la unidad

Al terminar, serás capaz de:

- Explicar por qué un servidor secuencial solo atiende un cliente cada vez y cuál es su límite real.
- Identificar el problema del **cliente lento**: cómo bloquea a todos los que esperan en la cola.
- Implementar un **servidor multihilo** que lanza un hilo por cada conexión entrante.
- Gestionar un **ThreadPoolExecutor** con un número fijo de hilos reutilizables.
- Medir el rendimiento de un servidor con un **benchmark** de N clientes simultáneos.
- Proteger con **Lock** las variables compartidas entre los hilos del servidor.
- Conocer los **límites del sistema** (número de hilos, context switch) y aplicar buenas prácticas.
- Montar un **servidor concurrente completo** con su lanzador de clientes.
- Decidir con criterio cuándo usar hilo por cliente y cuándo ThreadPool en producción.

---

## 🗺️ Mapa de la unidad

| Punto | Qué aprenderás | Nivel |
|---|---|---|
| [01 · Servidor secuencial](/ApuntesPSP/10-servidores-concurrentes/01-servidor-secuencial) | El servidor que atiende de uno en uno y su límite | Todos |
| [02 · El problema de la espera](/ApuntesPSP/10-servidores-concurrentes/02-el-problema-de-la-espera) | Por qué un cliente lento congela a toda la cola | Todos |
| [03 · Hilo por cliente](/ApuntesPSP/10-servidores-concurrentes/03-hilo-por-cliente) | Lanzar un hilo por cada conexión y volver a escuchar | Todos |
| [04 · ThreadPoolExecutor](/ApuntesPSP/10-servidores-concurrentes/04-threadpoolexecutor) | Un equipo fijo de hilos reutilizables y el Pool Puzzle | Todos |
| [05 · Benchmark](/ApuntesPSP/10-servidores-concurrentes/05-benchmark) | Medir cuánto ganas con la concurrencia | Todos |
| [06 · Sincronización en servidores](/ApuntesPSP/10-servidores-concurrentes/06-sincronizacion-en-servidores) | El Lock para el estado compartido entre hilos | Todos |
| [07 · Límites y buenas prácticas](/ApuntesPSP/10-servidores-concurrentes/07-limites-y-buenas-practicas) | Cuántos hilos puedes crear y cómo hacerlo bien | Todos |
| [08 · Servidor concurrente completo](/ApuntesPSP/10-servidores-concurrentes/08-servidor-concurrente-completo) | Todo junto: servidor, lanzador y Aprieta el lápiz | Todos |
| [09 · Cierre](/ApuntesPSP/10-servidores-concurrentes/09-cierre) | Sé el Servidor, Fireside, Laboratorio de Tortura… | Todos |

> 📖 **Flujo de lectura:** los 8 primeros puntos son teoría en progresión. El 9º es el aterrizaje práctico: léelo justo después del 8º y antes de abrir los boletines.

---

## 📝 Boletines de la unidad

> Practica con los pares del curso: empezar siempre el resuelto para ver el estilo y luego intentar el por-resolver.

<div class="ejercicio-links">
  <a href="/ApuntesPSP/boletines/boletin-u10-inicial-resuelto" class="elink">✅ Inicial resuelto</a>
  <a href="/ApuntesPSP/boletines/boletin-u10-inicial" class="elink">🟢 Inicial por resolver</a>
  <a href="/ApuntesPSP/boletines/boletin-u10-avanzado-resuelto" class="elink">💪 Avanzado resuelto</a>
  <a href="/ApuntesPSP/boletines/boletin-u10-avanzado" class="elink">⭐ Avanzado por resolver</a>
</div>

---

## ✅ Criterios de evaluación cubiertos (RA4c-d)

**RA4: Implementa servicios en red, desarrollando servidores concurrentes capaces de atender a varios clientes simultáneamente.**

| CE | Criterio | Dónde se cubre |
|---|---|---|
| c) | Implementa servidores concurrentes con hilos | ✅ Puntos 1-3 y 8 + ⚡ Laboratorio (punto 9) |
| d) | Gestiona pools de hilos (ThreadPoolExecutor) | ✅ Puntos 4-5 y 8 + ⚡ Laboratorio (punto 9) |

> RA4a-b (APIs REST y comerciales) se cubren en las **U06 y U07**. RA4e-g (asyncio, disponibilidad, comparativa de modelos) se cubren en la **U11 · asyncio y Disponibilidad**.

---

## 🚪 ¿Por dónde empiezo?

¿Vienes de la U09 y dominas el cifrado moderno? Ese no es el trampolín que necesitas: lo que traes fresco de las [U04](/ApuntesPSP/04-sockets-tcp) y [U05](/ApuntesPSP/05-sockets-udp-y-protocolos) son los sockets TCP cliente-servidor. Repasa el `accept()`, el `recv()` y el `sendall()` de la U04 y arranca en el [punto 1](/ApuntesPSP/10-servidores-concurrentes/01-servidor-secuencial), que parte justo de un servidor TCP normal y corriente.

¿Ya sabes escribir servidores y solo quieres el salto a la concurrencia? Ve directo al [punto 3](/ApuntesPSP/10-servidores-concurrentes/03-hilo-por-cliente) o, si tienes prisa por el material "de producción", al [punto 4](/ApuntesPSP/10-servidores-concurrentes/04-threadpoolexecutor). Pero si vienes de cero, no te saltes los puntos 1 y 2: entender el problema del servidor secuencial es la base para valorar todo lo demás.

**📍 Primer punto:** [01 · Servidor secuencial](/ApuntesPSP/10-servidores-concurrentes/01-servidor-secuencial)  
**⏭️ Al acabar la unidad, continúa en [U11 · asyncio y Disponibilidad](/ApuntesPSP/11-asyncio-y-disponibilidad).**