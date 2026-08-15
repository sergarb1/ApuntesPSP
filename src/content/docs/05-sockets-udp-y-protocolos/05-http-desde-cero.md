---
title: 05 — HTTP desde cero
description: "El protocolo que mueve la web, hablado a pelo con un socket 🌐"
---

<p><small>El protocolo que mueve la web, hablado a pelo con un socket 🌐</small></p>

> 🗺️ **Estás en:** 📡 **U05 · Sockets UDP y Protocolos** → 05 · HTTP desde cero

---

## 📬 La idea en una frase

> HTTP es un protocolo de **texto** sobre TCP: un cliente envía una petición escrita y el servidor responde con otra. Con un socket y un par de `sendall()`/`recv()` puedes hablarle a cualquier web del mundo.

Esta unidad es de UDP, pero HTTP merece su capítulo aquí: es el protocolo de aplicación que ya rozaste en la U04 (el servidor web del TEMA 02) y que en la [U06](/ApuntesPSP/06-apis-rest-y-http) automatizarás con `requests`. Ahora lo vas a hablar **a pelo**: a mano, carácter por carácter.

---

## 📨 La petición HTTP

Cuando tu navegador quiere una página, manda un texto como este:

```
GET /ruta HTTP/1.1\r\n
Host: ejemplo.com\r\n
User-Agent: MiNavegador\r\n
Accept: text/html\r\n
\r\n
```

Desglose:

- **`GET /ruta HTTP/1.1`** → la **primera línea**: verbo, recurso y versión del protocolo.
- **`Host: ejemplo.com`** → obligatoria en HTTP/1.1: dice a qué sitio preguntamos (un servidor puede alojar muchos).
- **`User-Agent`**, **`Accept`** → cabeceras opcionales que describen quién pregunta y qué quiere.
- **`\r\n\r\n`** → **línea en blanco final**: el "ya está, esto era todo". Es la señal de que la petición terminó.

Los **verbos** principales:

| Verbo | Qué pide | Ejemplo |
|---|---|---|
| GET | Leer un recurso | Obtener una página o imagen |
| POST | Enviar datos al servidor | Mandar un formulario |
| PUT | Guardar/reemplazar un recurso | Subir un archivo |
| DELETE | Borrar un recurso | Eliminar algo del servidor |

---

## 📨 La respuesta HTTP

El servidor contesta con otro texto: una línea de estado, cabeceras, y el cuerpo:

```
HTTP/1.1 200 OK\r\n
Content-Type: text/html\r\n
Content-Length: 1234\r\n
\r\n
<html>...cuerpo...</html>
```

- **`HTTP/1.1 200 OK`** → la primera línea: versión, **código de estado** y su significado. `200` es "todo bien"; también verás `404 Not Found`, `500 Internal Server Error`, etc.
- **`Content-Type: text/html`** → qué tipo de contenido viene a continuación.
- **`Content-Length: 1234`** → cuántos bytes mide el cuerpo, para saber cuándo se acabó.
- **`\r\n\r\n`** → otra vez la línea en blanco separando cabeceras de **cuerpo** (el HTML en sí).

> 💡 El código de estado es la frase corta que el navegador nunca te muestra: cuando ves "404", estás leyendo la primera línea de esta respuesta.

---

## 🎭 Be the code, my friend: Cliente HTTP manual

> "Sé el navegador. Olvida `requests`. Abre un socket y habla HTTP como en los viejos tiempos."

```python
import socket

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    # Conectar al servidor web
    s.connect(("www.example.com", 80))

    # Enviar petición HTTP/1.1
    peticion = (
        "GET / HTTP/1.1\r\n"
        "Host: www.example.com\r\n"
        "Connection: close\r\n"
        "\r\n"
    )
    s.sendall(peticion.encode())

    # Recibir respuesta
    respuesta = b""
    while True:
        datos = s.recv(4096)
        if not datos:
            break
        respuesta += datos

# Mostrar los primeros 500 caracteres
print(respuesta.decode()[:500])
```

**Traza**:

```
1. socket() → crea socket TCP
2. connect("www.example.com", 80) → three-way handshake
3. Construye string HTTP: "GET / HTTP/1.1\r\nHost: www.example.com\r\n..."
4. sendall → envía bytes
5. Bucle recv → va recibiendo trozos de la respuesta
6. El servidor cierra conexión → recv devuelve b""
7. Decodifica bytes a string
8. Muestra "<!doctype html>..." ⬅️ ¡es el HTML de la web!
```

Dos detalles importantes:

- **`Connection: close`** → le pide al servidor que cierre la conexión al terminar: así el bucle del paso 6 sabe cuándo parar (`recv()` devuelve `b""`).
- **Los bytes se acumulan** con `respuesta += datos`: la respuesta de una web no llega de una pieza, sino en trozos. El bucle los junta todos.

Este ejercicio lo convertirás en una herramienta de verdad en la [U06](/ApuntesPSP/06-apis-rest-y-http): parsear el JSON, los códigos de estado y las cabeceras de forma sistemática. De momento, ya has hablado HTTP como un navegador de verdad.

---

## 🧠 Mini-chequeo

1. ¿Qué significa la línea en blanco `\r\n\r\n` en una petición HTTP?
2. ¿Qué indica el código `200` de una respuesta?
3. ¿Por qué el bucle de `recv()` acumula bytes hasta que llega `b""`?

<details>
<summary>🔄 Respuestas</summary>

1. Que la petición **ha terminado**: todo lo anterior son cabeceras; a partir de ahí, si hay cuerpo, va el contenido.
2. **`200 OK`**: la petición se procesó correctamente y el recurso viene en el cuerpo.
3. Porque la respuesta de una web llega **en trozos**, no de una pieza. Se acumulan hasta que `recv()` devuelve `b""`, que es la señal de que el servidor cerró la conexión (gracias a `Connection: close`).

</details>

---

## ✅ Resumen en 3 frases

- HTTP es un protocolo de texto sobre TCP: petición del cliente, respuesta del servidor, ambas con cabeceras y una línea en blanco final.
- La petición empieza con verbo + recurso + versión (`GET /ruta HTTP/1.1`); la respuesta con código de estado (`200 OK`).
- Con un socket TCP y `sendall()`/`recv()` puedes hablarle a cualquier web sin librerías: ese es el primer paso hacia las APIs de la U06.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| HTTP | Protocolo de texto sobre TCP que mueve la web |
| GET | Verbo para pedir un recurso |
| 200 OK | Código de estado: la petición fue bien |
| Cabecera | Línea `Nombre: valor` que describe petición o respuesta |
| \r\n\r\n | Línea en blanco que separa cabeceras de cuerpo |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/05-sockets-udp-y-protocolos) · **Anterior:** [04 · Datagramas y pérdida](/ApuntesPSP/05-sockets-udp-y-protocolos/04-datagramas-y-perdida) · **Siguiente:** [06 · NTP y servidores de tiempo](/ApuntesPSP/05-sockets-udp-y-protocolos/06-ntp-y-servidores-de-tiempo)