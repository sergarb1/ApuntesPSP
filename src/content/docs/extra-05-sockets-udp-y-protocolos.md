---
title: "⭐ AVANZADO 5 — Sockets UDP y Protocolos"
nav_order: 5
---

## ⭐ AVANZADO 05 — Sockets UDP y Protocolos


---

### 1. 🎯 Ping UDP

Cliente manda "PING", servidor responde "PONG". Mide cuánto tarda.

**Pista**: Necesitas dos funciones (servidor y cliente) ejecutándose en paralelo. Usa `threading.Thread` con `daemon=True` para lanzar el servidor. Mide el tiempo con `time.time()` antes y después del intercambio de mensajes.

---

### 2. 🔍 Broadcast UDP

El servidor escucha en todas las interfaces y responde a cualquiera.

**Pista**: El servidor debe escuchar en `"0.0.0.0"` para aceptar conexiones de cualquier interfaz. Usa un bucle infinito con `recvfrom()` y responde con `sendto()` a la dirección de cada cliente.

---

### 3. 🧩 HTTP desde cero con parseo

Cliente HTTP manual que parsea el código de estado y las cabeceras.

**Pista**: Después de recibir la respuesta HTTP completa, separa las cabeceras del cuerpo con `partition("\r\n\r\n")`. La primera línea de las cabeceras contiene el código de estado (ej: `HTTP/1.1 200 OK`).

---

### 4. 🎭 Mini navegador web

Crea una función que descargue el HTML de una URL y lo guarde en un archivo.

**Pista**: Extrae el host y la ruta de la URL. Conéctate al puerto 80 del host, envía un GET con `Connection: close`. Tras recibir toda la respuesta, separa el cuerpo de las cabeceras con `partition(b"\r\n\r\n")` y escribe el cuerpo a un archivo.

---

### 5. ⏱ Comparativa TCP vs UDP

Mide el tiempo de 100 mensajes con TCP y con UDP en local.

**Pista**: Necesitas servidores TCP y UDP separados ejecutándose en hilos. El servidor TCP requiere `accept()` por cada mensaje; el UDP solo `recvfrom()`. Mide el tiempo total para 100 intercambios en cada protocolo y compara.

---

### 6. 🏗️ Servidor HTTP simple

Crea un servidor TCP que entienda peticiones HTTP GET y sirva respuestas.

**Pista**: Con `accept()` obtienes la conexión. Lee la petición con `recv()` y parsea la primera línea (`GET /ruta HTTP/1.1`). Según la ruta, devuelve distinto contenido HTML con cabeceras HTTP válidas incluyendo `Content-Length`.
