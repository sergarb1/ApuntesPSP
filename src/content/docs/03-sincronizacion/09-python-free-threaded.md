---
title: 09 — Python Free-Threaded (PEP 703)
description: "Python sin GIL: qué cambia, qué no y por qué el Lock sigue siendo el jefe 🔓"
---

<p><small>Python sin GIL: qué cambia, qué no y por qué el Lock sigue siendo el jefe 🔓</small></p>

> 🗺️ **Estás en:** 🔒 **UD 4 · Sincronización** → 09 · Python Free-Threaded

---

## 📬 La idea en una frase

> **Free-threaded** es un build de CPython **sin GIL**: los hilos ejecutan bytecode Python en paralelo de verdad en varios núcleos (PEP 703). Pero **no arregla las condiciones de carrera**: sin sincronización, `contador += 1` sigue perdiendo incrementos… y ahora se pierden con más facilidad.

Hasta ahora has aprendido la sincronización con el GIL puesto: ese candado global que "protegía" (y limitaba) a los hilos. Este punto mira qué pasa cuando ese candado desaparece: el modo sin GIL nació en Python 3.13, se consolidó en el 3.14 y desde el 3.15 se instala por defecto (junto al build tradicional). La respuesta corta: **el GIL no era tu amigo, pero sí era tu candado de seguridad invisible**; sin él, la sincronización es más necesaria que nunca.

---

## 🔓 Qué es el free-threaded (y por qué tardó 15 años)

El **GIL** ([UD 3 · punto 6](/ApuntesPSP/02-hilos-y-concurrencia/06-gil)) garantiza que un solo hilo ejecute bytecode Python en cada instante. Eso simplifica la memoria interna del intérprete, pero impide el paralelismo real de CPU entre hilos.

**PEP 703** (*Making the Global Interpreter Lock Optional in CPython*, aceptado en octubre de 2024) define cómo eliminarlo sin romper Python. La clave técnica es el **conteo de referencias sesgado** (*biased reference counting*): cada objeto lleva un pequeño candado interno y una cuenta de referencias "ligera" para el hilo que lo posee; así, la recolección de basura no necesita un candado global.

### Línea temporal

| Versión | Estado | Qué implica para ti |
|---|---|---|
| 3.13 (2025) | Fase I: **experimental** | Build opcional `python3.13t`; ~40 % más lento en monohilo |
| 3.14 (2025) | Fase II: **soportado** (PEP 779) | Se quita la etiqueta "experimental"; el rendimiento mejora |
| 3.15 (2026) | **Instalado por defecto** | Los instaladores oficiales lo incluyen activado (puedes desmarcarlo) |
| Futuro | Fase III: ¿build por defecto? | Aún sin decidir; el build con GIL seguirá existiendo un buen rato |

> ⚠️ **No confundas builds**: `python` (con GIL) y `python3.15t` (free-threaded) son **dos intérpretes distintos**, con sus propios `site-packages`. Un paquete instalado en uno no aparece en el otro.

---

## 🕵️ ¿Mi Python es free-threaded? (3 comprobaciones)

```python
import sys, sysconfig

print(sys.version)                                        # ¿"free-threading build"?
print(sys._is_gil_enabled())                              # False = sin GIL activo
print(sysconfig.get_config_var("Py_GIL_DISABLED"))        # 1 = build compatible
```

En la terminal basta con `python -VV`: si el intérprete es free-threaded, la versión lo dice. Y para forzar el modo a mano (solo en builds `t`):

```bash
PYTHON_GIL=0 python3.15t mi_programa.py   # o: python3.15t -X gil=0 mi_programa.py
```

Un detalle práctico: si importas una **extensión C** que aún no soporta free-threading (muchas librerías científicas lo están preparando), CPython **reactiva la GIL automáticamente** y avisa. Tu programa sigue siendo correcto, pero ya no hay paralelismo real.

---

## 🔬 Mira el bytecode: `contador += 1` bajo el capó

La condición de carrera del [punto 1](/ApuntesPSP/03-sincronizacion/01-condicion-de-carrera) sigue siendo el mejor laboratorio. Vamos a mirar qué instrucciones se esconden tras esa línea con el módulo `dis` (*disassemble*):

```python
import dis

contador = 0

def sumar():
    global contador
    contador += 1

dis.dis(sumar)
```

Salida (abreviada, Python 3.15):

```
  5           0 LOAD_GLOBAL              0 (contador)
              2 LOAD_CONST               1 (1)
              4 BINARY_OP                0 (+)
              6 STORE_GLOBAL             0 (contador)
```

Tres operaciones, como siempre:

| Instrucción | Qué hace | Fase |
|---|---|---|
| `LOAD_GLOBAL` | Lee `contador` de memoria | **Leer** |
| `BINARY_OP (+)` | Suma 1 | **Sumar** |
| `STORE_GLOBAL` | Escribe el resultado | **Escribir** |

