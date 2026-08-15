---
title: "09 — Head First: consolida lo aprendido"
description: Sé el Hilo, el ring final y el laboratorio de la unidad 🧠
---

<p><small>Sé el Hilo, el ring final y el laboratorio de la unidad 🧠</small></p>

> 🗺️ **Estás en:** 🔀 **U02 · Hilos Fundamentos** → 09 · Head First

---

Has terminado la teoría: qué es un hilo, cómo se crea y se espera, argumentos y nombres, daemons, Timer, el GIL y el ciclo de vida. Este cierre es el aterrizaje: recorres lo aprendido con juegos, un laboratorio real con fallos intencionados y las preguntas que te harán en una entrevista. Léelo justo después del [punto 8](/ApuntesPSP/02-hilos-fundamentos/08-hilos-en-la-practica) y antes de abrir los boletines.

---

## ⭐ Sé el Hilo

> *Eres un hilo llamado "hilo-1". Acabas de nacer en el programa de los viajeros del [punto 8](/ApuntesPSP/02-hilos-fundamentos/08-hilos-en-la-practica). Tu misión: recorrer 3 paradas con 0.5s de sueño entre cada una.*

**¿Qué pasa, paso a paso?**

1. **Naces en estado NUEVO**: `threading.Thread(target=viajero, args=("Ana", 3))`. Existes como objeto, pero no has hecho nada todavía.
2. **`h1.start()` te lanza**: pasas a **EJECUTABLE**. Ya puedes ejecutar cuando el scheduler quiera.
3. **El scheduler te da la CPU**: pasas a **EJECUCIÓN** e imprimes `"Ana 🚶 está en la parada 1"`.
4. **`time.sleep(0.5)` te bloquea**: pasas a **BLOQUEADO**. Sueltas la CPU y el GIL; tu compañero Bob aprovecha y avanza.
5. **Te despiertas**: vuelves a **EJECUTABLE**, el scheduler te da CPU de nuevo y avanzas a la parada 2… y luego la 3.
6. **Tu función acaba**: pasas a **TERMINADO**. El `h1.join()` del programa principal confirma que ya no sigues vivo.

**En ningún momento decides tú cuándo te toca.** El scheduler del sistema operativo reparte la CPU entre ti y Bob como quiere; tu único control es lanzarte (`start()`) y hacer esperar al principal (`join()`).

> 💡 **Ahora tú:** ¿y si fueras el reloj daemon del [punto 4](/ApuntesPSP/02-hilos-fundamentos/04-hilos-daemon)? Tu función es un `while True`: nunca llegas "bien" a TERMINADO. El día que el programa principal acabe, te matan en seco, estés en EJECUCIÓN o BLOQUEADO. Ese es el destino del daemon.

---

## 🔥 Fireside Chat: Hilo vs Proceso

> *Dos trabajadores de la multitarea se sientan junto a la chimenea a zanjar, de una vez, quién hace qué.*

**Hilo:** — Soy la unidad más pequeña de ejecución. Nací dentro de un proceso y comparto su memoria con mis hermanos. Me crean en milisegundos.

**Proceso:** — Yo soy el dueño de la casa. Memoria aislada, PID propio, espacio de direcciones separado. Si un hilo se equivoca, puede tirar la casa entera.

**Hilo:** — Pero comunicarme es instantáneo: una variable global y listo. Tú necesitas pipes, sockets o archivos para hablar con tu vecino.

**Proceso:** — Es cierto, más lento. Pero cuando toca calcular de verdad, cada proceso tiene su propio GIL. Yo puedo usar 8 CPUs de golpe; tú te peleas con tus hermanos por una.

**Hilo:** — ¡El GIL es para calcular! Yo brillo esperando: descargas, lectura de disco, clientes de red. Mientras uno espera, los demás avanzan. Ahí no me gana nadie.

**Proceso:** — Al final, cada uno a su oficio. Yo para aislamiento y CPU real; tú para esperas, servicios de fondo y todo lo ligero.

