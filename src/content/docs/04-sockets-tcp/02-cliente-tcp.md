---
title: 02 — Cliente TCP
description: "connect, sendall y recv: el cliente que habla primero 🗣️"
---

<p><small>connect, sendall y recv: el cliente que habla primero 🗣️</small></p>

> 🗺️ **Estás en:** 🔌 **U04 · Sockets TCP** → 02 · Cliente TCP

---

## 📬 La idea en una frase

> El cliente TCP **marca el número**: crea el socket, se conecta con `connect()`, envía con `sendall()`, recibe con `recv()` y cierra. Sin cliente nadie llama; sin él, el servidor esperaría en el puerto para siempre.

En el [punto 1](/ApuntesPSP/04-sockets-tcp/01-que-es-un-socket) viste qué es un socket. Aquí lo pones a trabajar por el lado del **cliente**: el que inicia la conversación. En la analogía del teléfono, eres tú marcando el número y esperando a que contesten.

---

## 🔄 Ciclo de vida del cliente

```
socket() → connect() → send()/recv() → close()
```

Cuatro pasos en orden: **crear**, **conectar**, **hablar** y **cerrar**. El `with` de Python se encarga del cierre automático (paso 4) al salir del bloque.

---

## 🐍 El cliente mínimo resuelto

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

**Salida** (con el servidor del [punto 3](/ApuntesPSP/04-sockets-tcp/03-servidor-tcp) escuchando en el puerto 5000):

```
Respuesta: Recibido: Hola servidor!
```

---

## 🧩 Cada método, al detalle

| Método | Qué hace | ¿Cuándo? |
|--------|----------|----------|
| `socket(AF_INET, SOCK_STREAM)` | Crea el socket TCP | Siempre, lo primero |
| `connect((HOST, PORT))` | Establece la conexión (three-way handshake) | Antes de hablar |
| `sendall(datos)` | Envía **todos** los bytes | Cuando quieras mandar |
| `recv(1024)` | Recibe hasta 1024 bytes | Cuando esperes respuesta |
| `close()` / `with` | Libera la conexión | Al terminar |

- **`connect()`** lanza `ConnectionRefusedError` si no hay nadie escuchando en ese puerto. Es la forma de saber que el servidor no está encendido.
- **`sendall()`** se llama *all* porque garantiza que se envían **todos** los bytes (a diferencia de `send()`, que puede enviar solo una parte y tendrías que reintentar).
- **`recv(1024)`** no significa que *solo* puedas recibir 1024 bytes: es el **tamaño máximo del buffer**. Si el mensaje es más grande, necesitas varios `recv()` y concatenar. Tú tienes que implementar el protocolo de aplicación para saber cuándo has recibido el mensaje completo.
- El **`with`** cierra el socket automáticamente al salir: si lo usas, no necesitas `close()` explícito.

---

## 🎭 Be the code, my friend — Cliente TCP

> "Sé el cliente. Cada paso, cada byte."

```
🔵 CLIENTE
 1. socket(AF_INET, SOCK_STREAM) → cli
 2. connect(("127.0.0.1", 5000))
    → Three-way handshake TCP
 3. sendall(b"Hola servidor!")
 4. Esperando respuesta... ⏳

🔵 CLIENTE
 4. recv(1024) → b"Recibido: Hola servidor!"
 5. print("Respuesta: Recibido: Hola servidor!")
 6. close()
```

> ⚠️ **`recv()` es bloqueante**: el programa se queda esperando hasta que lleguen datos. Si el servidor nunca responde, te quedas colgado ahí (para salir del apuro, verás los **timeouts** en el [punto 5](/ApuntesPSP/04-sockets-tcp/05-errores-y-manejo)).

---

## 🧠 Mini-chequeo

1. ¿Qué método establece la conexión con el servidor y qué error lanza si no hay nadie escuchando?
2. ¿Por qué usar `sendall()` y no `send()`?
3. ¿Qué hace `recv(1024)` y por qué no es un límite absoluto?

<details>
<summary>🔄 Respuestas</summary>

1. **`connect((HOST, PORT))`**, que lanza **`ConnectionRefusedError`** si no hay servidor en ese puerto.
2. Porque **`sendall()` garantiza el envío de todos los bytes**; `send()` puede mandar solo una parte y habría que reintentar.
3. **`recv(1024)`** recibe hasta 1024 bytes en una llamada: es el **tamaño máximo del buffer**. Si el mensaje es mayor, hay que llamar a `recv()` varias veces y **concatenar** los trozos.

</details>

---

## ✅ Resumen en 3 frases

- El cliente TCP sigue `socket() → connect() → send()/recv() → close()`.
- `connect()` estrecha la mano, `sendall()` envía todo y `recv(1024)` lee hasta 1024 bytes.
- El `with` cierra el socket solo; si el servidor no existe, `connect()` lanza `ConnectionRefusedError`.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| connect() | Establece la conexión TCP con el servidor |
| sendall() | Envía todos los bytes de golpe |
| recv() | Recibe datos; bloqueante hasta que llegan |
| Bloqueante | La llamada se queda esperando hasta que algo ocurra |
| ConnectionRefusedError | No hay nadie escuchando en ese puerto |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/04-sockets-tcp) · **Anterior:** [01 · Qué es un socket](/ApuntesPSP/04-sockets-tcp/01-que-es-un-socket) · **Siguiente:** [03 · Servidor TCP](/ApuntesPSP/04-sockets-tcp/03-servidor-tcp)