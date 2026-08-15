---
title: 04 — subprocess.run()
description: Lanza un programa y espera a que termine ⏳
---

<p><small>Lanza un programa y espera a que termine ⏳</small></p>

> 🗺️ **Estás en:** 🚀 **U01 · Procesos y Subprocess** → 04 · subprocess.run()

---

## 📬 La idea en una frase

> `subprocess.run()` lanza un programa y **espera** a que termine, devolviéndote su salida y su código de retorno. Es la forma más sencilla de ejecutar otro programa desde Python.

Cuando necesitas el resultado de un comando (¿qué versión hay? ¿responde el ping? ¿qué dice este comando?), `run()` es tu herramienta: lanza, espera y captura.

---

## 🚀 El primer lanzamiento

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

**Salida** (más o menos):
```
Salida: Python 3.11.4
Código de retorno: 0
```

- `subprocess.run(["python", "--version"])` recibe una **lista** con el ejecutable y sus argumentos. Cada elemento de la lista es un argumento aparte.
- `capture_output=True` captura la salida estándar (`stdout`) y la de errores (`stderr`).
- `text=True` devuelve cadenas en vez de bytes (mucho más cómodo para leer).
- `resultado.returncode` es el código de retorno: **0 = todo bien**, distinto de 0 = algo falló.

---

## 🎛️ Los parámetros importantes

| Parámetro | Qué hace |
|-----------|----------|
| `capture_output=True` | Captura stdout y stderr |
| `text=True` | Devuelve strings en vez de bytes |
| `timeout=N` | Lanza excepción si tarda más de N segundos |
| `check=True` | Lanza excepción si el código de retorno no es 0 |

### Resultado: `stdout`, `stderr` y `returncode`

| Atributo | Qué contiene |
|---|---|
| `resultado.stdout` | La salida estándar del programa |
| `resultado.stderr` | La salida de errores |
| `resultado.returncode` | 0 si fue bien, otro número si falló |

---

## ⏱️ Timeout: no esperes para siempre

Si un comando puede colgarse (un ping, un servidor), protege tu programa con `timeout`:

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

- `subprocess.TimeoutExpired`: el comando superó los `timeout` segundos.
- `subprocess.CalledProcessError`: solo se lanza con `check=True` cuando el `returncode` no es 0.

---

## 🐛 Un ejemplo con error controlado

```python
import subprocess

resultado = subprocess.run(["python", "--versio"], capture_output=True, text=True)
print(f"Código: {resultado.returncode}")
print(f"Error: {resultado.stderr}")
```

**Salida:**
```
Código: 2
Error: Unknown option: --versio
```

El código de retorno **2** (distinto de 0) te dice que el comando falló, y `stderr` te dice por qué. No hizo falta ninguna excepción: por defecto `run()` no lanza, solo devuelve el resultado.

---

## 🧠 Mini-chequeo

1. ¿Qué hace `capture_output=True` y `text=True`?
2. ¿Qué significa un `returncode` distinto de 0?
3. ¿Qué excepción lanza `run()` si el comando tarda más de `timeout`?

<details>
<summary>🔄 Respuestas</summary>

1. `capture_output=True` captura stdout y stderr; `text=True` los devuelve como **strings** en vez de bytes.
2. Que el comando **falló** (0 = éxito, cualquier otro número = error).
3. `subprocess.TimeoutExpired`.

</details>

---

## ✅ Resumen en 3 frases

- `subprocess.run()` lanza un comando y **espera** su finalización.
- Captura la salida con `capture_output=True`, texto con `text=True` y controla el tiempo con `timeout`.
- El `returncode` te dice si fue bien (0) o mal (distinto de 0).

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| subprocess.run | Función que lanza un comando y espera |
| capture_output | Captura stdout y stderr |
| text=True | Devuelve strings en vez de bytes |
| timeout | Lanza TimeoutExpired si excede |
| returncode | Código de retorno (0 = bien) |
| check=True | Lanza CalledProcessError si returncode ≠ 0 |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/01-procesos-y-subprocess) · **Anterior:** [03 · Paralela vs Distribuida](/ApuntesPSP/01-procesos-y-subprocess/03-paralela-vs-distribuida) · **Siguiente:** [05 · subprocess.Popen()](/ApuntesPSP/01-procesos-y-subprocess/05-subprocess-popen)