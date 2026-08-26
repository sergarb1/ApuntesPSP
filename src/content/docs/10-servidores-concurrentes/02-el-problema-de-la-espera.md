---
title: 02 — El problema de la espera
description: El cliente lento que bloquea a todos los demás 🥶
---

<p><small>El cliente lento que bloquea a todos los demás 🥶</small></p>

> 🗺️ **Estás en:** 🏗️ **U10 · Servidores Concurrentes** → 02 · El problema de la espera

---

## 📬 La idea en una frase

> El problema del servidor secuencial no es el número de clientes, sino el **cliente lento**: uno solo que tarda 3 segundos congela a todos los que esperan detrás. Basta un cliente pesado para paralizar el servidor entero.

En el [punto 1](/ApuntesPSP/10-servidores-concurrentes/01-servidor-secuencial) viste que el tiempo crece linealmente. Ahora vamos a entender por qué es un problema real, no solo una curiosidad teórica: cualquier cliente que tarde, tarde por lo que sea (cálculo pesado, acceso a una base de datos lenta, una red de 56k…), convierte a todos los demás en espectadores.

---

## 🥶 Un cliente lento congela la cola

Vuelve al código del servidor secuencial:

```python
import socket, time

with socket.socket() as srv:
    srv.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    srv.bind(("127.0.0.1", 5000))
    srv.listen()
    while True:
        conn, addr = srv.accept()
        time.sleep(3)              # ← el trabajo "lento" de este cliente
        conn.sendall(b"Procesado\n")
        conn.close()
```

Traza la secuencia con un cliente lento en medio:

```
Tiempo:  0s ──── Cliente-1 conecta y entra a procesarse
          │     Cliente-2 conecta (t=0.1s) → espera...
          │     Cliente-1 tarda 3s (trabajo pesado, red lenta…)
         3s ──── Cliente-1 listo → recién ahora se acepta a Cliente-2
          │     Cliente-3 conecta (t=0.2s) → espera...
          │     Cliente-2 tarda 3s
         6s ──── Cliente-2 listo → recién ahora se acepta a Cliente-3
          │     Cliente-3 tarda 3s
         9s ──── Cliente-3 listo 🏁
```

Fíjate en el detalle clave: **Cliente-2 conectó en t=0.1s** y fue atendido a las 3s. **Cliente-3 conectó en t=0.2s** y fue atendido a las 6s. No es que el servidor sea lento: es que **el trabajo del cliente anterior bloquea el `accept()`**. El cliente más rápido del mundo espera a que el más lento termine.

> ⚠️ El problema empeora con un solo cliente pesado: una petición que tarde 30 segundos (una consulta enorme, un archivo gigante) pone a **toda** la cola a esperar 30 segundos, y al que llega detrás, otros 30.

---

## 🏦 La analogía: la ventanilla única

Imagina un banco con **una sola ventanilla**. Llegan 10 personas a la vez. La primera tiene un trámite que dura 3 minutos; las otras 9 esperan en fila. La segunda ya está "en el banco" (se ha conectado al socket), pero su trámite no empieza hasta que la primera termina.

```
🏦 VENTANILLA ÚNICA (servidor secuencial):
  [PERSONA-1 ⏳ 3min]   [PERSONA-2 🤷] [PERSONA-3 🤷] [PERSONA-4 🤷] …
  La ventanilla solo puede atender a una persona a la vez.

🏢 VENTANILLAS MÚLTIPLES (servidor concurrente):
  [PERSONA-1 ⏳] [PERSONA-2 ⏳] [PERSONA-3 ⏳] [PERSONA-4 ⏳] …
  Cada persona tiene su ventanilla: todas avanzan a la vez.
```

La moraleja es obvia: si el banco tiene 10 ventanillas, 10 personas se atienden en paralelo. Esa es exactamente la idea del [punto 3](/ApuntesPSP/10-servidores-concurrentes/03-hilo-por-cliente): dar a cada cliente su propia "ventanilla" (su hilo).

| Situación | Servidor secuencial | Servidor concurrente |
|---|---|---|
| 10 clientes, 2s cada uno | ~20 segundos (10 × 2s) | ~2 segundos (en paralelo) |
| 1 cliente lento de 30s | Todos esperan +30s | Solo el lento tarda 30s |
| Picos de conexiones | La cola crece sin límite visible | Se atienden en paralelo |

---

## 🧠 Mini-chequeo

1. Un cliente tarda 8 segundos en procesarse. ¿Cuánto espera el siguiente cliente que conectó en el mismo segundo?
2. ¿En qué punto del código se "atasca" la atención al resto de clientes?
3. ¿El problema es el número de clientes o la lentitud del procesamiento?

<details>
<summary>🔄 Respuestas</summary>

1. **8 segundos** como mínimo: el `accept()` del siguiente no se ejecuta hasta que el anterior termina (y cierra la conexión).
2. En la atención al cliente: el `time.sleep(8)` (o el trabajo que sea) bloquea el bucle, y el `accept()` de la siguiente iteración no se ejecuta hasta que ese cliente termina.
3. La **lentitud del procesamiento**: un solo cliente lento paraliza la cola entera. Con peticiones instantáneas, hasta un secuencial da la impresión de ir bien.

</details>

---

## ✅ Resumen en 3 frases

- Un cliente lento **bloquea el `accept()`** y todos los que esperan detrás se congelan.
- El tiempo de espera del último cliente es **n × tiempo del más lento** en el peor caso.
- La analogía de la **ventanilla única** lo resume: más ventanillas (hilos) = más clientes a la vez.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| Cliente lento | Conexión cuyo procesamiento tarda (cálculo, red, base de datos) |
| Bloqueo | El `accept()` no se ejecuta hasta que termina el cliente actual |
| Cola | Clientes ya conectados al socket que aún no se atienden |
| Ventanilla única | Analogía del servidor secuencial |
| Procesamiento | El trabajo que hace el servidor con cada cliente |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/10-servidores-concurrentes) · **Anterior:** [01 · Servidor secuencial](/ApuntesPSP/10-servidores-concurrentes/01-servidor-secuencial) · **Siguiente:** [03 · Hilo por cliente](/ApuntesPSP/10-servidores-concurrentes/03-hilo-por-cliente)