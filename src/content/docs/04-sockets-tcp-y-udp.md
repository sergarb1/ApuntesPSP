---
title: UD 5 — Sockets TCP y UDP
description: "Comunicaciones en red: clientes, servidores y protocolos 🔌"
nav_order: 04
---

<p><small>Comunicaciones en red: clientes, servidores y protocolos 🔌</small></p>

---

> "Un socket es como un teléfono: marcas, esperas a que contesten, habláis y colgáis. La diferencia es que TCP garantiza que cada palabra llegue; UDP lanza el mensaje y reza."

En la UD 4 sincronizaste hilos para que no se pisen entre sí dentro de un mismo programa. Ahora toca lo contrario: hacer que **procesos distintos, incluso en máquinas distintas, hablen entre ellos**. La herramienta son los **sockets**: TCP para cuando necesitas fiabilidad, UDP para cuando necesitas velocidad.

En esta unidad construirás tu primera conversación entre programas: un **cliente** que llama y un **servidor** que contesta. Aprenderás el three-way handshake de TCP, los errores típicos cuando la red se rompe, y también cómo usar UDP para datagramas sin conexión. Al final, montarás servidores eco en ambos protocolos.

---

## 🎯 Objetivo de la unidad

Al terminar, serás capaz de:

- Explicar qué es un **socket** y para qué sirven la **IP** y el **puerto**.
- Distinguir **TCP** (fiable, con conexión) de **UDP** (rápido, sin conexión).
- Implementar un **cliente TCP** con `connect()`, `sendall()` y `recv()`.
- Implementar un **servidor TCP** con `bind()`, `listen()` y `accept()`.
- Describir el **three-way handshake** y el cierre de una conexión TCP.
- Gestionar **errores de red** con `try/except`.
- Configurar **SO_REUSEADDR** y **timeouts** para servidores robustos.
- Implementar un **cliente UDP** con `sendto()` y `recvfrom()`.
- Implementar un **servidor UDP** con `bind()` y `recvfrom()`.
- Hablar **HTTP** a nivel de socket y entender **NTP** sobre UDP.
- Decidir cuándo usar TCP y cuándo UDP en un caso real.

---

## 🗺️ Mapa de la unidad

| Punto | Qué aprenderás | Nivel |
|---|---|---|
| [01 · Qué es un socket](/ApuntesPSP/04-sockets-tcp-y-udp/01-que-es-un-socket) | IP + puerto, TCP vs UDP, la analogía del teléfono | Todos |
| [02 · Cliente TCP](/ApuntesPSP/04-sockets-tcp-y-udp/02-cliente-tcp) | `connect()`, `sendall()` y `recv()`: el cliente que habla primero | Todos |
| [03 · Servidor TCP](/ApuntesPSP/04-sockets-tcp-y-udp/03-servidor-tcp) | `bind()`, `listen()` y `accept()`: el servidor que escucha | Todos |
| [04 · Ciclo de vida y errores](/ApuntesPSP/04-sockets-tcp-y-udp/04-ciclo-y-errores) | Handshake, cierre, TIME_WAIT, `SO_REUSEADDR`, timeouts | Todos |
| [05 · Cliente y servidor UDP](/ApuntesPSP/04-sockets-tcp-y-udp/05-cliente-y-servidor-udp) | `sendto()`, `recvfrom()` y la vida real de los datagramas | Todos |
| [06 · HTTP y NTP](/ApuntesPSP/04-sockets-tcp-y-udp/06-http-y-ntp) | HTTP hablado a pelo, byte ordering y el reloj de Internet | Todos |
| [07 · Cuándo usar cada protocolo](/ApuntesPSP/04-sockets-tcp-y-udp/07-cuando-usar-cada-protocolo) | Criterios de decisión y casos reales: DNS, VoIP, streaming | Todos |
| [08 · Práctica eco](/ApuntesPSP/04-sockets-tcp-y-udp/08-practica-eco) | Servidor + cliente eco en TCP y UDP, mano a mano | Todos |
| [09 · Cierre](/ApuntesPSP/04-sockets-tcp-y-udp/09-cierre) | Sé el socket, Fireside, Laboratorio de tortura… | Todos |

---

## 📝 Boletines de la unidad

> Practica con los pares del curso: empezar siempre el resuelto para ver el estilo y luego intentar el por-resolver.

<div class="ejercicio-links">
  <a href="/ApuntesPSP/boletines/boletin-u04-inicial" class="elink">🟢 Inicial por resolver</a>
  <a href="/ApuntesPSP/boletines/boletin-u04-inicial-resuelto" class="elink">✅ Inicial resuelto</a>
  <a href="/ApuntesPSP/boletines/boletin-u04-avanzado" class="elink">⭐ Avanzado por resolver</a>
  <a href="/ApuntesPSP/boletines/boletin-u04-avanzado-resuelto" class="elink">💪 Avanzado resuelto</a>
</div>

---

## ✅ Criterios de evaluación cubiertos (RA3)

**RA3 — Sockets: comunicaciones en red con TCP/UDP y protocolos de aplicación.**

| CE | Criterio | Dónde se cubre |
|---|---|---|
| RA3a | Modelo de capas de red (TCP/IP) | ✅ Punto 1 |
| RA3b | Protocolo UDP | ✅ Puntos 1 y 5 |
| RA3c | Crea servidores TCP | ✅ Puntos 3 y 8 + ⚡ Laboratorio (punto 9) |
| RA3d | Crea clientes TCP | ✅ Puntos 2 y 8 + ⚡ Laboratorio (punto 9) |
| RA3e | Crea servidores y clientes UDP | ✅ Punto 5 y 8 + ⚡ Laboratorio (punto 9) |
| RA3f | Gestiona errores de red | ✅ Punto 4 + ⚡ Laboratorio (punto 9) |
| RA3g | Configura opciones de socket | ✅ Punto 4 |
| RA3h | Protocolos HTTP/NTP sobre sockets | ✅ Punto 6 |

---

## 🚪 ¿Por dónde empiezo?

¿Vienes de la UD 4 y dominas hilos y sincronización? Empieza por el [punto 1](/ApuntesPSP/04-sockets-tcp-y-udp/01-que-es-un-socket), que parte de cero: qué es un socket, la IP y el puerto.

¿Ya sabes qué es un socket? Saltar al [punto 3](/ApuntesPSP/04-sockets-tcp-y-udp/03-servidor-tcp), al [4](/ApuntesPSP/04-sockets-tcp-y-udp/04-ciclo-y-errores) o al [5 (UDP)](/ApuntesPSP/04-sockets-tcp-y-udp/05-cliente-y-servidor-udp).

**📍 Primer punto:** [01 · Qué es un socket](/ApuntesPSP/04-sockets-tcp-y-udp/01-que-es-un-socket)
**⏭️ Al acabar la unidad, continúa en [UD 6 · Servidores concurrentes](/ApuntesPSP/05-servidores-concurrentes).**
