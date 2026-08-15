---
title: Boletín U05 — Avanzado
description: Ejercicios avanzados de Sockets UDP y Protocolos
---

# 💪 Boletín U05 — Avanzado

> Ejercicios que requieren aplicar los conceptos de UDP, NTP, HTTP y la comparativa TCP/UDP de forma más profunda, con programas completos.

---

## 1. Cliente NTP manual

Crea un cliente UDP que obtenga la hora actual desde `pool.ntp.org` usando el puerto 123. Envía un paquete de 48 bytes (el primero con valor `\x1b` y el resto `\0`). Extrae el timestamp de los bytes 40 a 43 con `struct.unpack('!I', ...)` y ajústalo restando 2208988800 para convertirlo a hora Unix.

**Pista:** añade `s.settimeout(5)` antes del `recvfrom()`: si la respuesta se pierde (UDP), lanza una excepción en lugar de bloquearse para siempre.

## 2. Servidor UDP multimensaje

Crea un servidor UDP que reciba y responda a 3 mensajes consecutivos en un bucle antes de cerrarse. Cada respuesta debe incluir el número de orden: `"OK #1"`, `"OK #2"`, `"OK #3"`.

**Pista:** usa `for i in range(1, 4)` en lugar de `while True`: así el servidor se cierra solo tras la tercera respuesta. El `with` libera el socket al salir.

## 3. Cliente HTTP con parseo de cabeceras

Conéctate con un socket TCP a `example.com:80` y haz un GET a `/`. Una vez recibida la respuesta completa, parsea las cabeceras y muestra los valores de `Content-Type` y `Content-Length`.

**Pista:** separa cabeceras de cuerpo con `partition(b"\r\n\r\n")`. Recorre las líneas de las cabeceras buscando las que empiecen por `Content-Type:` y `Content-Length:`.

## 4. Cliente HTTP manual a `/ip`

Conéctate con un socket TCP a `httpbin.org:80` y haz un GET a `/ip`. Muestra los primeros 500 caracteres de la respuesta. Verás tu IP pública en el cuerpo.

**Pista:** envía `b"GET /ip HTTP/1.1\r\nHost: httpbin.org\r\nConnection: close\r\n\r\n"` y recibe en bucle con `recv(4096)` hasta que devuelva `b""`.

## 5. Compara TCP y UDP

Escribe un programa que mida cuánto tarda en completar 10 intercambios de mensajes contra un servidor TCP y contra un servidor UDP en local. Compara los tiempos.

**Pista:** en TCP cada intercambio exige `connect()` (handshake); en UDP basta un `sendto()` + `recvfrom()`. Mide con `time.time()` antes y después de cada bucle.

## 6. Mini servidor web

Crea un servidor TCP que escuche en `127.0.0.1:8080`, acepte una conexión, lea la petición (ignorándola) y responda con `HTTP/1.1 200 OK` y un HTML con `"<h1>Hola mundo</h1>"`.

**Pista:** usa `SO_REUSEADDR` con `setsockopt()` para poder relanzar el servidor sin esperar. Abre `http://127.0.0.1:8080` en el navegador para verlo.

## 7. Ping UDP

Cliente manda "PING", servidor responde "PONG". Mide cuánto tarda.

**Pista:** Necesitas dos funciones (servidor y cliente) ejecutándose en paralelo. Usa `threading.Thread` con `daemon=True` para lanzar el servidor. Mide el tiempo con `time.time()` antes y después del intercambio de mensajes.

## 8. Broadcast UDP

El servidor escucha en todas las interfaces y responde a cualquiera.

**Pista:** El servidor debe escuchar en `"0.0.0.0"` para aceptar conexiones de cualquier interfaz. Usa un bucle infinito con `recvfrom()` y responde con `sendto()` a la dirección de cada cliente.

## 9. HTTP desde cero con parseo

Cliente HTTP manual que parsea el código de estado y las cabeceras.

**Pista:** Después de recibir la respuesta HTTP completa, separa las cabeceras del cuerpo con `partition("\r\n\r\n")`. La primera línea de las cabeceras contiene el código de estado (ej: `HTTP/1.1 200 OK`).

## 10. Mini navegador web

Crea una función que descargue el HTML de una URL y lo guarde en un archivo.

**Pista:** Extrae el host y la ruta de la URL. Conéctate al puerto 80 del host, envía un GET con `Connection: close`. Tras recibir toda la respuesta, separa el cuerpo de las cabeceras con `partition(b"\r\n\r\n")` y escribe el cuerpo a un archivo.

## 11. Comparativa TCP vs UDP

Mide el tiempo de 100 mensajes con TCP y con UDP en local.

**Pista:** Necesitas servidores TCP y UDP separados ejecutándose en hilos. El servidor TCP requiere `accept()` por cada mensaje; el UDP solo `recvfrom()`. Mide el tiempo total para 100 intercambios en cada protocolo y compara.

## 12. Servidor HTTP simple

Crea un servidor TCP que entienda peticiones HTTP GET y sirva respuestas.

**Pista:** Con `accept()` obtienes la conexión. Lee la petición con `recv()` y parsea la primera línea (`GET /ruta HTTP/1.1`). Según la ruta, devuelve distinto contenido HTML con cabeceras HTTP válidas incluyendo `Content-Length`.