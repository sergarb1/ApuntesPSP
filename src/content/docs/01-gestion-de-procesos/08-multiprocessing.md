---
title: 08 — Procesos nativos con multiprocessing
description: Clona tu propio programa Python y ejecútalo en varios núcleos 🔁
---

<p><small>Clona tu propio programa Python y ejecútalo en varios núcleos 🔁</small></p>

> 🗺️ **Estás en:** 🚀 **UD 2 · Gestión de procesos** → 08 · Procesos nativos con multiprocessing

---

## 📬 La idea en una frase

> Mientras que `subprocess` sirve para lanzar programas **externos** (la calculadora o un comando del sistema), `multiprocessing` te permite **clonar tu propio programa Python** para ejecutar varias de tus funciones al mismo tiempo en distintos núcleos del procesador.

Hasta ahora has visto cómo abrir aplicaciones de terceros. Pero, ¿qué pasa si quieres que tu propio servidor atienda a cinco clientes a la vez? No puedes usar `subprocess.Popen(["python", "mi_script.py"])` de forma elegante para cada tarea interna. Ahí entra la librería estándar `multiprocessing`.

---

## ⚖️ subprocess vs multiprocessing

| Característica | `subprocess` | `multiprocessing` |
|---|---|---|
| ¿Qué lanza? | Ejecutables externos (`ping`, `notepad.exe`, `ls`) | Funciones de tu propio código Python |
| Paso de datos | Difícil: a través de tuberías de texto (`stdin`/`stdout`) | Fácil: pasas variables y objetos como argumentos a la función |
| Uso típico | Automatización del sistema operativo y scripts de bash | Programación concurrente, servidores y cálculos matemáticos pesados |

Es el mismo criterio que usaste para distinguir los conceptos del [punto 3](/ApuntesPSP/01-gestion-de-procesos/03-paralela-vs-distribuida): `subprocess` **abre otros programas**; `multiprocessing` **paraleliza tu propio código** repartiendo funciones entre núcleos reales.

---

## 🚀 Lanzando funciones: Process, start() y join()

Para crear un proceso interno, utilizas la clase `Process`. Le indicas qué función (`target`) debe ejecutar y qué argumentos (`args`) necesita:

```python
import multiprocessing
import os
import time

def trabajador(nombre, repeticiones):
    print(f"[{os.getpid()}] Hola, soy el trabajador {nombre}")
    time.sleep(repeticiones)
    print(f"[{os.getpid()}] El trabajador {nombre} ha terminado")

# IMPORTANTE EN WINDOWS: siempre debes proteger la creación de procesos
if __name__ == '__main__':
    print(f"[{os.getpid()}] Soy el proceso PADRE")

    # 1. Instanciar los procesos
    p1 = multiprocessing.Process(target=trabajador, args=("Alice", 2))
    p2 = multiprocessing.Process(target=trabajador, args=("Bob", 1))

    # 2. Arrancarlos (pasan al estado LISTO/EJECUCIÓN)
    p1.start()
    p2.start()

    # 3. Esperar a que terminen (equivalente a wait() en subprocess)
    p1.join()
    p2.join()

    print(f"[{os.getpid()}] Todos los trabajadores han finalizado")
```

- `target`: el nombre de la función (sin paréntesis, porque no quieres ejecutarla ahora, sino pasársela al proceso).
- `args`: una tupla con los argumentos. Si solo pasas un argumento, recuerda poner una coma al final: `args=("Alice",)`.
- `start()`: lanza el proceso al sistema operativo.
- `join()`: bloquea al proceso padre hasta que ese hijo termine (lo viste con `wait()` en [Popen](/ApuntesPSP/01-gestion-de-procesos/05-subprocess-popen)).

> ⚠️ El bloque `if __name__ == '__main__':` no es decoración: en Windows no existe `fork` y cada proceso hijo **vuelve a importar el script desde el principio**. Sin esa protección, los hijos crearían más hijos en un bucle infinito. En Linux, con `fork`, casi nunca lo notas… pero escríbelo siempre: te ahorra un susto al cambiar de sistema.

---

## 🧱 El muro del aislamiento (la burbuja de memoria)

Recuerda la teoría del [punto 1](/ApuntesPSP/01-gestion-de-procesos/01-que-es-un-proceso): cada proceso vive en su propia burbuja aislada. Si creas un proceso nuevo a partir de tu código, el sistema operativo hace un **clon de toda la memoria RAM** en ese instante. Lo que modifique el hijo, no lo ve el padre.

Observa esta trampa didáctica:

```python
import multiprocessing

# Variable global
puntuacion = 10

def sumar_puntos():
    global puntuacion
    puntuacion += 5
    print(f"Hijo: La puntuación es {puntuacion}")

if __name__ == '__main__':
    p1 = multiprocessing.Process(target=sumar_puntos)
    p1.start()
    p1.join()

    print(f"Padre: La puntuación es {puntuacion}")
```

**Salida:**

```
Hijo: La puntuación es 15
Padre: La puntuación es 10
```

