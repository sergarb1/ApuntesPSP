---
title: U05 — Sockets UDP y Protocolos
description: "Datagramas sin conexión: UDP, HTTP y NTP 📡"
nav_order: 05
---

<p><small>Datagramas sin conexión: UDP, HTTP y NTP 📡</small></p>

> 🗺️ **Ruta del viaje:** 🚀 Proceso → 🔀 Hilo → 🔒 Sincronización → 🔌 TCP → 📡 **Sockets UDP y Protocolos** → 🌐 API REST → 🧪 APIs comerciales → 🔐 Hash → 🧬 Cifrado → 🏗️ Servidores → ⏱️ asyncio

---

> "UDP es como lanzar un avión de papel. TCP es como enviar una carta certificada. Cada uno tiene su momento."

En la U04 los sockets TCP te enseñaron a ser un mensajero certificado: conectas, verificas entrega y mantienes orden. Aquí llega el otro extremo: **UDP**, el lanzador de aviones de papel. No hay conexión, no hay confirmación, no hay orden: mandas tu datagrama y rezas por que llegue. Y, sin embargo, es el protocolo que mueve las videollamadas, los juegos online, el DNS y hasta la hora exacta de Internet.

Esta unidad cierra el bloque de red con la otra cara de la moneda y sus dos grandes protocolos de aplicación sobre sockets: **HTTP** (el que mueve la web) y **NTP** (el que sincroniza los relojes). Entenderás cuándo la velocidad importa más que la fiabilidad, cómo se construye una petición HTTP a mano con un socket, y por qué tu ordenador sabe qué hora es sin tener un reloj atómico. El siguiente tema, [U06 · APIs REST y HTTP](/ApuntesPSP/06-apis-rest-y-http), tomará el relevo para automatizar todo esto con la librería `requests`.

Esta unidad se lee como un **libro de 9 capítulos**: los 8 primeros son teoría en progresión y el 9º aterriza todo en la práctica.

---

## 🎯 Objetivo de la unidad

Al terminar, serás capaz de:

- Explicar por qué UDP **no establece conexión** y qué implica (sin garantía de entrega ni de orden).
- Comparar **TCP y UDP** con criterio: fiabilidad contra velocidad, y elegir cuál usar según el caso.
- Implementar un **cliente UDP** con `sendto()` y `recvfrom()`, sin `connect()`.
- Implementar un **servidor UDP** con `bind()`, sin `accept()` ni `listen()`, y responder a la dirección del cliente.
- Describir cómo los datagramas pueden **perderse, duplicarse o llegar desordenados**, y por qué UDP lo asume.
- Construir un **cliente HTTP manual** hablando el protocolo a pelo con un socket TCP.
- Obtener la hora oficial de Internet con un cliente **NTP** (puerto 123) usando UDP.
- Decidir, con casos reales (DNS, VoIP, streaming, juegos, web), **cuándo usar TCP y cuándo UDP**.
- Montar y depurar un **servidor + cliente eco UDP** completo.

---

## 🗺️ Mapa de la unidad

| Punto | Qué aprenderás | Nivel |
|---|---|---|
| [01 · TCP vs UDP](/ApuntesPSP/05-sockets-udp-y-protocolos/01-tcp-vs-udp) | La carta certificada contra el avión de papel: fiabilidad vs velocidad | Todos |
| [02 · Cliente UDP](/ApuntesPSP/05-sockets-udp-y-protocolos/02-cliente-udp) | Enviar y recibir sin conexión: `sendto()` y `recvfrom()` | Todos |
| [03 · Servidor UDP](/ApuntesPSP/05-sockets-udp-y-protocolos/03-servidor-udp) | `bind()`, recibir datagramas y saber de quién vienen | Todos |
| [04 · Datagramas y pérdida](/ApuntesPSP/05-sockets-udp-y-protocolos/04-datagramas-y-perdida) | Tamaño, paquetes perdidos, duplicados y orden no garantizado | Todos |
| [05 · HTTP desde cero](/ApuntesPSP/05-sockets-udp-y-protocolos/05-http-desde-cero) | El protocolo que mueve la web, hablado a pelo con un socket | Todos |
| [06 · NTP y servidores de tiempo](/ApuntesPSP/05-sockets-udp-y-protocolos/06-ntp-y-servidores-de-tiempo) | Sincronizar relojes con UDP y el puerto 123 | Todos |
| [07 · Cuándo usar cada protocolo](/ApuntesPSP/05-sockets-udp-y-protocolos/07-cuando-usar-cada-protocolo) | Criterios de decisión y casos reales (DNS, VoIP, streaming) | Todos |
| [08 · Práctica eco UDP](/ApuntesPSP/05-sockets-udp-y-protocolos/08-practica-eco-udp) | Servidor + cliente eco completos y ejercicios resueltos | Todos |
| [09 · Cierre](/ApuntesPSP/05-sockets-udp-y-protocolos/09-cierre) | Sé el datagrama, Fireside, Laboratorio de tortura, Crucigrama… | Todos |

