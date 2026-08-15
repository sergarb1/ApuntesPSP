---
title: "09 — Head First: consolida lo aprendido"
description: Sé el Lock, laboratorio con carrera y el duelo final de la unidad 🧠
---

<p><small>Sé el Lock, laboratorio con carrera y el duelo final de la unidad 🧠</small></p>

> 🗺️ **Estás en:** 🔒 **U03 · Sincronización entre Hilos** → 09 · Head First

---

Has terminado la teoría: condición de carrera, Lock, RLock, Semaphore, Barrier, Condition, productor-consumidor y las reglas anti-deadlock. Este cierre es el aterrizaje: recorres lo aprendido con juegos, un laboratorio real con fallos intencionados y las preguntas que te harán en una entrevista. Léelo justo después del [punto 8](/ApuntesPSP/03-sincronizacion-entre-hilos/08-buenas-practicas) y antes de abrir los boletines.

---

## ⭐ Sé el Lock

> *Eres un `threading.Lock` recién creado. Te han asignado proteger el contador compartido de 4 hilos. Cada hilo quiere hacer `contador += 1` 100.000 veces.*

**¿Qué pasa?**

1. El hilo A llama a `with lock:` → **adquieres** el cerrojo y le das paso.
2. A ejecuta `contador += 1` de principio a fin: lee, suma, escribe. **Nadie se cuela**: tú estás puesto.
3. A sale del bloque → llamas a `release()` y **liberas** el cerrojo.
4. El hilo B, que estaba esperando, entra: **adquieres** de nuevo, repite los pasos 2-3.
5. Los 4 hilos se turnan contigo: 100.000 veces cada uno.

**Resultado:** el contador llega a **400.000**, exacto, en todas las ejecuciones. Tú (el Lock) has convertido el caos de la condición de carrera en un turno ordenado.

> 💡 **Ahora tú:** ¿y si un hilo olvidara llamarte con `release()`? Te quedarías puesto para siempre y el resto esperaría eternamente: eso es un **deadlock**. Por eso los hilos te usan siempre con `with lock:`, que garantiza el `release()` pase lo que pase (lo viste en el [punto 2](/ApuntesPSP/03-sincronizacion-entre-hilos/02-lock)).

---

## 🔥 Fireside Chat: Lock vs Semaphore

> *Dos mecanismos de sincronización se sientan junto a la chimenea a resolver, de una vez, quién controla el acceso.*

**Lock:** — Yo soy la exclusión mutua. Solo uno de mis hilos toca el recurso a la vez. Los demás esperan fuera hasta que libero.

**Semaphore:** — Vaya, qué estricto. Yo dejo pasar hasta **N**. Tengo un contador interno: mientras queden puestos, entran; cuando se acaban, esperan.

**Lock:** — ¿Y para qué querría nadie que entren varios? Mi recurso no admite más de uno.

**Semaphore:** — Para un **aforo**, querido: 3 impresoras, 3 descargas, 3 conexiones a la BD. Conmigo entran exactamente 3. Tú solo sabes decir "uno".

**Lock:** — Pero yo soy más simple y rápido. Para una sección crítica, no hay discusión.

**Semaphore:** — Y yo puedo hacer de ti: `Semaphore(1)` equivale a tu exclusión mutua. Pero tú no puedes ser yo.

**Lock:** — Vale, cada uno a lo suyo. ¿Y esa barrera que todo lo frena?

**Semaphore:** — *suspira* Esa no nos habla. Solo sabe esperar a que lleguen todos antes de dejar correr a nadie. Cosas de carreras de relevos.

> **Moraleja**: Lock para exclusión mutua (solo uno), Semaphore para aforo (hasta N), Barrier para fases (cuando todos llegan). Y la Condition de fondo, avisando.

---

## 🕵️ ¿Quién Soy?

