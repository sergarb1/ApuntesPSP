---
title: "TEMA 04 — Sockets TCP"
nav_order: 04
---

## TEMA 04 — Sockets TCP (RA3)

> "Un socket TCP es como una llamada telefónica: marcas, esperas a que contesten, habláis y colgáis."

---

## Índice

1. [¿Qué es un socket?](#qué-es-un-socket)
2. [TCP — orientado a conexión](#tcp--orientado-a-conexión)
3. [Servidor TCP — ciclo de vida](#servidor-tcp--ciclo-de-vida)
4. [Cliente TCP — ciclo de vida](#cliente-tcp--ciclo-de-vida)
5. [Be the code, my friend, my friend — Mano a mano TCP](#be-the-code-my-friend-my-friend--mano-a-mano-tcp)
6. [SO_REUSEADDR — no más "Address already in use"](#so_reuseaddr--no-más-address-already-in-use)
7. [Errores comunes y cómo manejarlos](#errores-comunes-y-cómo-manejarlos)
8. [Non-blocking y timeouts](#non-blocking-y-timeouts)
9. [🥊 El ring de los conceptos — Servidor vs Cliente](#el-ring-de-los-conceptos--servidor-vs-cliente)
10. [Preguntas tontas — Sockets TCP](#preguntas-tontas--sockets-tcp)
11. [✏️ Aprieta el lápiz](#✏-aprieta-el-lápiz)
12. [RAs cubiertos y criterios de evaluación](#ras-cubiertos-y-criterios-de-evaluación)

---

## ¿Qué es un socket?

Un **socket** es el punto final de una conexión de red. Es la interfaz que tu programa usa para enviar y recibir datos a través de la red.

```python
import socket

# Crear un socket TCP
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
```

| Parámetro | Significado | Valores |
|-----------|-------------|---------|
| `AF_INET` | Familia de direcciones | IPv4 |
| `AF_INET6` | IPv6 | |
| `SOCK_STREAM` | TCP (orientado a conexión) | |
| `SOCK_DGRAM` | UDP (sin conexión) | |

---

## TCP — orientado a conexión

TCP garantiza que los datos lleguen **en orden** y **sin pérdidas**. A cambio, es un poco más lento que UDP.

### Three-way handshake (establecer conexión)

```
CLIENTE                    SERVIDOR
   │                          │
   ├── SYN ──────────────────►│
   │◄── SYN + ACK ────────────┤
   ├── ACK ──────────────────►│
   │                          │
   ├── Datos ────────────────►│
│◄── Datos ────────────────┤
│                          │
```

![](/diagrams/tcp-handshake.svg)

---

## Servidor TCP — ciclo de vida

```
socket() → bind() → listen() → accept() → recv()/send() → close()
```

```python
import socket

HOST = "127.0.0.1"  # localhost
PORT = 5000

# 1. Crear socket
with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as servidor:

    # 2. Asignar dirección y puerto
    servidor.bind((HOST, PORT))

    # 3. Escuchar conexiones entrantes
    servidor.listen()
    print(f"Servidor escuchando en {HOST}:{PORT}")

    # 4. Aceptar una conexión (BLOQUEANTE)
    conexion, direccion = servidor.accept()
    print(f"Conectado con {direccion}")

    with conexion:
        # 5. Recibir datos
        datos = conexion.recv(1024)
        print(f"Recibido: {datos.decode()}")

        # 6. Enviar respuesta
        conexion.sendall(b"Recibido: " + datos)

    # 7. Se cierra solo al salir del with
```

---

## Cliente TCP — ciclo de vida

```
socket() → connect() → send()/recv() → close()
```

```python
import socket

HOST = "127.0.0.1"
PORT = 5000

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as cliente:
    cliente.connect((HOST, PORT))
    cliente.sendall(b"Hola servidor!")
    respuesta = cliente.recv(1024)
    print(f"Respuesta: {respuesta.decode()}")
```

---

## Be the code, my friend, my friend — Mano a mano TCP

> "Sé el servidor y el cliente. Cada paso, cada byte."

```
🟢 SERVIDOR
 1. socket(AF_INET, SOCK_STREAM) → srv
 2. bind(("127.0.0.1", 5000))
 3. listen()
 4. accept() → espera... ⏳

🔵 CLIENTE
 1. socket(AF_INET, SOCK_STREAM) → cli
 2. connect(("127.0.0.1", 5000))
    → Three-way handshake TCP

🟢 SERVIDOR
 4. accept() devuelve (conn, ("127.0.0.1", 54321))
 5. Esperando datos... ⏳

🔵 CLIENTE
 3. sendall(b"Hola servidor!")
 4. Esperando respuesta... ⏳

🟢 SERVIDOR
 5. recv(1024) → b"Hola servidor!"
 6. print("Recibido: Hola servidor!")
 7. sendall(b"Recibido: Hola servidor!")

🔵 CLIENTE
 4. recv(1024) → b"Recibido: Hola servidor!"
 5. print("Respuesta: Recibido: Hola servidor!")
 6. close()

🟢 SERVIDOR
 8. close()
```

> `accept()` y `recv()` son **bloqueantes**: el programa se queda esperando hasta que algo ocurra.

---

## SO_REUSEADDR — no más "Address already in use"

Si matas un servidor y lo reinicias rápido, el SO puede decir que la dirección ya está en uso. La opción `SO_REUSEADDR` lo evita.

```python
import socket

servidor = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
servidor.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
servidor.bind(("127.0.0.1", 5000))
servidor.listen()
```

> **Pon esto siempre** en tus servidores. Te ahorrarás minutos de depuración.

---

## Errores comunes y cómo manejarlos

```python
import socket, time

def conectar_seguro(host, port, reintentos=3):
    for intento in range(reintentos):
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.settimeout(5)
                s.connect((host, port))
                s.sendall(b"test")
                return s.recv(1024)
        except socket.timeout:
            print(f"⏱ Timeout (intento {intento+1})")
        except ConnectionRefusedError:
            print(f"🚫 Conexión rechazada — ¿el servidor está encendido?")
            time.sleep(1)
        except ConnectionResetError:
            print(f"💥 El servidor cerró la conexión abruptamente")
        except OSError as e:
            print(f"🔌 Error de red: {e}")
    return None
```

| Excepción | Cuándo ocurre |
|-----------|---------------|
| `socket.timeout` | La operación excede el tiempo límite |
| `ConnectionRefusedError` | No hay nadie escuchando en ese puerto |
| `ConnectionResetError` | El otro lado cerró de golpe |
| `OSError` | Red caída, DNS no resuelve, etc. |

---

## Non-blocking y timeouts

```python
import socket, select

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

# Opción 1: timeout fijo
s.settimeout(5.0)

# Opción 2: no bloqueante (lanza excepción si no hay datos)
s.setblocking(False)

# Opción 3: select (esperar con timeout en múltiples sockets)
lectura, _, _ = select.select([s], [], [], 1.0)
if lectura:
    datos = s.recv(1024)
```

> `select.select()` es la solución para esperar en varios sockets a la vez sin hilos.

---

## 🧩 Pool Puzzle — El ciclo de vida del socket

Las líneas de abajo están desordenadas. ¿Puedes ordenarlas para que formen un servidor TCP funcional?

```
a) with socket.socket() as srv:
b)     srv.listen()
c)     conn, addr = srv.accept()
d)     import socket
e)         conn.sendall(b"Bienvenido\n")
f)     srv.bind(("127.0.0.1", 5000))
g)     with conn:
h)         datos = conn.recv(1024)
```

<details>
<summary>🔓 Solución</summary>

**Orden correcto:** d → a → f → b → c → g → h → e

```python
import socket                        # d) primero, el import

with socket.socket() as srv:         # a) crear el socket
    srv.bind(("127.0.0.1", 5000))    # f) vincular a puerto
    srv.listen()                     # b) escuchar conexiones
    conn, addr = srv.accept()        # c) aceptar un cliente
    with conn:                       # g) usar with para cerrar
        datos = conn.recv(1024)      # h) recibir datos
        conn.sendall(b"Bienvenido\n")# e) responder al cliente
```

**Errores típicos:**
- `listen()` antes de `bind()` → lanza `OSError`
- `accept()` fuera del `with socket.socket()` → el socket se cierra
- Hacer `sendall()` antes de `recv()` → puede funcionar pero no es el protocolo típico (cliente habla primero)
</details>

---

## 🥊 El ring de los conceptos — Servidor vs Cliente

**Servidor**: — Yo soy el que hace todo el trabajo. Escucho, acepto, atiendo... todo el peso recae sobre mí.

**Cliente**: — ¿Trabajo dices? Yo soy el que inicia todo. Si no fuera por mí, tú estarías ahí escuchando en el puerto para siempre, como una planta.

**Servidor**: — Pero tengo que gestionar múltiples conexiones, mantener el estado, no caerme... Tú solo te conectas, mandas algo y te vas.

**Cliente**: — Y también gestiono errores: ¿y si el servidor no está? ¿y si hay timeout? ¿y si la red falla? No es tan sencillo.

**Servidor**: — Vale, vale. En realidad somos un equipo. Sin servidor no hay servicio, pero sin cliente no hay razón para existir.

> **Moraleja**: Servidor y cliente son dos caras de la misma moneda. El protocolo (quién envía qué y cuándo) es el verdadero protagonista.

---

## Preguntas tontas — Sockets TCP

**❓ ¿Qué pasa si el servidor no llama a `listen()`?**
El cliente recibe `ConnectionRefusedError`. Sin `listen()`, no hay puerto abierto.

**❓ ¿Y si no llamo a `bind()`?**
Para el servidor es obligatorio (necesita un puerto fijo). Para el cliente, el SO asigna uno automáticamente.

**❓ ¿`recv(1024)` significa que solo puedo recibir 1024 bytes?**
No, es el tamaño máximo del buffer. Si el mensaje es más grande, necesitas varios `recv()` y concatenar. Tú tienes que implementar el protocolo de aplicación para saber cuándo has recibido el mensaje completo.

**❓ ¿Puedo tener más de un cliente conectado a la vez?**
Con este código básico, no. Solo acepta un cliente cada vez. Para múltiples clientes, mira el **TEMA 10 — Servidores Concurrentes**.

**❓ ¿Qué es "127.0.0.1"?**
Es **localhost** — tu propia máquina. Perfecto para pruebas. Para que otros se conecten, usa tu IP real (ej: 192.168.1.x).

**❓ ¿Y si un cliente envía datos muy seguido?**
TCP los encola. El servidor los recibe en orden. Pero si el cliente envía más rápido de lo que el servidor lee, el buffer se llena y el cliente se bloquea.

---

## ✏️ Aprieta el lápiz

1. **Eco server**: Crea un servidor que devuelva exactamente lo que recibe.
2. **Contador de letras**: El cliente envía una frase, el servidor responde con la cantidad de letras.
3. **Servidor hora**: El cliente se conecta y el servidor le devuelve la hora actual.
4. **Cliente con timeout**: Crea un cliente que intente conectar, y si no hay respuesta en 3s, muestre "Servidor no disponible".

---

## RAs cubiertos y criterios de evaluación

### RA3 — Sockets (parcial: TCP)

| Criterio | Descripción | Cubierto |
|----------|-------------|----------|
| RA3a | Modelo de capas de red (TCP/IP) | ✅ |
| RA3c | Crea servidores TCP | ✅ |
| RA3d | Crea clientes TCP | ✅ |
| RA3f | Gestiona errores de red | ✅ |
| RA3g | Configura opciones de socket (SO_REUSEADDR, non-blocking) | ✅ |

> RA3b (UDP), RA3e (UDP servidor/cliente) y RA3h (protocolos HTTP/NTP) se cubren en el **TEMA 05**.
