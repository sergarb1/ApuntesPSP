---
title: U03 — Sincronización entre Hilos
description: "Cuando los hilos se pisan: locks, semáforos y barreras 🔒"
nav_order: 03
---

<p><small>Cuando los hilos se pisan: locks, semáforos y barreras 🔒</small></p>

> 🗺️ **Ruta del viaje:** 🚀 Proceso → 🔀 Hilo → 🔒 **Sincronización entre Hilos** → 🔌 TCP → 📡 UDP → 🌐 API REST → 🧪 APIs comerciales → 🔐 Hash → 🧬 Cifrado → 🏗️ Servidores → ⏱️ asyncio

---

En la U02 lanzaste hilos por todas partes y comprobaste que los hilos de un mismo proceso **comparten memoria**. Eso es fantástico… y peligroso: si dos hilos tocan la misma variable a la vez, los resultados se descontrolan. Esta unidad pone orden en el caos: aprenderás qué es una **condición de carrera**, por qué `contador += 1` esconde una trampa de 3 pasos, y cómo los **locks**, **semáforos**, **barreras** y **condiciones** del módulo `threading` convierten el desorden en coordinación.

Verás, además, el patrón de **productor-consumidor** resuelto con `Condition`, cómo evitar los temidos **deadlocks** con las reglas del oficio, y un cierre práctico con laboratorio. Los boletines de la unidad te permitirán medir cuánto has aprendido.

Esta unidad se lee como un **libro de 9 capítulos**: los 8 primeros son teoría en progresión y el 9º aterriza todo en la práctica.

---

## 🎯 Objetivo de la unidad

Al terminar, serás capaz de:

- Explicar qué es una **condición de carrera** y por qué `contador += 1` no es una operación atómica.
- Proteger secciones críticas con `threading.Lock` usando `with lock:`.
- Distinguir `Lock` de `RLock` y saber cuándo necesitas el reentrante.
- Limitar el acceso concurrente a un recurso con `Semaphore`.
- Coordinar fases de trabajo en paralelo con `Barrier`.
- Sincronizar hilos con `Condition` (`wait` / `notify` / `notify_all`).
- Implementar el patrón **productor-consumidor** con una cola compartida.
- Evitar **deadlocks** con buenas prácticas (orden de locks, `with`, `RLock`).
- Decidir qué mecanismo de sincronización usar en cada situación.

---

## 🗺️ Mapa de la unidad

| Punto | Qué aprenderás | Nivel |
|---|---|---|
| [01 · Condición de carrera](/ApuntesPSP/03-sincronizacion-entre-hilos/01-condicion-de-carrera) | Qué pasa cuando dos hilos se pisan la memoria compartida | Todos |
| [02 · Lock](/ApuntesPSP/03-sincronizacion-entre-hilos/02-lock) | Exclusión mutua: `acquire`, `release` y `with lock:` | Todos |
| [03 · RLock](/ApuntesPSP/03-sincronizacion-entre-hilos/03-rlock) | El lock reentrante para cuando el mismo hilo entra dos veces | Todos |
| [04 · Semaphore](/ApuntesPSP/03-sincronizacion-entre-hilos/04-semaphore) | El aforo máximo: hasta N hilos dentro a la vez | Todos |
| [05 · Barrier](/ApuntesPSP/03-sincronizacion-entre-hilos/05-barrier) | Nadie avanza hasta que llegan todos: fases sincronizadas | Todos |
| [06 · Condition](/ApuntesPSP/03-sincronizacion-entre-hilos/06-condition) | Esperar a que otro hilo avise: `wait` y `notify` | Todos |
| [07 · Productor-Consumidor](/ApuntesPSP/03-sincronizacion-entre-hilos/07-productor-consumidor) | El patrón clásico con cola compartida, de la teoría al código | Todos |
| [08 · Buenas prácticas](/ApuntesPSP/03-sincronizacion-entre-hilos/08-buenas-practicas) | Deadlocks, orden de locks, el ring final y a practicar | Todos |
| [09 · Cierre](/ApuntesPSP/03-sincronizacion-entre-hilos/09-cierre) | Sé el lock, Fireside, Laboratorio de tortura, Crucigrama… | Todos |

> 📖 **Flujo de lectura:** los 8 primeros puntos son teoría en progresión. El 9º es el aterrizaje práctico: léelo justo después del 8º y antes de abrir los boletines.

---

## 📝 Boletines de la unidad

> Practica con los pares del curso: empezar siempre el resuelto para ver el estilo y luego intentar el por-resolver.

<div class="ejercicio-links">
  <a href="/ApuntesPSP/boletines/boletin-u03-inicial-resuelto" class="elink">✅ Inicial resuelto</a>
  <a href="/ApuntesPSP/boletines/boletin-u03-inicial" class="elink">🟢 Inicial por resolver</a>
  <a href="/ApuntesPSP/boletines/boletin-u03-avanzado-resuelto" class="elink">💪 Avanzado resuelto</a>
  <a href="/ApuntesPSP/boletines/boletin-u03-avanzado" class="elink">⭐ Avanzado por resolver</a>
</div>

---

## ✅ Criterios de evaluación cubiertos (RA2)

**RA2: Gestiona la programación de hilos y su sincronización.**

| CE | Criterio | Dónde se cubre |
|---|---|---|
| RA2c | Sincroniza hilos con Lock | ✅ Puntos 2, 3 y 7 + ⚡ Laboratorio (punto 9) |
| RA2d | Usa semáforos para acceso controlado | ✅ Punto 4 + ⚡ Laboratorio (punto 9) |
| RA2g | Evita condiciones de carrera | ✅ Puntos 1, 2 y 8 + ⚡ Laboratorio (punto 9) |

> RA2a (estructura de un hilo), RA2b (crear y lanzar hilos), RA2e (esperas con `join()` y `sleep()`), RA2f (hilos daemon) y RA2h (GIL) se cubren en la **U02 · Hilos Fundamentos**.

---

## 🚪 ¿Por dónde empiezo?

¿Vienes de la U02 y ya sabes lanzar hilos y esperarlos con `join()`? Perfecto, ese es el trampolín ideal: repasa la [U02 · Hilos Fundamentos](/ApuntesPSP/02-hilos-fundamentos) para tener frescos `Thread`, `start()`, `join()` y el concepto de hilo daemon, y arranca en el [punto 1](/ApuntesPSP/03-sincronizacion-entre-hilos/01-condicion-de-carrera), que parte justo de ahí: el momento en que dos hilos comparten memoria y todo se descontrola.

¿Ya sabes qué es un lock y solo necesitas el semáforo o la barrera? Puedes saltar a los [puntos 4](/ApuntesPSP/03-sincronizacion-entre-hilos/04-semaphore), [5](/ApuntesPSP/03-sincronizacion-entre-hilos/05-barrier) y [6](/ApuntesPSP/03-sincronizacion-entre-hilos/06-condition). Pero si vienes de cero en sincronización, no te saltes los puntos 1 a 3: la condición de carrera y el lock son la base de todo lo demás.

**📍 Primer punto:** [01 · Condición de carrera](/ApuntesPSP/03-sincronizacion-entre-hilos/01-condicion-de-carrera)  
**⏭️ Al acabar la unidad, continúa en [U04 · Sockets TCP](/ApuntesPSP/04-sockets-tcp).**