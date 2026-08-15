---
title: 08 — Buenas prácticas
description: Deadlocks, orden de locks, el ring final y a practicar 🛡️
---

<p><small>Deadlocks, orden de locks, el ring final y a practicar 🛡️</small></p>

> 🗺️ **Estás en:** 🔒 **U03 · Sincronización entre Hilos** → 08 · Buenas prácticas

---

## 📬 La idea en una frase

> Ya tienes Lock, RLock, Semaphore, Barrier y Condition. Este punto cierra la teoría con el enemigo más temido —el **deadlock**—, las reglas para evitarlo y el "ring" que enfrenta a los mecanismos para que decidas cuándo usar cada uno.

Después de este punto, el cierre de la unidad (punto 9) y los boletines pondrán a prueba todo lo aprendido.

---

## 🧊 El deadlock: todos esperan al Lock

Un **deadlock** es la situación en la que dos o más hilos se esperan **mutuamente para siempre**: cada uno tiene un recurso y espera el que tiene el otro.

**Ejemplo clásico con 2 hilos y 2 locks:**

```
Hilo-A: adquiere Lock-1          Hilo-B: adquiere Lock-2
Hilo-A: espera Lock-2  ←──→      Hilo-B: espera Lock-1
```

- Hilo-A tiene Lock-1 y espera a que se libere Lock-2.
- Hilo-B tiene Lock-2 y espera a que se libere Lock-1.
- **Ninguno de los dos puede avanzar.** Se esperan el uno al otro eternamente.

```python
import threading, time

lock1 = threading.Lock()
lock2 = threading.Lock()

def hilo_a():
    with lock1:
        time.sleep(0.1)          # tiempo para que B tome lock2
        with lock2:              # B tiene lock2... espera para siempre 💀
            print("A: ¡trabajando!")

def hilo_b():
    with lock2:
        time.sleep(0.1)          # tiempo para que A tome lock1
        with lock1:              # A tiene lock1... espera para siempre 💀
            print("B: ¡trabajando!")

h1 = threading.Thread(target=hilo_a)
h2 = threading.Thread(target=hilo_b)
h1.start(); h2.start()
h1.join(); h2.join()  # ← nunca termina
```

Los `sleep(0.1)` fuerzan el escenario: A coge el lock1, B coge el lock2, y después cada uno intenta coger el del otro. El programa **se queda colgado** y ni A ni B imprimen su mensaje. La CPU se queda al 100% con dos hilos bloqueados que se esperan a sí mismos… en realidad, al otro.

---

## 🛡️ Cómo evitar deadlocks: las 3 reglas

1. **Adquirir los locks siempre en el mismo orden.** Si todos los hilos piden primero Lock-1 y luego Lock-2, el escenario anterior no puede darse: nadie tiene Lock-2 sin haber pasado por Lock-1.
2. **Usar `with lock:`** (nunca olvidar `release()`). Un `release()` olvidado deja el cerrojo puesto para siempre y cualquier hilo que lo espere, esperará eternamente.
3. **Usar `RLock` si el mismo hilo necesita adquirirlo varias veces** (lo viste en el [punto 3](/ApuntesPSP/03-sincronizacion-entre-hilos/03-rlock)): evita que un hilo se espere a sí mismo.

> ⚠️ **¿Puedo tener más de un Lock?** Sí, pero cada Lock añade riesgo de deadlock. Sé disciplinado con el orden de adquisición: **mismo orden para todos los hilos, siempre**.

---

## ⚡ Preguntas rápidas (y sus respuestas)

**¿Qué es más rápido, Lock o Semaphore?**
Lock es más simple y, para exclusión mutua, gana en velocidad. Semaphore tiene contador interno: solo lo necesitas para limitar acceso concurrente (aforo). Para "solo uno a la vez", Lock.

**¿Y si necesito sincronización entre procesos en vez de entre hilos?**
Usa `multiprocessing.Lock`, `multiprocessing.Semaphore`, etc. Son equivalentes a los de `threading` pero para procesos: recuerda que los procesos no comparten memoria, así que la sincronización se hace sobre recursos del sistema.

---

## 🥊 El ring de los conceptos — Lock vs Semáforo vs Barrera

**Lock:** "Soy el portero. Solo dejo pasar a **uno cada vez**. Los demás esperan fuera."

