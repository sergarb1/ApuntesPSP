---
title: "09 — Head First: consolida lo aprendido"
description: Sé el Proceso, laboratorio con subprocess y el ring final de la unidad 🧠
---

<p><small>Sé el Proceso, laboratorio con subprocess y el ring final de la unidad 🧠</small></p>

> 🗺️ **Estás en:** 🚀 **U01 · Procesos y Subprocess** → 09 · Head First

---

Has terminado la teoría: la burbuja de memoria y el PID, los cinco estados, paralela contra distribuida, `run()`, `Popen()`, los pipes con `communicate()` y la compatibilidad Windows/Linux. Este cierre es el aterrizaje: recorres lo aprendido con juegos, un laboratorio real con fallos intencionados y las preguntas que te harán en una entrevista. Léelo justo después del [punto 8](/ApuntesPSP/01-procesos-y-subprocess/08-procesos-en-la-practica) y antes de abrir los boletines.

---

## ⭐ Sé el Proceso

> *Eres un proceso de Python recién lanzado con `subprocess.Popen(["python", "calcula.py"])`. Acaban de asignarte un PID: 12345.*

**¿Qué pasa?**

1. El sistema operativo crea tu proceso: asigna PID **12345**, reserva tu **burbuja de memoria** (código, estado, contador de programa).
2. Pasas al estado **NUEVO** y, en cuanto estás cargado, a **LISTO**: esperas tu turno de CPU en la cola del planificador.
3. La CPU te toca: pasas a **EJECUCIÓN**. Ejecutas las instrucciones de `calcula.py` una a una.
4. Llamas a `input()` para leer de stdin: te bloqueas (**BLOQUEADO**) esperando que el usuario escriba algo.
5. El usuario escribe y pulsa **ENTER**; la E/S termina y vuelves a **LISTO**.
6. La CPU te toca otra vez (**EJECUCIÓN**), terminas tu último `print()` y llegas a **TERMINADO**.
7. Tu padre espera con `proceso.wait()` o `poll()` y recoge tu código de retorno: **0**.

> 💡 **Ahora tú:** ¿y si tu padre lanza a la vez otros dos procesos (`calc.exe` y `notepad.exe`)? Los tres avanzáis turnándoos la CPU (concurrencia) y, si hay varios núcleos, alguno ejecutará de verdad a la vez (paralelismo). Eso es lo que viste en el [punto 3](/ApuntesPSP/01-procesos-y-subprocess/03-paralela-vs-distribuida).

---

## 🔥 Fireside Chat: Proceso vs Hilo

> *Un proceso y un hilo se sientan junto a la chimenea a resolver, de una vez, quién es más ligero.*

**Proceso:** — Yo soy la unidad completa: memoria propia, recursos, PID. Si me cuelgo, tú ni te enteras. Soy el [punto 1](/ApuntesPSP/01-procesos-y-subprocess/01-que-es-un-proceso).

**Hilo:** — ¿Y para qué quieres toda esa burbuja? Yo vivo **dentro** de un proceso y comparto su memoria. Soy mucho más barato de crear.

**Proceso:** — Pero mis fallos no tumban a nadie más. Tú, si se te va un puntero, te llevas por delante al proceso entero.

**Hilo:** — Cierto, pero yo puedo compartir variables directamente. Tú necesitas pipes y `communicate()` para hablar con tu vecino.

**Proceso:** — Sí, pero en Python tengo otra ventaja: mi propio intérprete. Los hilos comparten el **GIL**, así que mi paralelismo con `multiprocessing` es real.

**Hilo:** — Vale, vale. Tú para aislamiento y paralelismo real; yo para tareas ligeras que comparten memoria. ¿Empate?

**Proceso:** — *sonríe* Empate... hasta la U02.

> **Moraleja**: el proceso aísla y paraleliza de verdad; el hilo es ligero y comparte memoria. Los hilos son el plato principal de la [U02 · Hilos Fundamentos](/ApuntesPSP/02-hilos-fundamentos).

