---
title: 09 — Servidor concurrente completo con procesos
description: El mismo servidor de la unidad, pero atendiendo con procesos independientes en lugar de hilos 🧱
---

<p><small>El mismo servidor de la unidad, pero atendiendo con procesos independientes en lugar de hilos 🧱</small></p>

> 🗺️ **Estás en:** 🏗️ **UD 6 · Servidores concurrentes** → 09 · Servidor concurrente completo con procesos

---

## 📬 La idea en una frase

> Este punto monta el servidor completo de la unidad, pero sustituyendo los hilos por **`multiprocessing.Process`**: cada cliente lo atiende un **proceso independiente** con su propia burbuja de memoria, el estado se comparte con **`manager.dict()`** y se protege con **`multiprocessing.Lock`**, y lo pruebas con un **cliente interactivo** (`cliente.py`) y con un **lanzador masivo** (`lanzaclientes.py`).

Es la pieza que faltaba para unir la red con los procesos: aquí conviven `socket`, `Process`, `Manager` y `Lock` en un mismo programa, que es exactamente el patrón de un servidor con aislamiento de fallos.

---

## 🤔 ¿Por qué procesos y no hilos?

El servidor de los [puntos 3 a 8](/ApuntesPSP/05-servidores-concurrentes/03-hilo-por-cliente) usa hilos, y funciona muy bien. Pero los procesos tienen tres ventajas que a veces pesan más:

| | Hilo | Proceso |
|---|---|---|
| Memoria | Compartida: un bug puede corromper el estado de todos | Aislada: cada uno vive en su burbuja |
| Fallo | Si un hilo trumba sin querer, puede tumbar el proceso entero | Si un proceso muere, **el servidor sigue vivo** |
| Coste | Muy ligero (milisegundos) | Más pesado (clona la memoria) |
| Escalado | Limitado por el GIL de Python | Aprovecha varios núcleos de verdad |

Cuando el enunciado de una práctica pide **aislamiento de fallos**, es esta última columna: cada cliente atendido en su propio proceso puede morir, bloquearse o lanzar una excepción sin arrastrar al resto del servidor.

---

## 🏗️ El servidor: `servidor.py`

Servidor TCP donde cada conexión la atiende un `multiprocessing.Process`, con el estado en un `manager.dict()` protegido por candado:

```python
import socket
import multiprocessing

def atender(conn, addr, estado, candado):
    """Proceso hijo: atiende a UN cliente con su propia memoria."""
    with conn:
        try:
            # Bucle de mensajes: la conversación dura hasta que el cliente
            # se desconecte o envíe "SALIR"
            while True:
                datos = conn.recv(1024)
                if not datos:          # El cliente ha cerrado: b"" en recv
                    break
                mensaje = datos.decode().strip()
                print(f"  [pid {multiprocessing.current_process().pid}] "
                      f"Recibido de {addr}: {mensaje}")

                if mensaje.upper() == "SALIR":
                    conn.sendall(b"Adios 👋")
                    break

                # Sección crítica: leer y actualizar el estado compartido
                with candado:
                    estado["atendidos"] = estado.get("atendidos", 0) + 1
                    estado["ultimo"] = mensaje
                    total = estado["atendidos"]

                conn.sendall(f"OK [{total}]: {mensaje}".encode())
        except (ConnectionResetError, BrokenPipeError, OSError):
            print(f"  [pid {multiprocessing.current_process().pid}] "
                  f"Cliente {addr} se desconectó a mitad")

def servidor_con_procesos():
    with multiprocessing.Manager() as manager:
        # Estado compartido entre TODOS los procesos (memoria en común)
        estado = manager.dict({"atendidos": 0, "ultimo": None})
        # Candado de PROCESOS: solo uno a la vez toca el estado
        candado = multiprocessing.Lock()

        with socket.socket() as srv:
            srv.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
            srv.bind(("127.0.0.1", 5000))
            srv.listen()
            print("🏗️  Servidor por PROCESOS escuchando en 127.0.0.1:5000")

            while True:
                conn, addr = srv.accept()
                # Cada cliente, su propio proceso (no su propio hilo)
                p = multiprocessing.Process(
                    target=atender,
                    args=(conn, addr, estado, candado),
                    name=f"cliente-{addr[1]}",
                )
                p.start()
                # IMPORTANTE: el padre cierra SU copia del socket.
                # El hijo recibió una copia al ser serializado como argumento;
                # si el padre no la cierra, el canal sigue "vivo" en su mano
                # y un cliente que espere respuesta podría colgarse.
                conn.close()
                print(f"[+] Cliente {addr} → proceso {p.name} (pid {p.pid})")

if __name__ == "__main__":
    try:
        servidor_con_procesos()
    except KeyboardInterrupt:
        print("\n🛑 Servidor detenido")
```

