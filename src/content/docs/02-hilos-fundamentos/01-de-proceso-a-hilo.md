---
title: 01 — De proceso a hilo
description: Qué es un hilo y en qué se diferencia de un proceso 🧵
---

<p><small>Qué es un hilo y en qué se diferencia de un proceso 🧵</small></p>

> 🗺️ **Estás en:** 🔀 **U02 · Hilos Fundamentos** → 01 · De proceso a hilo

---

## 📬 La idea en una frase

> Un **hilo** es la unidad más pequeña de ejecución: una tarea que vive *dentro* de un proceso y comparte su memoria con los demás hilos de ese proceso.

En la U01 lanzaste procesos: programas completos con su propia memoria, su propio PID y su propio estado. Ahora entramos a un nivel más fino: un solo proceso puede tener **varios hilos ejecutándose a la vez**, todos trabajando con la misma memoria. Es como pasar de abrir varias casas (procesos) a repartir habitaciones dentro de una sola (hilos).

---

## 🧵 ¿Qué es un hilo?

Un **hilo** (thread) es la unidad más pequeña de ejecución que el sistema operativo puede gestionar. Un proceso puede tener múltiples hilos, todos compartiendo la misma memoria.

```python
import threading

def saludar():
    print("¡Hola desde un hilo!")

hilo = threading.Thread(target=saludar)
hilo.start()
hilo.join()
```

Fíjate en las tres líneas mágicas que ya usarás toda la unidad:

1. `threading.Thread(target=saludar)` → **crea** el hilo (todavía no hace nada).
2. `hilo.start()` → **lo lanza**: el hilo empieza a ejecutar la función `saludar`.
3. `hilo.join()` → **espera** a que el hilo termine antes de seguir con el programa.

### Características de un hilo

- **Comparten memoria** con otros hilos del mismo proceso (por eso se comunican tan rápido).
- Son **más ligeros que los procesos**: cuestan muchos menos recursos al crearlos.
- Se comunican mediante **variables compartidas** (con cuidado: eso es el TEMA 03).
- En Python, están **limitados por el GIL** para código CPU-bound (lo verás en el [punto 6](/ApuntesPSP/02-hilos-fundamentos/06-gil)).

---

## 🥊 Hilos vs Procesos

| Característica | Proceso | Hilo |
|----------------|---------|------|
| Memoria | Aislada (cada uno la suya) | Compartida (todos en la misma) |
| Creación | Lenta (el SO debe copiar recursos) | Rápida |
| Comunicación | Pipes, sockets, archivos | Variables globales |
| Aislamiento | Alto (uno no afecta a otro) | Bajo (uno puede romper a todos) |
| Coste | Alto | Bajo |

> "Los procesos son como casas separadas. Los hilos son como habitaciones de la misma casa."

---

## 🍳 La analogía de los chefs en una cocina

Imagina una cocina de restaurante con varios cocineros:

- **Procesos** = cocinas de restaurantes diferentes. Cada una tiene su propia cocina, sus propios fogones y sus propios ingredientes. Si un restaurante se quema, el de al lado ni se entera (aislamiento alto). Pero abrir un restaurante nuevo es caro y lento.
- **Hilos** = cocineros dentro de la **misma** cocina. Todos comparten la encimera, la nevera y los ingredientes (memoria compartida). Contratar a un cocinero más es barato y rápido. Pero si uno tira el aceite caliente, todos lo sufren (aislamiento bajo).

> "Un hilo es como una tarea dentro de una casa. Todos los hilos comparten la misma casa (memoria), pero cada uno hace su propia cosa."

Ese reparto de la misma nevera es lo que hace a los hilos tan rápidos para comunicarse… y tan peligrosos si dos tocan el mismo ingrediente a la vez. Ese peligro se llama **condición de carrera** y lo atacarás en el [TEMA 03 · Sincronización](/ApuntesPSP/03-sincronizacion-entre-hilos).

---

## 🧠 Mini-chequeo

1. ¿Dónde vive un hilo: dentro de un proceso o junto a él?
2. ¿Por qué un hilo es más barato de crear que un proceso?
3. ¿Cuál es el precio de compartir memoria entre hilos?

<details>
<summary>🔄 Respuestas</summary>

1. **Dentro** de un proceso. Un proceso puede tener varios hilos ejecutándose a la vez, todos con la misma memoria.
2. Porque **no hay que copiar recursos**: el hilo reutiliza la memoria y las estructuras del proceso que ya existe. Un proceso nuevo obliga al SO a preparar un espacio aislado entero.
3. El **aislamiento bajo**: si un hilo corrompe una variable compartida, afecta a todos los hilos del proceso. Uno solo puede romper a todos.

</details>

---

## ✅ Resumen en 3 frases

- Un **hilo** es la unidad más pequeña de ejecución y vive dentro de un proceso compartiendo su memoria.
- Frente a los procesos, los hilos son más ligeros, se crean más rápido y se comunican con variables compartidas, pero con menos aislamiento.
- La memoria compartida es a la vez su gran ventaja y su gran riesgo: a eso le pondremos remedio en el TEMA 03.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| Hilo (thread) | Unidad más pequeña de ejecución dentro de un proceso |
| Memoria compartida | La memoria del proceso, usada por todos sus hilos |
| threading.Thread | Clase de Python para crear un hilo |
| start() | Lanza el hilo: empieza a ejecutar su función |
| join() | Espera a que el hilo termine |
| GIL | Candado de CPython que limita los hilos para código CPU-bound |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/02-hilos-fundamentos) · **Siguiente:** [02 · Tu primer hilo](/ApuntesPSP/02-hilos-fundamentos/02-primer-hilo)