---

## 🕵️ ¿Quién Soy?

1. Soy el identificador único que el SO asigna a cada proceso.
2. Soy el estado en el que el proceso espera un recurso (I/O, socket, sleep).
3. Soy el mecanismo por el que una sola CPU parece ejecutar varios procesos a la vez.
4. Soy el módulo de Python que reparte tareas en procesos paralelos reales.
5. Soy el tubo que conecta la salida de un proceso con la entrada de otro.
6. Soy el proceso que ya terminó pero que su padre no ha recogido todavía.

<details>
<summary>🔄 Respuestas</summary>

1. **PID**.
2. **BLOQUEADO**.
3. **El planificador (scheduler)** con la **concurrencia** (time slices).
4. **multiprocessing**.
5. **El pipe**.
6. **El zombie**.

</details>

---

## 🤬 CONRAD VS EL MUNDO: "maté el proceso y no volvió"

**CONRAD:** — "Clásico: *'he lanzado mi programa con subprocess.run y no me devuelve el control'*. ¡Pues claro! `run()` espera a que el comando termine, y si lanzas `notepad.exe`, el bloc de notas no se cierra nunca: te quedas colgado hasta que el usuario cierre la ventana. Si querías lanzar y seguir, eso es `Popen`, no `run()`."

**CONRAD:** — "Y lo mejor: *'puse shell=True para abrir el navegador y ahora un comando borra mis archivos'*. Pues sí: `shell=True` delega en el intérprete de comandos. Si le pasas un string con datos del usuario, es un agujero de seguridad. Lista de argumentos, nunca strings concatenados. O `cmd /c`, que para eso está."

**CONRAD:** — "Y no me vengas con *'¿será que mi proceso se ha convertido en zombie?'*. Míralo con `proceso.poll()`: si te devuelve el código de retorno, ya terminó y solo falta que lo recojas con `wait()` o `poll()`. Zombie sin recoger = entrada ocupada en la tabla de procesos. A diagnosticar."

---

## ⚡ Laboratorio de Tortura: el lanzador con cierre automático

> **Duración:** 40 minutos
> **Herramienta:** Python 3 (`subprocess` y `time`, sin instalar nada)

**Escenario:** construye un "lanzador de aplicaciones" que abra tres programas (bloc de notas, calculadora y Paint), muestre sus PIDs, los deje vivir 5 segundos y luego cierre solo los que sigan abiertos.

**Tareas paso a paso:**

1. Define una función `lanzar_apps()` que cree los tres `Popen` y los guarde en una lista de tuplas `(nombre, proceso)`.
2. Recorre la lista mostrando `nombre` y `proceso.pid`.
3. Espera 5 segundos con `time.sleep(5)` mientras las apps están abiertas.
4. Recorre otra vez la lista: si `proceso.poll() is None` (sigue viva), llámale `terminate()`; si ya terminó, imprime que se cerró sola.
5. Tras cada `terminate()`, recoge el código de retorno con `proceso.wait()` e imprímelo.
6. Envuelve la llamada en `if __name__ == "__main__":`.

**Fallo intencionado:** en el paso 5, en lugar de `wait()` tras `terminate()`, **borra esa línea** y deja el programa así. ¿Qué pasa? El padre lanza las apps, las mata, pero **nunca recoge su código de retorno**: los tres procesos terminados quedan como **zombies**, ocupando una entrada en la tabla de procesos hasta que el padre muere (o los recoge).

