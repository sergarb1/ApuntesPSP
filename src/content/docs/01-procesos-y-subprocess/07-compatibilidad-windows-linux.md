---
title: 07 — Compatibilidad Windows / Linux
description: "Un mismo código, dos mundos: la tabla de trucos 🪟🐧"
---

<p><small>Un mismo código, dos mundos: la tabla de trucos 🪟🐧</small></p>

> 🗺️ **Estás en:** 🚀 **U01 · Procesos y Subprocess** → 07 · Compatibilidad Windows / Linux

---

## 📬 La idea en una frase

> Los ejemplos de esta unidad están escritos para **Windows**, pero los conceptos (`subprocess.run`, `Popen`, `PID`, `communicate`) son **idénticos en todos los sistemas**: solo cambia el comando.

La API de `subprocess` es la misma en Windows, Linux y macOS. Lo único que cambia es qué ejecutable pones en la lista: `notepad.exe` no existe en Linux y `ls` no existe en Windows. Aprende a sustituir el comando y el código funciona igual.

---

## 🪟🐧 La tabla de comandos equivalentes

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

> Sustituye el comando correspondiente y el código funciona igual.

---

## 🧩 El truco del shell

Algunos comandos **no son ejecutables reales**: son palabras que interpreta el intérprete de comandos (shell). El ejemplo clásico es `mkdir`:

- En **Windows**, `mkdir` es un **comando interno de `cmd`**: no hay un archivo `mkdir.exe`, así que hay que invocarlo a través del shell con `cmd /c mkdir ...`.
- En **Linux**, `mkdir` es un **ejecutable real** (`/usr/bin/mkdir`): se lanza directamente.

```python
import subprocess

# En Windows: cmd /c ejecuta comandos internos del shell
resultado = subprocess.run(["cmd", "/c", "mkdir", "prueba_psp"],
                           capture_output=True, text=True)
print(f"Creada con código: {resultado.returncode}")
```

En Linux usarías directamente `["mkdir", "prueba_psp"]` porque `mkdir` es un ejecutable real.

Otro ejemplo: abrir el navegador con una URL.

- **Windows**: `start http://localhost:4321` (con `shell=True`, porque `start` es interno del shell).
- **Linux**: `xdg-open http://localhost:4321` (ejecutable real).

```python
import subprocess

# Windows
subprocess.run(["start", "http://localhost:4321"], shell=True)

# Linux / macOS
# subprocess.run(["xdg-open", "http://localhost:4321"])
```

> ⚠️ **`shell=True` con cuidado:** solo úsalo cuando el comando es interno del shell (como `start` o `dir`). Con `shell=True` y texto del usuario, un atacante podría inyectar comandos. Pasa siempre la lista de argumentos, no un string concatenado.

---

## 🌍 Lo que nunca cambia

| Concepto | Windows | Linux |
|---|---|---|
| `subprocess.run([...])` | ✅ | ✅ |
| `subprocess.Popen([...])` | ✅ | ✅ |
| `capture_output=True`, `text=True` | ✅ | ✅ |
| `timeout`, `returncode` | ✅ | ✅ |
| `communicate(input=...)` | ✅ | ✅ |
| `proceso.wait()`, `poll()`, `terminate()`, `kill()` | ✅ | ✅ |
| `proceso.pid` | ✅ | ✅ |

Aprende los conceptos con `notepad.exe` y `calc.exe` y, cuando toques Linux, solo cambia la lista de comandos de la tabla de arriba.

---

## 🧠 Mini-chequeo

1. ¿Qué comando de Windows equivale a `ls` en Linux?
2. ¿Por qué en Windows `mkdir` necesita `cmd /c`?
3. ¿Cuándo tienes que usar `shell=True`?

<details>
<summary>🔄 Respuestas</summary>

1. `dir`.
2. Porque en Windows `mkdir` es un **comando interno del shell `cmd`**, no un ejecutable real: hay que invocarlo con `cmd /c`.
3. Solo cuando el comando es **interno del shell** (como `start` o `dir`). Con listas de argumentos no hace falta, y es más seguro.

</details>

---

## ✅ Resumen en 3 frases

- La API de `subprocess` es idéntica en Windows y Linux: solo cambian los comandos.
- Comandos internos del shell (como `mkdir` en Windows) necesitan `cmd /c` o `shell=True`.
- Sustituye el comando de la tabla y tu código funcionará en cualquier sistema.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| Shell | Intérprete de comandos (`cmd`, `bash`) |
| Comando interno | Palabra que interpreta el shell (no es un ejecutable) |
| cmd /c | Ejecuta un comando interno de `cmd` en Windows |
| shell=True | Delega la ejecución en el shell (¡con cuidado!) |
| xdg-open | Abre una URL o archivo con la app por defecto en Linux |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/01-procesos-y-subprocess) · **Anterior:** [06 · Comunicación con procesos](/ApuntesPSP/01-procesos-y-subprocess/06-comunicacion-con-procesos) · **Siguiente:** [08 · Procesos en la práctica](/ApuntesPSP/01-procesos-y-subprocess/08-procesos-en-la-practica)