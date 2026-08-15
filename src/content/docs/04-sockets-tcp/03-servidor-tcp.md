---
title: 03 — Servidor TCP
description: "bind, listen y accept: el que escucha y atiende 🛎️"
---

<p><small>bind, listen y accept: el que escucha y atiende 🛎️</small></p>

> 🗺️ **Estás en:** 🔌 **U04 · Sockets TCP** → 03 · Servidor TCP

---

## 📬 La idea en una frase

> El servidor TCP **descolgó primero**: reserva un puerto con `bind()`, avisa con `listen()` y se queda esperando con `accept()` a que un cliente llame. Todo el peso de la conversación recae sobre él.

En el [punto 2](/ApuntesPSP/04-sockets-tcp/02-cliente-tcp) el cliente marcaba el número. Este punto es la otra cara de la moneda: el servidor que **escucha**. Sin `bind()` no tiene puerto; sin `listen()` no anuncia que espera llamadas; sin `accept()` no recibe a nadie.

---

## 🔄 Ciclo de vida del servidor

```
socket() → bind() → listen() → accept() → recv()/send() → close()
```

Seis pasos. Los tres primeros (`socket`, `bind`, `listen`) son el "descolgar el teléfono"; `accept()` es el "¿diga?" que se queda esperando a que suene el timbre.

---

## 🐍 El servidor mínimo resuelto

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

**Salida** (tras ejecutar el cliente del punto 2 en otra terminal):

```
Servidor escuchando en 127.0.0.1:5000
Conectado con ('127.0.0.1', 54321)
Recibido: Hola servidor!
```

---

## 🧩 Cada método, al detalle

| Método | Qué hace | ¿Cuándo? |
|--------|----------|----------|
| `bind((HOST, PORT))` | Reserva la dirección y el puerto | Antes de escuchar |
| `listen()` | Prepara el socket para recibir conexiones | Tras el bind |
| `accept()` | Espera un cliente y devuelve `(conexion, direccion)` | En bucle |
| `recv(1024)` | Recibe datos del cliente conectado | Cuando llegan |
| `sendall(datos)` | Envía la respuesta | Cuando hay que contestar |

- **`bind()`** es la única forma de "poseer" un puerto: sin él, el socket no escucha en ningún sitio. Para el servidor es **obligatorio**; para el cliente, el SO asigna uno automáticamente.
- **`listen()`** avisa al SO: "prepárate, voy a aceptar llamadas entrantes". Sin ella, no hay puerto abierto y el cliente recibe `ConnectionRefusedError`.
- **`accept()`** es **bloqueante**: el servidor se queda esperando hasta que un cliente llama. Devuelve **dos cosas**: el socket de la conversación (`conexion`) y la dirección del cliente (`direccion`, una tupla `(IP, puerto)`).
- Fíjate: a partir de `accept()`, todo se hace con **`conexion`**, no con `servidor`. `servidor` solo escucha; `conexion` es el canal de esa llamada concreta.

---

## 🔁 El bucle de atención

El servidor de arriba atiende **un solo cliente** y termina. Para atender a varios, se envuelve el `accept()` en un bucle:

```python
import socket

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as servidor:
    servidor.bind(("127.0.0.1", 5000))
    servidor.listen()
    print("Servidor escuchando...")

    while True:
        conexion, direccion = servidor.accept()
        print(f"Conectado con {direccion}")
        with conexion:
            datos = conexion.recv(1024)
            print(f"Recibido: {datos.decode()}")
            conexion.sendall(b"Recibido: " + datos)
```

> ⚠️ Con este código básico, el servidor atiende **un cliente cada vez**: si llega un segundo mientras el primero habla, se queda en la cola de `listen()`. Para atender varios a la vez necesitas hilos o `select()`: eso es el **TEMA 10 — Servidores Concurrentes**.

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

## 🧠 Mini-chequeo

1. ¿Qué tres métodos preparan el servidor antes de atender a nadie?
2. ¿Qué devuelve `accept()` y por qué es bloqueante?
3. Tras `accept()`, ¿con qué objeto se recibe y envía: `servidor` o `conexion`?

<details>
<summary>🔄 Respuestas</summary>

1. **`socket()`**, **`bind((HOST, PORT))`** y **`listen()`**.
2. Devuelve una tupla **`(conexion, direccion)`**: el socket de la conversación y la dirección del cliente. Es **bloqueante** porque se queda esperando a que un cliente llame.
3. Con **`conexion`**: `servidor` solo escucha; `conexion` es el canal de esa llamada concreta.

</details>

---

## ✅ Resumen en 3 frases

- El servidor TCP sigue `socket() → bind() → listen() → accept() → recv()/send() → close()`.
- `bind()` reserva el puerto, `listen()` anuncia que espera llamadas y `accept()` bloquea hasta que un cliente llama.
- Para atender a varios clientes hay que envolver `accept()` en un bucle (y más adelante, usar hilos o `select()`).

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| bind() | Reserva la dirección y el puerto del servidor |
| listen() | Prepara el socket para conexiones entrantes |
| accept() | Acepta un cliente; bloqueante, devuelve (conexión, dirección) |
| conexion | El canal de la conversación con ese cliente |
| Bloqueante | La llamada espera hasta que algo ocurra |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/04-sockets-tcp) · **Anterior:** [02 · Cliente TCP](/ApuntesPSP/04-sockets-tcp/02-cliente-tcp) · **Siguiente:** [04 · Ciclo de vida de la conexión](/ApuntesPSP/04-sockets-tcp/04-ciclo-de-vida-de-la-conexion)