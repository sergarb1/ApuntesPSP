---
title: 05 — Timer
description: Ejecuta una función una sola vez después de un retardo ⏰
---

<p><small>Ejecuta una función una sola vez después de un retardo ⏰</small></p>

> 🗺️ **Estás en:** 🔀 **U02 · Hilos Fundamentos** → 05 · Timer

---

## 📬 La idea en una frase

> `threading.Timer(retardo, funcion)` ejecuta `funcion` **una sola vez** después de `retardo` segundos, sin bloquear el resto del programa.

El `Timer` es un hilo especial que en vez de empezar a trabajar ya, se queda "dormido" el tiempo que le digas y entonces dispara la función. Es la manera más sencilla de programar un aviso diferido.

---

## ⏰ El ejemplo mínimo

```python
import threading

def aviso():
    print("⏰ ¡Tiempo cumplido!")

temporizador = threading.Timer(5.0, aviso)
temporizador.start()
print("Timer iniciado, 5 segundos...")

# temporizador.cancel()  # Si queremos cancelar
```

**Salida:**
```
Timer iniciado, 5 segundos...
⏰ ¡Tiempo cumplido!
```

El `print("Timer iniciado...")` sale **inmediatamente**: el programa no se queda bloqueado esperando. Cinco segundos después, el Timer dispara `aviso()` por su cuenta, como un hilo más.

> `Timer` ejecuta la función **una sola vez** después del retardo. No se repite. Si lo que quieres es repetirlo cada N segundos, la forma clásica es que la propia función se reprograme (lo retocamos en el boletín avanzado).

---

## 🧭 Cancelar un Timer

Como el Timer es un hilo, puedes cancelarlo antes de que dispare con `.cancel()`:

```python
import threading, time

def aviso():
    print("⏰ ¡Tiempo cumplido!")

t = threading.Timer(5.0, aviso)
t.start()

time.sleep(2)
t.cancel()          # cancelamos antes de los 5 segundos
print("Cancelado: el aviso nunca llegará")
```

**Salida:**
```
Cancelado: el aviso nunca llegará
```

`cancel()` funciona si el Timer todavía no ha disparado. Una vez disparado, ya no tiene sentido: la función ya se ejecutó.

---

## 🎁 Pasar argumentos al Timer

El Timer admite los mismos `args`/`kwargs` que cualquier hilo:

```python
import threading

def recordatorio(mensaje, veces):
    for _ in range(veces):
        print(f"📌 {mensaje}")

t = threading.Timer(3.0, recordatorio, args=("¡Beber agua!", 3))
t.start()
print("Recordatorio programado en 3 segundos...")
```

**Salida:**
```
Recordatorio programado en 3 segundos...
📌 ¡Beber agua!
📌 ¡Beber agua!
📌 ¡Beber agua!
```

---

## 💡 Usos típicos del Timer

| Uso | Ejemplo |
|---|---|
| Despertador / aviso | "¡Despierta!" a los 3 segundos |
| Recordatorio | Un mensaje que aparece al pasar un rato |
| Timeout de una operación | Cancelar algo que tarda demasiado |
| Cierre de sesión | Desconectar a un usuario tras N segundos de inactividad |
| Limpieza diferida | Borrar un archivo temporal después de un tiempo |

Un detalle a recordar: el `Timer` dispara desde un **hilo aparte**. Si tu programa principal termina antes de que dispare y el Timer es **daemon por defecto** (`Timer(..., daemon=True)`), el aviso puede morir con el programa. Si lo necesitas sí o sí, haz `daemon=False` o añade un `time.sleep()` en el principal.

---

## 🧠 Mini-chequeo

1. ¿Cuántas veces ejecuta el Timer la función?
2. ¿El programa principal se bloquea mientras espera el retardo?
3. ¿Qué hace `t.cancel()`?

<details>
<summary>🔄 Respuestas</summary>

1. **Una sola vez.** Tras el retardo ejecuta la función una vez y termina. No se repite por defecto.
2. **No.** El Timer corre en su propio hilo; el programa principal sigue con lo suyo y recibe el aviso cuando toca.
3. Cancela el Timer **antes** de que dispare, de modo que la función nunca llega a ejecutarse. Una vez disparado, `cancel()` no tiene efecto.

</details>

---

## ✅ Resumen en 3 frases

- `threading.Timer(retardo, funcion)` ejecuta la función **una sola vez** después del retardo, sin bloquear el programa.
- Puedes pasar argumentos con `args=`/`kwargs=` y cancelar el disparo con `.cancel()`.
- Es ideal para avisos, recordatorios y timeouts; si quieres repetición, la función debe reprogramarse a sí misma.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| threading.Timer | Hilo que dispara una función tras un retardo |
| Retardo | Segundos que espera el Timer antes de ejecutar |
| cancel() | Cancela el disparo si aún no ha ocurrido |
| args / kwargs | Argumentos que recibe la función del Timer |
| Una sola vez | Comportamiento del Timer: no se repite por defecto |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/02-hilos-fundamentos) · **Anterior:** [04 · Hilos daemon](/ApuntesPSP/02-hilos-fundamentos/04-hilos-daemon) · **Siguiente:** [06 · El GIL](/ApuntesPSP/02-hilos-fundamentos/06-gil)