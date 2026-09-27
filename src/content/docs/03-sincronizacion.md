---
title: UD 4 — Sincronización en Python
description: "Cuando los hilos se pisan: locks, semáforos y barreras 🔒"
nav_order: 03
---

<p><small>Cuando los hilos se pisan: locks, semáforos y barreras 🔒</small></p>

---

En la UD 3 lanzaste hilos por todas partes y comprobaste que los hilos de un mismo proceso **comparten memoria**. Eso es fantástico… y peligroso: si dos hilos tocan la misma variable a la vez, los resultados se descontrolan. Esta unidad pone orden en el caos: aprenderás qué es una **condición de carrera**, por qué `contador += 1` esconde una trampa de 3 pasos, y cómo los **locks**, **semáforos**, **barreras** y **condiciones** del módulo `threading` convierten el desorden en coordinación.

Verás, además, el patrón de **productor-consumidor** resuelto con `Condition`, cómo evitar los temidos **deadlocks** con las reglas del oficio, y un cierre práctico con laboratorio.

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
- Evitar **deadlocks** con buenas prácticas.
- Decidir qué mecanismo de sincronización usar en cada situación.

---

## 🗺️ Mapa de la unidad

| Punto | Qué aprenderás | Nivel |
|---|---|---|
| [01 · Condición de carrera](/ApuntesPSP/03-sincronizacion/01-condicion-de-carrera) | Qué pasa cuando dos hilos se pisan la memoria compartida | Todos |
| [02 · Lock](/ApuntesPSP/03-sincronizacion/02-lock) | Exclusión mutua: `acquire`, `release` y `with lock:` | Todos |
| [03 · RLock](/ApuntesPSP/03-sincronizacion/03-rlock) | El lock reentrante para cuando el mismo hilo entra dos veces | Todos |
| [04 · Semaphore](/ApuntesPSP/03-sincronizacion/04-semaphore) | El aforo máximo: hasta N hilos dentro a la vez | Todos |
| [05 · Barrier](/ApuntesPSP/03-sincronizacion/05-barrier) | Nadie avanza hasta que llegan todos | Todos |
| [06 · Condition](/ApuntesPSP/03-sincronizacion/06-condition) | Esperar a que otro hilo avise: `wait` y `notify` | Todos |
| [07 · Productor-Consumidor](/ApuntesPSP/03-sincronizacion/07-productor-consumidor) | El patrón clásico con cola compartida | Todos |
| [08 · Buenas prácticas](/ApuntesPSP/03-sincronizacion/08-buenas-practicas) | Deadlocks, orden de locks | Todos |
| [09 · Cierre](/ApuntesPSP/03-sincronizacion/09-cierre) | Sé el lock, Fireside, Laboratorio de tortura… | Todos |

---

## 📝 Boletines de la unidad

> Practica con los pares del curso: empezar siempre el resuelto para ver el estilo y luego intentar el por-resolver.

<div class="ejercicio-links">
  <a href="/ApuntesPSP/boletines/boletin-u03-inicial" class="elink">🟢 Inicial por resolver</a>
  <a href="/ApuntesPSP/boletines/boletin-u03-inicial-resuelto" class="elink">✅ Inicial resuelto</a>
  <a href="/ApuntesPSP/boletines/boletin-u03-avanzado" class="elink">⭐ Avanzado por resolver</a>
  <a href="/ApuntesPSP/boletines/boletin-u03-avanzado-resuelto" class="elink">💪 Avanzado resuelto</a>
</div>

---

## ✅ Criterios de evaluación cubiertos (RA2)

**RA2: Gestiona la programación de hilos y su sincronización.**

| CE | Criterio | Dónde se cubre |
|---|---|---|
| RA2c | Sincroniza hilos con Lock | ✅ Puntos 2, 3 y 7 + ⚡ Laboratorio (punto 9) |
| RA2d | Usa semáforos para acceso controlado | ✅ Punto 4 + ⚡ Laboratorio (punto 9) |
| RA2g | Evita condiciones de carrera | ✅ Puntos 1, 2 y 8 + ⚡ Laboratorio (punto 9) |

> RA2a, RA2b, RA2e, RA2f y RA2h se cubren en la **UD 3 · Hilos y concurrencia**.

---

## 🚪 ¿Por dónde empiezo?

¿Vienes de la UD 3 y ya sabes lanzar hilos y esperarlos con `join()`? Empieza por el [punto 1](/ApuntesPSP/03-sincronizacion/01-condicion-de-carrera), que parte de la condición de carrera.

¿Ya sabes qué es un lock y solo necesitas el semáforo o la barrera? Saltar a los [puntos 4](/ApuntesPSP/03-sincronizacion/04-semaphore), [5](/ApuntesPSP/03-sincronizacion/05-barrier) y [6](/ApuntesPSP/03-sincronizacion/06-condition).

**📍 Primer punto:** [01 · Condición de carrera](/ApuntesPSP/03-sincronizacion/01-condicion-de-carrera)
**⏭️ Al acabar la unidad, continúa en [UD 5 · Sockets TCP y UDP](/ApuntesPSP/04-sockets-tcp-y-udp).**
