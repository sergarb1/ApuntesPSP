---
title: "⭐ AVANZADO 10 — Servidores Concurrentes"
nav_order: 10
---

## ⭐ AVANZADO 10 — Servidores Concurrentes

---

### 1. 🎯 Servidor con límite de clientes

Crea un servidor que acepte máximo 3 clientes. El cuarto recibe "Servidor completo" y se cierra.

**Pista**: Usa una variable global `clientes_activos` protegida con `Lock`. Al aceptar un cliente, comprueba si ya se alcanzó el máximo; si es así, envía el mensaje y cierra sin incrementar el contador. Decrementa al terminar.

---

### 2. 🔍 Prueba de carga

Lanza 20 clientes simultáneos contra tu servidor y mide cuánto tardan todos en recibir respuesta.

**Pista**: Usa un diccionario `resultados` compartido para guardar el tiempo de cada cliente. Cada cliente mide `time.time()` antes y después de la conexión. Lanza 20 hilos, haz `join` a todos y calcula estadísticas (total, media, exitosos).

---

### 3. 🧩 Servidor con cola de espera

Cuando el pool está lleno, los clientes entran en una cola. Cuando un hilo se libera, atiende al siguiente.

**Pista**: Usa `queue.Queue` para encolar las conexiones aceptadas. Crea N hilos trabajadores (daemon) que saquen elementos de la cola con `cola.get()` y atiendan al cliente. El hilo principal solo acepta y encola.

---

### 4. 🎭 Estado del servidor

Añade un endpoint especial: si el cliente envía "STATUS", el servidor responde con número de conexiones activas.

**Pista**: Mantén un contador `activas` con Lock. En la función de atención, parsea el comando: si es `"STATUS"`, responde con el valor actual del contador; si no, responde `"OK"`. Incrementa al entrar, decrementa al salir.

---

### 5. ⏱ Heartbeat en servidor

El servidor tiene un hilo heartbeat que imprime "💓 Servidor vivo — N conexiones" cada 5s.

**Pista**: Crea un hilo `daemon=True` con un bucle infinito que haga `time.sleep(5)` y luego imprima el estado usando el Lock para leer el contador de conexiones activas.

---

### 6. 🏗️ Balanceador de carga simple

Crea un "balanceador" que recibe peticiones y las distribuye entre 2 servidores workers.

**Pista**: Crea dos workers en los puertos 5001 y 5002 (cada uno en su hilo). El balanceador en el puerto 5000 acepta conexiones y las reenvía al worker actual haciendo de proxy: lee del cliente, envía al worker, recibe la respuesta y la reenvía al cliente. Alterna entre workers con un índice round-robin.

---
