---
title: "TEMA 01 — Procesos y Subprocess"
nav_order: 01
---

## TEMA 01 — Procesos y Subprocess (RA1)

> "Un programa en el disco duro es un muerto viviente. Un proceso es ese mismo programa **vivo**, ejecutándose, ocupando memoria, consumiendo CPU."

:::tip[🪟🐧 Compatibilidad Windows / Linux]
Los ejemplos están escritos para **Windows** (notepad.exe, calc.exe, ping -n, etc.), pero los conceptos (`subprocess.run`, `Popen`, `PID`, `communicate`) son **idénticos en todos los sistemas**.

| Windows | Linux / macOS |
|---------|---------------|
| `notepad.exe` | `gedit`, `nano`, `xed` |
| `calc.exe` | `gnome-calculator`, `bc` |
| `mspaint.exe` | `pinta`, `kolourpaint` |
| `ping -n 5 8.8.8.8` | `ping -c 5 8.8.8.8` |
| `ipconfig` | `ip addr`, `ifconfig` |
| `where python` | `which python` |
| `cmd /c mkdir` | `mkdir` (es ejecutable real) |
| `start http://...` | `xdg-open http://...` |
| `dir` | `ls` |

Sustituye el comando correspondiente y el código funciona igual.
:::

---

## Índice

