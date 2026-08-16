---
title: "09 — Cierre: consolida lo aprendido"
description: "Sé el Socket, laboratorio TCP y el cierre de la unidad 🧠"
---

<p><small>Sé el Socket, laboratorio TCP y el cierre de la unidad 🧠</small></p>

> 🗺️ **Estás en:** 🔌 **U04 · Sockets TCP** → 09 · Cierre

---

Has terminado la teoría: socket, cliente, servidor, handshake, errores, `SO_REUSEADDR` y protocolos sobre TCP. Este cierre es el aterrizaje: recorres lo aprendido con juegos, un laboratorio real con fallos intencionados y las preguntas que te harán en una entrevista. Léelo justo después del [punto 8](/ApuntesPSP/04-sockets-tcp/08-servidor-eco-completo) y antes de abrir los boletines.

---

## ⭐ Sé el Socket

> *Eres el socket del servidor, recién creado con `socket(AF_INET, SOCK_STREAM)`. Tu misión: escuchar, aceptar y atender a quien llame.*

**¿Qué pasa?**

1. Haces `bind(("127.0.0.1", 9000))`: reservas el puerto. **Ahora eres la centralita**.
2. Llamas a `listen()`: el SO ya sabe que esperas llamadas.
3. Te quedas en `accept()`... **esperas. Y esperas.** Eres bloqueante: no hay nada que hacer hasta que alguien llame.
4. Un cliente ejecuta `connect()` y el **three-way handshake** recorre la red (SYN → SYN+ACK → ACK). El timbre suena.
5. `accept()` despierta y devuelve `(conn, ("127.0.0.1", 54321))`: un **nuevo socket** para esa conversación, con la dirección del cliente.
6. Llegas a `recv(1024)`... **esperas otra vez**. Cuando el cliente manda `b"Hola!"`, despiertas.
7. Contestas con `sendall()` y, al salir del `with`, el socket de la conversación se cierra con la despedida FIN/ACK.
8. Y tú, el socket servidor, sigues en tu `accept()`: **esperando al siguiente cliente**.

**Todo el tiempo, el SO ha hecho el trabajo sucio: handshakes, despedidas, orden de bytes.**

> 💡 **Ahora tú:** ¿y si el cliente llama mientras sigues en el paso 6 atendiendo a otro? La conexión queda **en la cola** de `listen()` (el *backlog*), esperando tu próximo `accept()`. Eso es lo que viste en el [punto 3](/ApuntesPSP/04-sockets-tcp/03-servidor-tcp): un solo hilo atiende a un cliente cada vez.

---

## 🔥 Fireside Chat: Servidor vs Cliente

> *El ring de los conceptos: dos sockets discuten quién hace el trabajo duro.*

**Servidor:** — Yo soy el que hace todo el trabajo. Escucho, acepto, atiendo... todo el peso recae sobre mí.

**Cliente:** — ¿Trabajo dices? Yo soy el que inicia todo. Si no fuera por mí, tú estarías ahí escuchando en el puerto para siempre, como una planta.

**Servidor:** — Pero tengo que gestionar múltiples conexiones, mantener el estado, no caerme... Tú solo te conectas, mandas algo y te vas.

**Cliente:** — Y también gestiono errores: ¿y si el servidor no está? ¿y si hay timeout? ¿y si la red falla? No es tan sencillo.

**Servidor:** — Vale, vale. En realidad somos un equipo. Sin servidor no hay servicio, pero sin cliente no hay razón para existir.

> **Moraleja:** servidor y cliente son dos caras de la misma moneda. El protocolo (quién envía qué y cuándo) es el verdadero protagonista. En la [U05](/ApuntesPSP/05-sockets-udp-y-protocolos) conocerás al otro protagonista: el UDP, el avión de papel.

---

## 🕵️ ¿Quién Soy?

1. Soy el punto final de una conexión de red: la interfaz para enviar y recibir datos.
2. Soy el método del cliente que estrecha la mano antes de hablar.
3. Soy el método del servidor que se queda esperando a que alguien llame.
4. Soy el estado que mantiene el puerto reservado unos segundos tras cerrar.
5. Soy la opción que evita el "Address already in use".
6. Soy el método que devuelve al cliente exactamente lo que recibió: eco.

