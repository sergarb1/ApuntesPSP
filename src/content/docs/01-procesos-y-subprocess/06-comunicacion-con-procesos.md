---
title: 06 — Comunicación con procesos
description: Pasa datos por stdin y lee la respuesta por stdout 📨
---

<p><small>Pasa datos por stdin y lee la respuesta por stdout 📨</small></p>

> 🗺️ **Estás en:** 🚀 **U01 · Procesos y Subprocess** → 06 · Comunicación con procesos

---

## 📬 La idea en una frase

> Un proceso hijo puede **leer de su stdin** y **escribir en su stdout**; con `communicate()` le pasas datos por un tubo y lees su respuesta por el otro.

Los procesos no comparten memoria ([punto 1](/ApuntesPSP/01-procesos-y-subprocess/01-que-es-un-proceso)), pero el sistema operativo les presta **pipes** (tuberías): el `stdin`, `stdout` y `stderr` de cada proceso pueden conectarse a Python. Así un proceso "pregunta" y el otro "responde".

---

## 🔌 Conectar los tubos

```python
import subprocess

proceso = subprocess.Popen(
    ["python", "-c", "print(input().upper())"],
    stdin=subprocess.PIPE,
    stdout=subprocess.PIPE,
    text=True
)
```

- `stdin=subprocess.PIPE`: Python podrá **escribir** en el stdin del hijo.
- `stdout=subprocess.PIPE`: Python podrá **leer** el stdout del hijo.
- `text=True`: los datos viajan como texto, no como bytes.

El proceso hijo ejecuta `print(input().upper())`: lee una línea de su stdin, la pasa a mayúsculas y la escribe en su stdout.

---

## 📨 Enviar y recibir con communicate()

```python
salida, _ = proceso.communicate(input="hola mundo")
print(f"El proceso respondió: {salida.strip()}")
# → "HOLA MUNDO"
```

`communicate(input="hola mundo")`:

1. Escribe `"hola mundo"` en el stdin del hijo y cierra el tubo de entrada.
2. Espera a que el hijo termine.
3. Devuelve una tupla `(stdout, stderr)`.

Después de `communicate()` el proceso ya terminó: no puedes volver a comunicarte con él.

---

## 🗣️ El mismo ejemplo completo, con sentido

```python
import subprocess

# Escribir en stdin y leer stdout
proceso = subprocess.Popen(
    ["python", "-c", "print(input().upper())"],
    stdin=subprocess.PIPE,
    stdout=subprocess.PIPE,
    text=True
)

salida, error = proceso.communicate(input="hola mundo")
print(f"El proceso respondió: {salida.strip()}")
# → "HOLA MUNDO"

print(f"Error (None si todo bien): {error}")
# → Error (None si todo bien): None
```

**Flujo de datos:**

```
  Python ──stdin──►  proceso hijo (lee input, pasa a mayúsculas)
  proceso hijo ──stdout──►  Python (recibe "HOLA MUNDO")
```

---

## 💡 ¿Cuándo usar cada herramienta?

| Situación | Herramienta |
|---|---|
| Necesitas el resultado de un comando y puedes esperar | `subprocess.run(..., capture_output=True)` |
| El proceso vive en segundo plano y no necesitas sus datos | `subprocess.Popen(...)` + `wait()` |
| Necesitas **enviarle datos** y/o **leer su respuesta** | `Popen(..., stdin=PIPE, stdout=PIPE)` + `communicate()` |

> ⚠️ **Cuidado con los deadlocks:** si el hijo escribe mucho en stdout y nadie lo lee, el pipe se llena y el hijo se bloquea esperando a que alguien lo vacíe. `communicate()` lee todo y te evita ese problema. Por eso con `run()` se usa `capture_output=True` y con `Popen`, `communicate()`.

---

## 🧠 Mini-chequeo

1. ¿Qué significa `stdin=subprocess.PIPE` y `stdout=subprocess.PIPE`?
2. ¿Qué devuelve `communicate(input="texto")`?
3. ¿Por qué `communicate()` evita los deadlocks con pipes?

<details>
<summary>🔄 Respuestas</summary>

1. Que Python podrá **escribir** en el stdin del hijo y **leer** su stdout.
2. Una tupla `(stdout, stderr)` con la salida del proceso.
3. Porque lee todo el stdout del proceso mientras lo espera, sin dejar que el pipe se llene y el hijo se bloquee.

</details>

---

## ✅ Resumen en 3 frases

- Con `stdin=PIPE` y `stdout=PIPE` conectas tuberías entre Python y el proceso hijo.
- `communicate(input="...")` envía datos al hijo, espera su fin y devuelve `(stdout, stderr)`.
- Los pipes permiten "preguntar" a un proceso y "leer" su respuesta sin compartir memoria.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| Pipe | Tubería que conecta la salida de un proceso con la entrada de otro |
| stdin | Entrada estándar del proceso |
| stdout | Salida estándar del proceso |
| stderr | Salida de errores del proceso |
| PIPE | Constante que le dice a Popen "conecta esta tubería" |
| communicate() | Envía datos y recoge la salida del hijo |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/01-procesos-y-subprocess) · **Anterior:** [05 · subprocess.Popen()](/ApuntesPSP/01-procesos-y-subprocess/05-subprocess-popen) · **Siguiente:** [07 · Compatibilidad Windows / Linux](/ApuntesPSP/01-procesos-y-subprocess/07-compatibilidad-windows-linux)