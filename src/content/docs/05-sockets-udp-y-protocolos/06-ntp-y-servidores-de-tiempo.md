---
title: 06 — NTP y servidores de tiempo
description: "¿Qué hora es en Internet? Sincronizar relojes con UDP ⏰"
---

<p><small>¿Qué hora es en Internet? Sincronizar relojes con UDP ⏰</small></p>

> 🗺️ **Estás en:** 📡 **U05 · Sockets UDP y Protocolos** → 06 · NTP y servidores de tiempo

---

## 📬 La idea en una frase

> **NTP** (Network Time Protocol) usa UDP para sincronizar relojes: tu ordenador manda un pequeño datagrama al puerto 123 de un servidor de tiempo y recibe la hora exacta en la respuesta.

Curioso, ¿verdad? Justo cuando la exactitud importa, NTP usa el protocolo "que pierde paquetes". La respuesta está en la estadística: NTP manda **muchas** peticiones y calcula la hora correcta de forma estadística. Si un paquete se pierde, no pasa nada: el próximo valdrá.

---

## ⏰ Por qué tu reloj no necesita ser atómico

Tu ordenador no tiene un reloj atómico, y aun así sabe qué hora es. La cadena es esta:

```
Tu ordenador ── UDP ──► pool.ntp.org:123
Tu ordenador ◄── UDP ── pool.ntp.org:123   (hora exacta)
```

- **`pool.ntp.org`** es un grupo de servidores de tiempo repartidos por el mundo; cualquier petición UDP al puerto **123** te devuelve la hora.
- NTP manda **múltiples peticiones** y cruza las respuestas para descontar el tiempo de viaje (latencia) y quedarse con la estimación más fiable.
- Por eso puede permitirse UDP: **un datagrama perdido es irrelevante** cuando manda muchos y promedia estadísticamente.

> Así es como tu ordenador sabe la hora exacta sin tener un reloj atómico.

---

## 🐍 Cliente NTP manual en Python

El paquete NTP es un datagrama de **48 bytes** con un formato binario muy concreto. Lo mínimo para consultar la hora:

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

Desglose de cada pieza:

- **`paquete = b'\x1b' + 47 * b'\0'`** → el primer byte `\x1b` fija la **versión** (NTPv4, bits 3-5) y el **modo cliente** (bits 0-2: valor 3). Los 47 bytes restantes van a cero: es el relleno del formato de 48 bytes.
- **`s.settimeout(5)`** → muy importante en UDP: si la respuesta no llega en 5 segundos, la petición lanza una excepción en lugar de bloquearse para siempre (el fantasma del [punto 2](/ApuntesPSP/05-sockets-udp-y-protocolos/02-cliente-udp)).
- **`s.sendto(paquete, ("pool.ntp.org", 123))`** → el cliente UDP del [punto 2](/ApuntesPSP/05-sockets-udp-y-protocolos/02-cliente-udp) en acción, esta vez contra un servidor real en el puerto **123**.
- **`struct.unpack('!I', datos[40:44])[0]`** → el servidor escribe su hora como un entero sin signo de 4 bytes (`!I`) en las posiciones **40-43** del datagrama. `struct` lo desempaqueta a un número.
- **`t - 2208988800`** → el timestamp NTP cuenta segundos desde **1900**; Unix los cuenta desde **1970**. La diferencia exacta (2208988800) ajusta la época.

**Salida**:
```
Hora NTP oficial: Sat Aug 15 10:42:07 2026
```

---

## 🧩 SNTP: la versión ligera para dispositivos

**SNTP** (Simple Network Time Protocol) es la versión simplificada de NTP para dispositivos que no necesitan la precisión extrema de un servidor de tiempo: routers domésticos, móviles, IoT. Hace la misma consulta básica, pero sin los algoritmos complejos de estimación de NTP completo. Para el 99% de las aplicaciones (que la hora no se desvíe más de un segundo) es más que suficiente.

---

## 🧠 Mini-chequeo

1. ¿Por qué NTP usa UDP si la hora debe ser exacta?
2. ¿En qué puerto escuchan los servidores NTP y de qué tamaño es el paquete de consulta?
3. ¿Para qué sirve `s.settimeout(5)` en el cliente NTP?

<details>
<summary>🔄 Respuestas</summary>

1. Porque **manda muchas peticiones** y calcula la hora de forma estadística: un paquete perdido no cambia nada, el siguiente valdrá. La fiabilidad sale del conjunto, no de cada envío.
2. En el puerto **123**, y la consulta es un datagrama de **48 bytes** con el primer byte en modo cliente (`\x1b`).
3. Para que el `recvfrom()` **no se quede bloqueado para siempre** si la respuesta se pierde (como pasa con UDP): a los 5 segundos lanza una excepción y el programa puede seguir.

</details>

---

## ✅ Resumen en 3 frases

- NTP sincroniza relojes con UDP: un datagrama de 48 bytes al puerto 123 devuelve la hora exacta.
- Puede permitirse UDP porque promedia muchas peticiones: un paquete perdido es irrelevante.
- El timestamp viene en los bytes 40-43 del datagrama, se ajusta restando 2208988800 segundos de época, y `settimeout()` evita bloqueos eternos.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| NTP | Protocolo que sincroniza relojes con UDP |
| pool.ntp.org | Grupo mundial de servidores de tiempo |
| Puerto 123 | Puerto estándar de NTP |
| Época | Referencia de tiempo (NTP 1900, Unix 1970) |
| SNTP | Versión ligera de NTP para dispositivos sencillos |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/05-sockets-udp-y-protocolos) · **Anterior:** [05 · HTTP desde cero](/ApuntesPSP/05-sockets-udp-y-protocolos/05-http-desde-cero) · **Siguiente:** [07 · Cuándo usar cada protocolo](/ApuntesPSP/05-sockets-udp-y-protocolos/07-cuando-usar-cada-protocolo)