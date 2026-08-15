---
title: 03 — Hilo por cliente
description: Cada cliente se atiende en su propio hilo 🔀
---

<p><small>Cada cliente se atiende en su propio hilo 🔀</small></p>

> 🗺️ **Estás en:** 🏗️ **U10 · Servidores Concurrentes** → 03 · Hilo por cliente

---

## 📬 La idea en una frase

> En lugar de atender al cliente dentro del bucle, el servidor **lanza un hilo por cada cliente** y vuelve inmediatamente a `accept()`. Cada conexión tiene su propia "ventanilla".

Ya conoces los hilos de la [U02 · Hilos fundamentos](/ApuntesPSP/02-hilos-fundamentos) y la sincronización de la [U03](/ApuntesPSP/03-sincronizacion-entre-hilos). Este punto los pone a trabajar: el patrón **hilo por cliente** (thread per connection) es el salto más directo desde el servidor secuencial.

---

## 🚀 El servidor multihilo

Cada cliente recibe su propio hilo. La función que lo atiende se ejecuta en paralelo con todas las demás:

```python
import socket, threading

def atender(conn, addr):
    print(f"[+] Cliente {addr} conectado")
    with conn:
        datos = conn.recv(1024)
        print(f"    Recibido: {datos.decode()}")
        import time
        time.sleep(2)  # Simular trabajo
        conn.sendall(b"OK: " + datos)
    print(f"[-] Cliente {addr} desconectado")

def servidor_multihilo():
    with socket.socket() as srv:
        srv.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        srv.bind(("127.0.0.1", 5000))
        srv.listen()
        print("🚀 Servidor MULTIHILO — varios clientes a la vez")

        while True:
            conn, addr = srv.accept()
            hilo = threading.Thread(target=atender, args=(conn, addr))
            hilo.start()
```

Dos diferencias frente al servidor secuencial del [punto 1](/ApuntesPSP/10-servidores-concurrentes/01-servidor-secuencial):

1. **No hay trabajo en el bucle principal**: `accept()` → crear hilo → `start()` → vuelta a `accept()`. El bucle nunca se bloquea.
2. **`conn` se pasa como argumento** al hilo: cada hilo recibe su socket y su dirección, y los libera con `with conn:` al terminar.

> 🧵 Recuerda la convención del módulo: los hilos se nombran con `.name = "hilo-"+str(n)` si necesitas trazarlos.

---

## 📜 Be the code — Servidor multihilo en acción

> "Sé el servidor que recibe 3 clientes a la vez. Traza cada hilo."

```
🟢 SERVIDOR PRINCIPAL
1. Crea socket, bind(5000), listen()
2. accept() → espera... ⏳

[Cliente-1: t=0s]
3. accept() → conn1, addr1
4. Crea hilo-1 → start(atender, conn1)
5. Vuelve a accept() inmediatamente

[Cliente-2: t=0.1s]
6. accept() → conn2, addr2
7. Crea hilo-2 → start(atender, conn2)
8. Vuelve a accept()

[Cliente-3: t=0.2s]
9. accept() → conn3, addr3
10. Crea hilo-3 → start(atender, conn3)
11. Vuelve a accept()

AHORA 4 HILOS EJECUTANDO:
┌─────────────┬──────────────────────────────────┐
│ Hilo ppal   │ accept() esperando más clientes  │
│ Hilo-1      │ recibe → procesa (2s) → responde │
│ Hilo-2      │ recibe → procesa (2s) → responde │
│ Hilo-3      │ recibe → procesa (2s) → responde │
└─────────────┴──────────────────────────────────┘

Los 3 clientes son atendidos en paralelo.
A los ~2s, todos reciben respuesta. 🏁
```

El hilo principal **nunca se detiene**: en cuanto lanza un hilo, vuelve a `accept()`. El trabajo pesado (`time.sleep(2)`) vive en los hilos secundarios, que se ejecutan en paralelo gracias al *threading* de la [U02](/ApuntesPSP/02-hilos-fundamentos).

---

## ⚖️ Ventajas y el primer cuidado

| Ventaja | Explicación |
|---|---|
| ✅ Simple de escribir | Solo un `threading.Thread(target=atender, args=(conn, addr))` |
| ✅ Aprovecha la CPU | Varios clientes procesados de verdad en paralelo |
| ✅ El bucle no se bloquea | `accept()` vuelve al instante, nadie espera en la cola |

Pero hay una letra pequeña: **crear un hilo por cada cliente puede saturar el sistema con 10.000 conexiones**. Cada hilo consume memoria y el sistema operativo tiene que gestionarlos. Ese límite lo verás en el [punto 4](/ApuntesPSP/10-servidores-concurrentes/04-threadpoolexecutor) (el ThreadPool) y en el [punto 7](/ApuntesPSP/10-servidores-concurrentes/07-limites-y-buenas-practicas).

---

## 🧠 Mini-chequeo

1. ¿Qué hace el hilo principal mientras un hilo secundario procesa a su cliente?
2. ¿Por qué no hace falta `join()` en el bucle principal del servidor?
3. ¿Qué pasaría con este código si llegan 10.000 conexiones a la vez?

<details>
<summary>🔄 Respuestas</summary>

1. Vuelve a **`accept()`** a esperar la siguiente conexión. Por eso el servidor nunca se bloquea y los clientes no esperan.
2. Porque queremos que los hilos trabajen en paralelo **mientras el servidor sigue aceptando**. Si hiciéramos `join()` en cada iteración, esperaríamos a que el hilo terminara… y volveríamos al servidor secuencial. El `join()` solo se usa en el lanzador de clientes (punto 5).
3. Se crearían **10.000 hilos**: el sistema se quedaría sin memoria o el cambio de contexto (context switch) degradaría el rendimiento. Ahí entra el ThreadPool del [punto 4](/ApuntesPSP/10-servidores-concurrentes/04-threadpoolexecutor).

</details>

---

## ✅ Resumen en 3 frases

- El patrón **hilo por cliente** lanza un `threading.Thread` por cada conexión y el bucle vuelve al instante a `accept()`.
- Todos los clientes se atienden **en paralelo**, cada uno en su propio hilo.
- Es simple y efectivo para pocos clientes, pero **no escala** a miles de conexiones: para eso existe el ThreadPool.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| Hilo por cliente | Patrón: un `Thread` por cada conexión aceptada |
| Hilo principal | El del bucle `accept()`: solo acepta y lanza hilos |
| atender() | Función que procesa a un cliente en su hilo |
| start() | Pone el hilo en marcha sin bloquear al llamante |
| Thread(target, args) | Constructor del hilo con su función y argumentos |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/10-servidores-concurrentes) · **Anterior:** [02 · El problema de la espera](/ApuntesPSP/10-servidores-concurrentes/02-el-problema-de-la-espera) · **Siguiente:** [04 · ThreadPoolExecutor](/ApuntesPSP/10-servidores-concurrentes/04-threadpoolexecutor)