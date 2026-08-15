---
title: 05 — Barrier
description: Ningún hilo avanza hasta que llegan todos 🏁
---

<p><small>Ningún hilo avanza hasta que llegan todos 🏁</small></p>

> 🗺️ **Estás en:** 🔒 **U03 · Sincronización entre Hilos** → 05 · Barrier

---

## 📬 La idea en una frase

> Una **Barrier** obliga a todos los hilos a esperar hasta que el último llegue. Entonces todos continúan **a la vez**: perfecta para sincronizar **fases** de un trabajo en paralelo.

El `Lock` y el `Semaphore` controlan **cuántos** pasan. La `Barrier` controla **cuándo**: nadie cruza la meta hasta que el grupo completo está listo.

```python
import threading, time

barrera = threading.Barrier(3)  # 3 hilos deben llegar

def corredor(id):
    print(f"Corredor-{id} preparándose...")
    time.sleep(id * 0.5)        # Cada uno tarda distinto
    print(f"  → Corredor-{id} en la salida")
    barrera.wait()              # Espera a los demás
    print(f"  🏁 Corredor-{id} SALIÓ!")

hilos = [threading.Thread(target=corredor, args=(i,)) for i in range(3)]
for h in hilos: h.start()
for h in hilos: h.join()
```

**Salida**:
```
Corredor-0 preparándose...
  → Corredor-0 en la salida
Corredor-1 preparándose...
  → Corredor-1 en la salida
Corredor-2 preparándose...
  → Corredor-2 en la salida
  🏁 Corredor-0 SALIÓ!
  🏁 Corredor-1 SALIÓ!
  🏁 Corredor-2 SALIÓ!
```

Fíjate en la salida: los 3 corredores tardan distinto en llegar a la salida (`time.sleep(id * 0.5)`), pero **los 3 cruzan a la vez** justo después de que el último llegue. `barrera.wait()` devuelve cuando los 3 hilos han llegado al `wait()`.

> 💡 El `Barrier(3)` espera exactamente 3 hilos. Si un hilo no llega (se bloquea o muere), los demás esperan para siempre: **el número de hilos debe coincidir** con el de la barrera.

---

## 🧱 Sincronizar fases de un trabajo

La aplicación más típica: un trabajo en paralelo con varias **fases**. Nadie empieza la fase 2 hasta que todos terminaron la fase 1.

```
      FASE 1               FASE 2
Hilo-A: trabaja → wait() → trabaja → wait()
Hilo-B: trabaja → wait() → trabaja → wait()
Hilo-C: trabaja → wait() → trabaja → wait()
        └──────┘            └──────┘
       todos acaban       todos acaban
       a la vez y         a la vez y
       pasan juntos       pasan juntos
```

Un ejemplo: descargar 3 archivos, y solo cuando los 3 estén descargados, empezar a procesarlos.

```python
import threading, time

barrera = threading.Barrier(3)

def tarea(id):
    print(f"  📥 Descargando archivo-{id}...")
    time.sleep(1 + id)          # descargas de distinta duración
    barrera.wait()              # 🏁 espera a que todos terminen
    print(f"  🧮 Procesando archivo-{id} (fase 2)")

hilos = [threading.Thread(target=tarea, args=(i,)) for i in range(3)]
for h in hilos: h.start()
for h in hilos: h.join()
```

**Salida** (extracto):
```
  📥 Descargando archivo-0...
  📥 Descargando archivo-1...
  📥 Descargando archivo-2...
  🧮 Procesando archivo-0 (fase 2)
  🧮 Procesando archivo-1 (fase 2)
  🧮 Procesando archivo-2 (fase 2)
```

Ningún archivo se procesa hasta que los 3 están descargados. La barrera convierte el "cada uno a lo suyo" en "todos juntos en cada fase".

---

## ⚖️ Barrier frente al resto

| Mecanismo | Pregunta que responde |
|---|---|
| Lock | ¿Quién toca el recurso? (solo uno) |
| Semaphore | ¿Cuántos a la vez? (hasta N) |
| Barrier | ¿Cuándo empieza la siguiente fase? (cuando todos llegan) |

> Los tres se pueden combinar: una `Barrier` para coordinar fases, un `Semaphore` para limitar quién accede al recurso en cada fase y un `Lock` para las secciones críticas dentro de cada fase.

---

## 🧠 Mini-chequeo

1. ¿Qué hace `barrera.wait()`?
2. ¿Qué ocurre si solo llegan 2 de los 3 hilos esperados por `Barrier(3)`?
3. ¿Para qué tipo de problema es la barrera la herramienta ideal?

<details>
<summary>🔄 Respuestas</summary>

1. Bloquea al hilo hasta que **todos** los hilos de la barrera hayan llegado a su `wait()`. Cuando el último llega, todos continúan a la vez.
2. Los 2 que llegaron esperan para siempre: el tercero nunca llega, así que la barrera nunca se levanta. El número de hilos debe ser exactamente el de la barrera.
3. Para sincronizar **fases** de un trabajo en paralelo: nadie empieza la fase N+1 hasta que todos terminaron la fase N (por ejemplo, no procesar un archivo hasta que todas las descargas terminan).
</details>

---

## ✅ Resumen en 3 frases

- La `Barrier(N)` espera a que **N hilos** lleguen al `wait()`; cuando el último llega, todos continúan a la vez.
- Es la herramienta para **sincronizar fases**: nadie empieza la siguiente fase hasta que todos acaban la anterior.
- El número de hilos debe coincidir con el de la barrera, o el grupo se queda esperando para siempre.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| Barrier | Barrera: N hilos esperan hasta que llegan todos |
| wait() | El hilo llega a la barrera y espera al resto |
| Fase | Etapa de un trabajo; las fases se separan con barreras |
| Sincronización de grupo | Coordinar N hilos, no solo 2 |
| BreakingBarrierError | Se lanza si un hilo de la barrera se rompe/aborta |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/03-sincronizacion-entre-hilos) · **Anterior:** [04 · Semaphore](/ApuntesPSP/03-sincronizacion-entre-hilos/04-semaphore) · **Siguiente:** [06 · Condition](/ApuntesPSP/03-sincronizacion-entre-hilos/06-condition)