1. Soy el cerrojo que deja pasar a **un solo** hilo a la sección crítica a la vez.
2. Soy el cerrojo que el mismo hilo puede adquirir varias veces sin bloquearse.
3. Soy el guardia de una sala con **3 sillas**: cuando una se libera, entra el siguiente.
4. Soy el juez de salida: no dejo correr a nadie hasta que los 3 corredores están en la línea.
5. Soy el aviso: un hilo se duerme con `wait()` hasta que otro lo despierta con `notify()`.
6. Soy el bug que ocurre cuando dos hilos se pisan la misma variable compartida.

<details>
<summary>🔄 Respuestas</summary>

1. **Lock**.
2. **RLock** (reentrante).
3. **Semaphore(3)**.
4. **Barrier(3)**.
5. **Condition**.
6. **La condición de carrera**.

</details>

---

## 🤬 CONRAD VS EL MUNDO: "olvidé el `release()` y todos esperan al lock"

**CONRAD:** — "Clásico: el programa se cuelga y nadie sabe por qué. Miras el código y... ¡claro! Usé `lock.acquire()`, hice el trabajo, y se me olvidó el `lock.release()`. El hilo se quedó con el cerrojo puesto, y todos los demás se quedaron esperando al lock para siempre. No es un fallo raro: es un **deadlock** en su forma más tonta."

**CONRAD:** — "Y lo mejor: *'pero yo hago acquire solo en este sitio'*. ¡Pues claro! También lo haces dentro de un `with`, y así nunca más. El `with lock:` hace el `release()` solo, aunque haya una excepción en medio. Adquirir a mano sin liberar es firmar una sentencia de muerte para tus hilos."

**CONRAD:** — "Y no me vengas con *'¿será que el ordenador va lento?'*. No. Si un hilo se queda esperando para siempre y el contador no llega a su valor, ya tienes la respuesta: hay un lock mal liberado o un orden de adquisición incorrecto. El GIL del [punto 1](/ApuntesPSP/03-sincronizacion-entre-hilos/01-condicion-de-carrera) no te protege de esto. A diagnosticar."

---

## ⚡ Laboratorio de Tortura: la caja común de la cooperativa

> **Duración:** 45 minutos
> **Herramienta:** Python 3 (`threading` y `time`, sin instalar nada)

**Escenario:** 4 hilos representan a 4 socios de una cooperativa que comparten una caja común (el `contador`). Cada socio debe aportar 100.000 monedas (`contador += 1`). Al final de la jornada, la caja debe contener **400.000**.

**Tareas paso a paso:**

1. Escribe la versión **sin sincronizar** del contador y ejecútala varias veces: anota que el total nunca es 400.000 (condición de carrera del [punto 1](/ApuntesPSP/03-sincronizacion-entre-hilos/01-condicion-de-carrera)).
2. Protege el incremento con `lock = threading.Lock()` y `with lock:` (el [punto 2](/ApuntesPSP/03-sincronizacion-entre-hilos/02-lock)). Ejecútala 3 veces: ahora siempre da **400.000**.
3. Sustituye el `Lock` por un `Semaphore(1)` y verifica que también funciona (el [punto 4](/ApuntesPSP/03-sincronizacion-entre-hilos/04-semaphore)).
4. Añade una **segunda caja** (otro contador de operaciones) que se incremente desde una función auxiliar llamada dentro de otra: protégelas con un `RLock` para que el mismo hilo pueda adquirirlo dos veces ([punto 3](/ApuntesPSP/03-sincronizacion-entre-hilos/03-rlock)).
5. Añade una `Barrier(4)` para que los 4 socios **empiecen a aportar a la vez**: nadie toca su caja hasta que los 4 están en la salida ([punto 5](/ApuntesPSP/03-sincronizacion-entre-hilos/05-barrier)).

**Fallo intencionado:** en la tarea 2, "por accidente", uno de los 4 hilos hace `contador += 1` **fuera** del `with lock:` (o bien un hilo que usa `lock.acquire()` sin `release()`). ¿Qué pasa? El contador vuelve a dar valores por debajo de 400.000, y si es el `release()` olvidado, el programa se **cuelga** esperando el `join()`. Los demás hilos están perfectos: el fallo es de un único hilo.

