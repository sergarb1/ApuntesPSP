---
title: Boletín U01 — Inicial
description: Ejercicios básicos de Procesos y Subprocess
---

# 📝 Boletín U01 — Inicial

> Ejercicios básicos para afianzar los conceptos de procesos, `subprocess.run`, `subprocess.Popen` y estados de la unidad U01.

---

## 1. Listar el directorio actual

Crea un programa que use `subprocess.run` para ejecutar el comando `dir` (Windows) o `ls` (Linux) y muestre la salida completa por pantalla.

## 2. Saber el nombre del equipo

Usa `subprocess.run` con el comando `hostname` para capturar y mostrar el nombre de tu máquina.

## 3. Abrir la calculadora

Usa `subprocess.Popen` para abrir la calculadora (`calc.exe`). El programa debe mostrar el PID, esperar 2 segundos y cerrarla con `terminate()`.

## 4. Mi primer PID

Crea un programa que imprima su propio PID con `os.getpid()`.

## 5. Versión de Python

Usa `subprocess.run` para ejecutar `python --version` con `capture_output=True` y `text=True`, y muestra la salida limpia (sin saltos de línea).

**Pista:** `resultado.stdout.strip()` te deja la salida limpia.

## 6. Abrir el bloc de notas y esperar

Usa `subprocess.Popen` para abrir `notepad.exe`, muestra su PID, espera 3 segundos y ciérralo con `terminate()`.

## 7. Ordena el ciclo de vida

Ordena los siguientes estados de un proceso en el orden correcto de su ciclo de vida: `EJECUCIÓN`, `NUEVO`, `TERMINADO`, `BLOQUEADO`, `LISTO`.

**Pista:** el proceso nace, luego espera su turno de CPU, se ejecuta, puede quedarse esperando un recurso y finalmente muere. Repasa el [punto 2](/ApuntesPSP/01-procesos-y-subprocess/02-estados-de-un-proceso).

## 8. Ping con timeout

Lanza `ping 8.8.8.8 -n 3` (Windows) o `ping -c 3 8.8.8.8` (Linux) con `timeout=3` y captura la excepción si se excede el tiempo.

**Pista:** envuelve `subprocess.run` en un `try/except` y captura `subprocess.TimeoutExpired`. Si tu conexión es rápida, prueba con `timeout=1`.