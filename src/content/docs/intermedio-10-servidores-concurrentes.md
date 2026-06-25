---
title: "📝 INTERMEDIO POR RESOLVER 10 — Servidores Concurrentes"
nav_order: 10
---
### 4. Servidor con timeout
Implementa un servidor que cierre la conexión si el cliente no envía datos en 5 segundos (usa `socket.settimeout` o `select`).

### 5. Cliente con timeout
Crea un cliente que intente conectarse a `127.0.0.1:9999` con timeout de 2 segundos. Captura la excepción `socket.timeout` y muestra "Servidor no disponible".

### 6. Contador de bytes totales
Añade un contador global de bytes recibidos (protegido con Lock) al servidor multihilo. Cada vez que un cliente envía datos, suma los bytes y muestra el total acumulado.