> **Moraleja**: los hilos comparten memoria y son baratos (perfectos para I/O y servicios ligeros); los procesos aíslan y paralelizan CPU de verdad. Elige según la tarea.

---

## 🕵️ ¿Quién Soy?

1. Soy la unidad más pequeña de ejecución y comparto memoria con mis hermanos dentro de un proceso.
2. Me llaman "main" y, sin un `join()`, puedo terminar el programa antes que los demás hilos.
3. Me ejecuto en segundo plano y muero cuando el programa principal termina, sin dramas.
4. Soy un candado de CPython que impide que dos hilos ejecuten bytecode a la vez.
5. Me ejecutan una sola vez tras un retardo, y pueden cancelarme antes de que dispare.
6. Soy el estado en el que un hilo espera dormido, leyendo de red o esperando un lock.

<details>
<summary>🔄 Respuestas</summary>

1. **El hilo** (thread).
2. **El hilo principal** (main thread).
3. **El hilo daemon**.
4. **El GIL** (Global Interpreter Lock).
5. **El Timer** (`threading.Timer`).
6. **Bloqueado** (BLOQUEADO).

</details>

---

## 🤬 CONRAD VS EL MUNDO: "el programa termina antes que mis hilos"

**CONRAD:** — "Clásico: mi programa imprime 'Fin' y los hilos ni se han enterado. Razones: 1) **No puse `join()`**: el principal siguió a lo suyo y se fue antes de que terminaran. 2) **Llamé a la función con paréntesis** en `target=fn()`: se ejecutó al instante en el hilo principal y el hilo nació ya terminado. 3) **Hice el hilo daemon** y el principal salió: lo maté yo mismo. 4) **Esperaba que `start()` ejecutara al momento**, cuando en realidad solo lo pone en EJECUTABLE a merced del scheduler."

**CONRAD:** — "Y lo mejor: *'pero si lo he lanzado'*. ¡Pues claro! **Lanzar no es esperar.** `start()` pone el hilo en marcha; `join()` es lo único que hace que el programa principal se quede esperándolo. Sin `join()`, tu 'Fin' puede salir antes que todo el trabajo."

**CONRAD:** — "Y no me vengas con *'¿será que el GIL lo bloquea?'*. Si tus hilos son de espera (I/O), el GIL no es el problema: el problema es que **no los estás esperando tú**. A diagnosticar: ¿hay `join()`? ¿la función va sin paréntesis? ¿el hilo es daemon sin quererlo?"

---

## ⚡ Laboratorio de Tortura: la sala de descargas

> **Duración:** 45 minutos
> **Herramienta:** Python 3 (`threading` y `time`, sin instalar nada)

**Escenario:** estás montando el mini-descargador del instituto. Cuatro archivos de 2 segundos cada uno (simulados con `time.sleep(2)`) deben descargarse "en paralelo" con 4 hilos, y el programa debe cronometrar cuánto tarda el lote entero.

**Tareas paso a paso:**

1. Define `descargar(archivo)`: imprime `⬇️ descargando {archivo}`, hace `time.sleep(2)` y al final imprime `✅ {archivo} listo`.
2. Crea 4 hilos con `threading.Thread(target=descargar, args=(nombre,))`, uno por archivo, con `.name = "hilo-1"`… `"hilo-4"`.
3. Lanza todos con `for h in hilos: h.start()`.
4. Espera a todos con `for h in hilos: h.join()`.
5. Cronometra el lote con `time.time()` antes y después: con 4 hilos debe rondar los **2 segundos**, no los 8.

**Fallo intencionado:** en el paso 2, en lugar de `target=descargar`, escribe `target=descargar("foto.png")` — **con paréntesis y argumento**. ¿Qué pasa? La función se ejecuta en el momento de crear el hilo, en el hilo principal y **en serie**: los 4 archivos tardan 8 segundos, las descargas aparecen "ya terminadas" antes de lanzar nada, y los hilos nacen haciendo nada.

