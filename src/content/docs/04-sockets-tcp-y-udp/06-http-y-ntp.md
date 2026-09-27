---
title: 06 — HTTP y NTP
description: "HTTP hablado a pelo con un socket y la hora de Internet por UDP 🌐"
---

<p><small>HTTP hablado a pelo con un socket y la hora de Internet por UDP 🌐</small></p>

> 🗺️ **Estás en:** 🔌 **UD 5 · Sockets TCP y UDP** → 06 · HTTP y NTP

---

## 📬 La idea en una frase

> TCP y UDP son solo la **tubería**; los protocolos de aplicación deciden **qué** se escribe dentro. Aquí hablas con tus propios ojos **HTTP** (el protocolo que mueve la web, sobre TCP) y **NTP** (el reloj de Internet, sobre UDP).

---

## 🌐 HTTP desde cero: el protocolo que mueve la web

HTTP es un protocolo de **texto**: mandas una petición en texto claro y recibes una respuesta también en texto. Cuando tu navegador quiere una página, manda un texto como este:

```
GET /ruta HTTP/1.1\r\n
Host: ejemplo.com\r\n
User-Agent: MiNavegador\r\n
Accept: text/html\r\n
\r\n
```

| Línea | Qué hace |
|-------|----------|
| `GET /ruta HTTP/1.1` | Primera línea: **verbo**, recurso y versión |
| `Host: ejemplo.com` | Obligatoria en HTTP/1.1: a qué servidor hablamos |
| `User-Agent`, `Accept` | Cabeceras opcionales que describen quién pregunta y qué quiere |
| `\r\n\r\n` (línea en blanco) | Marca el **final de las cabeceras**: "ya estaba todo" |

Los **verbos** principales:

| Verbo | Qué pide | Ejemplo |
|---|---|---|
| GET | Leer un recurso | Obtener una página o imagen |
| POST | Enviar datos al servidor | Mandar un formulario |
| PUT | Guardar/reemplazar un recurso | Subir un archivo |
| DELETE | Borrar un recurso | Eliminar algo del servidor |

### La respuesta

```
HTTP/1.1 200 OK\r\n
Content-Type: text/html\r\n
Content-Length: 1234\r\n
\r\n
<html>...cuerpo...</html>
```

- **`HTTP/1.1 200 OK`** → versión, **código de estado** y significado. `200` es "todo bien"; también verás `404 Not Found`, `500 Internal Server Error`.
- **`Content-Type`** → qué tipo de contenido viene a continuación.
- **`Content-Length`** → cuántos bytes mide el cuerpo, para saber cuándo se acabó.
- **`\r\n\r\n`** → separa cabeceras de **cuerpo** (el HTML en sí).

### El cliente HTTP manual

```python
import socket

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    s.connect(("www.example.com", 80))
    s.sendall(b"GET / HTTP/1.1\r\nHost: www.example.com\r\nConnection: close\r\n\r\n")

    respuesta = b""
    while True:
        datos = s.recv(4096)
        if not datos:
            break
        respuesta += datos

print(respuesta.decode()[:500])
```

Dos detalles importantes:

- **`Connection: close`** → HTTP/1.1 mantiene la conexión abierta por defecto (*keep-alive*). Pedir `Connection: close` fuerza al servidor a cerrarla al terminar, y así el bucle sabe cuándo parar (`recv()` devuelve `b""`).
- **Los bytes se acumulan** con `respuesta += datos`: la respuesta de una web llega **en trozos**, no de una pieza. El bucle los junta todos.

> 💡 Esto es la base de la [UD 7 · HTTP y APIs REST](/ApuntesPSP/06-http-y-apis-rest): librerías como `requests` hacen exactamente esto por debajo, pero ahora sabes el truco.

---

## 🔢 El orden de los bytes (byte ordering)

Cuando envías números (un puerto, una longitud, un ID) por la red, la pregunta es **en qué orden van sus bytes**. Dos máquinas pueden guardar los enteros "al revés" (little-endian o big-endian). Para no liarse, la red usa **big-endian**, también llamado **network byte order**.

```python
import struct

# Empaquetar un entero en network byte order ('!' = big-endian)
datos = struct.pack("!I", 5000)      # el puerto 5000 como 4 bytes
print(datos)                          # b'\x00\x00\x13\x88'

# Desempaquetarlo de vuelta
puerto = struct.unpack("!I", datos)[0]
print(puerto)                         # 5000
```

| Código | Significado |
|---|---|
| `!` | **Network byte order** (big-endian) |
| `I` | Entero sin signo de 4 bytes |
| `H` | Entero sin signo de 2 bytes |

> 💡 Los códigos `!I` y `!H` los verás en todos los protocolos que hablan números (NTP, DNS, TCP mismo). Este es el truco que necesitas para el NTP que viene ahora.

---

## ⏰ NTP: sincronizar relojes con UDP