<details>
<summary>🔄 Respuestas</summary>

1. **El socket**.
2. **`connect()`** — dispara el three-way handshake.
3. **`accept()`** — bloqueante, espera a un cliente.
4. **TIME_WAIT**.
5. **`SO_REUSEADDR`**.
6. **`conn.sendall(datos)`** — reenviar lo recibido.

</details>

---

## 🤬 CONRAD VS EL MUNDO: "conexión reiniciada por el host"

**CONRAD:** — "Clásico: el cliente hace `recv()` y le salta *'ConnectionResetError'*. Pues claro. Razones: 1) **El servidor se cayó** en mitad de la conversación y su SO mandó un RST. 2) **Cerraste el servidor con Ctrl+C** mientras el cliente hablaba: misma historia. 3) El cliente intentó **escribir en un socket ya cerrado** → `BrokenPipeError`. 4) O el **timeout** se te pasó: `recv()` bloqueado para siempre porque nadie respondió."

**CONRAD:** — "Y lo mejor: *'pero yo hacía sendall y me daba error'*. ¡Pues claro! `sendall()` no avisa: es el SO quien lanza la excepción cuando la otra punta de la tubería ya no existe. Captura `ConnectionResetError` y `BrokenPipeError` por separado, como viste en el [punto 5](/ApuntesPSP/04-sockets-tcp/05-errores-y-manejo), y tu cliente dejará de morir a lo loco."

**CONRAD:** — "Y no me vengas con *'¿será que la red va lenta?'*. Si el servidor se reinició y volvió a arrancar, **sin `SO_REUSEADDR`** te salta *Address already in use* al instante. Tres errores, tres causas, tres soluciones: reintentos con `try/except`, `settimeout()`, y la línea mágica de `setsockopt`. A diagnosticar."

---

## ⚡ Laboratorio de Tortura: cliente y servidor TCP

> **Duración:** 45 minutos
> **Herramienta:** Python 3 (`socket`, sin instalar nada) + dos terminales

**Escenario:** construye un servidor eco TCP y un cliente que le mande mensajes, exactamente como en el [punto 8](/ApuntesPSP/04-sockets-tcp/08-servidor-eco-completo).

**Tareas paso a paso:**

1. **Escribe el servidor eco** (`servidor_eco.py`): `bind()` en `127.0.0.1:9000`, `listen()`, `accept()` y un bucle que haga `recv()` y responda con `sendall(datos)`. Imprime cada mensaje con su dirección.
2. **Escribe el cliente** (`cliente_eco.py`): pide un mensaje con `input()`, lo envía con `sendall()` y muestra la respuesta de `recv()`.
3. **Arranca el servidor** en una terminal y **el cliente** en otra. Envía tres mensajes seguidos y comprueba que el eco funciona y que el servidor ve la dirección de cada uno.
4. **Añade el contador**: haz que el servidor responda `"Eco #1: ..."`, `"Eco #2: ..."` llevando la cuenta de los mensajes recibidos.
5. **Añade `settimeout(3)`** al cliente y comprueba qué pasa si cierras el servidor antes de enviar.

**Fallo intencionado:** cierra el servidor con Ctrl+C y **relánzalo al instante**. ¿Qué pasa? Sin `SO_REUSEADDR`, el `bind()` falla con *"Address already in use"* porque las conexiones anteriores siguen en **TIME_WAIT**. Añade `servidor.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)` antes del `bind()` y comprueba que ahora sí puedes reiniciar sin esperar.

> **Pista 1:** el estado TIME_WAIT es el culpable de que el puerto no se libere al instante. Con `SO_REUSEADDR` activado (como en el [punto 6](/ApuntesPSP/04-sockets-tcp/06-so-reuseaddr)), el SO te deja reutilizar la dirección aunque queden conexiones en ese estado.
>
> **Pista 2:** si el cliente se queda colgado en `recv()`, ese es el síntoma clásico de "el servidor nunca respondió". Añade `cli.settimeout(3)` y verás la excepción `socket.timeout` aparecer a los 3 segundos, confirmando que la respuesta nunca llegó.

