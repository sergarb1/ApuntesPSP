---
title: "TEMA 02 — Hilos Fundamentos"
nav_order: 02
---

## TEMA 02 — Hilos Fundamentos (RA2)

> "Un hilo es como una tarea dentro de una casa. Todos los hilos comparten la misma casa (memoria), pero cada uno hace su propia cosa."

---

## Índice

1. [¿Qué es un hilo?](#qué-es-un-hilo)
2. [Hilos vs Procesos](#hilos-vs-procesos)
3. [Crear y lanzar hilos](#crear-y-lanzar-hilos)
4. [join() — esperar a que termine](#join--esperar-a-que-termine)
5. [Hilos daemon](#hilos-daemon)
6. [Timer — ejecutar algo después de un tiempo](#timer--ejecutar-algo-después-de-un-tiempo)
7. [El GIL y sus consecuencias](#el-gil-y-sus-consecuencias)
8. [Estados de un hilo](#estados-de-un-hilo)
9. [Be the code, my friend, my friend — El hilo viajero](#be-the-code-my-friend-my-friend--el-hilo-viajero)
10. [Be the code, my friend, my friend — daemon en acción](#be-the-code-my-friend-my-friend--daemon-en-acción)
11. [🥊 El ring de los conceptos — Hilo normal vs Hilo daemon](#el-ring-de-los-conceptos--hilo-normal-vs-hilo-daemon)
12. [Preguntas tontas — Hilos](#preguntas-tontas--hilos)
13. [✏️ Aprieta el lápiz](#✏-aprieta-el-lápiz)
14. [RAs cubiertos y criterios de evaluación](#ras-cubiertos-y-criterios-de-evaluación)

---

## ¿Qué es un hilo?

Un **hilo** (thread) es la unidad más pequeña de ejecución. Un proceso puede tener múltiples hilos, todos compartiendo la misma memoria.

```python
import threading

def saludar():
    print("¡Hola desde un hilo!")

hilo = threading.Thread(target=saludar)
hilo.start()
hilo.join()
```

### Características

- Comparten memoria con otros hilos del mismo proceso
- Son más ligeros que los procesos (menos recursos al crearlos)
- Se comunican mediante variables compartidas (con cuidado)
- En Python, limitados por el **GIL** para código CPU-bound

---

## Hilos vs Procesos

| Característica | Proceso | Hilo |
|----------------|---------|------|
| Memoria | Aislada (cada uno la suya) | Compartida (todos en la misma) |
| Creación | Lenta (el SO debe copiar recursos) | Rápida |
| Comunicación | Pipes, sockets, archivos | Variables globales |
| Aislamiento | Alto (uno no afecta a otro) | Bajo (uno puede romper a todos) |
| Coste | Alto | Bajo |

> "Los procesos son como casas separadas. Los hilos son como habitaciones de la misma casa."

---

## Crear y lanzar hilos

```python
import threading

def trabajar(nombre, tarea):
    print(f"{nombre} empezando: {tarea}")
    # ... trabajo ...
    print(f"{nombre} terminó: {tarea}")

# Crear hilos con nombre
hilo_a = threading.Thread(target=trabajar, args=("Ana", "lavar platos"))
hilo_b = threading.Thread(target=trabajar, args=("Bob", "fregar suelo"))

# Lanzarlos
hilo_a.start()
hilo_b.start()

# Esperar
hilo_a.join()
hilo_b.join()
```

### Propiedades de un hilo

```python
hilo = threading.Thread(target=fn, name="hilo-1")
hilo.start()

print(hilo.name)        # "hilo-1"
print(hilo.ident)       # ID numérico
print(hilo.daemon)      # True/False
print(hilo.is_alive())   # True si sigue ejecutándose
```

---

## join() — esperar a que termine

`join()` hace que el programa principal espere hasta que el hilo termine.

```python
import threading, time

def trabajador(segundos):
    print(f"Trabajando durante {segundos}s...")
    time.sleep(segundos)
    print("Terminado")

h = threading.Thread(target=trabajador, args=(3,))
h.start()

print("Esperando al hilo...")
h.join()  # Espera hasta que termine
print("El hilo terminó, continuamos")
```

**Salida**:
```
Trabajando durante 3s...
Esperando al hilo...
Terminado
El hilo terminó, continuamos
```

> Sin `join()`, el programa principal seguiría y posiblemente terminaría antes que el hilo.

---

## Hilos daemon

Un hilo **daemon** se ejecuta en segundo plano y **se mata automáticamente** cuando el programa principal termina.

```python
import threading, time

def reloj():
    """Imprime la hora cada segundo (por siempre)"""
    while True:
        print(f"⏰ {time.strftime('%H:%M:%S')}")
        time.sleep(1)

hilo_reloj = threading.Thread(target=reloj, daemon=True)
hilo_reloj.start()

time.sleep(3)  # El programa principal dura 3 segundos
print("Programa principal terminando...")
# Al terminar, el hilo daemon se mata solo
```

**Salida**:
```
⏰ 14:35:22
⏰ 14:35:23
⏰ 14:35:24
Programa principal terminando...
```

> Los hilos **no daemon** impiden que el programa termine. Los daemon se sacrifican para que el programa pueda salir.

| Tipo | Comportamiento |
|------|----------------|
| `daemon=False` (defecto) | El programa espera a que termine |
| `daemon=True` | El programa lo mata al salir |

---

## Timer — ejecutar algo después de un tiempo

```python
import threading

def aviso():
    print("⏰ ¡Tiempo cumplido!")

temporizador = threading.Timer(5.0, aviso)
temporizador.start()
print("Timer iniciado, 5 segundos...")

# temporizador.cancel()  # Si queremos cancelar
```

> `Timer` ejecuta la función **una sola vez** después del retardo. No se repite.

---

## El GIL y sus consecuencias

**GIL** = Global Interpreter Lock. Es un candado interno de CPython que evita que dos hilos ejecuten bytecode Python a la vez.

### ¿Qué implica en la práctica?

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

| Tipo de tarea | ¿Hilos ayudan? | Motivo |
|---------------|----------------|--------|
| **CPU-bound** (calcular, procesar) | ❌ No | El GIL solo deja ejecutar a uno |
| **I/O-bound** (esperar red, disco) | ✅ Sí | El GIL se libera durante la espera |

> Para CPU-bound en Python, usa `multiprocessing` (varios procesos, cada uno con su propio GIL).

---

## Estados de un hilo

```
  ┌──────────────┐
  │    NUEVO     │  ← Thread creado, no start()
  └──────┬───────┘
         ↓ start()
  ┌──────────────┐
  │  EJECUTABLE  │  ← Puede ejecutar cuando el scheduler quiera
  └──────┬───────┘
         ↓
  ┌──────────────┐     ┌──────────────┐
  │  EJECUCIÓN   │←───→│  BLOQUEADO   │
  └──────┬───────┘     └──────────────┘
         ↓               (sleep, I/O, lock)
  ┌──────────────┐
  │  TERMINADO   │  ← run() terminó
  └──────────────┘
```

| Estado | Significado |
|--------|-------------|
| **NUEVO** | El objeto Thread existe pero no se ha llamado a `start()` |
| **EJECUTABLE** | `start()` llamado. Puede ejecutar en cualquier momento |
| **BLOQUEADO** | Esperando (sleep, I/O, un lock) |
| **TERMINADO** | El método `run()` ha terminado |

![](/diagrams/hilos-estados.svg)

---

## Be the code, my friend, my friend — El hilo viajero

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

**Traza (ejecución real)**:
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

> Fíjate cómo los `print` se entremezclan. El orden exacto lo decide el scheduler del sistema operativo. **No hay garantía de orden.**

---

## Be the code, my friend, my friend — daemon en acción

```python
import threading, time

def trabajador():
    for i in range(5):
        print(f"Trabajando... ({i+1}/5)")
        time.sleep(0.5)
    print("Trabajador terminó")

# SIN daemon — el programa espera
h1 = threading.Thread(target=trabajador)
h1.start()
h1.join()
print("Programa terminó (después del hilo)")
```

```
Trabajando... (1/5)
Trabajando... (2/5)
Trabajando... (3/5)
Trabajando... (4/5)
Trabajando... (5/5)
Trabajador terminó
Programa terminó (después del hilo)
```

```python
# CON daemon — el hilo se mata al salir
h2 = threading.Thread(target=trabajador, daemon=True)
h2.start()
time.sleep(1.2)
print("Programa terminó (el hilo daemon muere conmigo)")
```

```
Trabajando... (1/5)
Trabajando... (2/5)
Trabajando... (3/5)
Programa terminó (el hilo daemon muere conmigo)
```

> El daemon solo llegó a la iteración 3. El programa principal terminó y lo mató.

---

## 🥊 El ring de los conceptos — Hilo normal vs Hilo daemon

**Hilo Normal**: — Yo soy un hilo de verdad. El programa principal espera a que termine lo que tengo que hacer. Tengo responsabilidad.

**Hilo Daemon**: — ¡Qué aburrido! Yo soy libre. Mi única misión es servir en segundo plano. Cuando el programa principal termina, yo me muero con él, sin dramas.

**Hilo Normal**: — ¿Y si estás en medio de algo importante cuando el main termina? Pierdes datos, dejas cosas a medias...

**Hilo Daemon**: — Para eso existen los daemon bien hechos: tareas de monitoreo, limpieza, heartbeat... cosas que da igual si se cortan. Si quieres garantía de finalización, usas un hilo normal con `join()`.

**Hilo Normal**: — Cierto. Al final, cada uno tiene su sitio. Yo para tareas críticas, tú para servicios auxiliares.

> **Moraleja**: Usa hilos **daemon** para servicios de fondo prescindibles. Usa hilos **normales** con `join()` para tareas que deben completarse sí o sí.

---

## Preguntas tontas — Hilos

**❓ ¿Un hilo puede crear otro hilo?**
Sí. Un hilo puede lanzar otros hilos sin problema.

**❓ ¿Cuántos hilos puedo crear?**
Hay límite práctico. En Windows, unos pocos miles. Cada hilo consume ~1MB de memoria virtual por su pila.

**❓ ¿Puedo matar un hilo desde fuera?**
No limpiamente. No hay `hilo.kill()`. La forma correcta es usar una variable bandera que el hilo compruebe periódicamente.

**❓ ¿Qué pasa si no llamo a `join()`?**
El hilo se ejecuta igual. Pero el programa principal no espera. Si es no-daemon, el programa no terminará hasta que el hilo termine.

**❓ ¿`sleep(0)` sirve para algo?**
Sí, cede la CPU voluntariamente para que otro hilo pueda ejecutar. Es una "buena práctica" en hilos cooperativos.

**❓ ¿Los hilos tienen prioridad?**
En Python, no hay prioridades nativas. El scheduler del SO decide. Puedes simular prioridades con lógica condicional, pero no es real.

---

## ✏️ Aprieta el lápiz

1. **Carrera de mensajes**: Crea 5 hilos que impriman su nombre 10 veces. Observa cómo se entremezclan.
2. **Temporizador daemon**: Crea un hilo daemon que imprima "tic" cada segundo. El programa principal espera 5 segundos y termina.
3. **Timer despertador**: Crea un Timer que imprima "¡Despierta!" a los 3 segundos.
4. **GIL test**: Compara el tiempo de 4 hilos vs 1 hilo haciendo una tarea CPU-bound (contar hasta 50M). Verifica que tardan lo mismo.
5. **I/O vs CPU**: Crea dos versiones de descarga simulada (sleep 2s) — una con 1 hilo y otra con 4. Mide la diferencia.
6. **Pool Puzzle**: Ordena las líneas para crear un programa que lance 2 hilos que saluden 3 veces cada uno.

---

## RAs cubiertos y criterios de evaluación

### RA2 — Hilos (parcial)

| Criterio | Descripción | Cubierto |
|----------|-------------|----------|
| RA2a | Identifica la estructura de un hilo | ✅ |
| RA2b | Crea y lanza hilos con threading | ✅ |
| RA2e | Implementa esperas con join() y sleep() | ✅ |
| RA2f | Gestiona hilos daemon | ✅ |
| RA2h | Conoce el GIL y sus limitaciones | ✅ |

> Los criterios RA2c (Lock), RA2d (semáforos) y RA2g (condiciones de carrera) se cubren en el **TEMA 03 — Sincronización entre Hilos**.
