---
title: "⭐ AVANZADO 1 — Procesos y Subprocess"
nav_order: 1
---

## ⭐ AVANZADO 01 — Procesos y Subprocess

---

### 1. 🎯 Lanzador múltiple

Crea un programa que lance 3 programas distintos a la vez (notepad, calc, mspaint). Muestra sus PIDs y luego los mata todos a los 5 segundos.

**Pista**: Guarda los objetos `Popen` en una lista o tupla junto con el nombre de cada programa. Recorre la lista para mostrar PIDs y más tarde para terminarlos con `terminate()`.

### 2. 🔍 Captura de ping

Ejecuta `ping 8.8.8.8 -n 5`, captura stdout y extrae solo las líneas que contienen "tiempo" o "time".

**Pista**: Divide el stdout con `split("\n")` y filtra cada línea con el operador `in` para buscar las palabras clave.

### 3. 🧩 PID del padre

Crea un programa que muestre su propio PID y el PID del proceso padre (PPID).

**Pista**: Usa `os.getpid()` para tu PID y `os.getppid()` para el PPID. Ejecuta desde la terminal y observa quién es el padre.

### 4. 🎭 Comunicación en dos direcciones

Crea un proceso hijo que reciba texto por stdin y devuelva el texto en mayúsculas.

**Pista**: Usa `subprocess.Popen` con `stdin=subprocess.PIPE`, `stdout=subprocess.PIPE` y `text=True`. Luego llama a `communicate(input="tu texto")` para enviar datos y leer la respuesta.

### 5. ⏱ Timeout con reintentos

Crea una función que ejecute un comando con timeout de 3s. Si falla, reintenta hasta 3 veces. Si al final no funciona, lanza una excepción.

**Pista**: Envuelve `subprocess.run` con `timeout=3` y `check=False` dentro de un bucle `for`. Captura `subprocess.TimeoutExpired` en cada intento y rompe el bucle si el comando se ejecuta correctamente. Si se agotan los intentos, lanza una excepción personalizada.

### 6. 🏗️ Mini monitor de procesos

Crea un programa que lance un subprocess y verifique su estado cada segundo mientras está vivo.

**Pista**: `proc.poll()` devuelve `None` si el proceso sigue ejecutándose, o el código de retorno si ya terminó. Úsalo en un bucle `while proc.poll() is None` con `time.sleep(1)` dentro.
