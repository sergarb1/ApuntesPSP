---
title: Boletín U04 — Avanzado
description: Ejercicios avanzados de Sockets TCP
---

# 💪 Boletín U04 — Avanzado

> Ejercicios que requieren aplicar los conceptos de sockets TCP de forma más profunda, con programas completos: clientes interactivos, `select()`, timeouts y servidores multiusuario.

---

## 1. Servidor que cuenta caracteres

Crea un servidor que reciba un texto y devuelva el número de caracteres (ej: "hola" → "4").

**Pista:** recibe con `recv(1024).decode()`, calcula `len(texto)` y envía el resultado con `str(...).encode()`.

## 2. Cliente interactivo

Crea un cliente que pida texto por teclado con `input()`, lo envíe al servidor y muestre la respuesta. El bucle termina cuando el usuario escribe "salir".

**Pista:** envuelve el `input()` + `sendall()` + `recv()` en un `while True` y rompe el bucle con `break` cuando el texto sea `"salir"`.

## 3. Servidor que registra IP

Crea un servidor que, al recibir una conexión, muestre la dirección IP y el puerto del cliente usando `conn.getpeername()`, y luego devuelva esos datos al cliente.

**Pista:** `getpeername()` devuelve una tupla `(IP, puerto)`. Envíala convertida a texto con `str(direccion).encode()`.

## 4. Servidor de mayúsculas

El cliente envía texto, el servidor lo devuelve en MAYÚSCULAS.

**Pista:** recibe los datos con `recv(1024).decode()`, aplica `.upper()` y envía el resultado con `sendall(...)`.

## 5. Cliente con reconexión

Cliente que intenta conectar, y si falla, reintenta hasta 3 veces con 2s de espera.

**Pista:** envuelve `socket.connect()` en un bucle `for` con `try/except`. Captura `ConnectionRefusedError` y `socket.timeout`, espera 2s con `time.sleep(2)` y reintenta.

## 6. Servidor que maneja múltiples conexiones (sin hilos)

Usa `select.select()` para atender hasta 3 clientes en un solo hilo.

**Pista:** configura el socket servidor como no bloqueante con `setblocking(False)`. `select.select()` te devuelve los sockets que tienen datos listos para leer. Si el socket listo es el servidor, acepta una nueva conexión; si es un cliente, recibe datos.

## 7. Calculadora remota

El cliente envía "5+3", el servidor calcula y responde "Resultado: 8".

**Pista:** usa `eval(expr)` para evaluar la expresión recibida. Envuelve en `try/except` para capturar errores (por ejemplo, división entre cero o sintaxis inválida).

## 8. Timeout personalizado

Crea un servidor que cierre la conexión si el cliente no envía datos en 10 segundos.

**Pista:** después de `accept()`, llama a `conn.settimeout(10)`. Captura `socket.timeout` y envía un mensaje de despedida antes de cerrar.

## 9. Servidor de chat simple

Un servidor que recibe mensajes de un cliente y los reenvía a todos los demás.

**Pista:** mantén una lista global de conexiones. Usa un Lock al modificar la lista. Cuando un socket recibe datos, recorre la lista y reenvía con `sendall()` a todos menos al emisor. Usa un hilo por cliente con `threading.Thread`.

---

📚 [Volver a la unidad](/ApuntesPSP/04-sockets-tcp) · Resuelto: [✅ Boletín U04 — Avanzado (Resuelto)](/ApuntesPSP/boletines/boletin-u04-avanzado-resuelto)