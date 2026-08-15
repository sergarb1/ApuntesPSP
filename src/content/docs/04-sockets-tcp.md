---
title: U04 — Sockets TCP
description: Cliente y servidor que hablan por el puerto 🔌
nav_order: 04
---

<p><small>Cliente y servidor que hablan por el puerto 🔌</small></p>

> 🗺️ **Ruta del viaje:** 🚀 Proceso → 🔀 Hilo → 🔒 Sincronización → 🔌 **Sockets TCP** → 📡 UDP → 🌐 API REST → 🧪 APIs comerciales → 🔐 Hash → 🧬 Cifrado → 🏗️ Servidores → ⏱️ asyncio

---

> "Un socket TCP es como una llamada telefónica: marcas, esperas a que contesten, habláis y colgáis."

En la U03 sincronizaste hilos para que no se pisen entre sí dentro de un mismo programa. Ahora toca lo contrario: hacer que **procesos distintos, incluso en máquinas distintas, hablen entre ellos**. La herramienta es el **socket TCP**, el canal fiable que garantiza que cada byte que envías llegue entero y en orden. Es el mismo mecanismo que mueve la web, el correo y casi todo lo que ves en pantalla.

En esta unidad construirás tu primera conversación entre programas: un **cliente** que llama y un **servidor** que contesta. Aprenderás el three-way handshake que prepara la llamada, los errores típicos cuando la red se rompe, y el truco de `SO_REUSEADDR` para que tu servidor aguante reinicios sin quejarse. Al final, montarás un **servidor eco** completo y tendrás un método infalible para diagnosticar cualquier problema de red.

Esta unidad se lee como un **libro de 9 capítulos**: los 8 primeros son teoría en progresión y el 9º aterriza todo en la práctica.

---

## 🎯 Objetivo de la unidad

Al terminar, serás capaz de:

- Explicar qué es un **socket** y para qué sirven la **IP** y el **puerto**.
- Describir el **modelo de capas (TCP/IP)** y distinguir TCP de UDP.
- Implementar un **cliente TCP** con `connect()`, `sendall()` y `recv()`.
- Implementar un **servidor TCP** con `bind()`, `listen()` y `accept()`.
- Describir el **three-way handshake** y el cierre de una conexión TCP.
- Gestionar **errores de red** (timeout, rechazo, reinicio) con `try/except`.
- Configurar **SO_REUSEADDR** y **timeouts** para servidores robustos.
- Hablar **protocolos de aplicación** sobre TCP, como HTTP, a nivel de socket.
- Montar y depurar un **servidor + cliente eco TCP** completo.

---

## 🗺️ Mapa de la unidad

| Punto | Qué aprenderás | Nivel |
|---|---|---|
| [01 · Qué es un socket](/ApuntesPSP/04-sockets-tcp/01-que-es-un-socket) | IP + puerto, qué es un socket y la analogía del teléfono | Todos |
| [02 · Cliente TCP](/ApuntesPSP/04-sockets-tcp/02-cliente-tcp) | `connect()`, `sendall()` y `recv()`: el cliente que habla primero | Todos |
| [03 · Servidor TCP](/ApuntesPSP/04-sockets-tcp/03-servidor-tcp) | `bind()`, `listen()` y `accept()`: el servidor que escucha y atiende | Todos |
| [04 · Ciclo de vida de la conexión](/ApuntesPSP/04-sockets-tcp/04-ciclo-de-vida-de-la-conexion) | Three-way handshake y cierre de la conexión TCP | Todos |
| [05 · Errores y manejo](/ApuntesPSP/04-sockets-tcp/05-errores-y-manejo) | `ConnectionResetError`, `BrokenPipeError`, timeouts y `try/except` | Todos |
| [06 · SO_REUSEADDR](/ApuntesPSP/04-sockets-tcp/06-so-reuseaddr) | "Address already in use", TIME_WAIT y cómo evitarlo | Todos |
| [07 · Protocolos sobre TCP](/ApuntesPSP/04-sockets-tcp/07-protocolos-sobre-tcp) | HTTP hablado a pelo con un socket y el orden de bytes | Todos |
| [08 · Servidor eco completo](/ApuntesPSP/04-sockets-tcp/08-servidor-eco-completo) | Servidor + cliente eco, mano a mano TCP y ejercicios resueltos | Todos |
| [09 · Head First (cierre)](/ApuntesPSP/04-sockets-tcp/09-head-first) | Sé el Socket, Fireside, Laboratorio de Tortura, Crucigrama… | Todos |

