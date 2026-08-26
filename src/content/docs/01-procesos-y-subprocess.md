---
title: U01 — Procesos y Subprocess
description: "Los programas en marcha: procesos y subprocess 🚀"
nav_order: 01
---

<p><small>Los programas en marcha: procesos y subprocess 🚀</small></p>

> 🗺️ **Ruta del viaje:** 🚀 **Procesos y Subprocess** → 🔀 Hilo → 🔒 Sincronización → 🔌 TCP → 📡 UDP → 🌐 API REST → 🧪 APIs comerciales → 🔐 Hash → 🧬 Cifrado → 🏗️ Servidores → ⏱️ asyncio

---

Un programa en el disco duro es un **muerto viviente**: no ocupa memoria, no consume CPU, no hace nada. Un **proceso** es ese mismo programa **vivo**, ejecutándose, ocupando memoria y consumiendo CPU. En esta primera unidad aprenderás a crear procesos con el módulo `subprocess`, a conocer sus estados, a diferenciar computación paralela de distribuida y a comunicar procesos entre sí con pipes y `communicate()`.

Todo el módulo PSP cuelga de esta unidad: los hilos de la [U02](/ApuntesPSP/02-hilos-fundamentos) son procesos ligeros, y los servidores y las APIs de las unidades siguientes serán procesos o hilos ejecutándose de fondo. Si no entiendes bien qué es un proceso, el resto del viaje se hace cuesta arriba. Empieza por aquí con calma.

Esta unidad se lee como un **libro de 9 capítulos**: los 8 primeros son teoría en progresión y el 9º aterriza todo en la práctica.

---

## 🎯 Objetivo de la unidad

Al terminar, serás capaz de:

- Explicar qué es un proceso, su PID y la burbuja de memoria que lo forma (código, estado, contador).
- Describir el ciclo de vida de un proceso: NUEVO, LISTO, EJECUCIÓN, BLOQUEADO y TERMINADO.
- Distinguir computación **paralela**, **distribuida** y **concurrente**, y saber cuándo usar `multiprocessing`.
- Lanzar y esperar programas con `subprocess.run()`, capturando salida y controlando timeout y errores.
- Lanzar procesos en segundo plano con `subprocess.Popen()` y gestionarlos con `wait`, `poll`, `terminate` y `kill`.
- Comunicar procesos pasando datos por `stdin` y leyendo su respuesta por `stdout` con `communicate()`.
- Adaptar tus programas a Windows y Linux cambiando solo el comando.
- Razonar sobre procesos paso a paso con la técnica "Sé el código".

---

## 🗺️ Mapa de la unidad

| Punto | Qué aprenderás | Nivel |
|---|---|---|
| [01 · Qué es un proceso](/ApuntesPSP/01-procesos-y-subprocess/01-que-es-un-proceso) | La burbuja de memoria, el PID y las características de todo proceso | Todos |
| [02 · Estados de un proceso](/ApuntesPSP/01-procesos-y-subprocess/02-estados-de-un-proceso) | NUEVO, LISTO, EJECUCIÓN, BLOQUEADO, TERMINADO y sus transiciones | Todos |
| [03 · Paralela vs Distribuida](/ApuntesPSP/01-procesos-y-subprocess/03-paralela-vs-distribuida) | La diferencia entre paralela, distribuida y concurrencia, con `multiprocessing` | Todos |
| [04 · subprocess.run()](/ApuntesPSP/01-procesos-y-subprocess/04-subprocess-run) | Lanzar y esperar: capturar salida, timeout y errores | Todos |
| [05 · subprocess.Popen()](/ApuntesPSP/01-procesos-y-subprocess/05-subprocess-popen) | Lanzar y seguir: wait, poll, terminate, kill y el PID | Todos |
| [06 · Comunicación con procesos](/ApuntesPSP/01-procesos-y-subprocess/06-comunicacion-con-procesos) | stdin, stdout y `communicate()`: pasar datos a un proceso | Todos |
| [07 · Compatibilidad Windows / Linux](/ApuntesPSP/01-procesos-y-subprocess/07-compatibilidad-windows-linux) | La tabla de comandos equivalentes y los trucos del shell | Todos |
| [08 · Procesos en la práctica](/ApuntesPSP/01-procesos-y-subprocess/08-procesos-en-la-practica) | Sé el código, el ring run vs Popen y los ejercicios del lápiz | Todos |
| [09 · Cierre](/ApuntesPSP/01-procesos-y-subprocess/09-cierre) | Sé el proceso, Fireside, Laboratorio de tortura, Crucigrama… | Todos |

