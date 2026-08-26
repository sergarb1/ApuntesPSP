---
title: 04 — Hilos daemon
description: Hilos de fondo que se sacrifican para que el programa pueda salir 😈
---

<p><small>Hilos de fondo que se sacrifican para que el programa pueda salir 😈</small></p>

> 🗺️ **Estás en:** 🔀 **U02 · Hilos Fundamentos** → 04 · Hilos daemon

---

## 📬 La idea en una frase

> Un hilo **daemon** se ejecuta en segundo plano y **se mata automáticamente** cuando el programa principal termina. Los no-daemon, en cambio, impiden que el programa salga hasta terminar.

Imagina una alarma de incendios: la quieres encendida mientras el edificio está vivo, pero si el edificio desaparece, la alarma no tiene sentido y muere con él. Esa es la filosofía del hilo daemon.

---

## 😈 ¿Qué es un hilo daemon?

Un hilo **daemon** (diablo) es un hilo de fondo pensado para tareas auxiliares: monitorizar, limpiar, emitir un heartbeat, mostrar un reloj… La regla de oro:

- Un hilo **no daemon** (por defecto) impide que el programa termine hasta que él acabe.
- Un hilo **daemon** se corta en seco cuando el programa principal llega al final, sin esperar a nada.

```python
import threading, time

def reloj():
    """Imprime la hora cada segundo (por siempre)"""
    while True:
        print(f"⏰ {time.strftime('%H:%M:%S')}")
        time.sleep(1)

hilo_reloj = threading.Thread(target=reloj, daemon=True)
hilo_reloj.start()

time.sleep(3)  # El programa principal dura 3 segundos
print("Programa principal terminando...")
# Al terminar, el hilo daemon se mata solo
```

**Salida:**
```
⏰ 14:35:22
⏰ 14:35:23
⏰ 14:35:24
Programa principal terminando...
```

El reloj es un `while True`: nunca terminaría. Si no fuera daemon, el programa se quedaría colgado para siempre esperándolo. Siendo daemon, el programa principal hace su vida, y al terminar **el hilo muere con él**.

| Tipo | Comportamiento |
|------|----------------|
| `daemon=False` (defecto) | El programa espera a que termine |
| `daemon=True` | El programa lo mata al salir |

> Los hilos **no daemon** impiden que el programa termine. Los daemon se sacrifican para que el programa pueda salir.

---

## 🪂 Be the code, my friend — daemon en acción

Vamos a ser el código. El mismo trabajador de 5 pasos, primero sin daemon y luego con él.

**SIN daemon — el programa espera:**

```python
import threading, time

def trabajador():
    for i in range(5):
        print(f"Trabajando... ({i+1}/5)")
        time.sleep(0.5)
    print("Trabajador terminó")

# SIN daemon — el programa espera
h1 = threading.Thread(target=trabajador)
h1.start()
h1.join()
print("Programa terminó (después del hilo)")
```

**Salida:**
```
Trabajando... (1/5)
Trabajando... (2/5)
Trabajando... (3/5)
Trabajando... (4/5)
Trabajando... (5/5)
Trabajador terminó
Programa terminó (después del hilo)
```

El hilo hace sus 5 pasos completos y **recién después** el programa principal termina.

**CON daemon — el hilo se mata al salir:**

```python
# CON daemon — el hilo se mata al salir
h2 = threading.Thread(target=trabajador, daemon=True)
h2.start()
time.sleep(1.2)
print("Programa terminó (el hilo daemon muere conmigo)")
```

**Salida:**
```
Trabajando... (1/5)
Trabajando... (2/5)
Trabajando... (3/5)
Programa terminó (el hilo daemon muere conmigo)
```

> El daemon solo llegó a la iteración 3. El programa principal terminó y lo mató. Fíjate: no hay `join()` aquí, porque no queremos esperarlo; justo lo contrario.

---

## 🥊 El ring de los conceptos — Hilo normal vs Hilo daemon

**Hilo Normal**: — Yo soy un hilo de verdad. El programa principal espera a que termine lo que tengo que hacer. Tengo responsabilidad.

**Hilo Daemon**: — ¡Qué aburrido! Yo soy libre. Mi única misión es servir en segundo plano. Cuando el programa principal termina, yo me muero con él, sin dramas.

**Hilo Normal**: — ¿Y si estás en medio de algo importante cuando el main termina? Pierdes datos, dejas cosas a medias...

**Hilo Daemon**: — Para eso existen los daemon bien hechos: tareas de monitorización, limpieza, heartbeat... cosas que da igual si se cortan. Si quieres garantía de finalización, usas un hilo normal con `join()`.

**Hilo Normal**: — Cierto. Al final, cada uno tiene su sitio. Yo para tareas críticas, tú para servicios auxiliares.

> **Moraleja**: Usa hilos **daemon** para servicios de fondo prescindibles. Usa hilos **normales** con `join()` para tareas que deben completarse sí o sí.

---

## ⏳ join() para esperar a un daemon (si acaso lo necesitas)

Un daemon se mata solo al final… pero también puedes esperarlo explícitamente con `join()` si quieres que termine *antes* de que el programa siga. El `join()` funciona igual: bloquea hasta que el hilo termina. Con un daemon infinito (`while True`) eso significa esperar para siempre, así que solo tiene sentido con daemons finitos o con `join(timeout)`:

```python
import threading, time

def aviso():
    time.sleep(2)
    print("Aviso listo")

h = threading.Thread(target=aviso, daemon=True)
h.start()
h.join(timeout=3)   # espera como mucho 3 segundos
print("Continuamos...")
```

`join(timeout=N)` espera un máximo de N segundos: si el hilo no ha terminado, el programa sigue igual. Es la herramienta perfecta para no quedarse bloqueado.

---

## 🧠 Mini-chequeo

1. ¿Un hilo daemon impide que el programa termine?
2. ¿Cuándo usarías `daemon=True` en lugar de un hilo normal?
3. ¿Qué hace `join(timeout=2)` si el hilo tarda 5 segundos?

<details>
<summary>🔄 Respuestas</summary>

1. **No.** Un daemon se mata automáticamente cuando el programa principal termina. Quien impide que el programa termine es el hilo **no daemon**.
2. Para **servicios de fondo prescindibles**: monitorización, limpieza, heartbeat, un reloj… Si el programa acaba, da igual que se corten. Si la tarea debe completarse sí o sí, hilo normal con `join()`.
3. Espera 2 segundos como máximo y luego **continúa**, aunque el hilo siga vivo a los 5. `is_alive()` te diría que todavía se está ejecutando.

</details>

---

## ✅ Resumen en 3 frases

- Un hilo **daemon** se ejecuta en segundo plano y se **mata al terminar** el programa principal.
- Un hilo **normal** impide que el programa salga hasta completarse; por eso las tareas críticas van con `join()`.
- Regla: daemon para servicios auxiliares prescindibles, normal para lo que debe terminarse sí o sí.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| Hilo daemon | Hilo de fondo que muere cuando termina el programa principal |
| daemon=True | Flag que convierte un hilo en daemon |
| Hilo normal | Hilo que el programa principal espera antes de salir |
| join(timeout) | Espera al hilo un máximo de segundos y sigue |
| Heartbeat | Señal periódica de "sigo vivo", típica de hilos daemon |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/02-hilos-fundamentos) · **Anterior:** [03 · Hilos con argumentos](/ApuntesPSP/02-hilos-fundamentos/03-hilos-con-argumentos) · **Siguiente:** [05 · Timer](/ApuntesPSP/02-hilos-fundamentos/05-timer)