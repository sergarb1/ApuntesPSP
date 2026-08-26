---
title: Boletín U05 — Inicial
description: Ejercicios básicos de Sockets UDP y Protocolos
---

# 📝 Boletín U05 — Inicial

> Ejercicios básicos para afianzar los conceptos de UDP (cliente, servidor, eco), TCP vs UDP y el HTTP manual de la unidad U05.

---

## 1. Cliente UDP con entrada de usuario

Crea un cliente UDP que pida un mensaje al usuario por teclado con `input()`, lo envíe a `127.0.0.1:9001` y espere una respuesta.

## 2. Servidor UDP con eco personalizado

Crea un servidor UDP que escuche en `127.0.0.1:9001`. Al recibir un mensaje, responda con `"Recibido: "` seguido del mensaje original.

## 3. Servidor UDP contador

Crea un servidor UDP que lleve la cuenta de cuántos mensajes ha recibido. Al responder, incluya el número de mensaje (ej: `"Mensaje #1"`, `"Mensaje #2"`).

**Pista:** declara un contador fuera del bucle `while True:` e increméntalo en cada `recvfrom()`. La respuesta se construye con un f-string.

## 4. Cliente UDP mínimo

Crea un cliente UDP que envíe `b"Hola UDP"` a `127.0.0.1:9001`. No necesitas esperar respuesta: con `sendto()` y `with` basta.

## 5. Servidor UDP mínimo

Crea un servidor UDP que escuche en `127.0.0.1:9001`, reciba un datagrama y lo imprima con la dirección de quien lo envió.

## 6. Servidor UDP eco

Crea un servidor UDP que escuche en `127.0.0.1:9001` y devuelva al cliente **lo mismo** que recibe.

## 7. TCP vs UDP: clasifica

a) Clasifica cada aplicación como TCP o UDP y justifica brevemente:

- Web (HTTP)
- Videollamada (Zoom)
- Correo (SMTP)
- Juego online (Fortnite)
- Transferencia de archivos (FTP)
- DNS

b) Completa la tabla:

| Característica | TCP | UDP |
|---|---|---|
| Conexión | | |
| Entrega garantizada | | |
| Orden | | |
| Velocidad | | |

## 8. Cliente HTTP manual

Conéctate con un socket TCP a `www.example.com:80`, haz un GET a `/` y muestra los primeros 500 caracteres de la respuesta.

**Pista:** envía `"GET / HTTP/1.1\r\nHost: www.example.com\r\nConnection: close\r\n\r\n"` con `sendall()`. Recibe en bucle con `recv(4096)` acumulando bytes hasta que devuelva `b""`, y entonces decodifica.