---
title: 08 — Hilos en la práctica
description: Be the code, el ring Hilo vs Proceso y Aprieta el lápiz ✏️
---

<p><small>Be the code, el ring Hilo vs Proceso y Aprieta el lápiz ✏️</small></p>

> 🗺️ **Estás en:** 🔀 **U02 · Hilos Fundamentos** → 08 · Hilos en la práctica

---

## 📬 La idea en una frase

> Este punto es el taller de la unidad: seguimos la ejecución de varios hilos paso a paso, dirimimos la pelea Hilo vs Proceso y resolvemos los ejercicios de Aprieta el lápiz.

Ya sabes crear hilos, pasarles datos, convertirlos en daemons, temporizarlos y entender el GIL y los estados. Ahora toca juntarlo todo como lo harás en el examen: leyendo código multihilo y prediciendo su salida.

---

## 🧍 Be the code, my friend — El hilo viajero

> "Sé el código y recorre su ejecución paso a paso. Dos hilos, dos viajeros."

```python
import threading, time

def viajero(nombre, paradas):
    for i in range(paradas):
        print(f"{nombre} 🚶 está en la parada {i+1}")
        time.sleep(0.5)
    print(f"{nombre} 🏁 ha llegado a su destino")

h1 = threading.Thread(target=viajero, args=("Ana", 3))
h2 = threading.Thread(target=viajero, args=("Bob", 2))

h1.start()
h2.start()
h1.join()
h2.join()
```

**Traza (ejecución real):**
```
▶️ Ana (h1) empieza. Dice: "Ana 🚶 está en la parada 1"
▶️ Bob (h2) empieza. Dice: "Bob 🚶 está en la parada 1"
⏳ Ana duerme 0.5s
⏳ Bob duerme 0.5s
▶️ Bob se despierta. Dice: "Bob 🚶 está en la parada 2"
▶️ Ana se despierta. Dice: "Ana 🚶 está en la parada 2"
⏳ Ana duerme 0.5s
⏳ Bob duerme 0.5s
▶️ Bob se despierta. Dice: "Bob 🏁 ha llegado a su destino"
▶️ Ana se despierta. Dice: "Ana 🚶 está en la parada 3"
⏳ Ana duerme 0.5s
▶️ Ana se despierta. Dice: "Ana 🏁 ha llegado a su destino"
```

Fíjate en los detalles que te piden en los exámenes:

- Ambos hilos **arrancan a la vez**: Ana y Bob dicen su parada 1 casi al mismo tiempo.
- Mientras Ana duerme sus 0.5s (estado **BLOQUEADO** del [punto 7](/ApuntesPSP/02-hilos-fundamentos/07-estados-del-hilo)), Bob aprovecha y avanza.
- Bob hace solo 2 paradas; Ana hace 3. **Bob llega antes** a su destino.
- Los `join()` del final garantizan que el mensaje del principal (si lo hubiera) esperaría a ambos.

> Fíjate cómo los `print` se entremezclan. El orden exacto lo decide el scheduler del sistema operativo. **No hay garantía de orden.**

---

## 🥊 El ring de los conceptos — Hilo vs Proceso

**Hilo**: — Soy ligero, veloz y nacido para compartir. Nací en milisegundos y trabajo en la misma memoria que mis hermanos.

**Proceso**: — ¿Y dónde está tu privacidad? Yo tengo mi propia memoria aislada. Si tú cometes un error, te llevas por delante a todo el proceso. A mí nadie me toca.

**Hilo**: — Pero compartir es mi superpoder: me comunico con variables globales al instante, sin pipes ni sockets. ¿Cuánto tardas tú en enviar un dato a tu vecino?

**Proceso**: — Pipes, sockets, archivos… más lento, sí. Pero creo cien procesos y cada uno trabaja con su propio GIL a toda CPU. Tú y tus hermanos os peleáis por un solo GIL.

**Hilo**: — ¡El GIL es para calcular! Yo brillo esperando: descargas, lecturas de disco, clientes de red. Mientras uno espera, los demás avanzan.

**Proceso**: — Al final, cada uno a su oficio. Yo para aislamiento y CPU de verdad; tú para esperas y servicios ligeros.

> **Moraleja**: Usa **procesos** cuando necesites aislamiento o paralelismo real de CPU (`multiprocessing`). Usa **hilos** cuando tu tarea es de espera (I/O) o quieres algo ligero y que comparta memoria. La tabla completa la tienes en el [punto 1](/ApuntesPSP/02-hilos-fundamentos/01-de-proceso-a-hilo).

---

## ✏️ Aprieta el lápiz

Resuelve estos seis ejercicios con lo aprendido en la unidad. Cuando los tengas (o te rindas), despliega las soluciones.

1. **Carrera de mensajes**: Crea 5 hilos que impriman su nombre 10 veces. Observa cómo se entremezclan.
2. **Temporizador daemon**: Crea un hilo daemon que imprima "tic" cada segundo. El programa principal espera 5 segundos y termina.
3. **Timer despertador**: Crea un Timer que imprima "¡Despierta!" a los 3 segundos.
4. **GIL test**: Compara el tiempo de 4 hilos vs 1 hilo haciendo una tarea CPU-bound (contar hasta 50M). Verifica que tardan lo mismo.
5. **I/O vs CPU**: Crea dos versiones de descarga simulada (sleep 2s) — una con 1 hilo y otra con 4. Mide la diferencia.
6. **Pool Puzzle**: Ordena las líneas para crear un programa que lance 2 hilos que saluden 3 veces cada uno.

