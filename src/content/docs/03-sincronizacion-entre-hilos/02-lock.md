---
title: 02 — Lock
description: El cerrojo que protege la sección crítica 🔒
---

<p><small>El cerrojo que protege la sección crítica 🔒</small></p>

> 🗺️ **Estás en:** 🔒 **U03 · Sincronización entre Hilos** → 02 · Lock

---

## 📬 La idea en una frase

> Un **Lock** (cerrojo) garantiza que solo un hilo entre en la **sección crítica** a la vez: el resto espera fuera hasta que el primero lo libera. Es la exclusión mutua que faltaba en el [punto 1](/ApuntesPSP/03-sincronizacion-entre-hilos/01-condicion-de-carrera).

En el ejemplo del contador compartido, la sección crítica es `contador += 1`. Protegerla con un Lock hace que los 4 hilos se turnen: nadie puede leer mientras otro está escribiendo, y el resultado final vuelve a ser el esperado.

```python
import threading

contador = 0
lock = threading.Lock()

def incrementar():
    global contador
    for _ in range(100_000):
        with lock:           # 🤝 Solo un hilo aquí dentro
            contador += 1

hilos = [threading.Thread(target=incrementar) for _ in range(4)]
for h in hilos: h.start()
for h in hilos: h.join()

print(f"Con Lock: {contador}")  # ✅ 400.000
```

Ahora el resultado es siempre **400.000**, en cualquier ejecución. El `Lock` se adquiere antes de tocar el contador y se libera al salir del bloque.

---

## 🔑 Métodos de Lock

| Método | Qué hace |
|--------|----------|
| `lock.acquire()` | Bloquea. Si otro hilo lo tiene, espera |
| `lock.release()` | Libera. Otro hilo puede entrar |
| `lock.locked()` | Devuelve `True` si está bloqueado |

`acquire()` devuelve `True` si consiguió el lock. Si otro hilo lo tiene, el hilo que llama se **bloquea** (espera) hasta que se libere. `locked()` es útil para inspeccionar el estado sin bloquearse.

---

## 🤝 Siempre `with lock:`

```python
lock = threading.Lock()

# ✅ La forma segura
with lock:
    contador += 1

# ⚠️ La forma peligrosa
lock.acquire()
contador += 1
# lock.release()  ← ¡si lo olvidas, DEADLOCK!
```

> ⚠️ **Siempre usa `with lock:`**. Si usas `acquire()` manual y olvidas `release()`, el hilo se queda con el cerrojo puesto para siempre y los demás esperan eternamente: un **deadlock**. El `with` libera el lock solo, incluso si el código dentro lanza una excepción.

---

## 🎭 Be the code: contador con y sin Lock

**Sin Lock — el caos**:

```
Hilo-A: lee contador = 0
Hilo-B: lee contador = 0          ← ¡mismo valor!
Hilo-A: escribe contador = 1
Hilo-B: escribe contador = 1      ← ¡pisó el incremento de A!
Hilo-A: lee contador = 1
Hilo-A: escribe contador = 2
Hilo-B: lee contador = 1          ← ¡leyó valor viejo!
```

**Con Lock — el orden**:

```
Hilo-A: acquire() → DENTRO
Hilo-A: lee contador = 0
Hilo-A: escribe contador = 1
Hilo-A: release() → FUERA

Hilo-B: acquire() → DENTRO        ← esperó hasta que A soltó
Hilo-B: lee contador = 1          ← valor correcto
Hilo-B: escribe contador = 2
Hilo-B: release() → FUERA

Hilo-C: acquire() → DENTRO
Hilo-C: lee contador = 2          ← valor correcto
...
```

Con el Lock, el "leer → sumar → escribir" de cada hilo ocurre **de principio a fin sin que nadie se cuele** entre medias. Los cajeros de la analogía del [punto 1](/ApuntesPSP/03-sincronizacion-entre-hilos/01-condicion-de-carrera) ya no se pisan: mientras uno toca la caja, el otro espera fuera.

> 💡 **Regla de oro:** el Lock protege la **sección crítica**, no el hilo. Todo el código que toque la variable compartida debe ir dentro del mismo lock.

---

## 🧠 Mini-chequeo

1. ¿Qué garantiza un `Lock`?
2. ¿Qué pasa si dos hilos llaman a `acquire()` a la vez?
3. ¿Por qué `with lock:` es mejor que `acquire()`/`release()` manuales?

<details>
<summary>🔄 Respuestas</summary>

1. Que solo un hilo entre en la sección crítica a la vez: exclusión mutua sobre el recurso compartido.
2. El primero entra; el segundo se **bloquea** esperando hasta que el primero haga `release()`. Solo entonces continúa.
3. Porque el `with` llama a `release()` automáticamente al salir del bloque, incluso si hay una excepción. Con `acquire()` manual es fácil olvidar el `release()` y provocar un deadlock.
</details>

---

## ✅ Resumen en 3 frases

- El `Lock` es el cerrojo que protege la sección crítica: solo un hilo a la vez.
- Con `with lock:` nunca se olvida liberarlo; con `acquire()`/`release()` manuales, un `release()` olvidado = deadlock.
- Protegido con Lock, el contador del [punto 1](/ApuntesPSP/03-sincronizacion-entre-hilos/01-condicion-de-carrera) pasa de resultados aleatorios a un **400.000** exacto.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| Lock | Cerrojo: exclusión mutua sobre una sección crítica |
| acquire() | Bloquear el lock (esperar si está ocupado) |
| release() | Liberar el lock para que otro entre |
| with lock: | Contexto que adquiere y libera el lock automáticamente |
| Sección crítica | Código que toca un recurso compartido |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/03-sincronizacion-entre-hilos) · **Anterior:** [01 · Condición de carrera](/ApuntesPSP/03-sincronizacion-entre-hilos/01-condicion-de-carrera) · **Siguiente:** [03 · RLock](/ApuntesPSP/03-sincronizacion-entre-hilos/03-rlock)