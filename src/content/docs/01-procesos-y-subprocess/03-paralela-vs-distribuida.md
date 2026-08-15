---
title: 03 — Paralela vs Distribuida
description: CPUs, máquinas y la concurrencia de por medio 🤹
---

<p><small>CPUs, máquinas y la concurrencia de por medio 🤹</small></p>

> 🗺️ **Estás en:** 🚀 **U01 · Procesos y Subprocess** → 03 · Paralela vs Distribuida

---

## 📬 La idea en una frase

> **Paralela** es ejecutar varias tareas **a la vez** en varias CPUs; **distribuida** es ejecutarlas en **múltiples máquinas** conectadas por red; **concurrencia** es que varias tareas **avancen**, aunque se turnen en una sola CPU.

La diferencia está en el "dónde": la paralela reparte trabajo entre los núcleos de tu máquina, la distribuida entre máquinas, y la concurrencia es una forma de *parecer* simultáneo aunque físicamente no lo sea.

---

## 🤹 La tabla de los tres conceptos

| Concepto | Qué significa |
|----------|---------------|
| **Paralela** | Varias tareas ejecutándose **a la vez** en múltiples CPUs/núcleos |
| **Distribuida** | Varias tareas ejecutándose en **múltiples máquinas** conectadas por red |
| **Concurrencia** | Varias tareas **avanzando** (no necesariamente a la vez, pueden turnarse) |

### Ejemplos cotidianos

- **Paralela**: 4 hilos de cocina, cada uno friendo un huevo en su sartén (4 CPUs).
- **Distribuida**: 4 restaurantes en 4 ciudades, todos cocinando el mismo menú.
- **Concurrente**: 1 cocinero que va friendo huevos de 3 pedidos, alternando.

---

## 🍳 Paralela: cuatro sartenes

Imagina que tienes que freír 4 huevos. Con **una sola sartén** (una CPU), los fríes de uno en uno o alternando: eso es *concurrencia*. Con **4 sartenes** (4 CPUs), los fríes los 4 a la vez: eso es *paralelismo real*.

En Python, el módulo `multiprocessing` crea procesos reales que el sistema operativo reparte entre los núcleos de tu CPU:

```python
# Paralela con multiprocessing (varios CPUs)
from multiprocessing import Pool
def cuadrado(n):
    return n * n

with Pool(4) as p:  # 4 procesos en paralelo
    print(p.map(cuadrado, [1, 2, 3, 4]))
```

**Salida:**
```
[1, 4, 9, 16]
```

Los 4 procesos se reparten la lista y cada uno calcula una parte. Si tu máquina tiene 4 núcleos, los 4 corren **a la vez**.

---

## 🏙️ Distribuida: varios restaurantes

La computación distribuida lleva la idea al límite: no varias CPUs de la misma máquina, sino **máquinas completas conectadas por red**, cada una con su memoria y su CPU. Es el modelo de los clústeres, la web y los servicios en la nube.

```
        ┌────────────┐   red   ┌────────────┐
        │ Servidor A │◄───────►│ Servidor B │
        └────────────┘         └────────────┘
              ▲                      ▲
              │        red           │
        ┌─────┴─────┐         ┌──────┴─────┐
        │ Servidor C│         │ Servidor D │
        └───────────┘         └────────────┘
```

Cada máquina ejecuta uno o varios procesos independientes. La distribución introduce un problema nuevo: **la comunicación por red** y **los fallos de máquina**. Eso lo verás en las unidades de sockets ([U04](/ApuntesPSP/04-sockets-tcp)) y de APIs REST ([U06](/ApuntesPSP/06-apis-rest-y-http)).

---

## ⚖️ CPUs vs máquinas

| Pregunta | Paralela | Distribuida |
|---|---|---|
| ¿Dónde se ejecuta? | Múltiples CPUs/núcleos de **una** máquina | Múltiples **máquinas** conectadas por red |
| ¿Comparten memoria? | Sí (misma máquina, memoria compartida) | No (cada máquina tiene la suya) |
| ¿Comunicación? | Pipes, memoria compartida, locks | Sockets, HTTP, mensajería |
| ¿Escala? | Hasta los núcleos de tu CPU | Hasta cientos de máquinas |
| Ejemplo en Python | `multiprocessing.Pool` | `socket`, APIs REST |

> 💡 El **GIL** de Python limita la concurrencia real de los hilos (lo verás en la [U02](/ApuntesPSP/02-hilos-fundamentos)); con **procesos** (`multiprocessing`) ese límite no existe porque cada proceso tiene su propio intérprete.

---

## 🧠 Mini-chequeo

1. ¿Cuál es la diferencia clave entre paralela y distribuida?
2. ¿Por qué el ejemplo del "cocinero alternando" es concurrencia y no paralelismo?
3. ¿Qué función de `multiprocessing` reparte una tarea entre varios procesos?

<details>
<summary>🔄 Respuestas</summary>

1. La paralela usa **varias CPUs de una misma máquina**; la distribuida usa **múltiples máquinas conectadas por red**.
2. Porque hay **una sola CPU/sartén**: las tareas **avanzan** turnándose, pero no se ejecutan a la vez.
3. `Pool(4).map(funcion, lista)`: crea 4 procesos y reparte la lista entre ellos.

</details>

---

## ✅ Resumen en 3 frases

- **Paralela** = varias CPUs a la vez; **distribuida** = varias máquinas por red; **concurrencia** = avanzar turnándose.
- `multiprocessing.Pool` reparte trabajo real entre los núcleos de tu CPU.
- La paralela comparte memoria y es interna a la máquina; la distribuida necesita red y comunicación por sockets/HTTP.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| Paralela | Varias tareas a la vez en varias CPUs |
| Distribuida | Varias tareas en varias máquinas por red |
| Concurrencia | Varias tareas avanzando, turnándose |
| multiprocessing | Módulo Python que crea procesos reales |
| Pool | Grupo de procesos que reparte tareas |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/01-procesos-y-subprocess) · **Anterior:** [02 · Estados de un proceso](/ApuntesPSP/01-procesos-y-subprocess/02-estados-de-un-proceso) · **Siguiente:** [04 · subprocess.run()](/ApuntesPSP/01-procesos-y-subprocess/04-subprocess-run)