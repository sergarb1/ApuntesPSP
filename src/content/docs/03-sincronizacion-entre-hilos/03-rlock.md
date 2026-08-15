---
title: 03 — RLock
description: Cuando el mismo hilo quiere entrar dos veces 🔁
---

<p><small>Cuando el mismo hilo quiere entrar dos veces 🔁</small></p>

> 🗺️ **Estás en:** 🔒 **U03 · Sincronización entre Hilos** → 03 · RLock

---

## 📬 La idea en una frase

> Un **Lock normal no es reentrante**: si el mismo hilo intenta adquirirlo dos veces, se espera a sí mismo y se produce un **deadlock**. Un **RLock** (Reentrant Lock) sí permite que el mismo hilo lo adquiera varias veces antes de liberarlo.

Recuerda el [punto 2](/ApuntesPSP/03-sincronizacion-entre-hilos/02-lock): `acquire()` bloquea "si otro hilo lo tiene". El problema es que el Lock no distingue entre "otro hilo" y "yo mismo".

```python
import threading

# Lock normal — DEADLOCK si el mismo hilo intenta adquirirlo dos veces
lock = threading.Lock()
lock.acquire()
lock.acquire()  # ⚠️ El hilo se espera a sí mismo → DEADLOCK

# RLock — el mismo hilo puede adquirirlo varias veces
rlock = threading.RLock()
rlock.acquire()  # ok
rlock.acquire()  # ok (mismo hilo)
rlock.release()
rlock.release()
```

Con el `Lock` normal, la segunda `acquire()` nunca vuelve: el hilo espera a que se libere un lock que él mismo tiene puesto. **El hilo se espera a sí mismo.** Con `RLock`, cada `acquire()` incrementa un contador interno y cada `release()` lo decrementa: el lock solo se libera de verdad cuando el contador llega a 0.

---

## 🧵 ¿Cuándo lo necesitas? Funciones que se llaman entre sí

El caso más típico: una función que adquiere el lock y llama a **otra función que también quiere el mismo lock**.

```python
import threading

rlock = threading.RLock()

def depositar(cuenta, cantidad):
    with rlock:
        # Aquí se llama a otra función que también usa el lock
        registrar_operacion("ingreso", cantidad)
        cuenta[0] += cantidad

def registrar_operacion(tipo, cantidad):
    with rlock:            # ✅ mismo hilo, RLock lo permite
        print(f"📝 {tipo}: {cantidad} €")

cuenta = [100]
depositar(cuenta, 50)
print(f"Saldo: {cuenta[0]} €")
```

Si `registrar_operacion` usara un `Lock` normal, `depositar` tendría el lock puesto y la segunda `acquire()` se bloquearía para siempre. Con `RLock`, las dos adquisiciones son del **mismo hilo** y funcionan.

> 💡 `RLock` también es tu aliado si la función se llama a sí misma (recursión) y cada llamada toca la sección crítica.

---

## ⚖️ Lock vs RLock

| Aspecto | Lock | RLock |
|---|---|---|
| ¿Otro hilo puede adquirirlo? | Sí, cuando se libera | Sí, cuando se libera |
| ¿El mismo hilo puede adquirirlo dos veces? | ❌ Deadlock | ✅ Sí (contador interno) |
| ¿Cuándo se libera de verdad? | En el primer `release()` | Cuando los `release()` igualan a los `acquire()` |
| Uso típico | Sección crítica simple | Funciones que se llaman entre sí / recursión |
| Coste | Mínimo | Mínimo (un poco más de contabilidad) |

> ⚠️ **Regla:** usa `Lock` por defecto. Solo cambia a `RLock` cuando de verdad el mismo hilo necesite adquirirlo más de una vez (funciones que se llaman entre sí). Un `RLock` no evita que dos hilos distintos se pisen: para eso siguen valiendo las mismas reglas del [punto 2](/ApuntesPSP/03-sincronizacion-entre-hilos/02-lock).

---

## 🧠 Mini-chequeo

1. ¿Qué le pasa a un `Lock` normal si el mismo hilo intenta adquirirlo dos veces?
2. ¿Cómo evita el `RLock` ese problema?
3. ¿Cuándo cambiarías de `Lock` a `RLock`?

<details>
<summary>🔄 Respuestas</summary>

1. Se produce un **deadlock**: el hilo se espera a sí mismo, porque la segunda `acquire()` espera a que se libere un lock que él mismo tiene puesto.
2. Mantiene un **contador interno**: cada `acquire()` lo sube y cada `release()` lo baja. El lock solo se libera para otros cuando el contador vuelve a 0.
3. Cuando una función que ya tiene el lock llama a otra función que también lo adquiere (funciones que se llaman entre sí o recursión). Para el resto, el `Lock` simple basta.
</details>

---

## ✅ Resumen en 3 frases

- El `Lock` normal no es reentrante: el mismo hilo que lo adquiere dos veces se bloquea a sí mismo (deadlock).
- El `RLock` lleva un contador interno y permite que el mismo hilo lo adquiera varias veces, liberándose cuando el contador vuelve a 0.
- Úsalo en funciones que se llaman entre sí o en recursión; para el resto, `Lock` por defecto.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| RLock | Lock reentrante: el mismo hilo puede adquirirlo varias veces |
| Reentrante | Capaz de volver a adquirirse por quien ya lo tiene |
| Contador interno | Nº de `acquire()` sin `release()`; a 0 se libera |
| Deadlock | Hilo que espera un recurso que él mismo tiene |
| Recursión | Función que se llama a sí misma |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/03-sincronizacion-entre-hilos) · **Anterior:** [02 · Lock](/ApuntesPSP/03-sincronizacion-entre-hilos/02-lock) · **Siguiente:** [04 · Semaphore](/ApuntesPSP/03-sincronizacion-entre-hilos/04-semaphore)