> 📖 **Flujo de lectura:** los 8 primeros puntos son teoría en progresión. El 9º es el aterrizaje práctico: léelo justo después del 8º y antes de abrir los boletines.

---

## 📝 Boletines de la unidad

> Practica con los pares del curso: empezar siempre el resuelto para ver el estilo y luego intentar el por-resolver.

<div class="ejercicio-links">
  <a href="/ApuntesPSP/boletines/boletin-u01-inicial-resuelto" class="elink">✅ Inicial resuelto</a>
  <a href="/ApuntesPSP/boletines/boletin-u01-inicial" class="elink">🟢 Inicial por resolver</a>
  <a href="/ApuntesPSP/boletines/boletin-u01-avanzado-resuelto" class="elink">💪 Avanzado resuelto</a>
  <a href="/ApuntesPSP/boletines/boletin-u01-avanzado" class="elink">⭐ Avanzado por resolver</a>
</div>

---

## ✅ Criterios de evaluación cubiertos (RA1)

**RA1: Reconoce las características y la gestión de los procesos en un sistema operativo.**

| CE | Criterio | Dónde se cubre |
|---|---|---|
| a) | Reconoce las características de los procesos | ✅ Punto 1 |
| b) | Distingue entre computación paralela y distribuida | ✅ Punto 3 |
| c) | Conoce los estados de un proceso | ✅ Punto 2 |
| d) | Identifica las diferencias clave entre proceso e hilo | → U02 |
| e) | Crea programas con procesos (subprocess) | ✅ Puntos 4 y 5 + ⚡ Laboratorio (punto 9) |
| f) | Establece comunicación entre procesos | ✅ Punto 6 |

> RA1d (proceso vs hilo) se cubre en la **U02 · Hilos Fundamentos**. RA1g (análisis de ventajas de procesos frente a hilos) también en **U02**. RA1h (documentación) es transversal a todo el curso.

---

## 🚪 ¿Por dónde empiezo?

¿Vienes de cero en programación de sistemas? Perfecto, esta es la primera unidad del módulo y no necesitas nada anterior: solo saber Python básico (funciones, listas, `print()`). Empieza por el [punto 1](/ApuntesPSP/01-procesos-y-subprocess/01-que-es-un-proceso) y no te saltes los puntos 1 a 3: son la base conceptual de TODO el módulo. Los procesos reaparecen en cada unidad siguiente.

¿Ya sabes qué es un proceso y has jugado con la terminal? Puedes saltar a los [puntos 4](/ApuntesPSP/01-procesos-y-subprocess/04-subprocess-run) y [5](/ApuntesPSP/01-procesos-y-subprocess/05-subprocess-popen), que son el corazón práctico de la unidad, y hacer el resto a ritmo ligero. Pero si dudas de qué diferencia hay entre `run()` y `Popen()`, vuelve al [punto 5](/ApuntesPSP/01-procesos-y-subprocess/05-subprocess-popen).

**📍 Primer punto:** [01 · Qué es un proceso](/ApuntesPSP/01-procesos-y-subprocess/01-que-es-un-proceso)  
**⏭️ Al acabar la unidad, continúa en [U02 · Hilos Fundamentos](/ApuntesPSP/02-hilos-fundamentos).**