**Semáforo(3):** "Soy el guardia de una sala con **3 sillas**. Cuando una se libera, entra el siguiente."

**Barrera(3):** "Soy el juez de salida. **No permito que nadie corra** hasta que los 3 estén en la línea."

**Lock:** "Para exclusión mutua, no hay mejor que yo. Dos hilos no pueden tocarme el recurso a la vez."

**Semáforo:** "Para **limitar acceso concurrente**. Como un aforo máximo en un local."

**Barrera:** "Para sincronizar **fases de un trabajo**. Todos completan la fase 1, luego todos empiezan la fase 2."

> **Moraleja del ring:** cada mecanismo responde a una pregunta distinta — ¿quién? (Lock), ¿cuántos? (Semáforo), ¿cuándo? (Barrera). Y la `Condition` del [punto 6](/ApuntesPSP/03-sincronizacion-entre-hilos/06-condition) añade el aviso entre hilos.

---

## ✏️ Aprieta el lápiz

1. **Condición de carrera**: Crea 2 hilos que incrementen un contador 1M veces cada uno. Compara con y sin Lock.
2. **Semáforo descargas**: Crea 10 hilos que simulen descargas (sleep 2s) usando un Semáforo(3). Mide el tiempo total.
3. **Barrera de fases**: Crea 4 hilos que trabajen en 2 fases. La fase 2 no empieza hasta que todos terminan la fase 1.
4. **Productor-Consumidor**: 1 productor crea números aleatorios cada 0.5s; 2 consumidores los procesan. Usa Condition.
5. **Deadlock provocado**: Crea intencionadamente un deadlock con 2 hilos y 2 locks. Luego arréglalo.

<details>
<summary>🔓 Soluciones</summary>

**1. Condición de carrera:**

```python
import threading

contador = 0
lock = threading.Lock()

def incrementar():
    global contador
    for _ in range(1_000_000):
        with lock:
            contador += 1

hilos = [threading.Thread(target=incrementar) for _ in range(2)]
for h in hilos: h.start()
for h in hilos: h.join()
print(f"Con Lock: {contador}")  # ✅ 2.000.000
```

Quita el `with lock:` y el resultado será menor de 2.000.000 (condición de carrera del [punto 1](/ApuntesPSP/03-sincronizacion-entre-hilos/01-condicion-de-carrera)).

**2. Semáforo descargas:**

```python
import threading, time

semaforo = threading.Semaphore(3)
inicio = time.time()

def descargar(id):
    with semaforo:
        print(f"📥 Descargando {id}...")
        time.sleep(2)
        print(f"  ✅ {id} terminado")

hilos = [threading.Thread(target=descargar, args=(i,)) for i in range(10)]
for h in hilos: h.start()
for h in hilos: h.join()
print(f"⏱️ Tiempo total: {time.time() - inicio:.1f}s")
```

Con `Semaphore(3)` los 10 tardan unos 8 segundos (4 tandas de 3, la última de 1). Sin semáforo, unos 2 segundos pero con 10 descargas a la vez.

**3. Barrera de fases:**

```python
import threading, time

barrera = threading.Barrier(4)

def trabajo(id):
    print(f"  🧮 Fase 1 del hilo-{id}")
    time.sleep(id * 0.3)
    barrera.wait()                      # espera a los 4
    print(f"  🏁 Fase 2 del hilo-{id}")

hilos = [threading.Thread(target=trabajo, args=(i,)) for i in range(4)]
for h in hilos: h.start()
for h in hilos: h.join()
```

Ningún "Fase 2" se imprime hasta que los 4 hilos han imprimido su "Fase 1": eso es sincronizar fases con la [barrera](/ApuntesPSP/03-sincronizacion-entre-hilos/05-barrier).

**4. Productor-Consumidor:**

```python
import threading, time, random

cola = []
condition = threading.Condition()

def productor():
    for _ in range(10):
        with condition:
            cola.append(random.randint(1, 100))
            print(f"📦 Producido: {cola[-1]}")
            condition.notify_all()
        time.sleep(0.5)

def consumidor(id):
    for _ in range(5):
        with condition:
            while not cola:
                condition.wait()
            print(f"  🍽️ Consumidor-{id} procesó: {cola.pop(0)}")

h_prod = threading.Thread(target=productor)
h_cons = [threading.Thread(target=consumidor, args=(i,)) for i in range(2)]
h_prod.start()
for h in h_cons: h.start()
h_prod.join()
for h in h_cons: h.join()
```

