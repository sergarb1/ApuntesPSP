---
title: U01 — Python 3 básico
description: "La base de todo: variables, funciones, clases y módulos en Python 🐍"
nav_order: 00
---

<p><small>La base de todo: variables, funciones, clases y módulos en Python 🐍</small></p>

> 🗺️ **Ruta del viaje:** 🐍 **Python básico** → 🚀 Procesos y Subprocess → 🔀 Hilo → 🔒 Sincronización → 🔌 TCP → 📡 UDP → 🌐 API REST → 🧪 APIs comerciales → 🔐 Hash → 🧬 Cifrado → 🏗️ Servidores → ⏱️ asyncio

---

Python es el lenguaje que da nombre al módulo y el que vas a usar en todas las unidades siguientes. Esta unidad es prerequisito: cubre todo lo que necesitas saber de Python antes de lanzarte a crear procesos, hilos y servidores. Si ya dominas variables, funciones, clases y módulos, puedes saltarla y empezar directamente por la [UD 2](/ApuntesPSP/01-gestion-de-procesos). Si tienes dudas, quédate aquí: cada concepto se explica con ejemplos cortos que puedes copiar y ejecutar en tu terminal.

Esta unidad se lee como un **libro de 9 capítulos**: los 8 primeros son teoría en progresión y el 9º aterriza todo en la práctica.

---

## 🎯 Objetivo de la unidad

Al terminar, serás capaz de:

- Escribir comentarios de línea y multilinea en Python.
- Distinguir entre tipos primitivos (entero, float, boolean, string, None) y usar operadores aritméticos, de comparación y lógicos.
- Crear y manipular variables, listas, tuplas, diccionarios y conjuntos.
- Usar slicing, comprensiones y el operador `in`.
- Controlar el flujo de un programa con `if`, `for`, `while` y `try/except`.
- Definir funciones con argumentos posicionales, `*args`, `**kwargs` y funciones lambda.
- Crear clases con atributos, métodos, `@classmethod` y `@staticmethod`.
- Importar módulos, instalar paquetes con `pip` y usar generadores y decoradores.

---

## 🗺️ Mapa de la unidad

| Punto | Qué aprenderás | Nivel |
|---|---|---|
| [01 · Introducción a Python](/ApuntesPSP/00-python-basico/01-introduccion) | Qué es Python, por qué aprenderlo, características e instalación | Todos |
| [02 · Comentarios](/ApuntesPSP/00-python-basico/02-comentarios) | Comentario de línea, docstring multilinea | Todos |
| [03 · Tipos de datos y operadores](/ApuntesPSP/00-python-basico/03-tipos-de-datos) | Enteros, floats, booleans, strings, None, operadores | Todos |
| [04 · Variables y colecciones](/ApuntesPSP/00-python-basico/04-variables-y-colecciones) | Variables, listas, tuplas, diccionarios, conjuntos, slicing | Todos |
| [05 · Control de flujo](/ApuntesPSP/00-python-basico/05-control-de-flujo) | if, for, while, range, try/except, iteradores | Todos |
| [06 · Funciones](/ApuntesPSP/00-python-basico/06-funciones) | def, argumentos, lambda, map, filter, comprensiones | Todos |
| [07 · Clases](/ApuntesPSP/00-python-basico/07-clases) | class, __init__, métodos, classmethod, staticmethod | Todos |
| [08 · Módulos y avanzado](/ApuntesPSP/00-python-basico/08-modulos-y-avanzado) | import, pip, generadores, decoradores | Intermedio |
| [09 · Cierre](/ApuntesPSP/00-python-basico/09-cierre) | Sé el código, Fireside, Laboratorio de tortura… | Todos |

> 📖 **Flujo de lectura:** los 8 primeros puntos son teoría en progresión. El 9º es el aterrizaje práctico: léelo justo después del 8º y antes de abrir los boletines.

---

## 📝 Boletines de la unidad

> Practica con los pares del curso: empezar siempre el resuelto para ver el estilo y luego intentar el por-resolver.

<div class="ejercicio-links">
  <a href="/ApuntesPSP/boletines/boletin-u00-inicial" class="elink">🟢 Inicial por resolver</a>
  <a href="/ApuntesPSP/boletines/boletin-u00-inicial-resuelto" class="elink">✅ Inicial resuelto</a>
  <a href="/ApuntesPSP/boletines/boletin-u00-avanzado" class="elink">⭐ Avanzado por resolver</a>
  <a href="/ApuntesPSP/boletines/boletin-u00-avanzado-resuelto" class="elink">💪 Avanzado resuelto</a>
</div>

---

## ✅ Criterios de evaluación cubiertos (Prerequisito)

Esta unidad es **prerequisito** del módulo PSP. No corresponde a ningún RA directamente, pero sin ella no podrás seguir las unidades siguientes.

| CE | Criterio | Dónde se cubre |
|---|---|---|
| — | Domina la sintaxis básica de Python (variables, tipos, operadores) | ✅ Puntos 3 y 4 |
| — | Controla el flujo de ejecución (condicionales, bucles, excepciones) | ✅ Punto 5 |
| — | Define y llama a funciones con diferentes tipos de argumentos | ✅ Punto 6 |
| — | Crea y usa clases con atributos y métodos | ✅ Punto 7 |
| — | Importa módulos y gestiona paquetes externos | ✅ Punto 8 |

> Estos conocimientos son **necesarios** para todas las unidades del módulo (UD 1–UD 10).

---

## 🚪 ¿Por dónde empiezo?

¿Nunca has tocado un ordenador o un lenguaje de programación? No empieces por aquí: primero repasa los fundamentos en el curso de [Pensamiento Computacional](https://sergarb1.github.io/ApuntesProgramacion/01-pensamiento-computacional/) (variables, bucles, condicionales). Una vez lo domines, vuelve a esta unidad para afianzar Python.

¿Nunca has programado en Python? Perfecto, esta unidad es para ti. Empieza por el [punto 1](/ApuntesPSP/00-python-basico/01-introduccion) y avanza despacio: cada capítulo tiene ejemplos que puedes copiar y ejecutar en tu terminal. No te saltes los boletines: la práctica es la clave.

¿Ya sabes algo de Python pero no estás seguro? Haz el [mini-chequeo](/ApuntesPSP/00-python-basico/03-tipos-de-datos) del punto 3. Si lo sacas sin problemas, puedes saltar a los puntos que menos domines y dedicar más tiempo al [punto 8](/ApuntesPSP/00-python-basico/08-modulos-y-avanzado) (generadores y decoradores), que suelen ser los que más cuestan.

**📍 Primer punto:** [01 · Introducción a Python](/ApuntesPSP/00-python-basico/01-introduccion)
**⏭️ Al acabar la unidad, continúa en [U02 · Procesos y Subprocess](/ApuntesPSP/01-gestion-de-procesos).**
