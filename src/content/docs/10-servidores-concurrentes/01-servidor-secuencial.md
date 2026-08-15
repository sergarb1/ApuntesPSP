---
title: 01 — Servidor secuencial
description: El servidor que atiende a un cliente cada vez 🐢
---

<p><small>El servidor que atiende a un cliente cada vez 🐢</small></p>

> 🗺️ **Estás en:** 🏗️ **U10 · Servidores Concurrentes** → 01 · Servidor secuencial

---

## 📬 La idea en una frase

> Un servidor **secuencial** atiende a un cliente cada vez: `accept()` recibe una conexión, la procesa hasta el final y solo entonces vuelve a aceptar. Los demás clientes esperan en una cola invisible, aunque ya estén conectados.

Es el servidor que construiste en la [U04 · Sockets TCP](/ApuntesPSP/04-sockets-tcp): un bucle `while True` con `accept()`. Funciona, pero tiene un límite muy claro que vamos a medir.

---

## 🐢 El servidor secuencial

El ejemplo clásico simula trabajo pesado con un `time.sleep(3)` dentro de la atención a cada cliente:

```python
import socket, time

def servidor_lento():
    with socket.socket() as srv:
        srv.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        srv.bind(("127.0.0.1", 5000))
        srv.listen()
        print("🐢 Servidor SECUENCIAL: 1 cliente cada vez")

        while True:
            conn, addr = srv.accept()
            print(f"  Cliente {addr} conectado")
            time.sleep(3)  # Simula trabajo pesado
            conn.sendall(b"Procesado\n")
            conn.close()
            print(f"  Cliente {addr} atendido")
```

> Si 3 clientes se conectan a la vez: el primero tarda 3s, el segundo 6s, el tercero 9s. 🐢

El bucle hace esto: acepta → procesa (los 3 segundos) → cierra → acepta de nuevo. Mientras procesa, el `accept()` siguiente no se ejecuta, así que nadie más entra. El socket del sistema operativo sí "acepta" la conexión TCP a nivel de red (los clientes no ven error), pero el código no los atiende: están **en cola**.

---

## 📜 La traza: secuencial vs concurrente

El clásico "Be the code" del tema. Traza mentalmente qué pasa cuando 3 clientes se conectan a la vez:

**Servidor secuencial** (3 clientes a la vez):
```
Tiempo:  0s ──── Cliente-1 conecta
          │     Servidor procesa cliente-1 (3s)
         3s ──── Cliente-1 listo
          │     Cliente-2 conectó en t=0.1s, pero espera...
          │     Servidor procesa cliente-2 (3s)
         6s ──── Cliente-2 listo
          │     Cliente-3 conectó en t=0.2s, pero espera...
          │     Servidor procesa cliente-3 (3s)
         9s ──── Cliente-3 listo 🏁
```

**Servidor concurrente** (3 clientes a la vez):
```
Tiempo:  0s ──── Cliente-1 conecta → hilo-1 procesa
          │     Cliente-2 conecta → hilo-2 procesa
          │     Cliente-3 conecta → hilo-3 procesa
          │     (Los 3 procesan en paralelo)
         3s ──── Cliente-1 listo 🏁
          │     Cliente-2 listo 🏁
          │     Cliente-3 listo 🏁
```

> Con hilos, todos terminan a la vez. Sin hilos, el último espera 9s.

Por ahora nos quedamos con la primera columna: el secuencial. El límite se ve solo: **el tiempo total crece linealmente** con el número de clientes. En el [punto 3](/ApuntesPSP/10-servidores-concurrentes/03-hilo-por-cliente) construiremos el concurrente.

---

## 🧠 Mini-chequeo

1. ¿Por qué los clientes 2 y 3 "se conectan" sin error pero no reciben respuesta?
2. Si 5 clientes se conectan a la vez y cada uno tarda 2s en procesarse, ¿cuánto espera el quinto?
3. ¿Qué línea del código es la que se queda "atascada" mientras se procesa un cliente?

<details>
<summary>🔄 Respuestas</summary>

1. Porque la conexión TCP la acepta el **sistema operativo** (la cola del socket), no nuestro código. El `accept()` del bucle no se ejecuta hasta que termina el cliente actual, así que los demás quedan en la cola del SO sin ser atendidos.
2. El quinto tarda **10 segundos** (5 clientes × 2s cada uno). El tiempo total del secuencial es `n × tiempo_por_cliente`.
3. El `time.sleep(3)` (y la atención al cliente en general) bloquea el bucle: el `accept()` de la siguiente iteración no llega a ejecutarse hasta que se cierra `conn`.

</details>

---

## ✅ Resumen en 3 frases

- El servidor secuencial procesa **un cliente cada vez** y los demás esperan en la cola del sistema operativo.
- Su límite es lineal: **n clientes × tiempo por cliente** de espera para el último.
- La solución a la espera es la **concurrencia**: atender a varios clientes a la vez (punto 3).

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| Servidor secuencial | Atiende un cliente cada vez, en orden |
| Cola del socket | Conexiones TCP aceptadas por el SO que aún no atiende el código |
| accept() | Llamada que recoge la siguiente conexión pendiente |
| time.sleep(3) | Simula trabajo pesado en los ejemplos |
| Límite lineal | El tiempo total crece con el número de clientes |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/10-servidores-concurrentes) · **Siguiente:** [02 · El problema de la espera](/ApuntesPSP/10-servidores-concurrentes/02-el-problema-de-la-espera)