1. [¿Qué es un proceso?](#qué-es-un-proceso)
2. [Estados de un proceso](#estados-de-un-proceso)
3. [Paralela vs Distribuida](#paralela-vs-distribuida)
4. [subprocess.run() — lanzar y esperar](#subprocessrun--lanzar-y-esperar)
5. [subprocess.Popen() — lanzar y seguir](#subprocesspopen--lanzar-y-seguir)
6. [Comunicación con procesos](#comunicación-con-procesos)
7. [Be the code, my friend, my friend — Abrir bloc de notas y calculadora](#be-the-code-my-friend-my-friend--abrir-bloc-de-notas-y-calculadora)
8. [🥊 El ring de los conceptos — run() vs Popen()](#el-ring-de-los-conceptos--run-vs-popen)
9. [Preguntas tontas — Procesos](#preguntas-tontas--procesos)
10. [✏️ Aprieta el lápiz](#✏-aprieta-el-lápiz)
11. [RAs cubiertos y criterios de evaluación](#ras-cubiertos-y-criterios-de-evaluación)

---

## ¿Qué es un proceso?

Un **proceso** es un programa en ejecución con su propio espacio de memoria, recursos (archivos abiertos, sockets) y un identificador único llamado **PID**.

```python
import os
print(f"Este proceso se llama PID {os.getpid()}")
```

### Características

| Propiedad | Descripción |
|-----------|-------------|
| **PID** | Identificador único numérico |
| **Memoria propia** | Cada proceso tiene su espacio de direcciones aislado |
| **Recursos** | Archivos, sockets, manejadores |
| **Contexto** | Estado de la CPU, registros, contador de programa |
| **Comunicación** | Necesita mecanismos externos (pipes, sockets, archivos) |

> "Si un proceso se cuelga, los demás no se enteran. Cada uno vive en su burbuja de memoria."

---

## Estados de un proceso

```
  ┌──────────┐
  │  NUEVO   │  ← El sistema crea el proceso
  └────┬─────┘
       ↓
  ┌──────────┐    ┌────────────┐
  │  LISTO   │←──→│ EJECUCIÓN  │
  └────┬─────┘    └──────┬─────┘
       │                  │
       ↓                  ↓
  ┌──────────┐    ┌──────────────┐
  │ BLOQUEADO│    │  TERMINADO   │
  └──────────┘    └──────────────┘
```

| Estado | Qué significa |
|--------|---------------|
| **NUEVO** | El proceso acaba de ser creado |
| **LISTO** | Preparado para ejecutar, esperando que la CPU esté libre |
| **EJECUCIÓN** | La CPU está ejecutando sus instrucciones |
| **BLOQUEADO** | Esperando un recurso (I/O, socket, sleep) |
| **TERMINADO** | El proceso ha finalizado |

![](/diagrams/procesos-estados.svg)

---

## Paralela vs Distribuida

| Concepto | Qué significa |
|----------|---------------|
| **Paralela** | Varias tareas ejecutándose **a la vez** en múltiples CPUs/núcleos |
| **Distribuida** | Varias tareas ejecutándose en **múltiples máquinas** conectadas por red |
| **Concurrencia** | Varias tareas **avanzando** (no necesariamente a la vez, pueden turnarse) |

### Ejemplos cotidianos

- **Paralela**: 4 hilos de cocina, cada uno friendo un huevo en su sartén (4 CPUs)
- **Distribuida**: 4 restaurantes en 4 ciudades, todos cocinando el mismo menú
- **Concurrente**: 1 cocinero que va friendo huevos de 3 pedidos, alternando

```python
# Paralela con multiprocessing (varios CPUs)
from multiprocessing import Pool
def cuadrado(n):
    return n * n

with Pool(4) as p:  # 4 procesos en paralelo
    print(p.map(cuadrado, [1, 2, 3, 4]))
```

---

## subprocess.run() — lanzar y esperar

La función más sencilla. Lanza un programa y **espera** a que termine.

```python
import subprocess

# Comando simple
resultado = subprocess.run(
    ["python", "--version"],
    capture_output=True,
    text=True
)
print(f"Salida: {resultado.stdout}")
print(f"Código de retorno: {resultado.returncode}")
```

### Parámetros importantes

| Parámetro | Qué hace |
|-----------|----------|
| `capture_output=True` | Captura stdout y stderr |
| `text=True` | Devuelve strings en vez de bytes |
| `timeout=N` | Lanza excepción si tarda más de N segundos |
| `check=True` | Lanza excepción si el código de retorno no es 0 |

```python
# Con timeout y control de errores
try:
    resultado = subprocess.run(
        ["ping", "google.com", "-n", "3"],
        capture_output=True,
        text=True,
        timeout=10
    )
    print(resultado.stdout)
except subprocess.TimeoutExpired:
    print("❌ El ping tardó demasiado")
except subprocess.CalledProcessError:
    print("❌ Error en el comando")
```

---

## subprocess.Popen() — lanzar y seguir

`Popen` lanza el proceso en **segundo plano** y devuelve el control inmediatamente.

```python
import subprocess

# Lanzar el bloc de notas (no espera)
proceso = subprocess.Popen(["notepad.exe"])
print(f"Bloc de notas lanzado con PID {proceso.pid}")

# Podemos hacer otras cosas mientras el bloc de notas está abierto
print("Haciendo otras cosas...")

# Cuando queramos, esperamos a que termine
proceso.wait()
print("El bloc de notas se cerró")
```

| Método de Popen | Qué hace |
|-----------------|----------|
| `proceso.wait()` | Espera a que termine (bloqueante) |
| `proceso.poll()` | Pregunta si ha terminado (no bloqueante) |
| `proceso.terminate()` | Envía señal de terminación |
| `proceso.kill()` | Mata el proceso forzosamente |
| `proceso.pid` | PID del proceso hijo |

---

## Comunicación con procesos

```python
import subprocess

# Escribir en stdin y leer stdout
proceso = subprocess.Popen(
    ["python", "-c", "print(input().upper())"],
    stdin=subprocess.PIPE,
    stdout=subprocess.PIPE,
    text=True
)

salida, _ = proceso.communicate(input="hola mundo")
print(f"El proceso respondió: {salida.strip()}")
# → "HOLA MUNDO"
```

---

## Be the code, my friend, my friend — Abrir bloc de notas y calculadora

> "Sé el programa que abre dos aplicaciones a la vez. Traza cada paso."

```python
import subprocess, time

print("🚀 Abriendo bloc de notas...")
notepad = subprocess.Popen(["notepad.exe"])
print(f"   → PID: {notepad.pid}")

print("🚀 Abriendo calculadora...")
calc = subprocess.Popen(["calc.exe"])
print(f"   → PID: {calc.pid}")

print("\nAmbos programas están abiertos.")
print("El usuario puede escribir en el bloc de notas y usar la calculadora.")

# Mientras tanto, Python no está bloqueado
for i in range(5):
    print(f"   Python haciendo cosas... ({i+1}/5)")
    time.sleep(1)

print("\nCerrando programas...")
notepad.terminate()
calc.kill()
print("Hecho 🏁")
```

**Traza paso a paso**:
```
1. subprocess.Popen(["notepad.exe"])
   → El SO crea un nuevo proceso
   → Windows busca notepad.exe en el PATH
   → Lo carga en memoria
   → Asigna PID 12345
   → Python recibe el control inmediatamente

2. print("PID: 12345")

3. subprocess.Popen(["calc.exe"])
   → Mismo proceso, PID 12346

4. Python hace 5 cosas mientras ambos están abiertos
   → 3 procesos independientes: Python, notepad, calc

5. notepad.terminate()
   → Envía señal de cierre al bloc de notas

6. calc.kill()
   → Mata la calculadora forzosamente
```

---

## 🥊 El ring de los conceptos — run() vs Popen()

**run()**: — ¡Yo soy el rey de la simplicidad! Lanzas un comando, esperas, y ¡zas! tienes el resultado.

**Popen()**: — Sí, pero mientras tú esperas como un muñeco, yo puedo lanzar un proceso y seguir haciendo otras cosas. ¿Para qué esperar si no hace falta?

**run()**: — ¿Y si necesitas el resultado? Conmigo es directo: `result.stdout` y ya. Tú necesitas `communicate()`, más vueltas...

**Popen()**: — Pero imagina que quieres lanzar 3 programas a la vez. Conmigo puedes lanzarlos, irte a hacer café, y luego matarlos a todos. Tú tendrías que esperar a que termine cada uno antes de lanzar el siguiente.

**run()**: — Vale, vale... para procesos que viven en segundo plano, eres mejor. Pero para comandos rápidos y resultados inmediatos, soy más limpio.

> **Moraleja**: `run()` para comandos rápidos que necesitan respuesta. `Popen()` para procesos que deben vivir en segundo plano.

---

## Preguntas tontas — Procesos

**❓ ¿Cuántos procesos puede tener mi sistema?**
Depende de la memoria RAM. Cada proceso ocupa memoria. En Windows puedes verlos en el Administrador de tareas.

**❓ ¿Qué pasa si un proceso hijo muere?**
El proceso padre puede enterarse con `proceso.wait()` o `proceso.poll()`. Si no, el hijo se convierte en **zombie** (ocupa una entrada en la tabla de procesos).

**❓ ¿Y si el padre muere antes que el hijo?**
Los hijos se convierten en **huérfanos**. En Windows, el sistema los gestiona. En Linux, `init` los adopta.

**❓ `run()` vs `Popen()` — ¿cuándo usar cada uno?**
- `run()`: cuando necesitas el resultado y puedes esperar
- `Popen()`: cuando el proceso debe vivir en segundo plano mientras tú haces otras cosas

**❓ ¿Puedo lanzar cualquier programa?**
Sí, cualquier ejecutable. Pero el PATH debe incluirlo o debes dar la ruta completa.

---

## ✏️ Aprieta el lápiz

1. **PID del proceso**: Crea un programa que imprima su propio PID y el PID del proceso padre.
2. **Lanzador de apps**: Usa `Popen` para abrir 3 programas distintos (bloc de notas, calculadora, navegador).
3. **Comando con timeout**: Lanza `ping` con timeout de 3 segundos. Captura el error si excede.
4. **Comunicación bidireccional**: Crea un proceso hijo que lea de stdin y devuelva el texto en mayúsculas.
5. **Caza de procesos**: Lanza 5 procesos `notepad` y luego mata todos menos uno.

---

## RAs cubiertos y criterios de evaluación

### RA1 — Procesos

| Criterio | Descripción | Cubierto |
|----------|-------------|----------|
| RA1a | Reconoce las características de los procesos | ✅ |
| RA1b | Distingue entre computación paralela y distribuida | ✅ |
| RA1c | Conoce los estados de un proceso | ✅ |
| RA1d | Identifica las diferencias clave entre proceso e hilo | → T02 |
| RA1e | Crea programas con procesos (subprocess) | ✅ |
| RA1f | Establece comunicación entre procesos | ✅ |

> RA1d se cubre en el **TEMA 02** junto con los hilos. RA1g (análisis ventajas procesos vs hilos) también en **TEMA 02**. RA1h (documentación) es transversal a todo el curso.