> **Pista 1:** `target` recibe una **referencia** a la función, no una llamada. `descargar` sin paréntesis le pasa la función; `descargar("foto.png")` la ejecuta ahí mismo (lo avisamos en el [punto 2](/ApuntesPSP/02-hilos-fundamentos/02-primer-hilo)). Si tus descargas imprimen antes del primer `start()`, ese es el bug.
>
> **Pista 2:** si el lote tarda ~8 segundos en vez de ~2, no hay paralelismo: los `time.sleep(2)` se están sumando porque todo corre en el hilo principal. Un `print(f"Creando {archivo}")` dentro del bucle te delata: los 4 mensajes aparecen juntos y seguidos, sin intercalarse con los `⬇️`.

---

## 🏆 Logros de esta unidad

| Logro | Cómo conseguirlo |
|---|---|
| 🏅 **Primer Hilo** | Crear, lanzar y esperar un hilo con `Thread`, `start()` y `join()` |
| 🏅 **Hilo con Nombre** | Pasar `args`/`kwargs` y nombrar N hilos con `.name = "hilo-" + str(n)` |
| 🏅 **Daemon Tamer** | Explicar y construir un hilo daemon de fondo que muere al salir |
| 🏅 **Timer Whisperer** | Programar un aviso con `threading.Timer` y cancelarlo si hace falta |
| 🏅 **GIL Master** | Explicar el GIL y distinguir tareas CPU-bound de I/O-bound |

---

## 🧠 Atrévete a Pensar

1. ¿Por qué los hilos comparten memoria y los procesos no?
2. ¿Qué le pasa a tu programa si un hilo **no daemon** entra en un bucle infinito?
3. ¿Cuándo conviene usar `multiprocessing` en lugar de hilos?
4. ¿Por qué la salida de varios hilos nunca tiene orden garantizado?
5. ¿Qué diferencia hay entre un hilo en EJECUTABLE y uno en EJECUCIÓN?

<details>
<summary>💡 Soluciones</summary>

1. Por diseño: el hilo vive **dentro del espacio de direcciones del proceso**, que es memoria compartida por todos sus hilos. Un proceso, en cambio, tiene su propio espacio de direcciones **aislado** que el SO protege.
2. El programa **nunca termina**: un hilo no daemon impide la salida hasta que él acabe. Un `while True` en un no-daemon cuelga el programa para siempre (por eso los loops infinitos van en daemons).
3. Cuando la tarea es **CPU-bound** y necesitas paralelismo real: cada proceso tiene su propio GIL, así que varios procesos sí usan varias CPUs a la vez.
4. Porque el **scheduler del sistema operativo** reparte la CPU como quiere, con sus propias reglas. Nosotros solo controlamos cuándo lanzar (`start()`) y cuándo esperar (`join()`); el orden interno no lo decidimos.
5. **EJECUTABLE** significa "listo pero esperando turno"; **EJECUCIÓN** significa "el scheduler me ha dado la CPU y estoy ejecutando ahora mismo".

</details>

---

## 🧩 Crucigrama de Bits

```
Horizontal:
1. Unidad más pequeña de ejecución dentro de un proceso (5 letras)
3. Método que lanza un hilo (5 letras)
5. Método que hace esperar al programa principal (4 letras)
6. Hilo de fondo que muere al salir el programa (6 letras)
8. Candado de CPython que limita a los hilos (3 letras)

Vertical:
2. Clase de Python con la que se crea un hilo (6 letras)
4. Estado del hilo que espera dormido o por I/O (9 letras)
7. Ejecuta una función una sola vez tras un retardo (5 letras)
```

<details>
<summary>📝 Soluciones</summary>

**Horizontal:** 1. HILO, 3. START, 5. JOIN, 6. DAEMON, 8. GIL
**Vertical:** 2. THREAD, 4. BLOQUEADO, 7. TIMER

</details>

---

## 💬 Entrevista de trabajo

1. **"¿Qué es un hilo y en qué se diferencia de un proceso?"**
2. **"¿Cómo creas y lanzas varios hilos en Python con argumentos y nombres?"**
3. **"¿Qué es un hilo daemon? ¿Cuándo lo usarías?"**
4. **"¿Qué es el GIL y cómo afecta al rendimiento de tus hilos?"**
5. **"¿Cómo sabes si un hilo ha terminado y cómo esperas a varios hilos a la vez?"**

