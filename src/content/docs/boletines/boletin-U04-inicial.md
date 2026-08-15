---
title: Boletín U04 — Inicial
description: Ejercicios básicos de Sockets TCP
---

# 📝 Boletín U04 — Inicial

> Ejercicios básicos para afianzar los conceptos de sockets TCP: cliente, servidor, eco y la pareja IP/puerto de la unidad U04.

---

## 1. Servidor saludo

Crea un servidor TCP que, cuando un cliente se conecte, le envíe "Bienvenido al servidor" y luego cierre la conexión.

## 2. Cliente que envía y recibe

Crea un cliente que se conecte a 127.0.0.1:9000, envíe "Hola" y luego espere y muestre la respuesta del servidor.

## 3. Servidor contador

Crea un servidor que acepte una conexión, reciba un número como texto, lo convierta a entero, lo incremente en 1 y devuelva el resultado.

## 4. Servidor eco

Crea un servidor TCP que acepte una conexión, reciba un mensaje y devuelva exactamente lo mismo que recibe.

## 5. Cliente mínimo

Crea un cliente TCP que se conecte a 127.0.0.1:9000 y envíe `b"Hola servidor"`. No necesita esperar respuesta: con `connect()` y `with` basta.

## 6. Servidor mínimo

Crea un servidor TCP que escuche en 127.0.0.1:9000, acepte una conexión, reciba datos y los imprima por pantalla.

## 7. IP y puerto

Responde por escrito:

a) ¿Qué identifica la IP y qué identifica el puerto en una comunicación de red?
b) ¿Qué significa `127.0.0.1` y para qué se usa?
c) ¿Qué constante de Python crea un socket TCP y cuál un socket UDP?

**Pista:** repasa el punto 1 de la unidad: la IP identifica la **máquina**, el puerto identifica el **programa**; `127.0.0.1` es **localhost**; y los tipos de socket son `SOCK_STREAM` (TCP) y `SOCK_DGRAM` (UDP).

## 8. Servidor hora

Crea un servidor TCP que, cuando un cliente se conecte, le devuelva la hora actual con formato `HH:MM:SS` y cierre la conexión.

**Pista:** usa `time.strftime("%H:%M:%S")` para obtener la hora y envía el texto con `.encode()`.

---

📚 [Volver a la unidad](/ApuntesPSP/04-sockets-tcp) · Resuelto: [✅ Boletín U04 — Inicial (Resuelto)](/ApuntesPSP/boletines/boletin-u04-inicial-resuelto)