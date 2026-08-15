---
title: 06 — El GIL
description: El candado de CPython que limita a los hilos para código CPU-bound 🔒
---

<p><small>El candado de CPython que limita a los hilos para código CPU-bound 🔒</small></p>

> 🗺️ **Estás en:** 🔀 **U02 · Hilos Fundamentos** → 06 · El GIL

---

## 📬 La idea en una frase

> **GIL** = Global Interpreter Lock: un candado interno de CPython que evita que dos hilos ejecuten bytecode Python a la vez, así que los hilos no aceleran el código de CPU… pero sí el de espera.

Es la gran trampa de los hilos en Python: "¿para qué sirven si no aceleran nada?" La respuesta corta: sí aceleran lo que vale la pena (esperar por red y disco) y no aceleran lo que no (calcular). Vamos a verlo con números.

---

## 🔒 ¿Qué es el GIL?

**GIL** = **G**lobal **I**nterpreter **L**ock. Es un candado que CPython (el Python de toda la vida) mantiene para que **solo un hilo ejecute bytecode Python en cada instante**.

¿Por qué existe? Para proteger la memoria interna del intérprete: sin el candado, dos hilos podrían corromper las estructuras de Python al tocarlas a la vez. Python paga el precio de la seguridad con un límite: **no hay paralelismo real de CPU** entre hilos de un mismo proceso.

```
   T I E M P O  ────────────────────────────▶
   hilo A ████████░░░░░░████████░░░░░░
   hilo B ░░░░░░████████░░░░░░████████
          ^^^^^^ GIL en manos de A     GIL en manos de B
```

Los hilos se turnan el candado en pequeños fragmentos: parecen simultáneos (por eso los `print` se entremezclan), pero nunca ejecutan Python a la vez.

---

## ⚡ CPU-bound: los hilos NO sirven de nada

Una tarea **CPU-bound** es la que usa la CPU a tope: sumar millones de números, procesar imágenes, comprimir. Ahí el GIL no deja ejecutar a más de un hilo, así que 4 hilos tardan lo mismo que 1.

```python
import threading, time

# ⚡ CPU-bound: los hilos NO sirven de nada
def contar():
    total = 0
    for i in range(50_000_000):
        total += i

inicio = time.time()
hilos = [threading.Thread(target=contar) for _ in range(4)]
for h in hilos: h.start()
for h in hilos: h.join()
print(f"4 hilos CPU: {time.time() - inicio:.2f}s")
# → ~5 segundos (igual que 1 hilo)
```

Cuatro hilos contando 50 millones cada uno… y el tiempo es prácticamente el mismo que con uno solo. Peor aún: a veces es **ligeramente más lento** por el coste de turnarse el candado.

---

## 🌐 I/O-bound: los hilos SÍ aceleran

Una tarea **I/O-bound** espera por algo externo: descargar de una red, leer de disco, esperar una respuesta. Ahí el hilo **libera el GIL mientras espera**, y los demás pueden trabajar.

```python
# 🌐 I/O-bound: los hilos SÍ aceleran
def esperar():
    time.sleep(2)  # Simula descarga/lectura

inicio = time.time()
hilos = [threading.Thread(target=esperar) for _ in range(4)]
for h in hilos: h.start()
for h in hilos: h.join()
print(f"4 hilos I/O: {time.time() - inicio:.2f}s")
# → ~2 segundos (4 descargas en paralelo)
```

En serio: cuatro hilos esperando 2 segundos **cada uno** terminan en ~2 segundos, no en 8. Mientras un hilo espera la red, el siguiente aprovecha para iniciar su descarga. Todos esperan *a la vez*.

---

## 📊 La tabla que hay que saberse

| Tipo de tarea | ¿Hilos ayudan? | Motivo |
|---------------|----------------|--------|
| **CPU-bound** (calcular, procesar) | ❌ No | El GIL solo deja ejecutar a uno |
| **I/O-bound** (esperar red, disco) | ✅ Sí | El GIL se libera durante la espera |

> 💡 **¿Cómo distingo cada tipo?** Si tu programa gasta el tiempo **calculando** (contar, cifrar, procesar), es CPU-bound. Si gasta el tiempo **esperando** (descargar, consultar una API, leer archivos), es I/O-bound. Los hilos brillan en el segundo caso.

---

## 🔨 Cuándo sirven de verdad los hilos

Con lo visto, el mapa mental queda así:

- **Solicitudes de red** → hilos sí. Descargar 10 archivos con 10 hilos es ~10 veces más rápido.
- **Lecturas/escrituras de archivos** → hilos sí. Varias operaciones de disco en paralelo.
- **Servidores que atienden clientes** → hilos sí. Cada cliente espera su turno; mientras espera, otros avanzan (lo verás en la U10).
- **Cálculo puro** → hilos no. Para eso, **`multiprocessing`**.

> Para CPU-bound en Python, usa `multiprocessing` (varios procesos, cada uno con su propio GIL). Esos procesos sí ejecutan en paralelo de verdad, a cambio del coste de crear procesos que viste en el [punto 1](/ApuntesPSP/02-hilos-fundamentos/01-de-proceso-a-hilo).

---

## 🧠 Mini-chequeo

1. ¿Qué significa exactamente "CPython solo ejecuta un hilo a la vez"?
2. Descargar 5 archivos de 2 segundos cada uno: ¿1 hilo o 5 hilos? ¿Cuánto tarda cada opción?
3. Sumar 50 millones de números con 4 hilos: ¿más rápido, igual o más lento que con 1?

<details>
<summary>🔄 Respuestas</summary>

1. Que el GIL hace que los hilos se **turnen** la ejecución del bytecode Python en fragmentos pequeños. Parecen simultáneos, pero nunca ejecutan Python a la vez.
2. **5 hilos**: los 5 esperan a la vez y se acaba en ~2 segundos. Con 1 hilo, 5 × 2 = **10 segundos**.
3. **Igual** (a veces ligeramente más lento). El GIL no deja que más de un hilo calcule a la vez; para eso hace falta `multiprocessing`.

</details>

---

## ✅ Resumen en 3 frases

- El **GIL** es un candado de CPython que impide que dos hilos ejecuten bytecode a la vez.
- Para código **CPU-bound**, los hilos no sirven; para código **I/O-bound**, aceleran muchísimo porque el GIL se libera durante la espera.
- Cuando necesitas paralelismo real de CPU, toca usar `multiprocessing`, no hilos.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| GIL | Global Interpreter Lock: candado de CPython |
| CPU-bound | Tarea que gasta el tiempo calculando (no le sirven los hilos) |
| I/O-bound | Tarea que gasta el tiempo esperando (le sirven los hilos) |
| Bytecode | El código intermedio que ejecuta CPython, protegido por el GIL |
| multiprocessing | Módulo para paralelismo real con procesos (cada uno con su GIL) |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/02-hilos-fundamentos) · **Anterior:** [05 · Timer](/ApuntesPSP/02-hilos-fundamentos/05-timer) · **Siguiente:** [07 · Estados del hilo](/ApuntesPSP/02-hilos-fundamentos/07-estados-del-hilo)