**Con GIL:** el planificador solo puede interrumpir entre instrucciones, y en Python 3.13+ el intérprete casi nunca corta justo en medio de esta secuencia corta: por eso la demo clásica "casi nunca falla" y hay que forzarla con `sys.setswitchinterval(1e-6)`.

**Sin GIL:** dos hilos en dos núcleos ejecutan las tres instrucciones **a la vez, de verdad**. No hay quien los separe: la carrera no solo es posible, es **lo normal**.

---

## 🏃 demo_race_condition.py

El experimento completo, con comentarios en español, para ejecutarlo **con y sin GIL**:

```python
# demo_race_condition.py — condición de carrera con y sin GIL
import sys, threading

contador = 0

def sumar(c):
    return c + 1

def incrementar():
    global contador
    for _ in range(200_000):
        contador = sumar(contador)   # leer-sumar-escribir vía función

hilos = [threading.Thread(target=incrementar) for _ in range(4)]
for h in hilos:
    h.start()
for h in hilos:
    h.join()

print(f"GIL activa: {sys._is_gil_enabled()}")
print(f"Esperado: 800.000 | Obtenido: {contador}")
```

```bash
python demo_race_condition.py                 # build normal (con GIL)
PYTHON_GIL=0 python3.15t demo_race_condition.py   # build free-threaded
```

- **Con GIL** y sin trucos: en 3.13+ suele dar 800.000 (o se acerca mucho); añade `sys.setswitchinterval(1e-6)` y perderá incrementos a mares.
- **Sin GIL:** pierde incrementos casi siempre, sin necesidad de ningún truco. Y es un problema de **esta** secuencia de instrucciones, no del hilo que "llega tarde": al no haber candado global, leer y escribir se solapan en paralelo.

> 🧠 El free-threaded **no toca la semántica de Python**: `contador += 1` sigue siendo leer-sumar-escribir. Lo que quita es la protección *accidental* que daba el GIL al serializarlo todo.

---

## 🧵 Por qué Lock y queue.Queue siguen mandando

Esto es lo más importante del punto: **free-threaded no es "Python multicore sin preocupaciones"**.

1. **Las carreras de Python siguen siendo carreras.** El GIL solo *reducía* la ventana de la carrera; la eliminaba por completo cuando el planificador no cortaba la secuencia. Sin él, hay que cerrar la ventana a mano: `Lock`.
2. **Las estructuras nativas sí están protegidas.** `list`, `dict` y `set` usan candados internos: `lista.append(x)` o `d[k] = v` no rompen el intérprete. Pero **tus** operaciones compuestas (`if saldo > 100: saldo -= 100`) no lo están.
3. **`queue.Queue` gana enteros.** Implementado con `Lock` + `Condition` por dentro, es la forma canónica de pasar datos entre hilos… y ahora con paralelismo real de CPU. El patrón [productor-consumidor](/ApuntesPSP/03-sincronizacion/07-productor-consumidor) **no cambia ni una línea**.
4. **El rendimiento tiene trampa.** En monohilo el build free-threaded es más lento (el objetivo es ≤10 %; en 3.13 era ~40 %). Si tu programa es de red o disco, **la GIL no te frenaba**: `threading` normal es más rápido.

Lo que **sí** cambia: los trabajos CPU-bound con hilos dejan de necesitar `multiprocessing` en muchos casos… si los datos compartidos van protegidos con `Lock` o encerrados en una `queue.Queue`.

---

## 🗺️ Matriz de decisión (¿qué uso y cuándo?)

| Situación | ¿Con GIL? | Qué usar |
|---|---|---|
| Espera de red/disco (I/O-bound) | Da igual | `threading` o `asyncio` (el GIL se libera al esperar) |
| CPU-bound, datos compartidos | Siempre | Hilos + `Lock` / `queue.Queue` (con o sin GIL) |
| CPU-bound, sin datos compartidos | Sin GIL | Hilos directos: paralelismo real |
| CPU-bound, sin datos compartidos | Con GIL | `multiprocessing` (sigue siendo la salida) |
| Código monohilo al máximo | Con GIL | El build tradicional va más rápido |
| Extensión C sin adaptar | — | CPython reactiva la GIL solo (con aviso) |

**Regla de bolsillo:** el free-threaded cambia *de dónde sale el paralelismo*, no *las reglas de la sincronización*. Toda la unidad anterior sigue siendo de obligado cumplimiento.

---

## 🛠️ Actividades sencillas

### Actividad 1 — Identifica tu intérprete

Escribe un script que imprima `sys.version`, `sys._is_gil_enabled()` y `sysconfig.get_config_var("Py_GIL_DISABLED")`. Ejecútalo con `python` y, si lo tienes, con `python3.15t`. Anota las diferencias.

<details>
<summary>🔄 Ver solución</summary>