¿Qué ha pasado? Al hacer `start()`, el hijo clonó la variable `puntuacion = 10` en su propia RAM. El hijo suma 5 y **su clon** vale 15. Cuando el hijo muere, su burbuja de memoria se destruye. El proceso padre imprime su propia variable original, que nunca fue modificada: **los procesos no comparten variables globales**.

---

## 🤝 Rompiendo el muro con Manager

Si quieres que un proceso servidor actualice un diccionario de usuarios y otro proceso pueda leerlo, necesitas **comunicación entre procesos (IPC)** estructurada. Python nos ofrece `multiprocessing.Manager()`.

El Manager crea un proceso servidor invisible que gestiona la memoria y permite que los demás procesos accedan a diccionarios o listas compartidas (conocidos como **proxies**):

```python
import multiprocessing

def registrar_usuario(diccionario_compartido, nombre, edad):
    # Esto SÍ modifica la memoria que ven todos
    diccionario_compartido[nombre] = edad
    print(f"Proceso hijo registró a {nombre}")

if __name__ == '__main__':
    # Creamos el gestor de memoria compartida
    with multiprocessing.Manager() as manager:
        # manager.dict() crea un diccionario especial que cruza la burbuja
        buzones = manager.dict()

        p1 = multiprocessing.Process(target=registrar_usuario, args=(buzones, "Alice", 25))
        p2 = multiprocessing.Process(target=registrar_usuario, args=(buzones, "Bob", 30))

        p1.start()
        p2.start()
        p1.join()
        p2.join()

        # El padre SÍ puede ver los cambios
        print(f"Diccionario final en el padre: {buzones}")
```

El `manager.dict()` no es un dict normal: es un **proxy** que traduce cada lectura y escritura en mensajes al proceso servidor del Manager. Cuesta más que un dict de toda la vida, pero es la forma limpia de compartir estado entre burbujas.

---

## 🔒 Sincronización con Lock (condiciones de carrera)

Compartir memoria trae un problema crítico: ¿qué pasa si dos procesos intentan modificar el mismo buzón a la vez? Los datos pueden sobrescribirse y corromperse. A esto se le llama **condición de carrera** (*race condition*): el mismo nombre y el mismo fallo que viste con los hilos, porque la lógica es idéntica.

Para solucionarlo, existe el candado: `multiprocessing.Lock`. Es un "testigo" que solo puede tener un proceso a la vez:

1. El proceso pide el candado (`lock.acquire()`).
2. Modifica la variable compartida (esta zona protegida se llama **sección crítica**).
3. Suelta el candado (`lock.release()`) para que pase el siguiente.

> 💡 **Truco:** en Python puedes usar el bloque `with lock:` para que el `acquire` y el `release` se hagan automáticamente, igual que con los hilos.

```python
import multiprocessing
import time

def incrementar_contador(contador_compartido, candado):
    for _ in range(100):
        # Protegemos la sección crítica. Si otro proceso tiene el Lock,
        # este proceso se queda bloqueado esperando.
        with candado:
            # Sección crítica: modificar la variable compartida
            valor_actual = contador_compartido.value
            time.sleep(0.001)  # Simulamos que el cálculo tarda
            contador_compartido.value = valor_actual + 1

if __name__ == '__main__':
    # Variable numérica compartida (empieza en 0)
    contador = multiprocessing.Value('i', 0)
    # Creamos un candado para organizar a los trabajadores
    candado = multiprocessing.Lock()

    procesos = []
    # Lanzamos 5 procesos
    for i in range(5):
        # Hay que pasarles el candado como parámetro
        p = multiprocessing.Process(target=incrementar_contador, args=(contador, candado))
        procesos.append(p)
        p.start()

    for p in procesos:
        p.join()

    print(f"Valor final del contador: {contador.value}")  # Siempre será 500
```

Si ejecutas ese mismo código **sin** el Lock, verás que el resultado final es impredecible (por ejemplo, 143, 290…), porque los procesos leen y escriben a la vez, machacando el trabajo del anterior. Todo esto lo desmenuzarás a fondo en la [UD 4 · Sincronización](/ApuntesPSP/03-sincronizacion), donde los mismos patrones aparecen con hilos.

---

## 🏋️ Reto avanzado (no evaluable)

> ⭐ Este ejercicio **no entra en la evaluación**: es para quien quiera estirarse más allá del examen. Intenta resolverlo por tu cuenta antes de mirar la solución.

### El cribo de primos en paralelo

Quieres contar cuántos números primos hay entre 1 y 2.000.000. En serie es un buen paseo de espera; en paralelo, una carrera de relevos.

**Fases del reto:**

