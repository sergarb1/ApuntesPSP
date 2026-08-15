---
title: Boletín U01 — Avanzado (Resuelto)
description: Soluciones de los ejercicios avanzados de Procesos y Subprocess
---

# 💪 Boletín U01 — Avanzado (Resuelto)

---

## 1. Filtrar ipconfig

```python
import subprocess

resultado = subprocess.run(["ipconfig"], capture_output=True, text=True)
lineas = resultado.stdout.split("\n")
for linea in lineas:
    if "IPv4" in linea:
        print(linea.strip())
```

`subprocess.run` captura toda la salida de `ipconfig`; `split("\n")` la divide en líneas y el filtro con `in` deja solo las de "IPv4".

## 2. Comprobar si un programa existe

```python
import subprocess

resultado = subprocess.run(["where", "python"], capture_output=True, text=True)
print(f"Código de retorno: {resultado.returncode}")
if resultado.returncode == 0:
    print(f"Python encontrado en: {resultado.stdout.strip()}")
else:
    print("Python NO está en el PATH")
```

En Linux usarías `["which", "python"]`. El código de retorno **0** indica que `where`/`which` lo encontró; distinto de 0, no.

## 3. Abrir el navegador

```python
import subprocess

# Windows: start es interno del shell, necesita shell=True
subprocess.run(["start", "http://localhost:4321"], shell=True)

# Linux / macOS:
# subprocess.run(["xdg-open", "http://localhost:4321"])
```

`start` no es un ejecutable real: es un comando interno de `cmd`, por eso usa `shell=True`. `xdg-open` sí es un ejecutable real en Linux ([punto 7](/ApuntesPSP/01-procesos-y-subprocess/07-compatibilidad-windows-linux)).

## 4. Lanzador múltiple

```python
import subprocess, time

programas = [
    ("Bloc de notas", subprocess.Popen(["notepad.exe"])),
    ("Calculadora", subprocess.Popen(["calc.exe"])),
    ("Paint", subprocess.Popen(["mspaint.exe"])),
]

for nombre, proceso in programas:
    print(f"{nombre} → PID {proceso.pid}")

time.sleep(5)

for nombre, proceso in programas:
    proceso.terminate()
    print(f"Cerrando {nombre}...")

print("Todos terminados 🏁")
```

Guardamos cada objeto `Popen` en una tupla con su nombre. Recorremos la lista para mostrar PIDs y, a los 5 segundos, para terminarlos todos con `terminate()`.

## 5. Captura de ping

```python
import subprocess

resultado = subprocess.run(["ping", "8.8.8.8", "-n", "5"], capture_output=True, text=True)
for linea in resultado.stdout.split("\n"):
    if "tiempo" in linea.lower() or "time" in linea.lower():
        print(linea)
```

`split("\n")` divide la salida y el filtro busca las líneas con "tiempo" (Windows en español) o "time" (sistemas en inglés). `.lower()` cubre ambas.

## 6. PID del padre

```python
import os

print(f"Mi PID es {os.getpid()}")
print(f"El PID de mi padre es {os.getppid()}")
```

`os.getpid()` devuelve tu PID; `os.getppid()` el del proceso que te lanzó (normalmente tu terminal o el IDE).

## 7. Comunicación en dos direcciones

```python
import subprocess

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

`communicate(input="hola mundo")` escribe en el stdin del hijo, espera su fin y devuelve `(stdout, stderr)`. El hijo ejecuta `print(input().upper())` ([punto 6](/ApuntesPSP/01-procesos-y-subprocess/06-comunicacion-con-procesos)).

## 8. Timeout con reintentos

```python
import subprocess

def ejecutar_con_reintentos(comando, intentos=3, timeout=3):
    for intento in range(1, intentos + 1):
        try:
            resultado = subprocess.run(comando, capture_output=True,
                                       text=True, timeout=timeout, check=False)
            if resultado.returncode == 0:
                print(f"✅ Éxito en el intento {intento}")
                return resultado
            print(f"Intento {intento}: código {resultado.returncode}")
        except subprocess.TimeoutExpired:
            print(f"Intento {intento}: se agotó el tiempo")
    raise TimeoutError(f"El comando {comando} falló tras {intentos} intentos")

try:
    resultado = ejecutar_con_reintentos(["ping", "8.8.8.8", "-n", "3"])
except TimeoutError as e:
    print(f"❌ {e}")
```

Cada intento usa `timeout=3` y `check=False`; se captura `TimeoutExpired` y se vuelve a intentar hasta 3 veces. Si nada funciona, se lanza una excepción propia.

## 9. Mini monitor de procesos

```python
import subprocess, time

proceso = subprocess.Popen(["notepad.exe"])

while proceso.poll() is None:
    print(f"El proceso (PID {proceso.pid}) sigue vivo...")
    time.sleep(1)

print(f"El proceso terminó con código {proceso.poll()}")
```

`proc.poll()` devuelve `None` mientras el proceso vive y su código de retorno cuando termina. El bucle `while proc.poll() is None` vigila cada segundo hasta que muere.