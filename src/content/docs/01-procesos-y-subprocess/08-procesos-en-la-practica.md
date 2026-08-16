---
title: 08 — Procesos en la práctica
description: Sé el código, el ring y los ejercicios del lápiz ✏️
---

<p><small>Sé el código, el ring y los ejercicios del lápiz ✏️</small></p>

> 🗺️ **Estás en:** 🚀 **U01 · Procesos y Subprocess** → 08 · Procesos en la práctica

---

## 📬 La idea en una frase

> Aterriza todo lo anterior: sé el código que abre dos aplicaciones a la vez, mira pelearse a `run()` y `Popen()` en el ring, y pon a prueba tus manos con los ejercicios del lápiz.

---

## ⭐ Sé el código: abrir bloc de notas y calculadora

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

**Traza paso a paso:**

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

Fíjate en el paso 4: **Python no se bloquea**. Mientras los dos programas están abiertos, el proceso de Python sigue imprimiendo. Tres procesos independientes conviven a la vez, cada uno con su PID, su memoria y su turno de CPU ([punto 1](/ApuntesPSP/01-procesos-y-subprocess/01-que-es-un-proceso) y [punto 2](/ApuntesPSP/01-procesos-y-subprocess/02-estados-de-un-proceso)).

---

## 🥊 El ring de los conceptos — run() vs Popen()

> *Dos funciones de `subprocess` se citan en el cuadrilátero para resolver, de una vez, quién lanza mejor.*

**run():** — ¡Yo soy el rey de la simplicidad! Lanzas un comando, esperas, y ¡zas! tienes el resultado.

**Popen():** — Sí, pero mientras tú esperas como un muñeco, yo puedo lanzar un proceso y seguir haciendo otras cosas. ¿Para qué esperar si no hace falta?

**run():** — ¿Y si necesitas el resultado? Conmigo es directo: `result.stdout` y ya. Tú necesitas `communicate()`, más vueltas...

**Popen():** — Pero imagina que quieres lanzar 3 programas a la vez. Conmigo puedes lanzarlos, irte a hacer café, y luego matarlos a todos. Tú tendrías que esperar a que termine cada uno antes de lanzar el siguiente.

**run():** — Vale, vale... para procesos que viven en segundo plano, eres mejor. Pero para comandos rápidos y resultados inmediatos, soy más limpio.

> **Moraleja**: `run()` para comandos rápidos que necesitan respuesta. `Popen()` para procesos que deben vivir en segundo plano.

---

## ✏️ Aprieta el lápiz

Pon a prueba lo aprendido. Intenta resolver cada ejercicio antes de mirar la solución.

### 1. PID del proceso

Crea un programa que imprima su propio PID y el PID del proceso padre.

<details>
<summary>🔄 Solución</summary>

```python
import os

print(f"Mi PID es {os.getpid()}")
print(f"El PID de mi padre es {os.getppid()}")
```

`os.getpid()` devuelve tu PID; `os.getppid()` el del proceso que te lanzó (tu terminal).

</details>

### 2. Lanzador de apps

Usa `Popen` para abrir 3 programas distintos (bloc de notas, calculadora, navegador).

<details>
<summary>🔄 Solución</summary>

```python
import subprocess, time

notepad = subprocess.Popen(["notepad.exe"])
calc = subprocess.Popen(["calc.exe"])
navegador = subprocess.Popen(["start", "http://localhost:4321"], shell=True)

print(f"PIDs: {notepad.pid}, {calc.pid}, {navegador.pid}")
time.sleep(3)

notepad.terminate()
calc.terminate()
navegador.kill()
```

Tres `Popen`, tres procesos en segundo plano, cada uno con su PID.

</details>

### 3. Comando con timeout

Lanza `ping` con timeout de 3 segundos. Captura el error si excede.

<details>
<summary>🔄 Solución</summary>

```python
import subprocess

try:
    resultado = subprocess.run(["ping", "google.com", "-n", "3"],
                               capture_output=True, text=True, timeout=3)
    print(resultado.stdout)
except subprocess.TimeoutExpired:
    print("❌ El ping tardó demasiado")
```

Con `timeout=3`, si el ping no acaba en 3 segundos se lanza `TimeoutExpired` y lo capturas.

</details>

### 4. Comunicación bidireccional

Crea un proceso hijo que lea de stdin y devuelva el texto en mayúsculas.

<details>
<summary>🔄 Solución</summary>

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

`communicate(input="...")` escribe en el stdin del hijo, espera y devuelve su stdout ([punto 6](/ApuntesPSP/01-procesos-y-subprocess/06-comunicacion-con-procesos)).

</details>

### 5. Caza de procesos

Lanza 5 procesos `notepad` y luego mata todos menos uno.

<details>
<summary>🔄 Solución</summary>

```python
import subprocess

procesos = []
for i in range(5):
    proceso = subprocess.Popen(["notepad.exe"])
    procesos.append(proceso)
    print(f"Lanzado {i+1} con PID {proceso.pid}")

# Matamos todos menos el primero
for proceso in procesos[1:]:
    proceso.terminate()

print(f"El superviviente tiene PID {procesos[0].pid}")
```

Guardamos los 5 objetos `Popen` en una lista y terminamos todos menos el índice 0.

</details>

---

## 🧠 Mini-chequeo

1. En el "Sé el código", ¿cuántos procesos hay vivos mientras Python imprime sus 5 mensajes?
2. ¿Cuándo usarías `run()` y cuándo `Popen()`?
3. ¿Qué devuelve `os.getppid()`?

<details>
<summary>🔄 Respuestas</summary>

1. **3**: Python, el bloc de notas y la calculadora.
2. `run()` para comandos rápidos que necesitan respuesta; `Popen()` para procesos que viven en segundo plano.
3. El **PID del proceso padre** (el que lanzó tu programa).

</details>

---

## ✅ Resumen en 3 frases

- `Popen` lanza aplicaciones en segundo plano y Python sigue trabajando mientras viven.
- `run()` es para respuestas inmediatas; `Popen()` para procesos de larga vida ([ring](#-el-ring-de-los-conceptos--run-vs-popen)).
- Con `os.getpid()`, `os.getppid()`, `communicate()` y `terminate()` ya sabes jugar con procesos de verdad.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| Sé el código | Técnica de traza mental: ejecutar el programa paso a paso en tu cabeza |
| os.getpid() | PID del proceso actual |
| os.getppid() | PID del proceso padre |
| communicate() | Enviar datos al hijo y leer su respuesta |
| terminate() / kill() | Cierre suave / muerte forzosa |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/01-procesos-y-subprocess) · **Anterior:** [07 · Compatibilidad Windows / Linux](/ApuntesPSP/01-procesos-y-subprocess/07-compatibilidad-windows-linux) · **Siguiente:** [09 · Cierre](/ApuntesPSP/01-procesos-y-subprocess/09-cierre)