---
title: Boletín U10 — Avanzado
description: Ejercicios avanzados de Servidores Concurrentes
---

# 💪 Boletín U10 — Avanzado

> Ejercicios que requieren aplicar la concurrencia de forma más profunda: timeouts, contadores sincronizados, límites de clientes, colas de espera, heartbeats y hasta un balanceador de carga.

---

## 1. Servidor con timeout

Implementa un servidor que cierre la conexión si el cliente no envía datos en 5 segundos (usa `socket.settimeout` o `select`).

## 2. Cliente con timeout

Crea un cliente que intente conectarse a `127.0.0.1:9999` con timeout de 2 segundos. Captura la excepción `socket.timeout` y muestra "Servidor no disponible".

## 3. Contador de bytes totales

Añade un contador global de bytes recibidos (protegido con Lock) al servidor multihilo. Cada vez que un cliente envía datos, suma los bytes y muestra el total acumulado.

**Pista:** `total_bytes = 0` + `lock = threading.Lock()`. Dentro de `atender`, haz `with lock:` para hacer `total_bytes += len(datos)` y `print`. El `recv()` y `sendall()` no necesitan Lock (cada socket es independiente).

## 4. Servidor con límite de clientes

Crea un servidor que acepte máximo 3 clientes. El cuarto recibe "Servidor completo" y se cierra.

**Pista**: Usa una variable global `clientes_activos` protegida con `Lock`. Al aceptar un cliente, comprueba si ya se alcanzó el máximo; si es así, envía el mensaje y cierra sin incrementar el contador. Decrementa al terminar.

## 5. Prueba de carga

Lanza 20 clientes simultáneos contra tu servidor y mide cuánto tardan todos en recibir respuesta.

**Pista**: Usa un diccionario `resultados` compartido para guardar el tiempo de cada cliente. Cada cliente mide `time.time()` antes y después de la conexión. Lanza 20 hilos, haz `join` a todos y calcula estadísticas (total, media, exitosos).

## 6. Servidor con cola de espera

Cuando el pool está lleno, los clientes entran en una cola. Cuando un hilo se libera, atiende al siguiente.

**Pista**: Usa `queue.Queue` para encolar las conexiones aceptadas. Crea N hilos trabajadores (daemon) que saquen elementos de la cola con `cola.get()` y atiendan al cliente. El hilo principal solo acepta y encola.

## 7. Estado del servidor

Añade un endpoint especial: si el cliente envía "STATUS", el servidor responde con número de conexiones activas.

**Pista**: Mantén un contador `activas` con Lock. En la función de atención, parsea el comando: si es `"STATUS"`, responde con el valor actual del contador; si no, responde `"OK"`. Incrementa al entrar, decrementa al salir.

## 8. Heartbeat en servidor

El servidor tiene un hilo heartbeat que imprime "💓 Servidor vivo — N conexiones" cada 5s.

**Pista**: Crea un hilo `daemon=True` con un bucle infinito que haga `time.sleep(5)` y luego imprima el estado usando el Lock para leer el contador de conexiones activas.

## 9. Balanceador de carga simple

Crea un "balanceador" que recibe peticiones y las distribuye entre 2 servidores workers.

**Pista**: Crea dos workers en los puertos 5001 y 5002 (cada uno en su hilo). El balanceador en el puerto 5000 acepta conexiones y las reenvía al worker actual haciendo de proxy: lee del cliente, envía al worker, recibe la respuesta y la reenvía al cliente. Alterna entre workers con un índice round-robin.