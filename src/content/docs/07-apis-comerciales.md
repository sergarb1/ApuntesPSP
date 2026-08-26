---
title: U07 — APIs Comerciales
description: Consumir OpenWeatherMap y OpenAI con claves y cuidado 🧪
nav_order: 07
---

<p><small>Consumir OpenWeatherMap y OpenAI con claves y cuidado 🧪</small></p>

> 🗺️ **Ruta del viaje:** 🚀 Proceso → 🔀 Hilo → 🔒 Sincronización → 🔌 TCP → 📡 UDP → 🌐 API REST → 🧪 **APIs Comerciales** → 🔐 Hash → 🧬 Cifrado → 🏗️ Servidores → ⏱️ asyncio

---

*En la U06 consumiste APIs públicas y gratuitas: sin clave, sin límites, sin miedo. Ahora toca el mundo real: las APIs comerciales te dan una **API key**, te limitan las peticiones, se caen y tienes que gestionar sus errores como un adulto.*

En esta unidad consumirás dos de las APIs más usadas del planeta: **OpenWeatherMap** para el tiempo y **OpenAI** para el cerebro artificial. Aprenderás a guardar tus claves con seguridad en variables de entorno, a gestionar rate limits y errores HTTP con elegancia, y a construir un programa completo que habla de verdad con ambas. Todo lo que viste en la [U06 · APIs REST y HTTP](/ApuntesPSP/06-apis-rest-y-http) —GET, JSON, `requests`— se viste aquí de traje de gala.

Esta unidad se lee como un **libro de 9 capítulos**: los 8 primeros son teoría en progresión y el 9º aterriza todo en la práctica.

---

## 🎯 Objetivo de la unidad

Al terminar, serás capaz de:

- Explicar qué es una **API key**, para qué sirve y por qué nunca debe ir en el código.
- Guardar credenciales en **variables de entorno** con `python-dotenv` y proteger tu repo con `.gitignore`.
- Consumir **OpenWeatherMap**: URL, parámetros (`q`, `appid`, `units`, `lang`) y parseo de la respuesta JSON.
- Llamar a la **API de OpenAI**: chat completions, roles de mensaje (`system`/`user`), `max_tokens` y `temperature`.
- Distinguir los **códigos de error** de una API comercial (401, 403, 404, 429, 500).
- Gestionar **rate limits** con esperas, `raise_for_status()` y **backoff exponencial**.
- Aplicar **buenas prácticas de seguridad**: rotación de claves, gitignore y nunca exponer credenciales.
- Construir un **programa completo** que consume OpenWeatherMap y OpenAI con las claves en `.env`.
- Conocer **herramientas para probar APIs** (Postman, curl, httpie, Insomnia).

---

## 🗺️ Mapa de la unidad

| Punto | Qué aprenderás | Nivel |
|---|---|---|
| [01 · API Keys](/ApuntesPSP/07-apis-comerciales/01-api-keys) | El carnet de identidad: qué es, cómo se obtiene y dónde se manda | Todos |
| [02 · Variables de entorno](/ApuntesPSP/07-apis-comerciales/02-variables-de-entorno) | `python-dotenv`, el `.env` y por qué tus claves nunca van al repo | Todos |
| [03 · OpenWeatherMap](/ApuntesPSP/07-apis-comerciales/03-openweathermap) | El tiempo de tu ciudad: URL, parámetros y parseo del JSON | Todos |
| [04 · OpenAI](/ApuntesPSP/07-apis-comerciales/04-openai) | El cerebro artificial: chat completions, mensajes y roles | Todos |
| [05 · Rate limiting](/ApuntesPSP/07-apis-comerciales/05-rate-limiting) | Límites, cuotas y el temido 429: espera y backoff | Todos |
| [06 · Errores HTTP](/ApuntesPSP/07-apis-comerciales/06-errores-http) | 401, 403, 429 y 500: gestionar fallos con `raise_for_status` | Todos |
| [07 · Seguridad y buenas prácticas](/ApuntesPSP/07-apis-comerciales/07-seguridad-y-buenas-practicas) | Rotación de claves, gitignore y no exponer secretos | Todos |
| [08 · Práctica: APIs comerciales](/ApuntesPSP/07-apis-comerciales/08-practica-apis-comerciales) | Sé el código, el programa completo y los ejercicios del lápiz | Todos |
| [09 · Cierre](/ApuntesPSP/07-apis-comerciales/09-cierre) | Sé la petición, Fireside, Laboratorio de tortura, Crucigrama… | Todos |

> 📖 **Flujo de lectura:** los 8 primeros puntos son teoría en progresión. El 9º es el aterrizaje práctico: léelo justo después del 8º y antes de abrir los boletines.

---

## 📝 Boletines de la unidad

> Practica con los pares del curso: empezar siempre el resuelto para ver el estilo y luego intentar el por-resolver.

<div class="ejercicio-links">
  <a href="/ApuntesPSP/boletines/boletin-u07-inicial-resuelto" class="elink">✅ Inicial resuelto</a>
  <a href="/ApuntesPSP/boletines/boletin-u07-inicial" class="elink">🟢 Inicial por resolver</a>
  <a href="/ApuntesPSP/boletines/boletin-u07-avanzado-resuelto" class="elink">💪 Avanzado resuelto</a>
  <a href="/ApuntesPSP/boletines/boletin-u07-avanzado" class="elink">⭐ Avanzado por resolver</a>
</div>

---

## ✅ Criterios de evaluación cubiertos (RA4a-b)

**RA4: Desarrolla aplicaciones que se comunican por red. Servicios en red.**

| CE | Criterio | Dónde se cubre |
|---|---|---|
| a) | Utiliza APIs REST para obtener datos externos | ✅ Puntos 3-5 y 8 + ⚡ Laboratorio (punto 9) |
| b) | Gestiona peticiones HTTP y procesa respuestas JSON | ✅ Puntos 1, 5-6 y 8 + ⚡ Laboratorio (punto 9) |

> RA4c (servidores concurrentes) y RA4d (ThreadPool) se cubren en la **U10 · Servidores Concurrentes**. RA4e-g (asyncio, disponibilidad, comparativa) se cubren en la **U11 · asyncio y disponibilidad**.

---

## 🚪 ¿Por dónde empiezo?

¿Vienes de la U06 y dominas `requests`, GET y JSON? Perfecto, ese es el trampolín ideal: repasa la [U06 · APIs REST y HTTP](/ApuntesPSP/06-apis-rest-y-http) para tener fresco `params=` y `resp.json()`, y arranca en el [punto 1](/ApuntesPSP/07-apis-comerciales/01-api-keys), que parte justo de ahí: de la petición con `requests` a la petición con clave.

¿Ya tienes claves de OpenWeatherMap y OpenAI y solo necesitas consumirlas? Ve directo al [punto 3](/ApuntesPSP/07-apis-comerciales/03-openweathermap) y al [punto 4](/ApuntesPSP/07-apis-comerciales/04-openai). Si vienes de cero en APIs, no te saltes los puntos 1 y 2: la API key y el `.env` son la base de todo lo demás.

**📍 Primer punto:** [01 · API Keys](/ApuntesPSP/07-apis-comerciales/01-api-keys)  
**⏭️ Al acabar la unidad, continúa en [U08 · Hash y Cifrado Clásico](/ApuntesPSP/08-hash-y-cifrado-clasico).**