1. Escribe `es_primo(n)` en serie y cronometra el recuento completo con `time.time()`.
2. Reparte el rango entre **4 procesos** con `multiprocessing.Pool` y `pool.map()`. Compara el tiempo con el de la serie.
3. Cambia el enfoque: ahora cada proceso hijo no devuelve una cuenta, sino la **lista completa** de primos que le tocan; el padre los concatena y los ordena con `sorted()`. ¿Cuánto pesa ahora el paso de datos entre procesos?
4. **Extra:** usa `pool.imap_unordered()` y muestra los parciales según llegan, sin esperar al orden del mapa. ¿En qué se diferencia de `map()`?

> **Pista 1:** `Pool(4).map(es_primo, rango)` devuelve una lista de `True`/`False` del mismo tamaño que el rango: cuenta los `True` con `sum(...)` al final.
>
> **Pista 2:** para repartir rangos enteros, divide el total en 4 bloques con paso 4: `[range(i, límite, 4) for i in range(4)]`, y lanza `pool.map(contar_rango, bloques)`.
>
> **Pista 3:** `imap_unordered` es un generador: recórrelo con un bucle `for` e imprime a medida que llegan los resultados; `map` espera a tener la lista entera.

<details>
<summary>🔄 Ver solución</summary>

```python
import multiprocessing
import time

def es_primo(n):
    if n < 2:
        return False
    for d in range(2, int(n ** 0.5) + 1):
        if n % d == 0:
            return False
    return True

def contar_rango(rango):
    return sum(es_primo(n) for n in rango)

if __name__ == "__main__":
    límite = 2_000_000
    bloques = [range(i, límite, 4) for i in range(4)]

    inicio = time.time()
    total_serial = contar_rango(range(1, límite))
    print(f"Serie: {total_serial} primos en {time.time() - inicio:.2f}s")

    inicio = time.time()
    with multiprocessing.Pool(4) as pool:
        parciales = pool.map(contar_rango, bloques)
    print(f"Paralelo: {sum(parciales)} primos en {time.time() - inicio:.2f}s")
```

En un portátil de 4 núcleos: la serie tarda alrededor de 2 segundos y la versión paralela unos 0,6 segundos. Tus números variarán (virtualización, carga del sistema…), pero el mensaje es el mismo: **4 procesos haciendo el trabajo de 4 CPUs de verdad**. El GIL no está por medio porque cada proceso lleva su propio intérprete (lo verás en la [UD 3](/ApuntesPSP/02-hilos-y-concurrencia)).

Para la fase 3, el truco es que el hijo devuelva una lista en lugar de un entero: `pool.map(primos_de, bloques)` devuelve una lista de listas, y el padre las aplana con `sorted(p for bloque in resultado for p in bloque)`. El cruce de la burbuja cuesta: mover 150.000 primos entre procesos es más caro que mover 4 números.

</details>

---

## 🧠 Mini-chequeo

1. ¿Por qué debes usar `if __name__ == '__main__':` al crear procesos en Windows?
2. Si un proceso hijo modifica una lista global estándar de tu script, ¿el proceso padre verá la lista modificada?
3. ¿Qué hace `manager.dict()`?
4. ¿Para qué sirve un `Lock` en programación concurrente?

<details>
<summary>🔄 Respuestas</summary>

1. Porque Windows no tiene el sistema `fork` de Linux: si no proteges el código principal, los procesos hijos vuelven a importar todo el script desde el principio, creando un bucle infinito de procesos hasta colgar la máquina.
2. No, debido al aislamiento de memoria: el hijo modifica su propio clon en su burbuja de RAM.
3. Crea un diccionario "proxy" gestionado por un proceso servidor que permite compartir datos dinámicos entre múltiples procesos de forma segura.
4. Para evitar condiciones de carrera. Actúa como un semáforo que garantiza que solo un proceso a la vez pueda entrar en una "sección crítica" y modificar la memoria compartida.

</details>

---

## ✅ Resumen en 3 frases

- `multiprocessing` te permite crear procesos (`Process`), arrancarlos (`start()`) y esperarlos (`join()`) ejecutando funciones de tu propio código.
- Las variables globales no se comparten entre procesos porque el sistema operativo clona la RAM; necesitas `multiprocessing.Manager()` para pasar datos de un proceso a otro.
- Cuando varios procesos modifican los mismos datos compartidos, debes proteger el código conflictivo con un `Lock` para evitar sobreescrituras.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| `Process(target=f)` | Clase que prepara la ejecución paralela de una función |
| `.start()` | Envía el proceso al planificador del sistema operativo (lo arranca) |
| `.join()` | Detiene al proceso padre hasta que el proceso hijo finalice |
| `Manager` | Utilidad del sistema para crear estructuras de memoria compartida (IPC) |
| `Lock` | Candado de exclusión mutua para proteger secciones críticas de código |
| Condición de carrera | Fallo que ocurre cuando varios procesos modifican un dato a la vez sin sincronizarse |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/01-gestion-de-procesos) · **Anterior:** [07 · Compatibilidad Windows / Linux](/ApuntesPSP/01-gestion-de-procesos/07-compatibilidad-windows-linux) · **Siguiente:** [09 · Procesos en la práctica](/ApuntesPSP/01-gestion-de-procesos/09-procesos-en-la-practica)
