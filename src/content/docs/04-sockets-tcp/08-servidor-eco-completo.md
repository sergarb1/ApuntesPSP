---
title: 08 — Servidor eco completo
description: "Servidor + cliente eco, mano a mano y ejercicios resueltos 🛠️"
---

<p><small>Servidor + cliente eco, mano a mano y ejercicios resueltos 🛠️</small></p>

> 🗺️ **Estás en:** 🔌 **U04 · Sockets TCP** → 08 · Servidor eco completo

---

## 📬 La idea en una frase

> La práctica clásica de TCP: un **servidor eco** que devuelve al cliente exactamente lo que recibe. Es el "Hola mundo" de los sockets y la base del laboratorio del [punto 9](/ApuntesPSP/04-sockets-tcp/09-cierre).

Junta todo lo aprendido: cliente ([punto 2](/ApuntesPSP/04-sockets-tcp/02-cliente-tcp)), servidor ([punto 3](/ApuntesPSP/04-sockets-tcp/03-servidor-tcp)) y `SO_REUSEADDR` ([punto 6](/ApuntesPSP/04-sockets-tcp/06-so-reuseaddr)). Con dos terminales verás el protocolo completo en acción.

---

## 🛠️ El servidor eco

```python
import socket

with socket.socket() as srv:
    srv.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    srv.bind(("127.0.0.1", 9000))
    srv.listen()
    print("Servidor eco escuchando en 127.0.0.1:9000")

    conn, addr = srv.accept()
    with conn:
        datos = conn.recv(1024)
        print(f"Recibido de {addr}: {datos.decode()}")
        conn.sendall(datos)  # Eco
```

El truco está en la última línea: **`conn.sendall(datos)`** devuelve los **mismos bytes** que llegaron. Eco, literalmente.

## 📤 El cliente que lo prueba

```python
import socket

with socket.socket() as cli:
    cli.connect(("127.0.0.1", 9000))
    cli.sendall(b"Prueba")
    print(cli.recv(1024).decode())
```

**Salida** del cliente (con el servidor en ejecución en otra terminal):

```
Prueba
```

---

## 🎭 Be the code, my friend — Mano a mano TCP

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

> `accept()` y `recv()` son **bloqueantes**: el programa se queda esperando hasta que algo ocurra. Ese "espera... ⏳" es el corazón de la conversación.

---

## 🧠 Mini-chequeo

1. ¿Qué línea del servidor eco lo convierte en "eco"?
2. ¿Qué le pasa al servidor si el cliente llama antes de que llegue a `accept()`?
3. ¿Qué dos llamadas son bloqueantes en el mano a mano?

<details>
<summary>🔄 Respuestas</summary>

1. **`conn.sendall(datos)`**: devuelve los mismos bytes que llegaron por `recv(1024)`.
2. Nada: el **three-way handshake** ocurre igual, y la conexión queda esperando en la cola de `listen()` hasta que el servidor haga `accept()`.
3. **`accept()`** (espera un cliente) y **`recv()`** (espera datos): ambas se quedan bloqueadas hasta que algo ocurre.

</details>

---

## ✏️ Aprieta el lápiz

1. **Eco server**: Crea un servidor que devuelva exactamente lo que recibe.
2. **Contador de letras**: El cliente envía una frase, el servidor responde con la cantidad de letras.
3. **Servidor hora**: El cliente se conecta y el servidor le devuelve la hora actual.
4. **Cliente con timeout**: Crea un cliente que intente conectar, y si no hay respuesta en 3s, muestre "Servidor no disponible".

<details>
<summary>🔓 Soluciones</summary>

**1. Eco server:**

```python
import socket
with socket.socket() as srv:
    srv.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    srv.bind(("127.0.0.1", 9000))
    srv.listen()
    conn, addr = srv.accept()
    with conn:
        datos = conn.recv(1024)
        conn.sendall(datos)
```

**2. Contador de letras:**

```python
import socket
with socket.socket() as srv:
    srv.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    srv.bind(("127.0.0.1", 9000))
    srv.listen()
    conn, addr = srv.accept()
    with conn:
        texto = conn.recv(1024).decode()
        conn.sendall(str(len(texto)).encode())
```

**3. Servidor hora:**

```python
import socket, time
with socket.socket() as srv:
    srv.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    srv.bind(("127.0.0.1", 9000))
    srv.listen()
    conn, addr = srv.accept()
    with conn:
        hora = time.strftime("%H:%M:%S")
        conn.sendall(hora.encode())
```

**4. Cliente con timeout:**

```python
import socket
with socket.socket() as cli:
    cli.settimeout(3)
    try:
        cli.connect(("127.0.0.1", 9000))
        cli.sendall(b"hola")
        print(cli.recv(1024).decode())
    except socket.timeout:
        print("Servidor no disponible")
```

</details>

---

## ✅ Resumen en 3 frases

- El servidor eco devuelve con `conn.sendall(datos)` exactamente lo que recibió con `recv(1024)`.
- En el mano a mano, `accept()` y `recv()` son los dos puntos bloqueantes que esperan al otro lado.
- Con el servidor en una terminal y el cliente en otra tienes el protocolo TCP completo funcionando.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| Eco | El servidor devuelve lo mismo que recibe |
| sendall(datos) | La jugada del eco: reenviar los bytes recibidos |
| Bloqueante | accept() y recv() esperan hasta que algo ocurre |
| Terminal del servidor | Ventana donde el servidor queda escuchando |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/04-sockets-tcp) · **Anterior:** [07 · Protocolos sobre TCP](/ApuntesPSP/04-sockets-tcp/07-protocolos-sobre-tcp) · **Siguiente:** [09 · Cierre](/ApuntesPSP/04-sockets-tcp/09-cierre)