> **Pista 1:** busca el único `contador += 1` que no está dentro de `with lock:`. El contador da mal aunque los otros 3 hilos estén bien protegidos: basta **un** hilo fuera de la sección crítica.
>
> **Pista 2:** si todo parece protegido pero el programa no termina, revisa que nadie llamó a `acquire()` sin su `release()`. Un `with lock:` nunca lo olvida; un `acquire()` suelto, sí. Ahí tienes el deadlock del [punto 8](/ApuntesPSP/03-sincronizacion-entre-hilos/08-buenas-practicas).

---

## 🏆 Logros de esta unidad

| Logro | Cómo conseguirlo |
|---|---|
| 🏅 **Carrera Cazador** | Explicar por qué `contador += 1` no es atómico y provocar una condición de carrera |
| 🏅 **Cerrojo Maestro** | Proteger un contador compartido con `Lock` y `with lock:` y obtener siempre 400.000 |
| 🏅 **Aforo Controlado** | Limitar con `Semaphore` el acceso a N recursos (descargas, BD, impresoras) |
| 🏅 **Sincronizador de Fases** | Coordinar N hilos con `Barrier` para que ninguna fase arranque antes de tiempo |
| 🏅 **Jefe de Cola** | Implementar un productor-consumidor con `Condition` (wait/notify) sin perder datos |
| 🏅 **Rompe Deadlocks** | Detectar un deadlock y arreglarlo con orden de locks y `with lock:` |

---

## 🧠 Atrévete a Pensar

1. ¿Por qué `contador += 1` con 4 hilos y sin lock casi nunca da 400.000, pero a veces sí?
2. ¿Qué pasaría si usaras `Semaphore(3)` para proteger una sección crítica que debe ser exclusiva?
3. ¿Por qué `notify()` puede dejar a un consumidor esperando para siempre con varios consumidores?
4. ¿Cuál es la diferencia práctica entre `Lock` y `RLock` para una función que llama a otra?
5. ¿Por qué "adquirir siempre en el mismo orden" elimina el deadlock de 2 hilos y 2 locks?

<details>
<summary>💡 Soluciones</summary>

1. Porque la condición de carrera es **probabilística**: depende de si el planificador interrumpe a un hilo justo entre el "leer" y el "escribir". Cuanto más grande el número de iteraciones, más probable perder incrementos… pero nunca es 100% predecible.
2. Permitirías que **3 hilos** tocaran a la vez una zona que necesita exclusividad: reintroducirías condiciones de carrera. Para exclusión mutua solo vale `Lock` (o `Semaphore(1)`).
3. `notify()` despierta a **un solo** hilo. Si hay 3 consumidores esperando y solo uno se despierta (y consume todo), los otros 2 siguen dormidos aunque haya habido trabajo. Por eso con varios consumidores se usa `notify_all()`.
4. Con `Lock`, la segunda adquisición del mismo hilo produce un **deadlock** (se espera a sí mismo). Con `RLock`, el contador interno permite re-entrar. La función que llama a otra necesita `RLock`.
5. Si todos los hilos piden primero Lock-1 y luego Lock-2, **ningún hilo tiene Lock-2 sin pasar por Lock-1**: es imposible que A tenga Lock-1 esperando Lock-2 mientras B tiene Lock-2 esperando Lock-1.
</details>

---

## 🧩 Crucigrama de Bits

```
Horizontal:
1. Cerrojo que deja pasar a un solo hilo a la vez (4 letras)
3. Lock que el mismo hilo puede adquirir varias veces (5 letras)
6. Condición en la que dos hilos se esperan para siempre (8 letras)
8. Mecanismo de espera y aviso: wait() y notify() (9 letras)

Vertical:
2. Aforo máximo: hasta N hilos dentro a la vez (9 letras)
4. Sincroniza fases: nadie avanza hasta que llegan todos (7 letras)
5. Operación que no se puede interrumpir a mitad (7 letras)
7. Bug cuando dos hilos se pisan una variable compartida (5 letras)
```

<details>
<summary>📝 Soluciones</summary>

**Horizontal:** 1. LOCK, 3. RLOCK, 6. DEADLOCK, 8. CONDITION
**Vertical:** 2. SEMAPHORE, 4. BARRIER, 5. ATOMICA, 7. RACE (en español: carrera)