Pieza por pieza:

- **`manager.dict()`** es el "estado del servidor": todos los procesos hijos ven y actualizan el mismo diccionario, aunque cada uno tenga su burbuja de RAM. Sin él, cada hijo tendría su propio contador y nunca llegarían a un total común.
- **`multiprocessing.Lock()`** protege la sección crítica (`leer → sumar → escribir`) dentro de `with candado:`: dos procesos no pueden incrementar `atendidos` a la vez o perderíamos conexiones.
- **`Process(target=atender, args=(conn, addr, estado, candado))`** lanza el proceso hijo con todo lo que necesita. El socket `conn` se lo pasas como argumento: multiprocessing lo serializa y el hijo lo recibe listo para `recv`/`sendall`.
- **El bucle `while True` con `recv`** mantiene viva la conversación: solo se sale con `b""` (el cliente ha cerrado) o con el mensaje `SALIR`. Un `recv` suelto cerraría la conexión tras el primer mensaje.
- **`if __name__ == "__main__":`** es obligatorio: en Windows no hay `fork`, cada hijo vuelve a importar el script desde el principio y sin este guard entraría en un bucle infinito de procesos.
- **`conn.close()` tras `p.start()`** es la pieza que casi todo el mundo olvida: al pasar `conn` como argumento, el hijo recibe **su propia copia** del socket. Si el padre no cierra la suya, el canal permanece abierto en sus manos y un cliente que espere respuesta puede quedarse colgado aunque el hijo haya muerto.
- **`with conn:`** cierra el socket del hijo sí o sí, igual que en el servidor con hilos del [punto 8](/ApuntesPSP/05-servidores-concurrentes/08-servidor-concurrente-completo-con-hilos).

---

## 💬 El cliente: `cliente.py`

Cliente interactivo en Python: te registra, te deja hablar con el servidor por consola y termina limpio cuando se desconecta:

```python
import socket

def cliente():
    nombre = input("Tu nombre de usuario: ").strip() or "anónimo"
    try:
        with socket.socket() as s:
            s.connect(("127.0.0.1", 5000))
            s.sendall(f"REGISTRO:{nombre}".encode())
            print(f"📩 {s.recv(1024).decode().strip()}")

            # Bucle de conversación con el servidor
            while True:
                texto = input("tú> ").strip()
                if not texto:
                    continue
                s.sendall(texto.encode())
                respuesta = s.recv(1024).decode().strip()
                print(f"servidor> {respuesta}")
                if texto.upper() == "SALIR":
                    print("👋 Conexión cerrada")
                    break
    except ConnectionRefusedError:
        print("❌ Servidor no disponible. ¿Está arrancado en la terminal 1?")
    except (ConnectionResetError, BrokenPipeError):
        print("\n🛑 El servidor ha cerrado la conexión")

if __name__ == "__main__":
    cliente()
```

Traza del cliente:

1. **`input()`** pide el nombre (si no hay nada, usa `"anónimo"`).
2. **`socket()` → `connect()`** abre la conexión TCP al puerto 5000. Si el servidor no está, salta `ConnectionRefusedError` y el mensaje amable.
3. **`sendall(f"REGISTRO:{nombre}")`** se registra; el servidor lo guarda en su `manager.dict()` y responde con `recv(1024)`.
4. **Bucle**: cada línea que escribes se envía con `sendall()` y la respuesta llega con `recv(1024)`. `SALIR` cierra desde el cliente.
5. **`with socket`** se asegura de cerrar la conexión al salir (por cualquier vía).

> 💡 `recv(1024)` devuelve `b""` (bytes vacíos) cuando el otro extremo ha cerrado: por eso el servidor comprueba `if not datos: return` antes de intentar decodificar.

---

## 🚀 El lanzador: `lanzaclientes.py`

Para probar que el servidor atiende a muchos a la vez (la versión con procesos del lanzador del [punto 8](/ApuntesPSP/05-servidores-concurrentes/08-servidor-concurrente-completo-con-hilos)):

```python
import socket
import threading
import time

def cliente(i):
    try:
        with socket.socket() as s:
            s.connect(("127.0.0.1", 5000))
            s.sendall(f"cliente-{i}".encode())
            print(f"  ✅ cliente-{i}: {s.recv(1024).decode().strip()}")
    except Exception as e:
        print(f"  ❌ cliente-{i}: {e}")

print("Lanzando 10 clientes...")
inicio = time.time()
hilos = []
for i in range(10):
    t = threading.Thread(target=cliente, args=(i,))
    t.start()
    hilos.append(t)
for t in hilos:
    t.join()
print(f"🏁 Todos terminaron en {time.time() - inicio:.2f}s")
```

> 💡 El lanzador usa hilos **del lado del cliente** para disparar las conexiones a la vez: no es el servidor, no afecta al aislamiento de fallos que pide la práctica.

---

## 🤝 Cómo probarlos juntos

```
TERMINAL 1 (servidor)      TERMINAL 2 (cliente)      TERMINAL 3 (lanzador)
─────────────────────      ────────────────────      ─────────────────────
python servidor.py         python cliente.py          python lanzaclientes.py
🏗️  Servidor por PROCESOS…  Tu nombre de usuario: Ana  Lanzando 10 clientes...
[+] Cliente ('127.0.0.1,   Recibido: OK [1]:          ✅ cliente-0: OK [2]: cliente-0
   52341) → proceso          REGISTRO:Ana              ✅ cliente-1: OK [3]: cliente-1
   cliente-52341 (pid 8123) servidor> OK [2]: hola      … (todos responden)
   [pid 8123] Recibido…      servidor> OK [4]: adios    🏁 Todos terminaron en 0,15s
                            Conexión cerrada
```

Fíjate en dos cosas:

- Cada línea del servidor muestra **un PID distinto**: es el proceso hijo que atiende a ese cliente.
- El contador sube **compartido**: los 10 clientes del lanzador y el tuyo de la terminal 2 suman en el mismo `manager.dict()` gracias al candado (en la salida de arriba, el cliente interactivo ve cómo el contador salta de [1] a [4] porque los clientes del lanzador están atendiendo a la vez).

Se mata el servidor con **Ctrl+C**.

---

## ✏️ Aprieta el lápiz

1. **Añade el nombre al estado**: guarda en el `manager.dict()` qué nombres se han registrado (`estado["registrados"]`) y responde `STATUS` con la lista.
2. **Aísla un fallo**: haz que un cliente envíe "CRASH" y provoques una excepción dentro del proceso hijo; comprueba que el servidor sigue atiendo al resto.
3. **Recoge a los hijos**: guarda los objetos `Process` en una lista y haz `join()` a los que hayan terminado para no dejar procesos zombis.

<details>
<summary>🔓 Soluciones</summary>