<details>
<summary>✅ Soluciones</summary>

**1. Carrera de mensajes**

```python
import threading

def mensaje(nombre):
    for i in range(1, 11):
        print(f"{nombre}: mensaje {i}")

hilos = [threading.Thread(target=mensaje, args=(f"hilo-{n}",))
         for n in range(1, 6)]

for h in hilos:
    h.start()
for h in hilos:
    h.join()
```

Los 5 hilos corren a la vez y sus mensajes se entremezclan sin orden predecible: el scheduler decide.

**2. Temporizador daemon**

```python
import threading, time

def tic():
    while True:
        print("tic")
        time.sleep(1)

h = threading.Thread(target=tic, daemon=True)
h.start()

time.sleep(5)
print("Programa principal terminando...")
```

El daemon imprime "tic" cada segundo y se mata solo cuando el programa principal termina a los 5 segundos.

**3. Timer despertador**

```python
import threading

def despierta():
    print("¡Despierta!")

t = threading.Timer(3.0, despierta)
t.start()
```

A los 3 segundos el Timer dispara `despierta()` una sola vez.

**4. GIL test**

```python
import threading, time

def contar():
    total = 0
    for i in range(50_000_000):
        total += i

inicio = time.time()
contar()
print(f"1 hilo CPU: {time.time() - inicio:.2f}s")

inicio = time.time()
hilos = [threading.Thread(target=contar) for _ in range(4)]
for h in hilos: h.start()
for h in hilos: h.join()
print(f"4 hilos CPU: {time.time() - inicio:.2f}s")
# → tiempo parecido: el GIL solo deja ejecutar a uno
```

El resultado confirma el [punto 6](/ApuntesPSP/02-hilos-fundamentos/06-gil): 4 hilos CPU-bound tardan lo mismo que 1, porque el GIL solo deja ejecutar a uno.

**5. I/O vs CPU**

```python
import threading, time

def esperar():
    time.sleep(2)  # Simula una descarga

# 1 hilo: las 4 descargas en serie
inicio = time.time()
for _ in range(4):
    esperar()
print(f"1 hilo I/O: {time.time() - inicio:.2f}s")  # → ~8s

# 4 hilos: las 4 descargas en paralelo
inicio = time.time()
hilos = [threading.Thread(target=esperar) for _ in range(4)]
for h in hilos: h.start()
for h in hilos: h.join()
print(f"4 hilos I/O: {time.time() - inicio:.2f}s")  # → ~2s
```

Con 1 hilo, 4 × 2s = ~8s. Con 4 hilos, las esperas se solapan y se acaba en ~2s. Ahí los hilos sí aceleran.

**6. Pool Puzzle**

Las líneas desordenadas:

```
A)  h1.join()
B)  h2.start()
C)  def saludar(nombre):
D)      for i in range(3):
E)          print(f"{nombre} saluda {i+1} veces")
F)  import threading
G)  h1 = threading.Thread(target=saludar, args=("Ana",))
H)  h2 = threading.Thread(target=saludar, args=("Bob",))
I)  h1.start()
J)  h2.join()
```

Orden correcto: **F, C, D, E, G, H, I, B, J, A**

```python
import threading

def saludar(nombre):
    for i in range(3):
        print(f"{nombre} saluda {i+1} veces")

h1 = threading.Thread(target=saludar, args=("Ana",))
h2 = threading.Thread(target=saludar, args=("Bob",))

h1.start()
h2.start()
h2.join()
h1.join()
```

Cada hilo saluda 3 veces; los mensajes se entremezclan sin orden garantizado, y los `join()` finales aseguran que ambos terminen antes de acabar el programa.

</details>

---

## 🧠 Mini-chequeo

1. En la traza del viajero, ¿por qué Bob llega antes que Ana a su destino?
2. ¿Qué garantizan los `join()` del final del programa de los viajeros?
3. En el Pool Puzzle, ¿por qué el `import threading` debe ir al principio del orden?

<details>
<summary>🔄 Respuestas</summary>

1. Porque Bob solo tiene **2 paradas** y Ana 3: cada parada dura 0.5s, así que Bob termina su ruta antes, aunque los dos empezaron a la vez.
2. Que el programa principal **espera a los dos hilos** antes de continuar/terminar: cuando llegan los `join()`, ambos viajeros han acabado su recorrido.
3. Porque Python necesita tener **importado el módulo** antes de usar `threading.Thread`. Sin el import, el código falla con `NameError`.

</details>

---

## ✅ Resumen en 3 frases

- La traza de varios hilos se **entremezcla** y su orden lo decide el scheduler: no hay garantía de orden, solo de que con `join()` se esperan.
- En el ring, **hilos** para tareas ligeras y de espera que comparten memoria; **procesos** para aislamiento y CPU de verdad.
- El Pool Puzzle y los ejercicios son exactamente el formato de examen: ordenar líneas y predecir salidas.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| Traza | Recorrido paso a paso de la ejecución del programa |
| Intercalado | Alternancia de mensajes de varios hilos sin orden fijo |
| Scheduler | Decide qué hilo ejecuta en cada momento |
| Pool Puzzle | Ejercicio de ordenar líneas de código desordenadas |
| join() | Espera a que el hilo termine antes de continuar |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/02-hilos-fundamentos) · **Anterior:** [07 · Estados del hilo](/ApuntesPSP/02-hilos-fundamentos/07-estados-del-hilo) · **Siguiente:** [09 · Head First](/ApuntesPSP/02-hilos-fundamentos/09-head-first)