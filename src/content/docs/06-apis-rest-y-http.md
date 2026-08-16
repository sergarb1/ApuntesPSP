---
title: U06 — APIs REST y HTTP
description: "Hablar con la web: REST, métodos HTTP y JSON 🌐"
nav_order: 06
---

<p><small>Hablar con la web: REST, métodos HTTP y JSON 🌐</small></p>

> 🗺️ **Ruta del viaje:** 🚀 Proceso → 🔀 Hilo → 🔒 Sincronización → 🔌 TCP → 📡 UDP → 🌐 **APIs REST y HTTP** → 🧪 APIs comerciales → 🔐 Hash → 🧬 Cifrado → 🏗️ Servidores → ⏱️ asyncio

---

*En la U04 y la U05 montaste sockets y hablaste con procesos en la misma máquina. Ahora toca hablar con el mundo: la web entera se apoya en HTTP, y las APIs REST son la manera moderna de pedirle datos a cualquier servicio.*

Cuando tu aplicación quiere saber el tiempo, traducir un texto o buscar repositorios en GitHub, no monta un socket a mano: llama a una **API**. Esta unidad te enseña el idioma de esa conversación: qué es una API, cómo funciona HTTP, qué métodos existen (GET, POST, PUT, DELETE), qué significan los códigos de estado, cómo se lee **JSON** y cómo usar la librería `requests` de Python para hacer peticiones reales contra servicios públicos. El siguiente tema, [U07 · APIs Comerciales](/ApuntesPSP/07-apis-comerciales), tomará el relevo con APIs de pago como OpenWeatherMap y OpenAI.

Esta unidad se lee como un **libro de 9 capítulos**: los 8 primeros son teoría en progresión y el 9º aterriza todo en la práctica.

---

## 🎯 Objetivo de la unidad

Al terminar, serás capaz de:

- Explicar qué es una API y por qué pone una capa de abstracción entre dos programas.
- Describir la web: qué es una URL, una petición HTTP y una respuesta HTTP.
- Dominar los métodos HTTP (GET, POST, PUT, PATCH, DELETE) y cuándo usar cada uno, incluyendo la idempotencia.
- Aplicar los principios REST: recursos, URLs semánticas, sin estado y JSON.
- Interpretar los códigos de estado HTTP (2xx, 3xx, 4xx y 5xx) sin mirar la tabla.
- Leer y generar JSON, y convertirlo a diccionarios y listas de Python.
- Hacer peticiones GET con `requests`, con parámetros de consulta y cabeceras.
- Enviar datos con POST, PUT y DELETE usando `json=`, y manejar errores HTTP con criterio.
- Construir un mini cliente de API completo en Python que hable con servicios reales.

---

## 🗺️ Mapa de la unidad

| Punto | Qué aprenderás | Nivel |
|---|---|---|
| [01 · Web y HTTP](/ApuntesPSP/06-apis-rest-y-http/01-web-y-http) | Qué es una API, la URL y el intercambio petición/respuesta | Todos |
| [02 · Métodos HTTP](/ApuntesPSP/06-apis-rest-y-http/02-metodos-http) | GET, POST, PUT, PATCH y DELETE: los verbos de la web y la idempotencia | Todos |
| [03 · Principios REST](/ApuntesPSP/06-apis-rest-y-http/03-principios-rest) | Recursos, URLs semánticas, sin estado y qué significa ser RESTful | Todos |
| [04 · Códigos de estado](/ApuntesPSP/06-apis-rest-y-http/04-codigos-de-estado) | 200, 201, 400, 401, 404, 500…: la señal de humo del servidor | Todos |
| [05 · JSON](/ApuntesPSP/06-apis-rest-y-http/05-json) | El idioma de las APIs: dumps, loads y parse de respuestas | Todos |
| [06 · requests: el GET](/ApuntesPSP/06-apis-rest-y-http/06-requests-get) | `requests.get`, parámetros de consulta, cabeceras y la respuesta | Todos |
| [07 · requests: POST, PUT y DELETE](/ApuntesPSP/06-apis-rest-y-http/07-requests-post) | Crear, actualizar y borrar con `json=`, y manejo de errores | Todos |
| [08 · Práctica: mini cliente de API](/ApuntesPSP/06-apis-rest-y-http/08-practica-api) | Sé el código, un cliente completo y los ejercicios del lápiz | Todos |
| [09 · Cierre](/ApuntesPSP/06-apis-rest-y-http/09-cierre) | Sé la Petición HTTP, Fireside, Laboratorio de Tortura, Crucigrama… | Todos |

> 📖 **Flujo de lectura:** los 8 primeros puntos son teoría en progresión. El 9º es el aterrizaje práctico: léelo justo después del 8º y antes de abrir los boletines.

---

## 📝 Boletines de la unidad

> Practica con los pares del curso: empezar siempre el resuelto para ver el estilo y luego intentar el por-resolver.

<div class="ejercicio-links">
  <a href="/ApuntesPSP/boletines/boletin-u06-inicial-resuelto" class="elink">✅ Inicial resuelto</a>
  <a href="/ApuntesPSP/boletines/boletin-u06-inicial" class="elink">🟢 Inicial por resolver</a>
  <a href="/ApuntesPSP/boletines/boletin-u06-avanzado-resuelto" class="elink">💪 Avanzado resuelto</a>
  <a href="/ApuntesPSP/boletines/boletin-u06-avanzado" class="elink">⭐ Avanzado por resolver</a>
</div>

---

## ✅ Criterios de evaluación cubiertos (RA4a-b)

**RA4: Desarrolla aplicaciones que se comunican por red. Servicios en red.**

| CE | Criterio | Dónde se cubre |
|---|---|---|
| a) | Utiliza APIs REST para obtener datos externos | ✅ Puntos 3, 6-8 + ⚡ Laboratorio (punto 9) |
| b) | Maneja peticiones HTTP y procesa respuestas JSON | ✅ Puntos 1-5 y 7 + ⚡ Laboratorio (punto 9) |

> RA4c (servidores concurrentes) y RA4d (ThreadPool) se cubren en la **U10 · Servidores Concurrentes**. RA4e-g (asyncio, disponibilidad, comparativa) se cubren en la **U11 · asyncio y disponibilidad**.

---

## 🚪 ¿Por dónde empiezo?

¿Vienes de la U05 y dominas los sockets UDP y TCP? Perfecto, ese es el trampolín ideal: repasa la [U05 · Sockets UDP y protocolos](/ApuntesPSP/05-sockets-udp-y-protocolos) para tener fresco qué es un protocolo y cómo se abre una conexión, y arranca en el [punto 1](/ApuntesPSP/06-apis-rest-y-http/01-web-y-http), que parte justo de ahí: del intercambio de mensajes entre dos máquinas a la conversación estructurada de HTTP.

¿Ya sabes qué es una API y solo necesitas `requests` o el JSON? Ve directo al [punto 5](/ApuntesPSP/06-apis-rest-y-http/05-json) y al [punto 6](/ApuntesPSP/06-apis-rest-y-http/06-requests-get). Si vienes de cero en la web, no te saltes los puntos 1 a 4: URL, métodos y códigos de estado son el idioma que vas a hablar toda la unidad.

**📍 Primer punto:** [01 · Web y HTTP](/ApuntesPSP/06-apis-rest-y-http/01-web-y-http)  
**⏭️ Al acabar la unidad, continúa en [U07 · APIs Comerciales](/ApuntesPSP/07-apis-comerciales).**