**1. Nombres registrados:**

```python
# Dentro de atender(), tras el registro:
if mensaje.startswith("REGISTRO:"):
    nombre = mensaje.split(":", 1)[1]
    with candado:
        registrados = list(estado.get("registrados", []))
        if nombre not in registrados:
            registrados.append(nombre)
        estado["registrados"] = registrados
        total = len(registrados)
    conn.sendall(f"REGISTRO OK: {nombre} (van {total})".encode())
    return
```

**2. Fallo aislado:**

```python
# Dentro de atender(), al principio del try:
if mensaje == "CRASH":
    raise ValueError("Fallo provocado a propósito")
# El proceso hijo muere con su traceback, PERO el bucle accept()
# del padre sigue vivo y atiende al siguiente cliente sin problema.
```

**3. Recogida de hijos:**

```python
procesos = []
# ... tras cada Process(...).start():
procesos.append(p)

# De vez en cuando, recoger los que ya terminaron:
for p in procesos:
    if not p.is_alive():
        p.join()                      # Limpia el estado del hijo muerto
procesos = [p for p in procesos if p.is_alive()]
```

El orden importa: primero el `join()` a los que ya murieron (eso limpia su slot y evita el zombi) y después el filtro. En la práctica basta con un barrido periódico como este o dejar que el SO recoja al cerrar el servidor; lo importante es saber que los hijos no terminan solos si el padre no los espera.

</details>

---

## 🧠 Mini-chequeo

1. ¿Qué le pasa al servidor si un proceso hijo muere por una excepción?
2. ¿Por qué el estado va en `manager.dict()` y no en un dict normal del proceso padre?
3. ¿Por qué el bucle `accept()` vive en el padre y el `recv()` en el hijo?

<details>
<summary>🔄 Respuestas</summary>

1. Nada: el hijo muere con su propia burbuja y el bucle del padre, que sigue vivo, acepta al siguiente cliente. Ese es el aislamiento de fallos que no tiene la versión con hilos compartidos.
2. Porque un dict normal pertenecería a la burbuja del padre: los hijos no lo verían (lo clonarían al arrancar y sus escrituras se perderían). El proxy del Manager sí cruza la memoria entre todos.
3. Porque aceptar conexiones es un trabajo único y secuencial (el padre), mientras que atender cada conexión es trabajo independiente por cliente (el hijo): así el padre no se bloquea esperando datos de nadie.

</details>

---

## ✅ Resumen en 3 frases

- `servidor.py` atiende cada conexión con un `multiprocessing.Process` en lugar de un hilo, logrando aislamiento de fallos: un hijo que muere no tumba al servidor.
- El estado compartido vive en `manager.dict()` y se protege con `multiprocessing.Lock`, igual que el almacén del [ejemplo resuelto de la UD 2](/ApuntesPSP/01-gestion-de-procesos/09-ejemplo-resuelto-estado-compartido), pero ahora cruzando la capa de red.
- `cliente.py` (interactivo) y `lanzaclientes.py` (masivo) prueban el servidor desde dos terminales distintas, mostrando PIDs distintos por cliente.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| `Process(target=atender)` | Proceso hijo que atiende a un cliente |
| `manager.dict()` | Estado del servidor compartido entre procesos |
| `multiprocessing.Lock` | Candado que evita carreras al tocar el estado |
| Aislamiento de fallos | Un proceso que muere no afecta al resto |
| `current_process().pid` | PID del hijo, para trazar quién atiende a quién |
| `if __name__` | Guard obligatorio en Windows (spawn) para no crear bucles de procesos |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/05-servidores-concurrentes) · **Anterior:** [08 · Servidor concurrente completo con hilos](/ApuntesPSP/05-servidores-concurrentes/08-servidor-concurrente-completo-con-hilos) · **Siguiente:** [10 · Cierre](/ApuntesPSP/05-servidores-concurrentes/10-cierre)
