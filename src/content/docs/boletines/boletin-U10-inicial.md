---
title: Boletín U10 — Inicial
description: Ejercicios básicos de Servidores Concurrentes
---

# 📝 Boletín U10 — Inicial

> Ejercicios básicos para afianzar los conceptos de servidores concurrentes: sockets TCP, el servidor secuencial y sus límites, y el salto a los hilos.

---

## 1. Servidor eco básico

Crea un servidor TCP que reciba datos de un cliente y los devuelva exactamente igual (eco). Sin bucle, atiende un solo cliente y termina.

## 2. Servidor eco con bucle

Modifica el servidor anterior para que acepte clientes en un bucle infinito, dando eco a cada uno.

## 3. Cliente eco

Crea un cliente TCP que se conecte al servidor, envíe `b"Hola eco"` y muestre la respuesta recibida.

## 4. Servidor secuencial

Crea un servidor TCP que atienda a **un solo cliente** y termine: `accept()`, recibe, responde `b"OK"` y cierra.

**Pista:** es la versión mínima del servidor secuencial: `with socket.socket() as srv:` → `bind(("127.0.0.1", 5000))` → `listen()` → `accept()` → `with conn:` → `recv()` y `sendall(b"OK")`.

## 5. Servidor multihilo

Convierte el servidor anterior en uno **multihilo**: dentro de un `while True`, cada cliente que acepte se atiende en su propio `threading.Thread`.

**Pista:** define `def atender(conn, addr):` con el eco, y en el bucle lanza `threading.Thread(target=atender, args=(conn, addr)).start()`. El bucle vuelve al `accept()` al instante.

## 6. Cliente con respuesta

Crea un cliente TCP que se conecte al servidor, envíe `b"Hola"` y muestre por pantalla la respuesta que reciba.

## 7. Servidor con ThreadPoolExecutor

Implementa un servidor TCP que use `concurrent.futures.ThreadPoolExecutor` con **3 hilos** (`max_workers=3`). Responde `b"OK"` a cada cliente.

**Pista:** `with socket.socket() as srv, ThreadPoolExecutor(max_workers=3) as pool:` y en el bucle `pool.submit(atender, conn, addr)`. Con 3 hilos, el 4º cliente espera en cola.

## 8. Lanzador de 5 clientes

Crea un script que lance **5 clientes simultáneos** contra `127.0.0.1:5000`, cada uno enviando `f"Soy {id}"`, y muestre la respuesta de cada uno.

**Pista:** haz una lista de hilos `[threading.Thread(target=cliente, args=(i,)) for i in range(5)]`, lánzalos con `h.start()` y espera a todos con `h.join()`. La función `cliente(id)` conecta, envía y muestra `s.recv(1024).decode()`.