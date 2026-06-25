---
title: "TEMA 05 — Sockets UDP y Protocolos"
nav_order: 05
---

## TEMA 05 — Sockets UDP y Protocolos (RA3)

> "UDP es como lanzar un avión de papel. TCP es como enviar una carta certificada. Cada uno tiene su momento."

---

## Índice

1. [UDP — sin conexión](#udp--sin-conexión)
2. [Servidor UDP](#servidor-udp)
3. [Cliente UDP](#cliente-udp)
4. [🥊 El ring de los conceptos — TCP vs UDP](#el-ring-de-los-conceptos--tcp-vs-udp)
5. [HTTP desde cero — el protocolo que mueve la web](#http-desde-cero--el-protocolo-que-mueve-la-web)
6. [Be the code, my friend, my friend — Cliente HTTP manual](#be-the-code-my-friend-my-friend--cliente-http-manual)
7. [NTP — ¿qué hora es en Internet?](#ntp--qué-hora-es-en-internet)
8. [Preguntas tontas — UDP y Protocolos](#preguntas-tontas--udp-y-protocolos)
9. [✏️ Aprieta el lápiz](#✏-aprieta-el-lápiz)
10. [RAs cubiertos y criterios de evaluación](#ras-cubiertos-y-criterios-de-evaluación)

---

## UDP — sin conexión

UDP **no establece conexión**. Mandas el mensaje y rezas porque llegue. No hay garantía de entrega ni de orden.

```python
import socket

# Socket UDP
s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
```

| Característica | TCP | UDP |
|----------------|-----|-----|
| Conexión | Sí (handshake) | No |
| Entrega garantizada | Sí | No |
| Orden | Sí | No |
| Velocidad | Más lento | Más rápido |
| Uso típico | Web, email, FTP | Streaming, juegos, DNS |

---

## Servidor UDP

Sin `accept()`, sin `listen()`. Solo `recvfrom()`.

```python
import socket

HOST = "127.0.0.1"
PORT = 5001

with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as servidor:
    servidor.bind((HOST, PORT))
    print(f"Servidor UDP en {HOST}:{PORT}")

    # Recibir datagrama (recvfrom devuelve datos + dirección)
    datos, direccion = servidor.recvfrom(1024)
    print(f"Recibido de {direccion}: {datos.decode()}")

    # Responder
    servidor.sendto(b"Recibido!", direccion)
```

---

## Cliente UDP

Sin `connect()`. `sendto()` en vez de `send()`.

```python
import socket

HOST = "127.0.0.1"
PORT = 5001

with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as cliente:
    cliente.sendto(b"Hola UDP!", (HOST, PORT))
    datos, _ = cliente.recvfrom(1024)
    print(f"Respuesta: {datos.decode()}")
```

> En UDP, cada `sendto()` es un datagrama independiente. Pueden llegar desordenados, duplicados o no llegar.

![](/diagrams/tcp-vs-udp.svg)

---

## 🥊 El ring de los conceptos — TCP vs UDP

**TCP**: "Yo soy el mensajero certificado. Entrego cada carta, en orden, y si se pierde, la reenvío. Pero cuesta más."

**UDP**: "Yo soy el lanzador de aviones de papel. Mando y olvido. Si no llega, pues no llega. Pero lanzo 100 en el tiempo que tú preparas uno."

**TCP**: "Mis casos de uso: web (HTTP), correo (SMTP), transferencia de archivos (FTP). Todo lo que necesite fiabilidad."

**UDP**: "Mis casos de uso: videollamadas (Zoom), streaming (Twitch), juegos online (Fortnite), DNS. Prefiero velocidad antes que fiabilidad."

**TCP**: "Tengo control de congestión, retransmisión, checksums..."

**UDP**: "Yo tengo... velocidad. Y puedo añadir fiabilidad en la capa de aplicación si quiero (QUIC, por ejemplo)."

**TCP**: "Eres un temerario."

**UDP**: "Y tú un pesado. Por eso nos complementamos."

---

## HTTP desde cero — el protocolo que mueve la web

HTTP es un protocolo de **texto** sobre TCP. Un cliente envía una petición y el servidor responde.

### Petición HTTP

```
GET /ruta HTTP/1.1\r\n
Host: ejemplo.com\r\n
User-Agent: MiNavegador\r\n
Accept: text/html\r\n
\r\n
```

### Respuesta HTTP

```
HTTP/1.1 200 OK\r\n
Content-Type: text/html\r\n
Content-Length: 1234\r\n
\r\n
<html>...cuerpo...</html>
```

---

## Be the code, my friend, my friend — Cliente HTTP manual

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

---

## NTP — ¿qué hora es en Internet?

NTP (Network Time Protocol) usa UDP para sincronizar relojes.

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

> Así es como tu ordenador sabe la hora exacta sin tener un reloj atómico.

---

## Preguntas tontas — UDP y Protocolos

**❓ ¿Cuándo usar UDP en vez de TCP?**
Cuando la velocidad importa más que la fiabilidad: streaming, juegos, VoIP, DNS. Perder un frame de video es mejor que esperar a que se reenvíe.

**❓ ¿UDP puede perder datos?**
Sí. No hay confirmación de recepción. Si pierdes un paquete, se pierde para siempre.

**❓ ¿HTTP siempre usa TCP?**
Sí, HTTP/1.1 y HTTP/2 usan TCP. **HTTP/3** usa QUIC, que va sobre UDP (¡la vuelta a la tortilla!).

**❓ ¿NTP usa UDP? ¿No es importante que llegue la hora exacta?**
Sí, NTP usa UDP. Pero manda muchas peticiones y calcula estadísticamente la hora correcta. Si un paquete se pierde, no pasa nada: el próximo valdrá.

---

## ✏️ Aprieta el lápiz

1. **Servidor UDP eco**: Crea un servidor UDP que devuelva al cliente lo mismo que recibe.
2. **Cliente HTTP manual**: Conéctate a `httpbin.org` y haz un GET a `/ip` para ver tu IP pública.
3. **Mini servidor web**: Crea un servidor TCP que responda con HTML básico ("<h1>Hola</h1>") a cualquier petición.
4. **Comparativa velocidad**: Mide cuánto tarda TCP vs UDP en enviar 100 mensajes pequeños.

---

## RAs cubiertos y criterios de evaluación

### RA3 — Sockets (completo)

| Criterio | Descripción | Cubierto |
|----------|-------------|----------|
| RA3a | Modelo de capas de red (TCP/IP) | ✅ |
| RA3b | Identifica tipos de sockets (TCP/UDP) | ✅ |
| RA3e | Implementa servidores y clientes UDP | ✅ |
| RA3h | Implementa protocolos de aplicación (HTTP, NTP) | ✅ |

> RA3c (servidor TCP), RA3d (cliente TCP), RA3f (errores) y RA3g (opciones) se cubren en el **TEMA 04**.
