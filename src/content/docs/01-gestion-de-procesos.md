---
title: UD 2 — Gestión de procesos con Python
description: "Ejecutar, controlar y comunicar procesos con subprocess 🚀"
nav_order: 01
---

<p><small>Ejecutar, controlar y comunicar procesos con subprocess 🚀</small></p>

---

Un programa en el disco duro es un **muerto viviente**: no ocupa memoria, no consume CPU, no hace nada. Un **proceso** es ese mismo programa **vivo**, ejecutándose, ocupando memoria y consumiendo CPU. En esta unidad aprenderás a crear procesos con el módulo `subprocess`, a controlar su ejecución, a capturar su salida y a comunicarlos entre sí con pipes.

Dominar `subprocess` es la base de todo lo que viene después: los hilos de la [UD 3](/ApuntesPSP/02-hilos-y-concurrencia) son procesos ligeros, y los servidores de la [UD 6](/ApuntesPSP/05-servidores-concurrentes) serán procesos o hilos ejecutándose de fondo.

---

## 🎯 Objetivo de la unidad

Al terminar, serás capaz de:

- Explicar qué es un proceso, su PID y la burbuja de memoria que lo forma.
- Distinguir computación **paralela**, **distribuida** y **concurrente**.
- Lanzar y esperar programas con `subprocess.run()`, capturando salida y controlando timeout y errores.
- Lanzar procesos en segundo plano con `subprocess.Popen()` y gestionarlos con `wait`, `poll`, `terminate` y `kill`.
- Comunicar procesos pasando datos por `stdin` y leyendo su respuesta por `stdout` con `communicate()`.
- Adaptar tus programas a Windows y Linux cambiando solo el comando.

---

## 🗺️ Mapa de la unidad

| Punto | Qué aprenderás | Nivel |
|---|---|---|
| [01 · Qué es un proceso](/ApuntesPSP/01-gestion-de-procesos/01-que-es-un-proceso) | La burbuja de memoria, el PID y las características de todo proceso | Todos |
| [02 · Estados de un proceso](/ApuntesPSP/01-gestion-de-procesos/02-estados-de-un-proceso) | NUEVO, LISTO, EJECUCIÓN, BLOQUEADO, TERMINADO y sus transiciones | Todos |
| [03 · Paralela vs Distribuida](/ApuntesPSP/01-gestion-de-procesos/03-paralela-vs-distribuida) | La diferencia entre paralela, distribuida y concurrencia | Todos |
| [04 · subprocess.run()](/ApuntesPSP/01-gestion-de-procesos/04-subprocess-run) | Lanzar y esperar: capturar salida, timeout y errores | Todos |
| [05 · subprocess.Popen()](/ApuntesPSP/01-gestion-de-procesos/05-subprocess-popen) | Lanzar y seguir: wait, poll, terminate, kill y el PID | Todos |
| [06 · Comunicación con procesos](/ApuntesPSP/01-gestion-de-procesos/06-comunicacion-con-procesos) | stdin, stdout y `communicate()`: pasar datos a un proceso | Todos |
| [07 · Compatibilidad Windows / Linux](/ApuntesPSP/01-gestion-de-procesos/07-compatibilidad-windows-linux) | La tabla de comandos equivalentes y los trucos del shell | Todos |
| [08 · Procesos en la práctica](/ApuntesPSP/01-gestion-de-procesos/08-procesos-en-la-practica) | Sé el código, el ring run vs Popen y ejercicios | Todos |
| [09 · Cierre](/ApuntesPSP/01-gestion-de-procesos/09-cierre) | Sé el proceso, Fireside, Laboratorio de tortura, Crucigrama… | Todos |

> 📖 **Flujo de lectura:** los 8 primeros puntos son teoría en progresión. El 9º es el aterrizaje práctico.

---

## 📝 Boletines de la unidad

> Practica con los pares del curso: empezar siempre el resuelto para ver el estilo y luego intentar el por-resolver.

<div class="ejercicio-links">
  <a href="/ApuntesPSP/boletines/boletin-u01-inicial" class="elink">🟢 Inicial por resolver</a>
  <a href="/ApuntesPSP/boletines/boletin-u01-inicial-resuelto" class="elink">✅ Inicial resuelto</a>
  <a href="/ApuntesPSP/boletines/boletin-u01-avanzado" class="elink">⭐ Avanzado por resolver</a>
  <a href="/ApuntesPSP/boletines/boletin-u01-avanzado-resuelto" class="elink">💪 Avanzado resuelto</a>
</div>

---

## ✅ Criterios de evaluación cubiertos (RA1)

**RA1: Reconoce las características y la gestión de los procesos en un sistema operativo.**

| CE | Criterio | Dónde se cubre |
|---|---|---|
| a) | Reconoce las características de los procesos | ✅ Punto 1 |
| b) | Distingue entre computación paralela y distribuida | ✅ Punto 3 |
| c) | Conoce los estados de un proceso | ✅ Punto 2 |
| d) | Identifica las diferencias clave entre proceso e hilo | → UD 3 |
| e) | Crea programas con procesos (subprocess) | ✅ Puntos 4 y 5 + ⚡ Laboratorio (punto 9) |
| f) | Establece comunicación entre procesos | ✅ Punto 6 |

---

## 🚪 ¿Por dónde empiezo?

¿Vienes de cero en programación de sistemas? Empieza por el [punto 1](/ApuntesPSP/01-gestion-de-procesos/01-que-es-un-proceso) y no te saltes los puntos 1 a 3: son la base conceptual de TODO el módulo.

¿Ya sabes qué es un proceso? Saltar a los [puntos 4](/ApuntesPSP/01-gestion-de-procesos/04-subprocess-run) y [5](/ApuntesPSP/01-gestion-de-procesos/05-subprocess-popen), que son el corazón práctico de la unidad.

**📍 Primer punto:** [01 · Qué es un proceso](/ApuntesPSP/01-gestion-de-procesos/01-que-es-un-proceso)
**⏭️ Al acabar la unidad, continúa en [UD 3 · Hilos y concurrencia](/ApuntesPSP/02-hilos-y-concurrencia).**
