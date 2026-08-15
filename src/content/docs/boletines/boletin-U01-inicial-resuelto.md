---
title: Boletín U01 — Inicial (Resuelto)
description: Soluciones de los ejercicios básicos de Procesos y Subprocess
---

# ✅ Boletín U01 — Inicial (Resuelto)

---

## 1. Listar el directorio actual

```python
import subprocess

resultado = subprocess.run(["dir"], capture_output=True, text=True, shell=True)
print(resultado.stdout)
```

En Linux: `subprocess.run(["ls"])`. En Windows, `dir` es un comando interno del shell, por eso `shell=True` ([punto 7](/ApuntesPSP/01-procesos-y-subprocess/07-compatibilidad-windows-linux)).

## 2. Saber el nombre del equipo

```python
import subprocess

resultado = subprocess.run(["hostname"], capture_output=True, text=True)
print(f"El nombre del equipo es {resultado.stdout.strip()}")
```

`capture_output=True` captura la salida de `hostname` y `text=True` la devuelve como string.

## 3. Abrir la calculadora

```python
import subprocess, time

calc = subprocess.Popen(["calc.exe"])
print(f"Calculadora lanzada con PID {calc.pid}")
time.sleep(2)
calc.terminate()
print("Calculadora cerrada")
```

`Popen` no espera: el programa muestra el PID, espera 2 segundos y cierra con `terminate()`.

## 4. Mi primer PID

```python
import os

print(f"Mi PID es {os.getpid()}")
```

`os.getpid()` devuelve el identificador único del proceso actual: el **PID** ([punto 1](/ApuntesPSP/01-procesos-y-subprocess/01-que-es-un-proceso)).

## 5. Versión de Python

```python
import subprocess

resultado = subprocess.run(["python", "--version"], capture_output=True, text=True)
print(resultado.stdout.strip())
```

`capture_output=True` captura la salida. `text=True` la devuelve como string. `.strip()` elimina el salto de línea final.

## 6. Abrir el bloc de notas y esperar

```python
import subprocess, time

notepad = subprocess.Popen(["notepad.exe"])
print(f"PID: {notepad.pid}")
time.sleep(3)
notepad.terminate()
```

`Popen` no espera. `terminate()` envía señal de cierre.

## 7. Ordena el ciclo de vida

**NUEVO → LISTO → EJECUCIÓN → BLOQUEADO → TERMINADO**

El orden correcto: el proceso **nace** (NUEVO), espera su turno de CPU (**LISTO**), la CPU lo ejecuta (**EJECUCIÓN**), puede quedarse esperando un recurso (**BLOQUEADO**) y finalmente **termina**. Repasa el [punto 2](/ApuntesPSP/01-procesos-y-subprocess/02-estados-de-un-proceso).

## 8. Ping con timeout

```python
import subprocess

try:
    resultado = subprocess.run(["ping", "8.8.8.8", "-n", "3"],
                               capture_output=True, text=True, timeout=3)
    print(resultado.stdout)
except subprocess.TimeoutExpired:
    print("El ping tardó demasiado")
```

En Linux usa `["ping", "-c", "3", "8.8.8.8"]`. `timeout` lanza `TimeoutExpired` si excede.