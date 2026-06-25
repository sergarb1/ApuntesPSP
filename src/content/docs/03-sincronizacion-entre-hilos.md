---
title: "TEMA 03 — Sincronización entre Hilos"
nav_order: 03
---

## TEMA 03 — Sincronización entre Hilos (RA2)

> "Compartir memoria entre hilos sin sincronización es como compartir un cepillo de dientes. Alguien va a salir perdiendo."

---

## Índice

1. [El problema de la condición de carrera](#el-problema-de-la-condición-de-carrera)
2. [Lock — exclusión mutua](#lock--exclusión-mutua)
3. [Be the code, my friend, my friend — Contador con y sin Lock](#be-the-code-my-friend-my-friend--contador-con-y-sin-lock)
4. [RLock — Lock reentrante](#rlock--lock-reentrante)
5. [Semaphore — acceso limitado](#semaphore--acceso-limitado)
6. [Barrier — sincronización de grupo](#barrier--sincronización-de-grupo)
7. [Condition — productor-consumidor](#condition--productor-consumidor)
8. [🥊 El ring de los conceptos — Lock vs Semáforo vs Barrera](#el-ring-de-los-conceptos--lock-vs-semáforo-vs-barrera)
9. [Be the code, my friend, my friend — Pool Puzzle de sincronización](#be-the-code-my-friend-my-friend--pool-puzzle-de-sincronización)
10. [Preguntas tontas — Sincronización](#preguntas-tontas--sincronización)
11. [✏️ Aprieta el lápiz](#✏-aprieta-el-lápiz)
12. [RAs cubiertos y criterios de evaluación](#ras-cubiertos-y-criterios-de-evaluación)

---

## El problema de la condición de carrera

Dos hilos que incrementan una variable compartida sin sincronización:

```python
import threading

contador = 0

def incrementar():
    global contador
    for _ in range(100_000):
        contador += 1  # ⚠️ Esto NO es atómico

hilos = [threading.Thread(target=incrementar) for _ in range(4)]
for h in hilos: h.start()
for h in hilos: h.join()

print(f"Esperado: 400.000 | Obtenido: {contador}")
# → 287.341, 312.045, 198.723... ¡nunca 400.000!
```

**¿Por qué?** `contador += 1` en realidad hace 3 operaciones:
1. Leer `contador` de memoria
2. Sumar 1
3. Escribir el resultado

Si dos hilos leen el mismo valor antes de que ninguno haya escrito, ambos escriben el mismo resultado y se pierde un incremento.

> Esto es una **condición de carrera** (race condition). Para evitarlo, necesitamos **sincronización**.

---

## Lock — exclusión mutua

`Lock` garantiza que solo un hilo entre en una sección crítica a la vez.

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

### Métodos de Lock

| Método | Qué hace |
|--------|----------|
| `lock.acquire()` | Bloquea. Si otro hilo lo tiene, espera |
| `lock.release()` | Libera. Otro hilo puede entrar |
| `lock.locked()` | Devuelve `True` si está bloqueado |

> **Siempre usa `with lock:`**. Si usas `acquire()` manual y olvidas `release()`, creas un **deadlock**.

---

## Be the code, my friend, my friend — Contador con y sin Lock

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

---

## RLock — Lock reentrante

Un Lock normal no permite que el mismo hilo lo adquiera dos veces. Un `RLock` sí.

```python
import threading

# Lock normal — DEADLOCK si el mismo hilo intenta adquirirlo dos veces
lock = threading.Lock()
lock.acquire()
lock.acquire()  # ⚠️ El hilo se espera a sí mismo → DEADLOCK

# RLock — el mismo hilo puede adquirirlo varias veces
rlock = threading.RLock()
rlock.acquire()  # ok
rlock.acquire()  # ok (mismo hilo)
rlock.release()
rlock.release()
```

Útil en funciones que se llaman entre sí recursivamente.

---

## Semaphore — acceso limitado

Un `Semaphore` permite que hasta **N hilos** accedan al recurso a la vez.

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

> Útil para: limitar conexiones a una BD, descargas simultáneas, acceso a una API con rate limit.

---

## Barrier — sincronización de grupo

Una `Barrier` obliga a todos los hilos a esperar hasta que el último llegue. Entonces todos continúan a la vez.

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

> Los 3 salen exactamente a la vez. Barrier es perfecto para sincronizar **fases** de un trabajo en paralelo.

---

## Condition — productor-consumidor

`Condition` permite que un hilo espere hasta que otro le notifique que algo ocurrió.

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

| Método de Condition | Qué hace |
|---------------------|----------|
| `wait()` | Libera el lock y espera una notificación |
| `notify()` | Despierta a un hilo que está esperando |
| `notify_all()` | Despierta a todos los hilos que esperan |

> Siempre usa `while` en lugar de `if` para comprobar la condición después de `wait()` — pueden darse **falsas activaciones** (spurious wakeups).

---

## 🥊 El ring de los conceptos — Lock vs Semáforo vs Barrera

**Lock**: "Soy el portero. Solo dejo pasar a **uno cada vez**. Los demás esperan fuera."

**Semáforo(3)**: "Soy el guardia de una sala con **3 sillas**. Cuando una se libera, entra el siguiente."

**Barrera(3)**: "Soy el juez de salida. **No permito que nadie corra** hasta que los 3 estén en la línea."

**Lock**: "Para exclusión mutua, no hay mejor que yo. Dos hilos no pueden tocarme el recurso a la vez."

**Semáforo**: "Para **limitar acceso concurrente**. Como un aforo máximo en un local."

**Barrera**: "Para sincronizar **fases de un trabajo**. Todos completan la fase 1, luego todos empiezan la fase 2."

---

## Be the code, my friend, my friend — Pool Puzzle de sincronización

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
<summary><strong>Solución</strong></summary>

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
</details>

---

## Preguntas tontas — Sincronización

**❓ ¿Qué es un deadlock?**
Dos o más hilos esperándose mutuamente para siempre. Ejemplo: Hilo-A tiene Lock-1 y espera Lock-2; Hilo-B tiene Lock-2 y espera Lock-1.

**❓ ¿Cómo evito deadlocks?**
1. Adquirir los locks siempre en el **mismo orden**
2. Usar `with lock:` (nunca olvidar `release()`)
3. Usar `RLock` si el mismo hilo necesita adquirirlo varias veces

**❓ ¿Puedo tener más de un Lock?**
Sí. Pero cada Lock añade riesgo de deadlock. Sé disciplinado con el orden de adquisición.

**❓ ¿Qué es más rápido, Lock o Semaphore?**
Lock es más simple. Semaphore tiene contador interno. Para exclusión mutua, Lock gana en velocidad.

**❓ ¿Y si necesito sincronización entre procesos en vez de entre hilos?**
Usa `multiprocessing.Lock`, `multiprocessing.Semaphore`, etc. Son equivalentes pero para procesos.

---

## ✏️ Aprieta el lápiz

1. **Condición de carrera**: Crea 2 hilos que incrementen un contador 1M veces cada uno. Compara con y sin Lock.
2. **Semáforo descargas**: Crea 10 hilos que simulen descargas (sleep 2s) usando un Semáforo(3). Mide el tiempo total.
3. **Barrera de fases**: Crea 4 hilos que trabajen en 2 fases. La fase 2 no empieza hasta que todos terminan la fase 1.
4. **Productor-Consumidor**: 1 productor crea números aleatorios cada 0.5s; 2 consumidores los procesan. Usa Condition.
5. **Deadlock provocado**: Crea intencionadamente un deadlock con 2 hilos y 2 locks. Luego arréglalo.

---

## RAs cubiertos y criterios de evaluación

### RA2 — Hilos (sincronización)

| Criterio | Descripción | Cubierto |
|----------|-------------|----------|
| RA2c | Sincroniza hilos con Lock | ✅ |
| RA2d | Usa semáforos para acceso controlado | ✅ |
| RA2g | Evita condiciones de carrera | ✅ |
| (RA2a-b, RA2e-f, RA2h) | Cubiertos en el TEMA 02 | ← |
