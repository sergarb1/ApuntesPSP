---
title: 04 — Ciclo de vida y errores
description: "Handshake, cierre, TIME_WAIT, reuseaddr y timeouts bajo control 🤝"
---

<p><small>Handshake, cierre, TIME_WAIT, reuseaddr y timeouts bajo control 🤝</small></p>

> 🗺️ **Estás en:** 🔌 **UD 5 · Sockets TCP y UDP** → 04 · Ciclo de vida y errores

---

## 📬 La idea en una frase

> Una conexión TCP **nace, vive y muere**: arranca con un **three-way handshake**, transporta los datos y se cierra con un apretón de despedida; y cuando las redes fallan, tu programa debe saber **capturar el error y no quedarse bloqueado para siempre**.

En los [puntos 2](/ApuntesPSP/04-sockets-tcp-y-udp/02-cliente-tcp) y [3](/ApuntesPSP/04-sockets-tcp-y-udp/03-servidor-tcp) llamaste a `connect()` y `accept()` sin saber qué pasaba por dentro. Aquí levantas el capó, ves el protocolo de transporte, entiendes por qué relanzar un servidor a veces falla… y aprendes a ponerte a salvo de los fallos de red.

---

## 🤝 Three-way handshake (establecer conexión)

![Diagrama de secuencia del three-way handshake de TCP: SYN, SYN+ACK y ACK entre cliente y servidor hasta establecer la conexión](/ApuntesPSP/diagrams/tcp-handshake.svg)

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

1. **SYN** (synchronize): el cliente dice *"quiero hablar contigo"*.
2. **SYN + ACK**: el servidor contesta *"de acuerdo, y yo también quiero hablar contigo"*.
3. **ACK** (acknowledge): el cliente confirma *"recibido, hablemos"*.

A partir de ahí, **los datos fluyen en ambas direcciones**. Si cuentas los mensajes (3), tienes el nombre: **three-way handshake**. Es exactamente lo que ocurre dentro de tu `cliente.connect()`.

TCP garantiza que los datos lleguen **en orden** y **sin pérdidas**. A cambio, es un poco más lento que UDP: ese "orientado a conexión" significa que antes de enviar un solo byte, ambas partes se ponen de acuerdo con este saludo previo.

---

## 👋 Cierre de la conexión: la despedida

Cuando ya no hay más que decir, la conexión se cierra con un apretón de despedida:

```
CLIENTE                    SERVIDOR
   │                          │
   ├── FIN ──────────────────►│
   │◄── ACK ──────────────────┤
   │◄── FIN ──────────────────┤
   ├── ACK ──────────────────►│
   │                          │
```

1. Quien quiere cerrar envía **FIN** (*"no tengo más que enviar"*).
2. El otro lado responde **ACK** y, cuando también termina, envía su propio **FIN**.
3. El primero confirma con **ACK** y la conexión se libera.

> 💡 En Python no gestionas el cierre a mano: cuando el `with` termina (o llamas a `close()`), el SO ejecuta esta despedida por ti. Aunque lo parezca, **no es instantáneo**: el estado de cierre queda unos segundos en el sistema (TIME_WAIT, el problema del apartado siguiente).

---

## 😠 TIME_WAIT y "Address already in use"

```python
# 1ª ejecución del servidor: todo bien
srv.bind(("127.0.0.1", 5000))     # ✅ OK

# Matas el servidor con Ctrl+C y lo relanzas al instante...
srv.bind(("127.0.0.1", 5000))     # 💥 OSError: Address already in use
```

¿Por qué? Tras el cierre, la conexión entra en estado **TIME_WAIT** durante un tiempo breve (típicamente 1-2 minutos, 2×MSL): el SO mantiene reservado el par (IP, puerto) para asegurarse de que los últimos FIN/ACK no queden huérfanos. Mientras tanto, nadie más puede hacer `bind()` a ese puerto.

No es un capricho: la despedida TCP necesita tiempo para que los mensajes de cierre no lleguen tarde y revuelvan conexiones nuevas. Es **protección**, no burocracia. El problema es que, para un programador que reinicia su servidor mil veces al día, esa protección se convierte en un estorbo… hasta que aparece `SO_REUSEADDR`.

### La solución: `SO_REUSEADDR`

```python
import socket

servidor = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
servidor.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
servidor.bind(("127.0.0.1", 5000))
servidor.listen()
```

| Pieza | Significado |
|-------|-------------|
| `SOL_SOCKET` | "Nivel de opciones" del propio socket |
| `SO_REUSEADDR` | La opción que permite reutilizar la dirección |
| `1` | Activa la opción (0 la desactivaría) |

Con ella, el SO te deja hacer `bind()` al puerto aunque queden conexiones en `TIME_WAIT`. El servidor se puede **matar y reiniciar** sin esperar. **Pon esto siempre** en tus servidores: te ahorrará minutos de depuración.

---

## 📸 El ciclo completo, en una mirada

