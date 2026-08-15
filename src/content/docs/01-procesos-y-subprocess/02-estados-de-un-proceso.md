---
title: 02 — Estados de un proceso
description: "El ciclo de vida: de NUEVO a TERMINADO 🔄"
---

<p><small>El ciclo de vida: de NUEVO a TERMINADO 🔄</small></p>

> 🗺️ **Estás en:** 🚀 **U01 · Procesos y Subprocess** → 02 · Estados de un proceso

---

## 📬 La idea en una frase

> Un proceso no está siempre "ejecutándose": nace, espera su turno, usa la CPU, se bloquea esperando recursos y finalmente muere. Esos **cinco estados** forman su ciclo de vida.

El sistema operativo gestiona decenas o cientos de procesos a la vez con una sola CPU (o pocas). Para que todo parezca simultáneo, reparte la CPU en porciones de tiempo y cada proceso va pasando de estado según lo que le toca.

---

## 🔄 El ciclo de vida de un proceso

```
  ┌──────────┐
  │  NUEVO   │  ← El sistema crea el proceso
  └────┬─────┘
       ↓
  ┌──────────┐    ┌────────────┐
  │  LISTO   │←──→│ EJECUCIÓN  │
  └────┬─────┘    └──────┬─────┘
       │                  │
       ↓                  ↓
  ┌──────────┐    ┌──────────────┐
  │ BLOQUEADO│    │  TERMINADO   │
  └──────────┘    └──────────────┘
```

| Estado | Qué significa |
|--------|---------------|
| **NUEVO** | El proceso acaba de ser creado |
| **LISTO** | Preparado para ejecutar, esperando que la CPU esté libre |
| **EJECUCIÓN** | La CPU está ejecutando sus instrucciones |
| **BLOQUEADO** | Esperando un recurso (I/O, socket, sleep) |
| **TERMINADO** | El proceso ha finalizado |

---

## 🚦 Las transiciones, una a una

- **NUEVO → LISTO**: el proceso ya está cargado y espera su turno de CPU.
- **LISTO → EJECUCIÓN**: el planificador (*scheduler*) le entrega la CPU.
- **EJECUCIÓN → LISTO**: el planificador se la quita porque llega otro con más prioridad o por **time slice** (cada proceso tiene una porción de tiempo).
- **EJECUCIÓN → BLOQUEADO**: el proceso pide una operación de E/S (leer un archivo, esperar un socket, `time.sleep`) y no puede continuar hasta que llegue el dato.
- **BLOQUEADO → LISTO**: la E/S ha terminado y el proceso vuelve a la cola de preparados.
- **EJECUCIÓN → TERMINADO**: el proceso acaba (`return`, `sys.exit()`, o lo matan).

> 💡 **LISTO y BLOQUEADO no son lo mismo.** LISTO significa "puedo ejecutar, solo espero a que la CPU me toque". BLOQUEADO significa "no puedo ejecutar aunque me dieran la CPU: estoy esperando un recurso".

---

## 🍵 El ejemplo de la cafetería

Imagina una cola de gente en una cafetería con un único camarero:

- Entras por la puerta → **NUEVO**.
- Te pones en la cola → **LISTO** (esperando al camarero).
- El camarero te atiende → **EJECUCIÓN**.
- Pides un café y el camarero se va a la máquina → **BLOQUEADO** (esperando el recurso "café").
- El café está listo y vuelves a la cola → **LISTO**.
- El camarero te lo entrega → **EJECUCIÓN**.
- Pagas y te vas → **TERMINADO**.

El camarero (la CPU) alterna entre los clientes de la cola dando a cada uno unos segundos: por eso una sola CPU puede atender a muchos procesos "a la vez".

---

## 🧠 Mini-chequeo

1. ¿Qué diferencia hay entre LISTO y BLOQUEADO?
2. ¿Qué transición ocurre cuando un proceso llama a `time.sleep(2)`?
3. Un proceso está ejecutándose y el planificador le quita la CPU porque llega otro con más prioridad. ¿A qué estado pasa?

<details>
<summary>🔄 Respuestas</summary>

1. LISTO = "puedo ejecutar, solo espero a que la CPU me toque". BLOQUEADO = "estoy esperando un recurso y no puedo ejecutar aunque me dieran la CPU".
2. **EJECUCIÓN → BLOQUEADO**: el proceso pide una espera de E/S y se bloquea hasta que pasa el tiempo.
3. A **LISTO**: sigue preparado para ejecutar, solo ha perdido su turno de CPU.

</details>

---

## ✅ Resumen en 3 frases

- Un proceso recorre cinco estados: **NUEVO, LISTO, EJECUCIÓN, BLOQUEADO y TERMINADO**.
- LISTO y BLOQUEADO son distintos: uno espera CPU y el otro espera un recurso.
- El planificador reparte la CPU y por eso un solo procesador parece ejecutar muchos procesos a la vez.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| NUEVO | El proceso acaba de crearse |
| LISTO | Preparado, esperando que la CPU se libre |
| EJECUCIÓN | La CPU está ejecutando sus instrucciones |
| BLOQUEADO | Esperando un recurso (I/O, socket, sleep) |
| TERMINADO | El proceso ha finalizado |
| Planificador (scheduler) | Decide qué proceso LISTO pasa a EJECUCIÓN |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/01-procesos-y-subprocess) · **Anterior:** [01 · Qué es un proceso](/ApuntesPSP/01-procesos-y-subprocess/01-que-es-un-proceso) · **Siguiente:** [03 · Paralela vs Distribuida](/ApuntesPSP/01-procesos-y-subprocess/03-paralela-vs-distribuida)