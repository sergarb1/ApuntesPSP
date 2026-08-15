---
title: 06 — Backoff
description: Reintentos con espera exponencial (1, 2, 4, 8…) 📈
---

<p><small>Reintentos con espera exponencial (1, 2, 4, 8…) 📈</small></p>

> 🗺️ **Estás en:** ⏱️ **U11 · asyncio y Disponibilidad** → 06 · Backoff

---

## 📬 La idea en una frase

> El **backoff exponencial** reintenta una conexión fallida esperando cada vez más: 1s, 2s, 4s, 8s... Así no machacas a un servidor que ya está teniendo problemas.

---

## 📈 El problema: reintentar sin piedad

Un cliente que falla y reintenta en bucle cerrado cada milisegundo puede **tumbar** un servidor ya debilitado: cada intento añade carga. La solución: esperar cada vez más entre intentos.

```python
import asyncio

async def conectar_con_backoff(host, port, max_intentos=5):
    for intento in range(max_intentos):
        try:
            reader, writer = await asyncio.wait_for(
                asyncio.open_connection(host, port),
                timeout=3
            )
            print(f"✅ Conectado a {host}:{port}")
            return reader, writer
        except (asyncio.TimeoutError, ConnectionRefusedError):
            espera = 2 ** intento  # 1, 2, 4, 8, 16 segundos
            print(f"⚠️ Intento {intento+1} fallido. Esperando {espera}s...")
            await asyncio.sleep(espera)

    raise Exception("No se pudo conectar")
```

La espera sigue la secuencia **2⁰, 2¹, 2², 2³, 2⁴ = 1, 2, 4, 8, 16 segundos**. Un fallo puntual se resuelve en el intento 2 con solo 1s de espera; un servidor caído de verdad no recibe 5 peticiones seguidas: recibe 5 con descanso creciente. El `wait_for(..., timeout=3)` añade además un tope por intento (el [punto 4](/ApuntesPSP/11-asyncio-y-disponibilidad/04-timeouts)).

---

## 🔢 La secuencia del backoff

| Intento | Espera (2 ** intento) | Acumulado |
|---|---|---|
| 0 | 1s | 1s |
| 1 | 2s | 3s |
| 2 | 4s | 7s |
| 3 | 8s | 15s |
| 4 | 16s | 31s |

> El **backoff exponencial** evita saturar un servidor que ya está teniendo problemas. Es la diferencia entre "un cliente molesto" y "un cliente que remata al servidor".

---

## 🧠 Mini-chequeo

1. ¿Qué secuencia de espera genera `2 ** intento` con 4 reintentos?
2. ¿Qué dos excepciones captura el ejemplo?
3. ¿Por qué es mejor que reintentar sin espera?

<details>
<summary>🔄 Respuestas</summary>

1. **1, 2, 4, 8 segundos** (y el siguiente sería 16).
2. **`asyncio.TimeoutError`** (el `wait_for` de 3s) y **`ConnectionRefusedError`** (el servicio no escucha).
3. Porque **no machaca al servidor caído**: con espera creciente le das tiempo a recuperarse y a la vez no abandonas. Si se reintenta a saco, se puede hundir el servicio.

</details>

---

## ✅ Resumen en 3 frases

- El backoff exponencial reintenta con **espera creciente** (`2 ** intento`).
- Se combina con `wait_for` para que cada intento tenga también un **timeout**.
- Es el segundo mecanismo de disponibilidad: el cliente que **aguanta sin machacar**.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| Backoff | Reintento con espera creciente entre intentos |
| 2 ** intento | Fórmula de la espera: 1, 2, 4, 8, 16… |
| ConnectionRefusedError | El servicio no escucha en ese puerto |
| Reintento | Nueva tentativa tras un fallo |
| Jitter (variación) | Añadir aleatoriedad a la espera para evitar avalanchas (tema avanzado) |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/11-asyncio-y-disponibilidad) · **Anterior:** [05 · Heartbeat](/ApuntesPSP/11-asyncio-y-disponibilidad/05-heartbeat) · **Siguiente:** [07 · Threads vs asyncio](/ApuntesPSP/11-asyncio-y-disponibilidad/07-threads-vs-asyncio)