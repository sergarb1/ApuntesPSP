---
title: "📝 INTERMEDIO POR RESOLVER 5 — Sockets UDP y Protocolos"
nav_order: 5
---

### 4. Cliente NTP manual
Crea un cliente UDP que obtenga la hora actual desde `pool.ntp.org` usando el puerto 123. Envía un paquete de 48 bytes (el primero con valor `\x1b` y el resto `\0`). Extrae el timestamp de los bytes 40 a 43 con `struct.unpack('!I', ...)` y ajústalo restando 2208988800 para convertirlo a hora Unix.

### 5. Servidor UDP multimensaje
Crea un servidor UDP que reciba y responda a 3 mensajes consecutivos en un bucle antes de cerrarse. Cada respuesta debe incluir el número de orden: `"OK #1"`, `"OK #2"`, `"OK #3"`.

### 6. Cliente HTTP con parseo de cabeceras
Conéctate con un socket TCP a `example.com:80` y haz un GET a `/`. Una vez recibida la respuesta completa, parsea las cabeceras y muestra los valores de `Content-Type` y `Content-Length`.
