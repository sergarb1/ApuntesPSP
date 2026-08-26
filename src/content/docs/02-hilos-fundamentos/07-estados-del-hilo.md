---
title: 07 — Estados del hilo
description: El ciclo de vida de un hilo, de nuevo a terminado 🔄
---

<p><small>El ciclo de vida de un hilo, de nuevo a terminado 🔄</small></p>

> 🗺️ **Estás en:** 🔀 **U02 · Hilos Fundamentos** → 07 · Estados del hilo

---

## 📬 La idea en una frase

> Un hilo nace como objeto, se lanza con `start()`, espera su turno, se ejecuta, se bloquea cuando espera algo y termina cuando su función acaba: ese es su ciclo de vida.

Cada hilo pasa por estados, igual que una persona pasa por situaciones a lo largo del día. Saber en qué estado está un hilo (o cuándo lo estará) es clave para entender por qué un programa se comporta como se comporta.

---

## 🔄 El diagrama del ciclo de vida

```
  ┌──────────────┐
  │    NUEVO     │  ← Thread creado, no start()
  └──────┬───────┘
         ↓ start()
  ┌──────────────┐
  │  EJECUTABLE  │  ← Puede ejecutar cuando el scheduler quiera
  └──────┬───────┘
         ↓
  ┌──────────────┐     ┌──────────────┐
  │  EJECUCIÓN   │←───→│  BLOQUEADO   │
  └──────┬───────┘     └──────────────┘
         ↓               (sleep, I/O, lock)
  ┌──────────────┐
  │  TERMINADO   │  ← run() terminó
  └──────────────┘
```

---

## 🗺️ Los estados, uno a uno

| Estado | Significado |
|--------|-------------|
| **NUEVO** | El objeto Thread existe pero no se ha llamado a `start()` |
| **EJECUTABLE** | `start()` llamado. Puede ejecutar en cualquier momento |
| **EJECUCIÓN** | El scheduler le ha dado la CPU: está ejecutando su código ahora mismo |
| **BLOQUEADO** | Esperando (sleep, I/O, un lock) |
| **TERMINADO** | El método `run()` ha terminado |

**Recorrido completo de un hilo típico:**

1. **NUEVO** — `threading.Thread(target=fn)` crea el objeto. Todavía no se ejecuta nada.
2. **EJECUTABLE** — `h.start()` lo lanza. A partir de aquí el scheduler del sistema operativo decide *cuándo* le toca.
3. **EJECUCIÓN** — Le toca: ejecuta su código. Puede volver a EJECUTABLE cuando el scheduler decide dar paso a otro hilo.
4. **BLOQUEADO** — El hilo se queda esperando: un `time.sleep()`, una lectura de red, una espera de I/O o (en el TEMA 03) un lock. Cuando lo que espera se libera, vuelve a EJECUTABLE.
5. **TERMINADO** — La función que ejecutaba el hilo acaba. Su `run()` terminó y no volverá a ejecutarse.

---

## 🧍 El estado BLOQUEADO, el más importante

En la práctica, el estado que más vemos es **BLOQUEADO**, y casi siempre por dos motivos:

- **`time.sleep(n)`** — el hilo pide "no me des CPU durante n segundos" (lo usaste en los [puntos 2](/ApuntesPSP/02-hilos-fundamentos/02-primer-hilo) y [4](/ApuntesPSP/02-hilos-fundamentos/04-hilos-daemon)).
- **Espera de I/O** — descarga, lectura de archivo, esperar un socket (del TEMA 04 para allá).

Mientras un hilo está BLOQUEADO, **libera la CPU** (y, como viste en el [punto 6](/ApuntesPSP/02-hilos-fundamentos/06-gil), también el GIL): otro hilo puede ejecutar. Es exactamente el mecanismo que hace rápidas las tareas I/O-bound.

> 💡 `sleep(0)` es un caso curioso: cede la CPU **voluntariamente** sin esperar nada, solo para dar paso a otro hilo. Es una "buena práctica" en hilos cooperativos.

---

## 🕐 ¿Cuándo termina un hilo?

Un hilo llega a **TERMINADO** cuando su función acaba (o si lanza una excepción no capturada). Y aquí entra el matiz del [punto 4](/ApuntesPSP/02-hilos-fundamentos/04-hilos-daemon):

- Un hilo **no daemon** que llega a TERMINADO es requisito para que el programa principal pueda salir.
- Un hilo **daemon** puede ser cortado en seco por el final del programa principal, aunque esté en EJECUCIÓN o BLOQUEADO: muere sin llegar "bien" a TERMINADO.

Puedes comprobar si un hilo sigue vivo en cada momento con `hilo.is_alive()`:

```python
import threading, time

def corto():
    time.sleep(1)

h = threading.Thread(target=corto)
print(f"Antes de start: {h.is_alive()}")   # False (estado NUEVO)
h.start()
print(f"Justo tras start: {h.is_alive()}") # True (EJECUTABLE/EJECUCIÓN)
h.join()
print(f"Tras join: {h.is_alive()}")        # False (TERMINADO)
```

**Salida:**
```
Antes de start: False
Justo tras start: True
Tras join: False
```

---

## 🧠 Mini-chequeo

1. ¿En qué estado está un hilo justo después de crearlo pero antes de `start()`?
2. ¿Qué ocurre cuando un hilo en EJECUCIÓN llama a `time.sleep(2)`?
3. ¿Puede un hilo volver de BLOQUEADO a EJECUCIÓN sin pasar por EJECUTABLE?

<details>
<summary>🔄 Respuestas</summary>

1. **NUEVO**: el objeto existe, pero sin `start()` no ha empezado a ejecutar nada.
2. Pasa a **BLOQUEADO** durante 2 segundos, liberando la CPU (y el GIL). Al despertar vuelve a EJECUTABLE para que el scheduler le dé su turno.
3. No exactamente: al desbloquearse vuelve a **EJECUTABLE** y espera a que el scheduler le conceda la CPU para pasar a EJECUCIÓN. Siempre pasa por EJECUTABLE.

</details>

---

## ✅ Resumen en 3 frases

- El ciclo de vida de un hilo es **NUEVO → EJECUTABLE → EJECUCIÓN ⇄ BLOQUEADO → TERMINADO**.
- **BLOQUEADO** es el estado de las esperas (sleep, I/O, lock): al bloquearse, el hilo libera la CPU y el GIL.
- `is_alive()` te dice en vivo si el hilo todavía se está ejecutando o ya terminó.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| NUEVO | Hilo creado, sin `start()` todavía |
| EJECUTABLE | `start()` llamado, esperando turno del scheduler |
| EJECUCIÓN | El hilo tiene la CPU y está ejecutando código |
| BLOQUEADO | Esperando: sleep, I/O o un lock |
| TERMINADO | La función del hilo ha acabado |
| Scheduler | Componente del SO que decide qué hilo ejecuta |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/02-hilos-fundamentos) · **Anterior:** [06 · El GIL](/ApuntesPSP/02-hilos-fundamentos/06-gil) · **Siguiente:** [08 · Hilos en la práctica](/ApuntesPSP/02-hilos-fundamentos/08-hilos-en-la-practica)