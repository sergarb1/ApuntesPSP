---
title: "✅ INICIAL RESUELTO 1 — Procesos y Subprocess"
nav_order: 1
---
### 1. Mi primer PID

```python
import os
print(f"Mi PID es {os.getpid()}")
```

`os.getpid()` devuelve el identificador único del proceso actual.

### 2. Versión de Python

```python
import subprocess
resultado = subprocess.run(["python", "--version"], capture_output=True, text=True)
print(resultado.stdout.strip())
```

`capture_output=True` captura la salida. `text=True` la devuelve como string.

### 3. Abrir bloc de notas

```python
import subprocess, time
notepad = subprocess.Popen(["notepad.exe"])
print(f"PID: {notepad.pid}")
time.sleep(3)
notepad.terminate()
```

`Popen` no espera. `terminate()` envía señal de cierre.
