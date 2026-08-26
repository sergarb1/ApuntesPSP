---
title: U02 — Hilos Fundamentos
description: "Multitarea dentro de un proceso: hilos en Python 🔀"
nav_order: 02
---

<p><small>Multitarea dentro de un proceso: hilos en Python 🔀</small></p>

> 🗺️ **Ruta del viaje:** 🚀 Proceso → 🔀 **Hilos Fundamentos** → 🔒 Sincronización → 🔌 TCP → 📡 UDP → 🌐 API REST → 🧪 APIs comerciales → 🔐 Hash → 🧬 Cifrado → 🏗️ Servidores → ⏱️ asyncio

---

En la U01 lanzaste procesos completos con `subprocess`: cada uno con su propia memoria, su propio `PID` y su propio mundo. Ahora toca bajar un nivel y entrar *dentro* del proceso: un proceso puede tener varias tareas ejecutándose a la vez, compartiendo su memoria. Esas tareas son los **hilos** (threads): se crean en milisegundos, se comunican con variables compartidas y son la base de los servidores que atienden a muchos clientes a la vez.

Esta unidad es el primer contacto serio con los hilos en Python: los crearás con `threading.Thread`, los lanzarás con `start()`, los esperarás con `join()`, los convertirás en servidores de fondo con `daemon=True` y programarás avisos diferidos con `Timer`. También entenderás el famoso **GIL**, el candado que limita a los hilos de Python, y seguirás su ciclo de vida de punta a punta. Es la puerta de entrada a la sincronización del [TEMA 03 · Sincronización entre Hilos](/ApuntesPSP/03-sincronizacion-entre-hilos) y a los servidores concurrentes de la U10.

Esta unidad se lee como un **libro de 9 capítulos**: los 8 primeros son teoría en progresión y el 9º aterriza todo en la práctica.

---

## 🎯 Objetivo de la unidad

Al terminar, serás capaz de:

- Explicar qué es un hilo, en qué se diferencia de un proceso y por qué todos comparten la memoria del proceso que los contiene.
- Crear y lanzar hilos con `threading.Thread`, `start()` y `join()`, distinguiendo el hilo principal de los hilos secundarios.
- Pasar argumentos a un hilo con `args`/`kwargs` y nombrar cada hilo con `.name`.
- Explicar qué es un hilo **daemon**, por qué existe y cuándo usar uno en lugar de un hilo normal con `join()`.
- Usar `threading.Timer` para ejecutar una función una sola vez después de un retardo.
- Explicar el **GIL**: qué limita, por qué los hilos no aceleran el código CPU-bound y por qué sí aceleran el I/O-bound.
- Describir el ciclo de vida de un hilo: nuevo, ejecutable, en ejecución, bloqueado y terminado.
- Seguir la ejecución de varios hilos paso a paso (traza) sabiendo que el orden de salida nunca está garantizado.
- Diagnosticar cuándo los hilos sirven de verdad y cuándo conviene recurrir a `multiprocessing`.

---

## 🗺️ Mapa de la unidad

| Punto | Qué aprenderás | Nivel |
|---|---|---|
| [01 · De proceso a hilo](/ApuntesPSP/02-hilos-fundamentos/01-de-proceso-a-hilo) | Qué es un hilo y en qué se diferencia de un proceso | Todos |
| [02 · Tu primer hilo](/ApuntesPSP/02-hilos-fundamentos/02-primer-hilo) | `threading.Thread`, `start()`, `join()` y el hilo principal | Todos |
| [03 · Hilos con argumentos](/ApuntesPSP/02-hilos-fundamentos/03-hilos-con-argumentos) | `args`, `kwargs` y el nombre de cada hilo con `.name` | Todos |
| [04 · Hilos daemon](/ApuntesPSP/02-hilos-fundamentos/04-hilos-daemon) | Hilos de fondo que se sacrifican al salir del programa | Todos |
| [05 · Timer](/ApuntesPSP/02-hilos-fundamentos/05-timer) | Ejecutar algo una sola vez tras un retardo | Todos |
| [06 · El GIL](/ApuntesPSP/02-hilos-fundamentos/06-gil) | El candado de CPython: por qué los hilos no aceleran la CPU | Todos |
| [07 · Estados del hilo](/ApuntesPSP/02-hilos-fundamentos/07-estados-del-hilo) | El ciclo de vida: nuevo, ejecutable, en ejecución, bloqueado, terminado | Todos |
| [08 · Hilos en la práctica](/ApuntesPSP/02-hilos-fundamentos/08-hilos-en-la-practica) | Be the code, el ring Hilo vs Proceso y Aprieta el lápiz | Todos |
| [09 · Cierre](/ApuntesPSP/02-hilos-fundamentos/09-cierre) | Sé el hilo, Fireside, Laboratorio de tortura, Crucigrama… | Todos |

> 📖 **Flujo de lectura:** los 8 primeros puntos son teoría en progresión. El 9º es el aterrizaje práctico: léelo justo después del 8º y antes de abrir los boletines.

---

## 📝 Boletines de la unidad

> Practica con los pares del curso: empezar siempre el resuelto para ver el estilo y luego intentar el por-resolver.

<div class="ejercicio-links">
  <a href="/ApuntesPSP/boletines/boletin-u02-inicial-resuelto" class="elink">✅ Inicial resuelto</a>
  <a href="/ApuntesPSP/boletines/boletin-u02-inicial" class="elink">🟢 Inicial por resolver</a>
  <a href="/ApuntesPSP/boletines/boletin-u02-avanzado-resuelto" class="elink">💪 Avanzado resuelto</a>
  <a href="/ApuntesPSP/boletines/boletin-u02-avanzado" class="elink">⭐ Avanzado por resolver</a>
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

> Los criterios RA2c (Lock), RA2d (semáforos) y RA2g (condiciones de carrera) se cubren en el **TEMA 03 — Sincronización entre Hilos**.

---

## 🚪 ¿Por dónde empiezo?

¿Vienes de la U01 y dominas procesos y `subprocess`? Perfecto, ese es el trampolín ideal: repasa la [U01 · Procesos y subprocess](/ApuntesPSP/01-procesos-y-subprocess) para tener fresca la diferencia entre lanzar un programa entero y ejecutar una tarea dentro de él, y arranca en el [punto 1](/ApuntesPSP/02-hilos-fundamentos/01-de-proceso-a-hilo), que parte justo de ahí: de proceso a hilo.

¿Ya sabes lanzar hilos con `start()` y `join()` y solo necesitas el GIL o los estados? Puedes saltar a los [puntos 6](/ApuntesPSP/02-hilos-fundamentos/06-gil) y [7](/ApuntesPSP/02-hilos-fundamentos/07-estados-del-hilo). Pero si vienes de cero en multitarea, no te saltes los puntos 1 a 3: entender qué es un hilo y cómo se lanza es la base de todo el módulo.

**📍 Primer punto:** [01 · De proceso a hilo](/ApuntesPSP/02-hilos-fundamentos/01-de-proceso-a-hilo)  
**⏭️ Al acabar la unidad, continúa en [U03 · Sincronización entre Hilos](/ApuntesPSP/03-sincronizacion-entre-hilos).**