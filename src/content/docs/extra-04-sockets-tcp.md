---
title: "⭐ AVANZADO 4 — Sockets TCP"
nav_order: 4
---

## ⭐ AVANZADO 04 — Sockets TCP

---

### 1. 🎯 Servidor de mayúsculas

El cliente envía texto, el servidor lo devuelve en MAYÚSCULAS.

**Pista**: Recibe los datos con `recv(1024).decode()`, aplica `.upper()` y envía el resultado con `sendall(...)`.

### 2. 🔍 Cliente con reconexión

Cliente que intenta conectar, y si falla, reintenta hasta 3 veces con 2s de espera.

**Pista**: Envuelve `socket.connect()` en un bucle `for` con `try/except`. Captura `ConnectionRefusedError` y `socket.timeout`, espera 2s con `time.sleep(2)` y reintenta.

### 3. 🧩 Servidor que maneja múltiples conexiones (sin hilos)

Usa `select.select()` para atender hasta 3 clientes en un solo hilo.

**Pista**: Configura el socket servidor como no bloqueante con `setblocking(False)`. `select.select()` te devuelve los sockets que tienen datos listos para leer. Si el socket listo es el servidor, acepta una nueva conexión; si es un cliente, recibe datos.

### 4. 🎭 Calculadora remota

El cliente envía "5+3", el servidor calcula y responde "Resultado: 8".

**Pista**: Usa `eval(expr)` para evaluar la expresión recibida. Envuelve en `try/except` para capturar errores (por ejemplo, división entre cero o sintaxis inválida).

### 5. ⏱ Timeout personalizado

Crea un servidor que cierre la conexión si el cliente no envía datos en 10 segundos.

**Pista**: Después de `accept()`, llama a `conn.settimeout(10)`. Captura `socket.timeout` y envía un mensaje de despedida antes de cerrar.

### 6. 🏗️ Servidor de chat simple

Un servidor que recibe mensajes de un cliente y los reenvía a todos los demás.

**Pista**: Mantén una lista global de conexiones. Usa un Lock al modificar la lista. Cuando un socket recibe datos, recorre la lista y reenvía con `sendall()` a todos menos al emisor. Usa un hilo por cliente con `threading.Thread`.
