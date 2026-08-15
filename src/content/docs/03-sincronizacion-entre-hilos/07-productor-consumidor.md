---
title: 07 — Productor-Consumidor
description: El patrón clásico con cola y Condition 🏭🍽️
---

<p><small>El patrón clásico con cola y Condition 🏭🍽️</small></p>

> 🗺️ **Estás en:** 🔒 **U03 · Sincronización entre Hilos** → 07 · Productor-Consumidor

---

## 📬 La idea en una frase

> El patrón **productor-consumidor** separa a quien **crea** datos (productor) de quien los **procesa** (consumidor): comparten una cola y una `Condition` para que el consumidor espere cuando la cola está vacía y el productor le avise cuando añade algo.

Es el patrón de sincronización más usado en el mundo real: un hilo llena una cola de tareas, otros hilos las procesan. La `Condition` del [punto 6](/ApuntesPSP/03-sincronizacion-entre-hilos/06-condition) es el pegamento que los coordina.

```python
import threading, time, random

cola = []
condition = threading.Condition()

def productor():
    for i in range(5):
        with condition:
            item = random.randint(1, 100)
            cola.append(item)
            print(f"📦 Producido: {item}")
            condition.notify()  # Avisa al consumidor
        time.sleep(random.random())

def consumidor():
    for _ in range(5):
        with condition:
            while not cola:
                condition.wait()  # Espera a que haya algo
            item = cola.pop(0)
            print(f"  🍽️ Consumido: {item}")

h_prod = threading.Thread(target=productor)
h_cons = threading.Thread(target=consumidor)
h_prod.start()
h_cons.start()
h_prod.join()
h_cons.join()
```

**Salida** (aproximada):
```
📦 Producido: 73
  🍽️ Consumido: 73
📦 Producido: 41
  🍽️ Consumido: 41
📦 Producido: 8
  🍽️ Consumido: 8
...
```

El ritmo lo marcan los `sleep()`: a veces el consumidor se adelanta, encuentra la cola vacía y espera; a veces el productor se adelanta, deja elementos y el consumidor los consume de golpe. La `Condition` garantiza que **ninguno se pierde un dato** y que nadie se queda esperando un elemento que ya llegó.

---

## 🎬 Paso a paso

Veamos cómo se coordinan los dos hilos:

```
1. El consumidor arranca, la cola está vacía
   → with condition: adquiere el lock
   → while not cola: es True
   → condition.wait()  → libera el lock y se duerme 💤

2. El productor arranca, con el lock libre
   → with condition: adquiere el lock
   → cola.append(item)  → cola = [73]
   → condition.notify() → despierta al consumidor 😃
   → sale del with → libera el lock

3. El consumidor se despierta
   → recomprueba while not cola → False (¡hay un item!)
   → item = cola.pop(0) → procesa el 73
   → sale del with → libera el lock
```

La magia de `wait()` del [punto 6](/ApuntesPSP/03-sincronizacion-entre-hilos/06-condition): mientras el consumidor duerme, **libera el lock** para que el productor pueda entrar y producir. Sin esa liberación, el productor nunca podría producir y el consumidor esperaría eternamente (deadlock).

---

## 📏 Con varios productores y consumidores

Con **varios** hilos a cada lado, la regla cambia ligeramente: si varios consumidores esperan, `notify()` solo despierta a **uno** y los demás se quedan dormidos aunque haya trabajo. Para no dejar a nadie esperando, el productor usa `notify_all()`:

```python
import threading, time, random

cola = []
condition = threading.Condition()

def productor():
    for _ in range(3):
        with condition:
            item = random.randint(1, 10)
            cola.append(item)
            print(f"📦 Producido: {item}")
            condition.notify_all()   # despierta a TODOS los consumidores
        time.sleep(1)

def consumidor(id):
    for _ in range(3):
        with condition:
            while not cola:
                condition.wait()
            item = cola.pop(0)
            print(f"  🍽️ Consumidor-{id} comió: {item}")

hilos = []
for i in range(2):
    hilos.append(threading.Thread(target=consumidor, args=(i,)))
for _ in range(1):
    hilos.append(threading.Thread(target=productor))

for h in hilos: h.start()
for h in hilos: h.join()
```

> 💡 Y si quieres limitar el tamaño de la cola (buffer con tope), el semáforo del [punto 4](/ApuntesPSP/03-sincronizacion-entre-hilos/04-semaphore) o la clase `queue.Queue(maxsize=N)` (thread-safe, sin locks a mano) te dan el control: los productores llaman a `put()` y los consumidores a `get()`.

---

## 🧠 Mini-chequeo

1. ¿Qué papel juega cada hilo en el patrón productor-consumidor?
2. ¿Por qué `wait()` tiene que liberar el lock mientras el consumidor duerme?
3. ¿Por qué con varios consumidores conviene `notify_all()` en lugar de `notify()`?

<details>
<summary>🔄 Respuestas</summary>

1. El **productor** crea datos y los mete en la cola compartida; el **consumidor** los saca y los procesa. Comparten la cola y la `Condition` para coordinar el aviso.
2. Porque si el consumidor se durmiera **con** el lock puesto, el productor nunca podría entrar a producir y nadie le avisaría nunca: sería un deadlock. Liberar el lock al dormir es lo que permite que el ciclo avance.
3. `notify()` despierta a **un solo** consumidor: los demás pueden quedarse dormidos aunque haya elementos. Con `notify_all()`, todos recomprueban la condición y el que pueda, consume.
</details>

---

## ✅ Resumen en 3 frases

- El patrón **productor-consumidor** separa la creación de datos (productor) del procesamiento (consumidor) con una cola compartida.
- La `Condition` coordina el aviso: el consumidor hace `wait()` (liberando el lock) y el productor hace `notify()`/`notify_all()` cuando añade un elemento.
- La regla `while` + `wait()` garantiza que ningún hilo consuma un dato que no existe ni se quede dormido con trabajo pendiente.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| Productor | Hilo que crea datos y los mete en la cola |
| Consumidor | Hilo que saca datos de la cola y los procesa |
| Cola compartida | Buffer donde el productor deja y el consumidor recoge |
| notify_all() | Avisar a todos los consumidores que esperan |
| Buffer limitado | Cola con tope máximo (semáforo o `queue.Queue`) |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/03-sincronizacion-entre-hilos) · **Anterior:** [06 · Condition](/ApuntesPSP/03-sincronizacion-entre-hilos/06-condition) · **Siguiente:** [08 · Buenas prácticas](/ApuntesPSP/03-sincronizacion-entre-hilos/08-buenas-practicas)