```python
import sys, sysconfig
print("Versión:", sys.version)
print("GIL activa:", sys._is_gil_enabled())
print("Build sin GIL:", sysconfig.get_config_var("Py_GIL_DISABLED"))
```

En el build normal: `Build sin GIL: None` y `GIL activa: True`. En `python3.15t`: `Build sin GIL: 1`; con `PYTHON_GIL=0`, `GIL activa: False`.
</details>

### Actividad 2 — Desnuda el `contador += 1`

Usa `dis.dis()` sobre una función que haga `contador += 1` con `global`. Identifica en la salida qué instrucción **lee**, cuál **suma** y cuál **escribe**. ¿Cuántas instrucciones hay en total?

<details>
<summary>🔄 Ver solución</summary>

Tres: `LOAD_GLOBAL` (leer), `BINARY_OP (+)` (sumar) y `STORE_GLOBAL` (escribir). Justo las tres fases de la condición de carrera del punto 1: si un hilo se cuela entre la lectura y la escritura, el incremento se pierde.
</details>

### Actividad 3 — Pon el Lock a prueba

Modifica `demo_race_condition.py` para que cada incremento pase por `with lock:`. Ejecútalo **con y sin GIL** (`PYTHON_GIL=0 python3.15t …`). ¿Los dos resultados son correctos ahora?

<details>
<summary>🔄 Ver solución</summary>

```python
lock = threading.Lock()

def incrementar():
    global contador
    for _ in range(200_000):
        with lock:
            contador = sumar(contador)
```

Los dos casos dan **800.000 exactos**: con GIL el lock es una red de seguridad ante las interrupciones del planificador; sin GIL es directamente **imprescindible**. Misma solución, distinta urgencia.
</details>

> 💪 **Extra:** cronometra las versiones con y sin lock (`time.time()`). ¿Notas el coste del lock con GIL? ¿Y sin él? En CPU-bound puro el lock serializa de todas formas: el paralelismo real aparece cuando el trabajo dentro del `with` es pequeño y el trabajo fuera, grande.

---

## 🧠 Mini-chequeo

1. ¿Quita el free-threaded la necesidad de usar `Lock`? ¿Por qué?
2. ¿Cómo compruebo en tres comandos si mi intérprete es free-threaded y si la GIL está activa?
3. ¿Qué instrucciones esconde `contador += 1` y por qué sin GIL la carrera es más probable?

<details>
<summary>🔄 Respuestas</summary>

1. **No, la aumenta.** El GIL serializaba el bytecode y reducía (sin eliminar) la ventana de la carrera; sin él, dos hilos ejecutan leer-sumar-escribir en paralelo de verdad. Las estructuras nativas llevan candados internos, pero tus operaciones compuestas siguen necesitando `Lock` o `queue.Queue`.
2. `python -VV` (la cabecera indica "free-threading build"), `sys._is_gil_enabled()` (`False` = sin GIL) y `sysconfig.get_config_var("Py_GIL_DISABLED")` (`1` = build compatible). En terminal: `PYTHON_GIL=0 python3.15t …` fuerza el modo.
3. `LOAD_GLOBAL`, `BINARY_OP (+)` y `STORE_GLOBAL` (leer, sumar, escribir). Sin GIL no hay serialización global que reduzca la ventana entre esas instrucciones, así que el solape es el comportamiento normal de dos núcleos trabajando a la vez.
</details>

---

## ✅ Resumen en 3 frases

- **Free-threaded** (PEP 703) es un build de CPython **sin GIL**: paralelismo real de CPU entre hilos, disponible desde 3.13, soportado desde 3.14 e instalado por defecto desde 3.15 (`python3.15t`).
- Quita el candado, no las reglas: `contador += 1` sigue siendo leer-sumar-escribir y **las condiciones de carrera empeoran** si no sincronizas.
- **Lock y queue.Queue siguen siendo obligatorios**; lo que cambia es que los hilos CPU-bound pueden paralelizarse sin caer en `multiprocessing`.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| Free-threaded | Build de CPython sin GIL (binario con sufijo `t`) |
| PEP 703 | La propuesta que hace opcional el GIL |
| Fases I / II / III | Experimental → soportado → build por defecto |
| Conteo de referencias sesgado | Candado ligero por objeto que sustituye al GIL |
| `sys._is_gil_enabled()` | Comprueba si la GIL está activa en este proceso |
| `PYTHON_GIL=0` | Variable para desactivar la GIL (solo en builds `t`) |
| Extensión C no adaptada | Módulo nativo que reactiva la GIL al importarlo |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/03-sincronizacion) · **Anterior:** [08 · Buenas prácticas](/ApuntesPSP/03-sincronizacion/08-buenas-practicas) · **Siguiente:** [10 · Cierre](/ApuntesPSP/03-sincronizacion/10-cierre)