---

## 🏆 Logros de esta unidad

| Logro | Cómo conseguirlo |
|---|---|
| 🏅 **Telefonista** | Crear el primer socket TCP con `socket(AF_INET, SOCK_STREAM)` |
| 🏅 **Marca-Números** | Implementar un cliente con `connect()`, `sendall()` y `recv()` |
| 🏅 **Centralita** | Implementar un servidor con `bind()`, `listen()` y `accept()` |
| 🏅 **Handshaker** | Explicar el three-way handshake y el cierre FIN/ACK |
| 🏅 **Eco Master** | Montar un servidor + cliente eco en dos terminales |
| 🏅 **Fénix TCP** | Dominar `SO_REUSEADDR` y reiniciar servidores sin error |

---

## 🧠 Atrévete a Pensar

1. ¿Por qué el servidor hace `accept()` y no `recv()` directamente?
2. ¿Qué pasaría si dos programas intentan `bind()` al mismo puerto a la vez?
3. ¿Cuándo conviene `select()` frente a un `while True` con `accept()`?
4. ¿Por qué HTTP necesita saber cuándo acaba la respuesta si TCP ya "sabe" cuándo acaban los datos?
5. ¿Qué diferencia hay entre cerrar con `with` y dejar el socket sin cerrar?

<details>
<summary>💡 Soluciones</summary>

1. Porque `accept()` **crea la conexión dedicada** para ese cliente (devuelve `conn` y su dirección). Hasta que no se acepta, no hay un canal del que leer. `recv()` se usa sobre esa `conn`, no sobre el socket servidor.
2. El segundo `bind()` lanzaría **`OSError: Address already in use`**: un puerto es de un solo proceso a la vez (salvo `SO_REUSEADDR` para TIME_WAIT). Es la protección del SO contra dos programas pisándose.
3. `select()` cuando quieres **atender varios sockets en un solo hilo** (esperar a varios clientes a la vez sin bloquear por uno). El `while True` con `accept()` es válido para atender de uno en uno.
4. Porque TCP garantiza la **entrega de bytes**, pero no sabe "dónde termina un mensaje": eso es decisión del **protocolo de aplicación**. HTTP usa cabeceras con `Content-Length` y el cierre de conexión (`Connection: close`) para que el cliente sepa cuándo parar.
5. El `with` llama a `close()` automáticamente y el SO ejecuta la **despedida FIN/ACK**. Dejarlo sin cerrar mantiene la conexión ocupada y, en los servidores, acumula sockets abiertos que se quedan en TIME_WAIT.
</details>

---

## 🧩 Crucigrama de Bits

```
Horizontal:
1. Método del cliente TCP que establece la conexión (7 letras)
4. Paquete que inicia el three-way handshake (3 letras)
6. Opción que evita "Address already in use" (12 letras)
8. Método del servidor que espera un cliente (6 letras)

Vertical:
2. Método que envía todos los bytes de golpe (8 letras)
3. Dirección de tu propia máquina (9 letras)
5. Estado que mantiene el puerto reservado al cerrar (9 letras)
7. Método de eco: reenvía lo recibido (8 letras)
```

<details>
<summary>📝 Soluciones</summary>

**Horizontal:** 1. CONNECT, 4. SYN, 6. SOREUSEADDR, 8. ACCEPT
**Vertical:** 2. SENDALL, 3. LOCALHOST, 5. TIMEWAIT, 7. SENDALL

</details>

---

## 💬 Entrevista de trabajo

1. **"¿Qué es un socket? ¿Qué papel juegan la IP y el puerto?"**
2. **"Escribe un servidor TCP que reciba un mensaje y lo devuelva."**
3. **"¿Cómo funciona el three-way handshake? Explícalo con un diagrama."**
4. **"¿Qué errores pueden ocurrir al comunicar por sockets y cómo los manejas?"**
5. **"¿Qué es SO_REUSEADDR y cuándo lo necesitas?"**