La `Condition` y la regla `while not cola: wait()` del [punto 7](/ApuntesPSP/03-sincronizacion-entre-hilos/07-productor-consumidor) coordinan a los tres.

**5. Deadlock provocado:**

```python
import threading, time

lock1 = threading.Lock()
lock2 = threading.Lock()

def hilo_a():
    with lock1:
        time.sleep(0.1)
        with lock2: print("A trabajando")

def hilo_b():
    with lock2:              # ❌ orden invertido → deadlock
        time.sleep(0.1)
        with lock1: print("B trabajando")

h1 = threading.Thread(target=hilo_a)
h2 = threading.Thread(target=hilo_b)
h1.start(); h2.start()
h1.join(); h2.join()
```

**Arreglo:** los dos hilos adquieren los locks en el **mismo orden** (`lock1` → `lock2`):

```python
def hilo_b():
    with lock1:              # ✅ mismo orden que A
        time.sleep(0.1)
        with lock2: print("B trabajando")
```

</details>

---

## 🧩 Pool Puzzle de sincronización

> **Instrucciones**: Ordena estas líneas para que 3 hilos incrementen un contador compartido de forma segura.

```
a. lock = threading.Lock()
b. for h in hilos: h.start()
c. contador += 1
d. hilos = []
e. import threading
f. for _ in range(3):
g. with lock:
h. def incrementar():
i.     hilos.append(threading.Thread(target=incrementar))
j. for h in hilos: h.join()
k. global contador
l. contador = 0
m. print(contador)
```

<details>
<summary>🧩 Solución</summary>

```python
import threading                              # e
contador = 0                                  # l
lock = threading.Lock()                       # a

def incrementar():                            # h
    global contador                           # k
    for _ in range(100_000):
        with lock:                            # g
            contador += 1                     # c

hilos = []                                    # d
for _ in range(3):                            # f
    hilos.append(threading.Thread(target=incrementar))  # i

for h in hilos: h.start()                     # b
for h in hilos: h.join()                      # j

print(contador)                               # m
```

El resultado es **300.000** (3 hilos × 100.000) gracias al `with lock:` que protege el incremento.

</details>

---

## 🧠 Mini-chequeo

1. Dibuja el escenario exacto de un deadlock con 2 hilos y 2 locks.
2. ¿Cuál es la regla de oro para los locks múltiples?
3. ¿Qué mecanismo usarías para: un recurso a la vez / aforo de 3 / coordinar fases?

<details>
<summary>🔄 Respuestas</summary>

1. Hilo-A tiene Lock-1 y espera Lock-2; Hilo-B tiene Lock-2 y espera Lock-1. Ninguno libera el suyo y los dos esperan para siempre.
2. Adquirir los locks **siempre en el mismo orden** en todos los hilos: nadie puede tener Lock-2 sin haber pasado por Lock-1, y el abrazo mortal no ocurre.
3. Un recurso → **Lock**; aforo de 3 → **Semaphore(3)**; coordinar fases → **Barrier** (y `Condition` para el aviso productor-consumidor).
</details>

---

## ✅ Resumen en 3 frases

- El **deadlock** es un abrazo mortal: cada hilo espera un recurso que tiene el otro, y ninguno avanza.
- Reglas anti-deadlock: **mismo orden de locks**, **`with lock:`** siempre, y **`RLock`** si el mismo hilo se re-adquiere.
- El ring final te deja la regla: Lock para exclusión mutua, Semaphore para aforo, Barrier para fases y Condition para el aviso.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| Deadlock | Hilos que se esperan mutuamente para siempre |
| Orden de locks | Regla: todos los hilos piden los locks en el mismo orden |
| Abrazo mortal | Otro nombre del deadlock (Hilo-A y Hilo-B entrelazados) |
| multiprocessing.Lock | Lock equivalente para procesos en lugar de hilos |
| Pool Puzzle | Ejercicio de ordenar líneas de código sueltas |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/03-sincronizacion-entre-hilos) · **Anterior:** [07 · Productor-Consumidor](/ApuntesPSP/03-sincronizacion-entre-hilos/07-productor-consumidor) · **Siguiente:** [09 · Head First](/ApuntesPSP/03-sincronizacion-entre-hilos/09-head-first)