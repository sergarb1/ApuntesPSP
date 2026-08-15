---
title: 05 — Benchmark
description: Medir cuánto ganas con la concurrencia ⏱️
---

<p><small>Medir cuánto ganas con la concurrencia ⏱️</small></p>

> 🗺️ **Estás en:** 🏗️ **U10 · Servidores Concurrentes** → 05 · Benchmark

---

## 📬 La idea en una frase

> Un **benchmark** lanza N clientes a la vez contra tu servidor y cronometra cuánto tardan todos en recibir respuesta. Es la prueba objetiva de que la concurrencia funciona… o de que tu servidor sigue siendo secuencial.

Hasta ahora hemos razonado sobre tiempos ("el secuencial tarda n × tiempo"). Este punto lo **mide de verdad**: con un lanzador masivo de clientes verás con tus propios ojos la diferencia entre secuencial, hilos y pool.

---

## 🧪 El experimento

¿Cuánto más rápido es un servidor concurrente? Aquí tienes un experimento que lanza 10 clientes y mide el tiempo total:

```python
import socket, time, threading, concurrent.futures

def cliente(id):
    """Conecta, envía 'ping', recibe 'pong'"""
    with socket.socket() as s:
        s.connect(("127.0.0.1", 5000))
        s.sendall(b"ping")
        s.recv(1024)

def prueba(tipo_servidor, n=10):
    """Lanza n clientes en paralelo y cronometra"""
    inicios = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=n) as pool:
        futuros = [pool.submit(cliente, i) for i in range(n)]
        concurrent.futures.wait(futuros)
```

Fíjate en un detalle: el propio lanzador usa un `ThreadPoolExecutor` con `n` hilos para lanzar los `n` clientes en paralelo. El cronometraje (los `inicios` y el tiempo total) lo añade quien ejecute la prueba, usando `time.time()` antes y después.

---

## 📊 Los resultados

Con un servidor que tarda **2 segundos por cliente**, la tabla comparativa queda así:

| Enfoque | 10 clientes (2s c/u) | Fórmula |
|---------|----------------------|---------|
| 🐢 Secuencial | ~20 segundos | n × tiempo_por_cliente |
| 🚀 Hilos | ~2 segundos | max(tiempo_por_cliente) |
| ⚡ ThreadPool (5 hilos) | ~4 segundos | ceil(n/workers) × tiempo_por_cliente |

> El ThreadPool con 5 hilos tarda el doble que hilos ilimitados, pero **no ahoga el sistema**. Con 1000 clientes, hilos ilimitados matarían el PC; el pool encola y sirve de a 5.

La fórmula del pool lo explica: con 10 clientes y 5 hilos, se atienden **2 tandas** de 5 (ceil(10/5) = 2), cada una de 2 segundos → ~4 segundos. El hilo por cliente lo hace en una sola tanda → ~2 segundos. Y el secuencial… 10 tandas de uno → ~20 segundos.

---

## 🚀 El lanzador masivo de clientes

Este es el script que probará tu servidor real, el "🧪 Cliente de prueba — lanzador masivo":

```python
import socket, threading, time

def cliente(id):
    try:
        with socket.socket() as s:
            s.connect(("127.0.0.1", 5000))
            s.sendall(f"Cliente-{id}\n".encode())
            resp = s.recv(1024)
            print(f"  ✅ Cliente-{id}: {resp.decode().strip()}")
    except Exception as e:
        print(f"  ❌ Cliente-{id}: {e}")

print("Lanzando 10 clientes...")
hilos = []
for i in range(10):
    t = threading.Thread(target=cliente, args=(i,))
    t.start()
    hilos.append(t)
for t in hilos:
    t.join()
print("🏁 Todos los clientes terminaron")
```

> Este script prueba que tu servidor concurrente realmente atiende a varios clientes a la vez. Si es secuencial, los clientes 2-9 esperarán su turno.

Para medir el tiempo total, envuelve el bloque con `inicio = time.time()` antes de lanzar los hilos y `print(f"Tiempo total: {time.time() - inicio:.2f}s")` al final. Ese número es tu **benchmark**.

---

## 🔍 Cómo interpretar los resultados

| Lo que ves | Qué significa |
|---|---|
| Tiempo ≈ n × tiempo_por_cliente | Tu servidor es **secuencial** (o el pool tiene 1 hilo) |
| Tiempo ≈ max(tiempo_por_cliente) | Tu servidor es **concurrente** (hilos o pool con suficientes workers) |
| Tiempo ≈ ceil(n/workers) × tiempo_por_cliente | Tu **pool** está trabajando en tandas |
| Errores `❌ ConnectionRefused` | El servidor no está arrancado o el puerto es otro |

> 💡 El benchmark también sirve para **elegir el tamaño del pool**: sube `max_workers` y mira dónde deja de mejorar el tiempo. Más hilos no siempre es más rápido (punto 7).

---

## 🧠 Mini-chequeo

1. ¿Por qué el lanzador usa `join()` sobre todos los hilos?
2. Un servidor con pool de 3 hilos recibe 9 clientes que tardan 1s cada uno. ¿Tiempo total aproximado?
3. ¿Qué le diría la salida del lanzador a un servidor que imprime "Procesado" de uno en uno?

<details>
<summary>🔄 Respuestas</summary>

1. Para **esperar a que terminen todos** antes de cronometrar el final (o imprimir el resumen). Sin `join()`, el hilo principal terminaría antes que los clientes y mediríamos mal.
2. **~3 segundos**: ceil(9/3) = 3 tandas de 3 clientes, cada tanda tarda 1s.
3. Que es **secuencial**: los clientes 2-9 esperarían su turno y el tiempo total sería ~9s en lugar de ~1-3s. El lanzador es la prueba del algodón.

</details>

---

## ✅ Resumen en 3 frases

- El benchmark lanza **N clientes en paralelo** y mide el tiempo total con `time.time()`.
- Secuencial ≈ n × tiempo; hilos ≈ max(tiempo); pool ≈ ceil(n/workers) × tiempo.
- El lanzador masivo demuestra si tu servidor atiende de verdad a varios clientes a la vez.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| Benchmark | Prueba que mide el rendimiento del servidor |
| Lanzador masivo | Script que crea N clientes simultáneos |
| join() | Espera a que terminen todos los hilos |
| ceil(n/workers) | Número de tandas del pool (redondeo hacia arriba) |
| time.time() | Cronómetro para medir duraciones |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/10-servidores-concurrentes) · **Anterior:** [04 · ThreadPoolExecutor](/ApuntesPSP/10-servidores-concurrentes/04-threadpoolexecutor) · **Siguiente:** [06 · Sincronización en servidores](/ApuntesPSP/10-servidores-concurrentes/06-sincronizacion-en-servidores)