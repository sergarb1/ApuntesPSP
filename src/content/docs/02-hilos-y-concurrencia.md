---
title: UD 3 — Hilos y concurrencia con Python
description: "Multitarea dentro de un proceso: hilos con threading 🔀"
nav_order: 02
---

<p><small>Multitarea dentro de un proceso: hilos con threading 🔀</small></p>

---

En la UD 2 lanzaste procesos completos con `subprocess`: cada uno con su propia memoria y su propio PID. Ahora toca bajar un nivel y entrar *dentro* del proceso: un proceso puede tener varias tareas ejecutándose a la vez, compartiendo su memoria. Esas tareas son los **hilos** (threads): se crean en milisegundos, se comunican con variables compartidas y son la base de los servidores que atienden a muchos clientes a la vez.

Esta unidad es el primer contacto serio con los hilos en Python: los crearás con `threading.Thread`, los lanzarás con `start()`, los esperarás con `join()`, los convertirás en servidores de fondo con `daemon=True` y programarás avisos diferidos con `Timer`. También entenderás el famoso **GIL**, el candado que limita a los hilos de Python.

---

## 🎯 Objetivo de la unidad

Al terminar, serás capaz de:

- Explicar qué es un hilo, en qué se diferencia de un proceso y por qué comparten la memoria.
- Crear y lanzar hilos con `threading.Thread`, `start()` y `join()`.
- Pasar argumentos a un hilo con `args`/`kwargs` y nombrar cada hilo con `.name`.
- Explicar qué es un hilo **daemon** y cuándo usarlo.
- Usar `threading.Timer` para ejecutar una función tras un retardo.
- Explicar el **GIL**: qué limita y por qué los hilos no aceleran el código CPU-bound.
- Describir el ciclo de vida de un hilo.

---

## 🗺️ Mapa de la unidad

| Punto | Qué aprenderás | Nivel |
|---|---|---|
| [01 · De proceso a hilo](/ApuntesPSP/02-hilos-y-concurrencia/01-de-proceso-a-hilo) | Qué es un hilo y en qué se diferencia de un proceso | Todos |
| [02 · Tu primer hilo](/ApuntesPSP/02-hilos-y-concurrencia/02-primer-hilo) | `threading.Thread`, `start()`, `join()` y el hilo principal | Todos |
| [03 · Hilos con argumentos](/ApuntesPSP/02-hilos-y-concurrencia/03-hilos-con-argumentos) | `args`, `kwargs` y el nombre de cada hilo | Todos |
| [04 · Hilos daemon](/ApuntesPSP/02-hilos-y-concurrencia/04-hilos-daemon) | Hilos de fondo que se sacrifican al salir | Todos |
| [05 · Timer](/ApuntesPSP/02-hilos-y-concurrencia/05-timer) | Ejecutar algo una sola vez tras un retardo | Todos |
| [06 · El GIL](/ApuntesPSP/02-hilos-y-concurrencia/06-gil) | El candado de CPython: por qué los hilos no aceleran la CPU | Todos |
| [07 · Estados del hilo](/ApuntesPSP/02-hilos-y-concurrencia/07-estados-del-hilo) | El ciclo de vida del hilo | Todos |
| [08 · Hilos en la práctica](/ApuntesPSP/02-hilos-y-concurrencia/08-hilos-en-la-practica) | Be the code, el ring Hilo vs Proceso | Todos |
| [09 · Cierre](/ApuntesPSP/02-hilos-y-concurrencia/09-cierre) | Sé el hilo, Fireside, Laboratorio de tortura… | Todos |

---

## 📝 Boletines de la unidad

> Practica con los pares del curso: empezar siempre el resuelto para ver el estilo y luego intentar el por-resolver.

<div class="ejercicio-links">
  <a href="/ApuntesPSP/boletines/boletin-u02-inicial" class="elink">🟢 Inicial por resolver</a>
  <a href="/ApuntesPSP/boletines/boletin-u02-inicial-resuelto" class="elink">✅ Inicial resuelto</a>
  <a href="/ApuntesPSP/boletines/boletin-u02-avanzado" class="elink">⭐ Avanzado por resolver</a>
  <a href="/ApuntesPSP/boletines/boletin-u02-avanzado-resuelto" class="elink">💪 Avanzado resuelto</a>
</div>

---

## ✅ Criterios de evaluación cubiertos (RA2)

**RA2 — Hilos (parcial): estructura, creación, esperas, daemon y GIL.**

| CE | Criterio | Dónde se cubre |
|---|---|---|
| RA2a | Identifica la estructura de un hilo | ✅ Punto 1 + Punto 7 |
| RA2b | Crea y lanza hilos con threading | ✅ Puntos 2-3 + ⚡ Laboratorio (punto 9) |
| RA2e | Implementa esperas con join() y sleep() | ✅ Puntos 2-4 + ⚡ Laboratorio (punto 9) |
| RA2f | Gestiona hilos daemon | ✅ Punto 4 + ⚡ Laboratorio (punto 9) |
| RA2h | Conoce el GIL y sus limitaciones | ✅ Punto 6 + Punto 8 |

> Los criterios RA2c (Lock), RA2d (semáforos) y RA2g (condiciones de carrera) se cubren en la **UD 4 · Sincronización**.

---

## 🚪 ¿Por dónde empiezo?

¿Vienes de la UD 2 y dominas procesos y `subprocess`? Empieza por el [punto 1](/ApuntesPSP/02-hilos-y-concurrencia/01-de-proceso-a-hilo), que parte justo de ahí: de proceso a hilo.

¿Ya sabes lanzar hilos con `start()` y `join()`? Saltar a los [puntos 6](/ApuntesPSP/02-hilos-y-concurrencia/06-gil) y [7](/ApuntesPSP/02-hilos-y-concurrencia/07-estados-del-hilo). Pero si vienes de cero en multitarea, no te saltes los puntos 1 a 3.

**📍 Primer punto:** [01 · De proceso a hilo](/ApuntesPSP/02-hilos-y-concurrencia/01-de-proceso-a-hilo)
**⏭️ Al acabar la unidad, continúa en [UD 4 · Sincronización](/ApuntesPSP/03-sincronizacion).**
