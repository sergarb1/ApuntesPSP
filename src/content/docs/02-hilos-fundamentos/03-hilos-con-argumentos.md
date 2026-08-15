---
title: 03 — Hilos con argumentos
description: Pasa datos al hilo con args y kwargs, y ponle nombre a cada hilo 📇
---

<p><small>Pasa datos al hilo con args y kwargs, y ponle nombre a cada hilo 📇</small></p>

> 🗺️ **Estás en:** 🔀 **U02 · Hilos Fundamentos** → 03 · Hilos con argumentos

---

## 📬 La idea en una frase

> Para que un hilo trabaje con datos propios le pasas argumentos en `args=` (tupla) o `kwargs=` (diccionario), y para distinguirlo le pones nombre con `.name`.

Sin argumentos, todos los hilos harían exactamente lo mismo. Con `args` y `kwargs`, cada hilo puede hacer su versión del trabajo. Y con `.name`, puedes saber en cada momento *quién* está haciendo qué.

---

## 🎒 Pasar argumentos con args

La función que ejecuta el hilo puede recibir argumentos: se los pasas en `args=` como una **tupla**, en el mismo orden que espera la función.

```python
import threading

def trabajar(nombre, tarea):
    print(f"{nombre} empezando: {tarea}")
    # ... trabajo ...
    print(f"{nombre} terminó: {tarea}")

# Crear hilos con nombre y argumentos
hilo_a = threading.Thread(target=trabajar, args=("Ana", "lavar platos"))
hilo_b = threading.Thread(target=trabajar, args=("Bob", "fregar suelo"))

# Lanzarlos
hilo_a.start()
hilo_b.start()

# Esperar
hilo_a.join()
hilo_b.join()
```

**Salida (orden no garantizado):**
```
Ana empezando: lavar platos
Bob empezando: fregar suelo
Ana terminó: lavar platos
Bob terminó: fregar suelo
```

> ⚠️ **Truco de la coma:** una tupla de un solo elemento necesita coma final: `args=("Ana",)`. Sin la coma, `("Ana")` es solo un string, no una tupla, y `trabajar` recibiría un solo argumento.

---

## 🎁 kwargs: argumentos con nombre

Si tu función usa parámetros con nombre, puedes pasarlos con `kwargs=` en forma de diccionario.

```python
import threading

def preparar(plato, minutos):
    print(f"Preparando {plato}: tarda {minutos} min")

hilo = threading.Thread(
    target=preparar,
    kwargs={"plato": "paella", "minutos": 40}
)
hilo.start()
hilo.join()
```

**Salida:**
```
Preparando paella: tarda 40 min
```

Puedes mezclar ambos: `args=("Ana",)` y `kwargs={"tarea": "limpiar"}` si la función recibe `(nombre, tarea=...)`. Lo importante es que el orden de `args` coincide con los parámetros posicionales, y `kwargs` con los de nombre.

---

## 📇 Nombrar hilos: `.name = "hilo-" + str(n)`

Cuando lanzas varios hilos iguales, ¿cómo sabes cuál es cuál? Poniéndoles nombre. La forma clásica es generarlos con un nombre único dentro de un bucle:

```python
import threading

def trabajar(n):
    print(f"🌱 {threading.current_thread().name}: trabajando ({n})")
    # ... trabajo ...
    print(f"🏁 {threading.current_thread().name}: terminado ({n})")

hilos = []
for i in range(1, 4):
    h = threading.Thread(target=trabajar, args=(i,))
    h.name = "hilo-" + str(i)   # 📇 nombre único
    hilos.append(h)

for h in hilos:
    h.start()
for h in hilos:
    h.join()
```

**Salida (orden no garantizado):**
```
🌱 hilo-1: trabajando (1)
🌱 hilo-2: trabajando (2)
🌱 hilo-3: trabajando (3)
🏁 hilo-1: terminado (1)
🏁 hilo-3: terminado (3)
🏁 hilo-2: terminado (2)
```

Fíjate en los detalles:

- `h.name = "hilo-" + str(i)` asigna un **nombre único** a cada hilo antes de lanzarlo.
- Dentro de la función, `threading.current_thread().name` devuelve el nombre del hilo que está ejecutando.
- Los `print` **se entremezclan**: el orden exacto lo decide el scheduler del sistema operativo, no nosotros.

> 💡 También puedes poner el nombre directamente al crear: `threading.Thread(target=trabajar, args=(i,), name="hilo-" + str(i))`. El resultado es idéntico.

---

## 👨‍👩‍👧 Varios hilos a la vez

Con una **lista por comprensión** puedes crear y lanzar N hilos en tres líneas. Es el patrón que usarás toda la unidad (y en los servidores concurrentes de la U10):

```python
import threading

def tarea(n):
    print(f"{threading.current_thread().name} → tarea {n}")

hilos = [threading.Thread(target=tarea, args=(i,), name="hilo-" + str(i))
         for i in range(1, 5)]

for h in hilos:
    h.start()
for h in hilos:
    h.join()

print("Todas las tareas terminadas")
```

**Salida (orden no garantizado):**
```
hilo-1 → tarea 1
hilo-3 → tarea 3
hilo-2 → tarea 2
hilo-4 → tarea 4
Todas las tareas terminadas
```

El mensaje final **siempre aparece el último** gracias a los dos bucles: primero lanzas todos, luego esperas a todos con `join()`.

---

## 🧠 Mini-chequeo

1. ¿Qué le pasas a `args=`? ¿Y a `kwargs=`?
2. ¿Por qué hace falta la coma en `args=("Ana",)`?
3. ¿Cómo sabes, dentro de la función del hilo, el nombre del hilo que te está ejecutando?

<details>
<summary>🔄 Respuestas</summary>

1. A `args=` una **tupla** con los argumentos posicionales (`("Ana", "lavar platos")`); a `kwargs=` un **diccionario** con los argumentos con nombre (`{"plato": "paella"}`).
2. Porque `("Ana")` sin coma es solo un string, no una tupla. Con la coma, Python entiende que quieres una tupla de un elemento.
3. Con `threading.current_thread().name`: devuelve el objeto Thread que te está ejecutando, y su `.name`.

</details>

---

## ✅ Resumen en 3 frases

- Los argumentos del hilo se pasan con `args=` (tupla) o `kwargs=` (diccionario), en el orden o con el nombre que espera la función.
- Con `.name = "hilo-" + str(n)` cada hilo lleva un nombre único que puedes leer con `threading.current_thread().name`.
- El patrón lista por comprensión + `for h in hilos: h.start()` + `for h in hilos: h.join()` lanza N hilos a la vez y espera a todos.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| args | Tupla de argumentos posicionales que recibe la función del hilo |
| kwargs | Diccionario de argumentos con nombre que recibe la función |
| .name | Nombre del hilo, único para distinguirlo |
| current_thread() | El objeto Thread del hilo que se está ejecutando |
| Lista por comprensión | Forma compacta de crear N hilos en una línea |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/02-hilos-fundamentos) · **Anterior:** [02 · Tu primer hilo](/ApuntesPSP/02-hilos-fundamentos/02-primer-hilo) · **Siguiente:** [04 · Hilos daemon](/ApuntesPSP/02-hilos-fundamentos/04-hilos-daemon)