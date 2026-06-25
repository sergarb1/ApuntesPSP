---
title: "💪 INTERMEDIO RESUELTO 1 — Procesos y Subprocess"
nav_order: 1
---
### 4. Comando con error

```python
import subprocess
resultado = subprocess.run(["python", "--versio"], capture_output=True, text=True)
print(f"Código: {resultado.returncode}")
print(f"Error: {resultado.stderr}")
```

El código de retorno != 0 indica error.

### 5. Ping con timeout

```python
import subprocess
try:
    resultado = subprocess.run(["ping", "google.com", "-n", "3"],
                               capture_output=True, text=True, timeout=5)
    print(resultado.stdout)
except subprocess.TimeoutExpired:
    print("El ping tardó demasiado")
```

`timeout` lanza `TimeoutExpired` si excede.

### 6. Crear carpeta

```python
import subprocess
# En Windows: cmd /c ejecuta comandos internos del shell
resultado = subprocess.run(["cmd", "/c", "mkdir", "prueba_psp"],
                           capture_output=True, text=True)
print(f"Creada con código: {resultado.returncode}")
```

En Linux usarías directamente `["mkdir", "prueba_psp"]` porque `mkdir` es un ejecutable real.