> 💡 **Cómo encararlas:** la 1 y la 4 son las "preguntas reina". Para la 1, compara memoria, coste de creación, comunicación y aislamiento (la tabla del [punto 1](/ApuntesPSP/02-hilos-fundamentos/01-de-proceso-a-hilo)) y remata con la moraleja del [ring](/ApuntesPSP/02-hilos-fundamentos/08-hilos-en-la-practica): hilos para I/O y servicios ligeros, procesos para aislamiento y CPU. Para la 4, recorre el [punto 6](/ApuntesPSP/02-hilos-fundamentos/06-gil): qué es el GIL, por qué los hilos no aceleran CPU-bound, por qué sí I/O-bound, y cuándo toca `multiprocessing`. Si sabes contarlo fluido, ya eres medio programador concurrente.

---

## 🤷 No hay preguntas tontas

> ❓ **¿Un hilo puede crear otro hilo?**

Sí. Un hilo puede lanzar otros hilos sin problema.

> ❓ **¿Cuántos hilos puedo crear?**

Hay límite práctico. En Windows, unos pocos miles. Cada hilo consume ~1MB de memoria virtual por su pila.

> ❓ **¿Puedo matar un hilo desde fuera?**

No limpiamente. No hay `hilo.kill()`. La forma correcta es usar una variable bandera que el hilo compruebe periódicamente.

> ❓ **¿Qué pasa si no llamo a `join()`?**

El hilo se ejecuta igual. Pero el programa principal no espera. Si es no-daemon, el programa no terminará hasta que el hilo termine.

> ❓ **¿`sleep(0)` sirve para algo?**

Sí, cede la CPU voluntariamente para que otro hilo pueda ejecutar. Es una "buena práctica" en hilos cooperativos.

> ❓ **¿Los hilos tienen prioridad?**

En Python, no hay prioridades nativas. El scheduler del SO decide. Puedes simular prioridades con lógica condicional, pero no es real.

---

## 🎬 Post-Créditos

> *El hilo de Ana recorre sus tres paradas. El de Bob, más ligero, llega antes a su destino.*

*El reloj daemon imprime la hora en segundo plano hasta que el programa decide apagarse.*

*El GIL vigila que ningún hilo pise a otro mientras CPython respira.*

*Los hilos comparten memoria, y compartir sin ponerse de acuerdo es peligroso.*

**PRÓXIMAMENTE EN U03:** *Dos hilos tocando la misma variable a la vez es una carrera. Si no se ponen de acuerdo, los datos se corrompen. Necesitan locks, semáforos y barreras: sincronización entre hilos.*

---

## ✅ Criterios de evaluación cubiertos (RA2)

**RA2 — Hilos (parcial): estructura, creación, esperas, daemon y GIL.**

| CE | Criterio | Cubierto |
|---|---|---|
| RA2a | Identifica la estructura de un hilo | ✅ Punto 1 + Punto 7 |
| RA2b | Crea y lanza hilos con threading | ✅ Puntos 2-3 + ⚡ Laboratorio de Tortura |
| RA2e | Implementa esperas con join() y sleep() | ✅ Puntos 2-4 + ⚡ Laboratorio de Tortura |
| RA2f | Gestiona hilos daemon | ✅ Punto 4 + ⚡ Laboratorio de Tortura |
| RA2h | Conoce el GIL y sus limitaciones | ✅ Punto 6 + Punto 8 |

> Los criterios RA2c (Lock), RA2d (semáforos) y RA2g (condiciones de carrera) se cubren en el **TEMA 03 — Sincronización entre Hilos**.

---

📚 [Volver al índice de la unidad](/ApuntesPSP/02-hilos-fundamentos) · **Anterior:** [08 · Hilos en la práctica](/ApuntesPSP/02-hilos-fundamentos/08-hilos-en-la-practica) · **Siguiente:** **[U03 · Sincronización entre Hilos](/ApuntesPSP/03-sincronizacion-entre-hilos)**