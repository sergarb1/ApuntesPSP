---
title: 06 — Condition
description: Cuando un hilo necesita que otro le avise 📢
---

<p><small>Cuando un hilo necesita que otro le avise 📢</small></p>

> 🗺️ **Estás en:** 🔒 **U03 · Sincronización entre Hilos** → 06 · Condition

---

## 📬 La idea en una frase

> Una **Condition** permite que un hilo se duerma esperando a que otro le **notifique** que algo ocurrió: `wait()` duerme y libera el lock, `notify()` despierta a un hilo dormido.

El `Lock`, el `Semaphore` y la `Barrier` sincronizan **acceso**. La `Condition` sincroniza **eventos**: un hilo quiere hacer algo, pero tiene que esperar a que la condición (por ejemplo, "hay un elemento en la cola") se cumpla, y es otro hilo quien se la avisa.

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

El productor añade un elemento y **notifica**; el consumidor, si la cola está vacía, **espera** hasta que le avisen. El `Condition` lleva asociado un lock interno: al entrar en `with condition:` se adquiere, y `wait()` lo **libera** mientras duerme para que el productor pueda entrar.

---

## 📚 Métodos de Condition

| Método | Qué hace |
|--------|----------|
| `wait()` | Libera el lock y espera una notificación |
| `notify()` | Despierta a un hilo que está esperando |
| `notify_all()` | Despierta a todos los hilos que esperan |

> ⚠️ **Siempre dentro del `with condition:`.** `wait()`, `notify()` y `notify_all()` exigen tener el lock de la condición adquirido.

---

## ⚠️ La regla de oro: `while`, no `if`

Tras despertar con `notify()`, el hilo debe **volver a comprobar la condición**:

```python
# ✅ CORRECTO
while not cola:
    condition.wait()

# ❌ INCORRECTO
if not cola:
    condition.wait()
```

¿Por qué? Pueden darse **falsas activaciones** (spurious wakeups) o que otro hilo haya consumido el elemento mientras esperábamos. Con `if`, el hilo despierta y asume que la condición se cumple… pero puede que ya no. Con `while`, tras despertar **recomprueba** y, si la condición sigue sin cumplirse, vuelve a dormir.

> 💡 Esta es una de las diferencias que separa al novato del profesional: **siempre `while` después de `wait()`**.

---

## 🕵️ ¿Cuándo usarla?

| Situación | ¿Por qué Condition? |
|---|---|
| Productor-consumidor con cola | El consumidor espera hasta que haya producto |
| Un hilo "jefe" que espera a que los obreros terminen | `wait()` hasta que avisen |
| Recurso que se llena y se vacía | Notificar cuando el estado cambia |
| Turnos entre hilos | `notify()` al que le toca |

La `Condition` es el mecanismo del **aviso**: un hilo no adivina cuándo hay trabajo, otro se lo dice. Es la pieza que convierte "comprobar sin parar" (y quemar CPU) en "dormir y que me despierten".

```python
import threading, time

condition = threading.Condition()
listo = False

def trabajador():
    global listo
    with condition:
        while not listo:            # espera la señal de la jefa
            condition.wait()
    print("🛠️ Trabajador: ¡manos a la obra!")

def jefa():
    global listo
    time.sleep(1)
    with condition:
        listo = True
        condition.notify()          # ¡despierta al trabajador!
    print("👩‍💼 Jefa: ¡podéis empezar!")
```

Sin la condición, el trabajador tendría que comprobar `listo` en bucle gastando CPU. Con `wait()`/`notify()`, duerme hasta que la jefa le avisa.

---

## 🧠 Mini-chequeo

1. ¿Qué hace `wait()` exactamente con el lock de la condición?
2. ¿Por qué hay que usar `while` en lugar de `if` después de `wait()`?
3. ¿Qué diferencia hay entre `notify()` y `notify_all()`?

<details>
<summary>🔄 Respuestas</summary>

1. **Libera el lock** mientras espera (para que otros hilos puedan entrar) y se queda dormido hasta recibir una notificación.
2. Por las **falsas activaciones** (spurious wakeups) y porque otro hilo pudo consumir el recurso mientras esperábamos: con `while` se recomprueba la condición y, si no se cumple, se vuelve a dormir.
3. `notify()` despierta a **un** hilo esperando; `notify_all()` despierta a **todos**. Con varios consumidores esperando, `notify_all()` evita que un hilo se quede dormido para siempre.
</details>

---

## ✅ Resumen en 3 frases

- La `Condition` sincroniza **eventos**: un hilo hace `wait()` (liberando el lock y durmiendo) hasta que otro hace `notify()`.
- La regla de oro es **`while` y no `if`** después de `wait()`: las falsas activaciones exigen recomprobar la condición.
- Es la base del patrón **productor-consumidor**, que verás en el siguiente punto.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| Condition | Mecanismo de espera y aviso entre hilos |
| wait() | Libera el lock y duerme hasta que le avisen |
| notify() | Despierta a un hilo que está esperando |
| notify_all() | Despierta a todos los hilos que esperan |
| Falsa activación | Despertar sin que nadie notificara de verdad (spurious wakeup) |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/03-sincronizacion-entre-hilos) · **Anterior:** [05 · Barrier](/ApuntesPSP/03-sincronizacion-entre-hilos/05-barrier) · **Siguiente:** [07 · Productor-Consumidor](/ApuntesPSP/03-sincronizacion-entre-hilos/07-productor-consumidor)