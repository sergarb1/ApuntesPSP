---
title: 01 — Condición de carrera
description: Cuando dos hilos se pisan la memoria compartida 🏃💥
---

<p><small>Cuando dos hilos se pisan la memoria compartida 🏃💥</small></p>

> 🗺️ **Estás en:** 🔒 **U03 · Sincronización entre Hilos** → 01 · Condición de carrera

---

## 📬 La idea en una frase

> Una **condición de carrera** ocurre cuando dos o más hilos acceden a la misma variable compartida a la vez, y el resultado final depende de qué hilo llegue primero: los incrementos se pierden y el resultado es incorrecto.

Dos hilos que incrementan una variable compartida sin sincronización:

```python
import threading

contador = 0

def incrementar():
    global contador
    for _ in range(100_000):
        contador += 1  # ⚠️ Esto NO es atómico

hilos = [threading.Thread(target=incrementar) for _ in range(4)]
for h in hilos: h.start()
for h in hilos: h.join()

print(f"Esperado: 400.000 | Obtenido: {contador}")
# → 287.341, 312.045, 198.723... ¡nunca 400.000!
```

Lanzamos 4 hilos, cada uno suma 100.000 veces. El resultado esperado es 400.000… y jamás lo vemos. Cada ejecución da un número distinto, siempre menor. Esa es la cara visible de la condición de carrera.

---

## 🔍 ¿Por qué falla? El `+=` no es atómico

`contador += 1` parece una línea, pero por dentro hace **3 operaciones**:

```
1. Leer contador de memoria
2. Sumar 1
3. Escribir el resultado
```

Si dos hilos leen el mismo valor antes de que ninguno haya escrito, ambos escriben el mismo resultado y se pierde un incremento:

```
Hilo-A: lee contador = 0
Hilo-B: lee contador = 0          ← ¡mismo valor!
Hilo-A: escribe contador = 1
Hilo-B: escribe contador = 1      ← ¡pisó el incremento de A!
Hilo-A: lee contador = 1
Hilo-A: escribe contador = 2
Hilo-B: lee contador = 1          ← ¡leyó valor viejo!
```

Entre la "lectura" del hilo A y su "escritura", el hilo B cuela otra lectura y otra escritura. Al final, dos incrementos solo han subido el contador en 1.

> ⚠️ En Python, el **GIL** evita que dos hilos ejecuten Python puro a la vez, pero **no** protege esta secuencia: el planificador puede interrumpir a un hilo entre el paso 1 y el paso 3 (en operaciones con `sys.settrace`, `sleep`, o cuando la operación se interrumpe). La condición de carrera es real.

---

## 💰 La analogía: dos cajeros y una caja

Imagina una tienda con **una sola caja** y **dos cajeros**. La caja solo puede guardar el dinero que hay en ella, y los dos cajeros la comparten:

- El cajero A mira la caja: hay **100 €** (leer).
- Mientras A va a buscar cambio, el cajero B también mira la caja: **100 €** (leer).
- A vuelve y mete 50 €: escribe **150 €**.
- B vuelve y mete 50 €: también escribe **150 €**, ¡pisando el incremento de A!

Se han cobrado 100 € en total, pero en la caja solo hay 150 € en lugar de 200 €. **Los 50 € del cajero A han desaparecido** en la caja compartida: se perdieron por una condición de carrera. Exactamente lo mismo le pasa a `contador`.

El remedio es la **exclusión mutua**: mientras un cajero toca la caja, el otro espera fuera. Ese es el `Lock`, que verás en el [punto 2](/ApuntesPSP/03-sincronizacion-entre-hilos/02-lock).

---

## 🌍 Dónde aparece la condición de carrera

| Situación | Qué se pierde |
|---|---|
| Contador compartido (`contador += 1`) | Incrementos |
| Saldo de una cuenta bancaria | Ingresos / retiros |
| Cola de trabajos compartida | Elementos de la cola |
| Registro (log) con fecha y hora | Líneas de log |
| Caché con varios lectores/escritores | Datos actualizados |

> Es el bug más clásico de la programación concurrente: el programa **funciona casi siempre** y falla de forma intermitente e imposible de reproducir. Por eso la sincronización se diseña desde el principio, no al final.

---

## 🧠 Mini-chequeo

1. ¿Qué es una condición de carrera?
2. ¿Por qué `contador += 1` no es atómico y qué tres pasos esconde?
3. ¿Cómo explicarías el problema con la analogía de los dos cajeros y la caja?

<details>
<summary>🔄 Respuestas</summary>

1. Es la situación en la que dos o más hilos acceden a la misma variable compartida a la vez y el resultado final depende de quién llegue primero: se pierden actualizaciones y el resultado es incorrecto.
2. Porque hace **leer → sumar → escribir**. Si dos hilos leen el mismo valor antes de que ninguno escriba, ambos escriben lo mismo y un incremento se pierde.
3. Dos cajeros comparten una caja: los dos leen el mismo saldo (100 €), los dos escriben (150 €) y el segundo ingreso se pierde. Los hilos comparten la memoria igual que los cajeros comparten la caja.
</details>

---

## ✅ Resumen en 3 frases

- Dos hilos que tocan la misma variable a la vez producen resultados incorrectos: eso es una **condición de carrera**.
- `contador += 1` no es atómico: son **leer, sumar, escribir**, y el planificador puede interrumpir entre pasos.
- La solución pasa por la **sincronización** (exclusión mutua), el tema del resto de la unidad.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| Condición de carrera | Dos hilos tocan la misma variable a la vez y se pisan |
| Sección crítica | Zona de código que toca un recurso compartido |
| Operación atómica | Operación que no se puede interrumpir a mitad |
| Exclusión mutua | Solo un hilo accede al recurso compartido a la vez |
| GIL | Bloqueo global de Python: no protege la secuencia leer-sum-escribir |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/03-sincronizacion-entre-hilos) · **Siguiente:** [02 · Lock](/ApuntesPSP/03-sincronizacion-entre-hilos/02-lock)