> 📖 **Flujo de lectura:** los 8 primeros puntos son teoría en progresión. El 9º es el aterrizaje práctico: léelo justo después del 8º y antes de abrir los boletines.

---

## 📝 Boletines de la unidad

> Practica con los pares del curso: empezar siempre el resuelto para ver el estilo y luego intentar el por-resolver.

<div class="ejercicio-links">
  <a href="/ApuntesPSP/boletines/boletin-u05-inicial-resuelto" class="elink">✅ Inicial resuelto</a>
  <a href="/ApuntesPSP/boletines/boletin-u05-inicial" class="elink">🟢 Inicial por resolver</a>
  <a href="/ApuntesPSP/boletines/boletin-u05-avanzado-resuelto" class="elink">💪 Avanzado resuelto</a>
  <a href="/ApuntesPSP/boletines/boletin-u05-avanzado" class="elink">⭐ Avanzado por resolver</a>
</div>

---

## ✅ Criterios de evaluación cubiertos (RA3)

**RA3 — Sockets: comunicaciones en red con TCP/UDP y protocolos de aplicación (HTTP, NTP).**

| CE | Criterio | Dónde se cubre |
|---|---|---|
| a) | Modelo de capas de red (TCP/IP) | ✅ Punto 1 |
| b) | Identifica tipos de sockets (TCP/UDP) | ✅ Puntos 1-4 |
| e) | Implementa servidores y clientes UDP | ✅ Puntos 2, 3 y 8 + ⚡ Laboratorio (punto 9) |
| h) | Implementa protocolos de aplicación (HTTP, NTP) | ✅ Puntos 5 y 6 |

> RA3c (servidor TCP), RA3d (cliente TCP), RA3f (errores) y RA3g (opciones) se cubren en la **U04 · Sockets TCP**.

---

## 🚪 ¿Por dónde empiezo?

¿Vienes de la U04 y dominas los sockets TCP? Perfecto, ese es el trampolín ideal: repasa la [U04 · Sockets TCP](/ApuntesPSP/04-sockets-tcp) para tener frescos `accept()`, `listen()`, `connect()` y el three-way handshake, y arranca en el [punto 1](/ApuntesPSP/05-sockets-udp-y-protocolos/01-tcp-vs-udp), que parte justo de ahí: TCP contra UDP.

¿Ya sabes qué es UDP y solo necesitas NTP, el HTTP manual o la práctica final? Ve directo a los [puntos 5](/ApuntesPSP/05-sockets-udp-y-protocolos/05-http-desde-cero), [6](/ApuntesPSP/05-sockets-udp-y-protocolos/06-ntp-y-servidores-de-tiempo) y [8](/ApuntesPSP/05-sockets-udp-y-protocolos/08-practica-eco-udp). Si vienes de cero en sockets, no te saltes los puntos 1 a 4: los conceptos de datagrama y conexión son la base de todo lo demás.

**📍 Primer punto:** [01 · TCP vs UDP](/ApuntesPSP/05-sockets-udp-y-protocolos/01-tcp-vs-udp)  
**⏭️ Al acabar la unidad, continúa en [U06 · APIs REST y HTTP](/ApuntesPSP/06-apis-rest-y-http).**