> **Pista 1:** un proceso no desaparece al terminar: su código de retorno queda guardado hasta que el padre lo **recoge** con `wait()` o `poll()`. Sin esa llamada, la entrada en la tabla de procesos sigue ocupada: es el zombie de las [preguntas tontas](#-no-hay-preguntas-tontas).
>
> **Pista 2:** si no ves el zombie a simple vista, añade `print(f"{nombre} → poll(): {proceso.poll()}")` justo después del `terminate()`. Con `wait()` devolverá el código de retorno y se limpia; sin él, el `poll()` te seguirá devolviendo un código "pendiente" en un proceso que ya murió.

---

## 🏆 Logros de esta unidad

| Logro | Cómo conseguirlo |
|---|---|
| 🏅 **Process Whisperer** | Explicar el ciclo de vida de un proceso: sus 5 estados y sus transiciones |
| 🏅 **Launcher** | Abrir y gestionar varias aplicaciones a la vez con `Popen`, `terminate()` y `kill()` |
| 🏅 **Pipe Talker** | Comunicar un proceso padre y un hijo con `communicate()` |
| 🏅 **Parallel Thinker** | Distinguir paralela, distribuida y concurrencia, y saber cuándo usar `multiprocessing` |

---

## 🧠 Atrévete a Pensar

1. ¿Por qué un proceso no puede compartir memoria directamente con otro?
2. ¿Qué pasa si un proceso hijo muere y su padre nunca llama a `wait()` ni `poll()`?
3. ¿Cuándo usarías `multiprocessing` en lugar de `subprocess`?
4. ¿Por qué `shell=True` es peligroso si le pasas datos del usuario?
5. ¿Qué ventaja tiene `Popen` sobre `run()` para lanzar 3 aplicaciones a la vez?

<details>
<summary>💡 Soluciones</summary>

1. Porque cada proceso vive en su **burbuja de memoria aislada** ([punto 1](/ApuntesPSP/01-procesos-y-subprocess/01-que-es-un-proceso)); si compartieran memoria, un fallo de uno corrompería a todos. Por eso se comunican con **mecanismos externos**: pipes, sockets, archivos.
2. Se queda como **zombie**: ya terminó, pero su código de retorno sigue en la tabla de procesos hasta que el padre lo recoge con `wait()` o `poll()`. El sistema lo limpia cuando el padre muere.
3. `multiprocessing` para **paralelismo real** dentro de tu programa (repartir trabajo entre CPUs); `subprocess` para **lanzar otros programas** (apps, comandos del sistema).
4. Porque `shell=True` delega en el intérprete de comandos: un dato del usuario con `;`, `&` o `|` puede **ejecutar comandos extra** (inyección). La lista de argumentos no tiene ese problema.
5. `Popen` devuelve el control al instante: lanzas las tres y sigues trabajando mientras viven. Con `run()` tendrías que esperar a que cada una termine antes de lanzar la siguiente.

</details>

---

## 🧩 Crucigrama de Bits

```
Horizontal:
1. Identificador único del proceso (3 letras)
4. Estado en el que el proceso espera a que la CPU se libre (5 letras)
6. Señal de cierre suave de Popen (9 letras)
8. Proceso terminado sin recoger por su padre (6 letras)

Vertical:
2. Módulo Python que crea procesos en paralelo real (14 letras)
3. Estado del proceso mientras espera un recurso (9 letras)
5. Tubería que conecta la salida de un proceso con la entrada de otro (4 letras)
7. Método de Popen que pregunta sin bloquear (4 letras)
```

<details>
<summary>📝 Soluciones</summary>

**Horizontal:** 1. PID, 4. LISTO, 6. TERMINATE, 8. ZOMBIE
**Vertical:** 2. MULTIPROCESSING, 3. BLOQUEADO, 5. PIPE, 7. POLL

</details>

---

## 💬 Entrevista de trabajo

1. **"¿Qué es un proceso y en qué se diferencia de un programa?"**
2. **"Explica el ciclo de vida de un proceso."**
3. **"¿Qué diferencia hay entre computación paralela y distribuida?"**
4. **"¿Cómo lanzarías un programa externo desde Python y leerías su salida?"**
5. **"¿Qué diferencia hay entre `run()` y `Popen()`? ¿Cuándo usarías cada uno?"**
6. **"¿Cómo comunicarías dos procesos entre sí?"**

> 💡 **Cómo encararlas:** la 4 y la 5 son las "preguntas reina". Para la 4, recorre la cadena: `subprocess.run([...], capture_output=True, text=True)` → `resultado.stdout`; si el proceso necesita datos, `Popen(stdin=PIPE, stdout=PIPE)` + `communicate(input=...)`. Para la 5, repite la moraleja del [punto 8](/ApuntesPSP/01-procesos-y-subprocess/08-procesos-en-la-practica): `run()` para respuestas inmediatas, `Popen()` para segundo plano. Y para la 1 no olvides la **burbuja de memoria** y el **PID**. Si sabes contarlo fluido, ya eres medio programador de sistemas.

---

## 🤷 No hay preguntas tontas

> ❓ **¿Cuántos procesos puede tener mi sistema?**

Depende de la **memoria RAM**. Cada proceso ocupa memoria. En Windows puedes verlos en el Administrador de tareas.

> ❓ **¿Qué pasa si un proceso hijo muere?**

El proceso padre puede enterarse con `proceso.wait()` o `proceso.poll()`. Si no, el hijo se convierte en **zombie** (ocupa una entrada en la tabla de procesos).

> ❓ **¿Y si el padre muere antes que el hijo?**

Los hijos se convierten en **huérfanos**. En Windows, el sistema los gestiona. En Linux, `init` los adopta.

> ❓ **`run()` vs `Popen()` — ¿cuándo usar cada uno?**

- `run()`: cuando necesitas el resultado y puedes esperar.
- `Popen()`: cuando el proceso debe vivir en segundo plano mientras tú haces otras cosas.

> ❓ **¿Puedo lanzar cualquier programa?**

Sí, cualquier ejecutable. Pero el **PATH** debe incluirlo o debes dar la ruta completa.

---

## 🎬 Post-Créditos

> *El bloc de notas y la calculadora se abren a la vez. Tres procesos independientes conviven: Python, notepad y calc.*

*El usuario escribe en el bloc de notas mientras la calculadora suma. La CPU alterna entre ellos: nadie se entera de que se turnan.*

*Notepad se cierra con un `terminate()` y su código de retorno vuela de vuelta a Python por el pipe.*

*Los procesos se comunican sin compartir memoria. Cada uno en su burbuja.*

**PRÓXIMAMENTE EN U02:** *Los procesos son pesados: cada uno su memoria, su burbuja, su PID. Pero ¿y si quieres que varias tareas compartan memoria y se turnen la CPU? Necesitas algo más ligero: los hilos.*

---

## ✅ Criterios de evaluación cubiertos (RA1)

**RA1: Reconoce las características y la gestión de los procesos en un sistema operativo.**

| CE | Criterio | Cubierto |
|---|---|---|
| a) | Reconoce las características de los procesos | ✅ Burbuja de memoria y PID (punto 1) + ⭐ Sé el Proceso |
| b) | Distingue entre computación paralela y distribuida | ✅ Punto 3 + 🔥 Fireside (punto 9) |
| c) | Conoce los estados de un proceso | ✅ Punto 2 + ⭐ Sé el Proceso |
| d) | Identifica las diferencias clave entre proceso e hilo | → U02 (🔥 Fireside lo anticipa) |
| e) | Crea programas con procesos (subprocess) | ✅ Puntos 4-5-8 + ⚡ Laboratorio de Tortura |
| f) | Establece comunicación entre procesos | ✅ Punto 6 + ⚡ Laboratorio de Tortura |

> RA1d (proceso vs hilo) se cubre en la **U02 · Hilos Fundamentos**. RA1g (análisis de ventajas de procesos frente a hilos) también en **U02**. RA1h (documentación) es transversal a todo el curso.

---

📚 [Volver al índice de la unidad](/ApuntesPSP/01-procesos-y-subprocess) · **Anterior:** [08 · Procesos en la práctica](/ApuntesPSP/01-procesos-y-subprocess/08-procesos-en-la-practica) · **Siguiente:** **[U02 · Hilos Fundamentos](/ApuntesPSP/02-hilos-fundamentos)**