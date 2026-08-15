---
title: 07 — Protocolos sobre TCP
description: "HTTP hablado a pelo y el orden de los bytes 🌐"
---

<p><small>HTTP hablado a pelo y el orden de los bytes 🌐</small></p>

> 🗺️ **Estás en:** 🔌 **U04 · Sockets TCP** → 07 · Protocolos sobre TCP

---

## 📬 La idea en una frase

> TCP es solo el **tubería**; los protocolos de aplicación deciden **qué** se escribe dentro. El rey de todos es **HTTP** (el que mueve la web) y, al hablar por un socket, hasta el **orden de los bytes** importa.

Hasta aquí TCP te aseguraba que los bytes llegaran intactos y en orden. Pero ¿qué bytes? Ahí entran los protocolos de aplicación: el texto **HTTP** para la web, **SMTP** para el correo, **FTP** para archivos. Todos viajan dentro de un socket TCP, y en este punto lo verás con tus propios ojos.

---

## 🌐 HTTP desde cero: el protocolo que mueve la web

HTTP es un protocolo de **texto**: mandas una petición en texto claro y recibes una respuesta también en texto. Para hablar con un servidor web solo necesitas un socket TCP y el texto correcto:

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

La **petición** es solo texto:

```
GET / HTTP/1.1\r\n
Host: www.example.com\r\n
Connection: close\r\n
\r\n
```

Desglosemos:

| Línea | Qué hace |
|-------|----------|
| `GET / HTTP/1.1` | Verbo HTTP (`GET`), recurso (`/`) y versión |
| `Host: ...` | Qué servidor quiere el recurso (imprescindible) |
| `Connection: close` | "Ciérrame la conexión cuando termines" |
| `\r\n\r\n` (línea en blanco) | Marca el final de las cabeceras |

Y el bucle de lectura es el truco del [punto 2](/ApuntesPSP/04-sockets-tcp/02-cliente-tcp) en acción: `recv()` tantas veces como haga falta hasta que devuelva `b""` (el servidor cerró gracias a `Connection: close`), **concatenando** cada trozo.

> 💡 Esto es la base de la [U06 · APIs REST y HTTP](/ApuntesPSP/06-apis-rest-y-http): las librerías como `requests` hacen exactamente esto por debajo, pero ahora sabes el truco. HTTP sobre TCP también es un criterio de la [U05](/ApuntesPSP/05-sockets-udp-y-protocolos).

---

## 🔢 El orden de los bytes (byte ordering)

Cuando envías números (un puerto, una longitud, un ID) por la red, la pregunta es **en qué orden van sus bytes**. Dos máquinas pueden guardar los enteros "al revés" (little-endian o big-endian). Para no liarse, la red usa un estándar: **big-endian** (el byte más significativo primero), también llamado **network byte order**.

```python
import struct

# Empaquetar un entero en network byte order ('!' = big-endian)
datos = struct.pack("!I", 5000)      # el puerto 5000 como 4 bytes
print(datos)                          # b'\x00\x00\x13\x88'

# Desempaquetarlo de vuelta
puerto = struct.unpack("!I", datos)[0]
print(puerto)                         # 5000
```

| Código de formato | Significado |
|---|---|
| `!` | **Network byte order** (big-endian) |
| `I` | Entero sin signo de 4 bytes |
| `H` | Entero sin signo de 2 bytes |

> 💡 El estándar de red manda en el cable: `!I` y `!H` son los códigos que verás en todos los protocolos que hablan números (NTP, DNS, TCP mismo). Si una máquina empaqueta en su propio orden y otra desempaqueta en el suyo, el número sale **capicúa cambiado**.

---

## 🧠 Mini-chequeo

1. ¿Qué dos cosas envía el cliente HTTP con `sendall()` y cómo sabe cuándo ha terminado de leer?
2. ¿Qué significa `\r\n\r\n` en una petición HTTP?
3. ¿Qué código de `struct` usa big-endian y para qué sirve?

<details>
<summary>🔄 Respuestas</summary>

1. La **petición en texto** (GET con cabeceras). Lee en bucle con `recv()` hasta que devuelve `b""`, que significa que el servidor cerró la conexión (`Connection: close`).
2. La **línea en blanco** que marca el final de las cabeceras HTTP.
3. **`!`** (ej: `!I` para un entero de 4 bytes): fuerza **network byte order** (big-endian), el orden estándar de la red.

</details>

---

## ✅ Resumen en 3 frases

- TCP es la tubería; el **protocolo de aplicación** (HTTP, SMTP, FTP…) decide qué texto o bytes se escriben dentro.
- **HTTP es texto**: una petición GET con cabeceras, leída en bucle con `recv()` hasta el cierre.
- Los números se envían en **big-endian (network byte order)**, que en Python se fuerza con el prefijo `!` de `struct`.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| HTTP | Protocolo de texto sobre TCP que mueve la web |
| GET | Verbo HTTP para pedir un recurso |
| Cabecera HTTP | Línea `Nombre: valor` de la petición o respuesta |
| Network byte order | Orden estándar de bytes en la red (big-endian) |
| struct | Módulo para empaquetar/desempaquetar números en bytes |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/04-sockets-tcp) · **Anterior:** [06 · SO_REUSEADDR](/ApuntesPSP/04-sockets-tcp/06-so-reuseaddr) · **Siguiente:** [08 · Servidor eco completo](/ApuntesPSP/04-sockets-tcp/08-servidor-eco-completo)