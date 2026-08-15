---
title: 05 — subprocess.Popen()
description: Lanza un proceso y sigue tu camino 🚶
---

<p><small>Lanza un proceso y sigue tu camino 🚶</small></p>

> 🗺️ **Estás en:** 🚀 **U01 · Procesos y Subprocess** → 05 · subprocess.Popen()

---

## 📬 La idea en una frase

> `subprocess.Popen()` lanza un proceso en **segundo plano** y devuelve el control inmediatamente: no espera a que termine. Tú sigues haciendo cosas mientras él vive.

`run()` espera; `Popen()` no. Eso convierte a `Popen` en la herramienta para abrir aplicaciones, lanzar varios programas a la vez y gestionarlos después con sus métodos.

---

## 🚀 El primer Popen: abrir el bloc de notas

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

Paso a paso:

1. `subprocess.Popen(["notepad.exe"])` lanza el bloc de notas y **vuelve al instante**.
2. `proceso.pid` te da el PID del proceso recién creado.
3. Python sigue ejecutando (`print("Haciendo otras cosas...")`) mientras el bloc de notas está abierto.
4. `proceso.wait()` **bloquea** a Python hasta que el bloc de notas se cierra.

---

## 🎛️ Los métodos de Popen

| Método de Popen | Qué hace |
|-----------------|----------|
| `proceso.wait()` | Espera a que termine (bloqueante) |
| `proceso.poll()` | Pregunta si ha terminado (no bloqueante) |
| `proceso.terminate()` | Envía señal de terminación |
| `proceso.kill()` | Mata el proceso forzosamente |
| `proceso.pid` | PID del proceso hijo |

### `wait()` vs `poll()`

- `wait()` **bloquea**: Python se queda parado hasta que el proceso termina.
- `poll()` **no bloquea**: devuelve `None` si el proceso sigue vivo, o su código de retorno si ya terminó.

```python
import subprocess, time

proceso = subprocess.Popen(["notepad.exe"])

while proceso.poll() is None:
    print("El bloc de notas sigue abierto...")
    time.sleep(1)

print(f"Cerrado con código {proceso.poll()}")
```

### `terminate()` vs `kill()`

- `terminate()` envía una señal de cierre **suave**: el proceso tiene oportunidad de guardar y salir.
- `kill()` lo mata **forzosamente**, sin darle opción. Úsalo solo cuando `terminate()` no baste.

```python
proceso = subprocess.Popen(["calc.exe"])
print(f"Calculadora lanzada con PID {proceso.pid}")

proceso.terminate()   # cierre suave
proceso.kill()        # solo si el anterior no funcionó
```

---

## 🏃 Lanzar varios procesos a la vez

La gran ventaja de `Popen` es lanzar varios procesos y esperarlos después:

```python
import subprocess, time

notepad = subprocess.Popen(["notepad.exe"])
calc = subprocess.Popen(["calc.exe"])
mspaint = subprocess.Popen(["mspaint.exe"])

print(f"PIDs: {notepad.pid}, {calc.pid}, {mspaint.pid}")

time.sleep(5)          # les damos 5 segundos de vida
notepad.terminate()
calc.terminate()
mspaint.kill()
print("Todos cerrados 🏁")
```

Los 3 procesos viven a la vez, cada uno con su PID, mientras Python hace otras cosas. Eso es imposible con `run()`, que espera a cada uno antes de lanzar el siguiente.

---

## 🧠 Mini-chequeo

1. ¿Qué diferencia hay entre `wait()` y `poll()`?
2. ¿Qué devuelve `proceso.poll()` mientras el proceso sigue vivo?
3. ¿Cuándo usarías `kill()` en lugar de `terminate()`?

<details>
<summary>🔄 Respuestas</summary>

1. `wait()` **bloquea** hasta que el proceso termina; `poll()` **pregunta** sin bloquear y devuelve el estado.
2. `None` (el proceso sigue ejecutándose).
3. Cuando `terminate()` no consigue cerrarlo: `kill()` mata el proceso forzosamente.

</details>

---

## ✅ Resumen en 3 frases

- `Popen` lanza un proceso en segundo plano y devuelve el control **al instante**.
- `wait()` bloquea, `poll()` pregunta, `terminate()` cierra suave y `kill()` mata a la fuerza.
- Con `Popen` puedes lanzar y gestionar **varios procesos a la vez**, cada uno con su PID.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| Popen | Clase que lanza procesos en segundo plano |
| wait() | Espera bloqueante a que termine |
| poll() | Consulta no bloqueante del estado |
| terminate() | Señal de cierre suave |
| kill() | Muerte forzosa |
| pid | PID del proceso hijo |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/01-procesos-y-subprocess) · **Anterior:** [04 · subprocess.run()](/ApuntesPSP/01-procesos-y-subprocess/04-subprocess-run) · **Siguiente:** [06 · Comunicación con procesos](/ApuntesPSP/01-procesos-y-subprocess/06-comunicacion-con-procesos)