---
title: 02 — Tu primer hilo
description: Crea, lanza y espera tu primer hilo con start() y join() 🚀
---

<p><small>Crea, lanza y espera tu primer hilo con start() y join() 🚀</small></p>

> 🗺️ **Estás en:** 🔀 **U02 · Hilos Fundamentos** → 02 · Tu primer hilo

---

## 📬 La idea en una frase

> Crear un hilo es escribir `threading.Thread(target=funcion)`, lanzarlo con `.start()` y esperarlo con `.join()`.

Tres líneas. Eso es todo lo que necesitas para que una función se ejecute en paralelo con el resto del programa. La gracia (y la complicación) está en *cuándo* se ejecuta cada pieza.

---

## 🧵 Crear y lanzar un hilo

```python
import threading

def saludar():
    print("¡Hola desde un hilo!")

hilo = threading.Thread(target=saludar)
hilo.start()
hilo.join()
```

**Salida:**
```
¡Hola desde un hilo!
```

Desglose de las tres líneas clave:

| Línea | Qué hace |
|---|---|
| `threading.Thread(target=saludar)` | **Crea** el hilo. En este momento el hilo existe pero no hace nada (estado NUEVO, lo verás en el [punto 7](/ApuntesPSP/02-hilos-fundamentos/07-estados-del-hilo)). |
| `hilo.start()` | **Lanza** el hilo: pasa a ejecutable y el sistema operativo decide cuándo ejecutar `saludar()`. |
| `hilo.join()` | **Espera** a que el hilo termine. Sin ella, el programa principal seguiría su camino y podría terminar antes que el hilo. |

> ⚠️ Un error típico de principiante: llamar a `saludar()` directamente (con paréntesis) en vez de pasar la función sin ellos. `target=saludar` pasa la *referencia*; `target=saludar()` ejecuta la función antes de crear el hilo y no lanza nada.

---

## 👑 El hilo principal vs los hilos secundarios

Cuando ejecutas `python programa.py`, tu código se ejecuta dentro de un hilo: el **hilo principal** (main thread). Todo lo que lanzas con `Thread()` son **hilos secundarios** que viven dentro del mismo proceso.

```
   PROGRAMA (proceso)
   ┌─────────────────────────────────┐
   │  🧍 Hilo principal (main)       │
   │    │ lanza                     │
   │    ├──▶ 🧑 hilo A (secundario) │
   │    └──▶ 🧑 hilo B (secundario) │
   └─────────────────────────────────┘
```

El hilo principal **no espera** a los secundarios por arte de magia: hay que decírselo con `join()`. Sin `join()`, el principal puede llegar al final de su código y el programa terminará cuando termine… pero sin garantías sobre los secundarios.

---

## ⏳ join() — esperar a que termine

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

**Salida:**
```
Trabajando durante 3s...
Esperando al hilo...
Terminado
El hilo terminó, continuamos
```

Fíjate en el orden: el `print("Esperando al hilo...")` del principal aparece *mientras* el hilo sigue dormido. El principal llega a `join()`, se queda bloqueado esperando, y recién cuando el hilo termina sigue con su última línea.

> Sin `join()`, el programa principal seguiría y posiblemente terminaría antes que el hilo. Con `join()`, tienes la garantía de que el hilo ha acabado cuando tú continúas.

---

## 🧰 Propiedades de un hilo

Un hilo no es solo una función en ejecución: es un objeto con información útil.

```python
import threading

def fn():
    print(f"Ejecutando {threading.current_thread().name}")

hilo = threading.Thread(target=fn, name="hilo-1")
hilo.start()
hilo.join()

print(hilo.name)        # "hilo-1"
print(hilo.ident)       # ID numérico del hilo
print(hilo.daemon)      # True/False (lo verás en el punto 4)
print(hilo.is_alive())  # True si sigue ejecutándose
```

| Propiedad | Qué devuelve |
|---|---|
| `.name` | El nombre del hilo (por defecto algo como "Thread-1") |
| `.ident` | Un ID numérico único mientras el hilo vive |
| `.daemon` | `True` si es un hilo daemon, `False` si no |
| `.is_alive()` | `True` si el hilo aún se está ejecutando |

> 💡 Desde dentro del hilo puedes obtener tu propia información con `threading.current_thread()`, que devuelve el objeto Thread actual.

---

## 🧠 Mini-chequeo

1. ¿Qué pasa si creas un hilo y no llamas a `start()`?
2. ¿Qué pasa si llamas a `start()` dos veces sobre el mismo hilo?
3. ¿Para qué sirve `join()`? ¿Qué riesgo evitas?

<details>
<summary>🔄 Respuestas</summary>

1. El hilo existe pero **no hace nada**: sin `start()` la función nunca se ejecuta. Es solo un objeto esperando en estado NUEVO.
2. **Error** (`RuntimeError: threads can only be started once`). Un hilo solo puede lanzarse una vez; si quieres repetir el trabajo, crea otro Thread.
3. `join()` hace que el programa principal **espere** a que el hilo termine, evitando que el programa acabe antes que sus hilos y sin saber qué ha pasado.

</details>

---

## ✅ Resumen en 3 frases

- Crear y lanzar un hilo es `Thread(target=fn)`, `.start()` y `.join()`: crear, lanzar, esperar.
- El **hilo principal** no espera a los secundarios por defecto; `join()` fuerza esa espera.
- Cada hilo es un objeto con `.name`, `.ident`, `.daemon` e `.is_alive()` que te cuenta su estado.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| Hilo principal | El hilo que ejecuta `python programa.py`, el "main" |
| Hilo secundario | Un hilo lanzado desde otro con `Thread()` |
| start() | Lanza el hilo: de nuevo a ejecutable |
| join() | Bloquea el programa principal hasta que el hilo termina |
| is_alive() | Dice si el hilo todavía se está ejecutando |
| current_thread() | Devuelve el objeto Thread desde dentro del propio hilo |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/02-hilos-fundamentos) · **Anterior:** [01 · De proceso a hilo](/ApuntesPSP/02-hilos-fundamentos/01-de-proceso-a-hilo) · **Siguiente:** [03 · Hilos con argumentos](/ApuntesPSP/02-hilos-fundamentos/03-hilos-con-argumentos)