![Diagrama del ciclo de vida de una conexión TCP en el servidor: de socket() y bind() a close(), pasando por listen(), accept() y el intercambio de datos](/ApuntesPSP/diagrams/ciclo-vida-socket.svg)

```
socket() ──► bind() ──► listen() ──► accept() ──► recv()/send() ──► close()
   │                                     │             │             │
 CREAR                             SYN/SYN+ACK/   los datos      FIN/ACK
  teléfono                           ACK (handshake)  fluyen     (despedida)
```

El **ciclo de vida de la conexión** es la historia completa entre la primera `socket()` y el último `close()`: preparar el teléfono, estrechar la mano, hablar y colgar.

---

## 🛡️ Las redes fallan: `try/except` y timeouts

En los puntos 2 y 3 todo iba bien. En la vida real el servidor se cae, la red se corta o el mensaje tarda demasiado. Tu programa necesita **red de seguridad**.

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

- **`for intento in range(reintentos)`** → reintenta hasta 3 veces antes de rendirse.
- **`s.settimeout(5)`** → si una operación tarda más de 5 segundos, lanza `socket.timeout` en lugar de quedarse bloqueada para siempre.
- **`try/except` por excepción** → cada error tiene su propio tratamiento.
- **`return None`** al final → si tras 3 intentos no hay respuesta, el llamador sabe que falló.

### El mapa de excepciones

| Excepción | Cuándo ocurre |
|-----------|---------------|
| `socket.timeout` | La operación excede el tiempo límite |
| `ConnectionRefusedError` | No hay nadie escuchando en ese puerto |
| `ConnectionResetError` | El otro lado cerró de golpe |
| `ConnectionAbortedError` | El SO local aborta la conexión |
| `BrokenPipeError` | Escribes en un socket que ya se cerró |
| `OSError` | Red caída, DNS no resuelve, etc. |

> 💡 **Regla práctica:** primero captura las excepciones específicas (`socket.timeout`, `ConnectionResetError`, `BrokenPipeError`) y deja `OSError` como última red.

### Non-blocking y `select`

`recv()` y `accept()` son bloqueantes: se quedan esperando. Tres formas de controlar esa espera:

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

> `select.select()` es la solución para esperar en **varios sockets a la vez sin hilos**: le pasas la lista y te avisa cuáles están listos. Lo usarás a fondo en la [UD 6 · Servidores concurrentes](/ApuntesPSP/05-servidores-concurrentes).

---

## 🧠 Mini-chequeo

1. ¿Cuáles son los tres mensajes del handshake y en qué orden?
2. ¿Qué error lanza el SO al relanzar un servidor sin `SO_REUSEADDR` y qué estado lo causa?
3. ¿Qué excepción lanza `recv()` si se pasa el timeout y qué excepción si escribes en un socket ya cerrado?
4. ¿Cuál es la diferencia entre `ConnectionRefusedError` y `ConnectionResetError`?

<details>
<summary>🔄 Respuestas</summary>

1. **SYN** (cliente), **SYN + ACK** (servidor) y **ACK** (cliente). Después los datos fluyen en ambas direcciones.
2. **`OSError: Address already in use`**, causado por conexiones en estado **TIME_WAIT** tras el cierre.
3. **`socket.timeout`** si se excede el tiempo; **`BrokenPipeError`** si escribes en un socket ya cerrado.
4. **`ConnectionRefusedError`** → no hay nadie escuchando en ese puerto (al conectar). **`ConnectionResetError`** → el otro lado cerró la conexión de golpe (al hablar).

</details>

---

## ✅ Resumen en 3 frases

- Una conexión TCP arranca con el **three-way handshake** (SYN → SYN+ACK → ACK), transporta los datos y se cierra con **FIN/ACK**; tras el cierre, TIME_WAIT retiene el puerto un tiempo breve.
- **`setsockopt(SO_REUSEADDR, 1)`** antes del `bind()` evita el "Address already in use" al reiniciar servidores.
- Las redes fallan: captura cada error con su propio `except`, usa `settimeout()` para no bloquearte y `select()` para esperar en varios sockets sin hilos.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| Handshake | Saludo previo de TCP antes de enviar datos |
| SYN / ACK / FIN | Mensajes de apertura, confirmación y cierre |
| TIME_WAIT | Estado que retiene el puerto tras cerrar (1-2 min) |
| SO_REUSEADDR | Permite reutilizar la dirección y el puerto |
| Timeout | Tiempo máximo de espera de una operación |
| ConnectionRefusedError | No hay nadie escuchando en el puerto |
| ConnectionResetError | El otro lado cerró la conexión de golpe |
| select() | Espera en varios sockets a la vez sin hilos |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/04-sockets-tcp-y-udp) · **Anterior:** [03 · Servidor TCP](/ApuntesPSP/04-sockets-tcp-y-udp/03-servidor-tcp) · **Siguiente:** [05 · Cliente y servidor UDP](/ApuntesPSP/04-sockets-tcp-y-udp/05-cliente-y-servidor-udp)