> 📖 **Flujo de lectura:** los 8 primeros puntos son teoría en progresión. El 9º es el aterrizaje práctico: léelo justo después del 8º y antes de abrir los boletines.

---

## 📝 Boletines de la unidad

> Practica con los pares del curso: empezar siempre el resuelto para ver el estilo y luego intentar el por-resolver.

<div class="ejercicio-links">
  <a href="/ApuntesPSP/boletines/boletin-u04-inicial-resuelto" class="elink">✅ Inicial resuelto</a>
  <a href="/ApuntesPSP/boletines/boletin-u04-inicial" class="elink">🟢 Inicial por resolver</a>
  <a href="/ApuntesPSP/boletines/boletin-u04-avanzado-resuelto" class="elink">💪 Avanzado resuelto</a>
  <a href="/ApuntesPSP/boletines/boletin-u04-avanzado" class="elink">⭐ Avanzado por resolver</a>
</div>

---

## ✅ Criterios de evaluación cubiertos (RA3)

**RA3 — Sockets: comunicaciones en red con TCP/UDP y protocolos de aplicación (HTTP, NTP).**

| CE | Criterio | Dónde se cubre |
|---|---|---|
| a) | Modelo de capas de red (TCP/IP) | ✅ Punto 1 |
| c) | Crea servidores TCP | ✅ Puntos 3 y 8 + ⚡ Laboratorio (punto 9) |
| d) | Crea clientes TCP | ✅ Puntos 2 y 8 + ⚡ Laboratorio (punto 9) |
| f) | Gestiona errores de red | ✅ Punto 5 + ⚡ Laboratorio (punto 9) |
| g) | Configura opciones de socket (SO_REUSEADDR, non-blocking) | ✅ Puntos 5 y 6 |

> RA3b (UDP), RA3e (UDP servidor/cliente) y RA3h (protocolos HTTP/NTP) se cubren en la **U05 · Sockets UDP y Protocolos**.

---

## 🚪 ¿Por dónde empiezo?

¿Vienes de la U03 y dominas hilos y sincronización? Perfecto, ese es el trampolín ideal: repasa la [U03 · Sincronización entre hilos](/ApuntesPSP/03-sincronizacion-entre-hilos) para tener frescos los locks y semáforos (te harán falta en el [TEMA 10](/ApuntesPSP/10-servidores-concurrentes)), y arranca en el [punto 1](/ApuntesPSP/04-sockets-tcp/01-que-es-un-socket), que parte de cero: qué es un socket, la IP y el puerto.

¿Ya sabes qué es un socket y solo necesitas el servidor, los errores o el truco de `SO_REUSEADDR`? Ve directo al [punto 3](/ApuntesPSP/04-sockets-tcp/03-servidor-tcp), al [5](/ApuntesPSP/04-sockets-tcp/05-errores-y-manejo) o al [6](/ApuntesPSP/04-sockets-tcp/06-so-reuseaddr). Si vienes de cero en redes, no te saltes los puntos 1 a 4: la IP, el puerto y el handshake son la base de todo lo demás.

**📍 Primer punto:** [01 · Qué es un socket](/ApuntesPSP/04-sockets-tcp/01-que-es-un-socket)  
**⏭️ Al acabar la unidad, continúa en [U05 · Sockets UDP y Protocolos](/ApuntesPSP/05-sockets-udp-y-protocolos).**