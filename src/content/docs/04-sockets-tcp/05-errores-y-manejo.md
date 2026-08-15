---
title: 05 — Errores y manejo
description: "Timeouts, reinicios y conexiones rechazadas bajo control 🛡️"
---

<p><small>Timeouts, reinicios y conexiones rechazadas bajo control 🛡️</small></p>

> 🗺️ **Estás en:** 🔌 **U04 · Sockets TCP** → 05 · Errores y manejo

---

## 📬 La idea en una frase

> Las redes **fallan**, y tu programa debe saber qué hacer cuando lo hacen. Los dos aliados son el **`try/except`** (capturar el error y reaccionar) y los **timeouts** (no quedarse esperando para siempre).

En los [puntos 2](/ApuntesPSP/04-sockets-tcp/02-cliente-tcp) y [3](/ApuntesPSP/04-sockets-tcp/03-servidor-tcp) todo iba bien. En la vida real el servidor se cae, la red se corta o el mensaje tarda demasiado. Este punto te da la **red de seguridad** para que tu cliente (y tu servidor) no exploten ante lo inesperado.

---

## 🐍 La función `conectar_seguro`

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

Repasemos qué hace cada pieza:

- **`for intento in range(reintentos)`** → reintenta hasta 3 veces antes de rendirse.
- **`s.settimeout(5)`** → si una operación tarda más de 5 segundos, lanza `socket.timeout` en lugar de quedarse bloqueada para siempre.
- **`try/except` por excepción** → cada error tiene su propio tratamiento, y el bucle sigue al siguiente intento.
- **`return None`** al final → si tras 3 intentos no hay respuesta, devuelve `None` y el llamador sabe que falló.

---

## 🧩 El mapa de excepciones

| Excepción | Cuándo ocurre |
|-----------|---------------|
| `socket.timeout` | La operación excede el tiempo límite |
| `ConnectionRefusedError` | No hay nadie escuchando en ese puerto |
| `ConnectionResetError` | El otro lado cerró de golpe |
| `BrokenPipeError` | Escribes en un socket que ya se cerró |
| `OSError` | Red caída, DNS no resuelve, etc. |

- **`ConnectionResetError`**: típico del servidor que muere mientras el cliente aún habla. Es un subtipo de `ConnectionError`.
- **`BrokenPipeError`**: el otro lado ya cerró y tú intentas `sendall()`. El SO "rompe la tubería".
- **`OSError`** es la red de seguridad final: todo error de red cae aquí si no lo capturaste antes (también es la base de `ConnectionRefusedError`).

> 💡 **Regla práctica:** primero captura las excepciones específicas (`socket.timeout`, `ConnectionResetError`, `BrokenPipeError`) y deja `OSError` como última red.

---

## ⏱️ Non-blocking y timeouts

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

- **`settimeout(5.0)`** → cada operación tiene 5 segundos; si se exceden, `socket.timeout`.
- **`setblocking(False)`** → nada bloquea: si no hay datos, la llamada lanza `BlockingIOError` al instante.
- **`select.select([s], [], [], 1.0)`** → espera hasta 1 segundo a que **alguno** de los sockets de la lista tenga datos. Si lo tiene, `lectura` no está vacía.

> `select.select()` es la solución para esperar en **varios sockets a la vez sin hilos**: le pasas la lista y te avisa cuáles están listos. Lo usarás a fondo en el [TEMA 10 — Servidores Concurrentes](/ApuntesPSP/10-servidores-concurrentes).

---

## 🧠 Mini-chequeo

1. ¿Qué excepción lanza `recv()` si se pasa el timeout y qué excepción si escribes en un socket ya cerrado?
2. ¿Cuál es la diferencia entre `ConnectionRefusedError` y `ConnectionResetError`?
3. ¿Qué hace `select.select()` y cuándo conviene?

<details>
<summary>🔄 Respuestas</summary>

1. **`socket.timeout`** si se excede el tiempo; **`BrokenPipeError`** si escribes en un socket ya cerrado.
2. **`ConnectionRefusedError`** → no hay nadie escuchando en ese puerto (al conectar). **`ConnectionResetError`** → el otro lado cerró la conexión de golpe (al hablar).
3. **`select.select([sockets], [], [], timeout)`** espera a que alguno de los sockets tenga datos listos; sirve para atender **varios sockets sin hilos**.

</details>

---

## ✅ Resumen en 3 frases

- Las redes fallan: captura cada error con su propio `except` y deja `OSError` como red final.
- `settimeout()` evita que un `recv()` se quede bloqueado para siempre.
- `select()` permite esperar en varios sockets a la vez, sin hilos.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| Timeout | Tiempo máximo de espera de una operación |
| ConnectionRefusedError | No hay nadie escuchando en el puerto |
| ConnectionResetError | El otro lado cerró la conexión de golpe |
| BrokenPipeError | Escribes en un socket ya cerrado |
| setblocking(False) | El socket no bloquea: lanza excepción si no hay datos |
| select() | Espera en varios sockets a la vez sin hilos |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/04-sockets-tcp) · **Anterior:** [04 · Ciclo de vida de la conexión](/ApuntesPSP/04-sockets-tcp/04-ciclo-de-vida-de-la-conexion) · **Siguiente:** [06 · SO_REUSEADDR](/ApuntesPSP/04-sockets-tcp/06-so-reuseaddr)