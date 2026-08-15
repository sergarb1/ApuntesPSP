---
title: 04 — ThreadPoolExecutor
description: Un equipo fijo de hilos que se reutiliza ⚡
---

<p><small>Un equipo fijo de hilos que se reutiliza ⚡</small></p>

> 🗺️ **Estás en:** 🏗️ **U10 · Servidores Concurrentes** → 04 · ThreadPoolExecutor

---

## 📬 La idea en una frase

> Crear un hilo por cada cliente puede saturar el sistema con 10.000 conexiones. Un **ThreadPoolExecutor** reutiliza un número fijo de hilos: si llegan más clientes que hilos, esperan en una cola en lugar de multiplicar los hilos.

Es el mismo servicio del [punto 3](/ApuntesPSP/10-servidores-concurrentes/03-hilo-por-cliente), pero con **recursos bajo control**: el pool es un equipo de camareros limitado, no un camarero nuevo por cada mesa.

---

## ⚠️ El problema: miles de hilos

El enfoque del [punto 3](/ApuntesPSP/10-servidores-concurrentes/03-hilo-por-cliente) funciona de maravilla con 10 clientes. Con 10.000 conexiones simultáneas se convierte en una bomba:

- Cada hilo consume **memoria propia** (pila de ejecución).
- El sistema operativo debe **planificar** (context switch) entre miles de hilos: la CPU pierde más tiempo cambiando de hilo que trabajando.
- El proceso puede quedarse **sin memoria** y morir.

| Enfoque | Ventaja | Desventaja |
|---------|---------|------------|
| Hilo por cliente | Simple | Puede saturar el SO (miles de hilos) |
| ThreadPool | Límite controlado | Si el pool se llena, los clientes esperan |

> "Si el pool se llena, los clientes esperan" suena a defecto, pero es la **protección** que queremos: esperar en cola es mejor que matar el servidor.

---

## ⚡ El servidor con pool

```python
import socket, concurrent.futures

MAX_HILOS = 10

def atender(conn, addr):
    with conn:
        datos = conn.recv(1024)
        conn.sendall(b"OK: " + datos)

def servidor_pool():
    with socket.socket() as srv:
        srv.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        srv.bind(("127.0.0.1", 5000))
        srv.listen()

        with concurrent.futures.ThreadPoolExecutor(max_workers=MAX_HILOS) as pool:
            print(f"⚡ Servidor con Pool de {MAX_HILOS} hilos")
            while True:
                conn, addr = srv.accept()
                pool.submit(atender, conn, addr)
```

Dos piezas nuevas frente al [punto 3](/ApuntesPSP/10-servidores-concurrentes/03-hilo-por-cliente):

1. **`ThreadPoolExecutor(max_workers=MAX_HILOS)`** crea el equipo de hilos (10 aquí). Se usa como contexto (`with ... as pool`) para que se cierre solo al salir.
2. **`pool.submit(atender, conn, addr)`** sustituye a `Thread(target=...).start()`: entrega la tarea al pool y este decide qué hilo libre la coge. Si todos están ocupados, la tarea espera en la cola interna del pool.

> ⚡ El `submit()` devuelve un `Future`, pero en un servidor no lo necesitamos: no nos interesa el resultado, solo que la tarea se ejecute.

---

## 🎯 ¿Qué tamaño de pool elegir?

No hay una fórmula mágica, pero estas reglas de oro ayudan:

| Situación | Tamaño razonable |
|---|---|
| Servidor de prueba / clase | 5-10 hilos |
| CPU intensivo (cálculo puro) | Nº de núcleos de la CPU |
| I/O intensivo (red, discos, APIs) | Más hilos que núcleos (los hilos esperan mucho en I/O) |

> 💡 En [U11 · asyncio](/ApuntesPSP/11-asyncio-y-disponibilidad) verás que la concurrencia por I/O se puede hacer aún más ligera, sin hilos. De momento, el pool es la opción sensata.

---

## 🧩 Pool Puzzle — Servidor con ThreadPool

Desordena y reconstruye este servidor que usa ThreadPoolExecutor:

```
a) from concurrent.futures import ThreadPoolExecutor
b)     pool.submit(atender, conn, addr)
c)     with ThreadPoolExecutor(max_workers=5) as pool:
d) import socket
e) def atender(conn, addr):
f)         conn.sendall(b"OK\n")
g) while True:
h)     with socket.socket() as srv:
i)             datos = conn.recv(1024)
j)         conn, addr = srv.accept()
k)     srv.bind(("0.0.0.0", 5000))
l)     srv.listen()
```

<details>
<summary>🔓 Solución</summary>

**Orden correcto:** d → a → e → i → f → h → k → l → g → j → c → b

```python
import socket                                             # d) import
from concurrent.futures import ThreadPoolExecutor          # a) import pool

def atender(conn, addr):                                  # e) función manejadora
    with conn:                                            # cerrar conn al salir
        datos = conn.recv(1024)                           # i) recibir datos
        conn.sendall(b"OK\n")                             # f) responder

with socket.socket() as srv:                              # h) crear socket
    srv.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    srv.bind(("0.0.0.0", 5000))                           # k) bind
    srv.listen()                                           # l) listen
    with ThreadPoolExecutor(max_workers=5) as pool:        # c) crear pool
        while True:                                        # g) bucle ppal
            conn, addr = srv.accept()                      # j) aceptar
            pool.submit(atender, conn, addr)               # b) enviar al pool
```

**¿Por qué este orden?**
- `bind()` y `listen()` van antes del bucle (se hace una vez)
- El pool se crea **antes** del bucle para no crearlo en cada iteración
- `submit()` va dentro del bucle, para cada nueva conexión
- La función `atender` se define antes de usarla
</details>

---

## 🧠 Mini-chequeo

1. ¿Qué pasa con el cliente número 11 si el pool tiene `max_workers=10` y todos están ocupados?
2. ¿Qué ventaja tiene reutilizar hilos frente a crear uno nuevo por cliente?
3. ¿Por qué el pool se crea fuera del bucle `while True`?

<details>
<summary>🔄 Respuestas</summary>

1. El `submit()` **encola** la tarea: el cliente espera hasta que uno de los 10 hilos se libere. No se crea un hilo nuevo, no se satura el sistema.
2. Se evita el **coste de crear y destruir hilos** constantemente: el pool reutiliza los mismos hilos una y otra vez, como el equipo de camareros del banco con varias ventanillas.
3. Porque crearlo dentro del bucle significaría crear (y cerrar) un pool **en cada conexión**: un desperdicio enorme. El pool es un recurso que vive toda la vida del servidor.

</details>

---

## ✅ Resumen en 3 frases

- `ThreadPoolExecutor(max_workers=N)` mantiene **N hilos fijos reutilizables** y una cola interna.
- Si el pool está lleno, los clientes **esperan en cola** en lugar de multiplicar los hilos.
- Es la opción de **producción**: límite controlado, hilos reutilizados y sin riesgo de saturar el SO.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| ThreadPoolExecutor | Pool de hilos reutilizables de `concurrent.futures` |
| max_workers | Número máximo de hilos del pool |
| submit() | Entrega una tarea al pool (devuelve un Future) |
| Cola interna | Tareas esperando a que un hilo se libere |
| Future | Objeto con el resultado futuro de la tarea (no lo usamos en servidores) |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/10-servidores-concurrentes) · **Anterior:** [03 · Hilo por cliente](/ApuntesPSP/10-servidores-concurrentes/03-hilo-por-cliente) · **Siguiente:** [05 · Benchmark](/ApuntesPSP/10-servidores-concurrentes/05-benchmark)