**NTP** (Network Time Protocol) usa UDP para sincronizar relojes: tu ordenador manda un pequeño datagrama al puerto 123 de un servidor de tiempo y recibe la hora exacta en la respuesta. Curioso: justo cuando la exactitud importa, NTP usa el protocolo "que pierde paquetes".


![Diagrama de NTP por UDP: el ordenador pide la hora a pool.ntp.org y recibe la hora exacta en dos datagramas](/ApuntesPSP/diagrams/ntp.svg)

- **`pool.ntp.org`** es un grupo de servidores de tiempo repartidos por el mundo; cualquier petición UDP al puerto **123** te devuelve la hora.
- NTP manda **múltiples peticiones** y cruza las respuestas para descontar la latencia y quedarse con la estimación más fiable.
- Por eso puede permitirse UDP: **un datagrama perdido es irrelevante** cuando manda muchos y promedia estadísticamente. Así tu ordenador sabe la hora sin tener un reloj atómico.

### Cliente NTP manual en Python

El paquete NTP es un datagrama de **48 bytes** con un formato binario muy concreto:

```python
import socket, struct, time

def hora_ntp():
    with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:
        s.settimeout(5)
        # Paquete NTP: 48 bytes, modo cliente
        paquete = b'\x1b' + 47 * b'\0'
        s.sendto(paquete, ("pool.ntp.org", 123))
        datos, _ = s.recvfrom(1024)

    # El timestamp está en los bytes 40-43
    t = struct.unpack('!I', datos[40:44])[0]
    # Ajustar época NTP (1900) a Unix (1970)
    return t - 2208988800

hora = hora_ntp()
print(f"Hora NTP oficial: {time.ctime(hora)}")
```

- **`paquete = b'\x1b' + 47 * b'\0'`** → el primer byte `00011011` pone el **modo cliente** y la **versión NTP v3**; los 47 bytes restantes son relleno del formato de 48 bytes.
- **`s.settimeout(5)`** → muy importante en UDP: si la respuesta no llega en 5 segundos, lanza una excepción en lugar de bloquearse para siempre.
- **`struct.unpack('!I', datos[40:44])`** → el servidor escribe su hora como entero de 4 bytes en **network byte order** (el `!` del byte ordering) en las posiciones 40-43.
- **`t - 2208988800`** → el timestamp NTP cuenta desde **1900**; Unix desde **1970**. La diferencia exacta ajusta la época.

> **SNTP** (Simple Network Time Protocol) es la versión ligera de NTP para routers domésticos, móviles e IoT: para el 99% de las aplicaciones es más que suficiente.

---

## 🧠 Mini-chequeo

1. ¿Qué significa la línea en blanco `\r\n\r\n` en una petición HTTP y qué indica el código `200`?
2. ¿Qué código de `struct` usa big-endian y por qué lo necesita el cliente NTP?
3. ¿Por qué NTP usa UDP si la hora debe ser exacta?

<details>
<summary>🔄 Respuestas</summary>

1. Que la petición **ha terminado** (fin de cabeceras); **`200 OK`** significa que la petición se procesó correctamente.
2. **`!`** (ej: `!I`): fuerza **network byte order**. El servidor NTP escribe su timestamp en ese orden, así que hay que leerlo igual.
3. Porque **manda muchas peticiones** y calcula la hora estadísticamente: un paquete perdido no cambia nada, el siguiente valdrá.

</details>

---

## ✅ Resumen en 3 frases

- **HTTP es texto sobre TCP**: una petición GET con cabeceras, leída en bucle con `recv()` hasta el cierre; los verbos (GET, POST, PUT, DELETE) y códigos (200, 404) son la base de las APIs de la UD 7.
- Los números viajan en **network byte order (big-endian)**, que en Python se fuerza con el prefijo `!` de `struct`.
- **NTP** sincroniza relojes con un datagrama UDP de 48 bytes al puerto 123: puede permitirse UDP porque promedia muchas peticiones y `settimeout()` evita bloqueos eternos.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| HTTP | Protocolo de texto sobre TCP que mueve la web |
| GET / POST / PUT / DELETE | Verbos HTTP para leer, enviar, guardar y borrar |
| 200 OK | Código de estado: la petición fue bien |
| \r\n\r\n | Línea en blanco que separa cabeceras de cuerpo |
| Network byte order | Orden estándar de bytes en la red (big-endian) |
| NTP | Protocolo que sincroniza relojes con UDP (puerto 123) |
| pool.ntp.org | Grupo mundial de servidores de tiempo |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/04-sockets-tcp-y-udp) · **Anterior:** [05 · Cliente y servidor UDP](/ApuntesPSP/04-sockets-tcp-y-udp/05-cliente-y-servidor-udp) · **Siguiente:** [07 · Cuándo usar cada protocolo](/ApuntesPSP/04-sockets-tcp-y-udp/07-cuando-usar-cada-protocolo)
