---
title: 04 — Semaphore
description: El aforo máximo de la sección crítica 🎟️
---

<p><small>El aforo máximo de la sección crítica 🎟️</small></p>

> 🗺️ **Estás en:** 🔒 **U03 · Sincronización entre Hilos** → 04 · Semaphore

---

## 📬 La idea en una frase

> Un **Semaphore** permite que hasta **N hilos** accedan al recurso a la vez: es como el aforo máximo de un local. Cuando se libera un puesto, entra el siguiente.

El `Lock` del [punto 2](/ApuntesPSP/03-sincronizacion-entre-hilos/02-lock) deja pasar a **uno** a la vez. El `Semaphore(2)` deja pasar a **dos** a la vez; `Semaphore(3)`, a **tres**… y así hasta el número que le pases al constructor.

```python
import threading, time

semaforo = threading.Semaphore(2)  # Máximo 2 hilos dentro

def entrar(id):
    print(f"Hilo-{id} esperando...")
    with semaforo:
        print(f"  → Hilo-{id} DENTRO")
        time.sleep(2)
    print(f"  ← Hilo-{id} SALE")

hilos = [threading.Thread(target=entrar, args=(i,)) for i in range(5)]
for h in hilos: h.start()
for h in hilos: h.join()
```

**Salida** (salen de 2 en 2):
```
Hilo-0 esperando...
Hilo-1 esperando...
Hilo-2 esperando...
Hilo-3 esperando...
Hilo-4 esperando...
  → Hilo-0 DENTRO
  → Hilo-1 DENTRO
  ← Hilo-0 SALE
  ← Hilo-1 SALE
  → Hilo-2 DENTRO
  → Hilo-3 DENTRO
  ← Hilo-2 SALE
  ← Hilo-3 SALE
  → Hilo-4 DENTRO
  ← Hilo-4 SALE
```

Los 5 hilos esperan, pero dentro solo hay **2 a la vez**. Cuando uno sale, entra el siguiente. El semáforo hace de portero con un contador interno: `acquire()` lo baja, `release()` lo sube.

---

## ⏱️ Semáforo con timeout

A veces no quieres esperar eternamente: si el recurso no se libera en X segundos, el hilo se rinde. `acquire(blocking=True, timeout=N)` devuelve `True` si consiguió el recurso y `False` si pasaron los N segundos.

```python
import threading, time

semaforo = threading.Semaphore(1)  # Solo 1 dentro

def entrar(id):
    if semaforo.acquire(timeout=1):
        print(f"Hilo-{id} entró")
        time.sleep(2)
        semaforo.release()
    else:
        print(f"Hilo-{id} TIMEOUT: se va")

hilos = [threading.Thread(target=entrar, args=(i,)) for i in range(3)]
for h in hilos: h.start()
for h in hilos: h.join()
```

**Salida** (aproximada):
```
Hilo-0 entró
Hilo-1 TIMEOUT: se va
Hilo-2 TIMEOUT: se va
```

El hilo 0 ocupa el único puesto; los otros esperan 1 segundo y, al no entrar, **abandonan** en lugar de bloquearse para siempre. Ese `True`/`False` de `acquire(timeout=...)` te deja decidir si el hilo entra o se rinde.

---

## 🏭 ¿Para qué sirve un semáforo?

| Situación | ¿Por qué un semáforo? |
|---|---|
| Limitar conexiones a una base de datos | No saturar el servidor de BD |
| Descargas simultáneas | Máximo N descargas a la vez |
| Acceso a una API con rate limit | No superar las peticiones permitidas |
| Impresoras compartidas | Solo las N impresoras disponibles |
| Aforo de un recurso físico | Como el aforo máximo de un local |

> 💡 **Diferencia con Lock:** el Lock es `Semaphore(1)`. Para **exclusión mutua** usa Lock (más simple y rápido); para **limitar acceso concurrente** a N recursos, Semaphore.

---

## 🧠 Mini-chequeo

1. ¿Cuántos hilos dejan entrar `Semaphore(3)` a la vez?
2. ¿Qué devuelve `acquire(timeout=2)` cuando el recurso se libera y cuando no?
3. ¿Cuándo elegirías Semaphore en lugar de Lock?

<details>
<summary>🔄 Respuestas</summary>

1. **3 hilos a la vez.** Cuando un hilo sale, el cuarto puede entrar.
2. Devuelve `True` si consiguió el recurso dentro de los 2 segundos y `False` si expiró el tiempo esperando. Con el `False` puedes decidir que el hilo se rinda.
3. Cuando quieres **limitar acceso concurrente** a N recursos (aforo): conexiones a BD, descargas, rate limit de una API. Para un único recurso, Lock es más simple.
</details>

---

## ✅ Resumen en 3 frases

- El `Semaphore(N)` limita a **N hilos** a la vez dentro del recurso: contador interno que baja al entrar y sube al salir.
- Con `acquire(timeout=N)` los hilos esperan un máximo de N segundos y se rinden si no entran (devuelve `True`/`False`).
- Es el mecanismo del **aforo**: conexiones a BD, descargas simultáneas o APIs con rate limit.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| Semaphore | Aforo máximo: hasta N hilos dentro a la vez |
| Contador interno | Nº de puestos libres del recurso |
| acquire() | Reservar un puesto (baja el contador) |
| release() | Liberar un puesto (sube el contador) |
| Timeout | Esperar máximo N segundos y rendirse |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/03-sincronizacion-entre-hilos) · **Anterior:** [03 · RLock](/ApuntesPSP/03-sincronizacion-entre-hilos/03-rlock) · **Siguiente:** [05 · Barrier](/ApuntesPSP/03-sincronizacion-entre-hilos/05-barrier)