</details>

---

## 💬 Entrevista de trabajo

1. **"¿Qué es una condición de carrera y cómo la evitas en Python?"**
2. **"Explica la diferencia entre Lock, RLock, Semaphore y Barrier. ¿Cuándo usarías cada uno?"**
3. **"¿Cómo funciona `Condition.wait()` y `notify()`? ¿Por qué se usa `while` y no `if`?"**
4. **"Implementa un productor-consumidor con varios consumidores."**
5. **"¿Qué es un deadlock? Pon un ejemplo y explica cómo prevenirlo."**

> 💡 **Cómo encararlas:** la 2 y la 4 son las "preguntas reina". Para la 2, recorre el ring del [punto 8](/ApuntesPSP/03-sincronizacion-entre-hilos/08-buenas-practicas): Lock = exclusión mutua (solo uno), Semaphore = aforo (hasta N), Barrier = fases (cuando todos llegan), RLock = reentrante. Para la 4, plantea una cola compartida, `Condition` con `notify_all()`, y la regla `while not cola: wait()`. Si sabes contarlo fluido, ya eres medio experto en concurrencia.

---

## 🤷 No hay preguntas tontas

> ❓ **¿Qué es un deadlock?**

Dos o más hilos esperándose mutuamente para siempre. Ejemplo: Hilo-A tiene Lock-1 y espera Lock-2; Hilo-B tiene Lock-2 y espera Lock-1.

> ❓ **¿Cómo evito deadlocks?**

1. Adquirir los locks siempre en el **mismo orden**
2. Usar `with lock:` (nunca olvidar `release()`)
3. Usar `RLock` si el mismo hilo necesita adquirirlo varias veces

> ❓ **¿Puedo tener más de un Lock?**

Sí. Pero cada Lock añade riesgo de deadlock. Sé disciplinado con el orden de adquisición.

> ❓ **¿Qué es más rápido, Lock o Semaphore?**

Lock es más simple. Semaphore tiene contador interno. Para exclusión mutua, Lock gana en velocidad.

> ❓ **¿Y si necesito sincronización entre procesos en vez de entre hilos?**

Usa `multiprocessing.Lock`, `multiprocessing.Semaphore`, etc. Son equivalentes pero para procesos.

---

## 🎬 Post-Créditos

> *El contador llega a 400.000, exacto. Los 4 hilos se turnan con el Lock sin pisarse.*

*Un hilo se olvida del `release()`. Los demás esperan al lock. El programa se congela.*

*El semáforo regula el aforo, la barrera alinea las fases y el productor despierta al consumidor con un `notify()`.*

*La sincronización ha ganado la batalla contra el caos.*

**PRÓXIMAMENTE EN U04:** *Sockets TCP. Los hilos comparten memoria y ahora saben coordinarse… pero ¿y si los procesos ni siquiera comparten memoria? Tocará hablar por la red.*

---

## ✅ Criterios de evaluación cubiertos (RA2)

**RA2: Gestiona la programación de hilos y su sincronización.**

| CE | Criterio | Cubierto |
|---|---|---|
| RA2c | Sincroniza hilos con Lock | ✅ Puntos 2, 3 y 7 + ⚡ Laboratorio de Tortura |
| RA2d | Usa semáforos para acceso controlado | ✅ Punto 4 + ⚡ Laboratorio de Tortura |
| RA2g | Evita condiciones de carrera | ✅ Puntos 1, 2 y 8 + ⚡ Laboratorio con fallo intencionado |

> RA2a, RA2b, RA2e, RA2f y RA2h se cubren en la **U02 · Hilos Fundamentos**.

---

📚 [Volver al índice de la unidad](/ApuntesPSP/03-sincronizacion-entre-hilos) · **Anterior:** [08 · Buenas prácticas](/ApuntesPSP/03-sincronizacion-entre-hilos/08-buenas-practicas) · **Siguiente:** **[U04 · Sockets TCP](/ApuntesPSP/04-sockets-tcp)**