> 💡 **Cómo encararlas:** la 2 y la 3 son las "preguntas reina". Para la 2, escribe el servidor del [punto 3](/ApuntesPSP/04-sockets-tcp/03-servidor-tcp) sin pensarlo: `socket()` + `bind()` + `listen()` + `accept()` + `recv()` + `sendall()`. Para la 3, dibuja el SYN → SYN+ACK → ACK sobre los dos extremos y cuenta por qué hace falta el tercer mensaje. Si sabes contarlo fluido, ya eres medio desarrollador de redes.

---

## 🤷 No hay preguntas tontas

> ❓ **¿Qué pasa si el servidor no llama a `listen()`?**

El cliente recibe `ConnectionRefusedError`. Sin `listen()`, no hay puerto abierto.

> ❓ **¿Y si no llamo a `bind()`?**

Para el servidor es obligatorio (necesita un puerto fijo). Para el cliente, el SO asigna uno automáticamente.

> ❓ **¿`recv(1024)` significa que solo puedo recibir 1024 bytes?**

No, es el tamaño máximo del buffer. Si el mensaje es más grande, necesitas varios `recv()` y concatenar. Tú tienes que implementar el protocolo de aplicación para saber cuándo has recibido el mensaje completo.

> ❓ **¿Puedo tener más de un cliente conectado a la vez?**

Con el código básico, no. Solo acepta un cliente cada vez. Para múltiples clientes, mira el **TEMA 10 — Servidores Concurrentes**.

> ❓ **¿Qué es "127.0.0.1"?**

Es **localhost** — tu propia máquina. Perfecto para pruebas. Para que otros se conecten, usa tu IP real (ej: 192.168.1.x).

> ❓ **¿Y si un cliente envía datos muy seguido?**

TCP los encola. El servidor los recibe en orden. Pero si el cliente envía más rápido de lo que el servidor lee, el buffer se llena y el cliente se bloquea.

---

## 🎬 Post-Créditos

> *Un socket TCP estrecha la mano. SYN, SYN+ACK, ACK. La llamada está en marcha.*

*El cliente habla; el servidor escucha; el eco vuelve exactamente igual que llegó.*

*El servidor se cae y renace. Esta vez, `SO_REUSEADDR` le deja volver al instante.*

*Y en una terminal lejana, un `recv()` espera paciente a que el mundo le envíe algo que leer.*

**PRÓXIMAMENTE EN U05:** *Sockets UDP. La carta certificada se convierte en avión de papel: sin handshake, sin confirmación, sin orden. Y con él, HTTP hablado a pelo y el reloj de Internet (NTP).*

---

## ✅ Criterios de evaluación cubiertos (RA3)

**RA3 — Sockets: comunicaciones en red con TCP/UDP y protocolos de aplicación (HTTP, NTP).**

| CE | Criterio | Cubierto |
|---|---|---|
| a) | Modelo de capas de red (TCP/IP) | ✅ Punto 1 + Fireside Chat |
| c) | Crea servidores TCP | ✅ Puntos 3 y 8 + ⚡ Laboratorio de Tortura |
| d) | Crea clientes TCP | ✅ Puntos 2 y 8 + ⚡ Laboratorio de Tortura |
| f) | Gestiona errores de red | ✅ Punto 5 + ⚡ Laboratorio con fallo intencionado |
| g) | Configura opciones de socket (SO_REUSEADDR, non-blocking) | ✅ Puntos 5 y 6 + ⚡ Laboratorio de Tortura |

> RA3b (UDP), RA3e (UDP servidor/cliente) y RA3h (protocolos HTTP/NTP) se cubren en la **U05 · Sockets UDP y Protocolos**.

---

📚 [Volver al índice de la unidad](/ApuntesPSP/04-sockets-tcp) · **Anterior:** [08 · Servidor eco completo](/ApuntesPSP/04-sockets-tcp/08-servidor-eco-completo) · **Siguiente:** **[U05 · Sockets UDP y Protocolos](/ApuntesPSP/05-sockets-udp-y-protocolos)**